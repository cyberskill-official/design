import assert from 'node:assert/strict';import{readFileSync,writeFileSync,mkdirSync}from'node:fs';import{createHash}from'node:crypto';import{withBrowserFixture}from'./lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium',rows=[];
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
await withBrowserFixture(async page=>{
 await page.setViewportSize({width:1000,height:800});
 await page.evaluate(()=>{window.decodeNative=function decode(v){if(Array.isArray(v))return v.map(decode);if(!v||typeof v!=='object')return v;if(v.$element){const d=v.$element;return React.createElement(d.component?CS[d.component]:d.tag,decode(d.props||{}),decode(d.children));}return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,decode(x)]));};});
 const paints=new Map();
 for(const context of['form','fieldset','disabled-fieldset','first-legend'])for(const portal of[false,true])for(const[name,selector,triggerSelector,action]of cases){
  const fixture=fixtures.find(f=>f.name===name);
  await page.evaluate(({context,portal,name,fixture})=>{
   renderFixture(null);const h=React.createElement,props={...decodeNative(fixture.props),portal};delete props.open;
   if(name==='HoverCard')props.openDelay=0;
   if(name==='NavigationMenu')props.items=[{label:'Navigate',panel:[{label:'Destination',href:'#destination'}]}];
   if(name==='Toolbar'){props.items=[{label:'First'},{label:'Overflow action'}];props.overflowAfter=1;}
   if(name==='FloatingActionButton'){props.position='static';props.actions=[{label:'Dial action',icon:'+'}];}
   const component=h(CS[name],props);
   renderFixture(h('form',{id:'native-owner',onSubmit:e=>e.preventDefault(),style:{position:'relative',padding:30}},context==='form'?component:h('fieldset',{id:'native-fieldset',disabled:context==='first-legend'||context==='disabled-fieldset'},context==='first-legend'?h('legend',null,component):component,h('input',{id:'outside-legend',name:'outside'}))));
  },{context,portal,name,fixture});
  if(context==='disabled-fieldset'){
   const initial=await page.locator('#fixture button,#fixture input,#fixture select,#fixture textarea').evaluateAll(nodes=>nodes.map(el=>({disabled:el.matches(':disabled'),form:el.form?.id})));
   assert(initial.length>0,name+': initial disabled fixture has native controls');assert(initial.every(el=>el.disabled&&el.form==='native-owner'),name+': initially disabled native fieldset/form ownership');
   if(portal)assert.equal(await page.locator('[data-cs-floating-root]').evaluateAll(hosts=>hosts.every(host=>host.closest('#native-fieldset')&&!host.parentElement.isSameNode(document.body))),true,name+': initial fallback has no transient body host');
   await page.locator('#native-fieldset').evaluate(el=>el.disabled=false);
  }
  const trigger=page.locator(triggerSelector).first();await trigger.focus();if(action==='click')await trigger.click();if(action==='context')await trigger.press('Shift+F10');if(action==='mention')await trigger.fill('@an');
  const panel=page.locator(selector).first();await panel.waitFor({state:'visible'});
  const result=await panel.evaluate((node,{portal,context})=>{
   const host=node.closest('[data-cs-floating-root]'),properties=['font-family','font-size','font-weight','color','background-color','border-top-color','border-radius','box-shadow','padding-top','padding-left'];
   const css=getComputedStyle(node);return{local:host?.hasAttribute('data-cs-floating-inline'),form:node.closest('form')?.id,bodyHost:host?.parentElement===document.body,tag:host?.tagName,paint:Object.fromEntries(properties.map(p=>[p,css.getPropertyValue(p)])),controls:[...node.querySelectorAll('button,input,select,textarea')].map(el=>({form:el.form?.id,inheritedDisabled:el.matches(':disabled'),ownDisabled:el.disabled}))};
  },{portal,context});
  assert.equal(result.form,'native-owner',name+'/'+context+': original native form ancestry');if(portal){assert.equal(result.local,true);assert.equal(result.bodyHost,false);assert.equal(result.tag,'SPAN','private local host remains phrasing-compatible');}
  for(const control of result.controls){assert.equal(control.form,'native-owner',name+': actual native .form association');if(context==='first-legend')assert.equal(control.inheritedDisabled,control.ownDisabled,name+': disabled fieldset first-legend exemption');}
  const key=context+'/'+name;if(!portal)paints.set(key,result.paint);else assert.deepEqual(result.paint,paints.get(key),key+': local host preserves explicit-inline panel paint');
  if(context==='fieldset'){
   await page.locator('#native-fieldset').evaluate(el=>el.disabled=true);
   await page.waitForFunction(selector=>{const node=document.querySelector(selector);return !node||[...node.querySelectorAll('button,input,select,textarea')].every(el=>el.matches(':disabled'));},selector);
   // Some focus-owned widgets close when native disabling blurs their trigger.
   // Closure is safe; an exposed enabled body panel would fail the check above.
   await page.locator('#native-fieldset').evaluate(el=>el.disabled=false);
   if(!await panel.count()){await trigger.focus();if(action==='click')await trigger.click();if(action==='context')await trigger.press('Shift+F10');if(action==='mention'){await trigger.fill('');await trigger.fill('@an');}await panel.waitFor({state:'visible'});}
   assert.equal(await panel.evaluate(node=>[...node.querySelectorAll('button,input,select,textarea')].every(el=>el.matches(':disabled')===el.disabled)),true,name+': native re-enable restores original own disabled state');
  }
  rows.push({name,context,portal,...result});
 }
 // Empty ReactNode triggers cannot turn the local host into its own observed anchor.
 await page.evaluate(()=>{renderFixture(null);const h=React.createElement;renderFixture(h('form',{id:'empty-trigger-form'},h(CS.Tooltip,{label:'Empty trigger'},null),h(CS.HoverCard,{trigger:null,'aria-label':'Empty card'},'Content')));});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.equal(await page.locator('#empty-trigger-form [data-cs-floating-inline]').count(),2,'empty triggers keep local hosts without self-observation loops');
 // Arbitrary supported Popover content retains actual native behavior, not guessed serialization.
 await page.evaluate(()=>{
  renderFixture(null);const h=React.createElement;window.nativeSubmits=[];window.nativeMounts=0;
  function Content(){React.useEffect(()=>{nativeMounts++;},[]);return h(React.Fragment,null,h('input',{id:'native-value',name:'answer',defaultValue:'seed',required:true}),h('button',{id:'native-submit',type:'submit',name:'intent',value:'save'},'Save'));}
  renderFixture(h('form',{id:'native-behavior',onSubmit:e=>{e.preventDefault();nativeSubmits.push({submitter:e.nativeEvent.submitter?.id,answer:new FormData(e.currentTarget).get('answer')});}},h(CS.Popover,{open:true,portal:true,'aria-label':'Native behavior',trigger:h('button',{type:'button'},'Details')},h(Content))));
 });
 await page.locator('#native-value').waitFor();assert.deepEqual(await page.evaluate(()=>({form:document.getElementById('native-value').form.id,value:new FormData(document.getElementById('native-behavior')).get('answer'),listed:[...document.getElementById('native-behavior').elements].includes(document.getElementById('native-value'))})),{form:'native-behavior',value:'seed',listed:true});
 await page.locator('#native-value').fill('');await page.locator('#native-submit').click();assert.equal(await page.evaluate(()=>nativeSubmits.length),0,'actual required validation blocks submission');
 await page.locator('#native-value').fill('entered');await page.locator('#native-submit').click();assert.deepEqual(await page.evaluate(()=>nativeSubmits),[{submitter:'native-submit',answer:'entered'}]);await page.locator('#native-behavior').evaluate(el=>el.reset());assert.equal(await page.locator('#native-value').inputValue(),'seed','native reset includes fallback content');
 // Force the old body destination and prove this native form oracle rejects it.
 const mutation=await page.locator('#native-value').evaluate(el=>{const host=el.closest('[data-cs-floating-root]'),parent=host.parentNode;document.body.appendChild(host);const rejected=el.form===null&&!new FormData(document.getElementById('native-behavior')).has('answer');parent.appendChild(host);return rejected;});assert.equal(mutation,true,'old unconditional body portal loses real form association/FormData');
 // Automatic movement keeps one portal container and child identity. No remount/data loss.
 await page.evaluate(()=>{renderFixture(null);const h=React.createElement;window.movementMounts=0;window.firstNativeForms=[];window.movingPanelRef=React.createRef();function Content(){const[value,setValue]=React.useState('seed');React.useEffect(()=>{movementMounts++;},[]);return h('input',{id:'moving-input',name:'moving',value,onChange:e=>setValue(e.target.value),ref:node=>{if(node)firstNativeForms.push(node.form?.id||null);}});}renderFixture(h('div',null,h('form',{id:'move-form'}),h('div',{id:'move-outside'}),h('div',{id:'move-slot'},h(CS.Popover,{ref:movingPanelRef,open:true,portal:true,trigger:h('button',{type:'button'},'Move'),'aria-label':'Moving'},h(Content)))));});
 await page.locator('#moving-input').fill('preserved');await page.locator('#moving-input').evaluate(el=>{window.movingNode=el;window.movingPanelNode=movingPanelRef.current;el.setSelectionRange(2,6);document.getElementById('move-form').appendChild(document.getElementById('move-slot'));});await page.waitForFunction(()=>movingNode.form?.id==='move-form');
 const checkMovement=()=>page.evaluate(()=>({same:movingNode===document.getElementById('moving-input'),panelRefSame:movingPanelRef.current===movingPanelNode,value:movingNode.value,focused:movingNode===document.activeElement,selection:[movingNode.selectionStart,movingNode.selectionEnd],mounts:movementMounts}));assert.deepEqual(await checkMovement(),{same:true,panelRefSame:true,value:'preserved',focused:true,selection:[2,6],mounts:1});
 await page.evaluate(()=>document.getElementById('move-outside').appendChild(document.getElementById('move-slot')));await page.waitForFunction(()=>movingNode.form===null&&movingNode.closest('[data-cs-floating-root]').parentElement===document.body);assert.deepEqual(await checkMovement(),{same:true,panelRefSame:true,value:'preserved',focused:true,selection:[2,6],mounts:1});
 // ContextMenu's original slot is outside a descendant form: opener.form is not inherited.
 await page.evaluate(()=>{renderFixture(null);const h=React.createElement;renderFixture(h(CS.ContextMenu,{items:[{label:'Action'}]},h('form',{id:'context-inner'},h('input',{id:'context-native',name:'source'}))));});await page.locator('#context-native').focus();await page.locator('#context-native').press('Shift+F10');await page.getByRole('menuitem',{name:'Action'}).waitFor();assert.equal(await page.getByRole('menuitem',{name:'Action'}).evaluate(el=>el.form),null,'descendant opener does not invent panel form ownership');assert.equal(await page.locator('#context-native').evaluate(el=>el.form.id),'context-inner');
 await page.evaluate(()=>renderFixture(null));assert.equal(await page.locator('[data-cs-floating-root]').count(),0);rows.push({case:'native-form-behavior-mutation-and-stable-movement',status:'PASS'});
},{browserName,development:true});mkdirSync('test-results/floating-native-form',{recursive:true});writeFileSync(`test-results/floating-native-form/${browserName}.json`,JSON.stringify({status:'PASS',browserName,bundleSha256:createHash('sha256').update(readFileSync('_ds_bundle.js')).digest('hex'),rows},null,2)+'\n');console.log('PASS native-form fallback: all17 owners ×form/fieldset/firstlegend ×automatic/explicit inline paint, native FormData/elements/reset/validation/submitter, stable movement/focus/value and old-body mutation; '+browserName);
