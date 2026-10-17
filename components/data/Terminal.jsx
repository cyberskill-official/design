import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

const hasOutput = value => value != null && typeof value !== "boolean" && value !== "";

/** CyberSkill Terminal — command console: history + prompt input; onCommand returns output (string or lines). */
export function Terminal({ title, welcome, onCommand, prompt = "➜", lang, className }) {
  const [hist, setHist] = React.useState(() => (hasOutput(welcome) ? [{ out: welcome }] : []));
  const [q, setQ] = React.useState("");
  const [ref, L] = useLang(lang);
  const t = makeT("Terminal", L);
  const barTitle = title ?? t("title");
  const run = () => {
    if (!q.trim()) return;
    const res = onCommand ? onCommand(q.trim()) : "";
    setHist((h) => [...h, { cmd: q }, ...(hasOutput(res) ? [{ out: res }] : [])]);
    setQ("");
  };
  return (
    <div ref={ref} className={cx("cs-terminal", className)}>
      <div className="cs-terminal__bar"><i /><i /><i /><span>{barTitle}</span></div>
      <div className="cs-terminal__body">
        {hist.map((l, i) => l.cmd != null
          ? <div key={i} className="cs-terminal__line"><span className="p">{prompt}</span> {l.cmd}</div>
          : <div key={i} className="cs-terminal__out">{l.out}</div>)}
        <div className="cs-terminal__line">
          <span className="p">{prompt}</span>
          <input value={q} aria-label={t("input")} spellCheck={false}
            onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => {
              if (e.nativeEvent.isComposing || e.keyCode === 229) return;
              if (e.key === "Enter") { e.preventDefault(); run(); }
            }} />
        </div>
      </div>
    </div>
  );
}
