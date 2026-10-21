"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/SearchField.jsx
import React from "react";
var SearchField = React.forwardRef(function SearchField2({ value, defaultValue = "", onChange, onClear, disabled = false, readOnly = false, placeholder, lang, className, children, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const [inner, setInner] = React.useState(() => defaultValue == null ? "" : String(defaultValue));
  const val = value != null ? value : inner;
  const set = (v) => {
    if (disabled || readOnly) return;
    if (value == null) setInner(v);
    onChange?.(v);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("SearchField", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  return /* @__PURE__ */ React.createElement("div", { ref, className: cx("cs-search", className) }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "M21 21l-4.3-4.3" })), /* @__PURE__ */ React.createElement("input", { "aria-label": props["aria-label"] || (props["aria-labelledby"] ? void 0 : ph), ...props, type: "text", role: "searchbox", value: val, disabled, readOnly, placeholder: ph, onChange: (e) => set(e.target.value), ref: mergedNativeRef }), String(val).length ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-search__clear", "aria-label": t("clear"), disabled: disabled || readOnly, onClick: () => {
    if (disabled || readOnly) return;
    set("");
    onClear && onClear();
  } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" }))) : null);
});
SearchField.displayName = "SearchField";

export {
  SearchField
};
//# sourceMappingURL=chunk-W2RF4NWB.mjs.map
