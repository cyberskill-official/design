import {readFileSync,writeFileSync,mkdirSync,lstatSync} from 'node:fs';
import {fileURLToPath} from 'node:url';import {join} from 'node:path';import {createHash} from 'node:crypto';
import {readNativeModeModel,nativeModeTargets} from './lib/native-mode-packs.mjs';import {renderNativeModes} from './lib/native-mode-renderers.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),model=readNativeModeModel(root),files=renderNativeModes(model),sha=s=>createHash('sha256').update(s).digest('hex');
const targets=Object.entries(files).map(([path,text])=>({path,bytes:Buffer.byteLength(text),sha256:sha(text)}));
files['tokens/native/mode-provenance.json']=JSON.stringify({...model.provenance,targets,generatedSourceBytes:targets.reduce((n,t)=>n+t.bytes,0)},null,2)+'\n';
if(JSON.stringify(Object.keys(files).sort())!==JSON.stringify([...nativeModeTargets].sort()))throw Error('Unexpected native output membership');
for(const path of nativeModeTargets){let current=root;for(const part of path.split('/')){current=join(current,part);if(lstatSync(current,{throwIfNoEntry:false})?.isSymbolicLink())throw Error('Native output symlink rejected: '+path);}}
if(process.argv.includes('--check')){for(const [path,text]of Object.entries(files))if(readFileSync(join(root,path),'utf8')!==text)throw Error('Stale native mode output: '+path);}
else{mkdirSync(join(root,'tokens/native'),{recursive:true});for(const [path,text]of Object.entries(files))writeFileSync(join(root,path),text);}
console.log(`PASS explicit native mode packs: ${model.modes.length} modes × ${model.tokens.length} typed getters, ${model.values.length} unique typed values, ${model.rows.length} shared rows, ${targets.reduce((n,t)=>n+t.bytes,0)} source bytes; no legacy constant files written`);
