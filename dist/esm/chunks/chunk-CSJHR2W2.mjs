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

// components/forms/FileUpload.jsx
import React from "react";
var FileUpload = React.forwardRef(function FileUpload2({ controlRef, title, hint, accept, multiple = false, onFiles, icon, lang, className, rootProps }, forwardedRef) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef(null);
  const mergedControlRef = useComposedRefs(inputRef, controlRef);
  const pick = (files) => {
    if (files && files.length && onFiles) onFiles(multiple ? Array.from(files) : [files[0]]);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("FileUpload", L, localeMessages);
  const tt = title != null ? title : t("title");
  const hh = hint != null ? hint : t("hint");
  const id = React.useId();
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: mergedNativeRef,
      ...mergeTargetProps({ "className": cx("cs-dropzone", drag && "is-dragging", className), "onDragOver": (e) => {
        e.preventDefault();
        setDrag(true);
      }, "onDragLeave": () => setDrag(false), "onDrop": (e) => {
        e.preventDefault();
        setDrag(false);
        pick(e.dataTransfer.files);
      }, "onClick": () => inputRef.current && inputRef.current.click() }, rootProps, [])
    },
    /* @__PURE__ */ React.createElement("span", { className: "cs-dropzone__icon", "aria-hidden": "true" }, icon ?? /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M12 16V4M7 9l5-5 5 5" }), /* @__PURE__ */ React.createElement("path", { d: "M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" }))),
    /* @__PURE__ */ React.createElement("label", { className: "cs-dropzone__title", htmlFor: id }, tt),
    /* @__PURE__ */ React.createElement("span", { className: "cs-dropzone__hint", id: id + "-hint" }, hh),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        id,
        ref: mergedControlRef,
        type: "file",
        accept,
        multiple,
        className: "cs-sr-only",
        "aria-describedby": id + "-hint",
        onChange: (e) => pick(e.target.files),
        onClick: (e) => {
          e.stopPropagation();
          e.currentTarget.value = "";
        }
      }
    )
  );
});
FileUpload.displayName = "FileUpload";

export {
  FileUpload
};
//# sourceMappingURL=chunk-CSJHR2W2.mjs.map
