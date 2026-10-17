// Generated from scripts/template-runtime/primitives/support.js by scripts/build-template-primitives.mjs.
/* CyberSkill template runtime source. Compatibility candidate; see its validation record. */
(() => {
  'use strict';
  const ownScript = document.currentScript;
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
  function attributes(node, scope, imported) {
    const props = {};
    for (const attr of node.attributes) {
      if (/^(?:component-|hint-|data-dc-)/.test(attr.name)) continue;
      let value = binding(attr.value, scope);
      let name = eventNames[attr.name] || (imported && !/^(?:aria|data)-/.test(attr.name) ? camel(attr.name) : domNames[attr.name] || attr.name);
      if (name === 'class') name = 'className';
      if (name === 'style' && typeof value === 'string') value = cssObject(value);
      if (imported && /^-?\d+(?:\.\d+)?$/.test(String(value))) value = Number(value);
      if (imported && (value === 'true' || value === 'false')) value = value === 'true';
      if (!imported && booleans.has(attr.name)) value = value === '' || value === true || value === attr.name;
      props[name] = value;
    }
    return props;
  }
  function renderNodes(nodes, scope, prefix = '') {
    const R = window.React;
    return Array.from(nodes).map((node, index) => {
      const key = prefix + index;
      if (node.nodeType === Node.TEXT_NODE) return binding(node.textContent, scope);
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const tag = node.localName;
      const control = tag === 'template' ? node.getAttribute('data-cs-dc-control') : tag === 'sc-for' ? 'for' : tag === 'sc-if' ? 'if' : null;
      const children = control && tag === 'template' ? (node.content?.childNodes || node.childNodes) : node.childNodes;
      if (tag === 'script' || tag === 'helmet') return null;
      if (control === 'if') return binding(node.getAttribute('value') || '', scope) ? R.createElement(R.Fragment, {key}, ...renderNodes(children, scope, key + '.')) : null;
      if (control === 'for') {
        const items = binding(node.getAttribute('list') || '', scope);
        if (!Array.isArray(items)) throw new Error('Loop binding must be an array');
        const alias = node.getAttribute('as');
        if (!alias || blockedKeys.has(alias)) throw new Error('Invalid loop alias');
        return R.createElement(R.Fragment, {key}, ...items.map((item, i) => R.createElement(R.Fragment, {key:i}, ...renderNodes(children, {...scope, [alias]:item}, key + '.' + i + '.'))));
      }
      const imported = tag === 'x-import';
      const component = imported ? resolveName(node.getAttribute('component-from-global-scope') || '', window) : tag;
      if (imported && !component) throw new Error('Missing imported component: ' + node.getAttribute('component-from-global-scope'));
      return R.createElement(component, {key, ...attributes(node, scope, imported)}, ...renderNodes(node.childNodes, scope, key + '.'));
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
    script.textContent = '(() => { const DCLogic = window.__csDcLogic;\n' + code + '\nwindow.__csDcConstructors[' + JSON.stringify(token) + '] = Component;\n})();';
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
      Logic.prototype.render = function () {
        const values = this.renderVals();
        if (!values || typeof values !== 'object') throw new Error('renderVals must return template bindings');
        return window.React.createElement('div', {'data-sc-name':name, style:{display:'contents'}}, ...renderNodes(nodes, values));
      };
      host.replaceChildren();
      host.style.display = 'contents';
      const reactRoot = window.ReactDOM.createRoot(host);
      const entry = {props:defaults, render:() => reactRoot.render(window.React.createElement(Logic, entry.props))};
      roots.set(name, entry);
      entry.render();
    }
    window.__dcRootName = () => roots.keys().next().value || null;
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
