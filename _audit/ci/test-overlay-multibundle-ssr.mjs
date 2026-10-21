import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium',
  source = resolve('components/overlays/OverlayManager.jsx'),
  scratch = mkdtempSync(join(tmpdir(), 'cs-overlay-copy-ssr-'));
const receipts = [];
try {
  const react18 = join(scratch, 'react18');
  mkdirSync(react18);
  for (const name of ['package.json', 'package-lock.json']) copyFileSync(resolve('_audit/ci/fixtures/react18-consumer', name), join(react18, name));
  const installed = spawnSync('npm', ['ci', '--ignore-scripts'], {
    cwd: react18,
    encoding: 'utf8',
    timeout: 120000
  });
  assert.equal(installed.status, 0, installed.stdout + installed.stderr);
  for (const [major, runtimeRoot] of [[18, react18], [19, resolve('.')]]) {
    const require = createRequire(join(runtimeRoot, 'package.json')),
      React = require('react'),
      server = require('react-dom/server');
    assert(React.version.startsWith(String(major) + '.'));
    assert.equal(typeof globalThis.document, 'undefined');
    assert.equal(typeof globalThis.window, 'undefined');
    const result = await build({
      entryPoints: [source],
      bundle: true,
      write: false,
      platform: 'node',
      format: 'cjs',
      external: ['react']
    });
    const code = result.outputFiles[0].text,
      load = () => {
        const module = {
          exports: {}
        };
        new Function('module', 'exports', 'require', code)(module, module.exports, require);
        return module.exports;
      };
    const A = load(),
      B = load();
    assert.notEqual(A.getOverlayManager(), B.getOverlayManager(), 'SSR modules use inert local fallbacks without a document singleton');
    assert.equal(A.getOverlayManager().depth, 0);
    assert.equal(B.getOverlayManager().scrollLocked, false);
    const h = React.createElement,
      App = () => h(React.StrictMode, null, h(A.OverlayProvider, null, h('p', null, 'Copy A')), h(B.OverlayProvider, null, h('p', null, 'Copy B')), h(A.OverlayProvider));
    const warnings = [],
      oldError = console.error;
    let html;
    try {
      console.error = (...args) => warnings.push(args.join(' '));
      html = server.renderToString(h(App));
    } finally {
      console.error = oldError;
    }
    assert.deepEqual(warnings, []);
    assert.equal((html.match(/data-cs-overlay-root/g) || []).length, 3);
    assert.equal(/\sid=/.test(html), false, 'SSR omits document-allocated marker IDs; no duplicate IDs or invented hydration identity');
    const browserBundle = async name => (await build({
      stdin: {
        contents: `import * as Copy from ${JSON.stringify(source)}; window.${name}=Copy;`,
        resolveDir: resolve('.')
      },
      bundle: true,
      write: false,
      format: 'iife',
      plugins: [{
        name: 'external-react',
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
        }
      }]
    })).outputFiles[0].text;
    const [a, b] = await Promise.all([browserBundle('OverlaySSR_A'), browserBundle('OverlaySSR_B')]);
    await withBrowserFixture(async page => {
      const errors = [];
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.addScriptTag({
        content: a
      });
      await page.addScriptTag({
        content: b
      });
      await page.evaluate(html => {
        const mount = document.createElement('div');
        mount.id = 'overlay-hydration';
        mount.innerHTML = html;
        document.body.append(mount);
        window.recoveries = [];
        const h = React.createElement;
        window.OverlayHydrateApp = () => h(React.StrictMode, null, h(OverlaySSR_A.OverlayProvider, null, h('p', null, 'Copy A')), h(OverlaySSR_B.OverlayProvider, null, h('p', null, 'Copy B')), h(OverlaySSR_A.OverlayProvider));
        window.overlayHydrationRoot = ReactDOM.hydrateRoot(mount, h(OverlayHydrateApp), {
          onRecoverableError: error => recoveries.push(String(error))
        });
      }, html);
      await page.waitForFunction(() => [...document.querySelectorAll('#overlay-hydration [data-cs-overlay-root]')].every(el => el.id));
      const ids = await page.locator('#overlay-hydration [data-cs-overlay-root]').evaluateAll(nodes => nodes.map(el => el.id));
      assert.equal(new Set(ids).size, 3);
      await page.evaluate(() => ReactDOM.flushSync(() => overlayHydrationRoot.render(React.createElement(OverlayHydrateApp))));
      assert.deepEqual(await page.locator('#overlay-hydration [data-cs-overlay-root]').evaluateAll(nodes => nodes.map(el => el.id)), ids, 'Ordinary rerenders retain marker identity');
      assert.deepEqual(await page.evaluate(() => recoveries), []);
      assert.deepEqual(errors, []);
      assert.equal(await page.evaluate(() => OverlaySSR_A.getOverlayManager() === OverlaySSR_B.getOverlayManager()), true);
      await page.evaluate(() => ReactDOM.flushSync(() => overlayHydrationRoot.unmount()));
      assert.equal(await page.locator('#overlay-hydration [data-cs-overlay-root]').count(), 0);
      assert.equal(await page.evaluate(() => OverlaySSR_A.getOverlayManager().depth), 0);
      receipts.push({
        react: React.version,
        browserName,
        markerIds: ids,
        status: 'PASS'
      });
    }, {
      browserName,
      development: true,
      reactRuntimeRoot: runtimeRoot
    });
  }
  mkdirSync('test-results/overlay-multibundle', {
    recursive: true
  });
  writeFileSync(`test-results/overlay-multibundle/ssr-${browserName}.json`, JSON.stringify({
    status: 'PASS',
    sourceSha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
    receipts,
    scope: 'Two independently compiled modules, no-DOM SSR fallbacks and three StrictMode provider markers; real matching React18/19 development hydration in selected engine. No cross-major React tree mixing or iframe/shadow-root runtime ownership is claimed.'
  }, null, 2) + '\n');
  console.log('PASS ' + browserName + ': React18/19 two-copy DOM-free SSR, unique marker hydration, stable rerender and cleanup');
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
