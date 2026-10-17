import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { inspectCoarseHitRegion } from './lib/coarse-hit-region.mjs';

const browserName = process.env.CS_TEST_BROWSER || 'chromium', rows = [];
const heights = [1, 28, 32, 44, 45, 46, 80, 240];
for (const cssMode of ['imports', 'flat']) await withBrowserFixture(async page => {
  if (cssMode === 'flat') await page.evaluate(() => new Promise((resolve, reject) => {
    const link = document.querySelector('link[rel=stylesheet]');
    link.onload = resolve; link.onerror = () => reject(Error('Flat stylesheet unavailable'));
    link.href = '/dist/styles.min.css';
  }));
  await page.addScriptTag({ content: 'window.inspectCoarseHitRegion = ' + inspectCoarseHitRegion.toString() });
  assert.equal(await page.evaluate(() => matchMedia('(pointer:coarse)').matches), true);
  const touch = browserName === 'chromium' ? await page.context().newCDPSession(page) : null;
  for (const width of [320, 390, 1280]) for (const density of ['comfortable', 'compact'])
    for (const lang of ['en', 'vi']) for (const theme of ['light', 'dark'])
      for (const dir of ['ltr', 'rtl']) for (const height of heights) {
        await page.setViewportSize({ width, height: 800 });
        await page.evaluate(({ height, density, lang, theme, dir }) => {
          renderFixture(null); window.splitterPointers = [];
          document.onpointerdown = event => splitterPointers.push({ trusted: event.isTrusted, type: event.pointerType, bar: event.target.matches('.cs-splitter__bar') });
          renderFixture(React.createElement('main', { dir, lang, 'data-theme': theme, 'data-cs-density': density, style: { padding: 12 } },
            React.createElement(CS.Splitter, { height, lang, start: 'Start', end: 'End' })));
        }, { height, density, lang, theme, dir });
        const bar = page.getByRole('separator');
        const geometry = await bar.evaluate(el => {
          const r = el.getBoundingClientRect(), parent = el.parentElement.getBoundingClientRect();
          return { bar: r.toJSON(), parent: parent.toJSON(), region: inspectCoarseHitRegion(el), available: el.parentElement.clientWidth - r.width };
        });
        assert(geometry.bar.width >= 44 && geometry.bar.height >= 44 && geometry.region.pass,
          JSON.stringify({ cssMode, width, density, lang, theme, dir, height, geometry }));
        assert.equal(geometry.parent.height, Math.max(46, height), 'Only the coarse minimum clamps requested container height');
        // All four near-perimeter cardinal points receive actual native touch.
        // preventDefault in the divider's drag handler intentionally suppresses click.
        const center = { x: geometry.bar.x + geometry.bar.width / 2, y: geometry.bar.y + geometry.bar.height / 2 };
        const points = [[-21, 0], [21, 0], [0, -21], [0, 21]].map(([dx, dy]) => ({ x: Math.round(center.x + dx), y: Math.round(center.y + dy) }));
        for (const point of points) await page.touchscreen.tap(point.x, point.y);
        const pointers = await page.evaluate(() => splitterPointers);
        assert.equal(pointers.length, 4);
        assert(pointers.every(event => event.trusted && event.type === 'touch' && event.bar), 'Native taps must reach the separator');
        const sign = dir === 'rtl' ? -1 : 1;
        // Native Chromium touch motion, including cancellation/release cleanup.
        // Other engines get native touch delivery plus their real mouse drag path.
        const point = points[2], delta = geometry.available * .1 * sign;
        if (touch) {
          const send = (type, x = point.x) => touch.send('Input.dispatchTouchEvent', { type, touchPoints: ['touchEnd', 'touchCancel'].includes(type) ? [] : [{ x, y: point.y, id: 1 }] });
          await send('touchStart'); await send('touchMove', point.x + delta); await send('touchEnd');
        } else {
          await page.mouse.move(point.x, point.y); await page.mouse.down(); await page.mouse.move(point.x + delta, point.y); await page.mouse.up();
        }
        await page.waitForFunction(() => document.querySelector('.cs-splitter__bar').getAttribute('aria-valuenow') === '60');
        await bar.focus(); await page.keyboard.press('ArrowLeft');
        assert.equal(await bar.getAttribute('aria-valuenow'), dir === 'rtl' ? '62' : '58');
        await page.keyboard.press('ArrowRight'); assert.equal(await bar.getAttribute('aria-valuenow'), '60');
        if (touch) {
          const box = await bar.boundingBox(), p = { x: box.x + box.width / 2, y: box.y + 2 };
          await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...p, id: 1 }] });
          await touch.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
          // A subsequent gesture in a pane must not inherit the canceled drag.
          await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: geometry.parent.x + geometry.parent.width - 5, y: p.y, id: 1 }] });
          await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: geometry.parent.x + geometry.parent.width - 20, y: p.y, id: 1 }] });
          await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
          assert.equal(await bar.getAttribute('aria-valuenow'), '60', 'Canceled native drag does not track a later pane gesture');
        }
        rows.push({ cssMode, width, density, lang, theme, dir, height, bar: geometry.bar, wrapperHeight: geometry.parent.height, nativeTaps: pointers.length, drag: touch ? 'native_chromium_touch' : 'native_touch_delivery_and_mouse_drag', value: 60 });
        if (rows.length % 128 === 0) console.log(`Splitter height ${browserName}: ${rows.length} cases complete (${cssMode})`);
      }
  await touch?.detach();
}, { browserName, contextOptions: { viewport: { width: 390, height: 800 }, hasTouch: true } });

// Fine pointers preserve the caller's height and the existing narrow handle.
await withBrowserFixture(async page => {
  for (const height of [32, 44, 46, 80, 240]) {
    await page.evaluate(height => renderFixture(React.createElement(CS.Splitter, { height, start: 'Start', end: 'End' })), height);
    const r = await page.getByRole('separator').evaluate(el => ({ bar: el.getBoundingClientRect().toJSON(), parent: el.parentElement.getBoundingClientRect().toJSON() }));
    assert.equal(r.parent.height, height); assert.equal(r.bar.height, height - 2); assert.equal(r.bar.width, 8);
  }
}, { browserName, contextOptions: { hasTouch: false } });
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
if (output) writeFileSync(output, JSON.stringify({ browserName, scope: 'Eight requested heights, imported/flat CSS, three widths, both density/theme/language/direction values; native touch cardinal delivery and keyboard resizing in every case; Chromium native touch drag/cancel, Firefox/WebKit mouse drag after native taps. Fine-pointer sizes preserved. Other components and arbitrary consumer overrides are outside this test.', rows }, null, 2) + '\n');
console.log(`PASS Splitter height ${browserName}: ${rows.length} coarse cases, ${rows.length * 4} native perimeter taps; drag/keyboard behavior and fine-pointer sizes`);
