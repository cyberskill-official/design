/** One-time-code input: N digit boxes with auto-advance, backspace, native deletion/cut and paste.
 *  Deletion compacts the remaining digits. Controlled (value/onChange) or uncontrolled. onComplete fires at full length. */
export interface InputOTPProps {
  /** Whole box count. Finite fractions round down; nonpositive counts render no boxes. Nonfinite or unrepresentable counts use 6. */
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  /** Accessible label. Default from the bilingual registry ("One-time code" / "Mã dùng một lần"). */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  disabled?: boolean;
  className?: string;
}
export function InputOTP(props: InputOTPProps): React.ReactElement;
