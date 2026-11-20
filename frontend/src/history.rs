//! Searchable history and correction-rule creation for the Dioxus client.

use dioxus::prelude::*;
use serde_json::{json, Value};

use crate::{
    bridge::invoke,
    state::AppState,
    ui::{tr, Icon},
};

async fn reload_history(mut state: Signal<AppState>) -> Result<(), String> {
    let value = invoke("get_history", json!({"limit": 200, "offset": 0})).await?;
    state.write().history = value.as_array().cloned().unwrap_or_default();
    Ok(())
}

async fn reload_rules(mut state: Signal<AppState>) -> Result<(), String> {
    let value = invoke("get_correction_rules", json!({})).await?;
    state.write().rules = value.as_array().cloned().unwrap_or_default();
    Ok(())
}

fn text(value: &Value, key: &str) -> String {
    value
        .get(key)
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string()
}

fn history_text(entry: &Value) -> String {
    let polished = text(entry, "polished_text");
    if polished.is_empty() {
        text(entry, "raw_text")
    } else {
        polished
    }
}

fn date_label(created_at: &str) -> String {
    created_at
        .split('T')
        .next()
        .unwrap_or(created_at)
        .to_string()
}

#[component]
pub fn History() -> Element {
    let state = use_context::<Signal<AppState>>();
    let mut search = use_signal(String::new);
    let mut correction = use_signal(|| None::<Value>);
    let mut confirming_clear = use_signal(|| false);
    let entries = state.read().history.clone();
    let query = search.read().trim().to_lowercase();
    let filtered: Vec<Value> = entries
        .into_iter()
        .filter(|entry| {
            if query.is_empty() {
                return true;
            }
            ["polished_text", "raw_text", "context_label"]
                .iter()
                .any(|key| text(entry, key).to_lowercase().contains(&query))
        })
        .collect();

    rsx! {
        div { class: "flex h-full min-h-0 w-full flex-col bg-background text-foreground",
            header { class: "flex items-center justify-between border-b border-border px-6 py-5",
                div { h1 { class: "page-title", {tr("기록")} }, p { class: "page-description mt-1", {tr("받아쓴 문장을 검색하고 다시 복사합니다.")} } }
                if !filtered.is_empty() { span { class: "badge", "{filtered.len()}개 기록" } }
            }
            div { class: "border-b border-border px-6 py-4", label { class: "field relative block", span { class: "sr-only", {tr("기록 검색")} }, Icon { name: "search", size: 16 }, input { class: "input pl-9", aria_label: tr("기록 검색"), placeholder: tr("기록 검색"), value: "{search}", oninput: move |event| search.set(event.value()) } } }
            div { class: "min-h-0 flex-1 overflow-y-auto px-6 pb-6",
                if filtered.is_empty() {
                    p { class: "empty-state py-16", if query.is_empty() { {tr("아직 기록이 없습니다. 녹음을 시작하면 여기에 표시됩니다.")} } else { {tr("일치하는 기록이 없습니다.")} } }
                } else {
                    for entry in filtered.iter() { {history_row(state, entry, correction)} }
                }
            }
            if !filtered.is_empty() {
                footer { class: "border-t border-border px-6 py-4",
                    if *confirming_clear.read() {
                        div { class: "flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3", p { class: "text-sm text-destructive", {tr("모든 기록을 삭제할까요? 되돌릴 수 없습니다.")} }, div { class: "flex gap-2", button { class: "btn btn-ghost", onclick: move |_| confirming_clear.set(false), {tr("취소")} }, button { class: "btn bg-destructive text-destructive-foreground", onclick: move |_| { confirming_clear.set(false); let mut state = state; spawn(async move { match invoke("clear_history", json!({})).await { Ok(_) => { if let Err(error) = reload_history(state).await { state.write().error = Some(error); } }, Err(error) => state.write().error = Some(error) } }); }, {tr("기록 삭제")} } } }
                    } else { button { class: "btn btn-ghost text-destructive", onclick: move |_| confirming_clear.set(true), Icon { name: "trash-2", size: 16 }, {tr("기록 삭제")} } }
                }
            }
            if let Some(entry) = correction.read().clone() { CorrectionDialog { entry, on_close: move |_| correction.set(None) } }
        }
    }
}

fn history_row(
    state: Signal<AppState>,
    entry: &Value,
    mut correction: Signal<Option<Value>>,
) -> Element {
    let id = entry.get("id").and_then(Value::as_i64).unwrap_or_default();
    let value = history_text(entry);
    let raw = text(entry, "raw_text");
    let date = date_label(&text(entry, "created_at"));
    let label = text(entry, "context_label");
    let output = match entry["output_status"].as_str().unwrap_or("") {
        "inserted" => "입력 완료",
        "copiedFallback" => "클립보드로 복사됨",
        "failed" => "입력 실패",
        "partiallyInserted" => "일부만 입력됨",
        _ => "",
    };
    let entry_for_correction = entry.clone();
    rsx! { article { class: "group mb-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30",
        div { class: "flex items-start justify-between gap-3",
            div { class: "min-w-0 flex-1", p { class: "whitespace-pre-wrap break-words text-sm leading-relaxed", "{value}" }, div { class: "mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground", if !label.is_empty() { span { "{label}" } } if !date.is_empty() { span { "· {date}" } } if !output.is_empty() { span { "· {output}" } } } }
            div { class: "flex shrink-0 gap-1", button { class: "btn btn-ghost", aria_label: tr("기록 복사"), onclick: move |_| { let value = value.clone(); let mut state = state; spawn(async move { match invoke("ui_copy", json!({"text": value})).await { Ok(_) => state.write().notice = Some("클립보드에 복사했습니다.".to_string()), Err(error) => state.write().error = Some(error) } }); }, Icon { name: "copy", size: 16 } }, button { class: "btn btn-ghost", aria_label: tr("교정 규칙 만들기"), onclick: move |_| correction.set(Some(entry_for_correction.clone())), Icon { name: "more-horizontal", size: 16 } } }
        }
        if !raw.is_empty() && raw != value { details { class: "mt-3 text-xs text-muted-foreground", summary { class: "cursor-pointer", {tr("원문 보기")} }, p { class: "mt-2 whitespace-pre-wrap rounded-md bg-muted/40 p-2", "{raw}" } } }
        if id != 0 { span { class: "sr-only", "기록 {id}" } }
    } }
}

#[component]
fn CorrectionDialog(entry: Value, on_close: EventHandler<()>) -> Element {
    let mut pattern = use_signal(|| {
        let value = text(&entry, "raw_text");
        if value.chars().count() <= 120 {
            value.trim().to_string()
        } else {
            String::new()
        }
    });
    let mut replacement = use_signal(|| {
        let value = history_text(&entry);
        if value.chars().count() <= 120 {
            value.trim().to_string()
        } else {
            String::new()
        }
    });
    let state = use_context::<Signal<AppState>>();
    rsx! { div { class: "fixed inset-0 z-50 grid place-items-center bg-black/30 p-5", role: "dialog", aria_label: tr("교정 규칙 만들기"), aria_modal: "true", tabindex: "-1", onkeydown: move |event| { if event.key().to_string() == "Escape" { on_close.call(()); } },
        div { class: "card relative w-full max-w-md space-y-4 bg-background",
            div { class: "flex items-center justify-between", h2 { class: "text-base font-semibold", {tr("교정 규칙 만들기")} }, button { class: "btn btn-ghost", aria_label: tr("닫기"), onclick: move |_| on_close.call(()), Icon { name: "x", size: 16 } } }
            label { class: "field", span { class: "field-label", {tr("잘못된 표현")} }, input { class: "input", maxlength: "120", aria_label: tr("잘못된 표현"), autofocus: true, value: "{pattern}", oninput: move |event| pattern.set(event.value().chars().take(120).collect::<String>()) } }
            label { class: "field", span { class: "field-label", {tr("바른 표현")} }, input { class: "input", maxlength: "120", aria_label: tr("바른 표현"), value: "{replacement}", oninput: move |event| replacement.set(event.value().chars().take(120).collect::<String>()) } }
            div { class: "flex justify-end gap-2", button { class: "btn btn-ghost", onclick: move |_| on_close.call(()), {tr("취소")} }, button { class: "btn bg-primary text-primary-foreground", disabled: pattern.read().trim().is_empty() || replacement.read().trim().is_empty(), onclick: move |_| { let p = pattern.read().trim().to_string(); let r = replacement.read().trim().to_string(); let mut state = state; spawn(async move { match invoke("add_correction_rule", json!({"pattern": p, "replacement": r})).await { Ok(_) => { if let Err(error) = reload_rules(state).await { state.write().error = Some(error); } on_close.call(()); }, Err(error) => state.write().error = Some(error) } }); }, {tr("교정 저장")} } }
        }
    } }
}
