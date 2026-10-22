import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { collectTemplates } from '../../scripts/generate-template-inventory.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.argv.find(arg => arg.startsWith('--browser='))?.slice(10) || 'chromium';
const only = process.argv.find(arg => arg.startsWith('--only='))?.slice(7);
const manifest = JSON.parse(readFileSync('_ds_manifest.json'));
const templates = manifest.templates.filter(t => !only || t.entryPath.includes('/' + only + '/'));
assert(templates.length);
const helpers = manifest.templates.map(t => t.entryPath.replace(/[^/]+$/, 'ds-base.js'));
assert.equal(new Set(helpers.map(p => readFileSync(p, 'utf8'))).size, 1, 'All template bootstrap copies must share the same source');
const declarations = collectTemplates().templates;
const evidence = [];
await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.route('**/_vendor/react/react.production.min.js', async route => {
    await new Promise(resolve => setTimeout(resolve, 150));
    await route.continue();
  });
  await page.route('**/_ds_bundle.js', async route => {
    const response = await route.fetch(),
      body = await response.text(),
      newline = body.indexOf('\n');
    const probe = "\n(window.__bundleStarts ||= []).push({react:typeof window.React?.useLayoutEffect==='function',reactDOM:typeof window.ReactDOM?.createRoot==='function'});\n";
    await route.fulfill({
      response,
      body: body.slice(0, newline) + probe + body.slice(newline + 1)
    });
  });
  for (const t of templates) {
    await page.goto(origin + '/' + t.entryPath);
    await page.waitForFunction(() => window.__dcRootName?.() && document.querySelector('[data-sc-name]') && (window.__bundleStarts?.length || document.querySelector('meta[name="cs-template-library"][content="static-logo"]')));
    await page.waitForTimeout(100);
    const row = await page.evaluate(() => ({
      starts: window.__bundleStarts || [],
      staticLogo: !!document.querySelector('meta[name="cs-template-library"][content="static-logo"]'),
      logosReady: [...document.querySelectorAll('img[data-cs-official-logo]')].every(img => img.complete && img.naturalWidth > 0),
      errors: window.CyberSkillDS?.__errors || [],
      renderError: document.querySelector('.sc-logic-error,.sc-placeholder-error')?.textContent,
      hasBundle: window.CyberSkillDS?.Button?.$$typeof === Symbol.for('react.forward_ref') && typeof window.CyberSkillDS.Button.render === 'function'
    }));
    evidence.push({
      path: t.entryPath,
      ...row
    });
    if (row.staticLogo) {
      assert.equal(row.starts.length, 0, 'Static-logo templates must omit the component bundle');
      await page.waitForFunction(() => [...document.querySelectorAll('img[data-cs-official-logo]')].every(img => img.complete && img.naturalWidth > 0));
      assert.equal(row.hasBundle, false);
    } else {
      assert.equal(row.starts.length, 1, JSON.stringify(evidence.at(-1)));
      assert.deepEqual(row.starts, [{
        react: true,
        reactDOM: true
      }], JSON.stringify(evidence.at(-1)));
      assert(row.hasBundle);
    }
    assert.equal(row.errors.length, 0, JSON.stringify(evidence.at(-1)));
    assert(!row.renderError, JSON.stringify(evidence.at(-1)));
    await page.waitForFunction(() => !document.querySelector('.sc-placeholder'));
    const definition = declarations.find(entry => entry.path === t.entryPath);
    const language = definition.declaredProps.flatMap(props => Object.entries(props)).find(([key]) => key === 'language')?.[1];
    // Assert initial Vietnamese-first documents too, not just switched EN defaults.
    await page.waitForFunction(() => {
      const scope = document.body.querySelector('[data-sc-name] [lang]');
      return !scope || document.documentElement.lang === scope.lang;
    });
    for (const choice of language?.options || []) {
      await page.evaluate(value => window.__dcSetProps(window.__dcRootName(), {
        language: value
      }), choice);
      const expected = choice === 'Tiếng Việt' ? 'vi' : 'en';
      await page.waitForFunction(expected => document.body.querySelector('[data-sc-name] [lang]')?.lang === expected && document.documentElement.lang === expected, expected);
    }
  }
}, {
  browserName
});
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice(9);
if (output) writeFileSync(output, JSON.stringify({
  browserName,
  evidence
}, null, 2) + '\n');
console.log(JSON.stringify({
  browserName,
  templates: evidence.length,
  reactDelayMs: 150
}));
