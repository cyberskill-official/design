import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_BROWSER || 'chromium';
const smoke = process.argv.includes('--smoke');
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
const materials = ['', 'cs-surface-whisper', 'cs-surface-light', 'cs-surface-standard', 'cs-glass-card', 'cs-surface-heavy', 'cs-surface-solid', 'cs-surface-matte'];
const families = ['Dialog', 'AlertDialog', 'Drawer-right', 'Drawer-left'];
const results = [];
const fontLoads = [];
let failure;
try {
  for (const stylesheet of smoke ? ['/styles.css'] : ['/styles.css', '/dist/styles.min.css']) for (const reducedMotion of smoke ? ['no-preference'] : ['no-preference', 'reduce']) {
    await withBrowserFixture(async page => {
      await page.evaluate(async stylesheet => {
        const link = document.querySelector('link[rel=stylesheet]');
        if (new URL(link.href).pathname === stylesheet && link.sheet) return;
        await new Promise((resolve, reject) => {
          link.onload = resolve;
          link.onerror = reject;
          link.href = stylesheet;
        });
      }, stylesheet);
      const loaded = await page.evaluate(async () => {
        const weights = ['400', '600', '700'];
        const faces = await Promise.all(weights.map(weight => document.fonts.load(weight + ' 16px "Be Vietnam Pro"', 'Turn Your Will Into Real Hiện Thực Hoá Ý Chí')));
        await document.fonts.ready;
        return weights.map((weight, i) => ({
          weight,
          faces: faces[i].map(face => ({
            family: face.family,
            status: face.status
          }))
        }));
      });
      assert.ok(loaded.every(row => row.faces.length && row.faces.every(face => face.status === 'loaded')), 'Real EN/VI UI font files must load');
      fontLoads.push({
        stylesheet,
        reducedMotion,
        loaded
      });
      for (const width of [390, 1365]) for (const parentKind of smoke ? ['Dialog'] : families) for (const childKind of smoke ? ['AlertDialog'] : families) for (const material of smoke ? ['', 'cs-surface-heavy'] : materials) {
        const n = results.length;
        const sample = {
          stylesheet,
          reducedMotion,
          width,
          parentKind,
          childKind,
          material,
          lang: n % 2 ? 'vi' : 'en',
          theme: Math.floor(n / 2) % 2 ? 'dark' : 'light',
          density: Math.floor(n / 4) % 2 ? 'compact' : 'comfortable',
          element: ['tho', 'kim', 'moc', 'thuy', 'hoa'][Math.floor(n / 8) % 5]
        };
        await page.setViewportSize({
          width,
          height: 900
        });
        await page.evaluate(sample => {
          renderFixture(null);
          const h = React.createElement,
            doc = document.documentElement;
          doc.lang = sample.lang;
          doc.dataset.theme = sample.theme;
          doc.dataset.csDensity = sample.density;
          doc.dataset.element = sample.element;
          window.nestedEvents = [];
          function App() {
            const [parent, setParent] = React.useState(true),
              [child, setChild] = React.useState(false);
            const modal = (kind, title, open, close, content, className) => {
              const common = {
                open,
                title,
                className
              };
              if (kind === 'AlertDialog') return h(CS.AlertDialog, {
                ...common,
                onOpenChange: close,
                tone: 'destructive',
                description: content,
                onCancel: () => nestedEvents.push(title + ' cancel')
              });
              if (kind.startsWith('Drawer')) return h(CS.Drawer, {
                ...common,
                side: kind.endsWith('left') ? 'left' : 'right',
                onClose: () => close(false)
              }, content);
              return h(CS.Dialog, {
                ...common,
                onClose: () => close(false)
              }, content);
            };
            const nested = modal(sample.childKind, 'Nested geometry panel', child, setChild, h('button', {
              'data-child-action': '',
              onClick: () => setChild(false)
            }, 'Nested action'), sample.material);
            const body = h(React.Fragment, null, h('div', {
              style: {
                height: '700px'
              }
            }, 'Long scrolling content'), h('button', {
              'data-open-nested': '',
              onClick: () => setChild(true)
            }, 'Open nested geometry'), nested);
            return modal(sample.parentKind, 'Parent geometry panel', parent, setParent, body, sample.material);
          }
          renderFixture(h(React.StrictMode, null, h(App)));
        }, sample);
        const trigger = page.locator('[data-open-nested]');
        await trigger.click();
        const frames = await page.evaluate(() => {
          const panels = [...document.querySelectorAll('[role=dialog], [role=alertdialog]')];
          const parent = panels.find(p => p.querySelector('h2')?.textContent === 'Parent geometry panel');
          const child = panels.find(p => p.querySelector('h2')?.textContent === 'Nested geometry panel');
          if (!parent || !child) throw Error('Both nested panels must mount');
          const animations = panels.flatMap(p => p.getAnimations());
          const rect = e => {
            const r = e.getBoundingClientRect();
            return {
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height
            };
          };
          const frames = [];
          for (const fraction of [0, 0.5, 1]) {
            for (const animation of animations) {
              animation.pause();
              animation.currentTime = Number(animation.effect.getTiming().duration) * fraction;
            }
            // The backing's resize listener also exposes synchronous geometry refresh.
            window.dispatchEvent(new Event('resize'));
            const backdrop = child.classList.contains('cs-drawer') ? child.previousElementSibling?.classList.contains('cs-overlay-surface') ? child.previousElementSibling.previousElementSibling : child.previousElementSibling : child.parentElement.querySelector(':scope > .cs-dialog__overlay');
            const actions = [...child.querySelectorAll('button')].map(button => {
              const r = button.getBoundingClientRect(),
                x = (r.left + r.right) / 2,
                y = (r.top + r.bottom) / 2;
              // Rounded corners are intentionally excluded from hit-area samples.
              return {
                name: button.textContent || button.getAttribute('aria-label'),
                rect: rect(button),
                hits: [[x, r.top + 2], [x, r.bottom - 2], [r.left + 2, y], [r.right - 2, y], [x, y]].map(([x, y]) => button.contains(document.elementFromPoint(x, y)))
              };
            });
            const surfaces = panels.filter(p => p.hasAttribute('data-cs-overlay-material')).map(p => {
              const surface = p.previousElementSibling;
              return {
                panel: rect(p),
                backing: rect(surface),
                ariaHidden: surface.getAttribute('aria-hidden'),
                filter: getComputedStyle(p).backdropFilter,
                transform: getComputedStyle(p).transform,
                panelToken: getComputedStyle(p).getPropertyValue('--cs-color-surface-panel'),
                surfaceToken: getComputedStyle(surface).getPropertyValue('--cs-color-surface-panel'),
                tokenMatches: getComputedStyle(surface).getPropertyValue('--cs-color-surface-panel').trim() === getComputedStyle(p).getPropertyValue('--cs-color-surface-panel').trim()
              };
            });
            frames.push({
              fraction,
              backdrop: rect(backdrop),
              actions,
              surfaces,
              focusInside: child.contains(document.activeElement),
              childRect: rect(child),
              parentTransform: getComputedStyle(parent).transform,
              childTransform: getComputedStyle(child).transform
            });
          }
          return frames;
        });
        const row = {
          ...sample,
          frames
        };
        results.push(row);
        for (const frame of frames) {
          const context = JSON.stringify({
            ...sample,
            fraction: frame.fraction
          });
          for (const [key, value] of Object.entries({
            x: 0,
            y: 0,
            width,
            height: 900
          })) assert.ok(Math.abs(frame.backdrop[key] - value) < 1, 'Nested backdrop covers viewport: ' + context + ' ' + key);
          assert.equal(frame.parentTransform, 'none', 'Parent does not capture fixed descendants: ' + context);
          assert.equal(frame.childTransform, 'none', 'Child supports further nesting: ' + context);
          assert.ok(frame.focusInside, 'Top modal owns focus: ' + context);
          // Sliding panels intentionally start offscreen. Completed geometry must hit every action.
          if (frame.fraction === 1 || !childKind.startsWith('Drawer')) for (const action of frame.actions) assert.ok(action.hits.every(Boolean), 'Nested action hit area: ' + context + ' ' + action.name);
          for (const surface of frame.surfaces) {
            assert.equal(surface.ariaHidden, 'true');
            assert.equal(surface.filter, 'none');
            assert.ok(surface.tokenMatches);
            for (const key of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(surface.panel[key] - surface.backing[key]) < 1, 'Material backing follows panel: ' + context + ' ' + key);
          }
        }
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('[role=dialog], [role=alertdialog]').count(), 1, 'Escape closes one modal');
        assert.ok(await trigger.evaluate(el => el === document.activeElement), 'Trigger restored after nested Escape');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('[role=dialog], [role=alertdialog]').count(), 0);
        assert.equal(await page.locator('.cs-overlay-surface').count(), 0, 'StrictMode/unmount removes backing nodes');
      }
    }, {
      browserName,
      contextOptions: {
        reducedMotion,
        viewport: {
          width: 390,
          height: 900
        }
      }
    });
  }
  assert.equal(results.length, smoke ? 4 : 1024);
} catch (error) {
  failure = error;
}
if (output) writeFileSync(output, JSON.stringify({
  browserName,
  result: failure ? 'fail' : 'pass',
  fontLoads,
  cases: results,
  failure: failure?.message,
  scope: 'Every ordered Dialog/AlertDialog/left-right Drawer pair, eight materials, two widths, both CSS exports and motion preferences; three animation fractions, long parent scroll, five action hit points, passive backing geometry/tokens, StrictMode cleanup and nested Escape. EN/VI, themes/densities and all five elements rotate deliberately; not their full Cartesian product, human AT or visual acceptance.'
}, null, 2) + '\n');
if (failure) throw failure;
console.log(`PASS nested modal geometry (${browserName}): ${results.length} cases; no human acceptance inferred.`);
