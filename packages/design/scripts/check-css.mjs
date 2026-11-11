// Guards component CSS: colors only through tokens, no !important, no tiny text.
// Minimum size: 12px for text, 11px when the rule uses the mono font (codes, labels).
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = process.env.CSS_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'css'); // CSS_DIR: gate tests
const files = ['base.css', 'motion.css', ...readdirSync(join(dir, 'components')).map(f => join('components', f))];
const NAMED = /(?<![\w-])(red|blue|green|black|white|gray|grey|orange|yellow|purple|pink|brown|navy|teal|gold|silver|maroon|olive|lime|aqua|fuchsia|cyan|magenta)(?![\w-])/;
const COLOR_PROPS = /(^|[\s;{])(color|background(-color)?|border(-[a-z]+)*-color|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?|outline(-color)?|fill|stroke|box-shadow|text-decoration-color|caret-color|accent-color)\s*:/;
const problems = [];
for (const f of files) {
  const text = readFileSync(join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  text.split('\n').forEach((code, i) => {
    const at = `${f}:${i + 1}`;
    if (/#[0-9a-fA-F]{3,8}\b/.test(code)) problems.push(`${at} hard-coded color; use a token (var(--…))`);
    if (/\b(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|hwb)\(/.test(code)) problems.push(`${at} raw color function; use a token or var(--shadow-*)`);
    if (COLOR_PROPS.test(code) && NAMED.test(code.split(':').slice(1).join(':'))) problems.push(`${at} named color; use a token`);
    if (/!important/.test(code)) problems.push(`${at} !important; layers already let apps override`);
    const mono = /var\(--font-mono\)/.test(code);
    const min = mono ? 11 : 12;
    // font-size: 10px | 0.6rem | font: 500 10px/1 …
    for (const m of code.matchAll(/font(?:-size)?\s*:\s*([^;]+)/g)) {
      const value = m[1];
      const px = value.match(/(?:^|\s)(\d+(?:\.\d+)?)px(?=\s*(?:\/|;|$|\s))/);
      const rem = value.match(/(?:^|\s)(\d*\.?\d+)r?em(?=\s*(?:\/|;|$|\s))/);
      const size = px ? +px[1] : rem ? +rem[1] * 16 : null;
      if (size !== null && size < min) problems.push(`${at} text size ${size}px is below the ${min}px minimum${mono ? ' for mono' : ''}`);
    }
  });
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`✓ ${files.length} stylesheets use tokens only and keep text at 12px (11px mono) or larger`);
