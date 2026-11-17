# shadcn lint installation review

No target code has been installed or executed. npm tarball SHA512 integrity was verified.

- @shadcn/lint 0.2.5 + cn 0.4.0: SkillSpector --no-llm 99/100, DO_NOT_INSTALL. Three HIGH findings; coverage 84.4%, partial.
- @eslint/core 0.17.0: 29/100, CAUTION; static coverage 100%.
- Existing @types/json-schema 7.0.15 and TypeScript ESLint parser will be reused.
- Optional oxc-parser will be omitted.

Manual source review: SC6 identifies upstream devDependency oxlint as a potential typo of eslint. That package will not be installed. SC3 identifies cn tables.js/tables.cjs: U/PS/DZ decode class lookup data into integer arrays. Session-persistence findings correspond to in-memory Map caches. The Tailwind worker reads project CSS and loads installed project modules. No credential collection or network transmission was found in the reviewed code; partial scan limits remain.

Combined verdict: CAUTION. User AGENTS.md requires an explicit override after reviewing this evidence. If authorized, install exact devDependency versions with lifecycle scripts and optional dependencies disabled.

Then preserve existing ESLint, configure the project theme/component paths, enforce the white/mint/flat component contracts, and fix UI violations. Dynamic progress/waveform styles and native window dimensions require narrow documented allowances. Installing the plugin alone is not completion of UI standardization.

Source: https://github.com/shadcn-ui/lint

## User override and execution

The user explicitly selected the option to accept the scan results and proceed with installation and UI standardization. Installed @shadcn/lint 0.2.5, cn 0.4.0 and @eslint/core 0.17.0 with --ignore-scripts --omit=optional. Existing approved native optional packages were backed up and restored so their prior installation remains usable. No oxc-parser was installed. The original DO_NOT_INSTALL / CAUTION assessments above remain unchanged.
