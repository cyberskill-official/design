"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  associateFieldProps,
  fieldAssociationContext,
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/Form.jsx
import React from "react";
var FormCtx;
function getFormCtx() {
  if (!FormCtx) FormCtx = React.createContext(null);
  return FormCtx;
}
var arrayRowKeys = /* @__PURE__ */ new WeakMap();
var nextRowKey = 0;
function rowKeys(array) {
  if (!arrayRowKeys.has(array)) arrayRowKeys.set(array, Array.from(array, () => ++nextRowKey));
  const keys = arrayRowKeys.get(array);
  while (keys.length < array.length) keys.push(++nextRowKey);
  return keys;
}
function clonePathContainer(value) {
  if (!Array.isArray(value)) return { ...value || {} };
  const clone = [...value];
  arrayRowKeys.set(clone, [...rowKeys(value)]);
  return clone;
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
  const root = clonePathContainer(obj);
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const nextKey = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(nextKey);
    const existing = cur[p];
    const clone = existing == null ? nextIsIndex ? [] : {} : clonePathContainer(existing);
    cur[p] = clone;
    cur = clone;
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}
function useFormController(seed) {
  const [state, setState] = React.useState(() => ({ values: seed || {}, errors: {} }));
  const setValues = React.useCallback((change) => setState((current) => ({
    ...current,
    values: typeof change === "function" ? change(current.values) : change
  })), []);
  const setRuleErrors = React.useCallback((change) => setState((current) => ({
    ...current,
    errors: typeof change === "function" ? change(current.errors) : change
  })), []);
  const updateArray = React.useCallback((name, change) => setState((current) => {
    const value = getPath(current.values, name);
    const list = Array.isArray(value) ? value : [];
    const next = change(list);
    if (next === list) return current;
    const errors = Object.fromEntries(Object.entries(current.errors).filter(
      ([key]) => key !== name && !key.startsWith(name + ".")
    ));
    return { values: setPath(current.values, name, next), errors };
  }), []);
  return { values: state.values, ruleErrors: state.errors, setValues, setRuleErrors, updateArray };
}
var Form = React.forwardRef(function Form2({ onSubmit, onReset, errors = {}, rules, asyncRules, initialValues, children, lang, className, ...props }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Form", L, localeMessages);
  const initialSeed = React.useRef(initialValues || {});
  const { values, ruleErrors, setValues, setRuleErrors, updateArray } = useFormController(initialSeed.current);
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const lifecycle = React.useRef(0);
  React.useEffect(() => () => {
    lifecycle.current++;
  }, []);
  const [submissionError, setSubmissionError] = React.useState(null);
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
  const runAsyncRules = async (v, attempt) => {
    if (!asyncRules) return {};
    const out = {};
    for (const [name, fn] of Object.entries(asyncRules)) {
      if (attempt !== lifecycle.current) return out;
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
  const ctx = { values, setValue, setValues, updateArray, errors: merged, pending, runRules, setRuleErrors, t, L };
  const Ctx = getFormCtx();
  return /* @__PURE__ */ React.createElement(Ctx.Provider, { value: ctx }, /* @__PURE__ */ React.createElement(
    "form",
    {
      ...props,
      ref: mergedNativeRef,
      className: cx("cs-form", pending && "is-pending", className),
      noValidate: true,
      "aria-busy": pending || void 0,
      onReset: (event) => {
        onReset?.(event);
        if (event.defaultPrevented) return;
        lifecycle.current++;
        pendingRef.current = false;
        setPending(false);
        setValues(initialSeed.current);
        setRuleErrors({});
        setSubmissionError(null);
      },
      onSubmit: async (e) => {
        e.preventDefault();
        if (pendingRef.current) return;
        setSubmissionError(null);
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
        const attempt = lifecycle.current;
        try {
          const aerrs = await runAsyncRules(v, attempt);
          if (attempt !== lifecycle.current) return;
          setRuleErrors(aerrs);
          if (Object.keys(aerrs).some((k) => aerrs[k])) return;
          await onSubmit?.(v);
        } catch (error) {
          if (attempt === lifecycle.current) setSubmissionError(String(error && error.message || error));
        } finally {
          if (attempt === lifecycle.current) {
            pendingRef.current = false;
            setPending(false);
          }
        }
      }
    },
    keys.length || submissionError ? /* @__PURE__ */ React.createElement("div", { className: "cs-form__summary", role: "alert" }, /* @__PURE__ */ React.createElement("b", null, t("summary")), /* @__PURE__ */ React.createElement("ul", null, submissionError ? /* @__PURE__ */ React.createElement("li", null, submissionError) : null, keys.map((k) => /* @__PURE__ */ React.createElement("li", { key: k }, merged[k])))) : null,
    /* @__PURE__ */ React.createElement("fieldset", { disabled: pending, style: { display: "contents" } }, children)
  ));
});
Form.displayName = "Form";
var FormField = React.forwardRef(function FormField2({ label, name, required = false, hint, error, valueProp = "value", children, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Form", L, localeMessages);
  const autoId = React.useId();
  const ctx = React.useContext(getFormCtx());
  const err = error !== void 0 && error !== null ? error : name && ctx ? ctx.errors[name] : void 0;
  const hasError = Boolean(err) || err === 0;
  const singleElement = React.isValidElement(children) && React.Children.count(children) === 1;
  const isNativeControl = singleElement && typeof children.type === "string" && /^(input|select|textarea)$/i.test(children.type);
  const controlId = singleElement ? children.props.controlProps?.id ?? children.props.id ?? autoId : autoId;
  const hasLabel = typeof label === "string" ? label.trim().length > 0 : Boolean(label) || label === 0;
  const field = { controlId, labelId: hasLabel ? autoId + "-field-label" : void 0, descriptionId: !hasError && (hint || hint === 0) ? autoId + "-field-hint" : void 0, errorId: hasError ? autoId + "-field-error" : void 0, invalid: hasError, required };
  const Association = fieldAssociationContext();
  let child = children;
  if (singleElement) {
    const wire = {};
    if (isNativeControl && children.props.id === void 0) wire.id = controlId;
    if (name && ctx) {
      const cur = String(name).includes(".") ? getPath(ctx.values, name) : ctx.values[name];
      wire.name = name;
      wire[valueProp] = cur !== void 0 ? cur : valueProp === "checked" || valueProp === "pressed" ? false : "";
      wire.onChange = (ev) => {
        const val = ev && ev.target ? valueProp === "checked" ? ev.target.checked : ev.target.value : ev;
        ctx.setValue(name, val);
        if (children.props.onChange) children.props.onChange(ev);
      };
    }
    if (isNativeControl) Object.assign(wire, associateFieldProps({ ...children.props, ...wire }, field, { nativeRequired: true }));
    if (Object.keys(wire).length) child = React.cloneElement(children, wire);
  }
  const LabelTag = isNativeControl ? "label" : "span";
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ className: cx("cs-formfield", hasError && "has-error", className) }, rootProps), ref: mergedNativeRef }, /* @__PURE__ */ React.createElement(LabelTag, { id: field.labelId, className: "cs-formfield__label", htmlFor: isNativeControl ? controlId : void 0 }, label, required ? /* @__PURE__ */ React.createElement(React.Fragment, null, " ", /* @__PURE__ */ React.createElement("em", { "aria-label": t("required") }, "*")) : null), /* @__PURE__ */ React.createElement(Association.Provider, { value: field }, typeof children === "function" ? children(associateFieldProps({}, field)) : child), hasError ? /* @__PURE__ */ React.createElement("span", { id: field.errorId, className: "cs-formfield__error", role: "alert" }, err) : hint || hint === 0 ? /* @__PURE__ */ React.createElement("span", { id: field.descriptionId, className: "cs-formfield__hint" }, hint) : null);
});
FormField.displayName = "FormField";
var FormFieldArray = React.forwardRef(function FormFieldArray2({
  name,
  children,
  label,
  min = 0,
  max = 50,
  addLabel,
  defaultItem,
  className,
  rootProps,
  lang
}, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Form", L, localeMessages);
  const ctx = React.useContext(getFormCtx());
  if (!ctx) {
    return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, className: "cs-formfield__error", role: "alert" }, t("arrayContext"));
  }
  const list = Array.isArray(getPath(ctx.values, name)) ? getPath(ctx.values, name) : [];
  const blank = () => defaultItem != null ? typeof defaultItem === "function" ? defaultItem() : { ...defaultItem } : {};
  const updateList = (change) => ctx.updateArray(name, change);
  const add = () => {
    if (list.length >= max) return;
    const item = blank();
    updateList((current) => {
      if (current.length >= max) return current;
      const next = [...current, item];
      arrayRowKeys.set(next, [...rowKeys(current), ++nextRowKey]);
      return next;
    });
  };
  const removeAt = (i) => {
    const target = list[i];
    const targetKey = rowKeys(list)[i];
    updateList((current) => {
      if (current.length <= min) return current;
      const index = rowKeys(current).indexOf(targetKey);
      if (index < 0 || current[index] !== target) return current;
      const next = current.filter((_, idx) => idx !== index);
      arrayRowKeys.set(next, rowKeys(current).filter((_, idx) => idx !== index));
      return next;
    });
  };
  return /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ className: cx("cs-form-array", className), "data-name": name }, rootProps, ["data-name"]), ref: mergedNativeRef }, label || label === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-formfield__label", style: { marginBottom: 8 } }, label) : null, /* @__PURE__ */ React.createElement("div", { className: "cs-form-array__rows" }, list.map((item, index) => /* @__PURE__ */ React.createElement("div", { className: "cs-form-array__row", key: rowKeys(list)[index], "data-index": index }, typeof children === "function" ? children({
    index,
    item,
    remove: () => removeAt(index),
    path: (field) => `${name}.${index}.${field}`
  }) : children))), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "cs-button cs-button--secondary cs-button--sm",
      onClick: add,
      disabled: list.length >= max,
      style: { marginTop: 8 }
    },
    addLabel || t("addRow")
  ));
});
FormFieldArray.displayName = "FormFieldArray";
var FormWizard = React.forwardRef(function FormWizard2({
  steps = [],
  initialValues,
  onComplete,
  lang,
  className,
  rootProps,
  nextLabel,
  backLabel,
  finishLabel
}, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Form", L, localeMessages);
  const [step, setStep] = React.useState(0);
  const { values, ruleErrors, setValues, setRuleErrors, updateArray } = useFormController(initialValues);
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const [submissionError, setSubmissionError] = React.useState(null);
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
  const ctx = { values, setValue, setValues, updateArray, errors: ruleErrors, pending, runRules, setRuleErrors, t, L };
  const keys = Object.keys(ruleErrors).filter((k) => ruleErrors[k]);
  const goNext = async () => {
    if (pendingRef.current) return;
    setSubmissionError(null);
    const errs = runRules(values, current.rules);
    if (Object.keys(errs).some((k) => errs[k])) {
      setRuleErrors(errs);
      return;
    }
    setRuleErrors({});
    if (step >= steps.length - 1) {
      pendingRef.current = true;
      setPending(true);
      try {
        await onComplete?.(values);
      } catch (error) {
        setSubmissionError(String(error && error.message || error));
      } finally {
        pendingRef.current = false;
        setPending(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };
  const goBack = () => {
    if (pendingRef.current) return;
    setSubmissionError(null);
    setRuleErrors({});
    setStep((s) => Math.max(0, s - 1));
  };
  const Ctx = getFormCtx();
  return /* @__PURE__ */ React.createElement(Ctx.Provider, { value: ctx }, /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ className: cx("cs-form-wizard", className), "data-step": step, "aria-busy": pending || void 0 }, rootProps, ["data-step", "aria-busy"]), ref: mergedNativeRef }, /* @__PURE__ */ React.createElement("ol", { className: "cs-form-wizard__steps", style: { display: "flex", gap: 10, listStyle: "none", padding: 0, margin: "0 0 16px", flexWrap: "wrap" } }, steps.map((s, i) => /* @__PURE__ */ React.createElement("li", { key: s.id || i, "aria-current": i === step ? "step" : void 0, style: {
    font: "700 11px/1 var(--cs-font-family-ui)",
    fontWeight: i === step ? 700 : 500,
    textTransform: "uppercase",
    letterSpacing: ".06em",
    color: i === step ? "var(--cs-color-text-primary)" : "var(--cs-color-text-secondary)"
  } }, i + 1, ". ", s.title || s.id || `${t("step")} ${i + 1}`))), keys.length || submissionError ? /* @__PURE__ */ React.createElement("div", { className: "cs-form__summary", role: "alert" }, /* @__PURE__ */ React.createElement("b", null, t("summary")), /* @__PURE__ */ React.createElement("ul", null, submissionError ? /* @__PURE__ */ React.createElement("li", null, submissionError) : null, keys.map((k) => /* @__PURE__ */ React.createElement("li", { key: k }, ruleErrors[k])))) : null, /* @__PURE__ */ React.createElement("div", { className: "cs-form-wizard__body" }, /* @__PURE__ */ React.createElement("fieldset", { disabled: pending, style: { display: "contents" } }, typeof current.render === "function" ? current.render({ values, step, setValue }) : null)), /* @__PURE__ */ React.createElement("div", { className: "cs-form-wizard__nav", style: { display: "flex", gap: 10, marginTop: 16 } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--secondary cs-button--sm", onClick: goBack, disabled: step === 0 || pending }, backLabel || t("back")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--sm", onClick: goNext, disabled: pending }, step >= steps.length - 1 ? finishLabel || t("finish") : nextLabel || t("next")))));
});
FormWizard.displayName = "FormWizard";

export {
  getPath,
  setPath,
  Form,
  FormField,
  FormFieldArray,
  FormWizard
};
//# sourceMappingURL=chunk-3RC4CDAE.mjs.map
