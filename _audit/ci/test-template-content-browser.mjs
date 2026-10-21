import assert from 'node:assert/strict';
import {unzipEntries} from './lib/docx-zip.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.argv.find(arg=>arg.startsWith('--browser='))?.slice(10)||process.env.CS_BROWSER||'chromium';
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 for(const [slug,name,reference] of [['finance-invoice','FinanceInvoice','invoiceReference'],['finance-quote','FinanceQuote','quoteReference']]){
  await page.goto(`${origin}/templates/${slug}/${name}.dc.html`);
  await page.waitForFunction(()=>window.__dcSetContent&&document.querySelector('[data-sc-name]'));
  const custom={clientName:'Công ty Ánh Dương 🌟 <img src=x onerror=alert(1)>',[reference]:'CS-CUSTOM-2026'};
  if(slug==='finance-invoice')custom.clientAddress='12 Đường Nguyễn Huệ, TP. Hồ Chí Minh';
  for(const language of ['English','Tiếng Việt']){
   await page.evaluate(({language,custom})=>{const root=window.__dcRootName();window.__dcSetProps(root,{language});window.__dcSetContent(root,custom)},{language,custom});
   await page.waitForFunction(text=>document.querySelector('[data-sc-name]').textContent.includes(text),custom.clientName);
   assert((await page.locator('[data-sc-name]').textContent()).includes(custom[reference]));
   assert.equal(await page.locator('img[src="x"]').count(),0,'Content must remain escaped text');
   await page.waitForFunction(lang=>document.documentElement.lang===lang,language==='English'?'en':'vi');
   await page.waitForFunction(()=>typeof window.__csDocExport?.buildDocxBlob==='function');
   const encoded=await page.evaluate(async()=>{const blob=await window.__csDocExport.buildDocxBlob(document.querySelector('.cs-sheet'));const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary)});
   const xml=unzipEntries(Buffer.from(encoded,'base64'))['word/document.xml'].toString();
   assert.equal(await page.evaluate(xml=>new DOMParser().parseFromString(xml,'application/xml').querySelector('parsererror')===null,xml),true,'DOCX document.xml must parse as XML');
   assert(xml.includes('CS-CUSTOM-2026'),'Customized reference must reach editable DOCX');
   assert(/Ánh Dương|ÁNH DƯƠNG/.test(xml),'Customized Vietnamese name must reach DOCX');
  }
  for(const content of [{clientName:7},{clientName:'Company\u0000Name'},{clientName:'Company\u000BName'},{clientName:'Company\uFFFEName'},{clientName:'Company\uD800Name'},{clientName:'Company\uDC00Name'},{clientName:'x'.repeat(121)},{clientName:''},{clientName:{html:'<b>bad</b>'}},{language:'English'},{langAttr:'en'},{setFinancialScroll:'replacement'},{unknown:'x'},JSON.parse('{"__proto__":"polluted"}'),[]]){
   const error=await page.evaluate(payload=>{const content=JSON.parse(payload);try{window.__dcSetContent(window.__dcRootName(),content);return null}catch(error){return error.message}},JSON.stringify(content));
   assert(error,JSON.stringify(content));assert((await page.locator('[data-sc-name]').textContent()).includes(custom.clientName),'Rejected updates preserve prior state: '+JSON.stringify(content));
  }
  await page.evaluate(()=>window.__dcSetContent(window.__dcRootName(),{}));
  await page.waitForFunction(text=>!document.querySelector('[data-sc-name]').textContent.includes(text),custom.clientName);
 }
 await page.goto(origin+'/templates/app-shell/AppShell.dc.html');
 await page.waitForFunction(()=>window.__dcSetContent&&document.querySelector('[data-sc-name]'));
 assert(await page.evaluate(()=>{try{window.__dcSetContent(window.__dcRootName(),{rows:'unexpected adoption'});return false}catch{return true}}),'Unadopted source slot must reject runtime content');
 // A sidecar cannot bless an axis/handler or attribute hole as text.
 await page.route('**/finance-invoice/content-schema.json',async route=>{
  const response=await route.fetch();const schema=await response.json();schema.slots.push({id:'langAttr',type:'text',label:'forbidden',maxLength:30,runtimeBinding:'text'});await route.fulfill({response,json:schema});
 });
 await page.goto(origin+'/templates/finance-invoice/FinanceInvoice.dc.html');
 await page.waitForSelector('.sc-logic-error');
 assert((await page.locator('.sc-logic-error').innerText()).includes('Unsafe content binding'));
},{browserName});
console.log(`PASS ${browserName} content binding: invoice/quote EN/VI escaped text, reference/address adoption, reset, validation, non-adoption and malicious-schema rejection`);
