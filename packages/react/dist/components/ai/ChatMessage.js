import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const ChatMessage = React.forwardRef(function ChatMessage2({ role = "lumi", name, avatar, lang, className, children }, forwardedRef) {
  const isUser = role === "user";
  const [ref, L] = useLang(lang);
  const t = makeT("ChatMessage", L);
  const you = t("you");
  const defaultAvatar = isUser ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: you }) : /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }) });
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-chat-msg", isUser ? "cs-chat-msg--user" : "cs-chat-msg--lumi", className), children: [
    /* @__PURE__ */ jsx("div", { className: "cs-chat-msg__avatar", children: avatar ?? defaultAvatar }),
    /* @__PURE__ */ jsxs("div", { className: "cs-chat-msg__col", children: [
      /* @__PURE__ */ jsx("div", { className: "cs-chat-msg__name", children: name ?? (isUser ? you : "Lumi") }),
      /* @__PURE__ */ jsx("div", { className: "cs-chat-msg__bubble", children })
    ] })
  ] });
});
export {
  ChatMessage
};
