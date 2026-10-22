import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync,mkdtempSync,copyFileSync,rmSync,existsSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {chromium,firefox,webkit} from 'playwright';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createVerificationServer} from '../../scripts/lib/verification-server.mjs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {stagePublicFiles,loadPublicPolicy} from '../../scripts/public-site.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
async function withPublicFixture(run){
 const isolated=mkdtempSync(join(tmpdir(),'cs-release-public-'));
 for(const path of ['scripts/public-site-policy.json',...loadPublicPolicy(root).keys()]){if(!existsSync(join(root,path)))continue;mkdirSync(dirname(join(isolated,path)),{recursive:true});copyFileSync(join(root,path),join(isolated,path));}
 const server=await createVerificationServer(stagePublicFiles(isolated));await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const browser=await ({chromium,firefox,webkit}[browserName]).launch({headless:true});
 try{const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port+'/');await run(page);}finally{await browser.close();await new Promise(done=>server.close(done));rmSync(isolated,{recursive:true,force:true});}
}
const inputPaths=[...new Set([...loadPublicPolicy(root).keys(),'scripts/public-site.mjs','scripts/public-site-policy.json','scripts/lib/verification-server.mjs','_audit/ci/lib/browser-fixture.mjs','_audit/ci/test-release-documentation-browser.mjs'])].filter(path=>existsSync(join(root,path))).sort();
const inputGraph=()=>Object.fromEntries(inputPaths.map(path=>[path,createHash('sha256').update(readFileSync(join(root,path))).digest('hex')]));
const inputs=inputGraph();
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const cases=[
 {name:'stable',version:'1.7.2'},
 {name:'alpha',version:'2.0.0-alpha.0'},
 ...['01.2.3','2.0.0-alpha.01','2.0.0+metadata','v2.0.0','2.0.0-','2.0.0-alpha.0junk!'].map(version=>({name:'malformed:'+version,version,fail:'VERSION is canonical SemVer'})),
 {name:'package mismatch',version:'2.0.0-alpha.0',packageVersion:'1.7.2',fail:'package.json version = VERSION'},
 {name:'catalog mismatch',version:'2.0.0-alpha.0',catalogVersion:'1.7.2',fail:'reference catalog totals'},
 {name:'catalog counts mismatch',version:'2.0.0-alpha.0',badCounts:true,fail:'reference catalog totals'},
 {name:'design mismatch',version:'2.0.0-alpha.0',designVersion:'1.7.2',fail:'DESIGN.md exists'},
 {name:'missing canonical parser',version:'2.0.0-alpha.0',missingParser:true,fail:'bootstrap/parse'},
];
const rows=[];
for(const surface of ['source','staged-public'])await (surface==='source'?withBrowserFixture:withPublicFixture)(async page=>{
 if(surface==='staged-public'){
  for(const leaf of ['components/_i18n/i18n.js', 'base/controls.css', 'base/glass.css', 'base/responsive.css', 'base/components.css']) {
   const response=await page.request.get(new URL('/'+leaf,page.url()).href);assert.equal(response.status(),200,leaf);assert.equal(createHash('sha256').update(await response.body()).digest('hex'),createHash('sha256').update(readFileSync(leaf)).digest('hex'),'Exact public diagnostic source: '+leaf);
  }
  const core=await page.request.get(new URL('/scripts/lib/release-version-core.mjs',page.url()).href);assert.equal(core.status(),200);
  for(const privatePath of ['/scripts/lib/release-version.mjs','/scripts/lib/release-documentation.mjs','/scripts/prepare-release.mjs','/.github/workflows/release.yml','/base/private-unknown.css','/components/_i18n/private-unknown.js'])assert.equal((await page.request.get(new URL(privatePath,page.url()).href)).status(),404,'Private source remains unpublished: '+privatePath);
 }
 let active;
 await page.route('**/*',async route=>{
  const path=new URL(route.request().url()).pathname;
  if(path==='/scripts/lib/release-version-core.mjs'&&active?.missingParser)return route.abort();
  if(!active)return route.continue();
  if(path==='/VERSION')return route.fulfill({contentType:'text/plain',body:active.version+'\n'});
  if(['/package.json','/_ds_manifest.json','/docs/reference-catalog.json'].includes(path)){
   const value=JSON.parse(readFileSync('.'+path,'utf8'));
   value.version=path==='/package.json'?active.packageVersion||active.version:path==='/docs/reference-catalog.json'?active.catalogVersion||active.version:active.version;
   if(active.badCounts&&path==='/docs/reference-catalog.json')value.counts.publicExports++;
   return route.fulfill({contentType:'application/json',body:JSON.stringify(value)});
  }
  if(path==='/DESIGN.md')return route.fulfill({contentType:'text/plain',body:readFileSync('DESIGN.md','utf8').replace(/^version:.*$/m,'version: "'+(active.designVersion||active.version)+'"')});
  return route.continue();
 });
 for(const item of cases){
  active=item;await page.goto(new URL('/_audit/docs-consistency.html',page.url()).href);
  await page.waitForFunction(()=>window.__docs,null,{timeout:30000});
  const result=await page.evaluate(()=>window.__docs);
  if(item.fail){assert.equal(result.pass,false,item.name);assert.ok(result.steps.some(step=>step.startsWith('✗')&&step.includes(item.fail)),JSON.stringify({item,result}));}
  else assert.equal(result.pass,true,JSON.stringify({item,result}));
  rows.push({surface,case:item.name,...result});
 }
},{browserName});
assert.deepEqual(inputGraph(),inputs,'Diagnostic source/public graph must not drift during browser proof');
mkdirSync('test-results/alpha-doc-stamping',{recursive:true});
writeFileSync('test-results/alpha-doc-stamping/'+browserName+'.json',JSON.stringify({browserName,cases:rows.length,inputGraph:inputs,noInputDrift:true,rows},null,2)+'\n');
console.log('PASS '+browserName+': actual source+staged-public docs-consistency stable/alpha and11 negatives each; canonical core200/private404 closure');
