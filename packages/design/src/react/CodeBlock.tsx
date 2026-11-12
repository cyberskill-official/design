import { Check, Copy } from '@phosphor-icons/react';
import { useEffect, useState, type ReactNode } from 'react';
import { IconButton, type IconButtonProps } from './Button';
import { cx } from '../utils/cx';

export type CopyButtonProps = Omit<IconButtonProps, 'label' | 'icon' | 'value'> & {
  /** Text written to the clipboard. */
  value: string;
  /** Accessible name of the button, e.g. "Copy" / "Sao chép". */
  label?: string;
  /** Announced politely after a successful copy, e.g. "Copied" / "Đã sao chép". */
  copiedLabel?: string;
  /** Called after the text is on the clipboard. */
  onCopy?: (value: string) => void;
};

/**
 * Icon button that copies `value` to the clipboard, swaps to a check mark and announces `copiedLabel` to screen readers.
 * In a toolbar, pass it to `render` so it joins the arrow-key navigation: `<ToolbarButton render={<CopyButton value={text} />} />`.
 */
export function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', onCopy, onClick, variant = 'ghost', size = 'sm', className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      <IconButton
        {...props}
        variant={variant}
        size={size}
        label={label}
        icon={copied ? <Check /> : <Copy />}
        data-copied={copied || undefined}
        className={cx('cs-copy-button', className)}
        onClick={event => {
          onClick?.(event);
          // Clipboard is missing outside secure contexts; a rejected write just leaves the button as it was.
          navigator.clipboard?.writeText(value).then(() => {
            setCopied(true);
            onCopy?.(value);
          }, () => {});
        }}
      />
      <span role="status" className="cs-visually-hidden">{copied ? copiedLabel : ''}</span>
    </>
  );
}

export type CodeBlockProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
  className?: string;
  /** The code, shown as-is (no syntax highlighting) and copied by the copy button. */
  code: string;
  /** File name or caption shown in the header. */
  title?: ReactNode;
  /** Small mono label in the header, e.g. "tsx" or "bash". */
  language?: string;
  /** `raised` sits on the page in both themes; `inverted` is a dark ink surface in both themes. */
  variant?: 'raised' | 'inverted';
  /** Wrap long lines instead of scrolling sideways. */
  wrap?: boolean;
  /** Hide the copy button. */
  hideCopy?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
};

/** Read-only code in a mono font with an optional title, language label and copy button. Long lines scroll sideways unless `wrap`. */
export function CodeBlock({ code, title, language, variant = 'raised', wrap, hideCopy, copyLabel, copiedLabel, className, ...props }: CodeBlockProps) {
  const copy = hideCopy ? null : <CopyButton value={code} label={copyLabel} copiedLabel={copiedLabel} />;
  return (
    // inverted reuses the dark theme's checked color pairs instead of new colors
    <div data-theme={variant === 'inverted' ? 'dark' : undefined} {...props} data-variant={variant} data-wrap={wrap || undefined} className={cx('cs-code-block', className)}>
      {title != null || language ? (
        <div className="cs-code-block-header">
          {title != null && <span className="cs-code-block-title">{title}</span>}
          {language && <span className="cs-code-block-language">{language}</span>}
          {copy}
        </div>
      ) : (
        copy
      )}
      {/* Focusable so keyboard users can scroll long lines sideways. */}
      <pre className="cs-code-block-pre" tabIndex={wrap ? undefined : 0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
