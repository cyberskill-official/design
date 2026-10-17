import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill CodeBlock — dark mono code panel with a filename bar + copy button. */
export function CodeBlock({ code = "", filename, language, showBar = true, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("CodeBlock", L);
  const [copied, setCopied] = React.useState(false);
  const attempt = React.useRef(0);
  const timer = React.useRef(null);
  React.useEffect(() => {
    setCopied(false);
    return () => { attempt.current++; clearTimeout(timer.current); };
  }, [code]);
  const copy = async () => {
    const current = ++attempt.current;
    clearTimeout(timer.current);
    setCopied(false);
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(code);
      if (current !== attempt.current) return;
      setCopied(true);
      timer.current = setTimeout(() => { if (current === attempt.current) setCopied(false); }, 1400);
    } catch { /* Failed or unavailable clipboard writes must not announce success. */ }
  };
  return (
    <div ref={ref} className={cx("cs-code", className)}>
      {showBar ? (
        <div className="cs-code__bar">
          <span>{filename || (language === undefined ? t("code") : language)}</span>
          <button type="button" className="cs-code__copy" onClick={copy}>{copied ? t("copied") : t("copy")}</button>
        </div>
      ) : null}
      <pre><code>{code}</code></pre>
    </div>
  );
}
