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

// components/forms/InputOTP.jsx
import React from "react";
var InputOTP = React.forwardRef(function InputOTP2({ length: requestedLength = 6, value, onChange, onComplete, label, lang, disabled = false, className, id, description, error, required = false, rootProps, controlProps }, forwardedRef) {
  const length = renderCount(requestedLength, 6);
  const [inner, setInner] = React.useState("");
  const val = (value != null ? value : inner).slice(0, length);
  const boxes = React.useRef([]);
  const set = (v) => {
    if (disabled) return;
    v = v.replace(/\D/g, "").slice(0, length);
    if (value == null) setInner(v);
    onChange && onChange(v);
    if (v.length === length && onComplete) onComplete(v);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("InputOTP", L, localeMessages)("label");
  const group = mergeTargetProps(mergeTargetProps({}, rootProps, ["role", "name", "value", "required", "aria-required"]), controlProps, ["role", "name", "value", "required", "aria-required"]);
  const requiredDescription = required ? makeT("Form", L, localeMessages)("required") : void 0;
  const control = useFieldAssociation(
    {
      id: group.id ?? id,
      "aria-label": group["aria-label"] ?? (group["aria-labelledby"] ? void 0 : label),
      "aria-labelledby": group["aria-labelledby"],
      "aria-describedby": group["aria-describedby"],
      "aria-invalid": group["aria-invalid"]
    },
    { fallbackLabel: lbl, description, error, required, requiredSupported: false, requiredDescription }
  );
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { ...group, ...control, ref: mergedNativeRef, className: cx("cs-otp", className, group.className), role: "group" }, Array.from({ length }).map((_, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement("span", { id: control.id + "-digit-" + (i + 1), style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" } }, i + 1 + "/" + length), /* @__PURE__ */ React.createElement(
    "input",
    {
      "aria-labelledby": control["aria-labelledby"] ? control["aria-labelledby"] + " " + control.id + "-digit-" + (i + 1) : void 0,
      id: control.id + "-" + (i + 1),
      "aria-describedby": control["aria-describedby"],
      "aria-invalid": control["aria-invalid"],
      ref: (el) => boxes.current[i] = el,
      inputMode: "numeric",
      pattern: "[0-9]*",
      maxLength: 1,
      disabled,
      value: val[i] || "",
      "aria-label": (control["aria-label"] || lbl) + " " + (i + 1) + "/" + length,
      onChange: (e) => {
        if (e.target.value === "") {
          set(val.slice(0, i) + val.slice(i + 1));
          return;
        }
        const c = e.target.value.replace(/\D/g, "");
        if (!c) return;
        set(val.slice(0, i) + c + val.slice(i + 1));
        const nb = boxes.current[i + 1];
        if (nb) nb.focus();
      },
      onKeyDown: (e) => {
        if (e.nativeEvent.isComposing || e.keyCode === 229 || e.key !== "Backspace") return;
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
    }
  )))), fieldMessages(control, description, error, requiredDescription));
});
InputOTP.displayName = "InputOTP";

export {
  InputOTP
};
//# sourceMappingURL=chunk-JKKJHQVQ.mjs.map
