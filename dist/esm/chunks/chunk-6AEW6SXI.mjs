"use client";
import {
  useClientLayoutEffect
} from "./chunk-CQQ2JOJD.mjs";

// components/overlays/OverlayManager.jsx
import React from "react";
var focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "audio[controls]",
  "video[controls]",
  "summary",
  "iframe",
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function visibleFocusables(roots) {
  return [...new Set(roots.flatMap((root) => [...root.matches?.(focusableSelector) ? [root] : [], ...root.querySelectorAll(focusableSelector)]))].filter((el) => el.tabIndex >= 0 && !el.disabled && !el.matches(":disabled") && !el.closest('[inert], [hidden], [aria-hidden="true"]') && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden");
}
function attachFocusTrap(panelEl, { handleEscape = false, onEscape, isActive = () => true, scopeElements = () => [panelEl], focusOrder } = {}) {
  if (!panelEl) return () => {
  };
  const inside = (el) => scopeElements().some((root) => root?.contains(el));
  const focusables = (backwards = false) => focusOrder ? focusOrder(backwards) : visibleFocusables(scopeElements());
  const focusFirst = () => (focusables()[0] || panelEl).focus();
  const onFocus = (e) => {
    if (isActive() && !inside(e.target)) focusFirst();
  };
  const k = (e) => {
    if (!isActive() || e.isComposing || e.keyCode === 229) return;
    if (handleEscape && e.key === "Escape" && !e.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      onEscape && onEscape();
      return;
    }
    if (e.key !== "Tab") return;
    const f = focusables(e.shiftKey);
    if (!f.length) {
      e.preventDefault();
      panelEl.focus();
      return;
    }
    const active = document.activeElement;
    if (e.defaultPrevented) return;
    const index = f.indexOf(active);
    const next = index < 0 ? e.shiftKey ? f.length - 1 : 0 : (index + (e.shiftKey ? -1 : 1) + f.length) % f.length;
    e.preventDefault();
    f[next].focus();
  };
  document.addEventListener("keydown", k);
  document.addEventListener("focusin", onFocus);
  return () => {
    document.removeEventListener("keydown", k);
    document.removeEventListener("focusin", onFocus);
  };
}
function createOverlayManager() {
  const layers = [];
  let prevOverflow = "";
  let prevOverflowPriority = "";
  let locked = false;
  let escapeBound = false;
  const inertBefore = /* @__PURE__ */ new Map();
  const ownedScopes = /* @__PURE__ */ new Set();
  let observer = null;
  const isBelow = (a, b, visited = /* @__PURE__ */ new Set()) => {
    if (!a.panelEl || !b.panelEl || a === b || visited.has(b)) return false;
    if (a.panelEl.contains(b.panelEl)) return true;
    visited.add(b);
    const parentEl = b.parentRef?.current || b.parentEl;
    if (parentEl && a.panelEl.contains(parentEl)) return true;
    const parent = layers.find((layer) => layer.panelEl === parentEl);
    return parent ? isBelow(a, parent, visited) : false;
  };
  const resort = () => {
    layers.sort((a, b) => {
      if (isBelow(a, b)) return -1;
      if (isBelow(b, a)) return 1;
      return (a.seq || 0) - (b.seq || 0);
    });
  };
  const applyScroll = () => {
    const need = layers.some((l) => l.kind === "modal" && l.lockScroll !== false);
    if (need && !locked) {
      prevOverflow = document.body.style.overflow;
      prevOverflowPriority = document.body.style.getPropertyPriority("overflow");
      document.body.style.overflow = "hidden";
      locked = true;
    } else if (!need && locked) {
      document.body.style.setProperty("overflow", prevOverflow, prevOverflowPriority);
      locked = false;
    }
  };
  const activeModal = () => {
    resort();
    return [...layers].reverse().find((layer) => layer.kind === "modal" && layer.panelEl?.isConnected) || null;
  };
  const focusScope = () => {
    const modal = activeModal();
    if (!modal) return [];
    const roots = [...new Set([...layers.slice(layers.indexOf(modal)), ...layers.filter((layer) => layer.kind === "toast")].map((layer) => layer.panelEl).filter((el) => el?.isConnected))];
    let added = true;
    while (added) {
      added = false;
      for (const scope of ownedScopes) {
        if (scope.panelEl?.isConnected && !roots.includes(scope.panelEl) && roots.some((root) => root.contains(scope.parentEl))) {
          roots.push(scope.panelEl);
          added = true;
        }
      }
    }
    const belowScope = (ancestor, descendant, visited = /* @__PURE__ */ new Set()) => {
      if (!ancestor || !descendant || ancestor === descendant || visited.has(descendant)) return false;
      if (ancestor.contains(descendant)) return true;
      visited.add(descendant);
      return [...ownedScopes].some((scope) => scope.panelEl === descendant && (ancestor.contains(scope.parentEl) || belowScope(ancestor, scope.parentEl, new Set(visited))));
    };
    roots.sort((a, b) => belowScope(a, b) ? -1 : belowScope(b, a) ? 1 : 0);
    return roots;
  };
  const applyInert = () => {
    const modal = activeModal();
    const blocked = /* @__PURE__ */ new Set();
    if (modal) {
      const allowed = [...focusScope(), modal.backdropEl].filter((el) => el?.isConnected);
      const walk = (parent) => {
        for (const el of parent.children) {
          if (allowed.includes(el)) continue;
          if (allowed.some((root) => el.contains(root))) walk(el);
          else blocked.add(el);
        }
      };
      walk(document.body);
    }
    for (const [el, prior] of inertBefore) {
      if (!blocked.has(el)) {
        el.inert = prior;
        inertBefore.delete(el);
      }
    }
    for (const el of blocked) {
      if (!inertBefore.has(el)) inertBefore.set(el, el.inert);
      el.inert = true;
    }
    if (modal && !observer) {
      observer = new MutationObserver(applyInert);
      observer.observe(document.body, { childList: true, subtree: true });
    } else if (!modal && observer) {
      observer.disconnect();
      observer = null;
    }
  };
  const onDocEscape = (e) => {
    if (e.key !== "Escape" || e.isComposing || e.keyCode === 229) return;
    if (!layers.length) return;
    resort();
    const top = [...layers].reverse().find((layer) => layer.kind !== "toast");
    if (!top || typeof top.onEscape !== "function") return;
    e.preventDefault();
    e.stopPropagation();
    top.onEscape();
  };
  const ensureEscape = () => {
    if (escapeBound) return;
    escapeBound = true;
    document.addEventListener("keydown", onDocEscape, true);
  };
  let seq = 0;
  return {
    registerScope(scope) {
      ownedScopes.add(scope);
      applyInert();
      return () => {
        ownedScopes.delete(scope);
        applyInert();
      };
    },
    register(layer) {
      ensureEscape();
      let id = layer.id;
      if (!id) do {
        id = `cs-ov-${++seq}`;
      } while (layers.some((entry2) => entry2.id === id));
      const entry = { ...layer, id, seq: ++seq };
      layers.push(entry);
      resort();
      applyScroll();
      applyInert();
      return () => {
        resort();
        const i = layers.indexOf(entry);
        const wasTop = [...layers].reverse().find((layer2) => layer2.kind !== "toast") === entry;
        if (i >= 0) layers.splice(i, 1);
        applyScroll();
        applyInert();
        if (!layers.length && escapeBound) {
          document.removeEventListener("keydown", onDocEscape, true);
          escapeBound = false;
        }
        const active = document.activeElement;
        const ownedFocus = active === document.body || active === entry.restoreEl || entry.panelEl?.contains(active);
        if (wasTop && ownedFocus && entry.restoreEl?.isConnected && !entry.restoreEl.closest("[inert], [hidden]") && typeof entry.restoreEl.focus === "function") {
          try {
            entry.restoreEl.focus();
          } catch {
          }
        }
      };
    },
    top() {
      resort();
      return layers[layers.length - 1] || null;
    },
    topDismissible() {
      resort();
      return [...layers].reverse().find((layer) => layer.kind !== "toast") || null;
    },
    /** Portal descendants are logically inside their registered ancestor surface. */
    containsOwned(panelEl, target) {
      if (!panelEl || !target) return false;
      const roots = [...new Set([panelEl, ...layers.filter((layer) => isBelow({ panelEl }, layer)).map((layer) => layer.panelEl)].filter(Boolean))];
      let added = true;
      while (added) {
        added = false;
        for (const scope of ownedScopes) if (scope.panelEl?.isConnected && !roots.includes(scope.panelEl) && roots.some((root) => root.contains(scope.parentEl))) {
          roots.push(scope.panelEl);
          added = true;
        }
      }
      return roots.some((root) => root.contains(target));
    },
    /** Native sequential order with registered portal contents at their logical anchor. */
    focusOrder({ backwards = false, roots, logical = true } = {}) {
      const containerRoots = roots || (activeModal() ? focusScope() : [document.body]);
      let controls = visibleFocusables(containerRoots);
      for (const scope of logical ? ownedScopes : []) {
        const anchor = scope.anchorEl;
        if (!anchor || !scope.panelEl?.isConnected) continue;
        const anchors = controls.filter((el) => el === anchor || anchor.contains(el));
        if (!anchors.length) continue;
        const moving = controls.filter((el) => !anchors.includes(el) && this.containsOwned(scope.panelEl, el));
        if (!moving.length) continue;
        controls = controls.filter((el) => !moving.includes(el));
        const index = scope.tabOrder === "before" ? controls.indexOf(anchors[0]) : controls.indexOf(anchors[anchors.length - 1]) + 1;
        controls.splice(index, 0, ...moving);
      }
      controls.sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Infinity) - (b.tabIndex > 0 ? b.tabIndex : Infinity));
      return controls.filter((el) => {
        if (el.tagName !== "INPUT" || el.type !== "radio" || !el.name) return true;
        const group = controls.filter((other) => other.tagName === "INPUT" && other.type === "radio" && other.name === el.name && other.form === el.form && other.getRootNode() === el.getRootNode());
        return el === (group.find((radio) => radio.checked) || (backwards ? group[group.length - 1] : group[0]));
      });
    },
    activeModal,
    focusScope,
    get scrollLocked() {
      return locked;
    },
    get depth() {
      return layers.length;
    }
  };
}
var registryKey = /* @__PURE__ */ Symbol.for("@cyberskill/design/overlay-manager");
var registryProtocol = "cyberskill.overlay-manager/1";
var serverManager = createOverlayManager();
var serverContexts = { manager: React.createContext(null), scope: React.createContext(null) };
function documentRegistry() {
  if (typeof document === "undefined") return null;
  const descriptor = Object.getOwnPropertyDescriptor(document, registryKey);
  if (descriptor) {
    if (!("value" in descriptor)) throw new Error("Incompatible CyberSkill overlay registry: accessor records are unsupported");
    const record2 = descriptor.value;
    const value = (name) => Object.getOwnPropertyDescriptor(record2 || {}, name)?.value;
    const manager = value("manager"), contexts2 = value("contexts");
    const methods = ["register", "registerScope", "top", "topDismissible", "activeModal", "focusScope", "containsOwned", "focusOrder"];
    if (value("protocol") !== registryProtocol || !manager || methods.some((name) => typeof manager[name] !== "function") || !(contexts2 instanceof WeakMap) || typeof value("nextProviderId") !== "function" || !Number.isSafeInteger(manager.depth) || manager.depth < 0 || typeof manager.scrollLocked !== "boolean") {
      throw new Error("Incompatible CyberSkill overlay registry: expected " + registryProtocol + "; align compiled runtime copies before mounting overlays");
    }
    return record2;
  }
  let providerSequence = 0;
  const record = Object.freeze({
    protocol: registryProtocol,
    manager: createOverlayManager(),
    contexts: /* @__PURE__ */ new WeakMap(),
    nextProviderId: () => {
      let id;
      do {
        id = "cs-overlay-root-" + ++providerSequence;
      } while (document.getElementById(id));
      return id;
    }
  });
  Object.defineProperty(document, registryKey, { value: record, configurable: false, writable: false });
  return record;
}
function sharedContexts() {
  const registry = documentRegistry();
  if (!registry) return serverContexts;
  let contexts2 = registry.contexts.get(React);
  if (!contexts2) {
    contexts2 = { manager: React.createContext(null), scope: React.createContext(null) };
    registry.contexts.set(React, contexts2);
  }
  if (!contexts2.manager?.Provider || !contexts2.scope?.Provider) throw new Error("Incompatible CyberSkill overlay registry: invalid React ownership contexts");
  return contexts2;
}
var contexts = sharedContexts();
var OverlayContext = contexts.manager;
var overlayScopeContext = contexts.scope;
function getOverlayManager() {
  return documentRegistry()?.manager || serverManager;
}
function OverlayProvider({ children }) {
  const marker = React.useRef(null);
  const api = getOverlayManager();
  useClientLayoutEffect(() => {
    const element = marker.current;
    if (!element) return;
    const id = documentRegistry().nextProviderId();
    element.id = id;
    return () => {
      if (element.id === id) element.removeAttribute("id");
    };
  }, []);
  return /* @__PURE__ */ React.createElement(OverlayContext.Provider, { value: api }, /* @__PURE__ */ React.createElement("div", { ref: marker, "data-cs-overlay-root": "" }), children);
}
function useOverlayLayer({
  open,
  kind = "modal",
  trapFocus = false,
  lockScroll,
  onEscape,
  panelRef,
  backdropRef,
  preferFocusSelector,
  restoreFocus = true,
  surfaceKey
}) {
  const ctx = React.useContext(OverlayContext);
  const parentScope = React.useContext(overlayScopeContext);
  const mgr = ctx || getOverlayManager();
  const escapeRef = React.useRef(onEscape);
  escapeRef.current = onEscape;
  const scopeBinding = React.useRef(null);
  useClientLayoutEffect(() => {
    const panelEl = panelRef?.current;
    const previous = scopeBinding.current;
    if (previous?.panelEl === panelEl && previous?.parentScope === parentScope) return;
    previous?.cleanup();
    scopeBinding.current = panelEl && parentScope ? { panelEl, parentScope, cleanup: mgr.registerScope({ panelEl, get parentEl() {
      return parentScope.current;
    } }) } : null;
  });
  useClientLayoutEffect(() => () => {
    scopeBinding.current?.cleanup();
    scopeBinding.current = null;
  }, []);
  useClientLayoutEffect(() => {
    if (!open) return void 0;
    const restoreEl = typeof document !== "undefined" ? document.activeElement : null;
    const panel = panelRef && panelRef.current;
    const unregister = mgr.register({
      kind,
      lockScroll: lockScroll != null ? lockScroll : kind === "modal",
      onEscape: () => escapeRef.current && escapeRef.current(),
      restoreEl: restoreFocus ? restoreEl : null,
      panelEl: panel || null,
      backdropEl: backdropRef?.current || null,
      parentRef: parentScope
    });
    let detachTrap = () => {
    };
    const ownsModalFocus = mgr.activeModal()?.panelEl === panel;
    if (trapFocus && panel && ownsModalFocus && !mgr.focusScope().some((root) => root.contains(document.activeElement))) {
      const preferred = preferFocusSelector && panel.querySelector(preferFocusSelector) || visibleFocusables([panel])[0] || panel;
      preferred && preferred.focus && preferred.focus();
    }
    if (trapFocus && panel) {
      detachTrap = attachFocusTrap(panel, { isActive: () => mgr.activeModal()?.panelEl === panel, scopeElements: () => mgr.focusScope(), focusOrder: (backwards) => mgr.focusOrder({ backwards }) });
    }
    return () => {
      detachTrap();
      unregister();
    };
  }, [open, kind, trapFocus, lockScroll, mgr, panelRef, backdropRef, parentScope, preferFocusSelector, restoreFocus, surfaceKey]);
  return { manager: mgr, scope: open && panelRef ? panelRef : parentScope };
}

export {
  focusableSelector,
  attachFocusTrap,
  overlayScopeContext,
  getOverlayManager,
  OverlayProvider,
  useOverlayLayer
};
//# sourceMappingURL=chunk-6AEW6SXI.mjs.map
