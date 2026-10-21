import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 for(const width of [768,1280]) {
  await page.goto(`${origin}/_audit/responsive-overflow.html?width=${width}`);
  await page.waitForFunction(()=>typeof window.__overflow?.pass==='boolean',null,{timeout:180000});
  const verdict=await page.evaluate(()=>window.__overflow);
  assert.equal(verdict.pass,true,JSON.stringify({width,...verdict}));
  assert.equal(verdict.done,verdict.total);
  assert(verdict.total>0&&verdict.results.every(result=>result.width===width));
  console.log(`PASS whole-set responsive overflow: ${width}px, ${verdict.total} templates/kits`);
 }
});
