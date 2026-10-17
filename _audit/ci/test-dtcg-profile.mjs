import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateDtcgProfile} from '../lib/dtcg-profile.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const token=($type,$value)=>({$type,$value});
const color={colorSpace:'srgb',components:[0.1,0.2,0.3],alpha:0.5,hex:'#1a334d'};
const dim={value:2,unit:'px'};
const layer={color:'{base.color}',offsetX:dim,offsetY:dim,blur:dim,spread:dim,inset:false};
const valid={base:{
 color:token('color',color),dim:token('dimension',dim),duration:token('duration',{value:0.2,unit:'s'}),
 number:token('number',1.5),curve:token('cubicBezier',[0,-1,1,2]),font:token('fontFamily',['A','sans-serif']),
 shadow:token('shadow',layer),layers:token('shadow',['{base.shadow}',layer]),
 nested:{alias:token('dimension','{base.dim}')},chain:token('dimension','{base.nested.alias}')
},inherited:{$type:'dimension',child:{$value:{value:1,unit:'rem'}}}};
assert.equal(validateDtcgProfile(valid).pass,true);
const cases=[
 ['CSS color',d=>d.base.color.$value='#fff'],
 ['CSS dimension',d=>d.base.dim.$value='2px'],
 ['em dimension',d=>d.base.dim.$value.unit='em'],
 ['number string',d=>d.base.number.$value='1.5'],
 ['CSS duration',d=>d.base.duration.$value='200ms'],
 ['invalid duration unit',d=>d.base.duration.$value.unit='minutes'],
 ['Bezier x out of range',d=>d.base.curve.$value[2]=1.1],
 ['Bezier arity',d=>d.base.curve.$value.pop()],
 ['nonfinite number',d=>d.base.number.$value=NaN],
 ['infinite dimension',d=>d.base.dim.$value.value=Infinity],
 ['color range',d=>d.base.color.$value.components[1]=1.1],
 ['color alpha',d=>d.base.color.$value.alpha='0.5'],
 ['color hex',d=>d.base.color.$value.hex='#abc'],
 ['unsupported color space',d=>d.base.color.$value.colorSpace='lab'],
 ['font family member',d=>d.base.font.$value.push(42)],
 ['missing shadow field',d=>delete d.base.shadow.$value.spread],
 ['CSS shadow field',d=>d.base.shadow.$value.blur='2px'],
 ['shadow inset',d=>d.base.shadow.$value.inset='false'],
 ['nested shadow array',d=>d.base.layers.$value[0]='{base.layers}'],
 ['array alias target',d=>{d.base.other=token('shadow',[layer]);d.base.layers.$value[0]='{base.other}';}],
 ['dangling alias',d=>d.base.chain.$value='{missing.token}'],
 ['alias type mismatch',d=>d.base.chain.$value='{base.number}'],
 ['indirect cycle',d=>d.base.nested.alias.$value='{base.chain}'],
 ['nested composite cycle',d=>d.base.shadow.$value.color='{base.shadow}'],
 ['unsupported type',d=>d.base.number.$type='gradient'],
 ['missing type',d=>delete d.base.number.$type],
 ['token child',d=>d.base.number.child=token('number',2)],
 ['invalid name',d=>d.base['invalid.name']=token('number',2)],
 ['unsupported reference',d=>d.base.dim.$value={$ref:'#/base/dim/$value'}],
 ['unsupported group extension',d=>d.base.$extends='{inherited}'],
 ['empty graph',d=>{delete d.base;delete d.inherited;}],
 ['malformed group',d=>d.base=null]
];
for(const [name,mutate] of cases){const d=structuredClone(valid);mutate(d);assert.equal(validateDtcgProfile(d).pass,false,name);}
const source=JSON.parse(await readFile(new URL('../../tokens/tokens.dtcg.json',import.meta.url),'utf8'));
const sourceReport=validateDtcgProfile(source);
await withBrowserFixture(async page=>{
 const origin=new URL(page.url()).origin;
 await page.goto(origin+'/_audit/dtcg-typing.html');
 await page.waitForFunction(()=>window.__dtcgtyping);
 assert.deepEqual(await page.evaluate(()=>window.__dtcgtyping.profile),sourceReport,'Browser and Node must report the same current source result');
 for(const [name,doc] of [['valid',valid],...cases.map(([name,mutate])=>{const d=structuredClone(valid);mutate(d);return[name,d];}).filter(([name])=>!['nonfinite number','infinite dimension'].includes(name))]){
  const report=validateDtcgProfile(doc);
  await page.route('**/tokens/tokens.dtcg.json',route=>route.fulfill({json:doc}));
  await page.route('**/tokens/provenance.json',route=>route.fulfill({json:{counts:{baseTokens:report.leaves,byType:report.counts}}}));
  await page.goto(origin+'/_audit/dtcg-typing.html');
  await page.waitForFunction(()=>window.__dtcgtyping);
  const verdict=await page.evaluate(()=>window.__dtcgtyping);
  assert.equal(verdict.pass,name==='valid',name+': '+JSON.stringify(verdict));
  await page.unroute('**/tokens/tokens.dtcg.json');await page.unroute('**/tokens/provenance.json');
 }
});
console.log(`PASS DTCG validator: valid typed/nested/inherited/composite fixtures and ${cases.length} invalid cases; real browser gate agrees. Current source: ${sourceReport.pass?'PASS':'FAIL'}, ${sourceReport.errors.length} errors across ${sourceReport.leaves} leaves.`);
