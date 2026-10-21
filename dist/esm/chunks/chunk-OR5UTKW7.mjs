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

// components/ai/ChatMessage.jsx
import React from "react";
var ChatMessage = React.forwardRef(function ChatMessage2({ role = "lumi", name, avatar, lang, className, children, rootProps }, forwardedRef) {
  const isUser = role === "user";
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("ChatMessage", L, localeMessages);
  const you = t("you");
  const defaultAvatar = isUser ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, you) : /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }));
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-chat-msg", isUser ? "cs-chat-msg--user" : "cs-chat-msg--lumi", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement("div", { className: "cs-chat-msg__avatar" }, avatar ?? defaultAvatar), /* @__PURE__ */ React.createElement("div", { className: "cs-chat-msg__col" }, /* @__PURE__ */ React.createElement("div", { className: "cs-chat-msg__name" }, name ?? (isUser ? you : "Lumi")), /* @__PURE__ */ React.createElement("div", { className: "cs-chat-msg__bubble" }, children)));
});
ChatMessage.displayName = "ChatMessage";

export {
  ChatMessage
};
//# sourceMappingURL=chunk-OR5UTKW7.mjs.map
