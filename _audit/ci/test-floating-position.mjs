import assert from 'node:assert/strict';
import {floatingPosition} from '../../components/_utils/floating-position.js';
const viewport={left:8,top:8,right:792,bottom:592};
const anchor={left:300,top:250,right:400,bottom:294,width:100,height:44};const panel={width:120,height:80};
for(const side of['top','bottom','left','right'])for(const suffix of['','-start','-end']){
 const placement=side+suffix;const result=floatingPosition(anchor,panel,viewport,placement,8);
 assert.equal(result.placement,placement,'ample space preserves preferred side');
 if(side==='top')assert.equal(result.top+panel.height,anchor.top-8);
 if(side==='bottom')assert.equal(result.top,anchor.bottom+8);
 if(side==='left')assert.equal(result.left+panel.width,anchor.left-8);
 if(side==='right')assert.equal(result.left,anchor.right+8);
 assert.ok(result.left>=viewport.left&&result.left+panel.width<=viewport.right);
 assert.ok(result.top>=viewport.top&&result.top+panel.height<=viewport.bottom);
}
const edge={left:730,top:540,right:780,bottom:584,width:50,height:44};
const flip=floatingPosition(edge,panel,viewport,'bottom-start',8);assert.equal(flip.placement,'top-start');assert.equal(flip.left,672);assert.equal(flip.top,452);
const rtl=floatingPosition(anchor,panel,viewport,'bottom-start',8,'rtl');assert.equal(rtl.left,280);
assert.equal(floatingPosition(anchor,panel,viewport,'left',8,'rtl').left,172,'left stays physical in RTL');
const small=floatingPosition(anchor,{width:900,height:900},viewport,'right-start',8);assert.ok(small.maxWidth<=viewport.right-anchor.right-8);assert.equal(small.maxHeight,584);
assert.throws(()=>floatingPosition(anchor,panel,viewport,'unknown'),/Unsupported floating placement/);
console.log('PASS floating geometry: all12 placements, preferred sides, flip/shift, bounded size, RTL alignment and invalid input');
