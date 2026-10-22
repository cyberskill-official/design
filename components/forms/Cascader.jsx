import { useFloatingPanel } from "../_utils/floating-panel.js";
import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { useFieldAssociation, mergeTargetProps, fieldMessages } from "../_utils/field-association.js";

import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

const EMPTY_PATH = [];

/** CyberSkill Cascader — column-per-level picker for hierarchies (province → district style). */
export const Cascader = React.forwardRef(function Cascader({ portal = true, placement, controlRef, nodes = [], value = EMPTY_PATH, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [requestedOpen, setOpen] = React.useState(false);
  // Disable the mounted surface immediately and discard its previous open state.
  const open = requestedOpen && !disabled;
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const [path, setPath] = React.useState(value);
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("Cascader", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : undefined;
  const control = useFieldAssociation({ id: controlProps?.id ?? id,
    "aria-label": controlProps?.["aria-label"] ?? (controlProps?.["aria-labelledby"] || ariaLabelledBy ? undefined : label),
    "aria-labelledby": controlProps?.["aria-labelledby"] ?? ariaLabelledBy,
    "aria-describedby": controlProps?.["aria-describedby"], "aria-invalid": controlProps?.["aria-invalid"] },
    { fallbackLabel: label, description, error, requiredDescription });
  // Controlled value must re-sync even when the popover stays closed (FIND-014).
  // Depend on a stable key — default `[]` must not reset path every render.
  const valueKey = Array.isArray(value) ? value.join("\0") : "";
  React.useEffect(() => { setPath(Array.isArray(value) ? value : EMPTY_PATH); }, [valueKey]);
  const floating = useFloatingPanel({ open: open, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: ()=>wrap.current?.querySelector(":scope > button"), lang });
  const { manager, scope } = useOverlayLayer({ open: (open) && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (!floating.contains(e.target)) setOpen(false); };
    const k = (e) => {
      if (manager.topDismissible()?.panelEl !== floatingRef.current) return;
      if (e.defaultPrevented || e.isComposing || e.keyCode === 229) return;
      if (!floating.contains(e.target)) return;
      const opts = [...floatingRef.current.querySelectorAll('[role="option"]')];
      if (!opts.length) return;
      const active = document.activeElement;
      const idx = opts.indexOf(active);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        (opts[idx < 0 ? 0 : Math.min(opts.length - 1, idx + 1)] || opts[0]).focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        (opts[idx < 0 ? opts.length - 1 : Math.max(0, idx - 1)] || opts[0]).focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        opts[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        opts[opts.length - 1].focus();
      } else if (e.key === "ArrowRight" && idx >= 0) {
        // Expand into children by activating the selected option when it has a chevron.
        active.click && active.click();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (path.length) {
          const columns = [...floatingRef.current.querySelectorAll('[role="listbox"]')];
          const column = active?.closest('[role="listbox"]');
          const depth = columns.indexOf(column);
          const parentDepth = depth > 0 ? depth - 1 : Math.max(0, path.length - 1);
          const parent = columns[parentDepth]?.querySelector('[role="option"][aria-selected="true"]');
          // Move focus before unmounting the child column.
          parent?.focus();
          setPath(path.slice(0, parentDepth));
        } else {
          setOpen(false);
          const field = wrap.current.querySelector(".cs-treeselect__field");
          field && field.focus && field.focus();
        }
      }
    };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", d);
      document.removeEventListener("keydown", k);
    };
  }, [open, path]);
  const cols = [];
  let level = nodes;
  for (let i = 0; level && level.length; i++) {
    cols.push(level);
    const pick = level.find((n) => n.key === path[i]);
    level = pick && pick.children;
  }
  const labels = [];
  { let lv = nodes; for (const k of value) { const n = (lv || []).find((x) => x.key === k); if (!n) break; labels.push(n.label); lv = n.children; } }
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={mergedNativeRef} {...mergeTargetProps({ className: cx("cs-cascader", className) }, rootProps)}>
      <button {...mergeTargetProps({ ...control, type: "button", className: "cs-treeselect__field", disabled, "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => setOpen(o => !o), onKeyDown: (e) => {
          if (e.defaultPrevented || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
          // Once open, the document handler owns arrows from this trigger too.
          if (open && e.key === "ArrowDown") return;
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        } }, controlProps, ["id", "role", "type", "name", "value", "defaultValue", "disabled", "required", "aria-required", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-haspopup", "aria-expanded", "aria-controls", "aria-activedescendant"])} ref={mergedControlRef} >
        <span className={labels.length ? undefined : "ph"}>{labels.length ? labels.map((label, index) => <React.Fragment key={index}>{index ? <React.Fragment>{" "}<span aria-hidden="true">/</span>{" "}</React.Fragment> : null}{label}</React.Fragment>) : ph}</span><span aria-hidden="true">▾</span>
      </button>
      {open ? (
        floating.render(<div ref={floatingRef} className="cs-cascader__pop">
          {cols.map((col, i) => (
            <ul key={i} role="listbox" aria-labelledby={control["aria-labelledby"] || control.id} className="cs-cascader__col">
              {col.map((n) => (
                // role="none" — the <li> wrapper must not sit between listbox and option.
                <li key={n.key} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={path[i] === n.key}
                    className={cx("cs-cascader__opt", path[i] === n.key && "on")}
                    // Keep options in the focusable set for arrow models (E3).
                    data-cs-focusable=""
                    onClick={() => {
                      const next = [...path.slice(0, i), n.key];
                      setPath(next);
                      if (!(n.children && n.children.length)) { onChange && onChange(next); setOpen(false); }
                    }}
                  >
                    {n.label}{n.children && n.children.length ? <span aria-hidden="true"> ›</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>)
      ) : null}
      {fieldMessages(control, description, error, requiredDescription)}
    </div>
    </overlayScopeContext.Provider>
  );
});
Cascader.displayName = "Cascader";
