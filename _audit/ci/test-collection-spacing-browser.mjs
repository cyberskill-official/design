import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {transform} from 'esbuild';
import postcss from 'postcss';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
const contract=JSON.parse(read('_audit/ci/fixtures/g31-collection-spacing-roles.json')),before=read(contract.baseline),after=read(contract.source);assert.equal(hash(before),contract.baselineSha256);
const ast=postcss.parse(after);for(const role of contract.roles){const values=[];ast.walkRules(r=>{if(r.selector===role.selector)r.walkDecls(role.property,d=>values.push(d.value));});assert.deepEqual(values,[role.after]);}
const minified=(await transform(after,{loader:'css',minifyWhitespace:true})).code,results=[];mkdirSync('test-results/collection-spacing',{recursive:true});
for(const browserName of ['chromium','firefox','webkit'])for(const coarse of [false,true])await withBrowserFixture(async page=>{
 let source=before;await page.route('**/base/collections.css',route=>route.fulfill({status:200,contentType:'text/css',body:source}));const origin=new URL(page.url()).origin;
 async function render(css){source=css;await page.goto(origin+'/');await page.evaluate(()=>{
  const C=window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[a-f0-9]{6}$/.test(k))],e=React.createElement;
  const cases=[e(C.List,null,e(C.ListItem,{title:'List row',subtitle:'Description',lead:'•',trail:'End'})),e(C.Item,{title:'Item row',description:'Description',leading:'•',trailing:'End'}),e(C.Timeline,{items:[{title:'Event',meta:'Today',body:'Description'},{title:'Next'}]}),e(C.Accordion,{items:[{title:'Section',content:'Content'}]})];
  const scopes=[['default',null],['comfortable','comfortable'],['compact','compact'],['inherit',null,'compact'],['reset','comfortable','compact'],['reentry','compact','comfortable']];
  const nodes=[];for(const theme of ['light','dark'])for(const dir of ['ltr','rtl'])for(const [id,density,parent]of scopes){let node=e('section',{'data-case':theme+'-'+dir+'-'+id,'data-theme':theme,'data-cs-density':density,dir,style:{width:360,margin:12}},...cases);if(parent)node=e('div',{'data-cs-density':parent},node);nodes.push(node);}
  ReactDOM.flushSync(()=>ReactDOM.createRoot(document.getElementById('fixture')).render(e('div',null,...nodes)));
 });await page.evaluate(()=>document.fonts.ready);return snapshot();}
 async function snapshot(){return page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-case]')].map(s=>[s.dataset.case,[...s.querySelectorAll('.cs-list__item,.cs-item,.cs-timeline__item,.cs-accordion__trigger')].map(el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return {className:el.className,width:r.width,height:r.height,x:r.x,y:r.y,...Object.fromEntries(['paddingTop','paddingRight','paddingBottom','paddingLeft','rowGap','columnGap','fontSize','lineHeight','borderTopWidth','minHeight'].map(k=>[k,c[k]]))};})])));}
 const pointer=await page.evaluate(()=>matchMedia('(pointer:coarse)').matches);assert.equal(pointer,coarse);
 const baseline=await render(before);for(const [name,css]of [['source',after],['minified-leaf',minified]]){assert.deepEqual(await render(css),baseline,browserName+'/'+name+' geometry must preserve before-edit values');
  await page.evaluate(()=>{for(const s of document.querySelectorAll('[data-case]')){s.style.setProperty('--cs-space-3','17px');s.style.setProperty('--cs-space-5','27px');}});
  const mutation=await page.evaluate(()=>[...document.querySelectorAll('[data-case]')].map(s=>{const get=(q,p)=>getComputedStyle(s.querySelector(q))[p];return [get('.cs-list__item','columnGap'),get('.cs-list__item','paddingLeft'),get('.cs-item','paddingTop'),get('.cs-item','paddingLeft'),get('.cs-timeline__item','paddingBottom'),get('.cs-accordion__trigger','columnGap')];}));for(const values of mutation)assert.deepEqual(values,['17px','17px','17px','14px','27px','17px']);
 }
 results.push({browserName,pointer:coarse?'coarse':'fine',scopes:24,targetsPerScope:5,distributions:['source','minified-leaf'],pass:true});console.log('PASS collection spacing '+browserName+'/'+(coarse?'coarse':'fine'));
},{browserName,contextOptions:{hasTouch:coarse,viewport:{width:1280,height:900}}});
assert.equal(read(contract.source),after);writeFileSync('test-results/collection-spacing/final.json',JSON.stringify({pass:true,node:process.version,scope:'Five exact spacing declarations; actual four component exports,24 theme/direction/density scopes, source and whitespace-minified leaf; no density expansion',hashes:{before:hash(before),after:hash(after),minified:hash(minified)},results},null,2)+'\n');
