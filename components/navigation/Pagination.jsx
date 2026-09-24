import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

function pages(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const out = [1];
  const lo = Math.max(2, page - 1), hi = Math.min(count - 1, page + 1);
  if (lo > 2) out.push("…");
  for (let p = lo; p <= hi; p++) out.push(p);
  if (hi < count - 1) out.push("…");
  out.push(count);
  return out;
}

/** CyberSkill Pagination — page controls with prev/next and ellipsis. */
export const Pagination = React.forwardRef(function Pagination({ page = 1, pageCount = 1, onChange, lang, className, ...props }, forwardedRef) {
  const go = (p) => onChange && p >= 1 && p <= pageCount && p !== page && onChange(p);
  const [ref, L] = useLang(lang);
  const t = makeT("Pagination", L);
  return (
    <nav ref={mergeRefs(ref, forwardedRef)} aria-label={t("label")} className={cx("cs-pagination", className)} {...props}>
      <button type="button" onClick={() => go(page - 1)} disabled={page <= 1} aria-label={t("prev")}>‹</button>
      {pages(page, pageCount).map((p, i) =>
        p === "…"
          ? <span key={"e" + i} className="cs-pagination__ellipsis" aria-hidden="true">…</span>
          : <button key={p} type="button" aria-current={p === page ? "page" : undefined} onClick={() => go(p)}>{p}</button>
      )}
      <button type="button" onClick={() => go(page + 1)} disabled={page >= pageCount} aria-label={t("next")}>›</button>
    </nav>
  );
});
