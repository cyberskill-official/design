import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {modeInputs,captureTokenModes,projectModeBundle} from './lib/token-modes.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),directory=resolve(root,'tokens/modes');
const inputs=modeInputs(root),capture=await captureTokenModes(inputs),bundle=projectModeBundle(inputs,capture);
if(modeInputs(root).sourceHash!==inputs.sourceHash)throw Error('Mode sources changed during capture; retry against frozen sources');
const check=process.argv.includes('--check');
if(check){
 const previous=JSON.parse(readFileSync(resolve(directory,'index.json'),'utf8'));
 // Platform is provenance, not an excuse to accept value drift. The same pinned
 // engine must reproduce every byte on another OS; compare outputs below.
 bundle.index.renderer.platform=previous.renderer.platform;
}
const files={...bundle.files,'index.json':JSON.stringify(bundle.index,null,2)+'\n'};
if(check){
 const actual=readdirSync(directory).filter(p=>p.endsWith('.json')).sort();if(JSON.stringify(actual)!==JSON.stringify(Object.keys(files).sort()))throw Error('Mode output membership drift');
 for(const [path,text]of Object.entries(files))if(readFileSync(resolve(directory,path),'utf8')!==text)throw Error('Stale mode export: '+path+'; regenerate with the pinned renderer and review source/renderer changes');
}else{mkdirSync(directory,{recursive:true});const existing=readdirSync(directory).filter(p=>p.endsWith('.json')&&!Object.hasOwn(files,p));if(existing.length)throw Error('Unexpected obsolete mode files require explicit review: '+existing.join(','));for(const [path,text]of Object.entries(files))writeFileSync(resolve(directory,path),text);}
console.log(`PASS standalone token modes: ${bundle.index.modes.length} explicit documents, ${bundle.index.modes[0].tokenCount} typed values/mode, per-token omissions; ${capture.engine} ${capture.version} (${capture.platform})${check?' freshness verified':''}`);
