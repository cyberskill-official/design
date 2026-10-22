/** Existing _audit/axe-smoke.html authority; no per-story exceptions. */
export const storyWcagPolicy={tags:['wcag2a','wcag2aa'],failureImpacts:['serious','critical']};
/** Actual document + product roots, with explicit ownership for external portals. */
export async function scanStoryDocument(page, axeUrl) {
  await page.waitForFunction(() => {
    if (document.body.classList.contains('sb-show-errordisplay') || document.body.classList.contains('sb-show-nopreview')) throw Error('Storybook render error');
    return document.body.classList.contains('sb-show-main') && !!document.querySelector('#storybook-root')?.childNodes.length;
  }, null, {timeout:20000});
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));
  });
  // The Storybook addon can own a different window.axe; always load the artifact
  // vendor explicitly, then capture that scanner before awaiting any run.
  return page.evaluate(async({policy,axeUrl})=>{
    const scanner=axeUrl?await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=axeUrl;script.onload=()=>resolve(globalThis.axe);script.onerror=()=>reject(Error('Artifact axe vendor failed to load'));document.head.appendChild(script);}):globalThis.axe;
    const root=document.querySelector('#storybook-root');
    const portals=[...document.querySelectorAll('[data-cs-overlay-root],[data-cs-floating-root]')].filter(node=>!root.contains(node));
    const include=[root,...portals.filter(node=>!portals.some(other=>other!==node&&other.contains(node)))];
    const unknown=[];
    for(const node of document.body.childNodes){
      if(node.nodeType===Node.TEXT_NODE){if(node.textContent.trim())unknown.push({text:node.textContent.slice(0,200)});continue;}
      if(node.nodeType!==Node.ELEMENT_NODE)continue;
      if(include.includes(node)||['SCRIPT','STYLE','LINK','TEMPLATE'].includes(node.tagName))continue;
      const knownHiddenWrapper=node.matches('.sb-preparing-story.sb-wrapper,.sb-preparing-docs.sb-wrapper,.sb-nopreview.sb-wrapper,.sb-errordisplay.sb-wrapper')&&getComputedStyle(node).display==='none';
      const docs=node.id==='storybook-docs'&&node.hidden;
      const highlights=node.id==='storybook-highlights-root';
      const vision=node.id==='storybook-a11y-vision-filters'&&node.tagName.toLowerCase()==='svg'&&(getComputedStyle(node).display==='none'||(node.getAttribute('aria-hidden')==='true'&&getComputedStyle(node).position==='absolute'&&getComputedStyle(node).overflow==='hidden'&&node.getBoundingClientRect().width===0&&node.getBoundingClientRect().height===0));
      if(!knownHiddenWrapper&&!docs&&!highlights&&!vision)unknown.push({tag:node.tagName,id:node.id,html:node.outerHTML.slice(0,500)});
    }
    const serialize=result=>({violations:result.violations,incomplete:result.incomplete,passes:result.passes.map(r=>({id:r.id,nodes:r.nodes.length})),inapplicable:result.inapplicable.map(r=>r.id)});
    const wholeDocument=serialize(await scanner.run(document));
    const product=serialize(await scanner.run({include}));
    const wcag=serialize(await scanner.run({include},{runOnly:{type:'tag',values:policy.tags}}));
    const failedWcag=wcag.violations.filter(v=>policy.failureImpacts.includes(v.impact));
    return {axeVersion:scanner.version,wholeDocument,product,wcag,policy,coverage:{root:'#storybook-root',portalSelectors:['[data-cs-overlay-root]','[data-cs-floating-root]'],externalPortalCount:portals.length,unknown},passed:unknown.length===0&&failedWcag.length===0,rootHTML:root.innerHTML};
  },{policy:storyWcagPolicy,axeUrl});
}
