use dioxus::prelude::*;
use serde_json::{json, Value};

use crate::bridge::invoke;
use crate::state::AppState;
use crate::ui::{tr, Icon};

fn capsule_size(state: &str) -> (u32, u32) {
    match state {
        "preparing" => (180, 36),
        "outputting" => (144, 36),
        "ask_recording" | "ask_thinking" => (168, 36),
        "recording" | "transcribing" | "polishing" | "error" => (200, 36),
        _ => (36, 36),
    }
}

fn human_pipeline_state(state: &str) -> &'static str {
    match state {
        "preparing" => "준비 중…",
        "recording" => "듣고 있습니다…",
        "transcribing" => "전사 중…",
        "polishing" => "다듬는 중…",
        "outputting" => "입력 완료",
        "ask_recording" => "질문을 듣고 있습니다…",
        "ask_thinking" => "답변을 준비 중…",
        _ => "",
    }
}

#[component]
pub fn Capsule() -> Element {
    let state = use_context::<Signal<AppState>>();
    let pipeline = state.read().pipeline.clone();
    let has_error = state.read().error.is_some();
    let visual_state = if has_error {
        "error".to_owned()
    } else {
        pipeline
    };
    let (width, height) = capsule_size(visual_state.as_str());
    let auto_hide = state
        .read()
        .config
        .get("capsule_auto_hide")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    let mut context_menu = use_signal(|| false);
    let mut drag_start = use_signal(|| None::<(f64, f64)>);
    let mut dragging = use_signal(|| false);
    let mut drag_completed = use_signal(|| false);
    let resize_failure = use_signal(|| None::<String>);
    let resize_width = if context_menu() { 220 } else { width };
    let resize_height = if context_menu() { 180 } else { height };
    let resize_show = !auto_hide || visual_state != "idle" || context_menu();
    let resize_active = visual_state != "idle" || context_menu();

    // Keep the native capsule in sync with the rendered state. The bridge owns
    // placement and shows the window only when its current state is actionable.
    let resize_state = state;
    use_effect(use_reactive!(|(
        resize_width,
        resize_height,
        resize_show,
        resize_active,
    )| {
        let mut resize_state = resize_state;
        let mut resize_failure = resize_failure;
        spawn(async move {
            match invoke(
                "ui_capsule_resize",
                json!({
                    "width": resize_width,
                    "height": resize_height,
                    "show": resize_show,
                    "active": resize_active
                }),
            )
            .await
            {
                Ok(_) => {
                    if resize_failure.peek().is_some() {
                        resize_failure.set(None);
                    }
                }
                Err(message) => {
                    if resize_failure.peek().as_deref() != Some(message.as_str()) {
                        resize_failure.set(Some(message.clone()));
                        resize_state.write().error = Some(message);
                    }
                }
            }
        });
    }));
    let cancel_state = visual_state.clone();
    let command_state = state;

    let cancel = move |event: Event<MouseData>| {
        event.stop_propagation();
        if drag_completed() {
            drag_completed.set(false);
            return;
        }
        let command = match cancel_state.as_str() {
            "ask_recording" | "ask_thinking" => "stop_ask_flow",
            "recording" | "preparing" | "transcribing" | "polishing" => "abort_recording",
            _ => "start_recording",
        };
        let mut command_state = command_state;
        spawn(async move {
            if let Err(message) = invoke(command, Value::Null).await {
                command_state.write().error = Some(message);
            }
        });
    };

    let pointer_state = visual_state.clone();
    let pointer_command_state = state;
    let pointer_up = move |event: Event<PointerData>| {
        use dioxus::html::input_data::MouseButton;
        if event.data().trigger_button() != Some(MouseButton::Primary) {
            return;
        }
        if dragging() {
            dragging.set(false);
            drag_start.set(None);
            drag_completed.set(true);
            return;
        }
        drag_start.set(None);
        drag_completed.set(false);
        if pointer_state == "recording" {
            let mut pointer_command_state = pointer_command_state;
            spawn(async move {
                if let Err(message) = invoke("stop_recording", Value::Null).await {
                    pointer_command_state.write().error = Some(message);
                }
            });
        } else if pointer_state == "ask_recording" {
            let mut pointer_command_state = pointer_command_state;
            spawn(async move {
                if let Err(message) = invoke("stop_ask_flow", Value::Null).await {
                    pointer_command_state.write().error = Some(message);
                }
            });
        }
    };
    let pointer_down = move |event: Event<PointerData>| {
        use dioxus::html::input_data::MouseButton;
        if event.data().trigger_button() != Some(MouseButton::Primary) {
            return;
        }
        let point = event.data().client_coordinates();
        drag_start.set(Some((point.x, point.y)));
        dragging.set(false);
    };
    let drag_state = state;
    let pointer_move = move |event: Event<PointerData>| {
        use dioxus::html::input_data::MouseButton;
        if !event.data().held_buttons().contains(MouseButton::Primary) {
            return;
        }
        let Some((start_x, start_y)) = drag_start() else {
            return;
        };
        let point = event.data().client_coordinates();
        if (point.x - start_x).abs() <= 5.0 && (point.y - start_y).abs() <= 5.0 {
            return;
        }
        drag_start.set(None);
        dragging.set(true);
        let mut drag_state = drag_state;
        spawn(async move {
            if let Err(message) = invoke("ui_window_drag", Value::Null).await {
                drag_state.write().error = Some(message);
            }
        });
    };

    rsx! {
        main {
            class: "relative flex h-full w-full items-center justify-start bg-transparent p-3",
            div {
                class: if visual_state == "idle" { "capsule-shell grid place-items-center rounded-full border border-zinc-700/60 bg-zinc-950 text-zinc-100 shadow-lg" } else if visual_state == "error" { "capsule-shell rounded-full border border-red-400/50 bg-red-950 text-red-50 shadow-lg" } else { "capsule-shell rounded-full border border-zinc-700/60 bg-zinc-950 text-zinc-100 shadow-lg" },
                style: "width: {width}px; height: {height}px",
                onpointerup: pointer_up,
                onpointerdown: pointer_down,
                onpointermove: pointer_move,
                onpointercancel: move |_| {
                    drag_start.set(None);
                    dragging.set(false);
                    drag_completed.set(false);
                },
                oncontextmenu: move |event| {
                    event.prevent_default();
                    context_menu.set(!context_menu());
                },
                match visual_state.as_str() {
                    "idle" => rsx! {
                        button {
                            class: "grid h-full w-full place-items-center rounded-full",
                            aria_label: tr("받아쓰기 시작"),
                            onclick: cancel,
                            Icon {
                                name: "mic",
                                size: 18,
                            }
                        }
                    },
                    "recording" => rsx! {
                        RecordingState {

                        }
                    },
                    "transcribing" | "polishing" => rsx! {
                        ProcessingState {
                            text: state.read().transcript.clone(),
                        }
                    },
                    "preparing" => rsx! {
                        StatusState {
                            text: human_pipeline_state(visual_state.as_str()).to_owned(),
                            command: Some("abort_recording"),
                        }
                    },
                    "outputting" => rsx! {
                        StatusState {
                            text: "입력 완료".to_owned(),
                            command: None,
                        }
                    },
                    "ask_recording" => rsx! {
                        StatusState {
                            text: human_pipeline_state(visual_state.as_str()).to_owned(),
                            command: Some("abort_ask_dictation"),
                        }
                    },
                    "ask_thinking" => rsx! {
                        StatusState {
                            text: human_pipeline_state(visual_state.as_str()).to_owned(),
                            command: Some("stop_ask_flow"),
                        }
                    },
                    "error" => rsx! {
                        StatusState {
                            text: state
                                .read()
                                .error
                                .clone()
                                .unwrap_or_else(|| "오류가 발생했습니다".to_owned()),
                            command: None,
                        }
                    },
                    _ => rsx! {
                        StatusState {
                            text: "준비 중…".to_owned(),
                            command: None,
                        }
                    },
                }
            }
            if context_menu() {
                CapsuleContextMenu {
                    open: context_menu,
                    state,
                }
            }
        }
    }
}

#[component]
fn CapsuleContextMenu(open: Signal<bool>, state: Signal<AppState>) -> Element {
    rsx! {
        div {
            class: "absolute left-12 top-1 z-20 min-w-36 rounded-lg border bg-card p-1 text-foreground shadow-lg",
            button {
                class: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs hover:bg-muted",
                onclick: move |_| {
                    open.set(false);
                    let mut state = state;
                    spawn(async move {
                        if let Err(message) = invoke(
                                "ui_main_navigate",
                                json!({ "hash" : "#/settings" }),
                            )
                            .await
                        {
                            state.write().error = Some(message);
                        }
                    });
                },
                Icon {
                    name: "settings",
                    size: 14,
                }
                {tr("설정")}
            }
            button {
                class: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs hover:bg-muted",
                onclick: move |_| {
                    open.set(false);
                    let mut state = state;
                    spawn(async move {
                        if let Err(message) = invoke(
                                "ui_main_navigate",
                                json!({ "hash" : "#/history" }),
                            )
                            .await
                        {
                            state.write().error = Some(message);
                        }
                    });
                },
                Icon {
                    name: "history",
                    size: 14,
                }
                {tr("기록")}
            }
            button {
                class: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs hover:bg-muted",
                onclick: move |_| {
                    open.set(false);
                    let mut state = state;
                    spawn(async move {
                        if let Err(message) = invoke("ui_window_hide", Value::Null).await {
                            state.write().error = Some(message);
                        }
                    });
                },
                Icon {
                    name: "x",
                    size: 14,
                }
                {tr("숨기기")}
            }
        }
    }
}

#[component]
fn RecordingState() -> Element {
    let state = use_context::<Signal<AppState>>();
    rsx! {
        div {
            class: "flex h-full items-center gap-2 px-3 text-white",
            span {
                class: "h-2 w-2 animate-pulse rounded-full bg-white",
            }
            div {
                class: "flex items-end gap-0.5",
                aria_label: tr("음성 입력 중"),
                for height in [8, 13, 18, 11, 16, 8] {
                    span {
                        class: "w-0.5 rounded-full bg-white/80",
                        style: "height: {height}px",
                    }
                }
            }
            span {
                class: "flex-1",
            }
            button {
                class: "rounded-full p-1 text-white/70 hover:bg-white/15 hover:text-white",
                aria_label: tr("녹음 취소"),
                onpointerdown: move |event| event.stop_propagation(),
                onpointerup: move |event| event.stop_propagation(),
                onclick: move |_| {
                    let mut state = state;
                    spawn(async move {
                        if let Err(message) = invoke("abort_recording", Value::Null).await {
                            state.write().error = Some(message);
                        }
                    });
                },
                Icon {
                    name: "x",
                    size: 13,
                }
            }
        }
    }
}

#[component]
fn ProcessingState(text: String) -> Element {
    let state = use_context::<Signal<AppState>>();
    let display = if text.is_empty() {
        tr("전사 중…")
    } else {
        text
    };
    rsx! {
        div {
            class: "flex h-full items-center gap-2 px-3 text-white",
            Icon {
                name: "loader-circle",
                size: 15,
            }
            p {
                class: "min-w-0 flex-1 truncate text-xs",
                "{display}"
            }
            button {
                class: "rounded-full p-1 text-white/70 hover:bg-white/15 hover:text-white",
                aria_label: tr("처리 취소"),
                onpointerdown: move |event| event.stop_propagation(),
                onpointerup: move |event| event.stop_propagation(),
                onclick: move |_| {
                    let mut state = state;
                    spawn(async move {
                        if let Err(message) = invoke("abort_recording", Value::Null).await {
                            state.write().error = Some(message);
                        }
                    });
                },
                Icon {
                    name: "x",
                    size: 13,
                }
            }
        }
    }
}

#[component]
fn StatusState(text: String, command: Option<&'static str>) -> Element {
    let state = use_context::<Signal<AppState>>();
    rsx! {
        div {
            class: "flex h-full items-center gap-2 px-3 text-white",
            Icon {
                name: "loader-circle",
                size: 15,
            }
            p {
                class: "min-w-0 flex-1 truncate text-xs",
                {tr(&text)}
            }
            if let Some(command) = command {
                button {
                    class: "rounded-full p-1 text-white/70 hover:bg-white/15 hover:text-white",
                    aria_label: tr("취소"),
                    onpointerdown: move |event| event.stop_propagation(),
                    onpointerup: move |event| event.stop_propagation(),
                    onclick: move |_| {
                        let mut state = state;
                        spawn(async move {
                            if let Err(message) = invoke(command, Value::Null).await {
                                state.write().error = Some(message);
                            }
                        });
                    },
                    Icon {
                        name: "x",
                        size: 13,
                    }
                }
            }
        }
    }
}

#[component]
pub fn AskPanel() -> Element {
    let error = use_signal(|| None::<String>);

    let go_home = move |_| {
        let mut error = error;
        spawn(async move {
            if let Err(message) = invoke("ui_main_navigate", json!({"hash":"#/"})).await {
                error.set(Some(message));
            }
        });
    };
    let close = move |_| {
        let mut error = error;
        spawn(async move {
            if let Err(message) = invoke("ui_window_hide", Value::Null).await {
                error.set(Some(message));
            }
        });
    };

    rsx! {
        main {
            class: "flex h-full min-h-0 flex-col bg-background p-5 text-foreground",
            header {
                class: "flex items-center justify-between border-b pb-3",
                div {
                    class: "flex items-center gap-2",
                    Icon {
                        name: "shield-check",
                        size: 18,
                    }
                    h1 {
                        class: "text-sm font-semibold",
                        {tr("로컬 받아쓰기")}
                    }
                }
                button {
                    class: "rounded-md p-1 text-muted-foreground hover:bg-muted",
                    aria_label: tr("닫기"),
                    onclick: close,
                    Icon {
                        name: "x",
                        size: 16,
                    }
                }
            }
            section {
                class: "flex flex-1 flex-col items-center justify-center gap-4 text-center",
                div {
                    class: "grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary",
                    Icon {
                        name: "cloud-off",
                        size: 28,
                    }
                }
                h2 {
                    class: "text-base font-semibold",
                    {tr("Ask는 이 빌드에서 사용할 수 없습니다")}
                }
                p {
                    class: "muted max-w-sm text-sm leading-6",
                    {tr("TypelessLocal은 로컬 Whisper 받아쓰기 전용으로 동작합니다. Ask 답변에는 별도 AI backend가 필요하므로 질문이나 음성을 전송하지 않습니다.")}
                }
                if let Some(message) = error.read().as_ref() {
                    p {
                        class: "max-w-sm rounded-md bg-destructive/10 p-3 text-sm text-destructive",
                        role: "alert",
                        "{message}"
                    }
                }
                button {
                    class: "btn",
                    onclick: go_home,
                    Icon {
                        name: "arrow-left",
                        size: 15,
                    }
                    {tr("받아쓰기로 돌아가기")}
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn capsule_keeps_completion_and_error_feedback_visible() {
        assert_eq!(capsule_size("outputting"), (144, 36));
        assert_eq!(capsule_size("error"), (200, 36));
        assert_eq!(human_pipeline_state("outputting"), "입력 완료");
        assert_eq!(human_pipeline_state("error"), "");
    }

    #[test]
    fn capsule_defaults_to_compact_idle_size() {
        assert_eq!(capsule_size("idle"), (36, 36));
        assert_eq!(capsule_size("unknown"), (36, 36));
    }
}
