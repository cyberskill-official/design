import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { cx } from '../utils/cx';
import { Field, type FieldProps } from './Field';

export type OtpFieldProps = Omit<BaseOTPField.Root.Props, 'className' | 'length' | 'onValueComplete'> &
  Pick<FieldProps, 'label' | 'hideLabel' | 'description' | 'error' | 'optionalLabel'> & {
    /** Class for the row of boxes. */
    className?: string;
    fieldClassName?: string;
    /** Number of boxes. */
    length?: number;
    /** Called once every box is filled (typed or pasted), e.g. to verify the code. */
    onComplete?: BaseOTPField.Root.Props['onValueComplete'];
    /** Accessible name of boxes 2…N (box 1 uses `label`). Pass Vietnamese text in Vietnamese UIs. */
    slotLabel?: (position: number, length: number) => string;
  };

/** One-time code input: N single-character boxes. Focus moves on as you type; pasting a whole code fills every box. */
export function OtpField({
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
  length = 6,
  onComplete,
  slotLabel = (position, total) => `Character ${position} of ${total}`,
  ...props
}: OtpFieldProps) {
  return (
    <Field label={label} hideLabel={hideLabel} description={description} error={error} optionalLabel={optionalLabel} required={required} disabled={disabled} name={name} className={fieldClassName}>
      <BaseOTPField.Root {...props} length={length} onValueComplete={onComplete} required={required} disabled={disabled} name={name} className={cx('cs-otp-field', className)}>
        {Array.from({ length }, (_, i) => (
          <BaseOTPField.Input key={i} aria-label={i === 0 ? undefined : slotLabel(i + 1, length)} className="cs-otp-field-input" />
        ))}
      </BaseOTPField.Root>
    </Field>
  );
}
