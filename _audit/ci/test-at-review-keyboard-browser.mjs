import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const failures=[];
await withBrowserFixture(async page=>{
  const check=async(name,fn)=>{try{await fn();console.log('PASS '+name)}catch(e){failures.push(name+': '+e.message)}finally{await page.evaluate(()=>renderFixture(null));}};
  await check('Dialog link reverse Tab',async()=>{
    await page.evaluate(()=>{const h=React.createElement;function App(){const[o,S]=React.useState(false);return h(React.Fragment,null,h('button',{id:'open',onClick:()=>S(true)},'Open'),h(CS.Dialog,{open:o,title:'FAQ',onClose:()=>S(false)},h('a',{id:'terms',href:'#terms',tabIndex:0},'Terms')))}renderFixture(h(App));});
    await page.locator('#open').focus();await page.keyboard.press('Enter');await page.locator('#terms').focus();await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Close');
  });
  await check('Dialog explicit description contract',async()=>{
    await page.evaluate(()=>renderFixture(React.createElement(CS.Dialog,{open:true,title:'FAQ','aria-describedby':'short'},React.createElement('p',{id:'short'},'Short summary'),React.createElement('dl',null,React.createElement('dt',null,'Question'),React.createElement('dd',null,'Answer')))));
    assert.equal(await page.getByRole('dialog').getAttribute('aria-describedby'),'short');
    await page.evaluate(()=>renderFixture(React.createElement(CS.Dialog,{open:true,title:'FAQ','aria-describedby':''},React.createElement('p',null,'Structured content'))));
    assert.equal(await page.getByRole('dialog').getAttribute('aria-describedby'),null);
  });
  await check('Cascader child collapse focus',async()=>{
    await page.evaluate(()=>renderFixture(React.createElement(CS.Cascader,{lang:'en',label:'Region',nodes:[{key:'p',label:'Parent',children:[{key:'c',label:'Child'}]}]})));
    await page.getByRole('button',{name:'Region'}).click();await page.getByRole('option',{name:'Parent'}).focus();await page.keyboard.press('ArrowRight');await page.getByRole('option',{name:'Child',exact:true}).focus();await page.keyboard.press('ArrowLeft');
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'Parent ›');
  });
  await check('Menubar named submenu and arrows',async()=>{
    await page.evaluate(()=>renderFixture(React.createElement(CS.Menubar,{menus:[{label:'File',items:[{label:'New'},'-',{label:'Open'}]}]})));
    await page.getByRole('menuitem',{name:'File',exact:true}).focus();await page.keyboard.press('ArrowDown');
    assert.equal(await page.evaluate(()=>document.activeElement.textContent),'New');await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Open');assert.equal(await page.getByRole('menu',{name:'File',exact:true}).count(),1);
  });
}, {browserName:process.env.CS_BROWSER || 'chromium'});
assert.deepEqual(failures,[]);
