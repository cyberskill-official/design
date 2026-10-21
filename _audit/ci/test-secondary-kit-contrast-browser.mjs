import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const {
    withBrowserFixture
  } = await import(pathToFileURL(join(root, '_audit/ci/lib/browser-fixture.mjs'))),
  {
    apca
  } = await import(pathToFileURL(join(root, 'scripts/lib/oklch.mjs')));
const rows = [];
const hex = a => '#' + a.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const targets = {
  'website/index': [['.band .btn-gold', 60], ['.ft small', 75], ['.ft-links a', 75]],
  'website/work': [['.results .n', 75], ['.case-tags span', 75], ['a.btn-gold', 60], ['.ft small', 75], ['.ft-links a', 75]],
  'website/careers': [['.role a.btn-gold', 60], ['.ft small', 75], ['.ft-links a', 75]],
  'website/chat': [['.lumi-brand', 75], ['.cs-suggest button', 75]],
  'status-hub/project': [['.pd-head .k', 75], ['.task .mono', 75]]
};
for (const browser of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  for (const route of Object.keys(targets)) {
    await page.goto(new URL('/ui_kits/' + route + '.html', page.url()).href);
    if (route === 'website/chat') await page.locator('.lumi-page').waitFor();
    if (route === 'website/index') await page.locator('#root > .site').waitFor();
    await page.addStyleTag({
      content: '*,*::before,*::after{transition:none!important;animation:none!important}'
    });
    for (const width of [320, 390, 1280]) for (const theme of ['light', 'dark']) for (const lang of ['en', 'vi']) {
      await page.setViewportSize({
        width,
        height: 900
      });
      await page.evaluate(t => document.documentElement.dataset.theme = t, route === 'website/index' ? 'light' : theme);
      if (route === 'website/index') {
        if (((await page.locator('.site').getAttribute('data-theme')) || 'light') !== theme) await page.locator('.hdr-side button.icon').click();
        if ((await page.locator('.site').getAttribute('lang')) !== lang) await page.locator('.hdr-side .mini').first().click();
      } else if ((await page.locator('html').getAttribute('lang')) !== lang) await page.locator('#langToggle,.lumi-language,[data-preview-language-toggle]').click();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      await page.mouse.move(0, 0);
      for (const [selector, floor] of targets[route]) {
        const nodes = page.locator(selector);
        if (!(await nodes.count())) throw new Error('Missing required contrast target ' + route + ' ' + selector);
        for (let index = 0; index < (await nodes.count()); index++) {
          const node = nodes.nth(index);
          if (!(await node.isVisible())) {
            if (route === 'website/chat' && selector === '.lumi-brand' && width < 820) continue;
            throw new Error('Unexpected hidden target ' + selector);
          }
          for (const state of selector === '.ft-links a' ? ['default', 'hover', 'focus'] : ['default']) {
            if (state === 'hover') await node.hover();
            if (state === 'focus') {
              await page.mouse.move(0, 0);
              await node.focus();
            }
            const metric = await node.evaluate(el => {
              const cv = document.createElement('canvas');
              cv.width = cv.height = 1;
              const ctx = cv.getContext('2d'),
                parse = v => {
                  ctx.clearRect(0, 0, 1, 1);
                  ctx.fillStyle = v;
                  ctx.fillRect(0, 0, 1, 1);
                  return [...ctx.getImageData(0, 0, 1, 1).data];
                };
              const s = getComputedStyle(el),
                raw = parse(s.color);
              let background,
                ancestorOpacity = 1,
                unresolved = [];
              for (let p = el; p; p = p.parentElement) {
                const q = getComputedStyle(p);
                ancestorOpacity *= Number(q.opacity);
                if (q.filter !== 'none') unresolved.push('filter');
                if (!background) {
                  if (q.backgroundImage !== 'none') unresolved.push('background-image');
                  const b = parse(q.backgroundColor);
                  if (b[3] === 255) background = b;else if (b[3] !== 0) unresolved.push('alpha-background');
                }
              }
              if (!background) unresolved.push('no-opaque-background');
              const bg = background || [0, 0, 0, 0];
              const a = raw[3] / 255 * ancestorOpacity;
              return {
                actualLang: document.querySelector('#root > .site')?.getAttribute('lang') || document.documentElement.lang,
                textLang: el.closest('[lang]').getAttribute('lang'),
                actualTheme: el.closest('[data-theme]').getAttribute('data-theme'),
                text: el.textContent.trim(),
                rawForeground: raw,
                bg,
                fg: raw.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a)),
                ancestorOpacity,
                fontSize: s.fontSize,
                fontWeight: s.fontWeight,
                unresolved
              };
            });
            const value = apca(hex(metric.fg), hex(metric.bg));
            rows.push({
              browser,
              route,
              width,
              theme,
              lang,
              selector,
              index,
              state,
              floor,
              ...metric,
              apca: value,
              pass: value >= floor && !metric.unresolved.length && metric.actualLang === lang && metric.actualTheme === theme
            });
            await page.mouse.move(0, 0);
          }
        }
      }
      if (route === 'status-hub/project') rows.push({
        browser,
        route,
        width,
        theme,
        lang,
        selector: '.crumb .sep',
        state: 'decorative speech exclusion',
        pass: await page.locator('.crumb .sep').evaluateAll(els => els.length === 2 && els.every(el => el.getAttribute('aria-hidden') === 'true'))
      });
    }
  }
}, {
  browserName: browser,
  contextOptions: {
    viewport: {
      width: 1280,
      height: 900
    },
    reducedMotion: 'reduce'
  }
});
const failures = rows.filter(r => !r.pass).length;
const report = {
  recordedAt: new Date().toISOString(),
  cases: rows.length,
  failures,
  exitCode: failures ? 1 : 0,
  rows,
  scope: 'Finite named actual solid-surface text contrasts and decorative breadcrumb semantics in three engines, three widths, light/dark EN/VI. APCA75 regular metadata/footer/brand/prefix/figures, APCA60 existing bold primary UI convention for fixed gold CTAs. Footer links include default/hover/focus; filtered/image/pseudo/other text/state/axes, glyph pixels and operator acceptance remain separate. Hidden mobile Chat sidebar excluded only by the source breakpoint.'
};
if (process.env.CS_SECONDARY_REPORT) writeFileSync(process.env.CS_SECONDARY_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  cases: rows.length,
  failures,
  examples: rows.filter(r => !r.pass).slice(0, 3)
}, null, 2));
process.exitCode = failures ? 1 : 0;
