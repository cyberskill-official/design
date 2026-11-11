import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type FieldProps = Omit<BaseField.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label. Required for accessibility; hide it visually with `hideLabel` if the design must. */
  label: ReactNode;
  hideLabel?: boolean;
  /** Help text under the control. */
  description?: ReactNode;
  /** Error message. Passing it marks the field invalid and shows the message (for form libraries). */
  error?: ReactNode;
  /** Adds a visual marker and `required` semantics are left to the control. */
  required?: boolean;
  /** Text after the label for optional fields, e.g. "Optional" / "Không bắt buộc". */
  optionalLabel?: ReactNode;
  children: ReactNode;
};

/** Label + control + description + error, wired together for screen readers. Wrap any Base UI control. */
export function Field({ label, hideLabel, description, error, required, optionalLabel, className, children, invalid, ...props }: FieldProps) {
  const isInvalid = invalid ?? (error != null && error !== false);
  return (
    <BaseField.Root {...props} invalid={isInvalid} className={cx('cs-field', className)}>
      <BaseField.Label className={cx('cs-field-label', hideLabel && 'cs-visually-hidden')}>
        {label}
        {required && <span className="cs-field-required" aria-hidden="true">*</span>}
        {!required && optionalLabel && <span className="cs-field-optional">{optionalLabel}</span>}
      </BaseField.Label>
      {children}
      {description && <BaseField.Description className="cs-field-description">{description}</BaseField.Description>}
      {error ? (
        <BaseField.Error className="cs-field-error" match>
          {error}
        </BaseField.Error>
      ) : (
        <BaseField.Error className="cs-field-error" />
      )}
    </BaseField.Root>
  );
}

export type InputProps = Omit<BaseInput.Props, 'className' | 'size'> & {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Content inside the box before the text, e.g. an icon or "https://". */
  startAdornment?: ReactNode;
  /** Content inside the box after the text, e.g. a unit, ".cyberskill.world" or a shortcut hint. */
  endAdornment?: ReactNode;
};

/** Text input. Use inside `Field` (or `TextField`) so it gets a label. */
export function Input({ size = 'md', startAdornment, endAdornment, className, ...props }: InputProps) {
  if (!startAdornment && !endAdornment) return <BaseInput {...props} data-size={size} className={cx('cs-input', className)} />;
  return (
    <span className="cs-input-group" data-size={size}>
      {startAdornment && <span className="cs-input-adornment" data-side="start">{startAdornment}</span>}
      <BaseInput {...props} data-size={size} className={cx('cs-input', className)} />
      {endAdornment && <span className="cs-input-adornment" data-side="end">{endAdornment}</span>}
    </span>
  );
}

export type TextFieldProps = Omit<InputProps, 'children'> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & { fieldClassName?: string };

/** The common case: a labelled text input with optional help and error text. */
export function TextField({ label, hideLabel, description, error, optionalLabel, required, disabled, name, fieldClassName, ...inputProps }: TextFieldProps) {
  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} optionalLabel={optionalLabel} required={required} disabled={disabled} name={name} className={fieldClassName}>
      <Input {...inputProps} required={required} />
    </Field>
  );
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & { fieldClassName?: string; className?: string };

/** Multi-line text with the same label, help and error wiring as TextField. */
export function Textarea({ label, hideLabel, description, error, optionalLabel, required, disabled, name, fieldClassName, className, rows = 4, ...props }: TextareaProps) {
  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} optionalLabel={optionalLabel} required={required} disabled={disabled} name={name} className={fieldClassName}>
      <BaseField.Control render={<textarea rows={rows} {...props} />} required={required} className={cx('cs-input', 'cs-textarea', className)} />
    </Field>
  );
}
