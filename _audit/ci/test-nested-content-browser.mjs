import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 const failures=[];
 for(const content of [0,null,false,'']){
  const cases=[
   ['Timeline',{items:[{title:'Event',meta:content,body:content}]},['.cs-timeline__meta','.cs-timeline__body']],
   ['MenuItem',{children:'Action',icon:content},['.cs-menu__item > span']],
   ['Toolbar',{items:[{label:content}]},['.cs-toolbar button > span']],
   ['CommandPalette',{open:true,groups:[{label:content,items:[{label:'Action',icon:content,shortcut:content}]}]},['.cs-cmdk__label','.cs-cmdk__item > [aria-hidden]','.cs-cmdk__item > .cs-kbd']],
   ['Tour',{open:true,steps:[{target:'#missing-target',title:'Step',body:content}]},['.cs-tour__pop p']],
  ];
  for(const [name,props,selectors] of cases){
   await page.evaluate(({name,props})=>renderFixture(React.createElement(CS[name],props)),{name,props});
   for(const selector of selectors){
    const texts=await page.locator(selector).allTextContents();
    if(JSON.stringify(texts)!==JSON.stringify(content===0?['0']:[])) failures.push({name,selector,content,texts});
   }
   if(name==='Toolbar' && content===0 && await page.getByRole('button',{name:'0',exact:true}).count()!==1) failures.push('Toolbar zero label must name action');
  }
 }
 assert.deepEqual(failures,[],'Nested ReactNode slots preserve zero and empty-content omission');
 console.log('PASS nested content: Timeline meta/body, MenuItem icon, Toolbar action name, CommandPalette group/icon/shortcut and Tour body');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
