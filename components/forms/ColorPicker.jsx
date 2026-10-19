import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
const SWATCHES = ["#F4BA17", "#C77B4A", "#E0632B", "#C43D1F", "#7A9B57", "#3E5A2E", "#4E8E9B", "#2E5E7E", "#BFB29B", "#45210E"];

/** CyberSkill ColorPicker — curated brand swatches + custom hex input. */
export function ColorPicker({ value = "#F4BA17", onChange, swatches = SWATCHES, label, "aria-labelledby": ariaLabelledBy, lang, className }) {
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState(value);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("ColorPicker", L);
  React.useEffect(() => setHex(value), [value]);
  const { scope } = useOverlayLayer({ open, kind: "popover", panelRef: wrap, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => { document.removeEventListener("mousedown", d); };
  }, [open]);
  const commit = (v) => { if (/^#[0-9a-fA-F]{6}$/.test(v)) { onChange && onChange(v); } };
  return (
    <overlayScopeContext.Provider value={scope}>
    <span ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-colorpicker", className)}>
      <button type="button" className="cs-colorpicker__field" aria-label={ariaLabelledBy && !label ? undefined : (label || t("label")) + ": " + value} aria-labelledby={ariaLabelledBy} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <i style={{ background: value }} /><code>{value}</code>
      </button>
      {open ? (
        <span className="cs-colorpicker__pop" role="dialog" aria-label={ariaLabelledBy && !label ? undefined : (label || t("label"))} aria-labelledby={ariaLabelledBy}>
          <span className="cs-colorpicker__grid">
            {swatches.map((s) => (
              <button key={s} type="button" aria-label={s} aria-pressed={s.toLowerCase() === String(value).toLowerCase()} style={{ background: s }} className={s.toLowerCase() === String(value).toLowerCase() ? "on" : undefined}
                onClick={() => { onChange && onChange(s); setOpen(false); }} />
            ))}
          </span>
          <span className="cs-colorpicker__hex">
            <input value={hex} aria-label={t("hex")} onChange={(e) => setHex(e.target.value)}
              onKeyDown={(e) => { if (e.nativeEvent.isComposing || e.keyCode === 229) return; if (e.key === "Enter") { e.preventDefault(); commit(hex); setOpen(false); } }} onBlur={() => commit(hex)} />
          </span>
        </span>
      ) : null}
    </span>
    </overlayScopeContext.Provider>
  );
}
