import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||'chromium';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 const templates=await page.evaluate(async()=>(await(await fetch('/_ds_manifest.json')).json()).templates);
 let links=0,checks=0,skips=0,menus=0;
 for(const template of templates){
  await page.goto(origin+'/'+template.entryPath);
  await page.waitForFunction(()=>window.__dcRootName?.()&&document.querySelector('[data-sc-name]'));
  const languages=await page.evaluate(()=>{const p=JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props'));return p.language?.options||[p.language?.default||null]});
  for(const width of [320,390,1280])for(const language of languages){
   console.log(JSON.stringify({template:template.name,width,language}));
   await page.setViewportSize({width,height:900});
   await page.evaluate(language=>{if(language)window.__dcSetProps(window.__dcRootName(),{language})},language);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(100);
   const skip=page.locator('a.cs-skip');
   if(await skip.count()){
    await skip.focus();const r=await skip.boundingBox();assert(r.width>=44&&r.height>=44,template.name+' focused skip size');
    const href=await skip.getAttribute('href');await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,href,template.name+' skip destination');skips++;
    await page.evaluate(()=>history.replaceState(null,'',location.pathname));
   }
   const trigger=page.locator('[data-cs-export="trigger"]');
   if(await trigger.count()){
    await trigger.tap();assert.equal(await trigger.getAttribute('aria-expanded'),'true');
    for(const kind of ['pdf','docx']){const item=page.locator(`[data-cs-export="${kind}"]`);const r=await item.boundingBox();assert(r.width>=44&&r.height>=44);}
    await page.locator('[data-cs-export="pdf"]').focus();await page.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert(await trigger.evaluate(el=>el===document.activeElement));menus++;
   }
   const anchors=page.locator('a.cs-touch-target');
   for(let i=0;i<await anchors.count();i++){
    const a=anchors.nth(i);if(!await a.isVisible())continue;
    await a.evaluate(el=>{el.dataset.touchActivated='false';el.addEventListener('click',e=>{e.preventDefault();el.dataset.touchActivated='true'},{once:true})});
    await a.scrollIntoViewIfNeeded();const r=await a.boundingBox();await a.tap({position:{x:r.width/2,y:r.height-3}});assert.equal(await a.getAttribute('data-touch-activated'),'true',template.name+' link edge');links++;
   }
   if(template.entryPath.includes('hr-offboarding/')){
    const inputs=page.locator('label.cs-check input[type=checkbox]');
    for(let i=0;i<await inputs.count();i++){
     const input=inputs.nth(i);if(!await input.isVisible())continue;
     const before=await input.isChecked(),label=input.locator('..');await label.scrollIntoViewIfNeeded();const r=await label.boundingBox();await label.tap({position:{x:r.width/2,y:r.height-3}});assert.equal(await input.isChecked(),!before,'Checkbox label edge');checks++;
    }
   }
  }
 }
 console.log(JSON.stringify({browserName,templates:templates.length,links,checks,skips,menus}));
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true}});
