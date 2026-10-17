import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page=>{
 for(const dir of ['ltr','rtl'])for(const [value,max,fraction] of [[64,100,.64],[0,100,0],[150,100,1],[-2,100,0],[4,8,.5],[50,0,.5],['invalid',100,0]]){
   await page.evaluate(({value,max,dir})=>{
     renderFixture(React.createElement('div',{dir,style:{width:250}},React.createElement(CS.ProgressBar,{value,max,label:'Upload progress'})));
   },{value,max,dir});
   await page.waitForFunction(()=>document.querySelector('.cs-progress'));
   // End width animation before inspecting the intended settled value.
   const result=await page.evaluate(()=>{
     const bar=document.querySelector('.cs-progress'), fill=bar.firstElementChild;
     fill.style.transition='none';
     const b=bar.getBoundingClientRect(), f=fill.getBoundingClientRect();
     return {width:b.width,height:b.height,fillWidth:f.width,fillHeight:f.height,color:getComputedStyle(fill).backgroundColor,now:Number(bar.getAttribute('aria-valuenow')),max:Number(bar.getAttribute('aria-valuemax'))};
   });
   assert.equal(result.fillHeight,result.height,`Fill height: ${dir}, ${value}/${max}`);
   assert(Math.abs(result.fillWidth-result.width*fraction)<.1,`Fill width: ${JSON.stringify(result)}`);
   assert.equal(result.now/result.max,fraction);
   assert.notEqual(result.color,'rgba(0, 0, 0, 0)');
 }
});
console.log('PASS ProgressBar: 14 LTR/RTL value/range cases render visible fill dimensions matching accessible values');
