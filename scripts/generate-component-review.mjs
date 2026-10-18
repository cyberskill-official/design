#!/usr/bin/env node
// Discovery coverage only: lexical references do not establish behavior coverage.
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(resolve(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
export function buildReview(entries,sources,tests) {
 const names=new Set();
 return entries.filter(e=>e.kind==='component').map(e=>{
  if(names.has(e.name))throw Error('Duplicate component '+e.name);names.add(e.name);
  const source=sources[e.sourcePath];if(typeof source!=='string')throw Error('Missing source '+e.sourcePath);
  const signals=[...new Set(source.match(/\b(?:useState|useReducer|useRef|useEffect|useLayoutEffect|useClientLayoutEffect|useOverlayLayer)\b/g)||[])].sort();
  const references=[];
  for(const [path,text] of Object.entries(tests)) {
   const regex=new RegExp('\\bCS\\.'+e.name+'\\b');
   text.split('\n').forEach((line,i)=>{if(regex.test(line))references.push({path,line:i+1})});
  }
  return {name:e.name,sourcePath:e.sourcePath,sourceSha256:hash(source),sourceFileSignals:signals,browserFixtureReferences:references,reviewState:'requires_contract_review'};
 }).sort((a,b)=>a.name.localeCompare(b.name,'en'));
}
export function generate() {
 const entries=JSON.parse(read('_ds_manifest.json')).components;
 const sources=Object.fromEntries(entries.filter(e=>e.kind==='component').map(e=>[e.sourcePath,read(e.sourcePath)]));
 const tests=Object.fromEntries(readdirSync(resolve(root,'_audit/ci')).filter(p=>/^test-.*\.mjs$/.test(p)).sort().map(p=>['_audit/ci/'+p,read('_audit/ci/'+p)]));
 const components=buildReview(entries,sources,tests);
 return {schemaVersion:1,interpretation:'All public components. Hooks are file-level lexical signals, including shared exports; CS.Name matches are navigation pointers, potentially in comments, not executed-test or state coverage. Indirect imports, aliases, HTML gates and manual evidence are not inferred. No component is certified by this inventory.',testSources:Object.entries(tests).map(([path,text])=>({path,sha256:hash(text)})),components};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 generate();
 console.log('PASS component review inventory: all public components; lexical pointers are not coverage certification');
}
