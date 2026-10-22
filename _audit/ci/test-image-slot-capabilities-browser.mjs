import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.goto(origin+'/templates/marketing-page/MarketingPage.dc.html');
 await page.waitForFunction(()=>window.__dcSetProps&&document.querySelector('image-slot')?.shadowRoot?.querySelector('.cap'));
 const cases=await page.locator('image-slot').evaluate(host=>{
  // Isolate synchronous interaction refresh from the separate eventual poll.
  clearInterval(host.authoringTimer);
  const setter=window.__dcSetProps,rows=[];let writes=0;
  for(const event of ['pointerenter','pointerdown','focusin'])for(const editable of [false,true,false]) {
   window.omelette=editable?{writeFile(){writes++;throw Error('Capability probe must never write')}}:undefined;
   host.dispatchEvent(new Event(event));
   rows.push({event,expected:editable,actual:host.hasAttribute('data-editable')});
  }
  // Bridge changes while the pointer is already inside still refresh on down.
  delete window.__dcSetProps;host.dispatchEvent(new Event('pointerdown'));
  rows.push({event:'remove authoring',expected:false,actual:host.hasAttribute('data-authoring')});
  window.__dcSetProps=setter;host.dispatchEvent(new Event('focusin'));
  rows.push({event:'restore authoring',expected:true,actual:host.hasAttribute('data-authoring')});
  return {rows,writes};
 });
 assert(cases.rows.every(row=>row.expected===row.actual),JSON.stringify({browserName,...cases}));
 assert.equal(cases.writes,0);
 console.log(`PASS image-slot capability refresh ${browserName}: ${cases.rows.length} synchronous pointer/focus transitions with polling disabled and zero persistence calls`);
},{browserName});
