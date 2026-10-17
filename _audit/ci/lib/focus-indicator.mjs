/** Browser-side computed-style check. Opaque fixture surfaces and their
 * ancestor backgrounds are composited; images, gradients, occlusion and actual
 * screen-reader/device behavior remain outside this CSS-color measurement. */
export function inspectFocusIndicator(focus, indicator) {
  const color = text => {
    // Elemental surfaces use color-mix(), which can compute to oklab(). Let
    // the browser convert every supported CSS color into the same sRGB space;
    // extracting its numeric components as RGB gives false contrast failures.
    const state=inspectFocusIndicator.colorState??=(function(){
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
      return {context:canvas.getContext('2d',{willReadFrequently:true}),cache:new Map()};
    })();
    if(!CSS.supports('color',text))throw Error('Unsupported computed focus color: '+text);
    if(!state.cache.has(text)) {
      state.context.clearRect(0,0,1,1);state.context.fillStyle=text;state.context.fillRect(0,0,1,1);
      state.cache.set(text,[...state.context.getImageData(0,0,1,1).data].map(c=>c/255));
    }
    return state.cache.get(text);
  };
  const composite = (front,back) => front.slice(0,3).map((c,i)=>c*front[3]+back[i]*(1-front[3]));
  const background = node => {
    const chain=[];
    for(let current=node;current;current=current.parentElement)chain.push(color(getComputedStyle(current).backgroundColor));
    return chain.reverse().reduce((base,layer)=>composite(layer,base),[1,1,1]);
  };
  const luminance = value => value.map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[0.2126,0.7152,0.0722][i],0);
  const css=getComputedStyle(indicator),probe=document.createElement('span');
  // Void/native controls cannot render a child probe. Resolve the indicator's
  // computed custom-property values on a sibling in the same style scope.
  probe.style.setProperty('--cs-color-text-primary',css.getPropertyValue('--cs-color-text-primary'));
  probe.style.setProperty('--cs-color-accent-ochre',css.getPropertyValue('--cs-color-accent-ochre'));
  probe.style.color='var(--cs-color-text-primary)';indicator.parentElement.append(probe);
  const expectedContour=getComputedStyle(probe).color;
  probe.style.color='var(--cs-color-accent-ochre)';const expectedHalo=getComputedStyle(probe).color;probe.remove();
  const backdrop=background(parseFloat(css.outlineOffset)<0?indicator:indicator.parentElement);
  const contour=composite(color(css.outlineColor),backdrop),a=luminance(contour),b=luminance(backdrop);
  const ratio=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05),failures=[];
  if(document.activeElement!==focus || !focus.matches(':focus-visible'))failures.push('keyboard-mode focus inactive');
  if(css.outlineStyle!=='solid'||parseFloat(css.outlineWidth)<2)failures.push('missing 2px solid contour');
  if(css.outlineColor!==expectedContour)failures.push('contour differs from nearest text-primary');
  const nativeSurface=indicator.matches('button, input[type="range"], input[type="checkbox"], input[type="radio"]');
  const shadowHalo=css.boxShadow.includes(expectedHalo+' 0px 0px 0px 5px');
  const nativeHalo=nativeSurface&&css.filter.includes('drop-shadow('+expectedHalo+' 0px 0px 2px)');
  if(!shadowHalo&&!nativeHalo)failures.push('missing invariant Ochre halo');
  const box=indicator.getBoundingClientRect();
  let hidden=box.width<=0||box.height<=0;
  for(let node=indicator;node;node=node.parentElement) {
    const style=getComputedStyle(node);
    hidden||=style.display==='none'||style.visibility!=='visible'||Number(style.opacity)===0;
  }
  if(hidden)failures.push('indicator has no visible box');
  if(ratio<3)failures.push('contour contrast below 3:1');
  return {pass:failures.length===0,failures,outlineColor:css.outlineColor,outlineWidth:css.outlineWidth,outlineOffset:css.outlineOffset,shadow:css.boxShadow,filter:css.filter,haloPaint:shadowHalo?'box-shadow':nativeHalo?'native-drop-shadow':'absent',expectedContour,expectedHalo,surfaceBackground:backdrop,contourToSurfaceContrast:ratio,contrastRatio:ratio};
}
