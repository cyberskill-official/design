import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const read=path=>readFileSync(path,'utf8'),check=process.argv.includes('--check'),source=JSON.parse(read('scripts/template-content-models.json'));
assert.equal(source.schemaVersion,1);const seen=new Set(),schemas=new Map();
for(const row of source.models){
 assert(/^[a-z0-9-]+$/.test(row.template)&&/^[A-Za-z][A-Za-z0-9_]*$/.test(row.id));assert(!seen.has(row.template+'/'+row.id));seen.add(row.template+'/'+row.id);
 const path='templates/'+row.template+'/content-schema.json';if(!schemas.has(path))schemas.set(path,JSON.parse(read(path)));const slot=schemas.get(path).slots.find(x=>x.id===row.id);assert(slot&&['list','table'].includes(slot.type),'Existing structured source slot required');
 Object.assign(slot,{runtimeBinding:'structured',runtimeProjection:row.projection,runtimeModel:row.model,runtimeTargets:row.targets});
}
const outputs=new Map([...schemas].map(([path,value])=>[path,JSON.stringify(value,null,2)+'\n']));
const fixturePath='_audit/ci/fixtures/template-content-bindings.json',fixture=JSON.parse(read(fixturePath));const slots=fixture.templates.flatMap(t=>t.slots);fixture.scope=`Explicit adoption of all ${slots.length} declared source slots: ${slots.filter(s=>s.projection==='text').length} scalar plain-text bindings, ${slots.filter(s=>s.projection==='number').length} finite numeric percent bindings and ${slots.filter(s=>s.projection==='structured').length} bounded structured display models. Exact target/model metadata preserve authored controls, functions and offline runtime copies.`;
for(const row of source.models){const template=fixture.templates.find(t=>t.template===row.template),slot=template.slots.find(s=>s.id===row.id);assert(slot);Object.assign(slot,{projection:'structured',runtimeTargets:row.targets});const folder='templates/'+row.template,file=readdirSync(folder).find(x=>x.endsWith('.dc.html')),path=folder+'/'+file;let html=read(path);if(!/data-content-schema=/.test(html))html=html.replace(/(<script\b[^>]*data-dc-script[^>]*)(>)/,(m,a,b)=>a+' data-content-schema="./content-schema.json"'+b);assert(html.includes('data-content-schema="./content-schema.json"'));outputs.set(path,html);}
outputs.set(fixturePath,JSON.stringify(fixture,null,2)+'\n');
for(const[path,value]of outputs){if(check)assert.equal(read(path),value,'Stale structured metadata: '+path);else writeFileSync(path,value)}
console.log(`PASS structured template model ${check?'freshness':'generation'}: ${source.models.length} exact existing display slots.`);
