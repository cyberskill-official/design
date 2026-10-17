import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{
  window.fired=0;
  renderFixture(React.createElement(CS.HotKeys,{bindings:[{keys:'mod+k',onTrigger:()=>fired++}]},
   React.createElement('button',{id:'ordinary'},'Action'),
   React.createElement('div',{contentEditable:true,suppressContentEditableWarning:true},React.createElement('span',{id:'editing'},'Edit')),
   React.createElement('input',{id:'input'}),React.createElement('textarea',{id:'textarea'}),React.createElement('select',{id:'select'}),
   React.createElement('div',{id:'shadow'})));
  const shadow=document.getElementById('shadow').attachShadow({mode:'open'});shadow.innerHTML='<input id="inside">';
  window.sendKey=(id,init)=>{const target=id==='shadow-input'?shadow.querySelector('input'):document.getElementById(id);const e=new KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true,cancelable:true,composed:true,...init});if(init?.handled)e.preventDefault();target.dispatchEvent(e);return e.defaultPrevented};
 });
 for(const target of ['editing','input','textarea','select','shadow-input']){
  const prevented=await page.evaluate(target=>sendKey(target),target);
  assert.equal(await page.evaluate(()=>fired),0,`${target}: typing cannot trigger global binding`);
  assert.equal(prevented,false,`${target}: typing remains unhandled`);
 }
 for(const init of [{isComposing:true},{keyCode:229},{handled:true}]){
  await page.evaluate(init=>sendKey('ordinary',init),init);
  assert.equal(await page.evaluate(()=>fired),0,'Composition and locally handled events are ignored');
 }
 await page.evaluate(()=>sendKey('editing',{key:'?',ctrlKey:false}));
 assert.equal(await page.getByRole('dialog').count(),0,'Typing ? in editor does not open help');
 assert.equal(await page.evaluate(()=>sendKey('ordinary')),true);
 assert.equal(await page.evaluate(()=>fired),1,'Normal shortcut still runs once');
 await page.locator('#ordinary').focus();await page.keyboard.press('?');await page.getByRole('dialog').waitFor();
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});
 await page.evaluate(()=>renderFixture(null));
 await page.evaluate(()=>document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true})));
 assert.equal(await page.evaluate(()=>fired),1,'Unmount removes document listener');
 await page.evaluate(()=>{
  window.matchEvents=[];
  window.checkCombo=(combo,init)=>{
   renderFixture(React.createElement(CS.HotKeys,{help:false,bindings:[{keys:combo,onTrigger:()=>matchEvents.push(combo)}]}));
   const before=matchEvents.length;
   const event=new KeyboardEvent('keydown',{bubbles:true,cancelable:true,...init});document.body.dispatchEvent(event);
   return {matched:matchEvents.length>before,prevented:event.defaultPrevented};
  };
 });
 const cases=[
  ['k',{key:'k',ctrlKey:true},false],['Enter',{key:'Enter',shiftKey:true},false],
  ['ctrl+k',{key:'k'},false],['meta+k',{key:'k',ctrlKey:true},false],
  ['mod+k',{key:'k',ctrlKey:true},true],['mod+k',{key:'k',metaKey:true},true],
  ['mod+k',{key:'k'},false],['mod+k',{key:'k',ctrlKey:true,shiftKey:true},false],
  ['ctrl+k',{key:'k',ctrlKey:true},true],['meta+k',{key:'k',metaKey:true},true],
  ['ctrl+shift+k',{key:'K',ctrlKey:true,shiftKey:true},true],
  ['alt+Enter',{key:'Enter',altKey:true},true],['alt+Enter',{key:'Enter',altKey:true,ctrlKey:true},false],
  ['k',{key:'K'},true],['shift+Enter',{key:'Enter',shiftKey:true},true],
  ['unknown+k',{key:'k'},false],[' mod + K ',{key:'k',metaKey:true},true],
 ];
 for(const [combo,init,matched] of cases)assert.deepEqual(await page.evaluate(([combo,init])=>checkCombo(combo,init),[combo,init]),{matched,prevented:matched},`${combo}: ${JSON.stringify(init)}`);
 console.log('PASS HotKeys: editable/native/shadow targets, composition, handled events, normal binding, help, cleanup and 17 modifier cases');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
