import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], { stdio: 'pipe' });
execFileSync(process.execPath, ['scripts/flatten-styles.mjs', '--check'], { stdio: 'pipe' });
const browserName = process.env.CS_BROWSER || 'chromium';
const coarseOnly = process.argv.includes('--coarse-only');
const results = [];
let nativeTaps = 0;
let failure;
try {
  for (const stylesheet of ['/styles.css', '/dist/styles.min.css'])
    for (const coarse of coarseOnly ? [true] : [false, true])
      for (const reducedMotion of ['no-preference', 'reduce']) {
        await withBrowserFixture(async page => {
          await page.evaluate(async stylesheet => {
            const link = document.querySelector('link[rel="stylesheet"]');
            if (new URL(link.href).pathname === stylesheet && link.sheet) return;
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => reject(Error('Fixture stylesheet timed out: '+stylesheet)), 30000);
              link.onload = () => { clearTimeout(timeout); resolve(); };
              link.onerror = () => { clearTimeout(timeout); reject(Error('Fixture stylesheet failed: '+stylesheet)); };
              link.href = stylesheet;
            });
          }, stylesheet);
          assert.equal(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), coarse);
          for (const width of [320, 390, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            for (const lang of ['en', 'vi']) for (const theme of ['light', 'dark'])
              for (const density of ['comfortable', 'compact'])
                for (const element of ['tho', 'kim', 'moc', 'thuy', 'hoa'])
                  for (const kind of ['Dialog', 'AlertDialog', 'AlertDialog-destructive']) {
                    const sample = { stylesheet, coarse, reducedMotion, width, lang, theme, density, element, kind };
                    await page.evaluate(sample => {
                      renderFixture(null);
                      const h = React.createElement;
                      const doc = document.documentElement;
                      doc.lang = sample.lang;
                      doc.dataset.theme = sample.theme;
                      doc.dataset.csDensity = sample.density;
                      doc.dataset.element = sample.element;
                      window.motionEvents = [];
                      function App() {
                        const [open, setOpen] = React.useState(true);
                        window.reopenMotion = () => ReactDOM.flushSync(() => setOpen(true));
                        const action = name => () => { motionEvents.push(name); setOpen(false); };
                        return sample.kind === 'Dialog'
                          ? h(CS.Dialog, { open, title: sample.lang === 'en' ? 'Dialog' : 'Hộp thoại', lang: sample.lang,
                              onClose: action('close'), actions: ['xs', 'sm', 'md', 'lg'].map(size =>
                                h(CS.Button, { key: size, size, 'data-motion-action': size, onClick: action(size) }, size)) },
                              h('p', null, sample.lang === 'en' ? 'Content' : 'Nội dung'))
                          : h(CS.AlertDialog, { open, onOpenChange: setOpen, title: sample.lang === 'en' ? 'Confirm' : 'Xác nhận',
                              description: sample.lang === 'en' ? 'Content' : 'Nội dung', lang: sample.lang,
                              tone: sample.kind.endsWith('destructive') ? 'destructive' : 'default',
                              onCancel: action('cancel'), onConfirm: action('confirm') });
                      }
                      renderFixture(h(App));
                    }, sample);
                    await page.evaluate(() => document.fonts.ready);
                    const panel = page.locator('.cs-dialog');
                    const frames = await panel.evaluate(panel => {
                      const frames = [], animations = panel.getAnimations();
                      for (const fraction of Array.from({ length: 11 }, (_, i) => i / 10)) {
                        for (const animation of animations) {
                          animation.pause();
                          animation.currentTime = Number(animation.effect.getTiming().duration) * fraction;
                        }
                        const box = panel.getBoundingClientRect(), css = getComputedStyle(panel);
                        frames.push({ fraction, left: box.left, right: box.right, center: box.left + box.width / 2,
                          animation: css.animationName, transform: css.transform, opacity: Number(css.opacity),
                          targets: [...panel.querySelectorAll('button')].map(button => {
                            const rect = button.getBoundingClientRect();
                            return { name: button.getAttribute('aria-label') || button.textContent.trim(),
                              width: rect.width, height: rect.height };
                          }) });
                      }
                      return frames;
                    });
                    // Retain the first failing case as well as completed cases in optional evidence.
                    results.push({ ...sample, frames });
                    for (const frame of frames) {
                      const context = JSON.stringify({ ...sample, fraction: frame.fraction });
                      assert.ok(Math.abs(frame.center - width / 2) < 1, 'Dialog stays centered: '+context);
                      assert.ok(frame.left >= -0.01 && frame.right <= width + 0.01, 'Panel stays inside viewport: '+context);
                      assert.equal(frame.targets.length, kind === 'Dialog' ? 5 : 2, 'All built-in/composed actions mounted');
                      if (coarse) for (const target of frame.targets)
                        assert.ok(target.width >= 43.99 && target.height >= 43.99,
                          'Coarse target floor '+context+' '+JSON.stringify(target));
                      assert.equal(frame.animation, reducedMotion === 'reduce' ? 'none' : 'cs-fade-in',
                        'Declared motion preference/pointer boundary: '+context);
                    }
                    if (reducedMotion === 'reduce') assert.ok(frames.every(frame => frame.transform === 'none'));
                    else {
                      assert.ok(frames.every(frame => frame.transform === 'none'), 'Fade never scales authored targets');
                      assert.equal(frames[0].opacity, 0);
                      assert.equal(frames.at(-1).opacity, 1);
                    }
                    // Real native taps supplement the whole geometry matrix. Exercise every action
                    // at both horizontal edges across widths, languages, themes and motion preferences.
                    if (stylesheet === '/styles.css' && coarse && element === 'tho' && density === 'comfortable') {
                      const selectors = kind === 'Dialog'
                        ? ['.cs-dialog__header button', ...['xs', 'sm', 'md', 'lg'].map(size => '[data-motion-action="'+size+'"]')]
                        : ['.cs-dialog__actions button:first-child', '.cs-alert-dialog__confirm'];
                      const names = kind === 'Dialog' ? ['close', 'xs', 'sm', 'md', 'lg'] : ['cancel', 'confirm'];
                      for (let i = 0; i < selectors.length; i++) for (const edge of ['left', 'right']) {
                        await page.evaluate(() => reopenMotion());
                        await panel.evaluate(panel => {
                          for (const animation of panel.getAnimations()) {
                            animation.pause();
                            animation.currentTime = Number(animation.effect.getTiming().duration);
                          }
                        });
                        const point = await panel.locator(selectors[i]).evaluate((button, edge) => {
                          const rect = button.getBoundingClientRect();
                          const x = edge === 'left' ? rect.left + 1 : rect.right - 1, y = rect.top + rect.height / 2;
                          const hit = document.elementFromPoint(x, y);
                          return { x, y, belongs: hit === button || button.contains(hit) };
                        }, edge);
                        assert.ok(point.belongs, 'Action edge belongs to the real button');
                        const count = await page.evaluate(() => motionEvents.length);
                        await page.touchscreen.tap(point.x, point.y);
                        await page.waitForFunction(count => motionEvents.length === count + 1, count);
                        assert.equal(await page.evaluate(() => motionEvents.at(-1)), names[i]);
                        assert.equal(await page.locator('.cs-dialog').count(), 0, 'Real action dismisses the modal');
                        nativeTaps++;
                      }
                    }
                  }
          }
        }, { browserName, contextOptions: { hasTouch: coarse, reducedMotion, viewport: { width: 390, height: 900 } } });
      }
  const expected = coarseOnly ? 1440 : 2880;
  assert.equal(results.length, expected, 'Every declared case finishes');
  assert.equal(new Set(results.map(row => [row.stylesheet, row.coarse, row.reducedMotion, row.width, row.lang, row.theme, row.density, row.element, row.kind].join('/'))).size, expected);
  assert.equal(nativeTaps, 432, 'All declared native edge actions finish');
} catch (error) { failure = error; }
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
if (output) writeFileSync(output, JSON.stringify({ browserName, result: failure ? 'fail' : 'pass',
  scope: 'Both CSS exports; Dialog and default/destructive AlertDialog; fine/coarse pointers; both motion preferences; three widths; EN/VI; two themes/densities; five elements; eleven animation samples. Real action edge taps use raw CSS, Tho and comfortable density. No whole-product or human AT acceptance.',
  nativeTaps, failure: failure?.message, cases: results }, null, 2)+'\n');
if (failure) throw failure;
console.log(`PASS Dialog/AlertDialog positioning and motion (${browserName}): ${results.length} axis/pointer/motion/CSS-export cases, eleven frames each, ${nativeTaps} native edge taps; fade and reduced motion preserved.`);
