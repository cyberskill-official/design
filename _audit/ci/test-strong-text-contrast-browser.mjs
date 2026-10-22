import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { apca } from '../../scripts/lib/oklch.mjs';
const root = new URL('../../', import.meta.url).pathname;
const {
  withBrowserFixture
} = await import('./lib/browser-fixture.mjs');
const elements = ['neutral', ...Object.keys(JSON.parse(readFileSync(root + '/tokens/tokens.json')).elements)],
  rows = [];
const hex = c => '#' + c.slice(0, 3).map(n => Math.round(n).toString(16).padStart(2, '0')).join('');
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  const url = page.url();
  for (const colorScheme of ['light', 'dark']) for (const contrast of ['no-preference', 'more']) {
    await page.emulateMedia({
      colorScheme,
      contrast
    });
    await page.goto(url);
    await page.evaluate(() => {
      const name = Object.keys(window).find(k => /^CyberSkillDesignSystem_[a-f0-9]{6}$/.test(k));
      if (!name || window[name].__errors.length) throw Error('Fixture bundle failure');
      window.CS = window[name];
      window.fixtureRoot = ReactDOM.createRoot(document.getElementById('fixture'));
      document.head.insertAdjacentHTML('beforeend', '<style>*{transition:none!important;animation:none!important}:root{--diagnostic-contrast:standard}@media(prefers-contrast:more){:root{--diagnostic-contrast:high}}</style>');
      const h = React.createElement;
      ReactDOM.flushSync(() => fixtureRoot.render(h(React.Fragment, null, h('div', {
        id: 'strong',
        style: {
          background: 'var(--cs-accent-strong)',
          color: 'var(--cs-accent-on-strong)',
          fontSize: 16,
          fontWeight: 400,
          padding: 20
        }
      }, 'Readiness note'), h('div', {
        id: 'surface',
        style: {
          background: 'var(--cs-color-surface-page)',
          padding: 20
        }
      }, h(CS.Button, {
        id: 'primary'
      }, 'Continue')))));
    });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--diagnostic-contrast').trim()), contrast === 'more' ? 'high' : 'standard');
    const values = await page.evaluate(({
      elements,
      colorScheme,
      contrast
    }) => {
      const out = [],
        root = document.documentElement;
      for (const csContrast of ['inherit', 'standard', 'high']) for (const theme of ['light', 'dark', 'system']) for (const density of ['comfortable', 'compact']) for (const element of elements) {
        root.dataset.theme = theme;
        root.dataset.csDensity = density;
        if (csContrast === 'inherit') delete root.dataset.csContrast;else root.dataset.csContrast = csContrast;
        const [e, v = ''] = element.split('.');
        if (element === 'neutral') {
          delete root.dataset.csElement;
          delete root.dataset.csVariant;
        } else {
          root.dataset.csElement = e;
          root.dataset.csVariant = v;
        }
        const cv = document.createElement('canvas');
        cv.width = cv.height = 1;
        const ctx = cv.getContext('2d', {
            willReadFrequently: true
          }),
          color = v => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = v;
            ctx.fillRect(0, 0, 1, 1);
            return [...ctx.getImageData(0, 0, 1, 1).data];
          };
        for (const [id, floor] of [['strong', 75], ['primary', 60]]) {
          const el = document.getElementById(id),
            s = getComputedStyle(el);
          out.push({
            colorScheme,
            contrast,
            csContrast,
            theme,
            density,
            element,
            consumer: id,
            fg: color(s.color),
            bg: color(s.backgroundColor),
            fontWeight: s.fontWeight,
            fontSize: s.fontSize,
            floor
          });
        }
      }
      return out;
    }, {
      elements,
      colorScheme,
      contrast
    });
    rows.push(...values.map(r => ({
      browserName,
      ...r,
      lc: apca(hex(r.fg), hex(r.bg))
    })));
  }
}, {
  browserName
});
assert(rows.every(r => r.fg[3] === 255 && r.bg[3] === 255), 'Static fixture foreground/fill must be opaque');
const failures = rows.filter(r => r.lc < r.floor);
const report = {
  completedAt: new Date().toISOString(),
  rows,
  failures,
  scope: 'Actual strong/on-strong regular body sample and real React primaryButton. Neutral/all15variants,threeengines,allthemes/OSschemes/densities/inheritedexplicitcontrast with CSS/media initialized and verified atnavigation. Static terminal states with transitions/animations disabled; opaque declared fills and surrounding page only; no arbitraryalpha/overlap/allButtoninteractionstates ornative/manualacceptance claim.'
};
if (process.env.CS_STRONG_TEXT_RECEIPT) writeFileSync(process.env.CS_STRONG_TEXT_RECEIPT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  rows: rows.length,
  failures: failures.length,
  minStrong: Math.min(...rows.filter(r => r.consumer === 'strong').map(r => r.lc)),
  minPrimary: Math.min(...rows.filter(r => r.consumer === 'primary').map(r => r.lc)),
  examples: failures.slice(0, 3)
}, null, 2));
assert.equal(rows.length, 6912, 'Complete three-engine strong/primary axes');
assert.equal(failures.length, 0, 'Regular strong-callout textAPCA75 and primary-button boldUI60 must hold');
