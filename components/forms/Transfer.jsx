import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Transfer — move items between two lists (checkbox select + ⇄ buttons). */
export const Transfer = React.forwardRef(function Transfer({ items = [], value = [], onChange, titles, lang, className }, forwardedRef) {
  const [checked, setChecked] = React.useState([]);
  const [ref, L] = useLang(lang);
  const t = makeT("Transfer", L);
  const tt = titles || [t("source"), t("target")];
  const inTarget = (k) => value.includes(k);
  const toggle = (k) => setChecked((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  const move = (toTarget) => {
    const mv = checked.filter((k) => inTarget(k) !== toTarget);
    if (!mv.length) return;
    onChange && onChange(toTarget ? [...value, ...mv] : value.filter((k) => !mv.includes(k)));
    setChecked([]);
  };
  const List = ({ target }) => (
    <div className="cs-transfer__list">
      <div className="cs-transfer__title">{target ? tt[1] : tt[0]}</div>
      <ul>
        {items.filter((it) => inTarget(it.key) === target).map((it) => (
          <li key={it.key}>
            <label><input type="checkbox" checked={checked.includes(it.key)} onChange={() => toggle(it.key)} /> {it.label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div ref={mergeRefs(ref, forwardedRef)} className={cx("cs-transfer", className)}>
      <List target={false} />
      <div className="cs-transfer__ops">
        <button type="button" className="cs-button cs-button--secondary cs-button--xs" aria-label={t("toTarget")} onClick={() => move(true)}>›</button>
        <button type="button" className="cs-button cs-button--secondary cs-button--xs" aria-label={t("toSource")} onClick={() => move(false)}>‹</button>
      </div>
      <List target={true} />
    </div>
  );
});
