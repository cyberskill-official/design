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
console.log(`PASS CSS lint: ${files.length} authored/generated stylesheets; unknown property, syntax and invalid hex mutations rejected; standard/custom/vendor/modern syntax accepted. No glob engine is used.`);
