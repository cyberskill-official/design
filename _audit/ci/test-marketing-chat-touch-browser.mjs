import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||'chromium';
const evidence=[];
await withBrowserFixture(async page=>{
 const url=new URL('/templates/marketing-page/MarketingPage.dc.html',page.url()).href;
 for(const width of [320,390,1280])for(const language of ['English','Tiếng Việt'])for(const theme of ['light','dark']){
  console.log(JSON.stringify({scenario:{width,language,theme}}));
  await page.setViewportSize({width,height:900});await page.goto(url);await page.waitForFunction(()=>window.__dcRootName?.()&&document.querySelector('[data-sc-name]'));await page.waitForSelector('.cs-button').catch(async error=>{console.error(JSON.stringify(await page.evaluate(()=>({root:window.__dcRootName?.(),alias:typeof window.CyberSkillDS,reactVersion:window.React?.version,layoutEffectType:typeof window.React?.useLayoutEffect,bundleErrors:window.CyberSkillDS?.__errors,scripts:[...document.scripts].map(s=>s.src).filter(Boolean),buttons:document.querySelectorAll('.cs-button').length,text:document.body.innerText.slice(0,600),html:document.body.innerHTML.slice(0,600)}))));throw error});
  await page.evaluate(props=>window.__dcSetProps(window.__dcRootName(),props),{language,theme});await page.waitForTimeout(100);
  const opener=page.getByRole('button',{name:language==='English'?'Talk to Lumi':'Trò chuyện với Lumi',exact:true}).first();await opener.tap();
  const close=page.getByRole('button',{name:language==='English'?'Close':'Đóng',exact:true});await close.waitFor();const r=await close.boundingBox();assert(r.width>=43.99&&r.height>=43.99);
  const point={x:r.x+r.width/2,y:r.y+r.height-2};assert(await close.evaluate((el,p)=>{const hit=document.elementFromPoint(p.x,p.y);return el===hit||el.contains(hit)},point));
  const panel=close.locator('../..');const input=panel.locator('textarea');assert.equal(await input.count(),1);const ir=await input.boundingBox();assert(ir.width>=44&&ir.height>=44);
  const send=panel.locator('.cs-prompt button');const sr=await send.boundingBox();assert(sr.width>=44&&sr.height>=44);
  // This demo has no submit handler; verify activation without inventing a chat response.
  await input.fill('Test wish');await send.evaluate(el=>el.addEventListener('click',()=>{el.dataset.touchActivated='true'},{once:true}));
  await send.tap({position:{x:sr.width/2,y:sr.height-2}});assert.equal(await send.getAttribute('data-touch-activated'),'true');
  await page.touchscreen.tap(point.x,point.y);assert.equal(await close.count(),0);evidence.push({viewport:width,language,theme,close:{width:r.width,height:r.height},input:{width:ir.width,height:ir.height}});
 }
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true}});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({browserName,evidence},null,2)+'\n');console.log(JSON.stringify({browserName,cases:evidence.length}));
