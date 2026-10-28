import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readdirSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {extractPdfText} from './lib/pdf-text.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const directory=mkdtempSync(join(tmpdir(),'cs-pdf-handoff-test-')),temporaryRoot=join(directory,'children');
import {mkdirSync} from 'node:fs';mkdirSync(temporaryRoot);
try {
 const fixture=join(directory,'parser.mjs'),marker=join(directory,'seen.json');
 function runFixture(body,options={}) {writeFileSync(fixture,`import fs from 'node:fs';const path=process.argv[2];fs.writeFileSync(${JSON.stringify(marker)},JSON.stringify({path,bytes:[...fs.readFileSync(path)],mode:fs.statSync(path).mode&0o777,stdin:fs.readFileSync(0,'utf8')}));\n`+body);try{return extractPdfText(Buffer.from('%PDF-1.7\nActual binary\0\xff','latin1'),{python:process.execPath,helperPath:fixture,temporaryRoot,...options});}finally{assert.deepEqual(readdirSync(temporaryRoot),[],'private PDF directory cleaned on every outcome');}}
 const expected={parser:'pypdf',version:'6.21.4',pages:2,text:'Actual Unicode: Kiểm chứng É8'};
 assert.deepEqual(runFixture('process.stdout.write('+JSON.stringify(JSON.stringify(expected))+');'),expected);
 const seen=JSON.parse(readFileSync(marker));assert.equal(seen.stdin,'','stdin is ignored rather than an unbounded stream');assert.deepEqual(seen.bytes,[...Buffer.from('%PDF-1.7\nActual binary\0\xff','latin1')]);if(process.platform!=='win32')assert.equal(seen.mode,0o600);
 assert.throws(()=>runFixture('process.stderr.write("fixture parser failure");process.exit(7);'),/fixture parser failure/);
 assert.throws(()=>runFixture('process.stdout.write("not JSON");'),/malformed JSON/);
 assert.throws(()=>runFixture('process.stdout.write(JSON.stringify({parser:"invented",version:"6.21.4",pages:1,text:"wrong"}));'),/invalid parser metadata/);
 const before=Date.now();assert.throws(()=>runFixture('setInterval(()=>{},1000);',{timeoutMs:150}),/ETIMEDOUT/);assert(Date.now()-before<5000,'deadline must bound a stuck parser');
 assert.throws(()=>runFixture('process.stdout.write("x".repeat(34*1024*1024));'),/ENOBUFS/);
 assert.throws(()=>extractPdfText('not bytes'),/actual PDF bytes/);assert.throws(()=>extractPdfText(Buffer.from('x'),{timeoutMs:0}),/positive integer/);
 assert.throws(()=>extractPdfText(Buffer.from('%PDF-broken'),{temporaryRoot}),/PDF text extraction failed/);assert.deepEqual(readdirSync(temporaryRoot),[],'actual malformed PDF also cleans up');
 let actual;
 await withBrowserFixture(async page=>{await page.setContent('<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body><h1>PDF_HANDOFF_REAL_CONTENT</h1><p>Second actual text assertion</p><div style="break-before:page">PDF_SECOND_PAGE</div></body></html>');actual=extractPdfText(await page.pdf({printBackground:true}),{temporaryRoot});},{browserName:'chromium'});
 assert.equal(actual.pages,2);for(const text of['PDF_HANDOFF_REAL_CONTENT','Second actual text assertion','PDF_SECOND_PAGE'])assert(actual.text.includes(text),'actual browser PDF text retained: '+text);assert.deepEqual(readdirSync(temporaryRoot),[]);
 console.log('PASS file-based actual PDF handoff: byte fidelity, stdin EOF, private mode, metadata, malformed/error/timeout/output bounds, cleanup and real two-page Chromium content');
}finally{rmSync(directory,{recursive:true,force:true});}
