import assert from 'node:assert/strict';
import Ajv from 'ajv';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateFixtures,validateFixtureValue,fenced,referenceMarkdown,referenceMarkdownVi} from '../../scripts/generate-static-html-reference.mjs';
const read=path=>readFileSync(path,'utf8'),hash=value=>createHash('sha256').update(value).digest('hex');
const api=JSON.parse(read('components/api-index.json')),fixtures=JSON.parse(read('scripts/fixtures/static-html-reference.json'));
const reference=JSON.parse(read('components/static-html-reference.json'));
const validate=new Ajv({strict:false,allErrors:true}).compile(JSON.parse(read('schemas/static-html-reference.schema.json')));
assert(validate(reference),JSON.stringify(validate.errors));
const malformed=structuredClone(reference);delete malformed.components[0].sourceSha256;assert.equal(validate(malformed),false,'Missing row source identity fails schema');
validateFixtures(api,fixtures);
assert.throws(()=>validateFixtures(api,{...fixtures,components:fixtures.components.slice(1)}),/Every public component/);
assert.throws(()=>validateFixtures(api,{...fixtures,components:[...fixtures.components,fixtures.components[0]]}),/Every public component/);
assert.throws(()=>validateFixtures({...api,exports:[...api.exports,{kind:'component',name:'NewComponent',sourcePath:'components/New.jsx'}]},fixtures),/Every public component/);
for(const value of [{onClick:'run'},{onclick:'run'},{dangerouslySetInnerHTML:{__html:'<script>run</script>'}},{href:' JaVaScRiPt:run()'},{href:'java\nscript:run()'},{href:'data:text/html,<script>run</script>'},{$element:{tag:'script',children:'run'}},JSON.parse('{"__proto__":{"unsafe":true}}')])assert.throws(()=>validateFixtureValue(value),/Unsafe|unsafe/);
const fence=fenced('```\n<script>escape</script>','html');assert(fence.startsWith('````html\n')&&fence.endsWith('\n````'),'Code fences cannot be broken by source content');
assert.deepEqual(reference.components.map(row=>row.name),fixtures.components.map(row=>row.name));
assert.equal(reference.inputs.componentCount,fixtures.components.length);
assert.equal(reference.inputs.exportCount,api.exports.length);
assert.equal(reference.inputs.hookCount,api.exports.filter(e=>e.kind==='hook').length);
assert.deepEqual(reference.nonComponentExports.map(e=>[e.name,e.kind]),api.exports.filter(e=>e.kind!=='component').map(e=>[e.name,e.kind]));
assert.equal(reference.components.find(e=>e.name==='LocaleProvider').referenceKind,'context-only');
for(const row of reference.components){
 assert.equal(row.sourceSha256,hash(read(row.sourcePath)),row.name+' source binding');
 assert.equal(row.declarationSha256,hash(read(row.fixtureAuthority)),row.name+' declaration binding');
 assert.equal(typeof row.html,'string');assert(Array.isArray(row.semanticDOM));
 assert(!/<script\b|\son[a-z]+\s*=/i.test(row.html),row.name+' inert observed markup');
 assert(row.boundary.includes('Context provider')||row.boundary.includes('DOM snapshot only'));
}
const button=reference.components.find(row=>row.name==='Button');
assert(button.html.includes('&lt;example&gt;')&&button.html.includes('&amp;'), 'React escapes ordinary caller content in recorded markup');
for(const name of ['Dialog','AlertDialog','Drawer','Menu','MenuItem','Popover','CommandPalette','Tour']){
 const row=reference.components.find(item=>item.name===name);assert.equal(row.referenceKind,'interactive-dom-snapshot');assert(row.html.length>0,name+' actual open DOM captured');
}
assert.equal(reference.components.find(row=>row.name==='OverlayProvider').referenceKind,'context-only');
assert.equal(read('docs/static-html-reference.md'),referenceMarkdown(reference));
assert.equal(read('docs/vi/static-html-reference.md'),referenceMarkdownVi(reference));
console.log('PASS static reference: complete export inventory, source hashes, fixture omission/duplicate/new-export mutations, unsafe props/tags, escaped text/fences and EN/VI projections');
