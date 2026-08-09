# Assistive-technology handoff — operator run (2026-08-09)

**Operator decision:** clearance Q&A item 4 = **A** — operator runs VoiceOver / NVDA against the archived AT matrix and reports pass/fail.

Keyboard APG for Mentions/Sortable/Rating/Tree/Toolbar is also gate-verified in `_audit/a11y-gate.html`.

## Matrix to execute

Primary archive: [`docs/audits/ux-audit-2026-08-08/`](./ux-audit-2026-08-08/) (restored from pre-`8646dbf` tree).

Run against local tip:

```bash
npm run storybook
# open http://localhost:6006
```

Clearance minimum scope:

| Widget / surface | Check |
|------------------|-------|
| Mentions | Arrow + Enter/Escape suggestion pick; SR announces active option |
| Sortable | Move up/down buttons reorder; drag optional |
| Rating / Tree / Toolbar | APG keyboard + SR role match |
| Auth `formState` error/invalid | Alert + field error announced |
| Overlay Dialog/Drawer | Focus trap, Escape, restore |

## Operator report — 2026-08-09 (accepted)

- Status: **received · clearance minimum PASS**
- Operator: `@stephencheng`
- Environment (as reported): macOS · VoiceOver · Safari/Chrome
- Storybook: `http://localhost:6006` · tip `d9f15dd` / `1.3.0`

| Surface | Result |
|---------|--------|
| Mentions | **PASS** |
| Sortable | **PASS** |
| Rating / Tree / Toolbar | **PASS** |
| Auth error/invalid | **PASS** |
| Dialog focus | **PASS** |

Defects: none reported.

Broader AT matrix weeks in `ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md` remain optional schedule (not blocking this clearance set).
