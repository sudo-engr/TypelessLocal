use dioxus::prelude::*;
use serde_json::{json, Value};

use crate::bridge::invoke;
use crate::state::{local_config, refresh, AppState};
use crate::ui::{tr, Icon};

fn value_string(value: &Value, key: &str) -> String {
    value
        .get(key)
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_owned()
}

fn value_number(value: &Value, key: &str) -> f64 {
    value.get(key).and_then(Value::as_f64).unwrap_or(0.0)
}

#[derive(Clone, Copy, Debug, PartialEq)]
enum ModelChoice {
    Turbo,
    Large,
}

impl ModelChoice {
    fn id(self) -> &'static str {
        match self {
            Self::Turbo => "large-v3-turbo",
            Self::Large => "large-v3",
        }
    }

    fn label(self) -> &'static str {
        match self {
            Self::Turbo => "large-v3-turbo · 574 MB",
            Self::Large => "large-v3 · 1.08 GB",
        }
    }

    fn bytes(self) -> f64 {
        match self {
            Self::Turbo => 574_041_195.0,
            Self::Large => 1_081_140_203.0,
        }
    }
}

fn model_choice_for_id(id: &str) -> ModelChoice {
    if id == ModelChoice::Large.id() {
        ModelChoice::Large
    } else {
        ModelChoice::Turbo
    }
}

#[component]
pub fn Onboarding() -> Element {
    let state = use_context::<Signal<AppState>>();
    let mut step = use_signal(|| 0usize);
    let saving = use_signal(|| false);
    let error = use_signal(|| None::<String>);

    let next = {
        let mut state = state;
        move |_| {
            let mut saving = saving;
            let mut error = error;
            let mut step = step;
            spawn(async move {
                if *step.read() < 3 {
                    let config = local_config(state.read().config.clone());
                    if let Err(message) =
                        invoke("update_config", json!({ "config": config.clone() })).await
                    {
                        error.set(Some(message));
                    } else {
                        state.write().config = config.clone();
                        state.write().saved_config = config;
                    }
                    step += 1;
                    return;
                }
                saving.set(true);
                // Keep the local-only invariant at the final persistence boundary.
                let config = local_config(state.read().config.clone());
                match invoke("update_config", json!({ "config": config.clone() })).await {
                    Ok(_) => match invoke("ui_complete_onboarding", Value::Null).await {
                        Ok(_) => {
                            state.write().config = config.clone();
                            state.write().saved_config = config;
                            state.write().onboarded = true;
                            state.write().route = "#/".to_owned();
                        }
                        Err(message) => error.set(Some(message)),
                    },
                    Err(message) => error.set(Some(message)),
                }
                saving.set(false);
            });
        }
    };

    let back = move |_| {
        if *step.read() > 0 {
            step -= 1;
        }
    };

    let title = match *step.read() {
        0 => "TypelessLocal 로컬 받아쓰기",
        1 => "한국어 모델 준비",
        2 => "권한 확인",
        _ => "준비가 끝났습니다",
    };
    let subtitle = match *step.read() {
        0 => "첫 모델을 준비하면 받아쓰기를 이 컴퓨터에서 처리합니다.",
        1 => "Whisper 모델을 선택해 다운로드하거나 기존 파일을 검증합니다.",
        2 => "음성 녹음과 결과 입력에 필요한 권한만 확인합니다.",
        _ => "이제 어디서든 단축키로 로컬 받아쓰기를 시작할 수 있습니다.",
    };
    let current = *step.read();

    rsx! {
        main {
            class: "flex h-full min-h-0 flex-col bg-background text-foreground",
            header {
                class: "flex items-center justify-between border-b px-5 py-3",
                "data-tauri-drag-region": "true",
                div {
                    class: "flex items-center gap-2",
                    Icon {
                        name: "mic",
                        size: 20,
                    }
                    span {
                        class: "text-sm font-semibold",
                        "TypelessLocal"
                    }
                }
                span {
                    class: "badge",
                    {tr("로컬 전용")}
                }
            }
            div {
                class: "flex items-center justify-center gap-2 px-8 pt-5",
                for index in 0..4 {
                    span {
                        class: if index == current { "h-2 w-8 rounded-full bg-primary" } else { "h-2 w-2 rounded-full bg-muted" },
                        aria_label: tr("진행 단계"),
                    }
                }
            }
            section {
                class: "min-h-0 flex-1 overflow-y-auto px-8 py-6",
                div {
                    class: "mx-auto max-w-2xl",
                    h1 {
                        class: "page-title text-center",
                        {tr(&title)}
                    }
                    p {
                        class: "page-description mx-auto max-w-lg text-center",
                        {tr(&subtitle)}
                    }
                    if let Some(message) = error.read().as_ref() {
                        p {
                            class: "mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
                            role: "alert",
                            "{message}"
                        }
                    }
                    div {
                        class: "mt-6",
                        match current {
                            0 => rsx! {
                                div {
                                    class: "card mx-auto max-w-xl p-8 text-center",
                                    div {
                                        class: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary",
                                        Icon {
                                            name: "mic",
                                            size: 32,
                                        }
                                    }
                                    h2 {
                                        class: "mt-5 text-xl font-semibold",
                                        {tr("빠르고 사적인 받아쓰기")}
                                    }
                                    p {
                                        class: "muted mx-auto mt-2 max-w-md",
                                        {tr("모델을 한 번 준비하면 음성은 이 컴퓨터를 떠나지 않습니다. 계정이나 API 키도 필요하지 않습니다.")}
                                    }
                                    div {
                                        class: "mt-6 grid gap-3 text-left sm:grid-cols-3",
                                        Feature {
                                            icon: "shield-check",
                                            title: "로컬 처리",
                                            text: "전사는 기기에서 실행",
                                        }
                                        Feature {
                                            icon: "keyboard",
                                            title: "단축키",
                                            text: "어디서든 바로 시작",
                                        }
                                        Feature {
                                            icon: "zap",
                                            title: "간단한 설정",
                                            text: "필요한 권한만 확인",
                                        }
                                    }
                                }
                            },
                            1 => rsx! {
                                LocalModelPane {

                                }
                            },
                            2 => rsx! {
                                Diagnostics {

                                }
                            },
                            _ => rsx! {
                                div {
                                    class: "card mx-auto max-w-xl p-8 text-center",
                                    div {
                                        class: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary",
                                        Icon {
                                            name: "circle-check",
                                            size: 28,
                                        }
                                    }
                                    h2 {
                                        class: "mt-4 text-xl font-semibold",
                                        {tr("로컬 받아쓰기를 시작할 수 있습니다")}
                                    }
                                    p {
                                        class: "muted mt-2",
                                        {tr("완료를 누르면 메인 화면으로 이동합니다.")}
                                    }
                                }
                            },
                        }
                    }
                }
            }
            footer {
                class: "flex items-center justify-between border-t px-8 py-4",
                button {
                    class: "btn btn-secondary",
                    disabled: current == 0,
                    onclick: back,
                    {tr("이전")}
                }
                button {
                    class: "btn",
                    disabled: *saving.read() || (current == 1 && state.read().local_model.is_none()),
                    onclick: next,
                    if *saving.read() {
                        {tr("저장 중…")}
                    } else if current == 3 {
                        {tr("시작하기")}
                    } else {
                        {tr("계속")}
                    }
                }
            }
        }
    }
}

#[component]
fn Feature(icon: &'static str, title: &'static str, text: &'static str) -> Element {
    rsx! {
        div {
            class: "rounded-lg border bg-muted/30 p-3",
            Icon {
                name: icon,
                size: 18,
            }
            p {
                class: "mt-2 text-sm font-medium",
                {tr(&title)}
            }
            p {
                class: "muted mt-1 text-xs",
                {tr(text)}
            }
        }
    }
}

#[component]
pub fn LocalModelPane() -> Element {
    let state = use_context::<Signal<AppState>>();
    let initial_choice = state
        .read()
        .local_model
        .as_ref()
        .map(|model| model_choice_for_id(&value_string(model, "model_id")))
        .unwrap_or(ModelChoice::Turbo);
    let mut choice = use_signal(move || initial_choice);
    let mut path = use_signal(|| {
        state
            .read()
            .local_model
            .as_ref()
            .map(|model| value_string(model, "path"))
            .unwrap_or_default()
    });
    let mut sha256 = use_signal(|| {
        state
            .read()
            .local_model
            .as_ref()
            .map(|model| value_string(model, "sha256"))
            .unwrap_or_default()
    });
    let busy = use_signal(|| false);
    let mut message = use_signal(|| None::<String>);
    let mut operation = use_signal(|| None::<&'static str>);

    let model = state.read().local_model.clone();
    let model_id = model.as_ref().map(|v| value_string(v, "model_id"));
    let progress = state.read().model_progress.clone();
    let selected_choice = *choice.read();
    let progress_total = value_number(&progress, "total").max(if *busy.read() {
        selected_choice.bytes()
    } else {
        0.0
    });
    let progress_received = value_number(&progress, "received");
    let progress_phase = match value_string(&progress, "phase").as_str() {
        "verifying" => "verifying",
        _ if *busy.read() => "downloading",
        _ => "",
    };
    let selected_model_ready = model_id.as_deref() == Some(selected_choice.id());
    let progress_percent = if progress_total > 0.0 {
        (progress_received / progress_total * 100.0).clamp(0.0, 100.0)
    } else {
        0.0
    };

    let download = move |_| {
        let mut state = state;
        let mut busy = busy;
        let mut message = message;
        let mut operation = operation;
        let id = choice.read().id().to_owned();
        spawn(async move {
            busy.set(true);
            message.set(None);
            operation.set(Some("download"));
            match invoke("download_local_model", json!({ "modelId": id })).await {
                Ok(model) => {
                    operation.set(None);
                    path.set(value_string(&model, "path"));
                    sha256.set(value_string(&model, "sha256"));
                    choice.set(model_choice_for_id(&value_string(&model, "model_id")));
                    state.write().local_model = Some(model);
                    state.write().notice =
                        Some("모델을 다운로드하고 SHA-256을 검증했습니다.".to_owned());
                    if let Err(error) = refresh(state).await {
                        message.set(Some(error));
                    }
                }
                Err(error) => message.set(Some(error)),
            }
            busy.set(false);
        });
    };

    let configure = move |_| {
        let mut state = state;
        let mut busy = busy;
        let mut message = message;
        let mut operation = operation;
        let path_value = path.read().trim().to_owned();
        let hash_value = sha256.read().trim().to_lowercase();
        operation.set(Some("manual"));
        if path_value.is_empty()
            || hash_value.len() != 64
            || !hash_value.chars().all(|c| c.is_ascii_hexdigit())
        {
            message.set(Some(
                "모델 경로와 64자리 SHA-256 해시를 입력하세요.".to_owned(),
            ));
            return;
        }
        spawn(async move {
            busy.set(true);
            message.set(None);
            operation.set(Some("manual"));
            match invoke(
                "configure_local_model",
                json!({ "path": path_value, "sha256": hash_value }),
            )
            .await
            {
                Ok(model) => {
                    operation.set(None);
                    path.set(value_string(&model, "path"));
                    sha256.set(value_string(&model, "sha256"));
                    choice.set(model_choice_for_id(&value_string(&model, "model_id")));
                    state.write().local_model = Some(model);
                    state.write().notice = Some("모델 파일을 검증하고 활성화했습니다.".to_owned());
                    if let Err(error) = refresh(state).await {
                        message.set(Some(error));
                    }
                }
                Err(error) => message.set(Some(error)),
            }
            busy.set(false);
        });
    };

    rsx! {
        section {
            class: "space-y-5",
            div {
                class: "card p-5",
                div {
                    class: "flex items-start gap-3",
                    Icon {
                        name: "download",
                        size: 22,
                    }
                    div {

                        h2 {
                            class: "text-lg font-semibold",
                            {tr("한국어 Whisper 모델")}
                        }
                        p {
                            class: "muted mt-1",
                            {tr("다운로드와 SHA-256 검증은 앱에서 처리합니다.")}
                        }
                    }
                }
                fieldset {
                    class: "mt-5 space-y-2",
                    disabled: *busy.read(),
                    legend {
                        class: "section-title",
                        {tr("모델 선택")}
                    }
                    for option in [ModelChoice::Turbo, ModelChoice::Large] {
                        label {
                            class: "flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5",
                            input {
                                r#type: "radio",
                                name: "local-model",
                                checked: *choice.read() == option,
                                onchange: move |_| {
                                    choice.set(option);
                                    operation.set(None);
                                    message.set(None);
                                },
                            }
                            span {

                                span {
                                    class: "block text-sm font-medium",
                                    "{option.label()}"
                                }
                                span {
                                    class: "muted mt-1 block text-xs",
                                    if option == ModelChoice::Turbo {
                                        {tr("빠른 처리를 위한 권장 모델입니다.")}
                                    } else {
                                        {tr("정확도를 우선하는 기본 모델입니다.")}
                                    }
                                }
                            }
                        }
                    }
                }
                button {
                    class: "btn mt-4 w-full",
                    disabled: *busy.read() || selected_model_ready,
                    onclick: download,
                    Icon {
                        name: "download",
                        size: 16,
                    }
                    if *busy.read() {
                        {tr("모델 준비 중…")}
                    } else if selected_model_ready {
                        {tr("모델 준비 완료")}
                    } else if *operation.read() == Some("download") {
                        {tr("다시 시도")}
                    } else {
                        {tr("모델 다운로드 및 설정")}
                    }
                }
                if progress_total > 0.0 && *busy.read() {
                    div {
                        class: "mt-4 space-y-2",
                        role: "status",
                        aria_live: "polite",
                        div {
                            class: "flex justify-between text-xs text-muted-foreground",
                            span {

                                if progress_phase == "verifying" {
                                    {tr("SHA-256 검증 중")}
                                } else {
                                    {tr("다운로드 중")}
                                }
                            }
                            span {

                                "{progress_percent:.0}%"
                            }
                        }
                        div {
                            class: "h-2 overflow-hidden rounded-full bg-muted",
                            role: "progressbar",
                            aria_valuenow: "{progress_percent}",
                            aria_valuemin: "0",
                            aria_valuemax: "100",
                            div {
                                class: "h-full rounded-full bg-primary transition-all",
                                style: "width: {progress_percent}%",
                            }
                        }
                    }
                }
            }
            details {
                class: "card p-5",
                summary {
                    class: "cursor-pointer text-sm font-medium",
                    {tr("기존 모델 파일 직접 가져오기")}
                }
                div {
                    class: "mt-4 space-y-3",
                    label {
                        class: "field",
                        {tr("모델 파일 경로")}
                        input {
                            class: "input",
                            value: "{path}",
                            placeholder: "/Users/you/Models/ggml-large-v3-turbo.bin",
                            oninput: move |event| path.set(event.value()),
                        }
                    }
                    label {
                        class: "field",
                        {tr("예상 SHA-256")}
                        input {
                            class: "input",
                            value: "{sha256}",
                            placeholder: tr("64자리 SHA-256 해시"),
                            oninput: move |event| sha256.set(event.value()),
                        }
                    }
                    button {
                        class: "btn btn-secondary w-full",
                        disabled: *busy.read(),
                        onclick: configure,
                        Icon {
                            name: "shield-check",
                            size: 16,
                        }
                        {tr("수동 모델 검증 및 활성화")}
                    }
                }
            }
            if let Some(ref id) = model_id {
                div {
                    class: "rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary",
                    role: "status",
                    p {
                        class: "font-medium",
                        {tr("등록된 로컬 모델")}
                    }
                    p {
                        class: "mt-1 break-all text-xs",
                        "{id}"
                    }
                }
            }
            if let Some(error) = message.read().as_ref() {
                p {
                    class: "rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
                    role: "alert",
                    {tr(&error)}
                }
            }
        }
    }
}

#[component]
pub fn Diagnostics() -> Element {
    let state = use_context::<Signal<AppState>>();
    let checking = use_signal(|| false);
    let error = use_signal(|| None::<String>);
    let accessibility = use_signal(|| None::<bool>);

    // Diagnostics are safe to run on mount: unlike the explicit microphone
    // action below, they never request an audio stream.
    {
        let mut state = state;
        let mut checking = checking;
        let mut error = error;
        let mut accessibility = accessibility;
        use_effect(move || {
            spawn(async move {
                checking.set(true);
                match invoke("get_system_diagnostics", Value::Null).await {
                    Ok(report) => state.write().diagnostics = report,
                    Err(message) => error.set(Some(message)),
                }
                match invoke("check_accessibility_permission", Value::Null).await {
                    Ok(trusted) => accessibility.set(trusted.as_bool()),
                    Err(message) => error.set(Some(message)),
                }
                checking.set(false);
            });
        });
    }

    let check = move |_| {
        let mut state = state;
        let mut checking = checking;
        let mut error = error;
        let mut accessibility = accessibility;
        spawn(async move {
            checking.set(true);
            error.set(None);
            match invoke("get_system_diagnostics", Value::Null).await {
                Ok(report) => state.write().diagnostics = report,
                Err(message) => error.set(Some(message)),
            }
            match invoke("check_accessibility_permission", Value::Null).await {
                Ok(trusted) => accessibility.set(trusted.as_bool()),
                Err(message) => error.set(Some(message)),
            }
            checking.set(false);
        });
    };

    let diagnostics = state.read().diagnostics.clone();
    let rows = diagnostics
        .get("rows")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();
    rsx! {
        section {
            class: "space-y-5",
            p {
                class: "page-description",
                {tr("녹음과 결과 입력에 필요한 권한만 확인합니다. 음성 데이터는 진단을 위해 외부로 전송되지 않습니다.")}
            }
            div {
                class: "card p-5",
                div {
                    class: "flex items-center justify-between",
                    h2 {
                        class: "text-lg font-semibold",
                        {tr("기기 권한")}
                    }
                    div {
                        class: "flex gap-2",
                        button {
                            class: "btn btn-secondary",
                            disabled: *checking.read(),
                            onclick: move |_| {
                                let mut state = state;
                                let mut checking = checking;
                                let mut error = error;
                                let mut accessibility = accessibility;
                                spawn(async move {
                                    checking.set(true);
                                    error.set(None);
                                    match invoke("ui_request_microphone", Value::Null).await {
                                        Ok(_) => {
                                            match invoke("get_system_diagnostics", Value::Null).await {
                                                Ok(report) => state.write().diagnostics = report,
                                                Err(message) => error.set(Some(message)),
                                            }
                                        }
                                        Err(message) => error.set(Some(message)),
                                    }
                                    match invoke("check_accessibility_permission", Value::Null).await {
                                        Ok(trusted) => accessibility.set(trusted.as_bool()),
                                        Err(message) => error.set(Some(message)),
                                    }
                                    checking.set(false);
                                });
                            },
                            Icon {
                                name: "mic",
                                size: 16,
                            }
                            {tr("마이크 확인")}
                        }
                        button {
                            class: "btn btn-secondary",
                            disabled: *checking.read(),
                            onclick: check,
                            Icon {
                                name: "refresh-cw",
                                size: 16,
                            }
                            if *checking.read() {
                                {tr("확인 중…")}
                            } else {
                                {tr("다시 확인")}
                            }
                        }
                    }
                }
                div {
                    class: "mt-4 space-y-2",
                    for row in rows.iter() {
                        DiagnosticRow {
                            row: row.clone(),
                        }
                    }
                    if rows.is_empty() {
                        p {
                            class: "empty-state",
                            {tr("권한 상태를 확인하려면 버튼을 누르세요.")}
                        }
                    }
                }
                p {
                    class: "muted mt-3 text-xs",
                    {tr("진단은 입력 장치 준비 상태를 확인합니다. macOS 마이크 권한 요청은 ‘마이크 확인’을 눌렀을 때만 실행됩니다.")}
                }
            }
            div {
                class: "card p-5",
                h2 {
                    class: "text-sm font-semibold",
                    {tr("macOS 손쉬운 사용")}
                }
                p {
                    class: "muted mt-1",
                    {tr("단축키와 받아쓰기 결과를 다른 앱에 입력하려면 허용이 필요합니다.")}
                }
                p {
                    class: "mt-2 text-xs",
                    if accessibility() == Some(true) {
                        {tr("현재 허용됨")}
                    } else if accessibility() == Some(false) {
                        {tr("허용 필요")}
                    } else {
                        {tr("상태를 확인하는 중…")}
                    }
                }
                button {
                    class: "btn btn-secondary mt-3",
                    onclick: move |_| {
                        let state = state;
                        let mut error = error;
                        let mut accessibility = accessibility;
                        spawn(async move {
                            let result = match invoke("request_accessibility_permission", Value::Null)
                                .await
                            {
                                Ok(_) => {
                                    invoke(
                                            "wait_for_accessibility_permission",
                                            json!({ "timeoutMs" : 60000, "intervalMs" : 1000 }),
                                        )
                                        .await
                                }
                                Err(message) => Err(message),
                            };
                            match result {
                                Ok(trusted) if trusted.as_bool().unwrap_or(false) => {
                                    accessibility.set(Some(true));
                                    if let Err(message) = invoke("resume_hotkey", Value::Null).await {
                                        error.set(Some(message));
                                    }
                                }
                                Ok(_) => {
                                    accessibility.set(Some(false));
                                    error
                                        .set(
                                            Some(
                                                "손쉬운 사용 권한이 아직 허용되지 않았습니다."
                                                    .to_owned(),
                                            ),
                                        )
                                }
                                Err(message) => error.set(Some(message)),
                            }
                            if let Err(message) = refresh(state).await {
                                error.set(Some(message));
                            }
                        });
                    },
                    {tr("허용하기")}
                }
            }
            if let Some(message) = error.read().as_ref() {
                p {
                    class: "text-sm text-destructive",
                    role: "alert",
                    "{message}"
                }
            }
        }
    }
}

#[component]
fn DiagnosticRow(row: Value) -> Element {
    let id = value_string(&row, "id");
    let status = value_string(&row, "status");
    let message = value_string(&row, "message");
    let label = match id.as_str() {
        "microphone" => "마이크 장치",
        "accessibility" => "손쉬운 사용",
        "hotkey" => "전역 단축키",
        "clipboard" => "클립보드",
        "insertion" => "텍스트 입력",
        "platform" => "운영체제",
        _ => "진단 항목",
    };
    let status_label = match status.as_str() {
        "ok" => "정상",
        "notApplicable" => "해당 없음",
        "checking" => "확인 중",
        "error" => "오류",
        _ => "확인 필요",
    };
    let ready = status == "ok" || status == "notApplicable";
    let icon_name: &'static str = if ready {
        "circle-check"
    } else {
        "triangle-alert"
    };
    rsx! {
        div {
            class: "flex items-start gap-3 rounded-lg border p-3",
            div {
                class: if ready { "mt-0.5 text-primary" } else { "mt-0.5 text-warning" },
                Icon {
                    name: icon_name,
                    size: 18,
                }
            }
            div {
                class: "min-w-0 flex-1",
                div {
                    class: "flex items-center gap-2",
                    p {
                        class: "text-sm font-medium",
                        {tr(&label)}
                    }
                    span {
                        class: "badge",
                        {tr(&status_label)}
                    }
                }
                p {
                    class: "muted mt-1 text-xs",
                    "{message}"
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn model_ids_are_stable() {
        assert_eq!(ModelChoice::Turbo.id(), "large-v3-turbo");
        assert_eq!(ModelChoice::Large.id(), "large-v3");
        assert_eq!(model_choice_for_id("large-v3"), ModelChoice::Large);
        assert_eq!(model_choice_for_id("unknown"), ModelChoice::Turbo);
    }

    #[test]
    fn model_sizes_match_download_boundaries() {
        assert_eq!(ModelChoice::Turbo.bytes(), 574_041_195.0);
        assert_eq!(ModelChoice::Large.bytes(), 1_081_140_203.0);
    }
}
