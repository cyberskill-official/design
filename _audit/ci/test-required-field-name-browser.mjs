import assert from 'node:assert/strict';import{withBrowserFixture}from'./lib/browser-fixture.mjs';
await withBrowserFixture(async page=>{
 for(const[lang,label,required]of[['en','City','required'],['vi','Thành phố','bắt buộc']]){
  await page.evaluate(({lang,label})=>renderFixture(React.createElement(CS.Form,{lang,rules:{city:'required'}},React.createElement(CS.FormField,{name:'city',label,lang,required:true},React.createElement(CS.Combobox,{options:[{label:"One",value:"one"}]})))),{lang,label});
  await page.getByRole('combobox',{name:label+' '+required,exact:true}).waitFor({timeout:3000});
  assert.equal(await page.getByRole('combobox',{name:label+required,exact:true}).count(),0);
 }
},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
console.log('PASS EN/VI real accessible names separate field label and required annotation without caller-label whitespace');
