use serde_json::Value;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["window", "typeless"], js_name = invoke)]
    fn invoke_js(command: &str, args: &str) -> js_sys::Promise;
}

pub async fn invoke(command: &str, args: Value) -> Result<Value, String> {
    let value = JsFuture::from(invoke_js(command, &args.to_string()))
        .await
        .map_err(|error| error.as_string().unwrap_or_else(|| format!("{error:?}")))?;
    serde_json::from_str(&value.as_string().ok_or("잘못된 앱 응답입니다.")?)
        .map_err(|error| error.to_string())
}
