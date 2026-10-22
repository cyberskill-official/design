import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const files=['tokens/native/CSTokens.swift','tokens/native/CSTokens.kt','tokens/native/cs_tokens.dart'];
const native=await Promise.all(files.map(p=>readFile(new URL('../../'+p,import.meta.url),'utf8')));
await withBrowserFixture(async page=>{
 const result=await page.evaluate(async()=>{
  const css=await fetch('/tokens/theme-attributes.css').then(r=>r.text());
  const sheet=new CSSStyleSheet();sheet.replaceSync(css);
  const scopes={};
  for(const rule of sheet.cssRules){
   if(!rule.style)continue;
   const match=rule.selectorText.match(/^\[data-cs-density="(compact|comfortable)"\]$/);
   const key=rule.selectorText===':root'?'root':match?.[1];if(!key)continue;
   scopes[key]=Object.fromEntries([...rule.style].filter(k=>k.startsWith('--cs-')).map(k=>[k,rule.style.getPropertyValue(k).trim()]));
  }
  const json=await fetch('/tokens/tokens.json').then(r=>r.json());
  const dtcg=await fetch('/tokens/tokens.dtcg.json').then(r=>r.json());
  const js=(await import('/tokens/tokens.js')).tokens;
  const manifest=await fetch('/_ds_manifest.json').then(r=>r.json());
  const host=document.getElementById('fixture'),values={};
  for(const [scope,decls] of Object.entries(scopes)){
   host.innerHTML=`<div ${scope==='root'?'':`data-cs-density="${scope}"`}></div>`;
   const computed=getComputedStyle(host.firstElementChild);
   values[scope]=Object.fromEntries(Object.keys(decls).map(k=>[k,computed.getPropertyValue(k).trim()]));
  }
  return{scopes,json,dtcg,js,values,manifest};
 });
 assert.equal(Object.keys(result.scopes.root).length,7);
 assert.deepEqual(result.json.root.density,result.scopes.root,'All root density aliases must be exported');
 assert.deepEqual(result.js,result.json,'ESM and JSON must agree');
 for(const [scope,decls] of Object.entries(result.scopes)){
  const selector=scope==='root'?undefined:`[data-cs-density="${scope}"]`;
  const rows=result.manifest.tokens.filter(t=>t.definedIn==='tokens/theme-attributes.css'&&t.scope===selector);
  assert.equal(rows.length,Object.keys(decls).length,'Manifest density entry count');
  assert.deepEqual(Object.fromEntries(rows.map(t=>[t.name,t.value])),decls,'Manifest density values');
 }

 for(const density of ['compact','comfortable']){
  assert.deepEqual(result.json.densities[density],result.scopes[density]);
  assert.deepEqual(result.dtcg.$extensions['com.cyberskill'].overrides.densities[density],result.scopes[density]);
 }
 for(const [name,css] of Object.entries(result.scopes.root)){
  const def=result.dtcg.density[name];assert.equal(def.$type,'dimension');
  assert.equal(def.$extensions['com.cyberskill'].css,css);
  assert.match(def.$value,/^\{[^{}]+\}$/,'Density token must retain a typed alias');
 }
 const camel=name=>name.replace(/^--cs-/,'').split(/[-_]/).map((p,i)=>i?p[0].toUpperCase()+p.slice(1):p).join('');
 for(const [scope,values] of Object.entries(result.values))for(const [key,value] of Object.entries(values)){
  assert.match(value,/^-?[\d.]+px$/);const n=Number.parseFloat(value);
  const name=camel(key)+(scope==='root'?'':scope[0].toUpperCase()+scope.slice(1));
  const wanted=[`let ${name}: CGFloat = ${n}\n`,`val ${name} = ${n}.dp\n`,`const double ${name} = ${n};\n`];
  native.forEach((text,i)=>assert(text.includes(wanted[i]),`${files[i]} must expose ${name} = ${value}`));
 }
 const releaseChecks=await page.evaluate(async()=>{
  const {parseReleaseVersion}=await import('/scripts/lib/release-version-core.mjs');
  const valid=['1.7.2','2.0.0-alpha.0'].map(value=>{parseReleaseVersion(value);return value;});
  const rejected=['2.0','01.2.3','2.0.0-alpha.01','2.0.0+metadata'].map(value=>{try{parseReleaseVersion(value);return false;}catch{return true;}});
  return {valid,rejected};
 });
 assert.equal(releaseChecks.valid.length,2);assert(releaseChecks.rejected.every(Boolean));
 const origin=new URL(page.url()).origin;
 await page.goto(`${origin}/_audit/token-pipeline-test.html`);
 await page.waitForFunction(()=>window.__tokenpipe);
 const pipeline=await page.evaluate(()=>window.__tokenpipe);
 assert.equal(pipeline.pass,true,JSON.stringify(pipeline));
 const provenance=JSON.parse(await readFile(new URL('../../tokens/provenance.json',import.meta.url),'utf8'));
 for(const release of ['1.7.2','2.0.0-alpha.0','2.0','01.2.3','2.0.0-alpha.01','2.0.0+metadata']) {
  await page.route('**/tokens/provenance.json',route=>route.fulfill({json:{...provenance,release}}));
  await page.goto(`${origin}/_audit/token-pipeline-test.html`);await page.waitForFunction(()=>window.__tokenpipe);
  const verdict=await page.evaluate(()=>window.__tokenpipe);
  assert.equal(verdict.pass,['1.7.2','2.0.0-alpha.0'].includes(release),JSON.stringify({release,verdict}));
  if(!verdict.pass)assert.deepEqual(verdict.failed,['provenance release stamp sane'],'Only the malformed informational stamp should fail; all hash/value checks still run');
  await page.unroute('**/tokens/provenance.json');
 }
 await page.goto(`${origin}/_audit/version-stamp.html`);await page.waitForFunction(()=>window.__versionstamp);
 const versionStamp=await page.evaluate(()=>window.__versionstamp);
 assert.equal(versionStamp.pass,true,JSON.stringify(versionStamp));assert.equal(versionStamp.stamps.length,9);
 await page.route('**/DESIGN.md',route=>route.fulfill({body:'---\nversion: "2.0.0-alpha.01"\n---\n'}));
 await page.goto(`${origin}/_audit/version-stamp.html`);await page.waitForFunction(()=>window.__versionstamp);
 const invalidDesign=await page.evaluate(()=>window.__versionstamp);assert.equal(invalidDesign.pass,false);assert(invalidDesign.failed.some(x=>x.startsWith('DESIGN.md front-matter version=')));
 await page.unroute('**/DESIGN.md');
 await page.goto(`${origin}/_audit/design-md-parity.html`);
 await page.waitForFunction(()=>window.__designmd);
 const design=await page.evaluate(()=>window.__designmd);
 assert.equal(design.pass,true,JSON.stringify(design));
 console.log('PASS density exports: 7 base aliases and all 18 compact/18 comfortable overrides; CSSOM, JSON, ESM, DTCG and computed native dimensions agree.');
});
