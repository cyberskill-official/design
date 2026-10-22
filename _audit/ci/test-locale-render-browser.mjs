import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {strings} from '../../components/_i18n/strings.js';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{stdio:'pipe'});
const unused=new Set(['Dialog.confirm','Dialog.cancel','EmptyState.action']);
const missing=[];
await withBrowserFixture(async page=>{
  await page.addScriptTag({url:'/_audit/lib/axe-fixtures.js'});
  // A pre-existing foreign portal must never contribute translated evidence.
  await page.evaluate(()=>{
    const foreign=document.createElement('div');foreign.setAttribute('data-cs-floating-root','');foreign.id='locale-unowned-sentinel';foreign.textContent='UNOWNED_FLOATING_LOCALE_SENTINEL';foreign.setAttribute('aria-label',foreign.textContent);document.body.appendChild(foreign);
  });
  for(const lang of ['en','vi']) for(const [namespace,tables] of Object.entries(strings)) {
    await page.evaluate(({namespace,lang})=>{
      renderFixture(null);
      const roots=[...document.querySelectorAll('[data-cs-floating-root]')];
      if(roots.some(root=>root.id!=='locale-unowned-sentinel'))throw Error('Previous locale fixture left a floating root mounted');
      window.localePriorFloatingRoots=new Set(roots);
      document.documentElement.lang=lang;
      const nodes=__axeFixtures.buildCluster(React.createElement,CS,{lang}).nodes;
      const node=nodes.find(node=>node.type===CS[namespace]);
      const props={...(node?.props||{}),lang};
      for(const key of ['label','title','placeholder','aria-label','closeLabel','details','titles','risk']) delete props[key];
      Object.assign(props,{
        AIDisclosureBadge:{sources:['Caller source']}, SearchField:{defaultValue:'Caller query'},
        NumberField:{value:1}, Tag:{onRemove:()=>{}}, Alert:{onDismiss:()=>{}},
        DataGrid:{persistKey:"locale-render",selectable:true,columns:[{key:'name',header:'Caller column',pinnable:true}]}, Carousel:{children:['Caller A','Caller B']},
        Mentions:{users:['CallerUser']}, CodeBlock:{code:'Caller code'}, ChatMessage:{role:'user'}, InlineEdit:{defaultValue:''},
        Toggle:{children:null,defaultPressed:false}, InputGroup:{defaultValue:'Caller value',clearable:true,password:true},
        BackTop:{threshold:-1},Toolbar:{overflowAfter:0},Image:{preview:true,src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"/>',alt:''},
      }[namespace]||{});
      window.drawLocaleCase=(delta={})=>renderFixture(React.createElement(CS[namespace],{...props,...delta}));
      drawLocaleCase();
    },{namespace,lang});
    const values=[];
    const capture=async()=>{
      const evidence=await page.evaluate(()=>{
        // Each namespace starts with a full unmount. Only roots created by this
        // mounted fixture are owned; pre-existing external roots are excluded.
        const roots=[document.getElementById('fixture'),...[...document.querySelectorAll('[data-cs-floating-root]')].filter(root=>!localePriorFloatingRoots.has(root))];
        roots.forEach((root,index)=>root.setAttribute('data-locale-evidence-root',String(index)));
        return {count:roots.length,values:roots.flatMap(root=>[root,...root.querySelectorAll('*')].flatMap(el=>[
          ...[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent),
          ...['aria-label','title','placeholder'].map(a=>el.getAttribute(a)).filter(v=>v!=null),
        ]))};
      });
      assert(!evidence.values.some(value=>value.includes('UNOWNED_FLOATING_LOCALE_SENTINEL')),'Foreign/stale floating content cannot satisfy locale coverage');
      values.push(...evidence.values);
      // DOM-linked rich names are resolved by the browser naming engine; their
      // complete text need not exist in a single attribute or text node.
      for(let index=0;index<evidence.count;index++)values.push(await page.locator('[data-locale-evidence-root="'+index+'"]').ariaSnapshot());
    };
    await capture();
    const click=async selector=>{await page.locator(selector).first().click();await capture()};
    if(namespace==='AIDisclosureBadge') await click('.cs-ai-disclosure__badge');
    if(namespace==='CodeBlock'){await page.evaluate(()=>drawLocaleCase({language:undefined}));await capture();await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}}));await click('button')}
    if(namespace==='ColorPicker') await click('.cs-colorpicker__field');
    if(namespace==='InputGroup') await click('button[aria-pressed]');
    if(namespace==='Switch') {await page.evaluate(()=>drawLocaleCase({checked:true,onChange:()=>{}}));await capture()}
    if(namespace==='BackTop'){await page.waitForSelector('.cs-backtop');await capture()}
    if(namespace==='Toggle') await click('button');
    if(namespace==='TreeTable'){await click('button');await page.evaluate(()=>drawLocaleCase({nodes:[]}));await capture()}
    if(namespace==='Chart'){await page.evaluate(()=>drawLocaleCase({data:[],label:undefined}));await capture()}
    if(namespace==='DataGrid'){await page.evaluate(()=>drawLocaleCase({rows:[]}));await capture()}
    if(namespace==='DataTable') for(const state of ['idle','loading','error']){await page.evaluate(state=>drawLocaleCase({state,rows:[]}),state);await capture()}
    if(namespace==='ConfidenceMeter') for(const value of [0.1,0.5]){await page.evaluate(value=>drawLocaleCase({value}),value);await capture()}
    if(namespace==='Result') for(const status of ['error','warning','info']){await page.evaluate(status=>drawLocaleCase({status}),status);await capture()}
    if(namespace==='HotKeys'){await page.locator('body').press('?');await capture()}
    if(namespace==='Popconfirm') await click('button');
    if(namespace==='Popover') await click('button');
    if(namespace==='ContextMenu'){await page.locator('.cs-ctxmenu-zone').click({button:'right'});await capture()}
    if(namespace==='Combobox'){await page.locator('input').fill('No matching caller option');await capture()}
    if(namespace==='CommandPalette'){
      await page.evaluate(()=>drawLocaleCase({open:true,groups:[{items:[{label:'Alpha'},{label:'Beta'}]}]}));await capture();
      await page.evaluate(()=>drawLocaleCase({open:true,groups:[{items:[{label:'Alpha'}]}]}));await capture();
      await page.locator('.cs-cmdk__search input').fill('No matching caller command');await capture();
    }
    if(namespace==='Image'){await page.waitForSelector('.cs-image.is-zoomable');await capture();await click('.cs-image')}
    if(namespace==='Tour'){await page.evaluate(()=>drawLocaleCase({steps:[{target:'#absent',title:'Caller A'},{target:'#absent',title:'Caller B'}]}));await capture();await page.locator('.cs-tour__btns button').last().click();await capture()}
    if(namespace==='Toast'){await page.evaluate(lang=>renderFixture(React.createElement(CS.ToastStack,{lang},React.createElement(CS.Toast,{lang,onClose:()=>{}}))),lang);await capture()}
    if(namespace==='Form'){
      await page.evaluate(lang=>renderFixture(React.createElement(CS.FormFieldArray,{lang,name:'rows'})),lang);await capture();
      await page.evaluate(lang=>{const h=React.createElement;renderFixture(h(CS.Form,{lang,rules:{name:'required'}},h(CS.FormField,{lang,name:'name',label:'Caller label',required:true},h('input',{name:'name'})),h(CS.FormFieldArray,{lang,name:'rows',children:()=>null}),h('button',{type:'submit'},'Caller submit')))},lang);
      await capture();await click('button[type=submit]');
      await page.evaluate(lang=>renderFixture(React.createElement(CS.FormWizard,{lang,steps:[{render:()=>null},{render:()=>null}]})),lang);await capture();
      await page.locator('.cs-form-wizard button').last().click();await capture();
    }
    if(namespace==='Calendar') {
      const weekdays=lang==='vi'?['T2','T3','T4','T5','T6','T7','CN']:['Mo','Tu','We','Th','Fr','Sa','Su'];
      assert.deepEqual(await page.locator('.cs-cal__wd span').allTextContents(),weekdays,lang+': complete weekday lexicon');
      const months=lang==='vi'?Array.from({length:12},(_,i)=>`Tháng ${i+1}`):['January','February','March','April','May','June','July','August','September','October','November','December'];
      for(let month=0;month<12;month++) {
        await page.evaluate(month=>drawLocaleCase({value:new Date(2026,month,2)}),month);
        await page.waitForFunction(expected=>document.querySelector('.cs-cal__head b')?.textContent===expected,months[month]+' 2026');
      }
    }
    if(namespace==='DatePicker') {
      await page.evaluate(()=>drawLocaleCase({value:new Date(2026,0,2)}));
      assert.ok((await page.locator('#fixture').textContent()).includes(lang==='vi'?'02/01/2026':'02 Jan 2026'),lang+': formatted date value');
    }
    for(const [key,value] of Object.entries(tables[lang])) {
      const expected=value.replace('{name}','Caller column').replace('{count}',key==='oneResult'?'1':'2');
      if(!unused.has(namespace+'.'+key)&&!values.some(text=>text.includes(expected))) missing.push(`${lang}:${namespace}.${key}`);
    }
  }
  await page.evaluate(()=>{renderFixture(null);const roots=[...document.querySelectorAll('[data-cs-floating-root]')];if(roots.length!==1||roots[0].id!=='locale-unowned-sentinel')throw Error('Final locale fixture leaked a floating root');roots[0].remove();});
},{browserName:process.env.CS_TEST_BROWSER||'chromium',development:true});
if(missing.length) console.error('Missing rendered keys:',missing);
assert.equal(missing.length,0,'Every used registry key must have rendered EN/VI evidence');
console.log(`PASS locale rendering: all used registry keys in EN and VI, including conditional/error/expanded/action states Chart no-data names and CommandPalette empty/singular/plural feedback; ${unused.size} unused registry keys excluded explicitly. Complete Calendar weekday/month lexicons and DatePicker formatting also checked. Caller-content classification is separate.`);
