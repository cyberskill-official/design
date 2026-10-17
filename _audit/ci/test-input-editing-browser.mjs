import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const failures=[];
await withBrowserFixture(async page=>{
 async function check(name,run){try{await run();console.log('PASS '+name)}catch(e){failures.push(name+': '+e.message)}}
 for(const state of ['disabled','readOnly'])await check('InputGroup '+state,async()=>{
  await page.evaluate(state=>{window.changes=[];window.drawGroup=locked=>renderFixture(React.createElement(CS.InputGroup,{key:state,lang:'en',defaultValue:'secret',password:true,clearable:true,[state]:locked,onChange:v=>changes.push(v)}));drawGroup(true)},state);
  const clear=page.getByRole('button',{name:'Clear',exact:true});
  assert.equal(await clear.isDisabled(),true,'clear must not mutate a locked value');
  assert.equal(await page.getByRole('button',{name:'Show password',exact:true}).isDisabled(),state==='disabled');
  await clear.evaluate(b=>b.click());
  assert.equal(await page.locator('input').inputValue(),'secret');
  assert.deepEqual(await page.evaluate(()=>changes),[]);
  await page.evaluate(()=>drawGroup(false));
  await page.getByRole('button',{name:'Show password',exact:true}).click();
  assert.equal(await page.locator('input').getAttribute('type'),'text');
  await clear.click();
  assert.equal(await page.locator('input').inputValue(),'');
  assert.deepEqual(await page.evaluate(()=>changes),['']);
 });
 for(const controlled of [false,true])await check('InputOTP native deletion '+(controlled?'controlled':'uncontrolled'),async()=>{
  await page.evaluate(controlled=>{
   window.changes=[];window.completed=[];
   window.drawOTP=value=>renderFixture(React.createElement(CS.InputOTP,{key:String(controlled),length:4,...(controlled?{value}:{}),onChange:v=>changes.push(v),onComplete:v=>completed.push(v)}));
   drawOTP('1234');
  },controlled);
  const boxes=page.locator('.cs-otp input');
  if(!controlled)for(let i=0;i<4;i++)await boxes.nth(i).fill(String(i+1));
  await page.evaluate(()=>{changes=[];completed=[]});
  await boxes.nth(1).fill('');
  assert.deepEqual(await page.evaluate(()=>changes),['134'],'native delete/clear must notify parent');
  assert.deepEqual(await page.evaluate(()=>completed),[],'incomplete code must not complete');
  assert.deepEqual(await boxes.evaluateAll(xs=>xs.map(x=>x.value)),controlled?['1','2','3','4']:['1','3','4','']);
  if(controlled)await page.evaluate(()=>drawOTP('134'));
  assert.deepEqual(await boxes.evaluateAll(xs=>xs.map(x=>x.value)),['1','3','4','']);
  await boxes.nth(1).fill('x');
  assert.deepEqual(await page.evaluate(()=>changes),['134'],'invalid text must not delete a digit');
  await boxes.nth(1).fill('9');
  assert.deepEqual(await page.evaluate(()=>changes),['134','194']);
 });
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
assert.deepEqual(failures,[],failures.join('\n'));
