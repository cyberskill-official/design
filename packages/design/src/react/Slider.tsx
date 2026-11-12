import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type SliderMark = number | { value: number; label?: ReactNode };

export type SliderProps = Omit<BaseSlider.Root.Props, 'className' | 'children'> & {
  className?: string;
  /** Visible label above the track; names the thumb of a single slider. */
  label?: ReactNode;
  /** Show the formatted value(s) next to the label. */
  showValue?: boolean;
  /**
   * Accessible name of each thumb, in order. Required for a range (two thumbs), e.g. `['Minimum price', 'Maximum price']`,
   * and for a single slider without `label`.
   */
  thumbLabels?: string[];
  /** Tick marks along the track; marks with a `label` also get text under it. */
  marks?: SliderMark[];
  /** Locale of the shown value. Fixed to `en-US` by default (not the runtime locale), so server and client render the same text. */
  locale?: BaseSlider.Root.Props['locale'];
};

/** Single value or range (pass an array to `value`/`defaultValue`). Arrow keys step, Page Up/Down take large steps. */
export function Slider({ label, showValue = label != null, thumbLabels, marks, min = 0, max = 100, value, defaultValue, locale = 'en-US', className, ...props }: SliderProps) {
  const initial = value ?? defaultValue;
  const thumbs = Array.isArray(initial) ? initial.length : 1;
  const points = marks?.map(m => (typeof m === 'number' ? { value: m, label: undefined } : m));
  const at = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const labelled = points?.filter(p => p.label != null) ?? [];
  return (
    <BaseSlider.Root {...props} locale={locale} min={min} max={max} value={value} defaultValue={defaultValue} className={cx('cs-slider', className)}>
      {(label != null || showValue) && (
        <div className="cs-slider-header">
          {label != null && <BaseSlider.Label className="cs-slider-label">{label}</BaseSlider.Label>}
          {showValue && <BaseSlider.Value className="cs-slider-value">{formatted => formatted.join(' – ')}</BaseSlider.Value>}
        </div>
      )}
      <BaseSlider.Control className="cs-slider-control">
        <BaseSlider.Track className="cs-slider-track">
          <BaseSlider.Indicator className="cs-slider-indicator" />
          {points?.map(p => <span key={p.value} className="cs-slider-mark" style={{ insetInlineStart: at(p.value) }} aria-hidden="true" />)}
          {Array.from({ length: thumbs }, (_, i) => (
            <BaseSlider.Thumb key={i} index={i} aria-label={thumbLabels?.[i]} className="cs-slider-thumb" />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
      {labelled.length > 0 && (
        <div className="cs-slider-mark-labels" aria-hidden="true">
          {labelled.map(p => (
            // End labels align to the track edge instead of hanging past it.
            <span key={p.value} className="cs-slider-mark-label" style={{ insetInlineStart: at(p.value), translate: p.value <= min ? '0' : p.value >= max ? '-100%' : '-50%' }}>
              {p.label}
            </span>
          ))}
        </div>
      )}
    </BaseSlider.Root>
  );
}
