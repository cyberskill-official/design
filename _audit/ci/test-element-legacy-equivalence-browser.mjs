import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {chromium,firefox,webkit} from 'playwright';
import postcss from 'postcss';
import {dirname,resolve} from 'node:path';
import {modeInputs} from '../../scripts/lib/token-modes.mjs';
const read=p=>readFileSync(p,'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const original=read('_audit/ci/fixtures/a01-elements-before.css');
const reach=original.indexOf('/* ---- Element reach beyond accent ---- */'),aurora=original.indexOf('/* ---- Aurora washes ---- */'),dark=original.indexOf('/* ---- APCA-derived DARK elemental packs'),resolver=original.indexOf('/* ---- Generated scope resolver ----');assert(reach>0&&aurora>reach&&dark>aurora&&resolver>dark);
const candidate=original.slice(0,reach)+original.slice(aurora,dark)+original.slice(resolver),inputs=modeInputs(process.cwd()),rows=[];
function flatten(path,elements){const ast=postcss.parse(path==='tokens/elements.css'?elements:read(path));ast.walkAtRules('import',rule=>{const m=/^(?:url\(\s*(['"])([^'"]+)\1\s*\)|(['"])([^'"]+)\3)$/.exec(rule.params);assert(m);rule.replaceWith(postcss.parse(flatten(resolve(dirname(path),m[2]||m[4]).slice(process.cwd().length+1),elements)).nodes);});ast.walkAtRules('font-face',r=>r.remove());return ast.toString();}
const beforeCss=flatten('styles.css',original),cssAfter=flatten('styles.css',candidate);
const current=read('tokens/elements.css');assert([original,candidate].includes(current),'Only the reviewed before/after generated projection is valid');
mkdirSync('test-results/element-legacy-equivalence',{recursive:true});writeFileSync('test-results/element-legacy-equivalence/candidate.css',candidate);
for(const type of [chromium,firefox,webkit]){const browser=await type.launch();try{const page=await browser.newPage();await page.setContent('<!doctype html><html lang="en"><body><main id="cases"></main></body></html>');let count=0;
 for(const colorScheme of ['light','dark'])for(const contrast of ['no-preference','more']){
  await page.emulateMedia({colorScheme,contrast});await page.evaluate(modes=>{const host=document.getElementById('cases');host.replaceChildren();const attrs=(node,mode,keys)=>{for(const key of keys){const attr={theme:'data-theme',element:'data-cs-element',variant:'data-cs-variant',density:'data-cs-density',contrast:'data-cs-contrast'}[key];if(mode[key]!==null)node.setAttribute(attr,mode[key]);}};

   // Each authored mode is exercised both co-located and with inherited/reset scopes.
   for(const {id,mode}of modes){for(let layout=0;layout<4;layout++){const outer=document.createElement('section'),middle=document.createElement('div'),node=document.createElement('div');outer.appendChild(middle);middle.appendChild(node);host.appendChild(outer);node.dataset.probe=id+'-'+layout;node.style.cssText='color:var(--cs-color-text-accent);background:var(--cs-color-surface-panel);border:1px solid var(--cs-color-border-default);box-shadow:var(--cs-shadow-md);width:100px;height:20px';
    if(layout===0)attrs(node,mode,['theme','element','variant','density','contrast']);if(layout===1){attrs(outer,mode,['theme','density','contrast']);attrs(node,mode,['element','variant']);}if(layout===2){attrs(outer,mode,['element','variant','density']);attrs(node,mode,['theme','contrast']);}if(layout===3){outer.setAttribute('data-theme',mode.theme==='dark'?'light':'dark');outer.setAttribute('data-cs-element','kim');attrs(middle,mode,['theme','element','variant','density']);attrs(node,mode,['contrast']);}
   }}
  },inputs.modes);
  async function capture(css){const style=await page.addStyleTag({content:css});const values=await page.evaluate(names=>[...document.querySelectorAll('[data-probe]')].map(node=>{const c=getComputedStyle(node);return [node.dataset.probe,...names.map(n=>c.getPropertyValue(n).trim()),c.color,c.backgroundColor,c.borderTopColor,c.boxShadow];}),inputs.names);await style.evaluate(el=>el.remove());return values;}
  const before=await capture(beforeCss),after=await capture(cssAfter);assert.deepEqual(after,before,type.name()+'/'+colorScheme+'/'+contrast+' legacy rule removal must preserve exact public token and paint values');count+=before.length;
 }
 rows.push({engine:type.name(),version:browser.version(),scopeCases:count,publicTokens:inputs.names.length,pass:true});console.log('PASS legacy element equivalence '+type.name()+' '+count+' nested scope cases');
}finally{await browser.close();}}
writeFileSync('test-results/element-legacy-equivalence/final.json',JSON.stringify({pass:true,originalSha256:hash(original),candidateSha256:hash(candidate),removedBytes:Buffer.byteLength(original)-Buffer.byteLength(candidate),rows},null,2)+'\n');
