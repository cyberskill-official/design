# Component contract

The checklist every Stable component must meet. Use this page as the Storybook documentation template. Published on Storybook **Docs** at `design.cyberskill.world`.

## Anatomy of a Stable page

Every Stable component story/docs page includes (facts come from `docs/stable-contracts.json`, generated from source + prompts + registry — not a shared stub paragraph):

1. Anatomy
2. Usage / do / don’t
3. States
4. Content
5. Keyboard and AT behavior
6. Tokens
7. Responsive / RTL / dark / high-contrast
8. Code
9. SSR
10. Migration notes
11. Design / maturity status (from `docs/export-registry.json`)

## Runtime contract

- Semantic host element (button, a, input, dialog — not a clickable `div` without a role)
- `forwardRef` on every interactive public export (providers skipped). Button remains the reference implementation; `_audit/ci/test-component-contracts.mjs` fails the set if any host is missing.
- Controlled and uncontrolled rules documented
- Slots / children policy
- Event and keyboard model
- Focus restoration for overlays (`useOverlayLayer`)
- Localization keys in `components/_i18n/strings.js`
- RTL via `dir` on `ThemeProvider` or ancestor
- Responsive states
- SSR: no `document` at module scope; theme boot via `getThemeInitScript`
- Deprecation metadata in the export registry
- API compatibility covered by contract tests

## High-risk widgets

Editor, Image preview, Sortable, Carousel, and dialogs have extra tests in `_audit/ci/test-component-contracts.mjs` and `_audit/ci/test-trusted-html.mjs`.

## Related

- Trusted HTML: `docs/trusted-html.md`
- Governance: `docs/governance.md`
- Token layers: `docs/token-layers.md`
