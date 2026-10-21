import assert from 'node:assert/strict';
import {cpSync,mkdtempSync,mkdirSync,readFileSync,readdirSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
const temp=mkdtempSync(join(tmpdir(),'cs-token-clean-'));
const outputs=['tokens/elements.css','tokens/tokens.json','tokens/tokens.js','tokens/tokens.dtcg.json','tokens/declarations.json','tokens/provenance.json','tokens/native/CSTokens.swift','tokens/native/CSTokens.kt','tokens/native/cs_tokens.dart'];
const stages=['scripts/generate-theme-palettes.mjs','scripts/generate-element-packs.mjs','scripts/generate-theme-exports.mjs','scripts/generate-base-token-exports.mjs','scripts/generate-dtcg.mjs','scripts/generate-token-declarations.mjs','scripts/generate-token-coverage.mjs','_audit/ci/generate-native-tokens.mjs'];
const copy=(source,target=source)=>{mkdirSync(dirname(join(temp,target)),{recursive:true});cpSync(source,join(temp,target),{recursive:true});};
const run=(file,args=[])=>{const result=spawnSync(process.execPath,[join(temp,file),...args],{cwd:temp,encoding:'utf8'});assert.equal(result.status,0,`${file}: ${result.stdout}\n${result.stderr}`);};
try {
 for(const file of ['scripts','_audit/lib','_audit/ci/generate-native-tokens.mjs','base','styles.css','VERSION','_ds_manifest.json'])copy(file);
 symlinkSync(join(process.cwd(),'node_modules'),join(temp,'node_modules'),'dir');
 mkdirSync(join(temp,'tokens/native'),{recursive:true});
 for(const name of readdirSync('tokens'))if((name.endsWith('.css')&&name!=='elements.css')||['theme-palette-source.json','element-seeds.json','base-inventory.json','export-metadata.json'].includes(name))copy('tokens/'+name);
 const manifestBefore=JSON.parse(readFileSync(join(temp,'_ds_manifest.json'),'utf8'));
 for(const stage of stages)run(stage);
 const first=Object.fromEntries(outputs.map(file=>[file,readFileSync(join(temp,file),'utf8')]));
 const manifest=JSON.parse(readFileSync(join(temp,'_ds_manifest.json'),'utf8'));
 for(const [key,value]of Object.entries(manifestBefore))if(!['tokens','globalCssPaths'].includes(key))assert.deepEqual(manifest[key],value,`Unrelated manifest section ${key} preserved`);
 const original=JSON.parse(readFileSync('tokens/tokens.json','utf8')),clean=JSON.parse(first['tokens/tokens.json']);
 for(const key of ['root','themes','elements','densities','contrasts'])assert.deepEqual(clean[key],original[key],`CSS values and scoped modes preserve ${key}`);
 for(const output of outputs)rmSync(join(temp,output));
 for(const stage of stages)run(stage);
 for(const [file,expected]of Object.entries(first))assert.equal(readFileSync(join(temp,file),'utf8'),expected,`Clean regeneration byte identity ${file}`);
 for(const stage of stages.filter(file=>!file.includes('coverage')))run(stage,['--check']);
 console.log('PASS clean token build: all nine generated artifacts deleted, reconstructed twice byte-identically from authored inputs; complete root/scoped values and unrelated manifest sections preserved.');
} finally {rmSync(temp,{recursive:true,force:true});}
