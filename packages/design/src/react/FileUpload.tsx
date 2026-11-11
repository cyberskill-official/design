import { Progress as BaseProgress } from '@base-ui/react/progress';
import { CheckCircle, File as FileIcon, UploadSimple, Warning, WarningCircle, X } from '@phosphor-icons/react';
import { useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { formatFileSize } from '../utils/format';
import { IconButton } from './Button';

export { formatFileSize };

export type FileUploadItem = {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  /** Upload progress 0–100: a bar while below 100, then a check mark and `doneLabel`. */
  progress?: number;
  /** Per-file problem, e.g. "Upload failed". */
  error?: ReactNode;
  /** The picked file (set for files the component tracks itself). */
  file?: File;
};

export type FileUploadProps = {
  /** Visible label. */
  label: ReactNode;
  hideLabel?: boolean;
  description?: ReactNode;
  /** Error for the whole field (from a form library). Rejected files get their own messages. */
  error?: ReactNode;
  /** Same syntax as the native attribute: ".pdf,image/*". Also checked for dropped files. */
  accept?: string;
  multiple?: boolean;
  /** Largest allowed file in bytes. Sizes print in binary units, so write `5 * 1024 * 1024` for a "5 MB" hint. */
  maxSize?: number;
  /** Most files the list may hold (with `multiple`). Files past it are rejected with `maxFilesMessage`. */
  maxFiles?: number;
  disabled?: boolean;
  /** Controlled list (e.g. with upload progress). Omit to let the component keep the picked files. */
  files?: FileUploadItem[];
  /** Called with the files that passed `accept`, `maxSize` and `maxFiles`. A file already listed (same name, size and last-modified time) is skipped. */
  onAdd?: (files: File[]) => void;
  /** Called when a file's remove button is pressed. */
  onRemove?: (item: FileUploadItem) => void;
  /** Locale for file sizes. A fixed default (not the browser's) keeps server and client HTML identical. */
  locale?: Intl.LocalesArgument;
  /** Text inside the drop zone. Pass Vietnamese text in Vietnamese UIs. */
  prompt?: ReactNode;
  /** Second line in the drop zone, e.g. "PDF or PNG, up to 5 MB". */
  hint?: ReactNode;
  /** `maxSize` arrives formatted by `formatFileSize`, e.g. "5 MB". */
  tooLargeMessage?: (file: File, maxSize: string) => string;
  wrongTypeMessage?: (file: File) => string;
  /** Without `multiple`, shown when several files are dropped at once; none of them is added. */
  tooManyFilesMessage?: (count: number) => string;
  /** Shown for each file past `maxFiles`; that file is not added. */
  maxFilesMessage?: (file: File, maxFiles: number) => string;
  removeLabel?: (name: string) => string;
  progressLabel?: (name: string) => string;
  /** Shown with a check mark in place of the bar once a file reaches 100%, e.g. "Uploaded" / "Đã tải lên". */
  doneLabel?: ReactNode;
  className?: string;
};

let nextId = 0;

function accepts(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept.split(',').some(raw => {
    const rule = raw.trim().toLowerCase();
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return rule !== '' && type === rule;
  });
}

/** Drop zone (a button that also opens the file picker) plus a list of chosen files with size, progress and remove. */
export function FileUpload({
  label,
  hideLabel,
  description,
  error,
  accept,
  multiple,
  maxSize,
  maxFiles,
  disabled,
  files,
  onAdd,
  onRemove,
  locale = 'en-US',
  prompt = 'Drag files here or click to browse',
  hint,
  tooLargeMessage = (file, max) => `${file.name} is larger than ${max}.`,
  wrongTypeMessage = file => `${file.name} is not an accepted file type.`,
  tooManyFilesMessage = count => `Add one file at a time (${count} were dropped).`,
  maxFilesMessage = (file, max) => `${file.name} was not added: the limit is ${max} files.`,
  removeLabel = name => `Remove ${name}`,
  progressLabel = name => `Uploading ${name}`,
  doneLabel = 'Uploaded',
  className,
}: FileUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [own, setOwn] = useState<FileUploadItem[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const list = files ?? own;
  const canRemove = files == null || onRemove != null;

  function add(picked: FileList | null) {
    if (!picked || disabled) return;
    if (!multiple && picked.length > 1) return setRejected([tooManyFilesMessage(picked.length)]);
    const ok: File[] = [];
    const problems: string[] = [];
    const kept = multiple ? list.length : 0; // without multiple, a pick replaces the list
    for (const file of Array.from(picked)) {
      if (list.some(({ file: f }) => f && f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) continue; // already listed
      if (!accepts(file, accept)) problems.push(wrongTypeMessage(file));
      else if (maxSize != null && file.size > maxSize) problems.push(tooLargeMessage(file, formatFileSize(maxSize, locale)));
      else if (maxFiles != null && kept + ok.length >= maxFiles) problems.push(maxFilesMessage(file, maxFiles));
      else ok.push(file);
    }
    setRejected(problems);
    if (!ok.length) return;
    if (files == null) setOwn(prev => [...(multiple ? prev : []), ...ok.map(file => ({ id: `cs-file-${++nextId}`, name: file.name, size: file.size, file }))]);
    onAdd?.(ok);
  }

  function remove(item: FileUploadItem) {
    if (files == null) setOwn(prev => prev.filter(f => f.id !== item.id));
    onRemove?.(item);
  }

  const onDrag = (e: DragEvent<HTMLButtonElement>, over: boolean) => {
    e.preventDefault();
    if (!disabled) setDragging(over);
  };

  const hasError = error != null && error !== false;
  // The zone's whole visible text is its name (label-in-name); help and errors describe it.
  const labelledBy = [`${id}-label`, `${id}-prompt`, hint && `${id}-hint`].filter(Boolean).join(' ');
  const describedBy = [description && `${id}-description`, `${id}-errors`].filter(Boolean).join(' ');

  return (
    <div className={cx('cs-field', 'cs-file-upload', className)} data-disabled={disabled || undefined}>
      <label id={`${id}-label`} htmlFor={`${id}-zone`} className={cx('cs-field-label', hideLabel && 'cs-visually-hidden')}>
        {label}
      </label>
      <button
        id={`${id}-zone`}
        type="button"
        className="cs-file-upload-zone"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={hasError || rejected.length > 0 || undefined}
        disabled={disabled}
        data-dragging={dragging || undefined}
        onClick={() => inputRef.current?.click()}
        onDragEnter={e => onDrag(e, true)}
        onDragOver={e => onDrag(e, true)}
        onDragLeave={e => !e.currentTarget.contains(e.relatedTarget as Node | null) && onDrag(e, false)}
        onDrop={e => {
          onDrag(e, false);
          add(e.dataTransfer.files);
        }}
      >
        <span className="cs-file-upload-icon" aria-hidden="true">
          <UploadSimple />
        </span>
        <span id={`${id}-prompt`} className="cs-file-upload-prompt">{prompt}</span>
        {/* The space keeps the two lines separate words in the text content (label-in-name check) */}
        {hint && <>{' '}<span id={`${id}-hint`} className="cs-file-upload-hint">{hint}</span></>}
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={e => {
          add(e.target.files);
          e.target.value = ''; // so picking the same file again still fires change
        }}
      />
      {description && <p id={`${id}-description`} className="cs-field-description">{description}</p>}
      {/* Always mounted so new rejection messages are announced */}
      <div id={`${id}-errors`} className="cs-file-upload-errors" aria-live="polite">
        {[...(hasError ? [error] : []), ...rejected].map((message, i) => (
          <p key={i} className="cs-field-error">
            <WarningCircle aria-hidden="true" />
            <span>{message}</span>
          </p>
        ))}
      </div>
      {list.length > 0 && (
        <ul className="cs-file-upload-list">
          {list.map(item => (
            <li key={item.id} className="cs-file-upload-item" data-invalid={item.error ? '' : undefined}>
              <FileIcon className="cs-file-upload-item-icon" aria-hidden="true" />
              <div className="cs-file-upload-item-body">
                <div className="cs-file-upload-item-row">
                  <span className="cs-file-upload-item-name">{item.name}</span>
                  <span className="cs-file-upload-item-size">{formatFileSize(item.size, locale)}</span>
                </div>
                {item.progress != null && item.progress < 100 && (
                  <BaseProgress.Root value={item.progress} aria-label={progressLabel(item.name)} className="cs-file-upload-progress">
                    <BaseProgress.Track className="cs-file-upload-progress-track">
                      <BaseProgress.Indicator className="cs-file-upload-progress-indicator" />
                    </BaseProgress.Track>
                  </BaseProgress.Root>
                )}
                {item.progress != null && item.progress >= 100 && !item.error && (
                  <span className="cs-file-upload-item-done">
                    <CheckCircle aria-hidden="true" />
                    {doneLabel}
                  </span>
                )}
                {item.error && (
                  <span className="cs-file-upload-item-error">
                    <Warning aria-hidden="true" />
                    {item.error}
                  </span>
                )}
              </div>
              {canRemove && <IconButton variant="ghost" size="sm" icon={<X />} label={removeLabel(item.name)} disabled={disabled} onClick={() => remove(item)} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
