import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill FloatingActionButton — round primary action; optional speed-dial actions. */
export const FloatingActionButton = React.forwardRef(function FloatingActionButton({ icon, label, actions = [], onClick, position = "fixed", className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const main = () => { if (actions.length) setOpen((o) => !o); else onClick && onClick(); };
  return (
    <div ref={forwardedRef} className={cx("cs-fab", position === "static" && "cs-fab--static", className)}>
      {open && actions.length ? (
        <div className="cs-fab__dial">
          {actions.map((a, i) => (
            <button key={i} type="button" className="cs-fab__mini" aria-label={a.label} title={a.label} onClick={() => { setOpen(false); a.onSelect && a.onSelect(); }}>{a.icon}</button>
          ))}
        </div>
      ) : null}
      <button type="button" className="cs-fab__main" aria-label={label} aria-expanded={actions.length ? open : undefined} onClick={main}>{icon}</button>
    </div>
  );
});
