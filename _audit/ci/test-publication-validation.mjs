import assert from 'node:assert/strict';
import {mkdtempSync,realpathSync,mkdirSync,writeFileSync,readFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {parse} from 'yaml';
import {parsePublicationArguments} from '../../scripts/validate-publication.mjs';
import {publicationCommands,runPublicationValidation,verifyPublicationReceipt,parseRegistryResult,executePublicationCommand} from '../../scripts/lib/publication-validation.mjs';
const hash=(bytes,algorithm='sha256',encoding='hex')=>createHash(algorithm).update(bytes).digest(encoding);
const sandbox=realpathSync(mkdtempSync(join(tmpdir(),'cs-publication-fixture-'))),root=join(sandbox,'source');
mkdirSync(root);
const put=(path,value)=>{mkdirSync(dirname(join(root,path)),{recursive:true});writeFileSync(join(root,path),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n')};
const git=args=>{const result=spawnSync('git',args,{cwd:root,encoding:'utf8'});assert.equal(result.status,0,result.stderr);return result.stdout.trim()};
const commit=()=>{git(['add','.']);git(['-c','user.name=Fixture only','-c','user.email=fixture@example.invalid','commit','-m','Fixture only']);return git(['rev-parse','HEAD'])};
try {
 put('VERSION','1.7.2\n');put('package.json',{name:'@cyberskill/design',version:'1.7.2',packageManager:'npm@11.21.1'});put('package-lock.json',{version:'1.7.2',packages:{'':{version:'1.7.2'}}});
 put('evidence.txt','Isolated fixture evidence only');put('_ds_manifest.json',{components:[{name:'Fixture',kind:'component',sourcePath:'fixture.jsx'}]});
 put('components/maintainers.json',{schemaVersion:1,maintainers:[{name:'fixture-owner',roles:['owner']},{name:'fixture-reviewer',roles:['reviewer']}]});
 const policy=JSON.parse(readFileSync('components/release-compatibility.json','utf8'));policy.pendingChanges=[];policy.baselineVersion='1.7.1';put('components/release-compatibility.json',policy);
 const lifecycle={supportContractVersion:1,components:{Fixture:{status:'stable',kind:'component',sourcePath:'fixture.jsx',support:{reviewState:'reviewed',owner:'fixture-owner',reviewedBy:'fixture-reviewer',reviewedAt:'2026-10-20T00:00:00Z',environments:['Isolated test fixture'],axes:['Fixture only'],limitations:['Not product acceptance'],deprecation:null,evidence:[{path:'evidence.txt',sha256:hash('Isolated fixture evidence only'),checkedAt:'2026-10-20T00:00:00Z',scope:'Fixture only'}]}}}};
 put('components/lifecycle.json',lifecycle);git(['init','-q']);const sourceSha=commit();git(['tag','v1.7.2']);
 const context={sourceSha,ref:'refs/tags/v1.7.2',repository:'fixture/repository',runId:'12',runAttempt:'1',eventName:'workflow_dispatch',manualAcceptanceAttested:true};
 const calls=[];
 const runner=(cwd,args,env)=>{calls.push({args,env});if(args[0]==='--version')return{status:0,stdout:'11.21.1\n'};if(args[0]==='pack'){const filename='cyberskill-design-1.7.2.tgz',bytes=Buffer.from('Fixture tarball bytes: not a real publication candidate');writeFileSync(join(args.at(-1),filename),bytes);return{status:0,stdout:JSON.stringify([{name:'@cyberskill/design',version:'1.7.2',filename,shasum:hash(bytes,'sha1'),integrity:'sha512-'+hash(bytes,'sha512','base64')}])}}return{status:0}};
 const directory=join(sandbox,'candidate');const result=runPublicationValidation(root,context,{directory,run:runner});
 assert.deepEqual(calls.slice(1,-1),publicationCommands.map(({args,env})=>({args,env})));assert(!calls.some(({args})=>args.includes('publish')));assert.deepEqual(publicationCommands.filter(c=>c.name.startsWith('owned-story-plays-')).map(c=>c.env.CS_TEST_BROWSER),['chromium','firefox','webkit']);
 const receiptPath=join(directory,'receipt.json');const check=(expectedSha256=result.receiptSha256,ctx=context)=>verifyPublicationReceipt(root,ctx,{receiptPath,expectedSha256,packageDirectory:directory,run:runner});
 assert.equal(check().validationVerified,true);assert.equal(check().publicationAuthorized,false);
 const original=readFileSync(receiptPath);
 for(const mutate of [r=>r.commands.pop(),r=>r.commands.reverse(),r=>r.commands[0].args=['publish'],r=>r.commands[3].env={CS_UNIT_SHARD:'1/4'},r=>r.commands[0].exitCode=1,r=>r.commands[0].elapsedMs=-1,r=>r.status='running',r=>r.package.filename='../evil.tgz',r=>r.package.sha256='0'.repeat(64),r=>r.package.bytes++,r=>r.context.runAttempt='2',r=>r.source.tree='a'.repeat(40)]){const receipt=JSON.parse(original);mutate(receipt);const changed=JSON.stringify(receipt);writeFileSync(receiptPath,changed);assert.throws(()=>check(hash(changed)),'Recomputed digest must not authorize forged receipt semantics')}
 writeFileSync(receiptPath,original);assert.throws(()=>check('0'.repeat(64)),/digest/);
 for(const changes of [{sourceSha:'a'.repeat(40)},{ref:'refs/tags/v1.7.3'},{repository:'other/repository'},{runId:'13'},{runAttempt:'2'},{eventName:'release',manualAcceptanceAttested:false},{manualAcceptanceAttested:false}])assert.throws(()=>check(result.receiptSha256,{...context,...changes}));
 put('evidence.txt','Dirty changed evidence');assert.throws(()=>check(),/clean checkout/);git(['checkout','--','evidence.txt']);
 const failing=join(sandbox,'failed');assert.throws(()=>runPublicationValidation(root,context,{directory:failing,run:(cwd,args,env)=>args[0]==='--version'?runner(cwd,args,env):{status:1}}),/gate failed/);assert.equal(JSON.parse(readFileSync(join(failing,'receipt.json'))).status,'failed');
 const mutation=join(sandbox,'mutation');assert.throws(()=>runPublicationValidation(root,context,{directory:mutation,run:(cwd,args,env)=>{if(args[0]!=='--version')put('evidence.txt','Changed during gate');return runner(cwd,args,env)}}),/clean checkout/);git(['checkout','--','evidence.txt']);
 lifecycle.components.Fixture.support.reviewState='unreviewed';put('components/lifecycle.json',lifecycle);const unreviewedSha=commit();git(['tag','-f','v1.7.2']);assert.throws(()=>runPublicationValidation(root,{...context,sourceSha:unreviewedSha},{directory:join(sandbox,'unreviewed'),run:runner}),/fresh authorized support review/);
 git(['reset','--hard',sourceSha]);git(['tag','-f','v1.7.2']);
 const malformed=join(sandbox,'malformed-pack');assert.throws(()=>runPublicationValidation(root,context,{directory:malformed,run:(cwd,args,env)=>args[0]==='pack'?{status:0,stdout:'[]'}:runner(cwd,args,env)}));
 const staleLifecycle=JSON.parse(JSON.stringify(lifecycle));staleLifecycle.components.Fixture.support.reviewState='reviewed';put('components/lifecycle.json',staleLifecycle);put('evidence.txt','Committed stale evidence');const staleSha=commit();git(['tag','-f','v1.7.2']);assert.throws(()=>runPublicationValidation(root,{...context,sourceSha:staleSha},{directory:join(sandbox,'stale'),run:runner}),/Support evidence changed/);git(['reset','--hard',sourceSha]);git(['tag','-f','v1.7.2']);
 for(const args of [[],['--run'],['--check','--receipt','a'],['--registry','--run'],['--registry','--command','publish'],['--run','--directory','a','--directory','b']])assert.throws(()=>parsePublicationArguments(args));
 assert.deepEqual(parsePublicationArguments(['--registry']),{mode:'registry'});
 const linked=join(sandbox,'dangling'),outside=join(sandbox,'must-not-exist');symlinkSync(outside,linked);assert.throws(()=>runPublicationValidation(root,context,{directory:linked,run:runner}),/symlink/);
 assert.equal(parseRegistryResult({status:0,stdout:'"1.7.2"'},'1.7.2'),true);assert.equal(parseRegistryResult({status:1,stdout:JSON.stringify({error:{code:'E404'}})},'1.7.2'),false);
 for(const value of [{status:1,stdout:'not JSON'},{status:1,stdout:JSON.stringify({error:{code:'E401'}})},{status:1,stdout:JSON.stringify({error:{code:'E503'}})},{status:0,stdout:'"1.7.3"'},{status:null,signal:'SIGTERM',stdout:''}])assert.throws(()=>parseRegistryResult(value,'1.7.2'));
 // Actual spawned child: inherited selection/evidence controls cannot silently narrow mandatory gates.
 const bin=join(sandbox,'bin');mkdirSync(bin);writeFileSync(join(bin,'npm'),'#!'+process.execPath+'\nprocess.stdout.write(JSON.stringify({env:process.env,args:process.argv.slice(2)}));\n',{mode:0o755});
 const old={...process.env};try{process.env.PATH=bin+':'+process.env.PATH;for(const key of ['CS_UNIT_SHARD','CS_UNIT_PLAN','CS_UNIT_REPORT_DIR','CS_BROWSER','CS_TEST_BROWSER','CS_AXE_SCENE_REPORT','CS_BROWSER_COMPAT_EVIDENCE','CS_CARD_EVIDENCE_PATH'])process.env[key]='hostile-inherited-selection';process.env.CS_PDF_PYTHON='/fixture/pinned-python';process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN='fixture-token';process.env.GITHUB_OUTPUT='fixture-output';
 const full=JSON.parse(executePublicationCommand(root,['run','verify'],{},true).stdout);assert.deepEqual(full.args,['run','verify']);assert.equal(full.env.CS_PDF_PYTHON,'/fixture/pinned-python');assert.deepEqual(Object.keys(full.env).filter(k=>k.startsWith('CS_')),['CS_PDF_PYTHON']);assert.equal(full.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN,undefined);assert.equal(full.env.GITHUB_OUTPUT,undefined);
 for(const browser of ['chromium','firefox','webkit']){const child=JSON.parse(executePublicationCommand(root,['run','test:storybook-runtime'],{CS_TEST_BROWSER:browser},true).stdout);assert.equal(child.env.CS_TEST_BROWSER,browser);assert.equal(child.env.CS_BROWSER,undefined);assert.equal(child.env.CS_UNIT_SHARD,undefined)}}finally{for(const key of Object.keys(process.env))if(!Object.hasOwn(old,key))delete process.env[key];Object.assign(process.env,old)}
 const workflow=parse(readFileSync('.github/workflows/npm-publish.yml','utf8'));assert.deepEqual(workflow.permissions,{contents:'read'});assert.equal(workflow.jobs.validate.permissions['id-token'],undefined);assert.equal(workflow.jobs.publish.permissions['id-token'],'write');assert.match(workflow.jobs.publish.if,/workflow_dispatch/);assert.match(workflow.jobs.publish.if,/accept_evidence_review/);
 const validate=workflow.jobs.validate.steps,publish=workflow.jobs.publish.steps;assert(validate.some(s=>s.run?.includes('validate-publication.mjs --run')));assert(publish.findIndex(s=>s.run?.includes('validate-publication.mjs --check'))<publish.findIndex(s=>s.run?.startsWith('npm publish')));assert(publish.find(s=>s.run?.startsWith('npm publish')).run.includes('--ignore-scripts --provenance'));assert(!publish.some(s=>s.run?.includes('npm ci')));assert(![...validate,...publish].some(s=>s['continue-on-error']));
 for(const step of [...validate,...publish].filter(s=>s.uses&&!s.uses.startsWith('./')))assert.match(step.uses,/@[a-f0-9]{40}$/);
 console.log('PASS publication fixture: real exact Git/tag/tree identity, fixture-only support, canonical complete gates, immutable receipt/tarball, forged/cross-run/dirty/unreviewed/failure/symlink/registry rejection, real child environment isolation, separate manual OIDC workflow; no publication performed');
}finally{rmSync(sandbox,{recursive:true,force:true})}
