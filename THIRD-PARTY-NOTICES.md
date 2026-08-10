# Third-party notices — `@cyberskill/design`

The package license is **UNLICENSED** (see `package.json` and `docs/consumer-grant.md`). That assertion applies to **CyberSkill-authored** material only. Redistributed third-party assets retain their upstream licenses; CyberSkill does not re-license them.

## Fonts (`fonts/`)

Self-hosted webfonts (`.woff2`) for:

| Family | Upstream | License |
|---|---|---|
| Be Vietnam Pro | [bettergui/BeVietnamPro](https://github.com/bettergui/BeVietnamPro) | SIL Open Font License 1.1 |
| JetBrains Mono | [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) | SIL Open Font License 1.1 |
| Space Grotesk | [floriankarsten/space-grotesk](https://github.com/floriankarsten/space-grotesk) | SIL Open Font License 1.1 |

Full license text and copyright lines: [`fonts/OFL.txt`](fonts/OFL.txt).

## Vendored browser runtimes (`_vendor/`)

Hosted / Storybook / template tooling may load these; they are not always present in every npm tarball revision (see Phase 1 packaging). When redistributed:

| Asset | Upstream | License |
|---|---|---|
| `_vendor/react/` (UMD React / ReactDOM) | [facebook/react](https://github.com/facebook/react) | MIT |
| `_vendor/babel/` (`@babel/standalone`) | [babel/babel](https://github.com/babel/babel) | MIT |

## Template vendor scaffold

| Asset | Notes |
|---|---|
| `templates/_vendor/deck-stage.js` | Copied from an omelette starter scaffold (header comment). Provenance and license are not established upstream; treat as third-party until attributed. |

## Related

- Consumer grant carve-out: `docs/consumer-grant.md`
- Font face declarations: `tokens/fonts.css`
