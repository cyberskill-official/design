import { jsx } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const InputOTP = React.forwardRef(function InputOTP2({ length = 6, value, onChange, onComplete, label, lang, disabled = false, className }, forwardedRef) {
  const [inner, setInner] = React.useState("");
  const val = (value != null ? value : inner).slice(0, length);
  const boxes = React.useRef([]);
  const set = (v) => {
    v = v.replace(/\D/g, "").slice(0, length);
    if (value == null) setInner(v);
    onChange && onChange(v);
    if (v.length === length && onComplete) onComplete(v);
  };
  const [ref, L] = useLang(lang);
  const lbl = label != null ? label : makeT("InputOTP", L)("label");
  return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-otp", className), role: "group", "aria-label": lbl, children: Array.from({ length }).map((_, i) => /* @__PURE__ */ jsx(
    "input",
    {
      ref: (el) => boxes.current[i] = el,
      inputMode: "numeric",
      pattern: "[0-9]*",
      maxLength: 1,
      disabled,
      value: val[i] || "",
      "aria-label": lbl + " " + (i + 1) + "/" + length,
      onChange: (e) => {
        const c = e.target.value.replace(/\D/g, "");
        if (!c) return;
        set(val.slice(0, i) + c + val.slice(i + 1));
        const nb = boxes.current[i + 1];
        if (nb) nb.focus();
      },
      onKeyDown: (e) => {
        if (e.key !== "Backspace") return;
        e.preventDefault();
        const arr = val.split("");
        if (arr[i]) arr.splice(i, 1);
        else if (i > 0) arr.splice(i - 1, 1);
        set(arr.join(""));
        const pb = boxes.current[Math.max(0, i - 1)];
        if (pb) pb.focus();
      },
      onPaste: (e) => {
        e.preventDefault();
        const p = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, length);
        set(p);
        const nb = boxes.current[Math.min(length - 1, p.length)];
        if (nb) nb.focus();
      }
    },
    i
  )) });
});
export {
  InputOTP
};
