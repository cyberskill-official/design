import {parse} from '@babel/parser';
import {exportedFunction} from '../../../scripts/lib/component-export.mjs';
/** Explicit first-parameter destructuring only; rest forwarding and runtime types are separate contracts. */
export function runtimeProps(source,name){
 const ast=parse(source,{sourceType:'module',plugins:['jsx']});
 const resolved=exportedFunction(ast,name);
 const fn=resolved?.node;
 let param=fn?.params[0];if(param?.type==='AssignmentPattern')param=param.left;
 if(param?.type!=='ObjectPattern')throw new Error(`${name}: unsupported runtime prop declaration; review parser coverage`);
 return param.properties.filter(node=>node.type==='ObjectProperty').map(node=>{
  if(node.computed)throw new Error(`${name}: computed prop key requires review`);
  return node.key.name??node.key.value;
 });
}
