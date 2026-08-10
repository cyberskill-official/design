import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Steps — horizontal progress stepper. Steps before `current` are done, `current` is active. */
export function Steps({ steps = [], current = 0, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Steps", L);
  return (
    <div ref={ref} className={cx("cs-steps", className)} role="list" aria-label={t("label")}>
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <div key={i} className={cx("cs-step", `cs-step--${state}`)} role="listitem">
            <span className="cs-step__marker">{state === "done" ? "✓" : s.n || i + 1}</span>
            <span className="cs-step__title">{s.title}</span>
            {s.body ? <span className="cs-step__body">{s.body}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
