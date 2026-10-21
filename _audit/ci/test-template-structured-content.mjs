import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from '@babel/parser';
import validate from '../lib/content-schema-validator.mjs';
import {templateModelValues,displayPayload} from './lib/template-model-fixtures.mjs';
const root=new URL('../../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8'),source=JSON.parse(read('scripts/template-content-models.json'));
const runtime=read('scripts/template-runtime/primitives/support.js'),ast=parse(runtime,{sourceType:'script'}),functions=new Map();
const walk=n=>{if(!n||typeof n!=='object')return;if(n.type==='FunctionDeclaration')functions.set(n.id.name,runtime.slice(n.start,n.end));for(const[k,v]of Object.entries(n)){if(['loc','extra','comments'].includes(k))continue;if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v)}};walk(ast);
const {validateModelDefinition,structuredSnapshot}=new Function('blockedKeys',['validXMLText','validateModelDefinition','structuredSnapshot'].map(name=>functions.get(name)).join('\n')+'\nreturn{validateModelDefinition,structuredSnapshot};')(new Set(['__proto__','constructor','prototype']));
let contexts=0;
for(const row of source.models){
 const schema=JSON.parse(read('templates/'+row.template+'/content-schema.json'));assert(validate(schema),JSON.stringify(validate.errors));const slot=schema.slots.find(s=>s.id===row.id);assert.equal(slot.runtimeBinding,'structured');assert.deepEqual(slot.runtimeModel,row.model);assert.deepEqual(slot.runtimeTargets,row.targets);assert.equal(slot.runtimeProjection,row.projection);validateModelDefinition(row.model);
 for(const {values}of templateModelValues(root,row.template).values){const payload=displayPayload(row,values),snapshot=structuredSnapshot(row.model,payload);assert.deepEqual(JSON.parse(JSON.stringify(snapshot)),payload);assert(Object.isFrozen(snapshot));if(snapshot[0]&&typeof snapshot[0]==='object')assert(Object.isFrozen(snapshot[0]));contexts++;}
 for(const value of [null,{},()=>{},Array(1),Object.assign([],{extra:'bad'}),Array(row.model.maxItems+1).fill(null)])assert.throws(()=>structuredSnapshot(row.model,value));
 const defaults=displayPayload(row,templateModelValues(root,row.template).values[0].values),record=defaults.find(x=>x&&typeof x==='object');
 if(record){const bad=structuredClone(defaults);bad[0].unowned='bad';assert.throws(()=>structuredSnapshot(row.model,bad));const key=Object.keys(record)[0],accessor=structuredClone(defaults);Object.defineProperty(accessor[0],key,{get(){throw Error('Getter executed')},enumerable:true});assert.throws(()=>structuredSnapshot(row.model,accessor),/accessors/);}
 if(row.model.uniqueBy){const duplicate=[defaults[0],defaults[0]];if(duplicate.length>=row.model.minItems&&duplicate.length<=row.model.maxItems)assert.throws(()=>structuredSnapshot(row.model,duplicate),/Duplicate/);}
}
const textModel={type:'string',minLength:1,maxLength:16};for(const value of ['', '   ', 'A\u0000B', 'A\uD800B', 'A\uFFFEZ', 'x'.repeat(17),()=>{},null])assert.throws(()=>structuredSnapshot(textModel,value));assert.equal(structuredSnapshot(textModel,'Việt 🌟'),'Việt 🌟');
const frozen=structuredSnapshot({type:'array',minItems:0,maxItems:4,items:textModel},['Before']);const caller=['Before'];const snapshot=structuredSnapshot({type:'array',minItems:0,maxItems:4,items:textModel},caller);caller[0]='After';assert.equal(snapshot[0],'Before');assert.throws(()=>frozen.push('After'));
for(const unsafe of [{type:'function'},{type:'string',minLength:0,maxLength:8},{type:'array',minItems:0,maxItems:1000,items:{type:'string',minLength:1,maxLength:8}},{type:'object',properties:JSON.parse('{"__proto__":{"type":"string","minLength":1,"maxLength":8}}'),required:[],additionalProperties:false}])assert.throws(()=>validateModelDefinition(unsafe));
assert.equal(source.models.length,25,'All previously unbound structured slots covered');
console.log(JSON.stringify({pass:true,models:source.models.length,templates:new Set(source.models.map(x=>x.template)).size,languageContexts:contexts,scope:'Exact existing shape/target membership, frozen data snapshots, model/schema and native runtime helper rejection mutations. Column callbacks remain authored and are tested in browser.'}));
