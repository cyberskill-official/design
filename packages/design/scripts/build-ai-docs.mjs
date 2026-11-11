// Generates packages/design/ai/: compact, exact docs for AI coding tools in apps that use this package.
// Sources: the site's component pages (usage, examples, props, accessibility), the built .d.ts files (exact types)
// and tokens/*.json. Run after tsdown. `--check` fails if the committed ai/ folder is stale (used in CI).
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = join(pkg, '..', '..', 'apps', 'site', 'content', 'docs', 'components');
const out = join(pkg, 'ai');
const check = process.argv.includes('--check');

/* ---------- exports and exact types from the built declarations ---------- */
// utils first, so helpers.md shows a pure helper's server-safe import.
const ENTRIES = { '@cyberskill/design/utils': 'utils', '@cyberskill/design': 'index', '@cyberskill/design/charts': 'charts', '@cyberskill/design/table': 'table', '@cyberskill/design/forms': 'forms', '@cyberskill/design/date': 'date' };
const dist = join(pkg, 'dist');
const dts = {}, exportsOf = {}, localName = {};
for (const [spec, file] of Object.entries(ENTRIES)) {
  const f = join(dist, `${file}.d.ts`);
  if (!existsSync(f)) { console.error(`Missing dist/${file}.d.ts; run tsdown first.`); process.exit(1); }
  const src = readFileSync(f, 'utf8'); dts[spec] = src;
  const names = new Set(), local = (localName[spec] = new Map());
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) for (const part of m[1].split(',')) {
    const [from, as = from] = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/);
    if (as) { names.add(as); local.set(as, from); }
  }
  for (const m of src.matchAll(/export\s+(?:declare\s+)?(?:function|const|type|interface|class)\s+(\w+)/g)) names.add(m[1]);
  exportsOf[spec] = names;
}
// Declarations shared between entries live in chunk files (`dist/*-<hash>.d.ts`); search those too.
const chunks = readdirSync(dist, { recursive: true }).map(String).filter(f => f.endsWith('.d.ts')).map(file => ({ file, src: readFileSync(join(dist, file), 'utf8') }));
const entryFile = Object.fromEntries(Object.entries(ENTRIES).map(([spec, file]) => [spec, `${file}.d.ts`]));

/** One declaration (`type X = …;`, `interface X {…}`, `declare function X(…): …;`, `declare const X: …;`) with its JSDoc, under its exported name. */
function declBlock(spec, name, kinds = 'type|interface', withFile = false) {
  const local = localName[spec].get(name) ?? name;
  const esc = local.replace(/\$/g, '\\$');
  // JSDoc may not contain `*/`, and the name must be followed by its definition, so `ButtonProps$1` or a mention never matches.
  const re = new RegExp(`(/\\*\\*(?:(?!\\*/)[\\s\\S])*\\*/\\s*)?(?:export\\s+)?(?:declare\\s+)?(${kinds})\\s+${esc}(?![\\w$])(?=\\s*(?:=|<|\\{|\\(|:|extends\\b))`);
  for (const { file, src } of [{ file: entryFile[spec], src: dts[spec] }, ...chunks]) {
    const m = re.exec(src); if (!m) continue;
    let i = m.index + m[0].length, depth = 0;
    for (; i < src.length; i++) {
      const ch = src[i];
      if ('{<(['.includes(ch)) depth++;
      else if ('})]'.includes(ch) || (ch === '>' && src[i - 1] !== '=')) { depth--; if (m[2] === 'interface' && depth === 0 && ch === '}') { i++; break; } }
      else if (ch === ';' && depth === 0 && m[2] !== 'interface') { i++; break; }
    }
    const block = src.slice(m.index, i).trim().replace(/^\s*\/\*\*\s*\n\s*\*\s?/, '/** ').replace(/^\s*\/\*\*\s*/, '/** ');
    const named = local === name ? block : block.replace(new RegExp(`(${kinds})\\s+${esc}(?![\\w$])`), `$1 ${name}`);
    return withFile ? { block: named, file } : named;
  }
  return null;
}
const isRuntime = (spec, name) => !!declBlock(spec, name, 'function|const|class');

/* ---------- site page -> compact markdown ---------- */
function parsePage(file) {
  const raw = readFileSync(file, 'utf8');
  const fm = Object.fromEntries([...raw.match(/^---\n([\s\S]*?)\n---/)[1].matchAll(/^(\w+):\s*(.*)$/gm)].map(m => [m[1], m[2].trim()]));
  let body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  const props = [];
  body = body.replace(/<PropsTable\s+rows=\{(\[[\s\S]*?\])\}\s*\/>/g, (_, lit) => {
    const rows = new Function(`return ${lit}`)(); // our own repo content, evaluated at build time
    props.push(['| Prop | Type | Default | Description |', '|---|---|---|---|', ...rows.map(r => `| \`${r[0]}\` | \`${r[1].replace(/\|/g, '\\|')}\` | ${r[2] === '–' ? '–' : `\`${r[2]}\``} | ${r[3]} |`)].join('\n'));
    return '\n@@PROPS@@\n';
  });
  const lines = [], code = [];
  let inFence = false, inJsx = 0;
  for (const line of body.split('\n')) {
    if (/^```/.test(line)) { inFence = !inFence; lines.push(line); continue; }
    if (inFence) { lines.push(line); code.push(line); continue; }
    if (/^import\s/.test(line)) continue;
    if (/^\s*<(Demo|div|figure|Cards|Callout|Tabs)\b/.test(line) && !/\/>\s*$/.test(line)) { inJsx++; continue; }
    if (inJsx) { if (/^\s*<\/(Demo|div|figure|Cards|Callout|Tabs)>/.test(line)) inJsx--; continue; }
    if (/^\s*<[A-Z][\w.]*[\s\S]*\/>\s*$/.test(line)) continue;
    lines.push(line);
  }
  let md = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  props.forEach(p => { md = md.replace('@@PROPS@@', p); });
  // which exports this page documents: JSX tags and hooks used in its code samples
  const used = new Set([...code.join('\n').matchAll(/<([A-Z]\w+)|\b(use[A-Z]\w+)\(/g)].map(m => m[1] || m[2]));
  const imports = Object.entries(exportsOf).map(([spec, names]) => [spec, [...used].filter(n => names.has(n)).sort()]).filter(([, n]) => n.length);
  return { title: fm.title, description: fm.description, md, imports };
}

const slugs = existsSync(pages) ? readdirSync(pages).filter(f => f.endsWith('.mdx') && f !== 'index.mdx').map(f => f.replace(/\.mdx$/, '')).sort() : [];
const files = new Map();
const index = [];
for (const slug of slugs) {
  const p = parsePage(join(pages, `${slug}.mdx`));
  const importLines = p.imports.map(([spec, names]) => `import { ${names.join(', ')} } from '${spec}';`);
  // tsdown renames clashing imports (`Button$1`); show them as the Base UI part they are.
  const types = p.imports.flatMap(([spec, names]) => names.map(n => declBlock(spec, `${n}Props`)).filter(Boolean)).map(t => t.replace(/\b([A-Z]\w*)\$\d+\./g, 'BaseUI.$1.'));
  const baseNote = types.some(t => t.includes('BaseUI.')) ? ['// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).'] : [];
  const doc = [`# ${p.title}`, '', `> ${p.description}`, '', '```tsx', ...importLines, '```', '', p.md,
    ...(types.length ? ['', '## Exact types', '', '```ts', ...baseNote, ...[...new Set(types)], '```'] : []), ''].join('\n');
  files.set(`components/${slug}.md`, doc);
  index.push({ slug, title: p.title, description: p.description, imports: p.imports });
}

/* ---------- tokens ---------- */
const C = JSON.parse(readFileSync(join(pkg, 'tokens', 'color.json'), 'utf8'));
const tokenRows = Object.entries(C.light).filter(([k]) => !k.startsWith('$')).map(([k, v]) => `| \`--${k}\` | \`${k}\` | ${v.$value} / ${C.dark[k].$value} | ${v.$description ?? ''} |`);
const tokensDoc = ['# Tokens (@cyberskill/design)', '', 'Use semantic tokens, never hex values. They switch with `data-theme` (`light` default, `dark`, `system`) on `<html>` or any element.', '',
  '| CSS variable | Tailwind color name | Light / Dark | Use |', '|---|---|---|---|', ...tokenRows,
  '| `--primary-soft` | `primary-soft` | derived | Selected rows, active nav item |', '| `--destructive-foreground` etc. | `destructive-foreground` | derived | Text on a filled status color |',
  '| `--ring` | `ring` | = `--primary` | Focus outline |',
  '| `--card`, `--popover` | `card`, `popover` | = `--panel` | Aliases for shadcn-style code |', '| `--card-foreground`, `--popover-foreground` | same names | = `--foreground` | Aliases |',
  '| `--gold`, `--on-gold` | `gold`, `on-gold` | = `--accent`, `--accent-foreground` | Aliases |', '| `--muted-foreground` | – | = `--muted` | Alias (CSS only) |',
  `| \`--chart-1\`…\`--chart-5\` | \`chart-1\`… | ${C.chart.light.join(', ')} / ${C.chart.dark.join(', ')} | Chart series in fixed order: ${C.chart.names.join(', ')} |`, '',
  '**Type:** classes `cs-display`, `cs-h1`–`cs-h4`, `cs-body-lg`, `cs-body`, `cs-ui`, `cs-caption`, `cs-overline`, `cs-code`. Fonts `--font-display` (Manrope, headings), `--font-sans` (Be Vietnam Pro, body/UI), `--font-mono` (JetBrains Mono, data/code). Tailwind: `font-display`, `font-sans`, `font-mono`.',
  '', '**Space:** `--space-1`…`--space-20` on a 4px scale (`--space-4` = 16px). **Radius:** `--radius-sm|md|lg|xl|full` (controls md, cards lg, dialogs xl). **Shadow:** `--shadow-sm|md|lg|overlay`. **Motion:** `--duration-fast|base|slow`, `--ease-standard|emphasized|exit`. **Layers:** `--z-dropdown|sticky|overlay|modal|toast|tooltip`. **Controls:** `--control-sm|md|lg` (32/40/48px), `--control-touch` (44px).', ''].join('\n');
files.set('tokens.md', tokensDoc);

/* ---------- helpers.md + every runtime export documented somewhere ---------- */
const documented = new Set(index.flatMap(c => c.imports.flatMap(([s, n]) => n.map(x => `${s} ${x}`))));
const helpers = [], undocumented = [];
for (const [spec, names] of Object.entries(exportsOf)) for (const name of [...names].sort()) {
  if (documented.has(`${spec} ${name}`) || !isRuntime(spec, name)) continue;
  if (/^[A-Z][a-z]/.test(name)) { undocumented.push(`${spec} ${name}`); continue; } // a component: belongs in a page's code sample
  if (helpers.some(h => h.name === name)) continue;
  const { block, file } = declBlock(spec, name, 'function|const|class', true);
  // server-safe when the module that defines it is built without 'use client' (see tsdown.config.ts)
  const js = join(dist, file.replace(/\.d\.ts$/, '.js'));
  helpers.push({ spec, name, block, server: existsSync(js) && !/^['"]use client['"]/.test(readFileSync(js, 'utf8')) });
}
if (undocumented.length) { console.error(`✗ components missing from every site page code sample (so AI docs can't cover them):\n  ${undocumented.join('\n  ')}`); process.exit(1); }
const helperNames = helpers.map(h => `\`${h.name}\``);
files.set('helpers.md', ['# Helpers (@cyberskill/design)', '', 'Exports that are not components. Each says whether a Server Component can call it.', '',
  ...helpers.flatMap(h => [`## ${h.name}`, '', h.server ? 'Server Components: yes.' : 'Client components only.', '', '```ts', `import { ${h.name} } from '${h.spec}';`, h.block.replace(/\b([A-Z]\w*)\$\d+\./g, 'BaseUI.$1.'), '```', '']), ''].join('\n'));

/* ---------- INDEX.md: the one file an AI reads first ---------- */
const table = index.map(c => `| ${c.title} | ${c.description} | ${c.imports.map(([s, n]) => `\`${n.join(', ')}\`${s === '@cyberskill/design' ? '' : ` from \`${s}\``}`).join('; ')} | \`components/${c.slug}.md\` |`);
files.set('INDEX.md', ['# @cyberskill/design: AI guide', '',
  'CyberSkill Design System (Ink & Gold). Read this file first, then open only the `components/*.md` files you need. Paths are relative to `node_modules/@cyberskill/design/ai/`.', '',
  '## Setup (once per app)', '', '```css', "/* app/globals.css: Tailwind v4 apps */", "@import 'tailwindcss';", "@import '@cyberskill/design/tailwind.css';", "@import '@cyberskill/design/styles.css';", '/* no Tailwind: only the styles.css line */', '```', '',
  'Fonts: load Manrope, Be Vietnam Pro and JetBrains Mono (with the `vietnamese` subset) and set `--font-display`, `--font-sans`, `--font-mono` on `:root, [data-theme]`. Dark mode: `data-theme="dark"` on `<html>` or any container.', '',
  '## Rules', '',
  '1. **Use a component before writing UI.** Find it in the table below. Only build custom UI when nothing fits, and then style it with tokens.',
  '2. **Never hard-code colors, fonts or sizes.** Use CSS variables (`var(--primary)`) or the Tailwind names (`bg-primary text-primary-foreground border-border text-muted`). No hex, rgb or Tailwind palette colors like `blue-600`.',
  '3. **Flat named imports only**: `DialogContent`, never `Dialog.Content`. They work in React Server Component files.',
  '4. **One primary button per view; at most one gold `accent` element** (key action or AI moment). Product screens keep gold under 3% of the screen.',
  '5. **Status needs icon + text**, never color alone: use `Badge` with a status `tone`, `Alert` or `toast`.',
  '6. **Every input has a visible label** (`TextField label=…`). Icon-only buttons need `label`. User-facing default strings (`closeLabel`, `previousLabel`…) are props: pass Vietnamese strings in Vietnamese UIs.',
  '7. **Charts, tables, forms and dates are separate entry points** with optional peers: `@cyberskill/design/charts` (`recharts`), `/table` (`@tanstack/react-table`, `@tanstack/react-virtual`), `/forms` (`react-hook-form`), `/date` (`react-day-picker`, `date-fns`). Install only what you import. Series colors come from the system in fixed order; do not pass your own colors.',
  '8. **Customize with `className`**, not by overriding internals. The package CSS sits in the `base` and `components` cascade layers, so plain app CSS and Tailwind utilities win without `!important`.',
  '9. **Server Components:** import components from any entry as usual (each component is its own client module, so only what you use ships). Pure helpers run on the server too: `cx`, `formatFileSize`, `chartColor`, `seriesColor` (also in `@cyberskill/design/utils`, which holds no component code) and `formatDate`, `parseDate`, `formatTime`, `parseTime`, `DEFAULT_DATE_FORMAT` from `/date`. All helpers are in `helpers.md`.', '',
  '## Components', '', '| Component | Use it for | Import | Doc |', '|---|---|---|---|', ...table, '',
  '## More', '', '- `tokens.md`: every token with light and dark values and its Tailwind name.', `- \`helpers.md\`: ${helperNames.join(', ')}.`, '- Live examples: https://design.cyberskill.world', ''].join('\n'));

/* ---------- AI tool integrations shipped with the package ---------- */
const skill = ['---', 'name: cyberskill-design', 'description: Use when building or changing UI in a project that depends on @cyberskill/design (CyberSkill Design System, Ink & Gold): choosing components, colors, tokens, typography, icons, charts, tables, forms or dark mode. Read node_modules/@cyberskill/design/ai/INDEX.md first, then only the component docs you need.', '---', '',
  '# CyberSkill Design System', '', '1. Read `node_modules/@cyberskill/design/ai/INDEX.md`: setup, rules and the table of every component with its import.',
  '2. For each component you will use, read `node_modules/@cyberskill/design/ai/components/<name>.md` (exact props and types, examples, accessibility). Do not read the others.',
  '3. For colors, spacing, type or motion, read `node_modules/@cyberskill/design/ai/tokens.md`.',
  '4. Follow the rules in INDEX.md exactly: components before custom UI, tokens only (no hex or Tailwind palette colors), flat imports, labels on every control, status with icon + text.',
  '5. Do not read the package source or `dist/` to learn the API; the ai/ docs are generated from it and are exact.', ''].join('\n');
files.set('SKILL.md', skill);
files.set('cursor-rule.mdc', ['---', 'description: CyberSkill Design System (@cyberskill/design): use its components and tokens for all UI', 'globs: ["**/*.tsx", "**/*.jsx", "**/*.css", "**/*.mdx"]', 'alwaysApply: false', '---', '',
  'This project uses @cyberskill/design. Before writing or changing UI, read `node_modules/@cyberskill/design/ai/INDEX.md`, then only the `ai/components/<name>.md` files you need. Follow its rules: components before custom UI, tokens only (no hex or Tailwind palette colors), flat named imports, visible labels, status with icon + text.', ''].join('\n'));
files.set('AGENTS-snippet.md', ['## UI: CyberSkill Design System', '', 'All UI uses `@cyberskill/design`. Before writing or changing UI, read `node_modules/@cyberskill/design/ai/INDEX.md` and then only the `ai/components/<name>.md` files you need. Rules: use a component before writing custom UI; tokens only (no hex or Tailwind palette colors); flat named imports; every control has a visible label; status shows icon + text.', ''].join('\n'));

/* ---------- write or check ---------- */
const stale = [];
if (check) {
  for (const [rel, content] of files) { const f = join(out, rel); if (!existsSync(f) || readFileSync(f, 'utf8') !== content) stale.push(rel); }
  if (stale.length) { console.error(`ai/ docs are stale: ${stale.join(', ')}. Run: npm run build -w @cyberskill/design`); process.exit(1); }
  console.log(`✓ ai/ docs are current (${files.size} files)`); process.exit(0);
}
rmSync(out, { recursive: true, force: true });
for (const [rel, content] of files) { const f = join(out, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); }
const tokensApprox = Math.round(files.get('INDEX.md').length / 4);
console.log(`✓ ai/ docs: INDEX.md (~${tokensApprox} tokens), tokens.md, ${index.length} component docs, SKILL.md, cursor-rule.mdc, AGENTS-snippet.md`);
