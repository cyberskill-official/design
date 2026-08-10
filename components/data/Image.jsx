import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill Image — img with loading skeleton, warm fallback on error, optional click-to-preview lightbox. */
export function Image({ src, alt = "", ratio, preview = false, fallback, lang, className, ...props }) {
  const [state, setState] = React.useState("loading");
  const [zoom, setZoom] = React.useState(false);
  const [ref, L] = useLang(lang);
  const t = makeT("Image", L);
  React.useEffect(() => {
    if (!zoom) return;
    const k = (e) => { if (e.key === "Escape") setZoom(false); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [zoom]);
  const openPreview = () => setZoom(true);
  const onPreviewKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPreview();
    }
  };
  const body = state === "error"
    ? <span className="cs-image__fallback">{fallback || <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5-9 9" /></svg>}</span>
    : <img {...props} src={src} alt={alt} onLoad={() => setState("ok")} onError={() => setState("error")} />;
  const canPreview = preview && state === "ok";
  return (
    <>
      <span
        ref={ref}
        className={cx("cs-image", state === "loading" && "is-loading", canPreview && "is-zoomable", className)}
        style={ratio ? { aspectRatio: ratio } : undefined}
        onClick={canPreview ? openPreview : undefined}
        onKeyDown={canPreview ? onPreviewKey : undefined}
        role={canPreview ? "button" : undefined}
        tabIndex={canPreview ? 0 : undefined}
        aria-label={canPreview ? t("preview") + (alt ? ": " + alt : "") : undefined}
      >
        {body}
      </span>
      {zoom ? (
        <span className="cs-image__zoom" role="dialog" aria-label={alt || t("preview")} onClick={() => setZoom(false)}>
          <img src={src} alt={alt} />
          <button type="button" aria-label={t("close")} onClick={() => setZoom(false)}>
            <Icon name="close" size="sm" style={{ verticalAlign: "middle" }} />
          </button>
        </span>
      ) : null}
    </>
  );
}
