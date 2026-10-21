import assert from 'node:assert/strict';
import {extractRuntimeProps,buildContracts} from '../../scripts/generate-component-contracts.mjs';
const source='export function Fixture({value, defaultValue = 3, disabled=false, ...props}) {return null}';
assert.deepEqual(extractRuntimeProps(source,'Fixture'),{props:['value','defaultValue','disabled'],defaultExpressions:{defaultValue:'3',disabled:'false'},restBinding:'props',analysis:'direct-export-destructuring'});
assert.equal(extractRuntimeProps('export const Fixture = () => null','Fixture').analysis,'not-a-direct-destructured-function');
const api={exports:[{name:'Fixture',kind:'component',sourcePath:'Fixture.jsx',promptPath:'Fixture.prompt.md',props:[{definition:'a'},{definition:'b'}]}],propDefinitions:{a:{name:'value',origin:'authored'},b:{name:'onClick',origin:'inherited'}}};
const facts=buildContracts(api,{components:[]},path=>path.endsWith('.jsx')?source:'Keyboard: Native entry.').components[0];
assert.deepEqual(facts.authoredProps,['value']);assert.deepEqual(facts.inheritedProps,['onClick']);
assert.equal(facts.declaredKeyboard,'Native entry.');assert.equal(facts.contractCompleteness,'source-facts-only');
assert.deepEqual(facts.classHooks,[],'Absent hooks must not fabricate anatomy');
console.log('PASS component fact projection: defaults, inherited/authored split, unsupported forms, declared keyboard, no invented semantics');

const wrapped='import React from "react"; export const Fixture = React.forwardRef(function Fixture({value, defaultValue=3, ...props}, ref) {return null});';
assert.deepEqual(extractRuntimeProps(wrapped,'Fixture'),{props:['value','defaultValue'],defaultExpressions:{defaultValue:'3'},restBinding:'props',analysis:'forward-ref-destructuring'});
for(const source of ['export const Fixture = React.forwardRef(function Fixture({}, ref) {return null})','import React from "react"; export const Fixture = React.forwardRef((props, ref) => null)','import React from "react"; export const Fixture = React.forwardRef(function Other({},ref) {return null})'])assert.throws(()=>extractRuntimeProps(source,'Fixture'),/forwardRef/);
console.log('PASS strict imported React.forwardRef source grammar and unsupported-wrapper rejection');
