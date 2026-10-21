// Generated from scripts/template-runtime/primitives/support.js by scripts/build-template-primitives.mjs.
/* CyberSkill template runtime source. Compatibility candidate; see its validation record. */
(() => {
  'use strict';
  const ownScript = document.currentScript;
  const dcLogicScriptSource = function dcLogicScriptSource(code, token) {
  if (typeof code !== 'string' || typeof token !== 'string' || !/^Component(?:[1-9]\d*)?$/.test(token)) throw new Error('Invalid DC logic source or root token');
  return '(() => { const DCLogic = window.__csDcLogic;\n' + code + '\nwindow.__csDcConstructors[' + JSON.stringify(token) + '] = Component;\n})();';
}; // projected from scripts/template-runtime/dc-logic-source.mjs
  const libraryBase = new URL('../../_vendor/react/', ownScript.src);
  const roots = new Map();
  const constructors = Object.create(null);
  const blockedKeys = new Set(['__proto__', 'prototype', 'constructor']);
  const eventNames = {onclick:'onClick',onchange:'onChange',oninput:'onInput',onsubmit:'onSubmit',onkeydown:'onKeyDown',onkeyup:'onKeyUp',onblur:'onBlur',onfocus:'onFocus',onpointerdown:'onPointerDown',onpointerup:'onPointerUp'};
  const domNames = {class:'className',for:'htmlFor',tabindex:'tabIndex',readonly:'readOnly',contenteditable:'contentEditable',colspan:'colSpan',rowspan:'rowSpan',maxlength:'maxLength',autocomplete:'autoComplete',spellcheck:'spellCheck',viewbox:'viewBox'};
  const booleans = new Set(['disabled','checked','multiple','selected','hidden','required','autofocus','readonly']);

  function resolveName(name, scope) {
    if (name === 'true') return true;
    if (name === 'false') return false;
    if (/^-?\d+(?:\.\d+)?$/.test(name)) return Number(name);
    if (!/^[A-Za-z_$][\w$]*(?:\.[\w$]+)*$/.test(name)) throw new Error('Unsupported template binding: ' + name);
    let value = scope;
    for (const key of name.split('.')) {
      if (blockedKeys.has(key)) throw new Error('Unsafe template binding: ' + name);
      value = value?.[key];
    }
    return value;
  }
  function binding(text, scope) {
    const whole = /^\{\{\s*([^{}]+?)\s*\}\}$/.exec(text.trim());
    if (whole) return resolveName(whole[1].trim(), scope);
    return text.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_, name) => String(resolveName(name.trim(), scope) ?? ''));
  }
  function cssObject(text) {
    const holder = document.createElement('span');
    holder.style.cssText = text;
    const result = {};
    // CSSOM may expand a variable-containing shorthand into empty longhands.
    // Preserve complete browser-validated declarations instead of those values.
    const css = holder.style.cssText;
    let start=0,depth=0,quote='',escaped=false;
    const declarations=[];
    for(let i=0;i<=css.length;i++){
      const char=css[i];
      if(escaped){escaped=false;continue;}
      if(char==='\\'){escaped=true;continue;}
      if(quote){if(char===quote)quote='';continue;}
      if(char==='"'||char==="'"){quote=char;continue;}
      if(char==='(')depth++;
      else if(char===')')depth--;
      if((char===';'&&depth===0)||i===css.length){declarations.push(css.slice(start,i));start=i+1;}
    }
    for(const declaration of declarations){
      const colon=declaration.indexOf(':');if(colon<0)continue;
      const name=declaration.slice(0,colon).trim(),value=declaration.slice(colon+1).trim();
      const key=name.startsWith('--')?name:name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()).replace(/^Ms/,'ms');
      result[key]=value;
    }
    return result;
  }
  const camel = name => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  function attributes(node, scope, imported, contentKeys) {
    const props = {};
    for (const attr of node.attributes) {
      if (/^(?:component-|hint-|data-dc-)/.test(attr.name)) continue;
      let value = binding(attr.value, scope);
      const contentHole = /^\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}$/.exec(attr.value.trim());
      const preserveContentString = !!contentHole && contentKeys.has(contentHole[1]);
      const eventAttribute = attr.name.startsWith("data-cs-on-") ? "on" + attr.name.slice(11).replaceAll("-", "") : attr.name;
      if (attr.name.startsWith("data-cs-on-") && !Object.hasOwn(eventNames, eventAttribute)) throw new Error("Unsupported native event binding: " + attr.name);
      let name = eventNames[eventAttribute] || (imported && !/^(?:aria|data)-/.test(attr.name) ? camel(attr.name) : domNames[attr.name] || attr.name);
      if (name === 'class') name = 'className';
      if (name === 'style' && typeof value === 'string') value = cssObject(value);
      if (imported && !preserveContentString && /^-?\d+(?:\.\d+)?$/.test(String(value))) value = Number(value);
      if (imported && !preserveContentString && (value === 'true' || value === 'false')) value = value === 'true';
      if (!imported && booleans.has(attr.name)) value = value === '' || value === true || value === attr.name;
      props[name] = value;
    }
    if (node.hasAttribute('data-dc-percent-width')) {
      const expression = node.getAttribute('data-dc-percent-width');
      if (imported || node.localName !== 'span' || !/^\{\{\s*[A-Za-z_][A-Za-z0-9_]*\s*\}\}$/.test(expression)) throw new Error('Invalid percent width target');
      const percent = binding(expression, scope);
      if (typeof percent !== 'number' || !Number.isFinite(percent) || percent < 0 || percent > 100) throw new Error('Percent width must be a finite number from 0 to 100');
      props.style = { ...props.style, width: percent + '%' };
    }
    return props;
  }
  function renderNodes(nodes, scope, prefix = '', contentKeys = new Set()) {
    const R = window.React;
    return Array.from(nodes).map((node, index) => {
      const key = prefix + index;
      if (node.nodeType === Node.TEXT_NODE) return binding(node.textContent, scope);
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const tag = node.localName;
      const control = tag === 'template' ? node.getAttribute('data-cs-dc-control') : tag === 'sc-for' ? 'for' : tag === 'sc-if' ? 'if' : null;
      const children = control && tag === 'template' ? (node.content?.childNodes || node.childNodes) : node.childNodes;
      if (tag === 'script' || tag === 'helmet') return null;
      if (control === 'if') return binding(node.getAttribute('value') || '', scope) ? R.createElement(R.Fragment, {key}, ...renderNodes(children, scope, key + '.', contentKeys)) : null;
      if (control === 'for') {
        const items = binding(node.getAttribute('list') || '', scope);
        if (!Array.isArray(items)) throw new Error('Loop binding must be an array');
        const alias = node.getAttribute('as');
        if (!alias || blockedKeys.has(alias)) throw new Error('Invalid loop alias');
        return R.createElement(R.Fragment, {key}, ...items.map((item, i) => R.createElement(R.Fragment, {key:i}, ...renderNodes(children, {...scope, [alias]:item}, key + '.' + i + '.', contentKeys))));
      }
      const imported = tag === 'x-import';
      const component = imported ? resolveName(node.getAttribute('component-from-global-scope') || '', window) : tag;
      if (imported && !component) throw new Error('Missing imported component: ' + node.getAttribute('component-from-global-scope'));
      return R.createElement(component, {key, ...attributes(node, scope, imported, contentKeys)}, ...renderNodes(node.childNodes, scope, key + '.', contentKeys));
    });
  }
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Unable to load template dependency: ' + url));
      document.head.append(script);
    });
  }
  function evalDcLogic(code, token) {
    const script = document.createElement('script');
    if (ownScript.nonce) script.nonce = ownScript.nonce;
    script.textContent = dcLogicScriptSource(code, token);
    document.head.append(script);
    script.remove();
    const Logic = constructors[token];
    delete constructors[token];
    if (typeof Logic !== 'function') throw new Error('Template logic did not initialize; check script policy and syntax');
    return Logic;
  }
  // Recover authored control boundaries before native table parsing can move their rows.
  function controlMarkup(markup) {
    return markup.replace(/<!--[\s\S]*?-->|<(script|style)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<(\/?)sc-(for|if)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>|<\/?[A-Za-z][\w:-]*\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi,
      (tag, rawText, closing, kind) => {
        if (!kind) return tag;
        return closing ? '</template>' : tag.replace(/^<sc-(?:for|if)/i, '<template data-cs-dc-control="' + kind.toLowerCase() + '"');
      });
  }
  async function authoredHosts(liveScripts) {
    const liveHosts = Array.from(document.querySelectorAll('x-dc'));
    const needsRecovery = liveHosts.some(host => host.querySelector('table') && Array.from(host.querySelectorAll('sc-for,sc-if')).some(control =>
      !Array.from(control.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE && node.textContent.trim())));
    if (!needsRecovery) return liveHosts;
    if (!/^https?:$/.test(location.protocol)) throw new Error('Mở template bằng bản xem trước HTTP(S) để khôi phục đủ dòng bảng. / Table control source requires an HTTP(S) preview; the parsed document has lost its row structure.');
    let markup;
    try {
      const response = await fetch(location.href, {cache:'no-store', credentials:'same-origin'});
      if (!response.ok || new URL(response.url).origin !== location.origin) throw new Error('Original source response is unavailable');
      markup = await response.text();
    } catch (cause) {
      throw new Error('Không thể đọc HTML nguồn của template. / Unable to read original template markup.', {cause});
    }
    const doc = new DOMParser().parseFromString(controlMarkup(markup), 'text/html');
    const scripts = Array.from(doc.querySelectorAll('script[data-dc-script]'));
    if (scripts.length !== liveScripts.length || scripts.some((script,i) => script.textContent !== liveScripts[i].textContent || script.getAttribute('data-props') !== liveScripts[i].getAttribute('data-props'))) throw new Error('Nguồn template đã thay đổi khi khởi tạo. / Template source changed during initialization.');
    const hosts = Array.from(doc.querySelectorAll('x-dc'));
    if (hosts.length !== document.querySelectorAll('x-dc').length) throw new Error('Số vùng template trong nguồn đã thay đổi. / Original template host count changed.');
    return hosts;
  }
  const contentReserved = name => blockedKeys.has(name) || /^(?:rootTheme|langAttr|elAttr|vaAttr|dirAttr|__csDisplayLiteralEmpty|true|false|language|element|theme|content|props|state|tabs|tab|lens|chatOpen|closeChat|dangerOpen|closeDanger)$/.test(name) || /^(?:is|show|hide|has|enable|with|set|open|close)[A-Z]/.test(name) && !["closeH", "closeP", "closeLabel"].includes(name);
  async function contentContract(script, nodes, controls) {
    const path = script.getAttribute('data-content-schema');
    if (!path) return new Map();
    if (path !== './content-schema.json') throw new Error('Content schema must be the adjacent sidecar');
    const url = new URL(path, location.href);
    const response = await fetch(url, {credentials:'same-origin'});
    if (!response.ok || new URL(response.url).origin !== location.origin) throw new Error('Content schema unavailable');
    const schema = await response.json();
    if (schema.$schemaVersion !== '2.0' || schema.template !== new URL('.', location.href).pathname.split('/').filter(Boolean).at(-1) || !Array.isArray(schema.slots)) throw new Error('Invalid content schema');
    const text = new Set(), attributes = new Map(), seen = new Set(), slots = new Map();
    const holes = value => [...value.matchAll(/\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g)].map(match => match[1]);
    const visit = node => {
      if (node.nodeType === Node.TEXT_NODE) holes(node.textContent).forEach(id => text.add(id));
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (['SCRIPT','STYLE','HELMET'].includes(node.tagName)) return;
        for (const attr of node.attributes) holes(attr.value).forEach(id => {
          const logicalTag=node.localName==='template'&&node.getAttribute('data-cs-dc-control')==='for'?'sc-for':node.localName;
          const target={tag:logicalTag,attribute:attr.name};
          if (attr.name === 'data-dc-percent-width') target.percentBar =
            node.localName === 'span' && node.childNodes.length === 0 &&
            [...node.attributes].every(item => ['style', 'data-dc-percent-width'].includes(item.name)) &&
            node.style.display === 'block' && node.style.height === '100%' &&
            /^(?:100|[0-9]{1,2})(?:\.[0-9]+)?%$/.test(node.style.width) && parseFloat(node.style.width) <= 100 &&
            node.parentElement?.localName === 'div' && node.parentElement.style.overflow === 'hidden';
          if(node.localName==='x-import') target.component=node.getAttribute('component-from-global-scope');
          if(attr.value.trim()!=='{{ '+id+' }}' && !new RegExp('^\\{\\{\\s*'+id+'\\s*\\}\\}$').test(attr.value.trim())) target.partial=true;
          if(!attributes.has(id)) attributes.set(id,[]);attributes.get(id).push(target);
        });
      }
      for (const child of node.childNodes || []) visit(child);
      if (node.content) visit(node.content);
    };
    nodes.forEach(visit);
    const allowed={nav:['aria-label'],button:['aria-label'],'image-slot':['placeholder','placeholder-vi'],'CyberSkillDS.SearchField':['placeholder'],'CyberSkillDS.Stat':['label','value','delta'],'CyberSkillDS.DataTable':['caption'],'CyberSkillDS.CodeBlock':['code'],'CyberSkillDS.Alert':['title'],'CyberSkillDS.TextField':['label','error'],'CyberSkillDS.Switch':['label','aria-label'],'CyberSkillDS.AIDisclosureBadge':['label','details'],'CyberSkillDS.PromptInput':['placeholder','send-label'],'CyberSkillDS.Select':['label'],'CyberSkillDS.NativeSelect':['label'],'CyberSkillDS.ScrollArea':['aria-label'],'CyberSkillDS.Item':['title','description'],'CyberSkillDS.Collapsible':['title'],'CyberSkillDS.AlertDialog':['title','description','confirm-label']};
    const key=target=>[target.tag,target.component||'',target.attribute].join('|');
    for (const slot of schema.slots) {
      if (!slot || typeof slot.id !== 'string' || seen.has(slot.id)) throw new Error('Invalid or duplicate content slot');
      seen.add(slot.id);
      if (slot.runtimeBinding === undefined) continue;
      if (slot.runtimeBinding === 'structured') {
        const targets=attributes.get(slot.id)||[], structuredAllowed={'sc-for':['list'],'CyberSkillDS.DataTable':['columns','rows'],'CyberSkillDS.Select':['options'],'CyberSkillDS.NativeSelect':['options'],'CyberSkillDS.Timeline':['items'],'CyberSkillDS.Steps':['steps'],'CyberSkillDS.AIDisclosureBadge':['sources']};
        if (!['list','table'].includes(slot.type) || contentReserved(slot.id) || Object.hasOwn(controls,slot.id) || text.has(slot.id) || !targets.length || !Array.isArray(slot.runtimeTargets) || targets.length!==slot.runtimeTargets.length || targets.some(target=>target.partial||!structuredAllowed[target.component||target.tag]?.includes(target.attribute)) || JSON.stringify(targets.map(key).sort())!==JSON.stringify(slot.runtimeTargets.map(key).sort()) || !['records','column-headers'].includes(slot.runtimeProjection)) throw new Error('Unsafe structured content target: '+slot.id);
        validateModelDefinition(slot.runtimeModel);
        if(slot.runtimeModel.type!=='array'||targets.some(target=>target.attribute==='columns')&&slot.runtimeProjection!=='column-headers'||slot.runtimeProjection==='column-headers'&&(targets.some(target=>target.component!=='CyberSkillDS.DataTable'||target.attribute!=='columns')||slot.runtimeModel.uniqueBy!=='key'||slot.runtimeModel.items.type!=='object'||JSON.stringify(Object.keys(slot.runtimeModel.items.properties).sort())!==JSON.stringify(['header','key'])||JSON.stringify([...slot.runtimeModel.items.required].sort())!==JSON.stringify(['header','key'])))throw new Error('Unsafe structured projection: '+slot.id);
        slots.set(slot.id,slot);continue;
      }
      if (slot.runtimeBinding === 'number') {
        const targets = attributes.get(slot.id) || [];
        if (slot.type !== 'number' || slot.minimum !== 0 || slot.maximum !== 100 || slot.runtimeProjection !== 'percent-width' || contentReserved(slot.id) || Object.hasOwn(controls, slot.id) || !text.has(slot.id) || !targets.length || !Array.isArray(slot.runtimeTargets) || slot.runtimeTargets.length !== targets.length || targets.some(target => target.partial || !target.percentBar || target.tag !== 'span' || target.attribute !== 'data-dc-percent-width') || JSON.stringify(targets.map(key).sort()) !== JSON.stringify(slot.runtimeTargets.map(key).sort())) throw new Error('Unsafe numeric content target: ' + slot.id);
        slots.set(slot.id, slot); continue;
      }
      if (slot.runtimeBinding !== 'text' || !['text','richtext'].includes(slot.type) || !Number.isSafeInteger(slot.maxLength) || slot.maxLength < 1 || contentReserved(slot.id) || Object.hasOwn(controls, slot.id) || !text.has(slot.id) && !attributes.has(slot.id)) throw new Error('Unsafe content binding: ' + slot.id);
      const targets=attributes.get(slot.id)||[];
      if(targets.length){
        if(!Array.isArray(slot.runtimeTargets)||slot.runtimeTargets.length!==targets.length||targets.some(target=>target.partial||!allowed[target.component||target.tag]?.includes(target.attribute))||JSON.stringify(targets.map(key).sort())!==JSON.stringify(slot.runtimeTargets.map(key).sort())) throw new Error('Unsafe content attribute target: '+slot.id);
        if(targets.some(target=>['aria-label','label','send-label','confirm-label','placeholder','title'].includes(target.attribute)) && (slot.minLength!==1 || typeof slot.semanticReason!=='string' || !slot.semanticReason.trim())) throw new Error('Content names require nonempty semantics: '+slot.id);
      }else if(slot.runtimeTargets!==undefined) throw new Error('Content target metadata does not match markup: '+slot.id);
      slots.set(slot.id, slot);
    }
    return slots;
  }
  // DOCX is XML 1.0: reject invalid characters rather than silently changing content.
  function validXMLText(value) {
    return [...value].every(character => {
      const point = character.codePointAt(0);
      return point === 0x9 || point === 0xA || point === 0xD || point >= 0x20 && point <= 0xD7FF || point >= 0xE000 && point <= 0xFFFD || point >= 0x10000 && point <= 0x10FFFF;
    });
  }
  function validateModelDefinition(model, depth = 0) {
    if (!model || typeof model !== 'object' || Array.isArray(model) || depth > 8) throw new Error('Unsafe display model');
    const keys = Object.keys(model), own = key => Object.hasOwn(model, key);
    const allowed = {string:['type','minLength','maxLength','enum'],number:['type','minimum','maximum'],array:['type','minItems','maxItems','items','uniqueBy'],object:['type','properties','required','additionalProperties']}[model.type];
    if (!allowed || keys.some(key => !allowed.includes(key))) throw new Error('Unsupported display model');
    if (model.type === 'string') {
      if (model.minLength !== 1 || !Number.isSafeInteger(model.maxLength) || model.maxLength < 1 || model.maxLength > 8192 || own('enum') && (!Array.isArray(model.enum) || !model.enum.length || model.enum.some(value => typeof value !== 'string' || !validXMLText(value)))) throw new Error('Unsafe display string model');
    } else if (model.type === 'number') {
      if (!Number.isFinite(model.minimum) || !Number.isFinite(model.maximum) || model.minimum < -1e12 || model.maximum > 1e12 || model.minimum > model.maximum) throw new Error('Unsafe display number model');
    } else if (model.type === 'array') {
      if (!Number.isSafeInteger(model.minItems) || !Number.isSafeInteger(model.maxItems) || model.minItems < 0 || model.maxItems > 100 || model.maxItems < 1 || model.minItems > model.maxItems) throw new Error('Unsafe display array model');
      validateModelDefinition(model.items, depth + 1);
      if (own('uniqueBy') && (model.items.type !== 'object' || !Object.hasOwn(model.items.properties, model.uniqueBy) || model.items.properties[model.uniqueBy].type !== 'string')) throw new Error('Unsafe display row identity');
    } else {
      if (!model.properties || typeof model.properties !== 'object' || Array.isArray(model.properties) || !Object.keys(model.properties).length || model.additionalProperties !== false || !Array.isArray(model.required) || new Set(model.required).size !== model.required.length || model.required.some(key => !Object.hasOwn(model.properties,key))) throw new Error('Unsafe display record model');
      for (const [key,value] of Object.entries(model.properties)) {
        if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(key) || blockedKeys.has(key)) throw new Error('Unsafe display record key');
        validateModelDefinition(value, depth + 1);
      }
    }
  }
  function structuredSnapshot(model, value, budget = {nodes:0,characters:0}) {
    if (++budget.nodes > 2048) throw new Error('Display data exceeds node budget');
    if (model.type === 'string') {
      if (typeof value !== 'string' || !validXMLText(value) || !value.trim() || [...value].length > model.maxLength || model.enum && !model.enum.includes(value)) throw new Error('Invalid display string');
      budget.characters += [...value].length;
      if (budget.characters > 262144) throw new Error('Display data exceeds text budget');
      return value;
    }
    if (model.type === 'number') {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < model.minimum || value > model.maximum) throw new Error('Invalid display number');
      return value;
    }
    if (model.type === 'array') {
      if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || value.length < model.minItems || value.length > model.maxItems || Reflect.ownKeys(value).length !== value.length + 1) throw new Error('Invalid dense display array');
      const result=[];
      for (let i=0;i<value.length;i++) {
        const descriptor=Object.getOwnPropertyDescriptor(value,String(i));
        if (!descriptor || !Object.hasOwn(descriptor,'value')) throw new Error('Display array accessors are not supported');
        result.push(structuredSnapshot(model.items,descriptor.value,budget));
      }
      if(model.uniqueBy && new Set(result.map(row=>row[model.uniqueBy])).size!==result.length)throw new Error('Duplicate display row identity');
      return Object.freeze(result);
    }
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) throw new Error('Invalid display record');
    const keys=Reflect.ownKeys(value),result=Object.create(null);
    if(keys.some(key=>typeof key!=='string'||blockedKeys.has(key)||!Object.hasOwn(model.properties,key)) || model.required.some(key=>!Object.hasOwn(value,key)))throw new Error('Unknown or missing display field');
    for(const key of keys){const descriptor=Object.getOwnPropertyDescriptor(value,key);if(!descriptor||!Object.hasOwn(descriptor,'value'))throw new Error('Display record accessors are not supported');result[key]=structuredSnapshot(model.properties[key],descriptor.value,budget);}
    return Object.freeze(result);
  }
  function contentRenderValues(entry, content, values) {
    const rendered={...values,...content};
    for(const id of Object.keys(content))if(entry.contentSlots.get(id).runtimeProjection==='column-headers')rendered[id]=values[id].map((column,index)=>({...column,header:content[id][index].header}));
    return rendered;
  }
  function validateContent(entry, content, values) {
    if (!content || typeof content !== 'object' || Array.isArray(content) || ![Object.prototype,null].includes(Object.getPrototypeOf(content))) throw new Error('Content must be a plain object');
    const result = Object.create(null), budget={nodes:0,characters:0};
    for (const id of Reflect.ownKeys(content)) {
      if (typeof id !== 'string') throw new Error('Content keys must be strings');
      const descriptor = Object.getOwnPropertyDescriptor(content, id);
      if (!descriptor || !Object.hasOwn(descriptor, 'value')) throw new Error('Content accessors are not supported');
      const value = descriptor.value;
      const slot = entry.contentSlots.get(id);
      if (slot?.runtimeBinding === 'number') {
        if (contentReserved(id) || typeof value !== 'number' || !Number.isFinite(value) || value < slot.minimum || value > slot.maximum || !values || !Object.hasOwn(values, id) || typeof values[id] !== 'number' || !Number.isFinite(values[id])) throw new Error('Invalid numeric content slot: ' + id);
        result[id] = value; continue;
      }
      if (slot?.runtimeBinding==='structured') {
        if(contentReserved(id)||!values||!Object.hasOwn(values,id)||!Array.isArray(values[id]))throw new Error('Content can only replace an existing display array: '+id);
        const snapshot=structuredSnapshot(slot.runtimeModel,value,budget);
        if(slot.runtimeProjection==='column-headers'&&(snapshot.length!==values[id].length||snapshot.some((column,index)=>column.key!==values[id][index].key)))throw new Error('Column keys/order and renderers remain template-owned');
        result[id]=snapshot;continue;
      }
      if (contentReserved(id) || !slot || typeof value !== 'string' || !validXMLText(value) || [...value].length > slot.maxLength || (slot.required || slot.minLength===1) && !value.trim()) throw new Error('Invalid content slot: ' + id);
      if (values && (!Object.hasOwn(values, id) || typeof values[id] !== 'string')) throw new Error('Content can only replace computed text: ' + id);
      result[id] = value;
    }
    return result;
  }
  async function boot() {
    if (!window.React?.Component) await loadScript(new URL('react.production.min.js', libraryBase));
    if (!window.ReactDOM?.createRoot) await loadScript(new URL('react-dom.production.min.js', libraryBase));
    window.__csDcLogic = window.React.Component;
    window.__csDcConstructors = constructors;
    for (const helmet of document.querySelectorAll('x-dc helmet')) {
      for (const style of helmet.querySelectorAll('style,link[rel="stylesheet"]')) document.head.append(style.cloneNode(true));
      for (const script of helmet.querySelectorAll('script[src]')) {
        const url = script.src;
        if (!Array.from(document.scripts).some(s => s !== script && s.src === url)) {
          // Parser-executed external scripts are already represented by this node.
          if (!script.isConnected) await loadScript(url);
        }
      }
    }
    await Promise.all(Object.values(window.__csTemplateBundleLoads || {}));
    const scripts = Array.from(document.querySelectorAll('script[data-dc-script]'));
    const markupHosts = await authoredHosts(scripts);
    for (const [index, host] of Array.from(document.querySelectorAll('x-dc')).entries()) {
      const script = scripts[index];
      if (!script) throw new Error('Missing template logic');
      const schema = JSON.parse(script.getAttribute('data-props') || '{}');
      const defaults = Object.fromEntries(Object.entries(schema).map(([name, record]) => [name, record.default]));
      const name = 'Component' + (index ? index : '');
      const Logic = evalDcLogic(script.textContent, name);
      const nodes = Array.from(markupHosts[index].childNodes).map(n => n.cloneNode(true));
      const contentSlots = await contentContract(script, nodes, schema);
      Logic.prototype.render = function () {
        const values = this.renderVals();
        if (!values || typeof values !== 'object') throw new Error('renderVals must return template bindings');
        entry.lastValues = values;
        const content = validateContent(entry, entry.content, values);
        return window.React.createElement('div', {'data-sc-name':name, style:{display:'contents'}}, ...renderNodes(nodes, contentRenderValues(entry,content,values), '', new Set(Object.keys(content))));
      };
      host.replaceChildren();
      host.style.display = 'contents';
      const reactRoot = window.ReactDOM.createRoot(host);
      const entry = {props:defaults, content:Object.create(null), contentSlots, lastValues:null, render:() => reactRoot.render(window.React.createElement(Logic, entry.props))};
      roots.set(name, entry);
      entry.render();
    }
    window.__dcRootName = () => roots.keys().next().value || null;
    window.__dcSetContent = (name, content) => {
      const entry = roots.get(name);
      if (!entry || !entry.lastValues) throw new Error('Template content root is not ready');
      const validated = validateContent(entry, content, entry.lastValues);
      entry.content = validated;
      entry.render();
    };
    window.__dcSetProps = (name, props) => {
      const root = roots.get(name);
      if (!root || !props || typeof props !== 'object' || Array.isArray(props)) throw new Error('Unknown template root or invalid props');
      if (Object.keys(props).some(key => blockedKeys.has(key))) throw new Error('Unsafe template prop');
      root.props = {...root.props, ...props};
      root.render();
    };
  }
  function start() {
    boot().catch(error => {
      console.error('CyberSkill template runtime:', error);
      const notice = document.createElement('pre');
      notice.className = 'sc-logic-error'; notice.setAttribute('role', 'alert');
      notice.textContent = error.message; document.body.append(notice);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
