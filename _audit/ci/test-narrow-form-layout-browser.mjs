import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const evidence=[];
for(const coarse of [false,true])await withBrowserFixture(async page=>{
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
 const bounded=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'Component must not expand the document viewport');
 const activate=async locator=>{
  await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox();assert(box);
  if(coarse)assert(box.width>=43.99&&box.height>=43.99,'Coarse target must remain 44px');
  const x=box.x+box.width/2,y=box.y+box.height-2;
  assert(await locator.evaluate((el,{x,y})=>{const hit=document.elementFromPoint(x,y);return hit===el||el.contains(hit)},{x,y}),'Target edge is reachable');
  if(coarse)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);
 };
 for(const width of [320,390,1280])for(const lang of ['en','vi'])for(const density of ['comfortable','compact'])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:900});
  for(const align of ['start','end']){
   await page.evaluate(({lang,density,theme,align})=>{
    const h=React.createElement;renderFixture(null);window.narrowPicks=[];
    renderFixture(h('main',{lang,'data-cs-density':density,'data-theme':theme,style:{padding:12,display:'flex',justifyContent:align}},h(CS.DatePicker,{label:'Date',lang,value:new Date(2026,6,18),onChange:d=>narrowPicks.push(d.getDate())})));
   },{lang,density,theme,align});
   await activate(page.locator('.cs-datepicker__field'));
   const panel=page.locator('.cs-datepicker__pop');await panel.waitFor();await bounded();
   const box=await panel.boundingBox();assert(box.x>=7.5&&box.x+box.width<=width-7.5,'Popup must fit both viewport edges');
   for(const button of await page.locator('.cs-cal__head button').all()){
    const r=await button.boundingBox();assert(r.x>=box.x&&r.x+r.width<=box.x+box.width,'Month navigation stays inside the visible calendar');
   }
   await activate(page.locator('.cs-cal__head button').last());
   await activate(page.locator('.cs-cal__head button').first());
   if(width===1280){
    await page.setViewportSize({width:320,height:900});
    await page.waitForFunction(()=>{const r=document.querySelector('.cs-datepicker__pop').getBoundingClientRect();return r.left>=7.5&&r.right<=312.5});await bounded();
    await page.setViewportSize({width,height:900});
   }
   const day=page.locator('.cs-cal__grid button').filter({hasText:/^5$/});await activate(day);
   assert.deepEqual(await page.evaluate(()=>narrowPicks),[5]);assert.equal(await panel.count(),0);await bounded();
   evidence.push({name:'DatePicker',width,lang,density,theme,coarse,align});
  }
  for(const align of ['start','end']){
   await page.evaluate(({lang,density,theme,align})=>{
    const h=React.createElement;renderFixture(null);history.replaceState(null,'',location.pathname);
    renderFixture(h('main',{lang,'data-cs-density':density,'data-theme':theme,style:{padding:12,display:'flex',justifyContent:align}},h(CS.NavigationMenu,{items:[
     {label:lang==='en'?'Docs':'Tài liệu',panel:[{label:'API',href:'#api'},{label:'SDK',href:'#sdk'}]},
     {label:lang==='en'?'More':'Thêm',panel:[{label:'LongUnbrokenNavigationLabel',desc:'Description that wraps inside the available panel width',href:'#narrow-nav'}]}
    ]})));
   },{lang,density,theme,align});
   await activate(page.locator('.cs-navmenu__top').first());await bounded();
   // Keep the pointer away while exercising keyboard switching and resize;
   // hovering another top-level item intentionally switches the open panel.
   await page.mouse.move(0,600);
   await page.locator('.cs-navmenu__top').last().focus();await page.keyboard.press('Enter');
   const panel=page.locator('.cs-navmenu__panel');await panel.waitFor();await bounded();
   const box=await panel.boundingBox();assert(box.x>=7.5&&box.x+box.width<=width-7.5,'Switched panel must fit the viewport');
   if(width===1280){
    await page.setViewportSize({width:320,height:900});
    await page.waitForFunction(()=>{const r=document.querySelector('.cs-navmenu__panel').getBoundingClientRect();return r.left>=7.5&&r.right<=312.5});await bounded();
    await page.setViewportSize({width,height:900});
   }
   await activate(page.locator('.cs-navmenu__card'));assert.equal(await panel.count(),0);
   assert.equal(await page.evaluate(()=>location.hash),'#narrow-nav');await bounded();
   evidence.push({name:'NavigationMenu',width,lang,density,theme,coarse,align});
  }
  await page.evaluate(({lang,density,theme})=>{
   const h=React.createElement;renderFixture(null);window.narrowMoves=[];
   function Probe(){const [value,setValue]=React.useState([]);return h(CS.Transfer,{lang,value,onChange:next=>{narrowMoves.push(next);setValue(next)},items:[{key:'a',label:lang==='en'?'LongUnbrokenProjectNameForWrapping':'TênDựÁnDàiKhôngCóKhoảngTrắng'},{key:'b',label:'B'}]})}
   renderFixture(h('main',{lang,'data-cs-density':density,'data-theme':theme,style:{padding:12}},h(Probe)));
  },{lang,density,theme});
  await bounded();const lists=page.locator('.cs-transfer__list');
  await activate(lists.first().locator('label').first());await activate(page.locator('.cs-transfer__ops button').first());
  assert.deepEqual(await page.evaluate(()=>narrowMoves),[['a']]);assert.equal(await lists.last().locator('label').count(),1);await bounded();
  await activate(lists.last().locator('label'));await activate(page.locator('.cs-transfer__ops button').last());
  assert.deepEqual(await page.evaluate(()=>narrowMoves),[['a'],[]]);await bounded();
  evidence.push({name:'Transfer',width,lang,density,theme,coarse});
 }
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:coarse,...(coarse&&browserName!=='firefox'?{isMobile:true}:{})}});
const output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({browserName,evidence},null,2)+'\n');
console.log(`PASS narrow forms ${browserName}: ${evidence.length} cases; bounded page/popups, live resize and panel switching, preserved targets, date selection, navigation and transfers both ways`);
