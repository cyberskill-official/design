import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const root=new URL('../../',import.meta.url);
const config=JSON.parse(readFileSync(new URL('vercel.json',root)));
const headers=Object.fromEntries(config.headers.find(rule=>rule.source==='/(.*)').headers.map(({key,value})=>[key,value]));
const provenance=JSON.parse(readFileSync(new URL('_audit/vendor/jsqr/provenance.json',root)));
for(const [name,hash] of Object.entries(provenance.files))assert.equal(createHash('sha256').update(readFileSync(new URL(`_audit/vendor/jsqr/${name}`,root))).digest('hex'),hash,name);
await withBrowserFixture(async page=>{
 const base=new URL(page.url()).origin;
 const external=[];
 await page.route('**/*',async route=>{
   if(!route.request().url().startsWith(base+'/')){external.push(route.request().url());await route.abort();return;}
   if(route.request().resourceType()==='document'){
     const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),...headers}});
   }else await route.continue();
 });
 await page.goto(`${base}/_audit/qr-scan-test.html`);
 await page.waitForFunction(()=>window.__qrscan,null,{timeout:35000});
 const qr=await page.evaluate(()=>window.__qrscan);
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
