import {createHash} from 'node:crypto';

// Byte identity keeps the companion tied to the same ordered CSS source graph.
// This is not cascade evaluation, type inference or native support certification.
export function declarationGraphReference(source) {
  if(typeof source!=='string')throw Error('Expected declaration graph JSON text');
  const graph=JSON.parse(source);
  if(graph.schemaVersion!==1||!Array.isArray(graph.sources)||!Array.isArray(graph.declarations))throw Error('Unsupported declaration graph schema');
  if(graph.declarations.some(d=>typeof d.name!=='string'||!['public','private'].includes(d.visibility)||!Array.isArray(d.context)))throw Error('Invalid declaration graph row');
  const publicRows=graph.declarations.filter(d=>d.visibility==='public');
  return {path:'declarations.json',schemaVersion:1,sha256:createHash('sha256').update(source).digest('hex'),declarations:graph.declarations.length,publicDeclarations:publicRows.length,publicNames:new Set(publicRows.map(d=>d.name)).size,privateDeclarations:graph.declarations.length-publicRows.length};
}

export function verifyDeclarationGraph(reference,source) {
  if(!reference)throw Error('Missing declaration graph reference');
  const actual=declarationGraphReference(source);
  for(const [key,value] of Object.entries(actual))if(reference[key]!==value)throw Error('Declaration graph mismatch: '+key);
  return actual;
}
