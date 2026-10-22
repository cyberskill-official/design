import assert from 'node:assert/strict';
import {captureReference} from '../../scripts/generate-static-html-reference.mjs';
const browserName=process.env.CS_TEST_BROWSER||'chromium';
const reference=await captureReference({browserName});
const flatten=nodes=>nodes.flatMap(node=>typeof node==='string'?[]:[node,...flatten(node.children)]);
for(const entry of reference.components){
 const elements=flatten(entry.semanticDOM);
 assert(elements.length>0,entry.name+': declared fixture must render actual DOM (including its documented child/context)');
 const ids=elements.map(node=>node.attributes.id).filter(Boolean);
 assert.equal(new Set(ids).size,ids.length,entry.name+': captured IDs remain unique');
 const idSet=new Set(ids);
 for(const node of elements)for(const attr of ['for','aria-labelledby','aria-describedby','aria-controls','aria-activedescendant']){
  const refs=node.attributes[attr];if(!refs)continue;
  for(const id of refs.split(/\s+/))assert(idSet.has(id)||id==='reference-anchor',entry.name+': dangling '+attr+'='+id);
 }
 assert(!/<script\b|\son[a-z]+\s*=/i.test(entry.html),entry.name+': no executable markup in reference');
}
const byName=name=>reference.components.find(entry=>entry.name===name);
assert(byName('Button').html.includes('&lt;example&gt;')&&byName('Button').html.includes('&amp;'));
assert(flatten(byName('Dialog').semanticDOM).some(node=>node.attributes.role==='dialog'),'Open Dialog fixture records actual dialog DOM');
assert(flatten(byName('Menu').semanticDOM).some(node=>node.attributes.role==='menu'),'Open Menu fixture records actual menu DOM');
assert(flatten(byName('Toolbar').semanticDOM).some(node=>node.tag==='button'),'Typed toolbar fixture renders its actual action');
assert(byName('FormFieldArray').wrapper.component==='Form','Context-dependent array uses declared Form wrapper');
assert.equal(byName('OverlayProvider').referenceKind,'context-only');
console.log('PASS '+browserName+': '+reference.components.length+' source-bound actual mounts, unique IDs/resolved references, escaped text, open overlay DOM and context-only boundary. No all-state/interaction/manual AT acceptance claimed.');
