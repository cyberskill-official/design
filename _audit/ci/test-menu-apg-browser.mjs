import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  async function mount({ nested = false, textTrigger = false } = {}) {
    await page.evaluate(({ nested, textTrigger }) => {
      const h = React.createElement;
      window.menuSelections = [];
      const scene = h(React.Fragment, null,
        h('button', { id: 'before-menu' }, 'Before'),
        h(CS.Menu, { lang: 'en', trigger: textTrigger === 'component' ? h(CS.Button, { id: 'menu-button' }, 'Actions') : textTrigger ? 'Actions' : h('button', { id: 'menu-button' }, 'Actions') },
          h(CS.MenuItem, { onClick: () => menuSelections.push('Alpha') }, 'Alpha'),
          h(CS.MenuItem, { disabled: true }, 'Unavailable'),
          h(CS.MenuItem, { onClick: () => menuSelections.push('Beta') }, 'Beta'),
          h(CS.MenuItem, { onClick: () => menuSelections.push('Bravo') }, 'Bravo')),
        h('input', { id: 'after-menu', 'aria-label': 'After' }));
      renderFixture(nested ? h(CS.Dialog, { open: true, title: 'Menu parent', onClose: () => {} }, scene) : scene);
    }, { nested, textTrigger });
  }
  for (const nested of [false, true]) for (const textTrigger of [false, true, 'component']) {
    await mount({ nested, textTrigger });
    const trigger = page.getByRole('button', { name: 'Actions', exact: true });
    await trigger.focus(); await page.keyboard.press('ArrowUp');
    await page.waitForFunction(() => document.activeElement?.textContent === 'Bravo');
    assert.equal(await page.locator('[role="menuitem"][tabindex="0"]').count(), 1);
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Alpha', 'Down wraps');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Beta', 'Disabled items are skipped');
    await page.keyboard.press('Home'); await page.keyboard.press('b');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Beta');
    await page.keyboard.press('b');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Bravo');
    await page.keyboard.press(tab);
    assert.equal(await page.getByRole('menu').count(), 0);
    assert.equal(await page.locator('#after-menu').evaluate(el => el === document.activeElement), true, JSON.stringify({browserName,nested,textTrigger,active:await page.evaluate(()=>[document.activeElement?.id,document.activeElement?.textContent])}));
    await trigger.focus(); await page.keyboard.press('ArrowDown');
    await page.waitForFunction(() => document.activeElement?.textContent === 'Alpha');
    await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Shift+Tab' : 'Shift+Tab');
    assert.equal(await page.getByRole('menu').count(), 0);
    assert.equal(await page.locator('#before-menu').evaluate(el => el === document.activeElement), true);
    await trigger.focus(); await page.keyboard.press('ArrowDown');
    await page.waitForFunction(() => document.activeElement?.textContent === 'Alpha');
    await page.keyboard.press('Enter');
    assert.deepEqual(await page.evaluate(() => menuSelections), ['Alpha']);
    assert.equal(await page.getByRole('menu').count(), 0);
    await trigger.focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Escape');
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  }
  await page.evaluate(() => {
    function ControlledScene() {
      const [open, onOpenChange] = React.useState(true);
      return React.createElement(React.Fragment, null,
        React.createElement(CS.Menu, { open, onOpenChange, trigger: React.createElement(CS.Button, null, 'Initially open') }, React.createElement(CS.MenuItem, null, 'Alpha')),
        React.createElement('input', { id: 'controlled-after', 'aria-label': 'Controlled after' }));
    }
    renderFixture(React.createElement(ControlledScene));
  });
  await page.waitForFunction(() => document.activeElement?.textContent === 'Alpha');
  await page.keyboard.press(tab);
  assert.equal(await page.getByRole('menu').count(), 0);
  assert.equal(await page.locator('#controlled-after').evaluate(el => el === document.activeElement), true, 'Controlled initial open functional trigger has a DOM fallback');
  await page.evaluate(() => renderFixture(React.createElement(React.Fragment, null,
    React.createElement(CS.Menu, { trigger: 'Disabled boundary' }, React.createElement(CS.MenuItem, null, 'Alpha')),
    React.createElement('fieldset', { disabled: true }, React.createElement('button', { id: 'effectively-disabled' }, 'Disabled by fieldset')),
    React.createElement('button', { id: 'enabled-after-fieldset' }, 'Enabled after fieldset'))));
  await page.getByRole('button', { name: 'Disabled boundary' }).focus(); await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.textContent === 'Alpha');
  await page.keyboard.press(tab);
  assert.equal(await page.getByRole('menu').count(), 0);
  assert.equal(await page.locator('#enabled-after-fieldset').evaluate(el => el === document.activeElement), true, 'Tab skips effective disabled state inherited from fieldset');
  await page.evaluate(() => renderFixture(React.createElement(React.Fragment, null,
    React.createElement('button', { id: 'positive-two', tabIndex: 2 }, 'Second in tab order'),
    React.createElement(CS.Menu, { trigger: React.createElement('button', { tabIndex: 1 }, 'Positive order') }, React.createElement(CS.MenuItem, null, 'Alpha')),
    React.createElement('button', { id: 'positive-three', tabIndex: 3 }, 'Third in tab order'))));
  await page.getByRole('button', { name: 'Positive order' }).focus(); await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.textContent === 'Alpha');
  await page.keyboard.press(tab);
  assert.equal(await page.locator('#positive-two').evaluate(el => el === document.activeElement), true, 'Tab respects positive tabindex order over DOM order');

  await page.evaluate(() => renderFixture(React.createElement(React.Fragment, null,
    React.createElement(CS.Menu, { trigger: 'Radio boundary' }, React.createElement(CS.MenuItem, null, 'Alpha')),
    React.createElement('input', { type: 'radio', name: 'mode', id: 'unchecked-radio' }),
    React.createElement('input', { type: 'radio', name: 'mode', id: 'checked-radio', defaultChecked: true }),
    React.createElement('button', null, 'After radios'))));
  await page.getByRole('button', { name: 'Radio boundary' }).focus(); await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => document.activeElement?.textContent === 'Alpha');
  await page.keyboard.press(tab);
  assert.equal(await page.locator('#checked-radio').evaluate(el => el === document.activeElement), true, 'Checked radio represents its native sequential focus group');
  await page.evaluate(() => renderFixture(React.createElement(CS.Menu, { trigger: React.createElement('button', { onKeyDown: event => event.preventDefault() }, 'Cancelled') }, React.createElement(CS.MenuItem, null, 'Item'))));
  await page.getByRole('button', { name: 'Cancelled' }).focus(); await page.keyboard.press('ArrowDown');
  assert.equal(await page.getByRole('menu').count(), 0, 'Caller key cancellation is respected');
  console.log(`PASS APG Menu (${browserName}): first/last opening, wrapping, disabled skipping, typeahead, roving focus, forward/reverse Tab, activation, Escape, custom/fallback trigger, modal parent and caller cancellation`);
}, { browserName });
