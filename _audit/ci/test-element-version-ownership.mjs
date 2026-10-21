import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,cpSync,copyFileSync,symlinkSync,mkdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';import {spawnSync} from 'node:child_process';
const root=resolve('.'),temp=mkdtempSync(join(tmpdir(),'cs-element-version-'));
try{
 for(const p of ['scripts','tokens','base','_audit/lib'])cpSync(p,join(temp,p),{recursive:true});for(const p of ['styles.css','VERSION'])copyFileSync(p,join(temp,p));symlinkSync(join(root,'node_modules'),join(temp,'node_modules'));
 const read=p=>readFileSync(join(temp,p),'utf8'),json=p=>JSON.parse(read(p));const run=(...args)=>spawnSync(process.execPath,['scripts/generate-element-packs.mjs',...args],{cwd:temp,encoding:'utf8'});
 const original=json('tokens/element-seeds.json');original.$meta.version='0.0.0';writeFileSync(join(temp,'tokens/element-seeds.json'),JSON.stringify(original,null,2)+'\n');
 let result=run();assert.equal(result.status,0,result.stderr);assert.equal(json('tokens/element-seeds.json').$meta.version,read('VERSION').trim());const css=read('tokens/elements.css');
 const old=readFileSync('_audit/ci/fixtures/a01-elements-before.css','utf8'),expected=old.slice(0,old.indexOf('/* ---- Element reach beyond accent ---- */'))+old.slice(old.indexOf('/* ---- Aurora washes ---- */'),old.indexOf('/* ---- APCA-derived DARK elemental packs'))+old.slice(old.indexOf('/* ---- Generated scope resolver ----'));assert.equal(css,expected,'Generator emits exactly the measured legacy-rule projection');
 writeFileSync(join(temp,'VERSION'),'9.8.7\n');result=run('--check');assert.notEqual(result.status,0);assert.match(result.stderr,/element-seeds.json/);
 result=run();assert.equal(result.status,0,result.stderr);assert.equal(read('tokens/elements.css'),css,'Release stamp cannot change palette/selector values');assert.equal(json('tokens/element-seeds.json').$meta.version,'9.8.7');assert.equal(json('tokens/tokens.json').$meta.version,'9.8.7');assert.equal(json('tokens/tokens.dtcg.json').$extensions['com.cyberskill'].version,'9.8.7');assert.match(read('tokens/tokens.js'),/v9\.8\.7/);
 const projected=json('tokens/element-seeds.json');delete projected.$meta.version;delete original.$meta.version;assert.deepEqual(projected,original,'All authored seed data and other metadata remain unchanged');assert.equal(run('--check').status,0);
 console.log('PASS VERSION alone owns existing seed/export version fields; stale authored version and changed VERSION detected; exact legacy projection and all other seeds/palette CSS preserved');
}finally{rmSync(temp,{recursive:true,force:true});}
