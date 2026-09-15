import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill CitationList — numbered provenance sources for AI output. Rows link out when href is set. */
export const CitationList = React.forwardRef(function CitationList({ label = "Sources", items = [], className }, forwardedRef) {
  return (
    <div ref={forwardedRef} className={cx("cs-citations", className)}>
      {label ? <div className="cs-citations__label">{label}</div> : null}
      {items.map((it, i) => {
        const inner = (
          <>
            <span className="cs-citation__num">{i + 1}</span>
            <span className="cs-citation__text">{it.title}{it.source ? <span className="cs-citation__src"> · {it.source}</span> : null}</span>
          </>
        );
        return it.href
          ? <a key={i} className="cs-citation" href={it.href} target="_blank" rel="noreferrer">{inner}</a>
          : <div key={i} className="cs-citation">{inner}</div>;
      })}
    </div>
  );
});
