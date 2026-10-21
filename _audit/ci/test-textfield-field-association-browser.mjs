import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {readFileSync, writeFileSync, mkdtempSync, copyFileSync, mkdirSync, rmSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {assertNpmVersion} from '../../scripts/check-npm-version.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';

const root = resolve('.'), browserName = process.env.CS_TEST_BROWSER || 'chromium';
const scratch = mkdtempSync(join(tmpdir(), 'cs-textfield-association-'));
const fixture = resolve('_audit/ci/fixtures/textfield-association.jsx');
const source = resolve('components/textfield/TextField.jsx');
const receipts = [];
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');

async function compileBrowser(oldSource) {
  let applied = false;
  const result = await build({entryPoints:[fixture], bundle:true, write:false, format:'iife', globalName:'TextFieldFixture',
    plugins:[{name:'runtime-peers-and-pre-fix-control',setup(builder) {
      builder.onResolve({filter:/^react(?:-dom)?$/}, args => ({path:args.path,namespace:'peer'}));
      builder.onLoad({filter:/.*/,namespace:'peer'}, args => ({contents:args.path==='react'?'module.exports=window.React;':'module.exports=window.ReactDOM;',loader:'js'}));
      if(oldSource) builder.onLoad({filter:/components\/textfield\/TextField\.jsx$/}, () => {applied=true; return {contents:oldSource,loader:'jsx'};});
    }}]});
  if(oldSource) assert(applied, 'Pre-fix component source was actually compiled');
  return result.outputFiles[0].text;
}

try {
  const react18 = join(scratch,'react18'); mkdirSync(react18);
  for(const name of ['package.json','package-lock.json']) copyFileSync(resolve('_audit/ci/fixtures/react18-consumer',name),join(react18,name));
  const cli=resolve('_audit/ci/fixtures/npm-cli/node_modules/npm/bin/npm-cli.js');
  const version=spawnSync(process.execPath,[cli,'--version'],{encoding:'utf8'});
  assert.equal(version.status,0); assertNpmVersion(JSON.parse(readFileSync('package.json','utf8')),version.stdout);
  const install = spawnSync(process.execPath,[cli,'ci','--ignore-scripts'],{cwd:react18,encoding:'utf8',timeout:120000});
  assert.equal(install.status,0,install.stdout+install.stderr);
  const client = await compileBrowser();
  for(const [major,runtimeRoot] of [[18,react18],[19,root]]) {
    const require = createRequire(join(runtimeRoot,'package.json')), React = require('react'), server = require('react-dom/server');
    assert(React.version.startsWith(major+'.')); assert.equal(typeof globalThis.document,'undefined');
    const result = await build({entryPoints:[fixture],bundle:true,write:false,platform:'node',format:'cjs',external:['react','react-dom']});
    const module={exports:{}}; new Function('module','exports','require',result.outputFiles[0].text)(module,module.exports,require);
    const warnings=[], previous=console.error; let html;
    try {console.error=(...args)=>warnings.push(args.join(' ')); html=server.renderToString(React.createElement(module.exports.TextFieldAssociationFixture));}
    finally {console.error=previous;}
    assert.deepEqual(warnings,[],'SSR emits no development warnings');
    await withBrowserFixture(async page => {
      const errors=[]; page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
      await page.addScriptTag({content:client});
      await page.evaluate(html=>{
        renderFixture(null); const mount=document.createElement('div'); mount.id='textfield-hydration'; mount.innerHTML=html; document.body.append(mount);
        window.recoveries=[];
        window.textHydrationRoot=ReactDOM.hydrateRoot(mount,React.createElement(TextFieldFixture.TextFieldAssociationFixture),{onRecoverableError:error=>recoveries.push(String(error))});
      },html);
      await page.waitForFunction(()=>window.textFieldObjectRef?.current);
      const inherited=page.getByTestId('inherited'), local=page.getByTestId('local');
      assert.equal(await page.getByRole('textbox',{name:/^Parent name /}).count(),1);
      assert.equal(await page.getByRole('textbox',{name:'Local name',exact:true}).count(),1);
      assert.equal(await page.getByRole('textbox',{name:'Explicit name',exact:true}).count(),1);
      assert.equal(await page.getByRole('textbox',{name:'External name',exact:true}).count(),1);
      assert.equal(await local.getAttribute('id'),'explicit-local');
      assert.equal(await page.locator('#textfield-hydration [id]').evaluateAll(nodes=>new Set(nodes.map(n=>n.id)).size===nodes.length),true,'All participating controls and descriptions retain unique IDs');
      for(const input of [inherited,local,page.getByTestId('explicit'),page.getByTestId('external')]) {
        assert.equal(await input.getAttribute('required'),''); assert.equal(await input.getAttribute('aria-invalid'),'true');
        assert((await input.evaluate(el=>el.getAttribute('aria-describedby').split(/\s+/).map(id=>document.getElementById(id)?.textContent))).includes('Parent error'));
      }
      assert.deepEqual(await inherited.evaluate(el=>el.getAttribute('aria-describedby').split(/\s+/).map(id=>document.getElementById(id).textContent)),['External help','Parent error','Local help']);
      assert.deepEqual(await local.evaluate(el=>el.getAttribute('aria-describedby').split(/\s+/).map(id=>document.getElementById(id).textContent)),['Parent error','0','0']);
      assert.equal(await page.getByText('Parent error',{exact:true}).count(),1,'Inherited error is not duplicated by each TextField');
      assert.equal(await inherited.evaluate(el=>el===textFieldObjectRef.current),true);
      assert.equal(await local.evaluate(el=>el===textFieldCallbackRef),true);
      await inherited.fill('entered value'); await inherited.evaluate(el=>{el.focus();el.setSelectionRange(2,7);window.retainedInput=el;});
      assert((await page.evaluate(()=>textFieldInputEvents))>0,'Native input callback is preserved');
      await page.evaluate(()=>ReactDOM.flushSync(()=>updateTextFieldContext(false)));
      assert.equal(await inherited.evaluate(el=>el===retainedInput&&el===document.activeElement),true);
      assert.equal(await inherited.inputValue(),'entered value');
      assert.deepEqual(await inherited.evaluate(el=>[el.selectionStart,el.selectionEnd]),[2,7]);
      assert.equal(await inherited.getAttribute('required'),null); assert.equal(await inherited.getAttribute('aria-invalid'),null);
      assert.deepEqual(await inherited.evaluate(el=>el.getAttribute('aria-describedby').split(/\s+/).map(id=>document.getElementById(id).textContent)),['External help','Parent help','Local help']);
      assert.equal(await local.getAttribute('aria-invalid'),'true','Local zero error survives parent error removal');
      assert.deepEqual(await page.evaluate(()=>recoveries),[]); assert.deepEqual(errors,[],'Matching development hydration and refs emit no warnings');
      await page.evaluate(()=>{ReactDOM.flushSync(()=>textHydrationRoot.unmount());document.getElementById('textfield-hydration').remove();});
      assert.equal(await page.evaluate(()=>textFieldObjectRef.current),null); assert.equal(await page.evaluate(()=>textFieldCallbackRef),null);
      await page.evaluate(()=>{const h=React.createElement;renderFixture(h(CS.FormField,{label:'Context name'},h('div',null,
        h(CS.TextField,{'data-testid':'empty-aria','aria-label':'','aria-invalid':'grammar'}),
        h(CS.TextField,{'data-testid':'empty-idref','aria-labelledby':''}),
        h(CS.TextField,{'data-testid':'zero-label',label:0}))));});
      assert.equal(await page.getByTestId('empty-aria').getAttribute('aria-label'),'','Explicit native empty ARIA values remain caller owned');
      assert.equal(await page.getByTestId('empty-aria').getAttribute('aria-labelledby'),null);
      assert.equal(await page.getByTestId('empty-aria').getAttribute('aria-invalid'),'grammar');
      assert.equal(await page.getByTestId('empty-idref').getAttribute('aria-labelledby'),'');
      assert.equal(await page.getByRole('textbox',{name:'0',exact:true}).count(),1);
      await page.evaluate(()=>renderFixture(null));
      // The original component implementation is compiled verbatim as an atomic negative.
      await page.addScriptTag({content:await compileBrowser(readFileSync('_audit/ci/fixtures/textfield-association-before.jsx','utf8'))});
      await page.evaluate(()=>renderFixture(React.createElement(TextFieldFixture.TextFieldAssociationFixture)));
      assert.equal(await page.getByTestId('inherited').getAttribute('aria-invalid'),null,'Original code demonstrably loses inherited error association');
      assert.equal(await page.getByTestId('inherited').getAttribute('required'),null,'Original code demonstrably loses inherited native required');
      await page.evaluate(()=>renderFixture(null));
      receipts.push({react:React.version,browserName,status:'PASS',hydration:true,preFixSourceRejected:true});
    },{browserName,development:true,reactRuntimeRoot:runtimeRoot});
  }
  mkdirSync('test-results/textfield-field-association',{recursive:true});
  writeFileSync(`test-results/textfield-field-association/${browserName}.json`,JSON.stringify({status:'PASS',sourceSha256:hash(source),fixtureSha256:hash(fixture),receipts},null,2)+'\n');
  console.log('PASS '+browserName+': React18/19 SSR/hydration, four field controls, naming/description/error/required/ref/event/entered state and pre-fix source negative');
} finally {rmSync(scratch,{recursive:true,force:true});}
