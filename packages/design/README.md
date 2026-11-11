<img src="https://cdn.jsdelivr.net/npm/@cyberskill/design@3/assets/logo-primary.svg" width="56" height="56" alt="CyberSkill">

# @cyberskill/design

CyberSkill Design System: Ink & Gold tokens, accessible React components and chart presets. Live docs: **[design.cyberskill.world](https://design.cyberskill.world)**.

```bash
npm install @cyberskill/design @phosphor-icons/react
```

```css
@import 'tailwindcss';                       /* optional */
@import '@cyberskill/design/tailwind.css';   /* optional, Tailwind v4 theme */
@import '@cyberskill/design/styles.css';
```

```tsx
import { Button, TextField, Dialog, DialogTrigger, DialogContent } from '@cyberskill/design';
```

## Entry points

| Import | Contents | Extra peer |
|---|---|---|
| `@cyberskill/design` | Components | `react@19`, `@phosphor-icons/react` |
| `@cyberskill/design/styles.css` | Tokens + base + component CSS | – |
| `@cyberskill/design/tokens.css` | CSS variables only | – |
| `@cyberskill/design/tailwind.css` | Tailwind v4 theme | `tailwindcss@4` |
| `@cyberskill/design/tokens` | Typed token object | – |
| `@cyberskill/design/charts` | Chart presets | `recharts@3` |
| `@cyberskill/design/table` | Data table | `@tanstack/react-table@9`, `@tanstack/react-virtual@3` |
| `@cyberskill/design/forms` | React Hook Form helpers | `react-hook-form@7` |
| `@cyberskill/design/date` | Calendar, date, range and time pickers | `react-day-picker@10`, `date-fns@4` |
| `@cyberskill/design/utils` | Pure helpers (`cx`, `formatFileSize`, chart colors), safe in Server Components | – |

Dark mode: `data-theme="dark"` (or `system`) on `<html>` or any element.

## For AI coding tools

This package ships its own AI guide in `ai/`: `INDEX.md` (setup, rules, every component with its import), one short file per component with exact types, `tokens.md`, a Claude Code skill and a Cursor rule. Install them into your project:

```bash
npx cyberskill-design ai-setup            # .claude/skills, .cursor/rules, AGENTS.md section
npx cyberskill-design ai-setup --dry-run  # preview
```

## License

`UNLICENSED`. Use is limited to the CyberSkill products listed in the consumer grant at [github.com/cyberskill-official/design](https://github.com/cyberskill-official/design/blob/main/docs/consumer-grant.md).
