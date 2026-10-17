import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {unzipEntries} from './lib/docx-zip.mjs';
await withBrowserFixture(async page=>{
 await page.addScriptTag({url:'/templates/_vendor/doc-export.js'});
 await page.evaluate(()=>{
   document.getElementById('fixture').innerHTML='<article class="cs-sheet">Opening clause<section>Section lead<div>Block content</div>Section tail</section><ul><li>Parent clause<ul><li>Nested clause</li></ul>Parent tail</li><li>Sibling clause</li></ul><table><tr><td>Tiếng Việt<div>English translation</div>Final cell clause</td></tr></table>Closing clause</article>';
 });
 const b64=await page.evaluate(async()=>{
   const bytes=new Uint8Array(await (await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'))).arrayBuffer());
   let data='';for(const b of bytes)data+=String.fromCharCode(b);return btoa(data);
 });
 const xml=unzipEntries(Buffer.from(b64,'base64'))['word/document.xml'].toString();
 const text=await page.evaluate(xml=>{
   const doc=new DOMParser().parseFromString(xml,'application/xml');
   return [...doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main','t')].map(n=>n.textContent).join('').replace(/\s+/g,'');
 },xml);
 assert.equal(text,'Opening clause Section lead Block content Section tail Parent clause Nested clause Parent tail Sibling clause Tiếng Việt English translation Final cell clause Closing clause'.replace(/\s+/g,''));
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS DOCX mixed content: root/section/list/cell text preserved in order');
