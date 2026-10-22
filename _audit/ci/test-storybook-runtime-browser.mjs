import assert from 'node:assert/strict';
import {cp,mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium,firefox,webkit} from 'playwright';
import {outputFingerprint} from '../../scripts/storybook-fingerprint.mjs';
import {createVerificationServer} from '../../scripts/lib/verification-server.mjs';
import {scanStoryDocument} from '../../scripts/lib/storybook-runtime-scan.mjs';
const artifact=resolve(process.argv[2]||'storybook-static');
const browserName=process.env.CS_TEST_BROWSER||'chromium';
assert.ok(['chromium','firefox','webkit'].includes(browserName));
const scratch=await mkdtemp(join(tmpdir(),'cs-story-runtime-'));
const out=resolve(process.env.CS_STORY_RUNTIME_REPORT||`test-results/storybook-runtime-${browserName}`);
await mkdir(out,{recursive:true});
let server,browser;
try{
 await cp(artifact,join(scratch,'storybook-static'),{recursive:true});
 const stamp=JSON.parse(await readFile(join(scratch,'storybook-static/.cs-freshness.json'),'utf8'));
 const output=outputFingerprint(scratch);
 assert.equal(output.hash,stamp.outputHash,'Frozen actual artifact must match its output stamp');
 const indexBytes=await readFile(join(scratch,'storybook-static/index.json'));
 const index=JSON.parse(indexBytes);
 const stories=Object.values(index.entries).filter(row=>row.type==='story'&&row.componentPath?.startsWith('./components/')).sort((a,b)=>a.id.localeCompare(b.id));
 assert.ok(stories.length>0,'No component stories is a failure');
 server=await createVerificationServer(join(scratch,'storybook-static'));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 browser=await ({chromium,firefox,webkit}[browserName]).launch({headless:true});
 const rows=[];let next=0;
 await Promise.all(Array.from({length:3},async()=>{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  while(next<stories.length){
   const story=stories[next++];const errors=[];
   const onError=error=>errors.push(String(error));page.on('pageerror',onError);
   const row={id:story.id,title:story.title,name:story.name,componentPath:story.componentPath,pageErrors:errors};
   try{
    const response=await page.goto(`${origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`);
    assert.equal(response.status(),200);
    const scan=await scanStoryDocument(page,origin+'/_audit/vendor/axe.min.js');
    assert.equal(scan.axeVersion,'4.10.0');
    row.rootHash=createHash('sha256').update(scan.rootHTML).digest('hex');delete scan.rootHTML;
    Object.assign(row,scan);
   }catch(error){row.renderError=String(error);}
   page.off('pageerror',onError);rows.push(row);
   await writeFile(join(out,story.id+'.json'),JSON.stringify(row,null,2)+'\n');
   if(rows.length%25===0)console.log(`${browserName}: ${rows.length}/${stories.length} actual component stories scanned`);
  }
  await page.close();
 }));
 rows.sort((a,b)=>a.id.localeCompare(b.id));
 const failed=rows.filter(r=>r.renderError||r.pageErrors.length||!r.passed);
 const summary={schemaVersion:1,recordedAt:new Date().toISOString(),scope:'Actual built component-story default renders at1280x900 with artifact toolbar defaults. Verdict uses existing axe-smoke WCAG2A/AA tags and serious/critical impacts on productroot+registeredportals, plus fail-closed unknown externalnode coverage. All product and wholeiframe rules/impacts/incomplete retained; wholeiframe cleanliness, interactive states, current-source/manual accessibility and acceptance are not implied.',artifact,stamp,verifiedOutput:output,indexHash:createHash('sha256').update(indexBytes).digest('hex'),browserName,browserVersion:browser.version(),stories:rows.length,sourceComponents:new Set(stories.map(r=>r.componentPath)).size,failures:failed.map(r=>({id:r.id,renderError:r.renderError,pageErrors:r.pageErrors,coverage:r.coverage,violations:r.wcag?.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}))})),incompleteStories:rows.filter(r=>r.wholeDocument?.incomplete.length).map(r=>({id:r.id,rules:r.wholeDocument.incomplete.map(v=>v.id)}))};
 await writeFile(join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
 console.log(`${browserName}: ${rows.length} stories, ${failed.length} failures; full unfiltered evidence ${out}`);
 assert.equal(failed.length,0,'Actual story render/axe failures are retained in summary.json');
}finally{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));await rm(scratch,{recursive:true,force:true});}
