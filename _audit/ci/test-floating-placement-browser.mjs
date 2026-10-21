import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync}from'node:fs';import{createHash}from'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';const rows=[];
await withBrowserFixture(async page=>{
 await page.setViewportSize({width:800,height:600});
 const mount=async(placement='bottom-start',dir='ltr')=>page.evaluate(({placement,dir})=>{
  renderFixture(null);const h=React.createElement;renderFixture(h('div',{dir:'ltr',id:'placement-scroll',style:{position:'fixed',left:150,top:100,width:500,height:350,overflow:'auto'}},h('div',{style:{width:1200,height:900,position:'relative'}},h('div',{dir,style:{position:'absolute',left:180,top:140,width:100}},h(CS.Popover,{open:true,placement,trigger:h('button',{id:'placement-trigger',style:{width:100,height:44}},'Anchor'),'aria-label':'Placement'},h('div',{style:{width:200,height:120}},'Panel'))))));
 },{placement,dir});
 const box=()=>page.locator('.cs-popover__panel').evaluate(node=>{const p=node.getBoundingClientRect(),a=document.getElementById('placement-trigger').getBoundingClientRect();return{p:{left:p.left,right:p.right,top:p.top,bottom:p.bottom,width:p.width,height:p.height},a:{left:a.left,right:a.right,top:a.top,bottom:a.bottom,width:a.width,height:a.height},placement:node.getAttribute('data-cs-placement')};});
 for(const dir of['ltr','rtl'])for(const side of['top','bottom','left','right'])for(const suffix of['','-start','-end']){
  const placement=side+suffix;await mount(placement,dir);await page.locator('.cs-popover__panel').waitFor();const result=await box();assert.equal(result.placement,placement);
  const close=(a,b,message)=>assert.ok(Math.abs(a-b)<0.75,`${dir}/${placement}: ${message}: ${a} vs ${b}`);
  if(side==='top')close(result.p.bottom,result.a.top-8,'top gap');if(side==='bottom')close(result.p.top,result.a.bottom+8,'bottom gap');if(side==='left')close(result.p.right,result.a.left-8,'left gap');if(side==='right')close(result.p.left,result.a.right+8,'right gap');
  if(side==='top'||side==='bottom'){
   if(suffix==='-start')close(dir==='rtl'?result.p.right:result.p.left,dir==='rtl'?result.a.right:result.a.left,'start alignment');
   else if(suffix==='-end')close(dir==='rtl'?result.p.left:result.p.right,dir==='rtl'?result.a.left:result.a.right,'end alignment');
   else close((result.p.left+result.p.right)/2,(result.a.left+result.a.right)/2,'center alignment');
  }else if(suffix==='-start')close(result.p.top,result.a.top,'start alignment');else if(suffix==='-end')close(result.p.bottom,result.a.bottom,'end alignment');else close((result.p.top+result.p.bottom)/2,(result.a.top+result.a.bottom)/2,'center alignment');
  rows.push({dir,placement,...result});
 }
 await mount();await page.locator('.cs-popover__panel').waitFor();const before=await box();
 await page.locator('#placement-scroll').evaluate(el=>{el.scrollTop=100;el.scrollLeft=100;});
 await page.waitForFunction(before=>Math.abs(document.querySelector('.cs-popover__panel').getBoundingClientRect().left-(before.p.left-100))<0.75&&Math.abs(document.querySelector('.cs-popover__panel').getBoundingClientRect().top-(before.p.top-100))<0.75,before);
 rows.push({case:'nested-scroll',before,after:await box()});
 await page.setViewportSize({width:400,height:300});await page.waitForFunction(()=>{const p=document.querySelector('.cs-popover__panel').getBoundingClientRect();return p.left>=7.5&&p.right<=392.5&&p.top>=7.5&&p.bottom<=292.5;});rows.push({case:'resize',after:await box()});
 await page.setViewportSize({width:800,height:600});
 // Body placement must preserve explicit hidden/inert/accessibility controls on source ancestors.
 await page.evaluate(()=>{renderFixture(null);const h=React.createElement;renderFixture(h('div',{id:'source-visibility'},h(CS.Popover,{open:true,trigger:h('button',null,'Visibility source'),'aria-label':'Visibility panel'},h('button',{id:'visibility-action'},'Action'))));});
 await page.locator('#visibility-action').waitFor();
 for(const attribute of ['hidden','inert','aria-hidden']){
  await page.locator('#source-visibility').evaluate((el,attribute)=>el.setAttribute(attribute,attribute==='aria-hidden'?'true':''),attribute);
  await page.waitForFunction(attribute=>{const host=document.querySelector('#visibility-action').closest('[data-cs-floating-root]');return attribute==='hidden'?getComputedStyle(host).display==='none':attribute==='inert'?host.inert:host.getAttribute('aria-hidden')==='true';},attribute);
  if(attribute==='hidden')assert.equal(await page.locator('#visibility-action').isVisible(),false);
  if(attribute==='inert')assert.equal(await page.locator('#visibility-action').evaluate(el=>{el.focus();return document.activeElement===el;}),false);
  await page.locator('#source-visibility').evaluate((el,attribute)=>el.removeAttribute(attribute),attribute);
  await page.waitForFunction(()=>{const host=document.querySelector('#visibility-action').closest('[data-cs-floating-root]');return getComputedStyle(host).display==='contents'&&!host.inert&&!host.hasAttribute('aria-hidden');});
 }
 rows.push({case:'source-hidden-inert-aria-hidden-controls',status:'PASS'});
 // Registered descendants count as inside the parent even when each is a separate body portal.
 await page.evaluate(()=>{
  renderFixture(null);window.portalActions=0;const h=React.createElement;
  function App(){const[open,setOpen]=React.useState(false);return h(React.Fragment,null,h('button',{id:'launch-parent',onClick:()=>setOpen(true)},'Launch parent'),h(CS.Dialog,{open,title:'Portal ancestry',onClose:()=>setOpen(false)},h(CS.Popover,{trigger:h('button',{id:'outer-trigger'},'Outer'),'aria-label':'Outer panel'},h(CS.Popover,{trigger:h('button',{id:'inner-trigger'},'Inner'),'aria-label':'Inner panel'},h('button',{id:'inner-action',onClick:()=>portalActions++},'Nested action')))));}renderFixture(h(App));
 });
 await page.locator('#launch-parent').focus();await page.keyboard.press('Enter');await page.locator('#outer-trigger').click();await page.locator('#inner-trigger').click();await page.locator('#inner-action').click();assert.equal(await page.evaluate(()=>portalActions),1);assert.equal(await page.getByRole('dialog',{name:'Outer panel',exact:true}).count(),1);assert.equal(await page.getByRole('dialog',{name:'Inner panel',exact:true}).count(),1);
 await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog',{name:'Inner panel',exact:true}).count(),0);assert.equal(await page.getByRole('dialog',{name:'Outer panel',exact:true}).count(),1);assert.equal(await page.locator('#inner-trigger').evaluate(el=>el===document.activeElement),true);
 await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog',{name:'Outer panel',exact:true}).count(),0);assert.equal(await page.locator('#outer-trigger').evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.locator('#launch-parent').evaluate(el=>el===document.activeElement),true);rows.push({case:'transitive-owned-portals',status:'PASS'});
 // React context remains scoped; mode switches deliberately remount floating children.
 await page.evaluate(()=>{
  renderFixture(null);const h=React.createElement;window.childMounts=0;window.childUnmounts=0;window.panelRef=React.createRef();
  function Content(){const[count,setCount]=React.useState(0);const t=CS.useMessages('PortalExample','fr');React.useEffect(()=>{childMounts++;return()=>{childUnmounts++;};},[]);return h('button',{id:'stateful-content',onClick:()=>setCount(count+1)},t('action')+':'+count);}
  function App(){const[portal,setPortal]=React.useState(true);const[open,setOpen]=React.useState(true);window.setPortalMode=setPortal;return h(CS.LocaleProvider,{messages:{PortalExample:{fr:{action:'Action locale'}}}},h(CS.Dialog,{open:true,title:'Mode parent'},h(CS.Popover,{ref:panelRef,portal,open,onOpenChange:setOpen,trigger:h('button',{id:'mode-trigger'},'Mode'),'aria-label':'Mode panel'},h(Content))));}renderFixture(h(App));
 });
 await page.locator('#stateful-content').click();await page.waitForFunction(()=>document.querySelector('#stateful-content')?.textContent==='Action locale:1');assert.equal(await page.locator('#stateful-content').textContent(),'Action locale:1');await page.evaluate(()=>{window.oldPanel=panelRef.current;ReactDOM.flushSync(()=>setPortalMode(false));});await page.waitForFunction(()=>childMounts===2&&childUnmounts===1);assert.equal(await page.locator('#stateful-content').textContent(),'Action locale:0');assert.equal(await page.evaluate(()=>oldPanel!==panelRef.current&&!oldPanel.isConnected&&panelRef.current.isConnected&&!panelRef.current.closest('[data-cs-floating-root], [inert]')),true);await page.locator('#stateful-content').click();await page.waitForFunction(()=>document.querySelector('#stateful-content')?.textContent==='Action locale:1');assert.equal(await page.locator('#stateful-content').textContent(),'Action locale:1');await page.evaluate(()=>{window.oldInlinePanel=panelRef.current;ReactDOM.flushSync(()=>setPortalMode(true));});await page.waitForFunction(()=>childMounts===3&&childUnmounts===2);assert.equal(await page.locator('#stateful-content').textContent(),'Action locale:0');assert.equal(await page.evaluate(()=>oldInlinePanel!==panelRef.current&&!oldInlinePanel.isConnected&&!!panelRef.current.closest('[data-cs-floating-root]')&&!panelRef.current.closest('[inert]')),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog',{name:'Mode panel',exact:true}).count(),0);assert.equal(await page.getByRole('dialog',{name:'Mode parent',exact:true}).count(),1);rows.push({case:'portal-mode-remount-and-context',status:'PASS'});
 await page.evaluate(()=>{renderFixture(null);renderFixture(React.createElement(CS.Tooltip,{label:'Bottom tooltip'},React.createElement('button',{id:'edge-tooltip',style:{position:'fixed',left:300,top:8,width:100,height:44}},'Edge')));});
 await page.locator('#edge-tooltip').hover();await page.waitForFunction(()=>document.querySelector('.cs-tooltip__bubble')?.getAttribute('data-cs-placement')==='bottom');
 const arrow=await page.getByRole('tooltip').evaluate(el=>({border:getComputedStyle(el,'::after').borderBottomColor,background:getComputedStyle(el).backgroundColor,rect:el.getBoundingClientRect().toJSON()}));assert.equal(arrow.border,arrow.background,'flipped tooltip arrow faces its trigger');
 await page.mouse.move(350,56);assert.equal(await page.getByRole('tooltip').count(),1,'bottom hover bridge spans trigger gap');await page.mouse.move(0,599);assert.equal(await page.getByRole('tooltip').count(),0);rows.push({case:'flipped-tooltip-arrow-hover-bridge',status:'PASS'});
 // Real VisualViewport event target with synthetic keyboard-sized dimensions; no physical keyboard claim.
 await mount();await page.locator('.cs-popover__panel').waitFor();await page.evaluate(()=>{Object.defineProperties(window.visualViewport,{height:{configurable:true,value:260},offsetTop:{configurable:true,value:60}});visualViewport.dispatchEvent(new Event('resize'));});await page.waitForFunction(()=>{const p=document.querySelector('.cs-popover__panel').getBoundingClientRect();return p.top>=67.5&&p.bottom<=312.5;});rows.push({case:'synthetic-visual-viewport-resize',after:await box()});
 await page.evaluate(()=>renderFixture(null));assert.equal(await page.locator('[data-cs-floating-root], [inert]').count(),0);
},{browserName,development:true});
mkdirSync('test-results/floating-panels',{recursive:true});writeFileSync(`test-results/floating-panels/placement-${browserName}.json`,JSON.stringify({status:'PASS',browserName,bundleSha256:createHash('sha256').update(readFileSync('_ds_bundle.js')).digest('hex'),rows},null,2)+'\n');console.log('PASS real floating placements/RTL, scroll/resize/visual viewport, transitive ownership/focus restoration, React context and documented mode remount; '+browserName);
