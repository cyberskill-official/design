import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {stdio:'pipe'});
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const results = [];
await withBrowserFixture(async page => {
  for (const lang of ['en','vi']) for (const kind of ['string','zero','nested','fragment','array','component']) {
    await page.evaluate(({lang,kind}) => {
      renderFixture(null);
      localStorage.clear();
      const h = React.createElement;
      const Label = () => h('span',null,'Model ',h('em',null,'confidence'));
      const Rich = ({text}) => h('span',null,text.split(' ')[0] + ' ',h('em',null,text.split(' ').slice(1).join(' ')));
      const content = text => kind === 'string' ? text : kind === 'zero' ? 0 :
        kind === 'nested' ? h(Rich,{text}) : kind === 'fragment' ? h(React.Fragment,null,text) :
        kind === 'array' ? [text.split(' ')[0], ' ', text.split(' ').slice(1).join(' ')] :
        text === 'Model confidence' ? h(Label) : h(Rich,{text});
      const columns = [{key:'revenue',header:content('Revenue total'),sortable:true},{key:'cost',header:content('Cost total')}];
      window.drawNames = delta => renderFixture(h('main',null,
        h(CS.ConfidenceMeter,{value:0.82,label:content('Model confidence'),lang,...delta}),
        h(CS.ConfidenceMeter,{value:0.1,label:content('Model confidence'),lang}),
        h(CS.DataGrid,{columns,rows:[{id:1,revenue:12,cost:4}],persistKey:'rich-names-'+kind,lang}),
        h(CS.DataGrid,{columns,rows:[{id:2,revenue:6,cost:2}],persistKey:'rich-names-second-'+kind,lang})));
      window.drawNames();
    }, {lang,kind});
    const label = kind === 'zero' ? '0' : 'Model confidence';
    const high = lang === 'en' ? 'High' : 'Cao', low = lang === 'en' ? 'Low' : 'Thấp';
    const prefix = lang === 'en' ? 'Pin column' : 'Ghim cột';
    assert.equal(await page.getByRole('meter',{name:label+' '+high,exact:true}).count(),1);
    assert.equal(await page.getByRole('meter',{name:label+' '+low,exact:true}).count(),1);
    for (const name of kind === 'zero' ? ['0'] : ['Revenue total','Cost total']) {
      assert.equal(await page.getByRole('button',{name:prefix+' '+name,exact:true}).count(),kind === 'zero' ? 4 : 2);
    }
    const relation = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('[aria-labelledby]')];
      const ids = [...document.querySelectorAll('[id]')].map(el=>el.id);
      return {duplicates:ids.filter((id,index)=>ids.indexOf(id)!==index),dangling:nodes.flatMap(el=>el.getAttribute('aria-labelledby').split(/\s+/).filter(id=>!document.getElementById(id)))};
    });
    assert.deepEqual(relation,{duplicates:[],dangling:[]});
    const grid = page.locator('.cs-datagrid').first();
    const costPin = grid.getByRole('button',{name:prefix+' '+(kind === 'zero' ? '0' : 'Cost total'),exact:true}).last();
    await costPin.click();
    assert.deepEqual(await page.evaluate(kind=>JSON.parse(localStorage.getItem('cs:datagrid:cols:rich-names-'+kind)),kind),['cost','revenue']);
    assert.equal(await grid.locator('thead th').first().locator('.cs-datagrid__pin').getAttribute('aria-labelledby') !== null,true);
    if (kind !== 'zero') assert.equal(await grid.getByRole('button',{name:prefix+' Cost total',exact:true}).count(),1);
    await page.evaluate(() => drawNames({label:React.createElement('strong',null,'Updated confidence'),lang:'vi',value:0.5}));
    assert.equal(await page.getByRole('meter',{name:'Updated confidence Trung bình',exact:true}).count(),1);
    results.push({lang,kind,multipleInstances:'pass',pinAction:'pass',labelAndLocaleUpdate:'pass'});
  }
  for (const lang of ['en','vi']) {
    await page.evaluate(lang => renderFixture(React.createElement(CS.DataGrid,{columns:[{key:'missing',header:null}],rows:[],persistKey:'null-header',lang})),lang);
    assert.equal(await page.getByRole('button',{name:(lang==='en'?'Pin column':'Ghim cột')+' missing',exact:true}).count(),1);
    await page.evaluate(lang => renderFixture(React.createElement(CS.ConfidenceMeter,{value:0.82,lang})),lang);
    assert.equal(await page.getByRole('meter',{name:lang==='en'?'Confidence High':'Độ tin cậy Cao',exact:true}).count(),1);
  }
}, {browserName});
const output = process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
if (output) writeFileSync(output,JSON.stringify({browserName,scope:'Two declared ReactNode naming contracts; six content shapes, EN/VI, two instances, real pin activation, dynamic label/language and missing-header/default-label fallbacks. Not whole-system or AT acceptance.',cases:results},null,2)+'\n');
console.log(`PASS ${browserName}: rich ConfidenceMeter and DataGrid pin names; 12 content/locale cases, unique references, dynamic updates and real pin actions.`);
