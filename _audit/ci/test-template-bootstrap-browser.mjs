import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||'chromium';
const only=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7);
const manifest=JSON.parse(readFileSync('_ds_manifest.json'));
const templates=manifest.templates.filter(t=>!only||t.entryPath.includes('/'+only+'/'));assert(templates.length);
const helpers=manifest.templates.map(t=>t.entryPath.replace(/[^/]+$/,'ds-base.js'));
assert.equal(new Set(helpers.map(p=>readFileSync(p,'utf8'))).size,1,'All template bootstrap copies must share the same source');
const evidence=[];
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.route('**/_vendor/react/react.production.min.js',async route=>{await new Promise(resolve=>setTimeout(resolve,150));await route.continue()});
 await page.route('**/_ds_bundle.js',async route=>{
  const response=await route.fetch(),body=await response.text(),newline=body.indexOf('\n');
  const probe="\n(window.__bundleStarts ||= []).push({react:typeof window.React?.useLayoutEffect==='function',reactDOM:typeof window.ReactDOM?.createRoot==='function'});\n";
  await route.fulfill({response,body:body.slice(0,newline)+probe+body.slice(newline+1)});
 });
 for(const t of templates){
  await page.goto(origin+'/'+t.entryPath);
  await page.waitForFunction(()=>window.__dcRootName?.()&&document.querySelector('[data-sc-name]')&&window.__bundleStarts?.length);
  await page.waitForTimeout(100);
  const row=await page.evaluate(()=>({starts:window.__bundleStarts,errors:window.CyberSkillDS?.__errors||[],renderError:document.querySelector('.sc-logic-error,.sc-placeholder-error')?.textContent,hasBundle:typeof window.CyberSkillDS?.Button==='function'}));
  evidence.push({path:t.entryPath,...row});
  assert.equal(row.starts.length,1,JSON.stringify(evidence.at(-1)));assert.deepEqual(row.starts,[{react:true,reactDOM:true}],JSON.stringify(evidence.at(-1)));
  assert.equal(row.errors.length,0,JSON.stringify(evidence.at(-1)));assert(!row.renderError,JSON.stringify(evidence.at(-1)));assert(row.hasBundle);
  await page.waitForFunction(()=>!document.querySelector('.sc-placeholder'));
 }
},{browserName});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({browserName,evidence},null,2)+'\n');console.log(JSON.stringify({browserName,templates:evidence.length,reactDelayMs:150}));
