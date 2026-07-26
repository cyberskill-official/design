import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill TagInput — multi-value token input. Enter/comma adds, Backspace removes last, blur commits. */
export function TagInput({
  id,
  label,
  value,
  defaultValue = [],
  onChange,
  placeholder,
  max,
  disabled = false,
  lang,
  className,
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const tags = value != null ? value : inner;
  const [q, setQ] = React.useState("");
  const set = (arr) => {
    if (value == null) setInner(arr);
    onChange && onChange(arr);
  };
  const add = (s) => {
    s = s.trim();
    if (!s) return;
    if (tags.includes(s)) {
      setQ("");
      return;
    }
    if (max != null && tags.length >= max) return;
    set([...tags, s]);
    setQ("");
  };
  const [ref, L] = useLang(lang);
  const t = makeT("TagInput", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  const gid = React.useId();
  const sid = id ?? gid;
  return (
    <label ref={ref} className={cx("cs-field", disabled && "is-disabled", className)} htmlFor={sid}>
      {label ? <span className="cs-field__label">{label}</span> : null}
      <div className="cs-taginput">
        {tags.map((tag) => (
          <span key={tag} className="cs-tag">
            {tag}
            <button
              type="button"
              className="cs-tag__close"
              aria-label={t("remove") + " " + tag}
              onClick={() => set(tags.filter((x) => x !== tag))}
              disabled={disabled}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>
        ))}
        <input
          id={sid}
          value={q}
          placeholder={tags.length ? "" : ph}
          disabled={disabled}
          aria-label={label ? undefined : ph}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(q);
            } else if (e.key === "Backspace" && !q && tags.length) {
              set(tags.slice(0, -1));
            }
          }}
          onBlur={() => add(q)}
        />
      </div>
    </label>
  );
}
