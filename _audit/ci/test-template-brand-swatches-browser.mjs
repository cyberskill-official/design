import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {collectTokenDeclarations} from '../../scripts/lib/token-declarations.mjs';
const graph=collectTokenDeclarations(process.cwd());
for(const [name,value]of [['--cs-color-brand-umber','#45210E'],['--cs-color-brand-ochre','#F4BA17']]){
 const declarations=graph.declarations.filter(row=>row.name===name);assert(declarations.length>0);assert(declarations.filter(row=>row.value.startsWith('#')).every(row=>row.value.toUpperCase()===value),name+' authored literal anchor is unchanged; scoped resolution is checked in browsers');
}
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 await page.goto(new URL('/templates/doc-style-guide/DocStyleGuide.dc.html',page.url()).href);
 await page.waitForFunction(()=>window.__dcRootName?.()&&document.querySelector('[data-sc-name]')&&!document.querySelector('.sc-placeholder'));
 const elements=await page.evaluate(()=>JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props')).element.options);
 assert.equal(elements.length,15);
 for(const theme of ['light','dark'])for(const element of elements){
  await page.evaluate(({theme,element})=>{document.documentElement.dataset.theme=theme;window.__dcSetProps(window.__dcRootName(),{element});},{theme,element});
  await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  const colors=await page.evaluate(()=>['#45210E','#F4BA17'].map(hex=>{
   const cell=[...document.querySelectorAll('td')].find(cell=>cell.textContent.trim()===hex),swatch=cell?.querySelector('span');
   if(!swatch)throw Error('Missing named brand specimen '+hex);
   const reference=document.createElement('span');reference.style.backgroundColor=hex;swatch.parentElement.append(reference);
   const result={label:hex,actual:getComputedStyle(swatch).backgroundColor,reference:getComputedStyle(reference).backgroundColor,usesToken:swatch.getAttribute('style').includes('var(--cs-color-brand-')};reference.remove();return result;
  }));
  assert(colors.every(row=>row.usesToken&&row.actual===row.reference),JSON.stringify({browserName,theme,element,colors}));
  assert.equal(await page.locator('.sc-logic-error').count(),0);
 }
 console.log(`PASS template brand swatches ${browserName}: tokenized Umber/Ochre match original literal reference in all15element choices and2themes`);
},{browserName});
