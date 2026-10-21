import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const bundled=await build({stdin:{contents:`import * as FAB from './stories/FloatingActionButton.stories.jsx';import * as Popconfirm from './stories/Popconfirm.stories.jsx';import * as BackTop from './stories/BackTop.stories.jsx';window.__storyCases={FAB,Popconfirm,BackTop};`,resolveDir:resolve('.')},bundle:true,write:false,format:'iife',jsx:'automatic',plugins:[{name:'shared-react',setup(build){build.onResolve({filter:/^react(?:\/jsx-runtime)?$/},args=>({path:args.path,namespace:'shared-react'}));build.onLoad({filter:/.*/,namespace:'shared-react'},args=>({contents:args.path==='react'?'export default window.React;':`export const Fragment=window.React.Fragment;export function jsx(type,props,key){return window.React.createElement(type,{...props,key});}export const jsxs=jsx;`,loader:'js'}));}}]});
const axes=JSON.parse(readFileSync('tokens/modes/index.json')).modes.filter(m=>m.axes.theme!=='system'&&m.axes.density==='comfortable');
const receipt={browserName,sourceHashes:Object.fromEntries(['base/controls.css','stories/FloatingActionButton.stories.jsx','stories/Popconfirm.stories.jsx','stories/BackTop.stories.jsx'].map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')])),storyCases:[],toggleAxes:[]};
await withBrowserFixture(async page=>{
 await page.addScriptTag({content:bundled.outputFiles[0].text});
 await page.addScriptTag({url:'/_audit/vendor/axe.min.js'});
 for(const [kind,variant,names]of [['FAB','Default',['New wish']],['FAB','Matrix',['Add','Wish']],['Popconfirm','Default',['Delete']],['Popconfirm','Matrix',['Delete','Archive']],['BackTop','Default',[]],['BackTop','Matrix',[]]]){
  await page.evaluate(({kind,variant})=>{const module=__storyCases[kind],story=module[variant],args={...module.default.args,...story.args};renderFixture(story.render?story.render(args):React.createElement(module.default.component,args));},{kind,variant});
  for(const name of names)await page.getByRole('button',{name,exact:true}).waitFor();
  if(kind==='Popconfirm'){await page.getByRole('button',{name:names[0],exact:true}).click();await page.getByRole('alertdialog').waitFor();await page.keyboard.press('Escape');}
  if(kind==='BackTop'){const region=page.getByRole('region');assert.equal(await region.getAttribute('tabindex'),'0');await region.focus();await page.keyboard.press('PageDown');await page.waitForFunction(()=>document.querySelector('[role=region]').scrollTop>0);}
  const result=await page.evaluate(async()=>axe.run(document.getElementById('fixture'),{runOnly:['button-name','scrollable-region-focusable']}));assert.deepEqual(result.violations,[],kind+variant);receipt.storyCases.push({kind,variant,passed:true});
 }
 for(const mode of axes){
  await page.evaluate(axes=>{const root=document.documentElement;root.dataset.theme=axes.theme;root.dataset.csContrast=axes.contrast;root.dataset.csDensity=axes.density;if(axes.element===null)delete root.dataset.csElement;else root.dataset.csElement=axes.element;if(axes.variant)root.dataset.csVariant=axes.variant;else delete root.dataset.csVariant;renderFixture(React.createElement('button',{className:'cs-toggle','aria-pressed':'true'},'Notifications'));},mode.axes);
  await page.evaluate(async()=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
  const result=await page.evaluate(async()=>axe.run(document.getElementById('fixture'),{runOnly:['color-contrast']}));assert.deepEqual(result.violations,[],mode.id);assert.ok(result.passes.some(rule=>rule.id==='color-contrast'&&rule.nodes.length),'Actual pressed text must receive contrast check '+mode.id+JSON.stringify(result.incomplete));
  receipt.toggleAxes.push({mode:mode.id,passed:true});
 }
 // Reintroduce the original pressed label token in the known failing branch.
 await page.evaluate(()=>{Object.assign(document.documentElement.dataset,{theme:'light',csElement:'tho',csContrast:'standard'});delete document.documentElement.dataset.csVariant;renderFixture(React.createElement('button',{className:'cs-toggle','aria-pressed':'true'},'Notifications'));});
 await page.addStyleTag({content:'.cs-toggle[aria-pressed="true"]{color:var(--cs-accent-strong)}'});
 await page.evaluate(async()=>{await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
 const regressed=await page.evaluate(async()=>axe.run(document.getElementById('fixture'),{runOnly:['color-contrast']}));assert.ok(regressed.violations.some(v=>v.id==='color-contrast'),'The original failing label token must still fail the contrast gate');receipt.originalContrastMutationRejected=true;
 receipt.version=page.context().browser().version();
},{browserName});
mkdirSync('test-results',{recursive:true});writeFileSync(`test-results/storybook-remediation-${browserName}.json`,JSON.stringify(receipt,null,2)+'\n');console.log(`PASS ${browserName}:6 actual CSF story renders/keyboard interactions and${axes.length} pressed Toggle axes at unchanged axe contrast threshold`);
