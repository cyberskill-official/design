import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium,firefox,webkit} from 'playwright';
import {modeInputs,captureTokenModes} from '../../scripts/lib/token-modes.mjs';
const inputs=modeInputs(resolve('.')),css=readFileSync('tokens/variables.css','utf8');
for(const browserType of [chromium,firefox,webkit]){
 const full=await captureTokenModes(inputs,{browserType}),variables=await captureTokenModes({...inputs,css},{browserType});
 assert.deepEqual(variables.values,full.values,'Token-only cascade must reproduce every declared mode and omission expression in '+browserType.name());
 const browser=await browserType.launch();
 try{
  const page=await browser.newPage();const requests=[];await page.route('**/*',route=>{requests.push(route.request().url());return route.abort()});
  await page.setContent('<!doctype html><style>html{color-scheme:light}body{margin:23px;background:rgb(1,2,3);font:17px serif}a{color:rgb(4,5,6);text-underline-offset:7px}.cs-button{padding:19px;border:2px solid rgb(7,8,9)}</style><a href="#">Host link</a><button class="cs-button">Host button</button><section class="cs-aurora">Host surface</section>');
  const snapshot=()=>page.evaluate(()=>[document.documentElement,document.body,...document.querySelectorAll('a,button,section')].map(node=>{const style=getComputedStyle(node);return Object.fromEntries(['margin','padding','font','color','background','border','textUnderlineOffset','colorScheme'].map(key=>[key,style[key]]))}));
  const before=await snapshot();await page.addStyleTag({content:css});assert.deepEqual(await snapshot(),before,'Host presentation must remain untouched');assert.deepEqual(requests,[],'No font or asset requests');
 }finally{await browser.close()}
 console.log('PASS '+browserType.name()+': variables-only parity across256axis combinations and host styles preserved without font/asset requests');
}
