pub mod aliyun_qwen3_asr;
pub mod apple_speech;
pub mod assemblyai;
pub mod capabilities;
pub mod cloud;
pub mod config;
pub mod deepgram;
pub mod local_audio;
pub mod local_whisper;
pub mod managed_audio;
pub mod volcengine;
pub mod whisper_compat;

use async_trait::async_trait;
use serde::{Deserialize, Serialize};

use crate::error::AppError;

use whisper_compat::WhisperCompatConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SttConfig {
    pub api_key: String,
    pub language: Option<String>,
    pub smart_format: bool,
    pub sample_rate: u32,
    pub resource_id: Option<String>,
    pub operation_id: Option<String>,
    pub managed_audio: Option<managed_audio::ManagedAudioEncodingConfig>,
    pub provider_region: Option<String>,
}

impl Default for SttConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            language: None,
            smart_format: true,
            sample_rate: 16000,
            resource_id: None,
            operation_id: None,
            managed_audio: None,
            provider_region: None,
        }
    }
}

#[derive(Debug, Clone)]
pub enum TranscriptEvent {
    Partial { text: String },
    Final { text: String, confidence: f32 },
    SpeechStarted,
    SpeechEnded,
    Error { message: String },
}

#[async_trait]
pub trait SttProvider: Send + Sync {
    async fn connect(&mut self, config: &SttConfig) -> Result<(), AppError>;
    async fn send_audio(&mut self, chunk: &[u8]) -> Result<(), AppError>;
    async fn recv_transcript(&mut self) -> Result<Option<TranscriptEvent>, AppError>;
    /// Disconnect and optionally return a final transcript (for file-based providers).
    async fn disconnect(&mut self) -> Result<Option<String>, AppError>;
    fn recording_limit_override_seconds(&self) -> Option<u32> {
        None
    }
    fn recording_limit_override_explanation_key(&self) -> Option<&'static str> {
        None
    }
    fn name(&self) -> &str;
}

pub fn create_provider(
    provider_name: &str,
    _custom_whisper_config: Option<WhisperCompatConfig>,
    _client: Option<reqwest::Client>,
) -> Result<Box<dyn SttProvider>, AppError> {
    if provider_name != local_whisper::PROVIDER {
        return Err(AppError::Config(
            "This build only supports local Whisper".into(),
        ));
    }
    Ok(Box::new(local_whisper::LocalWhisperProvider::new()))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn local_provider_requires_no_network_or_credentials() {
        assert_eq!(
            create_provider("local-whisper", None, None).unwrap().name(),
            "local-whisper"
        );
    }
    #[test]
    fn remote_and_custom_providers_are_rejected() {
        for name in [
            "cloud",
            "openai-whisper",
            "custom-whisper",
            "apple-speech",
            "unknown",
        ] {
            assert!(create_provider(name, None, None).is_err());
        }
    }
}
