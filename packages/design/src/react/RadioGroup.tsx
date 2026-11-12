import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type RadioGroupProps<Value = string> = Omit<BaseRadioGroup.Props<Value>, 'className'> & {
  className?: string;
  /** Visible group label (rendered as the fieldset legend). */
  label: ReactNode;
  /** Help text under the group label. */
  description?: ReactNode;
  /** Error message for the group (e.g. "Choose a billing cycle"). Marks it invalid. */
  error?: ReactNode;
  /** `Radio` options. */
  children: ReactNode;
};

/** One choice from a short, visible list (2 to 6 options). Arrow keys move the selection; use `Select` for longer lists. */
export function RadioGroup<Value = string>({ label, description, error, name, className, disabled, children, ...props }: RadioGroupProps<Value>) {
  const isInvalid = error != null && error !== false;
  return (
    <BaseField.Root name={name} invalid={isInvalid} disabled={disabled} className={cx('cs-choice-group', className)}>
      <BaseFieldset.Root render={<BaseRadioGroup<Value> {...props} disabled={disabled} />} className="cs-choice-group-set">
        <BaseFieldset.Legend className="cs-choice-group-legend">{label}</BaseFieldset.Legend>
        {description && <BaseField.Description className="cs-choice-group-description">{description}</BaseField.Description>}
        {children}
      </BaseFieldset.Root>
      {isInvalid && <BaseField.Error className="cs-choice-error" match>{error}</BaseField.Error>}
    </BaseField.Root>
  );
}

export type RadioProps<Value = string> = Omit<BaseRadio.Root.Props<Value>, 'className' | 'children'> & {
  /** Class for the row (dot + label + description). */
  className?: string;
  /** Visible label beside the dot. Clicking it selects the option. */
  label: ReactNode;
  /** Help text under the label, announced with it. */
  description?: ReactNode;
};

/** One option of a `RadioGroup`. */
export function Radio<Value = string>({ label, description, className, disabled, ...props }: RadioProps<Value>) {
  return (
    <BaseField.Item disabled={disabled} className={cx('cs-choice', className)}>
      <BaseField.Label className="cs-choice-label">
        <BaseRadio.Root {...props} disabled={disabled} className="cs-radio">
          <BaseRadio.Indicator className="cs-radio-indicator" />
        </BaseRadio.Root>
        <span className="cs-choice-text">{label}</span>
      </BaseField.Label>
      {description && <BaseField.Description className="cs-choice-description">{description}</BaseField.Description>}
    </BaseField.Item>
  );
}
