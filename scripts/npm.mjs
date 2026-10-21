import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve,delimiter,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {assertNpmVersion} from './check-npm-version.mjs';
export function runPinnedNpm(root,args,{env=process.env,stdio='inherit'}={}) {
  const fixture=resolve(root,'_audit/ci/fixtures/npm-cli'),cli=resolve(fixture,'node_modules/npm/bin/npm-cli.js');
  assert(existsSync(cli),'Run node scripts/bootstrap-toolchain.mjs first');
  const version=spawnSync(process.execPath,[cli,'--version'],{encoding:'utf8'});
  assert.equal(version.status,0,'Pinned npm CLI unavailable');assertNpmVersion(JSON.parse(readFileSync(resolve(root,'package.json'),'utf8')),version.stdout);
  const pathKey=Object.keys(env).find(key=>key.toUpperCase()==='PATH'),childEnv={...env};
  for(const key of Object.keys(childEnv))if(key.toUpperCase()==='PATH')delete childEnv[key];
  childEnv.PATH=resolve(fixture,'node_modules/.bin')+delimiter+dirname(process.execPath)+delimiter+(pathKey?env[pathKey]:'');
  return spawnSync(process.execPath,[cli,...args],{cwd:root,env:childEnv,stdio,encoding:'utf8'});
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const result=runPinnedNpm(fileURLToPath(new URL('../',import.meta.url)),process.argv.slice(2));
  if(result.error)throw result.error;
  process.exitCode=result.signal?1:result.status??1;
}
