import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { buildLayeredCss } from '../../scripts/lib/layered-css.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium',
  root = new URL('../../', import.meta.url),
  fixtures = JSON.parse(readFileSync(new URL('scripts/fixtures/static-html-reference.json', root), 'utf8')).components;
const {
  css,
  manifest
} = buildLayeredCss(new URL('../../', import.meta.url).pathname);
assert.equal(readFileSync(new URL('styles.layered.css', root), 'utf8'), css);
const results = [];
const keyNames = new Set(['Button', 'TextField', 'Checkbox', 'RadioGroup', 'Switch', 'Toggle', 'SegmentedControl', 'Tabs', 'Menu', 'Popover', 'Tooltip', 'Combobox', 'DatePicker', 'TagInput', 'Drawer', 'AlertDialog', 'Skeleton', 'ProgressBar', 'FileUpload', 'Card', 'DataTable', 'TreeTable', 'Cascader', 'HoverCard']);
async function mount(page, fixture) {
  await page.evaluate(async fixture => {
    const decode = value => {
      if (Array.isArray(value)) return value.map(decode);
      if (!value || typeof value !== 'object') return value;
      if (value.$render !== undefined) return () => decode(value.$render);
      if (value.$element) {
        const e = value.$element;
        return React.createElement(e.component ? CS[e.component] : e.tag, decode(e.props || {}), decode(e.children));
      }
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decode(v)]));
    };
    renderFixture(null);
    let node = React.createElement(CS[fixture.name], decode(fixture.props));
    if (fixture.wrapper) {
      const w = fixture.wrapper;
      node = React.createElement(w.component ? CS[w.component] : w.tag, decode(w.props), node);
    }
    renderFixture(React.createElement(React.Fragment, null, React.createElement('button', {
      id: 'reference-anchor',
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 64,
        height: 24
      }
    }, 'Anchor'), React.createElement('div', {
      'data-layer-fixture': fixture.name
    }, node)));
    // Resolve the newly mounted font faces before waiting: fonts.ready may
    // otherwise describe the previous fixture while a bold/italic face starts
    // loading only at the next layout. Both stylesheet snapshots require the
    // same actual loaded-font state; exact geometry comparisons stay intact.
    document.querySelector('[data-layer-fixture]').getBoundingClientRect();
    // Explicitly load each used face: WebKit's native controls and freshly
    // mounted portal text can defer selecting a face beyond fonts.ready.
    await Promise.all([...document.body.querySelectorAll('*')].map(node => {
      const style = getComputedStyle(node);
      return document.fonts.load(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, node.textContent || ' ');
    }));
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, fixture);
}
async function settleLayeredPage(page) {
  await page.evaluate(async () => {
    const flushPseudoAndTransitions = () => {
      const flushStyle = document.createElement('style');
      flushStyle.textContent = ':root {}';
      document.head.appendChild(flushStyle);
      getComputedStyle(document.documentElement).color;
      flushStyle.remove();
      for (const node of document.body.querySelectorAll('*')) {
        getComputedStyle(node).color;
        getComputedStyle(node, '::before').color;
        getComputedStyle(node, '::after').color;
      }
      for (const animation of document.getAnimations()) {
        if (animation instanceof CSSTransition) animation.finish();else {
          animation.pause();
          animation.currentTime = 0;
        }
      }
    };
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    // Stylesheet replacement creates new FontFace objects even when URLs match.
    await Promise.all([...document.body.querySelectorAll('*')].map(node => {
      const style = getComputedStyle(node);
      return document.fonts.load(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, node.textContent || ' ');
    }));
    await document.fonts.ready;
    flushPseudoAndTransitions();
    window.dispatchEvent(new Event('resize'));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    flushPseudoAndTransitions();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const animation of document.getAnimations()) {
      if (animation instanceof CSSTransition) animation.finish();else {
        animation.pause();
        animation.currentTime = 0;
      }
    }
  });
}
async function sheet(page, layered) {
  await page.evaluate(async layered => {
    const target = '/' + (layered ? 'styles.layered.css' : 'styles.css'),
      previous = document.querySelector('link[rel="stylesheet"]');
    if (new URL(previous.href).pathname === target) return;
    const next = document.createElement('link');
    next.rel = 'stylesheet';
    next.href = target;
    await new Promise((resolve, reject) => {
      next.onload = resolve;
      next.onerror = reject;
      previous.after(next);
    });
    await document.fonts.ready;
    previous.remove();
  }, layered);
  await settleLayeredPage(page);
}
async function establishHoverCardState(page, state) {
  // The authored reference is initially closed. A pointer/focus timer must not
  // turn the stylesheet comparison into a comparison of two interaction states.
  await page.mouse.move(-10, -10);
  const trigger = page.getByRole('button', { name: 'Hover reference', exact: true });
  await trigger.focus(); // Prime the real delayed-open path for the closed guard too.
  if (state === 'closed') await page.locator('#reference-anchor').focus();
  else await page.locator('.cs-hovercard__panel').waitFor({ state: 'visible', timeout: 3000 });
  await assertHoverCardState(page, state);
  await page.evaluate(async () => {
    await Promise.all([...document.body.querySelectorAll('*')].map(node => {
      const style = getComputedStyle(node);
      return document.fonts.load(`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`, node.textContent || ' ');
    }));
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
async function assertHoverCardState(page, state) {
  const actual = await page.evaluate(() => {
    const trigger = [...document.querySelectorAll('button')].find(node => node.textContent === 'Hover reference');
    return { panels: document.querySelectorAll('.cs-hovercard__panel').length, focused: document.activeElement === trigger, hovered: trigger.closest('.cs-hovercard').matches(':hover') };
  });
  assert.deepEqual(actual, { panels: state === 'closed' ? 0 : 1, focused: state !== 'closed', hovered: false }, 'HoverCard stylesheet snapshots use the same explicit interaction state');
}
async function snapshot(page) {
  return page.evaluate(() => {
    const roots = [document.querySelector('[data-layer-fixture]'), ...[...document.body.children].filter(el => el.hasAttribute('data-cs-floating-root') || el.hasAttribute('data-cs-floating-host'))].filter(Boolean);
    const els = [...new Set(roots.flatMap(el => [el, ...el.querySelectorAll('*')]))];
    return els.map(el => ({
      tag: el.localName,
      class: el.getAttribute('class'),
      styles: Object.fromEntries([...getComputedStyle(el)].filter(p => !p.startsWith('--')).map(p => [p, getComputedStyle(el).getPropertyValue(p)])),
      before: Object.fromEntries(['content', 'display', 'width', 'height', 'background-color', 'border-color', 'outline', 'box-shadow'].map(p => [p, getComputedStyle(el, '::before').getPropertyValue(p)])),
      after: Object.fromEntries(['content', 'display', 'width', 'height', 'background-color', 'border-color', 'outline', 'box-shadow'].map(p => [p, getComputedStyle(el, '::after').getPropertyValue(p)]))
    }));
  });
}
for (const config of [{
  name: 'default',
  coarse: false,
  reducedMotion: 'no-preference',
  forcedColors: 'none'
}, {
  name: 'dark',
  theme: 'dark',
  coarse: false,
  reducedMotion: 'no-preference',
  forcedColors: 'none'
}, {
  name: 'compact',
  density: 'compact',
  coarse: false,
  reducedMotion: 'no-preference',
  forcedColors: 'none'
}, {
  name: 'coarse',
  coarse: true,
  reducedMotion: 'no-preference',
  forcedColors: 'none'
}, {
  name: 'reduced',
  coarse: false,
  reducedMotion: 'reduce',
  forcedColors: 'none'
}, {
  name: 'forced',
  coarse: false,
  reducedMotion: 'reduce',
  forcedColors: 'active'
}]) await withBrowserFixture(async page => {
  await page.route('**/styles.layered.css', route => route.fulfill({
    contentType: 'text/css',
    body: css
  }));
  await page.clock.setFixedTime(new Date('2026-10-20T00:00:00Z'));
  await page.evaluate(({
    theme,
    density
  }) => {
    document.documentElement.setAttribute('data-theme', theme || 'light');
    document.documentElement.setAttribute('data-cs-density', density || 'comfortable');
  }, config);
  const context = await page.evaluate(() => ({
    density: getComputedStyle(document.documentElement).getPropertyValue('--cs-density-space-2').trim(),
    coarse: matchMedia('(pointer: coarse)').matches,
    forced: matchMedia('(forced-colors: active)').matches,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches
  }));
  assert.equal(context.density, config.density === 'compact' ? '6px' : '8px', 'Actual density token must resolve to selected canonical scope');
  assert.equal(context.coarse, config.coarse);
  assert.equal(context.forced, config.forcedColors === 'active');
  assert.equal(context.reduced, config.reducedMotion === 'reduce');
  for (const fixture of (config.name === 'default' ? fixtures : fixtures.filter(f => keyNames.has(f.name))).flatMap(f => f.name === 'HoverCard' ? [{ ...f, layeredState: 'closed' }, { ...f, layeredState: 'focus-open' }] : [f])) {
    await sheet(page, false);
    await mount(page, fixture);
    if (fixture.name === 'HoverCard') await establishHoverCardState(page, fixture.layeredState);
    await page.waitForTimeout(40);
    await settleLayeredPage(page);
    if (fixture.name === 'HoverCard') await assertHoverCardState(page, fixture.layeredState);
    const before = await snapshot(page);
    // A pending authored 150ms open timer must not escape the closed-state
    // precondition. The focus-open case separately includes the actual panel.
    if (fixture.name === 'HoverCard' && fixture.layeredState === 'closed') await page.waitForTimeout(175);
    await sheet(page, true);
    if (fixture.name === 'HoverCard') await assertHoverCardState(page, fixture.layeredState);
    const after = await snapshot(page);
    try {
      assert.deepEqual(after, before, `${browserName}/${config.name}/${fixture.name}: layered computed defaults changed`);
    } catch (error) {
      mkdirSync('test-results/layered-css', {
        recursive: true
      });
      writeFileSync(`test-results/layered-css/${browserName}-failure.json`, JSON.stringify({
        config,
        fixture: fixture.name,
        before,
        after
      }, null, 2));
      throw error;
    }
    results.push({
      config: config.name,
      component: fixture.name,
      state: fixture.layeredState || 'declared-default',
      nodes: before.length,
      status: 'PASS'
    });
    if (results.length % 20 === 0) console.log(browserName, config.name, results.length);
  }
}, {
  browserName,
  contextOptions: {
    hasTouch: config.coarse,
    reducedMotion: config.reducedMotion,
    forcedColors: config.forcedColors,
    viewport: {
      width: 1280,
      height: 900
    }
  }
});
mkdirSync('test-results/layered-css', {
  recursive: true
});
writeFileSync(`test-results/layered-css/${browserName}.json`, JSON.stringify({
  status: 'PASS',
  browserName,
  cssSha256: manifest.sha256,
  results,
  scope: 'Actual declared default mounts plus representative coarse/reduced/forced computed-style equivalence; key interaction tests are separate. No manual visual/AT acceptance.'
}, null, 2) + '\n');
console.log('PASS ' + browserName + ' layered CSS ' + results.length + ' component/mode comparisons');
