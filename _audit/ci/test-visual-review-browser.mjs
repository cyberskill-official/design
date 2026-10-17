import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const evidence=process.argv.find(arg=>arg.startsWith('--evidence='))?.slice(11);
const browserName=process.env.CS_BROWSER||'chromium',source=readFileSync(fileURLToPath(new URL('../visual-diff.html',import.meta.url)),'utf8'),cases=['delayed-update','missing-api','null-root','missing-root','ignored-update','throwing-update','missing-css','missing-depth','fonts-loading'],rows=[];
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;let mode='delayed-update';
 await page.route('**/_audit/visual-diff.html',r=>r.fulfill({contentType:'text/html',body:source.replace('performance.now()+15000','performance.now()+300')}));
 await page.route('**/templates/dashboard/Dashboard.dc.html',r=>{
  const css=mode==='missing-css'?'':':root{--cs-color-brand-umber:#45210E;'+(mode==='missing-depth'?'':'--cs-depth-modal:1000;--cs-depth-toast:1100;')+'}';
  const root=mode==='missing-root'?'':'<main data-sc-name="Dashboard"><section data-theme="light">Fixture</section></main>';
  let api=mode==='missing-api'?'':'window.__dcRootName=()=>'+(mode==='null-root'?'null':'"Dashboard"')+';window.__dcSetProps=(_,props)=>{'+(mode==='throwing-update'?'throw Error("fixture setter error")':mode==='ignored-update'?'':mode==='delayed-update'?'setTimeout(()=>document.querySelector("section").dataset.theme=props.theme,50);':'document.querySelector("section").dataset.theme=props.theme;')+'};';
  if(mode==='fonts-loading')api+='Object.defineProperty(document,"fonts",{value:{status:"loading"}});';
  return r.fulfill({contentType:'text/html',body:'<!doctype html><style>'+css+'</style>'+root+'<script>'+api+'</script>'});
 });
 for(mode of cases){
  await page.goto(origin+'/_audit/visual-diff.html');await page.waitForFunction(()=>window.__visualdiff);
  await page.getByRole('button',{name:'dashboard-dark',exact:true}).click();
  await page.waitForFunction(()=>['ready','error'].includes(window.__visualLive?.state)&&__visualLive.slug==='dashboard-dark');
  const result=await page.evaluate(()=>({live:__visualLive,advisory:__visualdiff,status:document.getElementById('live-status').textContent}));
  assert.equal(result.live.state,mode==='delayed-update'?'ready':'error',JSON.stringify({mode,result}));assert.equal(result.advisory.pass,true,'Advisory remains explicitly inventory/freshness, not a live render assertion');
  if(mode==='delayed-update')assert.equal(result.live.actualTheme,'dark');else assert(result.status.includes('unavailable'));
  rows.push({mode,...result});
 }
 mode='delayed-update';await page.goto(origin+'/_audit/visual-diff.html');await page.waitForFunction(()=>window.__visualdiff);await page.getByRole('button',{name:'dashboard-dark',exact:true}).click();await page.getByRole('button',{name:'dashboard',exact:true}).click();await page.waitForFunction(()=>window.__visualLive?.state==='ready'&&__visualLive.slug==='dashboard');await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>__visualLive.slug),'dashboard');assert.equal(await page.locator('#live-status').textContent(),'Live rendering ready: dashboard');rows.push({mode:'newer-selection-owns-feedback',result:await page.evaluate(()=>__visualLive)});
},{browserName});
if(evidence)writeFileSync(resolve(evidence),JSON.stringify({state:'bounded_controller_verification',scope:'Actual source controller with9 explicit DC/style/font fixtures and current-selection ownership case. Only the declared settling deadline is reduced300ms for negative cases; this is not native font/device/AT or source acceptance.',rows},null,2)+'\n');console.log('PASS visual review renderer',browserName,rows.length,'cases; error/timeout/stale result feedback stays separate from baseline freshness');
