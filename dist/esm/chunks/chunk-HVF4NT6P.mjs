"use client";
import {
  Tree
} from "./chunk-RQQH7VWW.mjs";
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
  fieldMessages,
  mergeTargetProps,
  useFieldAssociation
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/TreeSelect.jsx
import React from "react";
var TreeSelect = React.forwardRef(function TreeSelect2({ portal = true, placement, controlRef, nodes = [], value, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [requestedOpen, setOpen] = React.useState(false);
  const open = requestedOpen && !disabled;
  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("TreeSelect", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : void 0;
  const control = useFieldAssociation(
    {
      id: controlProps?.id ?? id,
      "aria-label": controlProps?.["aria-label"] ?? (controlProps?.["aria-labelledby"] || ariaLabelledBy ? void 0 : label),
      "aria-labelledby": controlProps?.["aria-labelledby"] ?? ariaLabelledBy,
      "aria-describedby": controlProps?.["aria-describedby"],
      "aria-invalid": controlProps?.["aria-invalid"]
    },
    { fallbackLabel: label, description, error, requiredDescription }
  );
  const find = (ns) => {
    for (const n of ns) {
      if (n.key === value) return n;
      const c = n.children && find(n.children);
      if (c) return c;
    }
    return null;
  };
  const sel = find(nodes);
  const floating = useFloatingPanel({ open, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: () => wrap.current?.querySelector(":scope > button"), lang });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (!floating.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", d);
    return () => {
      document.removeEventListener("mousedown", d);
    };
  }, [open]);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ className: cx("cs-treeselect", className) }, rootProps) }, /* @__PURE__ */ React.createElement("button", { ...mergeTargetProps({ ...control, type: "button", className: "cs-treeselect__field", disabled, "aria-haspopup": "tree", "aria-expanded": open, onClick: () => setOpen((o) => !o) }, controlProps, ["id", "role", "type", "name", "value", "defaultValue", "disabled", "required", "aria-required", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-haspopup", "aria-expanded", "aria-controls", "aria-activedescendant"]), ref: mergedControlRef }, /* @__PURE__ */ React.createElement("span", { className: sel ? void 0 : "ph" }, sel ? sel.label : ph), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "▾")), open ? floating.render(/* @__PURE__ */ React.createElement("div", { ref: floatingRef, className: "cs-treeselect__pop" }, /* @__PURE__ */ React.createElement(Tree, { "aria-label": control["aria-label"] || (control["aria-labelledby"] ? void 0 : ph), "aria-labelledby": control["aria-labelledby"], nodes, selected: value, defaultOpen: true, lang: L, onSelect: (k, n) => {
    if (!(n.children && n.children.length)) {
      onChange && onChange(k, n);
      setOpen(false);
    }
  } }))) : null, fieldMessages(control, description, error, requiredDescription)));
});
TreeSelect.displayName = "TreeSelect";

export {
  TreeSelect
};
//# sourceMappingURL=chunk-HVF4NT6P.mjs.map
