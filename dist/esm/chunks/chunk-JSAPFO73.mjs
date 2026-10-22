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

// components/data/Terminal.jsx
import React from "react";
var hasOutput = (value) => value != null && typeof value !== "boolean" && value !== "";
var Terminal = React.forwardRef(function Terminal2({ title, welcome, onCommand, prompt = "➜", lang, className, rootProps }, forwardedRef) {
  const [hist, setHist] = React.useState(() => hasOutput(welcome) ? [{ out: welcome }] : []);
  const [q, setQ] = React.useState("");
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Terminal", L, localeMessages);
  const barTitle = title ?? t("title");
  const run = () => {
    if (!q.trim()) return;
    const res = onCommand ? onCommand(q.trim()) : "";
    setHist((h) => [...h, { cmd: q }, ...hasOutput(res) ? [{ out: res }] : []]);
    setQ("");
  };
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-terminal", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement("div", { className: "cs-terminal__bar" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("span", null, barTitle)), /* @__PURE__ */ React.createElement("div", { className: "cs-terminal__body" }, hist.map((l, i) => l.cmd != null ? /* @__PURE__ */ React.createElement("div", { key: i, className: "cs-terminal__line" }, /* @__PURE__ */ React.createElement("span", { className: "p" }, prompt), " ", l.cmd) : /* @__PURE__ */ React.createElement("div", { key: i, className: "cs-terminal__out" }, l.out)), /* @__PURE__ */ React.createElement("div", { className: "cs-terminal__line" }, /* @__PURE__ */ React.createElement("span", { className: "p" }, prompt), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: q,
      "aria-label": t("input"),
      spellCheck: false,
      onChange: (e) => setQ(e.target.value),
      onKeyDown: (e) => {
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        if (e.key === "Enter") {
          e.preventDefault();
          run();
        }
      }
    }
  ))));
});
Terminal.displayName = "Terminal";

export {
  Terminal
};
//# sourceMappingURL=chunk-JSAPFO73.mjs.map
