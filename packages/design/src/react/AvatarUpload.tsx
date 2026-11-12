import { Trash, UploadSimple, WarningCircle } from '@phosphor-icons/react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { formatFileSize } from '../utils/format';
import { useControllableState } from '../utils/use-controllable';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { accepts } from './FileUpload';

export type AvatarUploadProps = {
  /** Visible label of the group, e.g. "Profile photo". */
  label: ReactNode;
  description?: ReactNode;
  /** Error for the field (from a form library). A refused file gets its own message. */
  error?: ReactNode;
  /** The photo, controlled: a picked File, the URL of the current photo, or null for none. */
  value?: File | string | null;
  defaultValue?: File | string | null;
  /** Called with the picked file, or null when the photo is removed. */
  onValueChange?: (file: File | null) => void;
  /** Same syntax as the native attribute. */
  accept?: string;
  /** Largest allowed file in bytes, e.g. `2 * 1024 * 1024` for "2 MB". */
  maxSize?: number;
  /** `maxSize` arrives formatted by `formatFileSize`, e.g. "2 MB". */
  tooLargeMessage?: (file: File, maxSize: string) => string;
  wrongTypeMessage?: (file: File) => string;
  chooseLabel?: string;
  replaceLabel?: string;
  removeLabel?: string;
  /** Initials shown while there is no photo, e.g. "TL". */
  fallback?: string;
  /** Submits the picked file with a native form or a Server Action (multipart) under this name. A URL value submits nothing. */
  name?: string;
  disabled?: boolean;
  className?: string;
};

/** Pick one image, see it in a round preview, replace or remove it. Refused files show a linked error message. */
export function AvatarUpload({
  label,
  description,
  error,
  value,
  defaultValue = null,
  onValueChange,
  accept = 'image/png,image/jpeg,image/webp',
  maxSize,
  tooLargeMessage = (file, max) => `${file.name} is larger than ${max}.`,
  wrongTypeMessage = file => `${file.name} is not an accepted file type.`,
  chooseLabel = 'Choose photo',
  replaceLabel = 'Replace photo',
  removeLabel = 'Remove photo',
  fallback,
  name,
  disabled,
  className,
}: AvatarUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const chooseRef = useRef<HTMLButtonElement>(null);
  const [photo, setUncontrolled] = useControllableState(value, defaultValue, null);
  const [rejected, setRejected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>();
  const file = photo instanceof File ? photo : null;

  // One object URL per picked file, revoked when the file changes or the component unmounts.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreview(undefined); // never render a revoked URL
    };
  }, [file]);

  // With a name, the hidden input holds the shown file, so a native form submits it.
  const syncInput = (keep: File | null) => {
    const dt = new DataTransfer();
    if (keep) dt.items.add(keep);
    if (inputRef.current) inputRef.current.files = dt.files;
  };
  useEffect(() => {
    if (name) syncInput(file);
  }, [file, name]);

  function pick(picked: File | undefined) {
    if (!picked) return;
    const problem = !accepts(picked, accept) ? wrongTypeMessage(picked) : maxSize != null && picked.size > maxSize ? tooLargeMessage(picked, formatFileSize(maxSize, 'en-US')) : null;
    setRejected(problem);
    if (problem) return;
    setUncontrolled(picked);
    onValueChange?.(picked);
  }

  function remove() {
    setRejected(null);
    setUncontrolled(null);
    onValueChange?.(null);
    chooseRef.current?.focus(); // the Remove button goes away
  }

  const hasError = error != null && error !== false;
  const messages = [...(hasError ? [error] : []), ...(rejected ? [rejected] : [])];
  const describedBy = [description && `${id}-description`, `${id}-errors`].filter(Boolean).join(' ');

  return (
    <div role="group" aria-labelledby={`${id}-label`} className={cx('cs-field', 'cs-avatar-upload', className)} data-disabled={disabled || undefined}>
      <span id={`${id}-label`} className="cs-field-label">{label}</span>
      <div className="cs-avatar-upload-row">
        <Avatar name="" initials={fallback ?? ''} src={typeof photo === 'string' ? photo : file ? preview : undefined} aria-hidden className="cs-avatar-upload-preview" />
        <div className="cs-avatar-upload-actions">
          <Button
            ref={chooseRef}
            variant="secondary"
            size="sm"
            iconStart={<UploadSimple />}
            className="cs-avatar-upload-trigger"
            aria-describedby={describedBy}
            aria-invalid={messages.length > 0 || undefined}
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            {photo ? replaceLabel : chooseLabel}
          </Button>
          {photo && <Button variant="ghost" size="sm" iconStart={<Trash />} disabled={disabled} onClick={remove}>{removeLabel}</Button>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        disabled={disabled}
        name={name}
        onChange={event => {
          pick(event.target.files?.[0]);
          if (name) syncInput(file); // keep the shown file until the new one is accepted (it follows on render)
          else event.target.value = ''; // so picking the same file again still fires change
        }}
      />
      {description && <p id={`${id}-description`} className="cs-field-description">{description}</p>}
      {/* Always mounted so new rejection messages are announced */}
      <div id={`${id}-errors`} className="cs-avatar-upload-errors" aria-live="polite">
        {messages.map((message, i) => (
          <p key={i} className="cs-field-error">
            <WarningCircle aria-hidden="true" />
            <span>{message}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
