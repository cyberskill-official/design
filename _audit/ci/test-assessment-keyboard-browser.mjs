import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
for (const browserName of ['chromium', 'firefox', 'webkit']) {
  await withBrowserFixture(async page => {
    await page.evaluate(() => renderFixture(React.createElement(CS.Accordion, { defaultOpen: -1, items: [{ title: 'Details', content: 'Panel content' }] })));
    const disclosure = page.getByRole('button', { name: 'Details' });
    await disclosure.focus(); await page.keyboard.press('Enter');
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
    const panelId = await disclosure.getAttribute('aria-controls');
    assert(panelId);
    assert.equal(await page.locator('[id="' + panelId + '"]').textContent(), 'Panel content');
    assert.equal(await page.getByRole('heading', { level: 3, name: 'Details' }).count(), 1);
    await page.keyboard.press('Space');
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'false');

    await page.evaluate(() => renderFixture(React.createElement(CS.Collapsible, { title: 'More' }, 'Additional content')));
    await page.getByRole('button', { name: 'More' }).focus(); await page.keyboard.press('Space');
    assert.equal(await page.getByRole('region', { name: 'More' }).textContent(), 'Additional content');
    await page.keyboard.press('Enter'); assert.equal(await page.getByRole('region').count(), 0);

    await page.evaluate(() => {
      function RadioScene() { const [value, onChange] = React.useState('a'); return React.createElement(CS.RadioGroup, { legend: 'Mode', value, onChange, options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] }); }
      renderFixture(React.createElement(RadioScene));
    });
    await page.getByRole('radio', { name: 'A', exact: true }).focus(); await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('radio', { name: 'B', exact: true }).isChecked(), true);

    await page.evaluate(() => renderFixture(React.createElement(CS.TagInput, { label: 'Tags', lang: 'en' })));
    await page.getByRole('textbox', { name: 'Tags' }).fill('first'); await page.keyboard.press('Enter');
    assert.equal(await page.getByRole('button', { name: 'Remove first' }).count(), 1);
    await page.keyboard.press('Backspace');
    assert.equal(await page.getByRole('button', { name: 'Remove first' }).count(), 0);
    await page.getByRole('textbox', { name: 'Tags' }).fill('second'); await page.keyboard.press(',');
    assert.equal(await page.getByRole('button', { name: 'Remove second' }).count(), 1);

    await page.evaluate(() => {
      function Scene() { const [value, onChange] = React.useState([]); return React.createElement(CS.Transfer, { lang: 'en', items: [{ key: 'lumi', label: 'Lumi' }], value, onChange }); }
      renderFixture(React.createElement(Scene));
    });
    await page.getByRole('checkbox', { name: 'Lumi' }).focus(); await page.keyboard.press('Space');
    await page.locator('.cs-transfer__ops button').first().focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('.cs-transfer__list').last().getByRole('checkbox', { name: 'Lumi' }).count(), 1);

    await page.evaluate(() => {
      window.actions = [];
      renderFixture(React.createElement(CS.ButtonGroup, { label: 'Actions' },
        React.createElement(CS.Button, { onClick: () => actions.push('first') }, 'First'),
        React.createElement(CS.Button, { onClick: () => actions.push('second') }, 'Second')));
    });
    await page.getByRole('button', { name: 'First' }).focus(); await page.keyboard.press('Enter'); await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab'); await page.keyboard.press('Space');
    assert.deepEqual(await page.evaluate(() => actions), ['first', 'second']);

    await page.evaluate(() => renderFixture(React.createElement(CS.ScrollArea, { maxHeight: 100, 'aria-label': 'Scrollable text' }, React.createElement('div', { style: { height: 1000 } }, 'Long content'))));
    await page.locator('.cs-scroll-area').focus(); await page.keyboard.press('PageDown');
    await page.waitForFunction(() => document.querySelector('.cs-scroll-area').scrollTop > 0);

    await page.evaluate(() => renderFixture(React.createElement(CS.Breadcrumb, { items: [{ label: 'Home', href: '#home' }, { label: 'Current' }], lang: 'en' })));
    await page.getByRole('link', { name: 'Home' }).focus(); await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => location.hash), '#home');
    assert.equal(await page.locator('[aria-current="page"]').textContent(), 'Current');

    await page.evaluate(() => {
      function Pages() { const [value, onChange] = React.useState(1); return React.createElement(CS.Pagination, { page: value, pageCount: 3, onChange, lang: 'en' }); }
      renderFixture(React.createElement(Pages));
    });
    await page.locator('.cs-pagination button').last().focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('.cs-pagination [aria-current="page"]').textContent(), '2');
    await page.keyboard.press('Space');
    assert.equal(await page.locator('.cs-pagination [aria-current="page"]').textContent(), '3');
    await page.evaluate(() => renderFixture(React.createElement(CS.Tree, { 'aria-label': 'Files', nodes: [
      { key: 'a', label: 'Alpha', children: [{ key: 'aa', label: 'Alpha child' }] },
      { key: 'b', label: 'Beta', children: [{ key: 'bb', label: 'Beta child' }] },
      { key: 'c', label: 'Bravo' },
    ] })));
    await page.getByRole('treeitem', { name: 'Alpha', exact: true }).focus();
    await page.keyboard.press('b');
    await page.waitForFunction(() => document.activeElement?.querySelector('.cs-tree__label')?.textContent === 'Beta');
    await page.keyboard.press('b');
    await page.waitForFunction(() => document.activeElement?.querySelector('.cs-tree__label')?.textContent === 'Bravo');
    await page.keyboard.press('*');
    assert.equal(await page.getByRole('treeitem', { name: 'Alpha', exact: true }).getAttribute('aria-expanded'), 'true');
    assert.equal(await page.getByRole('treeitem', { name: 'Beta', exact: true }).getAttribute('aria-expanded'), 'true');

    await page.evaluate(() => renderFixture(React.createElement(CS.Carousel, { label: 'Featured', lang: 'en' }, 'First slide', 'Second slide')));
    assert.equal(await page.getByRole('group', { name: 'Slide 1/2', exact: true }).count(), 1);
    await page.locator('.cs-carousel__nav.next').focus(); await page.keyboard.press('Enter');
    assert.equal(await page.getByRole('group', { name: 'Slide 2/2', exact: true }).count(), 1);
    assert.equal(await page.getByRole('status').textContent(), 'Slide 2/2');

    console.log(`PASS assessment keyboard contracts (${browserName}): Accordion, Collapsible, RadioGroup, TagInput, Transfer, ButtonGroup, ScrollArea, Breadcrumb, Pagination; Tooltip/NavigationMenu/Switch covered by runtime suite`);
  }, { browserName });
}
