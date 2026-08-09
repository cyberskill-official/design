# Assistive-technology handoff — operator run (2026-08-09)

**Operator decision:** clearance Q&A item 4 = **A** — operator runs VoiceOver / NVDA against the archived AT matrix and reports pass/fail.

**Agent does not claim AT-complete** until that report lands. Keyboard APG for Mentions/Sortable/Rating/Tree/Toolbar is gate-verified in `_audit/a11y-gate.html`; AT is the remaining human layer.

## Matrix to execute

Primary archive: [`docs/audits/ux-audit-2026-08-08/`](./ux-audit-2026-08-08/) (restored from pre-`8646dbf` tree).

Run against local tip:

```bash
npm run build:storybook   # or: npm run storybook
# open Storybook + Atomic View + Status Hub login
```

Suggested scope (minimum for clearance):

| Widget / surface | Check |
|------------------|-------|
| Mentions | Arrow + Enter/Escape suggestion pick; SR announces active option |
| Sortable | Move up/down buttons reorder; drag optional |
| Rating / Tree / Toolbar | APG keyboard + SR role match |
| Auth `formState` error/invalid | Alert + field error announced |
| Overlay Dialog/Drawer | Focus trap, Escape, restore |

## How to close

Append a dated section below (or reply in chat) with: environment (macOS VoiceOver / Windows NVDA), Storybook/URL, pass/fail per row, and any defects. Agent will update `nv-rendered-inrepo-2026-08-09.md` and mark AT NVs resolved only with that evidence.

## Pending operator report

- Status: **awaiting @stephencheng**
- Raised: 2026-08-09 clearance Q&A
