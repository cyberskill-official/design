import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { useId, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type FieldsetProps = Omit<BaseFieldset.Root.Props, 'className'> & {
  className?: string;
  /** Heading of the group, read as the group's name. */
  legend: ReactNode;
  /** Help text under the legend, read as the group's description. */
  description?: ReactNode;
};

/** Groups related fields under one legend. `disabled` disables every control inside. */
export function Fieldset({ legend, description, className, children, ...props }: FieldsetProps) {
  const descriptionId = useId();
  return (
    <BaseFieldset.Root aria-describedby={description ? descriptionId : undefined} {...props} className={cx('cs-fieldset', className)}>
      <div className="cs-fieldset-header">
        <BaseFieldset.Legend className="cs-fieldset-legend">{legend}</BaseFieldset.Legend>
        {description && <p id={descriptionId} className="cs-fieldset-description">{description}</p>}
      </div>
      {children}
    </BaseFieldset.Root>
  );
}
