import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,copyFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
const read=p=>readFileSync(p,'utf8'),source=JSON.parse(read('scripts/template-static-logos.json')),manifest=JSON.parse(read('_ds_manifest.json'));
assert.equal(source.templates.filter(x=>x.strategy==='static-logo').length,71);assert.equal(source.templates.filter(x=>x.strategy==='components').length,14);
assert.deepEqual(source.templates.map(x=>x.path).sort(),manifest.templates.map(x=>x.entryPath).sort());
execFileSync(process.execPath,['scripts/generate-template-static-logos.mjs','--check'],{stdio:'pipe'});execFileSync(process.execPath,['scripts/sync-support-runtime.mjs','--check'],{stdio:'pipe'});
const dir=mkdtempSync(join(tmpdir(),'cs-static-logo-'));
try{
 const write=(p,s)=>{mkdirSync(dirname(join(dir,p)),{recursive:true});writeFileSync(join(dir,p),s)};
 const sample={...source,templates:[source.templates.find(x=>x.strategy==='static-logo'),source.templates.find(x=>x.strategy==='components')]};
 write('scripts/generate-template-static-logos.mjs',read('scripts/generate-template-static-logos.mjs'));write(source.asset,read(source.asset));write('scripts/template-static-logos.json',JSON.stringify(sample));write('_ds_manifest.json',JSON.stringify({templates:sample.templates.map(x=>({entryPath:x.path}))}));for(const t of sample.templates)write(t.path,read(t.path));
 const check=()=>execFileSync(process.execPath,['scripts/generate-template-static-logos.mjs','--check'],{cwd:dir,stdio:'pipe'});check();const entry=sample.templates[0],baseline=read(entry.path);
 for(const broken of [baseline.replace('alt="CyberSkill"','alt="Other"'),baseline.replace('data-cs-official-logo=""','src="https://external.invalid/mark.svg"'),baseline.replace('<meta name="cs-template-library" content="static-logo">',''),baseline.replace('</x-dc>','<x-import component-from-global-scope="CyberSkillDS.Button"></x-import></x-dc>')]){write(entry.path,broken);assert.throws(check)}write(entry.path,baseline);
 write(source.asset,read(source.asset)+'\n<!-- changed -->');assert.throws(check);write(source.asset,read(source.asset));
 write('_ds_manifest.json',JSON.stringify({templates:[...sample.templates.map(x=>({entryPath:x.path})),{entryPath:'templates/new/New.dc.html'}]}));assert.throws(check);write('_ds_manifest.json',JSON.stringify({templates:sample.templates.map(x=>({entryPath:x.path}))}));
 sample.templates[0].strategy='components';write('scripts/template-static-logos.json',JSON.stringify(sample));assert.throws(check);
}finally{rmSync(dir,{recursive:true,force:true})}
console.log('PASS official static logo: all85 strategies,71 exact native adoptions,14 retained component loaders; seven drift/asset/markup/dependency guards and all portable runtime copies.');
