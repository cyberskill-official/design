**FileUpload** — click-or-drag dropzone; `onFiles` receives the `File[]`.

```jsx
<FileUpload multiple accept="image/*" onFiles={files => upload(files)} />
```

With `multiple={false}` (the default), selection and drop emit only the first
file. With `multiple`, the callback preserves all files in order. Empty input
emits nothing. `accept` configures the native picker hint; consumers remain
responsible for validating accepted file types, size and content.

Keyboard: Tab reaches the labelled native file input. Picker keyboard behavior follows the browser/OS; the dropzone forwards selected/dropped files to `onFiles`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `FileUpload.jsx` and `FileUpload.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
