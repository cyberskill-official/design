import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
import { unzipEntries } from './lib/docx-zip.mjs';
import { designCsp } from '../../scripts/lib/site-csp.mjs';
import { extractPdfText } from './lib/pdf-text.mjs';
const root = resolve(process.argv.find(value => value.startsWith('--root='))?.slice(7) || '.');
const report = resolve(process.argv.find(value => value.startsWith('--output-dir='))?.slice(13) || 'test-results/template-numeric-content');
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const hash = value => createHash('sha256').update(value).digest('hex');
const inputs = new Map(), records = [], negatives = [];
const read = path => { const file = join(root, path), bytes = readFileSync(file); inputs.set(file, hash(bytes)); return bytes; };
inputs.set(fileURLToPath(import.meta.url), hash(readFileSync(fileURLToPath(import.meta.url))));
read('scripts/template-runtime/primitives/support.js'); read('scripts/generate-template-display-fields.mjs'); read('scripts/template-display-fields.json');
const path = 'templates/delivery-status-email/DeliveryStatusEmail.dc.html';
const schemaPath = 'templates/delivery-status-email/content-schema.json';
const originalSchema = JSON.parse(read(schemaPath));
const numberSlot = originalSchema.slots.find(slot => slot.id === 'completionPercent');
assert.deepEqual([numberSlot.type,numberSlot.runtimeBinding,numberSlot.minimum,numberSlot.maximum,numberSlot.runtimeProjection], ['number','number',0,100,'percent-width']);
let currentCase;
try { await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin, url = origin + '/' + path;
  await page.route(origin + '/**', async route => {
    const relative = decodeURIComponent(new URL(route.request().url()).pathname).slice(1);
    assert(relative && !relative.split('/').some(part => part === '..' || part === '.'));
    const file = existsSync(join(root, relative)) ? join(root, relative) : resolve(relative);
    if (!existsSync(file) && relative.endsWith('/content-schema.json')) return route.fallback();
    const bytes = readFileSync(file); inputs.set(file, hash(bytes));
    const headers = relative === '_audit/template-schema-test.html' ? { 'content-security-policy': designCsp(bytes.toString(),{path:'/'+relative}).value } : {};
    await route.fulfill({ body:bytes, headers, contentType:({html:'text/html',js:'application/javascript',mjs:'application/javascript',json:'application/json',css:'text/css',woff2:'font/woff2',svg:'image/svg+xml'})[relative.split('.').at(-1)] || 'application/octet-stream' });
  });
  const ready = async () => { await page.waitForFunction(() => __dcRootName?.() && document.querySelector('[data-sc-name]') && !document.querySelector('.sc-logic-error')); await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); }); };
  const state = async value => page.evaluate(value => {
    const root = document.querySelector('[data-sc-name]');
    const bars = [...root.querySelectorAll('span')].filter(node => node.style.display === 'block' && node.style.height === '100%' && node.parentElement.style.overflow === 'hidden');
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let labels=0;
    while(walker.nextNode()) if(walker.currentNode.textContent === value + '%') labels++;
    return { labels, bars:bars.map(bar => ({ width:bar.getBoundingClientRect().width,track:bar.parentElement.getBoundingClientRect().width,style:bar.style.width })), leaked:root.querySelectorAll('[data-dc-percent-width]').length };
  }, value);
  for (const language of ['English','Tiếng Việt','Both']) {
    currentCase = { language }; await page.goto(url); await ready();
    await page.evaluate(language => __dcSetProps(__dcRootName(),{language}),language); await ready();
    const initial = await page.locator('[data-sc-name]').innerHTML();
    for(const value of [0,37.5,100]) {
      currentCase = {language,value}; await page.evaluate(value => __dcSetContent(__dcRootName(),{completionPercent:value}),value); await ready();
      const actual = await state(value), count = language === 'Both' ? 2 : 1;
      assert.equal(actual.labels,count,'Every visible label uses the supplied numeric value'); assert.equal(actual.bars.length,count); assert.equal(actual.leaked,0,'Projection DSL attribute is never emitted');
      for(const bar of actual.bars){ assert.equal(bar.style,value+'%'); assert(Math.abs(bar.width-bar.track*value/100)<0.1,'Actual native bar geometry follows the finite number'); }
      if(!await page.evaluate(()=>window.__csDocExport)) await page.addScriptTag({url:origin+'/templates/_vendor/doc-export.js'});
      const bytes = await page.evaluate(async()=>Array.from(new Uint8Array(await(await __csDocExport.buildDocxBlob(document.querySelector('[data-sc-name]'))).arrayBuffer())));
      const xml = unzipEntries(Buffer.from(bytes))['word/document.xml'].toString();
      const docxLabels = await page.evaluate(({xml,value})=>[...new DOMParser().parseFromString(xml,'application/xml').getElementsByTagNameNS('*','t')].filter(node=>node.textContent===value+'%').length,{xml,value});
      assert.equal(docxLabels,count,'Each exact numeric label reaches editable DOCX');
      let parsedPdf=false;
      if(browserName==='chromium') {
        await page.emulateMedia({media:'print'}); const bytes=await page.pdf({printBackground:true,preferCSSPageSize:true}), pdf=extractPdfText(bytes);
        assert.equal([...pdf.text.matchAll(new RegExp('(?<![0-9.])'+String(value).replace('.', '\\.')+'%', 'g'))].length,count,'Each numeric label reaches actual parsed PDF');
        mkdirSync(join(report,'pdf'),{recursive:true});writeFileSync(join(report,'pdf',language.replace(/[^A-Za-z]/g,'_')+'-'+value+'.pdf'),bytes);parsedPdf=true;await page.emulateMedia({media:'screen'});
      }
      records.push({language,value,...actual,docx:true,parsedPdf});
    }
    const hostile = await page.evaluate(()=>{
      const root=document.querySelector('[data-sc-name]'),before=root.innerHTML;let count=0,getters=0;
      const reject=value=>{try{__dcSetContent(__dcRootName(),value);}catch{count++;return;}throw Error('Unsafe numeric content accepted');};
      for(const value of [null,[],{},true,false,'72','1; background:url(x)',NaN,Infinity,-Infinity,-1,100.001,new Number(12)])reject({completionPercent:value});
      const accessor={};Object.defineProperty(accessor,'completionPercent',{enumerable:true,get(){getters++;return 40;}});reject(accessor);
      reject(Object.create({completionPercent:40}));reject(JSON.parse('{"__proto__":40}'));reject({constructor:40});reject({theme:40});
      if(getters||root.innerHTML!==before)throw Error('Rejected numeric input executed code or changed accepted state');return{count,getters};
    });
    await page.evaluate(()=>__dcSetContent(__dcRootName(),{}));await ready();assert.equal(await page.locator('[data-sc-name]').innerHTML(),initial,'Reset restores all default label/bar/markup');
    records.push({language,hostile,resetExact:true});
  }
  const mutations = [
    ['missing bounds',slot=>{delete slot.minimum;}],['bad lower bound',slot=>{slot.minimum=-1;}],['bad upper bound',slot=>{slot.maximum=101;}],['wrong projection',slot=>{slot.runtimeProjection='style';}],['wrong type',slot=>{slot.type='text';}],['axis name',slot=>{slot.id='theme';}],['unknown target',slot=>{slot.runtimeTargets[0].attribute='style';}],['extra target',slot=>{slot.runtimeTargets.push({tag:'span',attribute:'data-dc-percent-width'});}],['partial target',slot=>{slot.runtimeTargets[0].tag='button';}]
  ];
  for(const[name,mutate]of mutations){
    const schema=structuredClone(originalSchema);mutate(schema.slots.find(slot=>slot.id==='completionPercent'));
    await page.route(origin+'/'+schemaPath,route=>route.fulfill({body:JSON.stringify(schema),contentType:'application/json'}));await page.goto(url);
    await page.waitForSelector('.sc-logic-error');assert.match(await page.locator('.sc-logic-error').textContent(),/Unsafe numeric content target/);negatives.push(name);await page.unroute(origin+'/'+schemaPath);
  }
  const duplicate=structuredClone(originalSchema);duplicate.slots.push(structuredClone(numberSlot));await page.route(origin+'/'+schemaPath,route=>route.fulfill({body:JSON.stringify(duplicate),contentType:'application/json'}));await page.goto(url);await page.waitForSelector('.sc-logic-error');assert.match(await page.locator('.sc-logic-error').textContent(),/duplicate content slot/);negatives.push('duplicate slot');await page.unroute(origin+'/'+schemaPath);
  for(const[name,mutate]of [
    ['non-bar span',html=>html.replaceAll('display:block;height:100%;width:72%','display:inline;height:100%;width:72%')],
    ['interactive bar',html=>html.replaceAll('data-dc-percent-width=', 'tabindex="0" data-dc-percent-width=')],
    ['partial expression',html=>html.replaceAll('data-dc-percent-width="{{ completionPercent }}"','data-dc-percent-width="{{ completionPercent }};color:red"')],
    ['missing text target',html=>html.replaceAll('{{ completionPercent }}%','72%')],
  ]){
    const html=mutate(read(path).toString());await page.route(url,route=>route.fulfill({body:html,contentType:'text/html'}));await page.goto(url);await page.waitForSelector('.sc-logic-error');assert.match(await page.locator('.sc-logic-error').textContent(),/Unsafe numeric content target/);negatives.push(name);await page.unroute(url);
  }
  const invoiceSchemaPath = 'templates/finance-invoice/content-schema.json';
  const privateSchema = JSON.parse(read(invoiceSchemaPath));
  privateSchema.slots.push({ id:'__csDisplayLiteralEmpty',type:'text',label:'Forbidden owned constant',maxLength:160,runtimeBinding:'text' });
  await page.route(origin+'/'+invoiceSchemaPath,route=>route.fulfill({body:JSON.stringify(privateSchema),contentType:'application/json'}));
  await page.goto(origin+'/templates/finance-invoice/FinanceInvoice.dc.html');await page.waitForSelector('.sc-logic-error');
  assert.match(await page.locator('.sc-logic-error').textContent(),/Unsafe content binding: __csDisplayLiteralEmpty/);negatives.push('forged adoption of owned literal constant');
  await page.unroute(origin+'/'+invoiceSchemaPath);
  const boardUrl=origin+'/_audit/template-schema-test.html';
  await page.goto(boardUrl);await page.waitForFunction(()=>window.__schemav2);
  const board=await page.evaluate(()=>window.__schemav2);assert.equal(board.pass,true,JSON.stringify(board));
  assert.deepEqual([board.coverage.withSchema,board.coverage.eligible,board.coverage.axisOnly,board.coverage.total],[84,84,1,85],'Every eligible template/hole covered; only the fixed style guide omits a schema');
  const invoiceUrl=origin+'/templates/finance-invoice/FinanceInvoice.dc.html';
  const missingHole=read('templates/finance-invoice/FinanceInvoice.dc.html').toString().replace('</x-dc>','<p>{{ unreviewedBusinessField }}</p></x-dc>');
  assert(missingHole.includes('{{ unreviewedBusinessField }}'));
  await page.route(invoiceUrl,route=>route.fulfill({body:missingHole,contentType:'text/html'}));await page.goto(boardUrl);await page.waitForFunction(()=>window.__schemav2);
  assert.equal(await page.evaluate(()=>__schemav2.pass),false,'A new ordinary data hole still fails bidirectional coverage');negatives.push('missing ordinary business-slot source countercontrol');await page.unroute(invoiceUrl);
  await page.route(origin+'/'+invoiceSchemaPath,route=>route.fulfill({body:JSON.stringify(privateSchema),contentType:'application/json'}));await page.goto(boardUrl);await page.waitForFunction(()=>window.__schemav2);
  assert.equal(await page.evaluate(()=>__schemav2.pass),false,'The private constant cannot become a declared slot');negatives.push('private constant declaration fails actual schema board');await page.unroute(origin+'/'+invoiceSchemaPath);
  // Restoring the exact old runtime must reject the newly supported numeric schema.
  let old = read('templates/_vendor/support.js').toString();
  const numericStart = old.indexOf("      if (slot.runtimeBinding === 'number') {"), numericEnd = old.indexOf("      if (slot.runtimeBinding !== 'text'", numericStart);
  assert(numericStart >= 0 && numericEnd > numericStart); old = old.slice(0,numericStart) + old.slice(numericEnd);
  await page.route(origin+'/templates/delivery-status-email/support.js',route=>route.fulfill({body:old,contentType:'application/javascript'}));await page.goto(url);await page.waitForSelector('.sc-logic-error');assert.match(await page.locator('.sc-logic-error').textContent(),/Unsafe content binding/);negatives.push('old number-unsupported contract mutation rejected');
  await page.unroute(origin+'/templates/delivery-status-email/support.js');
  const wrongWidth = read('templates/_vendor/support.js').toString().replace("props.style = { ...props.style, width: percent + '%' };", "props.style = { ...props.style };");
  assert.notEqual(wrongWidth,read('templates/_vendor/support.js').toString());
  await page.route(origin+'/templates/delivery-status-email/support.js',route=>route.fulfill({body:wrongWidth,contentType:'application/javascript'}));await page.goto(url);await ready();
  await page.evaluate(()=>__dcSetContent(__dcRootName(),{completionPercent:37.5}));await ready();
  const wrong = await state(37.5);assert.equal(wrong.labels,1);assert(wrong.bars.some(bar=>Math.abs(bar.width-bar.track*0.375)>1),'Ignored actual width reproduces disconnected numeric display');negatives.push('ignored native width projection mutation rejected');
}, {browserName}); } catch(error) { mkdirSync(report,{recursive:true});writeFileSync(join(report,browserName+'-failure.json'),JSON.stringify({pass:false,currentCase,error:String(error.stack||error),records,negatives,inputs:Object.fromEntries(inputs)},null,2));throw error; }
for(const[path,expected]of inputs)assert.equal(hash(readFileSync(path)),expected,'Numeric proof input drift');
mkdirSync(report,{recursive:true});writeFileSync(join(report,browserName+'.json'),JSON.stringify({pass:true,browserName,records,negatives,inputs:Object.fromEntries(inputs),scope:'Finite explicit percent display only; no arbitrary styles/attributes, arithmetic, legal interpretation or real-device acceptance.'},null,2)+'\n');
console.log('PASS '+browserName+': finite numeric labels/native widths, DOCX/PDF, atomic hostile setter and '+negatives.length+' schema/target/old-runtime negatives');
