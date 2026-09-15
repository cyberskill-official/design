import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Comment — discussion entry: avatar, author, meta, body, actions, nested replies. */
export const Comment = React.forwardRef(function Comment({ avatar, author, meta, children, actions = [], replies, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Comment", L);
  return (
    <div ref={mergeRefs(ref, forwardedRef)} className={cx("cs-comment", className)}>
      {avatar ? <span className="cs-comment__avatar">{avatar}</span> : null}
      <div className="cs-comment__main">
        <div className="cs-comment__head"><b>{author}</b>{meta ? <span className="cs-comment__meta">{meta}</span> : null}</div>
        <div className="cs-comment__body">{children}</div>
        <div className="cs-comment__actions">
          {(actions.length ? actions : [{ label: t("reply") }]).map((a, i) => (
            <button key={i} type="button" onClick={() => a.onSelect && a.onSelect()}>{a.label}</button>
          ))}
        </div>
        {replies ? <div className="cs-comment__replies">{replies}</div> : null}
      </div>
    </div>
  );
});
