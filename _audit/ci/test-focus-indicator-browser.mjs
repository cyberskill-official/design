import assert from 'node:assert/strict';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import postcss from 'postcss';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {focusIndicatorCases} from './fixtures/focus-indicator-cases.mjs';
import {inspectFocusIndicator} from './lib/focus-indicator.mjs';

const browserName=process.env.CS_TEST_BROWSER||'chromium';
const capture=process.argv.find(arg=>arg.startsWith('--capture='))?.slice(10);
assert(process.argv.slice(2).every(arg=>arg.startsWith('--capture=')),'Only --capture=PATH is supported');
assert.equal(new Set(focusIndicatorCases.map(item=>item.id)).size,focusIndicatorCases.length);
const selectors=new Set(),sourceFiles={};
for(const name of readdirSync('base').filter(name=>name.endsWith('.css'))) {
  const path='base/'+name,bytes=readFileSync(path);sourceFiles[path]=createHash('sha256').update(bytes).digest('hex');
  postcss.parse(bytes).walkRules(rule=>{
    if(rule.nodes.some(node=>node.type==='decl'&&['outline','box-shadow'].includes(node.prop)))
      for(const selector of rule.selectors||[])if(/:focus/.test(selector))selectors.add(selector);
  });
}
const variants=['neutral',...Object.keys(JSON.parse(readFileSync('tokens/tokens.json','utf8')).elements)];
let cases=0,failures=0,minimumContrast=Infinity;const examples=[],failureByFixture={};
for(const pointer of ['fine','coarse']) await withBrowserFixture(async page=>{
  assert.equal(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),pointer==='coarse');
  await page.mouse.move(1200,700);
  await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
  await page.addScriptTag({content:'window.csInspectFocusIndicator='+inspectFocusIndicator.toString()});
  await page.evaluate(()=>{document.getElementById('fixture').innerHTML='<input aria-label="Keyboard seed">'});
  await page.keyboard.press('Tab');
  for(const colorScheme of ['light','dark'])for(const contrast of ['no-preference','more']) {
    await page.emulateMedia({colorScheme,contrast});
    const result=await page.evaluate(({fixtures,variants,selectors})=>{
      const host=document.getElementById('fixture');const covered=new Set(),examples=[],failureByFixture={};let cases=0,failures=0,minimumContrast=Infinity;
      for(const variant of variants)for(const theme of ['light','dark','system'])for(const density of ['comfortable','compact'])for(const fixture of fixtures) {
        const [element,flavor='']=variant.split('.');
        const attrs=variant==='neutral'?'':`data-cs-element="${element}" data-cs-variant="${flavor}"`;
        host.innerHTML=`<main ${attrs} data-theme="${theme}" data-cs-density="${density}" style="background:var(--cs-color-surface-page);padding:30px;min-height:200px">${fixture.html}</main>`;
        const focus=host.querySelector(fixture.focus),indicator=host.querySelector(fixture.indicator);
        if(!focus||!indicator)throw Error('Missing focus fixture '+fixture.id);
        // Match authored selectors in both states; stripping focus pseudos corrupts :not(:focus-visible).
        for(const selector of selectors)if(focus.matches(selector)||indicator.matches(selector))covered.add(selector);
        focus.focus({preventScroll:true});
        for(const selector of selectors)if(focus.matches(selector)||indicator.matches(selector))covered.add(selector);
        const measured=csInspectFocusIndicator(focus,indicator);cases++;minimumContrast=Math.min(minimumContrast,measured.contrastRatio);
        if(!measured.pass){failures++;failureByFixture[fixture.id]=(failureByFixture[fixture.id]||0)+1;if(!examples.some(example=>example.id===fixture.id))examples.push({variant,theme,density,id:fixture.id,...measured});}
      }
      return {cases,failures,minimumContrast,examples,failureByFixture,uncovered:selectors.filter(selector=>!covered.has(selector))};
    },{fixtures:focusIndicatorCases,variants,selectors:[...selectors]});
    assert.deepEqual(result.uncovered,[],'Every authored focus indicator selector needs a rendered fixture');
    cases+=result.cases;failures+=result.failures;minimumContrast=Math.min(minimumContrast,result.minimumContrast);
    for(const [id,count] of Object.entries(result.failureByFixture))failureByFixture[id]=(failureByFixture[id]||0)+count;
    for(const example of result.examples)if(!examples.some(existing=>existing.id===example.id))examples.push({pointer,colorScheme,contrast,...example});
  }
  const negativeFocusMatch=await page.evaluate(()=>{
    const host=document.getElementById('fixture');host.innerHTML='<button class="cs-toggle" aria-pressed="true">Pressed toggle</button>';
    const el=host.firstElementChild,selector='.cs-toggle[aria-pressed="true"]:not(:focus-visible)';
    const before=el.matches(selector);el.focus();return [before,el.matches(selector)];
  });
  assert.deepEqual(negativeFocusMatch,[true,false],'Negated focus override must match unfocused state and stop matching focused state');
  // Actual computed-style failure paths, not a regex-only existence check.
  const negatives=await page.evaluate(()=>{
    const host=document.getElementById('fixture');host.innerHTML='<main data-theme="light"><button class="cs-button">Negative</button></main>';
    const el=host.querySelector('button');el.focus();const results=[];
    for(const style of ['outline-color:var(--cs-color-accent-ochre)!important','outline-width:0!important','box-shadow:none!important;filter:none!important','box-shadow:0 0 0 0 var(--cs-color-accent-ochre)!important;filter:drop-shadow(0 0 0 var(--cs-color-accent-ochre))!important','opacity:0!important']) {
      el.style.cssText=style;results.push(csInspectFocusIndicator(el,el).pass);
    }
    el.style.cssText='';el.blur();results.push(csInspectFocusIndicator(el,el).pass);return results;
  });
  assert.deepEqual(negatives,[false,false,false,false,false,false],'Bad color, missing contour/halo, zero halo geometry, invisible box and absent focus must fail');
  const colorChecks=await page.evaluate(()=>{
    const host=document.getElementById('fixture');host.innerHTML='<main><button class="cs-button">Color conversion</button></main>';
    const main=host.firstElementChild,el=main.firstElementChild;el.focus();
    return [['oklab(0 0 0)','oklab(1 0 0)'],['color(srgb 1 1 1)','color(srgb 0 0 0)'],['rgb(0 0 0)','rgb(0 0 0)'],['rgba(0,0,0,0.5)','white']].map(([ink,surface])=>{
      main.style.setProperty('--cs-color-text-primary',ink);main.style.background=surface;
      const result=csInspectFocusIndicator(el,el);return {ratio:result.contourToSurfaceContrast,pass:result.pass};
    });
  });
  assert.equal(colorChecks[0].ratio,21,'OKLab black/white must convert to sRGB black/white');
  assert.equal(colorChecks[1].ratio,21,'Explicit sRGB black/white must retain their color space');
  assert.equal(colorChecks[2].ratio,1);assert.equal(colorChecks[2].pass,false,'Equal ink/surface colors must fail');
  assert(colorChecks[3].ratio>3.9&&colorChecks[3].ratio<4.1,'Semi-transparent ink must composite over its surface');
},{browserName,contextOptions:{hasTouch:pointer==='coarse',viewport:{width:1280,height:900},...(pointer==='coarse'&&browserName!=='firefox'?{isMobile:true}:{})}});
const result={browserName,cases,failures,minimumContrast,fixtures:focusIndicatorCases.length,authoredFocusSelectors:selectors.size,sourceFiles,examples,failureByFixture,scope:'Rendered authored CSS focus selectors and declared selected/proxy/native states across theme/element/density, fine/coarse pointers and OS color/contrast preferences. Keyboard mode is seeded; programmatic focus is asserted. Contour-to-underlying-CSS-surface color contrast only; not a raster edge/halo contrast, full component/consumer state, native Tab reachability, clipping/occlusion or human acceptance assessment.'};
if(capture)writeFileSync(capture,JSON.stringify(result,null,2)+'\n');
if(failures)console.error(JSON.stringify(result,null,2));
assert.equal(failures,0,'Every tested focus indicator must retain its text-primary contour, invariant Ochre halo and 3:1 adjacent contrast');
console.log(`PASS ${browserName}: ${cases} rendered focus cases; ${focusIndicatorCases.length} fixtures cover ${selectors.size} authored focus selectors; minimum contour-to-CSS-surface contrast ${minimumContrast.toFixed(3)}:1; six computed-style failure paths rejected per pointer mode.`);
