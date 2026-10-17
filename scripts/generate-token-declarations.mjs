#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {declarationGraphReference} from './lib/token-graph-reference.mjs';
import {collectTokenDeclarations,manifestTokens} from './lib/token-declarations.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const graph=collectTokenDeclarations(root);
graph.generator='scripts/generate-token-declarations.mjs';
const manifest=JSON.parse(readFileSync(join(root,'_ds_manifest.json'),'utf8'));
const dtcg=JSON.parse(readFileSync(join(root,'tokens/tokens.dtcg.json'),'utf8'));
manifest.tokens=manifestTokens(graph,dtcg);
manifest.globalCssPaths=[...graph.sources.map(s=>s.path).filter(p=>p!==graph.entry),graph.entry];
const graphText=JSON.stringify(graph,null,2)+'\n';
const reference=declarationGraphReference(graphText);
const json=JSON.parse(readFileSync(join(root,'tokens/tokens.json'),'utf8'));
json.$meta.declarationGraph=reference;
dtcg.$extensions['com.cyberskill'].declarationGraph=reference;
const version=readFileSync(join(root,'VERSION'),'utf8').trim();
const outputs={
 'tokens/declarations.json':graphText,
 'tokens/tokens.json':JSON.stringify(json,null,2)+'\n',
 'tokens/tokens.js':`// CyberSkill design tokens — generated from tokens/*.css (v${version}). Do not edit by hand.\nexport const tokens = ${JSON.stringify(json,null,2)};\nexport default tokens;\n`,
 'tokens/tokens.dtcg.json':JSON.stringify(dtcg,null,2)+'\n',
 '_ds_manifest.json':(JSON.stringify(manifest,null,2)+'\n').replace(/[\u0080-\uffff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')),
};
let stale=false;
for(const [file,text] of Object.entries(outputs)){
 if(process.argv.includes('--check')){
  let actual;try{actual=readFileSync(join(root,file),'utf8');}catch{}
  if(actual!==text){console.error('Stale token declarations: '+file);stale=true;}
 }else writeFileSync(join(root,file),text);
}
if(stale)process.exitCode=1;
else console.log(`${process.argv.includes('--check')?'PASS':'Generated'} token declarations: ${graph.declarations.length} declarations, ${manifest.tokens.length} public, ${graph.sources.length} source files`);
