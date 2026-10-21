import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync,symlinkSync,chmodSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createServer} from 'node:http';
import {parse} from 'yaml';
import {findBootstrapNpm} from '../../scripts/bootstrap-toolchain.mjs';
import {runPinnedNpm} from '../../scripts/npm.mjs';
import {assertNpmVersion} from '../../scripts/check-npm-version.mjs';
import {generateSbom,reproducibleSbom} from '../../scripts/generate-sbom.mjs';
import {serveVerification} from '../../scripts/serve-verification.mjs';
import {waitVerification} from '../../scripts/wait-verification.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),read=p=>readFileSync(resolve(root,p),'utf8'),pkg=JSON.parse(read('package.json'));
const expected=pkg.packageManager.slice('npm@'.length);
// setup-node runs before the pinned npm bootstrap. Its cache discovery must stay off.
function assertSetupNodeBootstrapOrder(workflow, label) {
  let count = 0;
  for (const job of Object.values(workflow.jobs)) {
    const steps = job.steps || [];
    for (let index = 0; index < steps.length; index++) {
      if (!steps[index].uses?.startsWith('actions/setup-node@')) continue;
      count++;
      const inputs = steps[index].with || {};
      assert.equal(inputs['package-manager-cache'], false, 'Disable implicit pre-bootstrap npm caching: ' + label);
      assert(!Object.hasOwn(inputs, 'cache'), 'No explicit pre-bootstrap package-manager cache: ' + label);
      assert.equal(steps[index + 1]?.uses, './.github/actions/setup-npm', 'Bootstrap pinned npm immediately after setup-node: ' + label);
    }
  }
  return count;
}
const nodeWorkflows = readdirSync(resolve(root, '.github/workflows'))
  .filter(name => /\.ya?ml$/.test(name))
  .map(name => ['.github/workflows/' + name, parse(read('.github/workflows/' + name))]);
let nodeContexts = 0;
for (const [path, workflow] of nodeWorkflows) nodeContexts += assertSetupNodeBootstrapOrder(workflow, path);
assert(nodeContexts > 0, 'At least one real setup-node context must be checked');
const exampleWorkflow = {
  jobs: {example: {steps: [
    {uses: 'actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1', with: {'package-manager-cache': false}},
    {uses: './.github/actions/setup-npm'}
  ]}}
};
for (const mutation of ['explicit', 'implicit', 'enabled', 'order']) {
  const fixture = structuredClone(exampleWorkflow);
  const setup = fixture.jobs.example.steps[0];
  if (mutation === 'explicit') setup.with.cache = 'npm';
  if (mutation === 'implicit') delete setup.with['package-manager-cache'];
  if (mutation === 'enabled') setup.with['package-manager-cache'] = true;
  if (mutation === 'order') fixture.jobs.example.steps.reverse();
  assert.throws(() => assertSetupNodeBootstrapOrder(fixture, mutation), /pre-bootstrap|immediately/);
}

// Exercise actual npm devEngines in a temporary copy of this project's full package.
// The installed locked CLI keeps this regression portable when Node's bundled npm changes.
const packageBeforeCacheProbe = read('package.json');
const pinnedCacheCli = resolve(root, '_audit/ci/fixtures/npm-cli/node_modules/npm/bin/npm-cli.js');
const cacheEngineFixture = mkdtempSync(join(tmpdir(), 'cs-cache-devengines-'));
try {
  const fixturePackage = JSON.parse(packageBeforeCacheProbe);
  assert.equal(fixturePackage.devEngines.packageManager.version, expected);
  fixturePackage.devEngines.packageManager.version = '0.0.0';
  writeFileSync(join(cacheEngineFixture, 'package.json'), JSON.stringify(fixturePackage));
  const rejectedCache = spawnSync(process.execPath, [pinnedCacheCli, 'config', 'get', 'cache'], {cwd: cacheEngineFixture, encoding: 'utf8'});
  assert.notEqual(rejectedCache.status, 0, 'Cache discovery must enforce the fixture devEngines mismatch');
  assert.match(rejectedCache.stderr, /EBADDEVENGINES/);
  assert(rejectedCache.stderr.includes('0.0.0'), 'Failure must identify the controlled fixture requirement');
  writeFileSync(join(cacheEngineFixture, 'package.json'), packageBeforeCacheProbe);
  const acceptedCache = spawnSync(process.execPath, [pinnedCacheCli, 'config', 'get', 'cache'], {cwd: cacheEngineFixture, encoding: 'utf8'});
  assert.equal(acceptedCache.status, 0, 'Identical cache command succeeds after restoring the expected pin');
  assert(acceptedCache.stdout.trim());
} finally {
  rmSync(cacheEngineFixture, {recursive: true, force: true});
}
const pinnedCache = runPinnedNpm(root, ['config', 'get', 'cache'], {stdio: 'pipe'});
assert.equal(pinnedCache.status, 0, 'Actual project cache discovery succeeds through the locked CLI');
assert(pinnedCache.stdout.trim() && !/[\r\n]/.test(pinnedCache.stdout.trim()));
assert.equal(read('package.json'), packageBeforeCacheProbe, 'Cache regression must not weaken actual devEngines');
console.log(`PASS all ${nodeContexts} setup-node contexts disable early caching; actual npm rejects a controlled package mismatch and accepts the restored ${expected} pin`);

// Both documented script names are supported CLI entrypoints for the same producer.
function assertCssIndexEntrypoints(scripts) {
 assert.equal(scripts['build:css-index'], 'node scripts/generate-css-index.mjs');
 assert.equal(scripts['build:component-css-index'], scripts['build:css-index'], 'Retain the published component CSS index build entrypoint');
}
assertCssIndexEntrypoints(pkg.scripts);
const missingLegacyEntry = {...pkg.scripts};
delete missingLegacyEntry['build:component-css-index'];
assert.throws(() => assertCssIndexEntrypoints(missingLegacyEntry), /Retain the published/);
assert.throws(() => assertCssIndexEntrypoints({...pkg.scripts, 'build:component-css-index': 'node unrelated-producer.mjs'}), /Retain the published/);

const localVerify=read('scripts/verify-local.sh');
assert(localVerify.indexOf('node scripts/bootstrap-toolchain.mjs')<localVerify.indexOf('node scripts/npm.mjs run verify'),'Direct local verification bootstraps before guarded npm commands');
assert(localVerify.includes('node scripts/npm.mjs run verify:browser'));
assert(localVerify.includes('test "$(tr -d'), 'Local verification retains package/version equality');

function assertPinnedDeployment(config){
 assert.equal(config.installCommand,'node scripts/bootstrap-toolchain.mjs && node scripts/npm.mjs ci','Deployment installation must bootstrap before guarded ci');
 assert.equal(config.buildCommand,'node scripts/npm.mjs run build:site','Deployment build and nested npm commands must use pinned wrapper');
}
const deployment=JSON.parse(read('vercel.json'));assertPinnedDeployment(deployment);
assert.throws(()=>assertPinnedDeployment({...deployment,installCommand:'npm ci'}),/bootstrap before guarded ci/);
assert.throws(()=>assertPinnedDeployment({...deployment,buildCommand:'npm run build:site'}),/pinned wrapper/);

assert.equal(assertNpmVersion(pkg,expected+'\n'),expected);
for(const version of ['0.0.0','11.19.0','unknown'])assert.throws(()=>assertNpmVersion(pkg,version),/pinned npm/);
for(const manager of [undefined,'npm@^11.21.1','pnpm@11.21.1'])assert.throws(()=>assertNpmVersion({...pkg,packageManager:manager},expected),/exact npm/);
const fixture=resolve(root,'_audit/ci/fixtures/npm-cli'),cli=join(fixture,'node_modules/npm/bin/npm-cli.js');
assert.equal(JSON.parse(read('_audit/ci/fixtures/npm-cli/package.json')).dependencies.npm,expected);
const lock=JSON.parse(read('_audit/ci/fixtures/npm-cli/package-lock.json'));assert.equal(lock.packages['node_modules/npm'].version,expected);assert.match(lock.packages['node_modules/npm'].integrity,/^sha512-/);
assert.equal(pkg.devEngines.packageManager.version,expected);assert.equal(pkg.devEngines.packageManager.onFail,'error');assert(!pkg.scripts.preinstall,'Do not impose a source-only npm pin through a published installation hook');
const consumer=mkdtempSync(join(tmpdir(),'cs-toolchain-consumer-'));
try{
 mkdirSync(join(consumer,'dependency'));writeFileSync(join(consumer,'dependency/package.json'),JSON.stringify({name:'dev-engine-probe',version:'1.0.0',devEngines:{packageManager:{name:'npm',version:'0.0.0',onFail:'error'}}}));
 // Force only constructs this intentionally incompatible negative fixture; production bootstrap/install never uses force.
 const packed=spawnSync(process.execPath,[cli,'pack','--force','--ignore-scripts','--json','--pack-destination',consumer],{cwd:join(consumer,'dependency'),encoding:'utf8'});assert.equal(packed.status,0,packed.stderr);const tarball=JSON.parse(packed.stdout)[0].filename;
 writeFileSync(join(consumer,'package.json'),JSON.stringify({name:'source-consumer',private:true,version:'1.0.0',dependencies:{'dev-engine-probe':'file:./'+tarball}}));
 const install=spawnSync(process.execPath,[cli,'install','--ignore-scripts','--offline','--no-audit','--no-fund'],{cwd:consumer,encoding:'utf8'});assert.equal(install.status,0,'Actual packed transitive consumer must not inherit source devEngines: '+install.stderr);
 const reject=spawnSync(process.execPath,[cli,'run','--if-present','probe'],{cwd:join(consumer,'dependency'),encoding:'utf8'});assert.notEqual(reject.status,0);assert.match(reject.stderr,/EBADDEVENGINES/,'Mismatched source-project npm must fail before script execution');
}finally{rmSync(consumer,{recursive:true,force:true});}
const nested=mkdtempSync(join(tmpdir(),'cs-npm-nested-'));
try{
 mkdirSync(join(nested,'_audit/ci/fixtures'),{recursive:true});symlinkSync(fixture,join(nested,'_audit/ci/fixtures/npm-cli'),process.platform==='win32'?'junction':'dir');
 writeFileSync(join(nested,'package.json'),JSON.stringify({name:'nested-manager-probe',private:true,version:'1.0.0',packageManager:pkg.packageManager,devEngines:pkg.devEngines,scripts:{outer:'npm run inner',inner:'node -p process.env.npm_execpath'}}));
 const conflicting=join(nested,'conflicting-path');mkdirSync(conflicting);
 const fakeNode=join(conflicting,process.platform==='win32'?'node.cmd':'node');
 writeFileSync(fakeNode,process.platform==='win32'?'@exit /b 91\r\n':'#!/bin/sh\nexit 91\n');
 if(process.platform!=='win32')chmodSync(fakeNode,0o755);
 writeFileSync(join(nested,'probe-node.mjs'),'console.log(JSON.stringify({node:process.execPath,npm:process.env.npm_execpath}))');
 const nestedPackage=JSON.parse(readFileSync(join(nested,'package.json'),'utf8'));
 nestedPackage.scripts.inner='node probe-node.mjs';writeFileSync(join(nested,'package.json'),JSON.stringify(nestedPackage));
 const inheritedPath=Object.entries(process.env).find(([key])=>key.toUpperCase()==='PATH')?.[1]||'';
 const conflictingEnv=Object.fromEntries(Object.entries(process.env).filter(([key])=>key.toUpperCase()!=='PATH'));
 conflictingEnv.PATH=conflicting+(process.platform==='win32'?';':':')+inheritedPath;
 const protectedNode=runPinnedNpm(nested,['run','outer'],{stdio:'pipe',env:conflictingEnv});
 assert.equal(protectedNode.status,0,protectedNode.stderr);
 const observed=JSON.parse(protectedNode.stdout.split(/\r?\n/).find(line=>line.startsWith('{')));
 assert.equal(observed.node,process.execPath,'Nested commands must retain the invoking Node executable despite a conflicting inherited PATH');
 assert.match(observed.npm,/npm-cli[\\/]node_modules[\\/]npm[\\/]bin[\\/]npm-cli\.js/);
 nestedPackage.scripts.inner='node -p process.env.npm_execpath';writeFileSync(join(nested,'package.json'),JSON.stringify(nestedPackage));
 const result=runPinnedNpm(nested,['run','outer'],{stdio:'pipe'});assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/npm-cli[\\/]node_modules[\\/]npm[\\/]bin[\\/]npm-cli\.js/,'Nested npm commands resolve the pinned fixture even when the caller PATH selects another npm');
}finally{rmSync(nested,{recursive:true,force:true});}
const first=generateSbom(root,cli),second=generateSbom(root,cli);assert.deepEqual(first,second,'Only optional UUID/time normalization yields reproducible actual CLI output');
const raw=spawnSync(process.execPath,[cli,'sbom','--package-lock-only','--sbom-format','cyclonedx','--include=dev','--include=optional','--include=peer'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});assert.equal(raw.status,0,raw.stderr);
const native=JSON.parse(raw.stdout),normalized=structuredClone(native);delete normalized.serialNumber;delete normalized.metadata.timestamp;assert.deepEqual(first,normalized,'All component/dependency/metadata semantics remain exact');
assert.equal(first.specVersion,'1.5');assert(first.components.length>0 && first.dependencies.length>0);
for(const mutate of [x=>x.specVersion='1.4',x=>delete x.components,x=>delete x.dependencies,x=>delete x.metadata.tools]){const bad=structuredClone(native);mutate(bad);assert.throws(()=>reproducibleSbom(bad));}
assert.equal(reproducibleSbom({...native,reviewMarker:'retained'}).reviewMarker,'retained','Unknown nonvolatile data must never silently disappear');
const scratch=mkdtempSync(join(tmpdir(),'cs-verification-cli-'));let server;
try{
 writeFileSync(join(scratch,'dashboard.html'),'<!doctype html><title>Ready</title>');mkdirSync(join(scratch,'dir'));writeFileSync(join(scratch,'dir/index.html'),'Directory');writeFileSync(join(scratch,'probe.js'),'window.probe=true');
 server=await serveVerification({root:scratch,port:0});const base='http://127.0.0.1:'+server.address().port;
 await waitVerification(base+'/dashboard.html',{timeout:1000});
 const head=await fetch(base+'/dashboard.html',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 assert.equal(await(await fetch(base+'/dir/')).text(),'Directory');assert.match((await fetch(base+'/probe.js')).headers.get('content-type'),/javascript/);
 await assert.rejects(()=>waitVerification(base+'/missing',{timeout:40,interval:5}),/timed out/);
 await assert.rejects(()=>waitVerification('https://example.com/',{timeout:10}),/loopback HTTP/);
 const conflict=server.address().port;await assert.rejects(()=>serveVerification({root:scratch,port:conflict}),/EADDRINUSE/);
 await new Promise(done=>server.close(done));server=null;
 const delayed=createServer((request,response)=>{response.writeHead(delayed.ready?200:503);response.end()});await new Promise(done=>delayed.listen(0,'127.0.0.1',done));
 try{const ready=waitVerification('http://127.0.0.1:'+delayed.address().port,{timeout:1000,interval:5});setTimeout(()=>{delayed.ready=true},30);await ready;}finally{await new Promise(done=>delayed.close(done));}
}finally{if(server)await new Promise(done=>server.close(done));rmSync(scratch,{recursive:true,force:true});}
for(const path of ['.github/workflows/design-system-gates.yml','.github/workflows/release.yml','.github/workflows/npm-publish.yml','.github/workflows/sbom.yml','.github/workflows/native-store.yml']){
 const workflow=parse(read(path));for(const job of Object.values(workflow.jobs)){
  const steps=job.steps||[];for(let i=0;i<steps.length;i++)if(steps[i].uses?.startsWith('actions/setup-node@'))assert.equal(steps[i+1]?.uses,'./.github/actions/setup-npm','Every existing setup-node context bootstraps pinned npm before installation: '+path);
 }
 assert(!/npx --yes (?:serve|wait-on|@cyclonedx)/.test(read(path)),'No remote execution of formerly unlocked CLI graphs');
}
const action=parse(read('.github/actions/setup-npm/action.yml'));assert.equal(action.runs.steps[0].run,'node scripts/bootstrap-toolchain.mjs --github-path');
assert.equal(action.runs.steps[1].id, 'npm-cache');
assert(action.runs.steps[1].run.includes("runPinnedNpm(process.cwd(), ['config', 'get', 'cache']"), 'Cache path discovery uses the locked CLI after bootstrap');
assert.equal(action.runs.steps[2].uses, 'actions/cache@55cc8345863c7cc4c66a329aec7e433d2d1c52a9');
assert.equal(action.runs.steps[2].with.path, '${{ steps.npm-cache.outputs.path }}');
assert(action.runs.steps[2].with.key.includes("hashFiles('package-lock.json'"), 'Restored downloads remain keyed to maintained locks');
const cacheOutputFixture = mkdtempSync(join(tmpdir(), 'cs-pinned-cache-output-'));
try {
 const outputFile = join(cacheOutputFixture, 'output');
 writeFileSync(outputFile, '');
 const cacheStep = spawnSync('bash', ['-e', '-c', action.runs.steps[1].run], {cwd: root, env: {...process.env, GITHUB_OUTPUT: outputFile}, encoding: 'utf8'});
 assert.equal(cacheStep.status, 0, cacheStep.stderr);
 assert.equal(readFileSync(outputFile, 'utf8'), 'path=' + pinnedCache.stdout.trim() + '\n', 'Actual composite cache step emits the guarded cache path after bootstrap');
} finally {
 rmSync(cacheOutputFixture, {recursive: true, force: true});
}


assert(read('scripts/bootstrap-toolchain.mjs').includes("from 'node:os'"),'Native path delimiter/newline must work on Windows/macOS/Linux');
assert.equal(findBootstrapNpm({execPath:process.execPath,env:{npm_execpath:cli,PATH:''}}),await import('node:fs').then(fs=>fs.realpathSync(cli)));
assert.throws(()=>findBootstrapNpm({execPath:join(tmpdir(),'missing-node'),env:{PATH:''}}),/No installed npm CLI/);
console.log('PASS locked npm/bootstrap contract, actual reproducible CycloneDX1.5 inventories, malformed/manager negatives, HTTP/HEAD/directories/readiness/timeout/address-conflict fixtures and all existing setup-node contexts');
