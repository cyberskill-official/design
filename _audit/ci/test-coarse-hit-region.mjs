import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {inspectCoarseHitRegion} from './lib/coarse-hit-region.mjs';

const browserName=process.env.CS_TEST_BROWSER||'chromium';
const results=[];
await withBrowserFixture(async page=>{
  await page.addScriptTag({content:'window.csInspectCoarseHitRegion = '+inspectCoarseHitRegion.toString()+';'});
  await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
  for(const width of [320,390])for(const density of ['comfortable','compact']) {
    await page.setViewportSize({width,height:800});
    for(const kind of ['plain','round','diagonal_obstruction','nested_action','clipped','clipped43','fixed_escape','fixed_contained','alternate_region','label']) {
      await page.evaluate(({kind,density})=>{
        const h=React.createElement;window.regionEvents=[];
        const fire=name=>()=>regionEvents.push(name);
        const fixed=kind.startsWith('fixed_');
        const button=h(CS.Button,{'data-target':'main',style:{width:kind==='alternate_region'?132:44,height:44,padding:0,borderRadius:kind==='round'?'50%':undefined,...(fixed?{position:'fixed',left:kind==='fixed_escape'?80:0,top:kind==='fixed_escape'?80:0}: {})},onClick:fire('primary')},'A');
        const obstruction=h('span',{'data-obstruction':true,style:{position:'absolute',left:kind==='alternate_region'?44:30,top:kind==='alternate_region'?0:12,width:kind==='alternate_region'?44:4,height:kind==='alternate_region'?44:4,zIndex:2,background:'red'},onClick:fire('obstruction')});
        const node=kind==='nested_action'?h('div',{'data-target':'main',role:'button',tabIndex:0,onClick:fire('primary'),style:{position:'relative',width:44,height:44}},'A',h('button',{type:'button','data-obstruction':true,style:{position:'absolute',left:30,top:12,width:4,height:4,padding:0,border:0},onClick:e=>{e.stopPropagation();regionEvents.push('nested')}},'X')):
          kind==='label'?h(CS.Checkbox,{label:'A','aria-label':'Selection','data-target':'control',onChange:fire('selection')}):
          h('div',{style:{position:'relative',width:kind==='alternate_region'?132:kind==='clipped43'?43:['clipped','fixed_escape','fixed_contained'].includes(kind)?42:44,height:44,overflow:['clipped','clipped43','fixed_escape','fixed_contained'].includes(kind)?'hidden':undefined,transform:kind==='fixed_contained'?'translateX(0)':undefined}},button,...(['diagonal_obstruction','alternate_region'].includes(kind)?[obstruction]:[]));
        renderFixture(h('main',{'data-cs-density':density,style:{margin:40}},node));
      },{kind,density});
      const target=page.locator(kind==='label'?'.cs-check':'[data-target=main]');
      const region=await target.evaluate(el=>csInspectCoarseHitRegion(el));
      const legacy=await target.evaluate(el=>{
        const r=el.getBoundingClientRect();return {geometry:r.width>=43.99&&r.height>=43.99,axial:[[-21,0],[0,-21],[0,0],[0,21],[21,0]].every(([dx,dy])=>{const hit=document.elementFromPoint(r.x+r.width/2+dx,r.y+r.height/2+dy);return hit===el||el.contains(hit);})};
      });
      const rejected=['diagonal_obstruction','nested_action','clipped','clipped43','fixed_contained'].includes(kind);
      assert.equal(region.pass,!rejected,`${browserName} ${kind}: ${JSON.stringify(region)}`);
      if(['diagonal_obstruction','nested_action'].includes(kind)) {
        assert(legacy.geometry&&legacy.axial,'The regression must reproduce a pass from the earlier sparse/descendant predicate');
        const r=await page.locator('[data-obstruction]').boundingBox();await page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);
        assert.deepEqual(await page.evaluate(()=>regionEvents),[kind==='nested_action'?'nested':'obstruction'],'Native tap must reach the distinct obstruction/action');
        assert(region.checks.some(check=>check.misses>0));
      } else if(!rejected) {
        assert(region.requiredSamples>=1300,'The inset probe disk uses integer CSS coordinates');
        assert.equal(region.edgeGuard,1);assert.equal(region.probeDiameter,42,'The unresolved 1px edge guard must be explicit');
        await page.touchscreen.tap(region.chosenCenter.x,region.chosenCenter.y);
        assert.deepEqual(await page.evaluate(()=>regionEvents),[kind==='label'?'selection':'primary']);
        if(kind==='label')assert.equal(await page.locator('input[type=checkbox]').isChecked(),true);
        if(kind==='alternate_region')assert(Math.abs(region.chosenCenter.x-(region.targetBounds.x+region.targetBounds.width/2))>.1,'A valid off-center action region must remain usable');
      }
      results.push({width,density,kind,legacy,region});
    }
  }
},{browserName,contextOptions:{viewport:{width:390,height:800},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
if(output)writeFileSync(output,JSON.stringify({browserName,scope:'Controlled ownership regressions at 320/390px and both densities. Native taps verify primary, label, diagonal obstruction and nested action dispatch. Rounded corners and a valid off-center disk are accepted; clipped/obstructed candidates are rejected. The box/clip floor is44px; the integer-coordinate ownership probe is42px with1px edge guard at finite candidate positions. This does not certify continuous/subpixel ownership or whole-product activation.',results},null,2)+'\n');
console.log(`PASS coarse hit-region ${browserName}: ${results.length} cases; diagonal and descendant-action false positives rejected, clipping rejected, rounded/off-center/label regions preserved with native taps`);
