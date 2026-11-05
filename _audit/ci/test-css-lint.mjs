import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {lintCss} from '../../scripts/lib/css-defect-lint.mjs';
const cases=[
 ['valid standard/custom/vendor properties',':root{--cs-fixture:#45210E}.cs-fixture{color:var(--cs-fixture);-webkit-appearance:none;appearance:none;container-type:inline-size}',false],
 ['unknown property','.cs-fixture{colro:red}',true],
 ['unclosed syntax','.cs-fixture{color:red',true],
 ['invalid hex','.cs-fixture{color:#12xx00}',true],
 ['valid modern syntax','.cs-fixture{color:color-mix(in oklab,var(--cs-fixture) 25%,transparent);text-wrap:balance;min-block-size:100dvh}',false],
 ['invalid custom-property hex',':root{--bad:#12345}',true],
 ['invalid nested fallback','.fixture{color:var(--missing,#zzzzzz)}',true],
 ['URL fragments and quoted copy','.fixture{background:url("image.svg#not-a-hex");content:"#not-a-color"}',false],
 ['font descriptors','@font-face{font-family:Test;src:url(font.woff2);font-display:swap}',false],
 ['nested unknown property','@media(width>20px){.fixture{colro:red}}',true],
];
for(const [name,code,expected]of cases)assert.equal(lintCss(code).length>0,expected,name);
const files=['styles.css',...['tokens','base'].flatMap(dir=>readdirSync(dir,{withFileTypes:true}).filter(entry=>entry.isFile()&&entry.name.endsWith('.css')).map(entry=>dir+'/'+entry.name))];
assert(files.length>1,'Real shared CSS sources must be linted');
for(const path of files)assert.deepEqual(lintCss(readFileSync(path,'utf8'),{from:path}),[],path);
const componentsCss=readFileSync('base/components.css','utf8'),shellCss=readFileSync('base/shell.css','utf8'),controlsCss=readFileSync('base/controls.css','utf8'),dataCss=readFileSync('base/data.css','utf8'),interactionCss=readFileSync('base/interaction.css','utf8'),typographyCss=readFileSync('base/typography.css','utf8'),typographyTokensCss=readFileSync('tokens/typography.css','utf8');
assert(!componentsCss.includes('rgba(69, 33, 14, 0.18)'),'base/components.css must use theme-adaptive border subtle token/variable instead of hardcoded light-umber rgba');
assert(!shellCss.includes('rgba(31, 19, 11, 0.42)')&&!shellCss.includes('rgba(31, 19, 11, 0.22)'),'base/shell.css must use theme-adaptive surface scrim and drawer shadows instead of hardcoded rgba');
assert(!controlsCss.includes('rgba(26, 17, 8,'),'base/controls.css must use theme-adaptive surface scrim / token color-mix instead of hardcoded rgba(26, 17, 8, ...)');
assert(!interactionCss.includes('rgba(69, 33, 14, 0.24)'),'base/interaction.css must use theme-adaptive hover shadow instead of hardcoded rgba');
assert(dataCss.includes('.cs-card--raised')&&dataCss.includes('.cs-card--featured'),'base/data.css must expose .cs-card--raised and .cs-card--featured surface pacing modifiers');
assert(typographyCss.includes('.cs-tabular')&&typographyCss.includes('.cs-prose')&&typographyCss.includes('.cs-display--fluid')&&typographyCss.includes('.cs-h1--fluid'),'base/typography.css must expose tabular, prose measure, and fluid display/h1 utilities');
assert(componentsCss.includes('.cs-table__cell--numeric'),'base/components.css must expose .cs-table__cell--numeric for tabular numeric columns');
assert(!/Expression-overridable|Expressions retune/i.test(typographyTokensCss),'tokens/typography.css must not reference the retired Expression axis');
console.log(`PASS CSS lint: ${files.length} authored/generated stylesheets; unknown property, syntax and invalid hex mutations rejected; standard/custom/vendor/modern syntax accepted. No glob engine is used.`);
