import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
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
const deduplicated = [...byPath.values()].sort((a,b)=>a.path.localeCompare(b.path));
writeFileSync(join(outDir,'public-site-manifest.json'),JSON.stringify({
  schemaVersion:1, sourceHash:stamp.sourceHash,
  manifestPurpose:'Public site audience inventory; its own entry is omitted to avoid a self-referential hash.',
  files:deduplicated,
},null,2)+'\n');
console.log(`Public site ready: ${deduplicated.length} classified files plus manifest; source ${stamp.sourceHash}`);
