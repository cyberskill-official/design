---
# Owner instruction 2026-07-27 — patch republish so registry matches tip after LAUNCH lockstep fix.
id: TASK-REL-002
title: Republish @cyberskill/design at VERSION 1.1.1
template: task@1
type: feature
module: release
status: done
# Operator said "go" 2026-07-27 for 1.1.1 republish (commit/merge/deploy already authorized).
acceptance_verdict: approved
accepted_at: 2026-07-27T17:21:00+07:00
accepted_by: "@stephencheng"

priority: p0
author: "@stephencheng"
department: engineering
created_at: 2026-07-27T10:21:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: true
depends_on: [TASK-REL-001]
routed_back_count: 0
awh: N/A
class: product
---

# TASK-REL-002: Republish @cyberskill/design at VERSION 1.1.1

## 1. Description (normative)

Owner approved a **1.1.1** patch republish so the public registry matches tip after post-LAUNCH lockstep fixes (bundle freshness, native provenance, no `CHANGELOG.md`). LAUNCH narrative at **1.1.0** stays historical; current pin is **1.1.1**. No changelog file.

- 1.1 Root `VERSION` and every version stamp SHALL equal **1.1.1**.
- 1.2 Hard gates that asserted the **1.1.0** pin SHALL assert **1.1.1** (or equality with root `VERSION`).
- 1.3 Operator docs (EN + VI), Release Notes, and npm-hello SHALL record current pin **1.1.1** and a short patch note; LAUNCH section for 1.1.0 remains.
- 1.4 Tag **`v1.1.1`** and publish via npm Trusted Publishing; Vercel deploys from `main`.

## 2. Acceptance criteria

- [ ] AC for 1.1 — stamps read `1.1.1` — test: version-stamp / verify-local
- [ ] AC for 1.2 — docs-consistency + react-entry + npm-publish dry-run accept 1.1.1
- [ ] AC for 1.3 — release notes + npm-hello target 1.1.1; LAUNCH 1.1.0 prose retained
- [ ] AC for 1.4 — `@cyberskill/design@1.1.1` on registry; production site on tip

## 3. Edge cases

- Soft-skip npm-hello registry path until 1.1.1 exists on npm (pack proof still required).
- Do not rewrite historical TASK-REL-001 or archive docs.

## 4. Protected invariants this task must not weaken

- No `CHANGELOG.md` surface.
- License stays **UNLICENSED**; consumer grant unchanged except version references.
- Expansion Rule and axis contracts unchanged.
