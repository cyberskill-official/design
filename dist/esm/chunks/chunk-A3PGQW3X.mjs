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

// components/data/Comment.jsx
import React from "react";
var Comment = React.forwardRef(function Comment2({ avatar, author, meta, children, actions = [], replies, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Comment", L, localeMessages);
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-comment", className) }, rootProps, []) }, avatar || avatar === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-comment__avatar" }, avatar) : null, /* @__PURE__ */ React.createElement("div", { className: "cs-comment__main" }, /* @__PURE__ */ React.createElement("div", { className: "cs-comment__head" }, /* @__PURE__ */ React.createElement("b", null, author), meta || meta === 0 ? /* @__PURE__ */ React.createElement("span", { className: "cs-comment__meta" }, meta) : null), /* @__PURE__ */ React.createElement("div", { className: "cs-comment__body" }, children), /* @__PURE__ */ React.createElement("div", { className: "cs-comment__actions" }, (actions.length ? actions : [{ label: t("reply") }]).map((a, i) => /* @__PURE__ */ React.createElement("button", { key: i, type: "button", onClick: () => a.onSelect && a.onSelect() }, a.label))), replies || replies === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-comment__replies" }, replies) : null));
});
Comment.displayName = "Comment";

export {
  Comment
};
//# sourceMappingURL=chunk-A3PGQW3X.mjs.map
