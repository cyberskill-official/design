import assert from 'node:assert/strict';
import {designCsp} from '../../scripts/lib/site-csp.mjs';
import {readFileSync,readdirSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import validate from '../lib/content-schema-validator.mjs';
let count=0;
for(const folder of readdirSync(new URL('../../templates/',import.meta.url),{withFileTypes:true}).filter(e=>e.isDirectory())) {
 const path=new URL(`../../templates/${folder.name}/content-schema.json`,import.meta.url);
 let value;try{value=JSON.parse(readFileSync(path));}catch(e){if(e.code==='ENOENT')continue;throw e;}
 assert(validate(value),folder.name+JSON.stringify(validate.errors));count++;
}
const expectedSidecars=JSON.parse(readFileSync(new URL('fixtures/template-content-bindings.json',import.meta.url))).templates.length;assert.equal(count,expectedSidecars,'Explicit source adoption inventory must cover every sidecar');
const valid={$schemaVersion:'2.0',template:'probe',slots:[{id:'title',type:'text',label:'Title'}]};
for(const value of [{...valid,unexpected:true},{...valid,slots:[{...valid.slots[0],extra:1}]},{...valid,slots:[{...valid.slots[0],i18n:{vi:7}}]},{...valid,slots:[{...valid.slots[0],maxLength:1.5}]}])assert.equal(validate(value),false);
const adopted={...valid,slots:[{...valid.slots[0],runtimeBinding:'text',maxLength:120}]};
assert(validate(adopted));
assert.equal(validate({...valid,slots:[{...adopted.slots[0],runtimeTargets:[{tag:'button',attribute:'href'}]}]}),false,'Runtime target metadata cannot declare URLs');
assert.equal(validate({...valid,slots:[{...adopted.slots[0],runtimeTargets:[{tag:'x-import',component:'window.eval',attribute:'code'}]}]}),false,'Runtime target metadata cannot declare arbitrary globals');
assert(validate({...valid,slots:[{...adopted.slots[0],type:'richtext'}]}),'Richtext metadata may explicitly adopt plain-text projection without HTML semantics');
for(const slot of [{...adopted.slots[0],type:'table'},{...adopted.slots[0],runtimeBinding:'html'},{id:'title',type:'text',label:'Title',runtimeBinding:'text'}])assert.equal(validate({...valid,slots:[slot]}),false,'Unsafe/incomplete runtime adoption must fail formal schema');
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 let mode='valid';
 await page.route('**/*',async route=>{
   const response=await route.fetch(),url=new URL(route.request().url());
   if(url.pathname.endsWith('/template-schema-test.html'))return route.fulfill({response,headers:{...response.headers(),'content-security-policy':designCsp(await response.text(),{path:url.pathname}).value}});
   if(url.pathname==='/templates/app-shell/content-schema.json'&&['invalid','duplicate'].includes(mode)){
     const data=await response.json();if(mode==='invalid')data.slots[0].i18n={vi:7};else data.slots.push({...data.slots[0]});return route.fulfill({response,json:data});
   }
   if(mode==='stale'&&url.pathname==='/templates/schema/content-schema.schema.json'){const data=await response.json();data.title+=' changed';return route.fulfill({response,json:data});}
   if(mode==='empty'&&url.pathname==='/_ds_manifest.json'){const data=await response.json();data.templates=[];return route.fulfill({response,json:data});}
   await route.fulfill({response});
 });
 for(mode of ['valid','invalid','duplicate','stale','empty']) {
   await page.goto(origin+'/_audit/template-schema-test.html');
   await page.waitForFunction(()=>window.__schemav2,{},{timeout:15000});
   const verdict=await page.evaluate(()=>window.__schemav2);
   assert.equal(verdict.pass,mode==='valid',mode+JSON.stringify(verdict));
   if(mode==='valid'){assert.equal(verdict.coverage.total,85);assert.equal(verdict.coverage.withSchema,expectedSidecars);}
 }
});
console.log(`PASS content schemas: ${expectedSidecars} explicit sidecars, strict-CSP browser gate over 85 templates and four rejection paths`);
