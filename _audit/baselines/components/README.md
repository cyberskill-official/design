# Component baselines

12 curated component crops (280×160), one per `_audit/component-visual-diff.html` cell — Button, Badge, Alert, Toast, Card, DataTable, Accordion, TextField, Avatar, ProgressBar, Switch, Tooltip.
`guidelines/atomic-view.html` supplies the broader live story set; these twelve crops do not cover every component state.

**After an approved visual change:** open `component-visual-diff.html` and set the viewport explicitly. The page grid is responsive: at 320/909/1280px it currently has one/three/four columns; each `.box` remains 280×160. At 909px, capture the page, use the actual box bounds to crop the changed cell, then review the replacement before saving over `<slug>.png`. Do not assume the page has an intrinsic 909px width or fixed crop coordinates. The page's own coverage check (`window.__componentVisualDiff`, wired into `_audit/run.html` as an advisory row) only verifies every declared baseline file exists — drift itself is judged by eye, same doctrine as the template-level `visual-diff.html`.
