import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Breadcrumb — hierarchical trail; last item is current. */
export const Breadcrumb = React.forwardRef(function Breadcrumb({ items = [], lang, className, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  return (
    <nav ref={mergeRefs(ref, forwardedRef)} aria-label={makeT("Breadcrumb", L)("label")} {...props}>
      <ol className={cx("cs-breadcrumb", className)}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last
                ? <span className="cs-breadcrumb__current" aria-current="page">{it.label}</span>
                : <><a href={it.href || "#"}>{it.label}</a><span className="cs-breadcrumb__sep" aria-hidden="true">/</span></>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
