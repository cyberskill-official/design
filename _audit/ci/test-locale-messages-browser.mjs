import assert from 'node:assert/strict';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
 const warnings=[];page.on('console',message=>{if(message.type()==='error')warnings.push(message.text())});
 await page.evaluate(()=>{
  window.AppCopy=({lang='fr'})=>{const t=CS.useMessages('Checkout',lang);return React.createElement('p',{'data-app-copy':true},t('pay')+'|'+t('missing'))};
  window.drawMessages=(next='Custom next',nested=true)=>renderFixture(React.createElement(React.StrictMode,null,
   React.createElement(CS.LocaleProvider,{messages:{Pagination:{en:{next},fr:{next:'Suivant'}},Checkout:{fr:{pay:'Payer'},en:{pay:'Pay'}}}},
    React.createElement('section',{id:'parent'},React.createElement(CS.Pagination,{lang:'en',pageCount:10}),React.createElement(AppCopy)),
    nested?React.createElement(CS.LocaleProvider,{messages:{Pagination:{en:{next:'Nested next'}},Checkout:{en:{pay:'Nested pay'}}}},
     React.createElement('section',{id:'nested'},React.createElement(CS.Pagination,{lang:'en',pageCount:10}),React.createElement(AppCopy))):null,
    React.createElement('section',{id:'unknown'},React.createElement(CS.Pagination,{lang:'fr-FR',pageCount:10}))),
   React.createElement('section',{id:'sibling'},React.createElement(CS.Pagination,{lang:'en',pageCount:10}))));
  drawMessages();
 });
 const next=id=>page.locator('#'+id+' button').last().getAttribute('aria-label');
 assert.equal(await next('parent'),'Custom next');assert.equal(await next('nested'),'Nested next');assert.equal(await next('unknown'),'Suivant');assert.equal(await next('sibling'),'Next page');
 assert.equal(await page.locator('#parent [data-app-copy]').textContent(),'Payer|missing');assert.equal(await page.locator('#nested [data-app-copy]').textContent(),'Payer|missing');
 await page.evaluate(()=>drawMessages('Updated next',false));assert.equal(await next('parent'),'Updated next');assert.equal(await page.locator('#nested').count(),0);assert.equal(await next('sibling'),'Next page');
 await page.evaluate(()=>{
  window.callerMessages={Pagination:{en:{next:'Snapshot next'}}};
  window.drawSnapshot=()=>renderFixture(React.createElement(CS.LocaleProvider,{messages:callerMessages},React.createElement(CS.Pagination,{lang:'en',pageCount:10})));
  drawSnapshot();callerMessages.Pagination.en.next='Caller mutation';drawSnapshot();
 });
 assert.equal(await page.locator('.cs-pagination button').last().getAttribute('aria-label'),'Snapshot next');
 await page.evaluate(()=>{callerMessages={Pagination:{en:{next:'New identity'}}};drawSnapshot()});
 assert.equal(await page.locator('.cs-pagination button').last().getAttribute('aria-label'),'New identity');
 // Component selection remains DOM-scoped; the provider only carries dictionaries.
 await page.evaluate(()=>renderFixture(React.createElement('div',{id:'lang-scope',lang:'en'},React.createElement(CS.LocaleProvider,{messages:{Pagination:{en:{next:'Scoped EN'},vi:{next:'Scoped VI'}}}},React.createElement(CS.Pagination,{pageCount:10})))));
 assert.equal(await page.locator('.cs-pagination button').last().getAttribute('aria-label'),'Scoped EN');
 await page.locator('#lang-scope').evaluate(el=>el.lang='vi');await page.waitForFunction(()=>document.querySelector('.cs-pagination button:last-child')?.getAttribute('aria-label')==='Scoped VI');
 // Invalid dictionary rejection can be caught by an ordinary consumer error boundary.
 await page.evaluate(()=>{
  window.getterCalls=0;const bad={};Object.defineProperty(bad,'X',{get(){getterCalls++;return {en:{x:'unsafe'}}}});
  class Boundary extends React.Component {constructor(p){super(p);this.state={error:false}}static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?React.createElement('p',{id:'caught'},'Invalid messages'):this.props.children}}
  renderFixture(React.createElement(Boundary,null,React.createElement(CS.LocaleProvider,{messages:bad},React.createElement(AppCopy))));
 });
 assert.equal(await page.locator('#caught').textContent(),'Invalid messages');assert.equal(await page.evaluate(()=>getterCalls),0);
 await page.evaluate(()=>renderFixture(React.createElement(CS.Pagination,{lang:'en',pageCount:10})));
 assert.equal(await page.locator('.cs-pagination button').last().getAttribute('aria-label'),'Next page','unmount restores built-in copy');
 assert(warnings.every(message=>/Message accessors|above error|error occurred|error boundary/i.test(message)),warnings.join('\n'));
},{browserName:process.env.CS_TEST_BROWSER||'chromium',development:true});
console.log('PASS scoped messages browser: built-ins/application namespaces, nesting/siblings, dynamic updates, immutable snapshots, DOM lang, error recovery and unmount');
