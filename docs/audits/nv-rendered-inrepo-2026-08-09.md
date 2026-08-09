# NV rendered checks — in-repo status (areas 9 / 12 / 14 / 26)

**Date:** 2026-08-09 · **Task:** TASK-IMP-017 (+ clearance) · **Mode:** in-repo / local Storybook + `_audit` (no live production visit).

## Ledger

| ID | Topic | Status | Evidence / blocker |
|----|-------|--------|--------------------|
| NV-9.1 / NV-9.5 | First-visit / Storybook rendered UX | **in-repo-verified** | Local Storybook @ `localhost:6006`; Introduction docs + Mentions story load |
| NV-9.2 | Auth pattern error/loading/invalid | **resolved** | TASK-IMP-011 + AT PASS (auth error/invalid) |
| NV-9.3 | Rendered reflow | **in-repo-verified (gates)** | Responsive overflow + FIND-007 breakpoints |
| NV-12.1 | Dark contrast conflict | **in-repo-partial** | `contrast-guard` PASS; AT clearance set did not re-measure dark APCA conflict |
| NV-12.2 | Heading hierarchy | **in-repo-verified** | Atomic View 1×h1; auth brand headline `h2`→`p` |
| NV-12.3 | Focus not obscured | **resolved** | a11y-gate + AT Dialog focus **PASS** |
| NV-12.4 | Target size | **in-repo-partial** | coarse-pointer 44px; not in AT clearance minimum |
| NV-12.5 | Live regions | **in-repo-partial** | a11y-gate fixtures PASS; auth Alert covered by AT PASS |
| NV-14.x | Performance rendered | **in-repo-partial** | WebP budget + styles.min default; Lighthouse-on-live deferred |
| NV-26.1 | VN text-expansion | **in-repo-verified (gates)** | language-overflow / lang-parity PASS |
| OQ-002 | Pixel / Storybook visual | **closed (local)** | Ubuntu baselines on `d9f15dd`; Storybook first-visit verified |
| OQ-003 | Live CSP header | **resolved** | Live `curl -sSI` 2026-08-09 — CSP present; no `unsafe-eval`; no CDN script-src; `x-content-type-options: nosniff`; `referrer-policy: strict-origin-when-cross-origin` |
| NV-18.1 | Branch protection | **aborted** | Clearance Q&A **6=abort** |
| Full AT (clearance min) | VoiceOver clearance set | **resolved** | Operator report 2026-08-09 — all five rows PASS (`at-operator-handoff-2026-08-09.md`) |

## Feasible commands

```bash
npm run storybook   # http://localhost:6006
python3 -m http.server 8765 --bind 127.0.0.1
node _audit/ci/pixel-diff.mjs http://127.0.0.1:8765
npm run test:unit
```

Archive-don't-delete: append dated resolutions; do not delete this note.

## Resolution append — 2026-08-09 clearance Q&A

Operator answers: `1 yes · 2 A · 3 B · 4 A · 5 A · 6 abort · 7 commit and push`.

- IMP-021 accepted `done`.
- Template schema v2 + pixel Ubuntu baselines landed.
- AT clearance minimum: **PASS** (see handoff).
- OQ-003 closed below.

## Resolution append — 2026-08-09 AT report

Operator pasted:

```
Mentions: PASS
Sortable: PASS
Rating/Tree/Toolbar: PASS
Auth error/invalid: PASS
Dialog focus: PASS
```

Storybook `http://localhost:6006` · tip `d9f15dd` / `1.3.0` · macOS VoiceOver (Safari/Chrome).

## Resolution append — 2026-08-09 OQ-003 live CSP

Operator `curl -sSI https://design.cyberskill.world/` (HTTP/2 200, Vercel):

```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self'
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
```

Verdict: **PASS** — matches FIND-015/019 in-repo policy (`'unsafe-inline'` retained for Storybook; no `unsafe-eval`; no third-party script CDNs).
