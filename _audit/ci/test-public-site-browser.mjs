/** Post-build public-webroot probe; never serves the repository as a fallback. */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve, join, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { listFiles } from '../../scripts/public-site.mjs';
import { verifyFreshness } from '../../scripts/storybook-fingerprint.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const publicRoot=resolve(root,'.vercel-static');
const manifest=JSON.parse(readFileSync(join(publicRoot,'public-site-manifest.json'),'utf8'));
assert.equal(manifest.schemaVersion,1);
assert(manifest.files.length>0);
assert.deepEqual(manifest.files.map(entry=>entry.path).sort(),listFiles(publicRoot).filter(path=>path!=='public-site-manifest.json').sort(),'Manifest must cover exactly the public webroot');
for(const entry of manifest.files){
 const bytes=readFileSync(join(publicRoot,entry.path));
 assert.equal(bytes.length,entry.bytes,entry.path);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.path);
 assert(entry.audience&&entry.purpose,entry.path);
}
const stamp=JSON.parse(readFileSync(join(publicRoot,'.cs-freshness.json'),'utf8'));
assert.equal(manifest.sourceHash,stamp.sourceHash,'Manifest source must match the built source');
verifyFreshness(root,stamp);
const deployment=JSON.parse(readFileSync(join(root,'vercel.json'),'utf8'));
const headers=deployment.headers.find(rule=>rule.source==='/(.*)').headers;
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.md':'text/plain','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{try{let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(path.endsWith('/'))path+='index.html';const file=resolve(publicRoot,'.'+path);if(!file.startsWith(publicRoot+sep))throw Error('outside');for(const {key,value} of headers)res.setHeader(key,value);res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try {
 const base=`http://127.0.0.1:${server.address().port}`;
 for(const path of ['.github/workflows/design-system-gates.yml','package-lock.json','scripts/public-site-policy.json','scripts/build-storybook.mjs','scripts/generate-reference-catalog.mjs','_audit/ci/run-gates.mjs'])assert.equal((await fetch(`${base}/${path}`)).status,404,path);
 browser=await chromium.launch();const page=await browser.newPage();
 for(const [path,key] of [['docs-storybook-coverage','__docssbcoverage'],['docs-link-check','__docslinkcheck'],['docs-consistency','__docs'],['design-md-parity','__designmd'],['package-exports-integrity','__pkgexports'],['consumer-smoke-test','__smoke'],['a11y-gate','__a11y'],['component-behavior-test','__behavior'],['qr-scan-test','__qrscan'],['template-schema-test','__schemav2']]){
   await page.goto(`${base}/_audit/${path}.html`);
   await page.waitForFunction(key=>Boolean(window[key]),key,{timeout:65000});
   const verdict=await page.evaluate(key=>window[key],key);
   assert(verdict.pass,`${path}: ${JSON.stringify(verdict)}`);
   console.log(`PASS public webroot ${path}`);
 }
 // The optional last report and comparator are published diagnostics. A webroot
 // lacks the private inventory/lockfile needed to certify repository input identity.
 await page.goto(`${base}/_audit/pixel-ci.html`);
 await page.waitForFunction(()=>window.__pixelci,null,{timeout:65000});
 const pixel=await page.evaluate(()=>window.__pixelci);
 assert.equal(pixel.pass,false,'Public diagnostics cannot certify absent repository inputs');
 assert.equal(pixel.hard,true);assert.equal(pixel.total,15);assert.equal(pixel.found,15);
 assert(!['unavailable','error'].includes(pixel.reportState),'Shared receipt module must load under deployment CSP');
 if(pixel.reportState==='valid')assert.equal(pixel.sourceState,'not_current','Complete public receipts still require private current-source verification');
 else assert(['missing','invalid'].includes(pixel.reportState),'Optional absent/invalid receipts remain explicit failures');
 for(const path of ['scripts/public-site-policy.json','package-lock.json'])assert.equal((await fetch(`${base}/${path}`)).status,404,path);
 for(const path of ['_audit/ci/test-doc-count-claims-browser.mjs','_audit/ci/test-focus-indicator-browser.mjs','_audit/ci/lib/focus-indicator.mjs','_audit/ci/fixtures/focus-indicator-cases.mjs'])assert.equal((await fetch(`${base}/${path}`)).status,404,path);
 const helper=await fetch(`${base}/_audit/lib/pixel-report-contract.mjs`);
 assert.equal(helper.status,200);assert.equal(await helper.text(),readFileSync(join(root,'_audit/lib/pixel-report-contract.mjs'),'utf8'));
 console.log('PASS public webroot Pixel diagnostic: shared module loads under CSP; incomplete repository source access fails explicitly');
 await page.goto(`${base}/_audit/component-visual-diff.html`);
 await page.waitForFunction(()=>window.__componentVisualDiff);
 assert.equal(await page.locator('.cell').count(),12,'Visual-review cells must render under deployment CSP');
 assert.equal(await page.locator('.cs-button').count(),3);
 const progress=await page.locator('.cs-progress').evaluate(bar=>({track:bar.getBoundingClientRect().width,fill:bar.firstElementChild.getBoundingClientRect().width,height:bar.firstElementChild.getBoundingClientRect().height}));
 assert(progress.height>0 && Math.abs(progress.fill/progress.track-.64)<.01,'Packaged ProgressBar must visibly render its value');
 console.log('PASS public webroot visual-review rendering (not pixel parity)');
 await page.goto(base);await page.waitForSelector('.sidebar-container',{timeout:30000});
 console.log(`PASS public webroot: ${manifest.files.length} inventoried files; private paths return 404`);
} finally{await browser?.close();await new Promise(r=>server.close(r));}
