import React from "react";
import { cx } from "../_utils/cx.js";
import { makeT, useLang } from "../_i18n/i18n.js";

/** CyberSkill CitationList — numbered provenance sources for AI output. Rows link out when href is set. */
export function CitationList({ label, items = [], lang, className }) {
  const [ref, L] = useLang(lang);
  const heading = label !== undefined ? label : makeT("CitationList", L)("sources");
  return (
    <div ref={ref} className={cx("cs-citations", className)}>
      {(heading || heading === 0) ? <div className="cs-citations__label">{heading}</div> : null}
      {items.map((it, i) => {
        const inner = (
          <>
            <span className="cs-citation__num">{i + 1}</span>
            <span className="cs-citation__text">{it.title}{(it.source || it.source === 0) ? <span className="cs-citation__src"> · {it.source}</span> : null}</span>
          </>
        );
        return it.href
          ? <a key={i} className="cs-citation" href={it.href} target="_blank" rel="noreferrer">{inner}</a>
          : <div key={i} className="cs-citation">{inner}</div>;
      })}
    </div>
  );
}
