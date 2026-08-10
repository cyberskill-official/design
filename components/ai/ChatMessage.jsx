import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill ChatMessage — one turn in a Lumi conversation. role "lumi" (genie,
 * Ochre avatar) or "user" (Umber, right-aligned). Pass `avatar` to override.
 */
export function ChatMessage({ role = "lumi", name, avatar, lang, className, children }) {
  const isUser = role === "user";
  const [ref, L] = useLang(lang);
  const t = makeT("ChatMessage", L);
  const you = t("you");
  const defaultAvatar = isUser
    ? <span aria-hidden="true">{you}</span>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /></svg>;
  return (
    <div ref={ref} className={cx("cs-chat-msg", isUser ? "cs-chat-msg--user" : "cs-chat-msg--lumi", className)}>
      <div className="cs-chat-msg__avatar">{avatar ?? defaultAvatar}</div>
      <div className="cs-chat-msg__col">
        <div className="cs-chat-msg__name">{name ?? (isUser ? you : "Lumi")}</div>
        <div className="cs-chat-msg__bubble">{children}</div>
      </div>
    </div>
  );
}
