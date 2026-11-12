# Color (@cyberskill/design)

> Ink & Gold, where every color has a job. Roles for tints, lines and text, five category tones, gold for what is on, four gradients, all checked for contrast and color-blind safety.

Color always has a job: an action, a state, a category, a status or one brand moment. Use **semantic tokens** (`--primary`, `--accent-soft`, `--teal-icon`…) in product code. They flip between light and dark for you. Ramps are for illustrations and data only.

## How much of each

| Surface | Neutrals | Ink | Tints | Gold | Status |
|---|---|---|---|---|---|
| Product screens | ~76% | ~9% | ~9% | ~4% | ~2% |
| Marketing pages | ~62% | ~20% | ~8% | ~8% | ~2% |

Large areas stay quiet and small things carry the strong color. Tints are a color's own soft fill (`--<color>-soft`) on secondary buttons, icon tiles, avatars, tags and highlight cards. Gold fills what is on, done or key, and stays rare enough to mean it.

## Color in use

A product screen in Ink & Gold keeps five habits:

- **Tinted surfaces.** Secondary buttons and highlight cards take a soft tint of their own color instead of a grey outline.
- **Category color.** The five chart colors also name things: icon tiles, avatars, tags. Same order everywhere.
- **One ink surface.** The most important summary on a screen sits on ink with gold on top (`Card surface="ink"`). One per view.
- **Gold means on, done, key.** Checked controls and progress fill with gold and carry an ink mark. Gold never decorates.
- **Status stays put.** Green, orange, red and blue keep their meaning and always carry an icon and a word.

## Roles

Every color comes in the same five roles. The token build derives them from the base colors and fails if a text role drops under 4.5:1 on its own tint, or a category icon under 3:1 on its tile. Tints are heavier in dark (16%) than in light (10%).

- **soft** (`--<color>-soft`) is the fill behind tinted things: soft buttons, icon tiles, avatars, tags and tinted cards. **soft-hover** (`--<color>-soft-hover`) is the same fill under the pointer.
- **line** (`--<color>-line`) is a tinted border or divider, such as the edge of a tinted card.
- **solid** (`--<color>`, with `--<color>-foreground` on it) is a full fill, for the one key action or a filled status.
- **text** (`--<color>-text`) is the color as text or an icon, on its soft fill or on a panel. Ink's text role is `--primary` and gold's is `--accent-text`.
- **icon** (`--<category>-icon`) is the glyph on a category's icon tile.

The colors are ink (`--primary-*`), gold (`--accent-*`), the four status colors (`--success-*`, `--warning-*`, `--destructive-*`, `--info-*`; components call the last two `danger` and `info`) and five category tones: `blue`, `amber`, `teal`, `magenta` and `violet`, in chart order, each taking its base color from `--chart-1` … `--chart-5`.

**Category colors never carry text on their solid.** White text on them is about 3:1, so they tint and color icons only, and their solid is for data. A category is never a status: blue is not info and amber is not a warning. To give a person or a tag a tone that stays the same on every screen, use `toneFor(name)`.

## Where gold goes

Gold on white is only 1.8:1. So gold fills shapes that carry an ink mark (`--accent-foreground`) or sit next to a written value, and in light every gold shape gets a dark-gold edge (`--accent-text`, 5.1:1 on a panel). Thin lines stay ink. In dark, gold reaches 9.9:1 on a panel and needs no edge.

| Gold fill | Stays ink | Never gold |
|---|---|---|
| Switch on, checkbox and radio checked, slider range, progress and meter fill, count badges in the side nav, the one key action, AI moments | Primary button, links, tab line, selected nav item, focus ring, selected table row | Status of any kind, body text on light, borders and dividers, decoration |

## Components that gain color

`Button` has `variant="soft"` with a `tone`, and `secondary` is now a soft ink fill instead of a grey outline. `IconTile` is new. `Avatar`, `Tag`, `Badge`, `Stat` and `Card` take a `tone`, `Stat` takes an `icon`, and `Card` takes `surface="ink"` or `surface="aurora"`. `Switch`, `Checkbox`, `Radio`, `Slider`, `Progress` and `Meter` fill with gold; pass `tone="primary"` to `Progress` or `Meter` for ink. `Alert` and `Toast` keep their status tones. In an app's own markup, `.cs-tone` with a `data-tone` attribute gives the same `--tone-*` variables.

```tsx
<Stat label="Pass rate" value="86.4%" icon={<Trophy />} tone="teal" delta={{ value: '+2.1 pts', trend: 'up' }} />
<Avatar name="Lê Thu Hà" tone={toneFor('Lê Thu Hà')} />
<Button variant="soft" tone="accent" iconStart={<Sparkle />}>Ask AI</Button>
<Card surface="ink">…</Card>
```

## Gradients

Four tokens, used with `background:`, and no others. Use at most one per view, besides the one ink surface.

| Token | Use it for |
|---|---|
| `--gradient-ink` | The one inverse surface on a view (`Card surface="ink"`) |
| `--gradient-wash` | The top of a page: a 6% ink wash fading into the canvas |
| `--gradient-gold` | The key action on marketing pages only |
| `--gradient-aurora` | AI answers and summaries (`Card surface="aurora"`): soft blue, teal and gold over the panel |

## Palette

Six base colors in each theme: ink (`--primary`), gold (`--accent`), text (`--foreground`), muted text (`--muted`), the page (`--background`) and cards (`--panel`).

## Semantic tokens

Each base token has a light and a dark value, and the build derives the rest from them. The tints, lines and text colors are the roles above.

## Status colors

Every pair stays at least ΔE 15 apart for normal vision and ΔE 8 for red-blind and green-blind vision. Status is still never shown by color alone: chips, alerts and toasts carry an icon and text.

## Chart palette

Series take colors in a fixed order (blue, gold, teal, magenta, violet) and keep them when filters change. Each color passes 3:1 on the chart surface and stays at least ΔE 15 from every status color, so a chart never reads as an alert. The category tones take their base colors from this list, in the same order, so a category and its chart series match.

## Ramps

Ink, gold and neutral ramps from 50 to 950, generated in OKLCH so steps look even, with the exact brand color pinned at its nearest step.

## Contrast checks

The token build checks every pairing in both themes, roles included, and fails if any drops below its target: 7:1 for body text, 4.5:1 for other text, 3:1 for control edges and icons.

## Rules

### Do

- Give every color a job: an action, a state, a category, a status or one brand moment.
- Keep one solid key action per view. Everything else is soft, secondary or ghost.
- Fill by role (`soft`, `line`, `text`, `solid`), never by hex.
- Keep large areas quiet and let small things carry the strong color.
- Keep a color's meaning the same on every screen and in both themes.
- Use `--accent-text` for gold as text on light backgrounds. Bright gold is for fills.

### Don't

- No gold as decoration or as a status. No status color as decoration.
- No category color for status, and no text on a solid category color.
- No more than one ink surface and one gradient per view, and no gradient outside the four tokens.
- No meaning carried by color alone. Add the icon and the word.
- No white text on gold.
- No Tailwind palette colors, hex values or a second UI kit's theme in an app. The CSS check blocks hex in the package.
