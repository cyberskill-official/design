import assert from 'node:assert/strict';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {stripEntryRoute,validateEntryPair,entrypoints} from './entrypoint-languages.mjs';
import {parseReleaseVersion} from './release-version.mjs';
/** Only source identity is stamped. Registry pins, sibling inventories and history are never inferred as source identity. */
export const documentationStampTargets = Object.freeze([
  {path:'README.md',ids:['checkout','release-signal','package-source']},
  {path:'docs/vi/entrypoints/README.md',ids:['checkout','release-signal','package-source']},
  {path:'docs/consuming.md',ids:['checkout']},
  {path:'docs/vi/consuming.md',ids:['checkout']},
  {path:'docs/conventions.md',ids:['checkout']},
  {path:'docs/vi/conventions.md',ids:['checkout']},
  {path:'docs/release-notes.md',ids:['checkout']},
  {path:'docs/vi/release-notes.md',ids:['checkout']},
  {path:'stories/ReleaseNotes/ReleaseNotes.mdx',ids:['checkout']},
].map(target=>Object.freeze({...target,ids:Object.freeze(target.ids)})));
export function sourceVersionMarker(path,id,value) {
  parseReleaseVersion(value);
  assert(documentationStampTargets.some(target=>target.path===path&&target.ids.includes(id)),'Unknown source-version target');
  return path.endsWith('.mdx') ? `{/* cs-source-version:${id} */}${value}{/* /cs-source-version */}` : `<!-- cs-source-version:${id} -->${value}<!-- /cs-source-version -->`;
}
/** Read and validate the entire finite set before returning any writable output. */
export function stampReleaseDocumentation(root,currentVersion,nextVersion) {
  parseReleaseVersion(currentVersion);parseReleaseVersion(nextVersion);
  const directory=realpathSync(root),updates=[];
  for(const target of documentationStampTargets) {
    const path=resolve(directory,target.path);
    assert(!lstatSync(path).isSymbolicLink(),'Source-version document must not be a symlink: '+target.path);
    assert(realpathSync(path).startsWith(directory+sep),'Source-version document escaped checkout: '+target.path);
    const before=readFileSync(path,'utf8');
    const pattern=target.path.endsWith('.mdx') ? /\{\/\* cs-source-version:([a-z0-9-]+) \*\/\}([^{}\r\n]*)\{\/\* \/cs-source-version \*\/\}/g : /<!-- cs-source-version:([a-z0-9-]+) -->([^<>\r\n]*)<!-- \/cs-source-version -->/g;
    const matches=[...before.matchAll(pattern)];
    assert.equal((before.match(/cs-source-version:/g)||[]).length,matches.length,'Malformed source-version opening marker: '+target.path);
    assert.equal((before.match(/\/cs-source-version/g)||[]).length,matches.length,'Malformed source-version closing marker: '+target.path);
    assert.equal(matches.length,target.ids.length,'Missing or duplicate source-version marker: '+target.path);
    const ids=new Set();
    for(const match of matches) {
      assert(target.ids.includes(match[1])&&!ids.has(match[1]),'Unknown or duplicate source-version marker: '+target.path+'/'+match[1]);
      ids.add(match[1]);assert.equal(match[2],currentVersion,'Stale source-version marker: '+target.path+'/'+match[1]);
    }
    const after=before.replace(pattern,(_,id)=>sourceVersionMarker(target.path,id,nextVersion));
    updates.push({path:target.path,before,after});
  }
  const metadataPath='scripts/entrypoint-language-source.json';
  const metadataFile=resolve(directory,metadataPath);
  assert(!lstatSync(metadataFile).isSymbolicLink()&&realpathSync(metadataFile).startsWith(directory+sep),'Invalid entrance language binding path');
  const before=readFileSync(metadataFile,'utf8');
  const inventory=JSON.parse(before);
  assert.equal(before,JSON.stringify(inventory,null,2)+'\n','Entrance language bindings must retain canonical serialization');
  assert.equal(inventory.schemaVersion,1,'Invalid entrance language binding schema');
  assert.deepEqual(inventory.entries.map(row=>row.source),entrypoints,'Complete ordered entrance language bindings required');
  const row=inventory.entries.find(row=>row.source==='README.md');
  validateEntryPair(directory,row); // Never rebind unreviewed prose or an already stale translation.
  const digest=value=>createHash('sha256').update(value).digest('hex');
  const english=updates.find(update=>update.path===row.source);
  const mirror=updates.find(update=>update.path===row.mirror);
  assert(mirror,'README translation must be stamped with its source');
  row.sourceSha256=digest(stripEntryRoute(english.after));
  row.mirrorSha256=digest(mirror.after);
  updates.push({path:metadataPath,before,after:JSON.stringify(inventory,null,2)+'\n'});
  return updates;
}
