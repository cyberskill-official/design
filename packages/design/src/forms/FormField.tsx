import { Controller, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form';
import type { ReactElement } from 'react';

type ControllerRender<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>, TTransformedValues> = Parameters<
  ControllerProps<TFieldValues, TName, TTransformedValues>['render']
>[0];

export type FormFieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = ControllerRender<TFieldValues, TName, TTransformedValues> & {
  /** The field's validation message, ready for a component's `error` prop. `undefined` while valid. */
  error: string | undefined;
};

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, 'render'> & {
  render: (props: FormFieldRenderProps<TFieldValues, TName, TTransformedValues>) => ReactElement;
};

/**
 * React Hook Form `Controller` that also hands you the error message for our `error` props.
 * `<FormField control={control} name="email" render={({ field, error }) => <TextField label="Work email" {...field} error={error} />} />`
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({ render, ...props }: FormFieldProps<TFieldValues, TName, TTransformedValues>) {
  return <Controller {...props} render={renderProps => render({ ...renderProps, error: renderProps.fieldState.error?.message })} />;
}
