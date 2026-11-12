// Guards component CSS: colors only through tokens, every var(--x) defined, no !important, no tiny text.
// Minimum size: 12px for text, 11px when the rule uses the mono font (codes, labels). Sizes are written in rem, never px.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const dir = process.env.CSS_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'css'); // CSS_DIR: gate tests
const files = ['base.css', 'motion.css', ...readdirSync(join(dir, 'components')).map(f => join('components', f))];
const NAMED = /(?<![\w-])(red|blue|green|black|white|gray|grey|orange|yellow|purple|pink|brown|navy|teal|gold|silver|maroon|olive|lime|aqua|fuchsia|cyan|magenta)(?![\w-])/;
const COLOR_PROPS = /(^|[\s;{])(color|background(-color)?|border(-[a-z]+)*-color|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?|outline(-color)?|fill|stroke|box-shadow|text-decoration-color|caret-color|accent-color)\s*:/;
const problems = [];
const strip = t => t.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
const texts = Object.fromEntries(files.map(f => [f, strip(readFileSync(join(dir, f), 'utf8'))]));
// Defined custom properties: the generated tokens, any stylesheet's own (--_c…), and ones components set inline ('--_color').
const tokensCss = process.env.TOKENS_CSS ?? join(dir, '..', '..', 'dist', 'tokens.css'); // TOKENS_CSS: gate tests
if (!existsSync(tokensCss)) { console.error(`✗ ${tokensCss} not found; run scripts/build-tokens.mjs first`); process.exit(1); }
const defined = new Set([readFileSync(tokensCss, 'utf8'), ...Object.values(texts)].flatMap(t => [...t.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1])));
const srcDir = process.env.CSS_DIR ? dir : join(dir, '..'); // components' .tsx live next to src/css
const baseUi = dirname(createRequire(import.meta.url).resolve('@base-ui/react/package.json')); // sets --anchor-width, --toast-index… at runtime
for (const [root, ext] of [[srcDir, /\.tsx?$/], [baseUi, /\.js$/]])
  for (const f of readdirSync(root, { recursive: true }).map(String).filter(f => ext.test(f)))
    for (const m of readFileSync(join(root, f), 'utf8').matchAll(/['"`](--[\w-]+)['"`]/g)) defined.add(m[1]);
for (const f of files) {
  const text = texts[f];
  text.split('\n').forEach((code, i) => {
    const at = `${f}:${i + 1}`;
    if (/#[0-9a-fA-F]{3,8}\b/.test(code)) problems.push(`${at} hard-coded color; use a token (var(--…))`);
    if (/\b(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|hwb)\(/.test(code)) problems.push(`${at} raw color function; use a token or var(--shadow-*)`);
    if (COLOR_PROPS.test(code) && NAMED.test(code.split(':').slice(1).join(':'))) problems.push(`${at} named color; use a token`);
    if (/!important/.test(code)) problems.push(`${at} !important; layers already let apps override`);
    for (const m of code.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)) if (m[2] === ')' && !defined.has(m[1])) problems.push(`${at} var(${m[1]}) is not defined by tokens.css or any stylesheet (renamed token?)`);
    const mono = /var\(--font-mono\)/.test(code);
    const min = mono ? 11 : 12;
    // font-size: 10px | 0.6rem | font: 500 10px/1 …
    // font-size, the font shorthand, and custom properties that hold one (--_font: 600 14px/1 …)
    for (const m of code.matchAll(/(?:font(?:-size)?|--[\w-]+)\s*:\s*((?:\d{3} )?\d[^;]*)/g)) {
      if (m[0].startsWith('--') && !/^\d{3} /.test(m[1])) continue;
      const value = m[1];
      const px = value.match(/(?:^|\s)(\d+(?:\.\d+)?)px(?=\s*(?:\/|;|$|\s))/);
      const rem = value.match(/(?:^|\s)(\d*\.?\d+)r?em(?=\s*(?:\/|;|$|\s))/);
      const size = px ? +px[1] : rem ? +rem[1] * 16 : null;
      if (size !== null && size < min) problems.push(`${at} text size ${size}px is below the ${min}px minimum${mono ? ' for mono' : ''}`);
      if (px) problems.push(`${at} text size in px; use rem (${+(px[1] / 16).toFixed(4)}rem) so it follows the reader's browser font size`);
    }
  });
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`✓ ${files.length} stylesheets use defined tokens only and keep text at 12px (11px mono) or larger`);
