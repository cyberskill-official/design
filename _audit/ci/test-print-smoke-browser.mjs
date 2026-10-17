import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const contract=JSON.parse(readFileSync(root+'_audit/fixtures/print-template-contract.json','utf8'));
const manifest=JSON.parse(readFileSync(root+'_ds_manifest.json','utf8'));
const first=contract.templates[0],source=readFileSync(root+first.entry,'utf8');
const owned=new Set(contract.templates.map(row=>row.entry));
const nonprint=manifest.templates.find(row=>!owned.has(row.entryPath));assert(nonprint);
const marker='<meta name="omelette-owns-print" content="1">';assert(source.includes(marker));
const otherFormat=first.format==='A4'?'Letter':'A4';
const cases=[
 {name:'current exact contract',pass:true},
 {name:'removed ownership',source:source.replace('omelette-owns-print','removed-print')},
 {name:'comment-only ownership',source:source.replace(marker,'<!-- omelette-owns-print -->')},
 {name:'disabled ownership',source:source.replace(marker,marker.replace('content="1"','content="0"'))},
 {name:'duplicate ownership',source:source.replace(marker,marker+marker)},
 {name:'missing page hook',source:source.replace(/@page/g,'@not-page')},
 {name:'comment-only page hook',source:source.replace(/@page\s*\{[^}]*\}/g,match=>'/*'+match+'*/')},
 {name:'unsupported page size',source:source.replace(/size:\s*(A4|letter)/i,'size: A3')},
 {name:'conflicting page size',source:source.replace('</head>','<style>@page{size:'+otherFormat+'}</style></head>')},
 {name:'print source unavailable',sourceStatus:404},
 {name:'HTML fallback instead of source',source:'<!doctype html><html><body>Fallback</body></html>'},
 {name:'contracted path missing from manifest',manifest:{...manifest,templates:manifest.templates.filter(row=>row.entryPath!==first.entry)}},
 {name:'duplicate manifest path',manifest:{...manifest,templates:[...manifest.templates,manifest.templates[0]]}},
 {name:'print contract unavailable',contractStatus:404},
 {name:'empty print contract',contract:{schemaVersion:1,templates:[]}},
 {name:'duplicate print contract path',contract:{...contract,templates:[...contract.templates,first]}},
 {name:'malformed print contract',contractBody:'{'},
 {name:'unlisted print owner',unlistedSource:source},
 {name:'inspected scripts remain inert',pass:true,source:source+'<script>window.printSourceExecuted=true</script>'},
 {name:'inspection module unavailable',moduleStatus:404},
];
const rows=[],browserName=process.env.CS_TEST_BROWSER||'chromium';
const targetUrl=process.argv.find(arg=>arg.startsWith('--url='))?.slice(6);
await withBrowserFixture(async page=>{
 const base=new URL(targetUrl||page.url()),paths={source:'/'+first.entry,manifest:'/_ds_manifest.json',contract:'/_audit/fixtures/print-template-contract.json',unlisted:'/'+nonprint.entryPath,module:'/_audit/lib/print-template-contract.mjs'};
 for(const item of cases){
  for(const path of Object.values(paths))await page.unroute(new URL(path,base).href);
  const intercepted=[];
  const route=async(key,body,status=200,type='text/plain')=>page.route(new URL(paths[key],base).href,r=>{intercepted.push(paths[key]);return r.fulfill({status,contentType:type,body});});
  if(item.source!==undefined||item.sourceStatus)await route('source',item.source??'Missing',item.sourceStatus||200,'text/html');
  if(item.manifest)await route('manifest',JSON.stringify(item.manifest),200,'application/json');
  if(item.contract||item.contractStatus||item.contractBody)await route('contract',item.contractBody??JSON.stringify(item.contract??{}),item.contractStatus||200,'application/json');
  if(item.unlistedSource)await route('unlisted',item.unlistedSource,200,'text/html');
  if(item.moduleStatus)await route('module','Missing',item.moduleStatus,'text/javascript');
  await page.goto(new URL('/_audit/print-smoke.html',base).href);
  await page.waitForFunction(()=>window.__printsmoke,null,{timeout:30000});
  const verdict=await page.evaluate(()=>window.__printsmoke);
  assert.equal(verdict.pass,!!item.pass,item.name+': '+JSON.stringify(verdict));
  assert.equal(await page.evaluate(()=>window.printSourceExecuted),undefined,'Source inspection must not execute template scripts');
  if(item.pass){assert.equal(verdict.expected,contract.templates.length);assert.equal(verdict.ok,contract.templates.length);assert.equal(verdict.total,contract.templates.length);assert.equal(verdict.scanned,manifest.templates.length);assert.deepEqual(verdict.fails,[]);}
  rows.push({name:item.name,expectedPass:!!item.pass,actualPass:verdict.pass,interceptedPaths:intercepted,error:verdict.error??null,failures:verdict.fails});
 }
},{browserName});
const paths=['_audit/print-smoke.html','_audit/lib/print-template-contract.mjs','_audit/fixtures/print-template-contract.json','_audit/ci/test-print-smoke-browser.mjs','_audit/ci/lib/browser-fixture.mjs','_ds_manifest.json',first.entry,nonprint.entryPath];
if(process.env.CS_PRINT_SMOKE_REPORT)writeFileSync(process.env.CS_PRINT_SMOKE_REPORT,JSON.stringify({browserName,targetUrl:targetUrl||'ephemeral repository source server',cases:rows,sourceFiles:Object.fromEntries(paths.map(path=>[path,createHash('sha256').update(readFileSync(root+path)).digest('hex')])),scope:'Actual print-smoke source inventory, inert ownership and CSSOM page-size inspection, explicit contract membership and failure paths; not pagination, export fidelity or human acceptance'},null,2)+'\n');
console.log(`PASS ${browserName} print-smoke: ${cases.length} actual browser cases; exact print contract, unavailable/removed/unlisted sources, commented hooks and inert scripts`);
