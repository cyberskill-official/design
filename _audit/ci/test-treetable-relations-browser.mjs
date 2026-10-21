import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium',
  source = 'components/datatable/TreeTable.jsx',
  require = createRequire(import.meta.url);
async function compile(mutation) {
  let applied = false;
  const result = await build({
    stdin: {
      contents: `import {TreeTable} from './${source}'; window.TreeRelationFixture=TreeTable;`,
      resolveDir: resolve('.')
    },
    bundle: true,
    write: false,
    format: 'iife',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    plugins: [{
      name: 'source-fixture',
      setup(builder) {
        builder.onResolve({
          filter: /^react$/
        }, () => ({
          path: 'react',
          namespace: 'peer'
        }));
        builder.onLoad({
          filter: /.*/,
          namespace: 'peer'
        }, () => ({
          contents: 'module.exports=window.React;',
          loader: 'js'
        }));
        if (mutation) builder.onLoad({
          filter: /components\/datatable\/TreeTable\.jsx$/
        }, args => {
          const text = readFileSync(args.path, 'utf8');
          assert(text.includes(mutation.before));
          applied = true;
          return {
            contents: text.replace(mutation.before, mutation.after),
            loader: 'jsx'
          };
        });
      }
    }]
  });
  if (mutation) assert(applied);
  return result.outputFiles[0].text;
}
const positive = await compile(),
  mutations = await Promise.all([{
    name: 'missing-child-row-controls',
    before: 'aria-controls={open ? kids.map(child => nodeRowId(treeId, child.key)).join(" ") : undefined}',
    after: 'aria-controls={undefined}'
  }, {
    name: 'cross-table-id-collision',
    before: 'return prefix + "-row-"',
    after: 'return "cs-row-"'
  }].map(async mutation => ({
    ...mutation,
    code: await compile(mutation)
  })));
async function mount(page) {
  await page.evaluate(() => {
    const h = React.createElement,
      rootKey = 'root /#\uD800',
      nodes = [{
        key: rootKey,
        name: 'Root',
        amount: 1,
        children: [{
          key: 'child-one',
          name: 'Child',
          amount: 2,
          children: [{
            key: 'grandchild',
            name: 'Grandchild',
            amount: 3
          }]
        }, {
          key: 'sibling',
          name: 'Sibling',
          amount: 4
        }]
      }, {
        key: 'other',
        name: 'Other',
        amount: 5
      }];
    function App() {
      const [data, setData] = React.useState(nodes);
      window.treeRelationReorder = () => setData(current => [current[1], {
        ...current[0],
        children: [...current[0].children].reverse()
      }]);
      const columns = [{
        key: 'name',
        header: 'Name',
        render: node => h('strong', null, node.name)
      }, {
        key: 'amount',
        header: 'Value',
        render: node => h('input', {
          'aria-label': node.name + ' value',
          defaultValue: node.amount
        })
      }];
      return h('div', null, ...['A', 'B'].map(name => h('div', {
        id: 'tree-relations-' + name,
        key: name
      }, h(TreeRelationFixture, {
        columns,
        nodes: data,
        caption: 'Tree ' + name,
        defaultExpanded: [rootKey, 'child-one'],
        lang: 'en'
      }))));
    }
    renderFixture(h(App));
  });
}
async function relations(page) {
  const a = page.locator('#tree-relations-A'),
    root = a.getByRole('button', {
      name: 'Collapse Root',
      exact: true
    }),
    child = a.getByRole('button', {
      name: 'Collapse Child',
      exact: true
    });
  const parentId = await root.evaluate(el => el.closest('tr').id),
    childId = await child.evaluate(el => el.closest('tr').id),
    siblingId = await a.getByText('Sibling', {
      exact: true
    }).evaluate(el => el.closest('tr').id),
    grandchildId = await a.getByText('Grandchild', {
      exact: true
    }).evaluate(el => el.closest('tr').id);
  assert.deepEqual((await root.getAttribute('aria-controls'))?.split(' '), [childId, siblingId], 'Branch controls its actual direct children, not flattened descendants');
  assert.deepEqual((await child.getAttribute('aria-controls'))?.split(' '), [grandchildId]);
  const proof = await page.evaluate(() => {
    const tables = [...document.querySelectorAll('#fixture table')],
      rows = [...document.querySelectorAll('#fixture tbody tr[id]')];
    return {
      tables: tables.map(el => ({
        tag: el.tagName,
        role: el.getAttribute('role')
      })),
      ids: rows.map(el => el.id),
      references: [...document.querySelectorAll('#fixture button[aria-controls]')].map(button => button.getAttribute('aria-controls').split(' ').every(id => {
        const row = document.getElementById(id);
        return row?.tagName === 'TR' && row.closest('table') === button.closest('table');
      }))
    };
  });
  assert.equal(new Set(proof.ids).size, proof.ids.length, 'Row IDs stay unique across two tables with identical keys');
  assert(proof.references.every(Boolean));
  assert(proof.tables.every(table => table.tag === 'TABLE' && table.role === null), 'Native table semantics remain; no invented treegrid');
  return {
    parentId,
    childId,
    siblingId,
    grandchildId
  };
}
await withBrowserFixture(async page => {
  await page.addScriptTag({
    content: positive
  });
  await mount(page);
  const initial = await relations(page),
    a = page.locator('#tree-relations-A'),
    root = a.getByRole('button', {
      name: 'Collapse Root',
      exact: true
    });
  await a.getByRole('textbox', {
    name: 'Child value',
    exact: true
  }).fill('entered');
  await root.focus();
  await page.keyboard.press('Space');
  const collapsed = a.getByRole('button', {
    name: 'Expand Root',
    exact: true
  });
  assert.equal(await collapsed.getAttribute('aria-controls'), null);
  assert.equal(await a.getByText('Child', {
    exact: true
  }).count(), 0);
  await page.keyboard.press('Enter');
  assert.deepEqual(await relations(page), initial, 'Reopening restores stable key-based row IDs');
  await a.getByRole('textbox', {
    name: 'Child value',
    exact: true
  }).fill('kept across reorder');
  const input = await a.getByRole('textbox', {
    name: 'Child value',
    exact: true
  }).elementHandle();
  await page.evaluate(() => treeRelationReorder());
  const reorderedRoot = a.getByRole('button', {
    name: 'Collapse Root',
    exact: true
  });
  assert.deepEqual((await reorderedRoot.getAttribute('aria-controls')).split(' '), [initial.siblingId, initial.childId]);
  assert.equal(await a.getByRole('textbox', {
    name: 'Child value',
    exact: true
  }).inputValue(), 'kept across reorder');
  assert.equal(await input.evaluate(el => el.isConnected), true, 'Keyed child content is not remounted by relation IDs');
  await page.addScriptTag({
    path: require.resolve('axe-core/axe.min.js')
  });
  const axe = await page.evaluate(() => axe.run(document.getElementById('fixture'), {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
    }
  }));
  assert.deepEqual(axe.violations.map(v => ({
    id: v.id,
    nodes: v.nodes.map(n => n.target)
  })), []);
  const rejected = [];
  for (const mutation of mutations) {
    await page.addScriptTag({
      content: mutation.code
    });
    await mount(page);
    await assert.rejects(() => relations(page), undefined, mutation.name + ' must fail');
    rejected.push(mutation.name);
  }
  await page.evaluate(() => renderFixture(null));
  mkdirSync('test-results/treetable-relations', {
    recursive: true
  });
  writeFileSync(`test-results/treetable-relations/${browserName}.json`, JSON.stringify({
    status: 'PASS',
    browserName,
    sourceSha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
    initial,
    rejected,
    axeViolations: 0,
    scope: 'Native expandable-table direct child disclosure relations, unique UTF16-safe stable row IDs across two instances, Space/Enter, keyed reorder/input preservation and bounded axe. No APGtreegrid or manualAT acceptance.'
  }, null, 2) + '\n');
}, {
  browserName,
  development: true,
  contextOptions: {
    reducedMotion: 'reduce'
  }
});
console.log('PASS ' + browserName + ': native TreeTable child-row relationships, safe unique IDs, keyboard/reorder and two source-mutation rejects');
