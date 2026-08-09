# NV rendered checks — in-repo status (areas 9 / 12 / 14 / 26)

**Date:** 2026-08-09 · **Task:** TASK-IMP-017 (+ clearance) · **Mode:** in-repo / local Storybook + `_audit` (no live production visit).

## Ledger

| ID | Topic | Status | Evidence / blocker |
|----|-------|--------|--------------------|
| NV-9.1 / NV-9.5 | First-visit / Storybook rendered UX | **in-repo-verified** | Local `storybook-static` @ `127.0.0.1:6006` 200; Introduction docs + Mentions story iframe load (clearance 2026-08-09) |
| NV-9.2 | Auth pattern error/loading/invalid | **resolved in-repo** | TASK-IMP-011 |
| NV-9.3 | Rendered reflow | **in-repo-verified (gates)** | Responsive overflow + FIND-007 breakpoints |
| NV-12.1 | Dark contrast conflict | **in-repo-partial** | `contrast-guard` PASS; full AT still operator-owned |
| NV-12.2 | Heading hierarchy | **in-repo-verified** | Atomic View 1×h1 no skips; auth/login brand headline demoted from `h2`→`p` so page `h1` is “Sign in” |
| NV-12.3 | Focus not obscured | **in-repo-verified (gates)** | `_audit/a11y-gate.html` PASS (Dialog/Drawer focus trap · restore · Escape); elementFromPoint on dialog chrome may false-positive |
| NV-12.4 | Target size | **in-repo-partial** | coarse-pointer 44px; AT not run |
| NV-12.5 | Live regions | **in-repo-partial** | a11y-gate live-region fixtures PASS; AT not run |
| NV-14.x | Performance rendered | **in-repo-partial** | WebP budget + styles.min default; Lighthouse-on-live deferred |
| NV-26.1 | VN text-expansion | **in-repo-verified (gates)** | language-overflow / lang-parity PASS |
| OQ-002 | Pixel / Storybook visual | **closed (local)** | Pixel baselines refreshed 2026-08-09 (`pixel-diff` maxDiff=0%); Storybook static first-visit verified |
| OQ-003 | Live CSP header | **operator-owned** | Clearance Q&A **3=B** — paste `curl -sSI` headers after next deploy; agent does not hit production |
| NV-18.1 | Branch protection | **aborted** | Clearance Q&A **6=abort** — leave undocumented/unknown |
| Full AT | VoiceOver / NVDA | **operator-owned** | Clearance Q&A **4=A** — see `at-operator-handoff-2026-08-09.md` |

## Feasible commands

```bash
python3 -m http.server 8765 --bind 127.0.0.1
python3 -m http.server 6006 --bind 127.0.0.1 --directory storybook-static
node _audit/ci/pixel-diff.mjs http://127.0.0.1:8765
node _audit/ci/pixel-diff.mjs --update http://127.0.0.1:8765   # operator-approved refresh
npm run test:unit
```

Archive-don't-delete: append dated resolutions; do not delete this note.

## Resolution append — 2026-08-09 clearance Q&A

Operator answers: `1 yes · 2 A · 3 B · 4 A · 5 A · 6 abort · 7 commit and push`.

- IMP-021 accepted `done`.
- Template schema v2: auth sidecar gained `errTitle`/`errBody`/`emailError` → PASS.
- Pixel baselines rewritten; verify run clean.
- Storybook + heading + a11y-gate checks recorded above.
- AT + OQ-003 remain with operator (not faked closed).
