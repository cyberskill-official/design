import { floatingPlacements, floatingPosition } from "./floating-position.js";
import React from "react";
import { createPortal } from "react-dom";
import { getOverlayManager, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { useClientLayoutEffect } from "./use-client-layout-effect.js";

const placements = new Set(floatingPlacements);
const axes = ["lang", "dir", "data-theme", "data-cs-density", "data-cs-contrast", "data-cs-element", "data-cs-variant", "data-cs-style", "data-managed"];
const inherited = ["font-family", "font-size", "font-style", "font-weight", "line-height", "letter-spacing", "color", "direction", "writing-mode", "text-align", "visibility", "pointer-events", "user-select"];
const geometry = ["position", "inset", "left", "top", "right", "bottom", "z-index", "max-width", "min-width", "max-height", "min-height", "box-sizing", "overflow-y", "transform", "transition-property", "margin", "width"];

function scopeHost(host, anchor, boundary, open, lang) {
  if (!anchor || !host) return;
  const computed = getComputedStyle(anchor);
  // A portal host is a scope carrier, not a duplicate component root.
  host.removeAttribute("class");
  for (const name of axes) {
    const value = (name === "lang" && lang != null && String(lang).trim()) || anchor.closest("[" + name + "]")?.getAttribute(name);
    if (value != null) host.setAttribute(name, value); else host.removeAttribute(name);
  }
  host.setAttribute("data-open", String(Boolean(open)));
  const hidden = !anchor.getClientRects().length;
  host.style.display = hidden ? "none" : "contents";
  host.inert = Boolean(anchor.closest("[inert]"));
  if (hidden || host.inert || anchor.closest('[aria-hidden="true"]')) host.setAttribute("aria-hidden", "true");
  else host.removeAttribute("aria-hidden");
  for (const name of inherited) host.style.setProperty(name, computed.getPropertyValue(name));
  const current = new Set();
  for (let index = 0; index < computed.length; index++) {
    const name = computed[index];
    if (name.startsWith("--")) { current.add(name); host.style.setProperty(name, computed.getPropertyValue(name)); }
  }
  for (let index = host.style.length - 1; index >= 0; index--) {
    const name = host.style[index];
    if (name.startsWith("--") && !current.has(name)) host.style.removeProperty(name);
  }
}

/** One anchored surface. Portals are client-only; inline opt-out retains server markup.
 * React context crosses createPortal; the existing overlay manager owns dismissal/focus/inert. */
export function useFloatingPanel({ open, anchorRef, boundaryRef = anchorRef, panelRef, portal = true, placement = "bottom-start", gap = 8, matchWidth = false, scroll = true, point, lang, identity, getAnchor, getInlineParent, getTabAnchor, tabOrder = "after", manageTabOrder = true }) {
  if (!placements.has(placement)) throw new TypeError("Unsupported floating placement: " + placement);
  const parentScope = React.useContext(overlayScopeContext);
  const boundaryBinding = React.useRef(null);
  const panelBinding = React.useRef(null);
  useClientLayoutEffect(() => {
    const panelEl = boundaryRef.current;
    const previous = boundaryBinding.current;
    if (previous?.panelEl === panelEl && previous?.parentScope === parentScope) return;
    previous?.cleanup();
    boundaryBinding.current = panelEl && parentScope ? { panelEl, parentScope, cleanup: getOverlayManager().registerScope({ panelEl, get parentEl() { return parentScope.current; } }) } : null;
  });
  useClientLayoutEffect(() => () => { boundaryBinding.current?.cleanup(); boundaryBinding.current = null; }, []);
  useClientLayoutEffect(() => {
    const panelEl = panelRef.current;
    const boundaryEl = boundaryRef.current;
    const previous = panelBinding.current;
    if (previous?.panelEl === panelEl && previous?.boundaryEl === boundaryEl) return;
    previous?.cleanup();
    panelBinding.current = panelEl && boundaryEl ? { panelEl, boundaryEl, cleanup: getOverlayManager().registerScope({ panelEl, get parentEl() { return boundaryRef.current; }, get anchorEl() { return options.current.getTabAnchor?.() || anchorElement(); }, get tabOrder() { return options.current.tabOrder; } }) } : null;
  });
  useClientLayoutEffect(() => () => { panelBinding.current?.cleanup(); panelBinding.current = null; }, []);
  const [host, setHost] = React.useState(null);
  const [nativeInline, setNativeInline] = React.useState(false);
  const lastFocused = React.useRef(null);
  const activeHost = portal ? host : null;
  const options = React.useRef(null);
  const schedulePosition = React.useRef(() => {});
  options.current = { open, anchorRef, boundaryRef, panelRef, placement, gap, matchWidth, point, lang, getAnchor, getInlineParent, getTabAnchor, tabOrder };
  const anchorElement = () => {
    const candidate = options.current.getAnchor?.() || options.current.anchorRef.current;
    // A missing custom trigger must not resolve to its newly local private host.
    return host?.contains(candidate) ? options.current.anchorRef.current : candidate;
  };
  const inlineParentElement = () => options.current.getInlineParent?.() || options.current.boundaryRef.current;
  const placeHost = (element, sourceMoved = false) => {
    const parent = inlineParentElement();
    const local = Boolean(parent?.closest("form,fieldset"));
    const target = local ? parent : document.body;
    const anchor = options.current.getTabAnchor?.() || anchorElement();
    const before = local && options.current.tabOrder === "before" && anchor?.parentElement === target ? anchor : null;
    if (element.parentElement !== target || (before && element.nextSibling !== before)) {
      const focused = element.contains(document.activeElement) ? document.activeElement : sourceMoved && document.activeElement === document.body && element.contains(lastFocused.current) ? lastFocused.current : null;
      const selection = focused && typeof focused.selectionStart === "number" ? [focused.selectionStart, focused.selectionEnd, focused.selectionDirection] : null;
      // moveBefore preserves focus/DOM state where available. The fallback keeps
      // the same portal container/children and restores focus without hiding native events.
      if (element.isConnected && typeof target.moveBefore === "function") target.moveBefore(element, before);
      else target.insertBefore(element, before);
      if (focused?.isConnected && document.activeElement !== focused && !focused.matches(":disabled") && !focused.closest("[inert]")) {
        focused.focus({ preventScroll: true });
        if (selection) focused.setSelectionRange(...selection);
      }
    }
    if (local) {
      element.setAttribute("data-cs-floating-inline", "");
      // Local placement inherits the real insertion ancestry, just like explicit
      // inline rendering. Do not retain stale copied body-mode style snapshots.
      element.removeAttribute("style"); element.style.display = "contents";
      for (const axis of axes) element.removeAttribute(axis);
      element.removeAttribute("aria-hidden"); element.inert = false;
      element.setAttribute("data-open", String(Boolean(options.current.open)));
      if (options.current.lang != null) element.lang = String(options.current.lang);
    } else {
      element.removeAttribute("data-cs-floating-inline");
      scopeHost(element, anchorElement(), boundaryRef.current, options.current.open, options.current.lang);
    }
    setNativeInline(previous => previous === local ? previous : local);
  };
  useClientLayoutEffect(() => {
    if (!portal) { setHost(null); setNativeInline(false); return; }
    const element = document.createElement("span");
    element.setAttribute("data-cs-floating-root", "");
    element.style.display = "contents";
    let focusTimer;
    const onFocusOut = event => {
      if (event.relatedTarget != null) { lastFocused.current = null; return; }
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => { lastFocused.current = null; }, 0);
    };
    const onFocusIn = event => { clearTimeout(focusTimer); lastFocused.current = event.target; };
    element.addEventListener("focusout", onFocusOut); element.addEventListener("focusin", onFocusIn);
    placeHost(element);
    setHost(element);
    return () => { clearTimeout(focusTimer); lastFocused.current = null; element.removeEventListener("focusout", onFocusOut); element.removeEventListener("focusin", onFocusIn); element.remove(); };
  }, [portal]);
  const ready = !portal || Boolean(host?.isConnected);
  useClientLayoutEffect(() => {
    const anchor = anchorElement();
    if (!ready || !anchor) return;
    const observeAncestors = () => {
      observer.disconnect();
      const nodes = new Set();
      for (const start of [anchorElement(), inlineParentElement()]) for (let node = start; node; node = node.parentElement) nodes.add(node);
      for (const node of nodes) observer.observe(node, { attributes: true, childList: Boolean(activeHost), attributeFilter: [...axes, "class", "style", "hidden", "inert", "aria-hidden"] });
    };
    const updateScope = records => {
      const parent = inlineParentElement();
      const sourceMoved = Array.isArray(records) && records.some(record => record.type === "childList" && [...record.removedNodes].some(node => node === parent || node.contains?.(parent)));
      if (activeHost) placeHost(activeHost, sourceMoved); observeAncestors(); schedulePosition.current();
    };
    const observer = new MutationObserver(updateScope);
    updateScope();
    const media = ["(prefers-color-scheme: dark)", "(forced-colors: active)", "(prefers-contrast: more)", "(prefers-reduced-motion: reduce)", "(pointer: coarse)"].map(query => matchMedia(query));
    for (const query of media) query.addEventListener("change", updateScope);
    return () => { observer.disconnect(); for (const query of media) query.removeEventListener("change", updateScope); };
  }, [ready, activeHost, boundaryRef, anchorRef, open, lang, identity]);
  useClientLayoutEffect(() => {
    const panel = panelRef.current;
    const anchor = anchorElement();
    if (!open || !ready || !panel || !anchor) return;
    const before = new Map(geometry.map(name => [name, [panel.style.getPropertyValue(name), panel.style.getPropertyPriority(name)]]));
    // Keep caller writes distinct from the most recent positioning pass. The
    // native ref remains consumer-owned even while geometry is constrained.
    let owned = null;
    const readGeometry = () => new Map(geometry.map(name => [name, [panel.style.getPropertyValue(name), panel.style.getPropertyPriority(name)]]));
    const captureCallerStyles = () => {
      if (!owned) return false;
      let changed = false;
      for (const [name, value] of readGeometry()) {
        const last = owned.get(name);
        if (value[0] !== last[0] || value[1] !== last[1]) { before.set(name, value); changed = true; }
      }
      return changed;
    };
    const priorPlacement = panel.getAttribute("data-cs-placement");
    let frame = null;
    let positionedScroll = null;
    const position = () => {
      frame = null;
      const anchor = anchorElement();
      if (!panel.isConnected || !anchor?.isConnected) return;
      captureCallerStyles();
      const scrollLeft = panel.scrollLeft, scrollTop = panel.scrollTop;
      const view = window.visualViewport;
      const viewport = { left: (view?.offsetLeft || 0) + 8, top: (view?.offsetTop || 0) + 8, right: (view?.offsetLeft || 0) + (view?.width || document.documentElement.clientWidth) - 8, bottom: (view?.offsetTop || 0) + (view?.height || window.innerHeight) - 8 };
      for (const name of ["min-width", "max-width", "min-height", "max-height", "width"]) {
        const [value, priority] = before.get(name);
        if (value) panel.style.setProperty(name, value, priority); else panel.style.removeProperty(name);
      }
      const rect = anchor.getBoundingClientRect();
      const naturalStyle = getComputedStyle(panel);
      const minWidth = naturalStyle.minWidth.endsWith("%") ? rect.width * parseFloat(naturalStyle.minWidth) / 100 : parseFloat(naturalStyle.minWidth) || 0;
      const heightLimit = parseFloat(naturalStyle.maxHeight), widthLimit = parseFloat(naturalStyle.maxWidth);
      const maxHeight = Number.isFinite(heightLimit) ? heightLimit : Infinity;
      const maxWidth = Number.isFinite(widthLimit) ? widthLimit : Infinity;
      const cursor = options.current.point;
      const box = cursor ? {left: cursor.x + (cursor.relative ? rect.left : 0), right: cursor.x + (cursor.relative ? rect.left : 0), top: cursor.y + (cursor.relative ? rect.top : 0), bottom: cursor.y + (cursor.relative ? rect.top : 0), width:0, height:0} : rect;
      // Legacy anchored transforms must not animate into the physical coordinates.
      // Keep presentation transitions (notably tooltip opacity) while placement stays exact.
      const transitions = naturalStyle.transitionProperty.split(",").map(value => value.trim());
      panel.style.transitionProperty = transitions.includes("all") ? "opacity, color, background-color, border-color, box-shadow" : transitions.filter(value => !["transform", "translate", "left", "right", "top", "bottom", "inset", "width", "height", "max-width", "max-height"].includes(value)).join(",") || "none";
      panel.style.position = portal && !nativeInline ? "fixed" : "absolute";
      panel.style.inset = "auto";
      panel.style.transform = "none";
      panel.style.margin = "0";
      panel.style.boxSizing = "border-box";
      panel.style.maxWidth = Math.min(maxWidth, Math.max(0, viewport.right - viewport.left)) + "px";
      panel.style.minWidth = Math.min(minWidth, Math.max(0, viewport.right - viewport.left)) + "px";
      panel.style.maxHeight = Math.min(maxHeight, Math.max(0, viewport.bottom - viewport.top)) + "px";
      panel.style.minHeight = "0";
      panel.style.overflowY = scroll ? "auto" : "visible";
      if (matchWidth) panel.style.width = Math.min(rect.width, Math.max(0, viewport.right - viewport.left)) + "px";
      const initial = floatingPosition(box, panel.getBoundingClientRect(), viewport, placement, gap, getComputedStyle(anchor).direction);
      panel.style.maxWidth = Math.min(maxWidth, initial.maxWidth) + "px";
      panel.style.minWidth = Math.min(minWidth, initial.maxWidth) + "px";
      panel.style.maxHeight = Math.min(maxHeight, initial.maxHeight) + "px";
      const result = floatingPosition(box, panel.getBoundingClientRect(), viewport, initial.placement, gap, getComputedStyle(anchor).direction);
      let zIndex = parseInt(getComputedStyle(panel).zIndex, 10) || 0;
      for (let parent = anchor; parent; parent = parent.parentElement) zIndex = Math.max(zIndex, (parseInt(getComputedStyle(parent).zIndex, 10) || 0) + 1);
      panel.style.zIndex = String(zIndex);
      if (portal && !nativeInline) { panel.style.left = result.left + "px"; panel.style.top = result.top + "px"; }
      else {
        panel.style.left = "0px"; panel.style.top = "0px";
        const origin = panel.getBoundingClientRect();
        const scaleX = panel.offsetWidth ? origin.width / panel.offsetWidth : 1;
        const scaleY = panel.offsetHeight ? origin.height / panel.offsetHeight : 1;
        panel.style.left = (result.left - origin.left) / (scaleX || 1) + "px";
        panel.style.top = (result.top - origin.top) / (scaleY || 1) + "px";
      }
      panel.setAttribute("data-cs-placement", result.placement);
      // Natural-size measurement can temporarily remove overflow and reset a
      // user's scroll offset. Restore it after the final collision constraints.
      panel.scrollLeft = scrollLeft; panel.scrollTop = scrollTop;
      positionedScroll = { left: panel.scrollLeft, top: panel.scrollTop };
      owned = readGeometry();
    };
    const schedule = () => { if (frame == null) frame = requestAnimationFrame(position); };
    schedulePosition.current = schedule;
    position();
    const onScroll = event => {
      // Browsers may deliver a scroll event for the temporary unconstrained
      // measurement even after its original offset has been restored.
      if (event.target === panel && positionedScroll && panel.scrollLeft === positionedScroll.left && panel.scrollTop === positionedScroll.top) return;
      schedule();
    };
    const resize = new ResizeObserver(schedule); resize.observe(anchor); resize.observe(panel);
    const styleObserver = new MutationObserver(() => { if (captureCallerStyles()) schedule(); });
    styleObserver.observe(panel, { attributes: true, attributeFilter: ["style"] });
    window.addEventListener("resize", schedule); window.addEventListener("scroll", onScroll, true);
    window.visualViewport?.addEventListener("resize", schedule); window.visualViewport?.addEventListener("scroll", schedule);
    return () => {
      captureCallerStyles();
      styleObserver.disconnect();
      resize.disconnect(); if (frame != null) cancelAnimationFrame(frame);
      if (schedulePosition.current === schedule) schedulePosition.current = () => {};
      window.removeEventListener("resize", schedule); window.removeEventListener("scroll", onScroll, true);
      window.visualViewport?.removeEventListener("resize", schedule); window.visualViewport?.removeEventListener("scroll", schedule);
      for (const [name, [value, priority]] of before) { if (value) panel.style.setProperty(name, value, priority); else panel.style.removeProperty(name); }
      if (priorPlacement == null) panel.removeAttribute("data-cs-placement"); else panel.setAttribute("data-cs-placement", priorPlacement);
    };
  }, [open, ready, activeHost, portal, nativeInline, anchorRef, panelRef, placement, gap, matchWidth, scroll, point?.x, point?.y, identity]);
  React.useEffect(() => {
    if (!open || !ready || !manageTabOrder) return;
    const restoreTimers = new Map();
    const onTab = event => {
      const manager = getOverlayManager();
      const panel = panelRef.current;
      if (event.key !== "Tab" || event.defaultPrevented || event.isComposing || event.keyCode === 229 || manager.topDismissible()?.panelEl !== panel) return;
      const controls = manager.focusOrder({ backwards: event.shiftKey });
      const index = controls.indexOf(document.activeElement);
      if (index < 0) return;
      const next = index + (event.shiftKey ? -1 : 1);
      const target = controls[next] || (manager.activeModal() ? controls[(next + controls.length) % controls.length] : null);
      const native = manager.focusOrder({ backwards: event.shiftKey, logical: false });
      const nativeIndex = native.indexOf(document.activeElement);
      const nativeTarget = native[nativeIndex + (event.shiftKey ? -1 : 1)] || null;
      if (target === nativeTarget && !manager.activeModal()) return;
      if (target) { event.preventDefault(); target.focus(); }
      else if (manager.containsOwned(panel, event.target)) {
        // Let the browser leave the document at its logical edge. Temporarily
        // remove this host's stops so physical body order cannot loop back in.
        const stops = native.filter(el => manager.containsOwned(panel, el));
        const prior = stops.map(el => [el, el.getAttribute("tabindex")]);
        for (const el of stops) el.tabIndex = -1;
        const anchor = options.current.getTabAnchor?.() || anchorElement();
        const anchorControl = native.find(el => el === anchor || anchor?.contains(el));
        anchorControl?.focus();
        const restore = () => { for (const [el, value] of prior) if (el.isConnected && el.getAttribute("tabindex") === "-1") { if (value == null) el.removeAttribute("tabindex"); else el.setAttribute("tabindex", value); } };
        const timer = setTimeout(() => { restore(); restoreTimers.delete(timer); }, 0);
        restoreTimers.set(timer, restore);
      }
    };
    document.addEventListener("keydown", onTab);
    return () => { document.removeEventListener("keydown", onTab); for (const [timer, restore] of restoreTimers) { clearTimeout(timer); restore(); } };
  }, [open, ready, manageTabOrder, panelRef, boundaryRef, identity]);
  const surfaceKey = React.useMemo(() => ({ portal, host: activeHost, identity }), [portal, activeHost, identity]);
  return {
    ready, surfaceKey,
    contains: node => Boolean(node && (boundaryRef.current?.contains(node) || getOverlayManager().containsOwned(panelRef.current, node))),
    render: node => portal ? (host ? createPortal(node, host) : null) : node,
  };
}
