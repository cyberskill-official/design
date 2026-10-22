import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, realpathSync, statSync } from 'node:fs';
import { resolve, join, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { chromium, firefox, webkit } from 'playwright';
import Ajv from 'ajv';
import { execFileSync } from 'node:child_process';
import { waitForSiteTemplate } from './lib/site-template-ready.mjs';
import { buildCspManifest, loadSitePolicy } from '../../scripts/lib/site-csp.mjs';
import { resolveSiteRequest } from '../../scripts/lib/site-routes.mjs';
import { listFiles } from '../../scripts/public-site.mjs';
import { verifyFreshness } from '../../scripts/storybook-fingerprint.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url)),
  publicRoot = join(root, '.vercel/output/static');
const read = path => readFileSync(join(root, path), 'utf8'),
  hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(read('.vercel/output/static/public-site-csp.json')),
  deployment = JSON.parse(read('.vercel/output/config.json'));
verifyFreshness(root, JSON.parse(read('.vercel/output/static/.cs-freshness.json')));
const publicInventory = JSON.parse(read('.vercel/output/static/public-site-manifest.json'));
assert.deepEqual(publicInventory.files.map(x => x.path).sort(), listFiles(publicRoot).filter(path => path !== 'public-site-manifest.json').sort());
for (const entry of publicInventory.files) assert.equal(hash(readFileSync(join(publicRoot, entry.path))), entry.sha256, entry.path + ' final output bytes');
const rebuilt = buildCspManifest(listFiles(publicRoot).filter(path => path.endsWith('.html')).map(path => ({
  path,
  html: readFileSync(join(publicRoot, path), 'utf8')
})), {
  serializerSource: read('scripts/template-runtime/dc-logic-source.mjs')
});
assert.deepEqual(manifest, rebuilt, 'Final HTML and source serializer must reproduce the exact deployed permissions');
const validate = new Ajv({
  strict: false,
  allErrors: true
}).compile(JSON.parse(read('scripts/site-csp-manifest.schema.json')));
assert(validate(manifest), JSON.stringify(validate.errors));
assert(deployment.routes.length <= loadSitePolicy().maxRoutes);
for (const page of manifest.pages) {
  assert(Buffer.byteLength(page.csp) <= 4096);
  assert(!/script-src[^;]*(?:unsafe|nonce-|strict-dynamic)/.test(page.csp));
  assert(page.csp.includes("style-src 'self' 'unsafe-inline'"));
  for (const alias of ['/' + page.path, ...(page.path === 'index.html' ? ['/'] : page.path.endsWith('/index.html') ? ['/' + page.path.slice(0, -10)] : [])]) {
    const match = resolveSiteRequest(deployment, alias + '?probe=1');
    if (match.status === 308) {
      assert.equal(match.location, '/?probe=1');
      assert(!match.headers['Content-Security-Policy'].includes('sha256-'), 'Redirect responses need no inline script authority');
    } else assert.equal(match.headers['Content-Security-Policy'], page.csp, alias + ' exact CSP');
  }
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.md': 'text/plain',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.webp': 'image/webp'
};
const server = createServer((req, res) => {
  try {
    const match = resolveSiteRequest(deployment, req.url);
    for (const [key, value] of Object.entries(match.headers)) res.setHeader(key, value);
    if (match.location) {
      res.writeHead(match.status, {
        Location: match.location
      });
      res.end();
      return;
    }
    const target = resolve(publicRoot, '.' + decodeURIComponent(match.path));
    assert(target.startsWith(publicRoot + sep) && realpathSync(target).startsWith(publicRoot + sep) && statSync(target).isFile());
    res.setHeader('Content-Type', types[extname(target)] || 'application/octet-stream');
    res.end(readFileSync(target));
  } catch {
    res.writeHead(404);
    res.end('Unavailable');
  }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = 'http://127.0.0.1:' + server.address().port,
  results = [];
const templates = JSON.parse(read('_ds_manifest.json')).templates;
assert.equal(templates.length, 85, 'The complete supported template inventory must be probed');
const templateStrategies = JSON.parse(read('scripts/template-static-logos.json')).templates;
assert.deepEqual(templateStrategies.map(x => x.path).sort(), templates.map(x => x.entryPath).sort(), 'Readiness strategies must cover exactly the supported templates');
assert.equal(templateStrategies.filter(x => x.strategy === 'static-logo').length, 71);
assert.equal(templateStrategies.filter(x => x.strategy === 'components').length, 14);
const catalog = JSON.parse(read('_audit/docs-catalog.json'));
const documents = [...new Set([...catalog.entrance, ...catalog.pages].map(x => x.path))];
const output = join(root, 'test-results/site-csp');
mkdirSync(output, {
  recursive: true
});
try {
  // Exercise actual HTTP headers for every HTML route and index alias, with query strings.
  for (const entry of manifest.pages) {
    const aliases = ['/' + entry.path, ...(entry.path === 'index.html' ? ['/'] : entry.path.endsWith('/index.html') ? ['/' + entry.path.slice(0, -10)] : [])];
    for (const alias of aliases) {
      const response = await fetch(base + alias + '?exact=1', {
        redirect: 'manual'
      });
      const expected = resolveSiteRequest(deployment, alias + '?exact=1');
      assert.equal(response.status, expected.status, alias);
      assert.equal(response.headers.get('content-security-policy'), expected.headers['Content-Security-Policy'], alias + ' served policy');
      if (expected.location) assert.equal(response.headers.get('location'), expected.location);else assert.equal(hash(await response.text()), entry.htmlSha256, alias + ' served HTML bytes');
    }
  }
  // Real HTTP compatibility uses generated routes and actual files, not only
  // a local resolver assertion. Redirect responses carry no inline authority.
  for (const [request, location] of [['/docs/viewer.html/?lang=vi', '/docs/viewer.html?lang=vi'], ['/assets/logo-mark.svg/?cache=1', '/assets/logo-mark.svg?cache=1'], ['/dashboard.html/?legacy=1', '/dashboard.html?legacy=1']]) {
    const redirect = await fetch(base + request, {
      redirect: 'manual'
    });
    assert.equal(redirect.status, 308, request);
    assert.equal(redirect.headers.get('location'), location, request);
    assert(!redirect.headers.get('content-security-policy').includes('sha256-'));
    const landed = await fetch(base + request);
    assert.equal(landed.status, 200, request + ' resolves without a loop');
  }
  assert.equal((await fetch(base + '/components/?directory=1', {
    redirect: 'manual'
  })).status, 200);
  const external = await fetch(base + '//escape.invalid/', {
    redirect: 'manual'
  });
  assert.equal(external.headers.get('location'), null, 'No protocol-relative open redirect');
  for (const [browserName, engine] of Object.entries({
    chromium,
    firefox,
    webkit
  })) {
    // The source-fixture child owns its own server. No main-server browser request
    // is pending here while this synchronous counterproof runs.
    execFileSync(process.execPath, [join(root, '_audit/ci/test-site-template-readiness-browser.mjs')], {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        CS_TEST_BROWSER: browserName
      }
    });
    const browser = await engine.launch();
    const rows = [];
    try {
      let page = await browser.newPage();
      const errors = [];
      async function navigate(path, ready, templateStrategy) {
        await page.close();
        errors.length = 0;
        page = await browser.newPage();
        page.on('pageerror', error => errors.push(String(error)));
        await page.addInitScript(() => {
          window.cspViolations = [];
          document.addEventListener('securitypolicyviolation', event => cspViolations.push({
            directive: event.effectiveDirective,
            blocked: event.blockedURI
          }));
        });
        const response = await page.goto(base + path);
        assert.equal(response.status(), 200, path);
        if (templateStrategy) await waitForSiteTemplate(page, templateStrategy);else await page.waitForFunction(ready, null, {
          timeout: 30000
        });
        await page.waitForTimeout(60);
        assert.deepEqual(errors, [], path + ' page errors');
        assert.deepEqual(await page.evaluate(() => cspViolations), [], path + ' CSP violations');
        rows.push({
          path,
          pass: true
        });
      }
      await navigate('/', () => document.querySelector('.sidebar-container'));
      await navigate('/docs/viewer.html/?lang=vi#docs/consuming.md', () => document.querySelector('#doc')?.dataset.state === 'ready');
      await navigate('/iframe.html?id=components-button-button--default&viewMode=story', () => document.querySelector('#storybook-root .cs-button'));
      await page.locator('#storybook-root .cs-button').click();
      assert.deepEqual(await page.evaluate(() => cspViolations), [], 'React event listeners remain functional');
      await navigate('/iframe.html?id=docs-start-introduction--docs&viewMode=docs', () => document.querySelector('.sbdocs-content'));
      for (const document of documents) for (const language of ['en', 'vi']) {
        await navigate('/docs/viewer.html?lang=' + language + '#' + encodeURIComponent(document), () => document.querySelector('#doc')?.dataset.state === 'ready');
        assert((await page.title()).includes(document), 'Reader must select the requested document, not its fallback');
      }
      console.log('PASS ' + browserName + ' real Storybook/story/docs and ' + documents.length + ' bilingual document routes under output-specific hashes');
      for (const [index, template] of templates.entries()) {
        const strategy = templateStrategies.find(entry => entry.path === template.entryPath);
        await navigate('/' + template.entryPath, null, strategy);
        // These sidecar controls re-render React; they must not require new inline script authority.
        const language = await page.evaluate(() => {
          const script = document.querySelector('script[data-dc-script]');
          return Object.entries(JSON.parse(script?.getAttribute('data-props') || '{}')).find(([name]) => name === 'language')?.[1];
        });
        for (const value of language?.options || []) {
          await page.evaluate(value => window.__dcSetProps(window.__dcRootName(), {
            language: value
          }), value);
          await waitForSiteTemplate(page, strategy);
        }
        assert.deepEqual(errors, [], template.entryPath + ' post-render page errors');
        assert.deepEqual(await page.evaluate(() => cspViolations), [], template.entryPath + ' language/control changes');
        if (/finance-(invoice|quote|expense-report)/.test(template.entryPath)) assert.equal(await page.locator('[role="region"][tabindex="0"]').first().evaluate(region => !region.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'End',
          bubbles: true,
          cancelable: true
        }))), true, 'Interpreted native key handler must still cancel its handled event');
        if (template.entryPath.includes('/marketing-page/')) {
          await page.locator('[data-sc-name] .cs-button').first().click();
          await page.locator('[data-sc-name] button.cs-touch-target').waitFor();
          await page.locator('[data-sc-name] button.cs-touch-target').click();
          await page.waitForFunction(() => !document.querySelector('[data-sc-name] button.cs-touch-target'));
        }
        if ((index + 1) % 20 === 0) console.log(browserName + ' CSP templates ' + (index + 1) + '/' + templates.length);
      }
      const compiledPages = manifest.pages.filter(entry => /components\/.*\.card\.html$/.test(entry.path) || ['guidelines/atomic-view.html', 'ui_kits/website/index.html', 'ui_kits/website/chat.html', 'ui_kits/status-hub/index.html'].includes(entry.path));
      assert(compiledPages.length >= 24, 'Compiled legacy cards and kit surfaces remain represented');
      for (const entry of compiledPages) {
        await navigate('/' + entry.path, () => document.querySelector('#root')?.childElementCount > 0);
        assert(!(await page.content()).includes('type="text/babel"'), 'Built page must not depend on runtime Babel');
      }
      await navigate('/components/textfield/textfield.card.html', () => document.querySelector('#root input:not(:disabled)'));
      const field = page.locator('#root input:not(:disabled)').first();
      await field.fill('CSP input regression');
      assert.equal(await field.inputValue(), 'CSP input regression');
      assert.deepEqual(await page.evaluate(() => cspViolations), [], 'Compiled React controls remain interactive');
      for (const path of ['/ui_kits/status-hub/login.html', '/ui_kits/status-hub/settings.html']) {
        await navigate(path, () => document.querySelector('form'));
        assert.equal(await page.locator('form').evaluate(form => !form.dispatchEvent(new Event('submit', {
          cancelable: true,
          bubbles: true
        }))), true, 'Preview submit remains cancelled by an event listener');
        assert.deepEqual(await page.evaluate(() => cspViolations), []);
      }
      // Generated directory indexes retain relative navigation and query strings.
      const redirect = await fetch(base + '/components?probe=1', {
        redirect: 'manual'
      });
      assert.equal(redirect.status, 308);
      assert.equal(redirect.headers.get('location'), '/components/?probe=1');
      await navigate('/components/?probe=1', () => document.querySelector('main ul a'));
      const href = await page.locator('main ul a').first().getAttribute('href');
      assert.equal(new URL(href, page.url()).pathname.startsWith('/components/'), true);
      assert.equal((await fetch(new URL(href, page.url()))).status, 200, 'Relative index links must resolve to an actual resource');
      assert.equal((await fetch(base + '/components/index.html')).headers.get('content-security-policy'), (await fetch(base + '/components/')).headers.get('content-security-policy'));
      const legacy = await fetch(base + '/dashboard/anything?probe=1', {
        redirect: 'manual'
      });
      assert.equal(legacy.headers.get('location'), '/?probe=1');
      // CSP remains enforcement: app readiness alone is insufficient evidence.
      await navigate('/docs/viewer.html?lang=en#docs/consuming.md', () => document.querySelector('#doc')?.dataset.state === 'ready');
      await page.evaluate(() => {
        const script = document.createElement('script');
        script.textContent = 'window.__unknownInlineRan=true';
        document.head.append(script);
        const button = document.createElement('button');
        button.id = 'unknown-handler';
        button.textContent = 'Probe';
        button.setAttribute('onclick', 'window.__unknownHandlerRan=true');
        document.body.append(button);
        button.click();
      });
      await page.waitForFunction(() => cspViolations.some(x => x.directive === 'script-src-elem') && cspViolations.some(x => x.directive === 'script-src-attr'));
      assert.equal(await page.evaluate(() => !!window.__unknownInlineRan || !!window.__unknownHandlerRan), false, 'Unlisted script and native handler must stay blocked');
      assert((await page.evaluate(() => cspViolations)).every(x => x.blocked === 'inline'));
      const result = {
        browser: browserName,
        pass: true,
        templates: templates.length,
        compiledPages: compiledPages.length,
        documents: documents.length,
        bilingualRoutes: documents.length * 2,
        rows,
        negative: {
          unknownInlineBlocked: true,
          unknownHandlerBlocked: true
        }
      };
      results.push(result);
      writeFileSync(join(output, browserName + '.json'), JSON.stringify(result, null, 2) + '\n');
      console.log('PASS ' + browserName + ' all85templates, interpreted/event-listener behavior, aliases/queries and blocked unknown inline script/handler');
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise(done => server.close(done));
}
writeFileSync(join(output, 'receipt.json'), JSON.stringify({
  schemaVersion: 1,
  node: process.version,
  pass: true,
  cspManifestSha256: hash(read('.vercel/output/static/public-site-csp.json')),
  configSha256: hash(read('.vercel/output/config.json')),
  htmlPages: manifest.pages.length,
  routes: deployment.routes.length,
  maxCspBytes: Math.max(...manifest.pages.map(x => Buffer.byteLength(x.csp))),
  scope: 'Local real built static output under generated CSP/routes; no deploy or platform acceptance, inline style policy unchanged',
  results: results.map(({
    rows,
    ...result
  }) => result)
}, null, 2) + '\n');
