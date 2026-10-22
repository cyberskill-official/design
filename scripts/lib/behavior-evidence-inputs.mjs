import assert from 'node:assert/strict';
import {readdirSync,lstatSync,readFileSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {collectSources} from '../build-bundle.mjs';
export const behaviorInputInventoryVersion=1;
export const behaviorBoards=[{path:'_audit/component-behavior-test.html',global:'__behavior'},{path:'_audit/a11y-gate.html',global:'__a11y'}];
export function assertRelativeInputPath(path){
 assert.equal(typeof path,'string','Input path must be a string');
 assert(path.length>0&&!/[:\\\0]/.test(path)&&!path.startsWith('/')&&path.split('/').every(part=>part&&part!=='.'&&part!=='..'),'Unsafe evidence input path: '+path);
}
export function behaviorEvidenceInputs(root){
 const paths=new Set(['package.json','package-lock.json','scripts/catalog-source.json','scripts/capture-component-behavior-evidence.mjs','scripts/verify-component-behavior-evidence.mjs','scripts/lib/behavior-source-cases.mjs','scripts/lib/behavior-evidence-inputs.mjs','scripts/lib/verification-server.mjs','scripts/build-bundle.mjs','_audit/ci/check-bundle-freshness.mjs','_audit/ci/lib/bundle-bytes.mjs','components/api-index.json','components/contracts.json','_ds_bundle.js','_ds_bundle.js.map','styles.css','_vendor/react/react.production.min.js','_vendor/react/react-dom.production.min.js','_audit/ci/test-field-associations-browser.mjs','_audit/ci/lib/browser-fixture.mjs',...behaviorBoards.map(b=>b.path),...collectSources(root)]);
 for(const dir of ['base','tokens'])for(const entry of readdirSync(resolve(root,dir),{withFileTypes:true})){if(entry.name.endsWith('.css')){assert(entry.isFile(),'CSS input must be a regular file: '+dir+'/'+entry.name);paths.add(dir+'/'+entry.name)}}
 return [...paths].sort();
}
export function assertExactEvidenceInputKeys(root,record){
 assert(record&&typeof record==='object'&&!Array.isArray(record),'Evidence input hashes must be an object');
 const keys=Object.keys(record);keys.forEach(assertRelativeInputPath);
 assert.deepEqual(keys.sort(),behaviorEvidenceInputs(root),'Evidence input membership changed, missing or unknown');
 for(const value of Object.values(record))assert.match(value,/^[a-f0-9]{64}$/,'Invalid input SHA-256');
}
export function readBoundedEvidenceInput(root,path){
 assertRelativeInputPath(path);const base=resolve(root),file=resolve(base,path);assert(file.startsWith(base+sep),'Input escaped root');
 let current=base;const parts=path.split('/');for(let i=0;i<parts.length;i++){current=resolve(current,parts[i]);const stat=lstatSync(current);assert(!stat.isSymbolicLink(),'Evidence inputs cannot be symlinks: '+path);assert(i===parts.length-1?stat.isFile():stat.isDirectory(),'Non-regular evidence input: '+path)}
 return readFileSync(file);
}
export function snapshotBehaviorInputs(root){return Object.fromEntries(behaviorEvidenceInputs(root).map(path=>[path,createHash('sha256').update(readBoundedEvidenceInput(root,path)).digest('hex')]))}
