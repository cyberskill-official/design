#!/usr/bin/env node
// CSS-facing tokens.json supplies values; the existing typed inventory supplies
// semantic categories/descriptions. No new token is assigned a guessed type.
import {readFileSync,writeFileSync} from 'node:fs';
import {valueFromCss,numberFromCss,assertCssProjection} from './lib/dtcg-values.mjs';
import {validateDtcgProfile,FORMAT,COLOR} from '../_audit/lib/dtcg-profile.mjs';
const root=new URL('../',import.meta.url);
const path=new URL('tokens/tokens.dtcg.json',root),before=readFileSync(path,'utf8');
const doc=JSON.parse(before),json=JSON.parse(readFileSync(new URL('tokens/tokens.json',root),'utf8'));
const source=Object.fromEntries(Object.entries(json.root).flatMap(([g,entries])=>Object.entries(entries).map(([k,v])=>[`${g}.${k}`,v])));
const pathByName=new Map();
for(const key of Object.keys(source)){
 const name=key.slice(key.indexOf('.')+1);
 if(pathByName.has(name))throw Error(`Duplicate public token name ${name}`);
 pathByName.set(name,key);
}
const definitions=new Map();
for(const [g,entries] of Object.entries(doc))if(!g.startsWith('$'))for(const [k,def] of Object.entries(entries)){
 if(k.startsWith('$'))continue;
 if(!def||!Object.hasOwn(def,'$value'))throw Error(`Unsupported inventory entry ${g}.${k}`);
 definitions.set(`${g}.${k}`,def);
}
for(const key of new Set([...definitions.keys(),...Object.keys(source)]))if(!definitions.has(key)||source[key]===undefined)throw Error(`DTCG/JSON inventory mismatch: ${key}`);
const resolving=new Set(),done=new Set();
function convert(key){
 if(done.has(key))return;
 if(resolving.has(key))throw Error(`CSS alias cycle: ${key}`);
 resolving.add(key);
 const def=definitions.get(key),css=source[key];
 if(typeof css!=='string')throw Error(`Expected CSS string: ${key}`);
 const ext={...(def.$extensions?.['com.cyberskill']||{}),css};
 delete ext.relativeUnit;delete ext.nativeFormat;delete ext.cssScale;
 const ref=/^var\((--cs-[\w-]+)\)$/.exec(css);
 if(ref){
  const target=pathByName.get(ref[1]);if(!target)throw Error(`Missing CSS alias ${css}`);
  convert(target);def.$type=definitions.get(target).$type;def.$value=`{${target}}`;
  // Legacy native aliases stay CSS strings; density metrics resolve numerically.
  if(!key.startsWith('density.'))ext.nativeFormat='css';
 }else if(/^-?[\d.]+em$/.test(css)){
  def.$type='number';def.$value=numberFromCss(css.slice(0,-2));ext.relativeUnit='em';ext.nativeFormat='em';
 }else if(css.endsWith('%')&&def.$type==='number'){
  def.$value=numberFromCss(css.slice(0,-1))/100;ext.cssScale=100;ext.nativeFormat='css';
 }else{
  def.$value=valueFromCss(def.$type,css);
  if(def.$type==='shadow')ext.nativeFormat='css';
 }
 def.$extensions={...def.$extensions,'com.cyberskill':ext};
 resolving.delete(key);done.add(key);
}
for(const key of definitions.keys())convert(key);
doc.$description='CyberSkill design tokens targeting the DTCG 2025.10 emitted-value profile. CSS custom-property names and exact CSS expressions are preserved; scope overrides and relative em values use documented com.cyberskill extensions. General reader conformance and live design-tool imports are not implied.';
Object.assign(doc.$extensions['com.cyberskill'],{format:FORMAT,colorFormat:COLOR,source:'tokens/tokens.json',note:'CSS remains authoritative. Scope maps are CSS-valued vendor extensions; use the CyberSkill adapter. Relative em numbers retain relativeUnit; cssScale converts percentage ratios. nativeFormat preserves established native representation.'});
const report=validateDtcgProfile(doc);
if(!report.pass)throw Error(JSON.stringify(report.errors));
assertCssProjection(doc);
const output=JSON.stringify(doc,null,2)+'\n';
if(process.argv.includes('--check')){
 if(output!==before){console.error('DTCG values or extension metadata are stale; run npm run tokens:dtcg');process.exitCode=1;}
 else console.log(`PASS DTCG generation freshness: ${report.leaves} typed values and exact CSS expressions`);
}else{writeFileSync(path,output);console.log(`Generated ${report.leaves} DTCG 2025.10 values`);}
