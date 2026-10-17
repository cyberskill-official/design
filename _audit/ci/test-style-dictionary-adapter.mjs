import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createStyleDictionaryAdapter} from '../../scripts/lib/style-dictionary-adapter.mjs';
const doc=JSON.parse(await readFile(new URL('../../tokens/tokens.dtcg.json',import.meta.url),'utf8'));
const dictionary={allTokens:Object.entries(doc).filter(([g])=>!g.startsWith('$')).flatMap(([group,entries])=>Object.entries(entries).filter(([name])=>!name.startsWith('$')).map(([name,def])=>({path:[group,name],original:{...structuredClone(def),key:`{${group}.${name}}`},$value:'transformed tool value'})))};
const adapter=createStyleDictionaryAdapter(doc);
assert.deepEqual(adapter.exportDtcg(dictionary),doc,'All aliases, types, descriptions and scope maps must survive');
assert.deepEqual(JSON.parse(adapter.formatDtcg({dictionary})),doc);
assert.equal(adapter.formatDtcg({dictionary}),adapter.formatDtcg({dictionary:{allTokens:[...dictionary.allTokens].reverse()}}),'Output ordering must be deterministic');
const css=adapter.formatBaseCss({dictionary});
assert.equal(css.includes('[object Object]'),false);
for(const token of dictionary.allTokens)assert(css.includes(`${token.path[1]}: ${token.original.$extensions['com.cyberskill'].css};`));
for(const [name,mutate] of [
 ['missing',d=>d.allTokens.pop()],
 ['duplicate',d=>d.allTokens.push(d.allTokens[0])],
 ['unknown',d=>d.allTokens[0].path[1]='--cs-not-a-token'],
 ['bad tool key',d=>d.allTokens[0].original.key='{wrong}'],
 ['unexpected original field',d=>d.allTokens[0].original.unexpected='do not silently strip'],
 ['missing original',d=>delete d.allTokens[0].original],
 ['lost description',d=>{const t=d.allTokens.find(t=>t.original.$description);delete t.original.$description;}],
 ['lost extension',d=>delete d.allTokens[0].original.$extensions],
 ['changed typed value',d=>d.allTokens[0].original.$value.components[0]=1],
 ['flattened alias',d=>{const t=d.allTokens.find(t=>typeof t.original.$value==='string'&&t.original.$value.startsWith('{'));t.original.$value={value:1,unit:'px'};}],
 ['unexpected nesting',d=>d.allTokens[0].path.push('extra')],
]){
 const broken=structuredClone(dictionary);mutate(broken);assert.throws(()=>adapter.exportDtcg(broken),undefined,name);
}
const declarationsJson=await readFile(new URL('../../tokens/declarations.json',import.meta.url),'utf8');
assert.throws(()=>adapter.exportFiles(dictionary),/Companion/);
const bundled=createStyleDictionaryAdapter(doc,{declarationsJson});
const files=bundled.exportFiles(dictionary);
assert.deepEqual(JSON.parse(files['tokens.dtcg.json']),doc);
assert.equal(files['declarations.json'],declarationsJson,'Every conditional/private declaration must survive byte-for-byte');
assert.throws(()=>createStyleDictionaryAdapter(doc,{declarationsJson:declarationsJson+' '}),/mismatch/);
const missingReference=structuredClone(doc);delete missingReference.$extensions['com.cyberskill'].declarationGraph;
assert.throws(()=>createStyleDictionaryAdapter(missingReference,{declarationsJson}),/Missing/);
// Retained metadata is isolated from both input and returned output mutations.
const output=adapter.exportDtcg(dictionary);output.$extensions['com.cyberskill'].overrides={};
const expected=structuredClone(doc);doc.$extensions['com.cyberskill'].overrides={};
assert.deepEqual(adapter.exportDtcg(dictionary),expected);
console.log('PASS Style Dictionary adapter: full graph and scope metadata roundtrip, deterministic ordering, all base CSS values, eleven data-loss failures and isolation.');
