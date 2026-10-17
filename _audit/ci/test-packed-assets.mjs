/** Crawl literal resources in every packed HTML/CSS file and module-relative JS edge, then exercise image-slot
 * in an isolated tarball webroot. Does not certify compiler-only exports or every
 * dynamically constructed URL; those require the consumer/platform matrix. */
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, relative, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { parse } from 'parse5';
import { chromium } from 'playwright';
import { moduleResources } from './lib/module-resources.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const scratch = mkdtempSync(join(tmpdir(), 'cs-packed-assets-'));
let server, browser;
try {
  const [pack] = JSON.parse(execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', scratch], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
  const packageRoot = join(scratch, 'package');
  mkdirSync(packageRoot);
  execFileSync('tar', ['-xzf', join(scratch, pack.filename), '-C', packageRoot, '--strip-components=1']);
  const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
  const missing = [], checked = [], dynamic = [], external = [], bareModules = [];
  let moduleFiles = 0, moduleReferences = 0, inlineScriptBlocks = 0;
  function resource(file, value) {
    if (!value || value.startsWith('#') || /^(data|blob|mailto|tel):/i.test(value)) return;
    if (value.includes('{{') || value.includes('${') || value.startsWith('var(')) { dynamic.push({ file, value }); return; }
    if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value)) { external.push({ file, value }); return; }
    const pathname = decodeURIComponent(value.split(/[?#]/)[0]);
    if (!pathname) return;
    const target = resolve(pathname.startsWith('/') ? packageRoot : dirname(file), '.' + (pathname.startsWith('/') ? pathname : '/' + pathname));
    const entry = `${relative(packageRoot, file)} → ${value}`;
    if (!target.startsWith(packageRoot + sep) || !existsSync(target) || !statSync(target).isFile()) missing.push(entry);
    else checked.push(entry);
  }
  function css(file, text) {
    for (const match of text.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)) resource(file, (match[1] ?? match[2] ?? match[3]).trim());
    for (const match of text.matchAll(/@import\s+["']([^"']+)["']/g)) resource(file, match[1]);
  }
  function modules(file, text) {
      const edges = moduleResources(text);
      dynamic.push(...edges.dynamic.map(edge => ({file:relative(packageRoot,file),...edge})));
      for (const edge of edges.references) {
        if (edge.kind !== 'url' && !/^(?:\.{1,2}\/|\/|[a-z][a-z\d+.-]*:)/i.test(edge.value)) {
          bareModules.push({file:relative(packageRoot,file),...edge});
          continue;
        }
        moduleReferences++;
        resource(file, edge.value);
      }
  }
  function html(file, text) {
    const visit = node => {
      const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
      for (const key of ['src', 'poster', 'data']) {
        if (key === 'data' && node.tagName !== 'object') continue;
        if (attrs[key]) resource(file, attrs[key]);
      }
      if (node.tagName === 'link' && /(?:stylesheet|icon|preload|modulepreload)/.test(attrs.rel || '')) resource(file, attrs.href);
      if (attrs.style) css(file, attrs.style);
      if (node.tagName === 'style') css(file, (node.childNodes || []).map(n => n.value || '').join(''));
      if (node.tagName === 'script' && !attrs.src) {
        const type = (attrs.type || '').trim().toLowerCase();
        if (['','module','text/javascript','application/javascript','application/ecmascript','text/ecmascript','text/babel','text/jsx'].includes(type)) {
          const script = (node.childNodes || []).map(n=>n.value || '').join('');
          if (script.trim()) { inlineScriptBlocks++; modules(file,script); }
        }
      }
      for (const child of node.childNodes || []) visit(child);
      if (node.content) visit(node.content);
    };
    visit(parse(text));
  }
  const files = walk(packageRoot);
  for (const file of files) {
    if (file.endsWith('.css')) css(file, readFileSync(file, 'utf8'));
    if (file.endsWith('.html')) html(file, readFileSync(file, 'utf8'));
    if (/\.(?:js|cjs|mjs|jsx)$/.test(file)) {
      moduleFiles++;
      modules(file, readFileSync(file, 'utf8'));
    }
  }
  assert.deepEqual(missing, [], 'Packed literal HTML/CSS/module resources must resolve to files');
  assert(checked.length > 0, 'Resource crawl must not be empty');
  assert(moduleFiles > 0 && moduleReferences > 0, 'Packed module crawl must not be empty');
  // Failure-path probes stay inside the extracted scratch package.
  const previous = missing.length;
  resource(join(packageRoot,'_esm/react.mjs'),'./missing-module-fixture.js');
  resource(join(packageRoot,'_esm/react.mjs'),'../components/');
  assert.equal(missing.length,previous+2,'Missing module files and directory targets must fail closure');
  missing.splice(previous);
  const actualInlineBlocks=inlineScriptBlocks, actualModuleReferences=moduleReferences;
  html(join(packageRoot,'inline-probe.html'), '<script type="module">import "./missing-inline-module.js";</script>');
  assert.equal(missing.length,previous+1,'Missing inline module import must fail closure');
  missing.splice(previous);
  html(join(packageRoot,'inline-probe.html'), '<script type="application/ld+json">import "./not-code.js";</script><script type="application/json">{ "invalid JS": true }</script>');
  assert.equal(missing.length,previous,'Data script blocks must not be interpreted as JavaScript');
  assert.throws(()=>html(join(packageRoot,'inline-probe.html'), '<script type="module">import {</script>'),/Unexpected/,'Invalid executable script cannot silently pass');
  inlineScriptBlocks=actualInlineBlocks; moduleReferences=actualModuleReferences;
  console.log('Unresolved computed module references (not certified):', dynamic.filter(edge=>edge.kind));

  // Only the extracted package is served: the checkout cannot hide a pack omission.
  const failed = [], pageErrors = [], writes = [];
  const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.woff2':'font/woff2', '.svg':'image/svg+xml' };
  server = createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Sidecars are optional authoring state, not package assets. Empty state is
    // explicit here so this fixture tests imports/image behavior without a host.
    if (pathname.endsWith('/.image-slots.state.json')) { res.setHeader('Content-Type','application/json'); res.end('{}'); return; }
    const file = resolve(packageRoot, '.' + pathname);
    if (!file.startsWith(packageRoot + sep) || !existsSync(file) || !statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch();
  // Fresh document forces the legacy entry to load its dynamically named bundle
  // and local React runtimes. A CDN must not hide a missing packaged resource.
  writeFileSync(join(packageRoot,'packed-module-fixture.html'), '<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,"><div id="root"></div>');
  const legacy = await browser.newPage();
  const legacyRequests = [], legacyFailures = [];
  const origin = `http://127.0.0.1:${server.address().port}`;
  await legacy.route('**/*', route => {
    if (new URL(route.request().url()).origin !== origin) { legacyFailures.push('external '+route.request().url()); return route.abort(); }
    return route.continue();
  });
  legacy.on('response',response=>{ legacyRequests.push(new URL(response.url()).pathname); if(response.status()>=400) legacyFailures.push(response.url()); });
  await legacy.goto(origin+'/packed-module-fixture.html');
  await legacy.evaluate(async()=>{
    const module=await import('./_esm/cs.mjs');
    if(module.CS.__errors.length) throw Error('Legacy component load errors');
    ReactDOM.flushSync(()=>ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(module.Button,null,'Packed action')));
  });
  assert.equal(await legacy.getByRole('button',{name:'Packed action'}).count(),1);
  for(const path of ['/_ds_bundle.js','/_vendor/react/react.production.min.js','/_vendor/react/react-dom.production.min.js']) assert(legacyRequests.includes(path), 'Legacy runtime must request packaged '+path);
  assert.deepEqual(legacyFailures,[], 'Legacy consumer must close over local packed assets');
  await legacy.close();
  const page = await browser.newPage();
  await page.exposeFunction('recordImageWrite', (path, content) => writes.push({ path, content }));
  await page.addInitScript(() => { window.omelette = { writeFile: (path, content) => window.recordImageWrite(path, content) }; });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await page.goto(`http://127.0.0.1:${server.address().port}/templates/image-slots-demo.html`);
  await page.waitForFunction(() => customElements.get('image-slot'));
  assert.equal(await page.locator('image-slot').count(), 6);
  // Upload a real raster through the exposed file input, exercising decoding,
  // canvas normalization, display and the host persistence boundary.
  const png = await page.evaluate(() => { const c=document.createElement('canvas'); c.width=32; c.height=24; const x=c.getContext('2d'); x.fillStyle='#45210e'; x.fillRect(0,0,32,24); return c.toDataURL('image/png').split(',')[1]; });
  await page.locator('#demo-c1 input[type=file]').setInputFiles({name:'packed-fixture.png', mimeType:'image/png', buffer:Buffer.from(png,'base64')});
  await page.waitForFunction(() => { const image=document.querySelector('#demo-c1').shadowRoot.querySelector('img'); return image.complete && image.naturalWidth > 0 && image.src.startsWith('data:image/'); });
  await page.waitForFunction(() => document.querySelector('#demo-c1').hasAttribute('data-filled'));
  assert(writes.some(write => write.path === '.image-slots.state.json' && write.content.includes('demo-c1')), 'Uploaded image must reach the host persistence boundary');
  assert.deepEqual(failed, []);
  assert.deepEqual(pageErrors, []);
  console.log('PASS packed assets', { files: files.length, literalReferences: checked.length, dynamicReferences: dynamic.length, externalReferences: external.length, moduleFiles, inlineScriptBlocks, moduleReferences, bareModuleReferences: bareModules.length, imageSlots: 6, upload: true, legacyLocalRuntime: true });
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
  rmSync(scratch, { recursive:true, force:true });
}
