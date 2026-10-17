import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_BROWSER||'chromium',rows=[];
await withBrowserFixture(async page=>{
  await page.addScriptTag({url:new URL('/image-slot.js',page.url()).href});
  for(const language of ['en','vi'])for(const width of [390,768,1280]){
    await page.setViewportSize({width,height:900});
    await page.evaluate(language=>{
      delete window.__dcSetProps;
      document.querySelector('#fixture').innerHTML='<style>#resize-hero{position:relative;padding:40px 20px 36px}#resize-hero:has(>image-slot[data-authoring]:not([data-filled])){padding-bottom:112px}#resize-hero>image-slot{position:absolute;inset:0}</style><div id="resize-hero"><image-slot id="resize-test-slot" shape="rect"></image-slot><p style="position:relative;pointer-events:none;margin:0">A hero whose authoring hint changes its height.</p></div>';
      document.querySelector('image-slot').setAttribute('lang',language);
      // The DC host becomes available after the element's first render.
      window.__dcSetProps=()=>{};
    },language);
    await page.waitForFunction(()=>document.querySelector('image-slot').hasAttribute('data-authoring'));
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
    const empty=await page.locator('image-slot').evaluate(el=>({height:el.getBoundingClientRect().height,parentHeight:el.parentElement.getBoundingClientRect().height,caption:el.shadowRoot.querySelector('.cap').textContent}));
    assert.equal(empty.height,empty.parentHeight);assert(empty.height>150);assert.equal(empty.caption,language==='vi'?'Thả ảnh (không bắt buộc)':'Drop an image');
    await page.locator('image-slot').evaluate(el=>{const canvas=document.createElement('canvas');canvas.width=700;canvas.height=400;canvas.getContext('2d').fillRect(0,0,700,400);el.setAttribute('src',canvas.toDataURL());});
    await page.waitForFunction(()=>{const el=document.querySelector('image-slot'),img=el.shadowRoot.querySelector('.frame img');return el.hasAttribute('data-filled')&&img.complete&&img.naturalWidth===700;});
    const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
    const geometry=()=>page.locator('image-slot').evaluate(el=>{const image=el.shadowRoot.querySelector('.frame img'),frame=el.getBoundingClientRect(),paint=image.getBoundingClientRect();return{frame:{width:frame.width,height:frame.height},image:{width:paint.width,height:paint.height},filled:el.hasAttribute('data-filled')};});
    await settle();const initial=await geometry();
    await page.locator('#resize-hero').evaluate(el=>el.style.width='50%');await settle();const narrow=await geometry();
    await page.locator('#resize-hero').evaluate(el=>el.style.width='');await settle();const restored=await geometry();
    assert(narrow.frame.width<initial.frame.width);assert(restored.filled);assert.deepEqual(restored,initial);
    for(const state of [initial,narrow,restored]){assert(Math.abs(state.image.width/state.image.height-700/400)<.02);assert(state.image.width+.5>=state.frame.width&&state.image.height+.5>=state.frame.height);}
    // Removal and reconnection must retain the loaded image and observe its
    // new frame without a pending render acting on a disconnected element.
    await page.locator('#resize-hero').evaluate(el=>{const slot=el.querySelector('image-slot');el.style.width='60%';slot.remove();el.append(slot);});await settle();const reconnected=await geometry();assert(reconnected.filled);assert(reconnected.frame.width<initial.frame.width);assert(Math.abs(reconnected.image.width/reconnected.image.height-700/400)<.02);
    rows.push({language,width,empty,initial,narrow,restored,reconnected});
  }
},{browserName});
console.log('PASS image-slot resize',browserName,rows.length,'late authoring, filled crop resize and reconnection contexts');
