import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const cases = [
  ['Cascader', '.cs-cascader button', '.cs-cascader__pop'],
  ['NavigationMenu', '.cs-navmenu button', '.cs-navmenu__panel'],
  ['Menubar', '.cs-menubar__top', '.cs-menubar [role=menu]'],
  ['Toolbar', '[aria-haspopup=menu]', '.cs-toolbar [role=menu]'],
  ['Mentions', '.cs-mentions textarea', '.cs-mentions__pop'],
  ['HoverCard', '#hover-trigger', '.cs-hovercard__panel'],
  ['ContextMenu', '#context-trigger', '.cs-ctxmenu-zone [role=menu]'],
  ['Tour', '#tour-trigger', '.cs-tour__pop'],
  ['Image', '.cs-image.is-zoomable', '.cs-image__zoom'],
  ['HotKeys', '#key-trigger', '.cs-hotkeys__sheet'],
  ['FloatingActionButton', '.cs-fab__main', '.cs-fab__dial'],
  ['AIDisclosureBadge', '.cs-ai-disclosure__badge', '.cs-ai-disclosure__panel'],
  ['InlineEdit', '.cs-inline-edit__view', '.cs-inline-edit input'],
];
await withBrowserFixture(async page => {
  for (const [name, trigger, surface] of cases) {
    await page.evaluate(name => {
      renderFixture(null);
      window.familyChanges = [];
      const h = React.createElement;
      function App() {
        const [outer, setOuter] = React.useState(false);
        const [tour, setTour] = React.useState(false);
        const children = {
          Cascader: h(CS.Cascader, { nodes: [{ key: 'a', label: 'Alpha' }] }),
          NavigationMenu: h(CS.NavigationMenu, { items: [{ label: 'Navigate', panel: [{ label: 'Page', href: '#page' }] }] }),
          Menubar: h(CS.Menubar, { menus: [{ label: 'File', items: [{ label: 'Save' }] }] }),
          Toolbar: h(CS.Toolbar, { overflowAfter: 1, items: [{ label: 'First' }, { label: 'More' }] }),
          Mentions: h(CS.Mentions, { users: ['anna', 'bob'] }),
          HoverCard: h(CS.HoverCard, { openDelay: 0, trigger: h('button', { id: 'hover-trigger' }, 'Hover') }, h('button', null, 'Inside')),
          ContextMenu: h(CS.ContextMenu, { items: [{ label: 'Copy' }] }, h('button', { id: 'context-trigger' }, 'Context')),
          Tour: h(React.Fragment, null, h('button', { id: 'tour-trigger', onClick: () => setTour(true) }, 'Tour'), h(CS.Tour, { open: tour, onClose: () => setTour(false), steps: [{ target: '#tour-trigger', title: 'Tour step' }] })),
          Image: h(CS.Image, { preview: true, alt: 'Pixel', src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', style: { width: 50, height: 50 } }),
          HotKeys: h(CS.HotKeys, null, h('button', { id: 'key-trigger' }, 'Shortcuts')),
          FloatingActionButton: h(CS.FloatingActionButton, { position: 'static', label: 'Actions', actions: [{ label: 'Action', icon: '+' }] }),
          AIDisclosureBadge: h(CS.AIDisclosureBadge),
          InlineEdit: h(CS.InlineEdit, { defaultValue: 'original', onChange: value => familyChanges.push(value) }),
        };
        return h(React.Fragment, null, h('button', { id: 'outer', onClick: () => setOuter(true) }, 'Open'), h(CS.Dialog, { open: outer, title: 'Parent', onClose: () => setOuter(false) }, children[name]));
      }
      renderFixture(h(App));
    }, name);
    await page.locator('#outer').click();
    const target = page.locator(trigger);
    if (name === 'Mentions') await target.fill('@a');
    else if (name === 'HoverCard') await target.focus();
    else if (name === 'ContextMenu') { await target.focus(); await target.click({ button: 'right' }); }
    else if (name === 'HotKeys') { await target.focus(); await page.keyboard.press('?'); }
    else await target.click();
    await page.locator(surface).waitFor();
    if (name === 'InlineEdit') await page.locator(surface).fill('cancelled');
    await page.keyboard.press('Escape');
    await page.locator(surface).waitFor({ state: 'detached' });
    assert.equal(await page.getByRole('dialog', { name: 'Parent', exact: true }).count(), 1, `${name}: child Escape preserves parent`);
    if (name === 'InlineEdit') {
      assert.ok((await target.textContent()).includes('original'));
      assert.deepEqual(await page.evaluate(() => familyChanges), [], 'cancel does not commit');
    }
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog', { name: 'Parent', exact: true }).count(), 0, `${name}: next Escape closes parent`);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '', `${name}: scroll unlocked`);
  }
}, { browserName: process.env.CS_TEST_BROWSER || 'chromium' });
console.log(`PASS overlay family matrix (${process.env.CS_TEST_BROWSER || 'chromium'}): 13 remaining nested dismissal contracts and InlineEdit cancellation`);
