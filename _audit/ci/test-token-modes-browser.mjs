import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium,firefox,webkit} from 'playwright';
import {modeInputs,captureTokenModes,projectTokenMode,modeColor} from '../../scripts/lib/token-modes.mjs';
import {oklab2rgb} from '../../scripts/lib/oklch.mjs';
const inputs=modeInputs(resolve('.')),index=JSON.parse(readFileSync('tokens/modes/index.json','utf8'));
const documents=new Map(index.modes.map(mode=>[mode.id,JSON.parse(readFileSync('tokens/modes/'+mode.file,'utf8'))]));
const leaves=doc=>Object.fromEntries(Object.entries(doc).filter(([g])=>!g.startsWith('$')).flatMap(([group,entries])=>Object.entries(entries).map(([name,def])=>[group+'.'+name,def])));
const rgb=color=>color.colorSpace==='oklab'?oklab2rgb(color.components).map(c=>c/255):color.components;
// Engines serialize/evaluate OKLAB mixes differently. Require a maximum one
// sRGB 8-bit code point, record the measured delta, and keep pinned-renderer
// regeneration byte-exact. This does not claim cross-engine bit identity.
const colorTolerance=1/255;
function assertColorWithinTolerance(actual,expected,message) {
 const a=rgb(actual),e=rgb(expected),delta=Math.max(...a.map((v,i)=>Math.abs(v-e[i])),Math.abs(actual.alpha-expected.alpha));
 assert(delta<=colorTolerance,`${message}: cross-engine CSSOM color delta ${delta}`);return delta;
}
const receipts=[];
for(const browserType of [chromium,firefox,webkit]){
 const capture=await captureTokenModes(inputs,{browserType});let maximumColorDelta=0;
 for(const current of capture.values){
  const actual=leaves(projectTokenMode(inputs,current).doc),expected=leaves(documents.get(current.id));assert.deepEqual(Object.keys(actual),Object.keys(expected));
  for(const [name,def]of Object.entries(actual)){
   assert.equal(def.$type,expected[name].$type);
   if(def.$type==='color'){
    const cssName=name.slice(name.indexOf('.')+1);
    const independentCssColor=modeColor(current.colors[cssName]);
    const delta=assertColorWithinTolerance(independentCssColor,expected[name].$value,`${capture.engine} ${current.id} ${name}`);maximumColorDelta=Math.max(maximumColorDelta,delta);
   }else assert.deepEqual(def.$value,expected[name].$value,`${capture.engine} ${current.id} ${name}`);
  }
 }
 const implicit=await captureTokenModes(inputs,{browserType,implicit:true});
 for(let i=0;i<capture.values.length;i++){
  const explicitValues=leaves(projectTokenMode(inputs,capture.values[i]).doc),implicitValues=leaves(projectTokenMode(inputs,implicit.values[i]).doc);
  for(const key of Object.keys(explicitValues))assert.deepEqual(implicitValues[key].$value,explicitValues[key].$value,`${capture.engine} implicit OS contrast ${capture.values[i].id} ${key}`);
 }
 // Real CSS mutations must alter captured values; missing aliases must fail closed.
 const fixtureModes=inputs.modes.filter(m=>m.id==='light__default__compact__standard');assert.equal(fixtureModes.length,1);
 const mutated={...inputs,modes:fixtureModes,css:inputs.css+'\n:root[data-theme][data-cs-density][data-cs-contrast] { --cs-color-brand-umber: #000000; --cs-density-control-gap: 7px; }'};
 const changed=projectTokenMode(inputs,(await captureTokenModes(mutated,{browserType})).values[0]).doc;
 assert.deepEqual(changed.color['--cs-color-brand-umber'].$value.components,[0,0,0]);assert.deepEqual(changed.density['--cs-density-control-gap'].$value,{value:7,unit:'px'});
 assert.throws(()=>assertColorWithinTolerance(changed.color['--cs-color-brand-umber'].$value,documents.get(fixtureModes[0].id).color['--cs-color-brand-umber'].$value,'deliberate color drift'),/color delta/,'A mutation beyond the parity bound must fail');
 const missing={...inputs,modes:fixtureModes,css:inputs.css+'\n:root[data-theme][data-cs-density][data-cs-contrast] { --cs-color-brand-umber: var(--cs-missing); }'};
 const broken=await captureTokenModes(missing,{browserType});assert.throws(()=>projectTokenMode(inputs,broken.values[0]),/Missing resolved token/);
 receipts.push({engine:capture.engine,version:capture.version,platform:capture.platform,modeCount:capture.values.length,implicitContrastCount:implicit.values.length,maximumColorDelta,passed:true});
 console.log(`PASS ${capture.engine} ${capture.version}:256mode values+256implicit OS contrast branches; actual CSS color/density mutations and missing alias rejection; maximum sRGB delta ${maximumColorDelta}`);
}
mkdirSync('test-results',{recursive:true});writeFileSync('test-results/token-modes-browser.json',JSON.stringify({sourceHash:inputs.sourceHash,interpretation:'Installed engine parity only; latest two released desktop versions, physical iOS and manual/tool acceptance are not established.',colorTolerance,receipts},null,2)+'\n');
