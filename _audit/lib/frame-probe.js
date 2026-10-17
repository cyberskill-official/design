/* Bounded, single-navigation frame lifecycle for whole-set browser audits.
 * Failure is data, never a fabricated zero measurement. */
window.csProbeFrame = function csProbeFrame(src, {
  parent, width=390, height=1100, template=true, timeout=30000, measure, ready,
}) {
  return new Promise(resolve => {
    const frame=document.createElement('iframe');
    frame.style.cssText=`width:${width}px;height:${height}px;border:0;display:block`;
    let complete=false, started=false, phase='navigation', rootName=null;
    let cancel, observedWindow;
    const runtimeErrors=[];
    const recordError=event=>runtimeErrors.push(String(event.message||event.reason||"Unknown runtime error"));
    const cancelled=new Promise((_,reject)=>{cancel=reject;});
    cancelled.catch(()=>{});
    const finish=value=>{
      if(complete)return;
      complete=true;clearTimeout(timer);
      cancel(new Error('Frame probe finished'));
      observedWindow?.removeEventListener("error",recordError);
      observedWindow?.removeEventListener("unhandledrejection",recordError);
      frame.onload=null;frame.onerror=null;frame.remove();
      resolve({...value,probe:{src,phase,rootName}});
    };
    const timer=setTimeout(()=>finish({error:`Frame timeout during ${phase}`}),timeout);
    frame.onerror=()=>finish({error:'Frame navigation failed'});
    frame.onload=async()=>{
      if(complete||started)return;
      try {
        const doc=frame.contentDocument,win=frame.contentWindow;
        if(doc?.URL==='about:blank')return;
        started=true;
        observedWindow=win;win.addEventListener("error",recordError);win.addEventListener("unhandledrejection",recordError);
        const check=()=>{
          if(complete)throw new Error('Frame probe finished');
          if(runtimeErrors.length)throw new Error('Frame runtime error: '+runtimeErrors.join('; ').slice(0,500));
          if(!doc?.documentElement||!doc.body||frame.contentDocument!==doc)throw new Error('Frame document missing or replaced');
          const renderError=doc.querySelector('.sc-logic-error,.sc-placeholder-error');
          if(renderError)throw new Error('Template render error: '+renderError.textContent.trim().slice(0,500));
          if(win.CyberSkillDS?.__errors?.length)throw new Error('Template bundle errors: '+JSON.stringify(win.CyberSkillDS.__errors).slice(0,500));
        };
        const wait=async ms=>{await Promise.race([new Promise(r=>setTimeout(r,ms)),cancelled]);check();};
        const until=async(predicate,label)=>{phase=label;while(true){check();if(predicate())break;await wait(50);}};
        check();
        let props={};
        if(template){
          const declaration=doc.querySelector('script[data-props]');
          if(!declaration)throw new Error('Missing template props declaration');
          props=JSON.parse(declaration.getAttribute('data-props'));
          await until(()=>{
            if(typeof win.__dcRootName!=='function'||typeof win.__dcSetProps!=='function')return false;
            rootName=win.__dcRootName();
            return !!rootName && [...doc.querySelectorAll('[data-sc-name]')].some(node=>node.getAttribute('data-sc-name')===rootName);
          },'template bootstrap');
          if(win.__csTemplateBundleLoads){
            phase='template bundle readiness';
            await Promise.race([Promise.all(Object.values(win.__csTemplateBundleLoads)),cancelled]);check();
          }
          await until(()=>!doc.querySelector('.sc-placeholder'),'template component resolution');
        }
        if(ready)await until(()=>ready({doc,win}),'surface mount');
        const sheetReady=sheet=>{
          if(!sheet)return false;
          return [...sheet.cssRules].every(rule=>rule.type!==win.CSSRule.IMPORT_RULE||sheetReady(rule.styleSheet));
        };
        await until(()=>[...doc.querySelectorAll('link[rel~="stylesheet"]')].every(link=>sheetReady(link.sheet)) && [...doc.styleSheets].every(sheetReady) &&
          win.getComputedStyle(doc.querySelector('[data-theme]')||doc.documentElement).getPropertyValue('--cs-color-brand-umber').trim(),'stylesheet readiness');
        phase='fonts';await Promise.race([doc.fonts.ready,cancelled]);check();
        phase='measurement';
        const value=await measure({doc,win,rootName,props,wait,check});
        check();finish(value);
      }catch(error){finish({error:String(error?.message||error)});}
    };
    frame.src=src;parent.appendChild(frame);
  });
};

/* Explicit raw-kit mount contracts; geometry alone cannot establish readiness. */
window.csKitReadiness = function csKitReadiness(src) {
  if(src.includes('/status-hub/'))return ({doc,win})=>typeof win.StatusHub==='function' && !!doc.querySelector('#root > .sh #main button.card');
  if(src.includes('/website/'))return ({doc,win})=>typeof win.Website==='function' && !!doc.querySelector('#root > .site #main .hero');
  if(src.includes('/deck/'))return ({doc,win})=>!!win.customElements.get('deck-stage') && !!doc.querySelector('deck-stage > section[data-deck-active]') && !!doc.querySelector('deck-stage')?.shadowRoot;
  return undefined;
};
