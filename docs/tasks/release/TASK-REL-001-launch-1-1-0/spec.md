---
# Owner LAUNCH instruction 2026-07-27 — bump pinned 1.0.0 → 1.1.0.
id: TASK-REL-001
title: LAUNCH design system at VERSION 1.1.0
template: task@1
type: feature
module: release
status: done
# Human acceptance (operator 2026-07-27): review + final acceptance approved — commit/merge/deploy instructed.
acceptance_verdict: approved
accepted_at: 2026-07-27T17:10:00+07:00
accepted_by: "@stephencheng"
priority: p0
author: "@stephencheng"
department: engineering
created_at: 2026-07-27T09:26:43+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: true
depends_on: []
routed_back_count: 0
awh: N/A
class: product
---

# TASK-REL-001: LAUNCH design system at VERSION 1.1.0

## 1. Description (normative)

Owner said **LAUNCH** and set the release to **1.1.0**. The pre-LAUNCH pin at 1.0.0 is lifted for this cut only; further bumps still need an explicit owner instruction. No `CHANGELOG.md` — continuity stays tip SHA + curated Release Notes.

- 1.1 Root `VERSION` and every version stamp (`package.json`, token metas, DTCG `$extensions`, `provenance.json`, `DESIGN.md` front matter, `_esm/cs.mjs` `VERSION`, embedded token meta in `_ds_bundle.js`) SHALL equal **1.1.0**.
- 1.2 Hard gates that previously asserted the **1.0.0** pin (`docs-consistency`, `version-stamp`, `test-react-entry`, `npm-publish.mjs`) SHALL assert **1.1.0** (or equality with the root `VERSION` file) and SHALL NOT retain "until LAUNCH" blocking language that forbids this bump.
- 1.3 Operator-facing docs (EN + VI), SKILL/README/CONTRIBUTING, Release Notes, and Storybook Release Notes SHALL record LAUNCH at **1.1.0** and that further VERSION bumps require owner instruction; still no changelog file.
- 1.4 `examples/npm-hello` SHALL target `@cyberskill/design@1.1.0`. Until that version exists on the public registry, CI MAY soft-skip the registry install with an honest report and prove the local pack instead — soft-skip ≠ published.

## 2. Acceptance criteria

- [ ] AC for 1.1 — `VERSION` and all stamps read `1.1.0` — test: `version-stamp` / `scripts/verify-local.sh`
- [ ] AC for 1.2 — docs-consistency + react-entry + npm-publish dry-run accept 1.1.0 — test: `_audit/docs-consistency.html`, `npm run test:react-entry`, `npm run npm:pack-dry-run`
- [ ] AC for 1.3 — grep for "until LAUNCH" / "pinned at **1.0.0**" in live operator docs is clean (archive may retain history) — test: docs-consistency + manual grep
- [ ] AC for 1.4 — npm-hello expects 1.1.0; CI path documented — test: `examples/npm-hello/smoke.mjs`

## 3. Edge cases

- npm registry does not yet have 1.1.0 when CI runs — soft-skip registry path, pack local tarball, still smoke exports.
- Historical `_audit/archive/` mentions of 1.0.0 must not be rewritten.
- Native store scaffold "until LAUNCH" release-notes placeholders become post-LAUNCH scaffold copy (no product store submit).

## 4. Protected invariants this task must not weaken

- No `CHANGELOG.md` surface.
- License stays **UNLICENSED**; consumer grant unchanged except version references.
- Expansion Rule and axis contracts unchanged.
- Do not invent product → element mappings.
