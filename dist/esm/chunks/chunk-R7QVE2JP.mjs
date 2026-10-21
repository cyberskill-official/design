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

// components/navigation/Steps.jsx
import React from "react";
var Steps = React.forwardRef(function Steps2({ steps = [], current = 0, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Steps", L, localeMessages);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-steps", className) }, rootProps, ["role", "aria-label"]), role: "list", "aria-label": t("label") }, steps.map((s, i) => {
    const state = i < current ? "done" : i === current ? "active" : "todo";
    return /* @__PURE__ */ React.createElement("div", { key: i, className: cx("cs-step", `cs-step--${state}`), role: "listitem", "aria-current": state === "active" ? "step" : void 0 }, /* @__PURE__ */ React.createElement("span", { className: "cs-step__marker" }, state === "done" ? "✓" : s.n ?? i + 1), /* @__PURE__ */ React.createElement("span", { className: "cs-step__title" }, s.title), s.body != null ? /* @__PURE__ */ React.createElement("span", { className: "cs-step__body" }, s.body) : null);
  }));
});
Steps.displayName = "Steps";

export {
  Steps
};
//# sourceMappingURL=chunk-R7QVE2JP.mjs.map
