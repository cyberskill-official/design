import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createVerificationServer} from '../../scripts/lib/verification-server.mjs';
const temp=await mkdtemp(join(tmpdir(),'cs-http-verification-'));let server;
try{
 const root=join(temp,'root');await mkdir(join(root,'directory'),{recursive:true});await mkdir(join(root,'page'));
 await writeFile(join(root,'directory','<unsafe>.md'),'Markdown');await writeFile(join(root,'page','index.html'),'<h1>Real index</h1>');await writeFile(join(temp,'outside.txt'),'Outside');await symlink(join(temp,'outside.txt'),join(root,'outside.txt'));
 server=await createVerificationServer(root);await new Promise(done=>server.listen(0,'127.0.0.1',done));const base='http://127.0.0.1:'+server.address().port;
 for(const method of ['GET','HEAD']){
  const redirect=await fetch(base+'/directory?probe=1',{method,redirect:'manual'});assert.equal(redirect.status,301);assert.equal(redirect.headers.get('location'),'/directory/?probe=1');
  const listing=await fetch(base+'/directory/',{method});assert.equal(listing.status,200);const text=await listing.text();assert.equal(text.length===0,method==='HEAD');assert(Number(listing.headers.get('content-length'))>0);
  if(method==='GET'){assert(text.includes('&lt;unsafe&gt;.md'));assert(text.includes('%3Cunsafe%3E.md'));assert(!text.includes('<unsafe>'));}
  const page=await fetch(base+'/page/',{method});assert.equal(page.status,200);assert.equal(await page.text(),method==='GET'?'<h1>Real index</h1>':'');
  assert.equal((await fetch(base+'/missing/',{method})).status,404);
  assert.equal((await fetch(base+'/%2e%2e%2foutside.txt',{method})).status,403);
  assert.equal((await fetch(base+'/outside.txt',{method})).status,403);
 }
 assert.equal((await fetch(base+'/%zz')).status,400);
 assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
 console.log('PASS verification server: GET/HEAD directory redirects/listings/indexes, escaped names, absent paths, malformed URLs and traversal/symlink boundaries.');
}finally{if(server)await new Promise(done=>server.close(done));await rm(temp,{recursive:true,force:true});}
