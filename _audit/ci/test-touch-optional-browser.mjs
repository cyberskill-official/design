import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
await withBrowserFixture(async page=>{
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
 const edgeTap=async locator=>{
  await locator.scrollIntoViewIfNeeded();const r=await locator.boundingBox();assert.ok(r.width>=44&&r.height>=44,JSON.stringify(r));
  const point={x:r.x+r.width-2,y:r.y+r.height/2};
  assert.equal(await locator.evaluate((el,p)=>{const hit=document.elementFromPoint(p.x,p.y);return hit===el||el.contains(hit)},point),true,'Target edge must not be clipped or owned by a neighbor');
  await page.touchscreen.tap(point.x,point.y);
 };
 for(const width of [320,390,1280])for(const lang of ['en','vi'])for(const density of ['comfortable','compact']){
  await page.setViewportSize({width,height:900});
  await page.evaluate(({lang,density})=>{
   const h=React.createElement;renderFixture(null);window.optionalEvents=[];
   function Probe(){
    const [alert,setAlert]=React.useState(true),[toast,setToast]=React.useState(true),[tag,setTag]=React.useState(true);
    return h('main',{lang,'data-theme':lang==='vi'?'dark':'light','data-cs-density':density,style:{padding:12,display:'grid',gap:16}},
     alert&&h(CS.Alert,{lang,title:'Alert',onDismiss:()=>{optionalEvents.push('alert');setAlert(false)}},'Message'),
     toast&&h(CS.Toast,{lang,title:'Toast',onClose:()=>{optionalEvents.push('toast');setToast(false)}},'Message'),
     tag&&h(CS.Tag,{lang,onRemove:()=>{optionalEvents.push('tag');setTag(false)}},'Tag'),
     h(CS.Image,{lang,src:'/assets/aurora-gold.jpg',alt:'Aurora',ratio:'16 / 9',preview:true}),
     h(CS.Mentions,{lang,users:['An','Binh']}));
   }
   renderFixture(h(Probe));
  },{lang,density});
  await edgeTap(page.locator('.cs-alert__dismiss'));assert.equal(await page.locator('.cs-alert').count(),0);
  await edgeTap(page.locator('.cs-toast__close'));assert.equal(await page.locator('.cs-toast').count(),0);
  await edgeTap(page.locator('.cs-tag__close'));assert.equal(await page.locator('.cs-tag').count(),0);
  assert.deepEqual(await page.evaluate(()=>optionalEvents),['alert','toast','tag']);
  await page.waitForFunction(()=>document.querySelector('.cs-image')?.getAttribute('role')==='button');
  await page.locator('.cs-image').focus();await page.keyboard.press('Enter');
  await edgeTap(page.locator('.cs-image__zoom button'));assert.equal(await page.locator('.cs-image__zoom').count(),0);
  await page.waitForFunction(()=>document.activeElement?.classList.contains('cs-image'));
  await page.locator('.cs-mentions textarea').fill('@');
  await edgeTap(page.locator('.cs-mentions__pop button').first());
  assert.equal(await page.locator('.cs-mentions textarea').inputValue(),'@An ');
  assert.equal(await page.locator('.cs-mentions__pop').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
console.log('PASS optional touch actions: Alert/Toast/Tag dismiss edges, Image keyboard preview and close edge/focus restoration, Mentions edge selection; EN/VI, both densities, 320/390/1280 widths.');
