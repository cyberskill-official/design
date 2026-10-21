import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,cpSync,rmSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium,firefox,webkit} from 'playwright';
import {createVerificationServer} from '../../scripts/lib/verification-server.mjs';
const root=resolve('.'),temp=mkdtempSync(join(tmpdir(),'cs-vite-consumer-')),consumer=join(temp,'consumer');
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const run=(executable,args,cwd=consumer)=>execFileSync(executable,args,{cwd,encoding:'utf8',maxBuffer:32*1024*1024,env:{...process.env,PATH:join(process.execPath,'..')+':'+process.env.PATH}});
let server;
try {
 let tarball=process.argv[2]&&resolve(process.argv[2]);
 if(!tarball){
  run(process.execPath,['scripts/build-compiled-esm.mjs','--check'],root);
  const packed=JSON.parse(run('npm',['pack','--json','--ignore-scripts','--pack-destination',temp],root))[0];tarball=join(temp,packed.filename);
 }
 cpSync(resolve('examples/vite-consumer'),consumer,{recursive:true,filter:source=>!['node_modules','dist','vendor'].includes(source.split('/').at(-1))});
 run(process.execPath,['scripts/use-design-tarball.mjs',tarball]);
 // A different private artifact deliberately changes the file dependency and
 // lock; the subsequent clean install must use exactly that resulting lock.
 run('npm',['install','--package-lock-only','--ignore-scripts','--no-audit','--no-fund','--prefer-offline']);
 const lockBefore=hash(join(consumer,'package-lock.json'));
 run('npm',['ci','--ignore-scripts','--no-audit','--no-fund','--prefer-offline']);
 assert.equal(hash(join(consumer,'package-lock.json')),lockBefore,'Clean installation must preserve the prepared lock');
 const installed=name=>JSON.parse(readFileSync(join(consumer,'node_modules',name,'package.json'),'utf8'));
 assert.equal(installed('vite').version,'8.1.6');assert.equal(installed('react').version,'19.2.8');assert.equal(installed('react-dom').version,'19.2.8');
 const buildLog=run(process.execPath,['node_modules/vite/bin/vite.js','build']);
 const proof=JSON.parse(readFileSync(join(consumer,'dist/consumer-build-inputs.json'),'utf8'));
 assert(proof.javascript.includes('dist/esm/_esm/react.mjs'),'Default compiled entry must be resolved');
 assert(proof.javascript.includes('dist/esm/components/forms/Combobox.mjs'),'Deep compiled component must be resolved');
 assert(proof.javascript.every(path=>path.startsWith('dist/esm/')&&path.endsWith('.mjs')),'No raw JSX/source package transforms');
 assert(proof.associationChunks.length>=1,'Compiled source-map provenance must include the field association');
 server=await createVerificationServer(join(consumer,'dist'));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}/`,engines=[];
 for(const type of[chromium,firefox,webkit]){
  const browser=await type.launch(process.platform==='linux'&&type.name()==='chromium'?{args:['--disable-dev-shm-usage']}:{ });
  try {
   const page=await browser.newPage(),errors=[],failed=[];
   page.on('pageerror',error=>errors.push(String(error)));page.on('requestfailed',request=>failed.push(request.url()));
   await page.goto(url);await page.getByRole('heading',{name:'Plan a workshop'}).waitFor();
   const combo=page.getByRole('combobox',{name:'City required',exact:true});
   assert.equal(await combo.getAttribute('id'),'workshop-city');
   assert.equal(await combo.getAttribute('aria-required'),'true');
   const hint=await combo.getAttribute('aria-describedby');assert(hint);
   assert.equal(await combo.evaluate((element,id)=>element.ownerDocument.getElementById(id).textContent,hint),'Choose the workshop location.','Root FormField hint must reach deep-imported Combobox');
   await page.getByRole('button',{name:'Reserve seats',exact:true}).click();
   await page.waitForFunction(()=>document.getElementById('workshop-city').getAttribute('aria-invalid')==='true');
   await combo.click();await page.getByRole('option',{name:'Ho Chi Minh City',exact:true}).click();
   assert.equal(await combo.inputValue(),'Ho Chi Minh City');
   const seats=page.getByRole('spinbutton',{name:'Seats',exact:true});assert.equal(await seats.inputValue(),'2');
   await page.getByRole('button',{name:'Increase',exact:true}).click();assert.equal(await seats.inputValue(),'3');
   await page.getByRole('button',{name:'Reserve seats',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('[data-testid="submission"]').textContent==='Reserved 3 seats in Ho Chi Minh City.');
   assert.equal(await page.evaluate(()=>getComputedStyle(document.body).color),'rgb(69, 33, 14)','Production CSS keeps warm text tokens');
   assert.equal(await page.evaluate(()=>Object.keys(window).some(key=>/^CyberSkillDesignSystem_/.test(key))),false,'Compiled consumer must not load the legacy registry');
   assert.deepEqual(errors,[]);assert.deepEqual(failed,[],'All production script/style/font requests must load');
   engines.push({name:type.name(),version:browser.version(),passed:true});
  } finally {await browser.close()}
 }
 mkdirSync('test-results',{recursive:true});const pkg=installed('@cyberskill/design');assert.equal(pkg.name,'@cyberskill/design');
 writeFileSync('test-results/vite-consumer-final.json',JSON.stringify({schemaVersion:1,passed:true,node:process.version,producer:{version:pkg.version,tarballSha256:hash(tarball),defaultExport:pkg.exports['.'].import,deepExport:pkg.exports['./components/*.jsx'].import},consumer:{vite:'8.1.6',react:'19.2.8',reactDom:'19.2.8',lockSha256:lockBefore,cleanInstallPreservedLock:true},sourceHashes:Object.fromEntries(['package.json','package-lock.json','vite.config.mjs','index.html','src/main.jsx','src/styles.css','scripts/use-design-tarball.mjs','README.md'].map(path=>[path,hash(resolve('examples/vite-consumer',path))])),build:{javascriptModules:proof.javascript,associationChunks:proof.associationChunks,buildLog},engines,interpretation:'Actual independently installed local tarball, consumer production build and shared-context interactions. Registry publication, broader bundler support, manual accessibility and dependency-security review are not implied.'},null,2)+'\n');
 console.log(`PASS Vite8.1.6 consumer: actualtarball ${pkg.version},React19.2.8,cleanlocked install,compiledroot/deep resolution,sharedfieldcontext,3engine productioninteractions`);
} finally {if(server)await new Promise(resolve=>server.close(resolve));rmSync(temp,{recursive:true,force:true})}
