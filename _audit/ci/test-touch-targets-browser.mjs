import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

await withBrowserFixture(async page => {
  assert.equal(await page.evaluate(() => innerWidth), 390);
  assert.equal(await page.evaluate(() => matchMedia('(pointer:coarse)').matches), true);
  await page.evaluate(() => {
    const h = React.createElement;
    window.touchEvents = [];
    renderFixture(h('main', { style: { padding: 12, display: 'grid', gap: 16 } },
      h(CS.SearchField, { value: 'query', onClear: () => touchEvents.push('clear') }),
      h(CS.Breadcrumb, { items: [{ label: 'A', href: '#a' }, { label: 'Current' }] }),
      h(CS.SegmentedControl, { options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], value: 'a', onChange: v => touchEvents.push(v) }),
      h(CS.AIDisclosureBadge, { label: 'AI' }),
      h(CS.Slider, { defaultValue: 10, onChange: () => touchEvents.push('slider') }),
      h(CS.Checkbox, { label: 'A', onChange: () => touchEvents.push('check') }),
      h(CS.Radio, { label: 'A', name: 'choice', onChange: () => touchEvents.push('radio') })));
  });
  const targets = ['.cs-search__clear', '.cs-breadcrumb a', '.cs-segmented button', '.cs-ai-disclosure__badge', '.cs-slider', '.cs-check', '.cs-radio'];
  for (const density of ['comfortable', 'compact']) {
    await page.evaluate(d => document.querySelector('main').setAttribute('data-cs-density', d), density);
    for (const selector of targets) {
      const boxes = await page.locator(selector).evaluateAll(nodes => nodes.map(node => {
        const r = node.getBoundingClientRect(); return { width: r.width, height: r.height };
      }));
      assert.ok(boxes.length, selector);
      for (const box of boxes) assert.ok(box.width >= 44 && box.height >= 44, `${density} ${selector}: ${JSON.stringify(box)}`);
    }
  }
  // Tap near the edges of the expanded regions, not just the glyph/text center.
  for (const selector of ['.cs-search__clear', '.cs-segmented button', '.cs-ai-disclosure__badge', '.cs-check', '.cs-radio']) {
    const r = await page.locator(selector).first().boundingBox();
    await page.touchscreen.tap(r.x + 3, r.y + r.height / 2);
  }
  assert.deepEqual(await page.evaluate(() => touchEvents), ['clear', 'a', 'check', 'radio']);
  assert.equal(await page.locator('.cs-ai-disclosure__badge').getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.cs-check input').isChecked(), true);
  assert.equal(await page.locator('.cs-radio input').isChecked(), true);
  await page.locator('.cs-ai-disclosure__badge').tap();
  assert.equal(await page.locator('.cs-ai-disclosure__badge').getAttribute('aria-expanded'), 'false');
  const slider = await page.locator('.cs-slider').boundingBox();
  await page.touchscreen.tap(slider.x + slider.width * .8, slider.y + slider.height / 2);
  assert.ok(Number(await page.locator('.cs-slider').inputValue()) > 50, 'Native range remains interactive');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.setViewportSize({ width: 320, height: 844 });
  assert.equal(await page.evaluate(() => innerWidth), 320);
  await page.evaluate(() => {
    const h = React.createElement;
    renderFixture(h('main', { style: { padding: 12, display: 'grid', gap: 16 } },
      h(CS.Pagination, { page: 2, pageCount: 5 }), h(CS.InputOTP, { length: 6 })));
  });
  for (const selector of ['.cs-pagination button', '.cs-otp input']) {
    const boxes = await page.locator(selector).evaluateAll(nodes => nodes.map(n => ({ width: n.getBoundingClientRect().width, height: n.getBoundingClientRect().height })));
    assert.ok(boxes.length, selector);
    assert.ok(boxes.every(b => b.width >= 44 && b.height >= 44), `320px ${selector}: ${JSON.stringify(boxes)}`);
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);

  await page.evaluate(()=>{window.treePicks=[];renderFixture(React.createElement(CS.Tree,{'aria-label':'Touch tree',onSelect:key=>treePicks.push(key),nodes:[{key:'p',label:'P',children:[{key:'c',label:'C'}]}]}))});
  for(const density of ['comfortable','compact']) {
    await page.locator('[role="tree"]').evaluate((el,d)=>el.setAttribute('data-cs-density',d),density);
    for(const selector of ['.cs-tree__twist','.cs-tree__label']) {
      const target=page.locator(selector).first(),box=await target.boundingBox();
      assert.ok(box.width>=44&&box.height>=44,`${density} ${selector}: ${JSON.stringify(box)}`);
    }
  }
  const twist=await page.locator('.cs-tree__twist').first().boundingBox();
  await page.touchscreen.tap(twist.x+2,twist.y+2);
  assert.equal(await page.getByRole('treeitem',{name:'C',exact:true}).count(),1);
  assert.deepEqual(await page.evaluate(()=>treePicks),[]);
  const label=await page.locator('.cs-tree__label').first().boundingBox();
  await page.touchscreen.tap(label.x+2,label.y+2);
  await page.waitForFunction(()=>treePicks.length===1);
  assert.deepEqual(await page.evaluate(()=>treePicks),['p']);
  assert.equal(await page.getByRole('treeitem',{name:'C',exact:true}).count(),0);

}, { browserName: process.env.CS_TEST_BROWSER || 'chromium', contextOptions: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } });
console.log('PASS coarse-pointer targets: 44px in both densities, real edge taps, label activation, native range and mobile overflow');
