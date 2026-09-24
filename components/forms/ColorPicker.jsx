import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const SWATCHES = ["#F4BA17", "#C77B4A", "#E0632B", "#C43D1F", "#7A9B57", "#3E5A2E", "#4E8E9B", "#2E5E7E", "#BFB29B", "#45210E"];

/** CyberSkill ColorPicker — curated brand swatches + custom hex input. */
export const ColorPicker = React.forwardRef(function ColorPicker({ value = "#F4BA17", onChange, swatches = SWATCHES, label, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState(value);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("ColorPicker", L);
  React.useEffect(() => setHex(value), [value]);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  const commit = (v) => { if (/^#[0-9a-fA-F]{6}$/.test(v)) { onChange && onChange(v); } };
  return (
    <span ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-colorpicker", className)}>
      <button type="button" className="cs-colorpicker__field" aria-label={(label || t("label")) + ": " + value} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <i style={{ background: value }} /><code>{value}</code>
      </button>
      {open ? (
        <span className="cs-colorpicker__pop" role="dialog" aria-label={label || t("label")}>
          <span className="cs-colorpicker__grid">
            {swatches.map((s) => (
              <button key={s} type="button" aria-label={s} aria-pressed={s.toLowerCase() === String(value).toLowerCase()} style={{ background: s }} className={s.toLowerCase() === String(value).toLowerCase() ? "on" : undefined}
                onClick={() => { onChange && onChange(s); setOpen(false); }} />
            ))}
          </span>
          <span className="cs-colorpicker__hex">
            <input value={hex} aria-label={t("hex")} onChange={(e) => setHex(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { commit(hex); setOpen(false); } }} onBlur={() => commit(hex)} />
          </span>
        </span>
      ) : null}
    </span>
  );
});
