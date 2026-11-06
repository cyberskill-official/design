import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

const browserName = process.env.CS_TEST_BROWSER || process.env.CS_BROWSER || 'chromium';
const variants = Object.keys(JSON.parse(readFileSync('tokens/tokens.json', 'utf8')).elements);

await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.goto(origin + '/_audit/component-state-paint.html');
  await page.waitForFunction(() => window.__statepaint, null, { timeout: 30000 });
  const verdict = await page.evaluate(() => window.__statepaint);
  assert.equal(verdict.pass, true, browserName + ' ' + (verdict.error || (verdict.failed || []).join(', ')));
  assert.equal(verdict.total, 19, browserName + ' paint check count');

  const markerCheck = await page.evaluate((packs) => {
    function relLum(rgbStr) {
      const m = rgbStr.match(/\d+(\.\d+)?/g);
      if (!m || m.length < 3) return 0;
      const [r, g, b] = m.slice(0, 3).map(v => {
        const c = Number(v) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function wcag(fg, bg) {
      const l1 = relLum(fg), l2 = relLum(bg);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }
    const host = document.createElement('div');
    document.body.appendChild(host);
    const selectors = [
      ['.cs-step--active .cs-step__marker', '<div class="cs-steps"><div class="cs-step cs-step--active"><span class="cs-step__marker">2</span></div></div>'],
      ['.cs-timeline__item--now .cs-timeline__marker', '<div class="cs-timeline"><div class="cs-timeline__item cs-timeline__item--now"><span class="cs-timeline__marker">!</span></div></div>'],
      ['.cs-cal__grid button.sel', '<div class="cs-cal"><div class="cs-cal__grid"><button class="sel" type="button">15</button></div></div>'],
      ['.cs-fab__main', '<div class="cs-fab cs-fab--static"><button class="cs-fab__main" type="button">+</button></div>'],
    ];
    let checked = 0;
    const failures = [];
    for (const entry of packs) {
      const [el, variant = ''] = entry.split('.');
      for (const theme of ['light', 'dark']) {
        for (const [sel, html] of selectors) {
          host.innerHTML = `<div data-theme="${theme}" data-cs-element="${el}" data-cs-variant="${variant}">${html}</div>`;
          const target = host.querySelector(sel);
          const cs = getComputedStyle(target);
          const ratio = wcag(cs.color, cs.backgroundColor);
          checked++;
          if (ratio < 4.5) {
            failures.push(`${entry}/${theme}/${sel}: ratio=${ratio.toFixed(2)} fg=${cs.color} bg=${cs.backgroundColor}`);
          }
        }
      }
    }
    host.remove();
    return { checked, failures };
  }, variants);
  assert.equal(markerCheck.checked, variants.length * 2 * 4, browserName + ' marker contrast check count');
  assert.deepEqual(markerCheck.failures, [], browserName + ' marker contrast failures');
}, { browserName });

console.log('PASS component state paint ' + browserName);
