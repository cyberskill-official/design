---
id: TASK-IMP-009
title: RSC "use client" / client barrel (FIND-006)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 3 tranche ("continue all").
acceptance_verdict: approved
accepted_at: 2026-08-09T11:55:00+07:00
accepted_by: "@stephencheng"
priority: p0
author: "@cursor-agent"
department: engineering
created_at: 2026-08-09T05:00:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-006]
assessment_phase: 3
---

# TASK-IMP-009: RSC `"use client"` / client barrel

## 1. Description (normative)

Close FIND-006: default bundler entry ships raw JSX with zero `"use client"` boundaries, so Next.js App Router Server Components cannot import interactive components.

- 1.1 `generate-react-entry.mjs` SHALL emit a leading `"use client";` directive on `_esm/react.mjs` (client barrel for the default package entry).
- 1.2 `test:react-entry` (and/or package-exports integrity) SHALL assert the directive is present on the generated barrel.
- 1.3 `docs/consuming.md` (and VI if mirrored) Next/SSR block SHALL document that the default entry is a client boundary; Server Components may import from `@cyberskill/design` without per-import shims.
- 1.4 This task MUST NOT be marked `done` without HITL.

## 2. Acceptance criteria

- [x] AC for 1.1 — `_esm/react.mjs` starts with `"use client"` after regen — inspect + `generate-react-entry --check`
- [x] AC for 1.2 — unit gate fails if the directive is removed — `npm run test:react-entry`
- [x] AC for 1.3 — consuming docs mention client barrel / RSC — inspect `docs/consuming.md`
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Legacy `@cyberskill/design/legacy` (`_esm/cs.mjs`) remains browser-only; do not add `"use client"` there.
- Pure-presentational modules may stay without per-file directives when the barrel carries the boundary.

## 4. Protected invariants this task must not weaken

- Export parity with `_ds_bundle.js` header; peer React model; no CDN in react.mjs.

*End of TASK-IMP-009.*

## Human acceptance (2026-08-09)

Operator HITL: **"continue all of them"** — Phase 3 tranche (TASK-IMP-009…012) accepted. Status set to `done`.
