import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const cases=[
 ['CardHeader',{title:0,subtitle:0},['.cs-card__title','.cs-card__subtitle']],
 ['Comment',{author:'Author',avatar:0,meta:0,replies:0},['.cs-comment__avatar','.cs-comment__meta','.cs-comment__replies']],
 ['Sidebar',{label:0},['.cs-sidebar__label']],
 ['NavItem',{icon:0,children:'Action'},['.cs-nav-item__icon']],
 ['CitationList',{label:0,items:[{title:'Source',source:0}]},['.cs-citations__label','.cs-citation__src']],
 ['HumanReviewGate',{summary:'Summary',reviewer:0},['.cs-review-gate__reviewer']],
 ['Button',{icon:0,children:'Action'},['.cs-button__icon']],
 ['Toggle',{icon:0,children:'Action'},['.cs-toggle > span']],
 ['Dialog',{open:true,title:'Dialog',actions:0},['.cs-dialog__actions']],
 ['Drawer',{open:true,title:'Drawer',actions:0},['.cs-drawer__footer']],
 ['DataTable',{caption:0,columns:[],rows:[]},['caption']],
 ['DataTable',{caption:0,columns:[],rows:[],state:'loading'},['caption']],
 ['DataGrid',{caption:0,columns:[],rows:[]},['caption']],
 ['TreeTable',{caption:0,columns:[],nodes:[]},['caption']],
];
await withBrowserFixture(async page=>{
 const failures=[];
 for(const [name,props,selectors] of cases){
  for(const content of [0,null,false,'']){
   const replace=value=>value===0?content:Array.isArray(value)?value.map(replace):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,v])=>[key,replace(v)])):value;
   await page.evaluate(({name,props})=>renderFixture(React.createElement(CS[name],props)),{name,props:replace(props)});
   for(const selector of selectors){
    const loc=page.locator(selector);
    const count=await loc.count();
    if(count!==(content===0?1:0)) failures.push(`${name} ${selector} content=${JSON.stringify(content)} count=${count}`);
    else if(content===0) assert.match(await loc.textContent(),/0/,`${name} ${selector} preserves zero`);
   }
  }
 }
 assert.deepEqual(failures,[],'Declared ReactNode slots preserve zero while omitting empty values');
 console.log('PASS display content: 13 exports, 14 render paths; numeric zero and null/false/empty-string behavior');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
