"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
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

// components/navigation/Toolbar.jsx
import React from "react";
var Toolbar = React.forwardRef(function Toolbar2({ portal = true, placement, items = [], overflowAfter, label, lang, className, rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [focusIdx, setFocusIdx] = React.useState(0);
  const wrap = React.useRef(null);
  const btnRefs = React.useRef([]);
  const menuRefs = React.useRef([]);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(wrap, ref, forwardedRef);
  const t = makeT("Toolbar", L, localeMessages);
  const cut = overflowAfter != null ? overflowAfter : items.length;
  const head = items.slice(0, cut);
  const tail = items.slice(cut).filter((x) => x !== "-");
  const hasMore = tail.length > 0;
  const controlMeta = [];
  head.forEach((it, i) => {
    if (it !== "-") controlMeta.push({ kind: "head", headIndex: i });
  });
  if (hasMore) controlMeta.push({ kind: "more" });
  const floating = useFloatingPanel({ open: open && hasMore, anchorRef: wrap, panelRef: floatingRef, portal, placement: placement ?? "bottom-end", gap: 6, getAnchor: () => wrap.current?.querySelector(".cs-toolbar__more > button"), getInlineParent: () => wrap.current?.querySelector(".cs-toolbar__more"), lang });
  const { scope } = useOverlayLayer({ open: open && hasMore && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (!floating.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  React.useEffect(() => {
    if (focusIdx >= controlMeta.length) setFocusIdx(Math.max(0, controlMeta.length - 1));
  }, [focusIdx, controlMeta.length]);
  const focusControl = (i) => {
    const next = Math.max(0, Math.min(controlMeta.length - 1, i));
    setFocusIdx(next);
    requestAnimationFrame(() => {
      const el = btnRefs.current[next];
      if (el) el.focus();
    });
  };
  const onToolbarKeyDown = (e, i) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusControl(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusControl(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusControl(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusControl(controlMeta.length - 1);
    }
  };
  const onMenuKeyDown = (e, i) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = Math.min(tail.length - 1, i + 1);
      const el = menuRefs.current[n];
      if (el) el.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.max(0, i - 1);
      const el = menuRefs.current[n];
      if (el) el.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      const el = menuRefs.current[0];
      if (el) el.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const el = menuRefs.current[tail.length - 1];
      if (el) el.focus();
    }
  };
  let controlI = 0;
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-toolbar", className) }, rootProps, ["role", "aria-label", "aria-orientation"]), role: "toolbar", "aria-label": label, "aria-orientation": "horizontal" }, head.map((it, i) => {
    if (it === "-") return /* @__PURE__ */ React.createElement("span", { key: "sep-" + i, className: "cs-toolbar__sep", "aria-hidden": "true" });
    const ci = controlI++;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: "btn-" + i,
        type: "button",
        className: "cs-toolbar__btn",
        tabIndex: ci === focusIdx ? 0 : -1,
        ref: (el) => {
          btnRefs.current[ci] = el;
        },
        onFocus: () => setFocusIdx(ci),
        onKeyDown: (e) => onToolbarKeyDown(e, ci),
        onClick: () => it.onSelect && it.onSelect()
      },
      it.icon,
      it.label || it.label === 0 ? /* @__PURE__ */ React.createElement("span", null, it.label) : null
    );
  }), hasMore ? (() => {
    const ci = controlI++;
    return /* @__PURE__ */ React.createElement("span", { className: "cs-toolbar__more" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "cs-toolbar__btn",
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-label": t("more"),
        tabIndex: ci === focusIdx ? 0 : -1,
        ref: (el) => {
          btnRefs.current[ci] = el;
        },
        onFocus: () => setFocusIdx(ci),
        onKeyDown: (e) => {
          onToolbarKeyDown(e, ci);
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            if (!open) {
              e.preventDefault();
              setOpen(true);
              requestAnimationFrame(() => {
                const el = menuRefs.current[0];
                if (el) el.focus();
              });
            }
          }
        },
        onClick: () => setOpen((o) => !o)
      },
      "⋯"
    ), open ? floating.render(/* @__PURE__ */ React.createElement("span", { ref: floatingRef, className: "cs-menu__list", role: "menu" }, tail.map((it, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        type: "button",
        role: "menuitem",
        className: "cs-menu__item",
        ref: (el) => {
          menuRefs.current[i] = el;
        },
        onKeyDown: (e) => onMenuKeyDown(e, i),
        onClick: () => {
          setOpen(false);
          it.onSelect && it.onSelect();
        }
      },
      it.label
    )))) : null);
  })() : null));
});
Toolbar.displayName = "Toolbar";

export {
  Toolbar
};
//# sourceMappingURL=chunk-72AUOI37.mjs.map
