# Third-party notice — `_vendor/`

Vendored runtime dependencies shipped in the `@cyberskill/design` tarball so the
legacy browser entry (`_esm/cs.mjs` / `exports["./legacy"]`) and offline kit /
Atomic View JSX transforms do not require a CDN.

| Path | Upstream | License |
|---|---|---|
| `_vendor/react/react.production.min.js` | [umd-react](https://github.com/lofcz/umd-react) / React 19.2.8 | MIT |
| `_vendor/react/react-dom.production.min.js` | umd-react / React DOM 19.2.8 | MIT |
| `_vendor/babel/babel.min.js` | [@babel/standalone](https://github.com/babel/babel) 7.29.0 | MIT |

Pin hashes and versions live in each subdirectory `README.md`. Package license
remains **UNLICENSED** for CyberSkill product code; these vendored files keep
their upstream MIT terms. A fuller root `THIRD-PARTY-NOTICES.md` (fonts + other
third-party) is tracked separately.

Exact registry distribution matches and runtime/notice hashes are recorded in `react/provenance.json` and `babel/provenance.json`. The React directory includes the wrapper MIT license plus React and React DOM upstream notices; Babel includes its distribution license. These records do not certify every embedded dependency or confer CyberSkill release acceptance. Run `node _audit/ci/check-vendor-provenance.mjs` for offline integrity checks.
