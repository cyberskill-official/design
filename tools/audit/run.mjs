#!/usr/bin/env node
// Forensic visual audit of the built site (apps/site/out): perceptual color + real layout geometry,
// in light and dark, at phone / tablet / laptop / desktop sizes. Exits 1 on any hard failure.
//
//   npm run site:build && npm run audit:visual            # whole site
//   node tools/audit/run.mjs --pages /,/docs/components/button/   # selected pages
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, dirname, relative, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { colorChecks, layoutChecks, markFindings, colorArea } from './page-checks.js';

const here = dirname(fileURLToPath(import.meta.url));
const site = join(here, '..', '..', 'apps', 'site', 'out');
const outDir = join(here, 'out');
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
if (!existsSync(site)) { console.error('No static site at apps/site/out. Run `npm run site:build` first.'); process.exit(2); }
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [{ w: 375, h: 812, n: 'phone' }, { w: 768, h: 1024, n: 'tablet' }, { w: 1280, h: 800, n: 'laptop' }, { w: 1440, h: 900, n: 'desktop' }];
const FOLD = { '/': ['.home-title', '.home-actions'] };
// Gold budget, % of the screen. Pattern pages are real screens, so over budget fails there; component pages only warn.
const goldBudget = page => (page.startsWith('/docs/patterns/marketing-site') ? 8 : 3);

/* ---------- static server for the export ---------- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.ico': 'image/x-icon' };
const inside = f => { const rel = relative(site, f); return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel)); };
const server = createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); res.end('bad url'); return; }
  let f = resolve(site, '.' + p);
  // checked before touching the disk, so /../ never reads outside the export
  if (!inside(f)) { res.writeHead(404); res.end('not found'); return; }
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f) && existsSync(f + '.html')) f += '.html';
  if (!existsSync(f)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const pages = arg('--pages')?.split(',') ?? (function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) { const f = join(dir, e); if (statSync(f).isDirectory()) { if (!/^_next|llms/.test(e)) walk(f, acc); } else if (e === 'index.html') acc.push('/' + relative(site, dirname(f)).split('\\').join('/')); }
  return acc.map(p => (p === '/' ? '/' : p.replace(/\/?$/, '/')).replace('//', '/'));
})(site);

if (pages.length === 0) { console.error('No pages found to audit in apps/site/out.'); server.close(); process.exit(2); }

// Runtime errors (hydration mismatches, crashes) are hard failures: the page a reader sees is not the one we audited.
const watch = (tab, at) => {
  tab.on('pageerror', e => hard.push(`${at} page error: ${String(e.message).split('\n')[0].slice(0, 160)}`));
  tab.on('console', m => { if (m.type() === 'error') hard.push(`${at} console error: ${m.text().split('\n')[0].slice(0, 160)}`); });
};
const setTheme = (tab, theme) => tab.evaluate(t => { document.documentElement.dataset.theme = t; document.documentElement.classList.toggle('dark', t === 'dark'); }, theme);

const browser = await chromium.launch();
const report = { pages: {} };
const hard = [], soft = [];

for (const page of pages) {
  const r = (report.pages[page] = { color: {}, layout: {}, area: {} });
  const slug = page.replace(/\W+/g, '_') || 'home';
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const tab = await ctx.newPage();
    watch(tab, `${page} [${theme}]`);
    await tab.goto(base + page, { waitUntil: 'networkidle' });
    await setTheme(tab, theme);
    await tab.evaluate(() => document.fonts.ready);
    const c = await tab.evaluate(colorChecks);
    r.color[theme] = c;
    for (const g of c.text) if (g.ratio < g.need && !g.exempt && !g.image) hard.push(`${page} [${theme}] text ${g.ratio}:1 < ${g.need} "${g.sample}" ${g.fg} on ${g.bg} (${g.path})`);
    // over a gradient or image the drawn background can't be computed: still listed, for a check by eye
    for (const g of c.text) if (g.image && !g.exempt) soft.push(`${page} [${theme}] text over an image or gradient "${g.sample}" (${g.path}); check contrast by eye`);
    for (const x of c.nonText) if (x.ratio < 3) hard.push(`${page} [${theme}] ${x.kind} boundary ${x.ratio}:1 < 3 on ${x.bg} (${x.path})`);
    const shot = await tab.screenshot({ fullPage: true });
    r.area[theme] = await tab.evaluate(colorArea, 'data:image/png;base64,' + shot.toString('base64'));
    if (page.startsWith('/docs/') && r.area[theme].gold > goldBudget(page))
      (page.startsWith('/docs/patterns/') ? hard : soft).push(`${page} [${theme}] gold covers ${r.area[theme].gold}% (budget ${goldBudget(page)}%)`);
    if (c.text.some(g => g.ratio < g.need && !g.exempt && !g.image)) { await tab.evaluate(markFindings); await tab.screenshot({ path: join(outDir, `${slug}-${theme}-contrast.png`), fullPage: true }); }
    await ctx.close();
  }
  for (const theme of ['light', 'dark']) for (const v of (page === '/' ? VIEWPORTS : [VIEWPORTS[0], VIEWPORTS[2]])) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, colorScheme: theme, deviceScaleFactor: 1, isMobile: v.w < 768, hasTouch: v.w < 768, reducedMotion: 'reduce' });
    const tab = await ctx.newPage();
    const at = `${page} [${v.n}${theme === 'dark' ? ', dark' : ''}]`;
    watch(tab, at);
    await tab.goto(base + page, { waitUntil: 'networkidle' });
    await setTheme(tab, theme);
    await tab.evaluate(() => document.fonts.ready);
    const L = await tab.evaluate(layoutChecks, { w: v.w, h: v.h, fold: FOLD[page] });
    r.layout[`${v.n}-${theme}`] = L;
    if (L.pageOverflowX > 0) hard.push(`${at} page scrolls sideways by ${L.pageOverflowX}px`);
    L.clipped.forEach(x => hard.push(`${at} clipped ${x.px}px "${x.text}" (${x.why})`));
    L.spill.forEach(x => hard.push(`${at} spills ${x.px}px out of its box "${x.text}" (${x.path})`));
    L.overlap.forEach(x => soft.push(`${at} text boxes overlap "${x.a}" / "${x.b}"; check by eye`));
    L.targets.forEach(t => (t.level === 'fail' ? hard : soft).push(`${at} touch target ${t.w}x${t.h} "${t.label}" (${t.path})`));
    Object.entries(L.smallText).forEach(([k, n]) => soft.push(`${at} ${n} runs of ${k} text`));
    L.orphans.forEach(x => soft.push(`${at} lone item wrapped onto its own line "${x.text}" (${x.path})`));
    L.longLines.forEach(x => soft.push(`${at} long line ${x.cpl} chars "${x.text}"`));
    L.fold.forEach(f => f.visible !== 'fully' && hard.push(`${at} ${f.sel} not fully on the first screen (${f.visible})`));
    if (L.clipped.length || L.spill.length || L.overlap.length || L.targets.some(t => t.level === 'fail') || L.orphans.length) {
      await tab.evaluate(markFindings); await tab.screenshot({ path: join(outDir, `${slug}-${v.n}-${theme}-layout.png`), fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close(); server.close();

const unique = a => [...new Set(a)];
writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 1));
writeFileSync(join(outDir, 'summary.txt'), `HARD FAILURES: ${unique(hard).length}\n${unique(hard).join('\n')}\n\nWARNINGS: ${unique(soft).length}\n${unique(soft).join('\n')}\n`);
console.log(`Audited ${pages.length} pages in light and dark (color and layout), at ${VIEWPORTS.length} sizes for the home page and 2 for the rest.`);
console.log(`HARD FAILURES: ${unique(hard).length}`); unique(hard).slice(0, 60).forEach(x => console.log('  ✗ ' + x));
console.log(`WARNINGS: ${unique(soft).length}`); unique(soft).slice(0, 40).forEach(x => console.log('  ! ' + x));
if (unique(soft).length > 40) console.log(`  … ${unique(soft).length - 40} more in tools/audit/out/summary.txt`);
process.exit(unique(hard).length ? 1 : 0);
