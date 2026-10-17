// CSS owns density and authored dark/system theme overrides. Preserve unrelated
// export groups while deterministically rebuilding these projections.
import {readFileSync,writeFileSync} from 'node:fs';
import {readContrastMaps} from './lib/contrast-maps.mjs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const css=read('tokens/theme-attributes.css').replace(/\/\*[\s\S]*?\*\//g,'');
function scope(selector){
 const blocks=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(m=>m[1].trim()===selector);
 if(blocks.length!==1)throw new Error(`Expected exactly one density scope: ${selector}`);
 const values=Object.fromEntries([...blocks[0][2].matchAll(/(--cs-[\w-]+)\s*:\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
 if(!Object.keys(values).length)throw new Error(`Empty density scope: ${selector}`);
 for(const value of Object.values(values))if(!/^(?:-?[\d.]+px|var\(--cs-[\w-]+\))$/.test(value))throw new Error(`Unsupported density expression: ${value}`);
 return values;
}
const base=scope(':root');
const densities=Object.fromEntries(['compact','comfortable'].map(d=>[d,scope(`[data-cs-density="${d}"]`)]));
const j=JSON.parse(read('tokens/tokens.json'));
const contrasts=readContrastMaps(root);
j.contrasts=contrasts;
j.root.density=base;j.densities=densities;
const themes={dark:{},system:{}};
for(const file of ['tokens/colors.css','tokens/component-tokens.css','tokens/elevation.css']) {
 const text=read(file).replace(/\/\*[\s\S]*?\*\//g,'');
 for(const mode of ['dark','system']) {
  const selector=`[data-theme="${mode}"]`;
  const blocks=[...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(m=>m[1].trim()===selector);
  if(blocks.length!==1)throw new Error(`Expected exactly one authored ${mode} scope in ${file}`);
  const values=Object.fromEntries([...blocks[0][2].matchAll(/(--cs-[\w-]+)\s*:\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
  if(!Object.keys(values).length)throw new Error(`Empty authored ${mode} scope in ${file}`);
  for(const [key,value] of Object.entries(values)) {
   if(Object.hasOwn(themes[mode],key))throw new Error(`Duplicate authored theme token ${key}`);
   themes[mode][key]=value;
  }
 }
}
j.themes=themes;
const flat=Object.assign({},...Object.values(j.root));
function resolved(value,scope,seen=new Set()){
 const alias=/^var\((--cs-[\w-]+)\)$/.exec(value);
 if(!alias){if(!/^-?[\d.]+px$/.test(value)||!Number.isFinite(Number(value.slice(0,-2))))throw new Error(`Invalid density value: ${value}`);return;}
 const key=alias[1];
 if(seen.has(key)||scope[key]===undefined)throw new Error(`Missing/cyclic density alias: ${key}`);
 resolved(scope[key],scope,new Set([...seen,key]));
}
for(const values of [base,...Object.values(densities)])for(const value of Object.values(values))resolved(value,{...flat,...values});
const dtcg=JSON.parse(read('tokens/tokens.dtcg.json'));
const pathByName=Object.fromEntries(Object.entries(j.root).flatMap(([group,values])=>Object.keys(values).map(key=>[key,`${group}.${key}`])));
dtcg.density=Object.fromEntries(Object.entries(base).map(([key,value])=>{
 const alias=/^var\((--cs-[\w-]+)\)$/.exec(value);
 if(!alias||!pathByName[alias[1]])throw new Error(`Missing density alias target: ${value}`);
 return[key,{$type:'dimension',$value:`{${pathByName[alias[1]]}}`,$extensions:{'com.cyberskill':{css:value}}}];
}));
dtcg.$extensions['com.cyberskill'].overrides.densities=densities;
dtcg.$extensions['com.cyberskill'].overrides.themes=themes;
dtcg.$extensions['com.cyberskill'].overrides.contrasts=contrasts;
const version=read('VERSION').trim();
const stringify=v=>JSON.stringify(v,null,2)+'\n';
const outputs={
 'tokens/tokens.json':stringify(j),
 'tokens/tokens.js':`// CyberSkill design tokens — generated from tokens/*.css (v${version}). Do not edit by hand.\nexport const tokens = ${JSON.stringify(j,null,2)};\nexport default tokens;\n`,
 'tokens/tokens.dtcg.json':stringify(dtcg),
};
const stale=Object.entries(outputs).filter(([p,s])=>read(p)!==s).map(([p])=>p);
if(process.argv.includes('--check')){
 if(stale.length)throw new Error(`Theme/density exports stale: ${stale.join(', ')}; run npm run tokens:theme`);
 console.log('PASS theme/density/contrast export freshness: authored dark/system values, CSS aliases, both density scopes and both high-contrast maps match mirrors.');
}else{
 for(const [p,s] of Object.entries(outputs))writeFileSync(new URL(p,root),s);
 console.log('Generated theme/density/contrast exports: authored dark/system overrides, 7 root aliases, compact/comfortable and high-light/high-dark scopes.');
}
