/** Exercise the actual naming gate with incomplete and broken fixtures. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

const browserName = process.env.CS_BROWSER || 'chromium';
const source = readFileSync(new URL('../a11y-harness.html', import.meta.url), 'utf8');
const cases = [
  ['valid fixture', '', true],
  ['unnamed select', "document.getElementById('sel').removeAttribute('aria-label');", false],
  ['empty wrapped label', "document.querySelector('#switch span:last-child').textContent='';", false],
  ['broken reference', "const el=document.getElementById('tf');el.removeAttribute('aria-label');el.removeAttribute('placeholder');el.setAttribute('aria-labelledby','missing-name');", false],
  ['empty referenced label', "const el=document.getElementById('tf');el.removeAttribute('aria-label');el.removeAttribute('placeholder');const label=document.createElement('span');label.id='empty-name';document.getElementById('stage').append(label);el.setAttribute('aria-labelledby','empty-name');", false],
  ['unnamed button', "const el=document.getElementById('clear');el.removeAttribute('aria-label');el.textContent='';", false],
  ['missing fixture', "document.getElementById('stage').remove();", false],
  ['missing control', "document.getElementById('slider').remove();", false],
  ['unavailable engine', 'window.axe=undefined;', false],
  ['engine throws', "axe.run=async()=>{throw new Error('fixture engine error');};", false],
  ['incomplete name review', "axe.run=async()=>({violations:[],incomplete:[{id:'label',nodes:[{target:['#tf']}]}],inapplicable:[]});", false],
  ['malformed engine result', 'axe.run=async()=>({violations:[]});', false],
];
await withBrowserFixture(async page => {
  for (const [name, mutation, pass] of cases) {
    await page.route('**/_audit/a11y-harness.html', route => route.fulfill({
      contentType:'text/html', body:source.replace('</body>', '<script>{'+mutation+'}</script></body>'),
    }));
    await page.goto(new URL('/_audit/a11y-harness.html', page.url()).href);
    await page.waitForFunction(() => window.__a11ycss);
    const result=await page.evaluate(() => window.__a11ycss);
    assert.equal(result.pass, pass, name+': '+JSON.stringify(result));
    assert.equal(result.total, 6, name+' must finish all bounded checks');
    if (!pass) assert(result.failed.includes('mounted fixture controls have accessible names'), name);
    await page.unroute('**/_audit/a11y-harness.html');
  }
}, {browserName});
const css=readFileSync(new URL('../../base/a11y.css',import.meta.url),'utf8');
const tokens=readFileSync(new URL('../../tokens/component-tokens.css',import.meta.url),'utf8');
const token='--cs-component-button-sm-minHeight-coarse';
const lowered=css.replace(/(\.cs-segmented button\s*\{[^}]*min-height:\s*)44px/,'$1'+'40px');
const floors=[
  ['segmented 40px', '../base/a11y.css',lowered,false],
  ['slider 32px','../base/a11y.css',css.replace(/(\.cs-slider\s*\{[^}]*block-size:\s*)44px/,'$1'+'32px'),false],
  ['search clear 32px','../base/a11y.css',css.replace(/(\.cs-search__clear\s*\{[^}]*min-block-size:\s*)44px/,'$1'+'32px'),false],
  ['defined token overrides 44px fallback','../tokens/component-tokens.css',tokens.replace(token+': 44px',token+': 32px'),false],
  ['dark token override is reviewed','../tokens/component-tokens.css',tokens+'\n[data-theme="dark"]{'+token+':32px;}',false],
  ['unknown token expression','../tokens/component-tokens.css',tokens.replace(token+': 44px',token+': calc(44px - 12px)'),false],
  ['cyclic token','../tokens/component-tokens.css',tokens.replace(token+': 44px',token+': var('+token+')'),false],
  ['absent token uses literal fallback','../tokens/component-tokens.css',tokens.replace(token+': 44px;', ''),true],
  ['nested defined token','../tokens/component-tokens.css',tokens.replace(token+': 44px',token+': var(--cs-floor-test, 44px)')+'\n:root{--cs-floor-test:44px;}',true],
  ['nested token below fallback','../tokens/component-tokens.css',tokens.replace(token+': 44px',token+': var(--cs-floor-test, 44px)')+'\n:root{--cs-floor-test:32px;}',false],
];
await withBrowserFixture(async page=>{
 for(const[name,path,body,pass]of floors){
  assert.notEqual(body,path.includes('component-tokens')?tokens:css,'mutation must apply: '+name);
  const url=new URL(path,new URL('/_audit/a11y-harness.html',page.url())).href;
  await page.route(url,route=>route.fulfill({contentType:'text/css',body}));
  await page.goto(new URL('/_audit/a11y-harness.html',page.url()).href);
  await page.waitForFunction(()=>window.__a11ycss);
  const result=await page.evaluate(()=>window.__a11ycss);
  assert.equal(result.pass,pass,name+': '+JSON.stringify(result));assert.equal(result.total,6);
  if(!pass)assert(result.failed.includes('reviewed coarse-pointer height declarations resolve to at least 44px (static source)'),name);
  await page.unroute(url);
 }
},{browserName});
console.log(`PASS a11y harness (${browserName}): ${cases.length} actual naming/error cases and ${floors.length} actual source height/token cases. Rendered hit areas and screen-reader acceptance are separate.`);
