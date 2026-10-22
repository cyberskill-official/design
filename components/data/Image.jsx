import { useComposedRefs } from "../_utils/refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";
import { useClientLayoutEffect } from "../_utils/use-client-layout-effect.js";

/** CyberSkill Image — img with loading skeleton, warm fallback on error, optional click-to-preview lightbox. */
export const Image = React.forwardRef(function Image({ src, alt = "", ratio, preview = false, fallback, lang, className, ...props }, forwardedRef) {
  const [load, setLoad] = React.useState({ src, state: "loading" });
  const imgRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(imgRef, forwardedRef);
  // Reset during render so revisiting a source cannot revive its old error state.
  if (load.src !== src) setLoad({ src, state: "loading" });
  const state = load.src === src ? load.state : "loading";
  useClientLayoutEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete || !img.getAttribute("src")) return;
    if (img.naturalWidth > 0) {
      setLoad((cur) => (cur.src === src && cur.state === "ok" ? cur : { src, state: "ok" }));
    }
  }, [src]);
  const [zoom, setZoom] = React.useState(false);
  React.useEffect(() => setZoom(false), [src, preview]);
  const previewOpen = zoom && preview && state === "ok";
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Image", L, localeMessages);
  const panel = React.useRef(null);
  const { scope } = useOverlayLayer({ open: previewOpen, kind: "modal", trapFocus: true, panelRef: panel, onEscape: () => setZoom(false) });
  const openPreview = () => setZoom(true);
  const onPreviewKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPreview();
    }
  };
  const body = state === "error"
    ? <span className="cs-image__fallback">{(fallback || fallback === 0) ? fallback : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5-9 9" /></svg>}</span>
    : <img {...props} ref={mergedNativeRef} key={src} src={src} alt={alt} onLoad={() => setLoad({ src, state: "ok" })} onError={() => setLoad({ src, state: "error" })} />;
  const canPreview = preview && state === "ok";
  return (
    <overlayScopeContext.Provider value={scope}>
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
      {previewOpen ? (
        <span ref={panel} tabIndex={-1} className="cs-image__zoom" role="dialog" aria-modal="true" aria-label={alt || t("preview")} onClick={() => setZoom(false)}>
          <img src={src} alt={alt} />
          <button type="button" aria-label={t("close")} onClick={() => setZoom(false)}>
            <Icon name="close" size="sm" style={{ verticalAlign: "middle" }} />
          </button>
        </span>
      ) : null}
    </>
    </overlayScopeContext.Provider>
  );
});
Image.displayName = "Image";
