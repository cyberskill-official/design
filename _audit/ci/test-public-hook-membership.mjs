import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync,copyFileSync,symlinkSync} from 'node:fs';
import {join,resolve} from 'node:path';import {tmpdir} from 'node:os';
import Ajv from 'ajv';
import {spawnSync} from 'node:child_process';
import {buildBundle} from '../../scripts/build-bundle.mjs';
const directory=mkdtempSync(join(tmpdir(),'cs-hook-membership-'));
try{
 for(const folder of ['components','tokens','scripts'])mkdirSync(join(directory,folder));
 writeFileSync(join(directory,'components/Example.jsx'),'export function Example(){return null}\nexport function useAllowed(){return 1}\nexport function useAccidental(){return 2}\nexport function lowercase(){return 3}\n');
 writeFileSync(join(directory,'tokens/tokens.js'),'export const INTERNAL_TOKEN=1;');
 const catalog={namespace:'CyberSkillDesignSystem_abcdef',publicHooks:[{name:'useAllowed',sourcePath:'components/Example.jsx'}]};
 const save=()=>writeFileSync(join(directory,'scripts/catalog-source.json'),JSON.stringify(catalog));save();
 const{header}=buildBundle(directory);
 assert(header.components.some(e=>e.name==='useAllowed'));assert(!header.components.some(e=>e.name==='useAccidental'||e.name==='lowercase'));
 assert(header.unexposedExports.some(e=>e.name==='useAccidental'));
 for(const hooks of [[{name:'lowercase',sourcePath:'components/Example.jsx'}],[{name:'useMissing',sourcePath:'components/Example.jsx'}],[{name:'useAllowed',sourcePath:'components/Wrong.jsx'}],[...catalog.publicHooks,...catalog.publicHooks]]){
  catalog.publicHooks=hooks;save();assert.throws(()=>buildBundle(directory),/public hook/);
 }
 // Exercise the real generators in a detached typed fixture; mutations may not relabel or move a registered hook.
 catalog.publicHooks=[{name:'useAllowed',sourcePath:'components/Example.jsx'}];catalog.cards=[];save();
 mkdirSync(join(directory,'scripts/lib'));mkdirSync(join(directory,'_esm'));
 for(const file of ['build-bundle.mjs','generate-export-catalog.mjs','generate-api-index.mjs'])copyFileSync(new URL('../../scripts/'+file,import.meta.url),join(directory,'scripts',file));
 for(const file of ['card-metadata.mjs','component-support.mjs','typescript-api.mjs'])copyFileSync(new URL('../../scripts/lib/'+file,import.meta.url),join(directory,'scripts/lib',file));
 symlinkSync(resolve(new URL('../../node_modules',import.meta.url).pathname),join(directory,'node_modules'));
 writeFileSync(join(directory,'components/Example.d.ts'),'export function Example(props:{label?:string}):null; export function useAllowed(namespace:string):number;');
 writeFileSync(join(directory,'_esm/react.d.ts'),'export {Example,useAllowed}from"../components/Example";export declare const INTERNAL_TOKEN:1;');
 writeFileSync(join(directory,'_esm/cs.mjs'),'export const VERSION = "1.0.0";\n');writeFileSync(join(directory,'VERSION'),'1.0.0');
 const entries=header.components.map(entry=>({...entry,kind:entry.name==='useAllowed'?'hook':entry.name==='INTERNAL_TOKEN'?'constant':'component'}));
 const support={reviewState:'unreviewed',owner:'Stephen Cheng',environments:[],axes:[],evidence:[],reviewedAt:null,reviewedBy:null,limitations:['Detached typed fixture; no support acceptance'],deprecation:null};
 const baseLife={components:Object.fromEntries(entries.map(entry=>[entry.name,{kind:entry.kind,sourcePath:entry.sourcePath,status:'preview',support}]))};
 const put=(file,value)=>writeFileSync(join(directory,file),JSON.stringify(value));
 const run=file=>spawnSync(process.execPath,[join(directory,'scripts',file)],{cwd:directory,encoding:'utf8'});
 const reset=()=>{put('_ds_manifest.json',{components:entries,cards:[]});put('components/lifecycle.json',baseLife);catalog.publicHooks=[{name:'useAllowed',sourcePath:'components/Example.jsx'}];save()};
 reset();for(const generator of ['generate-export-catalog.mjs','generate-api-index.mjs']){const result=run(generator);assert.equal(result.status,0,result.stdout+result.stderr)}
 const mutations=[
  ['lifecycle hook kind changed alone',life=>{life.components.useAllowed.kind='constant'}],
  ['lifecycle hook source changed alone',life=>{life.components.useAllowed.sourcePath='components/Wrong.jsx'}],
  ['registered hook relabeled constant',(life,manifest)=>{life.components.useAllowed.kind='constant';manifest.components.find(item=>item.name==='useAllowed').kind='constant'}],
  ['unregistered component relabeled hook',(life,manifest)=>{life.components.Example.kind='hook';manifest.components.find(item=>item.name==='Example').kind='hook'}],
  ['registered hook source moved',(life,manifest)=>{life.components.useAllowed.sourcePath='components/Wrong.jsx';manifest.components.find(item=>item.name==='useAllowed').sourcePath='components/Wrong.jsx'}],
  ['membership source moved',()=>{catalog.publicHooks[0].sourcePath='components/Wrong.jsx'}],
  ['membership omitted',()=>{catalog.publicHooks=[]}],
 ];
 for(const[label,mutate]of mutations)for(const generator of ['generate-export-catalog.mjs','generate-api-index.mjs']){
  reset();const life=structuredClone(baseLife),manifest={components:structuredClone(entries),cards:[]};mutate(life,manifest);put('components/lifecycle.json',life);put('_ds_manifest.json',manifest);save();
  const before=readFileSync(join(directory,'components/api-index.json'),'utf8'),legacyBefore=readFileSync(join(directory,'_esm/cs.mjs'),'utf8');
  const result=run(generator);assert.notEqual(result.status,0,generator+': '+label+' must reject');
  assert.match(result.stderr,/hook|kind\/source|Orphan lifecycle/,'Explicit membership/source failure, not an unrelated failure');
  assert.equal(readFileSync(join(directory,'components/api-index.json'),'utf8'),before,'failure preserves API output');assert.equal(readFileSync(join(directory,'_esm/cs.mjs'),'utf8'),legacyBefore,'failure preserves legacy output');
 }
 const ajv=new Ajv({strict:false});
 for(const name of ['manifest','lifecycle','api-index']){
  const schema=JSON.parse(readFileSync(new URL('../../schemas/'+name+'.schema.json',import.meta.url)));
  const enums=[];const walk=value=>{if(value&&typeof value==='object'){if(value.kind?.enum)enums.push(value.kind.enum);for(const child of Object.values(value))walk(child)}};walk(schema);
  assert(enums.length,name+': explicit export kind schema');
  for(const values of enums){const validate=ajv.compile({enum:values});assert(validate('hook'));assert(!validate('unknown-export-kind'))}
 }
}finally{rmSync(directory,{recursive:true,force:true})}
console.log('PASS explicit hook membership: registered hook only; accidental lowercase, absent source, malformed/duplicate membership and unknown schema kinds reject; both real generators reject lifecycle/manifest kind/source/membership mutations without overwriting prior outputs');
