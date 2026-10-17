import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {observeFreshCopyFeedback} from './lib/copy-feedback-observation.mjs';
const rows=[];
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 await page.addInitScript(()=>{window.__writes=[];window.__blockWrite=false;window.__rejectWrite=false;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{__writes.push(text);if(__rejectWrite)throw Error('controlled rejection');if(__blockWrite)await new Promise(resolve=>window.__releaseWrite=resolve)}}})});
 const url=new URL('/tokens/viewer.html',page.url()).href;
 for(const scenario of ['expired-success','missing-feedback','stale-feedback','wrong-button','delayed-write','rejected-write']){
  await page.goto(url);await page.waitForFunction(()=>window.__csTokensViewer?.rows>0);
  const target=page.locator('#tbody .copy').first();await target.scrollIntoViewIfNeeded();const text=await target.getAttribute('data-v');
  if(['missing-feedback','stale-feedback','wrong-button'].includes(scenario))await target.evaluate((el,scenario)=>{
   if(scenario==='stale-feedback')el.classList.add('ok');
   const original=DOMTokenList.prototype.add,other=document.querySelectorAll('#tbody .copy')[1];
   DOMTokenList.prototype.add=function(...tokens){if(this===el.classList&&tokens.includes('ok')){if(scenario==='wrong-button')original.apply(other.classList,tokens);return}return original.apply(this,tokens)};
  },scenario);
  if(scenario==='delayed-write')await page.evaluate(()=>window.__blockWrite=true);
  if(scenario==='rejected-write')await page.evaluate(()=>{window.__rejectWrite=true;document.execCommand=()=>false});
  const feedback=await observeFreshCopyFeedback(target);
  try{
   await target.click();await page.waitForFunction(()=>__writes.length===1);assert.equal(await page.evaluate(()=>__writes[0]),text);
   if(scenario==='expired-success'){
    await page.waitForTimeout(1100);assert.equal(await target.evaluate(el=>el.classList.contains('ok')),false);
    assert.equal((await feedback.wait()).seen,true,'Must retain actual transition after expiry');
   }else if(scenario==='delayed-write'){
    assert.equal((await feedback.read()).seen,false);assert.equal(await target.evaluate(el=>el.classList.contains('ok')),false);
    await page.evaluate(()=>__releaseWrite());assert.equal((await feedback.wait()).seen,true);
   }else{
    await assert.rejects(feedback.wait(80),/No fresh copy feedback/);
    if(scenario==='stale-feedback')assert.equal(await target.evaluate(el=>el.classList.contains('ok')),true,'A stale class must not pass');
    if(scenario==='wrong-button')assert.equal(await page.locator('#tbody .copy').nth(1).evaluate(el=>el.classList.contains('ok')),true);
   }
   rows.push({browserName,scenario,passed:true});
  }finally{await feedback.dispose()}
 }
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
console.log(JSON.stringify({cases:rows.length,failures:0,scope:'Actual token viewer feedback observer controls: expiry accepted only with fresh observed transition; missing/stale/wrong-button/rejected feedback rejected; deferred write stays unaccepted until success. Three engines; no user clipboard or human acceptance.'}));
