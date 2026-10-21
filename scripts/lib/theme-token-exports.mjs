import {assertThemePaletteFreshness} from './theme-palette-projection.mjs';
import {readFileSync} from 'node:fs';
import {readContrastMaps} from './contrast-maps.mjs';
export function projectThemeTokens(root,input) {
assertThemePaletteFreshness(root);
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
const j=structuredClone(input);
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
return j;
}
