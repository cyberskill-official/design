#!/usr/bin/env node
/** Render a declared template with the shipped browser runtime; never modifies its source. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,cpSync,existsSync,rmSync,realpathSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {withBrowserFixture} from '../_audit/ci/lib/browser-fixture.mjs';
import {collectTemplates} from './generate-template-inventory.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function parseOptions(args) {
 const [slug,...flags]=args;
 assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||''),'Expected template slug');
 const options={slug,format:'html',props:{},browser:'chromium'};
 for(let i=0;i<flags.length;i+=2){
  const key=flags[i]?.replace(/^--/,'');
  assert(['format','props','content','output','browser'].includes(key)&&flags[i+1]!==undefined,'Usage: <slug> --output <new-directory> [--format html|pdf] [--props <json-file>] [--content <json-file>] [--browser chromium|firefox|webkit]');
  options[key]=['props','content'].includes(key)?JSON.parse(readFileSync(resolve(flags[i+1]),'utf8')):flags[i+1];
 }
 assert(options.output,'--output must name a new directory');
 assert(['html','pdf'].includes(options.format),'Only html snapshot and browser-print pdf are supported');
 assert(['chromium','firefox','webkit'].includes(options.browser),'Unknown browser');
 assert(options.format!=='pdf'||options.browser==='chromium','Playwright PDF printing is Chromium-only; use html for Firefox/WebKit');
 assert(options.props&&typeof options.props==='object'&&!Array.isArray(options.props),'--props must contain a JSON object');
 assert(!Object.keys(options.props).some(k=>['__proto__','constructor','prototype','content'].includes(k)),'Unsafe or unsupported prop; supply content with --content, not --props');
 return options;
}
export async function renderTemplate(options){
 if(options.content!==undefined){assert(options.content&&typeof options.content==='object'&&!Array.isArray(options.content),'Content must be a JSON object');assert(!Object.keys(options.content).some(key=>['__proto__','constructor','prototype'].includes(key)),'Unsafe content key')}
 const template=collectTemplates(root).templates.find(t=>t.path.startsWith('templates/'+options.slug+'/'));
 assert(template,'Unknown manifest template: '+options.slug);
 const declared=Object.assign({},...template.declaredProps);
 for(const [key,value] of Object.entries(options.props)){
  assert(Object.hasOwn(declared,key),'Undeclared template prop: '+key);
  const control=declared[key];
  if(control.editor==='enum')assert(control.options.includes(value),'Invalid enum choice for '+key);
  if(['boolean','number','string'].includes(typeof control.default))assert(typeof value===typeof control.default,'Invalid prop type for '+key);
 }
 const output=resolve(options.output);
 // Generated output must be outside the authored repository and never overwrite existing data.
 assert(output!==root.slice(0,-1)&&!output.startsWith(root),'Output must be outside the repository');
 const parent=realpathSync(dirname(output));
 assert(parent!==realpathSync(root)&&!parent.startsWith(realpathSync(root)+'/'),'Output parent must resolve outside the repository');
 assert(!existsSync(output),'Output directory already exists');
 let created=false, renderedEvidence;
 try {
  await withBrowserFixture(async page=>{
   const origin=new URL(page.url()).origin;
   const failures=[];
   page.on('response',response=>{if(response.status()>=400)failures.push(response.url()+': '+response.status())});
   page.on('requestfailed',request=>failures.push(request.url()+': '+request.failure()?.errorText));
   await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort('blockedbyclient'));
   await page.goto(origin+'/'+template.path);
   await page.waitForFunction(()=>window.__dcRootName?.()&&(window.CyberSkillDS||document.querySelector('meta[name="cs-template-library"][content="static-logo"]'))&&document.querySelector('[data-sc-name]')&&!document.querySelector('.sc-placeholder'));
   await page.evaluate(props=>window.__dcSetProps(window.__dcRootName(),props),options.props);
   await page.waitForTimeout(100);
   if(options.content!==undefined){await page.evaluate(content=>window.__dcSetContent(window.__dcRootName(),content),options.content);await page.waitForTimeout(100)}
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.sc-logic-error,.sc-placeholder-error').count(),0,'Template runtime reported an error');
   assert.deepEqual(failures,[],'Resource closure failed');
   mkdirSync(output);created=true;
   if(options.format==='pdf') await page.pdf({path:join(output,'template.pdf'),printBackground:true,preferCSSPageSize:true});
   else {
    // Freeze rendered state: keep semantic markup and resources, omit executable code and authoring chrome.
    assert.equal(await page.locator('image-slot').count(),0,'HTML snapshots of image-slot shadow content require a dedicated serializer; use PDF or the browser preview');
    const html=await page.evaluate(()=>{
     const snapshot=document.documentElement.cloneNode(true);
     snapshot.querySelectorAll('img').forEach((img,index)=>{const original=document.images[index];if(original?.currentSrc)img.setAttribute('src',original.currentSrc);img.removeAttribute('srcset')});
     const originals=[...document.querySelectorAll('input,textarea,select,canvas')];
     snapshot.querySelectorAll('input,textarea,select,canvas').forEach((node,index)=>{
      const original=originals[index];
      if(node.tagName==='INPUT'){node.setAttribute('value',original.value);node.toggleAttribute('checked',original.checked)}
      else if(node.tagName==='TEXTAREA')node.textContent=original.value;
      else if(node.tagName==='SELECT')[...node.options].forEach((option,i)=>option.toggleAttribute('selected',original.options[i].selected));
      else {const img=document.createElement('img');img.src=original.toDataURL();img.width=original.width;img.height=original.height;img.alt=original.getAttribute('aria-label')||'Rendered canvas';node.replaceWith(img)}
     });
     snapshot.querySelectorAll('script,helmet,[data-omelette-chrome],base,source[srcset]').forEach(node=>node.remove());
     const resourceURL=value=>{const url=new URL(value,document.baseURI);return url.origin===location.origin?'resources'+url.pathname+url.search+url.hash:value};
     const cssURLs=text=>text.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/g,(whole,quote,url)=>/^(data:|#)/.test(url)?whole:'url("'+resourceURL(url)+'")');
     snapshot.querySelectorAll('style').forEach(style=>{style.textContent=cssURLs(style.textContent)});
     for(const node of snapshot.querySelectorAll('*')){
      for(const attr of [...node.attributes])if(/^on/i.test(attr.name))node.removeAttribute(attr.name);
      if(node.hasAttribute('style'))node.setAttribute('style',cssURLs(node.getAttribute('style')));
      for(const name of ['src','href','poster']){
       const value=node.getAttribute(name);if(!value||/^(#|data:)/.test(value))continue;
       const url=new URL(value,document.baseURI);
       if(url.origin===location.origin)node.setAttribute(name,'resources'+url.pathname+url.search+url.hash);
      }
     }
     return '<!doctype html>\n'+snapshot.outerHTML;
    });
    const resources=join(output,'resources');mkdirSync(resources);
    for(const name of ['dist','tokens','base','fonts','assets','templates'])cpSync(join(root,name),join(resources,name),{recursive:true});
    writeFileSync(join(output,'template.html'),html);
   }
   renderedEvidence={language:await page.locator('html').getAttribute('lang'),title:await page.title()};
  },{browserName:options.browser});
  const receipt={schemaVersion:1,template:template.path,sourceSha256:template.sha256,...(template.contentSchema?{contentSchemaSha256:template.contentSchema.sha256}:{}),browser:options.browser,format:options.format,props:options.props,...(options.content!==undefined?{content:options.content}:{}),...renderedEvidence,scope:options.format==='html'?'Frozen rendered HTML and resource copy; no live interactions or host authoring bridge':'Chromium paginated print PDF; target-office fidelity and human acceptance separate'};
  writeFileSync(join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  return receipt;
 } catch(error){if(created)rmSync(output,{recursive:true,force:true});throw error}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try {console.log(JSON.stringify(await renderTemplate(parseOptions(process.argv.slice(2))),null,2))}
 catch(error){console.error(error.message);process.exitCode=1}
}
