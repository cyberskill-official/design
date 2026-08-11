# Contributing

One-page onboarding for extending the CyberSkill Design System. Normative rules live in [`docs/doctrine.md`](docs/doctrine.md) (expansion, verification, immutables). Authoring grammar lives in [`docs/conventions.md`](docs/conventions.md). Consumer orientation lives in [`SKILL.md`](SKILL.md). Published reading surface: Storybook **Docs** at `design.cyberskill.world`.

## When to use

You are adding a component, token, template, language string, or documentation page. Follow doctrine first, then the recipes below.

## Non-goals

This file does not replace doctrine, the product registry, or the consume guide.

## Non-negotiables

- **Anchors are immutable** — Umber `#45210E`, Ochre `#F4BA17`. One accent per surface (Ochre on core; a product's element accent inside its `data-cs-element` scope). Every neutral warmed toward umber — no cold grey.
- **Vietnamese-first & bilingual** — ship EN + VN, preserve diacritics, VN-safe line-heights. Every bilingual template carries a root `lang` (see conventions → Screen-reader language).
- **Accessibility floor** — never remove the 3px Ochre `:focus-visible` ring; ≥44px touch targets on coarse pointers; body text APCA Lc ≥ 75; honour `prefers-reduced-motion`/`prefers-contrast`. All in `base/a11y.css` — don't regress it.
- **Grammar** — Theme × Element × Language × Style are independent axes. Style pack is liquid-glass (sole pack; absent ≡ default).
- **Voice** — warm / direct / honest / respectful. Products are "wishes" Lumi helps grant. Lumi stays golden in every element.

## Expansion and verification

The expansion rule and verification-depth requirement are in **[`docs/doctrine.md`](docs/doctrine.md)**. In short: when anything grows, update every deliverable in the same change; verify the whole set, not a sample. Gate: `_audit/run.html` green + `npm run test:unit` (compiler sessions also run `check_design_system`).

## Adding things — quick recipes

- **Component** — `components/<group>/<Name>.{jsx,d.ts,prompt.md}` + a `.cs-*` style block in the matching `base/*.css` + add to the group's `*.card.html`. Void-element components (`<input>`/`<hr>`) must destructure `children` out of `...props` (React #137 rule). Correct ARIA roles/labels.
- **Token** — add to the right `tokens/*.css`; if it's a semantic/surface token, give it a `[data-theme="dark"]` (+ system) override and verify contrast on `#221710`. Regenerate `tokens/tokens.json`/`.js`. New element/variant sets all 10 `--cs-accent-*` roles (`_audit/token-contract.html` checks this).
- **Template** — `templates/<slug>/<Slug>.dc.html` (DC) with `<!-- @template … -->` first + `ds-base.js`. Bilingual with a Language tweak + root `lang`. Docs get `@page{size}` + `<meta name="omelette-owns-print">`. Element ×15 tweaks. DC files need a Design Components compiler; static consumers use `styles.css` + `.cs-*` instead.
- **Card / guideline** — `.html` with `<!-- @dsCard group="…" … -->` first line.
- **Documentation** — EN + VI for every `docs/*.md`; add the page to the Storybook Docs sidebar (catalog + story) and `docs/viewer.html`. `docs-storybook-coverage` fails if the page exists only in git.

## Agent MCP (CyberOS)

Tracked `.mcp.json` points at `scripts/mcp/cyberos-mcp.mjs` (not gitignored `.cyberos/` directly). That stub forwards to `.cyberos/mcp/cyberos-mcp.mjs` after `cyberos install`; on a fresh clone it exits cleanly and leaves the server disconnected. Prefer user-level MCP or an unstaged local overlay if you need a private server list — do not reintroduce a tracked path into gitignored `.cyberos/`.

## Documented scope boundaries (not gaps)

UI-kit pages remain Thổ-faithful recreations; bilingual EN·VN covers emails + team/legal/finance docs (client/media collateral is EN-first); text never sits on the mid-tone `-accent`; email-safe send variants are exemplars in `templates/email-safe/` (others convert on request).
