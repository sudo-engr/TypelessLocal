use dioxus::prelude::*;
use wasm_bindgen::prelude::wasm_bindgen;

#[component]
pub fn Icon(name: String, #[props(default = 20)] size: u32) -> Element {
    rsx! { span { class: "kubai-icon-host", "data-kubai-icon": name, "data-size": size.to_string(), "aria-hidden": "true" } }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(catch, js_namespace = ["window", "typeless"], js_name = translate)]
    fn translate_js(text: &str, language: &str) -> Result<String, wasm_bindgen::JsValue>;
}

pub fn tr(text: &str) -> String {
    let language = consume_context::<Memo<String>>();
    let language = language.read();
    translate_js(text, &language).unwrap_or_else(|_| text.to_string())
}
