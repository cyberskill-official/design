import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/**
 * CyberSkill PromptInput — the AI-native ask box. Enter submits (Shift+Enter =
 * newline). Works controlled (value/onChange) or uncontrolled. The localized
 * default hint describes a Lumi-to-human handoff; use it only when the consumer
 * implements that workflow, otherwise supply an accurate hint. Submission
 * invokes the caller callback; model replies and human review are caller-owned.
 */
export const PromptInput = React.forwardRef(function PromptInput({ controlRef,
  value, onChange, onSubmit,
  placeholder,
  sendLabel,
  hint,
  lang,
  disabled = false, busy = false, className,
  "aria-label": ariaLabel,
 rootProps }, forwardedRef) {
  const mergedControlRef = useComposedRefs(controlRef);
  const [inner, setInner] = React.useState("");
  const val = value != null ? value : inner;
  const setVal = (v) => { if (value == null) setInner(v); onChange?.(v); };
  const submit = () => { if (!disabled && !busy && String(val).trim()) onSubmit && onSubmit(val); };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("PromptInput", L, localeMessages);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const sl = sendLabel != null ? sendLabel : t("send");
  const ht = hint !== undefined ? hint : t("hint");
  return (
    <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-prompt", className) }, rootProps, [])}>
      <textarea
        className="cs-prompt__field" rows={1} value={val} placeholder={ph} aria-label={ariaLabel || ph} disabled={disabled}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); submit(); } }}
       ref={mergedControlRef} />
      <div className="cs-prompt__bar">
        {(ht || ht === 0) ? (
          <span className="cs-prompt__hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /></svg>
            {ht}
          </span>
        ) : null}
        <button type="button" className="cs-button cs-button--primary cs-button--sm" onClick={submit} disabled={disabled || busy}>
          {busy ? <span className="cs-button__spinner" aria-hidden="true" /> : null}
          {sl}
        </button>
      </div>
    </div>
  );
});
PromptInput.displayName = "PromptInput";
