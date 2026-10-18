#!/usr/bin/env node
/** Inventory materialized bytes and verify working-tree, npm pack, and public-site membership and hashes. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, lstatSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { runtimeSources, syncTemplateRuntimes } from './sync-support-runtime.mjs';
import { listFiles } from './public-site.mjs';
import { verifyFreshness } from './storybook-fingerprint.mjs';
import { verifyAuthoredTemplatePrimitives } from './lib/authored-template-primitives.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const order = (a,b) => a < b ? -1 : a > b ? 1 : 0;
export function summarizeFiles(rows) {
  assert(Array.isArray(rows) && rows.length, 'Empty distribution');
  const seen = new Set();
  const files = [...rows].sort((a,b) => order(a.path,b.path));
  for (const item of files) {
    assert(typeof item.path === 'string' && !item.path.startsWith('/') && !item.path.includes('\\') && item.path.split('/').every(part=>part && part!=='.' && part!=='..'), 'Unsafe distribution path');
    assert(!seen.has(item.path), 'Duplicate distribution member'); seen.add(item.path);
    assert(Number.isSafeInteger(item.bytes) && item.bytes >= 0, 'Invalid byte count');
    assert(/^[a-f0-9]{64}$/.test(item.sha256), 'Invalid distribution digest');
  }
  return { fileCount: files.length, bodyBytes: files.reduce((sum,item)=>sum+item.bytes,0),
    membershipSha256: sha(files.map(item=>`${item.path}\t${item.bytes}\t${item.sha256}\n`).join('')), files };
}
export function readInventory(base, paths) {
  return summarizeFiles(paths.map(path => {
    assert(!isAbsolute(path) && !path.includes('\\') && path.split('/').every(part=>part && part!=='.' && part!=='..'), 'Unsafe distribution path');
    let target = base;
    for (const part of path.split('/')) { target=join(target,part); assert(!lstatSync(target).isSymbolicLink(), 'Linked distribution input'); }
    assert(lstatSync(target).isFile(), 'Non-file distribution input');
    const bytes=readFileSync(target); return {path,bytes:bytes.length,sha256:sha(bytes)};
  }));
}
export function assertCurrentInventory(base, inventory, paths=inventory.files.map(item=>item.path)) {
  assert.equal(readInventory(base,paths).membershipSha256,inventory.membershipSha256,'Distribution changed during measurement');
}
export function verifyWebsite(base, manifest) {
  assert.equal(manifest.schemaVersion,1);
  const paths=listFiles(base);
  assert.deepEqual(manifest.files.map(item=>item.path).sort(order), paths.filter(path=>path!=='public-site-manifest.json').sort(order), 'Website membership changed');
  const inventory=readInventory(base,paths);
  for (const entry of manifest.files) {
    const actual=inventory.files.find(item=>item.path===entry.path);
    assert.equal(actual.bytes,entry.bytes,'Website byte count changed');
    assert.equal(actual.sha256,entry.sha256,'Website bytes changed');
  }
  return inventory;
}
export function portableRuntimeCosts(base, inventories) {
  syncTemplateRuntimes(base,{check:true});
  const manifest=JSON.parse(readFileSync(join(base,'_ds_manifest.json'),'utf8'));
  const authored=existsSync(join(base,'scripts/template-runtime/primitives/support.js'))?verifyAuthoredTemplatePrimitives(path=>{readInventory(base,[path]);return readFileSync(join(base,path));}):new Map();
  const runtimes=Object.entries(runtimeSources).map(([name,path])=>({name,...readInventory(base,[path]).files[0],
    repositoryRole:name==='support.js'?(authored.has(path)?'canonical generated artifact from recorded local authored compatibility candidate; distribution review pending':'canonical runtime artifact; authored source binding not recorded'):'canonical authored design-system loader',
    ...(authored.has(path)?{sourceOriginState:authored.get(path).state,sourceOriginEvidence:authored.get(path).evidence}:{})}));
  const templates=manifest.templates.map(item=>{
    const files=listFiles(join(base,item.folder)).map(path=>`${item.folder}/${path}`);
    const folder=readInventory(base,files);
    const runtimeBytes=runtimes.reduce((sum,item)=>sum+item.bytes,0);
    assert(runtimes.every(runtime=>folder.files.some(file=>file.path===`${item.folder}/${runtime.name}` && file.sha256===runtime.sha256)), 'Missing reproducible runtime');
    return {folder:item.folder,fileCount:folder.fileCount,bodyBytes:folder.bodyBytes,membershipSha256:folder.membershipSha256,runtimeBytes,
      runtimeSharePercent:Math.round(runtimeBytes/folder.bodyBytes*10000)/100};
  }).sort((a,b)=>order(a.folder,b.folder));
  const distributions=Object.fromEntries(Object.entries(inventories).map(([name,inventory])=>{
    const generated=inventory.files.filter(file=>templates.some(template=>runtimes.some(runtime=>file.path===`${template.folder}/${runtime.name}`)));
    for(const file of generated)assert.equal(file.sha256,runtimes.find(runtime=>file.path.endsWith('/'+runtime.name)).sha256,'Distributed runtime differs from authored source');
    return [name,{generatedRuntimeFiles:generated.length,generatedRuntimeBytes:generated.reduce((sum,item)=>sum+item.bytes,0),
      canonicalSourceFiles:inventory.files.filter(file=>runtimes.some(runtime=>runtime.path===file.path)).map(file=>file.path)}];
  }));
  return {canonical:runtimes,requiredCopies:templates.length*runtimes.length,distributions,templates};
}

export function measureDistributions(base=root) {
  const scratch=mkdtempSync(join(tmpdir(),'cs-distribution-costs-'));
  try {
    // A working-tree inventory includes pending files and omits operator-deleted paths.
    const checkoutPaths=()=>[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:base,encoding:'utf8'}).split('\0').filter(Boolean))].filter(path=>existsSync(join(base,path)));
    const paths=checkoutPaths();
    const checkout=readInventory(base,paths);
    const [pack]=JSON.parse(execFileSync('npm',['pack','--json','--ignore-scripts','--pack-destination',scratch],{cwd:base,encoding:'utf8',maxBuffer:32*1024*1024}));
    const unpacked=join(scratch,'package');mkdirSync(unpacked);
    execFileSync('tar',['-xzf',join(scratch,pack.filename),'-C',unpacked,'--strip-components=1']);
    assert.deepEqual(listFiles(unpacked).sort(order),pack.files.map(item=>item.path).sort(order),'npm archive membership differs');
    const packageFiles=readInventory(unpacked,pack.files.map(item=>item.path));
    const packageSources=readInventory(base,pack.files.map(item=>item.path));
    assert.equal(packageFiles.membershipSha256,packageSources.membershipSha256,'Packed file bytes differ from working source');
    assert.equal(packageFiles.bodyBytes,pack.unpackedSize,'npm file inventory byte sum differs');
    for(const file of pack.files)assert.equal(packageFiles.files.find(item=>item.path===file.path).bytes,file.size,'npm inventory size differs');
    const publicRoot=join(base,'.vercel-static');
    const manifest=JSON.parse(readFileSync(join(publicRoot,'public-site-manifest.json'),'utf8'));
    const stamp=JSON.parse(readFileSync(join(publicRoot,'.cs-freshness.json'),'utf8'));
    verifyFreshness(base,stamp); assert.equal(manifest.sourceHash,stamp.sourceHash);
    const website=verifyWebsite(publicRoot,manifest);
    const inventories={checkout,npm:packageFiles,website};
    const portable=portableRuntimeCosts(base,inventories);
    assertCurrentInventory(base,checkout,checkoutPaths());
    assertCurrentInventory(base,packageSources);
    assert.equal(verifyWebsite(publicRoot,manifest).membershipSha256,website.membershipSha256,'Website changed during measurement');
    verifyFreshness(base,stamp);
    return {schemaVersion:1,measurement:'Current nonignored Git-listed working tree (tracked plus pending files), actual npm pack with lifecycle scripts disabled, and a freshness-verified local website output. Logical regular-file bytes; excludes filesystem allocation, Git history, installed dependencies, ignored outputs, network overhead and timing.',
      source:{scriptSha256:sha(readFileSync(join(base,'scripts/measure-distribution-costs.mjs'))),packageSha256:sha(readFileSync(join(scratch,pack.filename))),websiteSourceHash:stamp.sourceHash},
      distributions:{checkout,npm:{...packageFiles,archiveBytes:lstatSync(join(scratch,pack.filename)).size},website},
      portable:{...portable,scope:'All declared DC template source folders and the two required runtime copies per folder. Folder bytes exclude shared CSS/fonts/assets and compiler/export tools; copying one folder alone does not establish offline closure or export fidelity. The full npm tree is a measured portable source envelope preserving relative paths, not a compiled standalone export.',fullPackageEnvelopeBytes:packageFiles.bodyBytes}};
  } finally { rmSync(scratch,{recursive:true,force:true}); }
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2); assert(args.length===0 || (args.length===2 && args[0]==='--output'),'Usage: node scripts/measure-distribution-costs.mjs [--output /outside/repository/report.json]');
  if(args.length) { const dest=resolve(args[1]);const rel=relative(root,dest);assert(isAbsolute(rel)||rel==='..'||rel.startsWith('../'),'Report must be outside the measured repository to avoid self-reference'); }
  const report=measureDistributions();
  if(args.length)writeFileSync(resolve(args[1]),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({distributions:Object.fromEntries(Object.entries(report.distributions).map(([name,{fileCount,bodyBytes,archiveBytes}])=>[name,{fileCount,bodyBytes,...(archiveBytes===undefined?{}:{archiveBytes})}])),requiredRuntimeCopies:report.portable.requiredCopies,runtimeCosts:report.portable.distributions},null,2));
}
