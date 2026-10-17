import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {collectTemplates} from '../../scripts/generate-template-inventory.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const actual=collectTemplates(root);
assert.equal(actual.templates.length,85);assert.equal(actual.kits.length,3);
const schemas=actual.templates.filter(t=>t.contentSchema);
assert.equal(schemas.length,40);
assert.equal(schemas.flatMap(t=>t.contentSchema.slots).length,512);
assert(actual.templates.find(t=>t.path==='templates/marketing-page/MarketingPage.dc.html').contentSchema.slots.some(s=>s.id==='heroImagePlaceholder'));
for(const path of ['templates/marketing-social-kit/MarketingSocialKit.dc.html','templates/marketing-case-study/MarketingCaseStudy.dc.html','templates/culture-event-invite/CultureEventInvite.dc.html']) {
 const slots=actual.templates.find(t=>t.path===path).contentSchema.slots;
 assert.deepEqual(slots.filter(slot=>slot.id==='imagePlaceholder'),[{id:'imagePlaceholder',type:'text',label:'Image authoring placeholder',maxLength:80,runtimeBinding:'not-a-declared-runtime-prop'}],'Localized prompt must be an explicit computed schema slot, not a claimed writable runtime prop');
}

for(const template of schemas) {
 const declared=new Set(template.declaredProps.flatMap(props=>Object.keys(props)));
 for(const slot of template.contentSchema.slots) assert.equal(slot.runtimeBinding,declared.has(slot.id)?'declared-prop_requires-runtime-verification':'not-a-declared-runtime-prop');
}

assert(actual.templates.every(t=>t.runtime==='design-components-compiler-required'&&t.contentOwner===null&&t.verification.exports==='not-established'));
const temp=mkdtempSync(join(tmpdir(),'cs-template-inventory-'));
try {
  for(const path of ['templates','ui_kits','_ds_manifest.json'])cpSync(join(root,path),join(temp,path),{recursive:true});
  // Hash changes cannot hide behind unchanged catalog metadata.
  const path=join(temp,actual.templates[0].path),source=readFileSync(path,'utf8');
  writeFileSync(path,source+'\n<!-- changed -->');
  assert.notEqual(collectTemplates(temp).templates[0].sha256,actual.templates[0].sha256);
  writeFileSync(path,source.replace('data-props="','data-props="INVALID'));
  assert.throws(()=>collectTemplates(temp),SyntaxError);
  writeFileSync(path,source);
  writeFileSync(join(temp,'templates/unlisted.dc.html'),'<x-dc></x-dc>');
  assert.throws(()=>collectTemplates(temp),/coverage mismatch/);
  rmSync(join(temp,'templates/unlisted.dc.html'));rmSync(path);
  assert.throws(()=>collectTemplates(temp),/coverage mismatch/);
} finally {rmSync(temp,{recursive:true,force:true});}
console.log('PASS template inventory: all 85 templates, three kits, freshness and malformed/missing/unlisted source rejection');
