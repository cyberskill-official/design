import assert from 'node:assert/strict';
import {existsSync,readFileSync,realpathSync,appendFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {dirname,resolve,delimiter} from 'node:path';
import {fileURLToPath} from 'node:url';
import {EOL} from 'node:os';
import {assertNpmVersion} from './check-npm-version.mjs';
export function findBootstrapNpm({execPath=process.execPath,env=process.env}={}) {
  const candidates=[env.npm_execpath];
  for(const dir of [dirname(execPath),...(env.PATH||'').split(delimiter)])if(dir){
    candidates.push(resolve(dir,'node_modules/npm/bin/npm-cli.js'),resolve(dir,'../lib/node_modules/npm/bin/npm-cli.js'));
    const bin=resolve(dir,'npm');if(existsSync(bin))try{candidates.push(realpathSync(bin))}catch{}
  }
  for(const path of candidates.filter(Boolean))if(existsSync(path)){
    const actual=realpathSync(path);
    if(!actual.endsWith('npm-cli.js'))continue;
    try{if(JSON.parse(readFileSync(resolve(dirname(actual),'../package.json'),'utf8')).name==='npm')return actual;}catch{}
  }
  throw Error('No installed npm CLI found; use the npm bundled with Node or pass --npm-cli /path/to/npm-cli.js');
}
export function bootstrapToolchain(root,{cli=findBootstrapNpm(),githubPath}={}) {
  const fixture=resolve(root,'_audit/ci/fixtures/npm-cli');
  const result=spawnSync(process.execPath,[cli,'ci','--prefix',fixture,'--ignore-scripts','--no-audit','--no-fund'],{cwd:root,stdio:'inherit'});
  assert(!result.error&&!result.signal&&result.status===0,'Locked npm bootstrap failed');
  const pinned=resolve(fixture,'node_modules/npm/bin/npm-cli.js'),version=spawnSync(process.execPath,[pinned,'--version'],{encoding:'utf8'});
  assert.equal(version.status,0,'Pinned npm CLI unavailable');assertNpmVersion(JSON.parse(readFileSync(resolve(root,'package.json'),'utf8')),version.stdout);
  const bin=resolve(fixture,'node_modules/.bin');if(githubPath)appendFileSync(githubPath,bin+EOL);
  return{cli:pinned,bin,version:version.stdout.trim()};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2),index=args.indexOf('--npm-cli');
  const result=bootstrapToolchain(fileURLToPath(new URL('../',import.meta.url)),{cli:index<0?findBootstrapNpm():args[index+1],githubPath:args.includes('--github-path')?process.env.GITHUB_PATH:undefined});
  if(args.includes('--github-path'))assert(process.env.GITHUB_PATH,'GITHUB_PATH must be provided by Actions');
  console.log('PASS locked npm '+result.version+'; add '+result.bin+' to PATH, or invoke: node scripts/npm.mjs ci');
}
