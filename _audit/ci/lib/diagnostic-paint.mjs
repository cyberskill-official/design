/** Bounded computed-color model: legacyRGB and in-range normalizedsRGB, solid ancestor backgrounds, alpha and ancestor opacity. Unsupported formats, images, blend modes and filters fail closed. Does not model arbitrary overlap, backdrop, text shadows, gradients, widegamut or physical displays. */
export function diagnosticPaint(elements){
 const rgb=value=>{
  const numeric=value.replace(/^(?:rgba?\(|color\(srgb\s)/,'').slice(0,-1);
  if(/[^\d.,+\-eE\s/]/.test(numeric))throw Error('Unsupported diagnostic color syntax: '+value);
  const values=value.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi)?.map(Number);
  const srgb=/^color\(srgb\s/.test(value),legacy=/^rgba?\(/.test(value);
  if(!legacy&&!srgb)throw Error('Unsupported diagnostic color: '+value);
  if(!values||![3,4].includes(values.length)||values.some(n=>!Number.isFinite(n)))throw Error('Invalid diagnostic color: '+value);
  if(values.slice(0,3).some(n=>n<0||n>(srgb?1:255))||values.length===4&&(values[3]<0||values[3]>1))throw Error('Unsupported diagnostic color range: '+value);
  return values.map((n,i)=>i<3&&srgb?n*255:n);
 };
 const over=(fg,bg)=>fg.slice(0,3).map((c,i)=>c*(fg[3]??1)+bg[i]*(1-(fg[3]??1)));
 return elements.filter(el=>el.getClientRects().length&&el.textContent.trim()&&![...el.children].some(c=>c.textContent.trim())).map(el=>{
  const chain=[];for(let n=el;n;n=n.parentElement)chain.unshift(n);
  let fg,bg=[255,255,255];
  function compose(i,back){const node=chain[i],s=getComputedStyle(node),fill=rgb(s.backgroundColor);assertSolid(s);const own=over(fill,back);let result=i===chain.length-1?{fg:over(rgb(s.color),own),bg:own}:compose(i+1,own);const opacity=Number(s.opacity);return {fg:over([...result.fg,opacity],back),bg:over([...result.bg,opacity],back)}}
  function assertSolid(s){if(s.backgroundImage!=='none'||s.mixBlendMode!=='normal'||s.filter!=='none'||s.textShadow!=='none'||(s.backdropFilter||s.webkitBackdropFilter||'none')!=='none')throw Error('Unsupported diagnostic paint: '+[s.backgroundImage,s.mixBlendMode,s.filter,s.textShadow,s.backdropFilter||s.webkitBackdropFilter||'none'].join(';'))}
  const result=compose(0,bg),s=getComputedStyle(el);return {text:el.textContent.trim().slice(0,120),...result,size:parseFloat(s.fontSize),weight:parseFloat(s.fontWeight)};
 });
}
