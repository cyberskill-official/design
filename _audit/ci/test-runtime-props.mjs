import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runtimeProps} from './lib/runtime-props.mjs';
assert.deepEqual(runtimeProps('export function A({title, lang="vi", "aria-label":label,...rest}={}) {}','A'),['title','lang','aria-label']);
assert.deepEqual(runtimeProps('export function A({first}) {} export function B({second}) {}','B'),['second']);
assert.throws(()=>runtimeProps('export const A = props => null','A'),/unsupported/);
assert.throws(()=>runtimeProps('export function A({[key]:value}) {}','A'),/computed/);
execFileSync(process.execPath,['scripts/generate-api-index.mjs','--check'],{stdio:'pipe'});
const api=JSON.parse(readFileSync('components/api-index.json','utf8'));
const missing=[];let count=0;
for(const exp of api.exports.filter(e=>e.kind==='component')){
 const names=runtimeProps(readFileSync(exp.sourcePath,'utf8'),exp.name);
 const declared=new Set(exp.props.map(prop=>prop.name));
 // Intentionally discarded so it cannot reach the void input through ...props.
 if(exp.name==='NumberField')assert.ok(names.includes('children'),'Review obsolete NumberField children exception');
 for(const name of names)if(!declared.has(name)&&!(exp.name==='NumberField'&&name==='children'))missing.push(`${exp.name}.${name}`);
 count++;
}
assert.deepEqual(missing,[],'Explicit runtime props must be declared per export, including inherited native props');
console.log(`PASS runtime prop declarations: ${count} components; explicit destructuring only, one intentional discard`);
