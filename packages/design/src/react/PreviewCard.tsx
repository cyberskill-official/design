import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { cx } from '../utils/cx';
import { ThemedPortal } from './ThemeScope';

export type PreviewCardProps = BasePreviewCard.Root.Props;
/** Holds the open state. Controlled (`open` + `onOpenChange`) or uncontrolled. */
export function PreviewCard(props: PreviewCardProps) {
  return <BasePreviewCard.Root {...props} />;
}

export type PreviewCardTriggerProps = Omit<BasePreviewCard.Trigger.Props, 'className'> & { className?: string };
/**
 * The link that shows the card on hover or keyboard focus, after `delay` (600ms); it hides `closeDelay` (300ms) after leaving.
 * Keep it a real link to the full page: touch and screen reader users never see the card.
 */
export function PreviewCardTrigger({ className, ...props }: PreviewCardTriggerProps) {
  return <BasePreviewCard.Trigger {...props} className={cx('cs-preview-card-trigger', className)} />;
}

export type PreviewCardContentProps = Omit<BasePreviewCard.Popup.Props, 'className'> &
  Pick<BasePreviewCard.Positioner.Props, 'side' | 'align' | 'sideOffset'> & { className?: string };

/** The floating card, portalled and positioned against the trigger. Put only supplementary details in it. */
export function PreviewCardContent({ side = 'bottom', align = 'center', sideOffset = 8, className, ...props }: PreviewCardContentProps) {
  return (
    <ThemedPortal part={BasePreviewCard.Portal}>
      <BasePreviewCard.Positioner side={side} align={align} sideOffset={sideOffset} className="cs-preview-card-positioner">
        <BasePreviewCard.Popup {...props} className={cx('cs-preview-card', className)} />
      </BasePreviewCard.Positioner>
    </ThemedPortal>
  );
}
