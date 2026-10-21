"use client";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  formatNumber,
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

// components/navigation/CommandPalette.jsx
import React from "react";
var CommandPalette = React.forwardRef(function CommandPalette2({ controlRef, open, onClose, placeholder, groups = [], lang, className, rootProps }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [q, setQ] = React.useState("");
  const panel = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  const { scope } = useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    preferFocusSelector: ".cs-cmdk__search input",
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel
  });
  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("CommandPalette", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  if (!open) return null;
  const needle = q.trim().toLowerCase();
  const filteredGroups = groups.map((g) => ({
    ...g,
    items: (g.items || []).filter((it) => !needle || String(it.label).toLowerCase().includes(needle))
  }));
  const resultCount = filteredGroups.reduce((count, group) => count + group.items.length, 0);
  const resultStatus = resultCount === 0 ? t("empty") : t(resultCount === 1 ? "oneResult" : "results").replace("{count}", formatNumber(resultCount, L));
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: (el) => {
        ref.current = el;
        panel.current = el;
      },
      className: "cs-cmdk-scrim",
      onClick: onClose
    },
    /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": cx("cs-cmdk", className), "onClick": (e) => e.stopPropagation() }, rootProps, ["role", "aria-modal", "aria-label"]), role: "dialog", "aria-modal": "true", "aria-label": t("aria"), ref: mergedNativeRef }, /* @__PURE__ */ React.createElement("div", { className: "cs-cmdk__search" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "M21 21l-4.3-4.3" })), /* @__PURE__ */ React.createElement("input", { "aria-label": ph, value: q, onChange: (e) => setQ(e.target.value), placeholder: ph, ref: mergedControlRef }), /* @__PURE__ */ React.createElement("span", { className: "cs-kbd" }, t("esc"))), /* @__PURE__ */ React.createElement("div", { className: "cs-cmdk__list" }, /* @__PURE__ */ React.createElement("div", { className: "cs-cmdk__status", role: "status", "aria-live": "polite", "aria-atomic": "true" }, resultStatus), filteredGroups.map((g, gi) => {
      const items = g.items;
      if (!items.length) return null;
      return /* @__PURE__ */ React.createElement(React.Fragment, { key: gi }, g.label || g.label === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-cmdk__label" }, g.label) : null, items.map((it, ii) => /* @__PURE__ */ React.createElement("button", { key: ii, type: "button", className: "cs-cmdk__item", onClick: () => {
        it.onSelect && it.onSelect();
        setQ("");
        onClose && onClose();
      } }, it.icon || it.icon === 0 ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, it.icon) : null, /* @__PURE__ */ React.createElement("span", null, it.label), it.shortcut || it.shortcut === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-kbd" }, it.shortcut) : null)));
    })))
  ));
});
CommandPalette.displayName = "CommandPalette";

export {
  CommandPalette
};
//# sourceMappingURL=chunk-IH4I7JSB.mjs.map
