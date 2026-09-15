import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
let FormCtx;
function getFormCtx() {
  if (!FormCtx) FormCtx = React.createContext(null);
  return FormCtx;
}
function getPath(obj, path) {
  if (!path) return void 0;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return void 0;
    cur = cur[p];
  }
  return cur;
}
function setPath(obj, path, value) {
  const parts = String(path).split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...obj || {} };
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const nextKey = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(nextKey);
    const existing = cur[p];
    const clone = existing == null ? nextIsIndex ? [] : {} : Array.isArray(existing) ? [...existing] : { ...existing };
    cur[p] = clone;
    cur = clone;
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}
const Form = React.forwardRef(function Form2({ onSubmit, errors = {}, rules, asyncRules, initialValues, children, lang, className, ...props }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const [values, setValues] = React.useState(() => initialValues || {});
  const [ruleErrors, setRuleErrors] = React.useState({});
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const setValue = React.useCallback((name, v) => {
    setValues((s) => String(name).includes(".") ? setPath(s, name, v) : { ...s, [name]: v });
    setRuleErrors((e) => e[name] ? { ...e, [name]: void 0 } : e);
  }, []);
  const merged = { ...ruleErrors, ...errors };
  const keys = Object.keys(merged).filter((k) => merged[k]);
  const runRules = (v, ruleMap) => {
    const map = ruleMap || rules;
    if (!map) return {};
    const out = {};
    for (const [name, r] of Object.entries(map)) {
      for (const rule of Array.isArray(r) ? r : [r]) {
        const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
        const msg = rule === "required" ? fieldVal == null || String(fieldVal).trim() === "" ? t("requiredField") : null : typeof rule === "function" ? rule(fieldVal, v) : null;
        if (msg) {
          out[name] = msg;
          break;
        }
      }
    }
    return out;
  };
  const runAsyncRules = async (v) => {
    if (!asyncRules) return {};
    const out = {};
    for (const [name, fn] of Object.entries(asyncRules)) {
      if (typeof fn !== "function") continue;
      try {
        const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
        const msg = await fn(fieldVal, v);
        if (msg) out[name] = msg;
      } catch (e) {
        out[name] = String(e && e.message || e);
      }
    }
    return out;
  };
  const ctx = { values, setValue, setValues, errors: merged, pending, runRules, setRuleErrors, t, L };
  const Ctx = getFormCtx();
  return /* @__PURE__ */ jsx(Ctx.Provider, { ref: forwardedRef, value: ctx, children: /* @__PURE__ */ jsxs(
    "form",
    {
      ...props,
      ref,
      className: cx("cs-form", pending && "is-pending", className),
      noValidate: true,
      "aria-busy": pending || void 0,
      onSubmit: async (e) => {
        e.preventDefault();
        if (pendingRef.current) return;
        const fd = new FormData(e.currentTarget);
        const v = {};
        fd.forEach((val, k) => {
          v[k] = val;
        });
        Object.assign(v, values);
        const errs = runRules(v);
        if (Object.keys(errs).some((k) => errs[k])) {
          setRuleErrors(errs);
          return;
        }
        pendingRef.current = true;
        setPending(true);
        try {
          const aerrs = await runAsyncRules(v);
          setRuleErrors(aerrs);
          if (Object.keys(aerrs).some((k) => aerrs[k])) return;
          onSubmit && onSubmit(v);
        } finally {
          pendingRef.current = false;
          setPending(false);
        }
      },
      children: [
        keys.length ? /* @__PURE__ */ jsxs("div", { className: "cs-form__summary", role: "alert", children: [
          /* @__PURE__ */ jsx("b", { children: t("summary") }),
          /* @__PURE__ */ jsx("ul", { children: keys.map((k) => /* @__PURE__ */ jsx("li", { children: merged[k] }, k)) })
        ] }) : null,
        children
      ]
    }
  ) });
});
const FormField = React.forwardRef(function FormField2({ label, name, required = false, hint, error, valueProp = "value", children, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const ctx = React.useContext(getFormCtx());
  const err = error !== void 0 && error !== null ? error : name && ctx ? ctx.errors[name] : void 0;
  let child = children;
  if (name && ctx && React.isValidElement(children) && React.Children.count(children) === 1) {
    const cur = String(name).includes(".") ? getPath(ctx.values, name) : ctx.values[name];
    const wire = { name };
    wire[valueProp] = cur !== void 0 ? cur : valueProp === "checked" ? false : "";
    wire.onChange = (ev) => {
      const val = ev && ev.target ? valueProp === "checked" ? ev.target.checked : ev.target.value : ev;
      ctx.setValue(name, val);
      if (children.props.onChange) children.props.onChange(ev);
    };
    child = React.cloneElement(children, wire);
  }
  return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-formfield", err && "has-error", className), children: [
    /* @__PURE__ */ jsxs("span", { className: "cs-formfield__label", children: [
      label,
      required ? /* @__PURE__ */ jsx("em", { "aria-label": t("required"), children: " *" }) : null
    ] }),
    child,
    err ? /* @__PURE__ */ jsx("span", { className: "cs-formfield__error", role: "alert", children: err }) : hint ? /* @__PURE__ */ jsx("span", { className: "cs-formfield__hint", children: hint }) : null
  ] });
});
const FormFieldArray = React.forwardRef(function FormFieldArray2({
  name,
  children,
  label,
  min = 0,
  max = 50,
  addLabel,
  defaultItem,
  className,
  lang
}, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const ctx = React.useContext(getFormCtx());
  if (!ctx) {
    return /* @__PURE__ */ jsx("div", { className: "cs-formfield__error", role: "alert", children: "FormFieldArray must be used inside Form" });
  }
  const list = Array.isArray(getPath(ctx.values, name)) ? getPath(ctx.values, name) : [];
  const blank = () => defaultItem != null ? typeof defaultItem === "function" ? defaultItem() : { ...defaultItem } : {};
  const setList = (next) => ctx.setValue(name, next);
  const add = () => {
    if (list.length >= max) return;
    setList([...list, blank()]);
  };
  const removeAt = (i) => {
    if (list.length <= min) return;
    setList(list.filter((_, idx) => idx !== i));
  };
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-form-array", className), "data-name": name, children: [
    label ? /* @__PURE__ */ jsx("div", { className: "cs-formfield__label", style: { marginBottom: 8 }, children: label }) : null,
    /* @__PURE__ */ jsx("div", { className: "cs-form-array__rows", children: list.map((item, index) => /* @__PURE__ */ jsx("div", { className: "cs-form-array__row", "data-index": index, children: typeof children === "function" ? children({
      index,
      item,
      remove: () => removeAt(index),
      path: (field) => `${name}.${index}.${field}`
    }) : children }, index)) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "cs-button cs-button--secondary cs-button--sm",
        onClick: add,
        disabled: list.length >= max,
        style: { marginTop: 8 },
        children: addLabel || (L === "vi" ? "Th\xEAm d\xF2ng" : "Add row")
      }
    )
  ] });
});
const FormWizard = React.forwardRef(function FormWizard2({
  steps = [],
  initialValues,
  onComplete,
  lang,
  className,
  nextLabel,
  backLabel,
  finishLabel
}, forwardedRef) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState(() => initialValues || {});
  const [ruleErrors, setRuleErrors] = React.useState({});
  const [pending, setPending] = React.useState(false);
  const setValue = React.useCallback((name, v) => {
    setValues((s) => String(name).includes(".") ? setPath(s, name, v) : { ...s, [name]: v });
    setRuleErrors((e) => e[name] ? { ...e, [name]: void 0 } : e);
  }, []);
  const runRules = React.useCallback((v, ruleMap) => {
    if (!ruleMap) return {};
    const out = {};
    for (const [name, r] of Object.entries(ruleMap)) {
      for (const rule of Array.isArray(r) ? r : [r]) {
        const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
        const msg = rule === "required" ? fieldVal == null || String(fieldVal).trim() === "" ? t("requiredField") : null : typeof rule === "function" ? rule(fieldVal, v) : null;
        if (msg) {
          out[name] = msg;
          break;
        }
      }
    }
    return out;
  }, [t]);
  const current = steps[step] || {};
  const ctx = { values, setValue, setValues, errors: ruleErrors, pending, runRules, setRuleErrors, t, L };
  const keys = Object.keys(ruleErrors).filter((k) => ruleErrors[k]);
  const goNext = async () => {
    const errs = runRules(values, current.rules);
    if (Object.keys(errs).some((k) => errs[k])) {
      setRuleErrors(errs);
      return;
    }
    setRuleErrors({});
    if (step >= steps.length - 1) {
      setPending(true);
      try {
        onComplete && onComplete(values);
      } finally {
        setPending(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };
  const goBack = () => {
    setRuleErrors({});
    setStep((s) => Math.max(0, s - 1));
  };
  const Ctx = getFormCtx();
  return /* @__PURE__ */ jsx(Ctx.Provider, { ref: forwardedRef, value: ctx, children: /* @__PURE__ */ jsxs("div", { ref, className: cx("cs-form-wizard", className), "data-step": step, children: [
    /* @__PURE__ */ jsx("ol", { className: "cs-form-wizard__steps", style: { display: "flex", gap: 10, listStyle: "none", padding: 0, margin: "0 0 16px", flexWrap: "wrap" }, children: steps.map((s, i) => /* @__PURE__ */ jsxs("li", { style: {
      font: "700 11px/1 var(--cs-font-family-ui)",
      textTransform: "uppercase",
      letterSpacing: ".06em",
      color: i === step ? "var(--cs-color-brand-umber)" : "var(--cs-color-text-primary)",
      opacity: i === step ? 1 : 0.55
    }, children: [
      i + 1,
      ". ",
      s.title || s.id || `Step ${i + 1}`
    ] }, s.id || i)) }),
    keys.length ? /* @__PURE__ */ jsxs("div", { className: "cs-form__summary", role: "alert", children: [
      /* @__PURE__ */ jsx("b", { children: t("summary") }),
      /* @__PURE__ */ jsx("ul", { children: keys.map((k) => /* @__PURE__ */ jsx("li", { children: ruleErrors[k] }, k)) })
    ] }) : null,
    /* @__PURE__ */ jsx("div", { className: "cs-form-wizard__body", children: typeof current.render === "function" ? current.render({ values, step, setValue }) : null }),
    /* @__PURE__ */ jsxs("div", { className: "cs-form-wizard__nav", style: { display: "flex", gap: 10, marginTop: 16 }, children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--sm", onClick: goBack, disabled: step === 0 || pending, children: backLabel || (L === "vi" ? "Quay l\u1EA1i" : "Back") }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--sm", onClick: goNext, disabled: pending, children: step >= steps.length - 1 ? finishLabel || (L === "vi" ? "Ho\xE0n t\u1EA5t" : "Finish") : nextLabel || (L === "vi" ? "Ti\u1EBFp" : "Next") })
    ] })
  ] }) });
});
export {
  Form,
  FormField,
  FormFieldArray,
  FormWizard,
  getPath,
  setPath
};
