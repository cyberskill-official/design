# Doctrine

Normative rules for extending and verifying the CyberSkill Design System. Host-specific files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) are shims that point here. Consumers start at `SKILL.md` and the Storybook **Docs** sidebar at `design.cyberskill.world`. Published on Storybook **Docs** at `design.cyberskill.world`.

## When to use

- You are adding or changing an element, variant, icon, component, token role, language, or template pattern.
- You are verifying a change before calling it done.
- You need the immutables that must never be redesigned ad hoc.

## Non-goals

This file is not a changelog, not a product registry, and not a consume guide. Product → element mappings live in `docs/products.md`. Adoption paths live in `docs/consuming.md`.

## Expansion rule

When **anything** in this system grows, update **every deliverable in the same change**:

1. Tokens and source (`tokens/`, component `.jsx` + `.d.ts` + `.prompt.md`).
2. Specimen cards (guidelines plus the component group card) **and any related guideline pages**.
3. **All** templates (tweak enums, EL/EX maps, swept accents).
4. UI kits — Thổ-faithful kit pages; axis demos via Storybook toolbar and Atomic View (Identity Lab is retired).
5. Docs: README (counts follow `docs/reference-catalog.json`), `SKILL.md`, this file, `docs/conventions.md`, **and every related document the change touches** (kit READMEs, `docs/products.md`, `docs/contrast-report.md` regeneration after token changes). Publish the same pages through Storybook Docs (see `docs/storybook.md`). **Do not maintain a changelog file** — track `VERSION`. Continuity is git history plus curated Release Notes.
6. Browsable and health surfaces: a new or changed component gets an Atomic View story in `guidelines/atomic-view.html` (plus a live playground if it has tweakable props — `_audit/story-coverage.html` enforces the story) and behavior coverage in `_audit/component-behavior-test.html` if interactive; any new axis, tool, or tab is wired into `_audit/index.html` and Storybook **Status** (full-bleed `_audit/run.html` — `dashboard.html` is redirect-only); the matching deterministic gate is added or updated (`contrast-guard` for new colour rules, `token-contract` plus the contrast matrix for tokens, `story-coverage` for components, `docs-storybook-coverage` for published docs).

**Gate:** `_audit/run.html` (all fast gates, including `docs-consistency`) green **plus** `npm run test:unit` **plus** a source search for the old enum or list to prove nothing was left behind. Sessions with an external Design Components compiler additionally run its `check_design_system`; this is not an in-repository command.

Documented scope boundaries (doctrine, not gaps): UI-kit pages remain Thổ-faithful recreations; bilingual EN·VN covers emails plus team, legal, and finance docs (client and media collateral is EN-first); text never sits on the mid-tone `-accent`.

## Verification depth

Deep checks, never surface spot-checks. Cover the **whole set and every relevant state** — not a sample. Prefer deterministic, programmatic scans that touch **every** item (for example EN/VI key-parity, hole-coverage, and leak scan across all templates; computed-style and overflow probes at every breakpoint via the `_audit/` harnesses using `__dcSetProps` for each declared language/theme prop and verifying the rendered state; `__dc_theme` changes only the optional authoring canvas background), then add representative visual or export confirmation on top. A few screenshots are evidence, not proof. Never call work verified because it was “spot-checked” when a complete check is feasible; if a full check truly is not feasible, say so explicitly and state what was and was not covered. Language, theme, and responsive states each get their own pass — one language, width, or theme rendering cleanly is not evidence for the others.

## Immutables

| Immutable | Value |
|---|---|
| Slogan | *Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí* |
| Primary brand | Umber `#45210E` |
| Primary accent | Ochre `#F4BA17` |
| Voice | warm · direct · honest · respectful (all four at once) |
| Language | Vietnamese-first; every UI string ships an EN + VN pair |
| Accessibility floor | APCA Lc ≥ 75 body text; focus rings never removed; ≥ 44px touch targets |
| Axes | Theme × Element × Language × Style (independent) |
| Style pack | liquid-glass (sole pack; absent ≡ default) |

One accent per surface. Semantic statuses and the composite focus indicator (text-primary contour + ochre halo) are never elemental. Lumi stays golden in every element.

## Published documentation

Operator and entrance docs are canonical as markdown in this repository. Public catalog pages must appear in the Docs sidebar and Documentation Library (`docs/viewer.html`); linked public decision records must resolve. `docs-storybook-coverage` and `docs-link-check` verify that contract. Publication uses the explicit file inventory in `scripts/public-site-policy.json`, shared by Storybook and the final webroot. Task records, historical audits, internal plans, workflows and maintenance scripts stay repository-only. A tracked file is not automatically public; review its audience and required assets before adding it to the inventory.

Semantic status fills and text are separate roles: pair `--cs-color-semantic-{role}` with `-fg`, and use `-text` for text on page/panel/raised surfaces. Body muted text and regular links retain APCA75 across element surfaces and contrast preferences. Fixed white paper sheets declare Light and primary color together so text does not inherit a Dark computed color from the desk; adaptive sheets keep their theme.

Strong callout fills and paired `on-strong` foregrounds must support body APCA75 and WCAG4.5 in Light and Dark. Generation targets78 to allow rounding slack. The paired foreground is the Dark primary-button foreground; `accent-on` is not an interchangeable alias. Decorative separator glyphs remain visible and explicitly hidden from the accessibility tree; content and focusable controls must never be hidden by that treatment.
