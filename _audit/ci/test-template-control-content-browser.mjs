import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,globSync} from 'node:fs';
import {Script} from 'node:vm';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {unzipEntries} from './lib/docx-zip.mjs';
const root=new URL('../../',import.meta.url);const read=p=>readFileSync(new URL(p,root),'utf8');const hash=t=>createHash('sha256').update(t).digest('hex');
const cases=[
 {path:'templates/vn-salary-scale/VnSalaryScale.dc.html',list:'grades',array:'grades',fields:['n','vi','en'],counts:[5]},
 {path:'templates/vn-receipt-acknowledgement/VnReceiptAcknowledgement.dc.html',list:'docs',array:'docs',fields:['vi','en'],counts:[12]},
 {path:'templates/vn-labour-management-book/VnLabourManagementBook.dc.html',list:'fields',array:'fields',fields:['n','vi','en'],counts:[13]},
 {path:'templates/vn-foreign-employee-pack/VnForeignEmployeePack.dc.html',list:'steps',array:'steps',fields:['n','vi','en','tvi','ten'],counts:[6]},
 {path:'templates/vn-disciplinary-schedule/VnDisciplinarySchedule.dc.html',list:'rows',array:'rows',fields:['group','groupEn','vi','en','first','repeat'],counts:[8]},
 {path:'templates/doc-suite-index/DocSuiteIndex.dc.html',list:'sec.rows',array:'sections',fields:['vi','en','code'],counts:[3,10,4,9,5,5,4,9,4,6]},
];
const paths=globSync('templates/**/*.dc.html',{cwd:root.pathname});assert.equal(paths.length,85);
const tableControlPaths=paths.filter(path=>{const markup=read(path).split('<x-dc>')[1]?.split('</x-dc>')[0]||'';let depth=0;for(const m of markup.matchAll(/<(\/?)(table|sc-for|sc-if)\b[^>]*>/g)){if(m[2]==='table')depth+=m[1]?-1:1;else if(!m[1]&&depth>0)return true;}return false;});
assert.deepEqual(tableControlPaths.sort(),cases.map(c=>c.path).sort(),'Every authored table-control template needs a content contract');
for(const spec of cases){const raw=read(spec.path);const script=/<script\b[^>]*\bdata-dc-script\b[^>]*>([\s\S]*?)<\/script\s*>/i.exec(raw);assert(script,'Missing trusted authored logic');spec.logic=new Script('(()=>{'+script[1]+';return new Component(__props).renderVals();})()',{filename:spec.path});const loop=[...raw.matchAll(/<sc-for\b[^>]*list="\{\{\s*([^{}]+?)\s*\}\}"[^>]*>/g)].find(m=>m[1]===spec.list);assert(loop,'Missing authored loop contract');spec.tableIndex=[...raw.slice(0,loop.index).matchAll(/<table\b/g)].length-1;spec.sourceSha256=hash(raw);}
function values(spec,props){class DCLogic{constructor(props){this.props=props;}}const data=spec.logic.runInNewContext({DCLogic,__props:props},{timeout:1000});return JSON.parse(JSON.stringify(data));}
const override=process.env.CS_TEMPLATE_CONTROL_RUNTIME;const runtime=override?readFileSync(override,'utf8'):null;const rows=[],smoke=[],failures=[];let expectedContexts=0;
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 if(runtime!==null)await page.route('**/support.js',route=>route.fulfill({contentType:'text/javascript',body:runtime}));
 const ready=async()=>{await page.waitForFunction(()=>window.__dcRootName?.()&&document.querySelector('[data-sc-name]')&&!document.querySelector('.sc-placeholder'));await page.evaluate(()=>Promise.all(Object.values(window.__csTemplateBundleLoads||{})));await page.evaluate(()=>document.fonts.ready);};
 for(const spec of cases){
  await page.goto(new URL('/'+spec.path,page.url()).href);await ready();const schema=await page.locator('script[data-props]').evaluate(el=>JSON.parse(el.getAttribute('data-props')));const langs=schema.language?.options||[null],elements=schema.element?.options||[null];expectedContexts+=2*langs.length*elements.length;
  for(const theme of ['light','dark'])for(const language of langs)for(const element of elements){
   const props=Object.fromEntries(Object.entries(schema).map(([key,record])=>[key,record.default]));if(language!==null)props.language=language;if(element!==null)props.element=element;if(schema.theme)props.theme=theme;
   const data=values(spec,props);const expected=spec.array==='sections'?data.sections.map(s=>s.rows):[data[spec.array]];assert.deepEqual(expected.map(a=>a.length),spec.counts,'Preserve authored business/reference row counts');
   await page.evaluate(({theme,props})=>{document.documentElement.dataset.theme=theme;window.__dcSetProps(window.__dcRootName(),props);},{theme,props});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const actual=await page.evaluate(({index,expected,fields})=>{const tables=[...document.querySelectorAll('[data-sc-name] table')].slice(index,index+expected.length);const clean=v=>String(v??'').replace(/\s+/g,'');return expected.map((wanted,i)=>{const body=[...(tables[i]?.querySelectorAll('tbody tr')||[])];return {expectedRows:wanted.length,actualRows:body.length,emptyRows:body.filter(tr=>!tr.textContent.trim()).length,unpaintedRows:body.filter(tr=>!tr.getClientRects().length||getComputedStyle(tr).visibility!=='visible').length,missingFields:wanted.flatMap((item,n)=>fields.filter(field=>item[field]!==undefined&&clean(item[field])&&!clean(body[n]?.textContent).includes(clean(item[field]))).map(field=>({row:n,field})))};});},{index:spec.tableIndex,expected,fields:spec.fields});
   await page.addScriptTag({url:new URL('/templates/_vendor/doc-export.js',page.url()).href});
   const b64=await page.evaluate(async()=>{const sheets=[...document.querySelectorAll('[data-sc-name] .cs-sheet')];if(sheets.length!==1)throw Error('Expected one actual export sheet, got '+sheets.length);const root=sheets[0];const bytes=new Uint8Array(await(await window.__csDocExport.buildDocxBlob(root)).arrayBuffer());let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s);});
   const xml=unzipEntries(Buffer.from(b64,'base64'))['word/document.xml'].toString();
   const headerCounts=await page.evaluate(({index,count})=>[...document.querySelectorAll('[data-sc-name] table')].slice(index,index+count).map(t=>t.tHead?.rows.length||0),{index:spec.tableIndex,count:expected.length});
   const exported=await page.evaluate(({xml,expected,fields,headerCounts})=>{
    const doc=new DOMParser().parseFromString(xml,'application/xml');const ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main';const els=(n,name)=>[...n.getElementsByTagNameNS(ns,name)];const tables=els(doc,'tbl');const clean=v=>String(v??'').replace(/\s+/g,'');
    return expected.map((wanted,i)=>{const candidates=tables.map((table,tableIndex)=>{const rows=[...table.children].filter(n=>n.namespaceURI===ns&&n.localName==='tr').slice(headerCounts[i]);const missingFields=wanted.flatMap((item,n)=>{const text=rows[n]?els(rows[n],'t').map(e=>e.textContent).join(''):'';return fields.filter(field=>item[field]!==undefined&&clean(item[field])&&!clean(text).includes(clean(item[field]))).map(field=>({row:n,field}));});return {tableIndex,actualRows:rows.length,missingFields};});const matches=candidates.filter(c=>c.actualRows===wanted.length&&!c.missingFields.length);return {expectedRows:wanted.length,matchingTables:matches.map(c=>c.tableIndex),actualRows:matches.length===1?matches[0].actualRows:null,missingFields:matches.length===1?[]:[{reason:'Expected exactly one exported data table matching every authored row',matchingTables:matches.length,candidateRowCounts:candidates.map(c=>c.actualRows)}]};});
   },{xml,expected,fields:spec.fields,headerCounts});
   const row={browserName,path:spec.path,theme,language,element,tables:actual,docxTables:exported};
   if(exported.some(t=>t.expectedRows!==t.actualRows||t.missingFields.length))failures.push({...row,exportFailure:true});rows.push(row);if(actual.some(t=>t.expectedRows!==t.actualRows||t.emptyRows||t.unpaintedRows||t.missingFields.length))failures.push(row);
  }
 }
 for(const path of paths){await page.goto(new URL('/'+path,page.url()).href);await ready();const state=await page.evaluate(()=>({errors:[...document.querySelectorAll('.sc-logic-error')].map(e=>e.textContent),text:document.querySelector('[data-sc-name]').textContent.trim().length}));smoke.push({browserName,path,...state});if(state.errors.length||!state.text)failures.push({browserName,path,smoke:state});}
 console.log(JSON.stringify({browserName,contentContexts:rows.filter(r=>r.browserName===browserName).length,templateBoots:smoke.filter(r=>r.browserName===browserName).length}));
},{browserName});
const report={rows,smoke,failures,sourceFiles:Object.fromEntries(cases.map(c=>[c.path,c.sourceSha256])),runtimeOverrideSha256:runtime===null?null:hash(runtime),scope:'Actual six authored table-control templates: every declared language/element, Light/Dark roots and three engines; source-logic array counts and every referenced text field checked against rendered rows. All85templates bootstrap perengine. Trusted repository logic is evaluated separately for expected data; node:vm is not an untrusted-code security boundary. Actual in-browser DOCX generation is additionally inspected for the restored table row counts and every referenced text field. No PDF fidelity, desktop Office behavior, authentic DC host, physical device, manual AT or operator acceptance.'};
if(process.env.CS_TEMPLATE_CONTROL_REPORT)writeFileSync(process.env.CS_TEMPLATE_CONTROL_REPORT,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({contentContexts:rows.length,expectedContexts,templateBoots:smoke.length,failures:failures.length,examples:failures.slice(0,2)},null,2));assert.equal(rows.length,expectedContexts);assert.equal(smoke.length,255);assert.equal(failures.length,0,'Authored table rows and text must be present in the rendered document');
