import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFileSync,readdirSync,existsSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parseBundleHeader,collectSources} from './build-bundle.mjs';
const repository=fileURLToPath(new URL('../',import.meta.url));
const sha=value=>createHash('sha256').update(value).digest('hex');
const read=path=>readFileSync(path,'utf8');
const walk=path=>existsSync(path)?readdirSync(path,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(resolve(path,entry.name)):[resolve(path,entry.name)]):[];
export function compareCompiledFiles(expected,directory){
 const actual=walk(directory).map(path=>relative(directory,path).split('\\').join('/')).sort();
 assert.deepEqual(actual,[...expected.keys()].sort(),'Compiled ESM output set differs (missing or orphan files); run npm run build:compiled');
 for(const[name,contents]of expected)assert(readFileSync(resolve(directory,name)).equals(contents),'Compiled ESM stale: '+name);
}
export function projectCompiledSitePolicy(policy, files) {
 assert.equal(policy.schemaVersion, 1);
 assert(Array.isArray(policy.audiences?.runtime?.files));
 const valid = path => path === 'build.json' || /^[A-Za-z0-9_/-]+\.mjs(?:\.map)?$/.test(path);
 const names = [...files.keys()];
 assert(names.length && names.includes('build.json') && names.includes('_esm/react.mjs'));
 assert(names.every(path => valid(path) && !path.split('/').some(part => !part || part === '.' || part === '..')), 'Unsafe compiled publication output');
 for (const [audience, group] of Object.entries(policy.audiences)) {
  assert(Array.isArray(group.files));
  for (const path of group.files.filter(path => path.startsWith('dist/esm/'))) {
   assert.equal(audience, 'runtime', 'Compiled outputs have one reviewed audience');
   assert(valid(path.slice('dist/esm/'.length)) && !path.split('/').some(part => part === '.' || part === '..'), 'Unreviewed compiled policy member');
  }
 }
 const result = structuredClone(policy), old = result.audiences.runtime.files;
 const first = old.findIndex(path => path.startsWith('dist/esm/'));
 assert(first >= 0, 'Compiled publication namespace needs an existing reviewed anchor');
 const before = old.slice(0, first), after = old.slice(first).filter(path => !path.startsWith('dist/esm/'));
 result.audiences.runtime.files = [...before, ...names.sort().map(path => 'dist/esm/' + path), ...after];
 const all = Object.values(result.audiences).flatMap(group => group.files);
 assert.equal(new Set(all).size, all.length, 'Duplicate public publication member');
 return result;
}
export async function compileESM(root=repository){
 const header=parseBundleHeader(read(resolve(root,'_ds_bundle.js')));
 const paths=[...new Set(header.components.map(entry=>entry.sourcePath))].sort();
 const entries=[{in:'_esm/react.mjs',out:'_esm/react'},...paths.map(path=>({in:path,out:path.replace(/\.(?:jsx?|mjs)$/,'')}))];
 const output=await build({absWorkingDir:root,entryPoints:entries,outdir:resolve(root,'dist/esm'),outbase:root,bundle:true,splitting:true,format:'esm',platform:'neutral',target:['es2020'],external:['react','react/*','react-dom','react-dom/*'],outExtension:{'.js':'.mjs'},chunkNames:'chunks/[name]-[hash]',sourcemap:'linked',sourcesContent:true,banner:{js:'"use client";'},legalComments:'inline',charset:'utf8',write:false,metafile:true,logLevel:'silent'});
 assert(!Object.keys(output.metafile.inputs).some(path=>path.includes('node_modules/')),'Peer runtimes must not be bundled');
 const files=new Map(output.outputFiles.map(file=>[relative(resolve(root,'dist/esm'),file.path).split('\\').join('/'),Buffer.from(file.contents)]));
 const metadata={schemaVersion:1,interpretation:'Compiled ESM import distribution. Shared split chunks preserve root/deep module identity; React/react-dom remain external peers. No CommonJS contract.',compiler:{name:'esbuild',version:JSON.parse(read(resolve(root,'node_modules/esbuild/package.json'))).version},sourceHashes:Object.fromEntries(['scripts/build-compiled-esm.mjs','_esm/react.mjs',...collectSources(root)].map(path=>[path,sha(readFileSync(resolve(root,path)))])),entryPoints:entries.map(entry=>({source:entry.in,output:entry.out+'.mjs'})),outputs:Object.fromEntries([...files].sort(([a],[b])=>a.localeCompare(b,'en')).map(([path,content])=>[path,{bytes:content.length,sha256:sha(content)}]))};
 files.set('build.json',Buffer.from(JSON.stringify(metadata,null,2)+'\n'));
 return {files,metadata};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const{files,metadata}=await compileESM();const directory=resolve(repository,'dist/esm');
 const policyPath=resolve(repository,'scripts/public-site-policy.json');
 const currentPolicy=read(policyPath),nextPolicy=JSON.stringify(projectCompiledSitePolicy(JSON.parse(currentPolicy),files),null,2)+'\n';
 if(process.argv.includes('--check')){compareCompiledFiles(files,directory);assert.equal(currentPolicy,nextPolicy,'Compiled publication inventory stale; run npm run build:compiled')}
 else{rmSync(directory,{recursive:true,force:true});for(const[name,contents]of files){const path=resolve(directory,name);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,contents)}writeFileSync(policyPath,nextPolicy)}
 console.log('PASS compiled ESM '+metadata.entryPoints.length+' shared-graph entries, '+files.size+' outputs; React peers external, source maps retained');
}
