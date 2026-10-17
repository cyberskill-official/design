import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.clock.install();
 await page.evaluate(()=>renderFixture(React.createElement('div',null,
  React.createElement(CS.HoverCard,{openDelay:100,closeDelay:100,trigger:React.createElement('button',{id:'trigger'},'Preview')},React.createElement('button',{id:'inside'},'Details')),
  React.createElement('button',{id:'outside'},'Outside'))));
 await page.locator('#trigger').focus();await page.locator('#trigger').hover();await page.clock.runFor(110);
 assert.equal(await page.getByRole('dialog').count(),1);
 await page.locator('#outside').hover();await page.clock.runFor(110);
 assert.equal(await page.getByRole('dialog').count(),1,'Mouse leave must not close a keyboard-focused card');
 await page.locator('#inside').focus();await page.clock.runFor(110);
 assert.equal(await page.getByRole('dialog').count(),1,'Focus within card remains open');
 await page.keyboard.press('Escape');await page.clock.runFor(250);
 assert.equal(await page.getByRole('dialog').count(),0,'Escape from rich content closes card without reopening');
 assert.equal(await page.locator('#trigger').evaluate(el=>el===document.activeElement),true,'Escape returns removed content focus to trigger');
 await page.locator('#outside').focus();await page.locator('#trigger').focus();await page.clock.runFor(110);
 await page.locator('#inside').focus();
 await page.locator('#outside').focus();await page.clock.runFor(110);
 assert.equal(await page.getByRole('dialog').count(),0,'Leaving both focus and hover closes card');
 await page.locator('#trigger').hover();await page.locator('#trigger').focus();
 await page.locator('#outside').focus();await page.locator('#outside').hover();await page.clock.runFor(250);
 assert.equal(await page.getByRole('dialog').count(),0,'Canceled overlapping requests cannot reopen card');
 await page.locator('#trigger').hover();await page.clock.runFor(110);await page.keyboard.press('Escape');await page.clock.runFor(250);
 assert.equal(await page.getByRole('dialog').count(),0,'Escape cancels pending timers');
 assert.equal(await page.locator('#outside').evaluate(el=>el===document.activeElement),true,'Escape from mouse-opened card does not steal outside focus');
 await page.locator('#outside').hover();await page.locator('#trigger').hover();await page.clock.runFor(110);
 await page.locator('#inside').focus();await page.keyboard.press('Escape');await page.clock.runFor(250);
 assert.equal(await page.locator('#trigger').evaluate(el=>el===document.activeElement),true,'Mouse-opened rich content also returns focus to trigger');
 assert.equal(await page.getByRole('dialog').count(),0,'Restoration cannot reopen a mouse-opened card');
 await page.locator('#outside').hover();await page.locator('#trigger').hover();
 await page.evaluate(()=>renderFixture(null));await page.clock.runFor(250);
 assert.equal(await page.getByRole('dialog').count(),0,'Unmount cancels opening');
 console.log('PASS HoverCard: independent hover/focus, internal focus, delayed close, cancellation, Escape and unmount');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
