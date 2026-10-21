import {readFileSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import postcss from 'postcss';
import {chromium} from 'playwright';
import {createRequire} from 'node:module';
import {collectTokenDeclarations} from './token-declarations.mjs';
import {baseExportExclusions} from './base-token-exports.mjs';
import {valueFromCss,numberFromCss,assertCssProjection} from './dtcg-values.mjs';
import {assertThemePaletteFreshness} from './theme-palette-projection.mjs';
import {rgb2oklab,hex2rgb} from './oklch.mjs';
import {validateDtcgProfile,FORMAT} from '../../_audit/lib/dtcg-profile.mjs';
const require=createRequire(import.meta.url);
const sha=text=>createHash('sha256').update(text).digest('hex');
const normalized=n=>{if(!Number.isFinite(n))throw Error('Nonfinite mode value');return Number(n.toFixed(6))};

/** Preserve standard concrete sRGB or OKLAB values, including out-of-sRGB
 * surface mixes. Six decimal components bound capture precision explicitly. */
export function modeColor(css) {
  const match=/^oklab\(\s*([\d.e+-]+)(%)?\s+([\d.e+-]+)\s+([\d.e+-]+)(?:\s*\/\s*([\d.e+-]+))?\s*\)$/.exec(css);
  const value=match?{colorSpace:'oklab',components:[Number(match[1])/(match[2]?100:1),Number(match[3]),Number(match[4])],alpha:match[5]===undefined?1:Number(match[5])}:valueFromCss('color',css);
  return {...value,components:value.components.map(normalized),alpha:normalized(value.alpha)};
}
/** Canonical source evaluation for the exact opaque-hex OKLAB mix grammar
 * authored today. Browser resolution still selects the actual cascade/var()
 * expression; CSSOM color serialization never supplies interpolation numbers.
 * Percentages must total100%; unimplemented alpha-normalization is rejected. */
export function sourceModeColor(css) {
  if(!css.startsWith('color-mix('))return modeColor(css);
  const match=/^color-mix\(in oklab,\s*(#[0-9a-f]{6})(?:\s+([+\-\d.]+)%)?,\s*(#[0-9a-f]{6})(?:\s+([+\-\d.]+)%)?\s*\)$/i.exec(css);
  if(!match)throw Error('Unsupported mode color-mix grammar: '+css);
  let first=match[2]===undefined?undefined:numberFromCss(match[2]),second=match[4]===undefined?undefined:numberFromCss(match[4]);
  if(first===undefined&&second===undefined){first=50;second=50;}
  else if(first===undefined)first=100-second;
  else if(second===undefined)second=100-first;
  if(first<0||second<0||first>100||second>100||Math.abs(first+second-100)>1e-10)throw Error('Unsupported mode mix percentages; require100% total: '+css);
  const a=rgb2oklab(hex2rgb(match[1])),b=rgb2oklab(hex2rgb(match[3]));
  const components=a.map((n,i)=>normalized((n*first+b[i]*second)/100));
  return {colorSpace:'oklab',components,alpha:1};
}
export function modeList(seeds) {
  const elements=[{element:null,variant:null},...Object.entries(seeds.elements).flatMap(([element,def])=>['soft','middle','deep'].map(level=>({element,variant:level==='middle'?null:def[level]})))];
  if(elements.length!==16||elements.some(e=>e.variant===undefined))throw Error('Unexpected authored element/variant inventory');
  return ['light','dark','system-light','system-dark'].flatMap(theme=>elements.flatMap(element=>['comfortable','compact'].flatMap(density=>['standard','high'].map(contrast=>{
    const mode={theme:theme.startsWith('system')?'system':theme,colorScheme:theme.endsWith('dark')?'dark':'light',...element,density,contrast,style:'liquid-glass'};
    return {id:`${theme}__${element.element||'default'}${element.variant?'-'+element.variant:''}__${density}__${contrast}`,mode};
  }))));
}
export function modeInputs(root) {
  assertThemePaletteFreshness(root);
  const graph=collectTokenDeclarations(root),inventory=JSON.parse(readFileSync(resolve(root,'tokens/base-inventory.json'),'utf8'));
  const metadata=JSON.parse(readFileSync(resolve(root,'tokens/element-seeds.json'),'utf8'));
  const known=new Set([...Object.values(inventory.groups).flatMap(g=>Object.keys(g)),...Object.keys(baseExportExclusions)]);
  for(const d of graph.declarations)if(d.sourcePath.startsWith('tokens/')&&d.visibility==='public'&&!known.has(d.name))throw Error('Unclassified mode token: '+d.name);
  const included=new Set();
  function flatten(path){
    included.add(path);const ast=postcss.parse(readFileSync(resolve(root,path),'utf8'));
    ast.walkAtRules('import',rule=>{const m=/^(?:url\(\s*(['"])([^'"]+)\1\s*\)|(['"])([^'"]+)\3)$/.exec(rule.params);if(!m)throw Error('Unsupported import: '+rule.params);const target=relative(root,resolve(root,dirname(path),m[2]||m[4]));rule.replaceWith(postcss.parse(flatten(target)).nodes)});
    // Font resources are irrelevant to custom-property values and are never fetched.
    ast.walkAtRules('font-face',rule=>rule.remove());return ast.toString();
  }
  const css=flatten('styles.css');
  const helperPaths=['tokens/theme-palette-source.json','scripts/lib/theme-palette-projection.mjs','scripts/generate-theme-palettes.mjs','tokens/base-inventory.json','tokens/element-seeds.json','scripts/generate-token-modes.mjs','scripts/lib/mode-capture-origin.mjs','scripts/lib/token-modes.mjs','scripts/lib/dtcg-values.mjs','scripts/lib/token-declarations.mjs','scripts/lib/base-token-exports.mjs','scripts/lib/oklch.mjs','_audit/lib/dtcg-profile.mjs','_audit/lib/apca.mjs'];
  const sources=Object.fromEntries([...new Set([...included,...helperPaths])].sort().map(path=>[path,sha(readFileSync(resolve(root,path),'utf8'))]));
  return {inventory,css,modes:modeList(metadata),sources,sourceHash:sha(JSON.stringify(sources)),names:[...known]};
}
export function tokenModeLaunchOptions(browserType,platform=process.platform) {
  return platform==='linux'&&browserType.name()==='chromium'?{args:['--disable-dev-shm-usage']}:{};
}
export async function captureTokenModes(inputs,{browserType=chromium,implicit=false}={}) {
  const browser=await browserType.launch(tokenModeLaunchOptions(browserType));
  try {
    const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'no-preference',forcedColors:'none'});
    const page=await context.newPage();await page.route('**/*',route=>route.abort());
    await page.setContent('<!doctype html><html lang="en"><head></head><body><span id="mode-color-probe"></span></body></html>');
    let stylesheet,lastEnvironment;const values=[];
    const orderedModes=implicit?[...inputs.modes].sort((a,b)=>(a.mode.colorScheme+a.mode.contrast).localeCompare(b.mode.colorScheme+b.mode.contrast)):inputs.modes;
    for(const item of orderedModes){
      await page.emulateMedia({colorScheme:item.mode.colorScheme,contrast:implicit&&item.mode.contrast==='high'?'more':'no-preference'});
      const environment=item.mode.colorScheme+':'+(implicit?item.mode.contrast:'no-preference');
      if(environment!==lastEnvironment){
        // Firefox's emulation updates matchMedia without invalidating existing
        // prefers-contrast rules. Load the identical CSS into the settled media
        // environment; do not replace/force any authored condition.
        if(stylesheet)await stylesheet.evaluate(node=>node.remove());
        stylesheet=await page.addStyleTag({content:inputs.css});lastEnvironment=environment;
      }
      const captured=await page.evaluate(async ({mode,names,implicit})=>{
        const root=document.documentElement;root.setAttribute('data-theme',mode.theme);
        for(const [attribute,value]of [['data-cs-element',mode.element],['data-cs-variant',mode.variant],['data-cs-density',mode.density],['data-cs-contrast',implicit?null:mode.contrast]])if(value===null)root.removeAttribute(attribute);else root.setAttribute(attribute,value);
        // Firefox may apply emulated media invalidation at the next rendering
        // opportunity. Capture settled CSS, not protocol scheduling races.
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        const computed=getComputedStyle(root),probe=document.getElementById('mode-color-probe');
        const raw=Object.fromEntries(names.map(name=>[name,computed.getPropertyValue(name).trim()]));const colors={};
        for(const [name,value]of Object.entries(raw))if(value&&(value.startsWith('#')||/^(?:rgba?|color(?:-mix)?|oklab)\(/.test(value))){
          probe.style.color='';probe.style.color=value;if(!probe.style.color)throw Error('Invalid mode color: '+name+' '+value);colors[name]=getComputedStyle(probe).color;
        }
        return {raw,colors};
      },{mode:item.mode,names:inputs.names,implicit});
      values.push({...item,...captured});
    }
    values.sort((a,b)=>inputs.modes.findIndex(m=>m.id===a.id)-inputs.modes.findIndex(m=>m.id===b.id));
    return {engine:browser.browserType().name(),version:browser.version(),playwright:require('playwright/package.json').version,chromiumRevision:JSON.parse(readFileSync(resolve(dirname(require.resolve('playwright-core')),'browsers.json'),'utf8')).browsers.find(x=>x.name==='chromium').revision,platform:process.platform+'-'+process.arch,values};
  } finally {await browser.close()}
}
export function projectTokenMode(inputs,captured) {
  const doc={$description:'Standalone resolved CyberSkill token values and intra-document aliases for one explicit mode. Select this document using the versioned companion index; this document defines no DTCG mode extension.',
    $extensions:{'com.cyberskill':{format:FORMAT,sourceHash:inputs.sourceHash,modeId:captured.id}}};
  const omissions=Object.entries(baseExportExclusions).map(([name,reason])=>({name,reason,resolvedCss:captured.raw[name]??null}));
  for(const [group,entries]of Object.entries(inputs.inventory.groups)){
    doc[group]={};
    for(const [name,metadata]of Object.entries(entries)){
      const raw=captured.raw[name];if(!raw)throw Error('Missing resolved token '+captured.id+' '+name);
      if(/^[+-]?[\d.]+em$/.test(raw)){omissions.push({name,reason:'Relative em depends on the consuming font size; DTCG dimension permits px/rem only. No contextual font size is guessed.',resolvedCss:raw});continue;}
      const alias=metadata.$extensions?.['com.cyberskill']?.nativeAliasOf;
      if(alias){
        const target=Object.entries(inputs.inventory.groups).find(([,entries])=>entries[alias]);
        if(!target||target[1][alias].$type!==metadata.$type||captured.raw[alias]!==raw)throw Error('Mode alias value/type drift: '+captured.id+' '+name);
        doc[group][name]={...structuredClone(metadata),$value:`{${target[0]}.${alias}}`,$extensions:{'com.cyberskill':{...metadata.$extensions['com.cyberskill'],css:`var(${alias})`,resolvedSourceCss:raw}}};
        continue;
      }
      let value,css=raw;
      if(metadata.$type==='color'){
        value=sourceModeColor(raw);css=value.colorSpace==='oklab'?`oklab(${value.components.join(' ')} / ${value.alpha})`:`color(srgb ${value.components.join(' ')} / ${value.alpha})`;
      }else if(metadata.$type==='number'&&raw.endsWith('%')){value=Number(raw.slice(0,-1))/100;if(!Number.isFinite(value))throw Error('Invalid percentage '+raw);css=String(value);}
      else value=valueFromCss(metadata.$type,raw);
      doc[group][name]={...structuredClone(metadata),$value:value,$extensions:{'com.cyberskill':{css,...(raw===css?{}:{resolvedSourceCss:raw}),...(metadata.$type==='shadow'?{nativeFormat:'css'}:{})}}};
    }
    if(!Object.keys(doc[group]).length)delete doc[group];
  }
  const validation=validateDtcgProfile(doc,{colorSpaces:['srgb','oklab']});if(!validation.pass)throw Error('Invalid portable mode: '+JSON.stringify(validation.errors));assertCssProjection(doc);
  return {doc,omissions,tokenCount:validation.leaves};
}
export function projectModeBundle(inputs,capture) {
  const files={},modes=[];
  for(const captured of capture.values){const {doc,omissions,tokenCount}=projectTokenMode(inputs,captured),path=captured.id+'.dtcg.json',text=JSON.stringify(doc)+'\n';files[path]=text;modes.push({id:captured.id,axes:captured.mode,file:path,sha256:sha(text),tokenCount,omissions});}
  const {values,...renderer}=capture;
  const index={schemaVersion:1,format:'https://www.designtokens.org/tr/2025.10/format/',interpretation:'Each referenced file is an independent typed DTCG document. This versioned manifest is a CyberSkill selection/provenance contract, not a DTCG modes extension. It covers one co-located root scope; arbitrary nested scopes, component states, platform font metrics and CSS material composition remain canonical CSS.',sourceHash:inputs.sourceHash,sources:inputs.sources,renderer,
    inventory:{authoredPortableRootTokens:Object.values(inputs.inventory.groups).reduce((n,g)=>n+Object.keys(g).length,0),typedPerMode:[...new Set(modes.map(m=>m.tokenCount))],omittedRelativeEmPerMode:[...new Set(modes.map(m=>m.omissions.length-Object.keys(baseExportExclusions).length))],additionalUntypedRootDeclarations:Object.keys(baseExportExclusions).length,totalClassifiedRootDeclarations:inputs.names.length,note:'Authored portable members include font-relative em values omitted here. Separately classified CSS expressions/identifiers were never portable-root members; every omission is listed for each mode.'},
    normalization:{resolvedSourceCss:'When this leaf extension is omitted, the exact resolved source CSS equals its css extension; differing source expressions remain explicit.',aliasValues:'Additive kebab aliases reference the existing typed legacy leaf inside the same standalone document; resolved equality is checked during capture.',colorSpaces:['srgb','oklab'],fractionalChannelDecimals:6,gamutMapping:'none; OKLAB preserves authored out-of-sRGB mixes',mixEvaluation:'Canonical pure rgb2oklab interpolation of resolved opaque-hex color-mix expressions; CSSOM interpolation numbers are not export inputs',maximumComponentQuantizationError:0.0000005,rem:'preserved without assuming a root pixel size',relativeEm:'omitted per token; never converted using a guessed font size',percentageNumber:'dimensionless ratio'},
    environment:{systemTheme:'Separate light and dark operating-system branches are captured; never resolve system to a constant.',implicitContrast:'No data-cs-contrast: no-preference selects standard, more selects high. Explicit attributes override OS preference.',density:'Absent density equals comfortable at root.',style:'Only liquid-glass exists; absent and explicit liquid-glass are equivalent.'},modes};
  return {files,index};
}
