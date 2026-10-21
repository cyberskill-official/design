import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {buildContract,renderBlock,replaceBlock} from './lib/guidance-contract.mjs';
import {routeEntry,stripEntryRoute} from './lib/entrypoint-languages.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function outputs(read=path=>readFileSync(resolve(root,path),'utf8')) {
  const contract=buildContract(JSON.parse(read('scripts/guidance-source.json')),read('docs/doctrine.md'),JSON.parse(read('package.json')),read('scripts/guidance-source.json')),block=renderBlock(contract);
  const result=new Map([['guidance/agent-contract.json',JSON.stringify(contract,null,2)+'\n']]);
  for(const file of ['SKILL.md','AGENTS.md','llms.txt','CONTRIBUTING.md']) result.set(file,replaceBlock(read(file),block));
  for(const file of ['CLAUDE.md','GEMINI.md']) {
    const text=`# ${file}\n\nRepository workflow: [AGENTS.md](AGENTS.md). This host shim projects the shared portable contract.\n\n${block}\n`;
    result.set(file,read(file)!==stripEntryRoute(read(file))?routeEntry(text,file):text);
  }
  const readme=read('README.md'),a='<!-- BEGIN DOCTRINE IMMUTABLES -->',b='<!-- END DOCTRINE IMMUTABLES -->';
  if(readme.split(a).length!==2||readme.split(b).length!==2)throw Error('One owned README immutable block required');
  const table='| Immutable | Value |\n|---|---|\n'+Object.entries(contract.immutables).map(([key,value])=>`| ${key} | ${value} |`).join('\n');
  result.set('README.md',readme.slice(0,readme.indexOf(a))+a+'\n'+table+'\n'+b+readme.slice(readme.indexOf(b)+b.length));
  return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const check=process.argv.includes('--check');
  for(const[path,value]of outputs()) {
    if(check) {if(readFileSync(resolve(root,path),'utf8')!==value)throw Error(`Stale generated guidance: ${path}`);}
    else writeFileSync(resolve(root,path),value);
  }
  console.log(`PASS portable guidance ${check?'freshness':'generation'}: doctrine-derived policy, bounded entry blocks and host shims.`);
}
