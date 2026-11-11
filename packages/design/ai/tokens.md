# Tokens (@cyberskill/design)

Use semantic tokens, never hex values. They switch with `data-theme` (`light` default, `dark`, `system`) on `<html>` or any element.

| CSS variable | Tailwind color name | Light / Dark | Use |
|---|---|---|---|
| `--background` | `background` | #F7F8FA / #0A111D | Page canvas |
| `--panel` | `panel` | #FFFFFF / #111A29 | Cards and panels |
| `--raised` | `raised` | #EEF1F5 / #182335 | Nested sections, hover rows, skeletons |
| `--border` | `border` | #DDE2EA / #253247 | Dividers and card edges |
| `--input` | `input` | #7D889B / #66748A | Form control borders (3:1) |
| `--foreground` | `foreground` | #0F1B2D / #E9EEF6 | Headings and body text |
| `--muted` | `muted` | #525F73 / #9AA7BA | Secondary text and labels |
| `--primary` | `primary` | #14243D / #E6ECF5 | Ink: main actions, links, structure |
| `--primary-foreground` | `primary-foreground` | #FFFFFF / #0A111D |  |
| `--accent` | `accent` | #F4BA17 / #F4BA17 | CyberSkill gold: highlights, key actions, AI moments |
| `--accent-foreground` | `accent-foreground` | #1A1406 / #1A1406 |  |
| `--accent-text` | `accent-text` | #8B6902 / #F4BA17 | Gold used as text on light surfaces |
| `--success` | `success` | #067A4B / #43D58F |  |
| `--warning` | `warning` | #7B3C00 / #EA7D2E |  |
| `--destructive` | `destructive` | #CC323B / #F9598F |  |
| `--info` | `info` | #1F5CB8 / #82B2FF |  |
| `--primary-soft` | `primary-soft` | derived | Selected rows, active nav item |
| `--destructive-foreground` etc. | `destructive-foreground` | derived | Text on a filled status color |
| `--ring` | `ring` | = `--primary` | Focus outline |
| `--card`, `--popover` | `card`, `popover` | = `--panel` | Aliases for shadcn-style code |
| `--card-foreground`, `--popover-foreground` | same names | = `--foreground` | Aliases |
| `--gold`, `--on-gold` | `gold`, `on-gold` | = `--accent`, `--accent-foreground` | Aliases |
| `--muted-foreground` | – | = `--muted` | Alias (CSS only) |
| `--chart-1`…`--chart-5` | `chart-1`… | #2790F8, #C08A06, #03A4A1, #91438C, #B678CF / #4C7DB4, #977502, #1C9D77, #A8477A, #AE6FE8 | Chart series in fixed order: Blue, Gold, Teal, Magenta, Violet |

**Type:** classes `cs-display`, `cs-h1`–`cs-h4`, `cs-body-lg`, `cs-body`, `cs-ui`, `cs-caption`, `cs-overline`, `cs-code`. Fonts `--font-display` (Manrope, headings), `--font-sans` (Be Vietnam Pro, body/UI), `--font-mono` (JetBrains Mono, data/code). Tailwind: `font-display`, `font-sans`, `font-mono`.

**Space:** `--space-1`…`--space-20` on a 4px scale (`--space-4` = 16px). **Radius:** `--radius-sm|md|lg|xl|full` (controls md, cards lg, dialogs xl). **Shadow:** `--shadow-sm|md|lg|overlay`. **Motion:** `--duration-fast|base|slow`, `--ease-standard|emphasized|exit`. **Layers:** `--z-dropdown|sticky|overlay|modal|toast|tooltip`. **Controls:** `--control-sm|md|lg` (32/40/48px), `--control-touch` (44px).
