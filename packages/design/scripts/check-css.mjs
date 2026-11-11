// Guards component CSS: colors only through tokens, no !important, no tiny text.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'css');
const files = ['base.css', ...readdirSync(join(dir, 'components')).map(f => join('components', f))];
const problems = [];
for (const f of files) {
  readFileSync(join(dir, f), 'utf8').split('\n').forEach((line, i) => {
    const at = `${f}:${i + 1}`;
    const code = line.replace(/\/\*.*?\*\//g, '');
    if (/#[0-9a-fA-F]{3,8}\b/.test(code)) problems.push(`${at} hard-coded color; use a token (var(--…))`);
    if (/\b(rgb|hsl|oklch)a?\(/.test(code) && !/color-mix|var\(--shadow/.test(code) && !/rgb\(\s*0 0 0|rgb\(\s*5 10 20/.test(code)) problems.push(`${at} raw color function; use a token`);
    if (/!important/.test(code)) problems.push(`${at} !important; layers already let apps override`);
    const fs = code.match(/font-size:\s*(\d+(?:\.\d+)?)px/);
    if (fs && +fs[1] < 11) problems.push(`${at} font-size ${fs[1]}px is below the 11px minimum`);
  });
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`✓ ${files.length} stylesheets use tokens only`);
