# Dioxus UI migration: installation review

Date: 2026-11-17 (Asia/Seoul)

## Verdict: CAUTION — Dioxus user override recorded

The user requires an APPROVE verdict before installation, or an explicit override after reviewing evidence. The user explicitly approved Dioxus installation on 2026-11-17 after seeing the source scan result. The hash-verified dx 0.7.3 binary was installed to the repository-local .tools/bin/dx and its version verified. This does not change the scanner verdict. Implementation is in progress.

## Proposed implementation

Keep the existing Tauri backend and its three windows. Replace the React frontend with Dioxus Web (WASM), using Tailwind CSS and Rust components implementing the shadcn visual conventions. React shadcn components cannot be reused as Dioxus components. Preserve the existing configuration/history/dictionary data and local-only behavior.

Migration scope: entrypoint and hash routing; home/history/settings/account/upgrade screens; all onboarding steps; capsule and Ask windows; dialogs, toast and update UI; theme and translations; recording events, clipboard, permissions and window resizing; frontend build commands, Tauri asset/CSP configuration and tests. Existing React hook/state logic needs a real port rather than a visual shell around React.

Kubai source confirmed by the user: https://icons.kubai.design/icons/ . The page links https://github.com/kubai087/kubai-icons . Existing SVG adaptations are documented in src/assets/kubai/README.md. The requested JavaScript implementation should use the framework-free kubai-icons package, bundled locally rather than loading site chunks or a remote CDN at runtime.

## Dioxus source inspection

Candidate inspected: Dioxus v0.7.3 (a concrete review candidate, not a claim of latest version).
Source: https://codeload.github.com/DioxusLabs/dioxus/tar.gz/refs/tags/v0.7.3
SHA-256: 778f834411592a4f0c531a2356afce80374778a482e85c8295ec19db1d98e045

Command: `skillspector scan /tmp/typeless-dioxus-review/dioxus-0.7.3 --no-llm --format json --output /tmp/typeless-dioxus-review/scan.json`

SkillSpector 2.11.2 returned score 100/100, CRITICAL, DO_NOT_INSTALL. There are 316 findings: 148 HIGH, 141 MEDIUM, 27 LOW, including duplicate/overlapping pattern matches. Analysis is partial: 0/1307 components fully inspected, reported coverage 0%. This does not mean no static patterns were scanned; it means full inspection was not established. See dioxus-0.7.3.scan.json for exact evidence and limitations.

Manual source checks:

- `.github/actions/free-disk-space/action.yml:11-14`: HIGH TM1 findings are real recursive deletion commands targeting CI toolchain directories. The Linux-runner condition explains their CI role; they must not be executed locally.
- `.github/install.sh`: resolves and downloads a dx binary for the detected platform. It has not been executed.
- `packages/cli/src/cli/update.rs`: HIGH RA1 findings include actual GitHub release/self-update code. It has not been executed.
- `packages/web/src/ts/eval.ts:38`: the P3 message-sending match is a Rust/JavaScript channel method, not evidence by itself of sending user data to an external service.
- `packages/web/build.rs` and `packages/interpreter/build.rs` call lazy-js-bundle. Its implementation checks source hashes and may launch Bun to rebuild JavaScript when hashes differ. Cargo builds therefore require installation review too.
- `packages/dioxus/Cargo.toml`: Rust 1.83 minimum and separate web/desktop features. Tauri can remain the native backend by selecting the Web renderer. dx and a WASM Rust target are currently absent.

These checks explain selected findings but do not resolve all HIGH findings or incomplete coverage. No APPROVE verdict is issued, and transitive dependencies, a CLI binary, and WASM tooling are not yet approved.

## Kubai JavaScript candidate

Package: kubai-icons 0.10.0
Artifact: https://registry.npmjs.org/kubai-icons/-/kubai-icons-0.10.0.tgz
SHA-256: 73b18e9361b9f43807265d2dabf5cd54bb79acccae51a06937292180886aab35

The manifest has no runtime dependency or lifecycle-script declarations. Its element.js registers a kubai-icon custom element and imports local per-icon modules after validating names. icon.js escapes attribute/title values but inserts trusted icon markup. runtime.js implements pointer/focus animations and reduced-motion handling. This is a limited manual review, not proof of safety of all icon modules.

SkillSpector returned CAUTION, 38/100, with partial coverage (0/6980 components fully inspected). HIGH PE3 findings (3) match the word keyring in carabiner icon search tags in dist/cdn/icons/carabiner.js, dist/defs/carabiner.js and dist/icons.json. Manual inspection of the definition confirms an artwork tag, not credential-store access. The user explicitly approved Kubai JS application on 2026-11-17 after seeing these findings. kubai-icons 0.10.0 was installed from the reviewed artifact with installation scripts disabled. Required per-icon modules are imported locally; the site application and CDN scripts are not loaded. See kubai-0.10.0.scan.json.

## 승인 기록

- 2026-11-17: 사용자가 Dioxus 설치를 승인했습니다.
- 2026-11-17: 사용자가 Kubai JS 0.10.0 적용을 승인했습니다.
- 2026-11-17: 사용자가 Rust 1.88.0 WebAssembly 표준 라이브러리 설치를 승인했습니다. `rustup target add wasm32-unknown-unknown --toolchain 1.88.0`이 완료됐습니다.
- 각 승인은 검사 결과에 대한 사용자 예외 승인입니다. SkillSpector의 판정이 APPROVE로 바뀐 것은 아닙니다.

- 2026-11-17: 사용자가 추가 Cargo 의존성 59개 및 wasm-bindgen CLI 0.2.130 설치·실행을 승인했습니다.
