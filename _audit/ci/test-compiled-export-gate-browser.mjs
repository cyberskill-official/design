import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {createVerificationServer} from '../../scripts/lib/verification-server.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const server=await createVerificationServer(root);let browser;
try{
 await new Promise(done=>server.listen(0,'127.0.0.1',done));browser=await chromium.launch();const page=await browser.newPage();
 await page.goto('http://127.0.0.1:'+server.address().port+'/_audit/package-exports-integrity.html');
 await page.waitForFunction(()=>window.__pkgexports,{timeout:35000});
 const verdict=await page.evaluate(()=>window.__pkgexports);assert.equal(verdict.pass,true,JSON.stringify(verdict));assert.equal(verdict.total,8,'All existing export gate checks retained');
 console.log('PASS browser package export gate:8 retained rows, compiled/source/legacy targets, files coverage, shared granular route and linked client ESM entry');
}finally{await browser?.close();await new Promise(done=>server.close(done))}
