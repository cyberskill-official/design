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
| `--accent-text` | `accent-text` | #8B6902 / #F4BA17 | Gold used as text. Passes 4.5:1 on background and panel, not on raised |
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

**Space:** `--space-1`…`--space-20` on a 4px scale (`--space-4` = 16px). **Radius:** `--radius-sm|md|lg|xl|full` (controls md, cards lg, dialogs xl). **Shadow:** `--shadow-sm|md|lg|overlay`. **Layers:** `--z-dropdown|sticky|overlay|modal|toast|tooltip`. **Controls:** `--control-sm|md|lg` (32/40/48px), `--control-touch` (44px).

## Color roles

Fill by role, not by hue. `soft` is a tinted surface, `soft-hover` its hover, `line` a tinted border, `text` text and icons on the tint (4.5:1), `icon` a category icon on the tint (3:1). Set `data-tone` on a toned component, or `class="cs-tone" data-tone="teal"` in app markup for `--tone`, `--tone-soft`, `--tone-line`, `--tone-text`, `--tone-icon`. Tailwind names match (`bg-success-soft`, `text-teal-text`). Which color for what: `color.md`. Light / dark:

| `data-tone` | Tokens | soft | soft-hover | line | text | icon |
|---|---|---|---|---|---|---|
| `primary` | `--primary-*` | #E3E5E8 / #2B3341 | #D9DCE0 / #444C5A | #B9BDC5 / #666E7B | `--primary` #14243D / #E6ECF5 | – |
| `accent` | `--accent-*` | #FEF8E8 / #353426 | #FDF4DA / #474025 | #FCEAB9 / #6C5A22 | #8B6902 / #F4BA17 | – |
| `success` | `--success-*` | #E6F2ED / #193839 | #D7EAE2 / #1D4741 | #B4D7C9 / #256552 | #086745 / #64DAA4 | – |
| `warning` | `--warning-*` | #F2ECE6 / #342A2A | #EAE0D6 / #45322A | #D7C5B3 / #68422B | #653509 / #EA9456 | – |
| `danger` | `--destructive-*` | #FAEBEB / #362439 | #F7DEE0 / #492941 | #F0C2C4 / #6E3352 | #A62D38 / #F677A4 | – |
| `info` | `--info-*` | #E9EFF8 / #23324B | #DBE5F4 / #2C3E5C | #BCCEEA / #3E577F | #1C4F9C / #97BEFD | – |
| `blue` | `--blue-*` | #E9F4FE / #1A2A3F | #DCEDFE / #1F324A | #BEDEFD / #294261 | #1D61A7 / #8BAACE | #2279CF / #6B94C1 |
| `amber` | `--amber-*` | #F9F3E6 / #262923 | #F5ECD7 / #313020 | #ECDCB4 / #473E19 | #795E16 / #B8A564 | #9D740E / #A78D33 |
| `teal` | `--teal-*` | #E6F6F6 / #132F35 | #D7F0F0 / #14393C | #B3E4E3 / #154E48 | #086D73 / #6EBDAA | #05898A / #45AD90 |
| `magenta` | `--magenta-*` | #F4ECF4 / #292136 | #EDE1ED / #35253C | #DEC7DD / #4D2C49 | #5D3366 / #C28AAC | #773B79 / #B56893 |
| `violet` | `--violet-*` | #F8F2FA / #2A2848 | #F3E9F7 / #372E57 | #E9D7F1 / #503C75 | #73538E / #C6A2EE | #9565AF / #BA88EB |

Category tones (blue, amber, teal, magenta, violet) are tint and icon only: never text on their solid color (`--chart-1`…`--chart-5`). **Surfaces:** `--wash` #E9EBEF / #171E2A, `--accent-deep` #DCA112 / #F2AE1C. **Ink surface** (one per view): a dark scope painted with `--gradient-ink` (brand ink to `--ink-deep` #0E1B33). Use `Card surface="ink"`, or set `data-theme="dark"` on the element with that background, so everything on it takes the dark tokens; the build checks text, status colors and control edges on it. **Gradients** (for `background:`): `--gradient-ink`, `--gradient-wash`, `--gradient-gold`, `--gradient-aurora`.

## Motion recipes

Animate only through these, one per property: `transition: background-color var(--motion-state), transform var(--motion-release)`. Size and position (`width`, `height`, `top`, `inset`, `margin`…) only on `--motion-move` or `--motion-pop-in`. Reduced motion is handled for you: `tokens.css` redefines the recipes under `prefers-reduced-motion: reduce`. In React use `transitions` and `springs` from `@cyberskill/design/motion`. Which recipe for what: `motion.md`.

| Recipe | Duration and curve | Under reduced motion |
|---|---|---|
| `--motion-state` | 120ms, `--ease-standard` | kept |
| `--motion-fade` | 180ms, `--ease-enter` | kept |
| `--motion-press` | 80ms, `--ease-enter` | ends at once |
| `--motion-release` | 386ms, `--spring-snappy` (spring) | ends at once |
| `--motion-move` | 386ms, `--spring-snappy` (spring) | ends at once |
| `--motion-pop-in` | 180ms, `--ease-enter` | ends at once |
| `--motion-pop-out` | 120ms, `--ease-enter` | kept |
| `--motion-modal-in` | 406ms, `--spring-smooth` (spring) | a 180ms fade |
| `--motion-modal-out` | 180ms, `--ease-enter` | kept |
| `--motion-sheet-in` | 500ms, `--ease-sheet` | ends at once |
| `--motion-sheet-out` | 280ms, `--ease-sheet` | ends at once |
| `--motion-reveal` | 500ms, `--ease-enter` | a 180ms fade |
| `--motion-celebrate` | 584ms, `--spring-bouncy` (spring) | ends at once |

**Start values:** `--motion-press-scale` 0.97, `--motion-pop-scale` 0.96, `--motion-modal-scale` 0.96, `--motion-rise` 8px, `--motion-stagger` 40ms. Build start and end transforms from these (`transform: scale(var(--motion-pop-scale))`); reduced motion sets the scales to 1 and the distances to 0.
