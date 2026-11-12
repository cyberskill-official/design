# Third-party notices: `@cyberskill/design` 3.x

The package license is **UNLICENSED** (see `LICENSE` and `docs/consumer-grant.md`). That applies to CyberSkill-authored material only. Third-party software keeps its own license; CyberSkill does not relicense it.

## Bundled in the npm package

None. The build keeps every dependency external (`deps.neverBundle` in `packages/design/tsdown.config.ts`), so the tarball holds only CyberSkill code, tokens, CSS, logo files and docs.

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
