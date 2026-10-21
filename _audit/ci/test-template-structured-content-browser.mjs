import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {unzipEntries} from './lib/docx-zip.mjs';
import {extractPdfText} from './lib/pdf-text.mjs';
import {templateModelValues,displayPayload} from './lib/template-model-fixtures.mjs';
const root=pathToFileURL(resolve(process.argv.find(value=>value.startsWith('--root='))?.slice(7)||'.')+'/'),models=JSON.parse(readFileSync(new URL('scripts/template-content-models.json',root))).models,browserName=process.env.CS_TEST_BROWSER||'chromium',results=[];
const normalized=s=>s.normalize('NFC').replace(/\s/gu,'').toLowerCase();
function customized(model,data,marker,path='',protectedKey){
 if(model.type==='string')return model.enum||protectedKey?data:marker;
 if(model.type==='number')return data;
 if(model.type==='array')return data.map((item,index)=>customized(model.items,item,marker,path+'.'+index,model.uniqueBy));
 return Object.fromEntries(Object.entries(data).map(([key,value])=>[key,customized(model.properties[key],value,marker,path+'.'+key,key===protectedKey||key==='key'||key==='value'||key==='n')]));
}
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.route(origin+'/**',async route=>{const path=decodeURIComponent(new URL(route.request().url()).pathname).slice(1);assert(path&&!path.split('/').some(part=>part==='..'||part==='.'));const staged=new URL(path,root);if(!existsSync(staged)&&!existsSync(resolve(path))&&path.endsWith('/.image-slots.state.json'))return route.fallback();const bytes=readFileSync(existsSync(staged)?staged:resolve(path));await route.fulfill({body:bytes,contentType:({html:'text/html',js:'application/javascript',json:'application/json',css:'text/css',woff2:'font/woff2',svg:'image/svg+xml'})[path.split('.').at(-1)]||'application/octet-stream'});});
 const settle=async()=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})))});
 const docx=async()=>{const data=await page.evaluate(async()=>{const blob=await __csDocExport.buildDocxBlob(document.querySelector('[data-sc-name]'));return Array.from(new Uint8Array(await blob.arrayBuffer()))});const xml=unzipEntries(Buffer.from(data))['word/document.xml'].toString();const parsed=await page.evaluate(xml=>{const doc=new DOMParser().parseFromString(xml,'application/xml');return{valid:!doc.querySelector('parsererror'),text:doc.documentElement.textContent}},xml);assert(parsed.valid,'Actual DOCX XML parses');return{xml,text:parsed.text}};
 for(const slug of [...new Set(models.map(x=>x.template))]){
  const template=templateModelValues(root,slug),slots=models.filter(x=>x.template===slug);
  await page.goto(origin+'/'+template.path);await page.waitForFunction(()=>window.__dcSetContent&&document.querySelector('[data-sc-name]')&&!document.querySelector('.sc-logic-error'));
  if(!await page.evaluate(()=>typeof window.__csDocExport?.buildDocxBlob==='function'))await page.addScriptTag({url:origin+'/templates/_vendor/doc-export.js'});
  for(const {language,values}of template.values){
   await page.emulateMedia({media:'screen'});await page.evaluate(language=>{__dcSetContent(__dcRootName(),{});if(language)__dcSetProps(__dcRootName(),{language})},language);await settle();
   const baseline=await page.locator('[data-sc-name]').innerHTML(),beforeDocx=await docx();
   const defaults=Object.fromEntries(slots.map(row=>[row.id,displayPayload(row,values)]));await page.evaluate(payload=>__dcSetContent(__dcRootName(),payload),defaults);await settle();
   assert.equal(await page.locator('[data-sc-name]').innerHTML(),baseline,slug+' default display records preserve actual HTML including owned render functions');assert.equal((await docx()).xml,beforeDocx.xml,slug+' default editable DOCX unchanged');
   const markers=Object.fromEntries(slots.map((row,i)=>[row.id,'É'+i+'<img a>&`\"\'🌟']));const payload=Object.fromEntries(slots.map(row=>[row.id,customized(row.model,defaults[row.id],markers[row.id])]));
   await page.evaluate(payload=>{__dcSetContent(__dcRootName(),payload);for(const items of Object.values(payload))items.splice(0)},payload);await settle();
   if(slug==='dashboard'){await page.getByRole('tab',{name:new RegExp('^'+(language==='Tiếng Việt'?'Danh sách':'Table')+'(?:\\s|$)')}).click();await settle();assert.equal(await page.getByRole('table').count(),1,'Table state after actual tab click: '+await page.locator('body').textContent());}
   if(slug==='bod-report'){await page.locator('.cs-ai-disclosure__badge').click();await page.locator('.cs-ai-disclosure__sources').waitFor();}
   const body=await page.locator('body').textContent();for(const row of slots)assert(body.includes(markers[row.id]),slug+'/'+row.id+' typed records reach actual HTML');assert.equal(await page.locator('img[a]').count(),0,'Markup-like display copy stays escaped');
   const editedDocx=await docx(),docxCovered=slots.filter(row=>normalized(editedDocx.text).includes(normalized(markers[row.id]))).map(row=>row.id);
   for(const row of slots.filter(row=>!(slug==='bod-report'&&row.id==='sources')))assert(docxCovered.includes(row.id),slug+'/'+row.id+' records reach editable DOCX');
   const rejected=await page.evaluate(({slots,payload})=>{
    const root=__dcRootName(),before=document.querySelector('[data-sc-name]').innerHTML;let rejects=0,getters=0;const reject=value=>{let threw=false;try{__dcSetContent(root,value)}catch{threw=true}if(!threw)throw Error('Unsafe structured content accepted');rejects++};
    for(const row of slots){const good=payload[row.id];for(const value of [null,{},()=>{},new Array(1),Object.assign([],{extra:'bad'}),Array(row.model.maxItems+1).fill(null)])reject({[row.id]:value});
     if(good[0]&&typeof good[0]==='object'){const bad=structuredClone(good);bad[0].unexpected='bad';reject({[row.id]:bad});const key=Object.keys(good[0])[0],accessor=structuredClone(good);Object.defineProperty(accessor[0],key,{get(){getters++;return'bad'},enumerable:true});reject({[row.id]:accessor});reject({[row.id]:[Object.create(good[0])]});}
     const array=structuredClone(good);Object.defineProperty(array,'0',{get(){getters++;return good[0]},enumerable:true});reject({[row.id]:array});
     const corrupt=(model,value,bad)=>{if(model.type==='string')return model.enum?value:bad;if(model.type==='number')return value;if(model.type==='array')return value.map(x=>corrupt(model.items,x,bad));return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,corrupt(model.properties[k],v,bad)]))};
     for(const bad of ['A\u0000B','A\uD800B','A\uFFFEZ'])reject({[row.id]:corrupt(row.model,good,bad)});
     if(row.projection==='column-headers'){const keys=structuredClone(good);keys[0].key='other';reject({[row.id]:keys});const fn=structuredClone(good);fn[0].render=()=>'<script>';reject({[row.id]:fn});}
    }
    reject(JSON.parse('{"__proto__":[]}'));reject({theme:[]});reject({unowned:[]});if(getters)throw Error('Getter executed');if(document.querySelector('[data-sc-name]').innerHTML!==before)throw Error('Rejected payload changed prior state');return{rejects,getters};
   },{slots,payload});
   await page.emulateMedia({media:'print'});await settle();const printText=await page.locator('[data-sc-name]').innerText();let pdf=null;
   if(browserName==='chromium'){const bytes=await page.pdf({printBackground:true,preferCSSPageSize:true});const parsed=extractPdfText(bytes);assert(parsed.pages>0);for(const row of slots.filter(row=>docxCovered.includes(row.id)))assert(normalized(parsed.text).includes(normalized(markers[row.id])),slug+'/'+row.id+' printed records reach parsed PDF: '+JSON.stringify(parsed.text.slice(0,1800)));pdf={pages:parsed.pages,covered:slots.filter(row=>normalized(parsed.text).includes(normalized(markers[row.id]))).map(row=>row.id)};}
   results.push({template:slug,language:language||'stacked-bilingual',slots:slots.map(x=>x.id),defaultHtmlIdentical:true,defaultDocxIdentical:true,htmlCovered:slots.map(x=>x.id),docxCovered,docxOmissions:slots.filter(x=>!docxCovered.includes(x.id)).map(x=>({id:x.id,reason:'Interactive disclosure panel is outside the document export root; this preserves existing export scope.'})),printCovered:slots.filter(x=>printText.includes(markers[x.id])).map(x=>x.id),pdf,...rejected});
   if(slug==='bod-report')await page.keyboard.press('Escape');
  }
 }
 const schemaPath=origin+'/templates/dashboard/content-schema.json',schema=JSON.parse(readFileSync(new URL('templates/dashboard/content-schema.json',root),'utf8'));
 const mutations=[slot=>slot.runtimeProjection='records',slot=>slot.runtimeModel.items.properties.render={type:'string',minLength:1,maxLength:20},slot=>slot.runtimeTargets[0].attribute='href',slot=>Object.assign(slot.runtimeModel.items.properties,JSON.parse('{"constructor":{"type":"string","minLength":1,"maxLength":8}}')),slot=>slot.runtimeModel.maxItems=1000,slot=>slot.runtimeModel.items.required=[]];
 for(const mutate of mutations){const bad=structuredClone(schema);mutate(bad.slots.find(x=>x.id==='cols'));await page.route(schemaPath,route=>route.fulfill({json:bad}));await page.goto(origin+'/templates/dashboard/Dashboard.dc.html');await page.locator('.sc-logic-error').waitFor();assert.match(await page.locator('.sc-logic-error').textContent(),/Unsafe|Unsupported/);assert.equal(await page.locator('[data-sc-name]').count(),0,'Unsafe model metadata fails before mounting');await page.unroute(schemaPath);}

},{browserName});
const report=resolve(process.argv.find(value=>value.startsWith('--output-dir='))?.slice(13)||'test-results/structured-content');mkdirSync(report,{recursive:true});writeFileSync(join(report,browserName+'.json'),JSON.stringify({pass:true,browserName,bundleSha256:createHash('sha256').update(readFileSync('_ds_bundle.js')).digest('hex'),supportSha256:createHash('sha256').update(readFileSync(new URL('templates/_vendor/support.js',root))).digest('hex'),results,scope:'All25 existing structured slots; same authored defaults preserve actual HTML and DOCX, caller display data remains literal/typed, HTML/print/DOCX three engines; PDF parsed text Chromium only. No calculation, legal accuracy, arbitrary props/functions or Office fidelity acceptance.'},null,2)+'\n');console.log('PASS '+browserName+' all25 structured display bindings/defaults/security/export checks');
