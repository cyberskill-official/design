# Repository validation

Install the locked Node/npm dependencies with `npm ci`. Complete browser validation requires `npx playwright install --with-deps chromium firefox webkit`. Python 3 is required by font audits and Python-based local serving; font regeneration additionally uses the pinned fontTools dependency described in [conventions](conventions.md). These prerequisites do not supply external authoring tools or human acceptance.

The documentation viewer requires an HTTP server: `file://` cannot fetch Markdown in supported browsers. Use `npm run verify:serve` and open the viewer through its loopback URL. For the font audit, create an isolated environment and install `python -m pip install --require-hashes --only-binary=:all: --no-deps -r scripts/requirements-fonts.txt`; run the documented font audit with that environment's Python.

## Commands and reports

- `npm run verify` checks the publish artifacts without rewriting them, then runs `npm run test:unit`.
- `npm run test:unit` reads the command registry `_audit/ci/unit-suites.json`. The runner continues after independent failures and returns nonzero if any selected suite fails. Results are `test-results/unit/unit-results.json` and `unit-results.xml` (JUnit). Set `CS_UNIT_REPORT_DIR` to choose another report directory.
- `CS_UNIT_SHARD=1/4 npm run test:unit` selects one stable registry shard; its default reports are under `test-results/unit-1-4/`. A shard pass covers only its selected suites.
- `npm run verify:browser` starts an ephemeral loopback server, generates the Pixel CI prerequisite, then runs the hard fast board. Its exit code preserves either failure; the HTML board remains the existing gate authority.
- `npm run tokens:generate` regenerates token outputs; `npm run tokens:check` checks their complete declared chain. Use these after changing CSS and the authored base inventory.

The committed pixel baselines were produced on Linux Chromium. Run the pixel path in the matching environment; a macOS difference is evidence to inspect, not permission to replace Linux baselines or skip the hard gate. No baseline update, push, merge or deployment is authorized by a local test pass.

The build graph is `npm run build`: seed a missing manifest from `scripts/catalog-source.json`, synchronize font records from `tokens/fonts.css`, run the complete token/export chain, then refresh template inventory, CSS index and component source facts. Authored catalog metadata, `tokens/base-inventory.json` and `tokens/export-metadata.json` are inputs; generated files remain committed for portable consumers. `npm run build:check` verifies the outputs without rebuilding them. `npm run test:css-lint` checks syntax, unknown properties and invalid hex across all authored sheets; `npm run test:distribution-budgets` checks bundle, stylesheet and asset growth.

## Evidence boundaries

Registry membership does not prove coverage of every interaction. Record command, source identity, platform, language/theme/state and output path alongside a verdict. Manual assistive-technology results live in [the manual matrix](manual-at-matrix.md); all unperformed rows remain pending. Product visual review, exported-file review, rights approval and operator authorization are separate outcomes.

Distribution budgets also cover the variables-only CSS entry (90,000 bytes), compiled ESM tree (1,800,000 bytes / 500 files) and standalone mode tree (12,000,000 bytes / 257 files). Existing browser bundle, flattened stylesheet and individual asset ceilings remain unchanged. These are growth guards, not loading-speed, Lighthouse or device acceptance. Run `npm run test:distribution-budgets`; generated membership and freshness checks remain additional requirements.

The CSS defect checker uses pinned PostCSS, CSS-tree with CSS specification patches, and postcss-value-parser. It retains the two prior rules (`property-no-unknown`, `color-no-invalid-hex`) and syntax failures, with no glob library or formatting policy. The migration matched Stylelint17.16.0 on all27 CSS sources plus42 positive/negative fixtures (`test-results/css-lint-oracle.json`); retained CI fixtures additionally cover nested declarations, custom-property hex, URL fragments and quoted text. Stylelint’s unpatched braces globbing chain was removed rather than suppressed or downgraded. This checker targets plain CSS; preprocessor interpolation is not a supported input. Dependency audit results are time-bound and do not establish malware, license or package-health acceptance.

Dependency audit policy: `npm run security:audit` blocks high and critical advisories across runtime, development, optional and peer dependencies, with no advisory exceptions. The reviewed inventory in `scripts/dependency-audit-projects.json` covers the root, Vite example and React 18 compatibility fixture lockfiles; each retains its own full report and source hash. Every project must pass. It runs in the existing `fast-gates` CI job; complete JSON and summary evidence are uploaded even when the audit step fails. Missing, malformed, inconsistent or service-error reports fail closed. The source lockfile hash and Node version accompany each result. Lower severities remain in the report; a clean result is time-bound. The policy is prepared locally; hosted enforcement requires an authorized push and successful CI run.

The `storybook-build` job also runs `node _audit/ci/lib/run-browsers.mjs _audit/ci/test-storybook-runtime-browser.mjs` against the actual built index. It checks every component story's default render in Chromium, Firefox and WebKit at 1280×900. Product roots and explicitly owned overlay/floating portals use the existing WCAG 2 A/AA serious/critical failure policy. Unknown external product nodes and render errors fail. Full product and whole-iframe axe results, including other impacts and incomplete checks, are retained on failure and success. This is bounded default-state automation; interaction regressions, all toolbar combinations, manual assistive technology and visual acceptance remain separate.

The isolated font and PDF test tools are audited separately by `npm run security:audit-python` against their exact hash-pinned PyPI versions in `scripts/requirements-fonts.txt` and `_audit/ci/requirements-pdf.txt`. The existing `fast-gates` job retains the OSV response and summary alongside npm evidence. Provider-classified high/critical advisories block; missing classification, malformed reports and service failures fail closed. CVSS vectors are not independently scored. A clean advisory response does not establish package health, malware clearance or license acceptance.

For the complete local suite, use the declared Node version and an isolated Python environment. The example below matches the hash-verified CI installation; `CS_PDF_PYTHON` must be an absolute executable path.

```sh
python3 -m venv /tmp/cs-design-tests
/tmp/cs-design-tests/bin/python -m pip install --require-hashes --only-binary=:all: --no-deps -r scripts/requirements-fonts.txt -r _audit/ci/requirements-pdf.txt
PATH="/tmp/cs-design-tests/bin:$PATH" CS_PDF_PYTHON="/tmp/cs-design-tests/bin/python" npm run test:unit
```

The maintained toolchain requires Node 22.12.0 or newer because Vite 8 and its native tooling declare that floor. `.nvmrc` and CI select the latest available Node 22 patch, which is the primary validation lane; a minimum engine declaration is not a claim of testing every newer Node release.

PDF text and layout tests pass actual PDF bytes to the pinned `pypdf` parser through a private temporary file, rather than an input pipe. The helper writes the PDF with mode `0600`, runs the isolated Python executable selected by `CS_PDF_PYTHON`, and validates the parser identity/version, page count and text result. Its default process deadline is 30 seconds and captured output is limited to 32 MiB. The temporary directory is removed after success or failure. Missing tools, process errors, timeouts, excess output, malformed responses and invalid parser metadata fail the test; no parser-unavailable skip is allowed. These are test harness bounds, not product export limits or target Office fidelity acceptance.

## Vite security floor

The repository requires Vite `^8.1.6`; the maintained Vite consumer pins `8.1.6`, and both lockfiles select that patch on the existing 8.1 line. Upstream identifies it as the fix for [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) and [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw), concerning editor-opening tooling and Windows command handling.

Run `npm run security:audit` for current evidence. The existing policy still audits every maintained lockfile and all dependency classes, including development tools; high and critical findings block, and missing or invalid audit evidence fails closed. No exception, severity-threshold change, new release version or notice-announcement date is introduced by this dependency patch.
