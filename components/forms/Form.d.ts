import type { ReactNode } from "react";

/** One validation rule: "required" (bilingual default message) or fn(value, values) → message | null. */
export type FormRule = "required" | ((value: unknown, values: Record<string, unknown>) => string | null | undefined);

/** Semantic form + optional controller. Plain mode: named native fields collected via
 *  FormData into onSubmit(values); `errors` renders the bilingual summary. Controller mode:
 *  `rules` validate on submit (blocking until clean); FormField children with `name`
 *  auto-wire value/onChange + per-field errors via context. Dotted paths work with FormFieldArray. */
export interface FormProps {
  onSubmit?: (values: Record<string, unknown>) => void;
  /** External errors (name → message); merged over rule errors in summary + fields. */
  errors?: Record<string, string | undefined>;
  /** name → rule or rule[]; validated on submit. */
  rules?: Record<string, FormRule | FormRule[]>;
  /** name → async (value, values) => message | null; runs after sync rules pass.
   *  While awaiting, Form sets `is-pending` / `aria-busy`, disables controls via CSS,
   *  and ignores duplicate submits. Context exposes `pending: boolean`. */
  asyncRules?: Record<string, (value: unknown, values: Record<string, unknown>) => Promise<string | null | undefined>>;
  /** Seed for controller-registered fields. */
  initialValues?: Record<string, unknown>;
  children?: ReactNode;
  lang?: string;
  className?: string;
}
export function Form(props: FormProps): React.ReactElement;

/** Label + control + hint/error line. With `name` inside a Form, registers with the
 *  controller: single element child cloned with value/onChange (valueProp="checked"
 *  for checkbox-shaped children); context error auto-shows (explicit `error` wins). */
export interface FormFieldProps {
  label: ReactNode;
  /** Register with the surrounding Form controller under this key (supports dotted paths). */
  name?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  /** Prop carrying the value on the child ("value" default; "checked" for Checkbox/Switch/Toggle). */
  valueProp?: "value" | "checked";
  children?: ReactNode;
  lang?: string;
  className?: string;
}
export function FormField(props: FormFieldProps): React.ReactElement;

export interface FormFieldArrayRenderArgs {
  index: number;
  item: Record<string, unknown>;
  remove: () => void;
  /** Build a dotted field path under this row, e.g. path("name") → teammates.0.name */
  path: (field: string) => string;
}
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
