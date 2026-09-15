import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "../overlays/OverlayManager.jsx";
const Image = React.forwardRef(function Image2({ src, alt = "", ratio, preview = false, fallback, lang, className, ...props }, forwardedRef) {
  const [state, setState] = React.useState("loading");
  const [zoom, setZoom] = React.useState(false);
  const [ref, L] = useLang(lang);
  const t = makeT("Image", L);
  const panel = React.useRef(null);
  const live = React.useRef(null);
  useOverlayLayer({
    open: zoom,
    kind: "modal",
    trapFocus: true,
    onEscape: () => setZoom(false),
    panelRef: panel
  });
  React.useEffect(() => {
    if (!live.current) return;
    live.current.textContent = zoom ? t("previewOpen") : "";
  }, [zoom, t]);
  const openPreview = () => setZoom(true);
  const onPreviewKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPreview();
    }
  };
  const body = state === "error" ? /* @__PURE__ */ jsx("span", { className: "cs-image__fallback", children: fallback || /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M21 15l-5-5-9 9" })
  ] }) }) : /* @__PURE__ */ jsx("img", { ...props, src, alt, onLoad: () => setState("ok"), onError: () => setState("error") });
  const canPreview = preview && state === "ok";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        ref: mergeRefs(ref, forwardedRef),
        className: cx("cs-image", state === "loading" && "is-loading", canPreview && "is-zoomable", className),
        style: ratio ? { aspectRatio: ratio } : void 0,
        onClick: canPreview ? openPreview : void 0,
        onKeyDown: canPreview ? onPreviewKey : void 0,
        role: canPreview ? "button" : void 0,
        tabIndex: canPreview ? 0 : void 0,
        "aria-haspopup": canPreview ? "dialog" : void 0,
        "aria-expanded": canPreview ? zoom : void 0,
        "aria-label": canPreview ? t("preview") + (alt ? ": " + alt : "") : void 0,
        children: body
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "cs-sr-only", "aria-live": "polite", ref: live }),
    zoom ? /* @__PURE__ */ jsxs(
      "span",
      {
        className: "cs-image__zoom",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": alt || t("preview"),
        ref: panel,
        onClick: () => setZoom(false),
        children: [
          /* @__PURE__ */ jsx("img", { src, alt }),
          /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("close"), onClick: (e) => {
            e.stopPropagation();
            setZoom(false);
          }, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: "sm", style: { verticalAlign: "middle" } }) })
        ]
      }
    ) : null
  ] });
});
export {
  Image
};
