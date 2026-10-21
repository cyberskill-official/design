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

// components/forms/Mentions.jsx
import React from "react";
var Mentions = React.forwardRef(function Mentions2({ portal = true, placement, value, defaultValue = "", onChange, users = [], placeholder, rows = 3, lang, className, "aria-label": ariaLabel, rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const set = (v) => {
    if (value == null) setInner(v);
    onChange && onChange(v);
  };
  const [q, setQ] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const caretRef = React.useRef(null);
  const listId = React.useId();
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Mentions", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const hits = q == null ? [] : users.filter((u) => u.toLowerCase().includes(q)).slice(0, 6);
  const open = hits.length > 0;
  const floating = useFloatingPanel({ open, anchorRef: ref, panelRef: floatingRef, portal, placement: placement ?? "bottom-start", gap: 0, getAnchor: () => ref.current?.querySelector(":scope > textarea"), lang });
  const { scope } = useOverlayLayer({ open: open && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, restoreFocus: false, onEscape: () => setQ(null) });
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (!floating.contains(e.target)) setQ(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  React.useEffect(() => {
    setActiveIndex((i) => hits.length ? Math.min(i, hits.length - 1) : 0);
  }, [q, users]);
  const onInput = (e) => {
    const v = e.target.value;
    set(v);
    const caret = typeof e.target.selectionStart === "number" ? e.target.selectionStart : v.length;
    caretRef.current = caret;
    const head = v.slice(0, caret);
    const m = /(^|\s)@(\w*)$/.exec(head);
    const next = m ? m[2].toLowerCase() : null;
    setQ(next);
    if (next != null) setActiveIndex(0);
  };
  const pick = (u) => {
    const caret = typeof caretRef.current === "number" ? caretRef.current : val.length;
    const head = val.slice(0, caret);
    const tail = val.slice(caret);
    set(head.replace(/(^|\s)@\w*$/, "$1@" + u + " ") + tail);
    setQ(null);
  };
  const optionId = (i) => listId + "-opt-" + i;
  const onKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(hits.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      if (hits[activeIndex]) {
        e.preventDefault();
        pick(hits[activeIndex]);
      }
    }
  };
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement(
    "span",
    {
      ref,
      ...mergeTargetProps({ "className": cx("cs-mentions", className), "onBlur": (e) => {
        if (!floating.contains(e.relatedTarget)) setQ(null);
      } }, rootProps, [])
    },
    /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "cs-field__control",
        rows,
        value: val,
        placeholder: ph,
        "aria-label": ariaLabel || ph,
        "aria-autocomplete": "list",
        "aria-haspopup": "listbox",
        "aria-controls": open ? listId : void 0,
        "aria-activedescendant": open && hits[activeIndex] ? optionId(activeIndex) : void 0,
        onChange: onInput,
        onKeyDown,
        ref: mergedNativeRef
      }
    ),
    open ? floating.render(/* @__PURE__ */ React.createElement("span", { ref: floatingRef, className: "cs-mentions__pop", role: "listbox", id: listId }, hits.map((u, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: u,
        type: "button",
        id: optionId(i),
        role: "option",
        tabIndex: -1,
        "aria-selected": i === activeIndex,
        className: cx(i === activeIndex && "hl"),
        onMouseEnter: () => setActiveIndex(i),
        onMouseDown: (e) => {
          e.preventDefault();
          pick(u);
        }
      },
      "@",
      u
    )))) : null
  ));
});
Mentions.displayName = "Mentions";

export {
  Mentions
};
//# sourceMappingURL=chunk-5MR3C2QG.mjs.map
