/* Authored CyberSkill image slot. The documented host boundary is conditional; distribution review remains pending. */
(() => {
  'use strict';
  if (customElements.get('image-slot')) return;
  const records = new Map(), changed = new Set(), subscribers = new Set();
  let hydration, hydrated = false, writeQueue = Promise.resolve();
  const editable = () => typeof window.omelette?.writeFile === 'function';
  const safeId = id => !!id && !['__proto__', 'constructor', 'prototype'].includes(id);
  const finite = (value, fallback = 0) => value !== null && value !== '' && Number.isFinite(Number(value)) ? Number(value) : fallback;
  const bounded = (value, low, high) => Math.max(low, Math.min(high, value));
  const storedImage = src => typeof src === 'string' && /^data:image\//i.test(src);
  const uploadTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
  function normalized(raw) {
    if (typeof raw === 'string') return storedImage(raw) ? {u: raw, s: 1, x: 0, y: 0} : null;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    if (raw.u !== undefined && !storedImage(raw.u)) return null;
    return {...(raw.u ? {u: raw.u} : {}), s: bounded(finite(raw.s, 1), 1, 5), x: finite(raw.x), y: finite(raw.y)};
  }
  function hydrate() {
    if (!hydration) hydration = fetch(new URL('.image-slots.state.json', document.baseURI))
      .then(response => response.ok ? response.json() : {})
      .then(data => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) return;
        for (const [id, value] of Object.entries(data)) {
          if (!safeId(id)) continue;
          if (!changed.has(id)) records.set(id, value);
          else {
            const current = records.get(id), saved = normalized(value);
            // Crop-only edits retain their new framing and inherit the safe saved image.
            // Mutate the shared crop object so a host's session-local reference also updates.
            if (current && typeof current === 'object' && !current.u && saved?.u) current.u = saved.u;
          }
        }
        for (const host of subscribers) if (!host.editing) host._render();
      }).catch(() => {}).finally(() => {hydrated = true;});
    return hydration;
  }
  function flushNow(host) {
    if (!hydrated || !editable()) return;
    try {
      // Invoke immediately: unload must not wait behind an earlier writer acknowledgement.
      Promise.resolve(window.omelette.writeFile('.image-slots.state.json', JSON.stringify(Object.fromEntries(records), null, 2)))
        .catch(reason => host.error(String(reason)));
    } catch (reason) {host.error(String(reason));}
  }
  function persist(host, value) {
    if (!safeId(host.id) || !editable()) return;
    changed.add(host.id);
    if (value === null) records.delete(host.id); else records.set(host.id, value);
    writeQueue = writeQueue.then(async () => {
      await hydrate();
      if (!editable()) throw new Error('Image writer is no longer available');
      await window.omelette.writeFile('.image-slots.state.json', JSON.stringify(Object.fromEntries(records), null, 2));
      host.dispatchEvent(new CustomEvent('cs-image-saved', {detail: {id: host.id}, bubbles: true, composed: true}));
    }).catch(error => host.error(String(error)));
  }
  const styles = `
    :host{display:block;position:relative;box-sizing:border-box;width:100%;height:100%;aspect-ratio:3/2;min-width:0;min-height:0;font-family:var(--cs-font-family-ui,system-ui)}
    .frame{position:relative;width:100%;height:100%;overflow:hidden;border-radius:inherit}
    .frame img{display:block;position:absolute;max-width:none;max-height:none;transform:translate(-50%,-50%);user-select:none;-webkit-user-drag:none}
    .empty{position:absolute;inset:0;display:grid;place-content:center;text-align:center;gap:4px;padding:12px;box-sizing:border-box;color:var(--cs-color-text-primary,#26323a);background:var(--cs-color-surface-panel,#fffdf8);border:1px dashed var(--cs-color-border-default,#8c8277)}
    .cap{font-size:13px;font-weight:500;line-height:1.4}.sub{font-size:12px;line-height:1.4}
    .tools{position:absolute;left:auto;bottom:auto;right:8px;top:8px;margin:0;padding:0;border:0;background:transparent;width:max-content;height:auto;overflow:visible;display:flex;gap:4px;z-index:2}
    :host([data-swapping]) .frame img{visibility:hidden}
    .loading{position:absolute;inset:0;display:none;place-content:center;background:var(--cs-color-surface-panel,#fffdf8);color:var(--cs-color-text-primary,#26323a);font-size:13px}
    :host([data-swapping]) .loading{display:grid}
    button{min-width:44px;min-height:44px;border:1px solid var(--cs-color-border-default,#8c8277);border-radius:6px;color:var(--cs-color-text-primary,#26323a);background:var(--cs-color-surface-panel,#fffdf8);font:inherit;cursor:pointer}
    button:focus-visible,.empty:focus-visible,.editor:focus-visible{outline:2px solid var(--cs-color-text-primary,#45210e);outline-offset:2px;box-shadow:0 0 0 5px #f4ba17}
    :host(:not([data-authoring])) .empty{background:transparent;border:0;pointer-events:none}
    :host(:not([data-authoring])) .cap,:host(:not([data-authoring])) .sub{display:none}
    :host(:not([data-editable])) .tools,:host(:not([data-filled])) .tools,:host(:not([data-filled])) .frame img,:host([data-filled]) .empty{display:none}
    .credit{position:absolute;bottom:6px;left:6px;max-width:calc(100% - 12px);background:var(--cs-color-surface-panel,#fffdf8);color:var(--cs-color-text-primary,#26323a);font-size:13px;padding:4px 6px;z-index:1}.credit a{color:inherit}.credit[hidden]{display:none}
    .error{position:absolute;inset:0;display:grid;place-content:center;padding:12px;box-sizing:border-box;background:var(--cs-color-surface-panel,#fffdf8);color:var(--cs-color-text-primary,#26323a);font-size:13px}.error[hidden]{display:none}
    .editor{position:absolute;display:none;margin:0;padding:0;border:0;inset:auto;background:transparent;transform:translate(-50%,-50%);touch-action:none;cursor:grab;overflow:visible;z-index:3}
    :host([data-reframe]) .editor{display:block}.editor .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;pointer-events:none;background-size:100% 100%;background-repeat:no-repeat}
    .handle{position:absolute;width:44px;height:44px;min-width:44px;min-height:44px;transform:translate(-50%,-50%);border-radius:50%;cursor:nwse-resize}
    .handle[data-c=nw]{left:0;top:0}.handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}.handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}.handle[data-c=se]{left:100%;top:100%}
    .tools:popover-open{display:flex;position:fixed;inset:auto;margin:0;padding:0;border:0;background:transparent;transform:translateX(-100%);width:max-content;height:auto;overflow:visible}
    @media print{.empty,.tools,.editor,.error{display:none!important}}
  `;
  class ImageSlot extends HTMLElement {
    static observedAttributes = ['id','src','alt','shape','radius','mask','fit','position','placeholder','placeholder-vi','lang','credit','credit-href'];
    constructor() {
      super();
      this.view = {s: 1, x: 0, y: 0}; this.localValue = undefined; this.customView = false; this.editing = false; this.fileGeneration = 0;
      this.encodingGeneration = 0; this.loadPending = false; this.hiddenReplacement = false; this.errorReason = '';
      const root = this.attachShadow({mode: 'open'});
      root.innerHTML = `<style>${styles}</style><div class="frame" part="frame"><img part="image"><div class="empty" part="empty"><div class="cap"></div><div class="sub"></div></div><div class="loading" role="status"></div><div class="credit" hidden></div><div class="error" role="status" hidden></div></div><div class="tools" popover="manual" data-dc-edit-transparent><button type="button" data-act="replace"></button><button type="button" data-act="edit"></button><button type="button" data-act="clear"></button></div><div class="editor" popover="manual" tabindex="0" role="group" data-dc-edit-transparent><div class="ghost" aria-hidden="true"></div><button type="button" class="handle" data-c="nw"></button><button type="button" class="handle" data-c="ne"></button><button type="button" class="handle" data-c="sw"></button><button type="button" class="handle" data-c="se"></button></div><input type="file" accept="${uploadTypes.join(',')}" hidden>`;
      this.image = root.querySelector('.frame img'); this.empty = root.querySelector('.empty'); this.fileInput = root.querySelector('input'); this.editor = root.querySelector('.editor'); this.tools = root.querySelector('.tools');
      // Host bridges can appear/disappear after connection. Refresh before an
      // interaction exposes authoring controls instead of waiting for the poll.
      for (const event of ['pointerenter', 'pointerdown', 'focusin'])
        this.addEventListener(event, () => this.refreshCapabilities());
      this.empty.addEventListener('click', () => this.openFilePicker());
      this.empty.addEventListener('keydown', event => { if (['Enter',' '].includes(event.key)) {event.preventDefault(); this.openFilePicker();} });
      root.querySelector('[data-act=replace]').addEventListener('click', () => {
        if (!editable()) return;
        this.finishEditing(true);
        this.dispatchEvent(new CustomEvent('image-slot:pick', {detail: {id: this.id || null}, bubbles: true, composed: true}));
      });
      root.querySelector('[data-act=edit]').addEventListener('click', () => this.editing ? this.finishEditing(true) : this.startEditing());
      root.querySelector('[data-act=clear]').addEventListener('click', () => {if (editable()) this.commit('');});
      this.fileInput.addEventListener('change', () => { const file = this.fileInput.files[0]; if (file) this.readFile(file); this.fileInput.value = ''; });
      this.addEventListener('dragover', event => {if (editable()) event.preventDefault();});
      this.addEventListener('drop', event => {if (editable()) {event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) this.readFile(file);} });
      this.image.addEventListener('dblclick', () => this.editing ? this.finishEditing(true) : this.startEditing());
      this.image.addEventListener('load', () => {this.loadPending = false; this.releaseMask(); delete this.dataset.imageError; this.fitImage();});
      this.image.addEventListener('error', () => {this.loadPending = false; this.releaseMask(); this.dataset.imageError = ''; this.error('Unable to display image');});
      this.editor.addEventListener('pointerdown', event => this.beginDrag(event));
      this.editor.addEventListener('wheel', event => {
        if (!this.editing) return;
        event.preventDefault(); const rect = this.getBoundingClientRect();
        this.zoom(Math.exp(-event.deltaY * .0015), (event.clientX - rect.left) / rect.width * 100 - 50, (event.clientY - rect.top) / rect.height * 100 - 50);
      }, {passive: false});
      this.editor.addEventListener('keydown', event => {
        if (!this.editing || event.defaultPrevented || event.isComposing) return;
        const moves = {ArrowLeft: [-2,0], ArrowRight: [2,0], ArrowUp: [0,-2], ArrowDown: [0,2]};
        if (moves[event.key]) {event.preventDefault(); event.stopPropagation(); this.view.x += moves[event.key][0]; this.view.y += moves[event.key][1]; this.fitImage();}
        else if (['+','=','-','Home'].includes(event.key)) {
          event.preventDefault(); event.stopPropagation();
          if (event.key === 'Home') {this.view = {s: 1, x: 0, y: 0}; this.fitImage();} else this.zoom(event.key === '-' ? 1 / 1.1 : 1.1);
        }
      });
    }
    connectedCallback() {
      subscribers.add(this); this._render(); hydrate();
      this.sizeObserver = new ResizeObserver(() => this.fitImage()); this.sizeObserver.observe(this);
      this.localeObserver = new MutationObserver(() => this._render()); this.localeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['lang'], subtree: true});
      this.authoringTimer = setInterval(() => this.refreshCapabilities(), 100);
    }
    refreshCapabilities() {
      if (this.hasAttribute('data-authoring') !== (typeof window.__dcSetProps === 'function') || this.hasAttribute('data-editable') !== editable()) this._render();
    }
    disconnectedCallback() {
      this.finishEditing(false, false); subscribers.delete(this); this.localeObserver?.disconnect(); this.sizeObserver?.disconnect(); clearInterval(this.authoringTimer);
    }
    attributeChangedCallback() {if (this.image) this._render();}
    get languageIsVI() {return (this.closest('[lang]')?.getAttribute('lang') || document.documentElement.lang || 'en').toLowerCase().startsWith('vi');}
    savedValue() {return safeId(this.id) ? records.get(this.id) : this.localValue;}
    _render() {
      const vi = this.languageIsVI, canEdit = editable(), authoring = typeof window.__dcSetProps === 'function';
      const saved = normalized(this.savedValue()), author = this.getAttribute('src') || '', src = saved?.u || author;
      this.toggleAttribute('data-authoring', authoring); this.toggleAttribute('data-editable', canEdit);
      if (!canEdit && this.editing) this.finishEditing(false);
      const isStock = (() => {try {return /(^|\.)unsplash\.com$/i.test(new URL(src, document.baseURI).hostname.replace(/\.$/, ''));} catch {return false;}})();
      const uncredited = !!src && src === author && isStock && !this.getAttribute('credit')?.trim();
      // Author src is trusted markup; the browser parses its URL. Saved images were validated above.
      const actual = !uncredited ? src : '';
      this.attributionError = uncredited;
      this.toggleAttribute('data-filled', !!actual);
      if (this.image.getAttribute('src') !== actual) {
        if (this.editing) this.finishEditing(false);
        if (actual) {
          if (this.image.getAttribute('src') || this.hiddenReplacement) this.setAttribute('data-swapping', '');
          this.loadPending = true; this.image.setAttribute('src', actual); this.hiddenReplacement = false;
        } else {
          this.hiddenReplacement = uncredited && !!this.image.getAttribute('src');
          this.image.removeAttribute('src'); this.loadPending = false; this.removeAttribute('data-swapping');
        }
        this.customView = !!saved && typeof this.savedValue() === 'object'; this.view = saved ? {s: saved.s, x: saved.x, y: saved.y} : {s: 1, x: 0, y: 0};
      } else if (!this.editing) {
        this.customView = !!saved && typeof this.savedValue() === 'object';
        this.view = saved ? {s: saved.s, x: saved.x, y: saved.y} : {s: 1, x: 0, y: 0};
      }
      this.releaseMask();
      this.image.alt = this.getAttribute('alt') || '';
      const caption = vi ? this.getAttribute('placeholder-vi') || this.getAttribute('placeholder') || 'Thả ảnh (không bắt buộc)' : this.getAttribute('placeholder') || 'Drop an image';
      this.shadowRoot.querySelector('.cap').textContent = caption;
      const browse = this.shadowRoot.querySelector('.sub'); browse.replaceChildren();
      if (canEdit) {const underline = document.createElement('u'); underline.textContent = vi ? 'duyệt tệp' : 'browse files'; browse.append(document.createTextNode(vi ? 'hoặc ' : 'or '), underline);}
      else browse.textContent = vi ? 'hoặc duyệt tệp' : 'or browse files';
      for (const [action, label] of Object.entries({replace: vi ? 'Thay ảnh' : 'Replace', edit: vi ? 'Chỉnh sửa' : 'Edit', clear: vi ? 'Xoá ảnh' : 'Remove'})) this.shadowRoot.querySelector(`[data-act=${action}]`).textContent = label;
      this.shadowRoot.querySelector('[data-act=edit]').setAttribute('aria-pressed', String(this.editing));
      this.editor.setAttribute('aria-label', vi ? 'Chỉnh khung ảnh' : 'Reframe image');
      for (const button of this.editor.querySelectorAll('.handle')) button.setAttribute('aria-label', (vi ? 'Thu phóng ảnh ' : 'Scale image ') + button.dataset.c);
      this.empty.tabIndex = canEdit && !actual ? 0 : -1; this.empty.setAttribute('role', 'button'); this.empty.setAttribute('aria-label', caption); this.empty.setAttribute('aria-disabled', String(!canEdit)); this.empty.setAttribute('aria-hidden', String(!authoring || !!actual));
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase(), radius = Math.max(0, finite(this.getAttribute('radius'), 12));
      this.shadowRoot.querySelector('.frame').style.borderRadius = shape === 'circle' ? '50%' : shape === 'pill' ? '9999px' : shape === 'rect' ? '0' : radius + 'px';
      this.shadowRoot.querySelector('.frame').style.clipPath = this.getAttribute('mask') || '';
      this.shadowRoot.querySelector('.loading').textContent = vi ? 'Đang tải ảnh…' : 'Loading image…';
      this.renderNotice();
      this.renderCredit(src === author && !!actual);
      this.fitImage();
    }
    renderCredit(show) {
      const box = this.shadowRoot.querySelector('.credit'), text = this.getAttribute('credit') || '';
      box.replaceChildren(); box.hidden = !show || !text;
      if (box.hidden) return;
      let link;
      try {
        const url = new URL(this.getAttribute('credit-href'), document.baseURI);
        if (this.hasAttribute('credit-href') && ['http:','https:'].includes(url.protocol)) {
          if (/(^|\.)unsplash\.com$/i.test(url.hostname.replace(/\.$/, ''))) {if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'claude_design'); if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'referral');}
          link = document.createElement('a'); link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
        }
      } catch {}
      const node = link || document.createElement('span'), attribution = text.match(/^Photo by (.+?) on Unsplash$/i);
      if (attribution) {
        node.textContent = attribution[1];
        const provider = document.createElement('a'); provider.textContent = 'Unsplash'; provider.href = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral'; provider.target = '_blank'; provider.rel = 'noopener noreferrer';
        box.append(document.createTextNode('Photo by '), node, document.createTextNode(' on '), provider);
      } else {node.textContent = text; box.append(node);}
    }
    geometry() {
      const fw = this.clientWidth, fh = this.clientHeight, iw = this.image.naturalWidth, ih = this.image.naturalHeight;
      if (!fw || !fh || !iw || !ih) return null;
      const fit = this.getAttribute('fit') || 'cover', inside = Math.min(fw / iw, fh / ih);
      const ratio = fit === 'none' ? 1 : fit === 'scale-down' ? Math.min(1, inside) : fit === 'contain' ? inside : Math.max(fw / iw, fh / ih);
      return {fw, fh, width: fit === 'fill' ? fw : iw * ratio, height: fit === 'fill' ? fh : ih * ratio};
    }
    fitImage() {
      const g = this.geometry(); if (!g) return;
      const w = g.width * this.view.s, h = g.height * this.view.s;
      if (!this.customView && !this.editing) {
        const words = (this.getAttribute('position') || 'center').trim().split(/\s+/), positions = {left: 0, top: 0, center: .5, right: 1, bottom: 1};
        if (words.length === 1 && ['top','bottom'].includes(words[0])) words.unshift('center');
        const fraction = value => value in positions ? positions[value] : /^\d+(?:\.\d+)?%$/.test(value || '') ? bounded(parseFloat(value) / 100, 0, 1) : .5;
        this.view.x = (w - g.fw) * (.5 - fraction(words[0])) / g.fw * 100; this.view.y = (h - g.fh) * (.5 - fraction(words[1])) / g.fh * 100;
      } else {
        const mx = Math.max(0, (w - g.fw) / g.fw * 50), my = Math.max(0, (h - g.fh) / g.fh * 50);
        this.view.x = bounded(this.view.x, -mx, mx); this.view.y = bounded(this.view.y, -my, my);
      }
      this.image.style.width = w + 'px'; this.image.style.height = h + 'px'; this.image.style.left = 50 + this.view.x + '%'; this.image.style.top = 50 + this.view.y + '%';
      if (this.editing) this.positionEditor(g, w, h);
    }
    popoverOpen(element) {try {return element.matches(':popover-open');} catch {return false;}}
    positionEditor(g, width, height) {
      const rect = this.getBoundingClientRect(), onTop = this.popoverOpen(this.editor);
      Object.assign(this.editor.style, {position: onTop ? 'fixed' : 'absolute', width: (onTop ? width * rect.width / g.fw : width) + 'px', height: (onTop ? height * rect.height / g.fh : height) + 'px', left: onTop ? rect.left + (50 + this.view.x) / 100 * rect.width + 'px' : 50 + this.view.x + '%', top: onTop ? rect.top + (50 + this.view.y) / 100 * rect.height + 'px' : 50 + this.view.y + '%'});
      if (this.popoverOpen(this.tools)) Object.assign(this.tools.style, {left: rect.right - 8 + 'px', right: 'auto', top: rect.top + 8 + 'px'});
    }
    signalEditing(active) {(this.isConnected ? this : document).dispatchEvent(new CustomEvent('image-slot:reframe', {detail: {active, id: this.id || null}, bubbles: true, composed: true}));}
    startEditing() {
      if (!editable() || !this.hasAttribute('data-filled') || !this.geometry() || this.editing) return;
      this.editStart = {view: {...this.view}, customView: this.customView};
      this.editing = true; this.customView = true; this.setAttribute('data-reframe', ''); this.signalEditing(true);
      this.editor.querySelector('.ghost').style.backgroundImage = 'url(' + JSON.stringify(this.image.src) + ')';
      try {this.editor.showPopover(); this.tools.showPopover();} catch {}
      this.outside = event => {if (!event.composedPath().includes(this)) this.finishEditing(true, false);};
      this.escape = event => {if (event.key === 'Escape' && !event.isComposing) {event.preventDefault(); event.stopPropagation(); this.finishEditing(true);}};
      this.pageHide = () => {this.finishEditing(true, false); flushNow(this);};
      document.addEventListener('pointerdown', this.outside, true); document.addEventListener('keydown', this.escape, true); window.addEventListener('pagehide', this.pageHide);
      const watch = () => {if (!this.editing) return; this.fitImage(); this.watchId = requestAnimationFrame(watch);}; this.watchId = requestAnimationFrame(watch);
      this._render(); this.editor.focus({preventScroll: true});
    }
    finishEditing(commit, restoreFocus = true) {
      if (!this.editing) return;
      this.endDrag?.(); this.editing = false; this.removeAttribute('data-reframe'); cancelAnimationFrame(this.watchId);
      document.removeEventListener('pointerdown', this.outside, true); document.removeEventListener('keydown', this.escape, true); window.removeEventListener('pagehide', this.pageHide);
      try {this.editor.hidePopover(); this.tools.hidePopover();} catch {}
      this.tools.style.left = ''; this.tools.style.right = ''; this.tools.style.top = '';
      if (commit) {
        const saved = normalized(this.savedValue()), value = {...(saved?.u ? {u: saved.u} : {}), s: this.view.s, x: this.view.x, y: this.view.y};
        if (!safeId(this.id)) this.localValue = value;
        persist(this, value);
      } else if (this.editStart) {this.view = {...this.editStart.view}; this.customView = this.editStart.customView; this.fitImage();}
      this.editStart = null;
      this.signalEditing(false); this.shadowRoot.querySelector('[data-act=edit]').setAttribute('aria-pressed', 'false');
      if (restoreFocus && this.isConnected && editable()) this.shadowRoot.querySelector('[data-act=edit]').focus({preventScroll: true});
    }
    zoom(factor, pivotX = 0, pivotY = 0) {
      const previous = this.view.s, next = bounded(previous * factor, 1, 5), ratio = next / previous;
      this.view = {s: next, x: pivotX + (this.view.x - pivotX) * ratio, y: pivotY + (this.view.y - pivotY) * ratio}; this.fitImage();
    }
    beginDrag(event) {
      if (!this.editing || event.button !== 0) return;
      event.preventDefault(); event.stopPropagation(); this.endDrag?.();
      const rect = this.getBoundingClientRect(), g = this.geometry(), corner = event.target.dataset?.c;
      if (!g) return;
      const initial = {...this.view}, width = g.width * initial.s * rect.width / g.fw, height = g.height * initial.s * rect.height / g.fh;
      const sx = corner?.includes('e') ? 1 : -1, sy = corner?.includes('s') ? 1 : -1;
      const anchorX = (50 + initial.x) / 100 * rect.width - sx * width / 2, anchorY = (50 + initial.y) / 100 * rect.height - sy * height / 2;
      this.editor.setPointerCapture(event.pointerId);
      const move = next => {
        if (corner) {
          const projection = ((next.clientX - rect.left - anchorX) * sx * width + (next.clientY - rect.top - anchorY) * sy * height) / (width * width + height * height);
          const scale = bounded(initial.s * projection, 1, 5), relative = scale / initial.s;
          this.view = {s: scale, x: (anchorX + sx * width * relative / 2) / rect.width * 100 - 50, y: (anchorY + sy * height * relative / 2) / rect.height * 100 - 50};
        } else this.view = {s: initial.s, x: initial.x + (next.clientX - event.clientX) / rect.width * 100, y: initial.y + (next.clientY - event.clientY) / rect.height * 100};
        this.fitImage();
      };
      this.endDrag = () => {try {this.editor.releasePointerCapture(event.pointerId);} catch {} this.editor.removeEventListener('pointermove', move); this.editor.removeEventListener('pointerup', this.endDrag); this.editor.removeEventListener('pointercancel', this.endDrag); this.endDrag = null;};
      this.editor.addEventListener('pointermove', move); this.editor.addEventListener('pointerup', this.endDrag); this.editor.addEventListener('pointercancel', this.endDrag);
    }
    openFilePicker() {if (!editable()) return; this.finishEditing(true); this.fileInput.click();}
    releaseMask() {if (!this.encodingGeneration && !this.loadPending && this.image.complete) this.removeAttribute('data-swapping');}
    renderNotice() {
      const vi = this.languageIsVI, notice = this.shadowRoot.querySelector('.error');
      const translations = {'Drop a PNG, JPEG, WebP, or AVIF image.': 'Thả ảnh PNG, JPEG, WebP hoặc AVIF.', 'Unable to read image': 'Không thể đọc ảnh.', 'Unable to display image': 'Không thể hiển thị ảnh.', 'Unsupported image source': 'Nguồn ảnh không được hỗ trợ.'};
      notice.textContent = this.attributionError ? (vi ? 'Ảnh cần thông tin ghi công.' : 'Image attribution is required.') : this.errorReason ? (vi ? translations[this.errorReason] || 'Không thể lưu ảnh.' : this.errorReason) : '';
      notice.hidden = !notice.textContent;
    }
    error(reason) {
      this.errorReason = reason; clearTimeout(this.errorTimer); this.renderNotice();
      this.errorTimer = setTimeout(() => {this.errorReason = ''; this.renderNotice();}, 3000);
      this.dispatchEvent(new CustomEvent('cs-image-error', {detail: {reason}, bubbles: true, composed: true}));
    }
    readFile(file) {
      this.errorReason = ''; this.renderNotice();
      if (!file || !uploadTypes.includes(file.type)) {this.error('Drop a PNG, JPEG, WebP, or AVIF image.'); return;}
      const generation = ++this.fileGeneration, reader = new FileReader();
      if (this.hasAttribute('data-filled')) {this.encodingGeneration = generation; this.setAttribute('data-swapping', '');}
      const failed = () => {if (generation === this.fileGeneration) {this.encodingGeneration = 0; this.releaseMask(); this.error('Unable to read image');}};
      reader.onload = async () => {
        try {
          const next = new Image(); next.src = String(reader.result); await next.decode();
          if (generation !== this.fileGeneration) return;
          const longest = Math.max(next.naturalWidth, next.naturalHeight);
          const cap = Math.min(1200, Math.max(1, Math.round((this.clientWidth || 1200) * 2)));
          const ratio = Math.min(1, cap / longest), canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(next.naturalWidth * ratio)); canvas.height = Math.max(1, Math.round(next.naturalHeight * ratio));
          canvas.getContext('2d').drawImage(next, 0, 0, canvas.width, canvas.height);
          const encoded = canvas.toDataURL('image/webp', .85);
          this.encodingGeneration = 0;
          if (generation === this.fileGeneration && editable() && this.isConnected) this.commit(encoded);
          else this.releaseMask();
        } catch {failed();}
      };
      reader.onerror = failed; reader.readAsDataURL(file);
    }
    commit(src) {
      if (src && !storedImage(src)) {this.error('Unsupported image source'); return;}
      this.fileGeneration++; this.encodingGeneration = 0; this.errorReason = ''; this.finishEditing(false);
      if (!safeId(this.id)) this.localValue = src || undefined;
      this.customView = false; this.view = {s: 1, x: 0, y: 0};
      if (src) persist(this, src); else {if (safeId(this.id)) {changed.add(this.id); records.delete(this.id);} persist(this, null);}
      this._render(); this.dispatchEvent(new CustomEvent('cs-image-change', {detail: {id: this.id, src}, bubbles: true, composed: true}));
    }
  }
  customElements.define('image-slot', ImageSlot);
})();
