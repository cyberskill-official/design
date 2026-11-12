# Third-party notices: `@cyberskill/design` 3.x

The package license is **UNLICENSED** (see `LICENSE` and `docs/consumer-grant.md`). That applies to CyberSkill-authored material only. Third-party software keeps its own license; CyberSkill does not relicense it.

## Bundled in the npm package

No code. The build keeps every dependency external (`deps.neverBundle` in `packages/design/tsdown.config.ts`), so the tarball holds only CyberSkill code, tokens, CSS, logo files, docs and the three typefaces below.

**Fonts** (`fonts/*.woff2`, loaded by `@cyberskill/design/fonts.css`), unmodified Latin and Vietnamese subsets from Fontsource 5.3.0, each under the [SIL Open Font License 1.1](https://openfontlicense.org):

| Typeface | Copyright |
|---|---|
| Be Vietnam Pro | 2021 The Be Vietnam Pro Project Authors (https://github.com/bettergui/BeVietnamPro) |
| Manrope | 2019 The Manrope Project Authors (https://github.com/sharanda/manrope) |
| JetBrains Mono | 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono) |

The license texts ship next to the files (`fonts/LICENSE-*.txt`).

## Installed alongside it by npm

These are separate packages that npm installs under their own licenses.

| Package | Role | License |
|---|---|---|
| `@base-ui/react` | Dependency: component behavior | MIT |
| `clsx` | Dependency: class names | MIT |
| `react`, `react-dom` | Peer | MIT |
| `@phosphor-icons/react` | Peer: icons | MIT |
| `recharts` | Optional peer (`/charts`) | MIT |
| `@tanstack/react-table`, `@tanstack/react-virtual` | Optional peers (`/table`) | MIT |
| `react-hook-form` | Optional peer (`/forms`) | MIT |
| `react-day-picker`, `date-fns` | Optional peers (`/date`) | MIT |

## Fonts

The tokens name Manrope, Be Vietnam Pro and JetBrains Mono (all SIL Open Font License 1.1). No font files ship in 3.x: each app loads them itself, for example with `next/font/google`.
