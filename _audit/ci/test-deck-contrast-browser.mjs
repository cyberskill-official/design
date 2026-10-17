import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.route('**/_ds_manifest.json', route => route.fulfill({ json: { templates: [] } }));
  await page.goto(`${origin}/_audit/theme-overflow.html`);
  await page.waitForFunction(() => window.__theme);
  const result = await page.evaluate(async () => {
    const results = [];
    for (const path of ['bod-deck/BodDeck', 'sales-proposal-deck/SalesProposalDeck']) {
      const f = document.createElement('iframe');
      f.style.cssText = 'width:1280px;height:900px;border:0';
      const loaded = new Promise(resolve => { f.onload = resolve; });
      f.src = '/templates/' + path + '.dc.html'; document.body.append(f);
      await loaded;
      const doc = f.contentDocument, win = f.contentWindow;
      for(let i=0;i<100 && !win.__dcRootName?.();i++) await wait(100);
      if(!win.__dcRootName?.()) throw new Error('Deck bootstrap failed: '+path);
      await doc.fonts.ready;
      const animation = doc.createElement('style');
      animation.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}';
      doc.head.append(animation);
      const props = JSON.parse(doc.querySelector('script[data-props]').getAttribute('data-props'));
      for (const element of props.element.options) for (const theme of ['light', 'dark']) for (const language of props.language.options) {
        win.__dcSetProps(win.__dcRootName(), { element, theme, language });
        await wait(60);
        const surface=doc.querySelector('.cs-canvas-desk');
        const index=props.element.options.indexOf(element);
        const expectedElement=['tho','hoa','thuy','moc','kim'][Math.floor(index/3)];
        const expectedVariant=index%3===0?'':element.split(' · ')[1];
        if(surface.getAttribute('data-theme')!==(theme==='dark'?'dark':'') ||
          surface.lang!==(language==='English'?'en':'vi') ||
          surface.getAttribute('data-cs-element')!==expectedElement ||
          surface.getAttribute('data-cs-variant')!==expectedVariant) throw new Error('Deck axis update did not render: '+[path,element,theme,language].join(' / '));
        const m = measure(doc, { allThemes: true });
        const texts = path.startsWith('bod-deck') ? ['1.','2.',language==='English'?'19mo':'19 tháng'] : [];
        const targets = texts.map(text => {
          const nodes=[...surface.querySelectorAll('*')].filter(node=>!node.children.length&&node.textContent.trim()===text);
          if(nodes.length!==1)throw Error('Missing or ambiguous original contrast node: '+text);
          return nodes[0];
        });
        if(!texts.length){
          const nodes=[...surface.querySelectorAll('h2')].filter(node=>parseFloat(win.getComputedStyle(node).fontSize)===50);
          if(nodes.length!==1)throw Error('Missing or ambiguous Sales closing heading');
          targets.push(nodes[0]);
        }
        const originals=targets.map(node=>{
          const css=win.getComputedStyle(node),bg=resolveBg(node,win),fg=parseColor(css.color,doc);
          if(!node.getClientRects().length||!bg.color||bg.img||!fg)throw Error('Original contrast node must remain visible and measurable');
          const size=parseFloat(css.fontSize),weight=parseInt(css.fontWeight)||400;
          const need=size>=24||(size>=18.66&&weight>=700)?3:4.5;
          return {text:node.textContent.trim(),size,weight,foreground:css.color,background:bg.color,ratio:contrast(fg.a<0.999?composite(fg,bg.color):fg,bg.color),need};
        });
        results.push({ path, element, theme, language, checked: m.checked, error: m.error, failN: m.failN, fails: m.fails, originals });
      }
      f.remove();
    }
    return results;
  });
  assert.equal(result.length, 120);
  assert.ok(result.every(r => r.checked > 0 && !r.error));
  assert.equal(result.flatMap(r=>r.originals).length,240,'All four original nodes must be measured in every supported combination');
  assert.ok(result.every(row=>row.originals.every(node=>node.ratio>=node.need)),'Original failures must meet their own size/weight threshold, not disappear from coverage');
  const output=process.argv.find(arg=>arg.startsWith('--evidence='))?.slice(11);
  if(output)writeFileSync(output,JSON.stringify({metric:'WCAG contrast ratio; APCA and human brand acceptance are separate',cases:result},null,2)+'\n');
  const failures = result.filter(r => r.failN);
  if (failures.length) console.log(JSON.stringify(failures));
  assert.equal(failures.length, 0, 'All two-deck element/theme/language combinations must pass the measured contrast contract; details logged above');
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS deck contrast: 2 decks × 15 element variants × light/dark × EN/VI (120 combinations)');
