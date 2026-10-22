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

// components/forms/Cascader.jsx
import React from "react";
var EMPTY_PATH = [];
var Cascader = React.forwardRef(function Cascader2({ portal = true, placement, controlRef, nodes = [], value = EMPTY_PATH, onChange, placeholder, label, "aria-labelledby": ariaLabelledBy, disabled = false, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(controlRef);
  const [requestedOpen, setOpen] = React.useState(false);
  const open = requestedOpen && !disabled;
  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  const [path, setPath] = React.useState(value);
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("Cascader", L, localeMessages);
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
  const valueKey = Array.isArray(value) ? value.join("\0") : "";
  React.useEffect(() => {
    setPath(Array.isArray(value) ? value : EMPTY_PATH);
  }, [valueKey]);
  const floating = useFloatingPanel({ open, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 6, getAnchor: () => wrap.current?.querySelector(":scope > button"), lang });
  const { manager, scope } = useOverlayLayer({ open: open && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (!floating.contains(e.target)) setOpen(false);
    };
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
        active.click && active.click();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (path.length) {
          const columns = [...floatingRef.current.querySelectorAll('[role="listbox"]')];
          const column = active?.closest('[role="listbox"]');
          const depth = columns.indexOf(column);
          const parentDepth = depth > 0 ? depth - 1 : Math.max(0, path.length - 1);
          const parent = columns[parentDepth]?.querySelector('[role="option"][aria-selected="true"]');
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
  {
    let lv = nodes;
    for (const k of value) {
      const n = (lv || []).find((x) => x.key === k);
      if (!n) break;
      labels.push(n.label);
      lv = n.children;
    }
  }
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ className: cx("cs-cascader", className) }, rootProps) }, /* @__PURE__ */ React.createElement("button", { ...mergeTargetProps({ ...control, type: "button", className: "cs-treeselect__field", disabled, "aria-haspopup": "listbox", "aria-expanded": open, onClick: () => setOpen((o) => !o), onKeyDown: (e) => {
    if (e.defaultPrevented || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
    if (open && e.key === "ArrowDown") return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  } }, controlProps, ["id", "role", "type", "name", "value", "defaultValue", "disabled", "required", "aria-required", "aria-label", "aria-labelledby", "aria-describedby", "aria-invalid", "aria-haspopup", "aria-expanded", "aria-controls", "aria-activedescendant"]), ref: mergedControlRef }, /* @__PURE__ */ React.createElement("span", { className: labels.length ? void 0 : "ph" }, labels.length ? labels.map((label2, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: index }, index ? /* @__PURE__ */ React.createElement(React.Fragment, null, " ", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "/"), " ") : null, label2)) : ph), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "▾")), open ? floating.render(/* @__PURE__ */ React.createElement("div", { ref: floatingRef, className: "cs-cascader__pop" }, cols.map((col, i) => /* @__PURE__ */ React.createElement("ul", { key: i, role: "listbox", "aria-labelledby": control["aria-labelledby"] || control.id, className: "cs-cascader__col" }, col.map((n) => (
    // role="none" — the <li> wrapper must not sit between listbox and option.
    /* @__PURE__ */ React.createElement("li", { key: n.key, role: "none" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        role: "option",
        "aria-selected": path[i] === n.key,
        className: cx("cs-cascader__opt", path[i] === n.key && "on"),
        "data-cs-focusable": "",
        onClick: () => {
          const next = [...path.slice(0, i), n.key];
          setPath(next);
          if (!(n.children && n.children.length)) {
            onChange && onChange(next);
            setOpen(false);
          }
        }
      },
      n.label,
      n.children && n.children.length ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, " ›") : null
    ))
  )))))) : null, fieldMessages(control, description, error, requiredDescription)));
});
Cascader.displayName = "Cascader";

export {
  Cascader
};
//# sourceMappingURL=chunk-JRIWHAWW.mjs.map
