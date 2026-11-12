import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { createContext, useContext, type ReactNode } from 'react';
import { cx } from '../utils/cx';

// Inside a group the group owns the field (name, validation), so each option is a Field.Item, not a Field.Root.
const InCheckboxGroup = createContext(false);

export type CheckboxProps = Omit<BaseCheckbox.Root.Props, 'className' | 'children'> & {
  /** Class for the row (box + label + description). */
  className?: string;
  /** Visible label beside the box. Clicking it toggles the checkbox. */
  label: ReactNode;
  /** Help text under the label, announced with it. */
  description?: ReactNode;
  /** Error message for a standalone checkbox (e.g. "Accept the terms to continue"). Marks it invalid. */
  error?: ReactNode;
};

/** A labelled checkbox. Use alone for a yes/no choice, or inside `CheckboxGroup` for several independent options. */
export function Checkbox({ label, description, error, className, disabled, ...props }: CheckboxProps) {
  const inGroup = useContext(InCheckboxGroup);
  const isInvalid = error != null && error !== false;
  const content = (
    <>
      <BaseField.Label className="cs-choice-label">
        <BaseCheckbox.Root {...props} disabled={disabled} className="cs-checkbox">
          <BaseCheckbox.Indicator
            className="cs-checkbox-indicator"
            render={(indicatorProps, state) => (
              // strokes, not an icon font glyph, so the mark can draw itself (pathLength 1: the dash offset runs 1 to 0)
              <span {...indicatorProps}>
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  {state.indeterminate ? <path key="dash" d="M3 6h6" pathLength={1} /> : <path key="check" d="M2.5 6.25 5 8.75l4.5-5" pathLength={1} />}
                </svg>
              </span>
            )}
          />
        </BaseCheckbox.Root>
        <span className="cs-choice-text">{label}</span>
      </BaseField.Label>
      {description && <BaseField.Description className="cs-choice-description">{description}</BaseField.Description>}
    </>
  );
  if (inGroup) {
    return <BaseField.Item disabled={disabled} className={cx('cs-choice', className)}>{content}</BaseField.Item>;
  }
  return (
    <BaseField.Root invalid={isInvalid} disabled={disabled} className={cx('cs-choice', className)}>
      {content}
      {isInvalid && <BaseField.Error className="cs-choice-error" match>{error}</BaseField.Error>}
    </BaseField.Root>
  );
}

export type CheckboxGroupProps = Omit<BaseCheckboxGroup.Props, 'className'> & {
  className?: string;
  /** Visible group label (rendered as the fieldset legend). */
  label: ReactNode;
  /** Help text under the group label. */
  description?: ReactNode;
  /** Error message for the whole group (e.g. "Pick at least one channel"). Marks it invalid. */
  error?: ReactNode;
  /** Form field name; the checked option values are submitted under it. */
  name?: string;
  /** `Checkbox` options, each with its own `value`. */
  children: ReactNode;
};

/** A labelled set of checkboxes. `value` / `defaultValue` / `onValueChange` hold the array of checked option values. */
export function CheckboxGroup({ label, description, error, name, className, disabled, children, ...props }: CheckboxGroupProps) {
  const isInvalid = error != null && error !== false;
  return (
    <BaseField.Root name={name} invalid={isInvalid} disabled={disabled} className={cx('cs-choice-group', className)}>
      <BaseFieldset.Root render={<BaseCheckboxGroup {...props} disabled={disabled} />} className="cs-choice-group-set">
        <BaseFieldset.Legend className="cs-choice-group-legend">{label}</BaseFieldset.Legend>
        {description && <BaseField.Description className="cs-choice-group-description">{description}</BaseField.Description>}
        <InCheckboxGroup.Provider value={true}>{children}</InCheckboxGroup.Provider>
      </BaseFieldset.Root>
      {isInvalid && <BaseField.Error className="cs-choice-error" match>{error}</BaseField.Error>}
    </BaseField.Root>
  );
}
