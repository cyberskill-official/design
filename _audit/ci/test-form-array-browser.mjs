import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
await withBrowserFixture(async page=>{
  for(const kind of ['Form','FormWizard']) {
  await page.evaluate(kind=>{
    window.removers=[];window.submitted=[];
    const array=React.createElement(CS.FormFieldArray,{name:'rows',min:1,max:3,lang:'en',defaultItem:{name:'New'}},({index,item,remove})=>{
        removers[index]=remove;return React.createElement('span',null,item.name);
      });
    const initialValues={rows:[{name:'A'},{name:'B'},{name:'C'}]};
    const save=v=>{submitted.push(v)};
    renderFixture(kind==='Form'?React.createElement(CS.Form,{key:kind,lang:'en',initialValues,onSubmit:save},array):React.createElement(CS.FormWizard,{key:kind,lang:'en',initialValues,onComplete:save,steps:[{title:'Rows',render:()=>array}]}));
    window.submitArray=()=>kind==='Form'?document.querySelector('form').requestSubmit():document.querySelector('.cs-form-wizard__nav button:last-child').click();
  },kind);
  const rows=page.locator('.cs-form-array__row');
  await page.evaluate(()=>{
    window.oldRemovers=[...removers];ReactDOM.flushSync(()=>{oldRemovers[0]();oldRemovers[1]()});
  });
  assert.deepEqual(await rows.allTextContents(),['C'],'batched removal must not resurrect earlier removed rows');
  await page.evaluate(()=>ReactDOM.flushSync(()=>{oldRemovers[0]();oldRemovers[2]()} ));
  assert.deepEqual(await rows.allTextContents(),['C'],'stale callback and minimum must preserve remaining row');
  await page.getByRole('button',{name:'Add row',exact:true}).click();
  assert.deepEqual(await rows.allTextContents(),['C','New']);
  await page.evaluate(()=>ReactDOM.flushSync(()=>oldRemovers[0]()));
  assert.deepEqual(await rows.allTextContents(),['C','New'],'removed row callback must not delete a different row');
  await page.getByRole('button',{name:'Add row',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Add row',exact:true}).isDisabled(),true);
  await page.evaluate(()=>submitArray());
  await page.waitForFunction(()=>submitted.length===1);
  assert.deepEqual(await page.evaluate(()=>submitted[0].rows),[{name:'C'},{name:'New'},{name:'New'}]);
  console.log('PASS '+kind+' FormFieldArray: batched removal, no resurrection, stale callback safety, min/max and submitted array');
  }
  for (const kind of ['Form','FormWizard']) {
    await page.evaluate(kind=>{
      const e=React.createElement;window.savedRows=[];
      function StatefulRow({item,index,remove,path}) {
        const [seed]=React.useState(item.name);
        return e('div',{'data-identity':item.name},e('output',null,seed),
          e(CS.FormField,{label:'Name '+index,name:path('name')},e('input')),
          e('button',{type:'button',onClick:remove},'Delete '+index));
      }
      const shared={name:'Same'};
      const initialValues={rows:[{name:'Alpha'},{name:'Beta'},shared,shared]};
      const array=e(CS.FormFieldArray,{name:'rows',lang:'en',defaultItem:{name:'New'}},args=>e(StatefulRow,args));
      renderFixture(kind==='Form'?e(CS.Form,{key:'identity'+kind,initialValues,onSubmit:v=>savedRows.push(v)},array):e(CS.FormWizard,{key:'identity'+kind,initialValues,onComplete:v=>savedRows.push(v),steps:[{title:'Rows',render:()=>array}]}));
    },kind);
    const outputs=page.locator('.cs-form-array__row output');
    await page.getByRole('button',{name:'Delete 0',exact:true}).click();
    assert.deepEqual(await outputs.allTextContents(),['Beta','Same','Same'],'surviving child state belongs to surviving rows');
    await page.locator('.cs-form-array__row input').first().fill('Edited');
    assert.deepEqual(await outputs.allTextContents(),['Beta','Same','Same'],'immutable field edits must not remount row children');
    // Distinguish the two occurrences of the exact same object by DOM identity.
    await page.locator('.cs-form-array__row').nth(2).evaluate(el=>{window.lastDuplicate=el;});
    await page.getByRole('button',{name:'Delete 1',exact:true}).click();
    assert.equal(await page.locator('.cs-form-array__row').nth(1).evaluate(el=>el===window.lastDuplicate),true,'duplicate object occurrences retain separate row identities');
    await page.getByRole('button',{name:'Add row',exact:true}).click();
    assert.deepEqual(await outputs.allTextContents(),['Beta','Same','New']);
    await page.evaluate(kind=>kind==='Form'?document.querySelector('form').requestSubmit():document.querySelector('.cs-form-wizard__nav button:last-child').click(),kind);
    await page.waitForFunction(()=>savedRows.length===1);
    assert.deepEqual(await page.evaluate(()=>savedRows[0].rows),[{name:'Edited'},{name:'Same'},{name:'New'}],'internal row keys never enter submitted data');
    console.log('PASS '+kind+' row identity: deletion, immutable editing, duplicate occurrences and addition');
  }

  for (const kind of ['Form','FormWizard']) {
    await page.evaluate(kind=>{
      const e=React.createElement;window.errorRemovers=[];
      const initialValues={rows:[{name:''},{name:'Beta'}],rowsExtra:'',other:''};
      const rules={'rows.0.name':'required',rowsExtra:'required',other:'required'};
      const array=e(CS.FormFieldArray,{name:'rows',min:1,lang:'en'},({index,remove,path})=>{
        errorRemovers[index]=remove;
        return e(CS.FormField,{name:path('name'),label:'Row '+index},e('input'));
      });
      const body=e('div',null,array,e(CS.FormField,{name:'other',label:'Other'},e('input')));
      renderFixture(kind==='Form'?e(CS.Form,{key:'errors'+kind,initialValues,rules,lang:'en'},body):e(CS.FormWizard,{key:'errors'+kind,initialValues,lang:'en',steps:[{title:'Rows',rules,render:()=>body}]}));
      window.validateRows=()=>kind==='Form'?document.querySelector('form').requestSubmit():document.querySelector('.cs-form-wizard__nav button:last-child').click();
      validateRows();
    },kind);
    assert.equal(await page.locator('.cs-form-array__row [role="alert"]').count(),1);
    await page.evaluate(()=>ReactDOM.flushSync(()=>errorRemovers[0]()));
    assert.equal(await page.locator('.cs-form-array__row [role="alert"]').count(),0,'deleted row error cannot attach to its successor');
    assert.equal(await page.locator('.cs-form__summary li').count(),2,'unrelated and similarly prefixed errors survive structural edits');
    await page.locator('.cs-form-array__row input').fill('');
    await page.evaluate(()=>validateRows());
    assert.equal(await page.locator('.cs-form-array__row [role="alert"]').count(),1);
    await page.evaluate(()=>ReactDOM.flushSync(()=>errorRemovers[0]()));
    assert.equal(await page.locator('.cs-form-array__row [role="alert"]').count(),1,'min-blocked removal must not clear validation');
    console.log('PASS '+kind+' array errors: invalidate changed subtree, preserve unrelated paths and no-op errors');
  }

  for (const kind of ['Form','FormWizard']) {
    await page.evaluate(kind=>{
      const e=React.createElement;const shared={name:'Same'};window.duplicateRemovers=[];
      const array=e(CS.FormFieldArray,{name:'rows'},({index,remove,item})=>{
        duplicateRemovers[index]=remove;return e('span',null,item.name);
      });
      const initialValues={rows:[shared,shared,{name:'Other'}]};
      renderFixture(kind==='Form'?e(CS.Form,{key:'duplicates'+kind,initialValues},array):e(CS.FormWizard,{key:'duplicates'+kind,initialValues,steps:[{render:()=>array}]}));
      window.originalRemovers=[...duplicateRemovers];
      ReactDOM.flushSync(()=>{originalRemovers[0]();originalRemovers[0]()});
    },kind);
    assert.deepEqual(await page.locator('.cs-form-array__row').allTextContents(),['Same','Other'],'repeated callback removes only its own occurrence');
    await page.evaluate(()=>ReactDOM.flushSync(()=>originalRemovers[1]()));
    assert.deepEqual(await page.locator('.cs-form-array__row').allTextContents(),['Other'],'retained second occurrence callback follows shifted row');
    console.log('PASS '+kind+' duplicate removal: repeated stale callback and shifted occurrence identity');
  }

},{browserName:process.env.CS_TEST_BROWSER||'chromium'});
