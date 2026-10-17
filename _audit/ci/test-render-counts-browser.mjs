import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const cases=[
 ['default',undefined,[5,5,6,0,5]],['whole',3,[3,3,3,3,3]],['fraction',2.5,[2,2,2,2,2]],
 ['subunit',0.5,[1,0,0,0,1]],['zero',0,[5,0,0,0,1]],['negative',-2,[1,0,0,0,1]],
 ['nan',NaN,[5,5,6,0,5]],['infinity',Infinity,[5,5,6,0,5]],['negative-infinity',-Infinity,[5,5,6,0,5]],
 ['outside-array-range',2**32,[5,5,6,0,5]],
];
await withBrowserFixture(async page=>{
 for(const lang of ['en','vi'])for(const [name,count,expected]of cases){
  await page.evaluate(({count,lang})=>{
   renderFixture(null);window.countEvents=[];const h=React.createElement;
   window.drawCounts=number=>renderFixture(h('main',null,
    h('section',{id:'meter'},h(CS.ConfidenceMeter,{segments:number,value:1,lang})),
    h('section',{id:'rating'},h(CS.Rating,{max:number,lang,onChange:value=>countEvents.push(['rating',value])})),
    h('section',{id:'otp'},h(CS.InputOTP,{length:number,lang,onComplete:value=>countEvents.push(['complete',value])})),
    h('section',{id:'skeleton'},h(CS.Skeleton,{lines:number})),
    h('section',{id:'table'},h(CS.DataTable,{state:'loading',loadingRows:number,columns:[{key:'name',header:'Name'}],rows:[],lang}))));
   drawCounts(count);
  },{count,lang});
  const [meter,rating,otp,lines,rows]=expected;const context=browserName+'/'+lang+'/'+name;
  assert.equal(await page.locator('.cs-confidence__seg').count(),meter,context+' meter count');
  assert.equal(await page.getByRole('meter').getAttribute('aria-valuemax'),String(meter),context+' meter max');
  assert.equal(await page.getByRole('meter').getAttribute('aria-valuenow'),String(meter),context+' meter now');
  assert.equal(await page.getByRole('radio').count(),rating,context+' stars');
  assert.equal(await page.locator('#otp input').count(),otp,context+' boxes');
  assert.equal(await page.locator('#table tbody tr').count(),rows,context+' loading rows');
  assert.equal(await page.locator('#skeleton .cs-skeleton--text').count(),lines,context+' text lines');
  if(lines)assert.equal(await page.locator('#skeleton .cs-skeleton--text').last().evaluate(e=>e.style.width),'70%',context+' last line');
  else assert.equal(await page.locator('#skeleton > .cs-skeleton').count(),1,context+' block fallback');
  if(rating){
   await page.getByRole('radio').first().press('End');
   assert.equal(await page.getByRole('radio').last().getAttribute('aria-checked'),'true',context+' End selects last rendered star');
   assert.equal(await page.locator('#rating [role=radio][tabindex="0"]').count(),1,context+' keyboard entry');
   assert.equal(await page.getByRole('radio').last().getAttribute('aria-label'),rating+' / '+rating,context+' integer label');
   assert.deepEqual(await page.evaluate(()=>countEvents.filter(e=>e[0]==='rating').at(-1)),['rating',rating],context+' integer callback');
  }
  if(otp){
   const code='123456789'.slice(0,otp);
   for(let i=0;i<otp;i++)await page.locator('#otp input').nth(i).fill(code[i]);
   assert.deepEqual(await page.evaluate(()=>countEvents.filter(e=>e[0]==='complete')), [['complete',code]],context+' completion at rendered length');
   assert.match(await page.locator('#otp input').last().getAttribute('aria-label'),new RegExp(otp+'/'+otp+'$'),context+' integer box label');
  }
  if(name==='fraction'){
   await page.evaluate(()=>drawCounts(3.8));
   assert.equal(await page.locator('#otp input').count(),3);await page.locator('#otp input').last().fill('3');
   assert.deepEqual(await page.evaluate(()=>countEvents.filter(e=>e[0]==='complete').at(-1)),['complete','123']);
   await page.getByRole('radio').first().press('End');assert.equal(await page.getByRole('radio').last().getAttribute('aria-checked'),'true');
   assert.equal(await page.getByRole('meter').getAttribute('aria-valuemax'),'3');assert.equal(await page.locator('.cs-confidence__seg').count(),3);
   assert.equal(await page.locator('#table tbody tr').count(),3);assert.equal(await page.locator('#skeleton .cs-skeleton--text').last().evaluate(e=>e.style.width),'70%');
  }
 }
},{browserName});
console.log('PASS '+browserName+': five public count contracts; 20 EN/VI count cases, matching rendered lengths/ARIA, real OTP completion, rating End/focus, final skeleton width and live growth.');
