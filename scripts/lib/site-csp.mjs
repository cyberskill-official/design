import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {parse} from 'parse5';
import Ajv from 'ajv';
const validateManifest=new Ajv({strict:true}).compile(JSON.parse(readFileSync(new URL('../site-csp-manifest.schema.json',import.meta.url),'utf8')));
import {dcLogicScriptSource} from '../template-runtime/dc-logic-source.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const cspHash=source=>"'sha256-"+createHash('sha256').update(source,'utf8').digest('base64')+"'";
const javascriptTypes=new Set(['module','importmap','speculationrules','application/ecmascript','application/javascript','application/x-ecmascript','application/x-javascript','text/ecmascript','text/javascript','text/javascript1.0','text/javascript1.1','text/javascript1.2','text/javascript1.3','text/javascript1.4','text/javascript1.5','text/jscript','text/livescript','text/x-ecmascript','text/x-javascript']);
export function loadSitePolicy(path=new URL('../site-deployment-policy.json',import.meta.url)) {
 const policy=JSON.parse(readFileSync(path,'utf8'));
 assert.equal(policy.schemaVersion,1);assert.equal(policy.maxCspBytes,4096,'CSP cap is an explicit local policy, not a platform claim');
 assert.equal(policy.maxRoutes,2048);assert.deepEqual(policy.csp['script-src'],["'self'"]);assert.deepEqual(policy.csp['script-src-attr'],["'none'"]);
 for(const [directive,sources]of Object.entries(policy.csp)){assert(/^[a-z-]+$/.test(directive));assert(Array.isArray(sources)&&sources.length);for(const source of sources)assert(typeof source==='string'&&!/[;\r\n]/.test(source));}
 assert(!Object.entries(policy.csp).filter(([key])=>key.startsWith('script-')).some(([,values])=>values.some(value=>/unsafe|nonce|strict-dynamic/.test(value))),'Static script policy cannot introduce blanket inline/eval/nonce trust');
 for(const [key,value]of Object.entries(policy.headers))assert(/^[A-Za-z-]+$/.test(key)&&typeof value==='string'&&!/[\r\n]/.test(value));
 for(const redirect of policy.legacyRedirects){assert(typeof redirect.src==='string'&&redirect.src.startsWith('^')&&redirect.src.endsWith('$'));new RegExp(redirect.src);assert.equal(redirect.dest,'/');assert.equal(redirect.status,308);}
 return policy;
}
/** Parse HTML like a browser (including newline normalization), never regex executable bodies. */
export function htmlScriptSources(html,path='fixture.html') {
 assert(typeof html==='string');const document=parse(html,{sourceCodeLocationInfo:true}),scripts=[];let dcIndex=0;
 function walk(node,inert=false){
  const attrs=Object.fromEntries((node.attrs||[]).map(attr=>[attr.name,attr.value]));
  for(const attr of node.attrs||[]){assert(!/^on[a-z]+$/i.test(attr.name),path+': native inline event handler '+attr.name+' must use an explicit event listener or interpreted data binding');assert(!/^\s*javascript:/i.test(attr.value),path+': javascript URL is forbidden');}
  if(node.tagName==='script'&&!inert){
   const type=(attrs.type||'').trim().toLowerCase(),body=(node.childNodes||[]).map(child=>child.value||'').join('');
   if(!attrs.src&&(!type||javascriptTypes.has(type)))scripts.push({kind:'html-inline',line:node.sourceCodeLocation?.startLine||null,hash:cspHash(body),bytes:Buffer.byteLength(body)});
   else if(!attrs.src&&type!=='text/x-dc'&&!['application/json','application/ld+json'].includes(type))throw Error(path+': unsupported script data type '+type);
   if(Object.hasOwn(attrs,'data-dc-script')){
    assert.equal(type,'text/x-dc',path+': DC logic must remain inert data');assert(!attrs.src,path+': DC source must be inline data');
    const token='Component'+(dcIndex?dcIndex:'');dcIndex++;
    const generated=dcLogicScriptSource(body,token);scripts.push({kind:'dc-logic-wrapper',line:node.sourceCodeLocation?.startLine||null,token,hash:cspHash(generated),bytes:Buffer.byteLength(generated),logicSha256:hash(body)});
   }
  }
  for(const child of node.childNodes||[])walk(child,inert);
  if(node.content)walk(node.content,true);
 }
 walk(document);return scripts;
}
export function designCsp(html='',{policy=loadSitePolicy(),path='fixture.html'}={}) {
 const scripts=htmlScriptSources(html,path),hashes=[...new Set(scripts.map(script=>script.hash))].sort();
 const directives=Object.entries(policy.csp).map(([name,values])=>name+' '+[...values,...(name==='script-src'?hashes:[])].join(' '));
 const value=directives.join('; ');assert(Buffer.byteLength(value)<=policy.maxCspBytes,path+': CSP exceeds the local 4KiB bound');return {value,scripts};
}
export function buildCspManifest(htmlFiles,{policy=loadSitePolicy(),serializerSource}={}) {
 const pages=htmlFiles.map(({path,html})=>{assert(!path.startsWith('/')&&!path.split('/').some(part=>!part||part==='.'||part==='..'));const result=designCsp(html,{policy,path});return {path,htmlSha256:hash(html),csp:result.value,scripts:result.scripts};}).sort((a,b)=>a.path.localeCompare(b.path));
 assert.equal(new Set(pages.map(page=>page.path)).size,pages.length,'Duplicate HTML path');
 const manifest={schemaVersion:1,purpose:'Derived exact static script permissions; source identity is not security review, publication approval or deployment acceptance',serializerSha256:serializerSource?hash(serializerSource):null,pages};
 assert(validateManifest(manifest),'Invalid CSP manifest: '+JSON.stringify(validateManifest.errors));return manifest;
}
