import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.addScriptTag({url:`${origin}/_audit/lib/frame-probe.js`});
 const declaration=`<script data-props='{"language":{"options":["English","Tiếng Việt"]}}'></script>`;
 const ready=`window.__dcRootName=()=>"Fixture";window.__dcSetProps=()=>{};`;
 const style='<style>:root{--cs-color-brand-umber:#45210e}</style>';
 const put=async(name,body)=>page.route(`**/${name}.html`,route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body><div data-sc-name="Fixture">'+body+'</div>'}));
 await put('delayed',declaration+`<script>setTimeout(()=>{${ready}document.head.insertAdjacentHTML('beforeend',${JSON.stringify(style)});},180)</script>`);
 await put('no-bootstrap',declaration+style);
 await put('no-style',declaration+`<script>${ready}</script>`);
 await put('ready',declaration+style+`<script>${ready}</script>`);
 await put('render-error',declaration+style+`<script>${ready}</script><div class="sc-logic-error">Broken component</div>`);
 await put('bundle-error',declaration+style+`<script>${ready}window.CyberSkillDS={__errors:[{path:'component.jsx',error:'Missing React'}]};</script>`);
 await put('pending-import',declaration+style+`<div class="sc-placeholder">Loading</div><script>${ready}setTimeout(()=>document.querySelector('.sc-placeholder').remove(),180);</script>`);
 await put('failed-import',declaration+style+`<script>${ready}</script><div class="sc-placeholder-error">Missing export</div>`);
 await put('kit-empty',style+'<div id="root"></div>');
 await put('kit-delayed',style+'<div id="root"></div><script>setTimeout(()=>document.getElementById("root").innerHTML="<main>Kit mounted</main>",120)</script>');
 await put('kit-runtime-error',style+'<main>Kit mounted</main><script>addEventListener("error",e=>e.preventDefault());setTimeout(()=>{throw Error("Kit late failure")},180)</script>');
 await put('no-fonts' ,declaration+style+`<script>${ready}Object.defineProperty(document.fonts,'ready',{value:new Promise(()=>{})});</script>`);
 await page.route('**/late.css',async route=>{await new Promise(r=>setTimeout(r,180));await route.fulfill({contentType:'text/css',body:'body{--late-sheet:ready}'});});
 await page.route('**/late-mount.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body>'+declaration+style+`<script>${ready}setTimeout(()=>{document.body.insertAdjacentHTML('beforeend','<div data-sc-name="Fixture">Mounted</div>');const link=document.createElement('link');link.rel='stylesheet';link.href='/late.css';document.head.append(link);},120)</script>`}));
 const result=await page.evaluate(async()=>{
  const run=(name,options={})=>csProbeFrame('/'+name+'.html',{parent:document.body,timeout:1500,measure:()=>({pass:true}),...options});
  let measurements=0;
  const pending=run('delayed',{measure:()=>({pass:true,count:++measurements})});
  setTimeout(()=>document.querySelector('iframe')?.dispatchEvent(new Event('load')),70);
  setTimeout(()=>document.querySelector('iframe')?.dispatchEvent(new Event('load')),100);
  const delayed=await pending;
  const lateMount=await run('late-mount',{timeout:1500,measure:({doc,win})=>({sheet:win.getComputedStyle(doc.body).getPropertyValue('--late-sheet').trim()})});
  const kitReady=({doc})=>!!doc.querySelector('main');
  const kitEmpty=await run('kit-empty',{template:false,ready:kitReady,timeout:250});
  const kitDelayed=await run('kit-delayed',{template:false,ready:kitReady});
  const kitRuntime=await run('kit-runtime-error',{template:false,ready:kitReady,measure:async({wait})=>{await wait(400);return {pass:true};}});
  const noBootstrap=await run('no-bootstrap');
  const noStyle=await run('no-style');
  const noFonts=await run('no-fonts');
  const renderError=await run('render-error'),bundleError=await run('bundle-error'),failedImport=await run('failed-import');
  const pendingImport=await run('pending-import',{measure:({doc})=>({resolved:!doc.querySelector('.sc-placeholder')})});
  const thrown=await run('ready',{measure:()=>{throw Error('measurement fixture');}});
  let lateMutation=false;
  const cancelled=await run('ready',{timeout:500,measure:async({wait})=>{await wait(900);lateMutation=true;return {pass:true};}});
  await new Promise(r=>setTimeout(r,600));
  return {kitEmpty,kitDelayed,kitRuntime,delayed,lateMount,noBootstrap,noStyle,noFonts,renderError,bundleError,failedImport,pendingImport,thrown,cancelled,lateMutation,frames:document.querySelectorAll('iframe').length};
 });
 assert.match(result.kitEmpty.error,/surface mount/,'Empty raw kits cannot produce geometry passes');
 assert.equal(result.kitDelayed.pass,true);
 assert.match(result.kitRuntime.error,/Frame runtime error:.*Kit late failure/);
 assert.equal(result.delayed.pass,true);
 assert.equal(result.lateMount.sheet,'ready','Exposed runtime API is insufficient before mount and dynamic CSS complete');
 assert.equal(result.delayed.count,1,'Duplicate load events must not start competing probes');
 assert.match(result.noBootstrap.error,/template bootstrap/);
 assert.match(result.noStyle.error,/stylesheet readiness/);
 assert.match(result.noFonts.error,/fonts/);
 assert.match(result.renderError.error,/Template render error: Broken component/);
 assert.match(result.bundleError.error,/Template bundle errors:.*Missing React/);
 assert.match(result.failedImport.error,/Template render error: Missing export/);
 assert.equal(result.pendingImport.resolved,true,'Unresolved imports cannot produce an empty passing measurement');
 assert.match(result.thrown.error,/measurement fixture/);
 assert.match(result.cancelled.error,/measurement/);
 assert.equal(result.lateMutation,false,'Timed-out callbacks must not continue measurement');
 assert.equal(result.frames,0,'All outcomes clean up their iframe');
 // Exercise the actual gate aggregate: empty or invalid manifest cannot pass.
 await page.route('**/_ds_manifest.json',route=>route.fulfill({json:{templates:[]}}));
 for(const [gate,key] of [['responsive-overflow','__overflow'],['responsive-overflow-320','__overflow320'],['language-overflow','__language'],['theme-overflow','__theme']]){
  await page.goto(`${origin}/_audit/${gate}.html`);await page.waitForFunction(key=>window[key],key);
  assert.equal(await page.evaluate(key=>window[key].pass,key),false,gate);
 }
 await page.unroute('**/_ds_manifest.json');
 await page.route('**/_ds_manifest.json',route=>route.fulfill({json:{templates:[{name:'Invalid document',entryPath:'broken.dc.html'}]}}));
 await put('broken.dc','<div>Missing template contract</div>');
 for(const [gate,key] of [['responsive-overflow','__overflow'],['responsive-overflow-320','__overflow320'],['language-overflow','__language'],['theme-overflow','__theme']]){
  await page.goto(`${origin}/_audit/${gate}.html`);await page.waitForFunction(key=>window[key],key);
  const verdict=await page.evaluate(key=>window[key],key);
  assert.equal(verdict.pass,false,gate);assert.match(verdict.results[0].error,/Missing template props/);
 }
 const error=await page.evaluate(()=>measure({defaultView:null}));
 assert(error.error,'Invalid documents must report measurement errors');
 // A valid template and styled but empty raw kit must fail both aggregates.
 await page.unroute('**/_ds_manifest.json');
 await page.route('**/ui_kits/status-hub/index.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><head>'+style+'</head><body><div id="root"></div></body></html>'}));
 // Gate identifies template paths through their .dc.html contract.
 await page.route('**/_ds_manifest.json',route=>route.fulfill({json:{templates:[{name:'Valid fixture',entryPath:'valid.dc.html'}]}}));
 await put('valid.dc',declaration+style+`<script>${ready}</script>`);
 for(const [gate,key] of [['responsive-overflow','__overflow'],['responsive-overflow-320','__overflow320']]){
  await page.goto(`${origin}/_audit/${gate}.html`);await page.waitForFunction(key=>window[key],key,{timeout:40000});
  const verdict=await page.evaluate(key=>window[key],key);
  assert.equal(verdict.pass,false,gate);
  assert.match(verdict.results.find(row=>row.name==='Kit · Status Hub').error,/surface mount/);
 }
});
console.log('PASS frame probes: delayed readiness, missing bootstrap/styles, measurement errors, bounded cancellation, cleanup, empty manifests and empty raw-kit rejection at320/390');
