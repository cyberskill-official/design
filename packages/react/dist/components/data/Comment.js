import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Comment = React.forwardRef(function Comment2({ avatar, author, meta, children, actions = [], replies, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Comment", L);
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-comment", className), children: [
    avatar ? /* @__PURE__ */ jsx("span", { className: "cs-comment__avatar", children: avatar }) : null,
    /* @__PURE__ */ jsxs("div", { className: "cs-comment__main", children: [
      /* @__PURE__ */ jsxs("div", { className: "cs-comment__head", children: [
        /* @__PURE__ */ jsx("b", { children: author }),
        meta ? /* @__PURE__ */ jsx("span", { className: "cs-comment__meta", children: meta }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cs-comment__body", children }),
      /* @__PURE__ */ jsx("div", { className: "cs-comment__actions", children: (actions.length ? actions : [{ label: t("reply") }]).map((a, i) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => a.onSelect && a.onSelect(), children: a.label }, i)) }),
      replies ? /* @__PURE__ */ jsx("div", { className: "cs-comment__replies", children: replies }) : null
    ] })
  ] });
});
export {
  Comment
};
