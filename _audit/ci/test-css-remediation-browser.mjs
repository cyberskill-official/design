import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.setViewportSize({width:320,height:640});
 await page.setContent(`<link rel="stylesheet" href="${origin}/styles.css"><style>.card,.case{min-width:173px}</style><div class="card">Consumer card</div><article class="case">Consumer case</article><div id="compact" style="display:grid;grid-template-columns:repeat(3,1fr)"></div><div id="spaced" style="display:grid;grid-template-columns: repeat(3, 1fr)"></div><div class="cs-canvas-desk"><div id="canvas" style="display:grid;grid-template-columns:repeat(3,1fr)"></div></div><span class="cs-spinner"></span><span class="cs-button__spinner"></span>`);
 await page.locator('.cs-spinner').waitFor();
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('#compact')).gridTemplateColumns.split(' ').length===1);
 for(const selector of ['.card','.case'])assert.equal(await page.locator(selector).evaluate(el=>getComputedStyle(el).minWidth),'173px');
 for(const id of ['compact','spaced'])assert.equal(await page.locator('#'+id).evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,id);
 assert.equal(await page.locator('#canvas').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),3,'Export canvas preserves columns');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const selector of ['.cs-spinner','.cs-button__spinner'])assert.equal(await page.locator(selector).evaluate(el=>getComputedStyle(el).animationName),'none');
 // These standalone sheets must honor reduced motion even without the global safety net.
 await page.setContent(`<style>${await (await import('node:fs/promises')).readFile('base/feedback.css','utf8')}\n${await (await import('node:fs/promises')).readFile('base/components.css','utf8')}</style><span class="cs-spinner"></span><span class="cs-button__spinner"></span>`);
 for(const selector of ['.cs-spinner','.cs-button__spinner'])assert.equal(await page.locator(selector).evaluate(el=>getComputedStyle(el).animationName),'none');
},{browserName:process.env.CS_BROWSER||'chromium'});
console.log('PASS CSS remediation: consumer class isolation, compact/spaced responsive grids, preserved export columns and standalone/full-sheet reduced motion.');
