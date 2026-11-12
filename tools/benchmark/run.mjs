#!/usr/bin/env node
// CyberSkill Design System quality benchmark: 23 dimensions (docs/benchmark.md), measured in real Chromium on every
// Storybook story in light and dark, plus the stress-test stories under Benchmark/ and three checks on the built files.
// Exits 1 when a required dimension has any failure or an advisory one fails somewhere not in baseline.json.
//
//   npm run build && npm run build-storybook -w @cyberskill/design && npm run benchmark
//   npm run benchmark -- --stories actions-button,forms-select     # only stories whose id starts with these
//   npm run benchmark -- --update-baseline                          # accept today's advisory gaps
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, appendFileSync } from 'node:fs';
import { join, extname, dirname, relative, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { cpus } from 'node:os';
import { chromium } from 'playwright';
import { colorChecks, layoutChecks } from '../audit/page-checks.js';
import * as P from './page.js';
import { newResults, record, score, scorecard, baselineOf } from './score.mjs';
import { serverComponents, docsParity, tokenDiscipline } from './static.mjs';
import { deltaE } from '../../packages/design/scripts/color-math.mjs';

const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..', '..'), pkg = join(root, 'packages', 'design');
const sb = join(pkg, 'storybook-static'), outDir = join(here, 'out'), baselineFile = join(here, 'baseline.json');
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const flag = n => process.argv.includes(n);
if (!existsSync(join(sb, 'index.json'))) { console.error('No Storybook build. Run `npm run build && npm run build-storybook -w @cyberskill/design` first.'); process.exit(2); }
mkdirSync(outDir, { recursive: true });
const started = Date.now();

/* ---------- static server for the Storybook build ---------- */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const inside = f => { const rel = relative(sb, f); return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel)); };
const server = createServer((req, res) => {
  let f; try { f = resolve(sb, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname)); } catch { res.writeHead(400); res.end(); return; }
  if (inside(f) && existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!inside(f) || !existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const only = arg('--stories')?.split(',');
const stories = Object.values(JSON.parse(readFileSync(join(sb, 'index.json'), 'utf8')).entries)
  .filter(e => e.type === 'story' && (!only || only.some(p => e.id.startsWith(p))));
if (!stories.length) { console.error('No stories matched.'); server.close(); process.exit(2); }

const results = newResults();
if (!only) { serverComponents(results, pkg); docsParity(results, { root, pkg, stories }); tokenDiscipline(results, pkg); }

/* ---------- browser measurements ---------- */
const axePath = createRequire(join(pkg, 'package.json')).resolve('axe-core/axe.min.js');
const SPACING = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
// Font CDN hiccups, and play-function assertions (the Vitest stories project runs and reports those), are not render errors.
const NOISE = /fonts\.(googleapis|gstatic)\.com|favicon|Download the React DevTools|TestingLibraryElementError|AssertionError|expect\(/;
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const DPR = 2;
const textKey = x => `"${x.text}" ${x.path}`;
const lost = L => new Set([...L.clipped.filter(x => x.why !== 'truncated with ellipsis'), ...L.spill].map(x => `"${x.text}"`));
const newly = (after, before) => [...lost(after)].filter(k => !lost(before).has(k));

async function ready(page, story, theme, viewport = { width: 1280, height: 800 }) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'reduce' });
  await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`, { waitUntil: 'load' });
  const phase = await page.waitForFunction(() => { const p = window.__STORYBOOK_PREVIEW__?.currentRender?.phase; return ['finished', 'completed', 'errored', 'aborted'].includes(p) && p; }, null, { timeout: 20000 }).then(h => h.jsonValue()).catch(() => 'timeout');
  // Google Fonts loads the Vietnamese subset only when a glyph needs it; load it now, so text is measured in the real font
  await page.evaluate(() => Promise.all(['400 16px "Be Vietnam Pro"', '500 16px "Be Vietnam Pro"', '600 16px "Be Vietnam Pro"', '700 16px "Be Vietnam Pro"', '800 16px Manrope', '700 16px Manrope'].map(f => document.fonts.load(f, 'ẪỖỮẴặọỵ').catch(() => {}))).then(() => document.fonts.ready));
  await page.addStyleTag({ content: '*, *::before, *::after { caret-color: transparent !important; }' });
  await page.mouse.move(1, 1);
  return phase;
}

/** Tab through the page: the stops in order, and whether Tab got stuck outside a modal. */
async function tabWalk(page, max = 60) {
  // the control that already has focus (a play function typed into it) is the walk's first stop
  const first = await page.evaluate(() => {
    document.querySelectorAll('[data-bench-tab]').forEach(e => e.removeAttribute('data-bench-tab'));
    const a = document.activeElement; if (!a || a === document.body || !window.__bench.inStory(a)) return null;
    a.setAttribute('data-bench-tab', 's'); return { i: 's', label: window.__bench.label(a), story: true };
  });
  const stops = first ? [first] : []; let passedBody = false, trap = false;
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    await page.evaluate(P.settle); // focus traps move focus on the next frame; a person never Tabs faster than that
    const info = await page.evaluate(i => {
      const a = document.activeElement, modal = !!document.querySelector('[aria-modal="true"], [role="alertdialog"]') || (!!document.querySelector('[role="dialog"]') && !!document.querySelector('#storybook-root')?.closest('[aria-hidden="true"], [inert]')); // Base UI hides the page instead of setting aria-modal
      if (!a || a === document.body || a === document.documentElement) return { body: true };
      if (a.matches('[data-base-ui-focus-guard], [data-floating-ui-focus-guard], span[aria-hidden="true"][tabindex]')) return { guard: true }; // focus-trap sentinels, not stops
      if (a.hasAttribute('data-bench-tab')) return { revisit: true, modal };
      a.setAttribute('data-bench-tab', String(i));
      return { i, label: window.__bench.label(a), story: window.__bench.inStory(a) };
    }, i);
    if (info.guard) continue;
    if (info.body) { if (passedBody && stops.length) break; passedBody = true; continue; }
    if (info.revisit) { trap = !passedBody && !info.modal; break; }
    if (info.story) stops.push(info);
  }
  return { stops, trap };
}

/** Pixels changed by focus around a stop, the control's own box, and whether it is visible. */
async function focusChange(page, i) {
  const focus = async () => { const ok = await page.evaluate(i => { const el = document.querySelector(`[data-bench-tab="${i}"]`); el?.scrollIntoView({ block: 'center', inline: 'center' }); el?.focus({ preventScroll: true }); return !!el && document.activeElement === el; }, i); await page.evaluate(P.settle); return ok; };
  const blur = async () => { await page.evaluate(i => document.querySelector(`[data-bench-tab="${i}"]`)?.blur(), i); await page.evaluate(P.settle); };
  if (!(await focus())) return null;
  const a = await page.evaluate(P.focusSnapshot, i); await blur(); const b = await page.evaluate(P.focusSnapshot, i);
  if (!a || !b) return null;
  // the control is the largest element whose style changed with focus (a wrapper drawing the ring), within reason
  const cap = 4 * Math.max(a[0].rect.w * a[0].rect.h, 1600);
  const depth = a.reduce((best, x, k) => (x.sig !== b[k]?.sig && x.rect.w * x.rect.h <= cap && x.rect.w * x.rect.h > a[best].rect.w * a[best].rect.h ? k : best), 0);
  const control = a[depth].rect, rs = [a[0].rect, ...a.filter((x, k) => x.sig !== b[k]?.sig && x.rect.w * x.rect.h <= cap).map(x => x.rect)], vw = 1280, vh = 800;
  const x0 = Math.max(0, Math.floor(Math.min(...rs.map(r => r.x)) - 12)), y0 = Math.max(0, Math.floor(Math.min(...rs.map(r => r.y)) - 12));
  const x1 = Math.min(vw, Math.ceil(Math.max(...rs.map(r => r.x + r.w)) + 12)), y1 = Math.min(vh, Math.ceil(Math.max(...rs.map(r => r.y + r.h)) + 12));
  if (x1 - x0 < 2 || y1 - y0 < 2) return null;
  const clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  await focus(); const visible = await page.evaluate(P.notObscured, depth);
  const on = (await page.screenshot({ clip })).toString('base64'); await blur();
  const off = (await page.screenshot({ clip })).toString('base64');
  const px = await page.evaluate(P.pixelDiff, [`data:image/png;base64,${on}`, `data:image/png;base64,${off}`]);
  return { n3: Math.round(px.n3 / DPR ** 2), aa: Math.round(px.aa / DPR ** 2), control, visible }; // in CSS pixels
}

async function focusDims(page, story, theme, stops, limit, dims) {
  const seen = new Map();
  for (const s of stops.slice(0, limit)) {
    const f = await focusChange(page, s.i); if (!f) continue;
    const n = (seen.get(s.label) ?? 0) + 1; seen.set(s.label, n);
    const name = n > 1 ? `${s.label} #${n}` : s.label; // two controls with one name (a valid and an invalid field) stay apart
    // AA: a changed area the size of a 1px outline (rounded corners allowed for) standing 3:1 on the background.
    // AAA 2.4.13: a 2px outline's area changed by 3:1 between focused and not.
    const { w, h } = f.control, one = 0.8 * 2 * (w + h), two = 0.9 * (4 * w + 4 * h + 16), size = `${Math.round(w)}x${Math.round(h)}`;
    const key = `${story.id}|${theme}|focus "${name}"`;
    if (dims.includes('D3')) record(results, 'D3', { pass: f.aa >= one && f.visible, key, detail: f.visible ? `${f.aa}px of focus indicator at 3:1 on the background around a ${size} control, needs ${Math.round(one)}` : 'covered by other content' });
    if (dims.includes('D9')) record(results, 'D9', { pass: f.n3 >= two, key, detail: `${f.n3}px changed by 3:1 around a ${size} control, needs ${Math.round(two)}` });
    if (dims.includes('D11')) record(results, 'D11', { pass: f.aa >= one, key: `${key} in forced colors`, detail: `${f.aa}px of focus indicator around a ${size} control, needs ${Math.round(one)}` });
  }
}

const tones = [];
async function measure(page, cdp, story, theme) {
  const errors = [];
  const onErr = e => errors.push(String(e.message ?? e).split('\n')[0].slice(0, 160));
  const onCon = m => { if (m.type() === 'error' && !NOISE.test(m.text() + (m.location()?.url ?? ''))) errors.push(m.text().split('\n')[0].slice(0, 160)); };
  page.on('pageerror', onErr); page.on('console', onCon);
  try {
    let phase = await ready(page, story, theme);
    if (!['finished', 'completed'].includes(phase)) { errors.length = 0; phase = await ready(page, story, theme); } // a play function that lost a race under load gets one more try
    const id = story.id, k = s => `${id}|${theme}|${s}`;
    const c = await page.evaluate(colorChecks);
    for (const g of c.text) if (!g.exempt && !g.image) record(results, 'D1', { pass: g.ratio >= g.need, key: k(`"${g.sample}" ${g.fg} on ${g.bg}`), detail: `${g.ratio}:1, needs ${g.need} (${g.path})` });
    for (const x of await page.evaluate(P.controlBoundaries)) record(results, 'D2', { pass: x.ratio >= 3, key: k(`${x.kind} boundary ${x.path}`), detail: `${x.ratio}:1 against its surroundings ("${x.label}")` });
    for (const x of await page.evaluate(P.stateIndicators)) record(results, 'D2', { pass: x.ratio >= 3, key: k(`${x.kind} "${x.label}" indicator`), detail: `${x.ratio}:1 (${x.path})` });
    if (theme === 'dark') {
      const patches = await page.evaluate(P.lightPatches);
      record(results, 'D14', { pass: patches.length === 0, key: k('no light patches'), detail: patches.slice(0, 3).map(p => `${p.color} ${p.size} ${p.path}`).join('; ') });
    }
    for (const x of await page.evaluate(P.scopeChecks)) record(results, 'D18', { pass: x.pass, key: k(x.what), detail: x.detail });
    tones.push(...(await page.evaluate(P.toneColors)).map(t => ({ ...t, group: `${theme} ${t.group}` })));

    if (theme === 'light') {
      await page.addScriptTag({ path: axePath });
      const axe = await page.evaluate(tags => window.axe.run({ exclude: [['#storybook-docs']] }, { runOnly: { type: 'tag', values: tags }, rules: { 'color-contrast': { enabled: false } }, resultTypes: ['violations'] }), AXE_TAGS);
      for (const p of axe.passes) record(results, 'D8', { pass: true, key: `${id}|${p.id}` });
      for (const v of axe.violations) record(results, 'D8', { pass: false, key: `${id}|${v.id}`, detail: `${v.help}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')}` });
      for (const x of await page.evaluate(P.inkChecks)) record(results, x.input ? 'D23' : 'D15', { pass: x.pass, key: `${id}|${textKey(x)}`, detail: x.input ? `ink ${x.px}px above the font's ascent, which the input clips` : `ink ${x.px}px outside its box` });
      for (const x of await page.evaluate(P.containerChecks)) record(results, 'D16', { pass: x.pass, key: `${id}|${x.label}`, detail: `${x.px}px past its container` });
      for (const x of await page.evaluate(P.invalidChecks)) {
        record(results, 'D17', { pass: x.announced, key: `${x.name} is announced invalid`, detail: 'no aria-invalid="true" on the control' });
        record(results, 'D17', { pass: x.linked, key: `${x.name} error text is linked`, detail: 'error text not referenced by aria-describedby or aria-errormessage, or not visible' });
        record(results, 'D17', { pass: x.dE >= 15 && x.ratio >= 3, key: `${x.name} boundary changes`, detail: `ΔE ${x.dE} (needs 15), ${x.ratio}:1 on the page (needs 3) at ${x.box}` });
      }
      const motion = await page.evaluate(P.runningMotion);
      record(results, 'D12', { pass: motion.length === 0, key: `${id}|motion`, detail: motion.slice(0, 3).map(m => `${m.name} ${m.duration}ms ×${m.iterations} (${m.path})`).join('; ') });

      const L0 = await page.evaluate(layoutChecks, { w: 1280, h: 800, fold: [] });
      await page.setViewportSize({ width: 360, height: 780 });
      const L360 = await page.evaluate(layoutChecks, { w: 360, h: 780, fold: [] });
      const fails = L360.targets.filter(t => t.level === 'fail'), small = L360.targets;
      for (let n = 0; n < L360.targetCount - fails.length; n++) record(results, 'D5', { pass: true, key: `${id}|ok${n}` });
      for (const t of fails) record(results, 'D5', { pass: false, key: `${id}|target "${t.label}" ${t.path}`, detail: `${t.w}x${t.h}` });
      for (let n = 0; n < L360.targetCount - small.length; n++) record(results, 'D10', { pass: true, key: `${id}|ok${n}` });
      for (const t of small) record(results, 'D10', { pass: false, key: `${id}|target "${t.label}" ${t.path}`, detail: `${t.w}x${t.h}` });
      // reloaded at 320px, so play functions open their popups at that width (a resize leaves them where they were)
      await ready(page, story, theme, { width: 320, height: 640 });
      const L320 = await page.evaluate(layoutChecks, { w: 320, h: 640, fold: [] });
      await ready(page, story, theme);
      const spilled = newly(L320, L0);
      record(results, 'D6', { pass: L320.pageOverflowX <= 0 && spilled.length === 0, key: `${id}|reflow`, detail: [L320.pageOverflowX > 0 ? `page scrolls sideways by ${L320.pageOverflowX}px` : '', ...spilled.slice(0, 3)].filter(Boolean).join('; ') });

      await page.addStyleTag({ content: SPACING }).then(h => h.evaluate(e => e.setAttribute('id', 'bench-spacing')));
      const Lsp = await page.evaluate(layoutChecks, { w: 1280, h: 800, fold: [] });
      await page.evaluate(() => document.getElementById('bench-spacing')?.remove());
      const sp = newly(Lsp, L0);
      record(results, 'D7', { pass: sp.length === 0, key: `${id}|text spacing`, detail: sp.slice(0, 4).join('; ') });

      const s0 = await page.evaluate(P.textSizes);
      await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const s1 = await page.evaluate(P.textSizes), Lfs = await page.evaluate(layoutChecks, { w: 1280, h: 800, fold: [] });
      await cdp.send('Page.setFontSizes', { fontSizes: { standard: 16, fixed: 13 } });
      const fixed = s0.filter((x, n) => s1[n] && s1[n].text === x.text && s1[n].size < x.size * 1.8).map(x => `${x.size}px "${x.text}"`);
      const fsLost = newly(Lfs, L0);
      record(results, 'D13', { pass: fixed.length === 0 && fsLost.length === 0, key: `${id}|font size`, detail: [...fixed.slice(0, 3).map(f => `stays ${f}`), ...fsLost.slice(0, 2).map(f => `clipped ${f}`)].join('; ') });

      await page.emulateMedia({ forcedColors: 'active' });
      const fc = await page.evaluate(P.forcedColorChecks);
      for (const x of fc.boundaries) record(results, 'D11', { pass: x.pass, key: `${id}|boundary "${x.label}" ${x.path}`, detail: 'no visible border or outline in forced colors' });
      for (const x of fc.states) record(results, 'D11', { pass: x.pass, key: `${id}|state "${x.label}" ${x.path}`, detail: 'looks the same as its unselected sibling in forced colors' });
      const fw = await tabWalk(page, 8);
      await focusDims(page, story, theme, fw.stops, 3, ['D11']);
      await page.emulateMedia({ forcedColors: 'none' });
    }

    const walk = await tabWalk(page);
    if (theme === 'light') {
      record(results, 'D4', { pass: !walk.trap, key: `${id}|no keyboard trap`, detail: 'Tab cycles inside a part of the page that is not a modal dialog' });
      for (const x of await page.evaluate(P.reach)) record(results, 'D4', { pass: x.reached, key: `${id}|"${x.label}" ${x.path}`, detail: 'not reachable with Tab or arrow keys' });
    }
    await focusDims(page, story, theme, walk.stops, 10, ['D3', 'D9']);
    record(results, 'D14', { pass: ['finished', 'completed'].includes(phase) && errors.length === 0, key: k('renders cleanly'), detail: phase !== 'finished' && phase !== 'completed' ? `story ${phase}` : errors.slice(0, 2).join('; ') });
  } finally {
    page.off('pageerror', onErr); page.off('console', onCon);
  }
}

const browser = await chromium.launch();
const workers = Math.max(1, Math.min(+(arg('--workers') ?? Math.min(6, Math.max(2, cpus().length - 2))), stories.length * 2));
const queue = stories.flatMap(s => [[s, 'light'], [s, 'dark']]);
let done = 0;
await Promise.all(Array.from({ length: workers }, async () => {
  // 2x pixels: a 1px focus ring at a fractional position stays crisp instead of smearing across two pale pixel rows
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.addInitScript(P.benchHelpers);
  const cdp = await ctx.newCDPSession(page);
  for (let job; (job = queue.shift());) {
    const [story, theme] = job;
    try { await measure(page, cdp, story, theme); }
    catch (e) {
      try { await measure(page, cdp, story, theme); } // one retry: a timing hiccup is not a finding
      catch (e2) { record(results, 'D14', { pass: false, key: `${story.id}|${theme}|benchmark could measure it`, detail: String(e2.message).split('\n')[0].slice(0, 160) }); }
    }
    if (++done % 50 === 0) console.log(`  ${done}/${stories.length * 2} story renders measured`);
  }
  await ctx.close();
}));
await browser.close(); server.close();

/* ---------- D19: rendered status tones, pairwise ---------- */
for (const t of tones) record(results, 'D19', { pass: t.icon && t.text, key: `${t.group} ${t.tone} has an icon and text`, detail: 'color would be the only signal' });
const groups = Map.groupBy(tones, t => t.group);
for (const [g, list] of groups) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
  const a = list[i], b = list[j], n = deltaE(a.signal, b.signal), v = Math.min(deltaE(a.signal, b.signal, 'protan'), deltaE(a.signal, b.signal, 'deutan'));
  record(results, 'D19', { pass: n >= 15 && v >= 8, key: `${g} ${a.tone} vs ${b.tone}`, detail: `${a.signal} vs ${b.signal}: ΔE ${n.toFixed(1)} (needs 15), color-blind ΔE ${v.toFixed(1)} (needs 8)` });
}

/* ---------- report ---------- */
const baseline = existsSync(baselineFile) ? JSON.parse(readFileSync(baselineFile, 'utf8')) : { advisory: {} };
const s = score(results, baseline, { partial: !!only });
const minutes = ((Date.now() - started) / 60000).toFixed(1);
const summary = `${stories.length} stories × light and dark in Chromium, ${minutes} min.${only ? ' Partial run (--stories): package checks skipped.' : ''}`;
const md = scorecard(s, { summary });
writeFileSync(join(outDir, 'scorecard.md'), md);
writeFileSync(join(outDir, 'report.json'), JSON.stringify({ overall: s.overall, blocking: s.blocking, dimensions: s.rows }, null, 1));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
if (flag('--update-baseline') && !only) { writeFileSync(baselineFile, JSON.stringify(baselineOf(s), null, 1) + '\n'); console.log(`Baseline written: ${relative(root, baselineFile)}`); }
console.log(md);
process.exit(s.blocking && !flag('--update-baseline') ? 1 : 0);
