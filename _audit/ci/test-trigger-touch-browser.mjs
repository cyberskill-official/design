import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||'chromium';
const evidence=[];
await withBrowserFixture(async page=>{
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
 const check=async locator=>{await locator.scrollIntoViewIfNeeded();const r=await locator.boundingBox();assert(r.width>=43.99&&r.height>=43.99,JSON.stringify({html:await locator.evaluate(el=>el.outerHTML.slice(0,180)),...r}));const p={x:r.x+r.width/2,y:r.y+r.height-2};assert(await locator.evaluate((el,p)=>{const hit=document.elementFromPoint(p.x,p.y);return el===hit||el.contains(hit)},p));return {width:r.width,height:r.height,point:p}};
 for(const width of [320,390,1280])for(const lang of ['en','vi'])for(const density of ['comfortable','compact'])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:900});
  for(const name of ['Menu','Popover','Popconfirm','Tooltip','HoverCard'])for(const kind of ['text','button','anchor','span']){
   if(name==='HoverCard'&&kind==='text')continue; // Its declared trigger must itself be focusable.
   await page.evaluate(({name,kind,lang,density,theme})=>{
    const h=React.createElement;renderFixture(null);const label=lang==='vi'?'Mở':'Open';
    const trigger=kind==='text'?label:kind==='button'?h('button',{type:'button'},label):kind==='anchor'?h('a',{href:'#trigger'},label):h('span',{role:'button',tabIndex:0},label);
    const node=name==='Tooltip'?h(CS.Tooltip,{label:'Hint'},trigger):name==='HoverCard'?h(CS.HoverCard,{trigger,openDelay:0},'Content'):h(CS[name],{trigger,title:'Confirm'},name==='Menu'?h(CS.MenuItem,null,'Action'):'Content');
    renderFixture(h('main',{lang,'data-theme':theme,'data-cs-density':density,style:{padding:12}},node));
   },{name,kind,lang,density,theme});
   const wrapper={Menu:'.cs-menu',Popover:'.cs-popover',Popconfirm:'.cs-popconfirm',Tooltip:'.cs-tooltip',HoverCard:'.cs-hovercard'}[name];
   const trigger=page.locator(wrapper+' > :first-child');const r=await check(trigger);
   if(['Menu','Popover','Popconfirm'].includes(name)){
    await page.touchscreen.tap(r.point.x,r.point.y);assert.equal(await trigger.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');
   }else{
    await trigger.focus();await page.waitForSelector(name==='Tooltip'?'.cs-tooltip[data-open=true]':'.cs-hovercard__panel');await page.keyboard.press('Escape');
   }
   evidence.push({viewport:width,lang,density,theme,name,kind,width:r.width,height:r.height});
  }
  await page.evaluate(({lang,density,theme})=>{const h=React.createElement;renderFixture(null);renderFixture(h('main',{lang,'data-theme':theme,'data-cs-density':density,style:{padding:12}},h(CS.ContextMenu,{items:[{label:'Item'}]},'Area'),h(CS.Image,{src:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" fill="red"/></svg>'),alt:'Small preview',preview:true})));},{lang,density,theme});
  const zone=await check(page.locator('.cs-ctxmenu-zone'));evidence.push({viewport:width,lang,density,theme,name:'ContextMenu',kind:'text-zone',width:zone.width,height:zone.height});
  await page.waitForSelector('.cs-image[role=button]');const preview=await check(page.locator('.cs-image[role=button]'));await page.touchscreen.tap(preview.point.x,preview.point.y);await page.waitForSelector('.cs-image__zoom');await page.keyboard.press('Escape');assert.equal(await page.locator('.cs-image__zoom').count(),0);evidence.push({viewport:width,lang,density,theme,name:'Image',kind:'small-preview',width:preview.width,height:preview.height});
 }
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true,reducedMotion:'reduce'}});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({browserName,evidence},null,2)+'\n');
console.log(JSON.stringify({browserName,cases:evidence.length}));
