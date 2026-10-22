import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
export function verifyMapPublication(bundle,policy){
 const urls=[...bundle.matchAll(/^\/\/# sourceMappingURL=(.+)$/gm)].map(match=>match[1]);
 assert.equal(urls.length,1,'classic runtime has one linked source map');
 const path=urls[0];assert.equal(path,'_ds_bundle.js.map','classic source map is a reviewed runtime sibling');
 const members=Object.entries(policy.audiences).flatMap(([audience,group])=>group.files.filter(file=>file===path).map(()=>audience));
 assert.deepEqual(members,['runtime'],'linked classic source map must have exactly one runtime publication classification');
 return path;
}
const bundle=read('_ds_bundle.js'),policy=JSON.parse(read('scripts/public-site-policy.json'));
const path=verifyMapPublication(bundle,policy),map=JSON.parse(read(path));
assert.equal(map.version,3);assert(map.sources.length>100);assert.equal(map.sources.length,map.sourcesContent.length);
const missing=structuredClone(policy);missing.audiences.runtime.files=missing.audiences.runtime.files.filter(file=>file!==path);
assert.throws(()=>verifyMapPublication(bundle,missing),/runtime publication/);
const duplicate=structuredClone(policy);duplicate.audiences.runtime.files.push(path);
assert.throws(()=>verifyMapPublication(bundle,duplicate),/runtime publication/);
const foreign=structuredClone(missing);foreign.audiences.documentation.files.push(path);
assert.throws(()=>verifyMapPublication(bundle,foreign),/runtime publication/);
assert.throws(()=>verifyMapPublication(bundle.replace('sourceMappingURL='+path,'sourceMappingURL=../private.map'),policy),/reviewed runtime sibling/);
assert.throws(()=>verifyMapPublication(bundle.replace('sourceMappingURL='+path,'unlinkedSourceMap='+path),policy),/one linked source map/);
console.log('PASS actual classic linked map has unique runtime publication membership, authored map content, and five mutation negatives');
