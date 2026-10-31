import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {collectTokenDeclarations} from '../../scripts/lib/token-declarations.mjs';
import {projectBaseTokens} from '../../scripts/lib/base-token-exports.mjs';
import {projectDtcg} from '../../scripts/lib/project-dtcg.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const fixture=JSON.parse(read('_audit/ci/fixtures/a01-token-aliases/aliases.json')),inventory=JSON.parse(read('tokens/base-inventory.json'));
assert.equal(fixture.aliases.length,22);assert.equal(new Set(fixture.aliases.map(row=>row.alias)).size,22);
const names=new Set(fixture.aliases.map(row=>row.alias));
for(const row of fixture.aliases){assert.match(row.alias,/^--cs-[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.equal(row.alias,row.legacy.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase()));assert.equal(inventory.groups[row.group][row.legacy].$type,row.type);assert.equal(inventory.groups[row.group][row.alias].$type,row.type);}
const sources=['tokens/typography.css','tokens/component-tokens.css','tokens/theme-attributes.css'].map(path=>read(path)).join('\n');
for(const row of fixture.aliases){
 const owner=[...sources.matchAll(new RegExp(row.alias+'\\s*:\\s*([^;]+);','g'))].map(match=>match[1].trim());
 const reader=[...sources.matchAll(new RegExp(row.legacy+'\\s*:\\s*([^;]+);','g'))].map(match=>match[1].trim());
 assert.ok(owner.length&&owner.every(value=>!value.startsWith('var(')), row.alias+' owns a concrete value');
 assert.ok(reader.length&&reader.every(value=>value===`var(${row.alias})`), row.legacy+' reads the kebab owner');
}
const graph=collectTokenDeclarations(root,'styles.css'),json=projectBaseTokens(graph,{root:{}},inventory),doc=projectDtcg(JSON.parse(read('tokens/export-metadata.json')).dtcg,json,inventory).doc;
for(const row of fixture.aliases){
 assert.equal(json.root[row.group][row.legacy],`var(${row.alias})`);
 assert.equal(typeof json.root[row.group][row.alias]==='string'&&json.root[row.group][row.alias].startsWith('var('), false);
 assert.deepEqual(doc[row.group][row.legacy].$value, doc[row.group][row.alias].$value);
 assert.equal(doc[row.group][row.alias].$type,row.type);
 assert.equal(doc[row.group][row.alias].$extensions['com.cyberskill'].nativeAliasOf, row.legacy);
}
assert.equal(graph.declarations.filter(row=>names.has(row.name)).length,42,'22 root owners plus 20 existing density-scope rebindings');
console.log('PASS 22 kebab owners: camelCase names read them, 42 scoped declarations, shared typed DTCG values, native alias names retained');
