import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>{
  window.scrollDescriptor=Object.getOwnPropertyDescriptor(window,'scrollY');
  window.nativeScrollTo=window.scrollTo.bind(window);
  window.position=500;Object.defineProperty(window,'scrollY',{configurable:true,get:()=>position});
  window.scrolls=[];window.scrollTo=options=>scrolls.push(options);
  window.drawBackTop=threshold=>renderFixture(React.createElement(CS.BackTop,{threshold}));drawBackTop(320);
 });
 await page.getByRole('button',{name:'Back to top'}).click();
 assert.deepEqual(await page.evaluate(()=>scrolls),[{top:0,behavior:'instant'}],'Reduced motion must avoid smooth scrolling');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.getByRole('button',{name:'Back to top'}).click();
 assert.deepEqual(await page.evaluate(()=>scrolls[1]),{top:0,behavior:'smooth'},'Live preference change applies without remount');
 await page.evaluate(()=>drawBackTop(600));await page.getByRole('button').waitFor({state:'detached'});
 await page.evaluate(()=>{position=700;window.dispatchEvent(new Event('scroll'))});await page.getByRole('button').waitFor();
 await page.evaluate(()=>{position=600;window.dispatchEvent(new Event('scroll'))});await page.getByRole('button').waitFor({state:'detached'});
 await page.evaluate(()=>renderFixture(null));await page.evaluate(()=>window.dispatchEvent(new Event('scroll')));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>{
  Object.defineProperty(window,'scrollY',scrollDescriptor);window.scrollTo=nativeScrollTo;
  document.body.style.height='3000px';document.documentElement.style.scrollBehavior='smooth';
  window.scrollTo({top:500,behavior:'instant'});drawBackTop(320);
 });
 await page.getByRole('button',{name:'Back to top'}).click();
 assert.equal(await page.evaluate(()=>window.scrollY),0,'Reduced motion overrides page smooth-scroll CSS with native instant scrolling');
 console.log('PASS BackTop: reduced motion, live preference, threshold updates, scroll visibility and unmount');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
