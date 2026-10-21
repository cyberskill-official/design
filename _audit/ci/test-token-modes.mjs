import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,copyFileSync,rmSync,symlinkSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {modeInputs,modeColor,sourceModeColor,projectTokenMode,projectModeBundle} from '../../scripts/lib/token-modes.mjs';
import {valueFromCss,assertCssProjection} from '../../scripts/lib/dtcg-values.mjs';
import {validateDtcgProfile} from '../lib/dtcg-profile.mjs';
import {createStyleDictionaryAdapter} from '../../scripts/lib/style-dictionary-adapter.mjs';
const root=resolve('.'),inputs=modeInputs(root),index=JSON.parse(readFileSync('tokens/modes/index.json','utf8'));
const hash=text=>createHash('sha256').update(text).digest('hex');
assert.equal(index.schemaVersion,1);assert.equal(index.modes.length,256);assert.equal(new Set(index.modes.map(m=>m.id)).size,256);
assert.deepEqual(new Set(index.modes.map(m=>m.axes.theme)),new Set(['light','dark','system']));
assert.deepEqual(new Set(index.modes.filter(m=>m.axes.theme==='system').map(m=>m.axes.colorScheme)),new Set(['light','dark']));
const colorSpaces=['srgb','oklab'];
for(const mode of index.modes){
 const text=readFileSync('tokens/modes/'+mode.file,'utf8'),doc=JSON.parse(text),report=validateDtcgProfile(doc,{colorSpaces});
 assert.equal(hash(text),mode.sha256);assert.equal(report.pass,true,JSON.stringify(report.errors));assert.equal(report.leaves,194);assert.equal(assertCssProjection(doc),194);
 assert.equal(mode.tokenCount,194);assert.equal(mode.omissions.length,12);assert(mode.omissions.every(o=>o.name&&o.reason&&typeof o.resolvedCss==='string'));
 assert(mode.omissions.some(o=>o.name==='--cs-heading-tracking'&&/em/.test(o.reason)));
 assert.equal(doc.$extensions['com.cyberskill'].sourceHash,index.sourceHash);assert.equal(doc.$extensions['com.cyberskill'].modeId,mode.id);
 assert.equal(doc.$extensions['com.cyberskill'].overrides,undefined,'Mode values are typed standard token leaves and intra-document aliases, not vendor mode maps');
 const adapter=createStyleDictionaryAdapter(doc,{colorSpaces});const allTokens=Object.entries(doc).filter(([g])=>!g.startsWith('$')).flatMap(([group,entries])=>Object.entries(entries).map(([name,original])=>({path:[group,name],original:structuredClone(original)})));
 assert.deepEqual(adapter.exportDtcg({allTokens}),doc);
 const changed=structuredClone(doc);changed.color['--cs-color-brand-umber'].$value.components[0]=0.99;assert.throws(()=>assertCssProjection(changed),/mismatch/);
}
const oklab={$type:'color',$value:{colorSpace:'oklab',components:[.9,.12,-.02],alpha:1}};
assert.equal(validateDtcgProfile({colors:{mix:oklab}}).pass,false,'Default/root profile remains strict sRGB');
assert.equal(validateDtcgProfile({colors:{mix:oklab}},{colorSpaces}).pass,true);
for(const mutate of [d=>d.$value.components[0]=1.1,d=>d.$value.components[1]=Infinity,d=>d.$value.alpha=1.1,d=>d.$value.colorSpace='lab']){const def=structuredClone(oklab);mutate(def);assert.equal(validateDtcgProfile({colors:{mix:def}},{colorSpaces}).pass,false)}
assert.deepEqual(modeColor('oklab(0.989214 0.00245133 0.00811127)'),{colorSpace:'oklab',components:[.989214,.002451,.008111],alpha:1},'Out-of-sRGB source is retained in OKLAB, never clipped');
assert.deepEqual(valueFromCss('color','color(srgb 0.2 0.4 0.6 / 0.5)'),{colorSpace:'srgb',components:[.2,.4,.6],alpha:.5});
assert.throws(()=>modeColor('not-a-color'),/Unsupported/);
// Standards-defined opaque interpolation vectors and source precision contract.
assert.deepEqual(sourceModeColor('color-mix(in oklab, #000000, #FFFFFF)').components,[0.5,0,0]);
assert.deepEqual(sourceModeColor('color-mix(in oklab, #000000 25%, #FFFFFF)').components,[0.75,0,0]);
assert.deepEqual(sourceModeColor('color-mix(in oklab, #000000, #FFFFFF 75%)').components,[0.75,0,0]);
assert.deepEqual(sourceModeColor('color-mix(in oklab, #000000 25%, #FFFFFF 75%)').components,[0.75,0,0]);
assert.deepEqual(sourceModeColor('color-mix(in oklab, #000000 0%, #FFFFFF)').components,[1,0,0]);
for(const css of ['color-mix(in oklab, #000000 10%, #FFFFFF 20%)','color-mix(in oklab, #000000 80%, #FFFFFF 80%)','color-mix(in oklab, #000000 -1%, #FFFFFF)','color-mix(in oklab, #000000 101%, #FFFFFF)','color-mix(in srgb, #000000, #FFFFFF)','color-mix(in oklab, rgba(0,0,0,.5), #FFFFFF)','color-mix(in oklab, #000000 1..2%, #FFFFFF)'])assert.throws(()=>sourceModeColor(css),/Unsupported/);
const {rgb2oklab,hex2rgb}=await import('../../scripts/lib/oklch.mjs');
for(const a of ['#000000','#FFFFFF','#C0F5FC','#45210E'])for(const b of ['#221710','#FFFDF8'])for(const percent of [0,4,8,10,15,40,50,100]){
 const result=sourceModeColor(`color-mix(in oklab, ${a} ${percent}%, ${b})`),left=rgb2oklab(hex2rgb(a)),right=rgb2oklab(hex2rgb(b));
 for(let c=0;c<3;c++)assert(Math.abs(result.components[c]-(left[c]*percent+right[c]*(100-percent))/100)<=0.000000500000001,'Six-decimal quantization error must remain bounded');
}

const temp=mkdtempSync(join(tmpdir(),'cs-token-modes-mutation-'));
try {
 for(const path of Object.keys(inputs.sources)){mkdirSync(dirname(join(temp,path)),{recursive:true});copyFileSync(resolve(path),join(temp,path));}
 symlinkSync(resolve('node_modules'),join(temp,'node_modules'));
 const original=modeInputs(temp);assert.equal(original.sourceHash,inputs.sourceHash);
 const colors=join(temp,'tokens/colors.css'),text=readFileSync(colors,'utf8');
 writeFileSync(colors,text.replace('#45210E','#000000'));assert.notEqual(modeInputs(temp).sourceHash,inputs.sourceHash,'Source-value drift invalidates provenance');
 writeFileSync(colors,text+'\n:root { --cs-unclassified-mode: 1px; }\n');assert.throws(()=>modeInputs(temp),/Unclassified mode token/);
 mkdirSync(join(temp,'tokens/modes'));writeFileSync(join(temp,'tokens/modes/index.json'),'unchanged sentinel');
 const failed=spawnSync(process.execPath,[join(temp,'scripts/generate-token-modes.mjs')],{cwd:temp,encoding:'utf8'});
 assert.notEqual(failed.status,0);assert.match(failed.stderr,/Unclassified mode token/);assert.equal(readFileSync(join(temp,'tokens/modes/index.json'),'utf8'),'unchanged sentinel','Failed generation preserves artifacts');
} finally {rmSync(temp,{recursive:true,force:true})}
console.log('PASS 256 standalone DTCG modes:194typed values+12explicit omissions each, default-profile isolation, OKLAB/range/mutation checks, source drift, unknown membership and failed-write preservation; repository adapter roundtrip for every document');
