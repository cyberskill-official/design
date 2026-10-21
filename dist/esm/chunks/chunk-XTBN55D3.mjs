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

// components/data/CodeBlock.jsx
import React from "react";
var CodeBlock = React.forwardRef(function CodeBlock2({ code = "", filename, language, showBar = true, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("CodeBlock", L, localeMessages);
  const [copied, setCopied] = React.useState(false);
  const attempt = React.useRef(0);
  const timer = React.useRef(null);
  React.useEffect(() => {
    setCopied(false);
    return () => {
      attempt.current++;
      clearTimeout(timer.current);
    };
  }, [code]);
  const copy = async () => {
    const current = ++attempt.current;
    clearTimeout(timer.current);
    setCopied(false);
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(code);
      if (current !== attempt.current) return;
      setCopied(true);
      timer.current = setTimeout(() => {
        if (current === attempt.current) setCopied(false);
      }, 1400);
    } catch {
    }
  };
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-code", className) }, rootProps, []) }, showBar ? /* @__PURE__ */ React.createElement("div", { className: "cs-code__bar" }, /* @__PURE__ */ React.createElement("span", null, filename || (language === void 0 ? t("code") : language)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-code__copy", onClick: copy }, copied ? t("copied") : t("copy"))) : null, /* @__PURE__ */ React.createElement("pre", null, /* @__PURE__ */ React.createElement("code", null, code)));
});
CodeBlock.displayName = "CodeBlock";

export {
  CodeBlock
};
//# sourceMappingURL=chunk-XTBN55D3.mjs.map
