import { Field as BaseField } from '@base-ui/react/field';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type SwitchProps = Omit<BaseSwitch.Root.Props, 'className' | 'children'> & {
  /** Class for the row (track + label + description). */
  className?: string;
  /** Visible label beside the switch. Clicking it toggles the switch. */
  label: ReactNode;
  /** Help text under the label, announced with it. */
  description?: ReactNode;
};

/** An on/off setting that applies immediately. For a choice that is saved with a form, prefer `Checkbox`. */
export function Switch({ label, description, className, disabled, ...props }: SwitchProps) {
  return (
    <BaseField.Root disabled={disabled} data-control="switch" className={cx('cs-choice', className)}>
      <BaseField.Label className="cs-choice-label">
        <BaseSwitch.Root {...props} disabled={disabled} className="cs-switch">
          <BaseSwitch.Thumb className="cs-switch-thumb" />
        </BaseSwitch.Root>
        <span className="cs-choice-text">{label}</span>
      </BaseField.Label>
      {description && <BaseField.Description className="cs-choice-description">{description}</BaseField.Description>}
    </BaseField.Root>
  );
}
