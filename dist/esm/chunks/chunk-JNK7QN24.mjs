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

// components/navigation/BackTop.jsx
import React from "react";
var BackTop = React.forwardRef(function BackTop2({ threshold = 320, label, lang, className, rootProps }, forwardedRef) {
  const [show, setShow] = React.useState(false);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const lbl = label != null ? label : makeT("BackTop", L, localeMessages)("label");
  React.useEffect(() => {
    const on = () => setShow(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  if (!show) return /* @__PURE__ */ React.createElement("span", { ref, style: { display: "none" } });
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ref: mergedNativeRef,
      type: "button",
      ...mergeTargetProps({ "className": cx("cs-backtop", className), "onClick": () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }) }, rootProps, ["type", "aria-label"]),
      "aria-label": lbl
    },
    /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 19V5M5 12l7-7 7 7" }))
  );
});
BackTop.displayName = "BackTop";

export {
  BackTop
};
//# sourceMappingURL=chunk-JNK7QN24.mjs.map
