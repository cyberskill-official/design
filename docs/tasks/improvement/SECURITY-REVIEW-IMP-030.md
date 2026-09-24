---
task: TASK-IMP-030
recorded_at: 2026-09-15
---

# Security review — high-risk widgets

Static review against the enterprise-audit action-9 list. This is not a penetration-test report.

| Surface | Trusted content | Focus / overlay | Evidence |
|---|---|---|---|
| Editor | HTML sanitized; URL scheme allowlist | Toolbar + textbox | `_audit/ci/test-trusted-html.mjs`, `_audit/ci/test-editor-sanitize.mjs`, high-risk AT |
| Image preview | `src` is caller-supplied; no `innerHTML` | Overlay Escape + live region | `components/data/Image.jsx`, high-risk AT |
| Sortable | Labels rendered as text | Move buttons + live announcement | high-risk AT / a11y-gate |
| Carousel | Slots as children | Keyboard arrows + live slide index | high-risk AT / a11y-gate |
| Dialog / AlertDialog | Title/body as React children | Trap + Escape + restore | a11y-gate + high-risk AT |
| Menu / Combobox / DataGrid / DatePicker / TimePicker | No raw HTML concatenation | APG keyboard | a11y-gate + high-risk AT |

Sanitizer contracts stay in `@cyberskill/primitives` / `ALLOWED_URL_SCHEMES`. Do not treat this note as NVDA/JAWS clearance.
