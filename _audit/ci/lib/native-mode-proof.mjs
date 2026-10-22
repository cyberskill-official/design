import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {join} from 'node:path';
export function expectedNativeModes(root){
 const index=JSON.parse(readFileSync(join(root,'tokens/modes/index.json'),'utf8')),modes=new Map();
 for(const mode of index.modes){const doc=JSON.parse(readFileSync(join(root,'tokens/modes',mode.file),'utf8')),defs=Object.fromEntries(Object.entries(doc).filter(([g])=>!g.startsWith('$')).flatMap(([g,entries])=>Object.entries(entries).map(([n,d])=>[g+'.'+n,d])));
  function resolve(path,seen=[]){assert(!seen.includes(path));const d=defs[path];assert(d);let v=d.$value;if(typeof v==='string'&&v[0]==='{')v=resolve(v.slice(1,-1),seen.concat(path));return d.$type==='shadow'&&!Array.isArray(v)||d.$type==='fontFamily'&&typeof v==='string'?[v]:structuredClone(v);}
  const values=Object.fromEntries(Object.entries(defs).map(([path,d])=>[path.slice(path.indexOf('.')+1),{type:d.$type,value:resolve(path)}]));modes.set(mode.id,{axes:mode.axes,values,omissions:mode.omissions});
 }return modes;
}
export function numericBits(value){if(typeof value==='number'){const buffer=new ArrayBuffer(8),view=new DataView(buffer);view.setFloat64(0,value,false);return '0x'+view.getBigUint64(0,false).toString(16).padStart(16,'0');}if(Array.isArray(value))return value.map(numericBits);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,numericBits(v)]));return value;}
export function assertNativeObservations(observed,expected,{bits=false}={}){
 assert.equal(observed.length,expected.size,'Every canonical mode must execute');assert.equal(new Set(observed.map(p=>p.id)).size,expected.size);
 for(const pack of observed){const reference=expected.get(pack.id);assert(reference,'Unknown native mode id');assert.deepEqual(Object.keys(pack.values).sort(),Object.keys(reference.values).sort());for(const[name,definition]of Object.entries(reference.values))assert.deepEqual(pack.values[name],bits?numericBits(definition.value):definition.value,'Native getter mismatch '+pack.id+' '+name);assert.deepEqual(pack.omissions,reference.omissions,'Native omissions mismatch '+pack.id);}
}
export function assertNativeRequests(requests,expected){
 const key=axes=>JSON.stringify(Object.fromEntries(Object.entries(axes).sort(([a],[b])=>a<b?-1:a>b?1:0))),valid=new Map([...expected].map(([id,m])=>[key(m.axes),id]));assert.equal(requests.length,1584);assert.equal(new Set(requests.map(r=>key(r.axes))).size,1584);
 let accepted=0;for(const request of requests){const id=valid.get(key(request.axes));assert.equal(request.accepted,id!==undefined,'Native invalid-axis acceptance '+key(request.axes));if(id){assert.equal(request.id,id);accepted++;}}assert.equal(accepted,256);
}
