import assert from 'node:assert/strict';
import fs from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const rows=[];
let failure;
try {
for(const browserName of process.env.CS_BROWSER ? [process.env.CS_BROWSER] : ['chromium','firefox','webkit']) {
for(const family of ['Dialog','AlertDialog','Drawer-right','Drawer-left'])
 for(const material of ['heavy','light']) {
  await withBrowserFixture(async page=>{
   await page.evaluate(({family,material})=>{
    const h=React.createElement;
    function App(){
     const [state,setState]=React.useState({lang:'en',theme:'light',density:'comfortable',element:'tho',override:false});
     window.setMaterialScope=patch=>ReactDOM.flushSync(()=>setState(s=>({...s,...patch})));
     const body=h('div',null,h('div',{style:{height:1000}},'Long material content'),h('button',null,'Last action'));
     const props={open:true,title:'Material scope',className:'cs-surface-'+material,onClose:()=>{}};
     const modal=family==='AlertDialog'?h(CS.AlertDialog,{...props,description:body,onOpenChange:()=>{}})
       :family.startsWith('Drawer')?h(CS.Drawer,{...props,side:family.endsWith('left')?'left':'right'},body):h(CS.Dialog,props,body);
     return h('div',{id:'live-material-scope',lang:state.lang,'data-theme':state.theme,'data-element':state.element,
       'data-cs-density':state.density,style:state.override?{['--cs-glass-'+material+'-bg']:'rgb(17, 34, 51)',['--cs-glass-'+material+'-blur']:'3px'}:{}},
       h('div',{id:'material-reference',className:'cs-surface-'+material,style:{position:'fixed',left:-2000,width:100,height:100},'aria-hidden':true}),modal);
    }
    renderFixture(h(React.StrictMode,null,h(App)));
   },{family,material});
   const fonts=await page.evaluate(async()=>{
    const faces=await Promise.all(['400','600','700'].map(weight=>document.fonts.load(weight+' 16px "Be Vietnam Pro"','Turn Your Will Into Real Hiện Thực Hoá Ý Chí')));
    await document.fonts.ready;return faces.map(group=>group.map(face=>face.status));
   });
   assert.ok(fonts.every(group=>group.length&&group.every(status=>status==='loaded')),'Real EN/VI UI font files load');
   const samples=[];
   for(const patch of [{},{lang:'vi',theme:'dark',density:'compact',element:'hoa'},
      {lang:'en',theme:'system',density:'comfortable',element:'moc'}, {override:true},{override:false}]) {
    await page.evaluate(patch=>setMaterialScope(patch),patch);
    await page.emulateMedia({colorScheme:'dark'});
    await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
    // Animation completion and paint-dependent backing measurement settle separately.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.waitForFunction(()=>{
     const panel=document.querySelector('[role=dialog], [role=alertdialog]'),surface=panel.previousElementSibling,reference=document.querySelector('#material-reference');
     return surface.classList.contains('cs-overlay-surface') && getComputedStyle(panel).backgroundColor===getComputedStyle(reference).backgroundColor && getComputedStyle(surface).backdropFilter===getComputedStyle(reference).backdropFilter;
    });
    const sample=await page.evaluate(()=>{
     const panel=document.querySelector('[role=dialog], [role=alertdialog]'),surface=panel.previousElementSibling;
     const reference=document.querySelector('#material-reference');
     const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
     return {lang:document.querySelector('#live-material-scope').lang,panel:rect(panel),surface:rect(surface),
       backdropFilter:getComputedStyle(surface).backdropFilter,referenceFilter:getComputedStyle(reference).backdropFilter,background:getComputedStyle(panel).backgroundColor,
       referenceBackground:getComputedStyle(reference).backgroundColor,
       names:[...panel.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')||b.textContent),
       inheritedTokenMatches:getComputedStyle(surface).getPropertyValue('--cs-color-surface-panel').trim()===getComputedStyle(panel).getPropertyValue('--cs-color-surface-panel').trim()};
    });
    for(const key of ['x','y','width','height'])assert.ok(Math.abs(sample.panel[key]-sample.surface[key])<1);
    assert.ok(sample.inheritedTokenMatches);assert.equal(sample.background,sample.referenceBackground);assert.equal(sample.backdropFilter,sample.referenceFilter);
    if(patch.override===true)assert.equal(sample.background,'rgb(17, 34, 51)');
    if(patch.override===false)assert.notEqual(sample.background,'rgb(17, 34, 51)');
    samples.push(sample);
   }
   assert.notDeepEqual(samples[0].names,samples[1].names,'Built-in names follow live inherited language');
   await page.setViewportSize({width:1365,height:960});
   await page.waitForFunction(()=>{
    const p=document.querySelector('[role=dialog], [role=alertdialog]'),s=p.previousElementSibling;
    const a=p.getBoundingClientRect(),b=s.getBoundingClientRect();return Math.abs(a.x-b.x)<1&&Math.abs(a.y-b.y)<1&&Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1;
   });
   await page.evaluate(()=>{
    const p=document.querySelector('[role=dialog], [role=alertdialog]');
    for(const node of [p,...p.querySelectorAll('*')])if(node.scrollHeight>node.clientHeight)node.scrollTop=node.scrollHeight;
   });
   const scrollAligned=await page.evaluate(()=>{
    const p=document.querySelector('[role=dialog], [role=alertdialog]'),s=p.previousElementSibling;
    const a=p.getBoundingClientRect(),b=s.getBoundingClientRect();return Math.abs(a.x-b.x)<1&&Math.abs(a.y-b.y)<1&&Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1;
   });assert.ok(scrollAligned,'Backing does not scroll away');
   await page.emulateMedia({forcedColors:'active'});
   const forced=await page.evaluate(()=>{
    const p=document.querySelector('[role=dialog], [role=alertdialog]'),s=p.previousElementSibling,r=document.querySelector('#material-reference');
    return {emulationActive:matchMedia('(forced-colors: active)').matches,filter:getComputedStyle(s).backdropFilter,
      background:getComputedStyle(p).backgroundColor,referenceBackground:getComputedStyle(r).backgroundColor};
   });assert.ok(forced.emulationActive);assert.equal(forced.filter,'none');assert.equal(forced.background,forced.referenceBackground);
   await page.evaluate(()=>renderFixture(null));await page.setViewportSize({width:390,height:844});
   assert.equal(await page.locator('.cs-overlay-surface').count(),0);
   rows.push({browserName,family,material,fonts,samples,resizeAligned:true,scrollAligned,forcedColors:forced,cleanup:true});
  },{browserName,contextOptions:{viewport:{width:390,height:844}}});
 }
}
} catch(error) { failure=error; }
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
if(output)fs.writeFileSync(output,JSON.stringify({result:failure?'fail':'pass',rows,failure:failure?.message,
 scope:'Eight fixtures and forty live inherited language/theme/density/element/token states per engine, real UI font loads, two-frame settled geometry, resize, scroll, forced-colors and teardown. Three engines by default. Not atomic animation-finish geometry, full Cartesian axes, real AT or human acceptance.'},null,2)+'\n');
if(failure)throw failure;
console.log(`PASS overlay material live updates: ${rows.length} fixtures, ${rows.reduce((n,r)=>n+r.samples.length,0)} states; no human acceptance inferred.`);
