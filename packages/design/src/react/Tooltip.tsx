import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type TooltipProviderProps = BaseTooltip.Provider.Props;
/** Shares one open delay across tooltips, so moving between toolbar buttons shows the next tooltip at once. */
export function TooltipProvider(props: TooltipProviderProps) {
  return <BaseTooltip.Provider {...props} />;
}

export type TooltipProps = Omit<BaseTooltip.Root.Props, 'children' | 'handle'> &
  Pick<BaseTooltip.Positioner.Props, 'side' | 'align'> &
  Pick<BaseTooltip.Trigger.Props, 'delay' | 'closeDelay'> & {
    /** Short supplementary text. Never the only place essential information lives. */
    content: ReactNode;
    /** The trigger: one element that forwards `ref` and props, e.g. `<IconButton label="Copy" … />`. It needs its own accessible name. */
    children: ReactElement;
    className?: string;
  };

/**
 * A short label shown on hover and keyboard focus. Visual only: screen readers read the trigger's own name,
 * and touch devices never show it, so put anything essential in visible text or a Popover.
 */
export function Tooltip({ content, children, side = 'top', align = 'center', delay, closeDelay, className, ...props }: TooltipProps) {
  return (
    <BaseTooltip.Root {...props}>
      <BaseTooltip.Trigger render={children} delay={delay} closeDelay={closeDelay} />
      <ThemedPortal part={BaseTooltip.Portal}>
        <BaseTooltip.Positioner side={side} align={align} sideOffset={8} className="cs-tooltip-positioner">
          <BaseTooltip.Popup className={cx('cs-tooltip', className)}>
            <BaseTooltip.Arrow className="cs-tooltip-arrow" />
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </ThemedPortal>
    </BaseTooltip.Root>
  );
}
