# Local Korean dictation

Target: macOS Apple Silicon. Rust owns the local STT engine and application logic. React uses shadcn/ui controls and Tailwind CSS.

## Model

On first launch, use “모델 다운로드 및 설정” to select and download either pinned large-v3-turbo Q5_0 (574 MB) or large-v3 Q5_0 (1.08 GB). The UI explains turbo as the speed-oriented option and large-v3 as the accuracy comparison option; actual quality and latency depend on hardware and audio. Changing the selection alone does not activate a model. The app verifies the expected size, SHA256 and model format, stores it in the application data directory, and activates it automatically. Progress and retry are available. Setup needs internet; dictation remains local and works offline afterward. No account or API key is required.

Manual import of a trusted large-v3/turbo GGML file remains available in the model panel. Microphone permission is required to record. Accessibility permission is required for automatic text input; clipboard-only output is also available.

Recordings stop at 120 seconds. Escape cancels. Inference runs in the application process. The model remains in memory between recordings. Model replacement and inference share a lock. Raw audio is not saved to disk.

## Build

- Install Node dependencies: `npm ci --ignore-scripts`.
- Install the Rust toolchain and CMake before building native code. This workspace contains the approved CMake binary at `.tools/cmake/bin/cmake`.
- Build UI: `npm run build`.
- Build a debug app: `CMAKE="$PWD/.tools/cmake/bin/cmake" CARGO_HOME=/tmp/opentypeless-cargo-home CARGO_TARGET_DIR="$PWD/src-tauri/target-typelesslocal" npm run tauri build -- --debug --bundles app`.
- Output: `src-tauri/target-typelesslocal/debug/bundle/macos/TypelessLocal.app`. The separate target directory avoids absolute paths retained in the pre-rename build cache.
- The temporary Cargo cache was necessary because the sandbox rejects writes to the default cache. Outside this sandbox, use your normal writable Cargo cache.

Follow AGENTS.md before installing new third-party dependencies. `--ignore-scripts` avoids Node lifecycle scripts; the Rust build compiles native code.

## Verification status

The debug application bundle was built successfully. Rust `cargo check`, 14 selected Rust tests, lint, and the frontend production build passed. The latest frontend verification ran 67 relevant tests including three new model-import validation tests; all passed. An earlier broader frontend run reported 397 passing tests and 92 failures in upstream cloud-auth tests because Node localStorage was unavailable. The full suite is not green.

An earlier native UI smoke check reached the Korean model import screen and showed the expected error for an empty model path. The pinned model was subsequently downloaded and activated through manual setup. No Korean accuracy, speed, or zero-egress runtime measurement has been completed.

For the first-install downloader, `cargo check --locked`, six downloader/validation tests, eight model setup UI tests, lint, the frontend production build, and the macOS debug app bundle build passed. A complete download through the new in-app button has not been exercised; the pinned artifact was verified during the earlier manual setup.

The first version uses an energy gate for silence. It is not a trained VAD. Noisy audio can still produce unwanted text; evaluate silence and noise recordings before release.

The downloader permits only the pinned HTTPS model request and HTTPS redirects. Interrupted or invalid downloads never replace the active configuration. Partial files are removed on failure. Retrying starts a fresh transfer; resuming across app restarts is not implemented.

Model selection is available in both onboarding and Settings. Both downloads pin revision `5359861c739e955e79d9a303bcbc70fb988958b1`. The large-v3 Q5_0 metadata (1,081,140,203 bytes; SHA256 `d75795ecff3f83b5faa89d1900604ad8c780abd5739fae406de19f23ecd98ad1`) was verified from the upstream Hugging Face file listing. No new model binary was downloaded or executed during this change.

## Visual identity

The display name is TypelessLocal. The user-provided keyboard-off SVG is used for the app, sidebar, setup, About and capsule. Desktop icons are generated from a flat tile using the existing neutral palette. UI structure follows the supplied shadcn/ui references: bordered cards, compact sidebar navigation, clear section headers and standard form controls. Existing color values remain unchanged; shadows and gradients remain disabled. The bundle identifier and database filenames stay unchanged to preserve existing settings.

References: https://www.shadcn.io/template/shadcn-ui · https://ui.shadcn.com/ · https://github.com/shadcn-ui/ui

Branding/UI verification: lint, the production frontend build and 78 focused UI tests passed. Browser previews of real components with mocked native responses were inspected in light/dark modes; these are visual checks, not native permission or STT end-to-end tests.

UI consistency: @shadcn/lint 0.2.5 is configured in eslint.config.js. Run `npm run lint` and `npm run lint:ui:check`. The initial 854 design findings were corrected; final lint has zero errors/warnings. All 251 relevant UI tests pass. The shared switch uses the mint accent, shared Button/Input variants own appearance, and dynamic progress/waveform/capsule sizes are retained via CSS variables. Browser screenshot verification of this pass was blocked by the Chrome remote-debugging approval/handshake. Existing running apps are preserved; the new build is packaged separately in `.release-assets/ui-unified/TypelessLocal.app`. See design-rules.md for policy and security/shadcn-lint/review.md for the user-approved installation review.
