import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const root=pathToFileURL(resolve(process.argv.find(value=>value.startsWith('--root='))?.slice(7)||'.')+'/');
const read=p=>readFileSync(new URL(p,root),'utf8');
const manifest=JSON.parse(read('_ds_manifest.json'));
const schemas=JSON.parse(read('_audit/ci/fixtures/template-content-bindings.json')).templates.map(entry=>({...entry,schema:JSON.parse(read(entry.path))})).filter(entry=>entry.schema.slots.some(slot=>slot.runtimeBinding==='text'&&slot.runtimeTargets));
const engine=process.env.CS_TEST_BROWSER||'chromium',results=[];
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.route(origin+'/**',async route=>{const path=decodeURIComponent(new URL(route.request().url()).pathname).slice(1);assert(path&&!path.split('/').some(part=>part==='..'||part==='.'));const staged=new URL(path,root);if(!existsSync(staged)&&!existsSync(resolve(path))&&path.endsWith('/.image-slots.state.json'))return route.fallback();const bytes=readFileSync(existsSync(staged)?staged:resolve(path));await route.fulfill({body:bytes,contentType:({html:'text/html',js:'application/javascript',json:'application/json',css:'text/css',woff2:'font/woff2',svg:'image/svg+xml'})[path.split('.').at(-1)]||'application/octet-stream'});});
 for(const entry of schemas){
  const template=manifest.templates.find(t=>t.folder==='templates/'+entry.template),slots=entry.schema.slots.filter(slot=>slot.runtimeBinding==='text'&&slot.runtimeTargets);
  await page.goto(origin+'/'+template.entryPath);await page.waitForFunction(()=>window.__dcRootName?.()&&document.querySelector('[data-sc-name]')&&!document.querySelector('.sc-logic-error'));
  if(slots.some(slot=>slot.runtimeTargets.some(target=>target.component)))await page.waitForFunction(()=>window.CyberSkillDS&&Object.keys(window.CyberSkillDS).length);
  await page.evaluate(()=>{window.__capturedContentProps=[];const original=window.CyberSkillDS;if(!original)return;window.CyberSkillDS={...original};for(const[name,component]of Object.entries(original)){if(typeof component!=='function'&&!(component&&typeof component==='object'&&component.$$typeof))continue;window.CyberSkillDS[name]=props=>{window.__capturedContentProps.push({name,props:Object.fromEntries(Object.entries(props).filter(([,v])=>typeof v==='string'))});return React.createElement(component,props)}}});
  for(const language of ['English','Tiếng Việt']){
   const payload=Object.fromEntries(slots.map((slot,i)=>[slot.id,"<q>\"'`&É"+i.toString(36)]));
   const exactNameChecks=[];
   const assertOwnedNames=async()=>{for(const slot of slots){const name=payload[slot.id];if(slot.runtimeTargets.some(t=>t.attribute==='label'&&['CyberSkillDS.TextField','CyberSkillDS.Select','CyberSkillDS.NativeSelect','CyberSkillDS.Switch'].includes(t.component))){const visible=await page.locator('.cs-field__label,.cs-switch__label').evaluateAll((nodes,value)=>nodes.some(node=>node.textContent===value&&node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden'),name);if(visible){assert(await page.getByLabel(name,{exact:true}).count(),entry.template+'/'+slot.id+': visible owned field name must exclude hint/error text');exactNameChecks.push(slot.id)}}}};
   await page.evaluate(({payload,language})=>{window.__capturedContentProps=[];__dcSetProps(__dcRootName(),{language,...location.pathname.includes('/auth/')?{formState:'error'}:{},...location.pathname.includes('/dashboard/')?{defaultView:'table'}:{}});__dcSetContent(__dcRootName(),payload)},{payload,language});await page.waitForTimeout(40);await assertOwnedNames();
   if(entry.template==='marketing-page'){await page.locator('header').getByRole('button').first().click();await page.waitForTimeout(30)}
   if(entry.template==='settings'){await page.getByRole('tab',{name:language==='English'?'Profile':'Hồ sơ',exact:true}).click();await page.waitForTimeout(20);await assertOwnedNames();await page.getByRole('tab',{name:language==='English'?'Notifications':'Thông báo',exact:true}).click();await page.waitForTimeout(30)}
   await assertOwnedNames();
   const observed=await page.evaluate(({slots,payload})=>{
    const camel=s=>s.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
    return slots.map(slot=>({id:slot.id,targets:slot.runtimeTargets.map(target=>{
     const value=payload[slot.id];
     if(target.tag==='x-import')return{...target,dispatch:__capturedContentProps.some(record=>record.name===target.component.split('.').at(-1)&&record.props[/^(aria|data)-/.test(target.attribute)?target.attribute:camel(target.attribute)]===value)};
     const nodes=[...document.querySelectorAll(target.tag)].filter(node=>node.getAttribute(target.attribute)===value);
     return{...target,dispatch:nodes.length>0,shadowText:target.tag==='image-slot'?nodes.every(node=>node.shadowRoot.textContent.includes(value)):undefined};
    })}));
   },{slots,payload});
   observed.forEach(slot=>slot.targets.forEach(target=>{assert(target.dispatch,entry.template+'/'+slot.id+': exact scalar dispatch '+JSON.stringify(target));if(target.tag==='image-slot')assert(target.shadowText,'Image placeholder is shadow DOM text, not markup')}));
   const ax=await page.locator('body').ariaSnapshot();
   const visibleNamed=[];
   for(const slot of slots){
    const name=payload[slot.id];const fields=page.getByRole('textbox',{name,exact:true}).or(page.getByRole('searchbox',{name,exact:true})).or(page.getByRole('combobox',{name,exact:true})).or(page.getByRole('switch',{name,exact:true})).or(page.getByRole('button',{name,exact:true}));
    for(const field of await fields.all())if(await field.isVisible()){visibleNamed.push(slot.id)}
   }
   assert(visibleNamed.length||!slots.some(slot=>slot.runtimeBinding==='text'&&slot.runtimeTargets.some(t=>['CyberSkillDS.TextField','CyberSkillDS.SearchField','CyberSkillDS.PromptInput'].includes(t.component))),entry.template+': visible field AX names must remain bound');
   const interactions=[];
   for(const field of await page.getByRole('textbox').or(page.getByRole('searchbox')).all())if(await field.isVisible()&&await field.isEnabled()&&!await field.getAttribute('readonly')){await field.fill('Content binding interaction');assert.equal(await field.inputValue(),'Content binding interaction');interactions.push('editable-text');break}
   for(const toggle of await page.getByRole('switch').all())if(await toggle.isVisible()&&await toggle.isEnabled()){const before=await toggle.isChecked();await toggle.click();assert.equal(await toggle.isChecked(),!before);interactions.push('switch-toggle');break}
   const rejected=await page.evaluate(slots=>{let count=0;const before=document.querySelector('[data-sc-name]').textContent;for(const slot of slots)for(const value of[7,()=>{},'x'.repeat(slot.maxLength+1),'A\u0000B','A\uD800B',...(slot.minLength===1?['','  \t\n']:[])]){let threw=false;try{__dcSetContent(__dcRootName(),{[slot.id]:value})}catch{threw=true}if(!threw)throw Error('Unsafe scalar content accepted: '+slot.id);count++}if(before!==document.querySelector('[data-sc-name]').textContent)throw Error('Invalid scalar content changed prior state');return count},slots);
   // Numeric/boolean-looking text remains a string at actual component dispatch.
   for(const text of ['007','false','true']){
    await page.evaluate(({slots,text})=>{__capturedContentProps=[];__dcSetContent(__dcRootName(),Object.fromEntries(slots.map(slot=>[slot.id,text])))},{slots,text});await page.waitForTimeout(20);
    if(entry.template==='settings'){await page.getByRole('tab',{name:language==='English'?'Profile':'Hồ sơ',exact:true}).click();await page.waitForTimeout(20);await page.getByRole('tab',{name:language==='English'?'Notifications':'Thông báo',exact:true}).click();await page.waitForTimeout(20)}
    const typed=await page.evaluate(({slots,text})=>slots.flatMap(slot=>slot.runtimeBinding==='text'&&slot.runtimeTargets.filter(t=>t.tag==='x-import').map(target=>{const key=/^(aria|data)-/.test(target.attribute)?target.attribute:target.attribute.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return __capturedContentProps.some(r=>r.name===target.component.split('.').at(-1)&&r.props[key]===text)})),{slots,text});assert(typed.every(Boolean),'Content strings cannot be coerced into numbers or booleans');
   }
   results.push({template:entry.template,language,slots:slots.length,observed,visibleNamed,exactNameChecks:[...new Set(exactNameChecks)],interactions,invalidScalarRejections:rejected,ax});
  }
 }

 // Forged metadata cannot broaden the target/property boundary.
 for(const mutation of ['missing-targets','url-target','wrong-component','empty-name-contract']){
  await page.route('**/app-shell/content-schema.json',async route=>{const schema=JSON.parse(read('templates/app-shell/content-schema.json'));const slot=schema.slots.find(s=>s.id==='navLabel');if(mutation==='missing-targets')delete slot.runtimeTargets;else if(mutation==='url-target')slot.runtimeTargets[0].attribute='href';else if(mutation==='wrong-component')slot.runtimeTargets[0].component='CyberSkillDS.Button';else delete slot.minLength;await route.fulfill({json:schema})});
  await page.goto(origin+'/templates/app-shell/AppShell.dc.html');await page.waitForSelector('.sc-logic-error');assert.match(await page.locator('.sc-logic-error').innerText(),/Unsafe content attribute target|nonempty semantics/);await page.unroute('**/app-shell/content-schema.json');
 }
 await page.route('**/content-guard/content-schema.json',route=>route.fulfill({json:{$schemaVersion:'2.0',template:'content-guard',slots:[{id:'closeH',type:'text',label:'Closing copy',maxLength:20,runtimeBinding:'text'}]}}));
 await page.route('**/content-guard/Guard.dc.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><script src="/templates/_vendor/support.js"></script><x-dc><div>Guard</div><sc-if value="{{ showText }}"><p>{{ closeH }}</p></sc-if></x-dc><script type="text/x-dc" data-dc-script data-content-schema="./content-schema.json" data-props="{}">class Component extends DCLogic{renderVals(){return{showText:false,closeH:()=>{}}}}</script>'}));
 await page.goto(origin+'/templates/content-guard/Guard.dc.html');await page.waitForFunction(()=>window.__dcSetContent&&document.querySelector('[data-sc-name]'));
 assert(await page.evaluate(()=>{try{__dcSetContent(__dcRootName(),{closeH:'Replacement'});return false}catch(error){return /computed text/.test(error.message)}}),'Closing copy exception cannot replace an actual computed function');
},{browserName:engine});
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);if(output)writeFileSync(output,JSON.stringify({engine,results,scope:'All adopted plain-text attribute target slots (finite number and structured targets have dedicated typed proofs); actual component dispatch, native attrs, image shadow text, visible control AX names; hidden dialog/details and print-omitted attributes are not promised DOCX/PDF text.'},null,2)+'\n');
console.log(JSON.stringify({pass:true,engine,slots:results.reduce((n,r)=>n+r.slots,0),contexts:results.length}));
