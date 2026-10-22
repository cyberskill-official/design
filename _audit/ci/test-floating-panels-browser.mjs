import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const cases=[
 ['Tooltip','.cs-tooltip__bubble','.cs-tooltip > button','focus'],
 ['Popover','.cs-popover__panel','.cs-popover > button','click'],
 ['HoverCard','.cs-hovercard__panel','.cs-hovercard > button','focus'],
 ['Popconfirm','.cs-popconfirm__panel','.cs-popconfirm > button','click'],
 ['Menu','.cs-menu__list','.cs-menu > button','click'],
 ['ContextMenu','.cs-menu__list','.cs-ctxmenu-zone','context'],
 ['Combobox','.cs-combobox__popup','.cs-combobox > input','focus'],
 ['DatePicker','.cs-datepicker__pop','.cs-datepicker > button','click'],
 ['Cascader','.cs-cascader__pop','.cs-cascader > button','click'],
 ['TreeSelect','.cs-treeselect__pop','.cs-treeselect > button','click'],
 ['ColorPicker','.cs-colorpicker__pop','.cs-colorpicker > button','click'],
 ['Mentions','.cs-mentions__pop','.cs-mentions > textarea','mention'],
 ['Menubar','.cs-menu__list','.cs-menubar__top','click'],
 ['NavigationMenu','.cs-navmenu__panel','.cs-navmenu__top','click'],
 ['Toolbar','.cs-menu__list','.cs-toolbar__more > button','click'],
 ['FloatingActionButton','.cs-fab__dial','.cs-fab__main','click'],
 ['AIDisclosureBadge','.cs-ai-disclosure__panel','.cs-ai-disclosure__badge','click'],
];
const fixtures=JSON.parse(readFileSync('scripts/fixtures/static-html-reference.json')).components;
const rows=[],hoverEscapes=[];
await withBrowserFixture(async page=>{
 await page.setViewportSize({width:800,height:600});
 await page.evaluate(()=>{
  window.decodeFloating=function decode(value){if(Array.isArray(value))return value.map(decode);if(!value||typeof value!=='object')return value;if(value.$element){const d=value.$element;return React.createElement(d.component?CS[d.component]:d.tag,decode(d.props||{}),decode(d.children));}return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,decode(v)]));};
 });
 for(const nested of[false,true])for(const portal of[true,false])for(const[name,selector,triggerSelector,action]of cases){
  const fixture=fixtures.find(f=>f.name===name);
  await page.evaluate(({name,fixture,nested,portal})=>{
   renderFixture(null);window.parentCloses=0;window.panelSelections=[];
   const h=React.createElement;const props={...decodeFloating(fixture.props),portal};delete props.open;
   if(name==='HoverCard'){props.openDelay=0;props.children=h('button',{id:'portal-content-action'},'Panel action');}
   if(name==='Popover')props.children=h('button',{id:'portal-content-action'},'Panel action');
   if(name==='NavigationMenu')props.items=[{label:'Navigate',panel:[{label:'Panel destination',href:'#destination'}]},{label:'Second',panel:[{label:'Another destination',href:'#another'}]}];
   if(name==='Toolbar'){props.items=[{label:'First'},{label:'Overflow action'}];props.overflowAfter=1;}
   if(name==='FloatingActionButton'){props.position='static';props.actions=[{label:'Dial action',icon:'+'}];}
   window.drawFloating=(mode=portal)=>{
    const component=h(CS[name],{...props,portal:mode});
    const scope=h('div',{id:'floating-scope',lang:'vi',dir:'rtl','data-theme':'dark','data-cs-density':'compact',style:{'--consumer-probe':'portal-value'}},
      h('div',{id:'clip',style:nested?{overflow:'hidden',height:100,position:'relative'}:{position:'fixed',left:500,top:480,width:240,height:90,overflow:'hidden',transform:'translateZ(0)'}},
       h('div',{id:'anchor-slot',style:{position:'absolute',left:30,top:30,width:180}},component)));
    function Parent(){const[open,setOpen]=React.useState(true);return h(React.Fragment,null,h('button',{id:'outside-floating'},'Outside'),nested?h(CS.Dialog,{open,title:'Floating parent',onClose:()=>{parentCloses++;setOpen(false);}},scope):scope);}
    // Keep the wrapper type stable on controlled portal changes.
    if(!window.FloatingParent)window.FloatingParent=Parent;
    window.floatingScope=scope;window.floatingNested=nested;
    renderFixture(h(window.FloatingStableParent));
   };
   window.FloatingStableParent=function(){const[open,setOpen]=React.useState(true);return h(React.Fragment,null,h('button',{id:'outside-floating'},'Outside'),window.floatingNested?h(CS.Dialog,{open,title:'Floating parent',onClose:()=>{parentCloses++;setOpen(false);}},window.floatingScope):window.floatingScope);};
   drawFloating();
  },{name,fixture,nested,portal});
  const trigger=page.locator(triggerSelector).first();
  if(name==='Tooltip'){
   // This matrix opens Tooltip by native focus. A pointer left over the prior
   // fixture can create a separate hover entry when its geometry changes.
   await page.mouse.move(0,0);assert.equal(await trigger.evaluate(el=>el.matches(':hover')),false,'focus-mode Tooltip has no incidental hover owner');
  }
  await trigger.focus();
  if(action==='click')await trigger.click();
  if(action==='context')await trigger.press('Shift+F10');
  if(action==='mention')await trigger.fill('@an');
  const panel=page.locator(selector).first();await panel.waitFor({state:'visible'});
  const observation=await panel.evaluate((node,{portal,nested,triggerSelector})=>{
   const host=node.closest('[data-cs-floating-root]');const rect=node.getBoundingClientRect();const anchor=document.querySelector(triggerSelector);const c=getComputedStyle(node);
   return {portaled:!!host,parentBody:host?.parentElement===document.body,clipped:document.getElementById('clip').contains(node),inert:!!node.closest('[inert]'),placement:node.getAttribute('data-cs-placement'),rect:{left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height},probe:c.getPropertyValue('--consumer-probe').trim(),direction:c.direction,hostLang:host?.lang,theme:host?.getAttribute('data-theme'),density:host?.getAttribute('data-cs-density'),token:c.getPropertyValue('--cs-color-text-primary').trim(),anchorToken:getComputedStyle(anchor).getPropertyValue('--cs-color-text-primary').trim()};
  },{portal,nested,triggerSelector});
  assert.equal(observation.portaled,portal,name+' portal default/opt-out');assert.equal(observation.clipped,!portal,name+' inline containment');
  if(portal){assert.ok(observation.parentBody,name+' body host');assert.ok(observation.rect.left>=7.5&&observation.rect.top>=7.5&&observation.rect.right<=792.5&&observation.rect.bottom<=592.5,name+' viewport bounds '+JSON.stringify(observation.rect));assert.equal(observation.hostLang,'vi');assert.equal(observation.theme,'dark');assert.equal(observation.density,'compact');}
  assert.equal(observation.probe,'portal-value',name+' custom variable inheritance');assert.equal(observation.direction,'rtl');assert.equal(observation.token,observation.anchorToken,name+' theme token');assert.equal(observation.inert,false,name+' owned surface remains interactive');
  assert.ok(observation.placement,name+' resolved placement');
  if(nested){
   assert.equal(await page.locator('#outside-floating').evaluate(el=>!!el.closest('[inert]')),true);
   const focusable=panel.locator('button:not(:disabled),input:not(:disabled),a[href],[tabindex="0"]').first();
   if(await focusable.count()){await focusable.focus();assert.equal(await focusable.evaluate(el=>el===document.activeElement),true,name+' modal trap includes portaled control');}
  }
  if(portal){
   await page.locator('#floating-scope').evaluate(el=>{el.lang='en';el.dir='ltr';el.setAttribute('data-theme','light');el.setAttribute('data-cs-density','comfortable');el.style.setProperty('--consumer-probe','updated-value');});
   await page.waitForFunction(selector=>{const node=document.querySelector(selector);const host=node?.closest('[data-cs-floating-root]');return host?.lang==='en'&&host.dir==='ltr'&&host.getAttribute('data-theme')==='light'&&getComputedStyle(node).getPropertyValue('--consumer-probe').trim()==='updated-value';},selector);
  }
  await page.keyboard.press('Escape');await panel.waitFor({state:'hidden'});if(name==='Tooltip')assert.equal(await trigger.evaluate(el=>el===document.activeElement),true,'Escape dismisses focus-mode Tooltip without moving its trigger focus');
  if(nested){assert.equal(await page.getByRole('dialog',{name:'Floating parent',exact:true}).count(),1,name+' child Escape preserves modal');assert.equal(await page.evaluate(()=>parentCloses),0);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>parentCloses),1);}
  rows.push({name,nested,portal,...observation});
 }
 // Pointer-hover Escape remains independently covered while the pointer stays
 // on its native target: body, explicit inline, and automatic form fallback.
 for(const[portal,form]of[[true,false],[false,false],[true,true]]){
  await page.mouse.move(0,0);await page.evaluate(({portal,form})=>{renderFixture(null);const h=React.createElement,tip=h(CS.Tooltip,{portal,label:'Hover Escape'},h('button',{id:'hover-escape-target',style:{position:'fixed',left:200,top:150,width:140,height:44}},'Hover target'));renderFixture(form?h('form',null,tip):tip);},{portal,form});
  const target=page.locator('#hover-escape-target');await target.hover();assert.equal(await target.evaluate(el=>el.matches(':hover')),true,'native pointer hover precondition');await page.getByRole('tooltip',{name:'Hover Escape'}).waitFor();await page.keyboard.press('Escape');await page.locator('.cs-tooltip__bubble').waitFor({state:'hidden'});assert.equal(await target.evaluate(el=>el.matches(':hover')),true,'Escape leaves pointer on the trigger');assert.equal(await page.getByRole('tooltip').count(),0,'hover-owned Tooltip remains dismissed until a new entry');hoverEscapes.push({portal,form,status:'PASS'});
 }
 await page.evaluate(()=>renderFixture(null));assert.equal(await page.locator('[data-cs-floating-root]').count(),0,'all portal hosts cleaned up');assert.equal(await page.locator('[inert]').count(),0,'inert state cleaned up');
},{browserName});
mkdirSync('test-results/floating-panels',{recursive:true});writeFileSync(`test-results/floating-panels/matrix-${browserName}.json`,JSON.stringify({status:'PASS',browserName,bundleSha256:createHash('sha256').update(readFileSync('_ds_bundle.js')).digest('hex'),rows,hoverEscapes},null,2)+'\n');
console.log(`PASS ${rows.length} floating cases: all17 owners, body/inline, clipping/viewport, axes/custom variables, nested modal focus/inert/Escape, cleanup plus ${hoverEscapes.length} pointer-hover Escape cases; ${browserName}`);
