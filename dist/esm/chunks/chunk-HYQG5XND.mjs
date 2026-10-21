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

// components/forms/InlineEdit.jsx
import React from "react";
var PEN = /* @__PURE__ */ React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z" }));
var InlineEdit = React.forwardRef(function InlineEdit2({ controlRef, value, defaultValue = "", onChange, label, lang, className, rootProps }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const [edit, setEdit] = React.useState(false);
  const [draft, setDraft] = React.useState(val);
  const cancellingRef = React.useRef(false);
  const commit = () => {
    if (cancellingRef.current) {
      cancellingRef.current = false;
      return;
    }
    setEdit(false);
    if (draft !== val) {
      if (value == null) setInner(draft);
      onChange && onChange(draft);
    }
  };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("InlineEdit", L, localeMessages);
  const { scope } = useOverlayLayer({ open: edit, kind: "popover", panelRef: ref, restoreFocus: false, onEscape: () => {
    cancellingRef.current = true;
    setDraft(val);
    setEdit(false);
    requestAnimationFrame(() => ref.current?.querySelector("button")?.focus());
  } });
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("span", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-inline-edit", className) }, rootProps, []) }, edit ? /* @__PURE__ */ React.createElement(
    "input",
    {
      autoFocus: true,
      value: draft,
      "aria-label": label || t("edit"),
      onChange: (e) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => {
        if (!e.nativeEvent.isComposing && e.keyCode !== 229 && e.key === "Enter") commit();
      },
      ref: mergedControlRef
    }
  ) : /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-inline-edit__view", "aria-label": t("edit") + (label ? ": " + label : ""), onClick: () => {
    cancellingRef.current = false;
    setDraft(val);
    setEdit(true);
  } }, /* @__PURE__ */ React.createElement("span", { className: val ? void 0 : "ph" }, val || t("empty")), PEN)));
});
InlineEdit.displayName = "InlineEdit";

export {
  InlineEdit
};
//# sourceMappingURL=chunk-HYQG5XND.mjs.map
