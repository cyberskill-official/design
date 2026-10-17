import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const rows=[],controls=[],runtime={node:process.version,browsers:{},reactVersions:{}};
for(const browserName of ['chromium','firefox','webkit']) await withBrowserFixture(async page=>{
  runtime.browsers[browserName]=page.context().browser().version();
  runtime.reactVersions[browserName]=await page.evaluate(()=>React.version);
  async function mount(lang,nested,flag,key,mode="navigation"){
    await page.evaluate(({lang,nested,flag,key})=>{
      renderFixture(null);window.cascaderGuardSelections=[];window.cascaderGuardParentCloses=0;window.cascaderGuardPreventedCallbacks=0;window.cascaderGuardEvent=null;
      window.removeCascaderGuardRecorder?.();
      const record=e=>{if(e.target.matches('button[role=option],button.cs-treeselect__field')) window.cascaderGuardEvent={key:e.key,isTrusted:e.isTrusted,isComposing:e.isComposing,keyCode:e.keyCode,defaultPrevented:e.defaultPrevented,targetId:e.target.id};};
      window.addEventListener('keydown',record);window.removeCascaderGuardRecorder=()=>window.removeEventListener('keydown',record);
      const h=React.createElement;
      const handler=e=>{if(flag==='prevented'&&e.key===key){e.preventDefault();cascaderGuardPreventedCallbacks++;}};
      const node=h('div',{onKeyDownCapture:handler},h(CS.Cascader,{lang,label:'Cascader guard field',nodes:[{key:'alpha',label:'Alpha'},{key:'beta',label:'Beta'}],onChange:path=>cascaderGuardSelections.push(path)}));
      renderFixture(nested?h(CS.Dialog,{open:true,title:'Cascader guard parent',lang,onClose:()=>cascaderGuardParentCloses++},node):node);
    },{lang,nested,flag,key});
    await page.getByRole('button',{name:'Cascader guard field',exact:true}).focus();
    if(mode==='trigger'){await page.evaluate(()=>{cascaderGuardEvent=null;});return;}
    await page.keyboard.press('Enter');await page.getByRole('listbox').waitFor();
    await page.getByRole('option',{name:'Alpha',exact:true}).evaluate(el=>{el.id='cascader-guard-alpha';});
    await page.getByRole('option',{name:'Beta',exact:true}).evaluate(el=>{el.id='cascader-guard-beta';});
    await page.locator(key==='ArrowUp'||key==='Home'?'#cascader-guard-beta':'#cascader-guard-alpha').focus();
    await page.evaluate(()=>{cascaderGuardEvent=null;});
  }
  const state=()=>page.evaluate(()=>({activeId:document.activeElement.id,listboxes:document.querySelectorAll('[role=listbox]').length,selections:cascaderGuardSelections,parentCloses:cascaderGuardParentCloses,preventedCallbacks:cascaderGuardPreventedCallbacks,event:cascaderGuardEvent}));
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
      assert.equal(after.event.isTrusted,false);assert.equal(after.listboxes,1);assert.deepEqual(after.selections,[]);assert.equal(after.parentCloses,0);
      if(flag==='isComposing')assert.equal(after.event.isComposing,true);
      if(flag==='keyCode229')assert.equal(after.event.keyCode,229);
      if(flag==='prevented'){assert.equal(after.event.defaultPrevented,true);assert.equal(after.preventedCallbacks,1);}
      assert.equal(after.activeId,before.activeId,'flagged navigation preserves option focus');
      if(flag!=='prevented')assert.equal(after.event.defaultPrevented,false);
      rows.push({browserName,lang,nested,flag,key,phase:'navigation',before,after,problem:after.activeId!==before.activeId||(flag!=='prevented'&&after.event.defaultPrevented)});
    }
    for(const flag of ['isComposing','keyCode229','prevented'])for(const key of ['ArrowDown','Enter',' ']){
      await mount(lang,nested,flag,key,'trigger');const before=await state();assert.equal(before.listboxes,0);
      await page.evaluate(({flag,key})=>{const init={key,bubbles:true,cancelable:true};if(flag==='isComposing')init.isComposing=true;if(flag==='keyCode229')init.keyCode=229;document.activeElement.dispatchEvent(new KeyboardEvent('keydown',init));},{flag,key});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const after=await state();assert.equal(after.event.isTrusted,false);assert.equal(after.parentCloses,0);assert.deepEqual(after.selections,[]);
      if(flag==='isComposing')assert.equal(after.event.isComposing,true);if(flag==='keyCode229')assert.equal(after.event.keyCode,229);
      if(flag==='prevented'){assert.equal(after.event.defaultPrevented,true);assert.equal(after.preventedCallbacks,1);}
      assert.equal(after.listboxes,0,'flagged trigger does not request opening');
      if(flag!=='prevented')assert.equal(after.event.defaultPrevented,false);
      rows.push({browserName,lang,nested,flag,key,phase:'trigger',before,after,problem:after.listboxes!==0||(flag!=='prevented'&&after.event.defaultPrevented)});
    }
    for(const key of ['ArrowDown','Enter',' ']){
      await mount(lang,nested,'ordinary',key,'trigger');await page.keyboard.press(key===' '?'Space':key);await page.getByRole('listbox').waitFor();const after=await state();
      assert.equal(after.listboxes,1);assert.equal(after.event.isTrusted,true);assert.equal(after.parentCloses,0);assert.deepEqual(after.selections,[]);
      controls.push({browserName,lang,nested,key,case:'ordinary native Cascader trigger request',after,result:'pass'});
    }
    for(const key of ['ArrowDown','ArrowUp','Home','End']){
      await mount(lang,nested,'ordinary',key);await page.keyboard.press(key);const after=await state();
      assert.equal(after.activeId,key==='ArrowDown'||key==='End'?'cascader-guard-beta':'cascader-guard-alpha');
      assert.equal(after.event.isTrusted,true);assert.equal(after.parentCloses,0);assert.deepEqual(after.selections,[]);
      controls.push({browserName,lang,nested,key,case:'ordinary native Cascader navigation',after,result:'pass'});
    }
    await page.evaluate(()=>{renderFixture(null);removeCascaderGuardRecorder();});
  }
  console.log(browserName+':84 flagged/prevented observations and28 native controls complete');
},{browserName});
assert.equal(rows.length,252);assert.equal(controls.length,84);
const failures=rows.filter(row=>row.problem).length;
assert.equal(failures,0);
const guardReport={cases:336,rows,controls,failures,runtime};
async function assertNativeTargetScope(){
const rows = [], controls = [], runtime = { node: process.version, browsers: {}, reactVersions: {} };
for (const browserName of ['chromium', 'firefox', 'webkit']) await withBrowserFixture(async page => {
  runtime.browsers[browserName] = page.context().browser().version();
  runtime.reactVersions[browserName] = await page.evaluate(() => React.version);
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  async function mount(lang, nested) {
    await page.evaluate(({ lang, nested }) => {
      renderFixture(null);
      window.cascaderScopeCloses = 0;
      window.cascaderScopeSelections = [];
      window.cascaderScopeKeyEvent = null;
      window.removeCascaderScopeRecorder?.();
      const recorder = e => { if (e.target.id === 'cascader-neighbor' && ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) cascaderScopeKeyEvent = { key: e.key, isTrusted: e.isTrusted, isComposing: e.isComposing, keyCode: e.keyCode, defaultPrevented: e.defaultPrevented }; };
      window.addEventListener('keydown', recorder);
      window.removeCascaderScopeRecorder = () => window.removeEventListener('keydown', recorder);
      const h = React.createElement;
      const content = h(React.Fragment, null,
        h(CS.Cascader, { lang, label:'Cascader scope field',nodes:[{key:'alpha',label:'Alpha'},{key:'beta',label:'Beta'}],onChange:path=>cascaderScopeSelections.push(path) }),
        h('textarea', { id: 'cascader-neighbor', 'aria-label': 'Neighbor text field', defaultValue: 'First line\nSecond line\nThird line' }));
      renderFixture(nested ? h(CS.Dialog, { open: true, title: 'Cascader scope parent', lang, onClose: () => cascaderScopeCloses++ }, content) : content);
    }, { lang, nested });
    await page.getByRole('button',{name:'Cascader scope field',exact:true}).focus();
    await page.getByRole('button',{name:'Cascader scope field',exact:true}).press('Enter');
    await page.getByRole('listbox').waitFor();
    await page.getByRole('option',{name:'Alpha',exact:true}).focus();
  }
  async function leaveViaTab() {
    await page.keyboard.press(tab);
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Beta');
    await page.keyboard.press(tab);
    assert.equal(await page.locator('#cascader-neighbor').evaluate(el => el === document.activeElement), true, 'native Tab exits Cascader into adjacent textarea');
    assert.equal(await page.getByRole('listbox').count(), 1);
    await page.locator('#cascader-neighbor').evaluate(el => el.setSelectionRange(13, 13));
  }
  const state = () => page.evaluate(() => ({ activeId: document.activeElement.id, activeText: document.activeElement.textContent, neighborFocused: document.activeElement === document.getElementById('cascader-neighbor'), caret: document.getElementById('cascader-neighbor').selectionStart, listboxCount: document.querySelectorAll('[role=listbox]').length, parentCloses: cascaderScopeCloses, selections: cascaderScopeSelections, event: cascaderScopeKeyEvent }));
  for (const lang of ['en', 'vi']) for (const nested of [false, true]) {
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
      await mount(lang, nested); await leaveViaTab();
      const before = await state();
      await page.keyboard.press(key);
      const after = await state();
      assert.equal(after.event.isTrusted, true); assert.equal(after.event.isComposing, false);
      assert.equal(after.parentCloses, 0); assert.deepEqual(after.selections, []);
      assert.equal(after.neighborFocused, true, 'outside native key preserves textarea focus');
      assert.equal(after.event.defaultPrevented, false, 'outside native key is not consumed by Cascader');
      assert.equal(after.listboxCount, 1, 'guard does not replace open-menu visibility behavior');
      rows.push({ browserName, lang, nested, key, before, after, problem: !after.neighborFocused || after.event.defaultPrevented });
    }
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
      await mount(lang, nested);
      await page.keyboard.press('Escape');
      await page.getByRole('listbox').waitFor({ state: 'detached' });
      await page.locator('#cascader-neighbor').focus();
      await page.locator('#cascader-neighbor').evaluate(el => el.setSelectionRange(13, 13));
      await page.keyboard.press(key);
      const after = await state();
      assert.equal(after.neighborFocused, true); assert.equal(after.event.defaultPrevented, false);
      assert.equal(after.parentCloses, 0);
      controls.push({ browserName, lang, nested, key, case: 'closed menu preserves neighboring native textarea arrow', result: 'pass' });
    }
    await mount(lang, nested);
    await page.keyboard.press('ArrowDown'); assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Beta');
    await page.keyboard.press('ArrowUp'); assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Alpha');
    await page.keyboard.press('End'); assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Beta');
    await page.keyboard.press('Home'); assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Alpha');
    controls.push({ browserName, lang, nested, case: 'focused menu bounded arrows and Home/End remain active', result: 'pass' });
    await page.evaluate(() => { renderFixture(null); removeCascaderScopeRecorder(); });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  }
  console.log(`${browserName}: 16 native outside-target observations and20 controls complete`);
}, { browserName });
assert.equal(rows.length, 48); assert.equal(controls.length, 60);
const failures = rows.filter(row => row.problem).length;
assert.equal(failures,0);
return {cases:108,rows,controls,failures,runtime};
}
const targetReport=await assertNativeTargetScope();
const report={recordedAt:new Date().toISOString(),status:'completed maintained Cascader key ownership guards',cases:444,guardReport,targetReport,scope:'252 synthetic composition/keyCode229 or caller-capture-prevented navigation/trigger cases and84 native controls, plus108 outside-target/closed/focused native controls; EN/VI standalone/nested in3engines. No physical OS IME, AT, conformance or human acceptance claim.'};
if(process.env.CS_CASCADER_KEY_GUARDS_REPORT)writeFileSync(process.env.CS_CASCADER_KEY_GUARDS_REPORT,JSON.stringify(report,null,2)+'\n');
console.log('PASS444 Cascader handler/native ownership cases; physical/AT acceptance separate');
