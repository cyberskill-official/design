import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const root=resolve('.'),browserName=process.env.CS_TEST_BROWSER||'chromium';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
async function compile(mutation){
  let applied=false;
  const result=await build({stdin:{contents:"import * as CS from './_esm/react.mjs'; window.CS=CS;",resolveDir:root},bundle:true,write:false,metafile:true,format:'iife',plugins:[{name:'runtime-peers',setup(builder){
    builder.onResolve({filter:/^react(?:-dom)?$/},args=>({path:args.path,namespace:'peer'}));
    builder.onLoad({filter:/.*/,namespace:'peer'},args=>({contents:args.path==='react'?'module.exports=window.React;':'module.exports=window.ReactDOM;',loader:'js'}));
    if(mutation)builder.onLoad({filter:mutation.file},args=>{const source=readFileSync(args.path,'utf8');assert(source.includes(mutation.before),'Mutation source precondition');applied=true;return{contents:source.replace(mutation.before,mutation.after),loader:'jsx'}});
  }}]});
  if(mutation)assert(applied,'Real component source was mutated');
  return result;
}
const compiled=await compile();
const inputs=Object.fromEntries(Object.keys(compiled.metafile.inputs).filter(path=>path!=='<stdin>'&&!path.startsWith('peer:')).map(path=>[path,sha(readFileSync(path))]));
const remember=path=>{inputs[relative(root,resolve(path))]=sha(readFileSync(path));};
function rememberCss(path){remember(path);for(const match of readFileSync(path,'utf8').matchAll(/url\(["']?([^"')]+)["']?\)/g))if(!/^(?:data:|https?:|#)/.test(match[1])){const target=resolve(dirname(path),match[1]);if(target.endsWith('.css'))rememberCss(target);else remember(target);}}
const runtime=await build({stdin:{contents:"import React from 'react'; import * as client from 'react-dom/client'; import { flushSync, createPortal } from 'react-dom'; window.React = React; window.ReactDOM = { ...client, flushSync, createPortal };",resolveDir:root},bundle:true,write:false,metafile:true,platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"development"'}});
for(const path of Object.keys(runtime.metafile.inputs))if(path!=='<stdin>')remember(path);
for(const path of ['_audit/ci/test-semantic-keyboard-contracts-browser.mjs','_audit/ci/lib/browser-fixture.mjs','package-lock.json','_ds_bundle.js'])remember(path);
rememberCss(resolve('styles.css'));
const rows=[],negativeRows=[];let nativeTabModel;
await withBrowserFixture(async page=>{
  await page.addScriptTag({content:compiled.outputFiles[0].text});
  const active=()=>page.evaluate(()=>document.activeElement?.getAttribute('data-testid'));
  await page.evaluate(()=>{const h=React.createElement;renderFixture(h('div',null,h('button',{id:'native-before'},'Native before'),h('fieldset',null,h('legend',null,'Native radio choices'),h('label',null,h('input',{id:'native-radio',type:'radio',name:'native-baseline',value:'a',defaultChecked:true}),'Native radio'),h('label',null,h('input',{type:'radio',name:'native-baseline',value:'b',disabled:true}),'Disabled native radio'),h('label',null,h('input',{type:'radio',name:'native-baseline',value:'c'}),'Other native radio')),h('button',{id:'native-after'},'Native after')))});
  await page.locator('#native-before').focus();await page.keyboard.press('Tab');
  nativeTabModel=await page.evaluate(()=>({platform:navigator.platform,plainTabTarget:document.activeElement.id||document.activeElement.tagName}));
  let allControlsTab='Tab';
  if(nativeTabModel.plainTabTarget!=='native-radio'){
    assert.equal(browserName,'webkit','Unexpected browser native Tab policy');assert.match(nativeTabModel.platform,/Mac/,'Only known macOS WebKit all-controls policy is adapted');
    await page.locator('#native-before').focus();await page.keyboard.press('Alt+Tab');assert.equal(await page.locator('#native-radio').evaluate(el=>el===document.activeElement),true,'Independent native HTML all-controls chord must enter the radio');allControlsTab='Alt+Tab';
  }
  nativeTabModel.allControlsChord=allControlsTab;
  await page.evaluate(()=>{window.nativeRadioChanges=[];document.querySelectorAll('input[name="native-baseline"]').forEach(el=>el.addEventListener('change',()=>nativeRadioChanges.push(el.value)));});
  const nativeRadioSteps=[];
  for(const key of ['ArrowRight','ArrowRight','ArrowLeft','Space']){await page.keyboard.press(key);nativeRadioSteps.push(await page.evaluate(key=>({key,checked:document.querySelector('input[name="native-baseline"]:checked').value,focused:document.activeElement.value}),key));}
  assert.equal(nativeRadioSteps[0].checked,'c','Independent native radio must skip disabled choice');
  nativeTabModel.radioSteps=nativeRadioSteps;nativeTabModel.radioChanges=await page.evaluate(()=>nativeRadioChanges);

  const pressTab=backward=>page.keyboard.press(backward?(allControlsTab==='Tab'?'Shift+Tab':'Alt+Shift+Tab'):allControlsTab);

  // Native same-name radios supply their own arrow/Space model. The fieldset is not a custom tablist.
  await page.evaluate(()=>{const e=React.createElement;function RadioFixture(){const[value,setValue]=React.useState('a');return e('div',null,e('button',{'data-testid':'before'},'Before'),e(CS.RadioGroup,{legend:'Native choices',value,onChange:v=>{window.radioChanges.push(v);setValue(v)},options:[{value:'a',label:'Alpha'},{value:'b',label:'Disabled',disabled:true},{value:'c',label:'Charlie'}]}),e('button',{'data-testid':'after'},'After'))}window.radioChanges=[];renderFixture(e(RadioFixture));});
  await page.getByTestId('before').focus();await pressTab();
  assert.equal(await page.getByRole('radio',{name:'Alpha',exact:true}).evaluate(el=>el===document.activeElement),true);
  for(const step of nativeRadioSteps){await page.keyboard.press(step.key);assert.equal(await page.getByRole('radio',{name:step.checked==='a'?'Alpha':'Charlie',exact:true}).isChecked(),true,'Controlled RadioGroup matches independent native radio boundary behavior');assert.equal(await page.evaluate(()=>document.activeElement.value),step.focused);}
  assert.deepEqual(await page.evaluate(()=>radioChanges),nativeTabModel.radioChanges);
  await pressTab();assert.equal(await active(),'after');
  rows.push({component:'RadioGroup',contract:'Native radio entry, disabled skip, independently verified browser boundary behavior, checked state/callbacks, Space and Tab exit'});

  await page.evaluate(()=>{const e=React.createElement;renderFixture(e('div',null,e('button',{'data-testid':'before'},'Before'),e(CS.ScrollArea,{'data-testid':'scroll',maxHeight:120,role:'region','aria-label':'Keyboard scroll'},e('div',{style:{height:1200}},'Long scroll content')),e('button',{'data-testid':'after'},'After')))});
  await page.getByTestId('before').focus();await pressTab();assert.equal(await active(),'scroll');
  await page.getByTestId('scroll').evaluate(el=>{window.scrollArrowEvent=undefined;el.addEventListener('keydown',event=>setTimeout(()=>{window.scrollArrowEvent={key:event.key,prevented:event.defaultPrevented};},0),{once:true});});
  await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>window.scrollArrowEvent!==undefined);assert.deepEqual(await page.evaluate(()=>scrollArrowEvent),{key:'ArrowDown',prevented:false});
  await page.keyboard.press('PageDown');await page.waitForFunction(()=>document.querySelector('[data-testid="scroll"]').scrollTop>0);
  const firstScroll=await page.getByTestId('scroll').evaluate(el=>el.scrollTop);
  await page.keyboard.press('Space');await page.waitForFunction(first=>document.querySelector('[data-testid="scroll"]').scrollTop>first,firstScroll);
  await pressTab();assert.equal(await active(),'after');
  await pressTab(true);assert.equal(await active(),'scroll');
  await pressTab(true);assert.equal(await active(),'before');
  rows.push({component:'ScrollArea',contract:'Actual native Tab entry, unintercepted ArrowDown, PageDown/Space scrolling, forward/reverse exit'});

  await page.evaluate(()=>{const e=React.createElement;renderFixture(e('div',null,e('button',{'data-testid':'before'},'Before'),e(CS.TreeTable,{caption:'Native expandable table',lang:'en',columns:[{key:'name',header:'Name'}],nodes:[{key:'root',name:'Root',children:[{key:'child',name:'Child'}]}]}),e('button',{'data-testid':'after'},'After')))});
  await page.getByTestId('before').focus();await pressTab();const disclosure=page.getByRole('button',{name:'Expand Root',exact:true});
  assert.equal(await disclosure.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Enter');const collapse=page.getByRole('button',{name:'Collapse Root',exact:true});
  assert.equal(await collapse.getAttribute('aria-expanded'),'true');
  assert.equal(await collapse.evaluate(el=>document.getElementById(el.getAttribute('aria-controls'))?.textContent),'Child');
  await page.keyboard.press('ArrowDown');assert.equal(await collapse.evaluate(el=>el===document.activeElement),true,'Native table does not invent treegrid roving keys');
  await page.keyboard.press('Space');assert.equal(await disclosure.getAttribute('aria-expanded'),'false');assert.equal(await page.getByText('Child',{exact:true}).count(),0);
  await pressTab();assert.equal(await active(),'after');
  rows.push({component:'TreeTable',contract:'Native disclosure Enter/Space, child row relation, focus retained, native table Tab exit'});

  await page.evaluate(()=>{const e=React.createElement;window.editorChanges=[];renderFixture(e('div',null,e('button',{'data-testid':'before'},'Before'),e(CS.Editor,{lang:'en',defaultValue:'Seed',onChange:html=>editorChanges.push(html)}),e('button',{'data-testid':'after'},'After')))});
  await page.getByTestId('before').focus();
  for(const name of ['Bold','Italic','Bullet list']){await pressTab();assert.equal(await page.getByRole('button',{name,exact:true}).evaluate(el=>el===document.activeElement),true);}
  await pressTab();assert.equal(await page.getByRole('textbox').evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('ControlOrMeta+A');await page.keyboard.insertText('Typed tiếng Việt');
  assert.equal(await page.getByRole('textbox').textContent(),'Typed tiếng Việt');assert((await page.evaluate(()=>editorChanges.at(-1))).includes('Typed tiếng Việt'));
  await pressTab();assert.equal(await active(),'after');
  rows.push({component:'Editor',contract:'Actual native toolbar Tab sequence, contenteditable entry, real text input/onChange and Tab exit; formatting commands covered separately by test-editor-browser'});

  for(const component of ['Button','Card','Item','NavItem','ListItem']){
    await page.evaluate(component=>{const e=React.createElement;window.nativeActivations=[];const props={'data-testid':'action',onClick:()=>nativeActivations.push(component)};let action;
      if(component==='Button')action=e(CS.Button,props,'Action');
      if(component==='Card')action=e(CS.Card,{...props,interactive:true},'Action');
      if(component==='Item')action=e(CS.Item,{...props,title:'Action'});
      if(component==='NavItem')action=e(CS.NavItem,props,'Action');
      if(component==='ListItem')action=e(CS.List,null,e(CS.ListItem,{...props,title:'Action'}));
      renderFixture(e('div',null,e('button',{'data-testid':'before'},'Before'),action,e('button',{'data-testid':'after'},'After')));
    },component);
    await page.getByTestId('before').focus();await pressTab();assert.equal(await active(),'action');
    await page.keyboard.press('Enter');await page.keyboard.press('Space');assert.deepEqual(await page.evaluate(()=>nativeActivations),[component,component]);
    await pressTab();assert.equal(await active(),'after');
    rows.push({component,contract:'Existing native button target: real Tab/Enter/Space callbacks and Tab exit'});
  }

  await page.evaluate(()=>{const e=React.createElement;window.groupActivations=[];renderFixture(e('div',null,e('button',{'data-testid':'before'},'Before'),e(CS.ButtonGroup,{label:'Actions'},e(CS.Button,{'data-testid':'first',onClick:()=>groupActivations.push('first')},'First'),e(CS.Button,{'data-testid':'second',onClick:()=>groupActivations.push('second')},'Second')),e('button',{'data-testid':'after'},'After')))});
  await page.getByTestId('before').focus();await pressTab();assert.equal(await active(),'first');
  await page.keyboard.press('ArrowRight');assert.equal(await active(),'first','ButtonGroup does not impose a value-picker arrow model');
  await page.keyboard.press('Enter');await pressTab();assert.equal(await active(),'second');await page.keyboard.press('Space');
  assert.deepEqual(await page.evaluate(()=>groupActivations),['first','second']);await pressTab();assert.equal(await active(),'after');
  rows.push({component:'ButtonGroup',contract:'Role group preserves independent child native Tab stops and activation, no roving/selection model'});

  await page.evaluate(()=>{const e=React.createElement;window.linkActivations=[];renderFixture(e(CS.Sidebar,{label:'Native navigation'},e(CS.NavItem,{href:'#semantic-nav','data-testid':'nav-link',onClick:()=>linkActivations.push('nav')},'Navigation'),e(CS.Item,{href:'#semantic-item','data-testid':'item-link',title:'Item link',onClick:()=>linkActivations.push('item')})));});
  await page.getByTestId('nav-link').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>location.hash),'#semantic-nav');
  await pressTab();assert.equal(await active(),'item-link');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>location.hash),'#semantic-item');
  assert.deepEqual(await page.evaluate(()=>linkActivations),['nav','item']);
  rows.push({component:'Sidebar',also:['NavItem','Item'],contract:'Native nav landmark/anchor descendants: real Tab order, Enter hash navigation and callbacks'});

  await page.evaluate(()=>{const e=React.createElement;window.formSubmissions=[];renderFixture(e(CS.Form,{initialValues:{name:'Seed'},onSubmit:values=>formSubmissions.push(values)},e(CS.FormField,{name:'name',label:'Native field'},e(CS.TextField,{'data-testid':'form-input'})),e('button',{type:'submit'},'Submit native form')));});
  await page.getByTestId('form-input').focus();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.insertText('Edited');await page.keyboard.press('Enter');
  await page.waitForFunction(()=>formSubmissions.length===1);assert.deepEqual(await page.evaluate(()=>formSubmissions),[{name:'Edited'}]);
  assert.equal(await page.getByTestId('form-input').evaluate(el=>el.getAttribute('aria-labelledby')&&document.getElementById(el.getAttribute('aria-labelledby')).textContent),'Native field');
  rows.push({component:'Form',also:['FormField'],contract:'Native input editing and implicit Enter submission preserve controlled value/name and field association'});
  await page.evaluate(()=>renderFixture(null));
  for(const mutation of [
    {name:'radio-change-ignored',file:/components\/forms\/RadioGroup\.jsx$/,before:'onChange={() => onChange && onChange(o.value)}',after:'onChange={() => {}}',kind:'radio'},
    {name:'scroll-native-entry-removed',file:/components\/data\/ScrollArea\.jsx$/,before:'tabIndex={0}',after:'tabIndex={-1}',kind:'scroll'},
    {name:'disclosure-activation-ignored',file:/components\/datatable\/TreeTable\.jsx$/,before:'onClick={() => setExpanded(current => current.includes(n.key) ? current.filter((k) => k !== n.key) : [...current, n.key])}',after:'onClick={() => {}}',kind:'tree'},
  ]){
    await page.addScriptTag({content:(await compile(mutation)).outputFiles[0].text});
    await page.evaluate(kind=>{const e=React.createElement;let content;if(kind==='radio'){function R(){const[value,setValue]=React.useState('a');return e(CS.RadioGroup,{legend:'Negative radio',value,onChange:setValue,options:[{value:'a',label:'Alpha'},{value:'c',label:'Charlie'}]})}content=e(R)}else if(kind==='scroll')content=e(CS.ScrollArea,{'data-testid':'negative-scroll',maxHeight:100},e('div',{style:{height:1000}},'Long'));else content=e(CS.TreeTable,{lang:'en',columns:[{key:'name',header:'Name'}],nodes:[{key:'root',name:'Root',children:[{key:'child',name:'Child'}]}]});renderFixture(e('div',null,e('button',{'data-testid':'before'},'Before'),content,e('button',{'data-testid':'after'},'After')));},mutation.kind);
    let rejected;
    if(mutation.kind==='radio'){await page.getByRole('radio',{name:'Alpha',exact:true}).focus();await page.keyboard.press('ArrowRight');rejected=!(await page.getByRole('radio',{name:'Charlie',exact:true}).isChecked());}
    else if(mutation.kind==='scroll'){await page.getByTestId('before').focus();await pressTab();rejected=(await active())!=='negative-scroll';}
    else{await page.getByRole('button',{name:'Expand Root',exact:true}).focus();await page.keyboard.press('Enter');rejected=(await page.getByRole('button',{name:'Expand Root',exact:true}).getAttribute('aria-expanded'))!=='true';}
    assert(rejected,'Real keyboard regression rejected: '+mutation.name);negativeRows.push({name:mutation.name,rejected:true});await page.evaluate(()=>renderFixture(null));
  }
},{browserName,development:true,contextOptions:{reducedMotion:'reduce'}});
for(const[path,hash]of Object.entries(inputs))assert.equal(sha(readFileSync(path)),hash,'Source changed during keyboard proof: '+path);
mkdirSync('test-results/semantic-completion',{recursive:true});
writeFileSync('test-results/semantic-completion/keyboard-'+browserName+'.json',JSON.stringify({status:'PASS',browserName,node:process.version,reactDevelopmentCompiledSha256:sha(runtime.outputFiles[0].contents),compiledSha256:sha(compiled.outputFiles[0].contents),inputs,nativeTabModel,rows,negativeRows,scope:'Actual native keyboard contracts for inspected components. No custom treegrid/toolbar roving, screen reader or all-prop acceptance is inferred.'},null,2)+'\n');
console.log('PASS '+browserName+': '+rows.length+' source-inspected native keyboard contracts with actual browser input and3source mutation controls');
