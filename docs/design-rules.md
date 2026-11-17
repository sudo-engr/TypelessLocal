# TypelessLocal UI rules

`npm run lint` runs the existing ESLint rules plus @shadcn/lint 0.2.5 on production TypeScript/TSX. `npm run lint:ui:check` verifies that all six design rules reject deliberate violations and accept standard Button usage.

## Shared visual system

- Light surfaces and both sidebars use the existing white background tokens. Keep the mint accent (#2abba7), existing semantic status colors, and dark-mode overrides.
- Use theme typography: caption, footnote, body, headline, title and the standard Tailwind sizes. Do not embed repeated pixel values in classes.
- Use the shared radius scale. Controls use rounded-md, cards use rounded-xl or rounded-2xl; do not introduce one-off radii.
- Buttons own color, padding, font and shape. Call sites select a variant/size and control placement. Shared input components own appearance. CardHeader, CardContent and CardFooter accept layout and spacing.
- Do not add shadows or gradients. Keep keyboard focus visible with outlines and respect reduced motion.
- Status colors use error, warning and success tokens rather than Tailwind palette literals.
- New colors belong in the theme and require an intentional design change, not a local override.

## Enforcement

ESLint also rejects shadow and gradient utility strings. Enabled as errors: no-raw-colors, no-arbitrary-values, no-inline-styles, no-unknown-classes, require-static-classes and no-restyle. Existing parser, React hooks and test lint policies remain in place. Primitive definitions under components/ui may own their implementation styles, so no-restyle, no-arbitrary-values and require-static-classes are disabled only there, as recommended upstream. Token and unknown-class checks remain active there. Test fixtures are outside design-policy enforcement, while retaining normal ESLint checks.

Viewport-dependent toast/dialog sizing and dictionary/correction/scene column geometry have named shared CSS utilities. Their functional dimensions are intentionally retained rather than rounded blindly. Numeric Tailwind v4 utilities replace equivalent arbitrary pixel classes without changing geometry.

Dynamic model-download progress, waveform and native capsule size must remain dynamic. Represent those measurements with CSS custom properties and stylesheet classes; fixed colors and dimensions remain tokenized. Official third-party brand artwork is not a product palette and is kept as artwork with a narrowly documented exception.

## Installation provenance

The user explicitly approved the partial/CAUTION SkillSpector results for @shadcn/lint 0.2.5, cn 0.4.0 and @eslint/core 0.17.0. Exact versions are pinned as development dependencies. Installation lifecycle scripts and new optional dependencies were omitted. Existing native optional packages were preserved. See security/shadcn-lint/review.md and the original scan JSON files. The user approval overrides the recorded scan result; it does not change the scanner's verdict.

References: https://github.com/shadcn-ui/lint and https://github.com/shadcn-ui/lint/blob/main/docs/design-systems.md
