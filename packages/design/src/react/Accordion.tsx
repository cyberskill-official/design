import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { CaretDown } from '@phosphor-icons/react';
import { cx } from '../utils/cx';

export type AccordionProps = Omit<BaseAccordion.Root.Props, 'className'> & { className?: string };
/** A stack of headed sections that expand and collapse. One open at a time, or several with `multiple`. Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`). */
export function Accordion({ className, ...props }: AccordionProps) {
  return <BaseAccordion.Root {...props} className={cx('cs-accordion', className)} />;
}

export type AccordionItemProps = Omit<BaseAccordion.Item.Props, 'className'> & { className?: string };
/** One section: an `AccordionTrigger` followed by its `AccordionPanel`. Give it a `value` to control it or open it by default. */
export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <BaseAccordion.Item {...props} className={cx('cs-accordion-item', className)} />;
}

export type AccordionTriggerProps = Omit<BaseAccordion.Trigger.Props, 'className'> & { className?: string };
/** The section heading (an `h3`) and the button that toggles it. The chevron turns when open. */
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header className="cs-accordion-header">
      <BaseAccordion.Trigger {...props} className={cx('cs-accordion-trigger', className)}>
        <span className="cs-accordion-label">{children}</span>
        <CaretDown className="cs-accordion-chevron" aria-hidden="true" />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export type AccordionPanelProps = Omit<BaseAccordion.Panel.Props, 'className'> & { className?: string };
/** The section body. Its height animates open and closed. */
export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel {...props} className={cx('cs-accordion-panel', className)}>
      <div className="cs-accordion-content">{children}</div>
    </BaseAccordion.Panel>
  );
}
