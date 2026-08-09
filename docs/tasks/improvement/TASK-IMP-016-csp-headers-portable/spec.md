---
id: TASK-IMP-016
title: Tighten CSP + port security headers to every host (FIND-015/019)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 4–5 tranche ("accept all, continue").
acceptance_verdict: approved
accepted_at: 2026-08-09T12:22:00+07:00
accepted_by: "@stephencheng"
priority: p1
author: "@cursor-agent"
department: engineering
created_at: 2026-08-09T05:30:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-015, FIND-019]
assessment_phase: 4
---

# TASK-IMP-016: Tighten CSP + portable security headers

## 1. Description (normative)

Close FIND-015 and FIND-019.

- 1.1 Tighten `vercel.json` CSP: drop `unsafe-eval` where the built site still works; remove or pin unnecessary CDN script/connect origins now that React is vendored locally; keep only required `unsafe-inline` with a documented rationale if Storybook still needs it.
- 1.2 Reconcile divergent CSP texts in `docs/deploy.md` (EN+VI) with the live `vercel.json` policy.
- 1.3 Port the same header set (CSP, X-Content-Type-Options, Referrer-Policy) to every documented host path (nginx snippet and/or `public/_headers` / Netlify-equivalent as documented).
- 1.4 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — CSP tightened; no silent CDN free-for-all — vercel.json
- [x] AC for 1.2 — deploy docs match vercel.json — docs/deploy.md (+ VI)
- [x] AC for 1.3 — every documented host has the header set — deploy.md / _headers
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- If Storybook still requires `unsafe-eval`, document a route-scoped exception rather than silently keeping a site-wide free pass without rationale.
- OQ-003 (live served header) stays NV unless measurable in-repo.

## 4. Protected invariants

- `_audit/` remains intentionally public.
- Do not invent live-site verification claims without evidence.

## 5. Implementation notes (Aug 2026)

Dropped unsafe-eval + CDN origins; kept unsafe-inline (Storybook); mirrored CSP in `_headers` + nginx deploy docs EN/VI.

*End of TASK-IMP-016.*

## Human acceptance (2026-08-09)

Operator HITL: **"accept all, continue"** — Phase 4–5 tranche (TASK-IMP-013…020) accepted. Status set to `done`.

