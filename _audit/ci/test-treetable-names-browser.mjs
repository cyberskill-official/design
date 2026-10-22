import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {
  stdio: 'pipe'
});
await withBrowserFixture(async page => {
  await page.evaluate(() => {
    window.drawTreeTable = lang => renderFixture(React.createElement('div', null, ...[0, 1].map(i => React.createElement(CS.TreeTable, {
      key: i,
      lang,
      caption: 'Teams ' + i,
      columns: [{
        key: 'name',
        header: 'Team',
        render: n => React.createElement('strong', null, n.name)
      }],
      nodes: [{
        key: 'eng',
        name: 'Engineering',
        children: [{
          key: 'web',
          name: 'Web',
          children: [{
            key: 'ui',
            name: 'UI'
          }]
        }]
      }, {
        key: 'sales',
        name: 'Sales',
        children: [{
          key: 'field',
          name: 'Field'
        }]
      }]
    }))));
    drawTreeTable('en');
  });
  const table = page.getByRole('table', {
    name: 'Teams 0',
    exact: true
  });
  assert.equal(await table.getByRole('button', {
    name: 'Expand Engineering',
    exact: true
  }).count(), 1, 'name must include action and rendered row label');
  const button = table.getByRole('button', {
    name: 'Expand Engineering',
    exact: true
  });
  await button.focus();
  await page.keyboard.press('Enter');
  assert.equal(await table.getByRole('button', {
    name: 'Collapse Engineering',
    exact: true
  }).getAttribute('aria-expanded'), 'true');
  assert.equal(await table.getByRole('button', {
    name: 'Expand Web',
    exact: true
  }).count(), 1);
  await table.getByRole('button', {
    name: 'Expand Web',
    exact: true
  }).click();
  assert.equal(await table.getByText('UI', {
    exact: true
  }).count(), 1);
  const ids = await page.locator('[id]').evaluateAll(xs => xs.map(x => x.id));
  assert.equal(new Set(ids).size, ids.length, 'two instances/nested rows must have distinct label IDs');
  await page.evaluate(() => drawTreeTable('vi'));
  const collapse = table.getByRole('button', {
    name: 'Thu gọn Engineering',
    exact: true
  });
  assert.equal(await collapse.count(), 1, 'language change updates action name without resetting expansion');
  await collapse.focus();
  await page.keyboard.press('Space');
  assert.equal(await table.getByRole('button', {
    name: 'Mở rộng Engineering',
    exact: true
  }).getAttribute('aria-expanded'), 'false');
  assert.equal(await table.getByText('Web', {
    exact: true
  }).count(), 0);
  await page.evaluate(() => renderFixture(React.createElement(CS.TreeTable, {
    key: 'batch',
    lang: 'en',
    caption: 'Batch',
    columns: [{
      key: 'name',
      header: 'Name'
    }],
    nodes: [{
      key: '__proto__',
      name: 'A',
      children: [{
        key: 'ac',
        name: 'AC'
      }]
    }, {
      key: '',
      name: 'B',
      children: [{
        key: 'bc',
        name: 'BC'
      }]
    }]
  })));
  const batch = page.getByRole('table', {
    name: 'Batch'
  });
  await batch.evaluate(el => {
    for (const b of el.querySelectorAll('button')) b.click();
  });
  assert.deepEqual(await batch.getByRole('button').evaluateAll(ns => ns.map(n => n.getAttribute('aria-expanded'))), ['true', 'true'], 'Batched independent expansions must accumulate');
  assert.equal(await batch.getByText('AC', {
    exact: true
  }).count(), 1);
  assert.equal(await batch.getByText('BC', {
    exact: true
  }).count(), 1);
  await batch.evaluate(el => {
    for (const b of el.querySelectorAll('button')) b.click();
  });
  assert.deepEqual(await batch.getByRole('button').evaluateAll(ns => ns.map(n => n.getAttribute('aria-expanded'))), ['false', 'false'], 'Batched collapses must accumulate');
  await batch.evaluate(el => {
    const b = el.querySelector('button');
    b.click();
    b.click();
  });
  assert.equal(await batch.getByRole('button').first().getAttribute('aria-expanded'), 'false', 'Two toggles cancel within one batch');
  console.log('PASS TreeTable names: rendered row labels, EN/VI live switch, nested expansion, Enter/Space, unique IDs across instances');
}, {
  browserName: process.env.CS_TEST_BROWSER || 'chromium'
});
