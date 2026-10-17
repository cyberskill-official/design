import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {inspectCoarseHitRegion} from './lib/coarse-hit-region.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium',rows=[];
for(const cssMode of ['imports','flat'])await withBrowserFixture(async page=>{
  if(cssMode==='flat')await page.evaluate(()=>new Promise((resolve,reject)=>{const link=document.querySelector('link[rel=stylesheet]');link.onload=()=>resolve();link.onerror=()=>reject(Error('Flattened stylesheet failed'));link.href='/dist/styles.min.css';}));
  await page.addScriptTag({content:'window.csInspectCoarseHitRegion = '+inspectCoarseHitRegion.toString()+';'});
  await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
  for(const width of [320,360,390])for(const density of ['comfortable','compact'])for(const lang of ['en','vi'])for(const theme of ['light','dark'])for(const composed of [false,true])for(const overflowing of [false,true]) {
    await page.setViewportSize({width,height:800});
    await page.evaluate(({density,lang,theme,composed,overflowing})=>{
      const h=React.createElement;renderFixture(null);window.tabTouchEvents=[];
      function Probe(){
        const [value,setValue]=React.useState('a');
        const tabs=[{value:'a',label:lang==='vi'?'Một':'One'},{value:'b',label:lang==='vi'?'Hai':'Two'}];if(overflowing)for(const tab of tabs)tab.label=h('span',{style:{whiteSpace:'nowrap'}},tab.label+' — '+(lang==='vi'?'Thiết lập tài khoản chi tiết':'Detailed account settings'));
        const change=next=>{tabTouchEvents.push(next);setValue(next)};
        const node=composed?h('div',{role:'tablist',className:'cs-tabs','aria-label':'Composed tabs'},...tabs.map(tab=>h(CS.Tab,{key:tab.value,selected:value===tab.value,onClick:()=>change(tab.value)},tab.label))):h(CS.Tabs,{tabs,value,onChange:change,lang});
        return h('main',{'data-cs-density':density,lang,'data-theme':theme,style:{padding:12}},node);
      }
      renderFixture(h(Probe));
    },{density,lang,theme,composed,overflowing});
    const targets=page.locator('.cs-tab');const measurements=[];
    for(let i=0;i<2;i++) {
      const target=targets.nth(i);await page.evaluate(()=>document.fonts.ready);await target.evaluate(el=>el.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'}));await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      if(overflowing)assert.equal(await target.evaluate(tab=>{const r=tab.getBoundingClientRect(),text=tab.querySelector('span').getBoundingClientRect();return text.left>=r.left-.01&&text.right<=r.right+.01;}),true,'Rich unwrapped label must remain inside its own tab rather than overlap a neighbor');
      const measured=await target.evaluate(tab=>{
        const list=tab.closest('.cs-tabs'),r=tab.getBoundingClientRect(),p=list.getBoundingClientRect(),css=getComputedStyle(list);
        const clips=/^(hidden|clip|auto|scroll)$/.test(css.overflowY);
        return {box:r.toJSON(),visibleHeight:clips?Math.min(r.bottom,p.bottom-parseFloat(css.borderBottomWidth))-Math.max(r.top,p.top+parseFloat(css.borderTopWidth)):r.height,overflowY:css.overflowY,clientHeight:list.clientHeight,scrollHeight:list.scrollHeight,scrollTop:list.scrollTop,region:csInspectCoarseHitRegion(tab)};
      });
      assert(measured.box.width>=43.99&&measured.box.height>=43.99);assert(measured.visibleHeight>=43.99,'Full 44px tab height must remain inside the scrollport');assert.equal(measured.region.pass,true,JSON.stringify({cssMode,width,density,lang,theme,composed,overflowing,index:i,measured}));
      const point=measured.region.chosenCenter;await page.touchscreen.tap(point.x,point.y);await page.waitForFunction(i=>tabTouchEvents.length===2*i+1,i);
      const bottom={x:Math.round(point.x),y:Math.floor(measured.box.bottom-2)};await page.touchscreen.tap(bottom.x,bottom.y);await page.waitForFunction(i=>tabTouchEvents.length===2*i+2,i);measured.nativeBottomPoint=bottom;
      assert.equal(await target.getAttribute('aria-selected'),'true');measurements.push(measured);
    }
    assert.deepEqual(await page.evaluate(()=>tabTouchEvents),['a','a','b','b']);
    if(!composed) {
      await targets.nth(0).focus();await page.keyboard.press('ArrowRight');
      assert.equal(await targets.nth(1).evaluate(el=>el===document.activeElement),true);
      const focus=await targets.nth(1).evaluate(el=>({visible:el.matches(':focus-visible'),outline:getComputedStyle(el).outlineWidth,shadow:getComputedStyle(el).boxShadow}));
      assert(focus.visible&&(parseFloat(focus.outline)>0||focus.shadow!=='none'),'Keyboard focus remains visible');
    }
    if(width<=360&&overflowing)assert.equal(await page.locator('.cs-tabs').evaluate(el=>el.scrollWidth>el.clientWidth),true,'Rich unwrapped labels exercise actual horizontal scrolling');
    const pageGeometry=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,listWidth:document.querySelector('.cs-tabs').getBoundingClientRect().width,listScroll:document.querySelector('.cs-tabs').scrollWidth}));assert.equal(pageGeometry.documentWidth>pageGeometry.viewport,false,JSON.stringify({width,density,lang,theme,composed,overflowing,pageGeometry}));
    rows.push({cssMode,width,density,lang,theme,composed,overflowing,measurements});
  }
},{browserName,contextOptions:{viewport:{width:390,height:800},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({browserName,scope:'Both imported and flattened CSS exports. Actual Tabs and hand-composed Tab controls at320/360/390px, both densities/languages/themes, simple and rich unwrapped scrolling labels. Unclipped44px height, native taps, controlled selection and data-driven keyboard focus. Insets/continuous border ownership remain separately bounded.',rows},null,2)+'\n');
console.log(`PASS tabs touch clipping ${browserName}: ${rows.length} scenarios; 44px visible height, native selection, keyboard focus and narrow overflow`);
