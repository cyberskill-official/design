import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const FileUpload = React.forwardRef(function FileUpload2({ title, hint, accept, multiple = false, onFiles, icon, lang, className }, forwardedRef) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);
  const pick = (files) => {
    if (files && files.length && onFiles) onFiles(Array.from(files));
  };
  const [ref, L] = useLang(lang);
  const t = makeT("FileUpload", L);
  const tt = title != null ? title : t("title");
  const hh = hint != null ? hint : t("hint");
  const id = React.useId();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: mergeRefs(ref, forwardedRef),
      className: cx("cs-dropzone", drag && "is-dragging", className),
      onDragOver: (e) => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
        pick(e.dataTransfer.files);
      },
      onClick: () => inputRef.current && inputRef.current.click(),
      children: [
        /* @__PURE__ */ jsx("span", { className: "cs-dropzone__icon", "aria-hidden": "true", children: icon ?? /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("path", { d: "M12 16V4M7 9l5-5 5 5" }),
          /* @__PURE__ */ jsx("path", { d: "M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" })
        ] }) }),
        /* @__PURE__ */ jsx("label", { className: "cs-dropzone__title", htmlFor: id, children: tt }),
        /* @__PURE__ */ jsx("span", { className: "cs-dropzone__hint", id: id + "-hint", children: hh }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id,
            ref: inputRef,
            type: "file",
            accept,
            multiple,
            className: "cs-sr-only",
            "aria-describedby": id + "-hint",
            onChange: (e) => pick(e.target.files),
            onClick: (e) => e.stopPropagation()
          }
        )
      ]
    }
  );
});
export {
  FileUpload
};
