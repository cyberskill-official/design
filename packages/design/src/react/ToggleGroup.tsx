import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { createContext, useContext } from 'react';
import { Toggle, type ToggleProps } from './Toggle';
import { cx } from '../utils/cx';

type ToggleGroupSize = NonNullable<ToggleProps['size']>;
const SizeContext = createContext<ToggleGroupSize>('md');

export type ToggleGroupProps = Omit<BaseToggleGroup.Props, 'className'> & {
  className?: string;
  /** Accessible name of the group, e.g. "Text formatting" / "Định dạng chữ". */
  label: string;
  /** Size of every item: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: ToggleGroupSize;
};

/**
 * A row of toggle buttons sharing one state: pick one (default) or several with `multiple`.
 * `value` / `defaultValue` are arrays of the pressed items' values, also when only one can be pressed.
 * Arrow keys move between items; Tab leaves the group.
 */
export function ToggleGroup({ label, size = 'md', className, ...props }: ToggleGroupProps) {
  return (
    <SizeContext.Provider value={size}>
      <BaseToggleGroup aria-label={label} {...props} data-size={size} className={cx('cs-toggle-group', className)} />
    </SizeContext.Provider>
  );
}

export type ToggleGroupItemProps = Omit<ToggleProps, 'size' | 'value'> & {
  /** Identifies the item in the group's `value`. */
  value: string;
};

/** One toggle in a `ToggleGroup`. Text with an optional `icon`, or icon-only with `label` as its name. */
export function ToggleGroupItem({ className, ...props }: ToggleGroupItemProps) {
  return <Toggle {...props} size={useContext(SizeContext)} className={cx('cs-toggle-group-item', className)} />;
}
