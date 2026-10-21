import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {collectTokenDeclarations} from '../../scripts/lib/token-declarations.mjs';
import {projectBaseTokens} from '../../scripts/lib/base-token-exports.mjs';
import {projectDtcg} from '../../scripts/lib/project-dtcg.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const fixture=JSON.parse(read('_audit/ci/fixtures/a01-token-aliases/aliases.json')),inventory=JSON.parse(read('tokens/base-inventory.json'));
assert.equal(fixture.aliases.length,22);assert.equal(new Set(fixture.aliases.map(row=>row.alias)).size,22);
const names=new Set(fixture.aliases.map(row=>row.alias));
for(const row of fixture.aliases){assert.match(row.alias,/^--cs-[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.equal(row.alias,row.legacy.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase()));assert.equal(inventory.groups[row.group][row.legacy].$type,row.type);assert.equal(inventory.groups[row.group][row.alias].$type,row.type);}
for(const before of fixture.before){
 const baseline=read('_audit/ci/fixtures/a01-token-aliases/'+before.path.split('/').at(-1));assert.equal(createHash('sha256').update(baseline).digest('hex'),before.sha256);
 let current=read(before.path);
 for(const row of fixture.aliases)current=current.replaceAll(new RegExp('\\n[ \\t]*'+row.alias+': var\\('+row.legacy+'\\);','g'),'');
 assert.equal(current,baseline,'Every original declaration/comment remains byte-identical: '+before.path);
}
const graph=collectTokenDeclarations(root,'styles.css'),json=projectBaseTokens(graph,{root:{}},inventory),doc=projectDtcg(JSON.parse(read('tokens/export-metadata.json')).dtcg,json,inventory).doc;
for(const row of fixture.aliases){assert.equal(json.root[row.group][row.alias],`var(${row.legacy})`);assert.equal(doc[row.group][row.alias].$value,`{${row.group}.${row.legacy}}`);assert.equal(doc[row.group][row.alias].$type,row.type);}
assert.equal(graph.declarations.filter(row=>names.has(row.name)).length,42,'22 root aliases plus20 existing density-scope rebindings');
console.log('PASS22 additive kebab aliases: original declarations unchanged,42 scoped declarations, explicit inventory types and real typed DTCG references');
