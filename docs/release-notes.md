# Release Notes

Curated product highlights for operators. This is **not** a git log and **not** a `CHANGELOG.md` — the design system does not maintain a changelog file. VERSION **1.6.1** (auto-bumps on push to `main` from Conventional Commits; owner may still force a bump). Technical continuity is the repo tip; product-facing continuity is this page (mirrored in Storybook **Release Notes**). Published on Storybook **Docs** at `design.cyberskill.world`.

## Release — `@cyberskill/design@1.3.10`

Docs publication follow-through: single VERSION wording on operator surfaces (no separate “pin” / LAUNCH dual lead-in). Historical Release / Patch / LAUNCH sections below stay as dated archive.

## Release — `@cyberskill/design@1.3.9`

Operator docs ship through the Storybook **Docs** sidebar (doctrine home, EN·VI tracked set, docs↔Storybook coverage + link gates). Live Status HTML gates check **published** surfaces only; Node twins still prove CSF/MDX source. Per-page Docs stories pass `?embed=1` so the Documentation Library chrome stays hidden inside Storybook (standalone `/docs/viewer.html` unchanged).

```bash
npm install @cyberskill/design@1.3.9
```

## Release — `@cyberskill/design@1.3.0`

Assessment remediation Phases 0–5 and gap closure (TASK-IMP-001…021): contrast, pack-contract, overlay manager, zoom/CQ gates, and related Storybook / template polish landed as one product line.

## Release — `@cyberskill/design@1.2.0`

`VERSION` **auto-bumps on `main`** (Conventional Commits → tag `v*` → `npm-publish.yml` Trusted Publishing). Owner may still force a bump via `Release-As:` / `workflow_dispatch`. Curated continuity stays on this page — still **no** root `CHANGELOG.md`.

## Patch — `@cyberskill/design@1.1.1`

Lockstep republish after the LAUNCH cut: regenerate natives / provenance / `_ds_bundle.js` so registry matches tip, and drop the forbidden root `CHANGELOG.md`. Install:

```bash
npm install @cyberskill/design@1.1.1
```

## LAUNCH — `@cyberskill/design@1.1.0`

Owner **LAUNCH** cut. `VERSION` / `package.json` and every version stamp move from the pre-LAUNCH **1.0.0** pin to **1.1.0**. Publish via **npm Trusted Publishing (OIDC)** on tag `v1.1.0` (or `workflow_dispatch`). Package Publishing access on npmjs **disallows tokens**. Soft-skip on the npm-hello registry install is honest until **1.1.0** is live on the registry — soft-skip ≠ published.

Approved use for CyberSkill portfolio products remains in **`docs/consumer-grant.md`** (+ VI). The package remains **UNLICENSED**. First-consumer browser path: `examples/npm-hello/` (Lumi · Hỏa · plasma) — see `docs/consuming.md`.

```bash
npm install @cyberskill/design@1.1.0
```

## Storybook at the domain root

`design.cyberskill.world/` is the full Storybook product site. Docs, Foundations, Components, Release Notes, and Status live in one sidebar. Legacy `/dashboard` and `/playground` paths redirect to `/`.

Portable consumers: `styles.css`, `_ds_bundle.js`, bundler-native `_esm/react.mjs` (default `exports["."]`; React peer), and browser legacy `_esm/cs.mjs` (`@cyberskill/design/legacy`). Storybook is host-only tooling.

## Quality gates on Status

The **Status** story embeds the fast gate board (`_audit/run.html`). Hard gates fail the board when broken; advisory rows are labelled clearly and do not flip the aggregate pass. Open Status once to auto-run; use **Re-run** for a fresh pass.

## Bilingual docs and templates

Public operator docs ship EN·VI pairs under `docs/` / `docs/vi/`. Templates remain bilingual EN·VN with fully separated language modes. Component strings resolve from the central registry.

## Foundations and CSF library

Theme × Element × Language × Style toolbar globals mirror production templates (Theme includes **system** for OS `prefers-color-scheme`). Every public primary ships a Default story plus an honest control matrix; FullMatrix covers every ≥1-axis qualifier. Axe smoke scans all public primaries. Style’s sole pack is **liquid-glass**. Foundations cover colors, typography, spacing, elevation, motion, and the 15 Ngũ Hành element packs.

## Tokens and native mirrors

CSS tokens, DTCG (`tokens/tokens.dtcg.json`), and pre-generated SwiftUI / Compose / Flutter mirrors stay in lockstep via the token pipeline. Text never sits on mid-tone `-accent` — APCA doctrine is gate-enforced.

## What we never ship

- A root **`CHANGELOG.md`** (forbidden by doctrine and docs-consistency)
- Storybook as a consumer dependency
