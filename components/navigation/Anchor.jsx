import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Anchor — in-page table of contents with scrollspy (IntersectionObserver). items: {id,label}. */
export const Anchor = React.forwardRef(function Anchor({ items = [], title, className }, forwardedRef) {
  const [act, setAct] = React.useState(items.length ? items[0].id : null);
  React.useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setAct(vis[0].target.id);
    }, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav ref={forwardedRef} className={cx("cs-anchor", className)} aria-label={typeof title === "string" ? title : undefined}>
      {title ? <div className="cs-anchor__title">{title}</div> : null}
      {items.map((it) => (
        <a key={it.id} href={"#" + it.id} className={cx("cs-anchor__item", act === it.id && "is-active")} aria-current={act === it.id ? "location" : undefined}>{it.label}</a>
      ))}
    </nav>
  );
});
