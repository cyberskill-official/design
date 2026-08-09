---
id: TASK-IMP-018
title: CycloneDX SBOM per release + OpenSSF Scorecard (FIND-023)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 4–5 tranche ("accept all, continue").
acceptance_verdict: approved
accepted_at: 2026-08-09T12:22:00+07:00
accepted_by: "@stephencheng"
priority: p2
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
findings: [FIND-023]
assessment_phase: 5
---

# TASK-IMP-018: SBOM + OpenSSF Scorecard

## 1. Description (normative)

Close FIND-023.

- 1.1 Add a release-path CycloneDX SBOM generation step (workflow and/or `npm` script) that produces an SBOM artifact for each publish/tag.
- 1.2 Add an OpenSSF Scorecard GitHub Actions workflow (official action) with SARIF/artifact upload as appropriate.
- 1.3 Document where operators find the SBOM/Scorecard outputs (`docs/ci-cd.md` / release runbook).
- 1.4 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — SBOM generated on release path — workflow/script
- [x] AC for 1.2 — Scorecard workflow present — `.github/workflows`
- [x] AC for 1.3 — docs point at artifacts — ci-cd / release runbook
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Scorecard may need `permissions` + optional PAT for private repos; keep public-repo defaults.
- Do not commit giant generated SBOMs to tip unless the chosen policy says so — artifact upload is fine.

## 4. Protected invariants

- OIDC publish path unchanged (no token reintroduction).

## 5. Implementation notes (Aug 2026)

Workflows `sbom.yml` + `scorecard.yml`; `npm run sbom`; documented in release-runbook + ci-cd.

*End of TASK-IMP-018.*

## Human acceptance (2026-08-09)

Operator HITL: **"accept all, continue"** — Phase 4–5 tranche (TASK-IMP-013…020) accepted. Status set to `done`.

