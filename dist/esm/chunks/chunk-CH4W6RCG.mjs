"use client";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
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

// components/overlays/Tour.jsx
import React from "react";
var Tour = React.forwardRef(function Tour2({ steps = [], open, onClose, lang, className, rootProps }, forwardedRef) {
  const [storedIndex, setI] = React.useState(0);
  const i = Math.max(0, Math.min(storedIndex, steps.length - 1));
  if (storedIndex !== i) setI(i);
  const [rect, setRect] = React.useState(null);
  const [pop, setPop] = React.useState({ top: 80, left: 40 });
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Tour", L, localeMessages);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const titleId = React.useId();
  const backdrop = React.useRef(null);
  const { scope } = useOverlayLayer({ open: !!open && steps.length > 0, kind: "modal", trapFocus: true, panelRef: panel, backdropRef: backdrop, onEscape: onClose });
  React.useEffect(() => {
    if (open) setI(0);
  }, [open]);
  const target = steps[i]?.target;
  React.useEffect(() => {
    if (!open || !target) {
      setRect(null);
      setPop({ top: 80, left: 40 });
      return void 0;
    }
    let frame;
    let previous;
    const measure = () => {
      let el = null;
      try {
        el = document.querySelector(target);
      } catch (e) {
        el = null;
      }
      const r = el?.getBoundingClientRect();
      const next = r ? { x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12 } : null;
      const position = next ? {
        top: Math.min(window.innerHeight - 170, next.y + next.h + 12),
        left: Math.max(12, Math.min(window.innerWidth - 292, next.x))
      } : { top: 80, left: 40 };
      const signature = JSON.stringify([next, position]);
      if (signature !== previous) {
        previous = signature;
        setRect(next);
        setPop(position);
      }
      frame = requestAnimationFrame(measure);
    };
    measure();
    return () => cancelAnimationFrame(frame);
  }, [open, target]);
  if (!open || !steps.length) return /* @__PURE__ */ React.createElement("span", { ref, style: { display: "none" } });
  const s = steps[i];
  const last = i === steps.length - 1;
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref, ...mergeTargetProps({ "className": cx("cs-tour", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement("div", { ref: backdrop, className: "cs-tour__scrim", onClick: onClose }), rect ? /* @__PURE__ */ React.createElement("div", { className: "cs-tour__hole", style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h } }) : null, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, tabIndex: -1, className: "cs-tour__pop", role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, style: { left: pop.left, top: pop.top } }, /* @__PURE__ */ React.createElement("b", { id: titleId }, s.title), s.body || s.body === 0 ? /* @__PURE__ */ React.createElement("p", null, s.body) : null, /* @__PURE__ */ React.createElement("div", { className: "cs-tour__bar" }, /* @__PURE__ */ React.createElement("span", { className: "cs-tour__count" }, i + 1 + " / " + steps.length), /* @__PURE__ */ React.createElement("span", { className: "cs-tour__btns" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--ghost cs-button--xs", onClick: onClose }, t("skip")), i > 0 ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", onClick: () => setI(i - 1) }, t("back")) : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--primary cs-button--xs", onClick: () => last ? onClose && onClose() : setI(i + 1) }, last ? t("done") : t("next")))))));
});
Tour.displayName = "Tour";

export {
  Tour
};
//# sourceMappingURL=chunk-CH4W6RCG.mjs.map
