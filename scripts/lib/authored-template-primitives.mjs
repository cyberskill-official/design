// Bind the authored replacement candidate to exact local source and outputs.
// This provides reviewable origin evidence, not distribution approval.
import assert from 'node:assert/strict';
import {Script} from 'node:vm';
const producer='scripts/build-template-primitives.mjs';
const sources={'support.js':'templates/_vendor/support.js','deck-stage.js':'templates/_vendor/deck-stage.js','image-slot.js':'image-slot.js'};
export function verifyAuthoredTemplatePrimitives(read) {
 const producerBytes=read(producer);
 assert(producerBytes.length>0,'Missing primitive producer');
 const entries=new Map();
 for(const [name,output]of Object.entries(sources)){
  const input='scripts/template-runtime/primitives/'+name;
  const source=read(input),bytes=read(output);
  let projected=source.toString();
  const serializer='scripts/template-runtime/dc-logic-source.mjs';
  if(name==='support.js'){
   const marker='null; // @cs-dc-source-serializer';
   assert.equal(projected.split(marker).length,2,'Primitive output is not generated from its recorded source: missing/duplicate shared DC serializer marker');
   const sourceText=read(serializer).toString();
   assert(sourceText.includes('export function dcLogicScriptSource('),'Missing shared DC serializer');
   const fn=new Script(sourceText.replace('export function dcLogicScriptSource(', 'function dcLogicScriptSource(')+'\n;dcLogicScriptSource').runInNewContext(Object.create(null),{timeout:1000});
   projected=projected.replace(marker,fn.toString()+'; // projected from '+serializer);
  }
  const expected=Buffer.from('// Generated from '+input+' by '+producer+'.\n'+projected);
  assert(bytes.equals(expected),'Primitive output is not generated from its recorded source: '+output);
  const evidence=[producer,input,'package.json',...(name==='support.js'?[serializer]:[])];
  entries.set(input,{state:'repository_source_candidate_pending_distribution_review',evidence});
  entries.set(output,{state:'generated_from_repository_source_candidate_pending_distribution_review',evidence});
 }
 const manifest=JSON.parse(read('_ds_manifest.json'));assert(Array.isArray(manifest.templates)&&manifest.templates.length);
 const canonical=read('templates/_vendor/support.js');
 const folders=new Set();
 for(const template of manifest.templates){
  const folder=template.folder;
  assert(typeof folder==='string'&&/^templates\/[a-z0-9-]+$/.test(folder)&&!folders.has(folder),'Unsafe or duplicate primitive copy');folders.add(folder);
  const path=folder+'/support.js';assert(read(path).equals(canonical),'Changed authored primitive copy: '+path);
  entries.set(path,entries.get('templates/_vendor/support.js'));
 }
 return entries;
}
