import assert from 'node:assert/strict';
import postcss from 'postcss';
import { gunzipSync } from 'node:zlib';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { themeComponentCases } from './fixtures/theme-component-cases.mjs';
const variants = Object.keys(JSON.parse(readFileSync('tokens/tokens.json', 'utf8')).elements);
const capturePath = process.argv.find(arg => arg.startsWith('--capture='))?.slice(10);
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
// Preserve exact platform references: Chromium native range colors and color
// serialization differ between macOS and Linux despite identical authored CSS.
// Non-Chromium engines retain the full nearest-theme assertions below.
const platformReference = process.platform === 'linux' ? '_audit/ci/fixtures/theme-component-colocated.linux.json.gz' : '_audit/ci/fixtures/theme-component-colocated.json.gz';
const comparePath = process.argv.find(arg => arg.startsWith('--compare='))?.slice(10) || (!capturePath && browserName === 'chromium' ? platformReference : null);
const themeSelectors = [];
for (const file of readdirSync('base').filter(file => file.endsWith('.css'))) postcss.parse(readFileSync('base/' + file, 'utf8')).walkRules(rule => {
  if (rule.nodes.some(node => node.type === 'decl' && node.value.includes('--_cs-light'))) themeSelectors.push(...rule.selectors);
  assert.ok(!/\[data-theme="(?:dark|system)"\] \.cs-/.test(rule.selector), 'Component theme selectors must not leak through nested resets: ' + rule.selector);
});
// Approved accessibility paint changes only. Border colors below are currentColor
// on borderless option buttons/divs; their values follow the changed text color.
const approvedPaintFields = {
  'toggle-pressed': ['color'],
  'tree-selected': ['color','border-top-color','border-right-color','border-bottom-color','border-left-color'],
  'mentions-highlighted': ['color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'mentions-selected': ['color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'combobox-selected': ['color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'combobox-highlighted': ['color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color']
};
const approvedFields = (id, theme, colorScheme) => id.startsWith('combobox-') && !(theme === 'light' || theme === 'system' && colorScheme === 'light') ? [] : approvedPaintFields[id] || [];
const baseline = {},
  semanticPrimary = {};
let cases = 0,
  failures = 0,
  hoverSemanticChecks = 0;
const examples = [];
await withBrowserFixture(async page => {
  const uncovered = await page.evaluate(({
    selectors,
    fixtures
  }) => {
    const host = document.getElementById('fixture');
    return selectors.filter(selector => !fixtures.some(([, html, target]) => {
      host.innerHTML = html;
      return host.querySelector(target).matches(selector.replaceAll(':hover', ''));
    }));
  }, {
    selectors: themeSelectors,
    fixtures: themeComponentCases
  });
  assert.deepEqual(uncovered, [], 'Every theme-dependent base selector needs a fixture');
  for (const colorScheme of ['light', 'dark']) for (const contrast of ['no-preference', 'more']) {
    await page.emulateMedia({
      colorScheme,
      contrast
    });
    await page.goto(page.url());
    await page.mouse.move(1200, 700);
    await page.addStyleTag({
      content: '*,*::before,*::after {transition:none!important;animation:none!important}'
    });
    const result = await page.evaluate(({
      variants,
      fixtures
    }) => {
      const host = document.getElementById('fixture');
      const baseline = {},
        semanticPrimary = {},
        examples = [];
      let cases = 0,
        failures = 0;
      const properties = ['color', 'background-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'accent-color', 'box-shadow'];
      const attrs = entry => {
        const [e, v = ''] = entry.split('.');
        return `data-cs-element="${e}" data-cs-variant="${v}"`;
      };
      const values = node => {
        const css = getComputedStyle(node);
        return Object.fromEntries(properties.map(p => [p, css.getPropertyValue(p)]));
      };
      for (const entry of variants) for (const theme of ['light', 'dark', 'system']) for (const [id, html, target] of fixtures) {
        host.innerHTML = `<div ${attrs(entry)} data-theme="${theme}" id="reference">${html}</div>`;
        const reference = host.querySelector('#reference');
        const expected = values(reference.querySelector(target));
        baseline[`${entry}/${theme}/${id}`] = expected;
        if(id==='tree-selected-row'){
          const paint=document.createElement('span');
          paint.style.backgroundColor=theme==='dark'||theme==='system'&&matchMedia('(prefers-color-scheme:dark)').matches?'color-mix(in oklab, var(--cs-accent) 18%, var(--cs-color-surface-panel))':'var(--cs-accent-tint)';
          reference.appendChild(paint);
          if(getComputedStyle(paint).backgroundColor!==expected['background-color'])throw Error('Selected Tree row must use reviewed nearest-theme selection paint');
          paint.remove();
        }
        // A plain sibling probe has no component classes or selection styles.
        const probe = document.createElement('span');
        probe.style.cssText = 'color:var(--cs-color-text-primary);border:0 solid currentColor';
        probe.textContent = 'Independent semantic primary';
        reference.appendChild(probe);
        semanticPrimary[`${entry}/${theme}/${id}`] = values(probe);
        for (const outer of ['light', 'dark', 'system']) {
          host.innerHTML = `<div ${attrs(entry)} data-theme="${outer}"><div data-theme="${theme}" id="actual">${html}</div></div>`;
          const actual = values(host.querySelector('#actual').querySelector(target));
          cases++;
          const differences = properties.filter(p => actual[p] !== expected[p]).map(p => ({
            property: p,
            actual: actual[p],
            expected: expected[p]
          }));
          if (differences.length) {
            failures++;
            if (examples.length < 8) examples.push({
              entry,
              theme,
              outer,
              id,
              differences
            });
          }
        }
      }
      return {
        cases,
        failures,
        examples,
        baseline,
        semanticPrimary
      };
    }, {
      variants,
      fixtures: themeComponentCases
    });
    baseline[`${colorScheme}/${contrast}`] = result.baseline;
    semanticPrimary[`${colorScheme}/${contrast}`] = result.semanticPrimary;
    cases += result.cases;
    failures += result.failures;
    examples.push(...result.examples.map(e => ({
      colorScheme,
      contrast,
      ...e
    })));
    // The theme-sensitive :hover branch must be exercised with the real pointer.
    for (const entry of variants) for (const theme of ['light', 'dark', 'system']) for (const outer of ['light', 'dark', 'system']) {
      await page.evaluate(({
        entry,
        theme,
        outer
      }) => {
        const [e, v = ''] = entry.split('.');
        const row = '<div class="cs-mentions"><span class="cs-mentions__pop"><button>User</button></span></div>';
        document.getElementById('fixture').innerHTML = `<div data-cs-element="${e}" data-cs-variant="${v}"><div id="reference" data-theme="${theme}" style="position:absolute;left:30px;top:40px;width:250px">${row}</div><div data-theme="${outer}" style="position:absolute;left:500px;top:40px;width:250px"><div id="actual" data-theme="${theme}">${row}</div></div></div>`;
      }, {
        entry,
        theme,
        outer
      });
      const inspect = async id => {
        const rect = await page.locator('#' + id + ' button').boundingBox();
        assert.ok(rect);
        await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return await page.locator('#' + id + ' button').evaluate(el => {
          const probe = document.createElement('span');
          probe.style.color = 'var(--cs-color-text-primary)';
          probe.textContent = 'Primary probe';
          el.closest('#reference,#actual').appendChild(probe);
          const primary = getComputedStyle(probe).color;
          probe.remove();
          const css = getComputedStyle(el);
          return {
            hover: el.matches(':hover'),
            color: css.color,
            background: css.backgroundColor,
            primary
          };
        });
      };
      const expected = await inspect('reference'),
        actual = await inspect('actual');
      cases++;
      assert.ok(expected.hover && actual.hover, 'Native hover must be active on both probes');
      assert.equal(expected.color, expected.primary, 'Colocated Mentions native hover must resolve semantic primary');
      assert.equal(actual.color, actual.primary, 'Nested Mentions native hover must resolve nearest semantic primary');
      hoverSemanticChecks += 2;
      if (actual.color !== expected.color || actual.background !== expected.background) {
        failures++;
        if (examples.length < 8) examples.push({
          entry,
          theme,
          outer,
          id: 'mentions-hover',
          actual,
          expected
        });
      }
    }
  }
  // Real old-paint mutations must fail both the semantic contract and contrast.
  await page.emulateMedia({
    colorScheme: 'light',
    contrast: 'no-preference'
  });
  await page.goto(page.url());
  await page.addStyleTag({
    content: '*,*::before,*::after{transition:none!important;animation:none!important}.cs-mentions__pop{position:static!important;display:inline-block!important}'
  });
  await page.addScriptTag({
    url: new URL('/_audit/vendor/axe.min.js', page.url()).href
  });
  for (const id of Object.keys(approvedPaintFields)) {
    const fixture = themeComponentCases.find(row => row[0] === id);
    assert(fixture, 'Approved paint fixture must remain present: ' + id);
    const mutation = await page.evaluate(async ({
      fixture
    }) => {
      const [, html, target] = fixture,
        host = document.getElementById('fixture');
      host.innerHTML = '<div data-theme="light" data-cs-element="tho" id="paint-mutation">' + html + '</div>';
      const scope = host.querySelector('#paint-mutation'),
        node = scope.querySelector(target),
        probe = document.createElement('span');
      probe.style.color = 'var(--cs-color-text-primary)';
      probe.textContent = 'Primary';
      scope.appendChild(probe);
      const expected = getComputedStyle(probe).color,
        original = getComputedStyle(node).color;
      const good = (await axe.run(node, {
        runOnly: {
          type: 'rule',
          values: ['color-contrast']
        }
      })).violations;
      node.style.setProperty('color', 'var(--cs-accent-strong)', 'important');
      const actual = getComputedStyle(node).color,
        bad = (await axe.run(node, {
          runOnly: {
            type: 'rule',
            values: ['color-contrast']
          }
        })).violations;
      return {
        expected,
        original,
        actual,
        good: good.map(v => v.id),
        bad: bad.map(v => v.id)
      };
    }, {
      fixture
    });
    assert.equal(mutation.original, mutation.expected, id + ': current paint must match independent primary probe');
    assert.deepEqual(mutation.good, [], id + ': current light paint contrast');
    assert.notEqual(mutation.actual, mutation.expected, id + ': old accent paint must fail semantic primary contract');
    assert(mutation.bad.includes('color-contrast'), id + ': old accent paint must fail real contrast oracle');
  }
}, {
  browserName: process.env.CS_TEST_BROWSER || 'chromium'
});
if (capturePath) writeFileSync(capturePath, JSON.stringify(baseline, null, 2) + '\n');
let semanticChecks = 0;
for (const [media, rows] of Object.entries(baseline)) for (const [key, actual] of Object.entries(rows)) {
  const [, theme, id] = key.split('/'),
    colorScheme = media.split('/')[0];
  for (const property of approvedFields(id, theme, colorScheme)) {
    assert.equal(actual[property], semanticPrimary[media][key][property], media + '/' + key + '/' + property + ': approved accessibility paint must resolve the nearest semantic primary token');
    semanticChecks++;
  }
}
assert(semanticChecks > 0, 'Approved semantic paint fixtures must be exercised');
  // The two newly owned selectors had no historical sample. They remain mandatory
// in the complete nested matrix; radio paint additionally equals the existing
  // immutable tabs paint. Every original ID/property still compares exactly.
  const originalRows={};
  for(const [media,rows]of Object.entries(baseline)){
    originalRows[media]={};
    for(const [key,value]of Object.entries(rows)){
      const [element,theme,id]=key.split('/');
      if(id==='segmented-checked')assert.deepEqual(value,rows[element+'/'+theme+'/segmented-selected'],'Radio/tabs selected paint parity');
      if(!['segmented-checked','tree-selected-row'].includes(id))originalRows[media][key]=value;
    }
    for(const id of ['segmented-checked','tree-selected-row'])assert.equal(Object.keys(rows).filter(key=>key.endsWith('/'+id)).length,variants.length*3,'Every new selector remains exercised in every declared theme/element');
  }

if (comparePath) {
  const previous = JSON.parse(comparePath.endsWith('.gz') ? gunzipSync(readFileSync(comparePath)).toString('utf8') : readFileSync(comparePath, 'utf8'));
  // Project only explicitly approved fields through the independent semantic probe.
  // Every other ID/property/theme/media value still compares exactly to immutable baseline.
  for (const [media, rows] of Object.entries(previous)) for (const [key, expected] of Object.entries(rows)) {
    const [, theme, id] = key.split('/'),
      colorScheme = media.split('/')[0];
    for (const property of approvedFields(id, theme, colorScheme)) expected[property] = semanticPrimary[media]?.[key]?.[property];
  }
  assert.deepEqual(originalRows, previous, 'Unrelated colocated paint must preserve exact immutable baseline; only enumerated semantic-primary accessibility fields may change');
}
if (failures) console.error(JSON.stringify({
  cases,
  failures,
  examples: examples.slice(0, 8)
}, null, 2));
assert.equal(failures, 0, 'Nested component styling must match the nearest theme, not any dark ancestor');
console.log(`PASS component theme scopes: ${cases} nested cases across ${themeComponentCases.length} selector/state fixtures plus native hover, all 15 packs and both OS theme/contrast preferences; static media; ${semanticChecks} independent semantic-paint field checks + ${hoverSemanticChecks} hover token checks and ${Object.keys(approvedPaintFields).length} old-color mutation negatives.`);
