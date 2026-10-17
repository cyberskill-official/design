import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,mkdir,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {validateDtcgProfile} from '../lib/dtcg-profile.mjs';
import {assertCssProjection} from '../../scripts/lib/dtcg-values.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const source=new URL('../../',import.meta.url);
const text=await readFile(new URL('tokens/tokens.dtcg.json',source),'utf8'),doc=JSON.parse(text);
assert.equal(validateDtcgProfile(doc).pass,true);
assert.equal(assertCssProjection(doc),175);
for (const role of ['success','danger','warning','info']) { const def=doc.color[`--cs-color-semantic-${role}-text`]; assert.equal(def.$type,'color'); assert.equal(def.$value.colorSpace,'srgb'); assert.equal(def.$extensions['com.cyberskill'].css,JSON.parse(await readFile(new URL('../../tokens/tokens.json',import.meta.url),'utf8')).root.color[`--cs-color-semantic-${role}-text`]); }
for(const mutate of [d=>d.color['--cs-color-brand-umber'].$value.components[0]=1,d=>d.letter['--cs-letter-spacing-tight'].$extensions['com.cyberskill'].relativeUnit='rem',d=>d.shadow['--cs-shadow-xs'].$value.offsetY.value=999]){
 const d=structuredClone(doc);mutate(d);assert.throws(()=>assertCssProjection(d),/mismatch/);
}
await withBrowserFixture(async page=>{
 const failures=await page.evaluate(doc=>{
  const definitions=Object.entries(doc).filter(([g])=>!g.startsWith('$')).flatMap(([group,entries])=>Object.entries(entries).filter(([name])=>!name.startsWith('$')).map(([name,def])=>({group,name,def})));
  const typed=document.createElement('div');document.body.append(typed);
  function literal(type,value){
   if(typeof value==='string'&&/^\{[^{}]+\}$/.test(value))return `var(${value.slice(1,-1).split('.').slice(1).join('.')})`;
   if(type==='color')return `rgba(${value.components.map(c=>c*255).join(', ')}, ${value.alpha??1})`;
   if(type==='dimension'||type==='duration')return value.value+value.unit;
   if(type==='number')return String(value);
   if(type==='cubicBezier')return `cubic-bezier(${value.join(', ')})`;
   if(type==='fontFamily')return value.map(f=>/\s/.test(f)?JSON.stringify(f):f).join(', ');
   if(type==='shadow')return (Array.isArray(value)?value:[value]).map(l=>`${l.inset?'inset ':''}${['offsetX','offsetY','blur','spread'].map(k=>literal('dimension',l[k])).join(' ')} ${literal('color',l.color)}`).join(', ');
   throw Error(type);
  }
  for(const {name,def} of definitions){
   const ext=def.$extensions['com.cyberskill'];let css=literal(def.$type,def.$value);
   if(typeof def.$value==='number'&&ext.relativeUnit)css+=ext.relativeUnit;
   if(ext.cssScale)css=(def.$value*ext.cssScale)+'%';
   typed.style.setProperty(name,css);
  }
  const rawProbe=document.createElement('div'),typedProbe=document.createElement('div');
  document.body.append(rawProbe);typed.append(typedProbe);
  const properties={color:'color',dimension:'margin-left',duration:'transition-duration',cubicBezier:'transition-timing-function',fontFamily:'font-family',shadow:'box-shadow'};
  const failures=[];
  for(const {name,def} of definitions){
   const property=properties[def.$type]||(def.$extensions['com.cyberskill'].relativeUnit?'letter-spacing':null);
   let actual,wanted;
   if(property){
    rawProbe.style.cssText='';typedProbe.style.cssText='';
    rawProbe.style.setProperty(property,`var(${name})`);typedProbe.style.setProperty(property,`var(${name})`);
    actual=getComputedStyle(typedProbe).getPropertyValue(property);wanted=getComputedStyle(rawProbe).getPropertyValue(property);
   }else{
    actual=getComputedStyle(typed).getPropertyValue(name).trim();wanted=getComputedStyle(rawProbe).getPropertyValue(name).trim();
   }
   const numericEquivalent=!property&&actual.endsWith('%')===wanted.endsWith('%')&&Math.abs(Number.parseFloat(actual)-Number.parseFloat(wanted))<1e-10;
   if(actual!==wanted&&!numericEquivalent)failures.push({name,actual,wanted});
  }
  typed.remove();rawProbe.remove();return failures;
 },doc);
 assert.deepEqual(failures,[],'Every typed value/alias must produce the same browser value as canonical CSS');
 const origin=new URL(page.url()).origin;
 for(const [path,key] of [['dtcg-typing','__dtcgtyping'],['token-format-parity','__tokenformat'],['token-pipeline-test','__tokenpipe']]){
  await page.goto(`${origin}/_audit/${path}.html`);await page.waitForFunction(k=>window[k],key);
  const verdict=await page.evaluate(k=>window[k],key);assert.equal(verdict.pass,true,JSON.stringify(verdict));
 }
});
const dependencies=['scripts/generate-dtcg.mjs','scripts/lib/dtcg-values.mjs','_audit/lib/dtcg-profile.mjs','tokens/tokens.json','tokens/tokens.dtcg.json'];
for(const [name,mutate] of [
 ['valid',()=>{}],
 ['invalid color',j=>j.root.color['--cs-color-brand-umber']='garbage'],
 ['invalid duration',j=>j.root.duration['--cs-duration-fast']='12hours'],
 ['dangling alias',j=>j.root.density['--cs-density-space-1']='var(--cs-missing)'],
 ['cyclic alias',j=>j.root.density['--cs-density-space-1']='var(--cs-density-space-1)'],
 ['unknown token',j=>j.root.color['--cs-unregistered']='#000000'],
 ['shadow syntax',j=>j.root.shadow['--cs-shadow-xs']='nonsense'],
]){
 const dir=await mkdtemp(join(tmpdir(),'cs-dtcg-roundtrip-'));
 try{
  for(const path of dependencies){await mkdir(dirname(join(dir,path)),{recursive:true});await copyFile(new URL(path,source),join(dir,path));}
  const jsonPath=join(dir,'tokens/tokens.json'),j=JSON.parse(await readFile(jsonPath,'utf8'));mutate(j);await writeFile(jsonPath,JSON.stringify(j));
  const run=spawnSync(process.execPath,['scripts/generate-dtcg.mjs'],{cwd:dir,encoding:'utf8'});
  assert.equal(run.status===0,name==='valid',name+': '+run.stderr);
  assert.equal(await readFile(join(dir,'tokens/tokens.dtcg.json'),'utf8'),text,'Determinism or failed-write preservation: '+name);
 }finally{await rm(dir,{recursive:true,force:true});}
}
console.log('PASS DTCG roundtrip: 175 canonical CSS values/aliases; typed values and extensions agree; real format/native/profile gates pass; invalid generation preserves output.');
