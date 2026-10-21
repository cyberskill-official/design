import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {buildCspManifest} from './lib/site-csp.mjs';
import {buildSiteRoutes} from './lib/site-routes.mjs';
import {compileSiteJsx} from './lib/site-jsx.mjs';
import { verifyFreshness } from './storybook-fingerprint.mjs';
import { loadPublicPolicy, validatePublicOutput, legacyRedirectFiles, legacyRedirectHtml } from './public-site.mjs';

/** Package only a fresh, classified Storybook webroot. No repository-wide copy. */
const root = fileURLToPath(new URL('../',import.meta.url));
const sb = join(root,'storybook-static');
const outDir = join(root,'.vercel-static');
const stamp=JSON.parse(readFileSync(join(sb,'.cs-freshness.json'),'utf8'));
verifyFreshness(root,stamp);
const policy=loadPublicPolicy(root);
const inventory=validatePublicOutput(sb,policy);
const byPath = new Map(inventory.map((item) => [item.path, item]));
// Validate before replacing any previously built output.
rmSync(outDir,{recursive:true,force:true});
mkdirSync(outDir,{recursive:true});
cpSync(sb,outDir,{recursive:true}); // Storybook is the site root.
const redirectStub = legacyRedirectHtml;
for (const path of legacyRedirectFiles) {
  const dest=join(outDir,path);
  mkdirSync(join(dest,'..'),{recursive:true});
  const body = path === 'dashboard.html' ? readFileSync(join(root, 'dashboard.html'), 'utf8') : redirectStub;
  writeFileSync(dest,body);
  byPath.set(path,{path,audience:'host',purpose:'Legacy route redirect to the Storybook product surface.',bytes:Buffer.byteLength(body),sha256:createHash('sha256').update(body).digest('hex')});
}
// Preserve authored JSX source; compile known runtime Babel blocks only in final output.
for(const [path,entry]of byPath){if(!path.endsWith('.html'))continue;const input=readFileSync(join(outDir,path),'utf8');const result=compileSiteJsx(input,path,{publicRoot:outDir,classifiedPaths:new Set(byPath.keys())});if(result.blocks){writeFileSync(join(outDir,path),result.html);byPath.set(path,{...entry,bytes:Buffer.byteLength(result.html),sha256:createHash('sha256').update(result.html).digest('hex')});}}
// Hash only after every final HTML byte (including redirect stubs and compiled JSX) exists.
const cspManifest=buildCspManifest([...byPath.values()].filter(entry=>entry.path.endsWith('.html')).map(entry=>({path:entry.path,html:readFileSync(join(outDir,entry.path),'utf8')})),{serializerSource:readFileSync(join(root,'scripts/template-runtime/dc-logic-source.mjs'),'utf8')});
const cspBytes=JSON.stringify(cspManifest,null,2)+'\n';
writeFileSync(join(outDir,'public-site-csp.json'),cspBytes);
byPath.set('public-site-csp.json',{path:'public-site-csp.json',audience:'host',purpose:'Exact derived per-output script permissions; not deployment or security approval.',bytes:Buffer.byteLength(cspBytes),sha256:createHash('sha256').update(cspBytes).digest('hex')});
const generatedDirectoryIndexes=[...byPath.keys()].filter(path=>path.endsWith('/index.html')&&!policy.has(path)&&!legacyRedirectFiles.includes(path));
const deployment=buildSiteRoutes(cspManifest,{generatedDirectoryIndexes});
const deduplicated = [...byPath.values()].sort((a,b)=>a.path.localeCompare(b.path));
writeFileSync(join(outDir,'public-site-manifest.json'),JSON.stringify({
  schemaVersion:1, sourceHash:stamp.sourceHash,
  manifestPurpose:'Public site audience inventory; its own entry is omitted to avoid a self-referential hash.',
  files:deduplicated,
},null,2)+'\n');
console.log(`Public site ready: ${deduplicated.length} classified files plus manifest; source ${stamp.sourceHash}`);

// Build Output API is emitted after the build; vercel.json is not rewritten at build time.
const deploymentRoot=join(root,'.vercel/output');
rmSync(deploymentRoot,{recursive:true,force:true});mkdirSync(join(deploymentRoot,'static'),{recursive:true});
cpSync(outDir,join(deploymentRoot,'static'),{recursive:true});
writeFileSync(join(deploymentRoot,'config.json'),JSON.stringify(deployment,null,2)+'\n');
console.log(`Static CSP ready: ${cspManifest.pages.length} HTML records, ${deployment.routes.length} explicit routing rules; no deployment was performed`);
