import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['scripts/sync-font-manifest.mjs','--check'],{stdio:'pipe'});
execFileSync(process.execPath,['scripts/flatten-styles.mjs','--check'],{stdio:'pipe'});
const required=new Set([...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 Đđ₫']);
for(const vowel of 'aăâeêioôơuưyAĂÂEÊIOÔƠUƯY')for(const tone of ['','\u0300','\u0301','\u0303','\u0309','\u0323'])for(const ch of (vowel+tone).normalize('NFC'))required.add(ch);
const requiredCodepoints=[...required].map(ch=>ch.codePointAt(0)).sort((a,b)=>a-b);
assert.equal(requiredCodepoints.length,198,'Repertoire changes require explicit review');
const manifest=JSON.parse(readFileSync('_ds_manifest.json','utf8'));
const groupMap=new Map();
for(const face of manifest.fonts){
 const key=`${face.family}\t${face.style}\t${face.weight}`;
 if(!groupMap.has(key))groupMap.set(key,{family:face.family,style:face.style,weight:face.weight});
}
const groups=[...groupMap.values()];
const results=[];
for(const stylesheet of ['styles.css','dist/styles.min.css']) await withBrowserFixture(async page=>{
 await page.evaluate(async stylesheet=>{
  const link=document.querySelector('link[rel=stylesheet]');
  if(new URL(link.href).pathname==='/'+stylesheet) return;
  await new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=()=>reject(new Error('Stylesheet failed: '+stylesheet));link.href='/'+stylesheet;});
 },stylesheet);
 const session=await page.context().newCDPSession(page);
 await session.send('DOM.enable');await session.send('CSS.enable');
 for(const group of groups){
  const range=group.weight.split(/\s+/).map(Number);
  const weights=range.length===1?range:Array.from({length:(range[1]-range[0])/100+1},(_,i)=>range[0]+i*100);
  for(const weight of weights) for(const normalization of ['NFC','NFD']){
   const width=await page.evaluate(async({group,weight,codepoints,normalization})=>{
    const el=document.createElement('span');el.id='font-probe';el.textContent=String.fromCodePoint(...codepoints).normalize(normalization);
    Object.assign(el.style,{fontFamily:group.family,fontStyle:group.style,fontWeight:String(weight),fontSize:'20px',whiteSpace:'nowrap'});
    document.getElementById('fixture').replaceChildren(el);el.getBoundingClientRect();await document.fonts.ready;return el.getBoundingClientRect().width;
   },{group,weight,codepoints:requiredCodepoints,normalization});
   const {root}=await session.send('DOM.getDocument');
   const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#font-probe'});
   const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
   results.push({stylesheet,family:group.family,style:group.style,weight,normalization,width,fonts,customFontOnly:fonts.length>0&&fonts.every(font=>font.isCustomFont&&font.glyphCount>0)});
  }
 }
});
for(const result of results.filter(result=>result.normalization==='NFC')) {
 const decomposed=results.find(other=>other.stylesheet===result.stylesheet&&other.family===result.family&&other.style===result.style&&other.weight===result.weight&&other.normalization==='NFD');
 assert.equal(decomposed.width,result.width,'NFC/NFD layout differs: '+result.family+' '+result.style+' '+result.weight);
}
const failures=results.filter(result=>!result.customFontOnly);
console.log(JSON.stringify({cases:results.length,customFontOnly:results.length-failures.length,systemFallback:failures.length}));
assert.deepEqual(failures.map(({stylesheet,family,style,weight,normalization})=>({stylesheet,family,style,weight,normalization})),[],'Required Vietnamese text must not fall back to system fonts');
console.log('PASS font rendering: NFC/NFD repertoire uses shipped custom fonts');
