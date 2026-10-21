import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,copyFileSync,cpSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {resolve,join,dirname} from 'node:path';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {projectThemePalettes,assertThemePaletteFreshness,themePalettePaths} from '../../scripts/lib/theme-palette-projection.mjs';
import {modeInputs} from '../../scripts/lib/token-modes.mjs';
const root=resolve('.'),read=p=>readFileSync(p,'utf8'),source=JSON.parse(read('tokens/theme-palette-source.json')),projection=projectThemePalettes(root),hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(Object.values(source.files).reduce((n,v)=>n+Object.keys(v).length,0),31);
for(const path of themePalettePaths){const before=read('_audit/ci/fixtures/a01-theme-mirrors/'+path.split('/').at(-1));assert.equal(read(path),before,'Adoption preserves every source byte');assert.equal(projection[path],before);}
assertThemePaletteFreshness(root);
const temp=mkdtempSync(join(tmpdir(),'cs-palette-projection-'));const cases=[];
try{
 for(const path of ['tokens','scripts','base','_audit/lib'])cpSync(path,join(temp,path),{recursive:true});mkdirSync(join(temp,'_audit/ci'),{recursive:true});copyFileSync('_audit/ci/generate-native-tokens.mjs',join(temp,'_audit/ci/generate-native-tokens.mjs'));for(const path of ['VERSION','styles.css'])copyFileSync(path,join(temp,path));symlinkSync(join(root,'node_modules'),join(temp,'node_modules'));
 const canonical=join(temp,'tokens/theme-palette-source.json'),run=(script,...args)=>spawnSync(process.execPath,[script,...args],{cwd:temp,encoding:'utf8'}),save=data=>writeFileSync(canonical,JSON.stringify(data,null,2)+'\n');
 const regenerate=()=>{for(const script of ['scripts/generate-element-packs.mjs','scripts/generate-theme-exports.mjs','_audit/ci/generate-native-tokens.mjs']){const result=run(script);assert.equal(result.status,0,result.stderr);}};
 regenerate();
 const beforeHash=modeInputs(temp).sourceHash,changed=structuredClone(source);changed.files['tokens/component-tokens.css']['--cs-component-textfield-border-default']='#123456';save(changed);
 assert.throws(()=>assertThemePaletteFreshness(temp),/Stale theme palette/);assert.throws(()=>modeInputs(temp),/Stale theme palette/);
 let result=run('scripts/generate-theme-palettes.mjs','--check');assert.notEqual(result.status,0);result=run('scripts/generate-theme-palettes.mjs');assert.equal(result.status,0,result.stderr);assertThemePaletteFreshness(temp);assert.notEqual(modeInputs(temp).sourceHash,beforeHash,'Canonical source and mirrored-value drift invalidate provenance');
 const expected=read('tokens/component-tokens.css').replaceAll('#5a4636','#123456');assert.equal(read(join(temp,'tokens/component-tokens.css')),expected,'Only exact two value spans change');assert.equal(run('scripts/generate-theme-palettes.mjs','--check').status,0);
 regenerate();const mirrored=JSON.parse(read(join(temp,'tokens/tokens.json')));for(const mode of ['dark','system'])assert.equal(mirrored.themes[mode]['--cs-component-textfield-border-default'],'#123456');assert.match(read(join(temp,'tokens/elements.css')),/--_cs-dark-component-textfield-border-default: #123456;/);
 for(const [p,expected]of [['CSTokens.swift','let componentTextfieldBorderDefaultDark = color(0x123456)'],['CSTokens.kt','val componentTextfieldBorderDefaultDark = Color(0xFF123456)'],['cs_tokens.dart','const Color componentTextfieldBorderDefaultDark = Color(0xFF123456);']])assert(read(join(temp,'tokens/native',p)).includes(expected),'Canonical change reaches actual native dark constant '+p);

 save(source);assert.equal(run('scripts/generate-theme-palettes.mjs').status,0);regenerate();assert.equal(modeInputs(temp).sourceHash,beforeHash,'Deterministic source restoration');
 for(const [name,mutate]of [
  ['missing member',d=>delete d.files['tokens/colors.css']['--cs-color-text-muted']],
  ['unknown member',d=>d.files['tokens/colors.css']['--cs-extra']='#123456'],
  ['order drift',d=>{const f=d.files['tokens/colors.css'],value=f['color-scheme'];delete f['color-scheme'];f['color-scheme']=value;}],
  ['unknown path',d=>d.files['elsewhere.css']={}],
  ['traversal path',d=>{d.files['../outside.css']=d.files['tokens/colors.css'];delete d.files['tokens/colors.css'];}],
  ['absolute path',d=>{d.files['/outside.css']=d.files['tokens/colors.css'];delete d.files['tokens/colors.css'];}],
  ['invalid shadow',d=>d.files['tokens/elevation.css']['--cs-shadow-xl']='not-a-shadow'],
  ['injected CSS',d=>d.files['tokens/colors.css']['--cs-color-link']='#123456;display:none'],
  ['invalid color-scheme',d=>d.files['tokens/colors.css']['color-scheme']='light'],
 ]){const bad=structuredClone(source);mutate(bad);save(bad);const before=Object.fromEntries(themePalettePaths.map(p=>[p,read(join(temp,p))]));result=run('scripts/generate-theme-palettes.mjs');assert.notEqual(result.status,0,name);for(const p of themePalettePaths)assert.equal(read(join(temp,p)),before[p],name+' fail-before-write '+p);cases.push(name);}
 save(source);
 const path='tokens/colors.css',text=read(join(temp,path));writeFileSync(join(temp,path),text+'\n[data-theme="dark"] { --cs-extra: #123456; }\n');assert.throws(()=>projectThemePalettes(temp),/Ambiguous/);writeFileSync(join(temp,path),text);cases.push('duplicate mirror');
 writeFileSync(join(temp,path),text.replace('[data-theme="system"] {','[data-theme="unknown"] {'));assert.throws(()=>projectThemePalettes(temp),/Ambiguous/);writeFileSync(join(temp,path),text);cases.push('missing mirror');
 writeFileSync(join(temp,path),text.replace('--cs-color-link: #FECD5D;','--cs-color-link: #123456;'));assert.throws(()=>assertThemePaletteFreshness(temp),/Stale/);writeFileSync(join(temp,path),text);cases.push('mirror value drift');
 const outside=join(temp,'outside.css');writeFileSync(outside,text);rmSync(join(temp,path));symlinkSync(outside,join(temp,path));assert.throws(()=>projectThemePalettes(temp),/symlink/);rmSync(join(temp,path));writeFileSync(join(temp,path),text);cases.push('target symlink');
 const outsideJson=join(temp,'outside.json');writeFileSync(outsideJson,JSON.stringify(source));rmSync(canonical);symlinkSync(outsideJson,canonical);assert.throws(()=>projectThemePalettes(temp),/symlink/);rmSync(canonical);save(source);cases.push('canonical symlink');
 mkdirSync('test-results/theme-palette-projection',{recursive:true});writeFileSync('test-results/theme-palette-projection/final.json',JSON.stringify({pass:true,node:process.version,authoredDeclarations:31,customProperties:30,mirroredDeclarations:62,adoptionByteIdentical:true,sourceHashes:Object.fromEntries(['tokens/theme-palette-source.json',...themePalettePaths,'scripts/lib/theme-palette-projection.mjs','scripts/generate-theme-palettes.mjs'].map(p=>[p,hash(read(p))])),negativeCases:cases,canonicalMutation:'One border source changes exactly two CSS value spans and invalidates mode source identity; restoring source restores exact hash. Real element/theme/native producers propagate the change to resolver channels, both JSON scopes and all three native dark constants.',scope:'Source ownership/projection proof; no new palette or visual design values'},null,2)+'\n');
 console.log('PASS31 canonical palette declarations/62mirror declarations: adoption byte identity, canonical value propagation, exact membership/order,14negative controls, failure preserves all files and source-bound mode provenance');
}finally{rmSync(temp,{recursive:true,force:true});}
