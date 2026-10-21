import {createServer} from 'node:http';
import {readFile,readdir,realpath,stat} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp'};
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
/** Repository verification only: real directories exist even without index.html. */
export async function createVerificationServer(directory) {
 const root=await realpath(directory);
 const inside=path=>path===root||path.startsWith(root+sep);
 async function checked(path){const actual=await realpath(path);if(!inside(actual)){const error=Error('Outside verification root');error.status=403;throw error;}return actual;}
 return createServer(async(request,response)=>{
  const head=request.method==='HEAD';
  const send=(status,body='',headers={})=>{const bytes=Buffer.isBuffer(body)?body:Buffer.from(body);response.writeHead(status,{'Content-Length':bytes.length,'X-Content-Type-Options':'nosniff',...headers});response.end(head?undefined:bytes);};
  if(!['GET','HEAD'].includes(request.method)){send(405,'Method not allowed',{Allow:'GET, HEAD'});return;}
  try {
   const url=new URL(request.url,'http://localhost');let pathname;
   try{pathname=decodeURIComponent(url.pathname);}catch{send(400,'Invalid URL encoding');return;}
   let file=resolve(root,'.'+pathname);
   if(!inside(file)){send(403,'Outside verification root');return;}
   file=await checked(file);let info=await stat(file);
   if(info.isDirectory()){
    if(!url.pathname.endsWith('/')){send(301,'',{Location:url.pathname+'/'+url.search});return;}
    try{const index=await checked(join(file,'index.html'));const candidate=await stat(index);if(candidate.isFile()){file=index;info=candidate;}}
    catch(error){if(error.status||error.code!=='ENOENT')throw error;}
    if(info.isDirectory()){
     const entries=(await readdir(file,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name));
     const links=entries.map(entry=>{const name=entry.name+(entry.isDirectory()?'/':'');return '<li><a href="'+encodeURIComponent(entry.name)+(entry.isDirectory()?'/':'')+'">'+escape(name)+'</a></li>';}).join('');
     send(200,'<!doctype html><html lang="en"><meta charset="utf-8"><title>Directory listing</title><h1>'+escape(pathname)+'</h1><ul>'+links+'</ul></html>',{'Content-Type':'text/html; charset=utf-8'});return;
    }
   }
   if(!info.isFile()){send(404,'Not a file');return;}
   const headers={'Content-Type':types[extname(file)]||'application/octet-stream'};
   if(head){response.writeHead(200,{'Content-Length':info.size,'X-Content-Type-Options':'nosniff',...headers});response.end();return;}
   send(200,await readFile(file),headers);
  }catch(error){send(error.status||(error.code==='EACCES'?403:404),'Unavailable');}
 });
}
