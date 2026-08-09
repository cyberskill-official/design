# Repo ↔ Claude Design — round-trip fidelity & two-way sync

The GitHub repo (`cyberskill-official/design-system`) is the **source of truth**. Claude Design sessions are ephemeral project filesystems — this doc is how they stay in sync without losing work.

## Does the repo restore the full system intact?

**In a Claude-Design session — yes.** Everything that defines the system is plain text/asset files and round-trips losslessly:
- `styles.css` + `tokens/` + `base/` (all CSS + `tokens.json`/`tokens.js`)
- `components/**` (`.jsx` + `.d.ts` + `.prompt.md` + `*.card.html`)
- `templates/**/*.dc.html` (+ `ds-base.js`, `support.js`)
- `guidelines/`, `ui_kits/`, `fonts/` (woff2), `assets/`, `docs/`, `_audit/*.html`

- **`_esm/react.mjs`** — bundler-native React entry (default package export; React peer). Regenerated via `npm run build:react-entry`.
- **`_esm/cs.mjs`** — the browser / no-build legacy ESM entry (`@cyberskill/design/legacy`). Underscore-prefixed does **not** mean build artifact or gitignored here (only `uploads/`, `scraps/`, `_audit/exports/` are — see Hygiene below); `_esm/` is source, same tier as `templates/` or `docs/`. A prior port of this repo skipped it on exactly this assumption and broke the ESM smoke gate — if you're porting/copying this tree by hand, **explicitly include every top-level folder this list names**, don't infer from the `_` prefix.

- `README.md`, `CONTRIBUTING.md`, `SKILL.md`, `CLAUDE.md`, `VERSION`, `DESIGN.md` (generated open-spec surface — committed, regenerated only via `npm run build:design-md`, pinned by the `design-md-parity` gate)

Pull them back into a fresh project (see below) and the compiler re-recognizes it as a design system — it keys off `styles.css`, the `.d.ts`/`.jsx` pairs, `@dsCard` HTML, and `templates/`. The **derived** files (`_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`) are regenerated every turn from source, so they need not be trusted from the repo — they rebuild.

**In other agents (Google Stitch, generic LLM tools) — partially.** They can consume the **portable** layer — `tokens/tokens.json` + `tokens.js`, the raw CSS, the component `.jsx`, fonts, and the Markdown docs — but they do **not** understand the `.dc.html` Design-Component format or the compiler that drives it. So a non-Claude-Design agent gets the tokens, styles, and component source as files, not the live DC/tweak/compile behavior. Point those tools at the root **`DESIGN.md`** first (the generated Stitch-style open-spec surface: doctrine + every token value + inventory, regenerated from DTCG via `npm run build:design-md` and pinned by the `design-md-parity` gate), then `tokens.json` / `tokens.dtcg.json` and the CSS for the machine contract; treat `.dc.html` + the compiler as Claude-Design-native.

## Two-way sync (repo = source of truth)

Claude Design can **read/copy from** GitHub but **cannot push to** it. So sync is *automatic pull, manual push*:
**Session START — pull (reliable, automated):** tell the agent to load the repo. It copies the tree into the fresh project (the `github_copy_files` path), the compiler validates, and you continue from the committed truth — never from stale project state. Always begin here; do not resume from a half-remembered project.

**Session END — push (manual, reviewed):** download the project, then from a clone:
```
git checkout -b session/<date-or-topic>

# copy the downloaded files over the working tree (keep .git/, .github/, LICENSE)
git add -A && git commit -m "DS <VERSION> — <summary>"
git push -u origin session/<date-or-topic>   # branch, never --force, never straight to main

# open a PR, review the diff, merge
```
The PR diff is the safety net — it shows exactly what changed since the last committed truth.

## Hygiene that keeps round-trips clean
- **`.gitignore`** the transient (`uploads/`, `scraps/`, `_audit/exports/`); commit everything else, **including `_esm/`** (see above — it is source, not a build artifact, despite the `_` prefix). The compiled `_ds_bundle.js`/manifest are committed for consumers that have no build step, but expect churn — or ignore them and let each session regenerate.

- **`VERSION` is LAUNCHED at 1.1.0; pin tracks `VERSION`** — auto-bump on push to `main` (`.github/workflows/version.yml` → tag `v*` → `npm-publish.yml`); owner may still force a bump. Do not maintain a changelog file. Continuity is the git history; open maintainer tasks live in `docs/decisions.md`.

- **One source of truth at a time.** Don't edit the repo and a Claude Design project in parallel and push both — pull, work, push, in that order, so the repo is always the merge point.

- **Small, frequent commits** beat one giant end-of-project dump — smaller diffs are safer to review and less likely to silently drop a file.

## TL;DR
Push this project → the repo is a faithful, restorable archive **for Claude Design** (pull at start, compiler rebuilds the derived files). Other agents get the portable token/style/JSX layer, not the DC runtime. Make it two-way by **pulling from the repo at the start of every session and committing back via PR at the end** — the repo stays the source of truth and no work is lost between ephemeral sessions.
