import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page => {
  for (const name of ['Popover', 'Menu', 'Combobox', 'Drawer', 'DatePicker', 'ColorPicker', 'TreeSelect', 'Popconfirm']) {
    await page.evaluate(name => {
      renderFixture(null);
      window.overlayEvents = [];
      const h = React.createElement;
      function App() {
        const [open, setOpen] = React.useState(false);
        const [child, setChild] = React.useState(false);
        const trigger = h('button', { id: 'child-trigger', onClick: () => setChild(true) }, 'Child');
        const contents = ['DatePicker', 'ColorPicker', 'TreeSelect'].includes(name) ? h(CS[name], { label: 'Field' }) : name === 'Combobox' ? h(CS.Combobox, { label: 'Pick', options: [{ value: 'a', label: 'Alpha' }] })
          : name === 'Drawer' ? h(React.Fragment, null, trigger, h(CS.Drawer, { open: child, title: 'Inner', onClose: () => { overlayEvents.push('child'); setChild(false); } }, h('button', { id: 'inner-last' }, 'Last')))
          : h(CS[name], { trigger: h('button', { id: 'child-trigger' }, 'Child'), onOpenChange: v => { if (!v) overlayEvents.push('child'); } }, name === 'Menu' ? h(CS.MenuItem, null, 'Action') : h('button', null, 'Action'));
        return h(CS.OverlayProvider, null, h('button', { id: 'outer-trigger', onClick: () => setOpen(true) }, 'Outer'), h(CS.Dialog, { open, title: 'Outer dialog', onClose: () => { overlayEvents.push('outer'); setOpen(false); } }, contents, h('button', { id: 'outer-last' }, 'Outer last')));
      }
      renderFixture(h(App));
    }, name);
    // Exercise keyboard restoration with keyboard-opened layers. Pointer clicks
    // in WebKit do not establish the same focused opener as other engines.
    await page.locator('#outer-trigger').focus();
    await page.locator('#outer-trigger').press('Enter');
    if (name === 'Combobox') await page.getByRole('combobox').focus();
    else if (['DatePicker', 'ColorPicker', 'TreeSelect'].includes(name)) await page.locator('.cs-datepicker__field, .cs-colorpicker__field, .cs-treeselect__field').click();
    else { await page.locator('#child-trigger').focus(); await page.locator('#child-trigger').press('Enter'); }
    if (name === 'Drawer') {
      await page.locator('#inner-last').focus();
      await page.keyboard.press('Tab');
      assert.ok(await page.evaluate(() => !!document.activeElement.closest('.cs-drawer')), 'top modal owns Tab');
    }
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog', { name: 'Outer dialog', exact: true }).count(), 1, `${name}: parent survives first Escape`);
    if (name === 'Combobox') assert.equal(await page.getByRole('combobox').getAttribute('aria-expanded'), 'false');
    else if (['DatePicker', 'ColorPicker', 'TreeSelect'].includes(name)) assert.equal(await page.locator('[aria-expanded=true]').count(), 0, `${name}: closed`);
    else assert.equal(await page.locator('#child-trigger').evaluate(el => el === document.activeElement), true, `${name}: restore child trigger`);
    await page.locator('#outer-last').focus();
    await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => !!document.activeElement.closest('.cs-dialog')), 'parent trap resumes');
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 0);
    assert.equal(await page.locator('#outer-trigger').evaluate(el => el === document.activeElement), true, 'restore opener');
    assert.equal(await page.evaluate(() => document.body.style.overflow), '', 'last modal releases scroll');
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => overlayEvents.filter(x => x === 'outer').length), 1, 'closed layers no longer handle Escape');
  }
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log('PASS overlay browser: child-first Escape, trigger restoration, nested modal/parent Tab and scroll cleanup');
