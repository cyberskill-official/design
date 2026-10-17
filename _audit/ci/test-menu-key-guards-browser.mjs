import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const rows=[],controls=[],runtime={node:process.version,browsers:{},reactVersions:{}};
for(const browserName of ['chromium','firefox','webkit']) await withBrowserFixture(async page=>{
  runtime.browsers[browserName]=page.context().browser().version();
  runtime.reactVersions[browserName]=await page.evaluate(()=>React.version);
  async function mount(lang,nested,flag,key){
    await page.evaluate(({lang,nested,flag,key})=>{
      renderFixture(null);window.menuGuardSelections=[];window.menuGuardParentCloses=0;window.menuGuardPreventedCallbacks=0;window.menuGuardEvent=null;
      window.removeMenuGuardRecorder?.();
      const record=e=>{if(e.target.id==='menu-guard-alpha'||e.target.id==='menu-guard-beta') window.menuGuardEvent={key:e.key,isTrusted:e.isTrusted,isComposing:e.isComposing,keyCode:e.keyCode,defaultPrevented:e.defaultPrevented,targetId:e.target.id};};
      window.addEventListener('keydown',record);window.removeMenuGuardRecorder=()=>window.removeEventListener('keydown',record);
      const h=React.createElement;
      const handler=e=>{if(flag==='prevented'&&e.key===key){e.preventDefault();menuGuardPreventedCallbacks++;}};
      const node=h(CS.Menu,{lang,trigger:h('button',{id:'menu-guard-trigger'},'Open')},
        h(CS.MenuItem,{id:'menu-guard-alpha',onKeyDown:handler,onClick:()=>menuGuardSelections.push('Alpha')},'Alpha'),
        h(CS.MenuItem,{id:'menu-guard-beta',onKeyDown:handler,onClick:()=>menuGuardSelections.push('Beta')},'Beta'));
      renderFixture(nested?h(CS.Dialog,{open:true,title:'Menu guard parent',lang,onClose:()=>menuGuardParentCloses++},node):node);
    },{lang,nested,flag,key});
    await page.locator('#menu-guard-trigger').focus();await page.keyboard.press('Enter');await page.getByRole('menu').waitFor();
    await page.locator(key==='ArrowUp'||key==='Home'?'#menu-guard-beta':'#menu-guard-alpha').focus();
    await page.evaluate(()=>{menuGuardEvent=null;});
  }
  const state=()=>page.evaluate(()=>({activeId:document.activeElement.id,menus:document.querySelectorAll('[role=menu]').length,selections:menuGuardSelections,parentCloses:menuGuardParentCloses,preventedCallbacks:menuGuardPreventedCallbacks,event:menuGuardEvent}));
  for(const lang of ['en','vi'])for(const nested of [false,true]){
    for(const flag of ['isComposing','keyCode229','prevented'])for(const key of ['ArrowDown','ArrowUp','Home','End']){
      await mount(lang,nested,flag,key);const before=await state();
      await page.evaluate(({flag,key})=>{
        const init={key,bubbles:true,cancelable:true};
        if(flag==='isComposing')init.isComposing=true;
        if(flag==='keyCode229')init.keyCode=229;
        document.activeElement.dispatchEvent(new KeyboardEvent('keydown',init));
      },{flag,key});
      const after=await state();
      assert.equal(after.event.isTrusted,false);assert.equal(after.menus,1);assert.deepEqual(after.selections,[]);assert.equal(after.parentCloses,0);
      if(flag==='isComposing')assert.equal(after.event.isComposing,true);
      if(flag==='keyCode229')assert.equal(after.event.keyCode,229);
      if(flag==='prevented'){assert.equal(after.event.defaultPrevented,true);assert.equal(after.preventedCallbacks,1);}
      assert.equal(after.activeId,before.activeId,'flagged/prevented navigation preserves focus');
      if(flag!=='prevented')assert.equal(after.event.defaultPrevented,false,'composition navigation does not cancel the native event');
      rows.push({browserName,lang,nested,flag,key,before,after,problem:after.activeId!==before.activeId||(flag!=='prevented'&&after.event.defaultPrevented)});
    }
    for(const key of ['ArrowDown','ArrowUp','Home','End']){
      await mount(lang,nested,'ordinary',key);await page.keyboard.press(key);const after=await state();
      assert.equal(after.activeId,key==='ArrowDown'||key==='End'?'menu-guard-beta':'menu-guard-alpha');
      assert.equal(after.event.isTrusted,true);assert.equal(after.parentCloses,0);assert.deepEqual(after.selections,[]);
      controls.push({browserName,lang,nested,key,case:'ordinary native Menu navigation',after,result:'pass'});
    }
    await page.evaluate(()=>{renderFixture(null);removeMenuGuardRecorder();});
  }
  console.log(browserName+':48 flagged/prevented observations and16 native controls complete');
},{browserName});
assert.equal(rows.length,144);assert.equal(controls.length,48);
const failures=rows.filter(row=>row.problem).length;
assert.equal(failures,0);
const report={recordedAt:new Date().toISOString(),status:'completed maintained Menu navigation guards',cases:192,rows,controls,failures,runtime,scope:'144 synthetic composition/keyCode229 or caller-prevented navigation guards and48 ordinary native-key controls; EN/VI standalone/nested in3engines. Handler proxies only, not physical OS IME/candidate-selection, assistive technology, conformance or human acceptance.'};
if(process.env.CS_MENU_KEY_GUARDS_REPORT)writeFileSync(process.env.CS_MENU_KEY_GUARDS_REPORT,JSON.stringify(report,null,2)+'\n');
console.log('PASS192 Menu key guard/control cases; physical/AT/conformance acceptance separate');
