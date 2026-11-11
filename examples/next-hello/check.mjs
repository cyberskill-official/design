// Run after `npm run build` in a copy of this app with the packed tarball installed (see .github/workflows/ci.yml).
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync('out/index.html', 'utf8');
assert.match(html, /class="cs-button"/, 'Button rendered with its class');
assert.match(html, /cs-badge/, 'Badge rendered');
assert.match(html, /1\.5 kB/, 'formatFileSize ran on the server');
const cssDir = 'out/_next/static';
const css = readdirSync(cssDir, { recursive: true }).filter(f => String(f).endsWith('.css')).map(f => readFileSync(join(cssDir, String(f)), 'utf8')).join('\n');
assert.match(css, /--primary:\s*#14243d/i, 'tokens shipped in the CSS');
assert.match(css, /\.cs-button/, 'component CSS shipped');

// Plain Node / no-React consumers: tokens, helpers and the CSS files resolve from the tarball.
const { tokens } = await import('@cyberskill/design/tokens');
assert.equal(tokens.color.light.primary, '#14243D');
const { cx, chartColor } = await import('@cyberskill/design/utils');
assert.equal(cx('a', false, 'b'), 'a b');
assert.equal(chartColor(2), 'var(--chart-2)');
for (const f of ['styles.css', 'tokens.css', 'tailwind.css', 'tokens.json']) import.meta.resolve(`@cyberskill/design/${f}`);
console.log('✓ tarball installs, renders in Next (server + client components) and resolves every export');
