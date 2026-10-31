import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync,mkdtempSync,copyFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join} from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {collectTokenDeclarations} from '../../scripts/lib/token-declarations.mjs';
import {projectBaseTokens} from '../../scripts/lib/base-token-exports.mjs';
import {projectDtcg} from '../../scripts/lib/project-dtcg.mjs';
import {nativeTokenName,assertUniqueNativeNames} from '../../scripts/lib/dtcg-values.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),read=p=>readFileSync(join(root,p),'utf8');
const pairs=JSON.parse(read('_audit/ci/fixtures/a01-token-aliases/aliases.json')).aliases,inventory=JSON.parse(read('tokens/base-inventory.json'));
assert.deepEqual(Object.values(inventory.groups).flatMap(g=>Object.keys(g)).filter(n=>/[A-Z]/.test(n)).sort(),pairs.map(p=>p.legacy).sort());
const json=projectBaseTokens(collectTokenDeclarations(root),{root:{}},inventory),doc=projectDtcg(JSON.parse(read('tokens/tokens.dtcg.json')),json,inventory).doc;
for(const p of pairs){const d=doc[p.group][p.alias];assert.equal(nativeTokenName(p.alias,d),nativeTokenName(p.legacy)+'Alias');assert.equal(d.$extensions['com.cyberskill'].nativeFormat,undefined);}
for(const mutate of [d=>delete d.$extensions['com.cyberskill'].nativeAliasOf,d=>d.$extensions['com.cyberskill'].nativeName='arbitrary',d=>d.$extensions['com.cyberskill'].css='var(--cs-unrelated)',d=>d.$type='color']){const p=pairs[0],d=structuredClone(doc[p.group][p.alias]);mutate(d);assert.throws(()=>nativeTokenName(p.alias,d),/Invalid native alias/);}
assert.throws(()=>assertUniqueNativeNames([{name:'duplicate'},{name:'duplicate'}]),/collision/);
// Execute the independent browser-gate naming implementation, not the producer.
const board=read('_audit/token-pipeline-test.html'),start=board.indexOf('function nativeName('),end=board.indexOf('const parseColor=',start);
const context=vm.createContext({assert:(ok,message)=>assert.ok(ok,message),camel:n=>nativeTokenName(n)});vm.runInContext(board.slice(start,end)+';globalThis.project=nativeName',context);
for(const p of pairs)assert.equal(context.project(p.alias,doc[p.group][p.alias]),nativeTokenName(p.alias,doc[p.group][p.alias]));
const malformed=structuredClone(doc[pairs[0].group][pairs[0].alias]);malformed.$extensions['com.cyberskill'].nativeName='duplicate';assert.throws(()=>context.project(pairs[0].alias,malformed),/Invalid native alias/);

const scratch=mkdtempSync(join(tmpdir(),'cs-native-aliases-'));
try{
 for(const p of ['_audit/ci/generate-native-tokens.mjs','_audit/lib/dtcg-profile.mjs','scripts/lib/dtcg-values.mjs','VERSION']){mkdirSync(dirname(join(scratch,p)),{recursive:true});copyFileSync(join(root,p),join(scratch,p));}
 mkdirSync(join(scratch,'tokens/native'),{recursive:true});writeFileSync(join(scratch,'tokens/tokens.dtcg.json'),JSON.stringify(doc));
 const run=spawnSync(process.execPath,['_audit/ci/generate-native-tokens.mjs'],{cwd:scratch,encoding:'utf8'});assert.equal(run.status,0,run.stderr);
 for(const p of ['CSTokens.swift','CSTokens.kt','cs_tokens.dart']){
  const old=read('tokens/native/'+p),current=readFileSync(join(scratch,'tokens/native',p),'utf8');
  const constants=text=>text.split('\n').filter(l=>/^\s+(?:public static let|val |static const )/.test(l));
  for(const line of constants(old))assert.ok(current.split('\n').includes(line),'Old native constant changed: '+p+' '+line);
  for(const pair of pairs)for(const suffix of ['',...(['compact','comfortable'].filter(s=>Object.hasOwn(doc.$extensions['com.cyberskill'].overrides.densities[s],pair.alias)).map(s=>s[0].toUpperCase()+s.slice(1)))]){
   const oldName=nativeTokenName(pair.legacy)+suffix,newName=nativeTokenName(pair.alias,doc[pair.group][pair.alias])+suffix;
   const target=constants(current).find(l=>new RegExp('\\b'+newName+'\\b').test(l));assert.ok(target,'Missing '+p+' '+newName);assert.ok(!/String|"|\{/.test(target),'Alias must be numeric '+target);
   const previous=constants(current).find(l=>new RegExp('\\b'+oldName+'\\b').test(l));assert.equal(target.replace(newName,'TOKEN'),previous.replace(oldName,'TOKEN'),'Numeric alias parity '+p+' '+suffix);
  }
 }
 // Omitting reviewed native metadata must fail on the real collision before any output.
 const bad=structuredClone(doc);const aliasDef=bad[pairs[0].group][pairs[0].alias],legacyDef=bad[pairs[0].group][pairs[0].legacy];delete aliasDef.$extensions['com.cyberskill'].nativeAliasOf;delete aliasDef.$extensions['com.cyberskill'].nativeName;legacyDef.$value=`{${pairs[0].group}.${pairs[0].alias}}`;legacyDef.$extensions['com.cyberskill'].nativeFormat='css';writeFileSync(join(scratch,'tokens/tokens.dtcg.json'),JSON.stringify(bad));
 const before=readFileSync(join(scratch,'tokens/native/CSTokens.swift'),'utf8'),failed=spawnSync(process.execPath,['_audit/ci/generate-native-tokens.mjs'],{cwd:scratch,encoding:'utf8'});assert.notEqual(failed.status,0);assert.match(failed.stderr,/identifier collision/);assert.equal(readFileSync(join(scratch,'tokens/native/CSTokens.swift'),'utf8'),before);
 console.log('PASS22 typed native aliases, all established constants byte-identical in3targets, both density scopes, metadata and real fail-before-write collision negatives');
}finally{rmSync(scratch,{recursive:true,force:true});}
