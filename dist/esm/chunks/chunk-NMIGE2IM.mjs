"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/data/Splitter.jsx
import React from "react";
var Splitter = React.forwardRef(function Splitter2({ start, end, initial = 50, min = 20, max = 80, height = 240, lang, className, rootProps }, forwardedRef) {
  const clamp = (value) => Math.min(max, Math.max(min, value));
  const [storedPct, setPct] = React.useState(() => clamp(initial));
  const pct = clamp(storedPct);
  const stopDrag = React.useRef(null);
  React.useEffect(() => () => stopDrag.current?.(), [min, max]);
  const wrap = React.useRef(null);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("Splitter", L, localeMessages);
  const drag = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    stopDrag.current?.();
    const pointerId = e.pointerId;
    const grabX = e.clientX;
    const startPct = pct;
    const handle = e.currentTarget;
    const move = (ev) => {
      if (ev.pointerId !== pointerId || !wrap.current) return;
      const available = wrap.current.clientWidth - handle.getBoundingClientRect().width;
      if (available > 0) {
        const distance = (ev.clientX - grabX) * (getComputedStyle(wrap.current).direction === "rtl" ? -1 : 1);
        setPct(clamp(startPct + distance / available * 100));
      }
    };
    const cleanup = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      stopDrag.current = null;
    };
    const up = (ev) => {
      if (ev.pointerId === pointerId) cleanup();
    };
    stopDrag.current = cleanup;
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
  };
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-splitter", className) }, rootProps, []), style: { ...rootProps?.style, ...{ height, display: "grid", gridTemplateColumns: `minmax(0, ${pct}fr) auto minmax(0, ${100 - pct}fr)` } } }, /* @__PURE__ */ React.createElement("div", { className: "cs-splitter__pane" }, start), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "cs-splitter__bar",
      role: "separator",
      "aria-orientation": "vertical",
      "aria-label": t("label"),
      "aria-valuenow": pct,
      "aria-valuemin": min,
      "aria-valuemax": max,
      tabIndex: 0,
      onPointerDown: drag,
      onKeyDown: (e) => {
        if (e.nativeEvent.isComposing || e.keyCode === 229 || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
        e.preventDefault();
        const rtl = getComputedStyle(wrap.current).direction === "rtl";
        const delta = (e.key === "ArrowRight" ? 2 : -2) * (rtl ? -1 : 1);
        setPct((p) => clamp(clamp(p) + delta));
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "cs-splitter__pane" }, end));
});
Splitter.displayName = "Splitter";

export {
  Splitter
};
//# sourceMappingURL=chunk-NMIGE2IM.mjs.map
