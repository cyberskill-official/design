import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

// Lazy context — bundle evaluates modules before React is loaded on some gate pages.
let FormCtx;
function getFormCtx() {
  if (!FormCtx) FormCtx = React.createContext(null);
  return FormCtx;
}

/** Read a dotted path (supports array indices as numeric segments). */
export function getPath(obj, path) {
  if (!path) return undefined;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

/** Immutable set on a dotted path; creates objects/arrays as needed. */
export function setPath(obj, path, value) {
  const parts = String(path).split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const nextKey = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(nextKey);
    const existing = cur[p];
    const clone = existing == null
      ? (nextIsIndex ? [] : {})
      : (Array.isArray(existing) ? [...existing] : { ...existing });
    cur[p] = clone;
    cur = clone;
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}

/**
 * CyberSkill Form — semantic form + optional controller (v3.7).
 * Plain mode (unchanged): named native fields are collected via FormData into onSubmit(values);
 * `errors` renders the bilingual summary. Controller mode: pass `rules` (name → "required" |
 * fn(value, values) => msg|null | array of those); FormField children with `name` register via
 * context — value/onChange auto-wired, per-field errors auto-shown, submit blocked until clean.
 * Dotted names (e.g. teammates.0.name) work with FormFieldArray.
 */
export function Form({ onSubmit, errors = {}, rules, asyncRules, initialValues, children, lang, className, ...props }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const [values, setValues] = React.useState(() => initialValues || {});
  const [ruleErrors, setRuleErrors] = React.useState({});
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const setValue = React.useCallback((name, v) => {
    setValues((s) => (String(name).includes(".") ? setPath(s, name, v) : { ...s, [name]: v }));
    setRuleErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  }, []);
  const merged = { ...ruleErrors, ...errors };
  const keys = Object.keys(merged).filter((k) => merged[k]);
  const runRules = (v, ruleMap) => {
    const map = ruleMap || rules;
    if (!map) return {};
    const out = {};
    for (const [name, r] of Object.entries(map)) {
      for (const rule of (Array.isArray(r) ? r : [r])) {
        const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
        const msg = rule === "required"
          ? ((fieldVal == null || String(fieldVal).trim() === "") ? t("requiredField") : null)
          : (typeof rule === "function" ? rule(fieldVal, v) : null);
        if (msg) { out[name] = msg; break; }
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
  return (
    <Ctx.Provider value={ctx}>
      <form {...props} ref={ref} className={cx("cs-form", pending && "is-pending", className)} noValidate
        aria-busy={pending || undefined}
        onSubmit={async (e) => {
          e.preventDefault();
          // FIND-015 / FIND-044 — lock re-entry while async validation / submit runs.
          if (pendingRef.current) return;
          const fd = new FormData(e.currentTarget);
          const v = {}; fd.forEach((val, k) => { v[k] = val; });
          Object.assign(v, values); // controller-registered fields are the source of truth
          const errs = runRules(v);
          if (Object.keys(errs).some((k) => errs[k])) { setRuleErrors(errs); return; }
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
        }}>
        {keys.length ? (
          <div className="cs-form__summary" role="alert">
            <b>{t("summary")}</b>
            <ul>{keys.map((k) => <li key={k}>{merged[k]}</li>)}</ul>
          </div>
        ) : null}
        {children}
      </form>
    </Ctx.Provider>
  );
}

/**
 * CyberSkill FormField — label + control + hint/error line. With `name` inside a Form,
 * it registers with the controller: the single element child is cloned with value/onChange
 * (set valueProp="checked" for Checkbox/Switch/Toggle-shaped children) and the field's
 * context error shows automatically (an explicit `error` prop still wins).
 */
export function FormField({ label, name, required = false, hint, error, valueProp = "value", children, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const ctx = React.useContext(getFormCtx());
  const err = error !== undefined && error !== null ? error : (name && ctx ? ctx.errors[name] : undefined);
  let child = children;
  if (name && ctx && React.isValidElement(children) && React.Children.count(children) === 1) {
    const cur = String(name).includes(".") ? getPath(ctx.values, name) : ctx.values[name];
    const wire = { name };
    wire[valueProp] = cur !== undefined ? cur : (valueProp === "checked" ? false : "");
    wire.onChange = (ev) => {
      const val = ev && ev.target ? (valueProp === "checked" ? ev.target.checked : ev.target.value) : ev;
      ctx.setValue(name, val);
      if (children.props.onChange) children.props.onChange(ev);
    };
    child = React.cloneElement(children, wire);
  }
  return (
    <label ref={ref} className={cx("cs-formfield", err && "has-error", className)}>
      <span className="cs-formfield__label">{label}{required ? <em aria-label={t("required")}> *</em> : null}</span>
      {child}
      {err ? <span className="cs-formfield__error" role="alert">{err}</span> : hint ? <span className="cs-formfield__hint">{hint}</span> : null}
    </label>
  );
}

/**
 * FormFieldArray — manage an array of row objects under `name` in the surrounding Form.
 * children: ({ index, item, remove, path }) => ReactNode
 */
export function FormFieldArray({
  name,
  children,
  label,
  min = 0,
  max = 50,
  addLabel,
  defaultItem,
  className,
  lang,
}) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const ctx = React.useContext(getFormCtx());
  if (!ctx) {
    return <div className="cs-formfield__error" role="alert">FormFieldArray must be used inside Form</div>;
  }
  const list = Array.isArray(getPath(ctx.values, name)) ? getPath(ctx.values, name) : [];
  const blank = () => (defaultItem != null ? (typeof defaultItem === "function" ? defaultItem() : { ...defaultItem }) : {});
  const setList = (next) => ctx.setValue(name, next);
  const add = () => {
    if (list.length >= max) return;
    setList([...list, blank()]);
  };
  const removeAt = (i) => {
    if (list.length <= min) return;
    setList(list.filter((_, idx) => idx !== i));
  };
  return (
    <div ref={ref} className={cx("cs-form-array", className)} data-name={name}>
      {label ? <div className="cs-formfield__label" style={{ marginBottom: 8 }}>{label}</div> : null}
      <div className="cs-form-array__rows">
        {list.map((item, index) => (
          <div className="cs-form-array__row" key={index} data-index={index}>
            {typeof children === "function"
              ? children({
                  index,
                  item,
                  remove: () => removeAt(index),
                  path: (field) => `${name}.${index}.${field}`,
                })
              : children}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="cs-button cs-button--secondary cs-button--sm"
        onClick={add}
        disabled={list.length >= max}
        style={{ marginTop: 8 }}
      >
        {addLabel || (L === "vi" ? "Thêm dòng" : "Add row")}
      </button>
    </div>
  );
}

/**
 * FormWizard — multi-step controller wrapping Form context without a nested <form>.
 * Each step may declare `rules` and a `render()` body of FormFields.
 */
export function FormWizard({
  steps = [],
  initialValues,
  onComplete,
  lang,
  className,
  nextLabel,
  backLabel,
  finishLabel,
}) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState(() => initialValues || {});
  const [ruleErrors, setRuleErrors] = React.useState({});
  const [pending, setPending] = React.useState(false);
  const setValue = React.useCallback((name, v) => {
    setValues((s) => (String(name).includes(".") ? setPath(s, name, v) : { ...s, [name]: v }));
    setRuleErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  }, []);
  const runRules = React.useCallback((v, ruleMap) => {
    if (!ruleMap) return {};
    const out = {};
    for (const [name, r] of Object.entries(ruleMap)) {
      for (const rule of (Array.isArray(r) ? r : [r])) {
        const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
        const msg = rule === "required"
          ? ((fieldVal == null || String(fieldVal).trim() === "") ? t("requiredField") : null)
          : (typeof rule === "function" ? rule(fieldVal, v) : null);
        if (msg) { out[name] = msg; break; }
      }
    }
    return out;
  }, [t]);
  const current = steps[step] || {};
  const ctx = { values, setValue, setValues, errors: ruleErrors, pending, runRules, setRuleErrors, t, L };
  const keys = Object.keys(ruleErrors).filter((k) => ruleErrors[k]);
  const goNext = async () => {
    const errs = runRules(values, current.rules);
    if (Object.keys(errs).some((k) => errs[k])) { setRuleErrors(errs); return; }
    setRuleErrors({});
    if (step >= steps.length - 1) {
      setPending(true);
      try { onComplete && onComplete(values); }
      finally { setPending(false); }
      return;
    }
    setStep((s) => s + 1);
  };
  const goBack = () => {
    setRuleErrors({});
    setStep((s) => Math.max(0, s - 1));
  };
  const Ctx = getFormCtx();
  return (
    <Ctx.Provider value={ctx}>
      <div ref={ref} className={cx("cs-form-wizard", className)} data-step={step}>
        <ol className="cs-form-wizard__steps" style={{ display: "flex", gap: 10, listStyle: "none", padding: 0, margin: "0 0 16px", flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <li key={s.id || i} style={{
              font: "700 11px/1 var(--cs-font-family-ui)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: i === step ? "var(--cs-color-brand-umber)" : "var(--cs-color-text-primary)",
              opacity: i === step ? 1 : 0.55,
            }}>
              {i + 1}. {s.title || s.id || `Step ${i + 1}`}
            </li>
          ))}
        </ol>
        {keys.length ? (
          <div className="cs-form__summary" role="alert">
            <b>{t("summary")}</b>
            <ul>{keys.map((k) => <li key={k}>{ruleErrors[k]}</li>)}</ul>
          </div>
        ) : null}
        <div className="cs-form-wizard__body">
          {typeof current.render === "function" ? current.render({ values, step, setValue }) : null}
        </div>
        <div className="cs-form-wizard__nav" style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button type="button" className="cs-button cs-button--secondary cs-button--sm" onClick={goBack} disabled={step === 0 || pending}>
            {backLabel || (L === "vi" ? "Quay lại" : "Back")}
          </button>
          <button type="button" className="cs-button cs-button--sm" onClick={goNext} disabled={pending}>
            {step >= steps.length - 1
              ? (finishLabel || (L === "vi" ? "Hoàn tất" : "Finish"))
              : (nextLabel || (L === "vi" ? "Tiếp" : "Next"))}
          </button>
        </div>
      </div>
    </Ctx.Provider>
  );
}
