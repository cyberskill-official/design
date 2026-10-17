import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 const results=[];
 for(const name of ['NavItem','ListItem','Card','CardAsButton','Item']){
  await page.evaluate(name=>{
   window.submits=0;window.actions=0;
   const component=name==='CardAsButton'?CS.Card:CS[name];
   const props={onClick:()=>actions++,...(name==='Card'?{interactive:true}:{}),...(name==='CardAsButton'?{as:'button'}:{})};
   renderFixture(React.createElement('form',{onSubmit:e=>{e.preventDefault();submits++}},React.createElement(component,props,'Action')));
  },name);
  await page.locator('button').click();
  results.push([name,...await page.evaluate(()=>[submits,actions])]);
 }
 assert.deepEqual(results,['NavItem','ListItem','Card','CardAsButton','Item'].map(name=>[name,0,1]),'Action widgets must not implicitly submit parent forms');
 await page.evaluate(()=>renderFixture(React.createElement('div',null,React.createElement(CS.NavItem,{href:'#destination'},'Link'),React.createElement(CS.ListItem,null,'Static'),React.createElement(CS.Card,{as:'article'},'Article'))));
 assert.equal(await page.locator('[type]').count(),0,'Non-button variants receive no type attribute');
 console.log('PASS action button defaults: NavItem, ListItem, Card, explicit Card button and Item; non-button variants preserved');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
