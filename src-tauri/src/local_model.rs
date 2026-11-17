//! A pinned model downloads during setup; all audio inference stays local.
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    fs::File,
    io::{Read, Seek, SeekFrom, Write},
    path::PathBuf,
    sync::{Arc, Mutex, OnceLock},
};
use tauri::{Emitter, Manager};
use whisper_rs::{WhisperContext, WhisperContextParameters};

#[derive(Clone, Serialize, Deserialize)]
pub struct LocalModelConfig {
    pub path: String,
    pub sha256: String,
    pub model_id: String,
}
#[derive(Default)]
struct ModelSlot {
    config: Option<LocalModelConfig>,
    context: Option<Arc<WhisperContext>>,
}
static MODEL: OnceLock<Mutex<ModelSlot>> = OnceLock::new();
fn slot() -> &'static Mutex<ModelSlot> {
    MODEL.get_or_init(Default::default)
}
fn config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    Ok(app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("local-model.json"))
}
pub fn initialize(app: &tauri::AppHandle) -> Result<(), String> {
    let path = config_path(app)?;
    match std::fs::read(path) {
        Ok(bytes) => {
            slot().lock().map_err(|e| e.to_string())?.config =
                Some(serde_json::from_slice(&bytes).map_err(|e| e.to_string())?)
        }
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
        Err(e) => return Err(e.to_string()),
    }
    Ok(())
}
fn validate_and_load(
    path: &str,
    expected: &str,
) -> Result<(LocalModelConfig, Arc<WhisperContext>), String> {
    if expected.len() != 64 || !expected.bytes().all(|b| b.is_ascii_hexdigit()) {
        return Err("Enter the trusted SHA256 checksum (64 hexadecimal characters)".into());
    }
    let path = std::fs::canonicalize(path).map_err(|e| e.to_string())?;
    if !std::fs::metadata(&path)
        .map_err(|e| e.to_string())?
        .is_file()
    {
        return Err("Select a regular GGML model file".into());
    }
    let mut file = File::open(&path).map_err(|e| e.to_string())?;
    let size = file.metadata().map_err(|e| e.to_string())?.len();
    if !(100_000_000..=4_000_000_000).contains(&size) {
        return Err("Expected a large-v3 or large-v3-turbo GGML model (100 MB–4 GB)".into());
    }
    let mut magic = [0u8; 4];
    file.read_exact(&mut magic).map_err(|e| e.to_string())?;
    if magic != 0x67676d6cu32.to_le_bytes() {
        return Err("The model must use whisper.cpp GGML format".into());
    }
    file.seek(SeekFrom::Start(0)).map_err(|e| e.to_string())?;
    let mut hash = Sha256::new();
    let mut buffer = [0u8; 65536];
    loop {
        let count = file.read(&mut buffer).map_err(|e| e.to_string())?;
        if count == 0 {
            break;
        }
        hash.update(&buffer[..count]);
    }
    let actual = format!("{:x}", hash.finalize());
    if !actual.eq_ignore_ascii_case(expected) {
        return Err("Model SHA256 checksum does not match".into());
    }
    let path = path
        .to_str()
        .ok_or("The model path is not valid UTF-8")?
        .to_owned();
    let context = WhisperContext::new_with_params(&path, WhisperContextParameters::default())
        .map_err(|e| e.to_string())?;
    if context.model_n_mels() != 128
        || context.model_n_audio_layer() != 32
        || !matches!(context.model_n_text_layer(), 4 | 32)
    {
        return Err("Only multilingual large-v3 and large-v3-turbo models are supported".into());
    }
    let model_id = if context.model_n_text_layer() == 4 {
        "large-v3-turbo"
    } else {
        "large-v3"
    }
    .to_string();
    Ok((
        LocalModelConfig {
            path,
            sha256: actual,
            model_id,
        },
        Arc::new(context),
    ))
}
// The same mutex serializes model replacement and inference.
pub static INFERENCE: tokio::sync::Mutex<()> = tokio::sync::Mutex::const_new(());
#[tauri::command]
pub fn get_local_model_config() -> Result<Option<LocalModelConfig>, String> {
    Ok(slot()
        .lock()
        .map_err(|e| e.to_string())?
        .config
        .clone()
        .filter(|config| std::path::Path::new(&config.path).is_file()))
}
#[tauri::command]
pub async fn configure_local_model(
    app: tauri::AppHandle,
    path: String,
    sha256: String,
) -> Result<LocalModelConfig, String> {
    let _guard = INFERENCE
        .try_lock()
        .map_err(|_| "A recording or model operation is active")?;
    let (config, context) =
        tauri::async_runtime::spawn_blocking(move || validate_and_load(&path, &sha256))
            .await
            .map_err(|e| e.to_string())??;
    save_model(&app, config, context)
}

fn save_model(
    app: &tauri::AppHandle,
    config: LocalModelConfig,
    context: Arc<WhisperContext>,
) -> Result<LocalModelConfig, String> {
    let target = config_path(app)?;
    let temp = target.with_extension("json.tmp");
    std::fs::create_dir_all(target.parent().ok_or("No model directory")?)
        .map_err(|e| e.to_string())?;
    std::fs::write(
        &temp,
        serde_json::to_vec(&config).map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;
    std::fs::rename(temp, target).map_err(|e| e.to_string())?;
    *slot().lock().map_err(|e| e.to_string())? = ModelSlot {
        config: Some(config.clone()),
        context: Some(context),
    };
    Ok(config)
}

struct DownloadModel {
    url: &'static str,
    sha256: &'static str,
    bytes: u64,
    file: &'static str,
}

fn download_model(model_id: &str) -> Result<DownloadModel, String> {
    match model_id {
        "large-v3-turbo" => Ok(DownloadModel {
            url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/5359861c739e955e79d9a303bcbc70fb988958b1/ggml-large-v3-turbo-q5_0.bin",
            sha256: "394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2",
            bytes: 574_041_195,
            file: "ggml-large-v3-turbo-q5_0.bin",
        }),
        "large-v3" => Ok(DownloadModel {
            url: "https://huggingface.co/ggerganov/whisper.cpp/resolve/5359861c739e955e79d9a303bcbc70fb988958b1/ggml-large-v3-q5_0.bin",
            sha256: "d75795ecff3f83b5faa89d1900604ad8c780abd5739fae406de19f23ecd98ad1",
            bytes: 1_081_140_203,
            file: "ggml-large-v3-q5_0.bin",
        }),
        _ => Err("Unsupported local model".into()),
    }
}

#[derive(Clone, Serialize)]
struct DownloadProgress {
    received: u64,
    total: u64,
    phase: &'static str,
}

struct PendingDownload(PathBuf);
impl Drop for PendingDownload {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.0);
    }
}

async fn write_download(
    mut response: reqwest::Response,
    path: &std::path::Path,
    expected: u64,
    mut progress: impl FnMut(u64),
) -> Result<(), String> {
    response
        .error_for_status_ref()
        .map_err(|e| format!("Model download failed: {e}"))?;
    if response
        .content_length()
        .is_some_and(|size| size != expected)
    {
        return Err("Model download has an unexpected file size".into());
    }
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(path)
        .map_err(|e| format!("Cannot create the model file: {e}"))?;
    let mut received = 0u64;
    while let Some(chunk) = response
        .chunk()
        .await
        .map_err(|e| format!("Model download interrupted: {e}. Try again."))?
    {
        received = received
            .checked_add(chunk.len() as u64)
            .ok_or("Model download is too large")?;
        if received > expected {
            return Err("Model download exceeds the expected file size".into());
        }
        file.write_all(&chunk)
            .map_err(|e| format!("Cannot write the model file: {e}"))?;
        progress(received);
    }
    if received != expected {
        return Err("Model download is incomplete. Try again.".into());
    }
    file.sync_all().map_err(|e| e.to_string())?;
    Ok(())
}

/// Network access is limited to an explicit request for this pinned model.
#[tauri::command]
pub async fn download_local_model(
    app: tauri::AppHandle,
    window: tauri::Window,
    model_id: String,
) -> Result<LocalModelConfig, String> {
    if window.label() != "main" {
        return Err("Use the main window to download the model".into());
    }
    let _guard = INFERENCE
        .try_lock()
        .map_err(|_| "A recording or model operation is active")?;
    let model = download_model(&model_id)?;
    let directory = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("models");
    std::fs::create_dir_all(&directory).map_err(|e| e.to_string())?;
    let target = directory.join(model.file);
    if target.is_file() {
        let existing = target.to_str().ok_or("Invalid model path")?.to_owned();
        if let Ok(Ok((config, context))) =
            tauri::async_runtime::spawn_blocking(move || validate_and_load(&existing, model.sha256))
                .await
        {
            return save_model(&app, config, context);
        }
    }
    // A unique destination preserves any previously configured model on failure.
    let target = if target.exists() || target.with_extension("bin.part").exists() {
        directory.join(format!("{}-{}", uuid::Uuid::new_v4(), model.file))
    } else {
        target
    };
    let partial = PendingDownload(target.with_extension("bin.part"));
    let client = reqwest::Client::builder()
        .https_only(true)
        .connect_timeout(std::time::Duration::from_secs(15))
        .read_timeout(std::time::Duration::from_secs(30))
        .timeout(std::time::Duration::from_secs(1800))
        .redirect(reqwest::redirect::Policy::limited(10))
        .build()
        .map_err(|e| e.to_string())?;
    let _ = app.emit(
        "local-model:download-progress",
        DownloadProgress {
            received: 0,
            total: model.bytes,
            phase: "downloading",
        },
    );
    let response = client.get(model.url).send().await.map_err(|e| {
        format!("Cannot download the model. Check your internet connection and try again: {e}")
    })?;
    let mut last_percent = 0;
    write_download(response, &partial.0, model.bytes, |received| {
        let percent = received * 100 / model.bytes;
        if percent != last_percent {
            last_percent = percent;
            let _ = app.emit(
                "local-model:download-progress",
                DownloadProgress {
                    received,
                    total: model.bytes,
                    phase: "downloading",
                },
            );
        }
    })
    .await?;
    let _ = app.emit(
        "local-model:download-progress",
        DownloadProgress {
            received: model.bytes,
            total: model.bytes,
            phase: "verifying",
        },
    );
    let input = partial.0.to_str().ok_or("Invalid model path")?.to_owned();
    let (mut config, context) =
        tauri::async_runtime::spawn_blocking(move || validate_and_load(&input, model.sha256))
            .await
            .map_err(|e| e.to_string())??;
    std::fs::rename(&partial.0, &target).map_err(|e| e.to_string())?;
    config.path = target.to_str().ok_or("Invalid model path")?.to_owned();
    save_model(&app, config, context)
}

pub fn context() -> Result<Arc<WhisperContext>, String> {
    let mut model = slot().lock().map_err(|e| e.to_string())?;
    if let Some(context) = &model.context {
        return Ok(context.clone());
    }
    let config = model
        .config
        .as_ref()
        .ok_or("Import a local Whisper model first")?;
    let (_, context) = validate_and_load(&config.path, &config.sha256)?;
    model.context = Some(context.clone());
    Ok(context)
}

#[cfg(test)]
mod tests {
    use super::*;
    fn response(bytes: Vec<u8>, declared_size: u64) -> reqwest::Response {
        http::Response::builder()
            .status(200)
            .header("content-length", declared_size)
            .body(bytes)
            .unwrap()
            .into()
    }
    fn pending_file() -> PendingDownload {
        PendingDownload(
            std::env::temp_dir().join(format!("model-download-{}.part", uuid::Uuid::new_v4())),
        )
    }
    #[tokio::test]
    async fn model_download_writes_exact_size_and_reports_progress() {
        let file = pending_file();
        let mut received = 0;
        write_download(response(vec![1, 2, 3], 3), &file.0, 3, |n| received = n)
            .await
            .unwrap();
        assert_eq!(std::fs::read(&file.0).unwrap(), vec![1, 2, 3]);
        assert_eq!(received, 3);
    }
    #[tokio::test]
    async fn model_download_rejects_short_and_oversized_bodies_and_cleans_up() {
        for bytes in [vec![1], vec![1, 2, 3, 4]] {
            let file = pending_file();
            let path = file.0.clone();
            assert!(write_download(response(bytes, 3), &file.0, 3, |_| {})
                .await
                .is_err());
            drop(file);
            assert!(!path.exists());
        }
    }
    #[tokio::test]
    async fn model_download_rejects_http_failure_without_creating_a_file() {
        let file = pending_file();
        let response = http::Response::builder()
            .status(503)
            .body(Vec::<u8>::new())
            .unwrap()
            .into();
        assert!(write_download(response, &file.0, 3, |_| {}).await.is_err());
        assert!(!file.0.exists());
    }
    #[test]
    fn model_download_rejects_checksum_mismatch_before_native_load() {
        let file = pending_file();
        let mut output = File::create(&file.0).unwrap();
        output.write_all(&0x67676d6cu32.to_le_bytes()).unwrap();
        output.set_len(100_000_000).unwrap();
        drop(output);
        let error = validate_and_load(file.0.to_str().unwrap(), &"0".repeat(64))
            .err()
            .unwrap();
        assert!(error.contains("checksum does not match"), "{error}");
    }
    #[test]
    fn model_download_is_pinned_to_the_reviewed_artifact() {
        let source: serde_json::Value =
            serde_json::from_str(include_str!("../../models/source.json")).unwrap();
        let model = download_model("large-v3-turbo").unwrap();
        assert_eq!(source["url"], model.url);
        assert_eq!(source["sha256"], model.sha256);
        assert_eq!(source["bytes"], model.bytes);
    }
    #[test]
    fn model_download_selection_is_allowlisted_and_uses_separate_files() {
        let turbo = download_model("large-v3-turbo").unwrap();
        let large = download_model("large-v3").unwrap();
        assert_ne!(turbo.file, large.file);
        assert_eq!(large.bytes, 1_081_140_203);
        assert_eq!(
            large.sha256,
            "d75795ecff3f83b5faa89d1900604ad8c780abd5739fae406de19f23ecd98ad1"
        );
        assert!(large.url.ends_with(large.file));
        assert!(download_model("https://example.com/model.bin").is_err());
    }
    #[test]
    fn rejects_untrusted_checksum_before_opening_any_file() {
        assert!(validate_and_load("/does-not-exist", "")
            .err()
            .unwrap()
            .contains("SHA256"));
        assert!(validate_and_load("/does-not-exist", &"z".repeat(64))
            .err()
            .unwrap()
            .contains("SHA256"));
    }
    #[test]
    fn missing_model_is_a_recoverable_error() {
        assert!(validate_and_load("/does-not-exist", &"0".repeat(64)).is_err());
    }
}
