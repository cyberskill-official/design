import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const tokens=JSON.parse(readFileSync('tokens/tokens.json','utf8'));
const keys=[...new Set([...Object.values(tokens.root).flatMap(Object.keys),'--cs-style-pack'])];
const variants=['',...Object.keys(tokens.elements)];
const permutations=xs=>xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest])):[[]];
const orders=permutations(['theme','element','contrast','density']);
const errors=[];let cases=0,failures=0;
await withBrowserFixture(async page=>{
  for(const colorScheme of ['light','dark'])for(const osContrast of ['no-preference','more']) {
    await page.emulateMedia({colorScheme,contrast:osContrast});
    // New navigation is intentional: static media composition is separate from
    // the retained-node OS-change assertions in test-theme-composition-browser.
    await page.goto(page.url());
    const result=await page.evaluate(({keys,variants,orders})=>{
      const host=document.getElementById('fixture'),examples=[];let cases=0,failures=0;
      const element=entry=>{if(!entry)return '';const [e,v='']=entry.split('.');return `data-cs-element="${e}" data-cs-variant="${v}"`};
      const values=node=>{const css=getComputedStyle(node);return [...keys.map(key=>css.getPropertyValue(key).trim()),css.colorScheme]};
      for(const entry of variants)for(const theme of ['light','dark','system'])for(const contrast of ['standard','high'])for(const density of ['comfortable','compact'])for(const lang of ['en','vi']) {
        const attrs={theme:`data-theme="${theme}"`,element:element(entry),contrast:`data-cs-contrast="${contrast}"`,density:`data-cs-density="${density}"`};
        const all=Object.values(attrs).join(' ');
        const outer=`data-theme="${theme==='dark'?'light':'dark'}" ${entry?element(entry==='kim.steel'?'hoa.plasma':'kim.steel'):''} data-cs-contrast="${contrast==='high'?'standard':'high'}" data-cs-density="${density==='compact'?'comfortable':'compact'}" lang="${lang==='en'?'vi':'en'}"`;
        for(const order of orders) {
          const nested=order.map(axis=>`<div ${attrs[axis]}>`).join('')+`<div id="actual" lang="${lang}" data-cs-style="liquid-glass"></div>`+'</div>'.repeat(order.length);
          host.innerHTML=`<div ${all} lang="${lang}" id="reference"></div><div ${outer}>${nested}</div>`;
          const expected=values(host.querySelector('#reference')),actual=values(host.querySelector('#actual'));cases++;
          const differences=[...keys,'color-scheme'].filter((key,i)=>!expected[i]||actual[i]!==expected[i]).map(key=>({key,actual:actual[[...keys,'color-scheme'].indexOf(key)],expected:expected[[...keys,'color-scheme'].indexOf(key)]}));
          if(differences.length){failures++;if(examples.length<6)examples.push({entry,theme,contrast,density,lang,order,differences})}
        }
      }
      return {cases,failures,examples};
    },{keys,variants,orders});
    cases+=result.cases;failures+=result.failures;errors.push(...result.examples.map(row=>({colorScheme,osContrast,...row})));
  }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
if(failures)console.error(JSON.stringify({cases,failures,examples:errors.slice(0,6)},null,2));
assert.equal(failures,0,'All public root token values must compose through every Theme/Element/Contrast/Density order and nested reset');
console.log(`PASS axis scopes: ${cases} cases, all ${orders.length} placement orders, ${keys.length} root tokens plus color-scheme; 15 packs plus the neutral root, three themes, both densities/contrasts/languages and OS preferences. Static media only.`);
