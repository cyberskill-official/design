import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium',
  rows = [];
for (const cssMode of ['imports', 'flat']) await withBrowserFixture(async page => {
  if (cssMode === 'flat') await page.evaluate(() => new Promise((resolve, reject) => {
    const link = document.querySelector('link[rel=stylesheet]');
    link.onload = () => resolve();
    link.onerror = () => reject(Error('Flattened stylesheet failed'));
    link.href = '/dist/styles.min.css';
  }));
  await page.addStyleTag({
    content: '*,*::before,*::after{transition:none!important;animation:none!important}'
  });
  for (const width of [320, 390, 1280]) for (const density of ['comfortable', 'compact']) for (const lang of ['en', 'vi']) for (const theme of ['light', 'dark']) for (const family of ['InputGroup', 'InputGroupBothClear', 'InputGroupBothReveal', 'SegmentedControl', 'TagInput']) for (const angle of [0, 45, 90, 135, 180, 225, 270, 315]) {
    await page.setViewportSize({
      width,
      height: 800
    });
    await page.evaluate(({
      family,
      density,
      lang,
      theme
    }) => {
      const h = React.createElement;
      renderFixture(null);
      window.borderEvents = [];
      const node = family.startsWith('InputGroup') ? h(CS.InputGroup, {
        label: 'Amount',
        defaultValue: '123.45',
        prefix: '$',
        suffix: 'USD',
        clearable: true,
        password: family !== 'InputGroup',
        onChange: value => borderEvents.push(['input', value])
      }) : family === 'SegmentedControl' ? h(CS.SegmentedControl, {
        options: [{
          value: 'a',
          label: 'A'
        }, {
          value: 'b',
          label: 'B'
        }],
        value: 'a',
        onChange: value => borderEvents.push(['segment', value])
      }) : h(CS.TagInput, {
        label: 'Tags',
        defaultValue: ['one', 'two'],
        onChange: tags => borderEvents.push(['tags', tags])
      });
      renderFixture(h('main', {
        'data-cs-density': density,
        lang,
        'data-theme': theme,
        style: {
          padding: 12
        }
      }, node));
    }, {
      family,
      density,
      lang,
      theme
    });
    const target = page.locator(family === 'InputGroupBothReveal' ? '.cs-igroup__btn:nth-last-child(2)' : family.startsWith('InputGroup') ? '.cs-igroup__btn' : family === 'SegmentedControl' ? '.cs-segmented button:nth-child(2)' : '.cs-tag__close').first();
    const box = await target.boundingBox(),
      center = {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2
      };
    const rad = angle * Math.PI / 180,
      requested = {
        x: center.x + 21.75 * Math.cos(rad),
        y: center.y + 21.75 * Math.sin(rad)
      };
    // Touchscreen dispatch uses integer device coordinates in Firefox. Select the
    // nearest integer CSS point still inside the declared disk before dispatch;
    // flooring a fractional near-border point can put the delivered tap outside it.
    const candidates = [];
    for (let x = Math.floor(requested.x) - 1; x <= Math.ceil(requested.x) + 1; x++) for (let y = Math.floor(requested.y) - 1; y <= Math.ceil(requested.y) + 1; y++) if (Math.hypot(x - center.x, y - center.y) <= 21.75) candidates.push({
      x,
      y
    });
    candidates.sort((a, b) => Math.hypot(a.x - requested.x, a.y - requested.y) - Math.hypot(b.x - requested.x, b.y - requested.y));
    const point = candidates[0];
    assert(point);
    assert(Math.hypot(point.x - center.x, point.y - center.y) > 20, 'Probe remains near the 44px disk perimeter');
    const queried = await target.evaluate((el, p) => {
      const hit = document.elementFromPoint(p.x, p.y);
      return {
        within: hit === el || el.contains(hit),
        hit: hit?.tagName,
        hitClass: typeof hit?.className === 'string' ? hit.className : ''
      };
    }, point);
    await page.touchscreen.tap(point.x, point.y);
    const events = await page.evaluate(() => borderEvents);
    const expected = family.startsWith('InputGroup') ? [['input', '']] : family === 'SegmentedControl' ? [['segment', 'b']] : [['tags', ['two']]];
    const reveal = family === 'InputGroupBothReveal';
    const pass = reveal ? (await target.getAttribute('aria-pressed')) === 'true' && (await page.locator('.cs-igroup input').getAttribute('type')) === 'text' && events.length === 0 : JSON.stringify(events) === JSON.stringify(expected);
    rows.push({
      cssMode,
      width,
      density,
      lang,
      theme,
      family,
      angle,
      box,
      requested,
      point,
      queried,
      events,
      expected: reveal ? 'password revealed; no value change' : expected,
      pass
    });
  }
}, {
  browserName,
  contextOptions: {
    viewport: {
      width: 390,
      height: 800
    },
    hasTouch: true,
    ...(browserName === 'firefox' ? {} : {
      isMobile: true
    })
  }
});
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
if (output) writeFileSync(output, JSON.stringify({
  browserName,
  scope: 'Both imported and flattened CSS exports. Actual native taps at eight nearest integer near-boundary positions inside a 44px diameter control disk (radius20..21.75). Three source components with adjacent clear/reveal actions, three widths, both densities, languages and themes. Fractional continuous perimeter and other prop states remain unverified.',
  rows
}, null, 2) + '\n');
console.log({
  browserName,
  cases: rows.length,
  queryMisses: rows.filter(r => !r.queried.within).length,
  nativeFailures: rows.filter(r => !r.pass).length,
  failures: rows.filter(r => !r.pass).slice(0, 6)
});
assert.equal(rows.filter(r => !r.pass).length, 0);
