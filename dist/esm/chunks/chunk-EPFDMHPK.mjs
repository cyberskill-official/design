"use client";
import {
  renderCount
} from "./chunk-5MIGZVWB.mjs";
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

// components/forms/Rating.jsx
import React from "react";
var STAR = "M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z";
var Rating = React.forwardRef(function Rating2({ value, defaultValue = 0, onChange, max: requestedMax = 5, readOnly = false, label, lang, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const max = renderCount(requestedMax, 5);
  const [inner, setInner] = React.useState(defaultValue);
  const val = value != null ? value : inner;
  const commit = (n) => {
    if (readOnly) return;
    if (value == null) setInner(n);
    onChange && onChange(n);
  };
  const set = (n) => commit(n === val ? 0 : n);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("Rating", L, localeMessages)("label");
  const group = mergeTargetProps(mergeTargetProps({}, rootProps, ["role", "name", "value", "required"]), controlProps, ["role", "name", "value", "required"]);
  const requiredDescription = void 0;
  const control = useFieldAssociation(
    {
      id: group.id ?? id,
      "aria-label": group["aria-label"] ?? (group["aria-labelledby"] ? void 0 : label ? label + ": " + val + " / " + max : void 0),
      "aria-labelledby": group["aria-labelledby"],
      "aria-describedby": group["aria-describedby"],
      "aria-invalid": group["aria-invalid"],
      "aria-required": group["aria-required"]
    },
    { fallbackLabel: lbl + ": " + val + " / " + max, description, error, required, requiredSupported: true, requiredDescription }
  );
  const refs = React.useRef([]);
  const focusIdx = val > 0 ? Math.min(max, val) - 1 : 0;
  const move = (from, delta) => {
    if (readOnly) return;
    const next = Math.max(0, Math.min(max - 1, from + delta));
    commit(next + 1);
    const b = refs.current[next];
    if (b) b.focus();
  };
  const onKeyDown = (e, i) => {
    if (readOnly || e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      move(i, 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      move(i, -1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(i, -i);
    } else if (e.key === "End") {
      e.preventDefault();
      move(i, max - 1 - i);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { ...group, ...control, ref: mergedNativeRef, className: cx("cs-rating", className, group.className), role: "radiogroup", "data-readonly": readOnly ? "true" : void 0 }, Array.from({ length: max }).map((_, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      type: "button",
      role: "radio",
      "aria-checked": i + 1 === val,
      "aria-label": i + 1 + " / " + max,
      className: i < val ? "on" : void 0,
      onClick: () => set(i + 1),
      tabIndex: readOnly ? -1 : i === focusIdx ? 0 : -1,
      ref: (el) => {
        refs.current[i] = el;
      },
      onKeyDown: (e) => onKeyDown(e, i)
    },
    /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: i < val ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: STAR }))
  ))), fieldMessages(control, description, error, requiredDescription));
});
Rating.displayName = "Rating";

export {
  Rating
};
//# sourceMappingURL=chunk-EPFDMHPK.mjs.map
