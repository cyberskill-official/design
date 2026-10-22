import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const inventory = JSON.parse(readFileSync('_audit/remediation/native-root-targets.json', 'utf8'));
await withBrowserFixture(async page => {
  for (const target of inventory.remediatedTargets) {
    const result = await page.evaluate(async ({ name, protected: protectedKeys }) => {
      const h = React.createElement;
      const specifics = {
        Drawer: { open: true, title: 'Root dialog' }, CommandPalette: { open: true },
        Menu: { trigger: h('button', null, 'Menu') }, Popover: { trigger: h('button', null, 'Popover') },
        HoverCard: { trigger: h('button', null, 'Hover') }, Popconfirm: { trigger: h('button', null, 'Confirm') },
        Tooltip: { label: 'Help', children: h('button', { id: 'described-child', 'aria-describedby': 'existing-help' }, 'Tooltip') },
        RadioGroup: { options: [] }, DataTable: { columns: [], rows: [] }, QRCode: { value: 'hello' },
        BackTop: { threshold: -1 }, Tour: { open: true, steps: [{ target: '#tour-anchor', title: 'Tour' }] },
      };
      window.rootEvents = 0; window.injectedRefs = 0;
      const props = { ...specifics[name], className: 'existing-consumer-class' };
      // Establish the same component's owned semantics before attempting overrides.
      renderFixture(h('div', null, h('button', { id: 'tour-anchor' }, 'Anchor'), h(CS[name], props)));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const element = document.querySelector('.existing-consumer-class');
      if (!element) throw new Error(name + ': existing root missing');
      const before = Object.fromEntries(protectedKeys.filter(k => k !== 'style').map(k => [k, element.getAttribute(k.toLowerCase())]));
      const rootProps = { id: 'native-root', 'data-consumer': name, className: 'target-consumer-class',
        style: { outlineColor: 'rgb(1, 2, 3)', position: 'fixed', maxBlockSize: '1px', overflow: 'hidden' },
        onPointerDown: () => rootEvents++, children: 'INJECTED-CHILD', ref: () => injectedRefs++,
        dangerouslySetInnerHTML: { __html: '<b>INJECTED-HTML</b>' } };
      for (const key of protectedKeys) if (key !== 'style') rootProps[key] = 'INJECTED-STATE';
      renderFixture(h('div', null, h('button', { id: 'tour-anchor' }, 'Anchor'), h(CS[name], { ...props, rootProps })));
      const actual = document.getElementById('native-root');
      if (!actual) throw new Error(name + ': rootProps id did not reach target');
      actual.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      return {
        name, tag: actual.tagName.toLowerCase(), data: actual.dataset.consumer,
        classes: [...actual.classList], outline: actual.style.outlineColor,
        before, after: Object.fromEntries(protectedKeys.filter(k => k !== 'style').map(k => [k, actual.getAttribute(k.toLowerCase())])),
        events: rootEvents, refs: injectedRefs, injection: actual.textContent.includes('INJECTED-'),
        position: actual.style.position, maxBlockSize: actual.style.maxBlockSize, overflow: actual.style.overflow,
      };
    }, target);
    assert(target.target.split('/').includes(result.tag), target.name + ': documented native root');
    assert.equal(result.data, target.name);
    assert(result.classes.includes('existing-consumer-class') && result.classes.includes('target-consumer-class'), target.name + ': classes merge');
    assert.equal(result.outline, 'rgb(1, 2, 3)', target.name + ': consumer style reaches root');
    assert.deepEqual(result.after, result.before, target.name + ': owned semantics cannot be replaced');
    assert.equal(result.events, 1, target.name + ': consumer event reaches root');
    assert.equal(result.refs, 0, target.name + ': no implicit ref contract');
    assert.equal(result.injection, false, target.name + ': children and HTML injection bags rejected');
    if (target.name === 'Watermark') assert.equal(result.position, 'relative');
    if (target.name === 'DataGrid') { assert.equal(result.maxBlockSize, '280px'); assert.equal(result.overflow, 'auto'); }
  }
  // Preserve focus/hover state while composing caller callbacks on the same target.
  await page.evaluate(() => {
    window.focusCalls = 0; window.blurCalls = 0;
    renderFixture(React.createElement(CS.Tooltip, { label: 'Composed help', rootProps: {
      id: 'tooltip-root', onFocus: () => focusCalls++, onBlur: () => blurCalls++,
    } }, React.createElement('button', { id: 'tooltip-button', 'aria-describedby': 'prior-help' }, 'Focus me')));
  });
  await page.locator('#tooltip-button').focus();
  await page.getByRole('tooltip').waitFor();
  assert.equal(await page.evaluate(() => focusCalls), 1);
  assert((await page.locator('#tooltip-button').getAttribute('aria-describedby')).startsWith('prior-help '));
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('tooltip').count(), 0);
  await page.locator('#tooltip-button').blur();
  assert.equal(await page.evaluate(() => blurCalls), 1);
  await page.evaluate(() => {
    window.scrollCalls = 0;
    renderFixture(React.createElement(CS.DataGrid, { columns: [{ key: 'label', header: 'Row' }],
      rows: Array.from({ length: 200 }, (_, id) => ({ id, label: 'Row ' + id })), virtual: true,
      rootProps: { id: 'virtual-root', onScroll: () => scrollCalls++ } }));
  });
  await page.locator('#virtual-root').evaluate(el => { el.scrollTop = 1800; el.dispatchEvent(new Event('scroll', { bubbles: true })); });
  await page.waitForFunction(() => document.querySelector('#virtual-root tbody tr[aria-rowindex]')?.getAttribute('aria-rowindex') !== '2');
  assert((await page.evaluate(() => scrollCalls)) >= 1, 'virtualization and consumer scroll callback both run');
  // Alternate roots are covered too: Skeleton lines div versus single span, QR encoding fallback.
  for (const [name, props, tag] of [['Skeleton', { lines: 2 }, 'div'], ['QRCode', { value: 'x'.repeat(2000) }, 'span']]) {
    await page.evaluate(({ name, props }) => renderFixture(React.createElement(CS[name], { ...props, rootProps: { id: 'alternate-root', 'data-alternate': 'yes' } })), { name, props });
    assert.equal(await page.locator('#alternate-root').evaluate(el => el.tagName.toLowerCase()), tag);
    assert.equal(await page.locator('#alternate-root').getAttribute('data-alternate'), 'yes');
  }
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log(`PASS native root targets: ${inventory.remediatedTargets.length} components, owned semantics, class/style/event composition, focus, virtualization and alternate branches`);
