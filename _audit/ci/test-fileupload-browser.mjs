import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 for(const multiple of [false,true]) {
  await page.evaluate(multiple=>{window.fileCalls=[];renderFixture(React.createElement(CS.FileUpload,{key:String(multiple),lang:'en',title:'Upload files',hint:'Choose a file',multiple,accept:'.txt',onFiles:fs=>fileCalls.push(fs.map(f=>({name:f.name,size:f.size,type:f.type})))}))},multiple);
  const input=page.getByLabel('Upload files',{exact:true});
  assert.equal(await input.getAttribute('accept'),'.txt');
  const hint=await input.getAttribute('aria-describedby');assert.equal(await page.locator('[id="'+hint+'"]').textContent(),'Choose a file');
  await page.locator('.cs-dropzone').evaluate(el=>{
   const dt=new DataTransfer();dt.items.add(new File(['a'],'a.txt',{type:'text/plain'}));dt.items.add(new File(['bb'],'b.txt',{type:'text/plain'}));
   const event=new DragEvent('drop',{bubbles:true,cancelable:true});Object.defineProperty(event,'dataTransfer',{value:dt});el.dispatchEvent(event);
   if(!event.defaultPrevented)throw Error('Drop must suppress browser navigation');
  });
  const expected=[{name:'a.txt',size:1,type:'text/plain'},...(multiple?[{name:'b.txt',size:2,type:'text/plain'}]:[])];
  assert.deepEqual(await page.evaluate(()=>fileCalls),[expected],'Drop must respect multiple on the same contract as selection');
  await input.setInputFiles({name:'picked.txt',mimeType:'text/plain',buffer:Buffer.from('pick')});
  assert.deepEqual(await page.evaluate(()=>fileCalls.at(-1)),[{name:'picked.txt',size:4,type:'text/plain'}]);
  await input.setInputFiles([]);
  await page.locator('.cs-dropzone').evaluate(el=>{const event=new DragEvent('drop',{bubbles:true,cancelable:true});Object.defineProperty(event,'dataTransfer',{value:new DataTransfer()});el.dispatchEvent(event)});
  assert.equal(await page.evaluate(()=>fileCalls.length),2,'Empty selection/drop emits nothing');
 }
 console.log('PASS FileUpload: single/multiple drop limits, file metadata, picker delivery, empty input and accessible hint');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
