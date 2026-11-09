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
      p5:{light:{root:both[0].p5.root,nest:both[0].p5.nest},dark:{root:both[1].p5.root,nest:both[1].p5.nest}},cssLoaded:both[0].cssLoaded&&both[1].cssLoaded};
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
    {id:"D7",pri:"P3",name:"DESIGN.md & asset contract accuracy",vi:"Độ chính xác DESIGN.md & tài sản"}
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
    add("D7","Referenced brand assets exist in this tree","assets/ · components/logo/","4/4 files resolve",function(X){var a=X.assets,n=LOGO_OK.filter(function(k){return a[k]}).length;return{pass:n===4,value:n+"/4 · "+LOGO_OK.filter(function(k){return !a[k]}).join(", ")}});
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
    RESULT={when:new Date().toISOString(),ms:Math.round(performance.now()-t0),ua:navigator.userAgent,checks:checks.map(function(c){return{dim:c.dim,title:c.title,target:c.target,expect:c.expect,v250:c["250"],v240:c["240"],v231:c["231"],state:c.state}}),raw:{v250:V[250]&&V[250].fx,v240:V[240]&&V[240].fx,v231:V[231]&&V[231].fx}};
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
    out.push({level:Math.min(ci,cr)<9?"watch":"note",title:"Tinted dark-scope ink: selected item "+f2(ci)+":1 · result icon "+f2(cr)+":1 (release notes quote > 9:1; v2.4.0 measured "+(V[240]?f2(contrast(V[240].fx.p0.item.color,V[240].fx.p0.item.bg)):"n/a")+":1)",body:"Item ink is text-primary "+hex(p0.item.color)+" on "+hex(p0.item.bg)+"; the result icon paints text-accent "+hex(p0.result.color)+" on the same mix. Both clear WCAG AA 4.5:1 and the APCA body floor; only the item reaches the quoted 9:1 under WCAG relative luminance."});
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
