import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { Minus, Plus } from '@phosphor-icons/react';
import type { Ref } from 'react';
import { cx } from '../utils/cx';
import { Field, type FieldProps } from './Field';

export type NumberFieldProps = Omit<BaseNumberField.Root.Props, 'className'> &
  Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
    /** Class for the stepper box. */
    className?: string;
    fieldClassName?: string;
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    /** Ref to the text input. */
    ref?: Ref<HTMLInputElement>;
    /** Accessible names of the − and + buttons. Pass Vietnamese text in Vietnamese UIs. */
    decrementLabel?: string;
    incrementLabel?: string;
  };

/**
 * Labelled number input with − / + steppers. Arrow keys step by `step`, Shift+Arrow by `largeStep`.
 * `format` takes `Intl.NumberFormat` options, e.g. `{ style: 'currency', currency: 'VND' }` with `locale="vi-VN"`.
 */
export function NumberField({
  label,
  hideLabel,
  description,
  error,
  optionalLabel,
  required,
  disabled,
  name,
  fieldClassName,
  className,
  size = 'md',
  placeholder,
  ref,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  ...props
}: NumberFieldProps) {
  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} optionalLabel={optionalLabel} required={required} disabled={disabled} name={name} className={fieldClassName}>
      <BaseNumberField.Root {...props} required={required} disabled={disabled} name={name} className="cs-number-field">
        <BaseNumberField.Group data-size={size} className={cx('cs-input-group', 'cs-number-field-group', className)}>
          <BaseNumberField.Decrement aria-label={decrementLabel} className="cs-number-field-step">
            <Minus aria-hidden="true" />
          </BaseNumberField.Decrement>
          <BaseNumberField.Input ref={ref} placeholder={placeholder} data-size={size} className="cs-input cs-number-field-input" />
          <BaseNumberField.Increment aria-label={incrementLabel} className="cs-number-field-step">
            <Plus aria-hidden="true" />
          </BaseNumberField.Increment>
        </BaseNumberField.Group>
      </BaseNumberField.Root>
    </Field>
  );
}
