import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,readFile,writeFile,rm,symlink} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const root=new URL('../../',import.meta.url);
const outputs=['tokens/tokens.json','tokens/tokens.js','tokens/tokens.dtcg.json','_ds_manifest.json'];
const sourceCss=await readFile(new URL('tokens/theme-attributes.css',root),'utf8');
for(const [name,change] of [
 ['missing alias',s=>s.replace('var(--cs-space-1)','var(--cs-missing)')],
 ['cycle',s=>s.replace('var(--cs-space-1)','var(--cs-density-space-1)')],
 ['unsupported unit',s=>s.replace('3px;','3em;')],
 ['invalid number',s=>s.replace('3px;','3..2px;')],
 ['duplicate scope',s=>s+'\n[data-cs-density="compact"]{--cs-density-space-1:3px;}'],
]){
 const dir=await mkdtemp(join(tmpdir(),'cs-density-export-'));
 try{
  for(const path of [...outputs,'VERSION','scripts/generate-theme-exports.mjs','scripts/lib/contrast-maps.mjs','tokens/theme-attributes.css','tokens/colors.css','tokens/component-tokens.css','tokens/elevation.css']){
   await mkdir(dirname(join(dir,path)),{recursive:true});await copyFile(new URL(path,root),join(dir,path));
  }
  await symlink(new URL('node_modules',root).pathname,join(dir,'node_modules'),'dir');
  const before=await Promise.all(outputs.map(p=>readFile(join(dir,p),'utf8')));
  await writeFile(join(dir,'tokens/theme-attributes.css'),change(sourceCss));
  const run=spawnSync(process.execPath,['scripts/generate-theme-exports.mjs'],{cwd:dir,encoding:'utf8'});
  assert.notEqual(run.status,0,name);
  assert.deepEqual(await Promise.all(outputs.map(p=>readFile(join(dir,p),'utf8'))),before,`${name}: invalid input must not overwrite mirrors`);
 }finally{await rm(dir,{recursive:true,force:true});}
}
console.log('PASS density generator failure paths: missing/cyclic aliases, unsupported units and duplicate scopes preserve every mirror.');

// Change authored CSS in an isolated fixture: all three theme mirrors must
// update, and an ambiguous duplicate must fail before writing any mirror.
{
 const dir=await mkdtemp(join(tmpdir(),'cs-theme-export-'));
 try {
  for(const path of [...outputs,'VERSION','scripts/generate-theme-exports.mjs','scripts/lib/contrast-maps.mjs','tokens/theme-attributes.css','tokens/colors.css','tokens/component-tokens.css','tokens/elevation.css']) {
   await mkdir(dirname(join(dir,path)),{recursive:true});await copyFile(new URL(path,root),join(dir,path));
  }
  await symlink(new URL('node_modules',root).pathname,join(dir,'node_modules'),'dir');
  const componentPath=join(dir,'tokens/component-tokens.css');
  const source=await readFile(componentPath,'utf8');
  await writeFile(componentPath,source.replaceAll('#5a4636','#123456'));
  const run=()=>spawnSync(process.execPath,['scripts/generate-theme-exports.mjs'],{cwd:dir,encoding:'utf8'});
  const result=run();assert.equal(result.status,0,result.stderr);
  const json=JSON.parse(await readFile(join(dir,'tokens/tokens.json'),'utf8'));
  const dtcg=JSON.parse(await readFile(join(dir,'tokens/tokens.dtcg.json'),'utf8'));
  const esm=JSON.parse((await readFile(join(dir,'tokens/tokens.js'),'utf8')).match(/export const tokens = (\{[\s\S]*\n\});/)[1]);
  for(const doc of [json,esm,{themes:dtcg.$extensions['com.cyberskill'].overrides.themes}])for(const mode of ['dark','system'])assert.equal(doc.themes[mode]['--cs-component-textfield-border-default'],'#123456');
  const before=await Promise.all(outputs.map(p=>readFile(join(dir,p),'utf8')));
  await writeFile(componentPath,source+'\n[data-theme="dark"] { --cs-extra: red; }');
  assert.notEqual(run().status,0,'Duplicate theme scope must fail');
  assert.deepEqual(await Promise.all(outputs.map(p=>readFile(join(dir,p),'utf8'))),before,'Invalid theme source must not overwrite mirrors');
 } finally { await rm(dir,{recursive:true,force:true}); }
}
console.log('PASS theme source regeneration: changed field border reaches JSON/ESM/DTCG dark and system maps; duplicate scopes preserve outputs.');
