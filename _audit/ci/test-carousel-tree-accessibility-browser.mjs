import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { componentCssReader, readComponentCssGraph } from '../../scripts/lib/component-css-graph.mjs';
import { apca } from '../../scripts/lib/oklch.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const modes = JSON.parse(readFileSync('tokens/modes/index.json')).modes;
const rows = [];
const paths = ['base/controls.css', 'base/a11y.css', 'components/data/Carousel.jsx', 'components/data/Tree.jsx', 'styles.css', '_ds_bundle.js', '_vendor/react/react.production.min.js', '_vendor/react/react-dom.production.min.js', '_audit/ci/lib/browser-fixture.mjs', '_audit/vendor/axe.min.js', '_audit/ci/test-carousel-tree-accessibility-browser.mjs'];
const cssReader = componentCssReader(process.cwd());
readComponentCssGraph(cssReader);
paths.push(...cssReader.inputs.keys(), 'tokens/modes/index.json', 'scripts/lib/oklch.mjs', 'scripts/lib/component-css-graph.mjs', 'package-lock.json');
const inputHashes = Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')]));

const luminance = rgb => rgb.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
const hex = rgb => '#' + rgb.slice(0, 3).map(value => value.toString(16).padStart(2, '0')).join('');
async function mount(page) {
  await page.evaluate(() => {
    document.head.insertAdjacentHTML('beforeend', '<style>*{transition:none!important;animation:none!important}</style>');
    window.treeSelections = [];
    const h = React.createElement;
    function TreeFixture() {
      const [selected, setSelected] = React.useState('a');
      return h(CS.Tree, { nodes: [{ key: 'a', label: 'Alpha' }, { key: 'b', label: 'Beta' }], selected,
        onSelect: value => { treeSelections.push(value); setSelected(value); }, 'aria-label': 'Workspace tree' });
    }
    renderFixture(h('main', { id: 'scenario-stage', style: { background: 'var(--cs-color-surface-page)', padding: 40, width: 400 } },
      h(CS.Carousel, { label: 'Examples', lang: 'en' }, h('p', null, 'First slide'), h('p', null, 'Second slide'), h('p', null, 'Third slide')),
      h(TreeFixture)));
  });
  await page.evaluate(() => document.fonts.ready);
}
for (const touch of [false, true]) await withBrowserFixture(async page => {
  await mount(page);
  assert.equal(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), touch);
  const dots = page.locator('.cs-carousel__dots button');
  const geometry = await dots.evaluateAll(nodes => nodes.map(node => {
    const box = node.getBoundingClientRect(), pseudo = getComputedStyle(node, '::before');
    return { x: box.x, y: box.y, width: box.width, height: box.height, markWidth: pseudo.width, markHeight: pseudo.height, pseudoContent: pseudo.content };
  }));
  for (const item of geometry) {
    assert(item.width >= (touch ? 44 : 24) && item.height >= (touch ? 44 : 24));
    if (!touch) assert.deepEqual([item.markWidth, item.markHeight], ['9px', '9px']);
  }
  for (let index = 1; index < geometry.length; index++) assert(geometry[index].x - geometry[index - 1].x >= geometry[index - 1].width, 'Real target rectangles must not overlap');
  for (let index = 0; index < geometry.length; index++) for (const [dx, dy] of [[0, 0], [-10, 0], [10, 0], [0, -10], [0, 10]]) {
    const box = geometry[index], x = box.x + box.width / 2 + dx, y = box.y + box.height / 2 + dy;
    assert.equal(await page.evaluate(({ x, y, index }) => document.elementFromPoint(x, y) === document.querySelectorAll('.cs-carousel__dots button')[index], { x, y, index }), true);
    if (touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
    await page.waitForFunction(index => document.querySelectorAll('.cs-carousel__dots button')[index].getAttribute('aria-current') === 'true', index);
  }
  await dots.first().focus();
  await page.keyboard.press('Space');
  assert.equal(await dots.first().getAttribute('aria-current'), 'true');
  await page.locator('.cs-tree__label').nth(1).click();
  assert.deepEqual(await page.evaluate(() => treeSelections), ['b']);
  assert.equal(await page.locator('.cs-tree__row.is-selected .cs-tree__label').textContent(), 'Beta');
  await page.addScriptTag({ url: '/_audit/vendor/axe.min.js' });
  const scan = await page.evaluate(() => axe.run(document.getElementById('scenario-stage'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
  assert.deepEqual(scan.violations, [], 'All applicable WCAG2/2.1/2.2 rules must pass');
  rows.push({ touch, geometry, axe: { violations: scan.violations, incomplete: scan.incomplete } });
  await page.emulateMedia({ forcedColors: 'active' });
  const forced = await dots.evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node);
    return { selected: node.getAttribute('aria-current') === 'true', border: style.borderTopStyle, width: style.borderTopWidth, color: style.borderTopColor, background: style.backgroundColor };
  }));
  for (const value of forced) {
    assert.equal(value.border, value.selected ? 'double' : 'solid');
    assert.equal(value.width, value.selected ? '3px' : '1px');
    assert.notEqual(value.color, value.background, 'System-color dot boundary must remain visible');
  }
  await page.emulateMedia({ forcedColors: 'none' });
  await page.evaluate(() => { document.getElementById('scenario-stage').style.width = '50px'; });
  const wrapped = await dots.evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom }; }));
  assert(wrapped.some(value => value.y > wrapped[0].y), 'Narrow fixture must actually wrap dot targets');
  for (let i = 0; i < wrapped.length; i++) for (let j = i + 1; j < wrapped.length; j++) {
    const a = wrapped[i], b = wrapped[j];
    assert(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y, 'Wrapped targets must remain separated');
  }
  await dots.first().focus();
  // macOS WebKit follows the platform preference: Option-Tab includes buttons.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  const focus = await dots.nth(1).evaluate(node => ({ focused: node === document.activeElement, visible: node.matches(':focus-visible'), outline: getComputedStyle(node).outlineStyle }));
  mkdirSync('test-results/scenario-fixes', { recursive: true });
  writeFileSync(`test-results/scenario-fixes/${browserName}-focus.json`, JSON.stringify({ touch, focus, active: await page.evaluate(() => document.activeElement.outerHTML) }, null, 2));
  assert(focus.focused && focus.visible && focus.outline !== 'none', 'Keyboard focus remains visible');
  await page.evaluate(() => { document.getElementById('scenario-stage').style.width = '400px'; });
  rows.push({ forcedColors: forced, narrowTargets: wrapped, keyboardFocus: focus });

  if (!touch) {
    const measured = [];
    for (const colorScheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme });
      const values = await page.evaluate(modes => {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const pixel = value => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = value; ctx.fillRect(0, 0, 1, 1); return Array.from(ctx.getImageData(0, 0, 1, 1).data); };
        return modes.map(({ id, axes }) => {
          const root = document.documentElement;
          for (const [key, value] of Object.entries({ theme: axes.theme, csElement: axes.element, csVariant: axes.variant, csDensity: axes.density, csContrast: axes.contrast, csStyle: axes.style })) {
            if (value === null) delete root.dataset[key]; else root.dataset[key] = value;
          }
          const label = document.querySelector('.cs-tree__row.is-selected .cs-tree__label');
          const foreground = pixel(getComputedStyle(label).color);
          ctx.clearRect(0, 0, 1, 1);
          for (const node of [document.getElementById('scenario-stage'), label.closest('.cs-tree__row'), label]) {
            if (getComputedStyle(node).opacity !== '1') throw Error('Unexpected fixture opacity');
            ctx.fillStyle = getComputedStyle(node).backgroundColor; ctx.fillRect(0, 0, 1, 1);
          }
          return { id, foreground, background: Array.from(ctx.getImageData(0, 0, 1, 1).data) };
        });
      }, modes.filter(mode => mode.axes.colorScheme === colorScheme));
      for (const value of values) {
        assert.equal(value.foreground[3], 255); assert.equal(value.background[3], 255);
        const wcag = ratio(value.foreground, value.background), lc = apca(hex(value.foreground), hex(value.background));
        mkdirSync('test-results/scenario-fixes', { recursive: true });
        writeFileSync(`test-results/scenario-fixes/${browserName}-contrast-progress.json`, JSON.stringify({ current: { ...value, wcag, apca: lc }, measured }, null, 2));
        assert(wcag >= 4.5, `${value.id} selected Tree text ratio ${wcag}`);
        assert(lc >= 75, `${value.id} selected Tree text APCA ${lc}`);
        measured.push({ ...value, wcag, apca: lc });
      }
    }
    assert.equal(measured.length, 256);
    rows.push({ selectedTreeModes: measured });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.evaluate(() => { const root = document.documentElement; root.dataset.theme = 'light'; for (const key of ['csElement', 'csVariant', 'csContrast', 'csDensity']) delete root.dataset[key]; });
    const smallTargets = await page.addStyleTag({ content: '.cs-carousel__dots button{inline-size:9px!important;block-size:9px!important;flex-basis:9px!important}' });
    const negative = await page.evaluate(() => axe.run(document.getElementById('scenario-stage'), { runOnly: { type: 'rule', values: ['target-size'] } }));
    assert(negative.violations.some(rule => rule.id === 'target-size'), 'Reinstating old fine-pointer geometry must reproduce the target-size violation');
    await smallTargets.evaluate(node => node.remove());
    const oldColor = await page.addStyleTag({ content: '.cs-tree__row.is-selected .cs-tree__label{color:var(--cs-accent-strong)}' });
    const contrastNegative = await page.evaluate(() => axe.run(document.getElementById('scenario-stage'), { runOnly: { type: 'rule', values: ['color-contrast'] } }));
    assert(contrastNegative.violations.some(rule => rule.id === 'color-contrast'), 'Restoring the old selected label color must reproduce the contrast failure');
    await oldColor.evaluate(node => node.remove());
    rows.push({ semanticNegatives: ['old fine-pointer target geometry', 'old selected Tree accent text'] });
  }
}, { browserName, contextOptions: { hasTouch: touch, viewport: { width: 800, height: 700 } } });
mkdirSync('test-results/scenario-fixes', { recursive: true });
assert.deepEqual(Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')])), inputHashes, 'Tested inputs changed during the regression');
writeFileSync(`test-results/scenario-fixes/${browserName}.json`, JSON.stringify({ status: 'PASS', browserName, inputHashes, rows }, null, 2) + '\n');
console.log(`PASS ${browserName}: native Carousel24/44px separated targets,9px fine marks, pointer/keyboard selection,256 Tree contrast modes and two reproduced regression negatives`);
