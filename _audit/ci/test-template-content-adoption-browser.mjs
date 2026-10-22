import {parse} from 'parse5';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from'node:assert/strict';import{readFileSync,writeFileSync,mkdirSync,existsSync}from'node:fs';import{extractPdfText}from'./lib/pdf-text.mjs';import{withBrowserFixture}from'./lib/browser-fixture.mjs';import{unzipEntries}from'./lib/docx-zip.mjs';
const root=process.argv.some(value=>value.startsWith('--root='))?pathToFileURL(resolve(process.argv.find(value=>value.startsWith('--root=' )).slice(7))+'/'):new URL('../../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const displaySources=JSON.parse(read('scripts/template-display-fields.json')).templates;
const fixture=JSON.parse(read('_audit/ci/fixtures/template-content-bindings.json')),manifest=JSON.parse(read('_ds_manifest.json'));
const browserName=process.env.CS_TEST_BROWSER||'chromium';
let currentCase=null;
const normalize=text=>text.normalize('NFC').replace(/\s+/gu,'').toLowerCase();const results=[];
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.route(origin+'/**',async route=>{const path=decodeURIComponent(new URL(route.request().url()).pathname).slice(1);assert(path&&!path.split('/').some(part=>part==='..'||part==='.'));const staged=new URL(path,root);if(!existsSync(staged)&&!existsSync(resolve(path))&&path.endsWith('/.image-slots.state.json'))return route.fallback();const bytes=readFileSync(existsSync(staged)?staged:resolve(path));await route.fulfill({body:bytes,contentType:({html:'text/html',js:'application/javascript',json:'application/json',css:'text/css',woff2:'font/woff2',svg:'image/svg+xml'})[path.split('.').at(-1)]||'application/octet-stream'});});
 for(const entry of fixture.templates.filter(t=>t.slots.some(s=>s.projection==='text'))){
  const template=manifest.templates.find(t=>t.folder==='templates/'+entry.template);assert(template);const schema=JSON.parse(read(entry.path)),slots=schema.slots.filter(s=>s.runtimeBinding==='text'&&!s.runtimeTargets);if(!slots.length)continue;
  await page.goto(origin+'/'+template.entryPath);await page.waitForFunction(()=>window.__dcSetContent&&document.querySelector('[data-sc-name]')&&!document.querySelector('.sc-placeholder'));
  if(!await page.evaluate(()=>typeof window.__csDocExport?.buildDocxBlob==='function'))await page.addScriptTag({url:origin+'/templates/_vendor/doc-export.js'});
  const payload=Object.fromEntries(slots.map((s,i)=>[s.id,'<b>É'+i.toString(36)+'</b>']));assert(slots.every(s=>[...payload[s.id]].length<=s.maxLength));
  const display=displaySources.find(record=>record.template===entry.template),sourceDocument=display?parse(read(display.path)):null,aggregateHtml=new Set(),aggregateDocx=new Set();
  const expectedSlots=language=>slots.filter(slot=>{
   const field=display?.fields.find(field=>field.id===slot.id);if(!field)return true;
   return field.targets.some(target=>{
    let node=target.path.reduce((node,part)=>part==='content'?node.content:node.childNodes[part],sourceDocument);
    for(;node;node=node.parentNode)if(node.tagName==='sc-if'){
     const condition=node.attrs.find(attr=>attr.name==='value')?.value;
     const flags={'{{ isEN }}':language!=='Tiếng Việt','{{ isVN }}':language==='Tiếng Việt','{{ isBoth }}':false,'{{ showSignatures }}':true};
     assert(Object.hasOwn(flags,condition),'Unreviewed scalar destination condition');if(!flags[condition])return false;
    }return true;
   });
  });
  for(const language of ['English','Tiếng Việt']){
   const expected=expectedSlots(language);
   await page.emulateMedia({media:'screen'});await page.evaluate(({language,payload,slug})=>{const root=__dcRootName();__dcSetProps(root,{language,...slug==='auth'?{formState:'default'}:{}});__dcSetContent(root,payload)},{language,payload,slug:entry.template});
   if(entry.template==='settings')await page.getByRole('tab',{name:language==='English'?'Profile':'Hồ sơ',exact:true}).click();
   const coverage={html:new Set(),print:new Set(),docx:new Set(),pdf:new Set()},states=[];
   const snapshot=async label=>{
    currentCase={template:entry.template,language,state:label};
    await page.waitForTimeout(30);const html=await page.locator('[data-sc-name]').textContent();for(const[id,value]of Object.entries(payload))if(html.includes(value))coverage.html.add(id);
    const encoded=await page.evaluate(async()=>{await document.fonts.ready;const blob=await __csDocExport.buildDocxBlob(document.querySelector('[data-sc-name]'));const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary)});
    const xml=unzipEntries(Buffer.from(encoded,'base64'))['word/document.xml'].toString();const doc=await page.evaluate(xml=>{const doc=new DOMParser().parseFromString(xml,'application/xml');return{valid:!doc.querySelector('parsererror'),text:doc.documentElement.textContent}},xml);assert(doc.valid,entry.template+' DOCX XML');for(const[id,value]of Object.entries(payload))if(normalize(doc.text).includes(normalize(value)))coverage.docx.add(id);
    await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
    const visible=await page.evaluate(payload=>{const root=document.querySelector('[data-sc-name]'),walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),found=new Set();let node;while(node=walker.nextNode()){if(!node.textContent)continue;let visible=true;for(let el=node.parentElement;el;el=el.parentElement){const style=getComputedStyle(el);if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0){visible=false;break}}const range=document.createRange();range.selectNodeContents(node);const rect=range.getBoundingClientRect();if(!visible||!rect.width||!rect.height||rect.bottom<=0||rect.right<=0)continue;for(const[id,value]of Object.entries(payload))if(node.textContent.includes(value))found.add(id)}return[...found]},payload);
    visible.forEach(id=>coverage.print.add(id));
    let pdfPages=null;
    if(browserName==='chromium'){
     const bytes=await page.pdf({printBackground:true,preferCSSPageSize:true});assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
     const diagnostic=process.argv.find(value=>value.startsWith('--diagnostic-dir='))?.slice(17);if(diagnostic){mkdirSync(diagnostic,{recursive:true});writeFileSync(join(diagnostic,'current-case.json'),JSON.stringify(currentCase));writeFileSync(join(diagnostic,'current.pdf'),bytes);}
     const pdf=extractPdfText(bytes);assert(pdf.pages>0);pdfPages=pdf.pages;
     for(const[id,value]of Object.entries(payload))if(normalize(pdf.text).includes(normalize(value)))coverage.pdf.add(id);
     for(const id of visible){if(!coverage.pdf.has(id)){mkdirSync('test-results/g57-pdf-debug',{recursive:true});writeFileSync('test-results/g57-pdf-debug/missing.pdf',bytes);writeFileSync('test-results/g57-pdf-debug/missing.json',JSON.stringify({template:entry.template,language,label,id,payload,pdfText:pdf.text},null,2));}assert(coverage.pdf.has(id),entry.template+'/'+language+'/'+label+'/'+id+': print-visible bound text must reach actual PDF');}
    }
    states.push({state:label,htmlSlots:[...coverage.html],printVisibleSlots:visible,docxSlots:[...coverage.docx],pdfPages});await page.emulateMedia({media:'screen'});
   };
   await snapshot('default');
   if(entry.template==='auth'){await page.evaluate(()=>__dcSetProps(__dcRootName(),{formState:'error'}));await snapshot('declared-error-state')}
   if(entry.template==='marketing-page'){await page.getByRole('button',{name:payload.talkBtn,exact:true}).first().click();await snapshot('chat-open')}
   if(entry.template==='settings'){
    await page.getByRole('tab',{name:language==='English'?'Notifications':'Thông báo',exact:true}).click();await snapshot('notifications-tab');
    await page.locator('.cs-collapsible').getByRole('button').first().click();await snapshot('advanced-expanded');
   }
   assert.deepEqual([...coverage.html].sort(),expected.map(s=>s.id).sort(),entry.template+'/'+language+': every adopted slot reaches actual rendered HTML');
   assert.deepEqual([...coverage.docx].sort(),expected.map(s=>s.id).sort(),entry.template+'/'+language+': serializer preserves every rendered slot as valid editable XML text');
   coverage.html.forEach(id=>aggregateHtml.add(id));coverage.docx.forEach(id=>aggregateDocx.add(id));
   const rejected=await page.evaluate(slots=>{
    let rejects=0,getterCalls=0;const root=__dcRootName(),before=document.querySelector('[data-sc-name]').textContent;
    const reject=content=>{let threw=false;try{__dcSetContent(root,content)}catch{threw=true}if(!threw)throw Error('Unsafe content accepted');rejects++};
    for(const slot of slots)for(const value of [7,()=>{},'x'.repeat(slot.maxLength+1),'A\u0000B','A\uD800B',...slot.required?['']:[]])reject({[slot.id]:value});
    for(const content of [{unknown:'bad'},{language:'English'},{langAttr:'en'},{rootTheme:'dark'},{openChat:'bad'},{setTab:'bad'},{setFinancialScroll:'bad'},JSON.parse('{"__proto__":"bad"}'),[],Object.create({inherited:'bad'})])reject(content);
    const accessor={};Object.defineProperty(accessor,slots[0].id,{enumerable:true,get(){getterCalls++;return'bad'}});reject(accessor);reject({[Symbol('key')]:'bad'});
    if(getterCalls)throw Error('Content getter executed');if(document.querySelector('[data-sc-name]').textContent!==before)throw Error('Rejected content changed prior state');return{rejects,getterCalls};
   },slots);
   if(entry.template==='marketing-page')await page.getByRole('button',{name:language==='English'?'Close':'Đóng',exact:true}).click();
   results.push({template:entry.template,language,slots:slots.length,expectedLanguageSlots:expected.map(slot=>slot.id),htmlCovered:coverage.html.size,docxCovered:coverage.docx.size,printCovered:coverage.print.size,pdfCovered:coverage.pdf.size,printOmissions:slots.filter(s=>!coverage.print.has(s.id)).map(s=>s.id),...rejected,states});
  }
  assert.deepEqual([...aggregateHtml].sort(),slots.map(slot=>slot.id).sort(),entry.template+': every adopted scalar slot reaches actual HTML in a supported language');
  assert.deepEqual([...aggregateDocx].sort(),slots.map(slot=>slot.id).sort(),entry.template+': every adopted scalar slot reaches actual DOCX in a supported language');
 }
},{browserName});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({browserName,results,scope:'All adopted plain-text slots in their source-supported EN/VI destinations actual HTML and direct shipped DOCX serializer; actual print media visibility and Chromium PDF parsed text. UI-only navigation intentionally omitted by print rules is recorded; no universal product export menu or native Office fidelity is promised.'},null,2)+'\n');
console.log(JSON.stringify({pass:true,browserName,templates:new Set(results.map(r=>r.template)).size,languageContexts:results.length,slotLanguageContexts:results.reduce((n,r)=>n+r.slots,0),rejectCases:results.reduce((n,r)=>n+r.rejects,0),scope:'Complete declared plain-text projection coverage by actual conditional language destinations; escaped literal HTML-like Unicode text, valid DOCX XML, Chromium-only parsed print-visible PDF text (other engines: HTML/DOCX/print layout), locked/type/length/function/axis/prototype/accessor/XML guards.'}));
