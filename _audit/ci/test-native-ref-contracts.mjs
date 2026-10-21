import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from '@babel/parser';
import {exportedFunction,sourceComponentFunctions} from '../../scripts/lib/component-export.mjs';
const read=path=>readFileSync(path,'utf8');
const targets=JSON.parse(read('_audit/ci/fixtures/native-ref-targets.json')).components;
const api=JSON.parse(read('components/api-index.json'));
assert.deepEqual(targets.map(t=>t.name).sort(),api.exports.filter(e=>e.kind==='component').map(e=>e.name).sort(),'every public component has an explicit ref target or context-only exclusion');
assert.equal(targets.filter(t=>t.ref).length,118);assert.equal(targets.filter(t=>t.controlRef).length,15);
for(const target of targets){
 const ast=parse(read(target.source),{sourceType:'module',plugins:['jsx']});
 const resolved=exportedFunction(ast,target.name);assert.ok(sourceComponentFunctions(ast).includes(target.name));
 assert.equal(resolved?.kind,target.ref?'forward-ref':'direct',target.name+' source forwarding/exclusion contract');
 const entry=api.exports.find(e=>e.name===target.name);const props=entry.props.map(p=>p.name);
 assert.equal(props.includes('ref'),!!target.ref,target.name+' compiler derives native ref');
 assert.equal(props.includes('controlRef'),!!target.controlRef,target.name+' compiler derives distinct control');
 for(const language of['','vi/']){
  const doc=read('docs/'+language+'native-refs.md');
  const expected=`| ${target.name} | ${target.ref?target.ref.types.join(' / '):'Context only'} | ${target.controlRef?target.controlRef.types.join(' / '):'—'} |`;
  assert.ok(doc.includes(expected),target.name+' documented target '+language);
 }
 if(target.ref)assert.ok(read(target.source.replace(/\.jsx$/,'.prompt.md')).includes('Native refs'),target.name+' component prompt documents ref contract');
}
// Unknown wrappers do not enter the independent source census; malformed forwardRef candidates fail closed.
assert.deepEqual(sourceComponentFunctions(parse('export const Fixture=wrap(function Fixture({}){})',{sourceType:'module'})),[]);
assert.throws(()=>exportedFunction(parse('import React from "react"; export const Fixture=React.forwardRef(function Fixture({},ref,third){})',{sourceType:'module'}),'Fixture'),/forwardRef/);
console.log('PASS exhaustive native-ref source/compiler/docs membership and strict wrapper source authority');
