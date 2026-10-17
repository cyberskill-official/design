// Optional real-tool test. Install pinned Style Dictionary outside this repo,
// then pass its package directory. Never downloads or installs dependencies.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createStyleDictionaryAdapter} from '../../scripts/lib/style-dictionary-adapter.mjs';
const directory=process.argv[2];
if(!directory)throw Error('Pass the package directory for style-dictionary@5.5.5');
const packageRoot=resolve(directory),pkg=JSON.parse(await readFile(join(packageRoot,'package.json'),'utf8'));
assert.equal(pkg.name,'style-dictionary');assert.equal(pkg.version,'5.5.5','Reverify the adapter before adopting another tool version');
const {default:StyleDictionary}=await import(pathToFileURL(join(packageRoot,'lib/StyleDictionary.js')));
const doc=JSON.parse(await readFile(new URL('../../tokens/tokens.dtcg.json',import.meta.url),'utf8'));
const declarationsJson=await readFile(new URL('../../tokens/declarations.json',import.meta.url),'utf8');
const adapter=createStyleDictionaryAdapter(doc,{declarationsJson});
StyleDictionary.registerFormat({name:'cyberskill/dtcg',format:adapter.formatDtcg});
StyleDictionary.registerFormat({name:'cyberskill/css-base',format:adapter.formatBaseCss});
const sd=new StyleDictionary({tokens:structuredClone(doc),usesDtcg:true,platforms:{exchange:{transformGroup:'css',files:[
 {destination:'tokens.dtcg.json',format:'cyberskill/dtcg'},
 {destination:'tokens.base.css',format:'cyberskill/css-base'},
]}}});
const files=await sd.formatPlatform('exchange');
const exported=JSON.parse(files.find(f=>f.destination==='tokens.dtcg.json').output);
assert.deepEqual(exported,doc,'All tool-imported original leaves plus retained root/group metadata must roundtrip');
const css=files.find(f=>f.destination==='tokens.base.css').output;
assert(!css.includes('[object Object]'));
for(const [group,entries] of Object.entries(doc))if(!group.startsWith('$'))for(const [name,def] of Object.entries(entries)){
 if(!name.startsWith('$'))assert(css.includes(`${name}: ${def.$extensions['com.cyberskill'].css};`),name);
}
const reimported=new StyleDictionary({tokens:exported,usesDtcg:true,platforms:{raw:{transforms:[]}}});
const second=await reimported.getPlatformTokens('raw');
const secondAdapter=createStyleDictionaryAdapter(exported,{declarationsJson});
assert.deepEqual(secondAdapter.exportDtcg(second),doc,'Second import/export must not accumulate losses');
const companion=secondAdapter.exportFiles(second);
assert.equal(companion['declarations.json'],declarationsJson);
assert.deepEqual(JSON.parse(companion['tokens.dtcg.json']),doc);
const tokenCount=Object.entries(doc).filter(([group])=>!group.startsWith('$')).reduce((count,[,entries])=>count+Object.keys(entries).filter(name=>!name.startsWith('$')).length,0);
const scopeMapCount=Object.values(doc.$extensions['com.cyberskill'].overrides).reduce((count,maps)=>count+Object.keys(maps).length,0);
console.log(`PASS real Style Dictionary 5.5.5: ${tokenCount} leaves, all root/group/leaf metadata and ${scopeMapCount} exported scope maps survive two imports; all base CSS expressions and the exact declaration companion preserved. Runtime scope composition remains canonical styles.css.`);
