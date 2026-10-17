import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {listPublicComponents} from './storybook-inventory.mjs';
const expected=listPublicComponents().map(row=>row.primary).sort();
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const controls=[];
let result;
await withBrowserFixture(async page=>{
  await page.goto(new URL('/_audit/axe-smoke.html',page.url()).href);
  await page.waitForFunction(()=>window.__axesmoke,null,{timeout:300000});
  result=await page.evaluate(()=>({verdict:__axesmoke,axeVersion:axe.version,reactVersion:React.version}));
  assert.equal(result.axeVersion,'4.10.0');
  assert.equal(result.verdict.pass,true,JSON.stringify(result.verdict.fails));
  assert.equal(result.verdict.components,expected.length);
  assert.equal(result.verdict.scenes.length,expected.length*2);
  assert.equal(result.verdict.scans,expected.length*4);
  assert.deepEqual(result.verdict.fails,[]);
  for(const lang of ['en','vi']){
    const scenes=result.verdict.scenes.filter(s=>s.lang===lang);
    assert.deepEqual(scenes.map(s=>s.name).sort(),expected);
    for(const scene of scenes){
      assert.equal(scene.error,null);
      assert.deepEqual(scene.scans.map(s=>s.state),['default','expanded']);
      assert.equal(scene.expansion.ok,true);
      assert.ok(scene.scans.every(s=>s.seriousCritical.length===0));
    }
    for(const name of ['ContextMenu','Tooltip','HoverCard','Popover','Popconfirm']){
      const scene=scenes.find(s=>s.name===name);
      assert.ok(scene.expansion.detail.startsWith('exposed '),name+': expansion asserted');
      assert.equal(scene.scans[1].inertNodes,0,name+': isolated surface has no inert neighbor');
    }
  }
  result.browserVersion=page.context().browser().version();
},{browserName});
// Preflight faults must produce explicit terminal failures without scanning.
for(const [file,message] of [['/_audit/vendor/axe.min.js','axe-core vendor failed to load'],['/_audit/lib/axe-fixtures.js','axe fixtures missing'],['/_ds_bundle.js','bundle namespace missing']]){
  await withBrowserFixture(async page=>{
    await page.route('**'+file,route=>route.abort());
    await page.goto(new URL('/_audit/axe-smoke.html',page.url()).href);
    await page.waitForFunction(()=>window.__axesmoke,null,{timeout:10000});
    const verdict=await page.evaluate(()=>window.__axesmoke);
    assert.equal(verdict.pass,false);
    assert.equal(verdict.scans,0);
    assert.equal(verdict.components,0);
    assert.ok(verdict.fails.some(s=>s.includes(message)));
    controls.push({case:'missing '+file,verdict});
  },{browserName});
}
// Waiting for entry motion must still reject a genuinely unreadable settled action.
await withBrowserFixture(async page=>{
  await page.addScriptTag({url:'/_audit/vendor/axe.min.js'});
  await page.addScriptTag({url:'/_audit/lib/axe-fixtures.js'});
  const contrast=await page.evaluate(async()=>{
    const stage=document.getElementById('fixture'),h=React.createElement;
    document.body.style.minHeight='100vh';document.body.style.background='#efe6d8';
    Object.assign(stage.style,{position:'fixed',left:'-6000px',top:'0',width:'800px'});
    const scene=__axeFixtures.buildScene(h,CS,'AlertDialog',{lang:'en'});
    renderFixture(h('section',{lang:'en'},...scene.nodes));
    await __axeFixtures.settleSceneForScan(stage);
    const normal=await axe.run(stage,{runOnly:['color-contrast']});
    const style=document.createElement('style');
    style.textContent='.cs-alert-dialog__confirm{color:#e7d4d1!important;background:#b04437!important}';
    document.head.appendChild(style);
    await __axeFixtures.settleSceneForScan(stage);
    const broken=await axe.run(stage,{runOnly:['color-contrast']});
    const action=broken.violations.find(v=>v.id==='color-contrast'&&v.nodes.some(n=>n.html.includes('cs-alert-dialog__confirm')));
    return {normalSerious:normal.violations.filter(v=>v.impact==='serious'||v.impact==='critical'),normalAction:normal.passes.find(v=>v.id==='color-contrast'&&v.nodes.some(n=>n.html.includes('cs-alert-dialog__confirm')))||null,brokenAction:action||null};
  });
  assert.deepEqual(contrast.normalSerious,[]);
  assert.ok(contrast.normalAction,'Valid settled confirmation must actually receive a contrast check');
  assert.ok(contrast.brokenAction,'Unreadable settled confirmation must fail contrast');
  controls.push({case:'settled valid action passes and deliberately unreadable action is rejected',...contrast});
},{browserName});
await withBrowserFixture(async page=>{
  await page.addScriptTag({url:'/_audit/lib/axe-fixtures.js'});
  const inventory=await page.evaluate(()=>{
    const h=React.createElement,fx=__axeFixtures,rows=[];
    for(const lang of ['en','vi']) for(const name of fx.names){
      const scene=fx.buildScene(h,CS,name,{lang});
      if(name==='Toast'){
        if(scene.nodes.length!==1 || scene.nodes[0].type!==CS.ToastStack || scene.nodes[0].props.children.type!==CS.Toast) throw new Error('Toast host shape');
      }else if(name==='Tour'){
        if(scene.nodes.length!==2 || scene.nodes[0].props.id!=='axe-tour-anchor-'+lang || scene.nodes[1].type!==CS.Tour) throw new Error('Tour anchor shape');
      }else if(scene.nodes.length!==(name==='Chart'?2:1) || scene.nodes.some(node=>node.type!==CS[name])) throw new Error(name+': primary scene shape');
      rows.push(lang+':'+name);
    }
    let unknown=false,missing=false;
    try{fx.buildScene(h,CS,'MissingPrimary',{lang:'en'});}catch(e){unknown=String(e).includes('Unknown primary');}
    const broken={...CS}; delete broken.ContextMenu;
    try{fx.buildScene(h,broken,'ContextMenu',{lang:'en'});}catch(e){missing=String(e).includes('Missing fixture exports');}
    return {rows,unknown,missing};
  });
  assert.equal(new Set(inventory.rows).size,expected.length*2);
  assert.equal(inventory.unknown,true);assert.equal(inventory.missing,true);
  controls.push({case:'exact primary scene shapes plus unknown/missing-export negatives',...inventory});
},{browserName});
const report={recordedAt:new Date().toISOString(),browserName,nodeVersion:process.version,result,controls,scope:'Finite default/expanded EN/VI smoke with exact vendored axe; no manual accessibility, physical input, assistive-technology, conformance or acceptance claim.'};
if(process.env.CS_AXE_SCENE_REPORT)writeFileSync(process.env.CS_AXE_SCENE_REPORT,JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${browserName}: ${expected.length*2} scenes/${expected.length*4} scans and5 fault/contrast/shape controls`);
