// Observed typed-export coverage. This does not resolve the CSS cascade or certify consumers.
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {collectTokenDeclarations} from './lib/token-declarations.mjs';
import {colorFromCss} from './lib/dtcg-values.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function tokenCoverage(graph,dtcg){
  const paths=new Map();
  for(const [group,entries] of Object.entries(dtcg))if(!group.startsWith('$'))for(const [name,definition] of Object.entries(entries))if(!name.startsWith('$')){
    if(paths.has(name))throw Error('Duplicate typed token '+name);
    paths.set(name,{path:group+'.'+name,type:definition.$type});
  }
  const names=[...new Set(graph.declarations.filter(d=>d.visibility==='public').map(d=>d.name))].sort();
  for(const name of paths.keys())if(!names.includes(name))throw Error('Typed token absent from CSS: '+name);
  const tokens=names.map(name=>{
    const declarations=graph.declarations.filter(d=>d.name===name&&d.visibility==='public').map(d=>{
      let representation={kind:'css-expression',css:d.value};
      try{representation={kind:'literal-color',type:'color',value:d.value==='transparent'?{colorSpace:'srgb',components:[0,0,0],alpha:0}:colorFromCss(d.value)};}catch{}
      if(name==='--cs-style-pack'&&d.value==='liquid-glass')representation={kind:'style-pack-identifier',value:d.value};
      return {order:d.order,sourcePath:d.sourcePath,line:d.line,context:d.context,important:d.important,css:d.value,representation};
    });
    const base=paths.get(name)||null;
    const kinds=[...new Set(declarations.map(d=>d.representation.kind))];
    return {name,baseDtcg:base,coverage:base?'base-typed_scope-values-require-resolution':kinds.length===1&&kinds[0]==='literal-color'?'scoped-literal-color_not-in-base-export':kinds.length===1&&kinds[0]==='style-pack-identifier'?'style-metadata_not-a-portable-value':'css-expression_requires-adapter',declarations};
  });
  return {schemaVersion:1,interpretation:'Source declaration coverage only. Base DTCG membership does not certify every scoped value. Literal color representations preserve source scopes; they are not root defaults or native support. Expressions remain unresolved and style metadata is not assigned an invented DTCG type.',sources:graph.sources,tokens};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  tokenCoverage(collectTokenDeclarations(root),JSON.parse(readFileSync(new URL('../tokens/tokens.dtcg.json',import.meta.url),'utf8')));
  console.log('PASS token coverage: every public name, typed base membership and source-scoped representations');
}
