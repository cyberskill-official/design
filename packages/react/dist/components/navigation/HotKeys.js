import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
function match(combo, e) {
  const parts = combo.toLowerCase().split("+");
  const key = parts[parts.length - 1];
  const mod = parts.includes("mod") ? e.metaKey || e.ctrlKey : true;
  const shift = parts.includes("shift") ? e.shiftKey : !e.shiftKey || key.length > 1;
  const alt = parts.includes("alt") ? e.altKey : !e.altKey;
  return mod && shift && alt && e.key.toLowerCase() === key;
}
const HotKeys = React.forwardRef(function HotKeys2({ bindings = [], help = true, children, lang, className }, forwardedRef) {
  const [show, setShow] = React.useState(false);
  const [ref, L] = useLang(lang);
  const t = makeT("HotKeys", L);
  React.useEffect(() => {
    const on = (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (help && e.key === "?") {
        setShow((s) => !s);
        return;
      }
      if (e.key === "Escape") setShow(false);
      for (const b of bindings) if (match(b.keys, e)) {
        e.preventDefault();
        b.onTrigger && b.onTrigger();
        return;
      }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [bindings, help]);
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-hotkeys", className), children: [
    children,
    show ? /* @__PURE__ */ jsx("div", { className: "cs-hotkeys__sheet", role: "dialog", "aria-label": t("title"), onClick: () => setShow(false), children: /* @__PURE__ */ jsxs("div", { className: "cs-hotkeys__card", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("b", { children: t("title") }),
      /* @__PURE__ */ jsxs("ul", { children: [
        bindings.map((b, i) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: b.description }),
          /* @__PURE__ */ jsx("kbd", { className: "cs-kbd", children: b.keys })
        ] }, i)),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: t("toggle") }),
          /* @__PURE__ */ jsx("kbd", { className: "cs-kbd", children: "?" })
        ] })
      ] })
    ] }) }) : null
  ] });
});
export {
  HotKeys
};
