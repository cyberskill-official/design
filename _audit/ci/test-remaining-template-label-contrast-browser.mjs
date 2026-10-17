import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {inflateSync} from 'node:zlib';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {apca} from '../../scripts/lib/oklch.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const sha=p=>createHash('sha256').update(readFileSync(root+'/'+p)).digest('hex');
// Reuse the maintained decoder on our own Playwright screenshots; bind its source below.
const pixelSource=readFileSync(root+'/_audit/ci/pixel-diff.mjs','utf8');
const start=pixelSource.indexOf('function readChunk('),end=pixelSource.indexOf('\nfunction diffImages(',start);assert(start>=0&&end>start);
const decodePng=Function('inflateSync',pixelSource.slice(start,end)+';return decodePng;')(inflateSync);
const decode=bytes=>{const image=decodePng(bytes);return{...image,data:image.rgba}};
const sourceFiles=["templates/bod-investor-update/BodInvestorUpdate.dc.html", "templates/delivery-status-email/DeliveryStatusEmail.dc.html", "templates/email/Email.dc.html", "templates/finance-dunning-email/FinanceDunningEmail.dc.html", "templates/finance-quote/FinanceQuote.dc.html", "templates/sales-one-pager/SalesOnePager.dc.html", "scripts/lib/oklch.mjs", "_audit/ci/pixel-diff.mjs", "_audit/ci/lib/browser-fixture.mjs", "_audit/ci/test-remaining-template-label-contrast-browser.mjs"];
const sourceBefore=Object.fromEntries(sourceFiles.map(p=>[p,sha(p)]));
const browserName=process.env.CS_BROWSER||'chromium';
const evidence=process.argv.find(x=>x.startsWith('--evidence='))?.slice(11);
const captures=process.argv.find(x=>x.startsWith('--captures='))?.slice(11);
if(captures)mkdirSync(captures,{recursive:true});
const report={browserName,node:process.version,sourceBefore,status:'running',contexts:[],scope:'Six templates retaining direct small Bright/on-style labels at source review:BodInvestorUpdate,DeliveryStatusEmail,Email,FinanceDunningEmail,FinanceQuote,SalesOnePager. All15declared elements390px,default320/1360,everydeclaredlanguage includingBoth andtwoouterthemes. Actual paired opaque label pixels:bodyAPCA75/minimum30interiorpixels/coverage0.015/residual1.5. ExplicitLight surfaces and email limitations retained; outerDark does not imply Dark-email support. No actual email-client, exportedPDF, arbitrary caller content, real DC/AT/operator acceptance.'};
const hex=v=>'#'+v.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join('');
function glyphs(original,background,row){
 assert.equal(original.width,background.width);assert.equal(original.height,background.height);
 const opacity=row.opacity*row.foreground[3]/255;const pairs=new Map();let pixels=0,maxResidual=0;
 for(let y=Math.max(0,row.rect.y);y<Math.min(original.height,row.rect.y+row.rect.height);y++)for(let x=Math.max(0,row.rect.x);x<Math.min(original.width,row.rect.x+row.rect.width);x++){
  const off=(y*original.width+x)*4;const a=[...original.data.subarray(off,off+3)],b=[...background.data.subarray(off,off+3)],delta=b.map((v,i)=>row.foreground[i]-v),den=delta.reduce((n,v)=>n+v*v,0);if(den<=100)continue;
  const coverage=delta.reduce((n,v,i)=>n+(a[i]-b[i])*v,0)/den;const residual=Math.max(...delta.map((v,i)=>Math.abs(a[i]-b[i]-coverage*v)));
  if(coverage<opacity-.015||coverage>opacity+.015||residual>1.5)continue;
  pixels++;maxResidual=Math.max(maxResidual,residual);const fg=hex(a),bg=hex(b),key=fg+'/'+bg;const prev=pairs.get(key);if(prev)prev.pixels++;else pairs.set(key,{fg,bg,pixels:1,apca:apca(fg,bg)});
 }
 const values=[...pairs.values()];return{...row,fullGlyphPixels:pixels,maximumModelResidual:maxResidual,pairs:values,minimumApca:values.length?Math.min(...values.map(x=>x.apca)):null,adequateGlyphEvidence:pixels>=30};
}
try{
 await withBrowserFixture(async page=>{

  const origin=new URL(page.url()).origin;
  for(const template of ["templates/bod-investor-update/BodInvestorUpdate.dc.html", "templates/delivery-status-email/DeliveryStatusEmail.dc.html", "templates/email/Email.dc.html", "templates/finance-dunning-email/FinanceDunningEmail.dc.html", "templates/finance-quote/FinanceQuote.dc.html", "templates/sales-one-pager/SalesOnePager.dc.html"]){
   await page.goto(origin+'/'+template);await page.waitForFunction(()=>typeof __dcSetProps==='function');const props=await page.evaluate(()=>JSON.parse(document.querySelector('script[data-props]').getAttribute('data-props')));assert.equal(props.element.options.length,15);
   for(const width of [320,390,1360])for(const element of width===390?props.element.options:[props.element.options[0]])for(const language of props.language.options)for(const theme of ['light','dark']){
    await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme:theme});await page.evaluate(({language,theme,element})=>{document.documentElement.dataset.theme=theme;__dcSetProps(__dcRootName(),{language,element});},{language,theme,element});await page.waitForFunction(()=>!!window.CyberSkillDS?.Logo&&!document.querySelector('.sc-placeholder'));await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const targets=page.locator(':is(a,span)[style*="--cs-accent-on"]:is([style*="--cs-accent-bright"],[style*="--cs-accent-strong"]):visible');const expected=(template.includes('delivery-status-email')?2:1)+(language==='Both'?1:0);assert.equal(await targets.count(),expected,'Complete visible small-label count');const samples=[];
    for(let i=0;i<await targets.count();i++){
     const panel=await targets.nth(i).elementHandle();assert(panel);await panel.scrollIntoViewIfNeeded();const row=await panel.evaluate(el=>{const b=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);const r=range.getBoundingClientRect(),s=getComputedStyle(el),canvas=document.createElement('canvas');canvas.width=canvas.height=1;const c=canvas.getContext('2d'),colour=v=>{c.clearRect(0,0,1,1);c.fillStyle=v;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data]};let ancestorOpacity=1;for(let p=el;p;p=p.parentElement)ancestorOpacity*=Number(getComputedStyle(p).opacity);return{tag:el.tagName,text:el.textContent.trim(),foreground:colour(s.color),background:colour(s.backgroundColor),opacity:ancestorOpacity,fontSize:parseFloat(s.fontSize),fontWeight:parseInt(s.fontWeight),floor:parseFloat(s.fontSize)>=24&&parseInt(s.fontWeight)>=700?60:75,rect:{x:Math.floor(r.x-b.x),y:Math.floor(r.y-b.y),width:Math.ceil(r.width),height:Math.ceil(r.height)},sourceInlineColor:el.style.getPropertyValue('color'),sourceInlineColorPriority:el.style.getPropertyPriority('color')}});assert.equal(row.background[3],255,'Declared label fill must be opaque');assert(row.fontSize<=16,'This regression covers the inventoried small-label text');row.floor=75;
     const prefix=String(report.contexts.length).padStart(3,'0')+'-'+i,originalBytes=await panel.screenshot({animations:'disabled'});await panel.evaluate(el=>el.style.setProperty('color','transparent','important'));const backgroundBytes=await panel.screenshot({animations:'disabled'});await panel.evaluate((el,row)=>{if(row.sourceInlineColor)el.style.setProperty('color',row.sourceInlineColor,row.sourceInlineColorPriority);else el.style.removeProperty('color');},row);
     if(captures){writeFileSync(resolve(captures,prefix+'-text.png'),originalBytes);writeFileSync(resolve(captures,prefix+'-background.png'),backgroundBytes);}const sample=glyphs(decode(originalBytes),decode(backgroundBytes),row);samples.push({...sample,prefix,textPngSha256:createHash('sha256').update(originalBytes).digest('hex'),backgroundPngSha256:createHash('sha256').update(backgroundBytes).digest('hex')});
    }
    report.contexts.push({template,width,element,language,theme,samples});for(const sample of samples){assert(sample.adequateGlyphEvidence,'Insufficient template CTA interior glyph evidence');assert(sample.minimumApca>=sample.floor,'Template CTA contrast below floor: '+JSON.stringify({template,width,element,language,theme,text:sample.text,minimumApca:sample.minimumApca,floor:sample.floor}));}
   }
  }

 },{browserName});
 assert.equal(report.contexts.length,510,'Every declared template/language/element/theme context');assert.equal(report.contexts.reduce((n,c)=>n+c.samples.length,0),714,'Every visible inventoried label');report.status='passed';
}catch(error){report.status='failed';report.error=String(error);throw error;}
finally{
 report.recordedAt=new Date().toISOString();report.sourceAfter=Object.fromEntries(sourceFiles.map(p=>[p,sha(p)]));report.changedSources=sourceFiles.filter(p=>sourceBefore[p]!==report.sourceAfter[p]);
 if(evidence)writeFileSync(evidence,JSON.stringify(report,null,2)+'\n');assert.equal(report.changedSources.length,0,'Source changed during CTA check');
}
console.log(JSON.stringify({browserName,contexts:report.contexts.length,textSamples:report.contexts.reduce((n,c)=>n+c.samples.length,0),minimumApca:Math.min(...report.contexts.flatMap(c=>c.samples.map(x=>x.minimumApca))),sourceUnchanged:true}));
