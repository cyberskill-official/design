"use client";
import {
  Icon
} from "./chunk-JPZKGP54.mjs";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  useClientLayoutEffect
} from "./chunk-CQQ2JOJD.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Image.jsx
import React from "react";
var Image = React.forwardRef(function Image2({ src, alt = "", ratio, preview = false, fallback, lang, className, ...props }, forwardedRef) {
  const [load, setLoad] = React.useState({ src, state: "loading" });
  const imgRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(imgRef, forwardedRef);
  if (load.src !== src) setLoad({ src, state: "loading" });
  const state = load.src === src ? load.state : "loading";
  useClientLayoutEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete || !img.getAttribute("src")) return;
    if (img.naturalWidth > 0) {
      setLoad((cur) => cur.src === src && cur.state === "ok" ? cur : { src, state: "ok" });
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
  const body = state === "error" ? /* @__PURE__ */ React.createElement("span", { className: "cs-image__fallback" }, fallback || fallback === 0 ? fallback : /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "9", r: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M21 15l-5-5-9 9" }))) : /* @__PURE__ */ React.createElement("img", { ...props, ref: mergedNativeRef, key: src, src, alt, onLoad: () => setLoad({ src, state: "ok" }), onError: () => setLoad({ src, state: "error" }) });
  const canPreview = preview && state === "ok";
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "span",
    {
      ref,
      className: cx("cs-image", state === "loading" && "is-loading", canPreview && "is-zoomable", className),
      style: ratio ? { aspectRatio: ratio } : void 0,
      onClick: canPreview ? openPreview : void 0,
      onKeyDown: canPreview ? onPreviewKey : void 0,
      role: canPreview ? "button" : void 0,
      tabIndex: canPreview ? 0 : void 0,
      "aria-label": canPreview ? t("preview") + (alt ? ": " + alt : "") : void 0
    },
    body
  ), previewOpen ? /* @__PURE__ */ React.createElement("span", { ref: panel, tabIndex: -1, className: "cs-image__zoom", role: "dialog", "aria-modal": "true", "aria-label": alt || t("preview"), onClick: () => setZoom(false) }, /* @__PURE__ */ React.createElement("img", { src, alt }), /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": t("close"), onClick: () => setZoom(false) }, /* @__PURE__ */ React.createElement(Icon, { name: "close", size: "sm", style: { verticalAlign: "middle" } }))) : null));
});
Image.displayName = "Image";

export {
  Image
};
//# sourceMappingURL=chunk-W6N22NMF.mjs.map
