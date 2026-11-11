import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {unzipEntries} from './lib/docx-zip.mjs';
await withBrowserFixture(async page=>{
 await page.addScriptTag({url:'/templates/_vendor/doc-export.js'});
 await page.evaluate(()=>{
   document.getElementById('fixture').innerHTML='<article class="cs-sheet">Opening clause<p>Address line 1<br>Address line 2</p><section>Section lead<div>Block content</div>Section tail</section><ul><li>Parent clause<ul><li>Nested clause</li></ul>Parent tail</li><li>Sibling clause</li></ul><table><tr><td>Tiếng Việt<div>English translation</div>Final cell clause</td></tr></table>Closing clause</article>';
 });
 const b64=await page.evaluate(async()=>{
   const bytes=new Uint8Array(await (await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'))).arrayBuffer());
   let data='';for(const b of bytes)data+=String.fromCharCode(b);return btoa(data);
 });
 const xml=unzipEntries(Buffer.from(b64,'base64'))['word/document.xml'].toString();
 const parsed=await page.evaluate(xml=>{
   const ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
   const doc=new DOMParser().parseFromString(xml,'application/xml');
   const text=[...doc.getElementsByTagNameNS(ns,'t')].map(n=>n.textContent).join('').replace(/\s+/g,'');
   const brCount=doc.getElementsByTagNameNS(ns,'br').length;
   const paraLines=[...doc.getElementsByTagNameNS(ns,'p')].map(p=>[...p.childNodes].flatMap(r=>{
     if(r.localName!=='r')return[];
     return [...r.childNodes].map(c=>c.localName==='br'?'\n':c.localName==='t'?c.textContent:'');
   }).join(''));
   return {text,brCount,paraLines};
 },xml);
 assert.equal(parsed.brCount,1,'HTML <br> must serialize to an OpenXML <w:br/> run');
 assert.ok(parsed.paraLines.includes('Address line 1\nAddress line 2'),'<br> line breaks must separate lines without inserting spurious spaces');
 assert.equal(parsed.text,'Opening clause Address line 1 Address line 2 Section lead Block content Section tail Parent clause Nested clause Parent tail Sibling clause Tiếng Việt English translation Final cell clause Closing clause'.replace(/\s+/g,''));
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS DOCX mixed content: root/section/list/cell text and <br> line breaks preserved in order');
