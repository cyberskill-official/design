"use client";
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

// components/ai/PromptInput.jsx
import React from "react";
var PromptInput = React.forwardRef(function PromptInput2({
  controlRef,
  value,
  onChange,
  onSubmit,
  placeholder,
  sendLabel,
  hint,
  lang,
  disabled = false,
  busy = false,
  className,
  "aria-label": ariaLabel,
  rootProps
}, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [inner, setInner] = React.useState("");
  const val = value != null ? value : inner;
  const setVal = (v) => {
    if (value == null) setInner(v);
    onChange?.(v);
  };
  const submit = () => {
    if (!disabled && !busy && String(val).trim()) onSubmit && onSubmit(val);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("PromptInput", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const sl = sendLabel != null ? sendLabel : t("send");
  const ht = hint !== void 0 ? hint : t("hint");
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-prompt", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "cs-prompt__field",
      rows: 1,
      value: val,
      placeholder: ph,
      "aria-label": ariaLabel || ph,
      disabled,
      onChange: (e) => setVal(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
          e.preventDefault();
          submit();
        }
      },
      ref: mergedControlRef
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "cs-prompt__bar" }, ht || ht === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-prompt__hint" }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" })), ht) : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--primary cs-button--sm", onClick: submit, disabled: disabled || busy }, busy ? /* @__PURE__ */ React.createElement("span", { className: "cs-button__spinner", "aria-hidden": "true" }) : null, sl)));
});
PromptInput.displayName = "PromptInput";

export {
  PromptInput
};
//# sourceMappingURL=chunk-TVTBVHT2.mjs.map
