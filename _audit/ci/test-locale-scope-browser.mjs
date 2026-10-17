import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {strings} from '../../components/_i18n/strings.js';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {stdio:'pipe'});
await withBrowserFixture(async page=>{
  for (const propLang of [undefined,null,'','   ','en','en-US','vi-VN','fr-FR']) {
    await page.evaluate(propLang=>{
      document.documentElement.lang='vi';
      window.drawLocale=(lang=propLang)=>renderFixture(React.createElement('div',{lang:'en',id:'outer-scope'},
        React.createElement('div',{lang:'vi',id:'inner-scope'},React.createElement(CS.CitationList,{key:String(propLang),lang,items:[]}))));
      drawLocale();
    },propLang);
    const inherited = propLang == null || !propLang.trim();
    const explicitVi = propLang === 'vi-VN';
    assert.equal(await page.locator('.cs-citations__label').textContent(),inherited || explicitVi ? strings.CitationList.vi.sources : strings.CitationList.en.sources,`${String(propLang)}: initial nearest scope or explicit locale`);
    await page.locator('#inner-scope').evaluate(element=>element.lang='en');
    const expected=explicitVi?strings.CitationList.vi.sources:strings.CitationList.en.sources;
    try {
      await page.waitForFunction(expected=>document.querySelector('.cs-citations__label')?.textContent===expected,expected,{timeout:2000});
    } catch (error) {
      throw new Error(`lang=${JSON.stringify(propLang)}: expected ${expected}, saw ${await page.locator('.cs-citations__label').textContent()} after ancestor changed to en`, {cause:error});
    }

    assert.equal(await page.locator('.cs-citations__label').textContent(),expected,`${String(propLang)}: live ancestor change`);
    await page.locator('#inner-scope').evaluate(element=>element.removeAttribute('lang'));
    await page.locator('#outer-scope').evaluate(element=>element.lang='vi');
    const afterRemoval=inherited || explicitVi ? strings.CitationList.vi.sources : strings.CitationList.en.sources;
    await page.waitForFunction(expected=>document.querySelector('.cs-citations__label')?.textContent===expected,afterRemoval,{timeout:2000});
    await page.evaluate(()=>{
      document.getElementById('outer-scope').removeAttribute('lang');
      document.documentElement.lang='en';
    });
    await page.waitForFunction(expected=>document.querySelector('.cs-citations__label')?.textContent===expected,expected,{timeout:2000});
    await page.evaluate(()=>document.documentElement.removeAttribute('lang'));
    await page.waitForFunction(expected=>document.querySelector('.cs-citations__label')?.textContent===expected,afterRemoval,{timeout:2000});
  }
  const delayed=[
    ['Dialog','.cs-dialog__header button','aria-label',strings.Dialog.en.close,strings.Dialog.vi.close],
    ['Drawer','.cs-drawer__close','aria-label',strings.Drawer.en.close,strings.Drawer.vi.close],
    ['AlertDialog','.cs-alert-dialog__confirm',null,strings.AlertDialog.en.confirm,strings.AlertDialog.vi.confirm],
    ['CommandPalette','.cs-cmdk__search input','placeholder',strings.CommandPalette.en.placeholder,strings.CommandPalette.vi.placeholder],
    ['Tour','.cs-tour__btns button',null,strings.Tour.en.skip,strings.Tour.vi.skip],
  ];
  for (const [name,selector,attribute,en,vi] of delayed) {
    await page.evaluate(name=>{
      document.documentElement.lang='vi';
      window.drawDelayed=(open,lang)=>renderFixture(React.createElement('section',{id:'delayed-scope',lang:'en'},
        React.createElement(CS[name],{key:name,open,lang,title:'Caller title',onClose:()=>{},steps:[{target:'#missing',title:'Caller step'}]})));
      drawDelayed(false);
    },name);
    assert.equal(await page.locator(selector).count(),0,name+': initially absent root/content');
    await page.evaluate(()=>drawDelayed(true));
    const label=()=>attribute?page.locator(selector).first().getAttribute(attribute):page.locator(selector).first().textContent();
    assert.equal(await label(),en,name+': delayed mount inherits scope');
    await page.locator('#delayed-scope').evaluate(element=>element.lang='vi');
    await page.waitForFunction(({selector,attribute,vi})=>{
      const element=document.querySelector(selector);return (attribute?element?.getAttribute(attribute):element?.textContent)===vi;
    },{selector,attribute,vi},{timeout:2000});
    await page.evaluate(()=>drawDelayed(false));
    await page.evaluate(()=>drawDelayed(true,'en'));
    assert.equal(await label(),en,name+': reopen explicit override');
    await page.evaluate(()=>renderFixture(null));
  }
  await page.evaluate(()=>{
    document.documentElement.lang='vi';
    const host=document.createElement('div');host.id='locale-portal';host.lang='en';document.body.append(host);
    renderFixture(React.createElement('div',{lang:'vi'},ReactDOM.createPortal(React.createElement(CS.CitationList,{items:[]}),host)));
  });
  assert.equal(await page.locator('.cs-citations__label').textContent(),strings.CitationList.en.sources,'Portal inherits destination DOM language');
  await page.locator('#locale-portal').evaluate(element=>element.lang='vi');
  await page.waitForFunction(expected=>document.querySelector('.cs-citations__label')?.textContent===expected,strings.CitationList.vi.sources,{timeout:2000});
  await page.evaluate(()=>{renderFixture(null);document.getElementById('locale-portal').remove()});
}, {browserName:process.env.CS_TEST_BROWSER || 'chromium',development:true});
console.log('PASS locale scope: empty/explicit/unsupported props, nearest scope, attribute removal, document/default fallback, five delayed roots and live portal language');
