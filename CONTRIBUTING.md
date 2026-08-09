# Contributing to the CyberSkill Design System

How to extend the system without breaking its guarantees. The operative rules live in `CLAUDE.md` (persistent doctrine), `docs/conventions.md` (decision log + authoring rules), and `SKILL.md` (consumer orientation); this file is the one-page onboarding that ties them together.

## Non-negotiables

- **Anchors are immutable** — Umber `#45210E`, Ochre `#F4BA17`. One accent per surface (Ochre on core; a product's element accent inside its `data-cs-element` scope). Every neutral warmed toward umber — no cold grey.

- **Vietnamese-first & bilingual** — ship EN + VN, preserve diacritics, VN-safe line-heights. Every bilingual template carries a root `lang` (see conventions → Screen-reader language).

- **Accessibility floor** — never remove the 3px Ochre `:focus-visible` ring; ≥44px touch targets on coarse pointers; body text APCA Lc ≥ 75; honour `prefers-reduced-motion`/`prefers-contrast`. All in `base/a11y.css` — don't regress it.

- **Grammar** — Theme × Element × Language × Style are independent axes. Style pack is liquid-glass (sole pack; absent ≡ default).

- **Voice** — warm / direct / honest / respectful. Products are "wishes" Lumi helps grant. Lumi stays golden in every element.

## The Expansion Rule (owner-mandated)

When **anything** grows — a new element/variant, icon, component, token role, language, or template pattern — propagate it to **every** deliverable in the *same* change:
1. Tokens/source (`tokens/`, component `.jsx` + `.d.ts` + `.prompt.md`)
2. Specimen cards (guidelines + the component-group card) **and related guideline pages**
3. **All** templates (tweak enums, EL/EX maps, swept accents)
4. UI kits — Thổ-faithful kit pages; axis demos via Storybook toolbar + Atomic View (Identity Lab retired)
5. Docs — README/SKILL, `docs/conventions.md`, and every related doc; regenerate `docs/contrast-report.md` after token changes and `tokens/tokens.json`+`tokens.js` after any token change
6. **`VERSION` auto-bumps on push to `main`** (Conventional Commits → `.github/workflows/version.yml` → tag `v*` → npm publish). Owner can still force a level via Actions `workflow_dispatch` or a `Release-As: X.Y.Z` trailer. **Do not write a changelog** — LAUNCHED at **1.1.0**; pin tracks `VERSION`

**Gate:** `check_design_system` clean **+** `_audit/run.html` fast board green **+** a grep for the old enum/list to prove nothing was left behind. (`check_design_system` is the Claude Design compiler's built-in check — available only in compiler sessions. The portable clone equivalent is `_audit/run.html` fast board + `npm run test:unit`.)

## Verification depth (owner-mandated)

Deep checks, never surface spot-checks. Cover the **whole set and every relevant state** — prefer deterministic programmatic scans that touch every item (the `_audit/` harnesses: run `_audit/index.html`), then add representative visual/export confirmation. Language, theme, and responsive states each get their own pass. A few screenshots are evidence, not proof. If a full check isn't feasible, say so and state what was and wasn't covered.

## Adding things — quick recipes

- **Component** — `components/<group>/<Name>.{jsx,d.ts,prompt.md}` + a `.cs-*` style block in the matching `base/*.css` + add to the group's `*.card.html`. Void-element components (`<input>`/`<hr>`) must destructure `children` out of `...props` (React #137 rule). Correct ARIA roles/labels. Run `check_design_system`.

- **Token** — add to the right `tokens/*.css`; if it's a semantic/surface token, give it a `[data-theme="dark"]` (+ system) override and verify contrast on `#221710`. Regenerate `tokens/tokens.json`/`.js`. New element/variant sets all 9 `--cs-accent-*` roles (`_audit/token-contract.html` checks this).

- **Template** — `templates/<slug>/<Slug>.dc.html` (DC) with `<!-- @template … -->` first + `ds-base.js`. Bilingual with a Language tweak + root `lang`. Docs get `@page{size}` + `<meta name="omelette-owns-print">`. Element ×15 tweaks.

- **Card / guideline** — `.html` with `<!-- @dsCard group="…" … -->` first line.

## Documented scope boundaries (not gaps)

UI-kit pages remain Thổ-faithful recreations; bilingual EN·VN covers emails + team/legal/finance docs (client/media collateral is EN-first); text never sits on the mid-tone `-accent`; email-safe send variants are exemplars in `templates/email-safe/` (others convert on request).
