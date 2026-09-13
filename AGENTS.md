# AGENTS.md

This repository runs **CyberOS**. Canonical agent instructions: `.cyberos/AGENT-ENTRY.md`.

Design-system doctrine (expansion, verification, immutables): `docs/doctrine.md`.

Work is tasks; HITL is required at the two human-acceptance gates; run gates with `bash .cyberos/cuo/gates/run-gates.sh`. Never push, deploy, or merge without an explicit operator instruction.

Memory (BRAIN): protocol at `.cyberos/memory/AGENTS.md`; store at `.cyberos/memory/store/`.

<!-- cyberos-agent-spine (managed by cyberos install; edit above/below this marker) -->

## Cursor Cloud specific instructions

This is an HTML-first, static design system (Node 22, npm). There is no application server or database — the "app" is (a) a **Storybook** playground and (b) the raw repo **served statically** with the `_audit/*.html` gate board on top. There is no `lint` npm script; the equivalent static checks are the audit gate board plus the Node freshness prechecks below.

Services and how to run them (standard commands live in `package.json` / `.github/workflows/design-system-gates.yml`):

- **Storybook dev server** — `npm run storybook` (serves on `http://127.0.0.1:6006`). Primary interactive surface for browsing components/templates and editing them live via the Controls panel.
- **Static audit board** — serve the repo root, e.g. `npx --yes serve@14.2.6 -l 8080 .`, then open `http://127.0.0.1:8080/_audit/run.html`. Run headless with `node _audit/ci/run-gates.mjs http://127.0.0.1:8080/_audit/run.html`.
- **Unit/contract tests** — `npm run test:unit`.

Non-obvious gotchas:

- **Playwright Chromium is required** for `npm run test:unit` (the `subtree-consume` smoke) and for the headless gate board / `pixel-diff.mjs`. The update script installs it.
- **`serve` strips the `.html` extension** and issues a `301` (`/_audit/run.html` → `/_audit/run`). This is expected; Playwright and browsers follow the redirect, so use the `.html` URLs as written in CI.
- **The "Pixel CI" hard gate fails on a cold checkout** until `node _audit/ci/pixel-diff.mjs http://127.0.0.1:8080` has been run once — it generates `_audit/ci/pixel-diff-report.json` that the board reads. Run `pixel-diff.mjs` before `run-gates.mjs` (this mirrors CI job ordering).
- The `ghost`/`secondary` Button variants render with no fill, so on Storybook's white canvas they can look "invisible" — that is expected styling, not a crash.
- CyberOS acceptance gates (`bash .cyberos/cuo/gates/run-gates.sh`) live under the gitignored `.cyberos/` directory and are absent on a fresh clone; they are separate from the npm/audit checks above.
