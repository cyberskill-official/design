import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,cpSync,symlinkSync,readFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url));
const temp=mkdtempSync(join(tmpdir(),'cs-manifest-bootstrap-'));
try {
  mkdirSync(join(temp,'scripts'));mkdirSync(join(temp,'tokens'));
  for(const file of ['seed-manifest.mjs','catalog-source.json','sync-font-manifest.mjs'])cpSync(join(root,'scripts',file),join(temp,'scripts',file));
  cpSync(join(root,'tokens/fonts.css'),join(temp,'tokens/fonts.css'));
  symlinkSync(join(root,'node_modules'),join(temp,'node_modules'),'dir');
  execFileSync(process.execPath,['scripts/seed-manifest.mjs'],{cwd:temp});
  execFileSync(process.execPath,['scripts/sync-font-manifest.mjs'],{cwd:temp});
  const regenerated=JSON.parse(readFileSync(join(temp,'_ds_manifest.json'),'utf8'));
  const current=JSON.parse(readFileSync(join(root,'_ds_manifest.json'),'utf8'));
  assert.deepEqual(regenerated.fonts,current.fonts,'Fresh manifest must derive every font face');
  assert.equal(regenerated.namespace,current.namespace);
  const first=readFileSync(join(temp,'_ds_manifest.json'),'utf8');
  execFileSync(process.execPath,['scripts/seed-manifest.mjs'],{cwd:temp});
  assert.equal(readFileSync(join(temp,'_ds_manifest.json'),'utf8'),first,'Bootstrap must not erase derived outputs');
} finally {rmSync(temp,{recursive:true,force:true});}
console.log('PASS missing-manifest bootstrap: authored namespace, complete font derivation and non-destructive reseeding');
