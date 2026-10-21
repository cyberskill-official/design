import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";

import { makeT, useLang } from "../_i18n/i18n.js";
import { Tree } from "../data/Tree.jsx";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill TreeSelect — field opening a Tree; picking a node sets the value. */
export const TreeSelect = React.forwardRef(function TreeSelect({ portal = true, placement, controlRef, nodes = [], value, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [requestedOpen, setOpen] = React.useState(false);
  // Disable the mounted surface immediately and discard its previous open state.
  const open = requestedOpen && !disabled;
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("TreeSelect", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : undefined;
  const control = useFieldAssociation({ id: controlProps?.id ?? id,
    "aria-label": controlProps?.["aria-label"] ?? (controlProps?.["aria-labelledby"] || ariaLabelledBy ? undefined : label),
    "aria-labelledby": controlProps?.["aria-labelledby"] ?? ariaLabelledBy,
    "aria-describedby": controlProps?.["aria-describedby"], "aria-invalid": controlProps?.["aria-invalid"] },
    { fallbackLabel: label, description, error, requiredDescription });
  const find = (ns) => { for (const n of ns) { if (n.key === value) return n; const c = n.children && find(n.children); if (c) return c; } return null; };
  const sel = find(nodes);
  const floating = useFloatingPanel({ open: open, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: ()=>wrap.current?.querySelector(":scope > button"), lang });
  const { scope } = useOverlayLayer({ open: (open) && floating.ready, kind: "popover", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (!floating.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={mergedNativeRef} {...mergeTargetProps({ className: cx("cs-treeselect", className) }, rootProps)}>
      <button {...mergeTargetProps({ ...control, type: "button", className: "cs-treeselect__field", disabled, "aria-haspopup": "tree", "aria-expanded": open, onClick: () => setOpen(o => !o) }, controlProps, ["id", "role", "type", "name", "value", "defaultValue", "disabled", "required", "aria-required", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-haspopup", "aria-expanded", "aria-controls", "aria-activedescendant"])} ref={mergedControlRef} >
        <span className={sel ? undefined : "ph"}>{sel ? sel.label : ph}</span><span aria-hidden="true">▾</span>
      </button>
      {open ? (
        floating.render(<div ref={floatingRef} className="cs-treeselect__pop">
          <Tree aria-label={control["aria-label"] || (control["aria-labelledby"] ? undefined : ph)} aria-labelledby={control["aria-labelledby"]} nodes={nodes} selected={value} defaultOpen lang={L} onSelect={(k, n) => { if (!(n.children && n.children.length)) { onChange && onChange(k, n); setOpen(false); } }} />
        </div>)
      ) : null}
      {fieldMessages(control, description, error, requiredDescription)}
    </div>
    </overlayScopeContext.Provider>
  );
});
TreeSelect.displayName = "TreeSelect";
