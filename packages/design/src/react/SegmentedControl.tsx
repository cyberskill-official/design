import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type SegmentedControlItem<Value extends string = string> = { value: Value; label: ReactNode; disabled?: boolean };

export type SegmentedControlProps<Value extends string = string> = Omit<
  BaseToggleGroup.Props<Value>,
  'className' | 'value' | 'defaultValue' | 'onValueChange' | 'multiple' | 'children'
> & {
  className?: string;
  /** Segments in display order (2 to 5 short labels work best). */
  items: SegmentedControlItem<Value>[];
  /** Selected segment (controlled). */
  value?: Value;
  /** Initially selected segment (uncontrolled). Defaults to the first item. */
  defaultValue?: Value;
  /** Called with the newly selected value. One segment always stays selected. */
  onValueChange?: (value: Value) => void;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name of the group, e.g. "View" / "Chế độ xem". Required: the control has no visible label. */
  label: string;
};

/** Switches between a few views or modes of the same content. Arrow keys move between segments. */
export function SegmentedControl<Value extends string = string>({ items, value, defaultValue, onValueChange, size = 'md', label, className, ...props }: SegmentedControlProps<Value>) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? items[0]?.value);
  const selected = value ?? uncontrolled;
  return (
    <BaseToggleGroup<Value>
      {...props}
      aria-label={label}
      value={selected === undefined ? [] : [selected]}
      onValueChange={next => {
        const nextValue = next[0];
        if (nextValue === undefined) return; // pressing the selected segment again must not clear the selection
        setUncontrolled(nextValue);
        onValueChange?.(nextValue);
      }}
      data-size={size}
      className={cx('cs-segmented-control', className)}
    >
      {items.map(item => (
        <BaseToggle key={item.value} value={item.value} disabled={item.disabled} className="cs-segmented-control-item">
          <span className="cs-segmented-control-label">{item.label}</span>
        </BaseToggle>
      ))}
    </BaseToggleGroup>
  );
}
