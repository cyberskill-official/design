import {parse} from '@babel/parser';
/** Direct rendered literals only. Does not resolve variables, props or translation calls. */
export function jsxUiLiterals(source) {
 const ast=parse(source,{sourceType:'module',plugins:['jsx']});
 const literals=[];
 const add=(value,node)=>{const text=value.replace(/\s+/g,' ').trim();if(/[A-Za-z]/.test(text))literals.push({text,line:node.loc.start.line})};
 const expression=node=>{
  if(!node)return;
  if(node.type==='StringLiteral')add(node.value,node);
  else if(node.type==='TemplateLiteral')node.quasis.forEach(q=>add(q.value.cooked??q.value.raw,q));
  else if(node.type==='ConditionalExpression'){expression(node.consequent);expression(node.alternate)}
  else if(node.type==='LogicalExpression'||(node.type==='BinaryExpression'&&node.operator==='+')){expression(node.left);expression(node.right)}
  else if(node.type==='ArrayExpression')node.elements.forEach(expression);
  else if(node.type==='ParenthesizedExpression')expression(node.expression);
 };
 const visit=node=>{
  if(!node||typeof node!=='object')return;
  if(node.type==='JSXElement'||node.type==='JSXFragment')for(const child of node.children){
   if(child.type==='JSXText')add(child.value,child);
   else if(child.type==='JSXExpressionContainer')expression(child.expression);
  }
  for(const [key,value] of Object.entries(node)){
   if(['loc','start','end','comments','tokens'].includes(key))continue;
   if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value);
  }
 };
 visit(ast);return literals;
}
