import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {compileESM,compareCompiledFiles,projectCompiledSitePolicy} from '../../scripts/build-compiled-esm.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const{files,metadata}=await compileESM();compareCompiledFiles(files,resolve(root,'dist/esm'));
const repeated=await compileESM();assert.deepEqual([...repeated.files.keys()],[...files.keys()]);
for(const[name,contents]of files)assert(contents.equals(repeated.files.get(name)),name+': deterministic compile');
const authoredMaps=new Set();let moduleBytes=0,mapBytes=0;
for(const[name,contents]of files){
 if(name.endsWith('.mjs')){
  moduleBytes+=contents.length;assert(contents.toString().startsWith('"use client";'),name+': client boundary retained');
  assert(contents.toString().includes('sourceMappingURL='),name+': linked map');
 }
 if(name.endsWith('.map')){
  mapBytes+=contents.length;const map=JSON.parse(contents);assert.equal(map.version,3);
  assert.equal(map.sources.length,map.sourcesContent.length);
  map.sources.forEach((source,i)=>{const actual=resolve(root,'dist/esm',dirname(name),source);assert(!source.includes('node_modules'),name+': no bundled peer source');assert.equal(readFileSync(actual,'utf8'),map.sourcesContent[i],name+': source map matches authored source');authoredMaps.add(actual)});
 }
}
for(const entry of metadata.entryPoints.filter(entry=>entry.source.endsWith('.jsx')))assert(authoredMaps.has(resolve(root,entry.source)),entry.source+': actual authored JSX mapped');
const temp=mkdtempSync(join(tmpdir(),'cs-compiled-gate-'));
try{
 for(const[name,contents]of files){const path=resolve(temp,name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,contents)}
 writeFileSync(join(temp,'orphan.mjs'),'export const stale=true;');assert.throws(()=>compareCompiledFiles(files,temp),/orphan/);rmSync(join(temp,'orphan.mjs'));
 const first=[...files.keys()][0];writeFileSync(resolve(temp,first),'stale bytes');assert.throws(()=>compareCompiledFiles(files,temp),/stale/);
 rmSync(resolve(temp,first));assert.throws(()=>compareCompiledFiles(files,temp),/missing/);
}finally{rmSync(temp,{recursive:true,force:true})}
console.log(JSON.stringify({pass:true,entryPoints:metadata.entryPoints.length,outputs:files.size,moduleBytes,mapBytes,scope:'Deterministic shared ESM graph, complete output set, missing/stale/orphan mutations, linked authored source maps and client boundaries. Plain Node/packed/SSR/hydration tested separately.'}));

const policy=JSON.parse(readFileSync(resolve(root,'scripts/public-site-policy.json'),'utf8'));
const projected=projectCompiledSitePolicy(policy,files);
assert.deepEqual(projected.audiences.runtime.files.filter(path=>path.startsWith('dist/esm/')),[...files.keys()].sort().map(path=>'dist/esm/'+path));
const withoutCompiled=value=>Object.fromEntries(Object.entries(value.audiences).map(([name,group])=>[name,{...group,files:group.files.filter(path=>!path.startsWith('dist/esm/'))}]));
assert.deepEqual(withoutCompiled(projected),withoutCompiled(policy),'All other publication decisions preserved');
const stale=structuredClone(policy);stale.audiences.runtime.files.push('dist/esm/chunks/chunk-STALE.mjs');
assert(!projectCompiledSitePolicy(stale,files).audiences.runtime.files.includes('dist/esm/chunks/chunk-STALE.mjs'),'Old hashed chunks removed');
for(const unsafe of ['../escape.mjs','chunks/../../escape.mjs','unreviewed.html','chunks/run.js'])assert.throws(()=>projectCompiledSitePolicy(policy,new Map([...files,[unsafe,Buffer.from('unsafe')]])),/Unsafe/);
const wrongAudience=structuredClone(policy);wrongAudience.audiences.authoring.files.push('dist/esm/chunks/extra.mjs');assert.throws(()=>projectCompiledSitePolicy(wrongAudience,files),/audience/);
const unknown=structuredClone(policy);unknown.audiences.runtime.files.push('dist/esm/unreviewed.html');assert.throws(()=>projectCompiledSitePolicy(unknown,files),/Unreviewed/);
const duplicate=structuredClone(policy);duplicate.audiences.authoring.files.push('VERSION');assert.throws(()=>projectCompiledSitePolicy(duplicate,files),/Duplicate/);
console.log('PASS exact compiled public inventory: stale chunks removed; unsafe paths, foreign audiences and duplicate publication rejected; every other policy member preserved');
