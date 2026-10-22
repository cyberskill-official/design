import assert from 'node:assert/strict';
import {parse as parseHtml} from 'parse5';
import {parse} from '@babel/parser';
import {atomicStoryIndex} from './atomic-story-index.mjs';
const families={button:'Core',dialog:'Core',textfield:'Forms',forms:'Forms',data:'Data & layout',datatable:'Data & layout',feedback:'Feedback & status',navigation:'Navigation',overlays:'Overlays',ai:'AI-native',logo:'Brand',icon:'Brand',brand:'Brand',i18n:'Localization'};
export function publicInventory(manifest) {
  const groups=new Map(),names=new Set();
  assert(Array.isArray(manifest.components)&&manifest.components.length>0,'Public component catalog required');
  for(const item of manifest.components) {
    assert(/^[A-Za-z_$][\w$]*$/.test(item.name)&&!names.has(item.name),'Unique JavaScript export required');names.add(item.name);
    assert(['component','constant','hook'].includes(item.kind),'Known export kind required');
    const key=item.sourcePath.split('/')[1];assert(Object.hasOwn(families,key),`Unclassified source family: ${item.sourcePath}`);
    const family=families[key];assert(family,`Unclassified source family: ${item.sourcePath}`);
    if(!groups.has(family))groups.set(family,[]);groups.get(family).push(item);
  }
  for(const members of groups.values())members.sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);
  return {groups,names:[...names].sort()};
}
export function atomicMetadata(html, publicNames) {
  const scripts=[];function walk(n){if(n.tagName==='script'&&!n.attrs?.some(a=>a.name==='src'))scripts.push((n.childNodes||[]).map(c=>c.value||'').join(''));for(const c of n.childNodes||[])walk(c)}walk(parseHtml(html));
  let entries;
  for(const text of scripts.filter(x=>x.trim())) {
    const ast=parse(text,{sourceType:'script',plugins:['jsx']});
    if(publicNames){
      const bindings=new Set();
      for(const node of ast.program.body)if(node.type==='VariableDeclaration')for(const decl of node.declarations)if(decl.id.type==='ObjectPattern'&&decl.init?.name==='NS')for(const prop of decl.id.properties)bindings.add(prop.value.name);
      const visit=node=>{if(!node||typeof node!=='object')return;if(node.type==='JSXOpeningElement'&&node.name.type==='JSXIdentifier'&&bindings.has(node.name.name))assert(publicNames.includes(node.name.name),`Rendered export missing from catalog: ${node.name.name}`);for(const[key,value]of Object.entries(node)){if(['loc','extra','comments'].includes(key))continue;if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value)}};visit(ast);
    }
    for(const n of ast.program.body)if(n.type==='VariableDeclaration')for(const item of n.declarations)if(item.id.name==='STORIES') {
    assert(!entries&&item.init.type==='ArrayExpression','One actual Atomic story array required');
    entries=item.init.elements.map(node=>{
      const value=key=>node.properties.find(p=>p.key?.name===key)?.value;
      assert(value('name')?.type==='StringLiteral'&&value('tier')?.type==='StringLiteral','Literal story metadata required');
      assert(['Atom','Molecule','Organism'].includes(value('tier').value),'Known composition tier required');
      return {name:value('name').value,tier:value('tier').value};
    });
  }
  }
  assert(entries?.length,'Actual Atomic stories required');return entries;
}
export function replaceOwned(text,label,value) {
  const prefix=label==='CATALOG COMPONENT BINDINGS'?'// ':'';
  const a=`${prefix}<!-- BEGIN ${label} -->`,b=`${prefix}<!-- END ${label} -->`;
  assert.equal(text.split(a).length,2,`One ${label} start required`);assert.equal(text.split(b).length,2,`One ${label} end required`);
  return text.slice(0,text.indexOf(a))+a+'\n'+value+'\n'+b+text.slice(text.indexOf(b)+b.length);
}
export function inventoryOutputs(manifest,readme,atomic) {
  const {groups,names}=publicInventory(manifest),index=atomicStoryIndex(atomic,manifest),metadata=atomicMetadata(atomic,names),tiers=new Map();
  assert.equal(new Set(metadata.map(x=>x.name)).size,metadata.length,'Duplicate Atomic story name');
  for(const row of metadata){const observed=index.stories.find(x=>x.name===row.name);assert(observed&&observed.renderedTargets.length,`No actual render for ${row.name}`);if(!tiers.has(row.tier))tiers.set(row.tier,new Set());for(const name of observed.renderedTargets){assert(names.includes(name),`Unknown rendered export ${name}`);tiers.get(row.tier).add(name)}}
  const rows=[`Generated from the public source catalog and actual Atomic story AST. **${names.length} exports across ${groups.size} import groups**; kinds include components, constants and hooks. Inventory membership is not semantic or human acceptance.`, ''];
  for(const[group,members]of groups)rows.push(`- **${group}** — ${members.map(x=>'`'+x.name+'`'+(x.kind==='component'?'':` (${x.kind})`)).join(', ')}`,'');
  rows.push('**Observed Atomic compositions** — these lists derive from actual JSX render targets in the authored tier stories, including reused children. A target can occur in more than one tier. Context-only providers, constants and hooks do not imply standalone visual specimens.','');
  for(const[tier,targets]of tiers)rows.push(`- **${tier}** — ${[...targets].sort().map(x=>'`'+x+'`').join(', ')}`,'');
  const nextReadme=replaceOwned(readme,'CATALOG COMPONENT INVENTORY',rows.join('\n').trim());
  const binding='const {\n'+names.map(x=>'  '+x+',').join('\n')+'\n} = NS;';
  const nextAtomic=replaceOwned(atomic,'CATALOG COMPONENT BINDINGS',binding);
  return new Map([['README.md',nextReadme],['guidelines/atomic-view.html',nextAtomic]]);
}
