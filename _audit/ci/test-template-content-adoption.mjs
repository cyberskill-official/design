import assert from'node:assert/strict';import{readFileSync,readdirSync}from'node:fs';import{parse}from'parse5';import{Script}from'node:vm';
import{collectTemplates}from'../../scripts/generate-template-inventory.mjs';import validate from'../lib/content-schema-validator.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const fixture=JSON.parse(read('_audit/ci/fixtures/template-content-bindings.json'));const schemaPaths=readdirSync(new URL('../../templates',import.meta.url),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>'templates/'+e.name+'/content-schema.json').filter(path=>{try{read(path);return true}catch{return false}}).sort();
assert.deepEqual(fixture.templates.map(t=>t.path).sort(),schemaPaths,'Every schema must have explicit slot dispositions');
const manifest=collectTemplates().templates;let adopted=0,richtext=0,total=0;
for(const entry of fixture.templates){
 const schema=JSON.parse(read(entry.path));assert(validate(schema),JSON.stringify(validate.errors));assert.equal(schema.template,entry.template);
 assert.deepEqual(schema.slots.map(s=>[s.id,s.type,s.runtimeBinding??null]).sort(),entry.slots.map(s=>[s.id,s.declaredType,s.projection]).sort(),'Declared slot/adoption membership drift: '+entry.template);
 assert.deepEqual(schema.slots.map(s=>[s.id,s.runtimeTargets??[]]).sort(),entry.slots.map(s=>[s.id,s.runtimeTargets??[]]).sort(),'Exact attribute destination membership drift');
 const template=manifest.find(t=>t.path.startsWith('templates/'+entry.template+'/'));assert(template);const nodes=[];const walk=n=>{nodes.push(n);for(const child of n.childNodes||[])walk(child);if(n.content)walk(n.content)};walk(parse(read(template.path)));
 const script=nodes.find(n=>n.tagName==='script'&&n.attrs?.some(a=>a.name==='data-dc-script'));const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;const controls=JSON.parse(attr(script,'data-props'));const bound=schema.slots.filter(s=>s.runtimeBinding);if(bound.length)assert.equal(attr(script,'data-content-schema'),'./content-schema.json');
 const code=script.childNodes.map(n=>n.value||'').join('');const logic=new Script('(()=>{'+code+';return Component})()');
 for(const language of controls.language?.options||[undefined]){
  const Logic=logic.runInNewContext({DCLogic:class{constructor(props){this.props=props;this.state={}}setState(){}},console});const instance=new Logic(Object.fromEntries(Object.entries(controls).map(([key,value])=>[key,key==='language'?language:value.default])));const values=instance.renderVals();
  for(const slot of bound){if(slot.runtimeBinding==='text'){assert.equal(typeof values[slot.id],'string',entry.template+'/'+slot.id+': scalar binding cannot replace a function, boolean, array or model');assert(Number.isSafeInteger(slot.maxLength)&&slot.maxLength>0)}else if(slot.runtimeBinding==='number'){assert.equal(typeof values[slot.id],'number');assert(Number.isFinite(values[slot.id])&&values[slot.id]>=0&&values[slot.id]<=100,'Finite native percent default');assert.equal(slot.minimum,0);assert.equal(slot.maximum,100);assert.equal(slot.runtimeProjection,'percent-width');assert(slot.runtimeTargets?.every(target=>target.tag==='span'&&target.attribute==='data-dc-percent-width'));}else{assert.equal(slot.runtimeBinding,'structured');assert(Array.isArray(values[slot.id]),'Structured binding requires existing authored array');assert(slot.runtimeModel&&slot.runtimeTargets?.length&&slot.runtimeProjection)}assert(!Object.hasOwn(controls,slot.id),'No axis/control override')}
 }
 adopted+=bound.length;richtext+=bound.filter(s=>s.type==='richtext').length;total+=schema.slots.length;
}
console.log(JSON.stringify({pass:true,sidecars:fixture.templates.length,totalSlots:total,adopted,richtextPlainTextProjections:richtext,unbound:total-adopted,scope:'Explicit whole-schema membership, formal scalar/finite-percent/structured metadata, actual same-source computed kind in every advertised language, no control or caller function replacement.'}));
