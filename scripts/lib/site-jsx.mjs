import assert from 'node:assert/strict';
import {readFileSync,realpathSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {runInNewContext} from 'node:vm';
import {parse} from 'parse5';
let babel;
function compiler(){if(!babel){const context={};runInNewContext(readFileSync(new URL('../../_vendor/babel/babel.min.js',import.meta.url),'utf8'),context);babel=context.Babel;assert.equal(babel.version,'7.29.0','Use the reviewed local Babel runtime');}return babel;}
/** Convert only the current, classified, default Babel script vocabulary before CSP hashing. */
export function compileSiteJsx(html,path,{publicRoot,classifiedPaths}){
 const edits=[],document=parse(html,{sourceCodeLocationInfo:true});let blocks=0;const loaders=[];let usesBabelApi=false;
 function walk(node){
  if(node.tagName==='script'){
   const attrs=Object.fromEntries(node.attrs.map(a=>[a.name,a.value]));
   const body=(node.childNodes||[]).map(c=>c.value||'').join('');
   if(attrs.type==='text/babel'){
    assert(node.attrs.every(a=>['type','src'].includes(a.name)),path+': unknown Babel script attributes/presets need an explicit compile contract');
    let source=body;
    if(attrs.src){assert(!body.trim(),path+': external Babel script also has an inline body');const url=new URL(attrs.src,'https://local.invalid/'+path);assert.equal(url.origin,'https://local.invalid');assert(!url.search&&!url.hash);const relative=decodeURIComponent(url.pathname.slice(1));assert(classifiedPaths.has(relative),path+': Babel source must be explicitly classified');const file=resolve(publicRoot,relative);assert(file.startsWith(resolve(publicRoot)+sep)&&realpathSync(file).startsWith(realpathSync(publicRoot)+sep));source=readFileSync(file,'utf8');}
    // Match the pinned standalone runtime's default react/env presets and default plugins.
    const code=compiler().transform(source,{filename:attrs.src||path,presets:['react','env'],plugins:['transform-class-properties','transform-object-rest-spread','transform-flow-strip-types'],sourceMaps:false}).code;
    edits.push({start:node.sourceCodeLocation.startOffset,end:node.sourceCodeLocation.endOffset,text:'<script>'+code.replace(/<\/script/gi,'<\\/script')+'</script>'});blocks++;
   }else{
    usesBabelApi ||= /\bBabel\b/.test(body);
    if(attrs.src&&new URL(attrs.src,'https://local.invalid/'+path).pathname==='/_vendor/babel/babel.min.js')loaders.push(node);
   }
  }
  for(const child of node.childNodes||[])walk(child);
 }
 walk(document);
 if(!blocks)return {html,blocks:0};
 assert(!usesBabelApi,path+': Babel API usage outside transformed blocks requires explicit support');
 assert.equal(loaders.length,1,path+': expected one default transpiler loader');
 for(const loader of loaders){assert(loader.attrs.every(a=>a.name==='src'),path+': Babel loader has unsupported behavior');edits.push({start:loader.sourceCodeLocation.startOffset,end:loader.sourceCodeLocation.endOffset,text:''});}
 for(const edit of edits.sort((a,b)=>b.start-a.start))html=html.slice(0,edit.start)+edit.text+html.slice(edit.end);
 return {html,blocks};
}
