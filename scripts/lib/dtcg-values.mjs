// Pure CSS <-> DTCG 2025.10 conversions for CyberSkill's emitted profile.
// Unknown syntax fails; callers must never infer support from a string fallback.
const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
export function numberFromCss(css) {
  if (!numeric.test(css) || !Number.isFinite(Number(css))) throw Error(`Unsupported CSS number: ${css}`);
  return Number(css);
}
export function colorFromCss(css) {
  let m = /^#([0-9a-f]{6})$/i.exec(css), channels, alpha=1;
  if (m) channels=[0,2,4].map(i=>parseInt(m[1].slice(i,i+2),16));
  else {
    m=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(css);
    if (!m) throw Error(`Unsupported CSS color: ${css}`);
    channels=m.slice(1,4).map(Number);alpha=m[4]===undefined?1:numberFromCss(m[4]);
  }
  if(channels.some(c=>c<0||c>255)||alpha<0||alpha>1)throw Error(`Out of range CSS color: ${css}`);
  return {colorSpace:'srgb',components:channels.map(c=>c/255),alpha};
}
export function dimensionFromCss(css,units=['px','rem']) {
  const m=/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([a-z]+)$/.exec(css);
  if(!m||!units.includes(m[2]))throw Error(`Unsupported CSS dimension/duration: ${css}`);
  return {value:numberFromCss(m[1]),unit:m[2]};
}
export function splitCssList(css) {
  const result=[];let start=0,depth=0,quote=null;
  for(let i=0;i<css.length;i++){
    const c=css[i];
    if(c==='\\'){i++;continue;}
    if(quote){if(c===quote)quote=null;continue;}
    if(c==='"'||c==="'")quote=c;
    else if(c==='(')depth++;
    else if(c===')')depth--;
    else if(c===','&&depth===0){result.push(css.slice(start,i).trim());start=i+1;}
    if(depth<0)throw Error(`Unbalanced CSS list: ${css}`);
  }
  if(quote||depth)throw Error(`Unbalanced CSS list: ${css}`);
  result.push(css.slice(start).trim());return result;
}
export function valueFromCss(type,css) {
  switch(type){
    case 'color':return colorFromCss(css);
    case 'dimension':return dimensionFromCss(css);
    case 'duration':return dimensionFromCss(css,['ms','s']);
    case 'number':return numberFromCss(css);
    case 'fontFamily':return splitCssList(css).map(s=>s.replace(/^(['"])(.*)\1$/,'$2'));
    case 'cubicBezier':{
      const m=/^cubic-bezier\((.*)\)$/.exec(css);if(!m)throw Error(`Unsupported CSS easing: ${css}`);
      return splitCssList(m[1]).map(numberFromCss);
    }
    case 'shadow':{
      const layers=splitCssList(css).map(layer=>{
        const m=/^(.*?)\s+(rgba?\([^)]*\)|#[0-9a-f]{6})$/i.exec(layer);
        if(!m)throw Error(`Unsupported CSS shadow: ${layer}`);
        let parts=m[1].trim().split(/\s+/),inset=false;
        if(parts[0]==='inset'){inset=true;parts=parts.slice(1);}
        if(parts.length<2||parts.length>4)throw Error(`Unsupported CSS shadow offsets: ${layer}`);
        const dimensions=parts.map(p=>dimensionFromCss(p==='0'?'0px':p));
        const result={color:colorFromCss(m[2]),offsetX:dimensions[0],offsetY:dimensions[1],blur:dimensions[2]||{value:0,unit:'px'},spread:dimensions[3]||{value:0,unit:'px'}};
        if(inset)result.inset=true;return result;
      });return layers.length===1?layers[0]:layers;
    }
    default:throw Error(`Unsupported token type: ${type}`);
  }
}
export function srgbToRgba(value) {
  if(!value||value.colorSpace!=='srgb'||!Array.isArray(value.components)||value.components.length!==3||value.components.some(c=>typeof c!=='number'||!Number.isFinite(c)||c<0||c>1))throw Error('Expected concrete numeric sRGB components');
  const alpha=value.alpha??1;
  if(typeof alpha!=='number'||!Number.isFinite(alpha)||alpha<0||alpha>1)throw Error('Invalid sRGB alpha');
  const [r,g,b]=value.components;return {r,g,b,a:alpha};
}

/** Check exact CSS metadata against typed values; raw metadata cannot mask drift. */
export function assertCssProjection(doc) {
  const tokens=new Map();
  for(const [group,entries] of Object.entries(doc))if(!group.startsWith('$'))for(const [name,def] of Object.entries(entries)){
    if(name.startsWith('$'))continue;
    if(!def||!Object.hasOwn(def,'$value'))throw Error(`Unsupported emitted token inventory ${group}.${name}`);
    if(tokens.has(name))throw Error(`Duplicate CSS token ${name}`);
    tokens.set(name,{path:`${group}.${name}`,group,def});
  }
  const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
  for(const [name,{path,group,def}] of tokens){
    const ext=def.$extensions?.['com.cyberskill'],css=ext?.css;
    if(typeof css!=='string')throw Error(`Missing CSS projection: ${path}`);
    let expected,nativeFormat,relativeUnit,cssScale;
    const ref=/^var\((--cs-[\w-]+)\)$/.exec(css);
    if(ref){
      const target=tokens.get(ref[1]);if(!target||target.def.$type!==def.$type)throw Error(`Invalid CSS alias: ${path}`);
      expected=`{${target.path}}`;if(group!=='density')nativeFormat='css';
    }else if(/^-?[\d.]+em$/.test(css)){
      if(def.$type!=='number')throw Error(`Relative em must use number with extension: ${path}`);
      expected=numberFromCss(css.slice(0,-2));nativeFormat='em';relativeUnit='em';
    }else if(css.endsWith('%')&&def.$type==='number'){
      expected=numberFromCss(css.slice(0,-1))/100;nativeFormat='css';cssScale=100;
    }else{
      expected=valueFromCss(def.$type,css);if(def.$type==='shadow')nativeFormat='css';
    }
    if(canonical(expected)!==canonical(def.$value)||ext.nativeFormat!==nativeFormat||ext.relativeUnit!==relativeUnit||ext.cssScale!==cssScale)throw Error(`Typed value/CSS metadata mismatch: ${path}`);
  }
  return tokens.size;
}
