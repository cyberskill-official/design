import {parse} from '@babel/parser';
/** Extract statically named module/resource edges. No evaluation of source code. */
export function moduleResources(source) {
 const ast=parse(source,{sourceType:'unambiguous',plugins:['jsx'],createImportExpressions:true});
 const references=[],dynamic=[];
 const literal=node=>node?.type==='StringLiteral'?node.value:node?.type==='TemplateLiteral'&&node.expressions.length===0?node.quasis[0].value.cooked:null;
 const add=(node,kind,arg)=>{
  const value=literal(arg);
  if(value===null) dynamic.push({kind,line:node.loc.start.line});
  else references.push({kind,value,line:node.loc.start.line});
 };
 function visit(node){
  if(!node||typeof node!=='object') return;
  if(['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration'].includes(node.type)&&node.source) add(node,'module',node.source);
  if(node.type==='ImportExpression') add(node,'import',node.source);
  if(node.type==='CallExpression'&&node.callee?.type==='Identifier'&&node.callee.name==='require') add(node,'require',node.arguments[0]);
  if(node.type==='NewExpression'&&node.callee?.type==='Identifier'&&node.callee.name==='URL'){
   const base=node.arguments[1];
   if(base?.type==='MemberExpression'&&!base.computed&&base.property?.name==='url'&&base.object?.type==='MetaProperty'&&base.object.meta.name==='import'&&base.object.property.name==='meta') add(node,'url',node.arguments[0]);
  }
  for(const [key,value] of Object.entries(node)){
   if(['loc','start','end','comments','tokens'].includes(key)) continue;
   if(Array.isArray(value)) value.forEach(visit); else if(value&&typeof value==='object') visit(value);
  }
 }
 visit(ast.program);
 return {references,dynamic};
}
