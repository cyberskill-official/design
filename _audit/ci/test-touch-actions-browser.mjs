import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
await withBrowserFixture(async page=>{
  await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
  const edgeTap=async(locator,side='left')=>{
    await locator.scrollIntoViewIfNeeded();
    const r=await locator.boundingBox();assert.ok(r.width>=44&&r.height>=44,JSON.stringify(r));
    const x=side==='left'?r.x+2:side==='right'?r.x+r.width-2:r.x+r.width/2;
    const y=side==='top'?r.y+2:side==='bottom'?r.y+r.height-2:r.y+r.height/2;
    const own=await locator.evaluate((el,{x,y})=>{const hit=document.elementFromPoint(x,y);return hit===el||el.contains(hit)},{x,y});
    assert.ok(own,'Expanded target edge must belong to the action, not a neighbor or clipped ancestor');
    await page.touchscreen.tap(x,y);
  };
  for(const width of [320,390,1280])for(const density of ['comfortable','compact']) {
    await page.setViewportSize({width,height:900});
    await page.evaluate(density=>{
      const h=React.createElement;renderFixture(null);window.touchResults=[];
      renderFixture(h('main',{'data-cs-density':density,style:{padding:12,display:'grid',gap:16}},
        h(CS.Calendar,{value:new Date(2026,6,18),onChange:d=>touchResults.push(['date',d.getDate()])}),
        h(CS.Carousel,{label:'Slides'},...['A','B','C'].map(text=>h(CS.Button,{onClick:()=>touchResults.push(['slide',text])},text))),
        h(CS.Rating,{defaultValue:0,onChange:n=>touchResults.push(['rating',n])}),
        h(CS.TagInput,{label:'Tags',defaultValue:['one','two'],onChange:tags=>touchResults.push(['tags',tags])}),
        h(CS.NumberField,{label:'Number',value:1,onChange:n=>touchResults.push(['number',n])}),
        h(CS.Toolbar,{label:'Tools',items:[{label:'One',onSelect:()=>touchResults.push(['tool',1])},{label:'Two',onSelect:()=>touchResults.push(['tool',2])}]})));
    },density);
    await page.evaluate(()=>document.fonts.ready);
    // Consecutive day controls stay separate even when a narrow calendar scrolls.
    for(const day of ['1','2','7'])await edgeTap(page.locator('.cs-cal__grid button').filter({hasText:new RegExp('^'+day+'$')}),'right');
    assert.deepEqual(await page.evaluate(()=>touchResults),[['date',1],['date',2],['date',7]]);
    const dots=page.locator('.cs-carousel__dots button');
    await edgeTap(dots.nth(1),'right');assert.equal(await dots.nth(1).getAttribute('aria-current'),'true');
    await edgeTap(dots.nth(2),'left');assert.equal(await dots.nth(2).getAttribute('aria-current'),'true');
    await edgeTap(page.locator('.cs-carousel__nav.prev'),'top');assert.equal(await dots.nth(1).getAttribute('aria-current'),'true');
    await edgeTap(page.locator('.cs-carousel__nav.next'),'bottom');assert.equal(await dots.nth(2).getAttribute('aria-current'),'true');
    await edgeTap(page.locator('.cs-carousel__slide[aria-hidden="false"] button'),'left');
    assert.deepEqual(await page.evaluate(()=>touchResults.filter(x=>x[0]==='slide')),[['slide','C']]);
    assert.equal(await page.locator('.cs-carousel__view').evaluate(el=>{const r=el.getBoundingClientRect();return document.elementsFromPoint(r.right-20,r.top+3).some(node=>node.closest('.cs-carousel__slide[aria-hidden="true"]'))}),false,'Inactive slide paint must not leak into reserved navigation space');
    const stars=page.locator('.cs-rating button');
    await edgeTap(stars.nth(0),'right');await edgeTap(stars.nth(1),'left');
    assert.deepEqual(await page.evaluate(()=>touchResults.filter(x=>x[0]==='rating')),[['rating',1],['rating',2]]);
    await stars.nth(1).focus();await page.keyboard.press('ArrowRight');
    assert.equal(await stars.nth(2).getAttribute('aria-checked'),'true');
    assert.equal(await stars.nth(2).evaluate(el=>el===document.activeElement),true);
    await edgeTap(page.locator('.cs-tag__close').first(),'right');
    assert.deepEqual(await page.evaluate(()=>touchResults.filter(x=>x[0]==='tags')),[['tags',['two']]]);
    await edgeTap(page.locator('.cs-stepper button').last(),'right');
    assert.deepEqual(await page.evaluate(()=>touchResults.filter(x=>x[0]==='number')),[['number',2]]);
    const tools=page.locator('.cs-toolbar__btn');await edgeTap(tools.nth(0),'right');await edgeTap(tools.nth(1),'left');
    assert.deepEqual(await page.evaluate(()=>touchResults.filter(x=>x[0]==='tool')),[['tool',1],['tool',2]]);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Narrow viewport must not gain page-level horizontal overflow');
  }
},{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
console.log('PASS coarse-pointer actions: real edge taps on calendar days, carousel navigation/dots, rating, tag removal, number stepper and toolbar; adjacent actions, keyboard rating and narrow overflow.');
