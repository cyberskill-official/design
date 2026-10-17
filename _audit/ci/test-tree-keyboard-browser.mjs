import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{
  const e=React.createElement;window.picks=[];
  function Fixture(){const [selected,setSelected]=React.useState();return e('div',null,
   e(CS.Tree,{'aria-label':'Files',selected,onSelect:key=>{picks.push(key);setSelected(key)},nodes:[{key:'p',label:'Parent',children:[{key:'c',label:'Child'}]},{key:'z',label:'Last'}]}),e('input',{'aria-label':'After'}));}
  renderFixture(e(Fixture));
 });
 const current=()=>page.locator('[role="treeitem"]:focus');
 const expectFocus=async label=>{await page.waitForFunction(label=>{const el=document.activeElement;return el?.getAttribute('role')==='treeitem'&&document.getElementById(el.getAttribute('aria-labelledby'))?.textContent===label},label);};
 assert.equal(await page.locator('[role="treeitem"][tabindex="0"]').count(),1,'Treeitem itself must own roving focus');
 await page.getByRole('treeitem',{name:'Parent',exact:true}).focus();await page.keyboard.press('ArrowRight');
 await expectFocus('Parent');assert.equal(await current().getAttribute('aria-expanded'),'true');
 await page.keyboard.press('ArrowRight');await expectFocus('Child');
 assert.equal(await page.getByRole('treeitem',{name:'Parent',exact:true}).count(),1,'Parent accessible name excludes descendants');
 await page.keyboard.press('Enter');assert.deepEqual(await page.evaluate(()=>picks),['c'],'nested key event must not activate ancestor');
 assert.equal(await current().getAttribute('aria-selected'),'true');
 await page.keyboard.press('ArrowLeft');await expectFocus('Parent');
 await page.keyboard.press('ArrowLeft');assert.equal(await current().getAttribute('aria-expanded'),'false');
 await page.keyboard.press('ArrowDown');await expectFocus('Last');
 await page.keyboard.press('Home');await expectFocus('Parent');await page.keyboard.press('End');await expectFocus('Last');
 assert.equal(await current().evaluate(el=>parseFloat(getComputedStyle(el).outlineWidth)>0),true,'Visible keyboard focus');
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'After');
 assert.equal(await page.getByRole('tree',{name:'Files'}).count(),1);
 await page.getByRole('treeitem',{name:'Parent',exact:true}).locator('.cs-tree__twist').click();await expectFocus('Parent');
 assert.deepEqual(await page.evaluate(()=>picks),['c'],'twist expands without selection');
 await page.getByRole('treeitem',{name:'Child',exact:true}).locator('.cs-tree__label').click();await expectFocus('Child');
 assert.deepEqual(await page.evaluate(()=>picks),['c','c']);
 await page.evaluate(()=>renderFixture(React.createElement(CS.TreeSelect,{label:'Choose file',nodes:[{key:'a',label:'Alpha'}],onChange:key=>{window.chosen=key}})));
 await page.getByRole('button',{name:'Choose file'}).focus();await page.keyboard.press('Enter');
 assert.equal(await page.getByRole('tree',{name:'Choose file'}).count(),1);
 await page.keyboard.press('Tab');await expectFocus('Alpha');await page.keyboard.press('Enter');
 assert.equal(await page.evaluate(()=>chosen),'a');assert.equal(await page.getByRole('tree').count(),0);
 await page.waitForFunction(()=>document.activeElement.getAttribute('aria-label')==='Choose file');
 // Public keys are arbitrary strings, including Object.prototype names.
 for(const key of ['__proto__','constructor','toString']) {
  await page.evaluate(key=>renderFixture(React.createElement(CS.Tree,{key,'aria-label':'Special keys',nodes:[{key,label:'Parent',children:[{key:key+'-child',label:'Child'}]}]})),key);
  const parent=page.getByRole('treeitem',{name:'Parent',exact:true});
  assert.equal(await parent.getAttribute('aria-expanded'),'false',key+' starts collapsed');
  await parent.focus();await page.keyboard.press('ArrowRight');
  assert.equal(await parent.getAttribute('aria-expanded'),'true');
  await page.keyboard.press('ArrowRight');await expectFocus('Child');
  await page.keyboard.press('ArrowLeft');await expectFocus('Parent');
  await page.keyboard.press('ArrowLeft');assert.equal(await parent.getAttribute('aria-expanded'),'false');
 }
 await page.evaluate(()=>{
  window.updateTree=nodes=>renderFixture(React.createElement(CS.Tree,{key:'empty-key','aria-label':'Dynamic keys',selected:'',nodes}));
  updateTree([{key:'a',label:'Alpha'},{key:'',label:'Empty'}]);
 });
 assert.equal(await page.getByRole('treeitem',{name:'Empty',exact:true}).getAttribute('tabindex'),'0','Selected empty string is a valid initial focus key');
 await page.getByRole('treeitem',{name:'Empty',exact:true}).focus();
 await page.evaluate(()=>updateTree([{key:'a',label:'Alpha revised'},{key:'',label:'Empty'}]));
 assert.equal(await page.getByRole('treeitem',{name:'Empty',exact:true}).getAttribute('tabindex'),'0','Data replacement preserves existing empty focus key');
 await expectFocus('Empty');
 await page.keyboard.press('ArrowUp');await expectFocus('Alpha revised');
 await page.keyboard.press('ArrowDown');await expectFocus('Empty');
 await page.evaluate(()=>updateTree([]));
 assert.equal(await page.getByRole('treeitem').count(),0);
 await page.evaluate(()=>updateTree([{key:'',label:'Restored'}]));
 assert.equal(await page.getByRole('treeitem',{name:'Restored'}).getAttribute('tabindex'),'0','Repopulated tree has one tab stop');
 console.log('PASS Tree: focused semantic item, own label, expansion/navigation, single activation, pointer parity, focus ring, named root and TreeSelect integration');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
