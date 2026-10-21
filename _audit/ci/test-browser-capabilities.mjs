import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {inspectBrowserCapabilities,requireBrowserCapabilities} from '../lib/browser-capabilities.mjs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
const pkg=JSON.parse(readFileSync('package.json','utf8'));
const queries=Array.isArray(pkg.browserslist)?pkg.browserslist:pkg.browserslist?.production;
assert(Array.isArray(queries),'Rolling supported browsers must be explicit in package.json browserslist');
const expected=['last 2 chrome versions','last 2 firefox versions','last 2 safari versions','last 2 ios_saf versions'];
assert.deepEqual(queries.map(query=>query.trim().toLowerCase()).sort(),expected.sort());
// Test the guard's failure contract; this is a mocked API, not an old browser.
assert.equal(inspectBrowserCapabilities({}).pass,false);
assert.throws(()=>requireBrowserCapabilities({}),/colorMixOklab.*containerInlineSize.*relationalHas.*textWrapBalance.*inert/);
assert.throws(()=>requireBrowserCapabilities({CSS:{supports:()=>true},HTMLElement:{prototype:{}}}),/inert/);
const compatibility=JSON.parse(readFileSync('_audit/remediation/browser-compatibility-source.json','utf8'));
assert.match(compatibility.commit,/^[a-f0-9]{40}$/);
const compareVersions=(a,b)=>{const left=a.split('.').map(Number),right=b.split('.').map(Number);for(let i=0;i<Math.max(left.length,right.length);i++){const delta=(left[i]||0)-(right[i]||0);if(delta)return delta;}return 0;};
for(const [name,feature]of Object.entries(compatibility.features))for(const [browser,releases]of Object.entries(compatibility.latestTwoReleasedVersionsInSnapshot)) {
 assert.equal(releases.length,2);
 const support=feature.support[browser]==='mirror'?feature.support.safari:feature.support[browser];
 assert(support&&typeof support.version_added==='string'&&!support.flags&&!support.partial_implementation,`${name}: bounded unflagged BCD support for ${browser}`);
 for(const release of releases)assert(compareVersions(release.version,support.version_added)>=0,`${name} support predates policy snapshot ${browser} ${release.version}`);
}
const require=createRequire(import.meta.url),browserslist=require('browserslist');
const evidence={policy:queries,compatibilityDataCommit:compatibility.commit,latestTwoReleasedVersionsInOfficialSnapshot:compatibility.latestTwoReleasedVersionsInSnapshot,resolvedFromInstalledCaniuse:browserslist(queries),releaseDeviceMatrixExecutionVerified:false,engines:[],limits:'Three installed Playwright engines only. Chromium/Firefox versions are recorded; WebKit is not a Safari or iOS device run. The selected latest-two release/device matrix is not execution-validated: record actual installed engine versions and compare them with the official snapshot. Neither current/previous Safari releases nor physical iOS were tested. Query resolution uses installed caniuse data, which can lag the official snapshot; it is not a live browser-release service.'};
for(const browserName of ['chromium','firefox','webkit'])await withBrowserFixture(async page=>{
 const features=await page.evaluate(inspectBrowserCapabilities);
 assert.equal(features.pass,true,JSON.stringify({browserName,...features}));
 await page.setContent(`<style>
 #mix{color:color-mix(in oklab, #45210E 50%, #F4BA17)}
 #container{container-type:inline-size;container-name:capability;inline-size:80px}
 @container capability (max-width:100px){#contained{--container-query-matched:yes}}
 #relational:has(>span){--relational-matched:yes}
 #balanced{text-wrap:balance;inline-size:160px}
 </style><p id="mix">Color</p><div id="container"><span id="contained">Container</span></div><div id="relational"><span>Child</span></div><p id="balanced">A balanced multiline heading</p><button id="before-inert">Before</button><div inert><button id="inert-child">Unavailable</button></div><button id="after-inert">After</button>`);
 const computed=await page.evaluate(()=>{
  const style=id=>getComputedStyle(document.getElementById(id));
  document.getElementById('before-inert').focus();document.getElementById('inert-child').focus();
  return {mixedColor:style('mix').color,containerQuery:style('contained').getPropertyValue('--container-query-matched').trim(),relational:style('relational').getPropertyValue('--relational-matched').trim(),textWrap:style('balanced').textWrap,inertBlockedProgrammaticFocus:document.activeElement.id==='before-inert'};
 });
 assert.equal(computed.containerQuery,'yes');assert.equal(computed.relational,'yes');
 assert.equal(computed.textWrap,'balance');assert.equal(computed.inertBlockedProgrammaticFocus,true);
 assert(computed.mixedColor&&!['rgb(0, 0, 0)','rgb(69, 33, 14)','rgb(244, 186, 23)'].includes(computed.mixedColor));
 await page.keyboard.press(browserName==='webkit'&&process.platform==='darwin'?'Alt+Tab':'Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'after-inert',browserName+' sequential navigation skips inert subtree');
 evidence.engines.push({browserName,version:page.context().browser().version(),...features,computed});
},{browserName});
if(process.env.CS_BROWSER_COMPAT_EVIDENCE)writeFileSync(process.env.CS_BROWSER_COMPAT_EVIDENCE,JSON.stringify(evidence,null,2)+'\n');
console.log('PASS browser capability guard: color-mix/size-container/:has/text-wrap/inert syntax and actual cascade/focus behavior in three installed engines. '+JSON.stringify(evidence));
