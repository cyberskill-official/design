import {parse} from '@babel/parser';

// Static key ownership only; this does not prove that a label is rendered or
// identify every caller-content flow. Dynamic key domains require explicit review.
export function localeKeyUsage(source) {
  const ast = parse(source, {sourceType:'module', plugins:['jsx']});
  const bindings = new Map();
  const calls = [];
  const walk = (node, visit) => {
    if (!node || typeof node !== 'object') return;
    visit(node);
    for (const [key,value] of Object.entries(node)) {
      if (['loc','comments','tokens'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(child=>walk(child,visit));
      else if (value && typeof value === 'object') walk(value,visit);
    }
  };
  const namespace = node => node?.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'makeT' && node.arguments[0]?.type === 'StringLiteral' ? node.arguments[0].value : null;
  walk(ast,node=>{
    if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && namespace(node.init)) bindings.set(node.id.name,namespace(node.init));
  });
  const keys = node => {
    if (node?.type === 'StringLiteral') return [node.value];
    if (node?.type === 'ConditionalExpression') {
      const a=keys(node.consequent),b=keys(node.alternate);
      return a && b ? [...new Set([...a,...b])] : null;
    }
    return null;
  };
  walk(ast,node=>{
    if(node.type !== 'CallExpression') return;
    const ns = namespace(node.callee) || (node.callee.type === 'Identifier' ? bindings.get(node.callee.name) : null);
    if(!ns) return;
    const arg=node.arguments[0];
    calls.push({namespace:ns, keys:keys(arg), expression:arg ? source.slice(arg.start,arg.end) : '', line:node.loc.start.line});
  });
  return calls;
}
