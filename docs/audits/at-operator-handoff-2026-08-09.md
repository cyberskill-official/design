# Assistive-technology handoff — current state (updated 2026-08-24)

**Owner:** Stephen Cheng (operator)  
**Related:** [`at-automation-coverage.md`](./at-automation-coverage.md) · [`at-manual-checklist.md`](./at-manual-checklist.md) · [`ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md`](./ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md) · [`ux-audit-2026-08-23/roadmap.md`](./ux-audit-2026-08-23/roadmap.md)

Agents **cannot** invent NVDA/VoiceOver pass results. Automated proxies now **map** to every AT-01…16 row — see [`at-automation-coverage.md`](./at-automation-coverage.md). This handoff lists **human-only** work only.

## Automated proxies (CI — not AT pass)

Run: `npm run test:audit-probe` (with static server on `:8790`).

| Proxy | Gate | Covers (matrix IDs) |
|---|---|---|
| Keyboard + focus + APG | `_audit/a11y-gate.html` | AT-01…11 (incl. nested Esc AT-03, CommandPalette AT-06) |
| axe serious/critical + open overlays | `_audit/axe-smoke.html` | All primaries incl. CommandPalette AT-06 |
| Product surfaces AT-12…16 | `_audit/at-kit-probe.html` | Auth, website, settings, marketing VN, disciplinary HT |
| Artifact head | `_audit/artifact-head.html` | Partial AT-12 (title, lang, `#main`) |
| VN EN-leak lexicon | `_audit/language-overflow.html` | Partial AT-15 |
| Light contrast walk | `_audit/light-contrast.html` | Partial AT-16 |

Coverage drift guard: `_audit/ci/test-at-coverage-map.mjs` (in `npm run test:unit`).

## Clearance minimum already accepted (2026-08-09)

Operator VoiceOver run against the **clearance subset** only — does **not** close the broader AT matrix.

| Surface | Result (2026-08-09) |
|---------|---------------------|
| Mentions | **PASS** (operator) |
| Sortable | **PASS** (operator) |
| Rating / Tree / Toolbar | **PASS** (operator) |
| Auth error/invalid | **PASS** (operator) |
| Dialog focus | **PASS** (operator) |

## Human-only — remaining ☐ rows

Use **[`at-manual-checklist.md`](./at-manual-checklist.md)** (copy-paste speech scripts). Mark results only in [`at-matrix-ux-audit-2026-08-08.md`](./ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md).

| Priority | IDs | What automation cannot prove |
|---|---|---|
| Overlays & menus | AT-01…06 | Speech: names, descriptions, filter feedback, Esc announcement order |
| Forms & widgets | AT-07…11 | Speech: options, sort, selection, tab names |
| Product surfaces | AT-12…16 | Browse/landmarks, switch state, EN residual quality, HT pronunciation |

**Rule:** Both NVDA **and** VoiceOver must pass before ☑.

### How to execute

```bash
cd /path/to/design
python3 -m http.server 8790 --bind 127.0.0.1
# optional: npm run storybook → http://localhost:6006
```

1. Open [`at-manual-checklist.md`](./at-manual-checklist.md).
2. For each row: run NVDA session, then VoiceOver session.
3. Replace ☐ with ☑ and fill **Result** / **Notes** in the matrix file.

## Operator report — 2026-08-09 (clearance minimum only)

- Status: **received · clearance minimum PASS**
- Operator: `@stephencheng`
- Environment: macOS · VoiceOver · Safari/Chrome
- Storybook tip at acceptance: `d9f15dd` / `1.3.0`

Defects on that subset: none reported. Full matrix remains open until human sessions complete.
