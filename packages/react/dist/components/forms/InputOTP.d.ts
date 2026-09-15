/** One-time-code input: N digit boxes with auto-advance, backspace and paste.
 *  Controlled (value/onChange) or uncontrolled. onComplete fires at full length. */
export interface InputOTPProps {
  /** Box count. Default 6. */
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
export const InputOTP: React.ForwardRefExoticComponent<
  InputOTPProps & React.RefAttributes<HTMLElement>
>;
