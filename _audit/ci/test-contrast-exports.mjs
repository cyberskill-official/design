// Changes the canonical source, runs real generators, then observes the full
// imported cascade. This catches a resolver with copied literal colors even if
// its unchanged default palette agrees with current exports.
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,readFile,writeFile,rm,symlink} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const root=new URL('../../',import.meta.url);
const inputs=['VERSION','package.json','scripts/generate-element-packs.mjs','scripts/generate-theme-exports.mjs','scripts/lib/contrast-maps.mjs','scripts/lib/theme-resolver.mjs','scripts/lib/dtcg-values.mjs','scripts/lib/oklch.mjs','_audit/ci/generate-native-tokens.mjs','_audit/lib/dtcg-profile.mjs',...['element-seeds.json','colors.css','component-tokens.css','elevation.css','theme-attributes.css','elements.css','tokens.json','tokens.js','tokens.dtcg.json','provenance.json','native/CSTokens.swift','native/CSTokens.kt','native/cs_tokens.dart'].map(p=>'tokens/'+p)];
const outputs=['tokens/elements.css','tokens/tokens.json','tokens/tokens.js','tokens/tokens.dtcg.json','tokens/native/CSTokens.swift','tokens/native/CSTokens.kt','tokens/native/cs_tokens.dart','tokens/provenance.json'];
const dir=await mkdtemp(join(tmpdir(),'cs-contrast-exports-'));
const source=await readFile(new URL('tokens/theme-attributes.css',root),'utf8');
const roles=['--cs-color-border-default','--cs-color-text-muted'];
const report={scope:'Real source regeneration, invalid-input preservation and actual CSS composition with media initialized at navigation in Chromium/Firefox/WebKit; generated native text parity only, no platform or human acceptance.',failures:[],contexts:[],sourceMutation:{'#45210E':'#4a3628','#F5EAD9':'#e8d9c6','#9a8060':'#8a7050','#7a6450':'#8a7460'}};
const run=p=>spawnSync(process.execPath,[p],{cwd:dir,encoding:'utf8'});
const generate=()=>{for(const p of ['scripts/generate-element-packs.mjs','scripts/generate-theme-exports.mjs','_audit/ci/generate-native-tokens.mjs']){const r=run(p);assert.equal(r.status,0,r.stderr)}};
try {
 for(const p of inputs){await mkdir(dirname(join(dir,p)),{recursive:true});await copyFile(new URL(p,root),join(dir,p))}
 await symlink(new URL('node_modules',root).pathname,join(dir,'node_modules'),'dir');
 generate();for(const p of outputs)assert.equal(await readFile(join(dir,p),'utf8'),await readFile(new URL(p,root),'utf8'),'Deterministic '+p);
 for(const [name,change] of [
  ['missing role',s=>s.replace('  --cs-color-text-muted: #45210E;','')],
  ['unknown role',s=>s.replace('  --cs-color-text-muted: #45210E;','  --cs-extra: #123456;')],
  ['duplicate declaration',s=>s.replace('#45210E;','#45210E; --cs-color-text-muted: #123456;')],
  ['duplicate scope',s=>s+'\n[data-cs-contrast="high"]{--cs-color-text-muted:#123456;}'],
  ['unknown selector',s=>s.replace('[data-cs-contrast="high"] {','[data-cs-contrast="extra"] {')],
  ['invalid literal',s=>s.replace('#45210E','var(--cs-color-text-primary)')],
  ['important declaration',s=>s.replace('#45210E;','#45210E !important;')],
  ['system mismatch',s=>s.replaceAll('#F5EAD9','#e8d9c6').replace('#e8d9c6','#F5EAD9')],
  ['unknown media condition',s=>s.replace('(prefers-color-scheme: dark)','(prefers-color-scheme: light)')],
 ]){
  await writeFile(join(dir,'tokens/theme-attributes.css'),change(source));
  const before=await Promise.all(outputs.map(p=>readFile(join(dir,p),'utf8')));
  for(const p of ['scripts/generate-element-packs.mjs','scripts/generate-theme-exports.mjs']){
   const r=run(p);assert.notEqual(r.status,0,name+' '+p);assert.match(r.stderr,/contrast/i);
   assert.deepEqual(await Promise.all(outputs.map(p=>readFile(join(dir,p),'utf8'))),before,name+': preserve every artifact');
  }
  report.failures.push({name,rejectedByBothGenerators:true,allArtifactsPreserved:true});
 }
 let changed=source;for(const[a,b]of Object.entries(report.sourceMutation))changed=changed.replaceAll(a,b);
 await writeFile(join(dir,'tokens/theme-attributes.css'),changed);generate();
 const json=JSON.parse(await readFile(join(dir,'tokens/tokens.json'),'utf8'));
 const dtcg=JSON.parse(await readFile(join(dir,'tokens/tokens.dtcg.json'),'utf8'));
 const esm=(await import(new URL('file://'+join(dir,'tokens/tokens.js')))).tokens;
 assert.deepEqual(esm,json);assert.deepEqual(dtcg.$extensions['com.cyberskill'].overrides.contrasts,json.contrasts);
 const native=Object.fromEntries(await Promise.all(['swift','kt','dart'].map(async lang=>[lang,await readFile(join(dir,'tokens/native/'+(lang==='dart'?'cs_tokens.dart':'CSTokens.'+lang)),'utf8')])));
 let copies=0;
 for(const [scope,values]of Object.entries(json.contrasts))for(const [key,value]of Object.entries(values)){
  const name=key.slice(5).split('-').map((p,i)=>i?p[0].toUpperCase()+p.slice(1):p).join('')+scope.split('-').map(p=>p[0].toUpperCase()+p.slice(1)).join('');const hex=value.slice(1).toUpperCase();
  assert(native.swift.includes(`let ${name} = color(0x${hex})`));assert(native.kt.includes(`val ${name} = Color(0xFF${hex})`));assert(native.dart.includes(`const Color ${name} = Color(0xFF${hex});`));copies+=3;
 }
 const css=await readFile(join(dir,'tokens/elements.css'),'utf8');
 assert.notEqual(css,await readFile(new URL('tokens/elements.css',root),'utf8'),'Source contrast mutation must change generated resolver');
 for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
  await page.route('**/tokens/theme-attributes.css',route=>route.fulfill({contentType:'text/css',body:changed}));
  await page.route('**/tokens/elements.css',route=>route.fulfill({contentType:'text/css',body:css}));await page.reload();
  for(const colorScheme of ['light','dark'])for(const contrast of ['no-preference','more']){
   await page.emulateMedia({colorScheme,contrast});
   await page.reload(); // Initialize media before loading CSS; live emulation is a separate claim.
   await page.waitForFunction(({colorScheme,contrast})=>matchMedia('(prefers-color-scheme:dark)').matches===(colorScheme==='dark')&&matchMedia('(prefers-contrast:more)').matches===(contrast==='more'),{colorScheme,contrast});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const rows=await page.evaluate(({packs,roles})=>{
    // Independent CSSOM observation of authored rules, separate from JS reader.
    function findSheet(sheet){if(sheet.href?.endsWith('/tokens/theme-attributes.css'))return sheet;for(const rule of sheet.cssRules)if(rule.styleSheet){const found=findSheet(rule.styleSheet);if(found)return found}return null}
    const sheet=[...document.styleSheets].map(findSheet).find(Boolean);if(!sheet)throw Error('Missing imported authored contrast stylesheet');
    const declarations=rules=>Object.fromEntries(roles.map(key=>[key,rules.style.getPropertyValue(key).trim()]));
    const light=declarations([...sheet.cssRules].find(r=>r.selectorText==='[data-cs-contrast="high"]'));
    const dark=declarations([...sheet.cssRules].find(r=>r.selectorText?.includes('[data-theme="dark"][data-cs-contrast="high"]')));
    const host=document.getElementById('fixture'),rows=[];
    for(const pack of Object.keys(packs))for(const theme of ['light','dark','system'])for(const mode of ['high','standard','system','reenter']){
     const [element,variant='']=pack.split('.');
     const axis=`data-theme="${theme}" data-cs-element="${element}" data-cs-variant="${variant}"`;
     const attrs=mode==='system'?'':`data-cs-contrast="${mode==='reenter'?'high':mode}"`;
     host.innerHTML=mode==='reenter'?`<div data-theme="dark" data-cs-contrast="high"><div data-cs-contrast="standard"><div ${axis} ${attrs}><i></i></div></div></div>`:`<div ${axis} ${attrs}><i></i></div>`;
     const probe=host.querySelector('i');const actual={};for(const key of roles){probe.style.color=`var(${key})`;actual[key]=getComputedStyle(probe).color}
     const selectedDark=theme==='dark'||theme==='system'&&matchMedia('(prefers-color-scheme:dark)').matches;
     const high=mode==='high'||mode==='reenter'||mode==='system'&&matchMedia('(prefers-contrast:more)').matches;
     const expected={};for(const key of roles){probe.style.color=(selectedDark?dark:light)[key];expected[key]=getComputedStyle(probe).color}
     rows.push({pack,theme,mode,high,actual,expected,authoredMaps:{'high-light':light,'high-dark':dark}});
    }return rows;
   },{packs:json.elements,roles});
   for(const row of rows){assert.deepEqual(row.authoredMaps,json.contrasts);if(row.high)assert.deepEqual(row.actual,row.expected,JSON.stringify({browserName,colorScheme,contrast,...row}));else assert.notDeepEqual(row.actual,row.expected,'Explicit standard/system no-preference must opt out');delete row.authoredMaps;report.contexts.push({browserName,colorScheme,contrast,...row})}
  }
 },{browserName});
 report.nativeConstantsChecked=copies;
 if(process.env.CS_CONTRAST_REPORT)await writeFile(process.env.CS_CONTRAST_REPORT,JSON.stringify(report,null,2)+'\n');
 console.log(`PASS contrast exports: ${report.failures.length} invalid mutations rejected by both real generators, all outputs preserved; source color changes propagate to JSON/ESM/DTCG and ${copies} native constants; ${report.contexts.length} browser contexts cover all15 packs, light/dark/system, OS contrast, standard opt-out and nested high reentry in all3 engines.`);
}finally{await rm(dir,{recursive:true,force:true})}
