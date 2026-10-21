import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
import {parse} from 'yaml';
import {scanStoryDocument,storyWcagPolicy} from '../../scripts/lib/storybook-runtime-scan.mjs';
const authority=await readFile(resolve('_audit/axe-smoke.html'),'utf8');
assert.ok(authority.includes("values:['wcag2a','wcag2aa']"));
assert.deepEqual(storyWcagPolicy,{tags:['wcag2a','wcag2aa'],failureImpacts:['serious','critical']});
assert.ok(authority.includes("v.impact==='serious'||v.impact==='critical'")||authority.includes("v.impact === 'serious' || v.impact === 'critical'"));
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 const axeSource=await readFile(resolve('_audit/vendor/axe.min.js'),'utf8');
 const fixture=content=>`<!doctype html><html lang="en"><head><title>Scanner regression</title></head><body class="sb-show-main"><main id="storybook-root"><h1>Scanner regression</h1>${content}</main></body></html>`;
 await page.setContent(fixture('<button>Continue</button>'));
 await page.addScriptTag({content:axeSource});
 const valid=await scanStoryDocument(page,null);
 assert.equal(valid.axeVersion,'4.10.0');assert.deepEqual(valid.product.violations,[]);
 await page.setContent('<!doctype html><html lang="en"><title>Story fragment</title><body class="sb-show-main"><div id="storybook-root"><button>Continue</button></div></body></html>');
 await page.addScriptTag({content:axeSource});
 const fragment=await scanStoryDocument(page,null);assert.equal(fragment.passed,true);assert.ok(fragment.wholeDocument.violations.some(v=>v.id==='landmark-one-main'));assert.ok(fragment.wholeDocument.violations.some(v=>v.id==='page-has-heading-one'));
 await page.setContent(fixture('<button></button><div role="checkbox">Selection</div>'));
 await page.addScriptTag({content:axeSource});
 const broken=await scanStoryDocument(page,null);
 assert.ok(broken.product.violations.some(v=>v.id==='button-name'),'Unnamed button must be rejected');
 assert.ok(broken.product.violations.some(v=>v.id==='aria-required-attr'),'Missing owned ARIA attributes must be rejected');
 assert.equal(valid.passed,true);assert.equal(broken.passed,false);
 await page.setContent(fixture('<button>Continue</button>')+'<div data-cs-floating-root><button></button></div>');
 await page.addScriptTag({content:axeSource});
 const portal=await scanStoryDocument(page,null);assert.equal(portal.coverage.externalPortalCount,1);assert.deepEqual(portal.coverage.unknown,[]);assert.equal(portal.passed,false);assert.ok(portal.wcag.violations.some(v=>v.id==='button-name'));
 await page.setContent(fixture('<button>Continue</button>')+'<div id="unregistered-product-node">Unexpected external component</div>');
 await page.addScriptTag({content:axeSource});
 const unknown=await scanStoryDocument(page,null);assert.equal(unknown.passed,false);assert.ok(unknown.coverage.unknown.some(n=>n.id==='unregistered-product-node'));
 await page.setContent('<body class="sb-show-errordisplay"><div class="sb-errordisplay">Render failed</div><div id="storybook-root"></div></body>');
 await assert.rejects(scanStoryDocument(page,null),/Storybook render error/);
 console.log('PASS actual axe scanner: valid document, unnamed button, missing ARIA, registered portal, unknown external node and render failure controls');
}finally{await browser.close();}

const workflow=parse(await readFile('.github/workflows/design-system-gates.yml','utf8'));
const steps=workflow.jobs['storybook-build'].steps;
const buildIndex=steps.findIndex(step=>step.run==='npm run build:site');
const scanIndex=steps.findIndex(step=>step.run==='node _audit/ci/lib/run-browsers.mjs _audit/ci/test-storybook-runtime-browser.mjs');
assert.ok(scanIndex>buildIndex&&buildIndex>=0,'Actual three-engine scan must run after site build');
assert.equal(steps[scanIndex].if,undefined);assert.equal(steps[scanIndex]['continue-on-error'],undefined);
const retain=steps.find(step=>step.with?.name==='storybook-runtime-accessibility');
assert.equal(retain.if, 'always()');
assert.deepEqual(retain.with.path.trim().split(/\s+/), [
 'test-results/storybook-runtime-*/',
 'test-results/component-scenario-stories/',
], 'Retain both complete story scans and owned play evidence');
const playsIndex = steps.findIndex(step => step.run === 'node _audit/ci/lib/run-browsers.mjs _audit/ci/test-component-scenario-stories-browser.mjs');
assert(playsIndex > scanIndex, 'Owned scenario plays run after site build and whole-story scans');
assert.equal(steps[playsIndex].if, undefined);
assert.equal(steps[playsIndex]['continue-on-error'], undefined);
