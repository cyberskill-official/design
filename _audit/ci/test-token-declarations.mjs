import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {declarationGraphReference,verifyDeclarationGraph} from '../../scripts/lib/token-graph-reference.mjs';
import tokens from '../../tokens/tokens.js';
import {collectTokenDeclarations,manifestTokens} from '../../scripts/lib/token-declarations.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const root=new URL('../../',import.meta.url);
const graph=JSON.parse(await readFile(new URL('tokens/declarations.json',root),'utf8'));
const manifest=JSON.parse(await readFile(new URL('_ds_manifest.json',root),'utf8'));
const dtcg=JSON.parse(await readFile(new URL('tokens/tokens.dtcg.json',root),'utf8'));
const graphText=await readFile(new URL('tokens/declarations.json',root),'utf8');
const json=JSON.parse(await readFile(new URL('tokens/tokens.json',root),'utf8'));
const reference=declarationGraphReference(graphText);
assert.deepEqual(json.$meta.declarationGraph,reference);
assert.deepEqual(tokens.$meta.declarationGraph,reference);
assert.deepEqual(dtcg.$extensions['com.cyberskill'].declarationGraph,reference);
assert.equal(reference.publicNames,216);
const aliases=JSON.parse(await readFile(new URL('_audit/ci/fixtures/a01-token-aliases/aliases.json',root),'utf8')).aliases;
assert.equal(aliases.length,22);
assert.equal(new Set(aliases.map(pair=>pair.alias)).size,22);
const camelNames=[...new Set(graph.declarations.filter(row=>row.visibility==='public'&&/[A-Z]/.test(row.name)).map(row=>row.name))].sort();
assert.deepEqual(camelNames,aliases.map(pair=>pair.legacy).sort(),'Every legacy camelCase declaration remains owned');
for(const {group,legacy,alias,type} of aliases){
 const rows=graph.declarations.filter(row=>row.visibility==='public'&&row.name===alias);
 assert(rows.length>0&&rows.every(row=>row.value.trim()==='var('+legacy+')'),'All alias scopes retain the legacy binding');
 assert(manifest.tokens.some(row=>row.name===legacy)&&manifest.tokens.some(row=>row.name===alias));
 assert.equal(dtcg[group][alias].$type,type);assert.equal(dtcg[group][legacy].$type,type);
 assert.equal(dtcg[group][alias].$value,'{'+group+'.'+legacy+'}');
 assert.equal(dtcg[group][alias].$extensions['com.cyberskill'].nativeAliasOf,legacy);
}
for(const role of ['success','danger','warning','info']) {
 const name='--cs-color-semantic-'+role+'-text';
 assert(graph.declarations.some(d=>d.name===name&&d.visibility==='public'),name+' must be a public source declaration');
 assert(manifest.tokens.some(t=>t.name===name),name+' must survive the manifest projection');
}
verifyDeclarationGraph(reference,graphText);
assert.throws(()=>verifyDeclarationGraph(undefined,graphText),/Missing/);
assert.throws(()=>verifyDeclarationGraph({...reference,path:'../outside.json'},graphText),/path/);
assert.throws(()=>verifyDeclarationGraph({...reference,publicNames:1},graphText),/publicNames/);
for(const mutate of [g=>g.declarations.pop(),g=>g.declarations.reverse(),g=>g.declarations[0].value='altered',g=>{g.declarations=g.declarations.filter(d=>d.visibility==='public');}]) {
 const changed=structuredClone(graph);mutate(changed);assert.throws(()=>verifyDeclarationGraph(reference,JSON.stringify(changed,null,2)+'\n'),/mismatch/);
}
assert.deepEqual(manifest.tokens,manifestTokens(graph,dtcg));
assert(!manifest.tokens.some(t=>t.name.startsWith('--_')));
assert(graph.declarations.some(d=>d.visibility==='private'&&d.value.trim()===''),'Private empty switch values must survive');
await withBrowserFixture(async page=>{
 const result=await page.evaluate(graph=>{
  const actual=[];
  function walk(sheet,rules,context=[]){
   const path=new URL(sheet.href).pathname.slice(1);
   for(const rule of rules){
    if(rule.type===CSSRule.IMPORT_RULE){walk(rule.styleSheet,rule.styleSheet.cssRules,context);continue;}
    if(rule.selectorText){
     const next=[...context,{kind:'rule',selector:rule.selectorText}];
     for(const name of rule.style)if(name.startsWith('--'))actual.push({sourcePath:path,name,value:rule.style.getPropertyValue(name).trim(),important:rule.style.getPropertyPriority(name)==='important',context:next});
     if(rule.cssRules)walk(sheet,rule.cssRules,next);
    }else if(rule.cssRules){
     const name=rule.cssText.slice(1).match(/^[\w-]+/)[0];
     const params=rule.conditionText??rule.name??'';
     walk(sheet,rule.cssRules,[...context,{kind:'at-rule',name,params}]);
    }
   }
  }
  const sheet=[...document.styleSheets].find(s=>s.href&&new URL(s.href).pathname==='/styles.css');walk(sheet,sheet.cssRules);
  const expected=graph.declarations.map(({sourcePath,name,value,important,context})=>({sourcePath,name,value:value.trim(),important,context:context.map(c=>{
   const temporary=new CSSStyleSheet();
   temporary.replaceSync(c.kind==='rule'?`${c.selector} {}`:`@${c.name} ${c.params} {}`);
   const rule=temporary.cssRules[0];
   return c.kind==='rule'?{...c,selector:rule.selectorText}:{...c,params:rule.conditionText??rule.name??''};
  })}));
  return {actual,expected};
 },graph);
 assert.deepEqual(result.actual,result.expected,'Independent live CSSOM must match every declaration, context and order');
});
const dir=await mkdtemp(join(tmpdir(),'cs-declarations-'));
try{
 await mkdir(join(dir,'tokens'));
 await writeFile(join(dir,'styles.css'),'@import "tokens/a.css"; @import "tokens/a.css";');
 const css='@layer tokens { @supports (display: grid) { @media (width > 1px) { :is(.a, .b) { --cs-x: var(--_private, "a;b"); --_private: ; & .child { --cs-y: 2px !important; } } } } }';
 await writeFile(join(dir,'tokens/a.css'),css);
 const fixture=collectTokenDeclarations(dir);
 assert.equal(fixture.declarations.length,6,'Repeated imports retain cascade occurrences');
 assert.equal(fixture.declarations[2].important,true);
 assert.equal(fixture.declarations[2].context.filter(c=>c.kind==='rule').length,2,'Nested selectors retain their parent path');
 assert.equal(fixture.declarations[1].value,' ');
 assert.equal(fixture.declarations[0].value,'var(--_private, "a;b")');
 assert.deepEqual(collectTokenDeclarations(dir),fixture,'Deterministic graph');
 for(const [name,source] of [['cycle','@import "../styles.css";'],['missing','@import "missing.css";'],['qualified','@import "a.css" screen;'],['remote','@import "https://example.invalid/a.css";'],['malformed',':root { --cs-x: 2px;']]){
  await writeFile(join(dir,'tokens/a.css'),source);assert.throws(()=>collectTokenDeclarations(dir),undefined,name);
 }
}finally{await rm(dir,{recursive:true,force:true});}
console.log(`PASS token declarations: ${graph.declarations.length} live CSSOM declarations and exact contexts/order; public manifest projection; nested/import/failure cases.`);
