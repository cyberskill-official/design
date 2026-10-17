import assert from 'node:assert/strict';
import{mkdtempSync,mkdirSync,readFileSync,writeFileSync,cpSync,existsSync,realpathSync,symlinkSync}from'node:fs';
import{tmpdir}from'node:os';import{join}from'node:path';import{fileURLToPath}from'node:url';import{spawnSync}from'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url)),base=realpathSync(mkdtempSync(join(tmpdir(),'cs-figma-variables-errors-'))),results=[];
const cases=[
 {name:'file-content-scope',stage:'file',status:403,message:'Invalid scope(s): file_content:read',exit:1,calls:1,skip:false},
 {name:'aliased-file-content-scope',alias:true,stage:'file',status:403,message:'Invalid scope(s): file_content:read',exit:1,calls:1,skip:false},
 {name:'file-content-enterprise-wording',stage:'file',status:403,message:'Invalid scope(s): file_content:read. Enterprise plan only; file_variables:read',exit:1,calls:1,skip:false},
 {name:'file-unauthorized-status-body',stage:'file',status:401,message:'403 Enterprise plan only; file_variables:read',exit:1,calls:1,skip:false},
 {name:'variable-read-scope',stage:'variables',status:403,message:'Invalid scope(s): file_variables:read',exit:0,calls:2,skip:true,reason:'variables_api_access'},
 {name:'variable-read-access',stage:'variables',status:403,message:'File cannot be accessed by this account',exit:0,calls:2,skip:true,reason:'variables_api_access'},
 {name:'variable-write-access',stage:'write',status:403,message:'File cannot be edited by this account',exit:1,calls:3,skip:false},
 {name:'variable-write-scope',stage:'write',status:403,message:'Invalid scope(s): file_variables:write',exit:0,calls:3,skip:true,reason:'variables_api_access'},
 {name:'variable-bad-request-with-access-words',stage:'variables',status:400,message:'Bad payload; file_variables:read Enterprise plan only',exit:1,calls:2,skip:false},
 {name:'file-not-found',stage:'file',status:404,message:'File not found',exit:0,calls:1,skip:true,reason:'figma_api_unavailable'},
 {name:'variables-rate-limit',stage:'variables',status:429,message:'Rate limit',exit:0,calls:2,skip:true,reason:'figma_api_unavailable'},
 {name:'variables-unavailable',stage:'variables',status:503,message:'Unavailable',exit:0,calls:2,skip:true,reason:'figma_api_unavailable'},
 {name:'variables-not-found',stage:'variables',status:404,message:'Variables endpoint not found',exit:0,calls:2,skip:true,reason:'figma_api_unavailable'},
 {name:'invalid-color-status-text',stage:'invalid-colors',value:'invalid 404',exit:1,calls:0,skip:false},
 {name:'invalid-color-enterprise-text',stage:'invalid-colors',value:'Enterprise plan only',exit:1,calls:0,skip:false},
 {name:'valid-read-only-check',stage:'success',exit:0,calls:2,skip:false},
];
for(const entry of cases){
 const dir=join(base,entry.name);mkdirSync(dir,{recursive:true});
 for(const rel of ['_audit/ci/push-figma-variables.mjs','_audit/ci/ci-verdict.mjs','scripts/lib/dtcg-values.mjs','tokens/tokens.dtcg.json']){mkdirSync(join(dir,rel,'..'),{recursive:true});cpSync(join(root,rel),join(dir,rel));}
 if(entry.stage==='invalid-colors')writeFileSync(join(dir,'tokens/tokens.dtcg.json'),JSON.stringify({color:{broken:{$type:'color',$value:entry.value}}}));
 writeFileSync(join(dir,'fixture.json'),JSON.stringify(entry));
 writeFileSync(join(dir,'mock-fetch.mjs'),`import{readFileSync,writeFileSync}from'node:fs';const config=JSON.parse(readFileSync(new URL('./fixture.json',import.meta.url)));const calls=[];globalThis.fetch=async(url,options={})=>{const method=options.method||'GET',path=new URL(url).pathname+new URL(url).search;const file='/v1/files/scope-fixture?depth=1',local='/v1/files/scope-fixture/variables/local',write='/v1/files/scope-fixture/variables';if(new URL(url).origin!=='https://api.figma.com'||![(method==='GET'&&path===file),(method==='GET'&&path===local),(method==='POST'&&path===write)].some(Boolean))throw Error('Unapproved fixture request '+method+' '+path);calls.push({method,path});writeFileSync(new URL('./calls.json',import.meta.url),JSON.stringify(calls));let stage=path===file?'file':method==='POST'?'write':'variables';if(config.stage===stage)return new Response(JSON.stringify({err:config.message}),{status:config.status});if(stage==='file')return new Response(JSON.stringify({name:'Fixture',lastModified:'fixture-date'}));if(stage==='variables')return new Response(JSON.stringify({meta:{variableCollections:{},variables:{}}}));throw Error('Unexpected write in fixture');};`);
 const cli=join(dir,'_audit/ci/push-figma-variables.mjs'),argvCli=entry.alias?join(dir,'argv-alias.mjs'):cli;
 if(entry.alias)symlinkSync(cli,argvCli);
 const args=['--import',join(dir,'mock-fetch.mjs'),argvCli,...(entry.stage==='write'?[]:['--check'])];
 const run=spawnSync(process.execPath,args,{cwd:dir,encoding:'utf8',timeout:20000,env:{PATH:process.env.PATH,FIGMA_TOKEN:'fixture-token-not-a-real-secret',FIGMA_FILE_KEY:'scope-fixture',GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'pull_request',GITHUB_REF:'refs/pull/fixture/merge',GITHUB_STEP_SUMMARY:join(dir,'summary.md')}});
 const reportPath=join(dir,'_audit/ci/figma-push-report.json'),report=existsSync(reportPath)?JSON.parse(readFileSync(reportPath)):null,callsPath=join(dir,'calls.json'),calls=existsSync(callsPath)?JSON.parse(readFileSync(callsPath)):[];
 const observed={name:entry.name,status:run.status,error:run.error?.message||null,calls,report,stdout:run.stdout,stderr:run.stderr};results.push(observed);writeFileSync(join(base,'result.json'),JSON.stringify({scope:'Real copied CLI entrypoint and CI summaries using mocked HTTP only; no real credentials, network or publication.',results},null,2));
 assert.equal(run.error,undefined,entry.name+' process error');assert.equal(calls.length,entry.calls,entry.name+' request count (CLI must execute)');assert.equal(run.status,entry.exit,entry.name+' terminal exit');assert.equal(Boolean(report?.skipped),entry.skip,entry.name+' explicit soft-skip report');if(entry.reason)assert.equal(report.reason,entry.reason,entry.name+' truthful access/unavailable classification');if(!entry.skip)assert(!run.stderr.includes('SOFT SKIP'),entry.name+' must not report a soft skip');
}
console.log(JSON.stringify({cases:results.length,fixture:base,scope:'Actual CLI scope, endpoint, HTTP status and pre-API failure paths; mocked transport only, no live Figma parity/publication.'}));
