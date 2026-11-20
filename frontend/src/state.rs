use crate::bridge::invoke;
use dioxus::prelude::*;
use serde_json::{json, Value};

#[derive(Clone, PartialEq, Default)]
pub struct AppState {
    pub config: Value,
    pub saved_config: Value,
    pub history: Vec<Value>,
    pub dictionary: Vec<Value>,
    pub rules: Vec<Value>,
    pub local_model: Option<Value>,
    pub diagnostics: Value,
    pub model_progress: Value,
    pub pipeline: String,
    pub error: Option<String>,
    pub notice: Option<String>,
    pub volume: f64,
    pub transcript: String,
    pub final_text: String,
    pub hotkey_error: Option<String>,
    pub deadline: Option<Value>,
    pub onboarded: bool,
    pub route: String,
    pub loaded: bool,
    pub busy: bool,
}

// Preserve unknown persisted fields; local-only builds never activate legacy cloud credentials.
pub fn local_config(mut config: Value) -> Value {
    if let Some(config) = config.as_object_mut() {
        config.insert("stt_provider".into(), json!("local-whisper"));
        config.insert("stt_language".into(), json!("ko"));
        config.insert("polish_enabled".into(), json!(false));
        config.insert("translate_enabled".into(), json!(false));
        for field in ["stt_api_key", "stt_custom_api_key", "llm_api_key"] {
            config.insert(field.into(), json!(""));
        }
    }
    config
}

pub async fn refresh(mut state: Signal<AppState>) -> Result<(), String> {
    let config = local_config(invoke("get_config", json!({})).await?);
    let history = invoke("get_history", json!({"limit":200,"offset":0})).await?;
    let dictionary = invoke("get_dictionary", json!({})).await?;
    let rules = invoke("get_correction_rules", json!({})).await?;
    let model = invoke("get_local_model_config", json!({})).await?;
    let mut next = state.write();
    next.config = config.clone();
    next.saved_config = config;
    next.history = history
        .as_array()
        .cloned()
        .ok_or("기록 응답 형식이 잘못되었습니다.")?;
    next.dictionary = dictionary
        .as_array()
        .cloned()
        .ok_or("사전 응답 형식이 잘못되었습니다.")?;
    next.rules = rules
        .as_array()
        .cloned()
        .ok_or("교정 응답 형식이 잘못되었습니다.")?;
    next.local_model = (!model.is_null()).then_some(model);
    Ok(())
}

pub fn reduce_event(state: &mut AppState, event: &Value) {
    let payload = &event["payload"];
    match event["event"].as_str().unwrap_or("") {
        "route" => state.route = payload.as_str().unwrap_or("#/").to_string(),
        "audio:volume" => state.volume = payload.as_f64().unwrap_or(0.0).clamp(0.0, 1.0),
        "stt:partial" => state.transcript = payload.as_str().unwrap_or("").into(),
        "stt:final" => state.final_text = payload.as_str().unwrap_or("").into(),
        "pipeline:state" => {
            let pipeline = payload.as_str().unwrap_or("idle");
            if pipeline == "preparing" {
                state.error = None;
                state.transcript.clear();
                state.final_text.clear();
            }
            if pipeline == "preparing" || pipeline == "idle" {
                state.deadline = None;
            }
            state.pipeline = pipeline.into();
        }
        "pipeline:error" => state.error = Some(error_text(payload)),
        "pipeline:warning" => state.notice = Some(error_text(payload)),
        "recording:deadline" => state.deadline = Some(payload.clone()),
        "recording:deadline-warning" => state.notice = Some("녹음 제한 시간이 곧 끝납니다.".into()),
        "recording:deadline-reached" => {
            state.notice = Some("녹음 제한 시간에 도달하여 전사를 시작합니다.".into())
        }
        "local-model:download-progress" => state.model_progress = payload.clone(),
        "config:patch" => {
            if let (Some(config), Some(patch)) = (state.config.as_object_mut(), payload.as_object())
            {
                config.extend(patch.clone());
            }
            if let (Some(saved), Some(patch)) =
                (state.saved_config.as_object_mut(), payload.as_object())
            {
                saved.extend(patch.clone());
            }
            state.config = local_config(state.config.clone());
            state.saved_config = local_config(state.saved_config.clone());
        }
        "hotkey:registration-failed" => state.hotkey_error = Some(error_text(payload)),
        "hotkey:registration-recovered" => state.hotkey_error = None,
        _ => {}
    }
}

pub fn error_text(value: &Value) -> String {
    value
        .as_str()
        .map(str::to_string)
        .or_else(|| value["message"].as_str().map(str::to_string))
        .or_else(|| value["code"].as_str().map(str::to_string))
        .unwrap_or_else(|| value.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn local_config_preserves_settings_and_strips_credentials() {
        let config = local_config(
            json!({"stt_provider":"cloud","stt_api_key":"secret","unknown":{"x":1},"polish_enabled":true}),
        );
        assert_eq!(config["stt_provider"], "local-whisper");
        assert_eq!(config["unknown"]["x"], 1);
        assert_eq!(config["stt_api_key"], "");
        assert_eq!(config["polish_enabled"], false);
    }
    #[test]
    fn idle_does_not_swallow_pipeline_error() {
        let mut state = AppState::default();
        reduce_event(
            &mut state,
            &json!({"event":"pipeline:error","payload":{"code":"accessibility_required"}}),
        );
        reduce_event(
            &mut state,
            &json!({"event":"pipeline:state","payload":"idle"}),
        );
        assert_eq!(state.error.as_deref(), Some("accessibility_required"));
    }
    #[test]
    fn config_patch_keeps_other_unsaved_changes() {
        let mut state = AppState {
            config: json!({"theme":"dark","hotkey":"old"}),
            saved_config: json!({"theme":"light","hotkey":"old"}),
            ..Default::default()
        };
        reduce_event(
            &mut state,
            &json!({"event":"config:patch","payload":{"hotkey":"new"}}),
        );
        assert_eq!(state.config["theme"], "dark");
        assert_eq!(state.saved_config["theme"], "light");
        assert_eq!(state.saved_config["hotkey"], "new");
    }
}
