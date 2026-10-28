import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {parse} from '@babel/parser';
import {sourceComponentFunctions} from './lib/component-export.mjs';
import {collectSources} from './build-bundle.mjs';
import {withBrowserFixture} from '../_audit/ci/lib/browser-fixture.mjs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const hash=value=>createHash('sha256').update(value).digest('hex');
const fixturePath='scripts/fixtures/static-html-reference.json';
export function validateFixtureValue(value){
 if(Array.isArray(value)){value.forEach(validateFixtureValue);return}
 if(!value||typeof value!=='object')return;
 if(value.$element){
  const e=value.$element;assert(Boolean(e.component)!==Boolean(e.tag),'Fixture element needs exactly one component or tag');
  if(e.tag)assert(['a','button','div','span','p','ul','li','section','h2','input','label','form','fieldset','legend','table','tbody','tr','td'].includes(e.tag),'Unsafe fixture element');
  if(e.component)assert(/^[A-Z][A-Za-z0-9]*$/.test(e.component),'Unsafe fixture component');
 }
 for(const[key,item]of Object.entries(value)){
  assert(!/^on/i.test(key)&&!['dangerouslySetInnerHTML','__proto__','prototype','constructor'].includes(key),'Unsafe fixture property '+key);
  if(['href','src','action'].includes(key)&&typeof item==='string')assert(!/^(?:(?:javascript|vbscript):|data:(?:text\/html|application\/xhtml\+xml))/i.test(item.replace(/[\u0000-\u0020]/g,'')),'Unsafe fixture URL');
  validateFixtureValue(item);
 }
}
export function validateFixtures(api,fixture){
 assert.equal(fixture.schemaVersion,1);
 const components=api.exports.filter(item=>item.kind==='component');
 const names=components.map(item=>item.name).sort();
 assert.deepEqual(fixture.components.map(item=>item.name).sort(),names,'Every public component needs exactly one explicit reference fixture/disposition');
 for(const item of fixture.components){
  const declaration=components.find(entry=>entry.name===item.name);
  assert.equal(item.sourcePath,declaration.sourcePath,item.name+' source path');
  assert.equal(item.fixtureAuthority,declaration.declarationPath,item.name+' fixture declaration authority');
  assert(['rendered-dom-reference','interactive-dom-snapshot','context-only'].includes(item.referenceKind));
  assert(item.state&&item.boundary,item.name+' requires explicit state and boundary');
  validateFixtureValue(item.props);validateFixtureValue(item.wrapper);
 }
 return components;
}
export function fenced(value,language=''){
 const longest=Math.max(0,...[...value.matchAll(/`+/g)].map(match=>match[0].length));
 const fence='`'.repeat(Math.max(3,longest+1));return fence+language+'\n'+value+'\n'+fence;
}
export function referenceMarkdown(reference){
 const lines=['# Rendered HTML reference','','This generated reference records real component mounts. It is a static DOM reference, not a replacement implementation. Copying markup does not install state, event handlers, keyboard navigation, overlay management, validation, announcements or authorization. Use the React component for interactive behavior.','','Renderer scope: '+reference.renderer.scope+'. Source hashes and fixture props bind each entry; no manual accessibility or visual acceptance is implied. Canvas pixels, media contents, stylesheets and pseudo-elements are outside outerHTML. IDs are consistently normalized for reference display.','','Regenerate: `node scripts/generate-static-html-reference.mjs`. Validate current source/rendering: `node scripts/generate-static-html-reference.mjs --check`. The check requires the current browser bundle and Playwright Chromium.','','Kitchen sink remains a curated static styling specimen; this catalog does not change its coverage or behavior.','','Fixture support context: an ambient button #reference-anchor is excluded from snapshots; Tour and Anchor observe that target. Declared wrapper context is included. These fragments are not independent application examples.','',''];
 for(const entry of reference.components){
  lines.push('## '+entry.name,'',entry.referenceKind+' — '+entry.state,'',entry.boundary,'','Source: `'+entry.sourcePath+'`, SHA-256 `'+entry.sourceSha256+'`.','', 'Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):','',fenced(JSON.stringify({props:entry.props,...(entry.wrapper?{wrapper:entry.wrapper}:{})},null,2),'json'),'');
  lines.push(entry.html?fenced(entry.html,'html'):'No DOM was emitted for the declared fixture state.','');
 }
 return lines.join('\n');
}
export function referenceMarkdownVi(reference){
 return referenceMarkdown(reference)
  .replace('# Rendered HTML reference','# Tham chiếu HTML đã kết xuất')
  .replace('This generated reference records real component mounts. It is a static DOM reference, not a replacement implementation. Copying markup does not install state, event handlers, keyboard navigation, overlay management, validation, announcements or authorization. Use the React component for interactive behavior.','Tài liệu sinh tự động này ghi lại DOM từ các thành phần thực sự được gắn vào trình duyệt. Đây là tham chiếu DOM tĩnh. Sao chép HTML không cài đặt trạng thái, xử lý sự kiện, điều hướng bàn phím, quản lý lớp phủ, xác thực dữ liệu, thông báo hay phân quyền. Hãy dùng thành phần React khi cần hành vi tương tác.')
  .replace('Renderer scope: ','Phạm vi kết xuất: ')
  .replace('Source hashes and fixture props bind each entry; no manual accessibility or visual acceptance is implied. Canvas pixels, media contents, stylesheets and pseudo-elements are outside outerHTML. IDs are consistently normalized for reference display.','Mỗi mục gắn với mã băm nguồn và cấu hình mẫu. Tài liệu không chứng nhận kiểm thử trợ năng thủ công hay chấp thuận hình ảnh. Điểm ảnh canvas, nội dung đa phương tiện, CSS và phần tử giả nằm ngoài outerHTML. ID được chuẩn hóa cùng các thuộc tính tham chiếu.')
  .replace('Regenerate: ','Sinh lại: ').replace('Validate current source/rendering: ','Kiểm tra nguồn và DOM hiện tại: ')
  .replace('The check requires the current browser bundle and Playwright Chromium.','Kiểm tra yêu cầu browser bundle hiện tại và Playwright Chromium.')
  .replace('Kitchen sink remains a curated static styling specimen; this catalog does not change its coverage or behavior.','Kitchen sink vẫn là mẫu CSS tĩnh được tuyển chọn; danh mục này không thay đổi độ bao phủ hay hành vi của nó.')
  .replace('Fixture support context: an ambient button #reference-anchor is excluded from snapshots; Tour and Anchor observe that target. Declared wrapper context is included. These fragments are not independent application examples.','Ngữ cảnh hỗ trợ: nút #reference-anchor nằm ngoài HTML được ghi; Tour và Anchor dùng mục tiêu đó. HTML bao gồm ngữ cảnh bọc đã khai báo. Các đoạn HTML này không phải ví dụ ứng dụng độc lập.')
  .replaceAll('DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.','Chỉ là ảnh chụp DOM. Sao chép HTML không cài đặt trạng thái React, xử lý sự kiện, quản lý tiêu điểm hay hành vi trợ năng.')
  .replaceAll('Context provider has no own native element. Any rendered markup belongs to its fixture child.','Context provider không có phần tử DOM riêng. HTML được ghi lại thuộc về phần tử con trong mẫu.')
  .replaceAll(' This fixture emits SVG paths, not a canvas bitmap.',' Mẫu này kết xuất đường SVG, không phải bitmap canvas.')
  .replaceAll('Explicit fixture mount; no user interaction performed.','Gắn mẫu với cấu hình đã ghi; chưa thực hiện tương tác người dùng.')
  .replaceAll('Controlled open=true fixture; snapshot is not a standalone usable overlay.','Mẫu điều khiển open=true; ảnh chụp không phải lớp phủ có thể dùng độc lập.')
  .replaceAll('Initial closed/help-hidden fixture; only initial DOM is referenced, hidden interactive surfaces are not claimed.','Mẫu ở trạng thái đóng/ẩn trợ giúp ban đầu; chỉ ghi DOM ban đầu, không khẳng định có HTML của bề mặt tương tác đang ẩn.')
  .replaceAll('Initial step zero with fixed render-prop descriptors; navigation/validation behavior is not part of the snapshot.','Bước ban đầu bằng không với mô tả render-prop cố định; điều hướng và xác thực dữ liệu nằm ngoài ảnh chụp.')
  .replaceAll('Source: ','Nguồn: ')
  .replaceAll('Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):','Cấu hình mẫu (mô tả thành phần nằm trong tệp danh mục; HTML bao gồm ngữ cảnh bọc đã khai báo):')
  .replaceAll('No DOM was emitted for the declared fixture state.','Không có DOM trong trạng thái mẫu đã khai báo.');
}
export async function captureReference({browserName='chromium'}={}){
 const api=JSON.parse(read('components/api-index.json')),fixtures=JSON.parse(read(fixturePath));
 const exports=validateFixtures(api,fixtures);
 const discovered=collectSources(fileURLToPath(root)).flatMap(sourcePath=>{
  const ast=parse(read(sourcePath),{sourceType:'module',plugins:['jsx']});
  return sourceComponentFunctions(ast).map(name=>({name,sourcePath}));
 }).sort((a,b)=>a.name.localeCompare(b.name,'en'));
 assert.deepEqual(exports.map(({name,sourcePath})=>({name,sourcePath})).sort((a,b)=>a.name.localeCompare(b.name,'en')),discovered,'Public uppercase component source exports differ from the API catalog; rebuild catalog and add/remove explicit fixtures');
 execFileSync(process.execPath,['_audit/ci/check-bundle-freshness.mjs'],{cwd:fileURLToPath(root),stdio:'pipe'});
 const components=[];
 await withBrowserFixture(async page=>{
  await page.setViewportSize({width:1280,height:720});
  await page.clock.setFixedTime(new Date('2026-10-20T00:00:00.000Z'));
  await page.evaluate(()=>document.fonts.ready);
  for(const fixture of fixtures.components){
   const result=await page.evaluate(async fixture=>{
    const allowedTags=new Set(['a','button','div','span','p','ul','li','section','h2','input','label','form','fieldset','legend','table','tbody','tr','td']);
    const decode=value=>{
     if(Array.isArray(value))return value.map(decode);
     if(!value||typeof value!=='object')return value;
     if(value.$render!==undefined)return ()=>decode(value.$render);
     if(value.$element){
      const e=value.$element;const target=e.component?CS[e.component]:e.tag;
      if(e.component?!/^[A-Z][A-Za-z0-9]*$/.test(e.component)||!(typeof target==='function'||(target&&target.$$typeof===Symbol.for('react.forward_ref')&&typeof target.render==='function')):!allowedTags.has(target))throw Error('Unsafe fixture element');
      return React.createElement(target,decode(e.props||{}),decode(e.children));
     }
     const decoded={};for(const[key,item]of Object.entries(value)){
      if(/^on[A-Z]/.test(key)||['dangerouslySetInnerHTML','__proto__','prototype','constructor'].includes(key))throw Error('Executable/unsafe fixture property '+key);
      if(['href','src','action'].includes(key)&&typeof item==='string'&&/^\s*(?:javascript|vbscript):/i.test(item))throw Error('Unsafe fixture URL');
      decoded[key]=decode(item);
     }return decoded;
    };
    renderFixture(null);
    let node=React.createElement(CS[fixture.name],decode(fixture.props));
    if(fixture.wrapper){const wrapper=fixture.wrapper;node=React.createElement(wrapper.component?CS[wrapper.component]:wrapper.tag,decode(wrapper.props),node)}
    renderFixture(React.createElement(React.Fragment,null,
      React.createElement('button',{id:'reference-anchor',type:'button',style:{position:'absolute',left:0,top:0,width:64,height:24,boxSizing:'border-box'}},'Anchor'),
      React.createElement('div',{'data-static-reference':fixture.name},node)));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const mount=document.querySelector('[data-static-reference]');
    if(!mount)throw Error(fixture.name+': fixture mount disappeared; component render failed');
    const root=mount.cloneNode(true);
    const portals=[...document.body.children].filter(el=>el.id!=='fixture'&&el.tagName!=='SCRIPT').map(el=>el.cloneNode(true));
    const all=[root,...portals];const ids=new Map();
    for(const tree of all)for(const el of [tree,...tree.querySelectorAll('[id]')].filter(el=>el.id))if(!ids.has(el.id))ids.set(el.id,'reference-id-'+String(ids.size+1).padStart(3,'0'));
    const idRefs=new Set(['id','for','aria-labelledby','aria-describedby','aria-controls','aria-owns','aria-activedescendant','aria-details','aria-errormessage','headers','list','form']);
    for(const tree of all)for(const el of [tree,...tree.querySelectorAll('*')])for(const attr of [...el.attributes]){
     if(idRefs.has(attr.name))el.setAttribute(attr.name,attr.value.split(/\s+/).map(id=>ids.get(id)||id).join(' '));
     else if(['href','xlink:href'].includes(attr.name)&&attr.value.startsWith('#')&&ids.has(attr.value.slice(1)))el.setAttribute(attr.name,'#'+ids.get(attr.value.slice(1)));
     else if(attr.value.includes('url(#')){let value=attr.value;for(const[id,next]of ids)value=value.replaceAll('url(#'+id+')','url(#'+next+')');el.setAttribute(attr.name,value)}
    }
    const html=root.innerHTML+portals.map(el=>el.outerHTML).join('');
    const facts=el=>({tag:el.tagName.toLowerCase(),attributes:Object.fromEntries([...el.attributes].filter(a=>a.name!=='style').map(a=>[a.name,a.value]).sort(([a],[b])=>a.localeCompare(b))),children:[...el.childNodes].flatMap(node=>node.nodeType===1?[facts(node)]:node.nodeType===3?[node.textContent]:[])});
    const semanticDOM=[...root.childNodes].flatMap(node=>node.nodeType===1?[facts(node)]:node.nodeType===3?[node.textContent]:[]).concat(portals.map(facts));
    return {html,semanticDOM,nodeCount:root.querySelectorAll('*').length+portals.reduce((n,el)=>n+1+el.querySelectorAll('*').length,0),canvasCount:all.reduce((n,el)=>n+el.querySelectorAll('canvas').length,0),portalCount:portals.length};
   },fixture);
   components.push({...fixture,sourceSha256:hash(read(fixture.sourcePath)),declarationSha256:hash(read(fixture.fixtureAuthority)),...result});
  }
 },{browserName});
 const kitchen=read('templates/kitchen-sink.html');
 const classNames=new Set([...kitchen.matchAll(/class\s*=\s*["']([^"']*)["']/g)].flatMap(match=>match[1].split(/\s+/)).filter(name=>/^cs-[a-z0-9-]+$/.test(name)));
 return {$schema:'../schemas/static-html-reference.schema.json',schemaVersion:1,nonComponentExports:api.exports.filter(item=>item.kind!=='component').map(item=>({name:item.name,kind:item.kind,sourcePath:item.sourcePath,boundary:item.kind==='hook'?'React hook; no independent DOM or mount fixture.':'Non-component value; no DOM mount fixture.'})),interpretation:'Observed rendered DOM for explicit fixtures, not complete anatomy, all-state coverage, usable standalone widgets, interactive behavior or accessibility acceptance.',renderer:{scope:'Chromium DOM,1280x720, fixed UTC time2026-10-20, English document; generated IDs normalized with IDREF attributes; cross-engine/platform byte identity is not asserted',platform:process.platform,time:'2026-10-20T00:00:00.000Z',viewport:{width:1280,height:720},supportContext:'An ambient button#reference-anchor (64x24 at0,0) supports Tour/Anchor fixtures and is excluded from captured markup. Fixture wrapper context, when declared, is included.',idNormalization:'Unique rendered IDs map in DOM order; IDREF and fragment links are rewritten consistently.'},inputs:{fixturesSha256:hash(read(fixturePath)),generatorSha256:hash(read('scripts/generate-static-html-reference.mjs')),bundledSourceGraphSha256:hash(JSON.stringify(collectSources(fileURLToPath(root)).map(path=>[path,hash(read(path))]))),exportCount:api.exports.length,hookCount:api.exports.filter(item=>item.kind==='hook').length,constantCount:api.exports.filter(item=>item.kind==='constant').length,componentCount:exports.length,sourceFileCount:new Set(exports.map(item=>item.sourcePath)).size},kitchenSink:{path:'templates/kitchen-sink.html',sourceSha256:hash(kitchen),distinctPlainCsClassNames:classNames.size,distinctRootClassTokens:[...classNames].filter(name=>!name.includes('--')).length,distinctAllCsClassTokens:new Set([...kitchen.matchAll(/class\s*=\s*["']([^"']*)["']/g)].flatMap(match=>match[1].split(/\s+/)).filter(name=>name.startsWith('cs-'))).size,method:'Distinct literal HTML class-attribute tokens: all cs-* tokens, plain tokens excluding __parts, root tokens also excluding --modifiers. Computed/style-selector occurrences are excluded. Current root census36 does not reproduce the assessment37; its exact methodology is unavailable. Class tokens are not public export coverage.'},components};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const reference=await captureReference();const next=JSON.stringify(reference,null,2)+'\n';const markdown=referenceMarkdown(reference);
 const checkFresh=recorded=>{
  assert.deepEqual(recorded.inputs,reference.inputs,'Static reference inputs/source inventory stale');
  assert.deepEqual(recorded.kitchenSink,reference.kitchenSink,'Kitchen-sink specimen source/census stale');
  assert.equal(recorded.components.length,reference.components.length);
  for(const item of reference.components){
   const prior=recorded.components.find(entry=>entry.name===item.name);assert(prior,item.name+' missing recorded reference');
   for(const key of ['sourcePath','sourceSha256','fixtureAuthority','declarationSha256','props','wrapper','state','boundary','referenceKind','semanticDOM','nodeCount','canvasCount','portalCount'])assert.deepEqual(prior[key],item[key],item.name+': stale '+key);
  }
  assert.equal(read('docs/static-html-reference.md'),referenceMarkdown(recorded),'Human reference stale relative to checked JSON');
  assert.equal(read('docs/vi/static-html-reference.md'),referenceMarkdownVi(recorded),'Vietnamese reference stale relative to checked JSON');
 };
 if(process.argv.includes('--check')){
  checkFresh(JSON.parse(read('components/static-html-reference.json')));
 }
 else{
  let fresh=false;try{checkFresh(JSON.parse(read('components/static-html-reference.json')));fresh=true}catch{}
  if(!fresh){writeFileSync(new URL('components/static-html-reference.json',root),next);writeFileSync(new URL('docs/static-html-reference.md',root),markdown);writeFileSync(new URL('docs/vi/static-html-reference.md',root),referenceMarkdownVi(reference))}
 }
 console.log('PASS rendered static HTML reference '+reference.components.length+' exports; interactive behavior and human acceptance are separate');
}
