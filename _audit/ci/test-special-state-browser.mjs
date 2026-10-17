import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

execFileSync(process.execPath, ['_audit/ci/check-bundle-freshness.mjs'], {stdio:'pipe'});
await withBrowserFixture(async page => {
  for (const observed of [false,true]) {
    await page.evaluate(observed=>{
      window.editorChanges=[];
      window.drawEditor=(extra={})=>renderFixture(React.createElement(CS.Editor,{
        key:'editor'+observed,lang:'en',defaultValue:'<p>Initial</p>',
        ...(observed?{onChange:html=>editorChanges.push(html)}:{}),...extra,
      }));
      drawEditor();
    },observed);
    const editor=page.getByRole('textbox');
    assert.equal(await editor.textContent(),'Initial');
    await editor.fill('Edited');
    assert.equal(await editor.textContent(),'Edited');
    const emitted = await editor.innerHTML();
    assert.deepEqual(await page.evaluate(()=>editorChanges),observed?[emitted]:[]);
    await page.evaluate(()=>drawEditor({className:'rerendered'}));
    assert.equal(await editor.textContent(),'Edited','Editor unrelated rerender preserves DOM draft');
    await page.evaluate(()=>drawEditor({defaultValue:'<p>New seed</p>'}));
    assert.equal(await editor.textContent(),'Edited','Editor changed defaultValue cannot overwrite a mounted draft');
    await page.evaluate(()=>drawEditor({key:'reset',defaultValue:'<p>New seed</p>'}));
    assert.equal(await editor.textContent(),'New seed','Editor remount uses new seed');
    assert.deepEqual(await page.evaluate(()=>editorChanges),observed?[emitted]:[],'Editor seed/reset does not report a user edit');
  }
  for (const observed of [false,true]) {
    await page.evaluate(observed=>{
      window.fileChanges=[];
      window.drawFiles=(extra={})=>renderFixture(React.createElement('form',null,
        React.createElement(CS.FileUpload,{key:'file'+observed,lang:'en',title:'Files',
          ...(observed?{onFiles:files=>fileChanges.push(files.map(file=>file.name))}:{}),...extra}),
        React.createElement('button',{type:'reset'},'Reset files')));
      drawFiles();
    },observed);
    const input=page.locator('input[type="file"]');
    const files=()=>input.evaluate(element=>[...element.files].map(file=>file.name));
    await input.setInputFiles({name:'sample.txt',mimeType:'text/plain',buffer:Buffer.from('sample')});
    assert.deepEqual(await files(),['sample.txt']);
    assert.deepEqual(await page.evaluate(()=>fileChanges),observed?[['sample.txt']]:[]);
    await page.evaluate(()=>drawFiles({className:'rerendered'}));
    assert.deepEqual(await files(),['sample.txt'],'FileUpload rerender preserves browser selection');
    await page.getByRole('button',{name:'Reset files',exact:true}).click();
    assert.deepEqual(await files(),[],'FileUpload native form reset clears selection');
    await page.evaluate(()=>drawFiles({key:'reset'}));
    assert.deepEqual(await files(),[],'FileUpload remount starts empty');
    assert.deepEqual(await page.evaluate(()=>fileChanges),observed?[['sample.txt']]:[],'FileUpload reset does not fabricate file notifications');
  }
  for (const name of ['Form','FormWizard']) for (const observed of [false,true]) {
    await page.evaluate(({name,observed})=>{
      const e=React.createElement;
      window.formChanges=[];window.formSaves=[];
      const body=e(React.Fragment,null,
        e(CS.FormField,{label:'Name',name:'name'},e('input',{'aria-label':'Name',...(observed?{onChange:event=>formChanges.push(event.target.value)}:{})})),
        e(CS.FormFieldArray,{name:'rows',label:'Rows',lang:'en',defaultItem:{name:'New row'},max:2},({path,index})=>
          e(CS.FormField,{name:path('name'),label:'Row '+index},e('input',{'aria-label':'Row '+index}))),
        name==='Form'?e('button',{type:'submit'},'Save'):null,
        name==='Form'?e('button',{type:'reset'},'Reset form'):null);
      window.drawForm=(extra={})=>{
        const props={key:name+observed,lang:'en',initialValues:{name:'Seed',rows:[{name:'Row seed'}]},...extra};
        const save=observed?values=>formSaves.push(values):undefined;
        renderFixture(name==='Form'?e(CS.Form,{...props,onSubmit:save},body):e(CS.FormWizard,{
          ...props,onComplete:save,steps:[{title:'Edit',render:()=>body},{title:'Review',render:({values})=>e('pre',{id:'review-values'},JSON.stringify(values))}],
        }));
      };
      drawForm();
    },{name,observed});
    const input=page.getByRole('textbox',{name:'Name',exact:true});
    assert.equal(await input.inputValue(),'Seed');
    await input.fill('Edited');
    await page.getByRole('textbox',{name:'Row 0',exact:true}).fill('Edited row');
    await page.getByRole('button',{name:'Add row',exact:true}).click();
    assert.equal(await page.getByRole('textbox',{name:'Row 1',exact:true}).inputValue(),'New row');
    assert.equal(await page.getByRole('button',{name:'Add row',exact:true}).isDisabled(),true,'FormFieldArray maximum disables additions');
    const values={name:'Edited',rows:[{name:'Edited row'},{name:'New row'}]};
    // Form collects native named entries as well as controller values;
    // FormWizard has no native form and submits only its controller object.
    const submittedValues=name==='Form'?{'rows.0.name':'Edited row','rows.1.name':'New row',...values}:values;
    await page.evaluate(()=>drawForm({className:'rerendered',initialValues:{name:'Replacement',rows:[]}}));
    assert.equal(await input.inputValue(),'Edited',name+' rerender/changed seed preserves edits');
    assert.equal(await page.getByRole('textbox',{name:'Row 0',exact:true}).inputValue(),'Edited row');
    if(name==='Form') await page.getByRole('button',{name:'Save',exact:true}).click();
    else {
      await page.locator('.cs-form-wizard__nav button').last().click();
      assert.deepEqual(JSON.parse(await page.locator('#review-values').textContent()),values,'FormWizard step receives controller values');
      await page.evaluate(()=>drawForm({className:'second-rerender'}));
      assert.equal(await page.locator('.cs-form-wizard').getAttribute('data-step'),'1','FormWizard rerender preserves current step');
      await page.locator('.cs-form-wizard__nav button').last().click();
    }
    await page.waitForFunction(()=>!document.querySelector('[aria-busy="true"]'));
    assert.deepEqual(await page.evaluate(()=>formSaves),observed?[submittedValues]:[],name+' submission payload');
    assert.deepEqual(await page.evaluate(()=>formChanges),observed?['Edited']:[],name+' field callback remains observational');
    if(name==='Form') {
      await page.getByRole('button',{name:'Reset form',exact:true}).click();
      assert.equal(await input.inputValue(),'Seed','Form reset restores mount seed despite later initialValues');
      assert.equal(await page.locator('.cs-form-array__row').count(),1,'Form reset restores array seed');
    }
    await page.evaluate(()=>drawForm({key:'reset'}));
    assert.equal(await input.inputValue(),'Seed',name+' remount resets controller');
    assert.equal(await page.getByRole('textbox',{name:'Row 0',exact:true}).inputValue(),'Row seed');
    assert.equal(await page.locator('.cs-form-array__row').count(),1);
    if(name==='FormWizard') assert.equal(await page.locator('.cs-form-wizard').getAttribute('data-step'),'0');
    assert.deepEqual(await page.evaluate(()=>formChanges),observed?['Edited']:[],name+' reset does not notify field changes');
    assert.deepEqual(await page.evaluate(()=>formSaves),observed?[submittedValues]:[],name+' reset does not submit');
  }
}, {browserName:process.env.CS_TEST_BROWSER || 'chromium'});
console.log('PASS special state: Editor/FileUpload/Form/FormWizard with and without callbacks; FormField/array ownership, mount seeds, rerenders and reset lifecycles');
