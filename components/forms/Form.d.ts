/** FormField error/hint and FormFieldArray label preserve numeric 0. An explicit zero error takes precedence over the hint and context error and applies error styling. Empty error content retains the existing hint fallback. */
import type { ReactNode, FormEventHandler } from "react";

/** One validation rule: "required" (bilingual default message) or fn(value, values) → message | null. */
export type FormRule = "required" | ((value: unknown, values: Record<string, unknown>) => string | null | undefined);

/** Semantic form + optional controller. Plain mode: named native fields collected via
 *  FormData into onSubmit(values); `errors` renders the bilingual summary. Controller mode:
 *  `rules` validate on submit (blocking until clean); FormField children with `name`
 *  auto-wire value/onChange + per-field errors via context. Dotted paths work with FormFieldArray. */
export interface FormProps {
  /** Pending lasts through the returned promise; rejection appears in the summary and permits retry. */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** Native reset restores the mount-time controller seed and clears internal errors.
   * preventDefault cancels both native and controller reset. */
  onReset?: FormEventHandler<HTMLFormElement>;
  /** External errors (name → message); merged over rule errors in summary + fields. */
  errors?: Record<string, string | undefined>;
  /** name → rule or rule[]; validated on submit. */
  rules?: Record<string, FormRule | FormRule[]>;
  /** name → async (value, values) => message | null; runs after sync rules pass.
   *  While awaiting, Form sets `is-pending` / `aria-busy`, disables native fields via fieldset,
   *  and ignores duplicate submits. Unmount invalidates pending validation so
   *  later validators/onSubmit are not started. Already-started work is not aborted.
   *  Context exposes `pending: boolean`. */
  asyncRules?: Record<string, (value: unknown, values: Record<string, unknown>) => Promise<string | null | undefined>>;
  /** Mount-time seed for controller fields, also restored by native reset. */
  initialValues?: Record<string, unknown>;
  children?: ReactNode;
  lang?: string;
  className?: string;
}
export function Form(props: FormProps): React.ReactElement;

/** Label + control + hint/error line. With `name` inside a Form, registers with the
 *  controller: single element child cloned with value/onChange (valueProp="checked"
 *  for Checkbox/Switch, "pressed" for Toggle); context error auto-shows (explicit `error` wins). */
export interface FormFieldProps {
  label: ReactNode;
  /** Register with the surrounding Form controller under this key (supports dotted paths). */
  name?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  /** Prop carrying the value ("value" default; "checked" for Checkbox/Switch; "pressed" for Toggle).
   *  Unset checked/pressed fields receive false. */
  valueProp?: "value" | "checked" | "pressed";
  children?: ReactNode;
  lang?: string;
  className?: string;
}
export function FormField(props: FormFieldProps): React.ReactElement;

export interface FormFieldArrayRenderArgs {
  index: number;
  item: Record<string, unknown>;
  /** Removes this rendered row occurrence from current state, respecting min.
   * Duplicate object references are separate occurrences.
   *  A retained callback is a no-op if its item was removed or replaced. */
  remove: () => void;
  /** Build a dotted field path under this row, e.g. path("name") → teammates.0.name */
  path: (field: string) => string;
}
/** Row child identity survives internal add/remove and dotted field edits.
 * Keys are internal metadata and do not appear in submitted values. Successful
 * structural edits clear internal errors for this array subtree; no-op edits do not. */
export interface FormFieldArrayProps {
  name: string;
  label?: ReactNode;
  children: (args: FormFieldArrayRenderArgs) => ReactNode;
  min?: number;
  max?: number;
  addLabel?: ReactNode;
  defaultItem?: Record<string, unknown> | (() => Record<string, unknown>);
  className?: string;
  lang?: string;
}
export function FormFieldArray(props: FormFieldArrayProps): React.ReactElement;

export interface FormWizardStep {
  id?: string;
  title?: ReactNode;
  rules?: Record<string, FormRule | FormRule[]>;
  render: (ctx: {
    values: Record<string, unknown>;
    step: number;
    setValue: (name: string, value: unknown) => void;
  }) => ReactNode;
}
export interface FormWizardProps {
  steps: FormWizardStep[];
  initialValues?: Record<string, unknown>;
  /** Pending lasts through the returned promise; rejection appears in the summary and permits retry. */
  onComplete?: (values: Record<string, unknown>) => void;
  lang?: string;
  className?: string;
  nextLabel?: ReactNode;
  backLabel?: ReactNode;
  finishLabel?: ReactNode;
}
export function FormWizard(props: FormWizardProps): React.ReactElement;

export function getPath(obj: unknown, path: string): unknown;
export function setPath(obj: unknown, path: string, value: unknown): unknown;
