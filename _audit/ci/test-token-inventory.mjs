import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {collectTokenDeclarations} from '../../scripts/lib/token-declarations.mjs';
import {projectBaseTokens} from '../../scripts/lib/base-token-exports.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const graph=collectTokenDeclarations(process.cwd()), before=read('tokens/tokens.json'), authored=read('tokens/base-inventory.json');
assert.deepEqual(projectBaseTokens(graph,before,authored),before);
const extra=structuredClone(graph), added=structuredClone(authored);
extra.declarations.push({...graph.declarations.find(d=>d.name==='--cs-space-2'),name:'--cs-space-fixture',value:'13px'});
assert.throws(()=>projectBaseTokens(extra,before,authored),/base-inventory.json/);
added.groups.space['--cs-space-fixture']={$type:'dimension',$description:'Fixture source addition'};
const projected=projectBaseTokens(extra,before,added);
assert.equal(projected.root.space['--cs-space-fixture'],'13px');
assert.equal(before.root.space['--cs-space-fixture'],undefined);
const temp=mkdtempSync(join(tmpdir(),'cs-token-inventory-'));
try {
 for(const file of ['scripts/generate-dtcg.mjs','scripts/lib/dtcg-values.mjs','scripts/lib/project-dtcg.mjs','_audit/lib/dtcg-profile.mjs','tokens/tokens.dtcg.json']) {mkdirSync(dirname(join(temp,file)),{recursive:true});cpSync(file,join(temp,file));}
 writeFileSync(join(temp,'tokens/tokens.json'),JSON.stringify(projected));
 writeFileSync(join(temp,'tokens/base-inventory.json'),JSON.stringify(added));
 const result=spawnSync(process.execPath,[join(temp,'scripts/generate-dtcg.mjs')],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 assert.deepEqual(read(join(temp,'tokens/tokens.dtcg.json')).space['--cs-space-fixture'].$value,{value:13,unit:'px'});
 added.groups.space['--cs-space-fixture'].$type='unsupported';
 writeFileSync(join(temp,'tokens/base-inventory.json'),JSON.stringify(added));
 assert.notEqual(spawnSync(process.execPath,[join(temp,'scripts/generate-dtcg.mjs')]).status,0,'Unsupported portable types must fail closed');
} finally {rmSync(temp,{recursive:true,force:true});}
console.log('PASS authored inventory: new CSS + metadata produces typed JSON/DTCG without editing generated membership; unsupported types fail closed.');
