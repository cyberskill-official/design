import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const manifest=JSON.parse(await readFile(new URL('../../_ds_manifest.json',import.meta.url),'utf8'));
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 const check=async()=>{
  await page.goto(origin+'/_audit/esm-smoke-test.html');await page.waitForFunction(()=>window.__esm);
  return page.evaluate(()=>window.__esm);
 };
 assert.equal((await check()).pass,true);
 const live=await page.evaluate(async()=>{
  const legacy=await import('/_esm/cs.mjs');
  return {names:Object.keys(legacy.CS).filter(n=>!n.startsWith('__')),schema:legacy.EDITOR_SCHEMA===legacy.CS.EDITOR_SCHEMA};
 });
 assert.equal(live.schema,true);assert.deepEqual(live.names.sort(),manifest.components.map(c=>c.name).sort());
 for(const [name,mutate] of [
  ['missing shared entry',m=>m.components=m.components.filter(c=>c.name!=='EDITOR_SCHEMA')],
  ['missing kind',m=>delete m.components[0].kind],
  ['missing explicit hook',m=>m.components=m.components.filter(c=>c.name!=='useMessages')],
  ['unknown kind',m=>m.components.find(c=>c.name==='useMessages').kind='unknown'],
  ['unknown entry',m=>m.components.push({name:'NotExposed',kind:'component',sourcePath:'missing.jsx'})],
 ]){
  const m=structuredClone(manifest);mutate(m);
  await page.route('**/_ds_manifest.json',route=>route.fulfill({json:m}));
  assert.equal((await check()).pass,false,name);
  await page.unroute('**/_ds_manifest.json');
 }
});
console.log('PASS export catalog: live bundle/manifest/legacy identities, explicit kinds and missing/unknown metadata failures.');
