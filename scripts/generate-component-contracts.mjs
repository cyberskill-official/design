// Source facts for agent discovery. Declared keyboard prose is not an a11y certification.
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parse} from '@babel/parser';
import {exportedFunction} from './lib/component-export.mjs';
const root = new URL('../',import.meta.url), read = path => readFileSync(new URL(path,root),'utf8');
export function extractRuntimeProps(source, name) {
  const ast = parse(source,{sourceType:'module',plugins:['jsx']});
  const resolved = exportedFunction(ast, name);
  const declaration = resolved?.node;
  const parameter = declaration?.params[0];
  const pattern = parameter?.type === 'AssignmentPattern' ? parameter.left : parameter;
  const props = [], defaults = {};
  let rest = null;
  if (pattern?.type === 'ObjectPattern') for (const prop of pattern.properties) {
    if (prop.type === 'RestElement') {rest = prop.argument.name; continue;}
    const key = prop.key.name ?? prop.key.value; props.push(key);
    if (prop.value?.type === 'AssignmentPattern') defaults[key] = source.slice(prop.value.right.start,prop.value.right.end);
  }
  return {props,defaultExpressions:defaults,restBinding:rest,analysis:pattern?.type === 'ObjectPattern'?(resolved.kind === 'forward-ref'?'forward-ref-destructuring':'direct-export-destructuring'):'not-a-direct-destructured-function'};
}
export function buildContracts(api,css,readSource) {
  return {schemaVersion:1,interpretation:'Source-bound facts, not complete authored anatomy/accessibility contracts. Default expressions are source text, not evaluated values. Rest bindings do not prove DOM forwarding. Prompt keyboard text is a declared contract; tests and manual AT acceptance remain separate.',components:api.exports.filter(item=>item.kind==='component').map(item=>{
    const source=readSource(item.sourcePath), prompt=item.promptPath?readSource(item.promptPath):'';
    const runtime=extractRuntimeProps(source,item.name), props=item.props.map(prop=>api.propDefinitions[prop.definition]);
    const hooks=css.components.find(component=>component.sourcePath===item.sourcePath)?.hooks || [];
    return {name:item.name,sourcePath:item.sourcePath,declarationPath:item.declarationPath,promptPath:item.promptPath,sourceSha256:createHash('sha256').update(source).digest('hex'),authoredProps:props.filter(prop=>prop.origin==='authored').map(prop=>prop.name),inheritedProps:props.filter(prop=>prop.origin==='inherited').map(prop=>prop.name),runtime,declaredKeyboard:prompt.split('\n').find(line=>line.startsWith('Keyboard:'))?.slice(9).trim() || null,classHooks:hooks,contractCompleteness:'source-facts-only'};
  })};
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const next=JSON.stringify(buildContracts(JSON.parse(read('components/api-index.json')),JSON.parse(read('components/css-index.json')),read),null,2)+'\n';
 if(process.argv.includes('--check')) {if(read('components/contracts.json')!==next)throw Error('Component source contracts stale; run npm run build:component-contracts');}
 else writeFileSync(new URL('components/contracts.json',root),next);
 console.log('PASS source-derived component contracts; complete authored anatomy/a11y acceptance remains separate');
}
