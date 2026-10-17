import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url)).replace(/\/$/, '');
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{cwd:repo,stdio:'pipe'});
const report={scope:'Actual current browser bundle: Chart accessible names for four types and EN/VI data/empty/blank/explicit labels, live ancestor and explicit locale. Scoped role-img-alt checks only; not manual AT, all chart data or visible empty-state design.',rows:[],localeTransitions:[]};
const empty={en:'Chart with no data',vi:'Biểu đồ chưa có dữ liệu'};
for(const browserName of ['chromium','firefox','webkit']){
 await withBrowserFixture(async page=>{
  await page.addScriptTag({path:repo+'/node_modules/axe-core/axe.min.js'});
  for(const language of ['en','vi'])for(const type of ['bar','line','spark','pie'])for(const specimen of ['populated','empty','whitespace','named-empty']){
   const props={type,data:specimen.includes('empty')?[]:[{label:'A',value:1.5},{label:'B',value:2}]};
   if(specimen==='whitespace')props.label='   ';
   if(specimen==='named-empty')props.label=language==='vi'?'Tên biểu đồ cụ thể':'Specific chart name';
   await page.evaluate(({language,props})=>{document.documentElement.lang=language;renderFixture(React.createElement(CS.Chart,props));},{language,props});
   const expected=specimen==='named-empty'?props.label:specimen==='empty'?empty[language]:'A: 1.5, B: 2';
   assert.equal(await page.locator('.cs-chart').getAttribute('aria-label'),expected,`${browserName}/${language}/${type}/${specimen}`);
   assert.equal(await page.getByRole('img',{name:expected,exact:true}).count(),1);
   const axe=await page.evaluate(()=>window.axe.run(document.querySelector('#fixture'),{preload:false,runOnly:{type:'rule',values:['role-img-alt']}}));
   assert.deepEqual(axe.violations,[]);assert.deepEqual(axe.incomplete,[]);
   report.rows.push({browserName,language,type,specimen,accessibleName:expected,roleImgAltFailures:0});
  }
  for(const type of ['bar','line','spark','pie']){
   await page.evaluate(type=>{document.documentElement.lang='en';renderFixture(React.createElement('section',{lang:'vi',id:'chart-scope'},React.createElement(CS.Chart,{type,data:[]})));},type);
   await page.getByRole('img',{name:empty.vi,exact:true}).waitFor();
   await page.locator('#chart-scope').evaluate(el=>el.lang='en');await page.getByRole('img',{name:empty.en,exact:true}).waitFor();
   await page.evaluate(type=>renderFixture(React.createElement('section',{lang:'en',id:'chart-scope'},React.createElement(CS.Chart,{type,data:[],lang:'vi'}))),type);
   await page.getByRole('img',{name:empty.vi,exact:true}).waitFor();
   await page.locator('#chart-scope').evaluate(el=>el.lang='en-US');await page.getByRole('img',{name:empty.vi,exact:true}).waitFor();
   await page.evaluate(type=>renderFixture(React.createElement(CS.Chart,{type,data:[],lang:'vi',label:'   '})),type);
   await page.getByRole('img',{name:empty.vi,exact:true}).waitFor();
   await page.evaluate(type=>renderFixture(React.createElement(CS.Chart,{type,data:[{label:'Updated',value:3.25}],lang:'vi',label:'   '})),type);
   assert.equal(await page.getByRole('img',{name:'Updated: 3.25',exact:true}).count(),1);
   await page.evaluate(type=>renderFixture(React.createElement(CS.Chart,{type,data:[{label:'Updated',value:3.25}],lang:'vi',label:'  Exact override  '})),type);
   assert.equal(await page.locator('.cs-chart').getAttribute('aria-label'),'  Exact override  ','Nonblank caller label must remain unchanged');
   await page.evaluate(type=>renderFixture(React.createElement(CS.Chart,{type,data:[],lang:'en'})),type);
   await page.getByRole('img',{name:empty.en,exact:true}).waitFor();
   report.localeTransitions.push({browserName,type,ancestorVi:'pass',liveEn:'pass',explicitVi:'pass',explicitRemainsOnAncestorChange:'pass'});
  }
 },{browserName});
 console.log('PASS Chart accessible names',browserName,'32naming cases and4locale transition cases.');
}
assert.equal(report.rows.length,96);assert.equal(report.localeTransitions.length,12);
report.completedAt=new Date().toISOString();
if(process.env.CS_CHART_NAME_REPORT){
 const paths=['components/data/Chart.jsx','components/_i18n/strings.js','components/_i18n/i18n.js','_ds_bundle.js','_audit/ci/test-chart-name-browser.mjs','_audit/ci/lib/browser-fixture.mjs'];
 report.sourceFiles=Object.fromEntries(paths.map(p=>[p,createHash('sha256').update(readFileSync(repo+'/'+p)).digest('hex')]));
 writeFileSync(process.env.CS_CHART_NAME_REPORT,JSON.stringify(report,null,2)+'\n');
}
console.log('PASS Chart:96name cases and12live/explicit locale cases in three engines.');
