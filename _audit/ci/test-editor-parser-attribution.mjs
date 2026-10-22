import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('../../',import.meta.url));
const read=path=>readFileSync(join(root,path),'utf8');
const names=['parse5','entities'];
const lock=JSON.parse(read('package-lock.json'));
const packages=Object.fromEntries(names.map(name=>[name,{
  locked:lock.packages['node_modules/'+name],
  installed:JSON.parse(read('node_modules/'+name+'/package.json')),
  licenseText:read('node_modules/'+name+'/LICENSE'),
}]));
const inputs={packages,notice:read('_vendor/editor-parser/NOTICE.txt'),runtime:read('components/forms/editor-parser.js'),documentation:read('THIRD-PARTY-NOTICES.md')};
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function verify({packages,notice,runtime,documentation}) {
  const section=documentation.split('## Editor HTML parser\n')[1]?.split('\n## ')[0];
  assert(section,'Document the embedded Editor parser attribution');
  const prose=section.replace(/\*\*|`/g,'').replace(/\s+/g,' ');
  const provenance=JSON.parse(runtime.match(/^\/\/ Locked provenance: (.+)$/m)?.[1]||'null');
  assert(provenance,'Generated runtime must retain locked package provenance');
  for(const name of names) {
    const {locked,installed,licenseText}=packages[name];
    assert.equal(installed.name,name);
    assert.equal(installed.version,locked.version,'Installed version matches lock: '+name);
    assert.equal(installed.license,locked.license,'Installed license matches lock: '+name);
    assert(locked.license&&licenseText.trim(),'Actual license evidence required: '+name);
    assert.deepEqual(provenance[name],{version:locked.version,integrity:locked.integrity},'Runtime provenance matches lock: '+name);
    assert(new RegExp('\\b'+escape(name)+':\\s*'+escape(locked.license)+'(?:;|\\.)').test(runtime),'Generated runtime license matches lock: '+name);
    assert(notice.includes(name+' '+locked.version+'\nhttps://www.npmjs.com/package/'+name+'\n\n'+licenseText),'Complete installed license and version retained in NOTICE: '+name);
    assert(new RegExp('\\b'+escape(name)+'(?:\\s+'+escape(locked.version)+')?\\s*(?:dependency\\s*)?\\('+escape(locked.license)+'\\)').test(prose),'Documentation license agrees with installed package, lock and NOTICE: '+name);
  }
}
verify(inputs);
const negatives=[];
for(const [name,mutate,expected] of [
  ['former blanket MIT summary',x=>{x.documentation=x.documentation.replace('**parse5 8.0.1** (MIT) and its\n**entities** dependency (BSD-2-Clause)','**parse5 8.0.1** and its\n**entities** dependency under their MIT licenses');},/Documentation license/],
  ['wrong entities summary',x=>{x.documentation=x.documentation.replace('dependency (BSD-2-Clause)','dependency (MIT)');},/Documentation license/],
  ['omitted entities license bytes',x=>{x.notice=x.notice.replace(x.packages.entities.licenseText,'');},/Complete installed license/],
  ['wrong runtime license',x=>{x.runtime=x.runtime.replace('entities: BSD-2-Clause','entities: MIT');},/Generated runtime license/],
  ['wrong locked license',x=>{x.packages.entities.locked.license='MIT';},/Installed license matches lock/],
  ['wrong runtime integrity',x=>{x.runtime=x.runtime.replace(x.packages.entities.locked.integrity,'sha512-invalid');},/Runtime provenance matches lock/],
]) {
  const changed=structuredClone(inputs);mutate(changed);assert.throws(()=>verify(changed),expected,name);negatives.push(name);
}
console.log(JSON.stringify({pass:true,packages:names.map(name=>({name,version:packages[name].locked.version,license:packages[name].locked.license,licenseSha256:createHash('sha256').update(packages[name].licenseText).digest('hex')})),negativeControls:negatives,scope:'Documentation, generated runtime header/provenance and complete retained NOTICE agree with current installed package metadata and locked version/license/integrity. No new legal grant or independent publisher signature approval inferred.'}));
