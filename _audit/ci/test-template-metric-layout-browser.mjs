import assert from 'node:assert/strict';
import {extractPdfText} from './lib/pdf-text.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.goto(origin+'/templates/bod-deck/BodDeck.dc.html');
 await page.waitForFunction(()=>window.__dcSetContent&&!document.querySelector('.sc-placeholder'));
 const metrics=()=>page.locator('[style*="grid-template-columns"]').filter({hasText:'38'}).last();
 const geometry=()=>metrics().evaluate(grid=>[...grid.children].map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}}));
 await page.evaluate(()=>document.fonts.ready);
 const current=await geometry();
 await metrics().evaluate(grid=>{grid.style.gridTemplateColumns='repeat(4,1fr)';grid.style.overflowWrap='normal'});
 const original=await geometry();
 current.forEach((rect,i)=>{for(const key of ['x','y','width','height'])assert(Math.abs(rect[key]-original[i][key])<.1,'Default geometry changed '+i+'/'+key)});
 await metrics().evaluate(grid=>{grid.style.gridTemplateColumns='repeat(4,minmax(0,1fr))';grid.style.overflowWrap='anywhere'});
 for(const language of ['English','Tiếng Việt']){
  const payload={runway:'<b>É8</b>abcdefg',n4:'METRIC_FOUR'};
  await page.evaluate(({language,payload})=>{__dcSetProps(__dcRootName(),{language});__dcSetContent(__dcRootName(),payload)},{language,payload});
  await page.emulateMedia({media:'print'});await page.evaluate(async()=>{await document.fonts.ready;await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)});
  const parse=async()=>{const bytes=await page.pdf({printBackground:true,preferCSSPageSize:true});return extractPdfText(bytes).text.replace(/\s+/gu,'')};
  assert((await parse()).includes(payload.n4),'Valid maximum-length copy clips fourth metric');
  await metrics().evaluate(grid=>{grid.style.gridTemplateColumns='repeat(4,1fr)';grid.style.overflowWrap='normal'});
  assert(!(await parse()).includes(payload.n4),'Original layout mutation must reproduce clipped fourth metric');
  await metrics().evaluate(grid=>{grid.style.gridTemplateColumns='repeat(4,minmax(0,1fr))';grid.style.overflowWrap='anywhere'});
  await page.emulateMedia({media:'screen'});
 }
},{browserName:'chromium'});
console.log('PASS metric layout: default geometry preserved; EN/VI maximum-length literal copy remains in parsed PDF; original layout mutation fails');
