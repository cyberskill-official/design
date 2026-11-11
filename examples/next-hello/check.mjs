// Run after `npm run build` in a copy of this app with the packed tarball installed (see .github/workflows/ci.yml).
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const html = readFileSync('out/index.html', 'utf8');
assert.match(html, /class="cs-button"/, 'Button rendered with its class');
assert.match(html, /cs-badge/, 'Badge rendered');
assert.match(html, /1\.5 kB/, 'formatFileSize ran on the server');
const cssDir = 'out/_next/static';
const css = readdirSync(cssDir, { recursive: true }).filter(f => String(f).endsWith('.css')).map(f => readFileSync(join(cssDir, String(f)), 'utf8')).join('\n');
assert.match(css, /--primary:\s*#14243d/i, 'tokens shipped in the CSS');
assert.match(css, /\.cs-button/, 'component CSS shipped');

// Tree-shaking budget: the JS this page loads beyond Next's own 404 page (framework only) is Button + Badge.
// About 6 kB today; one barrel marked 'use client' would ship every component (~140 kB) and fail this.
const scripts = f => new Set([...readFileSync(f, 'utf8').matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map(m => m[1]));
const framework = scripts('out/404.html');
const kb = [...scripts('out/index.html')].filter(s => !framework.has(s)).reduce((t, s) => t + gzipSync(readFileSync('out' + s)).length, 0) / 1024;
assert.ok(kb > 0 && kb < 15, `design-system JS on the page is ${kb.toFixed(1)} kB gzip; budget 15 kB`);

// Plain Node / no-React consumers: tokens, helpers and the CSS files resolve from the tarball.
const { tokens } = await import('@cyberskill/design/tokens');
assert.equal(tokens.color.light.primary, '#14243D');
const { cx, chartColor } = await import('@cyberskill/design/utils');
assert.equal(cx('a', false, 'b'), 'a b');
assert.equal(chartColor(2), 'var(--chart-2)');
for (const f of ['styles.css', 'tokens.css', 'tailwind.css', 'tokens.json']) import.meta.resolve(`@cyberskill/design/${f}`);
console.log(`✓ tarball installs, renders in Next (server + client components), ships ${kb.toFixed(1)} kB of component JS and resolves every export`);
