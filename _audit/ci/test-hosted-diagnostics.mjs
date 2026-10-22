import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {sourceDocumentHeaders} from './lib/source-document-headers.mjs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const root=new URL('../../',import.meta.url);
// Script permissions follow the actual served body and production deployment policy.
const fixtureHeaders=sourceDocumentHeaders('fixture.html','<script>window.fixtureVersion=1</script>');
assert.notEqual(fixtureHeaders['Content-Security-Policy'],sourceDocumentHeaders('fixture.html','<script>window.fixtureVersion=2</script>')['Content-Security-Policy'],'Changed inline bytes require changed exact CSP hashes');
assert.throws(()=>sourceDocumentHeaders('fixture.html','<button onclick="alert(1)">Bad</button>'),/native inline event handler/);
const provenance=JSON.parse(readFileSync(new URL('_audit/vendor/jsqr/provenance.json',root)));
for(const [name,hash] of Object.entries(provenance.files))assert.equal(createHash('sha256').update(readFileSync(new URL(`_audit/vendor/jsqr/${name}`,root))).digest('hex'),hash,name);
await withBrowserFixture(async page=>{
 const base=new URL(page.url()).origin;
 const external=[];
 await page.route('**/*',async route=>{
   if(!route.request().url().startsWith(base+'/')){external.push(route.request().url());await route.abort();return;}
   if(route.request().resourceType()==='document'){
     const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),...sourceDocumentHeaders(new URL(route.request().url()).pathname.slice(1),await response.text())}});
   }else await route.continue();
 });
 await page.goto(`${base}/_audit/qr-scan-test.html`);
 await page.waitForFunction(()=>window.__qrscan,null,{timeout:35000});
 const qr=await page.evaluate(()=>window.__qrscan);
 await page.evaluate(()=>{window.__diagnosticInlineProbe=false;const script=document.createElement('script');script.textContent='window.__diagnosticInlineProbe=true';document.head.append(script);script.remove()});assert.equal(await page.evaluate(()=>window.__diagnosticInlineProbe),false,'Exact hosted CSP must block an unauthorized inline script');
 assert.equal(qr.pass,true,JSON.stringify(qr));assert.equal(qr.total,3);
 await page.goto(`${base}/_audit/component-visual-diff.html`);
 await page.waitForFunction(()=>window.__componentVisualDiff);
 assert.equal(await page.locator('.cell').count(),12);
 assert.equal(await page.locator('.cs-button').count(),3);
 assert(await page.locator('input').count()>0,'Actual component controls must render');
 assert(!await page.locator('#root').innerText().then(text=>text.includes('missing export')));
 assert.deepEqual(external,[],'Diagnostic must not request external resources');
 // Baseline presence is reported separately from rendering; neither proves
 // visual parity, which still needs the existing review/pixel workflow.
 console.log('PASS hosted diagnostics: 3 QR round trips, 12 rendered review cells, pinned decoder integrity, deployment CSP and no external requests');
});
