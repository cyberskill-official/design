import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {createRequire} from 'node:module';
const source = `
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ConfidenceMeter} from './components/ai/ConfidenceMeter.jsx';
import {Rating} from './components/forms/Rating.jsx';
import {InputOTP} from './components/forms/InputOTP.jsx';
import {Skeleton} from './components/feedback/Skeleton.jsx';
import {DataTable} from './components/datatable/DataTable.jsx';
const definitions=[[ConfidenceMeter,'segments',{}],[Rating,'max',{}],[InputOTP,'length',{}],[Skeleton,'lines',{}],[DataTable,'loadingRows',{state:'loading',columns:[{key:'name',header:'Name'}],rows:[]}]];
export const results=[];
for(const lang of ['en','vi'])for(const [component,prop,props]of definitions)for(const count of [undefined,3,2.5,0.5,0,-2,NaN,Infinity,-Infinity,2**32]){
 try {results.push({name:component.name,prop,lang,count:String(count),html:renderToStaticMarkup(React.createElement(component,{...props,[prop]:count,lang}))});}
 catch(error){results.push({name:component.name,prop,lang,count:String(count),error:String(error)});}
}`;
const code=buildSync({stdin:{contents:source,resolveDir:process.cwd()},bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text;
const module={exports:{}};
new Function('module','exports','require',code)(module,module.exports,createRequire(import.meta.url));
const {results}=module.exports;
assert.equal(results.length,100);
assert.deepEqual(results.filter(result=>result.error),[],'Every declared count component must render without an array-length crash');
assert(results.every(result=>result.html.length>0),'Zero line/star/box counts still render their documented container or block view');
console.log('PASS source SSR: five count components × ten count cases × EN/VI; nonfinite and unrepresentable values do not crash rendering.');
