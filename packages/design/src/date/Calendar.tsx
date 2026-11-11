import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { DayPicker, getDefaultClassNames, useDayPicker, type ChevronProps, type DayPickerProps, type Matcher, type NavProps } from 'react-day-picker';
import { cx } from '../utils/cx';

// Every react-day-picker part and modifier gets our class: `day_button` → `cs-calendar-day-button`. We ship no rdp CSS.
const classNames = Object.fromEntries(Object.keys(getDefaultClassNames()).map(key => [key, `cs-calendar-${key.replace(/_/g, '-')}`]));

function Chevron({ orientation, className }: ChevronProps) {
  const Icon = orientation === 'left' ? CaretLeft : orientation === 'right' ? CaretRight : CaretDown;
  return <Icon aria-hidden="true" className={className} />;
}

// rdp's Nav as a labelled group instead of a <nav> landmark: a page with several calendars would repeat "Navigation bar" landmarks.
function Nav({ onPreviousClick, onNextClick, previousMonth, nextMonth, className, 'aria-label': label }: NavProps) {
  const { classNames: cn, labels } = useDayPicker();
  return (
    <div role="group" aria-label={label} className={className}>
      <button type="button" className={cn.button_previous} aria-disabled={previousMonth ? undefined : true} aria-label={labels.labelPrevious(previousMonth)} onClick={e => previousMonth && onPreviousClick?.(e)}>
        <Chevron orientation="left" className={cn.chevron} />
      </button>
      <button type="button" className={cn.button_next} aria-disabled={nextMonth ? undefined : true} aria-label={labels.labelNext(nextMonth)} onClick={e => nextMonth && onNextClick?.(e)}>
        <Chevron orientation="right" className={cn.chevron} />
      </button>
    </div>
  );
}

type Labels = NonNullable<DayPickerProps['labels']>;
// rdp's English label reads "March 15th"; the visible "15" must be a word of the name (voice control, WCAG 2.5.3).
const labelDayButton: Labels['labelDayButton'] = (date, modifiers, _options, dateLib) =>
  `${modifiers.today ? 'Today, ' : ''}${dateLib ? dateLib.format(date, 'EEEE, d MMMM yyyy') : date.toDateString()}${modifiers.selected ? ', selected' : ''}`;

export type CalendarProps = DayPickerProps & {
  /** Earliest selectable day. Days before it are disabled and navigation stops at its month. (rdp's own `min`/`max` count days in a range.) */
  minDate?: Date;
  /** Latest selectable day. Days after it are disabled and navigation stops at its month. */
  maxDate?: Date;
};

/**
 * Month grid on react-day-picker, styled with Ink & Gold tokens. `mode` is `single`, `range` or `multiple`;
 * pass `selected` and `onSelect`. Weeks start on Monday; days of the next and previous month show only in a single-month view. For Vietnamese pass `locale={vi}` from `react-day-picker/locale`
 * (translates month names and the screen-reader labels).
 */
export function Calendar({ minDate, maxDate, disabled, className, classNames: extraClassNames, components, labels, weekStartsOn = 1, numberOfMonths, showOutsideDays = !numberOfMonths || numberOfMonths < 2, ...props }: CalendarProps) {
  const bounds: Matcher[] = [...(minDate ? [{ before: minDate }] : []), ...(maxDate ? [{ after: maxDate }] : [])];
  return (
    <DayPicker
      startMonth={minDate}
      endMonth={maxDate}
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      showOutsideDays={showOutsideDays}
      {...props}
      disabled={disabled === undefined ? bounds : [disabled, ...bounds].flat()}
      className={cx('cs-calendar', className)}
      classNames={{ ...classNames, ...extraClassNames }}
      components={{ Chevron, Nav, ...components }}
      labels={props.locale?.labels?.labelDayButton ? labels : { labelDayButton, ...labels }}
    />
  );
}
