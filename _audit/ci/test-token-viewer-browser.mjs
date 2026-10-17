import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {inspectCoarseHitRegion} from './lib/coarse-hit-region.mjs';
import {observeFreshCopyFeedback} from './lib/copy-feedback-observation.mjs';
const root=new URL('../../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const sources=['tokens.dtcg.json','tokens.json'];
const records=Object.fromEntries(sources.map(source=>{
 const data=JSON.parse(read('tokens/'+source)),rows=[];
 if(source.includes('dtcg')){
  const walk=(node,path=[])=>{if(!node||typeof node!=='object')return;if(Object.hasOwn(node,'$value')){rows.push({path:path.join('.'),group:path[0],value:node.$value});return}for(const[key,value]of Object.entries(node))if(!key.startsWith('$'))walk(value,[...path,key])};walk(data);
 }else for(const[scope,groups]of Object.entries(data).filter(([key])=>!key.startsWith('$')))for(const[group,bag]of Object.entries(groups))for(const[path,value]of Object.entries(bag))rows.push({path,group:scope==='root'?group:scope+'.'+group,value});
 return[source,rows];
}));
const regionCode=inspectCoarseHitRegion.toString(),geometryEnd=regionCode.indexOf('const actionSelector=');
assert(geometryEnd>0,'Shared coarse-region helper must expose its geometry phase');
const geometryCode=regionCode.slice(0,geometryEnd)+'return {method,diameter,pass:true,targetBounds:box.toJSON(),clippedBounds:clipped};}';
const report={sourceHashes:Object.fromEntries(['tokens/viewer.html',...sources.map(p=>'tokens/'+p)].map(p=>[p,sha(read(p))])),contexts:[],nativeCopies:0,scope:'Actual public token viewer; both complete sources and every visible authored control. Coarse 320/390/1280px, light/dark/system-light/system-dark, comfortable/compact; exact bounds/clipping/pointer-mask equality required before reusing a completed disk proof; additional 320x568 narrow-height check. 44px box/clipped floor and existing guarded integer-coordinate 42px action disks. Native path/value copying for every row at390px light comfortable in each engine, every group filter, mode/search/source and keyboard focus; APCA body/source/meta/table/raw paint plus actual first-row hover per context. No OS popup geometry, continuous/subpixel guard ownership, arbitrary data, clipboard integration, arbitrary compositing/backdrop, AT or human visual acceptance.'};
const apcaSource=read('stories/lib/live-tokens.jsx').toString();
const apcaCode=apcaSource.slice(apcaSource.indexOf('export function apcaLc'),apcaSource.indexOf('\nconst MONO')).replace('export ','');
const apca=Function(apcaCode+';return apcaLc;')();
const inspectBodyPaint=nodes=>nodes.filter(el=>el.getClientRects().length).map(el=>{
     const rgb=text=>text.match(/[\d.]+/g)?.map(Number),over=(fg,bg)=>fg.slice(0,3).map((v,i)=>v*(fg[3]??1)+bg[i]*(1-(fg[3]??1)));
     const chain=[];for(let n=el;n;n=n.parentElement)chain.unshift(n);
     let bg=[255,255,255];for(const n of chain){const c=rgb(getComputedStyle(n).backgroundColor);if(c)bg=over(c,bg)}
     const style=getComputedStyle(el),fg=rgb(style.color);fg[3]=(fg[3]??1)*Number(style.opacity);
     return {selector:el.className||el.tagName,foreground:over(fg,bg),background:bg};
    });
const luminance=rgb=>rgb.map(c=>{c/=255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4}).reduce((a,c,i)=>a+c*[0.2126,0.7152,0.0722][i],0);
const ratio=(a,b)=>{a=luminance(a);b=luminance(b);return(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)};
const browserResults=await Promise.allSettled((process.env.CS_TEST_BROWSER?[process.env.CS_TEST_BROWSER]:['chromium','firefox','webkit']).map(async browserName=>{
 await withBrowserFixture(async page=>{
  const base=new URL(page.url()).origin;
  await page.addInitScript(()=>{window.__csTokenWrites=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__csTokenWrites.push(text)}}})});
  await page.goto(base+'/tokens/viewer.html');
  await page.waitForFunction(()=>window.__csTokensViewer?.rows>0);await page.addScriptTag({content:'window.csInspectCoarseHitRegion='+regionCode+';window.csCoarseGeometry='+geometryCode+';window.csHitCache=new Map();'});
  assert.equal(await page.evaluate(()=>matchMedia('(pointer:coarse)').matches),true);
  const measure=async(context,selector='button,input,select')=>{
   const result=await page.locator(selector).evaluateAll((nodes,{context,selector})=>{
    const rows=[];
    const shapeStyle=el=>{const s=getComputedStyle(el);return Object.fromEntries(['display','visibility','pointerEvents','position','zIndex','transform','perspective','filter','contain','contentVisibility','clipPath','overflowX','overflowY','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderRadius','appearance','opacity'].map(k=>[k,s[k]]))};
    const blockers=[...document.querySelectorAll('*')].filter(el=>{const s=getComputedStyle(el);return s.position!=='static'&&s.pointerEvents!=='none'&&el.getClientRects().length}).map(el=>({el,tag:el.tagName,className:el.className,style:shapeStyle(el)}));
    for(const [index,el] of nodes.filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden').entries()){
     el.scrollIntoView({block:'center',inline:'center',behavior:'instant'});
     const geometry=csCoarseGeometry(el),css=getComputedStyle(el),ancestors=[];
     for(let node=el;node;node=node.parentElement)ancestors.push({tag:node.tagName,className:node.className,disabled:node.disabled,style:shapeStyle(node)});
     // Reuse a completed integer disk proof only when its absolute bounds,
     // clipping and pointer/layout masks exactly match this actual DOM state.
     // Native appearance additionally binds the browser's color-scheme state.
     const currentBlockers=blockers.map(({el,...b})=>({...b,rect:el.getBoundingClientRect().toJSON()}));
     const signature=JSON.stringify({geometry,ancestors,blockers:currentBlockers,nativeColorScheme:css.appearance==='none'?null:css.colorScheme});
     const key=JSON.stringify([context.width,context.height,context.source,selector,index]);
     const cached=csHitCache.get(key),reused=Boolean(cached&&cached.signature===signature);
     const region=reused?cached.region:csInspectCoarseHitRegion(el);
     if(region.pass&&!reused)csHitCache.set(key,{signature,region});
     rows.push({id:el.id,className:el.className,text:el.textContent.slice(0,80),region,reusedEquivalentLayout:reused,foreground:css.color,background:css.backgroundColor});
    }
    return rows;
   },{context,selector});
   for(const row of result){assert(row.region.pass,JSON.stringify({context,row}));const fg=row.foreground.match(/[\d.]+/g)?.slice(0,3).map(Number),bg=row.background.match(/[\d.]+/g)?.slice(0,3).map(Number);if(fg&&bg&&row.background!=='rgba(0, 0, 0, 0)')assert(ratio(fg,bg)>=4.5,JSON.stringify({context,row,ratio:ratio(fg,bg)}))}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,'Viewer must not cause document horizontal overflow');
   return result;
  };
  const configurations=[];for(const width of [320,390,1280])for(const theme of ['light','dark','system-light','system-dark'])for(const density of ['comfortable','compact'])configurations.push({width,height:900,theme,density});
  configurations.push({width:320,height:568,theme:'dark',density:'compact'});
  for(const config of configurations){
   await page.setViewportSize({width:config.width,height:config.height});await page.emulateMedia({colorScheme:config.theme.endsWith('dark')?'dark':'light'});
   await page.evaluate(({theme,density})=>{document.documentElement.dataset.theme=theme.startsWith('system')?'system':theme;document.documentElement.dataset.csDensity=density},config);
   for(const source of sources){
    await page.locator('#modeTable').click();await page.locator('#q').fill('');
    if(await page.locator('#source').inputValue()!==source){const pending=page.waitForResponse(r=>new URL(r.url()).pathname==='/tokens/'+source);await page.locator('#source').selectOption(source);const response=await pending;assert.equal(response.status(),200);assert.equal(sha(await response.body()),report.sourceHashes['tokens/'+source])}
    await page.waitForFunction(text=>document.getElementById('raw').textContent===text,read('tokens/'+source).toString());await page.locator('#chips button').first().click();await page.evaluate(()=>document.fonts.ready);
    const context={browserName,...config,source},rows=await measure(context);
    const rendered=await page.locator('#tbody tr').evaluateAll(nodes=>nodes.map(el=>({path:el.cells[0].textContent,group:el.cells[1].textContent,value:el.cells[2].textContent,pathCopy:el.querySelector('[data-copy="path"]').dataset.v,valueCopy:el.querySelector('[data-copy="value"]').dataset.v})));
    const expected=records[source].map(row=>({...row,value:row.value==null?'':typeof row.value==='object'?JSON.stringify(row.value):String(row.value)}));
    const key=row=>row.group+'\0'+row.path,expectedMap=new Map(expected.map(row=>[key(row),row]));assert.equal(expectedMap.size,expected.length,'Source must have unique scoped records');assert.equal(rendered.length,expected.length);
    for(const row of rendered){const record=expectedMap.get(key(row));assert(record,JSON.stringify(row));assert.equal(row.value,record.value);assert.equal(row.pathCopy,record.path);assert.equal(row.valueCopy,record.value)}
    const tokenRows=rendered.length;
    // Read actual composed foreground/backdrop, including the group's opacity.
    await page.mouse.move(0,0);
    const contrast=await page.locator('#tbody td.path,#tbody td.group,#tbody td code,.src-help:not([hidden]),.meta,.src').evaluateAll(inspectBodyPaint);
    await page.locator('#tbody tr').first().hover();const hoverContrast=await page.locator('#tbody tr').first().locator('td.path,td.group,td code').evaluateAll(inspectBodyPaint);contrast.push(...hoverContrast);
    for(const sample of contrast)assert(apca(sample.foreground,sample.background)>=75,JSON.stringify({context,sample,apca:apca(sample.foreground,sample.background)}));
    // All token copy actions are exercised, with a memory-only Clipboard API
    // observer, in this one complete native action scope per source and engine.
    if(config.width===390&&config.theme==='light'&&config.density==='comfortable'){
     for(let index=0;index<tokenRows*2;index++){
      const target=page.locator('#tbody .copy').nth(index);await target.scrollIntoViewIfNeeded();const text=await target.getAttribute('data-v');const before=await page.evaluate(()=>__csTokenWrites.length);const feedback=await observeFreshCopyFeedback(target);
      try{await target.click();await page.waitForFunction(n=>__csTokenWrites.length===n+1,before);assert.equal(await page.evaluate(()=>__csTokenWrites.at(-1)),text);assert.equal((await feedback.wait()).seen,true);report.nativeCopies++;}finally{await feedback.dispose()}
     }
    }
    // Every source-specific group is activated through its actual native button.
    const groups=await page.locator('#chips button').evaluateAll(nodes=>nodes.slice(1).map(el=>({group:el.childNodes[0].textContent,name:el.textContent})));
    for(const {group,name} of groups){await page.locator('#chips').getByRole('button',{name,exact:true}).click();assert.equal(await page.evaluate(()=>__csTokensViewer.group),group);assert(await page.locator('#tbody tr').count()>0)}
    await page.locator('#chips button').first().click();await page.locator('#q').fill('no-matching-token-9f264');await page.waitForFunction(()=>__csTokensViewer.filtered===0);assert.equal(await page.locator('#empty').isVisible(),true);await page.locator('#q').fill('');await page.waitForFunction(n=>__csTokensViewer.filtered===n,tokenRows);
    await page.locator('#q').focus();await page.keyboard.press(browserName==='webkit'?'Alt+Shift+Tab':'Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'modeRaw');assert.equal(await page.evaluate(()=>{const s=getComputedStyle(document.activeElement);return s.outlineStyle!=='none'||s.boxShadow!=='none'}),true);
    await page.keyboard.press('Enter');assert.equal(await page.locator('#raw').isVisible(),true);assert.equal(await page.locator('#modeRaw').getAttribute('aria-pressed'),'true');const raw=await measure({...context,state:'raw'});const rawContrast=await page.locator('#raw').evaluateAll(inspectBodyPaint);for(const sample of rawContrast)assert(apca(sample.foreground,sample.background)>=75,JSON.stringify({context,sample}));
    const title=await page.locator('.bar h1 b').evaluate(el=>({color:getComputedStyle(el).color,bg:getComputedStyle(el.closest('.bar')).backgroundColor}));assert(ratio(title.color.match(/[\d.]+/g).map(Number),title.bg.match(/[\d.]+/g).map(Number))>=4.5,JSON.stringify({context,title}));
    report.contexts.push({...context,tokenRows,bodyContrast:contrast,rawContrast,tableControls:rows,rawControls:raw});console.log(`PASS token viewer ${browserName} ${config.width}x${config.height} ${config.theme} ${config.density} ${source}: ${rows.length} complete table controls`);
   }
  }
 },{browserName,contextOptions:{viewport:{width:390,height:900},hasTouch:true,...(browserName==='firefox'?{}:{isMobile:true})}});
}));
for(const result of browserResults)if(result.status==='rejected')throw result.reason;
const output=process.argv.find(arg=>arg.startsWith('--evidence='))?.slice(11)||process.env.CS_TOKEN_VIEWER_GEOMETRY_EVIDENCE;if(output)writeFileSync(output,output.endsWith('.gz')?gzipSync(JSON.stringify(report)):JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({contexts:report.contexts.length,targets:report.contexts.reduce((n,r)=>n+r.tableControls.length+r.rawControls.length,0),nativeCopies:report.nativeCopies,scope:report.scope}));
