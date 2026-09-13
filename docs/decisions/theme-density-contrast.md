# Theme attributes — density + contrast (G3 / CDS-THEME-002)

Status: **accepted** (2026-08-25) — operator decision **C** (density **and** contrast one wave).  
Owner: design-system maintainer.  
Task: `TASK-IMP-027`

## Decision

Ship **density** and **contrast** as **attributes under Theme**, not a fifth product identity axis.

| Attribute | Values | Default (absent ≡) |
|-----------|--------|--------------------|
| `data-cs-density` | `comfortable` · `compact` | `comfortable` |
| `data-cs-contrast` | `standard` · `high` | `standard` |

Product axes remain **Theme × Element × Language × Style**. Density/contrast compose with `data-theme` (light · dark · system) and never with Element/Language.

Retired Expression/Density **product surface** (pre-four-axis era) stays banned: no `data-cs-expression`, no `tokens/density.css` / `tokens/expressions.css` imports, no Density runner gate. The attribute `data-cs-density` is now an **allowed Theme attribute** — `_audit/axis-guard.html` allowlists it and `data-cs-contrast` while still forbidding Expression and retired CSS packs.

## Token plan

| Role family | Density map | Contrast map |
|-------------|-------------|--------------|
| Spacing scale aliases `--cs-density-space-*` | compact ≈ 0.75× of `--cs-space-*` for 1–6; section floors unchanged | — |
| Control padding / gaps (`--cs-component-button-*-padding*`, `--cs-component-button-gap`, textfield padding) | compact tightens Y/X padding; **minHeight floors stay ≥44px** (immutable touch target) | — |
| Text / border (`--cs-color-text-muted`, `--cs-color-border-default`) | — | `high` darkens muted text + strengthens borders (mirrors `prefers-contrast: more` intent) |
| Focus ring | unchanged | unchanged (composite text-primary + ochre halo) |

APCA body floor **Lc ≥ 75** is preserved: high-contrast only strengthens muted/border roles; anchors (Umber/Ochre) and primary text are untouched.

Implementation lives in `tokens/theme-attributes.css`, imported from `styles.css` after core tokens.

## Demo

- Storybook toolbar: Density + Contrast globals (independent of Element/Language).
- Atomic View toolbar: Density + Contrast selects; apply via `data-cs-density` / `data-cs-contrast` on the axis host (no Element/Language coupling).

## Gate plan

| Gate | After this change |
|------|-------------------|
| `axis-guard` | Allowlist `data-cs-density` / `data-cs-contrast` as Theme attributes; still fail on Expression + retired density/expressions CSS packs + Density runner names |
| `contrast-guard` / light-contrast | Must stay green (high-contrast maps must not regress body Lc) |
| `a11y-harness` | Touch targets remain ≥ documented floors under compact |
| `docs-consistency` | Stale-phrase blacklist unchanged; docs must not claim density is a product axis |

## Non-goals

- Do not redesign Tabs or overlay manager.
- Do not ship a second Style pack under the guise of density.
- Do not weaken focus rings or 44px touch targets for compact.
