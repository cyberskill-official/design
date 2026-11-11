# File upload

> A drop zone that also opens the file picker, with type and size checks and a file list with progress and a done state.

```tsx
import { FileUpload, FileUploadItem } from '@cyberskill/design';
```

Use a file upload to attach documents or images to a form or record. The drop zone is a real button, so it works from the keyboard and opens the system file picker; dragging files onto it works too. It checks `accept` and `maxSize` before anything is uploaded and explains each rejected file in plain words.

Sizes use binary units (1 MB = 1024 × 1024 bytes) everywhere: the file list, the too-large message and `formatFileSize`. Write `maxSize` the same way, `5 * 1024 * 1024` for a "5 MB" hint, so the limit in the error reads exactly like the hint. Without `multiple`, dropping several files adds none of them and shows `tooManyFilesMessage`.

## Basic

Without `files`, the component keeps the picked files itself. Use `onAdd` to read them.

```tsx
<FileUpload label="Attachments" hint="PDF or PNG, up to 5 MB" accept=".pdf,image/png" multiple maxSize={5 * 1024 * 1024} onAdd={(files) => console.log(files)} />
```

## Upload progress

Pass `files` to own the list: add items in `onAdd`, update their `progress` (0–100) or `error` as the upload runs, and drop them in `onRemove`. At 100 the bar is replaced by a check mark and `doneLabel` ("Uploaded"); leave `progress` at 100 to keep showing it.

```tsx
const [files, setFiles] = useState<FileUploadItem[]>([]);

<FileUpload
  label="Documents"
  multiple
  files={files}
  onAdd={(added) => setFiles((fs) => [...fs, ...added.map((f) => ({ id: crypto.randomUUID(), name: f.name, size: f.size, progress: 0 }))])}
  onRemove={(item) => setFiles((fs) => fs.filter((f) => f.id !== item.id))}
/>
```

## Vietnamese text

Every message is a prop, and sizes follow `locale`.

```tsx
<FileUpload
  label="Ảnh đại diện"
  accept="image/*"
  maxSize={2 * 1024 * 1024}
  locale="vi-VN"
  prompt="Kéo thả ảnh vào đây hoặc bấm để chọn"
  hint="PNG hoặc JPG, tối đa 2 MB"
  tooLargeMessage={(f, max) => `${f.name} lớn hơn ${max}.`}
  wrongTypeMessage={(f) => `${f.name} không phải là ảnh.`}
  tooManyFilesMessage={(n) => `Chỉ thêm được một ảnh (bạn đã thả ${n} tệp).`}
  removeLabel={(name) => `Xoá ${name}`}
  progressLabel={(name) => `Đang tải lên ${name}`}
  doneLabel="Đã tải lên"
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label (required) |
| `accept` | `string` | – | Native syntax, e.g. ".pdf,image/*"; also checked for dropped files |
| `multiple` | `boolean` | `false` | Allow several files; otherwise a new pick replaces the old one |
| `maxSize` | `number` | – | Largest file in bytes, e.g. 5 * 1024 * 1024 for 5 MB |
| `files` | `FileUploadItem[]` | – | Controlled list: { id, name, size, progress?, error?, file? } |
| `onAdd` | `(files: File[]) => void` | – | Files that passed accept and maxSize |
| `onRemove` | `(item) => void` | – | Called from a file's × button |
| `prompt / hint` | `ReactNode` | `'Drag files here or click to browse' / –` | Text inside the drop zone |
| `tooLargeMessage / wrongTypeMessage` | `(file, max?) => string` | `English sentences` | Messages for rejected files; max is formatted, e.g. "5 MB" |
| `tooManyFilesMessage` | `(count) => string` | `'Add one file at a time (n were dropped).'` | Shown when several files are dropped without multiple; none is added |
| `removeLabel / progressLabel` | `(name) => string` | ``Remove ${name}` / `Uploading ${name}`` | Accessible names of the × button and progress bar |
| `doneLabel` | `ReactNode` | `'Uploaded'` | Shown with a check mark in place of the bar once a file reaches 100% |
| `description / error` | `ReactNode` | – | Help text, and an error for the whole field |
| `locale` | `string` | – | Locale for file sizes |
| `disabled` | `boolean` | `false` | Disables the zone and remove buttons |

`formatFileSize(bytes, locale)` is exported too, for showing limits in your own text: `formatFileSize(5 * 1024 * 1024)` is "5 MB", and the unit is picked after rounding, so 1,048,570 bytes reads "1 MB", not "1,024 kB".

## Accessibility

- The drop zone is a button named by the label and its text; Enter or Space opens the file picker, so dragging is never required.
- Help text and error messages are linked to the zone. Rejected files are announced politely as they appear.
- Each file has a named remove button with a 44px touch area, and upload progress is a labelled progress bar. A finished file shows a check mark and `doneLabel` text, not only a green color.
- Field and rejection errors, and per-file errors, carry a warning icon and text, not only a red color or border. The icon is hidden from screen readers.

## Exact types

```ts
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
  disabled?: boolean;
  /** Controlled list (e.g. with upload progress). Omit to let the component keep the picked files. */
  files?: FileUploadItem[];
  /** Called with the files that passed `accept` and `maxSize`. */
  onAdd?: (files: File[]) => void;
  /** Called when a file's remove button is pressed. */
  onRemove?: (item: FileUploadItem) => void;
  /** Locale for file sizes. */
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
  removeLabel?: (name: string) => string;
  progressLabel?: (name: string) => string;
  /** Shown with a check mark in place of the bar once a file reaches 100%, e.g. "Uploaded" / "Đã tải lên". */
  doneLabel?: ReactNode;
  className?: string;
};
```
