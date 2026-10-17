import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {unzipEntries} from './lib/docx-zip.mjs';
await withBrowserFixture(async page=>{
 await page.addScriptTag({url:'/templates/_vendor/doc-export.js'});
 await page.evaluate(()=>{document.getElementById('fixture').innerHTML='<article class="cs-sheet"><table><tbody><tr><td rowspan="2" colspan="2">Merged A</td><td>Right one</td></tr><tr><td>Right two</td></tr><tr><td>After one</td><td>After two</td><td>After three</td></tr></tbody><tbody><tr><td>Left one</td><td rowspan="0" colspan="2">To group end</td></tr><tr><td>Left two</td></tr><tr><td>Left three</td></tr></tbody><tbody><tr><td>Ragged left</td><td rowspan="2">Ragged middle</td><td>Ragged right</td></tr><tr></tr></tbody><tbody><tr><td>New group one</td><td>New group two</td><td>New group three</td></tr></tbody></table></article>';});
 const b64=await page.evaluate(async()=>{const bytes=new Uint8Array(await(await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'))).arrayBuffer());let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s);});
 const xml=unzipEntries(Buffer.from(b64,'base64'))['word/document.xml'].toString();
 const table=await page.evaluate(xml=>{
  const doc=new DOMParser().parseFromString(xml,'application/xml'),ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const els=(n,name)=>[...n.getElementsByTagNameNS(ns,name)];const tbl=els(doc,'tbl')[0];
  return {widths:els(tbl,'gridCol').map(n=>Number(n.getAttributeNS(ns,'w'))),rows:els(tbl,'tr').map(tr=>els(tr,'tc').map(tc=>({text:els(tc,'t').map(n=>n.textContent).join(''),width:Number(els(tc,'tcW')[0].getAttributeNS(ns,'w')),span:Number(els(tc,'gridSpan')[0]?.getAttributeNS(ns,'val')||1),merge:els(tc,'vMerge')[0]?.getAttributeNS(ns,'val')||null})))};
 },xml);
 assert.deepEqual(table.rows.map(row=>row.map(c=>[c.text,c.span,c.merge])),[
   [['Merged A',2,'restart'],['Right one',1,null]],
   [['',2,'continue'],['Right two',1,null]],
   [['After one',1,null],['After two',1,null],['After three',1,null]],
   [['Left one',1,null],['To group end',2,'restart']],
   [['Left two',1,null],['',2,'continue']],
   [['Left three',1,null],['',2,'continue']],
   [['Ragged left',1,null],['Ragged middle',1,'restart'],['Ragged right',1,null]],
   [['',1,null],['',1,'continue'],['',1,null]],
   [['New group one',1,null],['New group two',1,null],['New group three',1,null]],
 ]);
 for(const row of table.rows){let col=0;for(const cell of row){assert.equal(cell.width,table.widths.slice(col,col+cell.span).reduce((a,b)=>a+b,0),cell.text+' width');col+=cell.span;}assert.equal(col,table.widths.length);}
 const error=await page.evaluate(async()=>{
   const sheet=document.querySelector('.cs-sheet');sheet.innerHTML='<table><tr><td>Left</td><td rowspan="2">Spanning</td></tr><tr><td colspan="2">Overlap</td></tr></table>';
   try {await window.__csDocExport.buildDocxBlob(sheet);return null;}catch(e){return e.message;}
 });
 assert.match(error,/Overlapping HTML table spans/);
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS DOCX row spans: combined spans, continuation cells, rowspan zero and group boundaries');
