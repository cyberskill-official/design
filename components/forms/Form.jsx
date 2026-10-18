import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

// Lazy context — bundle evaluates modules before React is loaded on some gate pages.
let FormCtx;
function getFormCtx() {
  if (!FormCtx) FormCtx = React.createContext(null);
  return FormCtx;
}

// Row keys are controller metadata, never fields in submitted values. Keep keys
// per array occurrence so even repeated references can have independent state.
const arrayRowKeys = new WeakMap();
let nextRowKey = 0;
function rowKeys(array) {
  if (!arrayRowKeys.has(array)) arrayRowKeys.set(array, Array.from(array, () => ++nextRowKey));
  const keys = arrayRowKeys.get(array);
  while (keys.length < array.length) keys.push(++nextRowKey);
  return keys;
}
function clonePathContainer(value) {
  if (!Array.isArray(value)) return { ...(value || {}) };
  const clone = [...value];
  arrayRowKeys.set(clone, [...rowKeys(value)]);
  return clone;
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
  const root = clonePathContainer(obj);
  let cur = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    const nextKey = parts[i + 1];
    const nextIsIndex = /^\d+$/.test(nextKey);
    const existing = cur[p];
    const clone = existing == null
      ? (nextIsIndex ? [] : {})
      : clonePathContainer(existing);
    cur[p] = clone;
    cur = clone;
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}

// Values and validation belong to one transition when array indices change.
function useFormController(seed) {
  const [state, setState] = React.useState(() => ({ values: seed || {}, errors: {} }));
  const setValues = React.useCallback(change => setState(current => ({
    ...current, values: typeof change === "function" ? change(current.values) : change,
  })), []);
  const setRuleErrors = React.useCallback(change => setState(current => ({
    ...current, errors: typeof change === "function" ? change(current.errors) : change,
  })), []);
  const updateArray = React.useCallback((name, change) => setState(current => {
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

/**
 * CyberSkill Form — semantic form + optional controller (v3.7).
 * Plain mode (unchanged): named native fields are collected via FormData into onSubmit(values);
 * `errors` renders the bilingual summary. Controller mode: pass `rules` (name → "required" |
 * fn(value, values) => msg|null | array of those); FormField children with `name` register via
 * context — value/onChange auto-wired, per-field errors auto-shown, submit blocked until clean.
 * Dotted names (e.g. teammates.0.name) work with FormFieldArray.
 */
export function Form({ onSubmit, onReset, errors = {}, rules, asyncRules, initialValues, children, lang, className, ...props }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const initialSeed = React.useRef(initialValues || {});
  const { values, ruleErrors, setValues, setRuleErrors, updateArray } = useFormController(initialSeed.current);
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const lifecycle = React.useRef(0);
  React.useEffect(() => () => { lifecycle.current++; }, []);
  const [submissionError, setSubmissionError] = React.useState(null);
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
  return (
    <Ctx.Provider value={ctx}>
      <form {...props} ref={ref} className={cx("cs-form", pending && "is-pending", className)} noValidate
        aria-busy={pending || undefined}
        onReset={(event) => {
          onReset?.(event);
          if (event.defaultPrevented) return;
          lifecycle.current++;
          pendingRef.current = false;
          setPending(false);
          setValues(initialSeed.current);
          setRuleErrors({});
          setSubmissionError(null);
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          // FIND-015 / FIND-044 — lock re-entry while async validation / submit runs.
          if (pendingRef.current) return;
          setSubmissionError(null);
          const fd = new FormData(e.currentTarget);
          const v = {}; fd.forEach((val, k) => { v[k] = val; });
          Object.assign(v, values); // controller-registered fields are the source of truth
          const errs = runRules(v);
          if (Object.keys(errs).some((k) => errs[k])) { setRuleErrors(errs); return; }
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
        }}>
        {keys.length || submissionError ? (
          <div className="cs-form__summary" role="alert">
            <b>{t("summary")}</b>
            <ul>{submissionError ? <li>{submissionError}</li> : null}{keys.map((k) => <li key={k}>{merged[k]}</li>)}</ul>
          </div>
        ) : null}
        <fieldset disabled={pending} style={{ display: "contents" }}>{children}</fieldset>
      </form>
    </Ctx.Provider>
  );
}

/**
 * CyberSkill FormField — label + control + hint/error line. With `name` inside a Form,
 * it registers with the controller: the single element child is cloned with value/onChange
 * (set valueProp="checked" for Checkbox/Switch, "pressed" for Toggle) and the field's
 * context error shows automatically (an explicit `error` prop still wins).
 */
export function FormField({ label, name, required = false, hint, error, valueProp = "value", children, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("Form", L);
  const autoId = React.useId();
  const ctx = React.useContext(getFormCtx());
  const err = error !== undefined && error !== null ? error : (name && ctx ? ctx.errors[name] : undefined);
  const hasError = Boolean(err) || err === 0;
  const singleElement = React.isValidElement(children) && React.Children.count(children) === 1;
  const isNativeControl = singleElement && typeof children.type === "string" && /^(input|select|textarea)$/i.test(children.type);
  const controlId = isNativeControl ? (children.props.id ?? autoId) : undefined;
  let child = children;
  if (singleElement) {
    const wire = {};
    if (isNativeControl && children.props.id === undefined) wire.id = controlId;
    if (name && ctx) {
      const cur = String(name).includes(".") ? getPath(ctx.values, name) : ctx.values[name];
      wire.name = name;
      wire[valueProp] = cur !== undefined ? cur : (valueProp === "checked" || valueProp === "pressed" ? false : "");
      wire.onChange = (ev) => {
        const val = ev && ev.target ? (valueProp === "checked" ? ev.target.checked : ev.target.value) : ev;
        ctx.setValue(name, val);
        if (children.props.onChange) children.props.onChange(ev);
      };
    }
    if (Object.keys(wire).length) child = React.cloneElement(children, wire);
  }
  const LabelTag = controlId ? "label" : "span";
  return (
    <div ref={ref} className={cx("cs-formfield", hasError && "has-error", className)}>
      <LabelTag className="cs-formfield__label" htmlFor={controlId}>{label}{required ? <em aria-label={t("required")}> *</em> : null}</LabelTag>
      {child}
      {hasError ? <span className="cs-formfield__error" role="alert">{err}</span> : (hint || hint === 0) ? <span className="cs-formfield__hint">{hint}</span> : null}
    </div>
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
    return <div ref={ref} className="cs-formfield__error" role="alert">{t("arrayContext")}</div>;
  }
  const list = Array.isArray(getPath(ctx.values, name)) ? getPath(ctx.values, name) : [];
  const blank = () => (defaultItem != null ? (typeof defaultItem === "function" ? defaultItem() : { ...defaultItem }) : {});
  const updateList = (change) => ctx.updateArray(name, change);
  const add = () => {
    if (list.length >= max) return;
    const item = blank();
    updateList(current => {
      if (current.length >= max) return current;
      const next = [...current, item];
      arrayRowKeys.set(next, [...rowKeys(current), ++nextRowKey]);
      return next;
    });
  };
  const removeAt = (i) => {
    const target = list[i];
    const targetKey = rowKeys(list)[i];
    updateList(current => {
      if (current.length <= min) return current;
      const index = rowKeys(current).indexOf(targetKey);
      if (index < 0 || current[index] !== target) return current;
      const next = current.filter((_, idx) => idx !== index);
      arrayRowKeys.set(next, rowKeys(current).filter((_, idx) => idx !== index));
      return next;
    });
  };
  return (
    <div ref={ref} className={cx("cs-form-array", className)} data-name={name}>
      {(label || label === 0) ? <div className="cs-formfield__label" style={{ marginBottom: 8 }}>{label}</div> : null}
      <div className="cs-form-array__rows">
        {list.map((item, index) => (
          <div className="cs-form-array__row" key={rowKeys(list)[index]} data-index={index}>
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
        {addLabel || t("addRow")}
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
  const { values, ruleErrors, setValues, setRuleErrors, updateArray } = useFormController(initialValues);
  const [pending, setPending] = React.useState(false);
  const pendingRef = React.useRef(false);
  const [submissionError, setSubmissionError] = React.useState(null);
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
  const ctx = { values, setValue, setValues, updateArray, errors: ruleErrors, pending, runRules, setRuleErrors, t, L };
  const keys = Object.keys(ruleErrors).filter((k) => ruleErrors[k]);
  const goNext = async () => {
    if (pendingRef.current) return;
    setSubmissionError(null);
    const errs = runRules(values, current.rules);
    if (Object.keys(errs).some((k) => errs[k])) { setRuleErrors(errs); return; }
    setRuleErrors({});
    if (step >= steps.length - 1) {
      pendingRef.current = true;
      setPending(true);
      try { await onComplete?.(values); }
      catch (error) { setSubmissionError(String(error && error.message || error)); }
      finally { pendingRef.current = false; setPending(false); }
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
  return (
    <Ctx.Provider value={ctx}>
      <div ref={ref} className={cx("cs-form-wizard", className)} data-step={step} aria-busy={pending || undefined}>
        <ol className="cs-form-wizard__steps" style={{ display: "flex", gap: 10, listStyle: "none", padding: 0, margin: "0 0 16px", flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <li key={s.id || i} style={{
              font: "700 11px/1 var(--cs-font-family-ui)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: i === step ? "var(--cs-color-brand-umber)" : "var(--cs-color-text-primary)",
              opacity: i === step ? 1 : 0.55,
            }}>
              {i + 1}. {s.title || s.id || `${t("step")} ${i + 1}`}
            </li>
          ))}
        </ol>
        {keys.length || submissionError ? (
          <div className="cs-form__summary" role="alert">
            <b>{t("summary")}</b>
            <ul>{submissionError ? <li>{submissionError}</li> : null}{keys.map((k) => <li key={k}>{ruleErrors[k]}</li>)}</ul>
          </div>
        ) : null}
        <div className="cs-form-wizard__body">
          <fieldset disabled={pending} style={{ display: "contents" }}>
            {typeof current.render === "function" ? current.render({ values, step, setValue }) : null}
          </fieldset>
        </div>
        <div className="cs-form-wizard__nav" style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button type="button" className="cs-button cs-button--secondary cs-button--sm" onClick={goBack} disabled={step === 0 || pending}>
            {backLabel || t("back")}
          </button>
          <button type="button" className="cs-button cs-button--sm" onClick={goNext} disabled={pending}>
            {step >= steps.length - 1
              ? (finishLabel || t("finish"))
              : (nextLabel || t("next"))}
          </button>
        </div>
      </div>
    </Ctx.Provider>
  );
}
