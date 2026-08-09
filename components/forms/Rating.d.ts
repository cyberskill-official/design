/** Whole-star rating (APG radiogroup: roving tabindex + arrow keys). Controlled
 *  (value/onChange) or uncontrolled (defaultValue). Clicking the current value
 *  clears to 0. readOnly for display. */
export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Star count. Default 5. */
  max?: number;
  readOnly?: boolean;
  /** Accessible label. Default from the bilingual registry ("Rating" / "Đánh giá"). */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function Rating(props: RatingProps): React.ReactElement;
