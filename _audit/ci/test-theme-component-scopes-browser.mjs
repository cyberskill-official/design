import assert from 'node:assert/strict';
import postcss from 'postcss';
import {gunzipSync} from 'node:zlib';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {themeComponentCases} from './fixtures/theme-component-cases.mjs';
const variants=Object.keys(JSON.parse(readFileSync('tokens/tokens.json','utf8')).elements);
const capturePath=process.argv.find(arg=>arg.startsWith('--capture='))?.slice(10);
const browserName=process.env.CS_TEST_BROWSER||'chromium';
// Preserve exact platform references: Chromium native range colors and color
// serialization differ between macOS and Linux despite identical authored CSS.
// Non-Chromium engines retain the full nearest-theme assertions below.
const platformReference = process.platform === 'linux'
  ? '_audit/ci/fixtures/theme-component-colocated.linux.json.gz'
  : '_audit/ci/fixtures/theme-component-colocated.json.gz';
const comparePath=process.argv.find(arg=>arg.startsWith('--compare='))?.slice(10) || (!capturePath && browserName==='chromium' ? platformReference : null);
const themeSelectors=[];
for(const file of readdirSync('base').filter(file=>file.endsWith('.css')))postcss.parse(readFileSync('base/'+file,'utf8')).walkRules(rule=>{
 if(rule.nodes.some(node=>node.type==='decl'&&node.value.includes('--_cs-light')))themeSelectors.push(...rule.selectors);
 assert.ok(!/\[data-theme="(?:dark|system)"\] \.cs-/.test(rule.selector),'Component theme selectors must not leak through nested resets: '+rule.selector);
});
const baseline={};let cases=0,failures=0;const examples=[];
await withBrowserFixture(async page=>{
 const uncovered=await page.evaluate(({selectors,fixtures})=>{
  const host=document.getElementById('fixture');
  return selectors.filter(selector=>!fixtures.some(([,html,target])=>{host.innerHTML=html;return host.querySelector(target).matches(selector.replaceAll(':hover',''))}));
 },{selectors:themeSelectors,fixtures:themeComponentCases});
 assert.deepEqual(uncovered,[],'Every theme-dependent base selector needs a fixture');
 for(const colorScheme of ['light','dark'])for(const contrast of ['no-preference','more']) {
  await page.emulateMedia({colorScheme,contrast});await page.goto(page.url());await page.mouse.move(1200,700);
  await page.addStyleTag({content:'*,*::before,*::after {transition:none!important;animation:none!important}'});
  const result=await page.evaluate(({variants,fixtures})=>{
   const host=document.getElementById('fixture');const baseline={},examples=[];let cases=0,failures=0;
   const properties=['color','background-color','border-top-color','border-right-color','border-bottom-color','border-left-color','accent-color','box-shadow'];
   const attrs=entry=>{const [e,v='']=entry.split('.');return `data-cs-element="${e}" data-cs-variant="${v}"`};
   const values=node=>{const css=getComputedStyle(node);return Object.fromEntries(properties.map(p=>[p,css.getPropertyValue(p)]))};
   for(const entry of variants)for(const theme of ['light','dark','system'])for(const [id,html,target] of fixtures) {
    host.innerHTML=`<div ${attrs(entry)} data-theme="${theme}" id="reference">${html}</div>`;
    const expected=values(host.querySelector('#reference').querySelector(target));baseline[`${entry}/${theme}/${id}`]=expected;
    for(const outer of ['light','dark','system']) {
     host.innerHTML=`<div ${attrs(entry)} data-theme="${outer}"><div data-theme="${theme}" id="actual">${html}</div></div>`;
     const actual=values(host.querySelector('#actual').querySelector(target));cases++;
     const differences=properties.filter(p=>actual[p]!==expected[p]).map(p=>({property:p,actual:actual[p],expected:expected[p]}));
     if(differences.length){failures++;if(examples.length<8)examples.push({entry,theme,outer,id,differences})}
    }
   }
   return {cases,failures,examples,baseline};
  },{variants,fixtures:themeComponentCases});
  baseline[`${colorScheme}/${contrast}`]=result.baseline;cases+=result.cases;failures+=result.failures;examples.push(...result.examples.map(e=>({colorScheme,contrast,...e})));
  // The theme-sensitive :hover branch must be exercised with the real pointer.
  for(const entry of variants)for(const theme of ['light','dark','system'])for(const outer of ['light','dark','system']) {
   await page.evaluate(({entry,theme,outer})=>{
    const [e,v='']=entry.split('.');
    const row='<div class="cs-mentions"><span class="cs-mentions__pop"><button>User</button></span></div>';
    document.getElementById('fixture').innerHTML=`<div data-cs-element="${e}" data-cs-variant="${v}"><div id="reference" data-theme="${theme}" style="position:absolute;left:30px;top:40px;width:250px">${row}</div><div data-theme="${outer}" style="position:absolute;left:500px;top:40px;width:250px"><div id="actual" data-theme="${theme}">${row}</div></div></div>`;
   },{entry,theme,outer});
   const inspect=async id=>{
    const rect=await page.locator('#'+id+' button').boundingBox();assert.ok(rect);
    await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
    return await page.locator('#'+id+' button').evaluate(el=>{const css=getComputedStyle(el);return {hover:el.matches(':hover'),color:css.color,background:css.backgroundColor}});
   };
   const expected=await inspect('reference'),actual=await inspect('actual');cases++;
   assert.ok(expected.hover&&actual.hover,'Native hover must be active on both probes');
   if(actual.color!==expected.color||actual.background!==expected.background){failures++;if(examples.length<8)examples.push({entry,theme,outer,id:'mentions-hover',actual,expected})}
  }

 }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
if(capturePath)writeFileSync(capturePath,JSON.stringify(baseline,null,2)+'\n');
if(comparePath)assert.deepEqual(baseline,JSON.parse(comparePath.endsWith('.gz') ? gunzipSync(readFileSync(comparePath)).toString('utf8') : readFileSync(comparePath,'utf8')),'Colocated component styles must preserve their pre-repair values');
if(failures)console.error(JSON.stringify({cases,failures,examples:examples.slice(0,8)},null,2));
assert.equal(failures,0,'Nested component styling must match the nearest theme, not any dark ancestor');
console.log(`PASS component theme scopes: ${cases} nested cases across ${themeComponentCases.length} selector/state fixtures plus native hover, all 15 packs and both OS theme/contrast preferences; static media.`);
