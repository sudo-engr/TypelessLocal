//! Settings surfaces for the Dioxus client.
//!
//! The settings document is intentionally kept as a `serde_json::Value`.  The
//! desktop backend adds fields over time and a typed frontend must not discard
//! fields it does not know about when a user saves one setting.

use dioxus::prelude::*;
use serde_json::{json, Map, Value};

use crate::{
    bridge::invoke,
    setup::{Diagnostics, LocalModelPane},
    state::AppState,
    ui::{tr, Icon},
};

const PANES: &[(&str, &str, &str)] = &[
    ("general", "일반", "settings"),
    ("stt", "음성 인식", "mic"),
    ("llm", "AI 다듬기", "sparkles"),
    ("dictionary", "사전", "book-open"),
    ("scenes", "장면", "layout-grid"),
    ("about", "정보", "info"),
];

const SYSTEM_SCENES: &[(&str, &str, &str)] = &[
    (
        "system_email",
        "이메일",
        "이메일 본문을 작성합니다. 필요한 경우 인사말과 자연스러운 문단, 간단한 맺음말을 사용합니다. 명시하지 않았다면 제목은 만들지 않습니다.",
    ),
    (
        "system_work_chat",
        "업무 채팅",
        "짧고 자연스러운 업무 채팅으로 다듬습니다. 인사말과 맺음말은 넣지 않습니다.",
    ),
    (
        "system_personal_chat",
        "개인 채팅",
        "사용자의 말투와 짧은 메시지 흐름을 유지합니다. 업무 문체로 바꾸지 않습니다.",
    ),
    (
        "system_document",
        "문서",
        "일관된 문단으로 정리합니다. 말한 구조에 섹션이나 여러 항목이 있으면 짧은 제목 또는 목록을 사용합니다.",
    ),
    (
        "system_project_management",
        "프로젝트 관리",
        "진행 상황, 장애물, 다음 단계를 말한 경우 간결한 목록으로 정리합니다. 담당자나 기한을 만들지 않습니다.",
    ),
    (
        "system_developer_collaboration",
        "개발 협업",
        "문제, 영향, 제안을 중심으로 간결한 엔지니어링 메모를 작성합니다. 기술 식별자는 그대로 유지합니다.",
    ),
    (
        "system_prompt_or_code",
        "프롬프트 또는 코드",
        "말한 요청을 명확하고 바로 사용할 수 있게 정리합니다. 말하지 않은 요구사항이나 코드를 만들지 않습니다.",
    ),
    (
        "system_support",
        "고객 지원",
        "명확하고 공감하는 답변을 작성합니다. 말하지 않은 정책, 환불, 해결 결과를 추가하지 않습니다.",
    ),
    (
        "system_social",
        "소셜",
        "사용자의 말투를 유지하면서 짧고 읽기 쉬운 게시물로 다듬습니다. 말하지 않은 해시태그나 이모지는 넣지 않습니다.",
    ),
];

fn text(value: &Value, key: &str) -> String {
    value
        .get(key)
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string()
}

fn bool_value(value: &Value, key: &str) -> bool {
    value.get(key).and_then(Value::as_bool).unwrap_or(false)
}

fn import_format_for_name(name: &str) -> &'static str {
    match name
        .rsplit('.')
        .next()
        .unwrap_or_default()
        .to_ascii_lowercase()
        .as_str()
    {
        "csv" => "csv",
        "txt" => "txt",
        _ => "json",
    }
}

fn imported_file(value: Value) -> Result<Option<(Vec<u8>, String)>, String> {
    if value.is_null() {
        return Ok(None);
    }
    let object = value
        .as_object()
        .ok_or_else(|| "파일 선택 결과가 올바르지 않습니다.".to_string())?;
    let name = object
        .get("name")
        .and_then(Value::as_str)
        .unwrap_or("import.txt")
        .to_string();
    let bytes = object
        .get("bytes")
        .and_then(Value::as_array)
        .ok_or_else(|| "파일 내용을 읽지 못했습니다.".to_string())?
        .iter()
        .map(|byte| {
            byte.as_u64()
                .filter(|value| *value <= u8::MAX as u64)
                .map(|value| value as u8)
                .ok_or_else(|| "파일 바이트가 올바르지 않습니다.".to_string())
        })
        .collect::<Result<Vec<_>, _>>()?;
    Ok(Some((bytes, name)))
}

fn family_label(family: &str) -> &'static str {
    match family {
        "email" => "이메일",
        "work_chat" => "업무 채팅",
        "personal_chat" => "개인 채팅",
        "document" => "문서",
        "project_management" => "프로젝트 관리",
        "developer_collaboration" => "개발 협업",
        "prompt_or_code" => "프롬프트 또는 코드",
        "support" => "고객 지원",
        "social" => "소셜",
        _ => "기타",
    }
}

fn system_override_value(overrides: &[Value], id: &str, default_prompt: &str) -> Value {
    overrides
        .iter()
        .find(|value| text(value, "id") == id)
        .cloned()
        .unwrap_or_else(|| json!({"id": id, "prompt_template": default_prompt}))
}

fn string_array(value: &Value, path: &[&str], fallback: &str) -> String {
    let selected = path
        .iter()
        .try_fold(value, |current, key| current.get(*key));
    selected
        .and_then(Value::as_array)
        .map(|items| {
            items
                .iter()
                .filter_map(binding_text)
                .collect::<Vec<_>>()
                .join("\n")
        })
        .filter(|joined| !joined.is_empty())
        .unwrap_or_else(|| fallback.to_string())
}

fn binding_text(value: &Value) -> Option<String> {
    if let Some(value) = value.as_str() {
        return Some(value.to_string());
    }
    let object = value.as_object()?;
    let primary = object.get("primary").and_then(Value::as_str)?;
    let modifiers = object
        .get("modifiers")
        .and_then(Value::as_array)
        .map(|items| items.iter().filter_map(Value::as_str).collect::<Vec<_>>())
        .unwrap_or_default();
    let mut parts = modifiers;
    parts.push(primary);
    Some(parts.join("+"))
}

fn shortcut_binding(value: &str) -> Option<Value> {
    let mut parts = value
        .split('+')
        .map(str::trim)
        .filter(|part| !part.is_empty())
        .map(str::to_string)
        .collect::<Vec<_>>();
    let primary = parts.pop()?;
    Some(json!({"primary": primary, "modifiers": parts}))
}

fn patch_hotkey_bindings(mut state: Signal<AppState>, key: &str, raw: String) {
    let bindings: Vec<Value> = raw.split('\n').filter_map(shortcut_binding).collect();
    let mut next = state.read().config.clone();
    if let Some(object) = next.as_object_mut() {
        let hotkeys = object
            .entry("hotkeys")
            .or_insert_with(|| Value::Object(Map::new()));
        if let Some(hotkeys) = hotkeys.as_object_mut() {
            hotkeys.insert(key.to_string(), Value::Array(bindings.clone()));
            let primary_key = if key == "dictationBindings" {
                "dictation"
            } else {
                "ask"
            };
            hotkeys.insert(
                primary_key.to_string(),
                bindings.first().cloned().unwrap_or(Value::Null),
            );
        }
        let legacy_key = if key == "dictationBindings" {
            "hotkey"
        } else {
            "ask_hotkey"
        };
        let legacy_value = raw
            .split('\n')
            .map(str::trim)
            .find(|value| !value.is_empty())
            .unwrap_or_default();
        object.insert(
            legacy_key.to_string(),
            Value::String(legacy_value.to_string()),
        );
    }
    state.write().config = next;
}

fn pane_from_route(route: &str) -> &'static str {
    route
        .split("pane=")
        .nth(1)
        .and_then(|value| value.split('&').next())
        .and_then(|value| {
            PANES
                .iter()
                .find(|(id, _, _)| *id == value)
                .map(|(id, _, _)| *id)
        })
        .unwrap_or("general")
}

fn sanitized_config(config: &Value) -> Value {
    let mut config = config.clone();
    if let Some(object) = config.as_object_mut() {
        for key in ["stt_api_key", "stt_custom_api_key", "llm_api_key"] {
            if object.contains_key(key) {
                object.insert(key.to_string(), Value::String(String::new()));
            }
        }
    }
    config
}

fn patch_config(mut state: Signal<AppState>, key: &str, value: Value) {
    let mut next = state.read().config.clone();
    if let Some(object) = next.as_object_mut() {
        object.insert(key.to_string(), value);
    }
    state.write().config = next;
}

fn patch_output_mode(mut state: Signal<AppState>, clipboard: bool) {
    let mut next = state.read().config.clone();
    if let Some(object) = next.as_object_mut() {
        object.insert(
            "output_mode".to_string(),
            Value::String(if clipboard { "clipboard" } else { "keyboard" }.to_string()),
        );
        object.insert(
            "insertion_strategy".to_string(),
            Value::String(if clipboard { "clipboardPaste" } else { "auto" }.to_string()),
        );
    }
    state.write().config = next;
}

// Keep pre-existing drafts and edits made while the native save was in flight.
fn merge_saved_config(current: &Value, local: &Value, request: &Value, canonical: &Value) -> Value {
    let mut result = canonical.clone();
    if let (Some(result), Some(current)) = (result.as_object_mut(), current.as_object()) {
        for (key, value) in current {
            if value != &local[key] || local[key] != request[key] {
                result.insert(key.clone(), value.clone());
            }
        }
    }
    result
}

fn persist_request(
    mut state: Signal<AppState>,
    original: Value,
    local: Value,
    request: Value,
    sync_native: bool,
) {
    if state.read().busy {
        return;
    }
    state.write().busy = true;
    state.write().config = local.clone();
    spawn(async move {
        let args = json!({"config": sanitized_config(&request)});
        match invoke("update_config", args).await {
            Ok(_) => {
                if sync_native {
                    if let Some(enabled) = request.get("auto_start").and_then(Value::as_bool) {
                        if let Err(error) =
                            invoke("set_auto_start", json!({"enabled": enabled})).await
                        {
                            state.write().error = Some(error);
                        }
                    }
                    if let Some(enabled) = request.get("capsule_auto_hide").and_then(Value::as_bool)
                    {
                        if let Err(error) =
                            invoke("set_capsule_auto_hide", json!({"enabled": enabled})).await
                        {
                            state.write().error = Some(error);
                        }
                    }
                }
                if sync_native {
                    if let Err(error) = invoke("refresh_tray_labels", json!({})).await {
                        state.write().error = Some(error);
                    }
                }
                let saved = match invoke("get_config", json!({})).await {
                    Ok(value) => sanitized_config(&value),
                    Err(error) => {
                        state.write().error =
                            Some(format!("저장 후 설정을 다시 읽지 못했습니다: {error}"));
                        sanitized_config(&request)
                    }
                };
                let current = state.read().config.clone();
                state.write().config = merge_saved_config(&current, &local, &request, &saved);
                state.write().saved_config = saved;
                state.write().notice = Some("설정을 저장했습니다.".to_string());
            }
            Err(error) => {
                if state.read().config == local {
                    state.write().config = original;
                }
                state.write().error = Some(error);
            }
        }
        state.write().busy = false;
    });
}

fn persist_config(state: Signal<AppState>, next: Value) {
    let original = state.read().config.clone();
    persist_request(state, original, next.clone(), next, true);
}

const SCENE_CONFIG_KEYS: &[&str] = &[
    "custom_scenes",
    "system_scene_overrides",
    "family_scene_assignments",
    "active_scene",
];

fn persist_scene_config(state: Signal<AppState>, next: Value) {
    let original = state.read().config.clone();
    let saved = state.read().saved_config.clone();
    let mut request = saved;
    let mut local = original.clone();
    if let (Some(request_object), Some(next_object), Some(local_object)) = (
        request.as_object_mut(),
        next.as_object(),
        local.as_object_mut(),
    ) {
        for key in SCENE_CONFIG_KEYS {
            if let Some(value) = next_object.get(*key) {
                request_object.insert((*key).to_string(), value.clone());
                local_object.insert((*key).to_string(), value.clone());
            }
        }
    }
    persist_request(state, original, local, request, false);
}

async fn reload_dictionary(mut state: Signal<AppState>) -> Result<(), String> {
    let dictionary = invoke("get_dictionary", json!({})).await?;
    let rules = invoke("get_correction_rules", json!({})).await?;
    state.write().dictionary = dictionary.as_array().cloned().unwrap_or_default();
    state.write().rules = rules.as_array().cloned().unwrap_or_default();
    Ok(())
}

#[component]
pub fn SettingsNav(route: String) -> Element {
    let state = use_context::<Signal<AppState>>();
    let local_only = text(&state.read().config, "stt_provider") == "local-whisper";
    let active = pane_from_route(&route);
    rsx! {
        div { class: "settings-subnav space-y-1",
            for (id, label, icon) in PANES.iter().copied().filter(|(id, _, _)| !local_only || *id != "llm") {
                a {
                    href: "#/settings?pane={id}",
                    "data-kubai-trigger": "",
                    class: if active == id { "nav-link active" } else { "nav-link" },
                    aria_current: if active == id { "page" } else { "false" },
                    Icon { name: icon, size: 16 }
                    {tr(label)}
                }
            }
        }
    }
}

#[component]
pub fn Settings() -> Element {
    let mut state = use_context::<Signal<AppState>>();
    let route = state.read().route.clone();
    let active = pane_from_route(&route);
    let title = PANES
        .iter()
        .find(|(id, _, _)| *id == active)
        .map(|(_, title, _)| *title)
        .unwrap_or("일반");

    rsx! {
        div { class: "flex h-full min-h-0 w-full bg-background text-foreground",
            section { class: "min-w-0 flex-1 overflow-y-auto",
                header { class: "border-b border-border px-7 py-5",
                    p { class: "text-xs font-medium uppercase tracking-widest text-muted-foreground", {tr("설정")} }
                    h1 { class: "page-title mt-1", {tr(&title)} }
                }
                div { class: "mx-auto max-w-3xl space-y-6 px-7 py-6",
                    if let Some(error) = state.read().error.clone() {
                        p { class: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", role: "alert", {tr(&error)} }
                    }
                    if let Some(notice) = state.read().notice.clone() {
                        p { class: "rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary", {tr(&notice)} }
                    }
                    {match active {
                        "stt" => rsx! { SttPane {} },
                        "llm" => rsx! { LocalOnlyLlmPane {} },
                        "dictionary" => rsx! { DictionaryPane {} },
                        "scenes" => rsx! { ScenesPane {} },
                        "about" => rsx! { AboutPane {} },
                        _ => rsx! { GeneralPane {} },
                    }}
                }
                if state.read().config != state.read().saved_config {
                    div { class: "sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-7 py-3 backdrop-blur", p { class: "text-sm text-muted-foreground", {tr("저장하지 않은 변경 사항이 있습니다.")} }, div { class: "flex gap-2", button { class: "btn btn-ghost", onclick: move |_| { let saved = state.read().saved_config.clone(); state.write().config = saved; }, {tr("되돌리기")} }, button { class: "btn bg-primary text-primary-foreground", disabled: state.read().busy, onclick: move |_| { let next = state.read().config.clone(); persist_config(state, next); }, {tr("변경 사항 저장")} } } }
                }
            }
        }
    }
}

#[component]
fn GeneralPane() -> Element {
    let state = use_context::<Signal<AppState>>();
    let config = state.read().config.clone();
    let dictation = string_array(
        &config,
        &["hotkeys", "dictationBindings"],
        &text(&config, "hotkey"),
    );
    rsx! {
        section { class: "space-y-6",
            div { class: "space-y-1",
                h2 { class: "section-title", {tr("일반")} }
                p { class: "page-description", {tr("단축키, 출력 방식과 시작 동작을 설정합니다.")} }
            }
            SettingsCard { title: "단축키",
                ShortcutField { label: "받아쓰기 단축키 (줄바꿈으로 여러 개)", value: dictation, binding_key: "dictationBindings", state }
            }
            SettingsCard { title: "받아쓰기 모드",
                Toggle { label: "누르고 말하기", checked: text(&config, "hotkey_mode") != "toggle", on_change: move |checked| patch_config(state, "hotkey_mode", Value::String(if checked { "hold" } else { "toggle" }.to_string())) }
                Toggle { label: "기록 저장", checked: bool_value(&config, "history_enabled"), on_change: move |checked| patch_config(state, "history_enabled", Value::Bool(checked)) }
                Toggle { label: "시작 시 자동 실행", checked: bool_value(&config, "auto_start"), on_change: move |checked| patch_config(state, "auto_start", Value::Bool(checked)) }
                Toggle { label: "최소화 상태로 시작", checked: bool_value(&config, "start_minimized"), on_change: move |checked| patch_config(state, "start_minimized", Value::Bool(checked)) }
            }
            SettingsCard { title: "출력",
                Toggle { label: "클립보드로 출력", checked: text(&config, "output_mode") == "clipboard", on_change: move |checked| patch_output_mode(state, checked) }
                Toggle { label: "유휴 상태에서 캡슐 숨기기", checked: bool_value(&config, "capsule_auto_hide"), on_change: move |checked| patch_config(state, "capsule_auto_hide", Value::Bool(checked)) }
            }
            if state.read().pipeline == "recording" {
                SettingsCard { title: "녹음 중 단축키",
                    p { class: "muted", {tr("녹음 중에는 전역 단축키 등록을 잠시 멈출 수 있습니다.")} }
                    div { class: "flex gap-2",
                        button { class: "btn btn-secondary", onclick: move |_| {
                            let mut state = state;
                            spawn(async move {
                                match invoke("pause_hotkey", json!({})).await {
                                    Ok(_) => state.write().notice = Some("단축키를 잠시 멈췄습니다.".to_string()),
                                    Err(error) => state.write().error = Some(error),
                                }
                            });
                        }, {tr("잠시 멈추기")} }
                        button { class: "btn btn-ghost", onclick: move |_| {
                            let mut state = state;
                            spawn(async move {
                                match invoke("resume_hotkey", json!({})).await {
                                    Ok(_) => state.write().notice = Some("단축키를 다시 등록했습니다.".to_string()),
                                    Err(error) => state.write().error = Some(error),
                                }
                            });
                        }, {tr("다시 등록")} }
                    }
                }
            }
        }
        Diagnostics {}
    }
}

#[component]
fn SttPane() -> Element {
    rsx! {
        section { class: "space-y-6",
            div { class: "space-y-1", h2 { class: "section-title", {tr("음성 인식")} }, p { class: "page-description", {tr("한국어 받아쓰기는 이 컴퓨터의 Whisper 모델로 처리합니다.")} } }
            LocalModelPane {}
            Diagnostics {}
        }
    }
}

#[component]
fn LocalOnlyLlmPane() -> Element {
    rsx! { section { class: "space-y-6",
        div { class: "space-y-1", h2 { class: "section-title", {tr("AI 다듬기")} }, p { class: "page-description", {tr("로컬 전용 빌드에서는 원격 LLM 다듬기와 번역을 사용하지 않습니다.")} } }
        SettingsCard { title: "로컬 전용 모드", div { class: "flex items-start gap-3", Icon { name: "shield-check", size: 20 }, p { class: "muted", {tr("녹음과 받아쓰기 결과가 계정이나 외부 API 없이 이 컴퓨터에 머뭅니다.")} } } }
    } }
}

#[component]
fn DictionaryPane() -> Element {
    let mut state = use_context::<Signal<AppState>>();
    let mut word = use_signal(String::new);
    let mut pronunciation = use_signal(String::new);
    let mut pattern = use_signal(String::new);
    let mut replacement = use_signal(String::new);
    let editing_word = use_signal(|| None::<i64>);
    let editing_word_value = use_signal(String::new);
    let editing_pronunciation = use_signal(String::new);
    let editing_rule = use_signal(|| None::<i64>);
    let editing_pattern = use_signal(String::new);
    let editing_replacement = use_signal(String::new);
    let mut import_text = use_signal(String::new);
    let mut import_bytes = use_signal(Vec::<u8>::new);
    let mut import_name = use_signal(String::new);
    let mut import_format = use_signal(|| "json".to_string());
    let mut import_report = use_signal(|| None::<Value>);
    let dictionary = state.read().dictionary.clone();
    let rules = state.read().rules.clone();
    rsx! {
        section { class: "space-y-6",
            div { class: "space-y-1", h2 { class: "section-title", {tr("사전")} }, p { class: "page-description", {tr("더 정확한 받아쓰기를 위해 단어와 교정 규칙을 관리합니다.")} } }
            SettingsCard { title: "단어 추가",
                div { class: "grid gap-3 sm:grid-cols-2",
                    label { class: "field", span { class: "field-label", {tr("단어")} }, input { class: "input", value: "{word}", aria_label: tr("단어"), oninput: move |event| word.set(event.value()) } }
                    label { class: "field", span { class: "field-label", {tr("발음 (선택)")} }, input { class: "input", value: "{pronunciation}", aria_label: tr("발음 (선택)"), oninput: move |event| pronunciation.set(event.value()) } }
                }
                button { class: "btn mt-3 bg-primary text-primary-foreground", onclick: move |_| {
                    let next_word = word.read().trim().to_string(); let next_pron = pronunciation.read().trim().to_string();
                    if next_word.is_empty() { return; }
                    let mut state = state; spawn(async move { match invoke("add_dictionary_entry", json!({"word": next_word, "pronunciation": if next_pron.is_empty() { Value::Null } else { Value::String(next_pron) }})).await { Ok(_) => { if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } });
                }, Icon { name: "plus", size: 16 }, {tr("단어 추가")} }
            }
            SettingsCard { title: "등록된 단어",
                if dictionary.is_empty() { p { class: "empty-state", {tr("등록된 단어가 없습니다.")} } }
                for entry in dictionary.iter() {
                    {dictionary_row(state, entry, editing_word, editing_word_value, editing_pronunciation)}
                }
            }
            SettingsCard { title: "교정 규칙",
                div { class: "grid gap-3 sm:grid-cols-2",
                    label { class: "field", span { class: "field-label", {tr("잘못된 표현")} }, input { class: "input", value: "{pattern}", aria_label: tr("잘못된 표현"), oninput: move |event| pattern.set(event.value()) } }
                    label { class: "field", span { class: "field-label", {tr("바른 표현")} }, input { class: "input", value: "{replacement}", aria_label: tr("바른 표현"), oninput: move |event| replacement.set(event.value()) } }
                }
                button { class: "btn mt-3 bg-primary text-primary-foreground", onclick: move |_| {
                    let p = pattern.read().trim().to_string(); let r = replacement.read().trim().to_string(); if p.is_empty() || r.is_empty() { return; }
                    spawn(async move { match invoke("add_correction_rule", json!({"pattern": p, "replacement": r})).await { Ok(_) => { if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } });
                }, Icon { name: "plus", size: 16 }, {tr("교정 규칙 추가")} }
                if rules.is_empty() { p { class: "empty-state mt-4", {tr("등록된 교정 규칙이 없습니다.")} } }
                for rule in rules.iter() {
                    {rule_row(state, rule, editing_rule, editing_pattern, editing_replacement)}
                }
            }
            SettingsCard { title: "가져오기 및 내보내기",
                p { class: "muted", {tr("JSON, CSV, TXT 파일을 선택하거나 내용을 붙여 넣고 미리 확인한 뒤 가져옵니다.")} }
                label { class: "field", span { class: "field-label", {tr("가져오기 형식")} }, select { class: "input", value: "{import_format}", onchange: move |event| { import_format.set(event.value()); import_report.set(None); }, option { value: "json", "JSON" }, option { value: "csv", "CSV" }, option { value: "txt", "TXT" } } }
                label { class: "field", span { class: "field-label", {tr("파일 내용")} }, textarea { class: "input min-h-28", value: "{import_text}", oninput: move |event| { import_bytes.set(Vec::new()); import_name.set(String::new()); import_text.set(event.value()); import_report.set(None); } } }
                if !import_name.read().is_empty() { p { class: "text-xs text-muted-foreground", "선택한 파일: {import_name}" } }
                div { class: "flex flex-wrap gap-2",
                    button { class: "btn btn-secondary", onclick: move |_| {
                        let mut state = state;
                        let mut import_text = import_text;
                        let mut import_bytes = import_bytes;
                        let mut import_name = import_name;
                        let mut import_format = import_format;
                        let mut import_report = import_report;
                        spawn(async move {
                            match invoke("ui_import_file", json!({})).await.and_then(imported_file) {
                                Ok(Some((bytes, name))) => {
                                    let text = String::from_utf8_lossy(&bytes).into_owned();
                                    import_text.set(text);
                                    import_format.set(import_format_for_name(&name).to_string());
                                    import_name.set(name);
                                    import_bytes.set(bytes);
                                    import_report.set(None);
                                }
                                Ok(None) => {}
                                Err(error) => state.write().error = Some(error),
                            }
                        });
                    }, Icon { name: "folder-open", size: 16 }, {tr("파일 선택")} }
                    button { class: "btn btn-secondary", onclick: move |_| { let selected = import_bytes.read().clone(); let bytes = if selected.is_empty() { import_text.read().as_bytes().to_vec() } else { selected }; let format = import_format.read().clone(); let mut state = state; spawn(async move { match invoke("preview_dictionary_import", json!({"bytes": bytes, "format": format})).await { Ok(report) => import_report.set(Some(report)), Err(error) => state.write().error = Some(error) } }); }, {tr("미리 확인")} }
                    button { class: "btn bg-primary text-primary-foreground", disabled: import_report.read().is_none(), onclick: move |_| { let selected = import_bytes.read().clone(); let bytes = if selected.is_empty() { import_text.read().as_bytes().to_vec() } else { selected }; let format = import_format.read().clone(); let mut state = state; spawn(async move { match invoke("commit_dictionary_import", json!({"bytes": bytes, "format": format})).await { Ok(_) => { import_report.set(None); import_bytes.set(Vec::new()); import_name.set(String::new()); if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } }); }, {tr("가져오기 적용")} }
                    button { class: "btn btn-secondary", onclick: move |_| { let mut state = state; spawn(async move { match invoke("export_dictionary_json", json!({})).await { Ok(content) => { let text = content.as_str().unwrap_or_default().to_string(); match invoke("ui_export_file", json!({"text": text, "name": "typelesslocal-dictionary.json", "mime": "application/json"})).await { Ok(_) => state.write().notice = Some("사전 JSON을 저장했습니다.".to_string()), Err(error) => state.write().error = Some(error) } }, Err(error) => state.write().error = Some(error) } }); }, {tr("JSON 저장")} }
                    button { class: "btn btn-secondary", onclick: move |_| { let mut state = state; spawn(async move { match invoke("export_dictionary_csv", json!({})).await { Ok(content) => { let text = content.as_str().unwrap_or_default().to_string(); match invoke("ui_export_file", json!({"text": text, "name": "typelesslocal-dictionary.csv", "mime": "text/csv"})).await { Ok(_) => state.write().notice = Some("사전 CSV를 저장했습니다.".to_string()), Err(error) => state.write().error = Some(error) } }, Err(error) => state.write().error = Some(error) } }); }, {tr("CSV 저장")} }
                }
                if let Some(report) = import_report.read().clone() { p { class: "muted", "허용: {report.get(\"accepted\").and_then(Value::as_u64).unwrap_or(0)} · 중복: {report.get(\"skippedDuplicates\").and_then(Value::as_u64).unwrap_or(0)} · 잘못된 행: {report.get(\"skippedInvalid\").and_then(Value::as_u64).unwrap_or(0)}" } }
            }
        }
    }
}

fn dictionary_row(
    mut state: Signal<AppState>,
    entry: &Value,
    mut editing: Signal<Option<i64>>,
    mut editing_word: Signal<String>,
    mut editing_pronunciation: Signal<String>,
) -> Element {
    let id = entry.get("id").and_then(Value::as_i64).unwrap_or_default();
    let word = text(entry, "word");
    let pronunciation = text(entry, "pronunciation");
    rsx! { div { class: "flex items-center justify-between gap-3 border-b border-border py-2 last:border-0",
        if *editing.read() == Some(id) {
            div { class: "grid min-w-0 flex-1 gap-2 sm:grid-cols-2", input { class: "input", aria_label: tr("단어"), value: "{editing_word}", oninput: move |event| editing_word.set(event.value()) }, input { class: "input", aria_label: tr("발음"), value: "{editing_pronunciation}", oninput: move |event| editing_pronunciation.set(event.value()) } }
            div { class: "flex shrink-0 gap-1", button { class: "btn btn-secondary", onclick: move |_| { let word = editing_word.read().trim().to_string(); let pronunciation = editing_pronunciation.read().trim().to_string(); if word.is_empty() { return; } spawn(async move { match invoke("update_dictionary_entry", json!({"id": id, "word": word, "pronunciation": if pronunciation.is_empty() { Value::Null } else { Value::String(pronunciation) }})).await { Ok(_) => { editing.set(None); if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } }); }, {tr("저장")} }, button { class: "btn btn-ghost", onclick: move |_| editing.set(None), {tr("취소")} } }
        } else {
            div { class: "min-w-0", p { class: "truncate text-sm", "{word}" }, if !pronunciation.is_empty() { p { class: "muted", "{pronunciation}" } } }
            div { class: "flex shrink-0 gap-1", button { class: "btn btn-ghost", aria_label: tr("단어 편집"), onclick: move |_| { editing_word.set(word.clone()); editing_pronunciation.set(pronunciation.clone()); editing.set(Some(id)); }, Icon { name: "pencil", size: 16 } }, button { class: "btn btn-ghost text-destructive", aria_label: tr("단어 삭제"), onclick: move |_| { spawn(async move { match invoke("remove_dictionary_entry", json!({"id": id})).await { Ok(_) => { if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } }); }, Icon { name: "trash-2", size: 16 } } }
        }
    } }
}

fn rule_row(
    mut state: Signal<AppState>,
    rule: &Value,
    mut editing: Signal<Option<i64>>,
    mut editing_pattern: Signal<String>,
    mut editing_replacement: Signal<String>,
) -> Element {
    let id = rule.get("id").and_then(Value::as_i64).unwrap_or_default();
    let pattern = text(rule, "pattern");
    let replacement = text(rule, "replacement");
    let enabled = rule.get("enabled").and_then(Value::as_bool).unwrap_or(true);
    let status = if enabled {
        "사용 중"
    } else {
        "사용 안 함"
    };
    let visibility_icon = if enabled { "eye" } else { "eye-off" };
    rsx! { div { class: "flex items-center justify-between gap-3 border-b border-border py-2 last:border-0",
        if *editing.read() == Some(id) {
            div { class: "grid min-w-0 flex-1 gap-2 sm:grid-cols-2", input { class: "input", aria_label: tr("잘못된 표현"), value: "{editing_pattern}", oninput: move |event| editing_pattern.set(event.value()) }, input { class: "input", aria_label: tr("바른 표현"), value: "{editing_replacement}", oninput: move |event| editing_replacement.set(event.value()) } }
            div { class: "flex shrink-0 gap-1", button { class: "btn btn-secondary", onclick: move |_| { let pattern = editing_pattern.read().trim().to_string(); let replacement = editing_replacement.read().trim().to_string(); if pattern.is_empty() || replacement.is_empty() { return; } spawn(async move { match invoke("update_correction_rule", json!({"id": id, "pattern": pattern, "replacement": replacement, "enabled": enabled})).await { Ok(_) => { editing.set(None); if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } }); }, {tr("저장")} }, button { class: "btn btn-ghost", onclick: move |_| editing.set(None), {tr("취소")} } }
        } else {
            div { class: "min-w-0", p { class: "truncate text-sm", "{pattern} → {replacement}" }, p { class: "muted", "{status}" } }
            div { class: "flex items-center gap-1", button { class: "btn btn-ghost", aria_label: tr("교정 규칙 편집"), onclick: move |_| { editing_pattern.set(pattern.clone()); editing_replacement.set(replacement.clone()); editing.set(Some(id)); }, Icon { name: "pencil", size: 16 } }, button { class: "btn btn-ghost", aria_label: tr("교정 규칙 활성화 전환"), onclick: move |_| { spawn(async move { match invoke("set_correction_rule_enabled", json!({"id": id, "enabled": !enabled})).await { Ok(_) => { if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } }); }, Icon { name: visibility_icon, size: 16 } }, button { class: "btn btn-ghost text-destructive", aria_label: tr("교정 규칙 삭제"), onclick: move |_| { spawn(async move { match invoke("remove_correction_rule", json!({"id": id})).await { Ok(_) => { if let Err(error) = reload_dictionary(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } }); }, Icon { name: "trash-2", size: 16 } } }
        }
    } }
}

#[component]
fn ScenesPane() -> Element {
    let mut state = use_context::<Signal<AppState>>();
    let config = state.read().config.clone();
    let scenes = config
        .get("custom_scenes")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();
    let overrides = config
        .get("system_scene_overrides")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();
    let mut name = use_signal(String::new);
    let mut description = use_signal(String::new);
    let mut prompt = use_signal(String::new);
    let mut editing_id = use_signal(|| None::<String>);
    let deleting_id = use_signal(|| None::<String>);
    let mut import_json = use_signal(String::new);
    let mut import_bytes = use_signal(Vec::<u8>::new);
    let mut import_name = use_signal(String::new);
    let assignments = config
        .get("family_scene_assignments")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();
    let active_scene = config
        .get("active_scene")
        .cloned()
        .filter(|value| !value.is_null());
    let active_scene_name = active_scene
        .as_ref()
        .map(|value| {
            let name = text(value, "name");
            if name.is_empty() {
                text(value, "id")
            } else {
                name
            }
        })
        .unwrap_or_default();
    let editor_title = if editing_id.read().is_some() {
        "사용자 장면 편집"
    } else {
        "사용자 장면 만들기"
    };
    let export_scenes = scenes.clone();
    let existing_scene_ids = scenes
        .iter()
        .map(|scene| text(scene, "id"))
        .collect::<Vec<_>>();
    rsx! { section { class: "space-y-6",
        div { class: "space-y-1", h2 { class: "section-title", {tr("장면")} }, p { class: "page-description", {tr("상황별 글쓰기 프롬프트를 관리합니다. 사용자 장면은 이 컴퓨터의 설정에 저장됩니다.")} } }
        SettingsCard { title: editor_title,
            label { class: "field", span { class: "field-label", {tr("장면 이름")} }, input { class: "input", value: "{name}", oninput: move |event| name.set(event.value()) } }
            label { class: "field mt-3", span { class: "field-label", {tr("설명")} }, input { class: "input", value: "{description}", oninput: move |event| description.set(event.value()) } }
            label { class: "field mt-3", span { class: "field-label", {tr("프롬프트 템플릿")} }, textarea { class: "input min-h-28", value: "{prompt}", oninput: move |event| prompt.set(event.value()) } }
            div { class: "mt-3 flex gap-2",
                button { class: "btn bg-primary text-primary-foreground", onclick: move |_| {
                    let scene_name = name.read().trim().to_string(); let scene_desc = description.read().trim().to_string(); let scene_prompt = prompt.read().trim().to_string(); if scene_name.is_empty() || scene_prompt.is_empty() { state.write().error = Some("이름과 프롬프트를 입력하세요.".to_string()); return; }
                    let mut state = state; let current_id = editing_id.read().clone(); spawn(async move {
                        let mut next = state.read().config.clone(); let scenes = next.get("custom_scenes").and_then(Value::as_array).cloned().unwrap_or_default();
                        let id = if let Some(id) = current_id.clone() { id } else { match invoke("ui_uuid", json!({})).await { Ok(value) => value.as_str().map(str::to_string).filter(|v| !v.is_empty()).unwrap_or_else(|| { state.write().error = Some("새 장면 ID를 만들지 못했습니다.".to_string()); String::new() }), Err(error) => { state.write().error = Some(error); String::new() } } };
                        if id.is_empty() { return; }
                        let timestamp = match invoke("ui_now", json!({})).await { Ok(value) => value.as_str().unwrap_or_default().to_string(), Err(error) => { state.write().error = Some(error); String::new() } };
                        let mut scene = scenes.iter().find(|value| text(value, "id") == id).cloned().unwrap_or_else(|| Value::Object(Map::new())); let object = scene.as_object_mut().expect("scene must be an object"); object.insert("id".into(), Value::String(id.clone())); object.insert("name".into(), Value::String(scene_name)); object.insert("description".into(), Value::String(scene_desc)); object.insert("prompt_template".into(), Value::String(scene_prompt)); if object.get("created_at").and_then(Value::as_str).unwrap_or_default().is_empty() { object.insert("created_at".into(), Value::String(timestamp.clone())); } object.insert("updated_at".into(), Value::String(timestamp));
                        let mut next_scenes: Vec<Value> = scenes.into_iter().filter(|value| text(value, "id") != id).collect(); next_scenes.push(scene); if let Some(object) = next.as_object_mut() { object.insert("custom_scenes".into(), Value::Array(next_scenes)); } persist_scene_config(state, next);
                    });
                }, Icon { name: "save", size: 16 }, if editing_id.read().is_some() { {tr("저장")} } else { {tr("장면 만들기")} } }
                if editing_id.read().is_some() { button { class: "btn btn-ghost", onclick: move |_| { editing_id.set(None); name.set(String::new()); description.set(String::new()); prompt.set(String::new()); }, {tr("취소")} } }
            }
        }
        SettingsCard { title: "앱 글쓰기 모드",
            p { class: "muted", {tr("상황별로 사용할 사용자 장면을 연결합니다.")} }
            for family in ["email", "work_chat", "personal_chat", "document", "project_management", "developer_collaboration", "prompt_or_code", "support", "social"] {
                {family_assignment_row(state, family, &assignments, &scenes)}
            }
        }
        if active_scene.is_some() {
            SettingsCard { title: "현재 활성 장면",
                div { class: "flex items-center justify-between gap-3", p { class: "min-w-0 truncate text-sm", "{active_scene_name}" }, button { class: "btn btn-ghost", onclick: move |_| { let mut next = state.read().config.clone(); if let Some(object) = next.as_object_mut() { object.insert("active_scene".into(), Value::Null); } persist_scene_config(state, next); }, {tr("활성 장면 해제")} } }
            }
        }
        SettingsCard { title: "시스템 장면",
            p { class: "muted", {tr("기본 프롬프트를 필요에 따라 이 컴퓨터에서 덮어쓸 수 있습니다.")} }
            for (id, label, default_prompt) in SYSTEM_SCENES.iter().copied() {
                SystemOverrideRow { state, override_value: system_override_value(&overrides, id, default_prompt), label }
            }
        }
        SettingsCard { title: "내 장면",
            if scenes.is_empty() { p { class: "empty-state", {tr("사용자 장면이 없습니다.")} } }
            for scene in scenes.iter() { {custom_scene_row(state, scene, editing_id, name, description, prompt, deleting_id)} }
        }
        SettingsCard { title: "가져오기 및 내보내기",
            p { class: "muted", {tr("장면 JSON을 파일로 저장하거나 붙여 넣어 기존 장면에 추가합니다.")} }
            label { class: "field", span { class: "field-label", {tr("장면 JSON 내용")} }, textarea { class: "input min-h-24", aria_label: tr("장면 JSON 가져오기"), value: "{import_json}", oninput: move |event| { import_bytes.set(Vec::new()); import_name.set(String::new()); import_json.set(event.value()); } } }
            if !import_name.read().is_empty() { p { class: "text-xs text-muted-foreground", "선택한 파일: {import_name}" } }
            div { class: "mt-3 flex flex-wrap gap-2",
                button { class: "btn btn-secondary", onclick: move |_| {
                    let scenes = export_scenes.clone(); let mut state = state; spawn(async move { match invoke("ui_scene_export", json!({"scenes": scenes})).await { Ok(content) => { let text = content.as_str().unwrap_or_default().to_string(); match invoke("ui_export_file", json!({"text": text, "name": "typelesslocal-scenes.json", "mime": "application/json"})).await { Ok(_) => state.write().notice = Some("장면 JSON을 저장했습니다.".to_string()), Err(error) => state.write().error = Some(error) } }, Err(error) => state.write().error = Some(error) } });
                }, Icon { name: "download", size: 16 }, {tr("JSON 저장")} }
                button { class: "btn btn-secondary", onclick: move |_| {
                    let mut state = state; let mut import_json = import_json; let mut import_bytes = import_bytes; let mut import_name = import_name;
                    spawn(async move { match invoke("ui_import_file", json!({})).await.and_then(imported_file) { Ok(Some((bytes, name))) => { import_json.set(String::from_utf8_lossy(&bytes).into_owned()); import_bytes.set(bytes); import_name.set(name); }, Ok(None) => {}, Err(error) => state.write().error = Some(error) } });
                }, Icon { name: "folder-open", size: 16 }, {tr("파일 선택")} }
                button { class: "btn btn-secondary", onclick: move |_| {
                    let selected = import_bytes.read().clone(); let raw = if selected.is_empty() { import_json.read().trim().to_string() } else { String::from_utf8_lossy(&selected).trim().to_string() }; if raw.is_empty() { return; } let existing_ids = existing_scene_ids.clone(); let mut state = state; spawn(async move { match invoke("ui_scene_import", json!({"text": raw, "existingIds": existing_ids})).await { Ok(result) => { if let Err(error) = merge_scene_import_result(state, result).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } });
                }, Icon { name: "upload", size: 16 }, {tr("JSON 가져오기")} }
            }
        }
    } }
}

fn custom_scene_row(
    state: Signal<AppState>,
    scene: &Value,
    mut editing_id: Signal<Option<String>>,
    mut name: Signal<String>,
    mut description: Signal<String>,
    mut prompt: Signal<String>,
    mut deleting_id: Signal<Option<String>>,
) -> Element {
    let scene_id = text(scene, "id");
    let scene_name = text(scene, "name");
    let scene_description = text(scene, "description");
    let scene_prompt = text(scene, "prompt_template");
    let prompt_for_copy = scene_prompt.clone();
    let id_for_delete = scene_id.clone();
    let scene_for_duplicate = scene.clone();
    rsx! { div { class: "flex items-start justify-between gap-3 border-b border-border py-3 last:border-0",
        div { class: "min-w-0", p { class: "font-medium", "{scene_name}" }, p { class: "muted", "{scene_description}" }, p { class: "mt-1 line-clamp-2 text-xs text-muted-foreground", "{scene_prompt}" } }
        div { class: "flex shrink-0 gap-1",
            button { class: "btn btn-ghost", aria_label: tr("장면 편집"), onclick: move |_| { editing_id.set(Some(scene_id.clone())); name.set(scene_name.clone()); description.set(scene_description.clone()); prompt.set(scene_prompt.clone()); }, Icon { name: "pencil", size: 16 } }
            button { class: "btn btn-ghost", aria_label: tr("프롬프트 복사"), onclick: move |_| { let prompt = prompt_for_copy.clone(); let mut state = state; spawn(async move { match invoke("ui_copy", json!({"text": prompt})).await { Ok(_) => state.write().notice = Some("프롬프트를 클립보드에 복사했습니다.".to_string()), Err(error) => state.write().error = Some(error) } }); }, Icon { name: "copy", size: 16 } }
            button { class: "btn btn-ghost", aria_label: tr("장면 복제"), onclick: move |_| { let scene = scene_for_duplicate.clone(); let state = state; spawn(async move { duplicate_scene(state, scene).await; }); }, Icon { name: "copy", size: 16 } }
            if deleting_id.read().as_deref() == Some(scene_id.as_str()) {
                button { class: "btn bg-destructive text-destructive-foreground", onclick: move |_| { let id = id_for_delete.clone(); let state = state; spawn(async move { delete_scene(state, id).await; }); }, {tr("삭제 확인")} }
                button { class: "btn btn-ghost", onclick: move |_| deleting_id.set(None), {tr("취소")} }
            } else { button { class: "btn btn-ghost text-destructive", aria_label: tr("장면 삭제"), onclick: move |_| deleting_id.set(Some(id_for_delete.clone())), Icon { name: "trash-2", size: 16 } } }
        }
    } }
}

fn family_assignment_row(
    state: Signal<AppState>,
    family: &'static str,
    assignments: &[Value],
    scenes: &[Value],
) -> Element {
    let selected = assignments
        .iter()
        .find(|value| text(value, "family") == family)
        .map(|value| text(value, "scene_id"))
        .unwrap_or_default();
    rsx! { label { class: "field grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)] sm:items-center", span { class: "text-sm", "{family_label(family)}" }, select { class: "input", value: "{selected}", aria_label: "{family_label(family)} 장면", onchange: move |event| {
        let scene_id = event.value(); let mut state = state; let family = family.to_string(); spawn(async move {
            match invoke("set_family_scene_assignment", json!({"input": {"family": family, "sceneId": if scene_id.is_empty() { Value::Null } else { Value::String(scene_id) }}})).await {
                Ok(value) => {
                    let mut local = state.read().config.clone();
                    let mut saved = state.read().saved_config.clone();
                    if let Some(object) = local.as_object_mut() { object.insert("family_scene_assignments".into(), value.clone()); }
                    if let Some(object) = saved.as_object_mut() { object.insert("family_scene_assignments".into(), value.clone()); }
                    state.write().config = local;
                    state.write().saved_config = saved;
                    state.write().notice = Some("장면 연결을 저장했습니다.".to_string());
                }
                Err(error) => state.write().error = Some(error),
            }
        });
    }, option { value: "", selected: selected.is_empty(), {tr("자동")} }, for scene in scenes.iter() { option { value: "{text(scene, \"id\")}", selected: selected == text(scene, "id"), "{text(scene, \"name\")}" } } } } }
}

#[component]
fn SystemOverrideRow(
    mut state: Signal<AppState>,
    override_value: Value,
    label: &'static str,
) -> Element {
    let id = text(&override_value, "id");
    let prompt = text(&override_value, "prompt_template");
    let mut draft = use_signal(|| prompt.clone());
    let id_for_save = id.clone();
    rsx! { div { class: "space-y-2 border-b border-border py-3 last:border-0",
        p { class: "text-sm font-medium", {tr(&label)} }
        label { class: "field", span { class: "field-label", {tr("프롬프트 템플릿")} }, textarea { class: "input min-h-20", value: "{draft}", oninput: move |event| draft.set(event.value()) } }
        button { class: "btn btn-secondary", onclick: move |_| { let state = state; let id = id_for_save.clone(); let prompt = draft.read().trim().to_string(); spawn(async move { let mut config = state.read().config.clone(); let mut overrides = config.get("system_scene_overrides").and_then(Value::as_array).cloned().unwrap_or_default(); if let Some(item) = overrides.iter_mut().find(|item| text(item, "id") == id) { if let Some(object) = item.as_object_mut() { object.insert("prompt_template".into(), Value::String(prompt.clone())); } } else { overrides.push(json!({"id": id, "prompt_template": prompt})); } if let Some(object) = config.as_object_mut() { object.insert("system_scene_overrides".into(), Value::Array(overrides)); } persist_scene_config(state, config); }); }, {tr("시스템 장면 저장")} }
    } }
}

async fn duplicate_scene(mut state: Signal<AppState>, scene: Value) {
    let id = match invoke("ui_uuid", json!({})).await {
        Ok(value) => value
            .as_str()
            .map(str::to_string)
            .filter(|value| !value.is_empty()),
        Err(error) => {
            state.write().error = Some(error);
            None
        }
    };
    let Some(id) = id else {
        return;
    };
    let mut copy = scene;
    let Some(object) = copy.as_object_mut() else {
        return;
    };
    object.insert("id".into(), Value::String(id));
    object.insert(
        "name".into(),
        Value::String(format!(
            "{} 복사본",
            object.get("name").and_then(Value::as_str).unwrap_or("장면")
        )),
    );
    let timestamp = match invoke("ui_now", json!({})).await {
        Ok(value) => value.as_str().unwrap_or_default().to_string(),
        Err(error) => {
            state.write().error = Some(error);
            String::new()
        }
    };
    object.insert("created_at".into(), Value::String(timestamp.clone()));
    object.insert("updated_at".into(), Value::String(timestamp));
    let mut config = state.read().config.clone();
    let mut scenes = config
        .get("custom_scenes")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();
    scenes.push(copy);
    if let Some(config) = config.as_object_mut() {
        config.insert("custom_scenes".into(), Value::Array(scenes));
    }
    persist_scene_config(state, config);
}

async fn delete_scene(state: Signal<AppState>, id: String) {
    let mut config = state.read().config.clone();
    config = delete_scene_references(config, &id);
    persist_scene_config(state, config);
}

fn delete_scene_references(mut config: Value, id: &str) -> Value {
    if let Some(object) = config.as_object_mut() {
        if let Some(scenes) = object
            .get_mut("custom_scenes")
            .and_then(Value::as_array_mut)
        {
            scenes.retain(|item| text(item, "id") != id);
        }
        if let Some(assignments) = object
            .get_mut("family_scene_assignments")
            .and_then(Value::as_array_mut)
        {
            assignments.retain(|item| text(item, "scene_id") != id);
        }
        if object
            .get("active_scene")
            .map(|value| text(value, "id"))
            .as_deref()
            == Some(id)
        {
            object.insert("active_scene".into(), Value::Null);
        }
    }
    config
}

async fn merge_scene_import_result(
    mut state: Signal<AppState>,
    result: Value,
) -> Result<(), String> {
    let incoming = result
        .get("scenes")
        .and_then(Value::as_array)
        .cloned()
        .ok_or_else(|| "장면 가져오기 결과가 올바르지 않습니다.".to_string())?;
    let report = result.get("report").cloned().unwrap_or(Value::Null);
    let mut config = state.read().config.clone();
    let mut scenes = config
        .get("custom_scenes")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();
    scenes.extend(incoming);
    if let Some(object) = config.as_object_mut() {
        object.insert("custom_scenes".into(), Value::Array(scenes));
    }
    persist_scene_config(state, config);
    let imported = report.get("imported").and_then(Value::as_u64).unwrap_or(0);
    let skipped = report.get("skipped").and_then(Value::as_u64).unwrap_or(0);
    state.write().notice = Some(format!(
        "장면 {imported}개를 가져왔습니다. 건너뜀 {skipped}개."
    ));
    Ok(())
}

#[component]
fn AboutPane() -> Element {
    let mut state = use_context::<Signal<AppState>>();
    let language = text(&state.read().config, "ui_language");
    rsx! { section { class: "space-y-6",
        SettingsCard { title: "언어",
            label { class: "field", {tr("언어")}
                select { class: "input", value: language.clone(), aria_label: tr("언어"), onchange: move |event| patch_config(state, "ui_language", json!(event.value())),
                    for (code, label) in [("en","English"),("zh","中文"),("ja","日本語"),("ko","한국어"),("fr","Français"),("de","Deutsch"),("es","Español"),("pt","Português"),("ru","Русский"),("it","Italiano")] {
                        option { value: code, selected: code == language, "{label}" }
                    }
                }
            }
        }
        div { class: "flex items-center gap-4",
            img { src: "/dioxus/brand.svg", alt: "", class: "h-12 w-12 dark:invert" }
            div { h2 { class: "section-title", "TypelessLocal" } p { class: "muted text-sm mt-1", {tr("버전 1.1.64")} } }
        }
        p { class: "page-description", {tr("집중해서 작업할 수 있는 로컬 음성 인식 데스크톱 앱입니다.")} }
        SettingsCard { title: "개인정보 보호", p { class: "muted", {tr("모델을 설정하면 녹음과 받아쓰기 결과를 이 컴퓨터에서 처리합니다.")} } }
        SettingsCard { title: "오픈 소스",
            dl { class: "grid grid-cols-2 gap-3 text-sm",
                dt { class: "muted", {tr("라이선스")} } dd { "MIT" }
                dt { class: "muted", {tr("프레임워크")} } dd { "Tauri · Dioxus · Tailwind CSS" }
                dt { class: "muted", {tr("아이콘")} } dd { "Kubai Icons" }
            }
            button { class: "btn-secondary", onclick: move |_| { spawn(async move {
                if let Err(error) = invoke("ui_open_external", json!({"url":"https://github.com/sudo-engr/TypelessLocal"})).await { state.write().error = Some(error); }
            }); }, Icon { name: "external-link", size: 16 } {tr("GitHub 저장소")} }
        }
    } }
}

#[component]
fn SettingsCard(title: &'static str, children: Element) -> Element {
    rsx! { section { class: "card space-y-4", h3 { class: "text-sm font-semibold", {tr(&title)} }, {children} } }
}

#[component]
fn ShortcutField(
    label: &'static str,
    value: String,
    binding_key: &'static str,
    mut state: Signal<AppState>,
) -> Element {
    rsx! {
        label { class: "field",
            span { class: "field-label", {tr(&label)} }
            textarea { class: "input min-h-16", rows: "2", value: "{value}", aria_label: tr(label), oninput: move |event| patch_hotkey_bindings(state, binding_key, event.value()) }
            button { type: "button", class: "btn btn-secondary mt-2 self-start", onclick: move |_| {
                let mut state = state;
                spawn(async move {
                    match invoke("ui_capture_shortcut", json!({})).await {
                        Ok(value) if value.is_null() => {}
                        Ok(value) => {
                            let Some(binding) = value.as_str().map(str::trim).filter(|value| !value.is_empty()) else { return; };
                            let path = if binding_key == "dictationBindings" { ["hotkeys", "dictationBindings"] } else { ["hotkeys", "askBindings"] };
                            let current = string_array(&state.read().config, &path, "");
                            if !current.split('\n').any(|item| item.trim() == binding) {
                                let next = if current.trim().is_empty() { binding.to_string() } else { format!("{current}\n{binding}") };
                                patch_hotkey_bindings(state, binding_key, next);
                            }
                        }
                        Err(error) => state.write().error = Some(error),
                    }
                });
            }, Icon { name: "keyboard", size: 16 }, {tr("키 입력으로 추가")} }
        }
    }
}

#[component]
fn Toggle(label: &'static str, checked: bool, on_change: EventHandler<bool>) -> Element {
    rsx! { label { class: "flex cursor-pointer items-center justify-between gap-4 py-1.5", span { class: "text-sm", {tr(&label)} }, input { r#type: "checkbox", aria_label: tr(label), class: "h-4 w-4 accent-primary", checked: checked, onchange: move |event| on_change.call(event.checked()) } } }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shortcut_text_preserves_comma_key() {
        assert_eq!(
            shortcut_binding("Control+,"),
            Some(json!({"primary": ",", "modifiers": ["Control"]}))
        );
    }

    #[test]
    fn delete_scene_removes_assignments_and_active_reference() {
        let config = json!({
            "custom_scenes": [{"id": "keep"}, {"id": "remove"}],
            "family_scene_assignments": [{"family": "email", "scene_id": "remove"}],
            "active_scene": {"id": "remove"}
        });
        let result = delete_scene_references(config, "remove");
        assert_eq!(result["custom_scenes"].as_array().unwrap().len(), 1);
        assert!(result["family_scene_assignments"]
            .as_array()
            .unwrap()
            .is_empty());
        assert!(result["active_scene"].is_null());
    }

    #[test]
    fn sanitize_config_clears_credentials_without_dropping_unknown_fields() {
        let result = sanitized_config(&json!({"stt_api_key": "secret", "future": {"flag": true}}));
        assert_eq!(result["stt_api_key"], "");
        assert_eq!(result["future"]["flag"], true);
    }
    #[test]
    fn scene_save_preserves_unsaved_general_changes() {
        let local = json!({"theme":"dark","custom_scenes":[{"id":"new"}]});
        let request = json!({"theme":"light","custom_scenes":[{"id":"new"}]});
        let result = merge_saved_config(&local, &local, &request, &request);
        assert_eq!(result["theme"], "dark");
        assert_eq!(result["custom_scenes"][0]["id"], "new");
    }
    #[test]
    fn canonical_save_keeps_edits_made_during_request() {
        let local = json!({"hotkey":"Control+K","theme":"light"});
        let current = json!({"hotkey":"Control+K","theme":"dark"});
        let canonical = json!({"hotkey":"Ctrl+K","theme":"light"});
        let result = merge_saved_config(&current, &local, &local, &canonical);
        assert_eq!(result["hotkey"], "Ctrl+K");
        assert_eq!(result["theme"], "dark");
    }
}
