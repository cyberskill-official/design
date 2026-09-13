# Trusted HTML and sanitizer policy

Enterprise contract for `Editor`, `Logo`, and any future rich-text surface. Published on Storybook **Docs** at `design.cyberskill.world`.

## Trust boundary

`Editor` treats `defaultValue` / `value` as **untrusted**. `sanitizeHtml` in `components/_utils/sanitize-html.js` strips scripts, event handlers, embedded browsing contexts, and `javascript:` / `data:` / `blob:` URLs. Allowed schemes: `http`, `https`, `mailto`, `tel`, plus relative paths.

Do not bypass the sanitizer with `dangerouslySetInnerHTML` in product code.

## Logo

`Logo` injects **repository-controlled** SVG path data (`CS_LOGO_MARK_INNER`) plus an escaped title. That pattern is trusted static markup, not a user-HTML sink. Documented on the component.

## CSP guidance

Consumers should keep `script-src` free of `unsafe-eval`. User-authored HTML should render inside a CSP that forbids script execution in that subtree. The design-system package itself is static.

## Related

- Tests: `_audit/ci/test-trusted-html.mjs`
- Component contract: `docs/component-contract.md`
- Notices: `THIRD-PARTY-NOTICES.md`
