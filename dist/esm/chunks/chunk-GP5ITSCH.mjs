"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
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

// components/ai/AIDisclosureBadge.jsx
import React from "react";
var AIDisclosureBadge = React.forwardRef(function AIDisclosureBadge2({
  portal = true,
  placement,
  controlRef,
  label,
  details,
  lang,
  sources = [],
  className,
  rootProps
}, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("AIDisclosureBadge", L, localeMessages);
  const [open, setOpen] = React.useState(false);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, ref, forwardedRef);
  const floating = useFloatingPanel({ open, anchorRef: panel, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 8, getAnchor: () => panel.current?.querySelector(".cs-ai-disclosure__badge"), lang });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  const panelId = React.useId();
  const sourceList = (sources || []).filter(Boolean);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("span", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-ai-disclosure", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "cs-ai-disclosure__badge",
      "aria-expanded": open,
      "aria-controls": open ? panelId : void 0,
      onClick: () => setOpen((v) => !v),
      ref: mergedControlRef
    },
    label ?? t("label")
  ), open ? floating.render(/* @__PURE__ */ React.createElement("span", { ref: floatingRef, id: panelId, role: "status", className: "cs-ai-disclosure__panel" }, /* @__PURE__ */ React.createElement("span", { className: "cs-ai-disclosure__details" }, details ?? t("details")), sourceList.length ? /* @__PURE__ */ React.createElement("span", { className: "cs-ai-disclosure__sources" }, t("sources"), ": ", sourceList.join(", ")) : null)) : null));
});
AIDisclosureBadge.displayName = "AIDisclosureBadge";

export {
  AIDisclosureBadge
};
//# sourceMappingURL=chunk-GP5ITSCH.mjs.map
