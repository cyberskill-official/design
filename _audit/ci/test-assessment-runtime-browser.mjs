import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

for (const browserName of ['chromium', 'firefox', 'webkit']) {
  await withBrowserFixture(async page => {
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.evaluate(() => {
      window.drawNumber = props => renderFixture(React.createElement(CS.NumberField, { key: 'default', lang: 'en', ...props }));
      drawNumber({ defaultValue: 5 });
    });
    assert.equal(await page.getByRole('spinbutton').inputValue(), '5');
    await page.getByRole('spinbutton').fill('8');
    await page.evaluate(() => drawNumber({ defaultValue: 10 }));
    assert.equal(await page.getByRole('spinbutton').inputValue(), '8', 'New defaults must not reset uncontrolled edits');
    await page.evaluate(() => drawNumber({ defaultValue: 5, value: 12 }));
    assert.equal(await page.getByRole('spinbutton').inputValue(), '12', 'Controlled value takes precedence');
    assert(!errors.some(s => /both value and defaultValue|uncontrolled.*controlled/i.test(s)), errors.join('\n'));

    await page.evaluate(() => renderFixture(React.createElement(CS.DatePicker, { value: new Date(2024, 1, 29), lang: 'en' })));
    await page.locator('.cs-datepicker__field').click();
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.day), '29');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.cs-datepicker__pop').count(), 0);
    assert.equal(await page.evaluate(() => document.activeElement?.className), 'cs-datepicker__field');

    await page.clock.setFixedTime(new Date('2026-10-10T12:00:00Z'));
    await page.evaluate(() => renderFixture(React.createElement(CS.DatePicker, { value: new Date(2026, 9, 20), lang: 'en' })));
    await page.locator('.cs-datepicker__field').click();
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.day), '20', 'Selected day takes priority over earlier today in the same month');
    await page.keyboard.press('Escape');

    await page.evaluate(() => renderFixture(React.createElement(CS.Calendar, { value: new Date(2024, 1, 29), lang: 'vi' })));
    assert.equal(await page.getByRole('grid').count(), 1);
    assert.equal(await page.locator('.cs-cal__grid button[tabindex="0"]').count(), 1);
    assert.equal(await page.getByRole('gridcell', { selected: true }).count(), 1);
    const selected = page.locator('.cs-cal__grid button[aria-pressed="true"]');
    assert.match(await selected.getAttribute('aria-label'), /29.*2.*2024/);
    await selected.focus();
    await page.keyboard.press('ArrowRight');
    assert.match(await page.locator('.cs-cal__head b').textContent(), /3.*2024/);
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.day), '1');
    await page.keyboard.press('PageUp');
    assert.match(await page.locator('.cs-cal__head b').textContent(), /2.*2024/);
    await page.keyboard.press('End');
    await page.keyboard.press('PageUp');
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.day), '29');
    await page.keyboard.press('PageDown');
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.day), '29');
    await page.keyboard.press('Shift+PageDown');
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.day), '28', 'Leap day clamps in the next year');

    await page.evaluate(() => {
      window.drawControlledCalendar = day => renderFixture(React.createElement(CS.Calendar, { value: new Date(2026, 9, day), lang: 'en' }));
      drawControlledCalendar(5);
    });
    await page.locator('.cs-cal__grid button[data-day="5"]').focus();
    await page.evaluate(() => drawControlledCalendar(25));
    await page.waitForFunction(() => document.querySelector('.cs-cal__grid button[data-day="25"]')?.tabIndex === 0);
    assert.equal(await page.locator('.cs-cal__grid button[tabindex="0"]').getAttribute('data-day'), '25');
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.day), '5', 'External selected-day updates do not steal current focus');

    await page.evaluate(() => renderFixture(React.createElement(CS.DataGrid, {
      columns: [{ key: 'name', header: 'Name' }], rows: Array.from({ length: 200 }, (_, id) => ({ id, name: 'Row ' + id })), virtual: true,
    })));
    assert.equal(await page.locator('table').getAttribute('aria-rowcount'), '201');
    assert.equal(await page.locator('thead tr').getAttribute('aria-rowindex'), '1');
    await page.locator('.cs-datagrid').evaluate(el => { el.scrollTop = 2500; el.dispatchEvent(new Event('scroll', { bubbles: true })); });
    await page.waitForFunction(() => Number(document.querySelector('tbody tr[aria-rowindex]')?.getAttribute('aria-rowindex')) > 2);
    const row = page.locator('tbody tr[aria-rowindex]').first();
    const index = Number(await row.getAttribute('aria-rowindex'));
    assert.equal(await row.locator('td').textContent(), 'Row ' + (index - 2));

    await page.evaluate(() => renderFixture(React.createElement(CS.Popover, { trigger: 'Open', open: true }, 'Details body')));
    assert.equal(await page.getByRole('dialog', { name: 'Details', exact: true }).count(), 1);
    await page.evaluate(() => renderFixture(React.createElement(CS.Menubar, { menus: [{ label: 'File', items: [{ label: 'New' }, { label: 'Open' }] }] })));
    assert.equal(await page.getByRole('menubar', { name: 'Application menu' }).count(), 1);
    await page.getByRole('menuitem', { name: 'File', exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'New');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Space');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'New');
    await page.keyboard.press('Escape');

    await page.evaluate(() => renderFixture(React.createElement(CS.NavigationMenu, { items: [{ label: 'Products', panel: [{ label: 'Practice', href: '#practice' }] }] })));
    assert.equal(await page.getByRole('button', { name: 'Products' }).getAttribute('aria-haspopup'), null);
    await page.getByRole('button', { name: 'Products' }).click();
    assert.equal(await page.getByRole('link', { name: 'Practice' }).count(), 1);

    for (const lang of ['en', 'vi']) {
      await page.evaluate(lang => renderFixture(React.createElement(CS.Switch, { lang })), lang);
      const control = page.getByRole('switch');
      const name = await control.getAttribute('aria-label');
      await control.press('Space');
      assert.equal(await control.getAttribute('aria-label'), name);
      await page.evaluate(lang => renderFixture(React.createElement(CS.Toggle, { lang })), lang);
      const toggle = page.locator('.cs-toggle');
      const toggleName = await toggle.getAttribute('aria-label');
      await toggle.press('Space');
      assert.equal(await toggle.getAttribute('aria-label'), toggleName);
    }
    await page.evaluate(() => renderFixture(React.createElement(CS.Combobox, { options: [], lang: 'en', placeholder: 'Search names' })));
    assert.equal(await page.getByRole('combobox').getAttribute('aria-label'), 'Choose an option');
    const closedComboBox = await page.locator('.cs-combobox').boundingBox();
    await page.evaluate(() => {
      const neighbor = document.createElement('span'); neighbor.id = 'combo-neighbor'; neighbor.textContent = 'Neighbor';
      document.querySelector('.cs-combobox').after(neighbor);
    });
    const beforeNeighbor = await page.locator('#combo-neighbor').boundingBox();
    await page.getByRole('combobox').focus();
    const openComboBox = await page.locator('.cs-combobox').boundingBox();
    assert.equal(openComboBox.height, closedComboBox.height, 'Opening empty feedback must not change field height');
    assert.deepEqual(await page.locator('#combo-neighbor').boundingBox(), beforeNeighbor, 'Empty popup must not shift its neighboring content');
    assert.equal(await page.locator('.cs-combobox__popup [role="status"]').count(), 1);
    assert.equal(await page.getByRole('option').count(), 0);
    assert.equal(await page.getByRole('status').textContent(), 'No results');

    await page.evaluate(() => renderFixture(React.createElement(CS.Drawer, { open: true, title: 'Settings', onClose: () => {} }, React.createElement('p', null, 'Short content'))));
    assert.equal(await page.locator('.cs-drawer__body').getAttribute('tabindex'), null);
    await page.evaluate(() => renderFixture(React.createElement(CS.Drawer, { open: true, title: 'Settings', onClose: () => {} }, React.createElement('div', { style: { height: 3000 } }, 'Long content'))));
    await page.waitForFunction(() => document.querySelector('.cs-drawer__body')?.tabIndex === 0);
    await page.evaluate(() => renderFixture(React.createElement(CS.Drawer, { open: true, title: 'Settings', onClose: () => {} }, React.createElement('p', null, 'Short content'))));
    await page.waitForFunction(() => !document.querySelector('.cs-drawer__body')?.hasAttribute('tabindex'));

    await page.addScriptTag({ url: '/_audit/vendor/axe.min.js' });
    await page.evaluate(() => renderFixture(React.createElement(CS.Tooltip, { label: 'Read only description' }, 'Informational text')));
    const tooltipText = page.locator('.cs-tooltip > span[tabindex="0"]');
    await tooltipText.focus();
    assert.equal(await page.getByRole('tooltip').textContent(), 'Read only description');
    const tooltipViolations = await page.evaluate(async () => (await axe.run(document.querySelector('#fixture'), { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(v => v.id));
    assert.deepEqual(tooltipViolations, [], 'Informational tooltip text needs no invented button action');

    await page.evaluate(() => renderFixture(React.createElement(CS.OverlayProvider, null, React.createElement(CS.OverlayProvider, null, 'Nested provider'))));
    const providerIds = await page.locator('[data-cs-overlay-root]').evaluateAll(nodes => nodes.map(node => node.id));
    assert.equal(providerIds.length, 2);
    assert.equal(new Set(providerIds).size, 2, 'Nested providers must not duplicate document IDs');

    await page.emulateMedia({ forcedColors: 'active' });
    if (await page.evaluate(() => matchMedia('(forced-colors: active)').matches)) {
      await page.evaluate(() => renderFixture(React.createElement('div', null,
        React.createElement(CS.Switch, { label: 'Off', checked: false, onChange: () => {} }),
        React.createElement(CS.Switch, { label: 'On', checked: true, onChange: () => {} }),
        React.createElement(CS.Tabs, { tabs: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], value: 'a' }),
        React.createElement(CS.SegmentedControl, { options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], value: 'a' }),
      )));
      const states = await page.evaluate(() => {
        const tracks = [...document.querySelectorAll('.cs-switch__track')].map(el => ({ color: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderTopWidth, transform: getComputedStyle(el, '::after').transform }));
        const tabs = [...document.querySelectorAll('.cs-tab')].map(el => getComputedStyle(el).borderBottomWidth);
        const segments = [...document.querySelectorAll('.cs-segmented button')].map(el => getComputedStyle(el).borderColor);
        return { tracks, tabs, segments };
      });
      assert.equal(states.tracks[0].border, '1px');
      assert.notEqual(states.tracks[0].color, states.tracks[1].color);
      assert.notEqual(states.tracks[0].transform, states.tracks[1].transform);
      assert.notEqual(states.tabs[0], states.tabs[1]);
      assert.notEqual(states.segments[0], states.segments[1]);
    } else console.log(`${browserName}: forced-colors media unsupported; no emulated rendering verdict`);
    console.log(`PASS assessment runtime regressions (${browserName})`);
  }, { browserName, development: true });
}
