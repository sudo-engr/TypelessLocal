use super::{local_audio::LocalAudio, SttConfig, SttProvider, TranscriptEvent};
use crate::{error::AppError, local_model};
use async_trait::async_trait;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};

pub const PROVIDER: &str = "local-whisper";
pub struct LocalWhisperProvider {
    audio: LocalAudio,
    context: Option<Arc<WhisperContext>>,
    cancelled: Arc<AtomicBool>,
    lease: Option<tokio::sync::MutexGuard<'static, ()>>,
}
impl LocalWhisperProvider {
    pub fn new() -> Self {
        Self {
            audio: LocalAudio::default(),
            context: None,
            cancelled: Arc::new(AtomicBool::new(false)),
            lease: None,
        }
    }
}
impl Drop for LocalWhisperProvider {
    fn drop(&mut self) {
        self.cancelled.store(true, Ordering::SeqCst);
    }
}
// The pointer refers to an Arc held by the blocking worker for the full call.
unsafe extern "C" fn aborted(data: *mut std::ffi::c_void) -> bool {
    (*(data as *const AtomicBool)).load(Ordering::SeqCst)
}
#[async_trait]
impl SttProvider for LocalWhisperProvider {
    async fn connect(&mut self, config: &SttConfig) -> Result<(), AppError> {
        if config.sample_rate != 16000 {
            return Err(AppError::Config(
                "Local Whisper requires 16 kHz PCM16 mono".into(),
            ));
        }
        self.lease = Some(
            local_model::INFERENCE
                .try_lock()
                .map_err(|_| AppError::Config("Local Whisper is busy".into()))?,
        );
        self.context = Some(
            tauri::async_runtime::spawn_blocking(local_model::context)
                .await
                .map_err(|e| AppError::Config(e.to_string()))?
                .map_err(AppError::Config)?,
        );
        self.audio = LocalAudio::default();
        Ok(())
    }
    async fn send_audio(&mut self, chunk: &[u8]) -> Result<(), AppError> {
        self.audio.push(chunk)
    }
    async fn recv_transcript(&mut self) -> Result<Option<TranscriptEvent>, AppError> {
        std::future::pending().await
    }
    async fn disconnect(&mut self) -> Result<Option<String>, AppError> {
        let audio = self.audio.finish()?;
        // shortcut: energy gate rejects silence, use trained VAD if noise tests fail.
        if audio.len() < 1600
            || audio.iter().map(|x| x * x).sum::<f32>() / (audio.len().max(1) as f32) < 0.00001
        {
            return Ok(None);
        }
        let context = self
            .context
            .take()
            .ok_or_else(|| AppError::Config("Model is not ready".into()))?;
        let cancelled = self.cancelled.clone();
        let lease = self.lease.take();
        tauri::async_runtime::spawn_blocking(move || {
            let _lease = lease;
            let mut state = context
                .create_state()
                .map_err(|e| AppError::Config(e.to_string()))?;
            let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
            params.set_language(Some("ko"));
            params.set_translate(false);
            params.set_no_context(true);
            params.set_print_special(false);
            params.set_print_progress(false);
            params.set_print_realtime(false);
            params.set_print_timestamps(false);
            unsafe {
                params.set_abort_callback(Some(aborted));
                params
                    .set_abort_callback_user_data(Arc::as_ptr(&cancelled) as *mut std::ffi::c_void);
            }
            state
                .full(params, &audio)
                .map_err(|e| AppError::Config(e.to_string()))?;
            if cancelled.load(Ordering::SeqCst) {
                return Ok(None);
            }
            let text = state
                .as_iter()
                .filter(|s| s.no_speech_probability() < 0.6)
                .map(|s| s.to_string())
                .collect::<String>()
                .trim()
                .to_owned();
            Ok(if text.is_empty() { None } else { Some(text) })
        })
        .await
        .map_err(|e| AppError::Config(e.to_string()))?
    }
    fn recording_limit_override_seconds(&self) -> Option<u32> {
        Some(120)
    }
    fn name(&self) -> &str {
        PROVIDER
    }
}
