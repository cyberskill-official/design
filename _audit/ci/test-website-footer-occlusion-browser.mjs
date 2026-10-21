import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const {
  withBrowserFixture
} = await import(pathToFileURL(join(root, '_audit/ci/lib/browser-fixture.mjs')));
const rows = [];
for (const browser of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  for (const route of ['work', 'careers']) {
    await page.goto(new URL('/ui_kits/website/' + route + '.html', page.url()).href);
    await page.addStyleTag({
      content: '*,*::before,*::after{transition:none!important;animation:none!important}'
    });
    for (const width of [320, 390, 821, 1280]) for (const theme of ['light', 'dark']) for (const lang of ['en', 'vi']) {
      await page.setViewportSize({
        width,
        height: 900
      });
      await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
      if ((await page.locator('html').getAttribute('lang')) !== lang) await page.locator('#langToggle').click();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const data = await page.locator('.ft small').evaluate(el => {
        const toggle = document.querySelector('#themeToggle'),
          r = toggle.getBoundingClientRect(),
          covered = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) for (let i = 0; i < node.length; i++) {
          if (!node.textContent[i].trim()) continue;
          const range = document.createRange();
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          for (const q of range.getClientRects()) {
            const x = (q.left + q.right) / 2,
              y = (q.top + q.bottom) / 2;
            if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
            const top = document.elementFromPoint(x, y);
            if (top === toggle || toggle.contains(top)) covered.push({
              glyph: node.textContent[i],
              x,
              y
            });
          }
        }
        return {
          actualLang: document.documentElement.lang,
          actualTheme: document.documentElement.dataset.theme,
          scrollY,
          maxScroll: document.documentElement.scrollHeight - innerHeight,
          control: {
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height
          },
          text: el.textContent,
          covered
        };
      });
      rows.push({
        browser,
        route,
        width,
        theme,
        lang,
        ...data,
        pass: data.actualLang === lang && data.actualTheme === theme && data.covered.length === 0
      });
    }
  }
}, {
  browserName: browser
});
const failures = rows.filter(r => !r.pass).length;
const report = {
  recordedAt: new Date().toISOString(),
  cases: rows.length,
  failures,
  exitCode: failures ? 1 : 0,
  rows,
  scope: 'Actual footer copyright character midpoints at maximum scroll for Work/Careers, three engines,320/390/821/1280x900, EN/VI light/dark. Identifies topmost fixed theme button covering copyright characters. Not actual pixel glyph boundaries, all scroll/zoom/focus states or operator visual acceptance.'
};
if (process.env.CS_OCCLUSION_REPORT) writeFileSync(process.env.CS_OCCLUSION_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  cases: rows.length,
  failures,
  examples: rows.filter(r => !r.pass).slice(0, 2)
}, null, 2));
process.exitCode = failures ? 1 : 0;
