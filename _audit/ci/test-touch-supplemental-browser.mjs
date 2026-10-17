import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||'chromium';
const evidence=[];
await withBrowserFixture(async page=>{
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
 const edgeTap=async locator=>{
  await locator.scrollIntoViewIfNeeded();const r=await locator.boundingBox();
  assert(r.width>=43.99&&r.height>=43.99,JSON.stringify({name:await locator.getAttribute('class'),...r}));
  const point={x:r.x+r.width/2,y:r.y+r.height-2};
  assert(await locator.evaluate((el,p)=>{const hit=document.elementFromPoint(p.x,p.y);return el===hit||el.contains(hit)},point),'Hit area belongs to its action');
  await page.touchscreen.tap(point.x,point.y);return {width:r.width,height:r.height};
 };
 for(const width of [320,390,1280])for(const lang of ['en','vi'])for(const density of ['comfortable','compact'])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:900});
  await page.evaluate(({lang,density,theme})=>{
   const h=React.createElement;renderFixture(null);window.touchEvents=[];
   renderFixture(h('main',{lang,'data-theme':theme,'data-cs-density':density,style:{padding:12,display:'grid',gap:16}},
    h(CS.FloatingActionButton,{position:'static',label:lang==='vi'?'Hành động':'Actions',icon:'+',actions:[{label:'One',icon:'1',onSelect:()=>touchEvents.push('one')},{label:'Two',icon:'2',onSelect:()=>touchEvents.push('two')}]}),
    h(CS.List,null,h(CS.ListItem,{title:lang==='vi'?'Mở mục':'Open item',onClick:()=>touchEvents.push('list')})),
    h(CS.SearchField,{lang,defaultValue:'Query',onClear:()=>touchEvents.push('clear')}),
    h(CS.BackTop,{lang,threshold:-1})));
  },{lang,density,theme});
  await page.locator('.cs-backtop').waitFor();
  const row={viewport:width,lang,density,theme,targets:{}};
  row.targets.fab=await edgeTap(page.locator('.cs-fab__main'));
  row.targets.firstAction=await edgeTap(page.locator('.cs-fab__mini').first());assert.equal(await page.locator('.cs-fab__mini').count(),0);
  await edgeTap(page.locator('.cs-fab__main'));row.targets.secondAction=await edgeTap(page.locator('.cs-fab__mini').nth(1));
  row.targets.list=await edgeTap(page.locator('.cs-list__item--button'));
  row.targets.searchClear=await edgeTap(page.locator('.cs-search__clear'));assert.equal(await page.getByRole('searchbox').inputValue(),'');
  row.targets.backTop=await edgeTap(page.locator('.cs-backtop'));
  assert.deepEqual(await page.evaluate(()=>touchEvents),['one','two','list','clear']);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  evidence.push(row);
 }
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true,reducedMotion:'reduce'}});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({browserName,evidence},null,2)+'\n');
console.log(JSON.stringify({browserName,cases:evidence.length,targets:evidence.length*6}));
