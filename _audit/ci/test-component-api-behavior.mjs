import assert from 'node:assert/strict';
import {cpSync,readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url)),scratch=mkdtempSync(join(tmpdir(),'cs-api-static-tests-'));
try{
 for(const path of ['components','stories','_esm','scripts/check-component-api-behavior.mjs','scripts/lib/typescript-api.mjs','scripts/lib/story-domain-options.mjs','scripts/generate-story-domains.mjs','scripts/lib/declaration-domains.mjs','_audit/ci/test-api-domains-browser.mjs']){mkdirSync(resolve(scratch,path,'..'),{recursive:true});cpSync(resolve(root,path),resolve(scratch,path),{recursive:true});}
 symlinkSync(resolve(root,'node_modules'),resolve(scratch,'node_modules'),'dir');
 const run=()=>spawnSync(process.execPath,[resolve(root,'scripts/check-component-api-behavior.mjs'),scratch],{encoding:'utf8'});
 let result=run();assert.equal(result.status,0,result.stderr+result.stdout);
 const passed=JSON.parse(readFileSync(resolve(scratch,'test-results/component-api-static.json'),'utf8'));
 assert.equal(passed.defaultAssignability.diagnostics.length,0);assert.equal(passed.defaultAssignability.unsupported.length,0);
 const original=new Map();for(const file of ['components/contracts.json','stories/Tabs.stories.jsx','stories/Icon.stories.jsx','_audit/ci/test-api-domains-browser.mjs'])original.set(file,readFileSync(resolve(scratch,file),'utf8'));
 const mutation=(name,file,edit)=>{writeFileSync(resolve(scratch,file),edit(original.get(file)));result=run();assert.notEqual(result.status,0,name+' must fail');writeFileSync(resolve(scratch,file),original.get(file));};
 mutation('invalid typed default','components/contracts.json',text=>{const data=JSON.parse(text);data.components.find(c=>c.name==='Button').runtime.defaultExpressions.variant='"unreviewed"';return JSON.stringify(data)});
 mutation('unsupported executable default','components/contracts.json',text=>{const data=JSON.parse(text);data.components.find(c=>c.name==='Button').runtime.defaultExpressions.variant='Math.random()';return JSON.stringify(data)});
 mutation('omitted literal option','stories/Tabs.stories.jsx',text=>text.replace('DECLARED_DOMAINS.Tabs["aria-orientation"]',"['horizontal']"));
 mutation('unknown literal option','stories/Tabs.stories.jsx',text=>text.replace('DECLARED_DOMAINS.Tabs["aria-orientation"]',"['horizontal', 'vertical', 'diagonal']"));
 mutation('duplicate literal option','stories/Tabs.stories.jsx',text=>text.replace('DECLARED_DOMAINS.Tabs["aria-orientation"]',"['horizontal', 'vertical', 'vertical']"));
 mutation('unresolved runtime option expression','stories/Icon.stories.jsx',text=>text.replace('Object.keys(CS_ICONS)','getUnreviewedNames()'));
 mutation('missing secondary fixture value','_audit/ci/test-api-domains-browser.mjs',text=>text.replace("valueProp: ['value','checked','pressed']","valueProp: ['value','checked']"));
 const report={schemaVersion:1,status:'passed',node:process.version,checkedDefaults:passed.defaultAssignability.checked,enumCases:passed.literalUnionStoryOptions.cases.map(({component,prop,status})=>({component,prop,status})),negativeControls:7,scope:'Type assignability and static CSF/secondary-fixture domain membership; actual behavior remains a separate three-engine regression.'};mkdirSync(resolve(root,'test-results'),{recursive:true});writeFileSync(resolve(root,'test-results/component-api-static-mutations.json'),JSON.stringify(report,null,2)+'\n');
 console.log('PASS default assignability, domain inventory parity and seven independent negative controls');
}finally{rmSync(scratch,{recursive:true,force:true})}
