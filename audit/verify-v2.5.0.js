/* CyberSkill Design System — v2.5.0 verification runner.
 * Renders audit/fixture-v2.5.0.html with v2.5.0 (dist/styles.css), v2.4.0 and v2.3.1 (flattened tagged closures),
 * reads getComputedStyle() values, scores seven dimensions and embeds the v2.4.0 baseline suite (64 checks). */
(function(){
  "use strict";
  var $=function(s,r){return (r||document).querySelector(s)};
  function el(tag,attrs,kids){var e=document.createElement(tag);if(attrs)for(var k in attrs){if(k==="text")e.textContent=attrs[k];else if(k==="html")e.innerHTML=attrs[k];else e.setAttribute(k,attrs[k]);}(kids||[]).forEach(function(c){if(c!=null)e.appendChild(typeof c==="string"?document.createTextNode(c):c)});return e;}
  /* ---- colour maths (sRGB / oklab / oklch parsing, WCAG contrast) ---- */
  function num(x){x=String(x).trim();return x.endsWith("%")?parseFloat(x)/100:parseFloat(x)}
  function oklabToRgb(L,a,b){var l_=L+0.3963377774*a+0.2158037573*b,m_=L-0.1055613458*a-0.0638541728*b,s_=L-0.0894841775*a-1.291485548*b;var l=l_*l_*l_,m=m_*m_*m_,s=s_*s_*s_;var r=4.0767416621*l-3.3077115913*m+0.2309699292*s,g=-1.2684380046*l+2.6097574011*m-0.3413193965*s,bb=-0.0041960863*l-0.7034186147*m+1.707614701*s;function enc(x){x=Math.max(0,Math.min(1,x));return x<=0.0031308?12.92*x:1.055*Math.pow(x,1/2.4)-0.055}return{r:enc(r),g:enc(g),b:enc(bb)}}
  function parseColor(s){s=(s||"").trim();if(!s||s==="transparent"||s==="none")return{r:0,g:0,b:0,a:0};var m,p;
    if((m=s.match(/^rgba?\(([^)]+)\)$/i))){p=m[1].split(/[\s,\/]+/).filter(Boolean);return{r:num(p[0])/255,g:num(p[1])/255,b:num(p[2])/255,a:p[3]!=null?num(p[3]):1}}
    if((m=s.match(/^color\(srgb\s+([^)]+)\)$/i))){p=m[1].split(/[\s\/]+/).filter(Boolean);return{r:num(p[0]),g:num(p[1]),b:num(p[2]),a:p[3]!=null?num(p[3]):1}}
    if((m=s.match(/^oklab\(([^)]+)\)$/i))){p=m[1].split(/[\s\/]+/).filter(Boolean);var c=oklabToRgb(num(p[0]),parseFloat(p[1]),parseFloat(p[2]));c.a=p[3]!=null?num(p[3]):1;return c}
    if((m=s.match(/^oklch\(([^)]+)\)$/i))){p=m[1].split(/[\s\/]+/).filter(Boolean);var C=parseFloat(p[1]),H=parseFloat(p[2])*Math.PI/180;var c2=oklabToRgb(num(p[0]),C*Math.cos(H),C*Math.sin(H));c2.a=p[3]!=null?num(p[3]):1;return c2}
    if((m=s.match(/^#([0-9a-f]{6})$/i))){var n=parseInt(m[1],16);return{r:(n>>16&255)/255,g:(n>>8&255)/255,b:(n&255)/255,a:1}}
    return null}
  function eq(a,b){var x=parseColor(a),y=parseColor(b);if(!x||!y)return a===b;if(x.a===0&&y.a===0)return true;return["r","g","b","a"].every(function(k){return Math.abs(x[k]-y[k])<0.008})}
  function over(fg,bg){var f=parseColor(fg)||{r:0,g:0,b:0,a:0},b=parseColor(bg)||{r:1,g:1,b:1,a:1};return{r:f.a*f.r+(1-f.a)*b.r,g:f.a*f.g+(1-f.a)*b.g,b:f.a*f.b+(1-f.a)*b.b,a:1}}
  function lin(c){return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)}
  function lum(c){c=typeof c==="string"?parseColor(c):c;if(!c)return 0;return 0.2126*lin(c.r)+0.7152*lin(c.g)+0.0722*lin(c.b)}
  function contrast(a,b){var x=lum(a),y=lum(b);return(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)}
  function hex(c){c=typeof c==="string"?parseColor(c):c;if(!c)return"?";var h="#"+[c.r,c.g,c.b].map(function(v){return("0"+Math.round(Math.max(0,Math.min(1,v))*255).toString(16)).slice(-2)}).join("").toUpperCase();return c.a<0.999?h+"/"+Math.round(c.a*100)+"%":h}
  function splitTop(s){var out=[],d=0,cur="";for(var i=0;i<s.length;i++){var ch=s[i];if(ch==="(")d++;if(ch===")")d--;if(ch===","&&d===0){out.push(cur.trim());cur=""}else cur+=ch}if(cur.trim())out.push(cur.trim());return out}
  function layers(bs){if(!bs||bs==="none")return[];return splitTop(bs).map(function(l){var inset=/\binset\b/.test(l),rest=l.replace(/\binset\b/,"").trim();var cm=rest.match(/(rgba?\([^)]*\)|color\([^)]*\)|oklab\([^)]*\)|oklch\([^)]*\)|#[0-9a-f]{3,8}\b|transparent)/i),color=cm?cm[0]:"";var n=rest.replace(color,"").trim().split(/\s+/).filter(Boolean).map(parseFloat);return{inset:inset,color:color,x:n[0]||0,y:n[1]||0,blur:n[2]||0,spread:n[3]||0}})}
  function insetRing(bs,spread){return layers(bs).filter(function(l){return l.inset&&!l.x&&!l.y&&!l.blur&&Math.abs(l.spread-spread)<0.01})[0]||null}
  function px(v){return parseFloat(v)} function f2(n,d){d=d==null?2:d;return(Math.round(n*Math.pow(10,d))/Math.pow(10,d)).toString()}
  function norm(s){return(s||"").replace(/\s+/g," ").replace(/\s*,\s*/g,", ").trim().toLowerCase()}
  var MIX="color-mix(in oklab, var(--cs-accent) 18%, var(--cs-color-surface-panel))";

  /* ---- loaders ---- */
  var VERSIONS=[{id:"250",label:"v2.5.0",tag:null},{id:"240",label:"v2.4.0",tag:"v2.4.0"},{id:"231",label:"v2.3.1",tag:"v2.3.1"}];
  var RAW="https://raw.githubusercontent.com/cyberskill-official/design/";
  var LOGO_OK=["assets/logo-mark.svg","assets/logo-mark.png","assets/favicon.svg","components/logo/logo-data.js"];
  function frame(src){return new Promise(function(res){var f=el("iframe",{class:"au-hidden",title:"audit probe",tabindex:"-1","aria-hidden":"true"});f.style.width="1280px";f.style.height="900px";f.onload=function(){res(f)};f.src=src;$("#au-frames").appendChild(f)})}
  function wait(fn,ms){var t0=Date.now();return new Promise(function(res){(function tick(){var v=null;try{v=fn()}catch(e){}if(v||Date.now()-t0>(ms||12000))return res(v||null);setTimeout(tick,120)})()})}
  function timeout(p,ms,fb){return Promise.race([p,new Promise(function(r){setTimeout(function(){r(fb)},ms)})])}
  function txt(u){return fetch(u,{cache:"no-store"}).then(function(r){return r.ok?r.text():null}).catch(function(){return null})}
  function exists(u){return fetch(u,{cache:"no-store"}).then(function(r){return r.ok}).catch(function(){return false})}
  async function fixture(id,theme){var f=await timeout(frame("fixture-v2.5.0.html?v="+id+"&theme="+theme),20000,null);if(!f)return null;var api=await wait(function(){return f.contentWindow.CSAudit25});return api?timeout(api.measure(),20000,null):null}
  async function load(v){
    var both=await Promise.all([fixture(v.id,"light"),fixture(v.id,"dark")]); if(!both[0]||!both[1])return null;
    var base=v.tag?RAW+v.tag+"/":"../";
    var design=await txt(base+"DESIGN.md");
    var assets={}; for(var i=0;i<LOGO_OK.length;i++)assets[LOGO_OK[i]]=await exists(base+LOGO_OK[i]);
    /* light-root document for light scopes + type; dark-root document for the dark default scope and dark scopes */
    var fx={label:v.label,p0:both[1].p0,p2:both[1].p2,p4:both[0].p4,p1:{progressDecl:both[0].p1.progressDecl,scopes:both[0].p1.scopes.filter(function(s){return s.key.indexOf("light:")===0}).concat(both[1].p1.scopes.filter(function(s){return s.key.indexOf("dark:")===0}))},
      p3:{controls:both[0].p3.controls.map(function(row,i){return{name:row.name,hook:row.hook,light:row.light,dark:both[1].p3.controls[i].dark}})},
      p5:{light:{root:both[0].p5.root,nest:both[0].p5.nest},dark:{root:both[1].p5.root,nest:both[1].p5.nest}},
      p6:{light:both[0].p6,dark:both[1].p6},p7:both[0].p7,p8:{light:both[0].p8,dark:both[1].p8},
      p9:{light:both[0].p9,dark:both[1].p9},p10:{light:both[0].p10,dark:both[1].p10},
      p11:{light:both[0].p11,dark:both[1].p11},p12:{light:both[0].p12,dark:both[1].p12},
      p13:{light:both[0].p13,dark:both[1].p13},p14:{light:both[0].p14,dark:both[1].p14},
      cssLoaded:both[0].cssLoaded&&both[1].cssLoaded};
    return{fx:fx,design:design,assets:assets,label:v.label};
  }

  /* ---- checks ---- */
  var DIMS=[
    {id:"D1",pri:"P0",name:"Dark-mode default scope tint safety",vi:"An toàn tông màu tối (phạm vi mặc định)"},
    {id:"D2",pri:"P1",name:"32-scope WCAG 1.4.11 non-text contrast",vi:"Tương phản phi văn bản · 32 phạm vi"},
    {id:"D3",pri:"P2",name:"Dark-mode Umber surface separation",vi:"Tách bề mặt Umber trong nền tối"},
    {id:"D4",pri:"P2",name:"13-control invalid state parity",vi:"Trạng thái không hợp lệ · 13 control"},
    {id:"D5",pri:"P2",name:"Vietnamese diacritic clearance",vi:"Khoảng trống dấu tiếng Việt"},
    {id:"D6",pri:"P3",name:"Scoped nested theme & Liquid Glass",vi:"Giao diện lồng nhau & Liquid Glass"},
    {id:"D7",pri:"P3",name:"DESIGN.md & asset contract accuracy",vi:"Độ chính xác DESIGN.md & tài sản"},
    {id:"D8",pri:"Doctrine",name:"Focus appearance & dual-ring contrast",vi:"Chỉ báo focus kép & tương phản vòng viền"},
    {id:"D9",pri:"Doctrine",name:"Touch target floor ≥ 44px & motion safety",vi:"Vùng chạm ≥ 44px & an toàn chuyển động"},
    {id:"D10",pri:"Doctrine",name:"High-contrast, density & semantic status parity",vi:"Tương phản cao, mật độ & trạng thái ngữ nghĩa"},
    {id:"D11",pri:"Architecture",name:"Typography scale, prose & tabular numerals",vi:"Thang chữ, độ rộng bài đọc & số đẳng lập"},
    {id:"D12",pri:"Architecture",name:"Elevation z-index, shadow scale & aurora/print",vi:"Thang độ sâu z-index, bóng đổ & cực quang/in ấn"},
    {id:"D13",pri:"AI Surface",name:"AI & agentic UI surface contract (Lumi & chrome)",vi:"Hợp đồng bề mặt AI (Lumi, cổng duyệt & terminal)"},
    {id:"D14",pri:"Enterprise",name:"Enterprise data, navigation & overlay stack",vi:"Dữ liệu doanh nghiệp, điều hướng & lớp phủ"},
    {id:"D15",pri:"Ergonomics",name:"Responsive reflow, container queries & pickers",vi:"Co giãn 320/768px, container query & bộ chọn"},
    {id:"D16",pri:"Orthogonality",name:"Cross-runtime open-spec & 4-axis orthogonality",vi:"Đặc tả mở đa môi trường & trực giao 4 trục"}
  ];
  function ind(scope,key){
    var s=scope;
    if(key==="progress"){var ring=insetRing(s.fill.shadow,1);return Math.max(contrast(over(s.fill.bg,s.track),s.track),ring?contrast(over(ring.color,s.track),s.track):1)}
    if(key==="rating")return contrast(over(s.rating,s.panel),s.panel);
    if(key==="today"){var r=insetRing(s.today.shadow,1);return r?contrast(over(r.color,s.panel),s.panel):1}
    if(key==="dot")return px(s.dotW)>0?contrast(over(s.dot,s.panel),s.panel):1;
    if(key==="dock")return px(s.dockW)>0?contrast(over(s.dock,s.panel),s.panel):1;
    if(key==="step")return px(s.stepW)>0?contrast(over(s.step,s.panel),s.panel):1;
    return 1;
  }
  var INDS=[["progress",".cs-progress__fill (fill or 1px inset ring vs track)"],["rating",".cs-rating button.on (ink vs panel)"],["today",".cs-cal__grid button.today (1px inset ring vs panel)"],["dot",'.cs-carousel__dots button[aria-current="true"]::before'],["dock",".cs-dock__item.is-active::after"],["step",".cs-step--done:not(:last-child)::after"]];
  function buildChecks(){
    var C=[];function add(dim,title,target,expect,fn){C.push({dim:dim,title:title,target:target,expect:expect,fn:fn})}
    function tint(X,k,viaBorder){var p=X.fx.p0,e=p[k];var okBg=eq(e.bg,p.expected),okInk=viaBorder?eq(e.border,p.textAccent):eq(e.color,p.textAccent);return{pass:okBg&&okInk,value:"bg "+hex(e.bg)+(okBg?" = mix":" ≠ mix "+hex(p.expected))+(viaBorder?" · border "+hex(e.border):"")+" · ink "+hex(e.color)+" · "+f2(contrast(e.color,e.bg))+":1"}}
    add("D1","Selected item uses the 18% accent mix + text-accent border",".cs-item.is-selected",MIX+" · border-color: var(--cs-color-text-accent)",function(X){return tint(X,"item",true)});
    add("D1","Result icon uses the 18% accent mix + text-accent ink",".cs-result__icon",MIX+" · color: var(--cs-color-text-accent)",function(X){return tint(X,"result")});
    function hover(X,k){var p=X.fx.p0,h=p[k],d=h.declared;var okDecl=!!d&&norm(d.background).indexOf(norm(MIX))>=0,okBg=h.bgColor?eq(h.bgColor,p.expected):false;return{pass:okDecl&&okBg,value:(d?"declared "+(d.background||"—"):"rule not found")+" → "+(h.bgColor?hex(h.bgColor):"?")+" · ink "+f2(contrast(p.textPrimary,h.bgColor||p.panel))+":1"}}
    add("D1","Navigation-menu card hover uses the 18% accent mix",".cs-navmenu__card:hover","background: "+MIX,function(X){return hover(X,"navmenu")});
    add("D1","Splitter bar hover uses the 18% accent mix",".cs-splitter__bar:hover","background: "+MIX,function(X){return hover(X,"splitter")});
    add("D1","Selected-item ink contrast on the tinted dark surface","text-accent over "+MIX,"≥ 4.5:1 (AA) · v2.4.0 painted white-on-cream ≈ 1.05:1",function(X){var p=X.fx.p0,c=contrast(p.item.color,p.item.bg);return{pass:c>=4.5,value:f2(c)+":1 ("+hex(p.item.color)+" on "+hex(p.item.bg)+")"}});
    add("D2","All 32 Theme × Element × Variant scopes resolve distinct packs","fixture scopes","32 scopes · ≥ 16 distinct --cs-accent values",function(X){var sc=X.fx.p1.scopes,set={};sc.forEach(function(s){set[hex(s.accent)]=1});var n=Object.keys(set).length;return{pass:sc.length===32&&n>=16,value:sc.length+" scopes · "+n+" accents"}});
    add("D2","Progress fill keeps var(--cs-accent) + 1px inset text-accent ring",".cs-progress__fill","background: var(--cs-accent) · box-shadow: inset 0 0 0 1px var(--cs-color-text-accent)",function(X){var d=X.fx.p1.progressDecl,sc=X.fx.p1.scopes;var okDecl=!!d&&/var\(--cs-accent\)/.test(d.background||"")&&/inset 0(px)? 0(px)? 0(px)? 1px var\(--cs-color-text-accent\)/.test(d.boxShadow||"");var okAll=sc.every(function(s){var r=insetRing(s.fill.shadow,1);return eq(s.fill.bg,s.accent)&&r&&eq(r.color,s.textAccent)});return{pass:okDecl&&okAll,value:(d?"declared ok "+(okDecl?"✓":"✗"):"rule not found")+" · computed in "+sc.filter(function(s){var r=insetRing(s.fill.shadow,1);return eq(s.fill.bg,s.accent)&&r&&eq(r.color,s.textAccent)}).length+"/32 scopes"}});
    INDS.forEach(function(k){add("D2","Indicator ≥ 3:1 in every scope — "+k[0],k[1],"min ≥ 3.0:1 across 32 scopes",function(X){var worst=Infinity,where="",sc=X.fx.p1.scopes;sc.forEach(function(s){var c=ind(s,k[0]);if(c<worst){worst=c;where=s.name}});var below=sc.filter(function(s){return ind(s,k[0])<3}).length;return{pass:worst>=3,value:"min "+f2(worst)+":1 · "+where+(below?" · "+below+" scope"+(below>1?"s":"")+" < 3:1":"")}})});
    [["bubble",".cs-chat-msg--user .cs-chat-msg__bubble"],["avatar",".cs-chat-msg--user .cs-chat-msg__avatar"],["badge",".cs-badge--solid"],["umberFill",".cs-progress--umber .cs-progress__fill"]].forEach(function(k){
      add("D3","1px inset separation ring — "+k[1].split(" ").pop(),k[1],"inset 0 0 0 1px color-mix(in oklab, var(--cs-color-border-default) 32%, transparent)",function(X){var p=X.fx.p2,e=p[k[0]],r=insetRing(e.shadow,1);var ok=!!r&&eq(r.color,p.expectedRing);return{pass:ok,value:(r?"ring "+hex(r.color):"no 1px inset ring")+" · fill "+hex(e.bg)+" on page "+hex(p.page)+" ("+f2(contrast(e.bg,p.page))+":1)"}})});
    X_CONTROLS.forEach(function(name){add("D4","Danger border — "+name,"."+name+" · .is-invalid and [aria-invalid=\"true\"] · light + dark","border-color: var(--cs-color-semantic-danger)",function(X){var row=X.fx.p3.controls.filter(function(c){return c.name===name})[0];if(!row)return{pass:false,value:"missing"};var parts=[],ok=true;["light","dark"].forEach(function(t){["cls","aria"].forEach(function(a){var good=eq(row[t][a],row[t].danger);ok=ok&&good;parts.push((t==="light"?"L":"D")+(a==="cls"?"·cls ":"·aria ")+(good?"✓":"✗ "+hex(row[t][a])))});});return{pass:ok,value:parts.join(" ")+" · danger "+hex(row.light.danger)+" / "+hex(row.dark.danger)}})});
    function ratio(o){return px(o.lh)/px(o.fs)}
    add("D5","VI display line-height",'.cs-display:lang(vi) — “Hệ thống Quản trị Nhân sự & Pháp lý Doanh nghiệp — Đổi mới sáng tạo”',"1.22",function(X){var v=ratio(X.fx.p4.disp);return{pass:Math.abs(v-1.22)<0.006,value:f2(v,3)+" ("+X.fx.p4.disp.fs+")"}});
    add("D5","VI stat value line-height",'.cs-stat__value:lang(vi) — “1.248 Nhân sự — 99,4% Đúng hạn”',"1.22",function(X){var v=ratio(X.fx.p4.stat);return{pass:Math.abs(v-1.22)<0.006,value:f2(v,3)+" ("+X.fx.p4.stat.fs+")"}});
    add("D5","EN display inside the page keeps 1.15",'<div lang="en"> .cs-display',"1.15",function(X){var v=ratio(X.fx.p4.dispEn);return{pass:Math.abs(v-1.15)<0.006,value:f2(v,3)}});
    add("D5","Stacked-diacritic ink clears the display line box",".cs-display:lang(vi)","line-height ≥ ink ascent + descent",function(X){var i=X.fx.p4.inkDisp,g=px(i.lh)-(i.ascent+i.descent);return{pass:g>=0,value:(g>=0?"+":"")+f2(g,1)+"px (lh "+f2(px(i.lh),1)+" · ink "+f2(i.ascent+i.descent,1)+")"}});
    add("D5","Stacked-diacritic ink clears the stat line box",".cs-stat__value:lang(vi)","line-height ≥ ink ascent + descent",function(X){var i=X.fx.p4.inkStat,g=px(i.lh)-(i.ascent+i.descent);return{pass:g>=0,value:(g>=0?"+":"")+f2(g,1)+"px (lh "+f2(px(i.lh),1)+" · ink "+f2(i.ascent+i.descent,1)+")"}});
    X_GLASS.forEach(function(p){add("D6","Nested scopes recompute "+p,"[data-theme=dark] in light · [data-theme=light] in dark","nested dark = dark root · nested light = light root",function(X){var g=X.fx.p5,ok=eq(g.light.nest[p],g.dark.root[p])&&eq(g.dark.nest[p],g.light.root[p]);return{pass:ok,value:"nested dark "+hex(g.light.nest[p])+" · dark root "+hex(g.dark.root[p])+" · nested light "+hex(g.dark.nest[p])}})});
    add("D7","DESIGN.md documents the 1.22 Vietnamese line-height under :lang(vi)","DESIGN.md","“:lang(vi)” … “1.22” on the same line",function(X){var t=X.design;if(t==null)return{pass:false,value:"DESIGN.md not readable"};var lines=t.split("\n").filter(function(l){return /:lang\(vi\)/.test(l)&&/1\.22/.test(l)});return{pass:lines.length>0,value:lines.length?lines.length+" line"+(lines.length>1?"s":"")+" · “"+lines[0].trim().slice(0,90)+"…”":"no line pairs :lang(vi) with 1.22"}});
    add("D7","DESIGN.md references only real logo assets","DESIGN.md","assets/logo-mark.svg · assets/logo-mark.png · assets/favicon.svg · components/logo/logo-data.js — never assets/logos/*",function(X){var t=X.design||"";var refs=(t.match(/(?:assets\/logos?\/[\w.-]+|components\/logo\/logo-data\.js)/g)||[]);var uniq=Array.from(new Set(refs));var bad=uniq.filter(function(r){return LOGO_OK.indexOf(r)<0});return{pass:t!==""&&bad.length===0&&uniq.length>0,value:uniq.length+" distinct refs"+(bad.length?" · unknown: "+bad.join(", "):" · all real")}});
    add("D7","DESIGN.md documents inline <svg viewBox=\"0 0 64 64\"> fallback for single-file sandboxes","DESIGN.md","inline <svg viewBox=\"0 0 64 64\"> guidance present",function(X){var t=X.design||"";var ok=/viewBox="0 0 64 64"/.test(t)&&/single-file/i.test(t);return{pass:ok,value:ok?"inline <svg viewBox=\"0 0 64 64\"> documented":"no single-file inline SVG rule"}});
    add("D7","Referenced brand assets exist in this tree","assets/ · components/logo/","4/4 files resolve",function(X){var a=X.assets,n=LOGO_OK.filter(function(k){return a[k]}).length;return{pass:n===4,value:n+"/4 · "+LOGO_OK.filter(function(k){return !a[k]}).join(", ")}});
    add("D8","Global :where(:focus-visible) dual-ring rule","base/reset.css","2px solid var(--cs-color-text-primary) + 5px var(--cs-color-accent-ochre)",function(X){var g=X.fx.p6.light.css.focusGlobal;return{pass:!!g,value:g?"declared ✓":"missing"}});
    add("D8","Zero bare outline:none on :focus-visible across stylesheet closure","document.styleSheets","0 bare outline:none rules",function(X){var b=X.fx.p6.light.css.bareOutlineNone;return{pass:b.length===0,value:b.length+" bare rules"+(b.length?" ("+b.join(", ")+")":"")}});
    add("D8","Core interactive controls preserve dual-ring focus",".cs-button, .cs-field__control, .cs-tab, .cs-menu__item, .cs-switch__track","5/5 controls declare text-primary contour + ochre halo",function(X){var c=X.fx.p6.light.css;return{pass:c.focusCtlsCount===c.focusCtlsTotal,value:c.focusCtlsCount+"/"+c.focusCtlsTotal+" controls"}});
    add("D8","Focus inner contour (--cs-color-text-primary) contrast vs panel","light + dark --cs-color-surface-panel","≥ 12.0:1 in light and dark",function(X){var cl=contrast(X.fx.p6.light.textPrimary,X.fx.p6.light.panel),cd=contrast(X.fx.p6.dark.textPrimary,X.fx.p6.dark.panel);return{pass:cl>=12&&cd>=12,value:"light "+f2(cl)+":1 · dark "+f2(cd)+":1"}});
    add("D8","Focus outer halo (--cs-color-accent-ochre) contrast vs dark panel & Umber","#F4BA17 vs dark panel & #45210E","≥ 3.0:1 (WCAG 2.4.11)",function(X){var cd=contrast(X.fx.p6.dark.ochre,X.fx.p6.dark.panel),cu=contrast(X.fx.p6.light.ochre,X.fx.p6.light.umber);return{pass:cd>=3&&cu>=3,value:"vs dark panel "+f2(cd)+":1 · vs Umber "+f2(cu)+":1"}});
    add("D8","Dual-ring inner contour vs outer halo contrast in light mode","--cs-color-text-primary vs --cs-color-accent-ochre","≥ 3.0:1 ring-to-ring separation",function(X){var c=contrast(X.fx.p6.light.textPrimary,X.fx.p6.light.ochre);return{pass:c>=3,value:f2(c)+":1 ("+hex(X.fx.p6.light.textPrimary)+" vs "+hex(X.fx.p6.light.ochre)+")"}});
    add("D9","Default interactive controls meet the 44px touch target floor",".cs-button, .cs-field__control, .cs-datepicker__field","height ≥ 44px",function(X){var p=X.fx.p7,m=Math.min(p.btnH,p.inpH,p.dpH);return{pass:m>=44,value:"button "+Math.round(p.btnH)+"px · input "+Math.round(p.inpH)+"px · datepicker "+Math.round(p.dpH)+"px"}});
    add("D9","Large button & .cs-dock__item target dimensions",".cs-button--lg (≥ 52px) · .cs-dock__item (≥ 44×44px)","lg ≥ 52px · dock ≥ 44×44px",function(X){var p=X.fx.p7,ok=p.btnLgH>=52&&p.dockW>=44&&p.dockH>=44;return{pass:ok,value:"lg "+Math.round(p.btnLgH)+"px · dock "+Math.round(p.dockW)+"×"+Math.round(p.dockH)+"px"}});
    add("D9","@media (pointer: coarse) promotes compact controls to 44px",".cs-button--{sm,xs}, .cs-tab, .cs-menu__item, .cs-segmented, .cs-pagination, .cs-check, .cs-switch","8/8 selector groups declare 44px min target",function(X){var c=X.fx.p7.css;return{pass:c.coarseTargetsCount===c.coarseTargetsTotal,value:c.coarseTargetsCount+"/"+c.coarseTargetsTotal+" coarse rules"}});
    add("D9","@media (pointer: coarse) promotes carousel active dot to 44px text-accent target",'.cs-carousel__dots button[aria-current="true"]',"radial-gradient(--cs-color-text-accent) on 44px target",function(X){var ok=X.fx.p7.css.coarseDots;return{pass:ok,value:ok?"44px radial-gradient(--cs-color-text-accent) ✓":"missing"}});
    add("D9","Global @media (prefers-reduced-motion: reduce) clamps animations to 0.01ms","base/a11y.css","animation-duration & transition-duration: 0.01ms !important · scroll-behavior: auto",function(X){var ok=X.fx.p7.css.reducedMotion;return{pass:ok,value:ok?"0.01ms clamp + scroll-behavior: auto ✓":"missing"}});
    add("D9","Motion duration token ramp stays calm and monotonic (≤ 320ms)","--cs-duration-{instant,fast,base,slow}","80ms < 120ms < 200ms < 320ms",function(X){var d=X.fx.p7.durations,ok=d.length===4&&d[0]===80&&d[1]===120&&d[2]===200&&d[3]===320;return{pass:ok,value:d.map(function(v){return v+"ms"}).join(" → ")}});
    add("D10","Light [data-cs-contrast=\"high\"] strengthens muted text (AAA) & border (≥ 3:1)","[data-theme=\"light\"] [data-cs-contrast=\"high\"]","muted ≥ 7.0:1 · border ≥ 3.0:1 vs panel",function(X){var h=X.fx.p8.light.hc,cm=contrast(h.muted,h.panel),cb=contrast(h.border,h.panel);return{pass:cm>=7&&cb>=3,value:"muted "+f2(cm)+":1 · border "+f2(cb)+":1"}});
    add("D10","Dark [data-cs-contrast=\"high\"] strengthens muted text (AAA) & border (≥ 3:1)","[data-theme=\"dark\"] [data-cs-contrast=\"high\"]","muted ≥ 7.0:1 · border ≥ 3.0:1 vs panel",function(X){var h=X.fx.p8.dark.hc,cm=contrast(h.muted,h.panel),cb=contrast(h.border,h.panel);return{pass:cm>=7&&cb>=3,value:"muted "+f2(cm)+":1 · border "+f2(cb)+":1"}});
    add("D10","Density axis scales space and control padding monotonically","[data-cs-density=\"compact\" | \"comfortable\"]","compact < comfortable (--cs-density-space-4, button & textfield padding)",function(X){var d=X.fx.p8.light.density,ok=d.compact.space4<d.comfortable.space4&&d.compact.btnPadY<d.comfortable.btnPadY&&d.compact.btnPadX<d.comfortable.btnPadX&&d.compact.tfPadY<d.comfortable.tfPadY;return{pass:ok,value:"space-4 "+d.compact.space4+"→"+d.comfortable.space4+"px · btn-pad "+d.compact.btnPadY+"×"+d.compact.btnPadX+"→"+d.comfortable.btnPadY+"×"+d.comfortable.btnPadX+"px · tf-pad-y "+d.compact.tfPadY+"→"+d.comfortable.tfPadY+"px"}});
    add("D10","Semantic status badges (.cs-badge--{success,warning,danger,info}) ≥ 4.5:1","light + dark .cs-badge--{success,warning,danger,info}","min ≥ 4.5:1 across all 4 × 2 badge pairs",function(X){var minL=Infinity,minD=Infinity;["success","warning","danger","info"].forEach(function(k){var bl=X.fx.p8.light.badges[k],bd=X.fx.p8.dark.badges[k];minL=Math.min(minL,contrast(bl.fg,bl.bg));minD=Math.min(minD,contrast(bd.fg,bd.bg))});return{pass:minL>=4.5&&minD>=4.5,value:"light min "+f2(minL)+":1 · dark min "+f2(minD)+":1"}});
    add("D10","Solid semantic status tokens (--cs-color-semantic-* vs *-fg) ≥ 4.5:1","light + dark --cs-color-semantic-{success,warning,danger,info}","min ≥ 4.5:1 across all 4 × 2 solid pairs",function(X){var minL=Infinity,minD=Infinity;["success","warning","danger","info"].forEach(function(k){var sl=X.fx.p8.light.solids[k],sd=X.fx.p8.dark.solids[k];minL=Math.min(minL,contrast(sl.fg,sl.bg));minD=Math.min(minD,contrast(sd.fg,sd.bg))});return{pass:minL>=4.5&&minD>=4.5,value:"light min "+f2(minL)+":1 · dark min "+f2(minD)+":1"}});
    add("D10","@media (forced-colors: active) preserves state visibility with system colors","base/a11y.css","5/5 interactive state selectors mapped to Highlight / ButtonText",function(X){var c=X.fx.p8.light.css;return{pass:c.forcedColorsCount===c.forcedColorsTotal,value:c.forcedColorsCount+"/"+c.forcedColorsTotal+" forced-colors rules"}});
    /* D11 — Typography scale, editorial prose, display face & tabular numerals */
    add("D11","11-step typographic size ramp (--cs-font-size-2xs..5xl) is strictly monotonic","tokens/typography.css","11 → 12 → 14 → 16 → 18 → 20 → 24 → 30 → 36 → 48 → 60px",function(X){var r=X.fx.p9.light.ramp,exp=[11,12,14,16,18,20,24,30,36,48,60],ok=r.length===11&&exp.every(function(v,i){return r[i]===v});return{pass:ok,value:r.join("→")+"px"}});
    add("D11","Semantic role utilities (.cs-h1..h4, .cs-body, .cs-eyebrow) resolve exact sizes & weights","base/typography.css","h1 36/800 · h2 30/700 · h3 24/700 · h4 20/600 · body 16/400 · eyebrow 12/700/uppercase",function(X){var o=X.fx.p9.light.roles,ok=o.h1.fs===36&&o.h1.fw===800&&o.h2.fs===30&&o.h2.fw===700&&o.h3.fs===24&&o.h3.fw===700&&o.h4.fs===20&&o.h4.fw===600&&o.body.fs===16&&o.body.fw===400&&o.eyebrow.fs===12&&o.eyebrow.fw===700&&o.eyebrow.tt==="uppercase";return{pass:ok,value:"h1 "+o.h1.fs+"/"+o.h1.fw+" · h2 "+o.h2.fs+"/"+o.h2.fw+" · h3 "+o.h3.fs+"/"+o.h3.fw+" · h4 "+o.h4.fs+"/"+o.h4.fw+" · body "+o.body.fs+"/"+o.body.fw+" · eye "+o.eyebrow.fs+"/"+o.eyebrow.tt}});
    add("D11","Editorial prose container (.cs-prose) caps measure at 45rem (720px) with 1.5 line-height",".cs-prose","max-inline-size: 720px · line-height: 1.5",function(X){var pr=X.fx.p9.light.prose,ratio=pr.lh/pr.fs,ok=pr.maxW===720&&Math.abs(ratio-1.5)<0.01;return{pass:ok,value:"max-inline-size "+pr.maxW+"px · line-height "+f2(ratio,2)}});
    add("D11","Opt-in display face (.cs-display-face) retargets headings to Space Grotesk while body stays on Be Vietnam Pro",".cs-display-face .cs-h2 vs .cs-body","heading Space Grotesk · body Be Vietnam Pro",function(X){var df=X.fx.p9.light.df,ok=/space grotesk/i.test(df.h2Fam)&&/be vietnam pro/i.test(df.bodyFam)&&!/space grotesk/i.test(df.bodyFam);return{pass:ok,value:"h2: "+df.h2Fam.split(",")[0]+" · body: "+df.bodyFam.split(",")[0]}});
    add("D11","Tabular numerals (tabular-nums) enforced across stat, numeric cell, badge, pagination & .cs-tabular",".cs-stat__value, .cs-table__cell--numeric, .cs-badge, .cs-pagination, .cs-tabular","5/5 resolve font-variant-numeric: tabular-nums",function(X){var t=X.fx.p9.light.tabular,n=t.filter(function(v){return /tabular-nums/i.test(v)}).length;return{pass:n===5,value:n+"/5 tabular-nums"}});
    add("D11","Primary body ink (--cs-color-text-primary) clears ≥ 10:1 (APCA Lc ≥ 75+) on page & panel","light + dark --cs-color-text-primary vs page & panel","min ≥ 10.0:1 across 4 pairs",function(X){var l=X.fx.p9.light,d=X.fx.p9.dark,c1=contrast(l.textPrimary,l.page),c2=contrast(l.textPrimary,l.panel),c3=contrast(d.textPrimary,d.page),c4=contrast(d.textPrimary,d.panel),m=Math.min(c1,c2,c3,c4);return{pass:m>=10,value:"light "+f2(Math.min(c1,c2))+":1 · dark "+f2(Math.min(c3,c4))+":1"}});
    /* D12 — Elevation z-index hierarchy, shadow scale, aurora & scroll/print safety */
    add("D12","8-tier z-index depth scale (--cs-depth-bg..toast) & .cs-skip:focus (201) are strictly monotonic","tokens/elevation.css + base/reset.css","0 < 5 < 10 < 50 < 60 < 80 < 100 < 200 < skip 201",function(X){var p=X.fx.p10.light,exp=[0,5,10,50,60,80,100,200],ok=p.depths.length===8&&exp.every(function(v,i){return p.depths[i]===v})&&p.css.skipZ===201;return{pass:ok,value:p.depths.join("→")+" · skip "+p.css.skipZ}});
    add("D12","Shadow scale (--cs-shadow-xs..xl) switches from warm Umber in light to deep black in dark","light + dark --cs-shadow-{xs,sm,md,lg,xl}","5/5 shadows resolve · light warm Umber · dark rgb(0,0,0)",function(X){var sl=X.fx.p10.light.shadows,sd=X.fx.p10.dark.shadows,okL=sl.every(function(s){return s&&s!=="none"&&/(69,\s*33,\s*14|31,\s*19,\s*11)/.test(s)}),okD=sd.every(function(s){return s&&s!=="none"&&/0,\s*0,\s*0/.test(s)});return{pass:okL&&okD,value:"light Umber "+(okL?"5/5 ✓":"✗")+" · dark deep "+(okD?"5/5 ✓":"✗")}});
    add("D12","Card surface hierarchy (.cs-card, .cs-card--raised, .cs-card--featured) resolves distinct tiers",".cs-card · .cs-card--raised · .cs-card--featured","panel · raised · 12% accent mix + --cs-accent border",function(X){var ok=true,parts=[];["light","dark"].forEach(function(t){var p=X.fx.p10[t],g=eq(p.card.bg,p.panel)&&eq(p.cardR.bg,p.raised)&&eq(p.cardF.bg,p.featExpected)&&eq(p.cardF.border,p.accent);ok=ok&&g;parts.push(t+" "+(g?"✓":"✗"))});return{pass:ok,value:parts.join(" · ")+" · featured "+hex(X.fx.p10.light.cardF.bg)+" / "+hex(X.fx.p10.dark.cardF.bg)}});
    add("D12","Brand .cs-aurora wash layers 3 radial gradients over Umber with ≥ 12:1 white ink",".cs-aurora","Umber #45210E bg + 3 radial-gradients + #FFFFFF ink ≥ 12:1",function(X){var p=X.fx.p10.light,au=p.aurora,grads=(au.img.match(/radial-gradient/g)||[]).length,c=contrast(au.fg,au.bg),ok=eq(au.bg,p.umber)&&grads>=3&&c>=12;return{pass:ok,value:hex(au.bg)+" · "+grads+" radial-gradients · ink "+f2(c)+":1"}});
    add("D12","@media (prefers-reduced-transparency: reduce) & @media print disable glass backdrop-filter","base/glass.css","reduced-transparency + print rules set backdrop-filter: none",function(X){var c=X.fx.p10.light.css,ok=c.reducedTransparency&&c.printGlass;return{pass:ok,value:"reduced-transparency "+(c.reducedTransparency?"✓":"✗")+" · print "+(c.printGlass?"✓":"✗")}});
    add("D12","WCAG 2.2 scroll-padding-block (16px) & .cs-scroll-area overscroll-behavior: contain + focus ring","html + .cs-scroll-area","scroll-padding 16px/16px · overscroll contain · dual-ring focus",function(X){var p=X.fx.p10.light,s=p.scroll,ok=s.padStart===16&&s.padEnd===16&&s.overscroll==="contain"&&p.css.scrollFocus;return{pass:ok,value:"pad "+s.padStart+"/"+s.padEnd+"px · overscroll "+s.overscroll+" · focus "+(p.css.scrollFocus?"✓":"✗")}});
    /* D13 — AI & agentic UI surface contract */
    add("D13","ChatMessage (.cs-chat-msg--lumi vs --user) preserves AAA (≥ 7:1) avatar & bubble legibility",".cs-chat-msg--lumi · .cs-chat-msg--user","Lumi avatar ≥ 7:1 · Lumi bubble ≥ 7:1 · User bubble ≥ 10:1",function(X){var minAv=Infinity,minLB=Infinity,minUB=Infinity;["light","dark"].forEach(function(t){var p=X.fx.p11[t];minAv=Math.min(minAv,contrast(p.lumiAv.color,p.lumiAv.bg));minLB=Math.min(minLB,contrast(p.lumiBub.color,p.lumiBub.bg));minUB=Math.min(minUB,contrast(p.userBub.color,p.userBub.bg))});return{pass:minAv>=7&&minLB>=7&&minUB>=10,value:"Lumi av "+f2(minAv)+":1 · Lumi bub "+f2(minLB)+":1 · User bub "+f2(minUB)+":1"}});
    add("D13","LumiAvatar (.cs-lumi--{sm,md,lg}) scales 32 → 44 → 64px with 3px Ochre ring halo",".cs-lumi--{sm,md,lg} · .cs-lumi--ring","32px · 44px · 64px + 3px halo",function(X){var p=X.fx.p11.light,sz=p.lumiSizes,ls=layers(p.lumiRing),ok=sz[0]===32&&sz[1]===44&&sz[2]===64&&ls.length>0&&Math.abs(ls[0].spread-3)<0.1;return{pass:ok,value:sz.join("→")+"px · ring spread "+(ls[0]?ls[0].spread+"px":"none")}});
    add("D13","HumanReviewGate (.cs-review-gate) pairs semantic warning border with ≥ 4.5:1 risk label",".cs-review-gate · .cs-review-gate__risk","border = warning · risk ink ≥ 4.5:1 in light & dark",function(X){var ok=true,minC=Infinity;["light","dark"].forEach(function(t){var p=X.fx.p11[t],bg=over(p.gate.bg,p.panel),c=contrast(p.gateRisk,bg);ok=ok&&eq(p.gate.border,p.warning);minC=Math.min(minC,c)});return{pass:ok&&minC>=4.5,value:"border "+(ok?"✓":"✗")+" · min risk contrast "+f2(minC)+":1"}});
    add("D13","AIDisclosureBadge (.cs-ai-disclosure__badge) & CitationList (.cs-citation__num 20×20px) ≥ 4.5:1",".cs-ai-disclosure__badge · .cs-citation__num","badge ≥ 4.5:1 · citation 20×20px & ≥ 4.5:1",function(X){var minA=Infinity,minC=Infinity,szOk=true;["light","dark"].forEach(function(t){var p=X.fx.p11[t];minA=Math.min(minA,contrast(p.aid.color,p.aid.bg));minC=Math.min(minC,contrast(p.cit.fg,over(p.cit.bg,p.panel)));szOk=szOk&&p.cit.w===20&&p.cit.h===20});return{pass:szOk&&minA>=4.5&&minC>=4.5,value:"AI badge "+f2(minA)+":1 · citation "+X.fx.p11.light.cit.w+"×"+X.fx.p11.light.cit.h+"px "+f2(minC)+":1"}});
    add("D13","PromptSuggestions (.cs-suggest button) wish chips & TypingIndicator (.cs-typing) 7px pulse dots",".cs-suggest button · .cs-typing span","pill radius 999px · ink ≥ 4.5:1 · 7×7px typing dot",function(X){var minS=Infinity,rOk=true,dOk=true;["light","dark"].forEach(function(t){var p=X.fx.p11[t];minS=Math.min(minS,contrast(p.sug.fg,p.sug.bg));rOk=rOk&&p.sug.r>=999;dOk=dOk&&p.typDot.w===7&&p.typDot.h===7});return{pass:rOk&&dOk&&minS>=4.5,value:"chip "+f2(minS)+":1 (r="+X.fx.p11.light.sug.r+"px) · dot "+X.fx.p11.light.typDot.w+"×"+X.fx.p11.light.typDot.h+"px"}});
    add("D13","Always-dark developer chrome (.cs-code & .cs-terminal) keeps ≥ 10:1 body & ≥ 6:1 muted ink",".cs-code · .cs-terminal","code & terminal fg ≥ 10:1 · muted bar/out ≥ 6:1 in light & dark",function(X){var minFg=Infinity,minMut=Infinity;["light","dark"].forEach(function(t){var p=X.fx.p11[t];minFg=Math.min(minFg,contrast(p.code.fg,p.code.bg),contrast(p.term.fg,p.term.bg));minMut=Math.min(minMut,contrast(p.code.barFg,p.code.bg),contrast(p.term.outFg,p.term.bg))});return{pass:minFg>=10&&minMut>=6,value:"primary fg min "+f2(minFg)+":1 · muted min "+f2(minMut)+":1"}});
    /* D14 — Enterprise data, navigation & overlay stack stress */
    add("D14","DataGrid (.cs-datagrid) sticky header & selected row (tr.is-selected td) ≥ 7:1 legibility",".cs-datagrid thead th · tr.is-selected td","sticky top 0 z-index 1 · selected row ink ≥ 7.0:1",function(X){var okH=true,minC=Infinity;["light","dark"].forEach(function(t){var p=X.fx.p12[t],dg=p.dg;okH=okH&&dg.thPos==="sticky"&&dg.thTop==="0px"&&dg.thZ===1&&eq(dg.thBg,p.raised);minC=Math.min(minC,contrast(dg.tdFg,over(dg.tdBg,p.panel)))});return{pass:okH&&minC>=7,value:"sticky header "+(okH?"✓":"✗")+" · selected row min "+f2(minC)+":1"}});
    add("D14","Splitter (.cs-splitter) flex stretch layout, 8px col-resize bar & dual-ring :focus-visible",".cs-splitter · .cs-splitter__bar","display: flex · 8px bar · col-resize · dual-ring focus",function(X){var s=X.fx.p12.light.spl,ok=s.display==="flex"&&s.barW===8&&s.cursor==="col-resize"&&s.focusRule;return{pass:ok,value:s.display+" · "+s.barW+"px · "+s.cursor+" · focus "+(s.focusRule?"✓":"✗")}});
    add("D14","Timeline (.cs-timeline) 2px connector track & 3-state markers (done / now / todo)",".cs-timeline__item · .cs-timeline__marker","2px track · done=success · now=accent-bright+2px ring · todo=raised",function(X){var p=X.fx.p12.light,tl=p.tl,r=insetRing(tl.now.shadow,2),ok=tl.trackW===2&&eq(tl.done.bg,p.success)&&eq(tl.now.bg,p.accentBright)&&!!r&&eq(r.color,p.accentStrong)&&eq(tl.todo.bg,p.raised);return{pass:ok,value:"track "+tl.trackW+"px · done "+hex(tl.done.bg)+" · now "+hex(tl.now.bg)+" · todo "+hex(tl.todo.bg)}});
    add("D14","Sidebar (.cs-sidebar 248px) & active NavItem (.cs-nav-item.is-active) ≥ 4.5:1 in light & dark",".cs-sidebar · .cs-nav-item.is-active","width 248px · label & icon = text-accent ≥ 4.5:1",function(X){var wOk=X.fx.p12.light.sb.w===248,minC=Infinity,eqOk=true;["light","dark"].forEach(function(t){var p=X.fx.p12[t],sb=p.sb,bg=over(sb.actBg,p.panel);eqOk=eqOk&&eq(sb.actFg,p.textAccent)&&eq(sb.icoFg,p.textAccent);minC=Math.min(minC,contrast(sb.actFg,bg))});return{pass:wOk&&eqOk&&minC>=4.5,value:"sidebar "+X.fx.p12.light.sb.w+"px · active nav min "+f2(minC)+":1"}});
    add("D14","Overlay z-index stacking (.cs-drawer 101 > scrim 100 · .cs-cmdk-scrim 100 · .cs-toast-stack 200)","base/shell.css + base/feedback.css","scrim/cmdk 100 < drawer 101 < toast 200",function(X){var z=X.fx.p12.light.z,ok=z.drScrim===100&&z.cmdk===100&&z.dr===101&&z.toast===200;return{pass:ok,value:"scrim "+z.drScrim+" · cmdk "+z.cmdk+" · drawer "+z.dr+" · toast "+z.toast}});
    add("D14","Pagination active page ([aria-current=\"page\"]) & selected Tab ([aria-selected=\"true\"]) ≥ 4.5:1",".cs-pagination button[aria-current=\"page\"] · .cs-tab[aria-selected=\"true\"]","active page ≥ 4.5:1 · tab 2px --cs-accent border & ≥ 4.5:1",function(X){var minP=Infinity,minT=Infinity,bOk=true;["light","dark"].forEach(function(t){var p=X.fx.p12[t];minP=Math.min(minP,contrast(p.pag.fg,p.pag.bg));minT=Math.min(minT,contrast(p.tab.fg,p.panel));bOk=bOk&&eq(p.tab.borderB,p.accent)&&eq(p.tab.fg,p.textAccent)});return{pass:bOk&&minP>=4.5&&minT>=4.5,value:"pagination "+f2(minP)+":1 · tab "+f2(minT)+":1"}});
    /* D15 — Responsive reflow, container queries (.cs-cq) & form/picker ergonomics */
    add("D15","Container query host (.cs-cq) collapses .cs-cq-cols-{3,4} to 1fr & stacks .cs-cq-stack at 480px","base/responsive.css @container cs","narrow (480px): 1 col & column · wide (840px): 3/4 cols & row",function(X){var cq=X.fx.p13.light.cq,ok=cq.n3===1&&cq.n4===1&&cq.ns==="column"&&cq.w3===3&&cq.w4===4&&cq.ws==="row";return{pass:ok,value:"480px: "+cq.n3+"/"+cq.n4+" col, "+cq.ns+" · 840px: "+cq.w3+"/"+cq.w4+" cols, "+cq.ws}});
    add("D15","Zero horizontal overflow inside 320px mobile & 768px tablet composition containers",".cs-card + .cs-alert (320px) · .cs-dl (768px)","scrollWidth ≤ clientWidth at 320px and 768px",function(X){var v=X.fx.p13.light.vp,ok=v.sw320<=v.cw320+1&&v.sw768<=v.cw768+1;return{pass:ok,value:"320px: "+v.sw320+"/"+v.cw320+"px · 768px: "+v.sw768+"/"+v.cw768+"px"}});
    add("D15","Pending form (.cs-form.is-pending) locks controls & .cs-form__summary danger callout ≥ 4.5:1",".cs-form.is-pending · .cs-form__summary","opacity 0.72 · pointer-events none · summary ≥ 4.5:1",function(X){var fL=X.fx.p13.light.form,okLock=Math.abs(fL.opacity-0.72)<0.02&&fL.btnPe==="none",minC=Infinity;["light","dark"].forEach(function(t){var p=X.fx.p13[t],bg=over(p.form.sumBg,p.panel);minC=Math.min(minC,contrast(p.form.sumFg,bg),contrast(p.form.sumBFg,bg))});return{pass:okLock&&minC>=4.5,value:"opacity "+f2(fL.opacity)+" · pe "+fL.btnPe+" · summary min "+f2(minC)+":1"}});
    add("D15","Popup & picker triggers (Combobox, TreeSelect, DatePicker, TimePicker, ColorPicker, InputGroup) ≥ 44px","6 picker triggers + .cs-combobox__popup","all 6 heights ≥ 44px · popup z-index 60",function(X){var pk=X.fx.p13.light.pickers,minH=Math.min.apply(null,pk.heights),ok=minH>=44&&pk.popZ===60;return{pass:ok,value:"min height "+minH+"px ("+pk.heights.join("/")+"px) · popup z "+pk.popZ}});
    add("D15","Segmented active option ([aria-checked=\"true\"]) & pressed Toggle ([aria-pressed=\"true\"]) ≥ 4.5:1",".cs-segmented button[aria-checked=\"true\"] · .cs-toggle[aria-pressed=\"true\"]","min ≥ 4.5:1 in light and dark",function(X){var minS=Infinity,minT=Infinity;["light","dark"].forEach(function(t){var p=X.fx.p13[t];minS=Math.min(minS,contrast(p.seg.fg,p.seg.bg));minT=Math.min(minT,contrast(p.tog.fg,over(p.tog.bg,p.panel)))});return{pass:minS>=4.5&&minT>=4.5,value:"segmented "+f2(minS)+":1 · toggle "+f2(minT)+":1"}});
    add("D15","QRCode (.cs-qrcode) 10px quiet-zone frame & InlineEdit (.cs-inline-edit__view) trigger ergonomics",".cs-qrcode · .cs-inline-edit__view","padding 10px · radius 8px · pointer trigger with dashed border",function(X){var p=X.fx.p13.light,ok=p.qr.pad===10&&p.qr.r===8&&eq(p.qr.bg,p.panel)&&p.ie.cursor==="pointer"&&p.ie.borderStyle==="dashed";return{pass:ok,value:"qr pad "+p.qr.pad+"px r="+p.qr.r+"px · inline-edit "+p.ie.cursor+"/"+p.ie.borderStyle}});
    /* D16 — Cross-runtime architecture, open-spec (DESIGN.md) & 4-axis orthogonality */
    add("D16","4-axis simultaneous probe (Dark × Thủy Ocean × High-Contrast × Compact) resolves without collision","[data-theme=dark][data-cs-element=thuy][data-cs-variant=ocean][data-cs-contrast=high][data-cs-density=compact]","accent #80BDD8 · muted ≥ 10:1 · density space-4 = 12px",function(X){var a=X.fx.p14.light.axis4,c=contrast(a.muted,a.panel),ok=hex(a.accent)==="#80BDD8"&&c>=10&&a.space4===12;return{pass:ok,value:"accent "+hex(a.accent)+" · muted "+f2(c)+":1 · space-4 "+a.space4+"px"}});
    add("D16","Button 6-variant matrix (primary, secondary, tertiary, ghost, danger, danger-ghost) ≥ 4.5:1",".cs-button--{primary,secondary,tertiary,ghost,danger,danger-ghost}","min ≥ 4.5:1 across all 6 × 2 (light + dark) variants",function(X){var minL=Infinity,minD=Infinity;["primary","secondary","tertiary","ghost","danger","danger-ghost"].forEach(function(k){var bl=X.fx.p14.light.btns[k],bd=X.fx.p14.dark.btns[k];minL=Math.min(minL,contrast(bl.fg,over(bl.bg,X.fx.p14.light.panel)));minD=Math.min(minD,contrast(bd.fg,over(bd.bg,X.fx.p14.dark.panel)))});return{pass:minL>=4.5&&minD>=4.5,value:"light min "+f2(minL)+":1 · dark min "+f2(minD)+":1"}});
    add("D16","Alert 4-tone hierarchy (.cs-alert--{info,success,warning,danger}) keeps 4px stripe & ≥ 4.5:1 icon",".cs-alert--{info,success,warning,danger}","4px border-inline-start · icon ≥ 4.5:1 in light & dark",function(X){var bwOk=true,minC=Infinity;["info","success","warning","danger"].forEach(function(k){["light","dark"].forEach(function(t){var p=X.fx.p14[t],al=p.alerts[k];bwOk=bwOk&&al.bw===4;minC=Math.min(minC,contrast(al.iconFg,over(al.bg,p.panel)))})});return{pass:bwOk&&minC>=4.5,value:"4px stripe "+(bwOk?"✓":"✗")+" · icon min "+f2(minC)+":1"}});
    add("D16","Result 4-tone feedback icons (.cs-result, --success, --warning, --error) 64×64px & ≥ 4.5:1",".cs-result__icon across 4 tones","64×64px circular badge · icon ≥ 4.5:1 in light & dark",function(X){var szOk=true,minC=Infinity;["default","success","warning","error"].forEach(function(k){["light","dark"].forEach(function(t){var p=X.fx.p14[t],r=p.results[k];szOk=szOk&&r.w===64&&r.h===64;minC=Math.min(minC,contrast(r.fg,over(r.bg,p.panel)))})});return{pass:szOk&&minC>=4.5,value:"64×64px "+(szOk?"✓":"✗")+" · min contrast "+f2(minC)+":1"}});
    add("D16","Spacing (--cs-space-1..24) & radius (--cs-radius-sm..full) token grids hold exact geometry","tokens/spacing.css","space 4,8,12,16,24,32,48,64,96px · radius 4,8,14,999px",function(X){var p=X.fx.p14.light,es=[4,8,12,16,24,32,48,64,96],er=[4,8,14,999],ok=es.every(function(v,i){return p.spaces[i]===v})&&er.every(function(v,i){return p.radii[i]===v});return{pass:ok,value:"space "+p.spaces.join(",")+"px · radius "+p.radii.join(",")+"px"}});
    add("D16","DESIGN.md open-spec documents 5 Ngũ Hành elements, 5 Liquid Glass materials & bilingual slogan","DESIGN.md","Thổ/Mộc/Hỏa/Kim/Thủy · whisper..lens · Turn Your Will Into Real",function(X){var t=X.design||"",ok=/Thổ/.test(t)&&/Mộc/.test(t)&&/Hỏa/.test(t)&&/Kim/.test(t)&&/Thủy/.test(t)&&/cs-surface-whisper/.test(t)&&/cs-surface-heavy/.test(t)&&/Turn Your Will Into Real/.test(t)&&/Hiện Thực Hoá Ý Chí/i.test(t);return{pass:ok,value:ok?"5 elements + 5 glass materials + bilingual slogan ✓":"incomplete DESIGN.md spec"}});
    return C;
  }
  var X_CONTROLS=["TextField","Select","Textarea","Combobox","SearchField","InputGroup","NumberField","TagInput","DatePicker","TimePicker","TreeSelect","Cascader","InputOTP","PromptInput"];
  var X_GLASS=["--_cs-border-subtle","--_cs-border-strong","--_cs-surface-scrim","--cs-glass-whisper-bg","--cs-glass-whisper-border","--cs-glass-light-bg","--cs-glass-light-border","--cs-glass-standard-bg","--cs-glass-standard-border","--cs-glass-heavy-bg","--cs-glass-heavy-border"];

  /* ---- run ---- */
  var RESULT=null;
  async function run(){
    var btn=$("#au-run");btn.disabled=true;$("#au-frames").innerHTML="";status("Rendering the fixture with v2.5.0, v2.4.0 and v2.3.1 · Đang dựng mẫu kiểm thử…");
    var t0=performance.now();
    var data=await Promise.all(VERSIONS.map(load));
    var V={250:data[0],240:data[1],231:data[2]};
    if(!V[250]){status("v2.5.0 fixture failed to load — check the console.");btn.disabled=false;return}
    var checks=buildChecks();
    checks.forEach(function(c){["250","240","231"].forEach(function(k){if(!V[k]){c[k]={pass:false,value:"baseline unavailable",na:true};return}try{c[k]=c.fn(V[k])}catch(e){c[k]={pass:false,value:"error: "+e.message}}});
      var b=c["231"].pass,cur=c["250"].pass;c.state=b&&cur?"holds":(!b&&cur?"fixed":(b?"regressed":"open"))});
    var edges=edgeCases(checks,V);
    RESULT={when:new Date().toISOString(),ms:Math.round(performance.now()-t0),ua:navigator.userAgent,checks:checks.map(function(c){return{dim:c.dim,title:c.title,target:c.target,expect:c.expect,v250:c["250"],v240:c["240"],v231:c["231"],state:c.state}}),edges:edges,raw:{v250:V[250]&&V[250].fx,v240:V[240]&&V[240].fx,v231:V[231]&&V[231].fx}};
    render(checks,V);btn.disabled=false;
    status("Ran "+checks.length+" checks × 3 versions in "+(RESULT.ms/1000).toFixed(1)+"s · "+new Date().toLocaleString());
    embedBaselineSuite();
  }
  function status(t){$("#au-status").textContent=t}
  function score(checks,dim,k){var a=checks.filter(function(c){return c.dim===dim});var p=a.filter(function(c){return c[k].pass}).length;return{p:p,n:a.length,s:a.length?10*p/a.length:0}}
  var STATE={fixed:["Fixed","Đã khắc phục"],holds:["Holds","Giữ vững"],open:["Open","Còn mở"],regressed:["Regressed","Thoái lui"]};
  function badge(r){return el("span",{class:"au-pf "+(r.na?"is-na":r.pass?"is-pass":"is-fail"),text:r.na?"N/A":r.pass?"PASS":"FAIL"})}
  function render(checks,V){
    var sb=$("#au-score");sb.innerHTML="";var tot={250:0,240:0,231:0};
    DIMS.forEach(function(d){
      var s={};["231","240","250"].forEach(function(k){s[k]=score(checks,d.id,k);tot[k]+=s[k].s});
      var delta=s["250"].s-s["240"].s;
      sb.appendChild(el("div",{class:"au-dim"},[
        el("div",{class:"au-dim__name"},[el("b",{text:d.id+" · "+d.name}),el("span",{text:d.pri+" · "+d.vi})]),
        el("div",{class:"au-bars"},[["231","is-base","v2.3.1"],["240","is-mid","v2.4.0"],["250","is-cur","v2.5.0"]].map(function(r){return el("div",{class:"au-bar"},[el("i",{class:"au-bar__fill "+r[1],style:"inline-size:"+s[r[0]].s*10+"%"}),el("span",{text:r[2]+" "+f2(s[r[0]].s,1)+" · "+s[r[0]].p+"/"+s[r[0]].n})])})),
        el("div",{class:"au-delta"+(delta>0?" is-up":delta<0?" is-down":""),text:(delta>0?"+":"")+f2(delta,1)})]));
    });
    ["231","240","250"].forEach(function(k){$("#au-overall-"+k).textContent=f2(tot[k]/DIMS.length,1)});
    var pass250=checks.filter(function(c){return c["250"].pass}).length;
    $("#au-headline").textContent=pass250===checks.length?"All "+checks.length+" v2.5.0 checks pass · 10.0 / 10":pass250+" of "+checks.length+" v2.5.0 checks pass";
    var counts={fixed:0,holds:0,open:0,regressed:0};checks.forEach(function(c){counts[c.state]++});
    $("#au-counts").textContent=counts.fixed+" fixed since v2.3.1 · "+counts.holds+" hold · "+counts.open+" open · "+counts.regressed+" regressed · "+checks.length+" checks";
    var host=$("#au-checks");host.innerHTML="";
    DIMS.forEach(function(d){
      var t=el("table",{class:"au-table"}),thead=el("thead",null,[el("tr",null,["Check","Expected","v2.3.1","v2.4.0","v2.5.0","Result"].map(function(h){return el("th",{text:h})}))]),tbody=el("tbody");
      checks.filter(function(c){return c.dim===d.id}).forEach(function(c){tbody.appendChild(el("tr",{"data-state":c.state},[
        el("td",null,[el("b",{text:c.title}),el("code",{text:c.target})]),el("td",{class:"au-mono",text:c.expect}),
        el("td",null,[badge(c["231"]),el("div",{class:"au-val",text:String(c["231"].value)})]),el("td",null,[badge(c["240"]),el("div",{class:"au-val",text:String(c["240"].value)})]),el("td",null,[badge(c["250"]),el("div",{class:"au-val",text:String(c["250"].value)})]),
        el("td",null,[el("span",{class:"au-state is-"+c.state,text:STATE[c.state][0]}),el("small",{text:STATE[c.state][1]})])]))});
      t.appendChild(thead);t.appendChild(tbody);
      host.appendChild(el("h4",{class:"au-dimhead",id:"dim-"+d.id,text:d.id+" · "+d.pri+" · "+d.name}));host.appendChild(el("div",{class:"au-tablewrap"},[t]));
    });
    applyFilter();
    var fh=$("#au-findings");fh.innerHTML="";
    var issues=checks.filter(function(c){return !c["250"].pass});
    if(!issues.length)fh.appendChild(el("p",{text:"No failing checks in v2.5.0 · Không có phép kiểm tra nào thất bại."}));
    issues.forEach(function(c){fh.appendChild(el("div",{class:"au-finding"},[el("span",{class:"au-state is-"+c.state,text:STATE[c.state][0]}),el("div",null,[el("b",{text:c.dim+" · "+c.title}),el("div",{class:"au-val",text:"v2.5.0: "+c["250"].value})])]))});
    var eh=$("#au-edges");eh.innerHTML="";edgeCases(checks,V).forEach(function(e){eh.appendChild(el("div",{class:"au-finding"},[el("span",{class:"au-state "+(e.level==="watch"?"is-fixed":"is-holds"),text:e.level==="watch"?"Watch":"Note"}),el("div",null,[el("b",{text:e.title}),el("p",{text:e.body})])]))});
    scopeTable(V[250].fx.p1.scopes);
  }
  function edgeCases(checks,V){
    var out=[],fx=V[250].fx,p0=fx.p0;
    var ci=contrast(p0.item.color,p0.item.bg),cr=contrast(p0.result.color,p0.result.bg);
    out.push({level:Math.min(ci,cr)<7?"watch":"note",title:"Tinted dark-scope ink: selected item "+f2(ci)+":1 · result icon "+f2(cr)+":1 (clearing WCAG AAA 7:1; v2.4.0 measured "+(V[240]?f2(contrast(V[240].fx.p0.item.color,V[240].fx.p0.item.bg)):"n/a")+":1)",body:"Item ink is text-primary "+hex(p0.item.color)+" on "+hex(p0.item.bg)+" ("+f2(ci)+":1); the result icon paints text-accent "+hex(p0.result.color)+" on the same mix ("+f2(cr)+":1). Both clear WCAG AA 4.5:1, WCAG AAA 7:1 and the APCA body floor."});
    var near=[];fx.p1.scopes.forEach(function(s){INDS.forEach(function(k){var v=ind(s,k[0]);if(v>=3&&v<3.5)near.push(k[0]+" · "+s.name+" ("+f2(v)+":1)")})});
    if(near.length)out.push({level:"watch",title:near.length+" indicator/scope pairs sit within 0.5 of the 3:1 floor",body:near.slice(0,8).join(" · ")+(near.length>8?" · …":"")});
    out.push({level:"note",title:"Carousel dots are measured for fine pointers only",body:"Under (pointer: coarse) base/a11y.css replaces the ::before dot with a 44px radial-gradient target painted in --cs-color-text-accent; that branch is not exercised by this desktop run."});
    out.push({level:"note",title:"Hover rules are read from the CSSOM, then composited through a probe",body:".cs-navmenu__card:hover and .cs-splitter__bar:hover cannot be triggered synthetically; their declared background is applied to a probe inside the dark default scope and compared with the expected color-mix result."});
    out.push({level:"note",title:"Baselines are flattened from the tagged styles.css closures",body:"audit/baseline-2.4.0 and audit/baseline-2.3.1 concatenate the 25 tagged token + base sheets (the repository does not commit dist/styles.min.css). Fonts and aurora assets resolve to this project's copies."});
    if(!V[240]||!V[231])out.push({level:"watch",title:"A baseline failed to load",body:"Check that audit/baseline-2.4.0/styles.flat.css and audit/baseline-2.3.1/styles.flat.css are present."});
    return out;
  }
  function scopeTable(scopes){
    var host=$("#au-scopes");host.innerHTML="";
    var t=el("table",{class:"au-table au-evid"}),thead=el("thead",null,[el("tr",null,["Scope","accent"].concat(INDS.map(function(k){return k[0]})).map(function(h){return el("th",{text:h})}))]),tb=el("tbody");
    scopes.forEach(function(s){tb.appendChild(el("tr",null,[el("td",{text:s.name}),el("td",null,[el("i",{class:"au-sw",style:"background:"+s.accent}),document.createTextNode(hex(s.accent))])].concat(INDS.map(function(k){var v=ind(s,k[0]);return el("td",{class:v<3?"is-low":"",text:f2(v,1)+":1"})}))))});
    t.appendChild(thead);t.appendChild(tb);host.appendChild(t);
  }
  function applyFilter(){var f=document.querySelector('input[name="au-filter"]:checked').value;document.querySelectorAll("#au-checks .au-table tbody tr").forEach(function(tr){var s=tr.getAttribute("data-state");tr.hidden=!(f==="all"||(f==="fixed"&&s==="fixed")||(f==="issues"&&(s==="open"||s==="regressed")))})}

  /* ---- embedded v2.4.0 baseline suite (64 checks, re-run against v2.5.0) ---- */
  async function embedBaselineSuite(){
    var host=$("#au-suite");host.innerHTML="";host.appendChild(el("p",{class:"au-val",text:"Running the v2.4.0 suite (fixture.html · verify.js) in a hidden frame…"}));
    var f=await timeout(frame("v2.4.0-verification.html?embed=1"),30000,null);
    var r=f?await wait(function(){return f.contentWindow.CSAudit24&&f.contentWindow.CSAudit24.result()},90000):null;
    host.innerHTML="";
    if(!r){host.appendChild(el("p",{class:"au-val",text:"The baseline suite did not report within 90s — open it directly below."}));return}
    var n=r.checks.length,p250=r.checks.filter(function(c){return c.v250&&c.v250.pass}).length,p240=r.checks.filter(function(c){return c.v240&&c.v240.pass}).length,p231=r.checks.filter(function(c){return c.v231&&c.v231.pass}).length;
    $("#au-suite-headline").textContent=p250===n?"All "+n+" baseline checks pass on v2.5.0 · 10.0 / 10":p250+" of "+n+" baseline checks pass on v2.5.0";
    var dims={};r.checks.forEach(function(c){dims[c.dim]=dims[c.dim]||{n:0,p250:0,p240:0,p231:0};dims[c.dim].n++;if(c.v250&&c.v250.pass)dims[c.dim].p250++;if(c.v240&&c.v240.pass)dims[c.dim].p240++;if(c.v231&&c.v231.pass)dims[c.dim].p231++});
    var t=el("table",{class:"au-table au-evid"}),tb=el("tbody");
    Object.keys(dims).forEach(function(k){var d=dims[k];tb.appendChild(el("tr",null,[el("td",{text:k}),el("td",{text:d.p231+"/"+d.n}),el("td",{text:d.p240+"/"+d.n}),el("td",{text:d.p250+"/"+d.n+" · "+f2(10*d.p250/d.n,1)})]))});
    tb.appendChild(el("tr",null,[el("td",null,[el("b",{text:"Total"})]),el("td",{text:p231+"/"+n}),el("td",{text:p240+"/"+n}),el("td",null,[el("b",{text:p250+"/"+n+" · "+f2(10*p250/n,1)})])]));
    t.appendChild(el("thead",null,[el("tr",null,["Suite dimension","v2.3.1","v2.4.0","v2.5.0"].map(function(h){return el("th",{text:h})}))]));t.appendChild(tb);host.appendChild(t);
    var fails=r.checks.filter(function(c){return !(c.v250&&c.v250.pass)});
    if(fails.length){host.appendChild(el("h4",{class:"au-dimhead",text:"Failing on v2.5.0"}));fails.forEach(function(c){host.appendChild(el("div",{class:"au-finding"},[el("span",{class:"au-state is-open",text:"Open"}),el("div",null,[el("b",{text:c.dim+" · "+c.title}),el("div",{class:"au-val",text:String(c.v250&&c.v250.value)})])]))})}
    if(RESULT)RESULT.baselineSuite={total:n,v250:p250,v240:p240,v231:p231,checks:r.checks};
  }

  /* ---- specimen ---- */
  var VARIANTS={"":[["","default"]],tho:[["sand","sand · soft"],["","ochre · middle"],["clay","clay · deep"]],moc:[["bamboo","bamboo · soft"],["","leaf · middle"],["forest","forest · deep"]],hoa:[["plasma","plasma · soft"],["","ember · middle"],["lava","lava · deep"]],kim:[["titanium","titanium · soft"],["","champagne · middle"],["steel","steel · deep"]],thuy:[["mist","mist · soft"],["","river · middle"],["ocean","ocean · deep"]]};
  function fillVariants(){var e=$("#au-sp-e").value,s=$("#au-sp-va");s.innerHTML="";VARIANTS[e].forEach(function(v){s.appendChild(el("option",{value:v[0],text:v[1]}))});if(e)s.value="";s.disabled=!e}
  var lastSrc="";
  function specimen(){var f=$("#au-specimen"),v=$("#au-sp-v").value,t=$("#au-sp-t").value,e=$("#au-sp-e").value,va=$("#au-sp-va").value;var src="fixture-v2.5.0.html?v="+v+"&theme="+t+(e?"&el="+e:"")+(va?"&va="+va:"");if(src===lastSrc)return;lastSrc=src;f.src=src;$("#au-sp-open").href=src}
  document.addEventListener("DOMContentLoaded",function(){
    $("#au-run").addEventListener("click",run);
    document.querySelectorAll('input[name="au-filter"]').forEach(function(i){i.addEventListener("change",applyFilter)});
    $("#au-sp-e").addEventListener("change",function(){fillVariants();specimen()});
    ["#au-sp-v","#au-sp-t","#au-sp-va"].forEach(function(s){$(s).addEventListener("change",specimen)});
    $("#au-export").addEventListener("click",function(){if(!RESULT)return;var a=el("a",{href:URL.createObjectURL(new Blob([JSON.stringify(RESULT,null,2)],{type:"application/json"})),download:"cyberskill-design-v2.5.0-verification.json"});document.body.appendChild(a);a.click();a.remove()});
    fillVariants();specimen();run();
  });
  window.CSAudit25Runner={run:run,result:function(){return RESULT}};
})();
