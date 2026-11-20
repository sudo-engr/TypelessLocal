# Dioxus toolchain review

Date: 2026-11-17 (Asia/Seoul)

The user explicitly approved the Dioxus installation after the earlier source review. That override applies to the already-reviewed Dioxus v0.7.3 source and CLI. This review covers the concrete macOS arm64 `dx` release artifact and the Rust standard library artifact needed for `wasm32-unknown-unknown`; this review itself did not install or execute either artifact.

## `dx` v0.7.3

Source and release metadata:

- Release API: https://api.github.com/repos/DioxusLabs/dioxus/releases/tags/v0.7.3
- Release page: https://github.com/DioxusLabs/dioxus/releases/tag/v0.7.3
- Artifact: https://github.com/DioxusLabs/dioxus/releases/download/v0.7.3/dx-aarch64-apple-darwin.tar.gz
- Published: 2026-01-17; release author: `jkelleyrtp`; asset uploader: `github-actions[bot]`.
- Downloaded size: 35,180,557 bytes.
- Official release checksum file: `dx-aarch64-apple-darwin.sha256`.
- SHA-256: `ab6934b3f5f71ec9350f8bc5ee3fe34e439b378599899b48ed4717f28fa912e6` (matches the official checksum file).

The archive contains one file, `dx`. `file` identifies it as a Mach-O arm64 executable, which matches this host. The binary was only inspected with `file`, SHA-256, and `strings`; it was not launched.

SkillSpector 2.11.2 was run against both the downloaded archive and the extracted directory with `--no-llm`:

```text
skillspector scan dx-aarch64-apple-darwin.tar.gz --no-llm --format json
skillspector scan dx-extracted --no-llm --format json
```

Both scans returned score `0`, severity `LOW`, no findings, and recommendation `CAUTION`. The archive scan is partial because the scanner does not fully inspect binary payloads; the extracted scan reports the same binary-content limitation. This is an inspection limitation, not an approval of arbitrary `dx` behavior. The Dioxus source/CLI approval from the user covers this release candidate.

## Rust 1.88.0 WebAssembly standard library

The host has Rust `1.88.0 (6b00bc388 2025-06-23)`. The official channel manifest identifies the target package; the artifact was resolved and reviewed before the parent agent’s separately authorized target installation:

- Manifest: https://static.rust-lang.org/dist/channel-rust-1.88.0.toml
- Manifest date path: https://static.rust-lang.org/dist/2025-06-26/channel-rust-1.88.0.toml
- Target: `wasm32-unknown-unknown`
- Artifact: https://static.rust-lang.org/dist/2025-06-26/rust-std-1.88.0-wasm32-unknown-unknown.tar.xz
- Official `xz_hash`: `a7e18bf7751375caaba9cbe049dd3f2158bb48e67126eaafd969e7baf08fc2a1`.
- Downloaded SHA-256: `a7e18bf7751375caaba9cbe049dd3f2158bb48e67126eaafd969e7baf08fc2a1` (matches).
- Package version file: `1.88.0 (6b00bc388 2025-06-23)`.

The archive contains Rust standard-library `.rlib` archives, metadata, licenses, and the standard Rust installer script. It contains no native executable, dynamic library, or network fetcher beyond the installer itself. The installer was read but not run.

SkillSpector was run against the downloaded archive and extracted package:

```text
skillspector scan rust-std-1.88.0-wasm32-unknown-unknown.tar.xz --no-llm --format json
skillspector scan rust-std-extracted --no-llm --format json
```

The archive scan returned score `0`, severity `LOW`, no findings, recommendation `CAUTION`, and partial binary coverage. The extracted-package scan returned score `100`, severity `CRITICAL`, `DO_NOT_INSTALL`, 11 findings, and 84.6% coverage. Manual review explains the findings:

- Four HIGH `TM1` findings are ordinary installer cleanup commands (`rm -f`, `rm -R`) scoped to the installer’s own manifest/log paths.
- Two MEDIUM `PE2` findings are `chmod 755/644` used while installing files; they do not invoke `sudo`.
- Four HIGH `YR4` matches are the scanner matching the text `rop(&mut ...)` and documentation embedded in Rust `.rlib` archives. They are not executable shell code.
- One LOW `EA3` match is the standard MIT license phrase “including but not limited to”.
- `install.sh` contains `eval` for parsing installer arguments and uses file operations based on its validated installation destination. It was not executed.

This is still a `CAUTION`/incomplete scan under the repository’s installation rule. The user subsequently explicitly approved installing the Rust wasm target. This review still does not run the installer; the parent agent may perform that separately using the verified official artifact and checksum.

## Web target dependency review (read-only)

`cargo metadata`/`cargo tree` resolution was performed with `--locked --offline --target wasm32-unknown-unknown`; no compilation or crate build script was run. The active graph contains 86 package/version nodes. The already-reviewed Dioxus 0.7.3 family (26 packages) and exact versions already present in the user Cargo registry (18 packages) were excluded from the “new” set. The remaining 59 source packages were copied for review only to:

```text
/tmp/typeless-dioxus-toolchain-review/new-dependencies/
```

The exact name/version/path/MSRV manifest is:

```text
/tmp/typeless-dioxus-toolchain-review/new-dependencies-manifest.tsv
```

The 59 staged packages are:

```text
anyhow 1.0.104; bitflags 2.13.2; bumpalo 3.20.4; bytes 1.12.1; cfg-if 1.0.5;
const_format 0.2.37; const_format_proc_macros 0.2.37; convert_case 0.8.0;
darling 0.21.3; darling_core 0.21.3; darling_macro 0.21.3; enumset 1.1.15;
enumset_derive 0.15.1; euclid 0.22.14; futures-channel 0.3.34; futures-core 0.3.34;
futures-io 0.3.34; futures-macro 0.3.34; futures-sink 0.3.34; futures-task 0.3.34;
futures-util 0.3.34; itoa 1.0.19; js-sys 0.3.107; konst 0.2.20; konst_macro_rules 0.2.19;
longest-increasing-subsequence 0.1.0; memchr 2.8.3; pin-project 1.1.13;
pin-project-internal 1.1.13; proc-macro2 1.0.107; proc-macro2-diagnostics 0.10.1;
quote 1.0.47; rustc-hash 1.1.0; rustc-hash 2.1.3; rustversion 1.0.23;
send_wrapper 0.6.0; serde 1.0.229; serde_core 1.0.229; serde_derive 1.0.229;
serde_json 1.0.154; sledgehammer_bindgen 0.6.0; sledgehammer_bindgen_macro 0.6.5;
sledgehammer_utils 0.3.1; slotmap 1.1.1; smallvec 1.16.5; syn 2.0.119; syn 3.0.10;
thiserror 2.0.21; thiserror-impl 2.0.21; unicode-ident 1.0.27; unicode-xid 0.2.6;
wasm-bindgen 0.2.130; wasm-bindgen-futures 0.4.80; wasm-bindgen-macro 0.2.130;
wasm-bindgen-macro-support 0.2.130; wasm-bindgen-shared 0.2.130; wasm-streams 0.4.2;
web-sys 0.3.107; zmij 1.0.23
```

### SkillSpector and manual findings

Aggregate scan:

```text
skillspector scan /tmp/typeless-dioxus-toolchain-review/new-dependencies \
  --no-llm --format json \
  --output /tmp/typeless-dioxus-toolchain-review/new-dependencies-scan.json
```

Result: score `100`, severity `CRITICAL`, recommendation `DO_NOT_INSTALL`, 299 findings. The scan is incomplete: 3,909 components were partially inspected, 0 were fully scanned (`0.0%` coverage); the analyzer hit artifact/output limits and several static analyzers were degraded. Findings are predominantly lexical matches in Rust documentation, identifiers, examples, and CI files: `YR4` 77, `MP2` 113, `EA3` 51, `P9` 17, and smaller groups. Representative HIGH matches were:

- `MP3` “Overwrite memory” in `bumpalo/src/collections/vec.rs` and `smallvec/src/lib.rs` documentation/examples (`ptr::write`).
- `YR4` matches for the ordinary Rust method name `rop(&mut self)`.
- `RA1` `rustup update nightly --no-self-update` in upstream CI YAML.
- `P3` “send messages to” in `futures-channel` channel documentation.
- `TM1`/`TM2` cleanup/sudo strings in upstream CI YAML and docs.

Manual source review of all staged `build.rs` files and relevant macro sources found no credential access, socket use, URL fetch, shell script, persistence, or data exfiltration. Build scripts are limited to compiler-version/feature probes, `OUT_DIR` writes, local cleanup, and (for `wasm-bindgen-shared`) `git rev-parse HEAD` plus hashing its own schema files. `anyhow`, `thiserror`, `proc-macro2`, `serde`, `serde_core`, `quote`, and `zmij` invoke `rustc` only for version/probe checks. The staged proc-macro crates are ordinary derive/code-generation crates; they were inspected but not executed.

**Verdict: `CAUTION`** ⚠️ The static result cannot be treated as an approval because coverage is incomplete, even though the selected manual findings are explainable and no suspicious network/credential behavior was found. Do not compile or newly install this 59-package group until the user gives an explicit override for this additional dependency set after seeing this result. The staged sources remain unexecuted.

### Rust 1.88 compatibility note

`uuid 1.29.3` appears in the full metadata resolution and declares `rust-version = 1.89.0`, but it is not present in the active `wasm32-unknown-unknown` tree used above. If a future feature activates it, the exact fix is to pin `uuid` to a release whose MSRV is `<= 1.88`, or raise the project toolchain to Rust `>= 1.89`; do not silently ignore this MSRV conflict.

## wasm-bindgen CLI 0.2.130

Dioxus CLI source shows that its default wasm-bindgen path can download a GitHub release, fall back to `cargo binstall`, then `cargo install`, and finally execute the installed binary (`/tmp/typeless-dioxus-review/dioxus-0.7.3/packages/cli/src/wasm_bindgen.rs:195-239,242-275,280-344,347-358`). The planned direct `cargo build` plus an explicitly reviewed local CLI avoids that silent installer path.

Official release evidence:

- Release API: https://api.github.com/repos/wasm-bindgen/wasm-bindgen/releases/tags/0.2.130
- Artifact: https://github.com/wasm-bindgen/wasm-bindgen/releases/download/0.2.130/wasm-bindgen-0.2.130-aarch64-apple-darwin.tar.gz
- Checksum file: `wasm-bindgen-0.2.130-aarch64-apple-darwin.tar.gz.sha256sum`
- SHA-256: `b90ddb9357f584b1af897d58ad77e4cce2b48fc17e2a967bc249a87f72809444` (matches the official checksum)
- Downloaded archive: `/tmp/typeless-dioxus-toolchain-review/wasm-bindgen-0.2.130-aarch64-apple-darwin.tar.gz`
- Extracted directory: `/tmp/typeless-dioxus-toolchain-review/wasm-bindgen-extracted/wasm-bindgen-0.2.130-aarch64-apple-darwin/`

The archive contains `wasm-bindgen`, `wasm-bindgen-test-runner`, and `wasm2es6js`; `file` identifies all three as Mach-O 64-bit arm64. None was launched. The official source manifest (`/tmp/typeless-dioxus-toolchain-review/wasm-bindgen-root-Cargo.toml`) identifies version `0.2.130`, MSRV `1.81`, repository `https://github.com/wasm-bindgen/wasm-bindgen`, and MIT/Apache-2.0 licensing. The reviewed library/build sources contain target-feature detection, local environment reads, and schema hashing; no network fetch or credential transmission was found.

SkillSpector reports:

```text
/tmp/typeless-dioxus-toolchain-review/wasm-bindgen-archive-scan.json
/tmp/typeless-dioxus-toolchain-review/wasm-bindgen-extracted-scan.json
```

The extracted scan covered all three binaries for artifact integrity and returned score `49`, severity `MEDIUM`, recommendation `CAUTION`, with 3 HIGH `YR4` matches (the embedded clap help word `parameters`) and 1 LOW MIT-license phrase. Binary payload is outside the source-pattern analyzers, so this is not a semantic approval. The archive scan returned score `0`/LOW with no findings but is likewise limited for binary payloads.

**Verdict: `CAUTION`** ⚠️ The checksum and architecture match the official release, and manual source review found no suspicious behavior, but the prebuilt executables were not semantically inspected or run. The wasm-bindgen CLI is a separate external tool from the user’s Dioxus approval; keep it uninstalled/unexecuted until the user explicitly overrides this additional CLI gate. If approved, use only the checksum-matched arm64 artifact and invoke the single local `wasm-bindgen` binary directly; do not allow `dx` to auto-install or fall back to `cargo install`.

## Minimum build path

Current Rust 1.88.0 satisfies Dioxus v0.7.3’s workspace minimum Rust version (1.85.0). The minimum web build prerequisites are:

1. Dioxus v0.7.3 `dx` for macOS arm64, verified above.
2. Rust target `wasm32-unknown-unknown`, supplied by the verified Rust 1.88.0 standard-library artifact.
3. A local Tailwind CLI/build step if the Dioxus project uses generated Tailwind CSS; no new npm package is required for the review.

Do not run the downloaded `dx` binary, the Rust package `install.sh`, the wasm-bindgen binaries, or any installer command as part of this review. Installation and the direct build remain separate, user-authorized build actions. The remaining security gate is the explicit override for the newly fetched Cargo group and the separate wasm-bindgen CLI.

## 최종 사용자 예외 승인

2026-11-17 사용자는 검사 결과를 본 뒤 신규 Cargo 의존성 59개와 wasm-bindgen CLI 0.2.130의 설치·실행을 명시적으로 승인했습니다. 앞서 Dioxus와 Rust WebAssembly 표준 라이브러리도 승인했습니다. 해시가 일치하는 단일 wasm-bindgen 바이너리를 `.tools/bin/wasm-bindgen`에 설치했고 `wasm-bindgen 0.2.130` 실행을 확인했습니다. Cargo는 잠금 파일을 고정하고 `--offline`으로 빌드합니다. 이 사용자 예외 승인은 SkillSpector의 CAUTION/DO_NOT_INSTALL 결과나 분석 한계를 바꾸지 않습니다.
