# TypelessLocal Dioxus UI

이 디렉터리는 Tauri 2 백엔드를 사용하는 Dioxus 0.7.3 WebAssembly 프런트엔드입니다. 화면과 사용자 상태는 Rust/Dioxus로 렌더링하고, 기존 Tauri JavaScript API는 `src/dioxus-bridge.ts`에서 네이티브 기능을 연결합니다. React 화면은 기존 회귀 테스트를 위해 남아 있으며 앱 엔트리포인트에서 사용하지 않습니다.

## 화면

- 홈: 로컬 받아쓰기 시작/종료/취소, 실시간 전사, 결과 복사, 최근 기록
- 설정: 일반 설정, 로컬 모델, 사전·교정, 장면, 앱 정보
- 기록: 검색, 원문 보기, 복사, 교정 규칙 만들기, 삭제 확인
- 첫 실행: 소개 → 모델 준비 → 권한 확인 → 완료
- 별도 창: 녹음 캡슐, Ask 패널

계정·구독·원격 LLM은 기존 로컬 전용 빌드와 같이 활성화하지 않습니다. 기존 설정 객체의 알 수 없는 필드는 유지하고 저장 시 제공자 API 키를 제거합니다. 저장된 음성 모델·기록 데이터 경로는 바꾸지 않습니다.

## 빌드 도구

필요한 도구는 Rust 1.88.0 이상, `wasm32-unknown-unknown` 표준 라이브러리, Cargo.lock의 wasm-bindgen 버전과 같은 버전의 `wasm-bindgen` CLI입니다. Dioxus CLI는 `.tools/bin/dx`에 설치했습니다.

새 도구 설치·업데이트는 먼저 프로젝트의 AGENTS.md 설치 보안 절차를 따르세요. 현재 검사·승인 기록은 `../docs/security/dioxus-ui/`에 있습니다. 빌드 스크립트는 도구를 자동 설치하거나 바이너리를 내려받지 않습니다.

`wasm-bindgen`을 `.tools/bin/wasm-bindgen`에 두거나 `WASM_BINDGEN` 환경 변수로 실행 경로를 지정합니다. `CARGO_HOME`으로 별도 패키지 캐시를 사용할 수 있습니다.

```sh
CARGO_HOME=/tmp/typeless-dioxus-cargo npm run dev
CARGO_HOME=/tmp/typeless-dioxus-cargo npm run build
npm run check:ui
npm run test:ui
npm test
CARGO_HOME=/tmp/typeless-dioxus-cargo CARGO_NET_OFFLINE=true npm run tauri dev
CARGO_HOME=/tmp/typeless-dioxus-cargo CARGO_NET_OFFLINE=true npm run tauri build -- --debug --bundles app
```

`npm run dev`는 첫 WebAssembly 빌드 후 Vite를 시작하고 Rust 파일 변경 시 다시 빌드합니다. 프로덕션 빌드는 Cargo.lock을 고정하고 네트워크 다운로드를 금지하는 `--frozen`으로 Rust를 빌드하고, wasm-bindgen 결과를 `public/dioxus/`에 생성한 뒤 Vite가 Tailwind CSS와 로컬 Kubai JS를 번들링합니다. 생성 파일과 도구 바이너리는 Git에 넣지 않습니다.

`npm run tauri`는 설치된 Tauri CLI를 실행하며 `.tools/cmake/bin/cmake`가 있으면 네이티브 Whisper 빌드에 연결합니다. 명시한 `CMAKE` 환경 변수는 그대로 유지합니다. CMake를 자동 설치하지 않으므로 다른 환경에서는 별도로 준비해야 합니다. `tauri dev`는 개발 서버를 사용하는 앱 창을 띄우고, 위 `tauri build` 명령은 서버 없이 실행할 수 있는 디버그 macOS `.app`을 생성합니다.

## 검증 경계

브라우저에서 네이티브 백엔드가 없는 경우 오류를 명시합니다. 가짜 녹음 결과나 샘플 사용자 기록을 실제 데이터처럼 표시하지 않습니다. 마이크 권한 요청은 사용자가 해당 버튼을 눌렀을 때만 실행하며, 테스트는 실제 녹음·모델 다운로드를 실행하지 않습니다.

기본 Cargo 캐시를 사용하는 재빌드는 승인 범위 밖의 `async-tungstenite` 다운로드 요청으로 자동 승인 심사에서 차단됐습니다. 위 명령은 이미 검토한 캐시를 사용하는 이 세션의 실행 예입니다. 캐시가 삭제된 새 환경에서는 설치 보안 절차에 따라 의존성 소스를 준비해야 합니다. 빌드가 의존성을 자동으로 내려받도록 우회하지 마세요.

언어 선택과 기존 10개 언어 번역 자료를 연결했습니다. 새 화면 문구에 기존 번역이 없으면 영어 기본 문구를 사용합니다. 받아쓰기 원문과 사용자 작성 장면은 번역하지 않습니다.
