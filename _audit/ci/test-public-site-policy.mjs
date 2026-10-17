import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { parse } from 'parse5';
import { fileURLToPath } from 'node:url';
import { loadPublicPolicy, stagePublicFiles, publicOutputEntry, listFiles } from '../../scripts/public-site.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const scratch=mkdtempSync(join(tmpdir(),'cs-public-policy-'));
const put=(path,content='fixture')=>{mkdirSync(dirname(join(scratch,path)),{recursive:true});writeFileSync(join(scratch,path),content);};
try {
  const policy={schemaVersion:1,audiences:{runtime:{purpose:'Fixture runtime',files:['assets/public.svg']}}};
  put('scripts/public-site-policy.json',JSON.stringify(policy));put('assets/public.svg');
  for(const path of ['assets/private.svg','.github/workflows/private.yml','package-lock.json','scripts/private.js']) put(path);
  const stage=stagePublicFiles(scratch);assert.deepEqual(listFiles(stage),['assets/index.html','assets/public.svg']);
  const inventory=loadPublicPolicy(scratch);
  for(const path of ['package-lock.json','scripts/private.js']) assert.throws(()=>publicOutputEntry(path,inventory),/Unclassified/);
  for(const path of ['../escape','.github/workflows/private.yml','package-lock.json','scripts/private.js']) {
    put('scripts/public-site-policy.json',JSON.stringify({...policy,audiences:{runtime:{purpose:'fixture',files:[path]}}}));
    assert.throws(()=>loadPublicPolicy(scratch));
  }
  put('scripts/public-site-policy.json',JSON.stringify(policy));rmSync(join(scratch,'assets/public.svg'));assert.throws(()=>stagePublicFiles(scratch));
  put('secret.svg');symlinkSync(join(scratch,'secret.svg'),join(scratch,'assets/public.svg'));assert.throws(()=>stagePublicFiles(scratch),/symlink/);
  const real=loadPublicPolicy(root);const realStage=stagePublicFiles(root);
  for(const [path,entry] of real){if(entry.optional&&!existsSync(join(root,path)))continue;assert.deepEqual(readFileSync(join(realStage,path)),readFileSync(join(root,path)),path);}
  assert(!existsSync(join(realStage,'package-lock.json')));
  // A content sidecar is part of the public template contract, including
  // sidecars newly added to satisfy coverage in the source audit board.
  for(const slug of readdirSync(join(root,'templates'))) {
    const sidecar=`templates/${slug}/content-schema.json`;
    if(existsSync(join(root,sidecar)))assert(real.has(sidecar),`Template sidecar excluded from public policy: ${sidecar}`);
  }
  // Check browser resource closure against actual HTML syntax. Links to existing
  // source files must be published explicitly; directory navigation is generated.
  for(const path of real.keys()) {
    if(!path.endsWith('.html'))continue;
    const visit=node=>{
      for(const attr of node.attrs||[]) {
        if(!['src','href'].includes(attr.name)||!attr.value||attr.value.includes('${'))continue;
        const url=new URL(attr.value,`https://fixture/${path}`);
        if(url.origin!=='https://fixture')continue;
        const target=decodeURIComponent(url.pathname).slice(1);
        if(existsSync(join(root,target)) && !target.endsWith('/') && /\.[^/]+$/.test(target)) {
          assert(real.has(target)||existsSync(join(realStage,target)),`${path} references excluded source ${target}`);
        }
      }
      for(const child of node.childNodes||[])visit(child);
      if(node.content)visit(node.content);
    };
    visit(parse(readFileSync(join(root,path),'utf8')));
  }
  console.log(`PASS public site policy: ${real.size} declared paths; unknown/private files excluded, missing files and symlinks rejected, staged bytes match source`);
} finally {rmSync(scratch,{recursive:true,force:true});}
