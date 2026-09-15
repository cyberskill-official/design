import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Steps = React.forwardRef(function Steps2({ steps = [], current = 0, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Steps", L);
  return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-steps", className), role: "list", "aria-label": t("label"), children: steps.map((s, i) => {
    const state = i < current ? "done" : i === current ? "active" : "todo";
    return /* @__PURE__ */ jsxs("div", { className: cx("cs-step", `cs-step--${state}`), role: "listitem", children: [
      /* @__PURE__ */ jsx("span", { className: "cs-step__marker", children: state === "done" ? "\u2713" : s.n || i + 1 }),
      /* @__PURE__ */ jsx("span", { className: "cs-step__title", children: s.title }),
      s.body ? /* @__PURE__ */ jsx("span", { className: "cs-step__body", children: s.body }) : null
    ] }, i);
  }) });
});
export {
  Steps
};
