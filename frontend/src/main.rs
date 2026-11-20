mod bridge;
mod history;
mod overlays;
mod settings;
mod setup;
mod state;
mod ui;

use bridge::invoke;
use dioxus::prelude::*;
use serde_json::json;
use state::{reduce_event, refresh, AppState};
use ui::{tr, Icon};

fn main() {
    dioxus::launch(App);
}

#[component]
fn App() -> Element {
    let mut state = use_context_provider(|| {
        Signal::new(AppState {
            pipeline: "idle".into(),
            ..Default::default()
        })
    });
    let language = use_memo(move || {
        state.read().config["ui_language"]
            .as_str()
            .unwrap_or("ko")
            .to_string()
    });
    use_context_provider(|| language);
    let mut initial_error = use_signal(|| false);
    use_future(move || async move {
        let result = async {
            let boot = invoke("ui_bootstrap", json!({})).await?;
            state.write().route = boot["route"].as_str().unwrap_or("#/").into();
            state.write().onboarded = boot["onboarded"].as_bool().unwrap_or(false);
            refresh(state).await?;
            match invoke("get_hotkey_registration_error", json!({})).await {
                Ok(value) => state.write().hotkey_error = value.as_str().map(str::to_string),
                Err(error) => state.write().hotkey_error = Some(error),
            }
            if state.read().local_model.is_none() {
                state.write().onboarded = false;
            }
            Ok::<_, String>(())
        }
        .await;
        if let Err(error) = result {
            state.write().error = Some(error);
            initial_error.set(true);
        }
        state.write().loaded = true;
        if let Err(error) = invoke("ui_ready", json!({})).await {
            state.write().error = Some(error);
        }
    });
    use_future(move || async move {
        loop {
            match invoke("ui_next_event", json!({})).await {
                Ok(event) => {
                    let reload_history =
                        event["event"] == "pipeline:state" && event["payload"] == "idle";
                    reduce_event(&mut state.write(), &event);
                    if reload_history {
                        match invoke("get_history", json!({"limit":200,"offset":0})).await {
                            Ok(items) => {
                                if let Some(items) = items.as_array() {
                                    state.write().history = items.clone();
                                }
                            }
                            Err(error) => state.write().error = Some(error),
                        }
                    }
                }
                Err(error) => {
                    state.write().error = Some(error);
                    break;
                }
            }
        }
    });
    let view = use_memo(move || {
        let state = state.read();
        (
            state.loaded,
            state.onboarded,
            state.route.clone(),
            state.error.clone(),
            state.notice.clone(),
        )
    });
    let (loaded, onboarded, route, error, notice) = view.read().clone();
    let theme = use_memo(move || {
        state.read().config["theme"]
            .as_str()
            .unwrap_or("system")
            .to_string()
    });
    use_effect(move || {
        let theme = theme();
        let language = language();
        spawn(async move {
            if let Err(error) = invoke("ui_theme", json!({"theme":theme,"language":language})).await
            {
                state.write().error = Some(error);
            }
        });
    });
    if !loaded {
        return rsx! {
            div {
                class: "empty-state h-screen",
                role: "status",
                {tr("앱을 불러오고 있습니다…")}
            }
        };
    }
    if *initial_error.read() {
        return rsx! {
            div {
                class: "empty-state h-screen gap-4",
                role: "alert",
                h1 {

                    {tr("앱 데이터를 불러오지 못했습니다")}
                }
                p {

                    "{error.clone().unwrap_or_default()}"
                }
                button {
                    class: "btn",
                    onclick: move |_| {
                        spawn(async {
                            let _ = invoke("ui_reload", json!({})).await;
                        });
                    },
                    {tr("다시 시도")}
                }
            }
        };
    }
    if route == "#capsule" {
        return rsx! {
            overlays::Capsule {

            }
        };
    }
    if route == "#ask" {
        return rsx! {
            overlays::AskPanel {

            }
        };
    }
    rsx! {
        if !onboarded {
            setup::Onboarding {

            }
        } else {
            Shell {

            }
        }
        if let Some(error) = error {
            div {
                class: "toast toast-error",
                role: "alert",
                div {
                    class: "min-w-0 flex-1 break-words",
                    {tr(&error)}
                }
                button {
                    class: "btn-ghost",
                    "aria-label": "오류 닫기",
                    onclick: move |_| state.write().error = None,
                    {tr("닫기")}
                }
            }
        } else if let Some(notice) = notice {
            div {
                class: "toast",
                role: "status",
                div {
                    class: "min-w-0 flex-1 break-words",
                    {tr(&notice)}
                }
                button {
                    class: "btn-ghost",
                    "aria-label": "알림 닫기",
                    onclick: move |_| state.write().notice = None,
                    {tr("닫기")}
                }
            }
        }
    }
}

#[component]
fn Shell() -> Element {
    let state = use_context::<Signal<AppState>>();
    let navigation = use_memo(move || {
        let state = state.read();
        (state.route.clone(), state.hotkey_error.clone())
    });
    let (route, hotkey_error) = navigation.read().clone();
    rsx! {
        div {
            class: "app-shell",
            aside {
                class: "app-sidebar",
                div {
                    class: "brand",
                    "data-tauri-drag-region": "",
                    img {
                        src: "/dioxus/brand.svg",
                        alt: "",
                        class: "h-8 w-8 dark:invert",
                    }
                    div {

                        strong {

                            "TypelessLocal"
                        }
                        p {
                            class: "muted text-xs mt-1",
                            {tr("생각을 말로, 말은 글로.")}
                        }
                    }
                }
                div {
                    class: "px-4 mb-7",
                    span {
                        class: "badge",
                        Icon {
                            name: "shield-check",
                            size: 14,
                        }
                        {tr("로컬 전용")}
                    }
                }
                nav {
                    "aria-label": "주 메뉴",
                    class: "space-y-1 px-3 overflow-y-auto",
                    for (path , label , icon) in [
                        ("#/", "홈", "home"),
                        ("#/history", "기록", "history"),
                        ("#/settings", "설정", "settings"),
                    ]
                    {
                        a {
                            href: path,
                            "data-kubai-trigger": "",
                            aria_expanded: if path == "#/settings" { Some(route.split('?').next() == Some(path)) } else { None },
                            class: if route.split('?').next() == Some(path) { "nav-link active" } else { "nav-link" },
                            "aria-current": if route.split('?').next() == Some(path) { "page" } else { "false" },
                            Icon {
                                name: icon,
                            }
                            {tr(&label)}
                        }
                    }
                    if route.split('?').next() == Some("#/settings") {
                        settings::SettingsNav { route: route.clone() }
                    }
                }
                div {
                    class: "mt-auto p-5 text-xs muted leading-5 border-t border-border",
                    Icon {
                        name: "shield-check",
                        size: 16,
                    }
                    p {
                        class: "mt-2",
                        {tr("음성은 이 컴퓨터에서 처리됩니다.")}
                    }
                    a {
                        href: "#/settings?pane=about",
                        class: "inline-block mt-3 hover:underline",
                        {tr("버전 1.1.64")}
                    }
                }
            }
            main {
                class: "min-w-0 min-h-0 flex-1 overflow-auto",
                if let Some(error) = hotkey_error {
                    div {
                        class: "banner",
                        role: "alert",
                        "단축키 등록을 확인해 주세요: {error}"
                        a {
                            href: "#/settings?pane=general",
                            {tr("설정 열기")}
                        }
                    }
                }
                if route.starts_with("#/settings") {
                    settings::Settings {

                    }
                } else if route == "#/history" {
                    history::History {

                    }
                } else if route == "#/account" || route == "#/upgrade" {
                    div {
                        class: "page empty-state",
                        Icon {
                            name: "shield-check",
                            size: 40,
                        }
                        h1 {
                            class: "page-title",
                            {tr("계정 없이 사용하는 로컬 받아쓰기")}
                        }
                        p {
                            class: "page-description",
                            {tr("이 버전은 로그인과 구독이 필요하지 않습니다.")}
                        }
                        a {
                            href: "#/",
                            class: "btn mt-4",
                            {tr("홈으로")}
                        }
                    }
                } else {
                    Home {

                    }
                }
            }
        }
    }
}

#[component]
fn Home() -> Element {
    let mut state = use_context::<Signal<AppState>>();
    let snapshot = state.read().clone();
    let is_recording = snapshot.pipeline == "recording";
    let is_idle = snapshot.pipeline == "idle";
    let shortcut = snapshot.config["hotkey"].as_str().unwrap_or("Fn");
    let status = match snapshot.pipeline.as_str() {
        "preparing" => "마이크를 준비하고 있습니다",
        "recording" => "듣고 있습니다. 편하게 말씀하세요.",
        "transcribing" => "음성을 글로 옮기고 있습니다",
        "outputting" => "텍스트를 입력하고 있습니다",
        _ => "말하는 순간, 글이 됩니다.",
    };
    let last_text = snapshot.final_text.clone();
    rsx! {
        div {
            class: "page space-y-7",
            header {
                class: "flex items-start justify-between gap-4",
                div {

                    p {
                        class: "eyebrow",
                        "YOUR VOICE, YOUR WORDS"
                    }
                    h1 {
                        class: "page-title mt-2",
                        {tr("오늘도 편하게 말하세요")}
                    }
                    p {
                        class: "page-description",
                        {tr("한국어 음성 입력, 내 컴퓨터 안에서.")}
                    }
                }
                span {
                    class: "badge",
                    Icon {
                        name: "cloud-off",
                        size: 14,
                    }
                    {tr("오프라인 준비")}
                }
            }
            section {
                class: "recording-card",
                "aria-label": "받아쓰기",
                div {
                    class: "flex items-center gap-2 text-sm muted",
                    span {
                        class: "status-dot",
                    }
                    {tr("로컬 Whisper")}
                }
                div {
                    class: "py-10 flex flex-col items-center text-center gap-5",
                    button {
                        class: if is_recording { "record-button recording" } else { "record-button" },
                        disabled: snapshot.busy || (!is_idle && !is_recording) || snapshot.local_model.is_none(),
                        "aria-label": if is_recording { tr("녹음 종료 및 전사") } else { tr("받아쓰기 시작") },
                        onclick: move |_| {
                            spawn(async move {
                                state.write().error = None;
                                state.write().busy = true;
                                let command = if is_recording {
                                    "stop_recording"
                                } else {
                                    "start_recording"
                                };
                                if let Err(error) = invoke(command, json!({})).await {
                                    state.write().error = Some(error);
                                }
                                state.write().busy = false;
                            });
                        },
                        Icon {
                            name: if is_recording { "square" } else { "mic" },
                            size: 36,
                        }
                    }
                    div {

                        h2 {
                            class: "text-xl font-semibold",
                            {tr(status)}
                        }
                        p {
                            class: "muted mt-2",
                            kbd {

                                "{shortcut}"
                            }
                            {tr(" 단축키로 어디서든 입력하세요.")}
                        }
                    }
                    if !is_idle {
                        button {
                            class: "btn-secondary",
                            onclick: move |_| {
                                spawn(async move {
                                    if let Err(error) = invoke("abort_recording", json!({})).await {
                                        state.write().error = Some(error);
                                    }
                                });
                            },
                            {tr("취소")}
                        }
                    }
                }
                if !snapshot.transcript.is_empty() {
                    p {
                        class: "transcript",
                        "{snapshot.transcript}"
                    }
                }
                if !last_text.is_empty() {
                    div {
                        class: "transcript flex items-start gap-3",
                        p {
                            class: "flex-1 select-text whitespace-pre-wrap",
                            "{last_text}"
                        }
                        button {
                            class: "btn-secondary",
                            onclick: move |_| {
                                let text = last_text.clone();
                                spawn(async move {
                                    match invoke("ui_copy", json!({ "text" : text })).await {
                                        Ok(_) => {
                                            state.write().notice = Some(
                                                "텍스트를 복사했습니다.".into(),
                                            );
                                        }
                                        Err(error) => state.write().error = Some(error),
                                    }
                                });
                            },
                            {tr("복사")}
                        }
                    }
                }
            }
            div {
                class: "grid grid-cols-1 md:grid-cols-3 gap-4",
                for (icon , title , text , path) in [
                    (
                        "keyboard",
                        "어디서든 입력",
                        "원하는 입력창에서 단축키를 누르세요.",
                        "#/settings?pane=general",
                    ),
                    (
                        "book-open",
                        "나만의 단어",
                        "이름과 전문 용어를 사전에 추가하세요.",
                        "#/settings?pane=dictionary",
                    ),
                    (
                        "history",
                        "이전 기록",
                        "지난 받아쓰기를 다시 확인하세요.",
                        "#/history",
                    ),
                ]
                {
                    a {
                        href: path,
                        class: "card feature-card",
                        Icon {
                            name: icon,
                            size: 24,
                        }
                        h2 {
                            class: "font-semibold mt-4",
                            {tr(&title)}
                        }
                        p {
                            class: "muted text-sm mt-2 leading-6",
                            "{text}"
                        }
                    }
                }
            }
            section {
                class: "space-y-3",
                div {
                    class: "flex items-center justify-between",
                    h2 {
                        class: "section-title",
                        {tr("최근 기록")}
                    }
                    a {
                        href: "#/history",
                        class: "text-sm muted hover:underline",
                        {tr("전체 보기")}
                    }
                }
                if snapshot.history.is_empty() {
                    div {
                        class: "card empty-state",
                        p {

                            {tr("첫 문장을 말해 보세요")}
                        }
                        p {
                            class: "muted text-sm mt-2",
                            {tr("받아쓰기 결과가 여기에 차곡차곡 모입니다.")}
                        }
                    }
                } else {
                    for entry in snapshot.history.iter().take(3) {
                        HistoryPreview {
                            entry: entry.clone(),
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn HistoryPreview(entry: serde_json::Value) -> Element {
    let text = entry["polished_text"]
        .as_str()
        .filter(|text| !text.is_empty())
        .unwrap_or(entry["raw_text"].as_str().unwrap_or(""));
    let date = entry["created_at"].as_str().unwrap_or("");
    rsx! {
        div {
            class: "card flex items-start gap-4",
            Icon {
                name: "file-text",
                size: 18,
            }
            div {
                class: "min-w-0",
                p {
                    class: "line-clamp-2 select-text",
                    "{text}"
                }
                p {
                    class: "muted text-xs mt-2",
                    "{date}"
                }
            }
        }
    }
}
