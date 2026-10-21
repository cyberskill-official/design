"use client";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/HotKeys.jsx
import React from "react";
function match(combo, e) {
  const parts = combo.toLowerCase().split("+").map((part) => part.trim());
  const key = parts.pop();
  if (!key || parts.some((part) => !["mod", "ctrl", "meta", "shift", "alt"].includes(part))) return false;
  const has = (name) => parts.includes(name);
  const control = has("mod") ? (e.metaKey || e.ctrlKey) && (!has("ctrl") || e.ctrlKey) && (!has("meta") || e.metaKey) : e.ctrlKey === has("ctrl") && e.metaKey === has("meta");
  return control && e.shiftKey === has("shift") && e.altKey === has("alt") && e.key.toLowerCase() === key;
}
var HotKeys = React.forwardRef(function HotKeys2({ bindings = [], help = true, children, lang, className, rootProps }, forwardedRef) {
  const [show, setShow] = React.useState(false);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("HotKeys", L, localeMessages);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const backdrop = React.useRef(null);
  const { scope } = useOverlayLayer({ open: show, kind: "modal", trapFocus: true, panelRef: panel, backdropRef: backdrop, onEscape: () => setShow(false) });
  React.useEffect(() => {
    const on = (e) => {
      if (e.defaultPrevented || e.isComposing || e.keyCode === 229) return;
      const path = e.composedPath?.() || [e.target];
      if (path.some((node) => node?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(node?.tagName))) return;
      if (help && e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!show && [...document.querySelectorAll('[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]')].some((m) => m !== panel.current && !m.contains(ref.current))) return;
        setShow((s) => !s);
        return;
      }
      for (const b of bindings) if (match(b.keys, e)) {
        e.preventDefault();
        b.onTrigger && b.onTrigger();
        return;
      }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [bindings, help, show]);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref, ...mergeTargetProps({ "className": cx("cs-hotkeys", className) }, rootProps, []) }, children, show ? /* @__PURE__ */ React.createElement("div", { ref: backdrop, className: "cs-hotkeys__sheet", onClick: () => setShow(false) }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, tabIndex: -1, className: "cs-hotkeys__card", role: "dialog", "aria-modal": "true", "aria-label": t("title"), onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("b", null, t("title")), /* @__PURE__ */ React.createElement("ul", null, bindings.map((b, i) => /* @__PURE__ */ React.createElement("li", { key: i }, /* @__PURE__ */ React.createElement("span", null, b.description), /* @__PURE__ */ React.createElement("kbd", { className: "cs-kbd" }, b.keys))), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("span", null, t("toggle")), /* @__PURE__ */ React.createElement("kbd", { className: "cs-kbd" }, "?"))))) : null));
});
HotKeys.displayName = "HotKeys";

export {
  HotKeys
};
//# sourceMappingURL=chunk-SYCXNMYP.mjs.map
