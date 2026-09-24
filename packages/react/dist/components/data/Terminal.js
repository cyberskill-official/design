import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Terminal = React.forwardRef(function Terminal2({ title, welcome, onCommand, prompt = "\u279C", lang, className }, forwardedRef) {
  const [hist, setHist] = React.useState(() => welcome ? [{ out: welcome }] : []);
  const [q, setQ] = React.useState("");
  const [ref, L] = useLang(lang);
  const t = makeT("Terminal", L);
  const barTitle = title ?? t("title");
  const run = () => {
    if (!q.trim()) return;
    const res = onCommand ? onCommand(q.trim()) : "";
    setHist((h) => [...h, { cmd: q }, ...res ? [{ out: res }] : []]);
    setQ("");
  };
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-terminal", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "cs-terminal__bar", children: [
      /* @__PURE__ */ jsx("i", {}),
      /* @__PURE__ */ jsx("i", {}),
      /* @__PURE__ */ jsx("i", {}),
      /* @__PURE__ */ jsx("span", { children: barTitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cs-terminal__body", children: [
      hist.map((l, i) => l.cmd != null ? /* @__PURE__ */ jsxs("div", { className: "cs-terminal__line", children: [
        /* @__PURE__ */ jsx("span", { className: "p", children: prompt }),
        " ",
        l.cmd
      ] }, i) : /* @__PURE__ */ jsx("div", { className: "cs-terminal__out", children: l.out }, i)),
      /* @__PURE__ */ jsxs("div", { className: "cs-terminal__line", children: [
        /* @__PURE__ */ jsx("span", { className: "p", children: prompt }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: q,
            "aria-label": t("input"),
            spellCheck: false,
            onChange: (e) => setQ(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") run();
            }
          }
        )
      ] })
    ] })
  ] });
});
export {
  Terminal
};
