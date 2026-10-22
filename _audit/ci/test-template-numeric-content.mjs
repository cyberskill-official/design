import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {collectTemplates} from '../../scripts/generate-template-inventory.mjs';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdtempSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {Script} from 'node:vm';
import validate from '../lib/content-schema-validator.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const fixture=JSON.parse(read('_audit/ci/fixtures/template-content-bindings.json'));
let text=0,number=0,structured=0;
for(const entry of fixture.templates){const schema=JSON.parse(read(entry.path));assert(validate(schema),JSON.stringify(validate.errors));for(const slot of schema.slots){if(slot.runtimeBinding==='text')text++;else if(slot.runtimeBinding==='number')number++;else if(slot.runtimeBinding==='structured')structured++;else assert.fail('Unverified slot');}}
assert.equal(number,1,'Only the inspected finite percent contract is adopted');
const schema=JSON.parse(read('templates/delivery-status-email/content-schema.json')),slot=schema.slots.find(slot=>slot.runtimeBinding==='number');
const negatives=[];
for(const[name,mutate]of [
 ['private owned constant',x=>{x.id='__csDisplayLiteralEmpty';}],['missing minimum',x=>{delete x.minimum;}],['weakened minimum',x=>{x.minimum=-1;}],['weakened maximum',x=>{x.maximum=101;}],['missing projection',x=>{delete x.runtimeProjection;}],['arbitrary style',x=>{x.runtimeProjection='style';}],['native event target',x=>{x.runtimeTargets[0].attribute='onclick';}],['native button target',x=>{x.runtimeTargets[0].tag='button';}],['extra target metadata',x=>{x.runtimeTargets[0].component='CyberSkillDS.Button';}],['number into text path',x=>{x.runtimeBinding='text';x.type='text';x.maxLength=100;}],['missing numeric runtime',x=>{delete x.runtimeBinding;}],['arbitrary model',x=>{x.runtimeModel={type:'number',minimum:0,maximum:100};}],
]){const copy=structuredClone(schema);mutate(copy.slots.find(x=>x.id===slot.id));assert.equal(validate(copy),false,name);negatives.push(name);}
const html=read('templates/delivery-status-email/DeliveryStatusEmail.dc.html'),nodes=[];function visit(n){nodes.push(n);for(const c of n.childNodes||[])visit(c);if(n.content)visit(n.content);}visit(parse(html));const script=nodes.find(n=>n.tagName==='script'&&n.attrs.some(a=>a.name==='data-dc-script'));
const metadata=JSON.parse(script.attrs.find(a=>a.name==='data-props').value),Logic=new Script('(()=>{'+script.childNodes[0].value+';return Component})()').runInNewContext({DCLogic:class{constructor(props){this.props=props;this.state={}}setState(){}}});
for(const language of metadata.language.options){const props=Object.fromEntries(Object.entries(metadata).map(([key,value])=>[key,key==='language'?language:value.default]));assert.equal(new Logic(props).renderVals().completionPercent,72,'Exact authored finite default survives every advertised language');}
const projectedNumber = inventory => inventory.templates.find(template=>template.path==='templates/delivery-status-email/DeliveryStatusEmail.dc.html').contentSchema.slots.find(slot=>slot.id==='completionPercent').runtimeBinding;
assert.equal(projectedNumber(collectTemplates()),'validated-number-content','Source inventory truthfully recognizes actual adopted numeric binding');
const temporary=mkdtempSync(join(tmpdir(),'cs-numeric-inventory-counter-'));
try {
 symlinkSync(fileURLToPath(new URL('../../node_modules',import.meta.url)),join(temporary,'node_modules'),'dir');
 const source=read('scripts/generate-template-inventory.mjs'),mutated=source.replace("['text','number','structured'].includes(slot.runtimeBinding)","['text','structured'].includes(slot.runtimeBinding)");assert.notEqual(source,mutated);
 writeFileSync(join(temporary,'inventory.mjs'),mutated);const old=await import(pathToFileURL(join(temporary,'inventory.mjs')));
 assert.equal(projectedNumber(old.collectTemplates(fileURLToPath(new URL('../../',import.meta.url)))),'not-a-declared-runtime-prop','Old two-kind classification reproduces the false unbound-inventory verdict');
}finally{rmSync(temporary,{recursive:true,force:true});}
console.log(JSON.stringify({pass:true,text,number,structured,total:text+number+structured,formalNegatives:negatives,scope:'Strict formal schema, all current sidecar membership, and actual native finite numeric default; browser tests prove setter/geometry.'}));
