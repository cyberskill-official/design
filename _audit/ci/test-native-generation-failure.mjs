import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile, rm, copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const source=new URL('../../',import.meta.url);
const inputText=await readFile(new URL('tokens/tokens.dtcg.json',source),'utf8');
const input=JSON.parse(inputText);
const outputs=['tokens/native/CSTokens.swift','tokens/native/CSTokens.kt','tokens/native/cs_tokens.dart','tokens/provenance.json'];
const mutations=[
 ['valid source',()=>{}],
 ['invalid dark shadow',d=>d.$extensions['com.cyberskill'].overrides.themes.dark['--cs-shadow-xs']='invalid'],
 ['invalid light pack color',d=>d.$extensions['com.cyberskill'].overrides.elements.tho['--cs-accent']='not-a-color'],
 ['missing dark pack',d=>delete d.$extensions['com.cyberskill'].overrides.elementsDark.tho],
 ['unknown dark role',d=>d.$extensions['com.cyberskill'].overrides.elementsDark.tho['--cs-unknown']='#123456'],
 ['invalid color',d=>d.color['--cs-color-brand-umber'].$value='not-a-color'],
 ['invalid dimension',d=>d.component['--cs-component-button-gap'].$value='not-a-dimension'],
 ['CSS extension drift',d=>d.color['--cs-color-brand-umber'].$extensions['com.cyberskill'].css='#FFFFFF'],
 ['missing contrast maps',d=>delete d.$extensions['com.cyberskill'].overrides.contrasts],
 ['invalid contrast color',d=>d.$extensions['com.cyberskill'].overrides.contrasts['high-light']['--cs-color-text-muted']='red'],
 ['unknown contrast role',d=>d.$extensions['com.cyberskill'].overrides.contrasts['high-dark']['--cs-extra']='#123456'],
 ['invalid density metric',d=>d.$extensions['com.cyberskill'].overrides.densities={compact:{'--cs-density-space-1':'invalid'}}],
];
for(const [name,mutate] of mutations){
 const dir=await mkdtemp(join(tmpdir(),'cs-native-failure-'));
 try{
  await mkdir(join(dir,'_audit/ci'),{recursive:true});await mkdir(join(dir,'tokens/native'),{recursive:true});
  await copyFile(new URL('_audit/ci/generate-native-tokens.mjs',source),join(dir,'_audit/ci/generate-native-tokens.mjs'));
  for(const dependency of ['_audit/lib/dtcg-profile.mjs','scripts/lib/dtcg-values.mjs']){
   await mkdir(join(dir,dependency.slice(0,dependency.lastIndexOf('/'))),{recursive:true});
   await copyFile(new URL(dependency,source),join(dir,dependency));
  }
  await copyFile(new URL('VERSION',source),join(dir,'VERSION'));
  const d=structuredClone(input);mutate(d);await writeFile(join(dir,'tokens/tokens.dtcg.json'),name==='valid source'?inputText:JSON.stringify(d));
  for(const path of outputs)await writeFile(join(dir,path),'unchanged-before-failed-generation\n');
  const run=spawnSync(process.execPath,['_audit/ci/generate-native-tokens.mjs'],{cwd:dir,encoding:'utf8'});
  if(name==='valid source'){
   assert.equal(run.status,0,run.stderr);
   for(const path of outputs)assert.equal(await readFile(join(dir,path),'utf8'),await readFile(new URL(path,source),'utf8'),`Deterministic ${path}`);
   continue;
  }
  assert.notEqual(run.status,0,`${name} must fail, not silently emit an incomplete native artifact`);
  assert.match(run.stderr,/unconvertible token|typed value\/CSS metadata mismatch/i);
  for(const path of outputs)assert.equal(await readFile(join(dir,path),'utf8'),'unchanged-before-failed-generation\n',`${name}: preserve ${path}`);
 }finally{await rm(dir,{recursive:true,force:true});}
}
console.log('PASS native generation: valid source reproduces all four outputs; invalid base, shadow, pack and density values fail before any artifact or provenance is overwritten.');
