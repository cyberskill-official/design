import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { listPublicComponents } from './storybook-inventory.mjs';
import { inspectCoarseHitRegion } from './lib/coarse-hit-region.mjs';
const expected = listPublicComponents().map(row => row.primary).sort();
const evidence = [];
const hitRegions = process.argv.includes('--hit-regions');
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
await withBrowserFixture(async page => {
  await page.addScriptTag({
    url: new URL('/_audit/lib/axe-fixtures.js', page.url()).href
  });
  if (hitRegions) await page.addScriptTag({
    content: 'window.csInspectCoarseHitRegion = ' + inspectCoarseHitRegion.toString() + ';'
  });
  await page.addStyleTag({
    content: '*,*::before,*::after{transition:none!important;animation:none!important}'
  });
  assert.equal(await page.evaluate(() => matchMedia('(pointer:coarse)').matches), true);
  assert.deepEqual(await page.evaluate(() => __axeFixtures.names.slice().sort()), expected);
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({
      width,
      height: 900
    });
    const rows = await page.evaluate(async hitRegions => {
      const rows = [],
        h = React.createElement;
      const wait = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      for (const lang of ['en', 'vi']) for (const density of ['comfortable', 'compact']) for (const theme of ['light', 'dark']) {
        const cluster = __axeFixtures.buildCluster(h, CS, {
          lang
        });
        if (cluster.missing.length) throw Error('Missing components: ' + cluster.missing.join(', '));
        for (let node of cluster.nodes) {
          const name = node.type === CS.ToastStack && node.props.children?.type === CS.Toast ? 'Toast' : Object.keys(CS).find(name => CS[name] === node.type);
          if (!name) continue; // Static tour anchor is not a component or pointer action.
          // Enable optional built-in actions that the accessibility smoke fixture
          // leaves off. These are explicit state coverage, not inferred from names.
          const overrides = {
            Alert: {
              onDismiss: () => {}
            },
            Tag: {
              onRemove: () => {}
            },
            Image: {
              preview: true
            },
            BackTop: {
              threshold: -1
            },
            SearchField: {
              defaultValue: 'Query'
            },
            FloatingActionButton: {
              actions: [{
                label: 'One',
                icon: '1'
              }, {
                label: 'Two',
                icon: '2'
              }]
            },
            DataGrid: {
              selectable: true,
              persistKey: 'touch-inventory',
              columns: Array.isArray(node.props.columns) ? node.props.columns.map(column => ({
                ...column,
                sortable: true
              })) : []
            },
            Toolbar: {
              overflowAfter: 1
            },
            NavigationMenu: {
              items: [{
                label: lang === 'vi' ? 'Tài liệu' : 'Docs',
                panel: [{
                  label: 'API',
                  href: '#api'
                }, {
                  label: 'SDK',
                  href: '#sdk'
                }]
              }]
            },
            Mentions: {
              users: ['An', 'Binh']
            }
          };
          if (overrides[name]) node = React.cloneElement(node, overrides[name]);
          if (name === 'List') node = React.cloneElement(node, null, h(CS.ListItem, {
            title: lang === 'vi' ? 'Mở mục' : 'Open item',
            onClick: () => {}
          }));
          if (name === 'Toast') node = React.cloneElement(node, null, React.cloneElement(node.props.children, {
            onClose: () => {}
          }));
          renderFixture(h('main', {
            lang,
            'data-cs-density': density,
            'data-theme': theme,
            style: {
              padding: 12
            }
          }, node));
          await wait();
          const measure = async state => {
            const targets = [];
            for (const el of document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button],[role=option],[role=tab],[role=menuitem],[role=menuitemcheckbox],[role=menuitemradio],[role=slider],[role=separator][tabindex],[contenteditable=true],.cs-tree__row,.cs-tree__twist,.cs-tree__label')) {
              if (el.disabled) continue;
              let target = el;
              if (el.matches('input[type=file].cs-sr-only')) target = el.closest('.cs-dropzone');
              if (el.matches('input[type=checkbox],input[type=radio]') && el.labels?.length) {
                const a = el.getBoundingClientRect(),
                  b = el.labels[0].getBoundingClientRect();
                if (b.width >= a.width && b.height >= a.height) target = el.labels[0];
              }
              const r = target.getBoundingClientRect(),
                css = getComputedStyle(target);
              if (!r.width || !r.height || css.visibility === 'hidden' || css.display === 'none') continue;
              let hitRegion;
              if (hitRegions) {
                target.scrollIntoView({
                  block: 'center',
                  inline: 'center',
                  behavior: 'instant'
                });
                // Centering inside a short scrollport ignores its sticky header.
                // Move the row below that header; retain the unadjusted diagnostic
                // evidence separately instead of confusing scroll position with size.
                if (name === 'DataGrid' && target.closest('tbody')) {
                  const grid = target.closest('.cs-datagrid');
                  const bottom = Math.max(...[...grid.querySelectorAll('thead th')].map(th => th.getBoundingClientRect().bottom));
                  grid.scrollTop -= Math.max(0, bottom + 1 - target.getBoundingClientRect().top);
                }
                const box = target.getBoundingClientRect();
                const inactive = target.closest('[inert]') ? 'inert background' : name === 'ContextMenu' && state === 'context-menu' && !target.closest('[role="menu"]') ? 'trigger beneath its open context menu' : name === 'Image' && state === 'preview' && target.matches('.cs-image') ? 'original image beneath modal preview' : null;
                const points = [];
                for (const dx of [-21, 0, 21]) for (const dy of [-21, 0, 21]) {
                  const x = box.x + box.width / 2 + dx,
                    y = box.y + box.height / 2 + dy;
                  const hit = document.elementFromPoint(x, y);
                  const within = !!hit && (hit === target || target.contains(hit));
                  points.push({
                    dx,
                    dy,
                    within,
                    hit: hit?.tagName + '.' + (typeof hit?.className === 'string' ? hit.className : ''),
                    ...(!within ? {
                      hitBounds: hit?.getBoundingClientRect().toJSON()
                    } : {})
                  });
                }
                const region = inactive ? {
                  pass: null,
                  state: 'inactive_background'
                } : csInspectCoarseHitRegion(target);
                hitRegion = {
                  method: '44px box/clipped-box floor plus candidate disk ownership at integer CSS coordinates with a 1px edge guard; nine legacy points retained; independent descendant actions excluded',
                  pass: points.every(p => p.within),
                  axialPass: points.filter(p => p.dx === 0 || p.dy === 0).every(p => p.within),
                  inactive,
                  targetBounds: box.toJSON(),
                  points,
                  region
                };
              }
              targets.push({
                tag: el.tagName,
                selector: typeof el.className === 'string' ? el.className : '',
                role: el.getAttribute('role'),
                text: (el.textContent || el.getAttribute('aria-label') || '').slice(0, 60),
                width: r.width,
                height: r.height,
                pass: r.width >= 43.99 && r.height >= 43.99,
                ...(hitRegion ? {
                  hitRegion
                } : {})
              });
            }
            rows.push({
              name,
              lang,
              density,
              theme,
              state,
              viewport: innerWidth,
              clientWidth: document.documentElement.clientWidth,
              documentWidth: document.documentElement.scrollWidth,
              targets
            });
          };
          await measure('initial');
          // Discover disclosure panels through their actual React action. Initial
          // and disclosed states are separate records; this is not every prop state.
          const triggers = [...document.querySelectorAll('[aria-expanded="false"]')].filter(el => !el.disabled);
          for (const el of triggers.slice(0, 8)) {
            if (!el.isConnected) continue;
            el.click();
            await wait();
            await measure('disclosed');
          }
          if (name === 'Image') {
            await document.querySelector('.cs-image img').decode();
            await wait();
            const preview = document.querySelector('.cs-image[role="button"]');
            if (!preview) throw Error('Image preview fixture did not become interactive');
            preview.click();
            await wait();
            await measure('preview');
          }
          if (name === 'ContextMenu') {
            document.querySelector('.cs-ctxmenu-zone').dispatchEvent(new MouseEvent('contextmenu', {
              bubbles: true,
              cancelable: true,
              clientX: 30,
              clientY: 30
            }));
            await wait();
            await measure('context-menu');
          }
          if (name === 'Mentions') {
            const input = document.querySelector('.cs-mentions textarea');
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, '@');
            input.dispatchEvent(new Event('input', {
              bubbles: true
            }));
            await wait();
            if (!document.querySelector('.cs-mentions__pop')) throw Error('Mention suggestions did not open');
            await measure('suggestions');
          }
          if (name === 'InlineEdit') {
            document.querySelector('.cs-inline-edit__view').click();
            await wait();
            await measure('editing');
          }
          renderFixture(null);
        }
      }
      return rows;
    }, hitRegions);
    evidence.push(...rows.map(row => ({
      ...row,
      requestedViewport: width
    })));
  }
}, {
  browserName,
  contextOptions: {
    viewport: {
      width: 390,
      height: 900
    },
    hasTouch: true,
    ...(browserName === 'firefox' ? {} : {
      isMobile: true
    })
  }
});
assert.deepEqual([...new Set(evidence.map(row => row.name))].sort(), expected, 'Every declared primary must actually render');
const failures = evidence.flatMap(row => row.targets.filter(t => !t.pass).map(target => ({
  ...row,
  targets: undefined,
  target
})));
const output = process.argv.find(arg => arg.startsWith('--evidence='))?.slice(11);
if (output) {
  const report = {
    scope: `All ${expected.length} primary smoke fixtures augmented with optional dismiss, select/sort/pin, preview and suggestion actions; initial and discovered panels/edit states; 3 coarse-pointer widths, 2 languages, 2 densities, 2 themes. Dimensions${hitRegions ? ' plus 44px rectangular clipped bounds and candidate disk ownership at integer CSS coordinates with a 1px edge guard after scrolling (DataGrid accounts for its sticky header); inactive backgrounds annotated; independent descendant actions excluded. The inset probe is 42px across; it does not certify the unresolved edge guard, subpixel/continuous ownership or native touch adjustment' : ''}; complete prop-state and activation coverage is separate.`,
    browserName,
    cases: evidence
  };
  writeFileSync(output, output.endsWith('.gz') ? gzipSync(JSON.stringify(report)) : JSON.stringify(report, null, 2) + '\n');
}
if (failures.length) console.error(JSON.stringify(failures.slice(0, 25), null, 2));
assert.equal(failures.length, 0, 'Every enabled measured fixture target must meet the repository 44px floor');
if (hitRegions) {
  const misses = evidence.flatMap(row => row.targets.filter(t => !t.hitRegion.inactive && !t.hitRegion.region.pass).map(target => ({
    ...row,
    targets: undefined,
    target
  })));
  if (misses.length) console.error(JSON.stringify(misses.slice(0, 10), null, 2));
  assert.equal(misses.length, 0, 'Active fixture targets must meet the 44px box/clip floor and own one integer-coordinate inset probe disk with competing descendant actions excluded');
  console.log('PASS CSS-pixel hit ownership: 44px boxes/clipped bounds and 42px inset probe disks; 1px edge guard, finite candidate positions and native activation retain their stated limits.');
}
console.log(`PASS touch fixture inventory: ${evidence.length} states; ${evidence.reduce((n, row) => n + row.targets.length, 0)} target measurements; ${expected.length} primary fixtures. Effective activation and complete state coverage are separate.`);
