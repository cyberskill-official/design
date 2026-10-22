import{readFileSync,writeFileSync,existsSync}from'node:fs';
import{createHash}from'node:crypto';
import{resolve,relative,dirname}from'node:path';
import{fileURLToPath}from'node:url';
import{extractRuntimeProps}from'./generate-component-contracts.mjs';
export const promptApiFence={begin:'<!-- BEGIN GENERATED DECLARED API v1 -->',end:'<!-- END GENERATED DECLARED API v1 -->'};
const stringify=value=>JSON.stringify(value,null,2)+'\n';
const hash=value=>createHash('sha256').update(value).digest('hex');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const code=value=>{value=String(value).replace(/\r?\n/g,' ').replace(/\|/g,'&#124;');const size=Math.max(0,...[...value.matchAll(/`+/g)].map(m=>m[0].length))+1,mark='`'.repeat(size);return mark+(value.startsWith('`')||value.endsWith('`')?' '+value+' ':value)+mark;};
export function promptParts(source){
 if((source.match(/<!-- (?:BEGIN|END) GENERATED DECLARED API/g)||[]).length!==(source.match(/<!-- (?:BEGIN|END) GENERATED DECLARED API v1 -->/g)||[]).length)throw Error('Unknown Declared API fence version');
 const begins=[...source.matchAll(/<!-- BEGIN GENERATED DECLARED API v1 -->/g)],ends=[...source.matchAll(/<!-- END GENERATED DECLARED API v1 -->/g)];
 if(!begins.length&&!ends.length)return{before:source,after:'',section:null};
 if(begins.length!==1||ends.length!==1||begins[0].index>=ends[0].index)throw Error('Missing, duplicate or reversed Declared API fence');
 const start=begins[0].index,end=ends[0].index+promptApiFence.end.length;
 return{before:source.slice(0,start),after:source.slice(end),section:source.slice(start,end)};
}
export function sourceInventory(root){
 const read=path=>readFileSync(resolve(root,path),'utf8'),api=JSON.parse(read('components/api-index.json')),contracts=JSON.parse(read('components/contracts.json'));
 if(api.schemaVersion!==1||contracts.schemaVersion!==1)throw Error('Unsupported canonical API/source contract schema');
 for(const[path,sha]of Object.entries(api.sourceHashes))if(hash(read(path))!==sha)throw Error('Canonical API input stale: '+path);
 const components=api.exports.filter(e=>e.kind==='component'),manifest=JSON.parse(read('_ds_manifest.json'));
 if(!components.length||!equal(components.map(c=>[c.name,c.sourcePath]).sort(),manifest.components.filter(c=>c.kind==='component').map(c=>[c.name,c.sourcePath]).sort()))throw Error('Live public component/API membership mismatch');
 if(new Set(components.map(e=>e.name)).size!==components.length)throw Error('Duplicate API component export');
 const facts=new Map(contracts.components.map(c=>[c.name,c]));if(facts.size!==contracts.components.length||!equal([...facts.keys()].sort(),components.map(c=>c.name).sort()))throw Error('Canonical source/API export membership mismatch');
 const groups=new Map();
 for(const item of components){
  const contract=facts.get(item.name);if(!item.promptPath||!existsSync(resolve(root,item.promptPath)))throw Error('Missing prompt for '+item.name);
  if(contract.promptPath!==item.promptPath||contract.sourcePath!==item.sourcePath||contract.declarationPath!==item.declarationPath)throw Error('Canonical path mismatch '+item.name);
  const source=read(item.sourcePath);if(hash(source)!==item.sourceSha256||hash(source)!==contract.sourceSha256||hash(read(item.declarationPath))!==item.declarationSha256)throw Error('Live source/declaration drift '+item.name);
  const props=item.props.map(ref=>{const def=api.propDefinitions[ref.definition];if(!def||def.name!==ref.name||'p-'+hash(JSON.stringify(def)).slice(0,16)!==ref.definition)throw Error('Invalid canonical prop definition ref '+item.name+'.'+ref.name);return{...def,definition:ref.definition};});
  const own=props.filter(p=>p.origin==='authored'),inherited=props.filter(p=>p.origin==='inherited');
  if(!equal(own.map(p=>p.name),contract.authoredProps)||!equal(inherited.map(p=>p.name),contract.inheritedProps))throw Error('Canonical authored/inherited prop mismatch '+item.name);
  if(!equal(extractRuntimeProps(source,item.name),contract.runtime))throw Error('Canonical runtime defaults/parser stale '+item.name);
  if(Object.keys(contract.runtime.defaultExpressions).some(key=>!props.some(p=>p.name===key)))throw Error('Unmapped runtime default '+item.name);
  if(!groups.has(item.promptPath))groups.set(item.promptPath,[]);groups.get(item.promptPath).push({item,contract,own,inherited});
 }
 return{api,contracts,groups};
}
export function renderDeclaredApi(path,rows){
 const link=target=>relative(dirname(path),target).split('\\').join('/');
 const lines=[promptApiFence.begin,'## API đã khai báo / Declared API','', 'Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.', '',`Generated from the [canonical declared API](${link('components/api-index.json')}) and [source facts](${link('components/contracts.json')}). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.`, ''];
 for(const{item,contract,own,inherited}of rows){
  const known=['direct-export-destructuring','forward-ref-destructuring'].includes(contract.runtime.analysis);
  lines.push('### '+item.name,'',`[Khai báo / Declaration](${link(item.declarationPath)}) · [Nguồn / Source](${link(item.sourcePath)}) · phân tích mặc định / default analysis: ${code(contract.runtime.analysis)}`,'','| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |','|---|---|---|');
  for(const prop of own){const value=Object.hasOwn(contract.runtime.defaultExpressions,prop.name)?code(contract.runtime.defaultExpressions[prop.name]):known?'Không khai báo trong tham số / Not declared in parameter':'Chưa biết: chưa có phân tích / Unknown: analysis unavailable';lines.push(`| ${code(prop.name)} | ${prop.optional?'optional':'required'} | ${value} |`);}
  if(!own.length)lines.push('| Không có / None declared | — | — |');
  const inheritedDefaults=Object.keys(contract.runtime.defaultExpressions).filter(name=>!own.some(p=>p.name===name)).length;
  lines.push('',`API kế thừa: ${inherited.length} thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có ${inheritedDefaults} mặc định tham số cho thuộc tính kế thừa; xem ${code(item.name+'.runtime.defaultExpressions')} trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.`, '', `Inherited API: ${inherited.length} properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: ${inheritedDefaults}; see ${code(item.name+'.runtime.defaultExpressions')} in the canonical source facts.`,'');
 }
 lines.push('Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.', '', 'This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.',promptApiFence.end);return lines.join('\n');
}
export function generatePromptApi(root,{check=false}={}){
 const{groups}=sourceInventory(root),prompts=[],projections=[];
 for(const[path,rows]of [...groups].sort(([a],[b])=>a.localeCompare(b))){
  rows.sort((a,b)=>a.item.name.localeCompare(b.item.name));const source=readFileSync(resolve(root,path),'utf8'),parts=promptParts(source),section=renderDeclaredApi(path,rows);
  // Existing prose, examples, whitespace and future appended ref guidance are
  // outside generator ownership and remain byte-identical.
  const output=parts.section===null?source+(source.endsWith('\n\n')?'':source.endsWith('\n')?'\n':'\n\n')+section+'\n':parts.before+section+parts.after;
  const projectedParts=promptParts(output);projections.push({path,source,output});
  prompts.push({path,proseSha256:hash(projectedParts.before+projectedParts.after),sectionSha256:hash(section),exports:rows.map(({item,contract,own,inherited})=>({name:item.name,authoredPropDefinitions:own.map(p=>p.definition),defaultExpressionNames:Object.keys(contract.runtime.defaultExpressions).sort(),inheritedPropCount:inherited.length,defaultAnalysis:contract.runtime.analysis}))});
 }
 const inventory={schemaVersion:1,interpretation:'Canonical definition/default-key references and generated prompt inventory, not a second type system, behavioral specification, accessibility certification or acceptance record.',sourceHashes:Object.fromEntries(['components/api-index.json','components/contracts.json','_ds_manifest.json','scripts/generate-component-contracts.mjs','scripts/lib/component-export.mjs','scripts/generate-prompt-api.mjs'].map(p=>[p,hash(readFileSync(resolve(root,p)))])),prompts};
 const inventoryPath='components/prompt-api.json',text=stringify(inventory);
 const changed=projections.filter(p=>p.output!==p.source);
 if(check&&(changed.length||!existsSync(resolve(root,inventoryPath))||readFileSync(resolve(root,inventoryPath),'utf8')!==text))throw Error('Declared API prompt inventory stale or incomplete: '+changed.map(p=>p.path).join(', '));
 if(!check){for(const p of changed)writeFileSync(resolve(root,p.path),p.output);writeFileSync(resolve(root,inventoryPath),text);}
 return{prompts:prompts.length,exports:prompts.reduce((n,p)=>n+p.exports.length,0),authoredProps:prompts.reduce((n,p)=>n+p.exports.reduce((n,e)=>n+e.authoredPropDefinitions.length,0),0),defaultReferences:prompts.reduce((n,p)=>n+p.exports.reduce((n,e)=>n+e.defaultExpressionNames.length,0),0),changed:changed.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const args=process.argv.slice(2),index=args.indexOf('--root'),root=index<0?resolve(dirname(fileURLToPath(import.meta.url)),'..'):resolve(args[index+1]);console.log(JSON.stringify(generatePromptApi(root,{check:args.includes('--check')})));}
