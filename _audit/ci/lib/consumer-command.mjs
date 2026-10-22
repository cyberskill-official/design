import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve,dirname,delimiter} from 'node:path';
import {assertNpmVersion} from '../../../scripts/check-npm-version.mjs';
export function runConsumerCommand(root,executable,args,{cwd=root,env=process.env}={}) {
 const options={cwd,encoding:'utf8',maxBuffer:32*1024*1024,env:{...env,PATH:dirname(process.execPath)+delimiter+(env.PATH||'')}};
 if(executable!=='npm')return execFileSync(executable,args,options);
 const cli=resolve(root,'_audit/ci/fixtures/npm-cli/node_modules/npm/bin/npm-cli.js');
 const version=execFileSync(process.execPath,[cli,'--version'],{encoding:'utf8'});
 assertNpmVersion(JSON.parse(readFileSync(resolve(root,'package.json'),'utf8')),version);
 return execFileSync(process.execPath,[cli,...args],options);
}
