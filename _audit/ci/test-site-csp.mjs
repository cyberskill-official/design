import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { compileSiteJsx } from '../../scripts/lib/site-jsx.mjs';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import Ajv from 'ajv';
import { designCsp, htmlScriptSources, loadSitePolicy, buildCspManifest } from '../../scripts/lib/site-csp.mjs';
import { buildSiteRoutes, resolveSiteRequest } from '../../scripts/lib/site-routes.mjs';
import { dcLogicScriptSource } from '../../scripts/template-runtime/dc-logic-source.mjs';
const hash = source => "'sha256-" + createHash('sha256').update(source).digest('base64') + "'";
const policy = loadSitePolicy();
assert.deepEqual(policy.csp['style-src'], ["'self'", "'unsafe-inline'"], 'Existing inline CSS policy remains separate');
assert(!designCsp('<p>Page</p>').value.includes("script-src 'self' 'unsafe-inline'"));
assert(!designCsp('<p>Page</p>').value.includes('nonce-'));
const source = '\nwindow.test = "✓";\n';
assert.deepEqual(htmlScriptSources('<script>' + source + '</script>').map(x => x.hash), [hash(source)]);
assert.equal(htmlScriptSources('<script>\r\nwindow.test=1;\r\n</script>')[0].hash, hash('\nwindow.test=1;\n'), 'Hash browser-normalized script text');
const logic = 'class Component extends DCLogic {}';
const dc = htmlScriptSources('<script type="text/x-dc" data-dc-script>' + logic + '</script>');
assert.equal(dc[0].kind, 'dc-logic-wrapper');
assert.equal(dc[0].hash, hash(dcLogicScriptSource(logic, 'Component')));
const multiple = htmlScriptSources('<script type="text/x-dc" data-dc-script>' + logic + '</script><script type="text/x-dc" data-dc-script>' + logic + '</script>');
assert.equal(multiple[1].token, 'Component1');
assert.notEqual(multiple[0].hash, multiple[1].hash);
assert.equal(htmlScriptSources('<script type="application/json">{"data":true}</script>').length, 0);
assert.equal(htmlScriptSources('<template><script>window.inert=1</script></template>').length, 0);
for (const html of ['<button onclick="doIt()">Action</button>', '<button onclick="{{ binding }}">Action</button>', '<a href="javascript:doIt()">Bad</a>', '<script type="text/babel">newThing()</script>']) assert.throws(() => htmlScriptSources(html));
assert.equal(htmlScriptSources('<button data-cs-on-click="{{ action }}">Action</button>').length, 0);
assert.throws(() => dcLogicScriptSource(logic, 'Component["unsafe"]'));
assert.throws(() => dcLogicScriptSource(null, 'Component'));
const primitive = readFileSync('scripts/template-runtime/primitives/support.js', 'utf8');
const output = readFileSync('templates/_vendor/support.js', 'utf8');
assert(primitive.includes('script.textContent = dcLogicScriptSource(code, token)'));
assert(output.includes(dcLogicScriptSource.toString()), 'Runtime projection must embed the exact shared producer');
new Script(output);
const files = [{
  path: 'index.html',
  html: '<script>' + source + '</script>'
}, {
  path: 'assets/index.html',
  html: '<p>Index</p>'
}, {
  path: 'docs/viewer.html',
  html: '<script>window.docs=1</script>'
}];
const manifest = buildCspManifest(files, {
  serializerSource: 'fixture serializer'
});
const validate = new Ajv({
  strict: false,
  allErrors: true
}).compile(JSON.parse(readFileSync('scripts/site-csp-manifest.schema.json')));
assert(validate(manifest), JSON.stringify(validate.errors));
const invalid = structuredClone(manifest);
delete invalid.pages[0].htmlSha256;
assert.equal(validate(invalid), false);
const config = buildSiteRoutes(manifest, {
  generatedDirectoryIndexes: ['assets/index.html']
});
for (const path of ['/', '/index.html', '/?query=1']) assert.equal(resolveSiteRequest(config, path).headers['Content-Security-Policy'], manifest.pages.find(x => x.path === 'index.html').csp);
assert.equal(resolveSiteRequest(config, '/assets?probe=1').location, '/assets/?probe=1');
assert.deepEqual(resolveSiteRequest(config, '/assets/').headers, resolveSiteRequest(config, '/assets/index.html').headers);
assert.equal(resolveSiteRequest(config, '/dashboard/a?preserve=yes').location, '/?preserve=yes');
assert.equal(resolveSiteRequest(config, '/playground/').location, '/');
assert(!resolveSiteRequest(config, '/docs/viewerXhtml').headers['Content-Security-Policy'].includes(hash('window.docs=1')), 'HTML route regex must escape literal periods');
assert(!resolveSiteRequest(config, '/not-listed.html').headers['Content-Security-Policy'].includes('sha256-'), 'Unknown pages receive no inline authority');
// Preserve non-directory trailing-slash bookmarks without undoing directory
// aliases, expanding inline authority, or introducing redirect loops.
function assertSlashCompatibility(routes) {
  const follow = path => {
    const seen = new Set();
    for (let hops = 0; hops < 4; hops++) {
      assert(!seen.has(path), 'Redirect loop: ' + path);
      seen.add(path);
      const response = resolveSiteRequest(routes, path);
      if (!response.location) return response;
      assert.equal(response.status, 308);
      assert(response.location.startsWith('/') && !response.location.startsWith('//'));
      path = response.location;
    }
    throw Error('Unbounded generated redirect chain');
  };
  for (const [request, destination] of [['/docs/viewer.html/?lang=vi&x=1', '/docs/viewer.html?lang=vi&x=1'], ['/assets/logo.svg/?cache=1', '/assets/logo.svg?cache=1'], ['/not-listed/?query=1', '/not-listed?query=1'], ['/dashboard.html/?probe=1', '/dashboard.html?probe=1']]) {
    const redirect = resolveSiteRequest(routes, request);
    assert.equal(redirect.status, 308, request);
    assert.equal(redirect.location, destination, request);
    assert(!redirect.headers['Content-Security-Policy'].includes('sha256-'));
  }
  assert.equal(follow('/docs/viewer.html/?lang=vi').path, '/docs/viewer.html');
  assert.equal(follow('/assets/logo.svg/?cache=1').path, '/assets/logo.svg');
  assert.equal(follow('/dashboard.html/?probe=1').path, '/index.html');
  for (const path of ['/dashboard', '/dashboard/', '/dashboard.html', '/dashboard/deep/', '/playground', '/playground/', '/playground/deep/']) {
    assert.equal(follow(path + '?legacy=1').path, '/index.html');
  }
  assert.equal(follow('/').path, '/index.html');
  assert.equal(follow('/assets?index=1').path, '/assets/index.html');
  assert.equal(resolveSiteRequest(routes, '/assets/').status, 200, 'Directory aliases must not normalize back to their redirect source');
  assert.equal(resolveSiteRequest(routes, '/assets/index.html/').location, '/assets/index.html');
  assert.equal(resolveSiteRequest(routes, 'http://localhost//escape.invalid/').location, undefined, 'Protocol-relative Location must never be emitted');
}
assertSlashCompatibility(config);
const normalization = config.routes.find(route => route.headers?.Location === '/$1');
assert(normalization, 'Legacy file/non-directory slash normalization route is required');
assert.throws(() => assertSlashCompatibility({
  ...config,
  routes: config.routes.filter(route => route !== normalization)
}), /308/, 'Removing compatibility must fail real request assertions');
const unsupportedCapture = structuredClone(config);
unsupportedCapture.routes.find(route => route.headers?.Location === '/$1').headers.Location = '/$2';
assert.throws(() => resolveSiteRequest(unsupportedCapture, '/docs/viewer.html/'), /Unsupported generated redirect capture/);
const externalRedirect = structuredClone(config);
externalRedirect.routes.find(route => route.headers?.Location === '/$1').headers.Location = '//escape.invalid/';
assert.throws(() => resolveSiteRequest(externalRedirect, '/docs/viewer.html/'), /same-origin/);
const changed = buildCspManifest([{
  path: 'index.html',
  html: '<script>' + source + 'window.changed=1;</script>'
}]);
assert.notEqual(changed.pages[0].csp, manifest.pages.find(x => x.path === 'index.html').csp, 'Any script mutation invalidates permission bytes');
assert.throws(() => designCsp(Array.from({
  length: 100
}, (_, i) => '<script>window.unique' + i + '=true</script>').join('')), /4KiB/);
assert.throws(() => buildSiteRoutes({
  pages: Array.from({
    length: 2050
  }, (_, i) => ({
    path: i + '.html',
    csp: 'fixture'
  }))
}), /budget/);
console.log('PASS static CSP contracts: parser/newline/hash semantics, inert-data/DC shared producer, handler/URL rejection, schema/source identity, exact routes/queries/aliases, unknown path isolation, script mutation and header/route budgets');
const jsxRoot = mkdtempSync(join(tmpdir(), 'cs-site-jsx-'));
try {
  const loader = '<script src="/_vendor/babel/babel.min.js"></script>';
  const jsx = '<script type="text/babel">const C=()=> <button>Action</button>;window.Comp=C;</script>';
  const transformed = compileSiteJsx(loader + jsx, 'card.html', {
    publicRoot: jsxRoot,
    classifiedPaths: new Set()
  });
  assert.equal(transformed.blocks, 1);
  assert(!transformed.html.includes('text/babel'));
  assert(!transformed.html.includes('babel.min.js'));
  assert(transformed.html.includes('React.createElement'));
  assert.equal(htmlScriptSources(transformed.html).length, 1);
  assert.doesNotThrow(() => new Script(transformed.html.slice(8, -9)));
  writeFileSync(join(jsxRoot, 'Card.jsx'), 'window.External=()=> <input />');
  assert.equal(compileSiteJsx(loader + '<script type="text/babel" src="Card.jsx"></script>', 'card.html', {
    publicRoot: jsxRoot,
    classifiedPaths: new Set(['Card.jsx'])
  }).blocks, 1);
  for (const input of [loader + jsx.replace('text/babel"', 'text/babel" data-presets="react"'), loader + jsx.replace('text/babel"', 'text/babel" data-type="module"'), loader + '<script type="text/babel" src="https://elsewhere.invalid/X.jsx"></script>', loader + '<script type="text/babel" src="Card.jsx"></script>', loader + jsx + '<script>Babel.transform("x")</script>']) assert.throws(() => compileSiteJsx(input, 'card.html', {
    publicRoot: jsxRoot,
    classifiedPaths: new Set()
  }));
} finally {
  rmSync(jsxRoot, {
    recursive: true,
    force: true
  });
}
console.log('PASS exact classified JSX build transform, default pinned Babel semantics, source/attribute/origin/API rejection');
for (const route of config.routes.filter(route => route.status)) {
  assert(route.headers.Location);
  assert(!route.dest, 'Redirects use canonical Build Output API Location headers');
}
const require = createRequire(import.meta.url);
const typeScratch = mkdtempSync(join(tmpdir(), 'cs-site-csp-types-'));
try {
  writeFileSync(join(typeScratch, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      noEmit: true,
      strict: true,
      skipLibCheck: false,
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      target: 'ES2022',
      types: []
    },
    files: [resolve('_audit/ci/fixtures/site-csp-types.mts')]
  }));
  execFileSync(process.execPath, [join(dirname(require.resolve('typescript/package.json')), 'bin/tsc'), '-p', join(typeScratch, 'tsconfig.json')], {
    stdio: 'inherit'
  });
} finally {
  rmSync(typeScratch, {
    recursive: true,
    force: true
  });
}
console.log('PASS NodeNext strict typed private .mjs consumer, discriminated source metadata and negative compile contracts');
