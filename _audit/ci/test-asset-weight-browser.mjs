import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const cases=[
 {name:'current named resource inventory',pass:true},
 {name:'legacy transport failure',path:'/assets/aurora-hoa.png',abort:true},
 {name:'legacy HTTP403',path:'/assets/aurora-hoa.png',status:403,body:'denied'},
 {name:'legacy HTTP500',path:'/assets/aurora-hoa.png',status:500,body:'failed'},
 {name:'legacy HTTP204',path:'/assets/aurora-hoa.png',status:204,body:''},
 {name:'legacy HTTP200 empty',path:'/assets/aurora-hoa.png',status:200,body:''},
 {name:'legacy HTTP200 bytes',path:'/assets/aurora-hoa.png',status:200,body:'legacy'},
 {name:'required WebP HTTP500',path:'/assets/aurora-tho.webp',status:500,body:'failed'},
 {name:'required WebP empty',path:'/assets/aurora-tho.webp',status:200,body:''},
 {name:'wash CSS transport failure',path:'/tokens/elements.css',abort:true},
];
const rows=[];
await withBrowserFixture(async page=>{
 const url=new URL('/_audit/asset-weight-budget.html',page.url()).href;
 for(const item of cases){
  const resource=item.path?new URL(item.path,url).href:null;
  const intercepted=[];
  if(resource)await page.route(resource,route=>{
   intercepted.push(new URL(route.request().url()).pathname);
   return item.abort?route.abort('failed'):route.fulfill({status:item.status,contentType:'application/octet-stream',body:item.body});
  });
  try {
   await page.goto(url);
   await page.waitForFunction(()=>window.__assetweight,null,{timeout:30000});
   const verdict=await page.evaluate(()=>window.__assetweight);
   assert.equal(verdict.pass,!!item.pass,item.name+': '+JSON.stringify(verdict));
   if(resource)assert(intercepted.includes(item.path),item.name+': intended fault was not exercised');
   assert.equal(Object.keys(verdict.files).length,item.path==='/assets/aurora-tho.webp'&&item.status===500?4:5,item.name+': five named WebPs checked');
   if(item.pass)assert.equal(Object.keys(verdict.files).length,5);
   rows.push({name:item.name,expectedPass:!!item.pass,actualPass:verdict.pass,intercepted,failures:verdict.steps.filter(s=>s.startsWith('✗'))});
  }finally{if(resource)await page.unroute(resource);}
 }
},{browserName});
const paths=['_audit/asset-weight-budget.html','_audit/ci/test-asset-weight-browser.mjs','_audit/ci/lib/browser-fixture.mjs','tokens/elements.css'];
const sourceFiles=Object.fromEntries(paths.map(path=>[path,createHash('sha256').update(readFileSync(new URL('../../'+path,import.meta.url))).digest('hex')]));
if(process.env.CS_ASSET_WEIGHT_REPORT)writeFileSync(process.env.CS_ASSET_WEIGHT_REPORT,JSON.stringify({browserName,sourceFiles,cases:rows,scope:'Actual named asset-weight gate responses, budgets and wash check under loopback browser fixtures. No arbitrary asset discovery, image decoding, live host or human acceptance.'},null,2)+'\n');
console.log(`PASS asset-weight ${browserName}: ${rows.length} actual gate cases; named legacy absence must be HTTP404, transport/status/empty-body faults rejected`);
