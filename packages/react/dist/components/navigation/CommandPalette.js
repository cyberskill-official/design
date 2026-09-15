import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "../overlays/OverlayManager.jsx";
const CommandPalette = React.forwardRef(function CommandPalette2({ open, onClose, placeholder, groups = [], lang, className }, forwardedRef) {
  const [q, setQ] = React.useState("");
  const panel = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    preferFocusSelector: ".cs-cmdk__search input",
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel
  });
  const [ref, L] = useLang(lang);
  const t = makeT("CommandPalette", L);
  const ph = placeholder != null ? placeholder : t("placeholder");
  if (!open) return null;
  const needle = q.trim().toLowerCase();
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: (el) => {
        ref.current = el;
        panel.current = el;
      },
      className: "cs-cmdk-scrim",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs("div", { className: cx("cs-cmdk", className), role: "dialog", "aria-modal": "true", "aria-label": t("aria"), onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxs("div", { className: "cs-cmdk__search", children: [
          /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
            /* @__PURE__ */ jsx("path", { d: "M21 21l-4.3-4.3" })
          ] }),
          /* @__PURE__ */ jsx("input", { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder: ph }),
          /* @__PURE__ */ jsx("span", { className: "cs-kbd", children: t("esc") })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cs-cmdk__list", children: groups.map((g, gi) => {
          const items = (g.items || []).filter((it) => !needle || String(it.label).toLowerCase().includes(needle));
          if (!items.length) return null;
          return /* @__PURE__ */ jsxs(React.Fragment, { children: [
            g.label ? /* @__PURE__ */ jsx("div", { className: "cs-cmdk__label", children: g.label }) : null,
            items.map((it, ii) => /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-cmdk__item", onClick: () => {
              it.onSelect && it.onSelect();
              onClose && onClose();
            }, children: [
              it.icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: it.icon }) : null,
              /* @__PURE__ */ jsx("span", { children: it.label }),
              it.shortcut ? /* @__PURE__ */ jsx("span", { className: "cs-kbd", children: it.shortcut }) : null
            ] }, ii))
          ] }, gi);
        }) })
      ] })
    }
  );
});
export {
  CommandPalette
};
