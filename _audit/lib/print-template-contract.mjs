// Browser inspection of inert source. No template scripts or external styles run.
export function inspectPrintTemplate(html) {
  if(typeof html!=='string')throw Error('Template source must be text');
  const template=document.createElement('template');template.innerHTML=html;const nodes=[];
  const visit=node=>{nodes.push(node);for(const child of node.childNodes||[])visit(child);if(node.nodeType===1&&node.tagName==='TEMPLATE')visit(node.content);};
  visit(template.content);
  const markers=nodes.filter(n=>n.nodeType===1&&n.tagName==='META'&&n.getAttribute('name')==='omelette-owns-print');
  if(!markers.length)return {ownsPrint:false};
  if(markers.length!==1||markers[0].getAttribute('content')!=='1')throw Error('Duplicate or disabled print ownership marker');
  const sizes=[];
  for(const node of nodes.filter(n=>n.nodeType===1&&n.tagName==='STYLE')) {
    const sheet=new CSSStyleSheet();sheet.replaceSync(node.textContent);
    const rules=list=>{for(const rule of list){if(rule.type===CSSRule.PAGE_RULE){const size=rule.style.getPropertyValue('size').trim().toLowerCase();if(size)sizes.push(size);}if(rule.cssRules)rules(rule.cssRules);}};
    rules(sheet.cssRules);
  }
  if(!sizes.length||sizes.some(size=>size!==sizes[0])||!['a4','letter'].includes(sizes[0]))throw Error('Missing, conflicting or unsupported parsed page size');
  return {ownsPrint:true,format:sizes[0]==='a4'?'A4':'Letter'};
}

export function printContractEntries(contract) {
  if(contract?.schemaVersion!==1||!Array.isArray(contract.templates)||!contract.templates.length)throw Error('Missing or empty explicit print contract');
  const entries=new Map();
  for(const row of contract.templates) {
    if(typeof row?.entry!=='string'||!/^templates\/[^/]+\/[^/]+\.dc\.html$/.test(row.entry)||row.entry.split('/').some(p=>p==='.'||p==='..')||row.folder!==row.entry.split('/')[1]||!['A4','Letter'].includes(row.format))throw Error('Invalid print contract entry');
    if(entries.has(row.entry))throw Error('Duplicate print contract entry: '+row.entry);
    entries.set(row.entry,row);
  }
  return entries;
}
