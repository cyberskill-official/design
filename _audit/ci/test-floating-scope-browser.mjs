import assert from 'node:assert/strict';import{mkdirSync,writeFileSync,readFileSync}from'node:fs';import{createHash}from'node:crypto';import{withBrowserFixture}from'./lib/browser-fixture.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium',rows=[];
await withBrowserFixture(async page=>{
 await page.evaluate(()=>{renderFixture(null);const h=React.createElement;renderFixture(h('div',{id:'axis-subtree'},h(CS.Popover,{open:true,trigger:h('button',{id:'axis-trigger'},'Scope'),'aria-label':'Axis panel'},h('span',{id:'axis-content'},'Scoped content'))));});await page.locator('#axis-content').waitFor();
 for(const target of['html','#axis-subtree'])for(const[axis,value,token]of[['data-cs-element','hoa','--cs-accent'],['data-cs-element','thuy','--cs-accent'],['data-cs-variant','ocean','--cs-accent'],['data-cs-variant','mist','--cs-accent'],['data-cs-style','liquid-glass','--cs-style-pack']]){
  const before=await page.locator('#axis-trigger').evaluate((el,token)=>getComputedStyle(el).getPropertyValue(token),token);await page.locator(target).evaluate((el,{axis,value})=>el.setAttribute(axis,value),{axis,value});
  await page.waitForFunction(({axis,value,token})=>{const trigger=document.getElementById('axis-trigger'),panel=document.getElementById('axis-content'),host=panel.closest('[data-cs-floating-root]');return host.getAttribute(axis)===value&&getComputedStyle(panel).getPropertyValue(token).trim()===getComputedStyle(trigger).getPropertyValue(token).trim();},{axis,value,token});
  const actual=await page.locator('#axis-content').evaluate((el,token)=>getComputedStyle(el).getPropertyValue(token),token);if(axis==='data-cs-element'&&target==='html')assert.notEqual(actual,before,'element mutation changes an actual resolved accent');rows.push({target,axis,value,token,actual});
  if(axis==='data-cs-variant'&&value==='mist')await page.locator(target).evaluate(el=>el.removeAttribute('data-cs-variant'));
 }
 // Explicit subtree axes continue to win when a more distant root changes.
 await page.locator('html').evaluate(el=>el.setAttribute('data-cs-element','kim'));await page.waitForTimeout(50);assert.equal(await page.locator('#axis-content').evaluate(el=>el.closest('[data-cs-floating-root]').getAttribute('data-cs-element')),'thuy');
 await page.evaluate(()=>{renderFixture(null);for(const a of['data-cs-element','data-cs-variant','data-cs-style'])document.documentElement.removeAttribute(a);});
 await page.addScriptTag({url:new URL('/_audit/vendor/axe.min.js',page.url()).href});
 for(const portal of[true,false])for(const theme of['light','dark']){
  await page.evaluate(({portal,theme})=>{renderFixture(null);const h=React.createElement;function App(){const[value,setValue]=React.useState();return h('section',{'data-theme':theme},h(CS.Combobox,{portal,label:'Choose',value,onChange:setValue,options:[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}]}));}renderFixture(h(App));},{portal,theme});await page.getByRole('combobox').focus();await page.getByRole('option',{name:'Alpha'}).waitFor();
  assert.equal(await page.getByRole('option',{name:'Alpha'}).getAttribute('aria-selected'),'false');assert.match(await page.getByRole('option',{name:'Alpha'}).getAttribute('class'),/hl/);
  const violations=()=>page.evaluate(async()=>{const popup=document.querySelector('.cs-combobox__popup');return(await axe.run(popup,{runOnly:{type:'rule',values:['color-contrast']}})).violations;});assert.deepEqual(await violations(),[],theme+' highlighted option contrast');
  if(theme==='light'){
   await page.addStyleTag({content:'.cs-combobox__opt.hl {color:var(--cs-accent-strong)!important}'}).then(async style=>{const old=await violations();assert(old.some(v=>v.id==='color-contrast'),'old accent-strong text is rejected by real open-panel contrast oracle');await style.evaluate(el=>el.remove());});assert.deepEqual(await violations(),[]);
  }
  await page.getByRole('option',{name:'Alpha'}).click();assert.equal(await page.getByRole('combobox').inputValue(),'Alpha');assert.equal(await page.getByRole('combobox').getAttribute('aria-expanded'),'false');rows.push({portal,theme,case:'highlight-contrast-and-selection',status:'PASS'});
 }
 await page.evaluate(()=>renderFixture(null));
},{browserName});mkdirSync('test-results/floating-panels',{recursive:true});writeFileSync(`test-results/floating-panels/scope-${browserName}.json`,JSON.stringify({status:'PASS',browserName,bundleSha256:createHash('sha256').update(readFileSync('_ds_bundle.js')).digest('hex'),rows},null,2)+'\n');console.log('PASS dynamic root/subtree element/variant/style scope and open body/inline light/dark Combobox contrast with old-color mutation oracle; '+browserName);
