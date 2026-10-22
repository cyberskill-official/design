import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { buildLayeredCss } from '../../scripts/lib/layered-css.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium',
  {
    css,
    manifest
  } = buildLayeredCss(new URL('../../', import.meta.url).pathname),
  results = [];
const brokenOrder = css.replace('@layer cs-safety, cs-reset, cs-tokens, cs-components, cs-accessibility, cs-responsive, cs-overrides;', '@layer cs-reset, cs-tokens, cs-components, cs-accessibility, cs-responsive, cs-overrides, cs-safety;');
assert.notEqual(css, brokenOrder);
for (const {
  coarse,
  forcedColors
} of [{
  coarse: false,
  forcedColors: 'none'
}, {
  coarse: true,
  forcedColors: 'none'
}, {
  coarse: false,
  forcedColors: 'active'
}]) await withBrowserFixture(async page => {
  assert.equal(await page.evaluate(() => matchMedia('(forced-colors: active)').matches), forcedColors === 'active');
  assert.equal(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), coarse);
  let current = css;
  await page.route('**/styles.layered.css*', route => route.fulfill({
    contentType: 'text/css',
    body: current
  }));
  await page.evaluate(() => {
    const h = React.createElement;
    function Fixture() {
      const [value, setValue] = React.useState('a');
      return h('div', {
        'data-layer-state': ''
      }, h(CS.Button, {
        id: 'layer-button'
      }, 'Layer action'), h(CS.Button, {
        disabled: true
      }, 'Disabled action'), h(CS.TextField, {
        label: 'Disabled field',
        disabled: true
      }), h(CS.Checkbox, {
        label: 'Disabled checkbox',
        disabled: true
      }), h(CS.SegmentedControl, {
        'aria-label': 'Choice',
        value,
        onChange: setValue,
        options: [{
          value: 'a',
          label: 'Alpha'
        }, {
          value: 'b',
          label: 'Beta'
        }]
      }), h(CS.Combobox, {
        label: 'Portaled choice',
        options: [{
          value: 'a',
          label: 'One'
        }, {
          value: 'b',
          label: 'Two'
        }]
      }), h(CS.Popover, {
        label: 'Layer popup',
        children: h('input', {
          'aria-label': 'Popup input',
          defaultValue: 'entered'
        })
      }), h('span', {
        id: 'layer-hidden',
        className: 'cs-sr-only'
      }, 'Screen reader text'), h('div', {
        id: 'layer-motion',
        style: {
          animation: 'cs-spin 4s linear infinite',
          transition: 'opacity 4s'
        }
      }, 'Motion'));
    }
    renderFixture(h(Fixture));
  });
  async function switchCss(layered) {
    await page.evaluate(async layered => {
      const previous = document.querySelector('link[rel="stylesheet"]'),
        next = document.createElement('link');
      next.rel = 'stylesheet';
      next.href = layered ? '/styles.layered.css?' + Date.now() : '/styles.css';
      await new Promise((resolve, reject) => {
        next.onload = resolve;
        next.onerror = reject;
        previous.after(next);
      });
      await document.fonts.ready;
      previous.remove();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, layered);
  }
  async function settle() {
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  }
  async function paint() {
    await settle();
    return page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-layer-state] *,[data-cs-floating-root],[data-cs-floating-root] *')].map((el, i) => {
      const s = getComputedStyle(el);
      return [i, {
        tag: el.localName,
        role: el.getAttribute('role'),
        text: el.textContent,
        color: s.color,
        background: s.backgroundColor,
        outline: s.outline,
        outlineOffset: s.outlineOffset,
        shadow: s.boxShadow,
        border: s.border,
        opacity: s.opacity,
        cursor: s.cursor,
        padding: s.padding,
        minWidth: s.minWidth,
        minHeight: s.minHeight,
        font: s.font,
        visibility: s.visibility
      }];
    })));
  }
  const button = page.getByRole('button', {
    name: 'Layer action',
    exact: true
  });
  await button.focus();
  assert.equal(await button.evaluate(el => el.matches(':focus-visible')), true);
  const focused = await paint();
  await switchCss(true);
  assert.deepEqual(await paint(), focused, 'Native focus and disabled paint must match');
  assert.notEqual(await button.evaluate(el => getComputedStyle(el).outlineStyle), 'none');
  assert.equal(await page.getByRole('button', {
    name: 'Disabled action'
  }).isDisabled(), true);
  await button.hover();
  const hovered = await paint();
  await switchCss(false);
  assert.deepEqual(await paint(), hovered, 'Real hover paint must match');
  const combo = page.getByRole('combobox', {
    name: 'Portaled choice',
    exact: true
  });
  await combo.focus();
  await page.keyboard.press('ArrowDown');
  await page.getByRole('listbox').waitFor();
  const panel = page.locator('[data-cs-floating-root]').filter({
    has: page.getByRole('option', {
      name: 'Two',
      exact: true
    })
  });
  assert.equal(await panel.count(), 1);
  assert.equal(await panel.evaluate(el => el.parentElement === document.body), true, 'Actual popup remains body owned');
  const selected = await paint();
  await switchCss(true);
  assert.deepEqual(await paint(), selected, 'Open/highlighted portaled control paint must match');
  await page.keyboard.press('Escape');
  assert.equal(await combo.getAttribute('aria-expanded'), 'false');
  const radios = page.getByRole('radio');
  await radios.first().focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await radios.nth(1).getAttribute('aria-checked'), 'true');
  const radioPaint = await paint();
  await switchCss(false);
  assert.deepEqual(await paint(), radioPaint, 'Actual selected radio paint must match');
  if (coarse) {
    const sizes = await radios.evaluateAll(els => els.map(el => ({
      w: el.getBoundingClientRect().width,
      h: el.getBoundingClientRect().height
    })));
    assert(sizes.every(x => x.w >= 44 && x.h >= 44));
  }
  await switchCss(true);
  const overrides = await page.addStyleTag({
    content: '@layer cs-overrides { .cs-sr-only {position: static !important} #layer-motion {animation-duration: 9s !important; transition-duration: 9s !important} .cs-button {padding-bottom:23px} }'
  });
  assert.equal(await page.locator('#layer-hidden').evaluate(el => getComputedStyle(el).position), 'absolute', 'Single earliest safety layer defeats later important override');
  await settle();
  assert.equal(await button.evaluate(el => getComputedStyle(el).paddingBottom), '23px', 'Documented normal override layer works');
  await page.emulateMedia({
    reducedMotion: 'reduce'
  });
  const durations = await page.locator('#layer-motion').evaluate(el => ({
    a: getComputedStyle(el).animationDuration,
    t: getComputedStyle(el).transitionDuration
  }));
  assert(parseFloat(durations.a) <= .00001 && parseFloat(durations.t) <= .00001, 'Reduced-motion safety survives later important override');
  current = brokenOrder;
  await switchCss(true);
  await assert.rejects(async () => assert.equal(await page.locator('#layer-hidden').evaluate(el => getComputedStyle(el).position), 'absolute'), undefined, 'Reversed important layer order mutation must fail actual protection');
  current = css;
  await overrides.evaluate(el => el.remove());
  await switchCss(true);
  const consumer = await page.addStyleTag({
    content: '.cs-button {padding-bottom:27px}'
  });
  await settle();
  assert.equal(await button.evaluate(el => getComputedStyle(el).paddingBottom), '27px', 'Unlayered consumer normals outrank library layers');
  await consumer.evaluate(el => el.remove());
  results.push({
    coarse,
    forcedColors,
    status: 'PASS',
    mutationRejected: 'important-layer-order',
    actualNativeFocusHoverDisabledPortalSelection: true,
    reducedMotionProtected: true,
    normalOverrideContract: true
  });
}, {
  browserName,
  contextOptions: {
    hasTouch: coarse,
    forcedColors,
    reducedMotion: 'reduce',
    viewport: {
      width: 1280,
      height: 900
    }
  }
});
mkdirSync('test-results/layered-css', {
  recursive: true
});
writeFileSync(`test-results/layered-css/${browserName}-interactions.json`, JSON.stringify({
  status: 'PASS',
  browserName,
  cssSha256: manifest.sha256,
  results
}, null, 2) + '\n');
console.log('PASS ' + browserName + ' layered nativefocus/hover/disabled/openbodypopup/selection/coarse/reducedmotion and actual wrongimportant-order mutation');
