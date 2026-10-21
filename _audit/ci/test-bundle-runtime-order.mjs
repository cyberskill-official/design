import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {parse} from 'parse5';
const ignored=new Set(['node_modules','.git','dist','storybook-static','test-results','.vercel','examples']);
function files(dir='.') {return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>ignored.has(entry.name)?[]:entry.isDirectory()?files(dir+'/'+entry.name):entry.name.endsWith('.html')?[dir+'/'+entry.name]:[]);}
function scripts(source){const result=[];function walk(node){if(node.tagName==='script')result.push(Object.fromEntries(node.attrs.map(a=>[a.name,a.value])));for(const child of node.childNodes||[])walk(child);}walk(parse(source));return result;}
function check(source,label){const tags=scripts(source);for(let i=0;i<tags.length;i++){const tag=tags[i];if(!/(?:^|\/)\_ds_bundle\.js(?:[?#]|$)/.test(tag.src||''))continue;assert(!('async'in tag),label+': bundle must not race React');const prior=tags.slice(0,i).filter(t=>/(?:^|\/)react(?:\.production\.min)?\.js(?:[?#]|$)/.test(t.src||''));assert(prior.some(t=>!('async'in t)&&(!('defer'in t)||'defer'in tag)),label+': synchronous React must precede eager forwardRef evaluation');}return tags.some(t=>(t.src||'').includes('_ds_bundle.js'));}
assert.throws(()=>check('<script src="_ds_bundle.js"></script>','missing'),/React must precede/);
assert.throws(()=>check('<script async src="react.js"></script><script src="_ds_bundle.js"></script>','race'),/React must precede/);
assert.throws(()=>check('<script defer src="react.js"></script><script src="_ds_bundle.js"></script>','deferred'),/React must precede/);
assert.throws(()=>check('<script src="react.js"></script><script async src="_ds_bundle.js"></script>','race'),/must not race/);
check('<!-- <script src="_ds_bundle.js"></script> --><script src="react.js"></script><script src="_ds_bundle.js"></script>','valid');
const direct=files().filter(path=>check(readFileSync(path,'utf8'),path));assert(direct.length>10,'inventory must cover actual static consumers');
const esm=readFileSync('_esm/cs.mjs','utf8');assert(esm.indexOf('await ensureReact();')<esm.indexOf('await ensureScript("../_ds_bundle.js")'),'browser ESM loader awaits React');
const template=readFileSync('scripts/template-runtime/ds-base.js','utf8');assert(template.includes("typeof window.React?.useLayoutEffect !== 'function'")&&template.indexOf("typeof window.React?.useLayoutEffect !== 'function'")<template.indexOf("script.src = bundleUrl"),'template dynamic loader waits for React');
mkdirSync('test-results/floating-panels',{recursive:true});writeFileSync('test-results/floating-panels/runtime-order.json',JSON.stringify({status:'PASS',directHtmlConsumers:direct,dynamicLoaders:['_esm/cs.mjs','scripts/template-runtime/ds-base.js'],negativeFixtures:4},null,2)+'\n');console.log('PASS eager native-ref runtime order: '+direct.length+' direct HTML consumers plus ESM/template loader guards and four negative fixtures');
