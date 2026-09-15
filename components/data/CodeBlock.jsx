import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill CodeBlock — dark mono code panel with a filename bar + copy button. */
export const CodeBlock = React.forwardRef(function CodeBlock({ code = "", filename, language = "code", showBar = true, className }, forwardedRef) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch (e) { /* no-op */ }
  };
  return (
    <div ref={forwardedRef} className={cx("cs-code", className)}>
      {showBar ? (
        <div className="cs-code__bar">
          <span>{filename || language}</span>
          <button type="button" className="cs-code__copy" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
        </div>
      ) : null}
      <pre><code>{code}</code></pre>
    </div>
  );
});
