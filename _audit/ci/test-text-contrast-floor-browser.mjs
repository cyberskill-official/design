import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {textContrastFloor} from './lib/text-contrast-floor.mjs';
import {apca} from '../../scripts/lib/oklch.mjs';
const cases = [
  {id:'small-bold-brand',size:12,weight:700,fg:'#45210E',bg:'#F4BA17',floor:75,passes:false},
  {id:'large-bold-brand',size:24,weight:700,fg:'#45210E',bg:'#F4BA17',floor:60,passes:true},
  {id:'below-size-boundary',size:23.99,weight:700,fg:'#45210E',bg:'#F4BA17',floor:75,passes:false},
  {id:'below-weight-boundary',size:24,weight:699,fg:'#45210E',bg:'#F4BA17',floor:75,passes:false},
  {id:'large-regular-brand',size:32,weight:400,fg:'#45210E',bg:'#F4BA17',floor:75,passes:false},
  {id:'small-bold-dark-info',size:14,weight:700,fg:'#1A1108',bg:'#7CB2FB',floor:75,passes:false},
  {id:'small-bold-paper',size:12,weight:700,fg:'#1A1614',bg:'#FDE68A',floor:75,passes:true},
];
for (const browserName of ['chromium','firefox','webkit']) await withBrowserFixture(async page => {
  const measured=await page.evaluate(cases=>{
    const fixture=document.getElementById('fixture');
    return cases.map(sample=>{
      const el=document.createElement('span');el.textContent=sample.id;
      Object.assign(el.style,{fontSize:sample.size+'px',fontWeight:String(sample.weight),color:sample.fg,backgroundColor:sample.bg});
      fixture.append(el);const s=getComputedStyle(el);
      const hex=color=>'#'+color.match(/[\d.]+/g).slice(0,3).map(n=>Number(n).toString(16).padStart(2,'0')).join('');
      return {size:parseFloat(s.fontSize),weight:parseFloat(s.fontWeight),fg:hex(s.color),bg:hex(s.backgroundColor),visible:el.getClientRects().length>0};
    });
  },cases);
  for (let i=0;i<cases.length;i++) {
    const sample=cases[i],actual=measured[i];assert(actual.visible,sample.id);
    const floor=textContrastFloor(actual.size,actual.weight);
    assert.equal(floor,sample.floor,sample.id);
    assert.equal(apca(actual.fg,actual.bg)>=floor,sample.passes,sample.id);
  }
  console.log('PASS',browserName,cases.length,'actual styled contrast controls');
},{browserName});
for (const [size,weight] of [[NaN,700],[12,NaN],[Infinity,700],[12,Infinity],[0,700],[12,0]])
  assert.throws(()=>textContrastFloor(size,weight),/Invalid computed text metrics/);
