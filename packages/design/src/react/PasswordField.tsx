import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { cx } from '../utils/cx';
import { IconButton } from './Button';
import { TextField, type TextFieldProps } from './Field';

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'endAdornment'> & {
  /** Accessible name of the toggle while the password is hidden, e.g. "Hiện mật khẩu". */
  showPasswordLabel?: string;
  /** Accessible name of the toggle while the password is shown, e.g. "Ẩn mật khẩu". */
  hidePasswordLabel?: string;
  /** Start with the password shown. */
  defaultVisible?: boolean;
};

/** TextField for passwords, with a show/hide toggle at the end of the box. Pointer presses on the toggle leave focus and the caret in the input. */
export function PasswordField({
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  defaultVisible = false,
  autoComplete = 'current-password',
  disabled,
  fieldClassName,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(defaultVisible);
  const caret = useRef<{ input: HTMLInputElement; start: number | null; end: number | null }>(null);
  // Chromium moves the caret to the start at the first layout after the input's type changes: run that layout now, then put the caret back
  useLayoutEffect(() => {
    const at = caret.current;
    caret.current = null;
    if (!at || document.activeElement !== at.input) return;
    void at.input.offsetWidth;
    at.input.setSelectionRange(at.start, at.end);
  }, [visible]);
  return (
    <TextField
      // a shown password is plain text: keep it away from spellcheck services and autocorrect
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      {...props}
      autoComplete={autoComplete}
      disabled={disabled}
      type={visible ? 'text' : 'password'}
      fieldClassName={cx('cs-password-field', fieldClassName)}
      endAdornment={
        <IconButton
          variant="ghost"
          size="sm"
          className="cs-password-field-toggle"
          label={visible ? hidePasswordLabel : showPasswordLabel}
          icon={visible ? <EyeSlash /> : <Eye />}
          // no aria-pressed: the name already says what the button does now ("Hide password, pressed" would say it twice, confusingly)
          disabled={disabled}
          onMouseDown={event => event.preventDefault()} // a pointer press keeps focus (and the caret) in the input
          onClick={event => {
            const input = event.currentTarget.closest('.cs-input-group')?.querySelector('input');
            if (input) caret.current = { input, start: input.selectionStart, end: input.selectionEnd };
            setVisible(v => !v);
          }}
        />
      }
    />
  );
}
