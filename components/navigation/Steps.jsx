import { useComposedRefs } from "../_utils/refs.js";
import { mergeTargetProps } from "../_utils/field-association.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Steps — horizontal progress stepper. Steps before `current` are done, `current` is active. */
export const Steps = React.forwardRef(function Steps({ steps = [], current = 0, lang, className , rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Steps", L, localeMessages);
  return (
    <div ref={mergedNativeRef} {...mergeTargetProps({ "className": cx("cs-steps", className) }, rootProps, ["role","aria-label"])} role="list" aria-label={t("label")}>
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <div key={i} className={cx("cs-step", `cs-step--${state}`)} role="listitem" aria-current={state === "active" ? "step" : undefined}>
            <span className="cs-step__marker">{state === "done" ? "✓" : s.n ?? i + 1}</span>
            <span className="cs-step__title">{s.title}</span>
            {s.body != null ? <span className="cs-step__body">{s.body}</span> : null}
          </div>
        );
      })}
    </div>
  );
});
Steps.displayName = "Steps";
