# Dioxus UI 전환 검증

검증일: 2026-11-17

## 구현 범위

앱 엔트리를 Rust/Dioxus WebAssembly로 전환했다. 홈, 기록, 일반·모델·사전·장면·정보 설정, 첫 실행, 캡슐, 로컬 전용 Ask 안내 화면을 Tailwind CSS와 shadcn 스타일로 구성했다. Kubai Icons 0.10.0 JS를 로컬 번들로 사용한다. 기존 React 화면은 회귀 테스트용으로 유지하며 런타임에 마운트하지 않는다.

## 실행한 검증

- `CARGO_HOME=/tmp/typeless-dioxus-cargo npm run build`: 성공. Cargo `--frozen`, TypeScript, Vite 프로덕션 번들 검증. JS 번들 크기 경고(588.64 kB)는 남아 있다.
- WASM 대상 `cargo check --frozen --tests`: 성공. Rust 테스트는 컴파일만 확인했고 실행하지 않았다.
- UI 관련 Vitest 8개 파일, 42개 테스트: 모두 통과.
- 전체 Vitest: 509개 중 416개 통과, 93개 실패. 변경 전 기준은 497개 중 404개 통과, 93개 실패이며, 실패한 파일·테스트 이름의 집합이 동일하다. 기존 Node 26 localStorage 및 인증·클라우드 테스트 문제를 이번 UI 전환에서 수정하지 않았다.
- 변경한 Dioxus TypeScript 및 테스트 ESLint, `git diff --check`: 통과.

브라우저에서는 실제 WASM과 메모리 테스트 백엔드를 연결해 다음을 확인했다. 테스트 화면은 네이티브 기능을 실행하지 않는다는 배너를 표시하며 배포 번들에 포함하지 않는다.

- 홈, 설정, 기록, 온보딩, Ask 안내, 캡슐 렌더링과 Kubai SVG 로드
- 저장 전 일반 설정을 보존하면서 장면을 저장하고, 명시적 저장으로 일반 설정 반영
- 사전·교정 추가, 기록 검색·복사·교정 대화상자, Escape와 초점 관리
- 모델 없는 온보딩 진행 제한, 명시적 사용자 동작 없는 마이크 요청 방지
- 한국어·영어 전환과 언어 저장, 초기 언어 선택값 일치
- 다크 테마와 720×540 화면의 수평 넘침 없음
- 음량 이벤트 반복 시 캡슐 네이티브 크기 변경 호출 증가 없음
- 최종 브라우저 오류 0건

검증 화면 캡처는 로컬 `.tools/ui-preview/`에 있다. 사용자 기록·모델을 테스트 데이터로 대체하거나 수정하지 않았다.

## 남은 검증 경계

마이크 녹음, 모델 다운로드, 실제 OS 단축키·창 위치 동작은 검증하지 않았다.

## 후속 네이티브 검증

사용자 터미널에서 `whisper-rs-sys 0.14.1` 빌드가 `cmake` 실행 파일을 찾지 못해 실패한 것을 확인했다. 이미 설치된 `.tools/cmake/bin/cmake`를 `CMAKE`에 연결하자 네이티브 개발 빌드와 프로세스 시작이 성공했다. `scripts/tauri.mjs`가 해당 로컬 도구를 자동으로 연결하도록 수정했으며 기존 `CMAKE` 지정은 보존한다. 새 외부 도구를 설치하지 않았다.

`CARGO_HOME=/tmp/typeless-dioxus-cargo CARGO_NET_OFFLINE=true npm run tauri build -- --debug --bundles app`도 성공했다. 생성 결과는 `src-tauri/target/debug/bundle/macos/TypelessLocal.app`이다. 이 번들을 실제 실행하여 `tauri://localhost`의 Dioxus 홈, 탐색 메뉴, Kubai 아이콘과 기존 로컬 기록 표시를 macOS 창에서 확인했다. 개발 서버가 없는 상태로 실행했다. 개발용 디버그 번들이며 릴리스 서명·공증은 검증하지 않았다.

실제 앱에 `Failed to create macOS native hotkey EventTap; Accessibility permission may be denied` 경고가 표시됐다. 손쉬운 사용 권한은 변경하지 않았다. 앱 실행 성공과 전역 단축키 사용 가능 여부는 구별해야 한다.

기본 Cargo 캐시의 UI 재빌드는 승인 범위 밖 `async-tungstenite 0.31.0` 다운로드 요청으로 자동 승인 심사에서 거절됐다. 해당 패키지를 새로 설치하지 않았으며, 검토된 별도 캐시와 네트워크 다운로드를 금지하는 `--frozen`으로 빌드했다. 새 환경의 의존성 설치에는 AGENTS.md 보안 절차가 필요하다. 설치 검토·예외 승인 근거는 [보안 기록](security/dioxus-ui/toolchain-review.md)을 참조한다.
