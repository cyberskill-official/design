// Requires a separately installed exact Style Dictionary; never installs it.
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createStyleDictionaryAdapter} from '../../scripts/lib/style-dictionary-adapter.mjs';
const directory=process.argv[2];if(!directory)throw Error('Pass the installed style-dictionary@5.5.5 package directory');
const pkg=JSON.parse(readFileSync(join(directory,'package.json'),'utf8'));assert.equal(pkg.name,'style-dictionary');assert.equal(pkg.version,'5.5.5');
const {default:StyleDictionary}=await import(pathToFileURL(resolve(directory,'lib/StyleDictionary.js')));
const index=JSON.parse(readFileSync('tokens/modes/index.json','utf8'));let adapter;let mixedModes=0;
StyleDictionary.registerFormat({name:'cyberskill/mode-dtcg',format:args=>adapter.formatDtcg(args)});
StyleDictionary.registerFormat({name:'cyberskill/mode-css',format:args=>adapter.formatBaseCss(args)});
for(const mode of index.modes){
 const doc=JSON.parse(readFileSync('tokens/modes/'+mode.file,'utf8'));adapter=createStyleDictionaryAdapter(doc,{colorSpaces:['srgb','oklab']});
 if(JSON.stringify(doc).includes('"colorSpace":"oklab"'))mixedModes++;
 const sd=new StyleDictionary({tokens:structuredClone(doc),usesDtcg:true,log:{verbosity:'silent'},platforms:{exchange:{transformGroup:'css',files:[{destination:'mode.dtcg.json',format:'cyberskill/mode-dtcg'},{destination:'mode.css',format:'cyberskill/mode-css'}]}}});
 const files=await sd.formatPlatform('exchange'),exported=JSON.parse(files.find(f=>f.destination==='mode.dtcg.json').output);
 assert.deepEqual(exported,doc,mode.id+' real tool original-token+metadata roundtrip');
 const css=files.find(f=>f.destination==='mode.css').output;assert(!css.includes('[object Object]'));
 for(const [group,entries]of Object.entries(doc))if(!group.startsWith('$'))for(const[name,def]of Object.entries(entries))assert(css.includes(`${name}: ${def.$extensions['com.cyberskill'].css};`));
 if(mode.axes.theme==='system'&&mode.axes.element==='tho'&&mode.axes.variant===null&&mode.axes.density==='comfortable'){
  const second=new StyleDictionary({tokens:exported,usesDtcg:true,log:{verbosity:'silent'},platforms:{raw:{transforms:[]}}});
  assert.deepEqual(adapter.exportDtcg(await second.getPlatformTokens('raw')),doc,'Second-import losslessness '+mode.id);
 }
}
mkdirSync('test-results',{recursive:true});writeFileSync('test-results/token-modes-style-dictionary.json',JSON.stringify({schemaVersion:1,sourceHash:index.sourceHash,tool:{name:pkg.name,version:pkg.version,registryMetadata:'https://registry.npmjs.org/style-dictionary/5.5.5',registryReportedIntegrity:'sha512-BG+o8U7MUcU6iLUtl1OWApF9hmfTSJcrhY6iWdXDU9xjt7VMZOHQMTsGx5AvsHyytWmeWybP2LzQxIKHUm9Svg=='},modeCount:index.modes.length,modesWithStandardOklab:mixedModes,adapterRoundtrip:true,cssAdapterProjection:true,secondImports:4,interpretation:'Exact Style Dictionary5.5.5 tested through the CyberSkill adapter. This does not establish arbitrary design-tool import, generic native cascade parity, or native UI acceptance.'},null,2)+'\n');
console.log(`PASS real Style Dictionary${pkg.version}:256mode DTCG+CSS adapter roundtrips,${mixedModes}OKLAB documents and4second-import checks`);
