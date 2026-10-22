import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync, copyFileSync, rmSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {assertNpmVersion} from '../../scripts/check-npm-version.mjs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const root=new URL('../../',import.meta.url);
const targets=JSON.parse(readFileSync(new URL('./fixtures/native-ref-targets.json',import.meta.url))).components;
const fixtures=JSON.parse(readFileSync(new URL('../../scripts/fixtures/static-html-reference.json',import.meta.url))).components;
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const runtime=process.argv.includes('--react18')?'18':process.env.CS_TEST_REACT||'19';
assert.ok(['18','19'].includes(runtime),'supported ref test React major');
const consumer=runtime==='18'?mkdtempSync(join(tmpdir(),'cs-ref-react18-')):undefined;
const receipt={browserName,runtime,bundleSha256:createHash('sha256').update(readFileSync(new URL('_ds_bundle.js',root))).digest('hex'),targets:[],lifecycle:[]};
try {
 if(consumer){
  for(const name of ['package.json','package-lock.json'])copyFileSync(new URL(`./fixtures/react18-consumer/${name}`,import.meta.url),join(consumer,name));
  const cli=resolve('_audit/ci/fixtures/npm-cli/node_modules/npm/bin/npm-cli.js');
  assertNpmVersion(JSON.parse(readFileSync(new URL('package.json',root),'utf8')),execFileSync(process.execPath,[cli,'--version'],{encoding:'utf8'}));
  execFileSync(process.execPath,[cli,'ci','--ignore-scripts','--no-audit','--no-fund'],{cwd:consumer,stdio:'pipe',timeout:120000});
 }
 await withBrowserFixture(async page=>{
  const warnings=[];page.on('console',message=>{if(message.type()==='error'||message.type()==='warning')warnings.push(message.text());});
  await page.evaluate(()=>{
   window.decodeRefFixture=function decode(value){
    if(Array.isArray(value))return value.map(decode);
    if(!value||typeof value!=='object')return value;
    if(value.$element){const d=value.$element;return React.createElement(d.component?CS[d.component]:d.tag,decode(d.props||{}),decode(d.children));}
    if(value.$render){const d=value.$render;return()=>decode(d);}
    return Object.fromEntries(Object.entries(value).map(([key,val])=>[key,decode(val)]));
   };
  });
  for(const target of targets.filter(t=>t.ref)){
   const fixture=fixtures.find(f=>f.name===target.name);assert.ok(fixture,target.name+' explicit fixture');
   await page.evaluate(({target,fixture})=>{
    renderFixture(null);window.nativeRef=React.createRef();window.controlRef=React.createRef();
    window.drawNative=extra=>{let node=React.createElement(CS[target.name],{...decodeRefFixture(fixture.props),lang:'en',...extra,ref:nativeRef,...(target.controlRef?{controlRef}: {})});if(fixture.wrapper){const w=fixture.wrapper;node=React.createElement(w.component?CS[w.component]:w.tag,decodeRefFixture(w.props||{}),node);}renderFixture(node);};
    drawNative({});
   },{target,fixture});
   if(target.name==='ContextMenu')await page.locator('#fixture > div').dispatchEvent('contextmenu',{clientX:120,clientY:120,button:2});
   if(target.name==='HotKeys')await page.keyboard.press('?');
   if(target.name==='HoverCard'){await page.getByRole('button',{name:'Hover reference'}).focus();}
   if(target.name==='Popconfirm')await page.locator('.cs-popconfirm button').first().click();
   await page.waitForFunction(()=>nativeRef.current instanceof Element,null,{timeout:5000}).catch(error=>{throw new Error(target.name+' expected mounted native ref: '+error.message,{cause:error});});
   const result=await page.evaluate(target=>{
    const node=nativeRef.current;
    return {tag:node.tagName.toLowerCase(),role:node.getAttribute('role'),types:target.ref.types.map(type=>type==='Element'?node instanceof Element:node instanceof window[type]),connected:node.isConnected};
   },target);
   assert.ok(result.connected&&result.types.some(Boolean),`${target.name}: ${JSON.stringify(result)} expected ${target.ref.types}`);
   if(target.ref.role)assert.equal(result.role,target.ref.role,target.name+' role target');
   const tags=target.ref.rootTags||(target.ref.tag&&target.ref.tag!=='Tag'?[target.ref.tag]:null);
   if(tags)assert.ok(tags.includes(result.tag),target.name+' tag '+result.tag);
   if(target.controlRef){
    if(target.name==='InlineEdit'){
     assert.equal(await page.evaluate(()=>controlRef.current),null);
     await page.locator('.cs-inline-edit').getByRole('button').click();
    }
    await page.waitForFunction(()=>controlRef.current instanceof Element);
    const control=await page.evaluate(target=>({tag:controlRef.current.tagName.toLowerCase(),classes:controlRef.current.className,types:target.controlRef.types.map(type=>controlRef.current instanceof window[type]),different:controlRef.current!==nativeRef.current}),target);
    assert.equal(control.tag,target.controlRef.tag,target.name+' control target');assert.ok(control.types.some(Boolean)&&control.different,target.name+' distinct control');
   }
   const stable=await page.evaluate(()=>{const prior=nativeRef.current;drawNative({'data-ref-rerender':'yes'});return nativeRef.current===prior;});
   assert.ok(stable,target.name+' stable native node during ordinary rerender');
   if(fixture.props.open===true){await page.evaluate(()=>drawNative({open:false}));await page.waitForFunction(()=>nativeRef.current===null);}
   await page.evaluate(()=>renderFixture(null));
   assert.equal(await page.evaluate(()=>nativeRef.current),null,target.name+' unmount clears object ref');
   if(target.controlRef)assert.equal(await page.evaluate(()=>controlRef.current),null,target.name+' unmount clears controlRef');
   receipt.targets.push({name:target.name,...result,controlRef:!!target.controlRef});
  }
  // Polymorphic and alternate branches retain the declared native target, including ListItem's managed listitem wrapper.
  for(const [name,props,tag]of [
   ['Card',{as:'article'},'article'],['Item',{href:'#example'},'a'],['Item',{onClick:true},'button'],
   ['NavItem',{href:'#example'},'a'],['NavItem',{},'button'],['Divider',{},'hr'],
   ['Skeleton',{as:'span'},'span'],['ListItem',{onClick:true,title:'Interactive row'},'div']]){
   await page.evaluate(({name,props})=>{renderFixture(null);window.branchRef=React.createRef();if(props.onClick===true)props.onClick=()=>{};renderFixture(React.createElement(CS[name],{...props,ref:branchRef}));},{name,props});
   assert.equal(await page.evaluate(()=>branchRef.current?.tagName.toLowerCase()),tag,name+' alternate branch target');
  }
  await page.evaluate(()=>{renderFixture(null);window.hiddenRef=React.createRef();renderFixture(React.createElement(CS.BackTop,{ref:hiddenRef,threshold:Number.POSITIVE_INFINITY}));});
  assert.equal(await page.evaluate(()=>hiddenRef.current),null,'hidden BackTop has no button target');
  await page.evaluate(()=>{renderFixture(null);window.imageRef=React.createRef();renderFixture(React.createElement(CS.Image,{ref:imageRef,src:'data:image/png;base64,broken',alt:'Broken image'}));});
  await page.waitForFunction(()=>document.querySelector('.cs-image')&&!document.querySelector('.cs-image img'));
  assert.equal(await page.evaluate(()=>imageRef.current),null,'image fallback clears its native img ref');
  const rejectedBagRefs=await page.evaluate(()=>{let calls=0;const bad=()=>calls++;renderFixture(React.createElement(CS.Combobox,{options:[],rootProps:{ref:bad},controlProps:{ref:bad}}));renderFixture(null);return calls;});
  assert.equal(rejectedBagRefs,0,'attribute bags cannot acquire refs');
  // Real operations prove refs retain the component's focus/action contract.
  await page.evaluate(()=>{window.inputRef=React.createRef();window.actions=0;renderFixture(React.createElement(React.Fragment,null,
   React.createElement(CS.TextField,{ref:inputRef,label:'Ref focus'}),
   React.createElement(CS.Button,{ref:node=>window.buttonNode=node,onClick:()=>actions++},'Run')));inputRef.current.focus();});
  assert.equal(await page.evaluate(()=>document.activeElement===inputRef.current),true);
  await page.evaluate(()=>buttonNode.click());assert.equal(await page.evaluate(()=>actions),1);
  // Stable callbacks must not detach on rerender; replacement must detach the old owner.
  const lifecycle=await page.evaluate(()=>{
   renderFixture(null);const log=[];const object=React.createRef();let initial;
   const callback=node=>{log.push(node?'attach':'null');if(node){initial=node;return()=>log.push('cleanup');}};
   const draw=ref=>renderFixture(React.createElement(CS.TextField,{ref,label:'Lifecycle'}));
   draw(callback);draw(callback);const stable=log.slice();draw(object);const replacement=log.slice();const same=object.current===initial;
   renderFixture(null);return {major:Number.parseInt(React.version,10),stable,replacement,same,unmounted:object.current===null};
  });
  assert.deepEqual(lifecycle.stable,['attach']);assert.deepEqual(lifecycle.replacement,['attach',runtime==='19'?'cleanup':'null']);assert.ok(lifecycle.same&&lifecycle.unmounted);receipt.lifecycle.push(lifecycle);
  // Menu clones an owned trigger without losing its caller's cleanup or producing React 18 function-ref warnings.
  const menu=await page.evaluate(()=>{
   const log=[];const cb=node=>{log.push(node?'attach':'null');if(node)return()=>log.push('cleanup');};
   const trigger=React.createElement(CS.Button,{ref:cb},'Owned trigger');
   const draw=open=>renderFixture(React.createElement(CS.Menu,{trigger,open},React.createElement(CS.MenuItem,null,'One')));
   draw(false);draw(true);draw(false);const stable=log.slice();renderFixture(null);return{stable,final:log};
  });
  assert.deepEqual(menu.stable,['attach']);assert.deepEqual(menu.final,['attach',runtime==='19'?'cleanup':'null']);receipt.lifecycle.push({menu});
  await page.evaluate(()=>{function PlainTrigger(props){return React.createElement('button',props,'Plain trigger');}renderFixture(React.createElement(CS.Menu,{trigger:React.createElement(PlainTrigger)}));renderFixture(null);});
  const refWarnings=warnings.filter(text=>/function components cannot be given refs|unexpected return value from a callback ref|accessing element.ref|forwardRef render functions|invalid prop.*ref/i.test(text));
  assert.deepEqual(refWarnings,[],'no ref warnings in development runtime');
 },{browserName,development:true,...(consumer?{reactRuntimeRoot:consumer}:{})});
 const dir=new URL('../../test-results/native-refs/',import.meta.url);mkdirSync(dir,{recursive:true});writeFileSync(new URL(`browser-${runtime}-${browserName}.json`,dir),JSON.stringify({...receipt,status:'PASS'},null,2)+'\n');
 console.log(`PASS ${receipt.targets.length} native targets, 15 distinct controls, focus/action, replacement, cleanup and Menu caller refs; React ${runtime} ${browserName}`);
}finally{if(consumer)rmSync(consumer,{recursive:true,force:true});}
