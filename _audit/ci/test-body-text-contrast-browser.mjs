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
  const fixtureUrl = page.url();
  const render = () => page.evaluate(() => {
    const h = React.createElement;
    renderFixture(h(React.Fragment, null, ...['page', 'panel', 'raised', 'tint'].map(surface => h('section', {
      id: surface,
      key: surface,
      style: {
        background: surface === 'tint' ? 'var(--cs-accent-tint)' : 'var(--cs-color-surface-' + surface + ')',
        padding: 16
      }
    }, h(CS.Stat, {
      label: 'Open wishes',
      value: 3
    }), h(CS.TextField, {
      label: 'Email',
      description: 'Use your work email',
      id: surface + '-field'
    }), h('a', {
      id: surface + '-link',
      href: '#'
    }, 'Help'), h(CS.AIDisclosureBadge, {
      label: 'AI assisted'
    }), h('span', {
      id: surface + '-accent',
      style: {
        color: 'var(--cs-color-text-accent)',
        fontSize: 12,
        fontWeight: 700
      }
    }, 'Accent body')))));
  });
  for (const colorScheme of ['light', 'dark']) for (const contrast of ['no-preference', 'more']) {
    await page.emulateMedia({
      colorScheme,
      contrast
    });
    await page.goto(fixtureUrl);
    await page.evaluate(() => {
      const name = Object.keys(window).find(k => /^CyberSkillDesignSystem_[a-f0-9]{6}$/.test(k));
      if (!name || window[name].__errors.length) throw Error('Fresh fixture component bundle failed');
      window.CS = window[name];
      window.fixtureRoot = ReactDOM.createRoot(document.getElementById('fixture'));
      window.renderFixture = element => ReactDOM.flushSync(() => fixtureRoot.render(element));
      document.head.insertAdjacentHTML('beforeend', '<style>:root{--diagnostic-contrast:standard}@media(prefers-contrast:more){:root{--diagnostic-contrast:high}}</style>');
    });
    await render();
    const readiness = await page.evaluate(() => ({
      media: matchMedia('(prefers-contrast:more)').matches,
      css: getComputedStyle(document.documentElement).getPropertyValue('--diagnostic-contrast').trim()
    }));
    assert.equal(readiness.media, contrast === 'more');
    assert.equal(readiness.css, contrast === 'more' ? 'high' : 'standard', 'CSS must agree with the emulated preference before measurement');
    const result = await page.evaluate(({
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
        for (const surface of ['page', 'panel', 'raised', 'tint']) for (const [selector, consumer] of [[`#${surface} .cs-stat__label`, 'stat-label'], [`#${surface}-field-description`, 'field-description'], [`#${surface}-link`, 'body-link'], [`#${surface}-accent`, 'body-accent'], [`#${surface} .cs-ai-disclosure__badge`, 'ai-disclosure-badge']]) {
          if (surface === 'tint' && (element === 'neutral' || consumer !== 'body-accent')) continue;
          const el = document.querySelector(selector),
            s = getComputedStyle(el),
            bg = consumer === 'ai-disclosure-badge' ? s.backgroundColor : getComputedStyle(document.getElementById(surface)).backgroundColor;
          const cv = document.createElement('canvas');
          cv.width = cv.height = 1;
          const ctx = cv.getContext('2d', {
            willReadFrequently: true
          });
          const parse = v => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = v;
            ctx.fillRect(0, 0, 1, 1);
            return [...ctx.getImageData(0, 0, 1, 1).data];
          };
          out.push({
            colorScheme,
            contrast,
            csContrast,
            theme,
            density,
            element,
            surface,
            consumer,
            fg: parse(s.color),
            bg: parse(bg),
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            floor: 75
          });
        }
      }
      return out;
    }, {
      elements,
      colorScheme,
      contrast
    });
    rows.push(...result.map(r => ({
      browserName,
      ...r,
      lc: apca(hex(r.fg), hex(r.bg))
    })));
  }
}, {
  browserName
});
const failures = rows.filter(r => r.lc < r.floor);
const result = {
  completedAt: new Date().toISOString(),
  elements,
  rows,
  failures,
  scope: 'ActualReactAIDisclosureBadge fill/foreground,Stat label,TextFielddescription bodyanchor and12pxboldsemanticaccent onallneutral/15elementvariant page/panel/raised surfaces; semanticaccent additionally on15explicit elementaccent-tints (neutralroot tint doesnotdeclareaDarkpack); threeengines,light/dark/system,both OS schemes/contrast preferences initialized at navigation with CSS/media agreement, densities, inherited/explicit Standard/High contrast. Solidfullyopaquesurfaces andtext; no arbitraryoverlap/alpha, allcomponentstates, native/device,wholetext-useoroperator acceptance claim.'
};
if (process.env.CS_BODY_TEXT_RECEIPT) writeFileSync(process.env.CS_BODY_TEXT_RECEIPT, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({
  rows: rows.length,
  failures: failures.length,
  minimum: Math.min(...rows.map(r => r.lc)),
  examples: failures.slice(0, 3)
}, null, 2));
assert.equal(rows.length, 55080, 'Complete three-engine body axes');
assert(rows.every(r => r.fg[3] === 255 && r.bg[3] === 255), 'Fixture text and surfaces must be opaque');
assert.equal(failures.length, 0, 'Actual body text must meet APCA75 on all supported element surfaces');
