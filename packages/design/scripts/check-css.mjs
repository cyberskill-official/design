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
  if (f !== 'motion.css') checkMotion(f, text); // motion.css defines the recipes and the reduced-motion overrides
}

// Motion goes through the --motion-* recipes, which motion.css redefines for reduced motion; raw times and curves skip that.
// Values are read from the whole file (a declaration may wrap), and reported at the line where it starts.
function checkMotion(f, text) {
  const lineOf = i => text.slice(0, i).split('\n').length;
  const RAW = [
    [/var\(--(duration|ease|spring)-[\w-]*\)/, m => `uses ${m} directly; use a --motion-* recipe, which pairs a time with a curve and handles reduced motion`],
    [/(?<![\w.-])(?=\d*\.?\d*[1-9])\d*\.?\d+m?s(?![\w-])/, m => `has a raw time (${m}); use a --motion-* recipe`], // 0s / 0ms are fine
    [/(cubic-bezier|linear)\(/, m => `has a raw curve ${m}…); use a --motion-* recipe`],
    [/(?<![\w-])(ease|ease-in|ease-out|ease-in-out|linear)(?![\w-])/, m => `has a raw curve (${m}); use a --motion-* recipe`],
  ];
  const rawIssue = value => { for (const [re, say] of RAW) { const m = value.match(re); if (m) return say(m[0]); } return null; };
  const MOVES = /^(transform|translate|scale|rotate|(min-|max-)?(width|height)|top|right|bottom|left|inset(-[a-z-]+)?|margin(-[a-z-]+)?|padding(-[a-z-]+)?)$/;
  for (const m of text.matchAll(/(?<![\w-])(transition(?:-[a-z]+)*)\s*:\s*([^;{}]*)/g)) {
    const [, prop, value] = m;
    const at = `${f}:${lineOf(m.index)}`;
    const items = value.trim().split(',').map(s => s.trim());
    if (items.some(s => /(?<![\w-])all(?![\w-])/.test(s))) problems.push(`${at} ${prop}: all; list each property with its recipe (transition: opacity var(--motion-fade), transform var(--motion-pop-in))`);
    // One exception: a gesture may scale a duration token by a runtime value, so a hard flick closes a drawer faster.
    if (prop === 'transition-duration' && /^calc\(\s*var\(--(?!duration-|ease-|spring-|motion-)[\w-]+(\s*,[^()]*)?\)\s*\*\s*var\(--duration-[\w-]+\)\s*\)$/.test(value.trim())) continue;
    const raw = rawIssue(value);
    if (raw) { problems.push(`${at} ${prop} ${raw}`); continue; }
    const other = value.replace(/var\(--motion-[\w-]+\)/g, '').split(/[\s,]+/).find(t => t && !/^[a-z][a-z-]*$/.test(t) && !/^0+(\.0+)?(m?s)?$/.test(t));
    if (other) problems.push(`${at} ${prop} has '${other}', which is not a recipe; use var(--motion-…), property names, none or 0s`);
    for (const item of items) {
      const [name] = item.split(/\s+/);
      const slow = item.match(/var\(--motion-(state|fade)\)/);
      if (slow && MOVES.test(name)) problems.push(`${at} ${name} animates with var(--motion-${slow[1]}), a color and opacity recipe that keeps running under reduced motion; use the recipe for that movement (var(--motion-move), var(--motion-pop-in), var(--motion-sheet-in)…)`);
    }
  }
  for (const m of text.matchAll(/(?<![\w-])(animation(?:-[a-z]+)*)\s*:\s*([^;{}]*)/g)) {
    const [, prop, value] = m;
    const block = text.slice(text.lastIndexOf('{', m.index), text.indexOf('}', m.index));
    if (/(?<![\w-])infinite(?![\w-])/.test(block)) continue; // loading loops (spinner, skeleton) keep their own timing
    const at = `${f}:${lineOf(m.index)}`;
    const raw = rawIssue(value);
    if (raw) problems.push(`${at} ${prop} ${raw}; only an infinite loading loop may use raw timing`);
    else if (prop === 'animation' && value.trim() !== 'none' && !/var\(--motion-/.test(value)) problems.push(`${at} animation has no --motion-* recipe; give it one (animation: cs-name var(--motion-reveal)), or make it an infinite loading loop`);
  }
}

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`✓ ${files.length} stylesheets use defined tokens only, animate through --motion-* recipes and keep text at 12px (11px mono) or larger`);
