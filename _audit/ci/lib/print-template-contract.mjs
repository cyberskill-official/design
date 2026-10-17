import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {parse} from 'parse5';
import postcss from 'postcss';
export function listPrintTemplates(root) {
  const contract=JSON.parse(readFileSync(join(root,'_audit/fixtures/print-template-contract.json'),'utf8'));
  assert.equal(contract.schemaVersion,1);
  assert(contract.templates.length>0,'Empty print contract');
  const walk=folder=>readdirSync(join(root,folder),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(folder+'/'+e.name):[folder+'/'+e.name]);
  const observed=[];
  for(const entry of walk('templates').filter(p=>p.endsWith('.dc.html'))) {
    const nodes=[];const visit=n=>{nodes.push(n);for(const c of n.childNodes||[])visit(c);if(n.content)visit(n.content);};
    visit(parse(readFileSync(join(root,entry),'utf8')));
    const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
    const markers=nodes.filter(n=>n.tagName==='meta'&&attr(n,'name')==='omelette-owns-print');
    if(!markers.length)continue;
    assert.equal(markers.length,1,'Duplicate print marker: '+entry);
    assert.equal(attr(markers[0],'content'),'1','Disabled print marker: '+entry);
    const sizes=[];
    for(const n of nodes.filter(n=>n.tagName==='style'))postcss.parse((n.childNodes||[]).map(c=>c.value||'').join('')).walkAtRules('page',r=>r.walkDecls('size',d=>sizes.push(d.value.toLowerCase())));
    assert(sizes.length&&sizes.every(s=>s===sizes[0])&&['a4','letter'].includes(sizes[0]),'Missing/ambiguous page size: '+entry);
    observed.push({folder:dirname(entry).split('/').pop(),entry,format:sizes[0]==='a4'?'A4':'Letter'});
  }
  observed.sort((a,b)=>a.entry.localeCompare(b.entry,'en'));
  assert.deepEqual(observed,contract.templates,'Print coverage or page-size contract changed; review the explicit fixture instead of silently reducing export coverage');
  return observed;
}
