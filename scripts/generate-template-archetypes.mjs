import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,lstatSync} from 'node:fs';
import {join} from 'node:path';
import {validateArchetypes,projectArchetype} from './lib/template-archetypes.mjs';
assert(process.argv.slice(2).every(arg=>arg==='--check'));const check=process.argv.includes('--check'),source=validateArchetypes(JSON.parse(readFileSync('scripts/template-archetypes-source.json','utf8'))),outputs=[];
for(const entry of source.templates){let owned='';for(const part of entry.path.split('/')){owned=join(owned,part);assert(!lstatSync(owned).isSymbolicLink(),'Symlink output/ancestor forbidden: '+owned)}const input=readFileSync(entry.path,'utf8'),output=projectArchetype(input,entry,source.archetypes[entry.archetype]);outputs.push({path:entry.path,input,...output})}
for(const output of outputs)if(check)assert.equal(output.input,output.html,'Stale shared heading projection: '+output.path);else writeFileSync(output.path,output.html);
console.log('PASS template archetypes '+(check?'freshness':'generation')+':'+outputs.length+' document titles/'+outputs.flatMap(o=>o.owners).length+' language owners; exact remaining source bytes preserved.');
