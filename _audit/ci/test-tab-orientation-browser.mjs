import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 for(const kind of ['Tabs','SegmentedControl'])for(const orientation of ['vertical','horizontal']){
  await page.evaluate(({kind,orientation})=>{
   const e=React.createElement;window.changes=[];
   function Fixture(){const [value,setValue]=React.useState('a');return e('div',null,e(CS[kind],{
    [kind==='Tabs'?'tabs':'options']:[{value:'a',label:'Alpha'},{value:'b',label:'Beta'},{value:'c',label:'Gamma'}],
    value,onChange:v=>{changes.push(v);setValue(v)},'aria-orientation':orientation,'aria-label':'View',
    style:{display:'flex',flexDirection:orientation==='vertical'?'column':'row'}
   }),e('input',{'aria-label':'After'}));}
   renderFixture(e(Fixture,{key:kind+orientation}));
  },{kind,orientation});
  const role=kind==='Tabs'?'tab':'radio',selection=kind==='Tabs'?'aria-selected':'aria-checked';
  const forward=orientation==='vertical'?'ArrowDown':'ArrowRight';
  const back=orientation==='vertical'?'ArrowUp':'ArrowLeft';
  const ignored=orientation==='vertical'?'ArrowRight':'ArrowDown';
  await page.getByRole(role,{name:'Alpha'}).focus();await page.keyboard.press(forward);
  assert.equal(await page.getByRole(role,{name:'Beta'}).getAttribute(selection),'true',kind+' '+orientation+' forward selection');
  assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Beta');
  await page.keyboard.press(ignored);assert.deepEqual(await page.evaluate(()=>changes),['b'],'other-axis key must not select');
  await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Gamma');
  await page.keyboard.press(forward);assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Alpha','wrap forward');
  await page.keyboard.press(back);assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Gamma','wrap backward');
  await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Alpha');
  assert.equal(await page.locator('[role="'+role+'"][tabindex="0"]').count(),1);
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'After','one tab stop per group');
  assert.deepEqual(await page.evaluate(()=>changes),['b','c','a','c','a']);
  console.log('PASS '+kind+' '+orientation+': directional selection/focus, wrapping, Home/End and roving tab stop');
 }
 for(const kind of ['Tabs','SegmentedControl']){
  await page.evaluate(kind=>{
   const e=React.createElement;
   function Fixture(){const [value,setValue]=React.useState('a');return e('div',null,
    e(CS[kind],{...(kind==='SegmentedControl'?{mode:'tabs'}:{}),[kind==='Tabs'?'tabs':'options']:[{value:'a',label:'Alpha',id:'alpha-tab','aria-controls':'alpha-panel'},{value:'b',label:'Beta',id:'beta-tab','aria-controls':'beta-panel'}],value,onChange:setValue,'aria-label':'Views'}),
    e('section',{id:'alpha-panel',role:'tabpanel','aria-labelledby':'alpha-tab',hidden:value!=='a',tabIndex:0},'Alpha content'),
    e('section',{id:'beta-panel',role:'tabpanel','aria-labelledby':'beta-tab',hidden:value!=='b',tabIndex:0},'Beta content'));
   }
   renderFixture(e(Fixture,{key:'panels'+kind}));
  },kind);
  for(const name of ['Alpha','Beta']){
   const tab=page.getByRole('tab',{name});
   assert.equal(await tab.getAttribute('id'),name.toLowerCase()+'-tab');
   assert.equal(await tab.evaluate(el=>document.getElementById(el.getAttribute('aria-controls'))?.getAttribute('aria-labelledby')),name.toLowerCase()+'-tab','tab and panel references are reciprocal');
  }
  await page.getByRole('tab',{name:'Alpha'}).focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tabpanel',{name:'Beta'}).textContent(),'Beta content');
  assert.equal(await page.getByRole('tabpanel',{name:'Alpha'}).count(),0);
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'beta-panel');
  console.log('PASS '+kind+' explicit panel associations, selected visibility and keyboard panel entry');
 }

},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
