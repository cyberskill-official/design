import assert from 'node:assert/strict';
import {cp, mkdtemp, mkdir, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium, firefox, webkit} from 'playwright';
import {outputFingerprint} from '../../scripts/storybook-fingerprint.mjs';
import {createVerificationServer} from '../../scripts/lib/verification-server.mjs';
import {scanStoryDocument} from '../../scripts/lib/storybook-runtime-scan.mjs';

const artifact=resolve(process.argv[2]||'storybook-static'), browserName=process.env.CS_TEST_BROWSER||'chromium';
const scratch=await mkdtemp(join(tmpdir(),'cs-state-story-artifact-'));
let server,browser;
try {
  await cp(artifact,join(scratch,'storybook-static'),{recursive:true});
  const frozen=join(scratch,'storybook-static'), stamp=JSON.parse(await readFile(join(frozen,'.cs-freshness.json'),'utf8'));
  const output=outputFingerprint(scratch); assert.equal(output.hash,stamp.outputHash,'Actual frozen artifact output matches its build stamp');
  const manifestBytes=await readFile('components/scenarios.json');
  assert.deepEqual(await readFile(join(frozen,'components/scenarios.json')),manifestBytes,'Artifact includes the current source-bound scenario projection');
  const manifest=JSON.parse(manifestBytes), cases=manifest.cases.filter(c=>['error','empty'].includes(c.category));
  const indexBytes=await readFile(join(frozen,'index.json')), index=JSON.parse(indexBytes);
  const stories=cases.map(item=>{
    const owner=item.component==='FormField'?'Form':item.component;
    const exportName='Scenario'+item.component+(item.category==='error'?'Error':'Empty');
    const matches=Object.values(index.entries).filter(row=>row.type==='story'&&row.importPath==='./stories/'+owner+'.stories.jsx'&&row.exportName===exportName);
    assert.equal(matches.length,1,'Exactly one actual CSF export for '+item.id); return {item,story:matches[0]};
  });
  server=await createVerificationServer(frozen);await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin='http://127.0.0.1:'+server.address().port;
  browser=await ({chromium,firefox,webkit}[browserName]).launch();
  const page=await browser.newPage({viewport:{width:1280,height:900}}),rows=[];
  for(const {item,story} of stories) {
    const errors=[],onError=error=>errors.push(String(error));page.on('pageerror',onError);
    const row={caseId:item.id,storyId:story.id,exportName:story.exportName};
    try {
      assert.equal((await page.goto(origin+'/iframe.html?id='+encodeURIComponent(story.id)+'&viewMode=story')).status(),200);
      await page.locator('[data-cs-scenario-verified="'+item.id+'"]').waitFor({state:'attached',timeout:20000});
      const scan=await scanStoryDocument(page,origin+'/_audit/vendor/axe.min.js');
      row.rootSha256=createHash('sha256').update(scan.rootHTML).digest('hex');delete scan.rootHTML;
      row.storyScan=scan;
      row.expandedWcag=await page.evaluate(async vendorUrl=>{
        const scanner=await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=vendorUrl;script.onload=()=>resolve(globalThis.axe);script.onerror=()=>reject(Error('Pinned artifact scanner failed to load'));document.head.append(script);});
        if(scanner.version!=='4.10.0')throw Error('Pinned axe vendor version mismatch');
        const roots=[document.querySelector('#storybook-root'),...[...document.querySelectorAll('[data-cs-floating-root],[data-cs-overlay-root]')].filter(el=>!document.querySelector('#storybook-root').contains(el))];
        const result=await scanner.run({include:roots},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});
        return {violations:result.violations,incomplete:result.incomplete,passes:result.passes.map(r=>({id:r.id,nodes:r.nodes.length})),inapplicable:result.inapplicable.map(r=>r.id)};
      },origin+'/_audit/vendor/axe.min.js');
      row.pass=scan.passed&&!row.expandedWcag.violations.some(v=>['serious','critical'].includes(v.impact));
    } catch(error) {row.pass=false;row.error=String(error.stack||error);}
    page.off('pageerror',onError);row.pageErrors=errors;if(errors.length)row.pass=false;rows.push(row);
  }
  const failures=rows.filter(r=>!r.pass),out=resolve('test-results/component-scenario-stories');await mkdir(out,{recursive:true});
  await writeFile(join(out,browserName+'.json'),JSON.stringify({status:failures.length?'FAIL':'PASS',browserName,browserVersion:browser.version(),stamp,verifiedOutput:output,indexSha256:createHash('sha256').update(indexBytes).digest('hex'),manifestSha256:createHash('sha256').update(manifestBytes).digest('hex'),rows,scope:'All explicitly supported Error/Empty CSF exports from actual frozen Storybook output. Owned play assertions must complete; existing whole-document/product/ownership evidence and full WCAG2/2.1/2.2 rules retained. No per-story exclusions, manual AT or visual acceptance claim.'},null,2)+'\n');
  assert.equal(rows.length,cases.length);assert.equal(failures.length,0,'Actual scenario CSF/play/axe failures retained in report');
  console.log('PASS '+browserName+': '+rows.length+' actual built Error/Empty stories, owned play assertions and full configured accessibility evidence');
} finally {await browser?.close();if(server)await new Promise(r=>server.close(r));await rm(scratch,{recursive:true,force:true});}
