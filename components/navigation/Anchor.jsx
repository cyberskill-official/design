import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Anchor — in-page table of contents with scrollspy (IntersectionObserver). items: {id,label}. */
export function Anchor({ items = [], title, className, ...props }) {
  const titleId = React.useId();
  const hasTitle = Boolean(title) || title === 0;
  const [act, setAct] = React.useState(items.length ? items[0].id : null);
  React.useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;
    const visible = new Set();
    const io = new IntersectionObserver((es) => {
      for (const entry of es) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      const vis = [...visible].filter(el => el.isConnected).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      if (vis[0]) setAct(vis[0].id);
    }, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className={cx("cs-anchor", className)} aria-labelledby={hasTitle ? titleId : undefined} {...props}>
      {hasTitle ? <div id={titleId} className="cs-anchor__title">{title}</div> : null}
      {items.map((it) => (
        <a key={it.id} href={"#" + it.id} className={cx("cs-anchor__item", act === it.id && "is-active")} aria-current={act === it.id ? "location" : undefined}>{it.label}</a>
      ))}
    </nav>
  );
}
