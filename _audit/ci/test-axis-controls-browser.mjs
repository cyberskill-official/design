import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const preview=(await build({
  stdin:{contents:"import preview from './.storybook/preview.jsx'; window.axisPreview=preview;",resolveDir:process.cwd()},
  bundle:true,write:false,platform:'browser',format:'iife',jsx:'automatic',
  plugins:[{name:'fixture-css',setup(build){build.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}))}}],
})).outputFiles[0].text;
const failures=[];
await withBrowserFixture(async page=>{
  await page.emulateMedia({colorScheme:'light',contrast:'more'});
  await page.addScriptTag({content:preview});
  await page.evaluate(()=>{
    window.drawAxes=(contrast,theme='light',density='comfortable')=>renderFixture(axisPreview.decorators[0](
      ()=>React.createElement('span',null,'Caller story'),
      {globals:{theme,element:'tho|',language:'vi',style:'liquid-glass',density,contrast},parameters:{}}
    ));
    const host=document.getElementById('fixture');
    host.setAttribute('data-theme','dark');host.setAttribute('data-cs-density','compact');
    drawAxes('high','dark','compact');drawAxes('standard');
  });
  const story=await page.evaluate(()=>({
    theme:document.querySelector('#fixture > div').getAttribute('data-theme'),
    density:document.querySelector('#fixture > div').getAttribute('data-cs-density'),
    space:getComputedStyle(document.querySelector('#fixture > div')).getPropertyValue('--cs-density-space-1').trim(),
    root:document.documentElement.getAttribute('data-cs-contrast'),
    scope:document.querySelector('#fixture > div').getAttribute('data-cs-contrast'),
    muted:getComputedStyle(document.querySelector('#fixture > div')).getPropertyValue('--cs-color-text-muted').trim().toLowerCase(),
  }));
  if(story.theme!=='light'||story.density!=='comfortable'||story.space!=='4px'||story.root!=='standard'||story.scope!=='standard'||story.muted!=='#3f2d21')failures.push({surface:'Storybook explicit Standard under OS more',...story});
  for (const [language, labels] of [
    ['vi', {theme: 'Chế độ nền', density: 'Mật độ', contrast: 'Tương phản'}],
    ['en', {theme: 'Theme', density: 'Density', contrast: 'Contrast'}],
  ]) {
    await page.goto(new URL('/guidelines/atomic-view.html?language=' + language, page.url()).href);
    await page.waitForFunction(language => window.CS_GuidelinesLanguage?.status.ready &&
      document.documentElement.lang === language, language);
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-cs-density', 'compact');
    });
    const select = name => page.locator('.toolbar label').filter({hasText: name}).locator('select');
    await select(labels.theme).selectOption('dark');
    await select(labels.theme).selectOption('light');
    await select(labels.density).selectOption('compact');
    await select(labels.density).selectOption('comfortable');
    await select(labels.contrast).selectOption('high');
    await select(labels.contrast).selectOption('standard');
    const atomic = await page.locator('#canvas').evaluate(el => ({
      theme: el.getAttribute('data-theme'), density: el.getAttribute('data-cs-density'),
      space: getComputedStyle(el).getPropertyValue('--cs-density-space-1').trim(),
      scope: el.getAttribute('data-cs-contrast'),
      muted: getComputedStyle(el).getPropertyValue('--cs-color-text-muted').trim().toLowerCase(),
    }));
    if (atomic.theme !== 'light' || atomic.density !== 'comfortable' || atomic.space !== '4px' ||
        atomic.scope !== 'standard' || atomic.muted !== '#3f2d21')
      failures.push({surface: 'Atomic View explicit Standard under OS more', language, ...atomic});
  }
  const artifact=await page.evaluate(()=>{
    const iframe=document.createElement('iframe');document.body.append(iframe);
    applyAxis(iframe,{theme:'light',density:'comfortable',contrast:'standard',style:'liquid-glass',elm:'tho',elv:'',lang:'vi'});
    const root=iframe.contentDocument.documentElement;
    const result=Object.fromEntries(['data-theme','data-cs-density','data-cs-contrast'].map(name=>[name,root.getAttribute(name)]));iframe.remove();return result;
  });
  assert.deepEqual(artifact,{'data-theme':'light','data-cs-density':'comfortable','data-cs-contrast':'standard'},'Embedded artifact receives explicit reset axes');
},{browserName:process.env.CS_TEST_BROWSER||'chromium',development:true});
assert.deepEqual(failures,[],'Selected Standard must override OS high contrast in both authoring surfaces');
console.log('PASS axis controls: Storybook and Atomic View explicit light/comfortable/standard resets, OS contrast opt-out and embedded artifact axes');
