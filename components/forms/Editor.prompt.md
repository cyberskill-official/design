**Editor** — light rich-text (B/I/list), HTML `onChange`.

Trust boundary (CDS-SEC-001 / SEC-001 / TASK-IMP-029):
- Value model is **schema-allowlisted** (`EDITOR_SCHEMA`: `p` · `br` · `b` · `i` · `strong` · `em` · `ul` · `ol` · `li` · `div` · `span`; **no attributes**).
- `defaultValue` and emitted `onChange` HTML run through `sanitizeHtml` (scripts/handlers/disallowed tags stripped).
- Node and browsers use the same pinned, inert HTML parser and attribute-free output policy. Unknown containers are recursively unwrapped; foreign/raw-text subtrees are discarded. Output is for HTML element content, never an attribute, URL, CSS or script context.
- Paste and drop cancel native insertion and sanitize HTML before it enters the live editor. Plain text is escaped and line breaks are preserved. Toolbar actions support mouse, Enter and Space while preserving the editor selection.
- Toolbar buttons keep native Tab focus and activate with click, Enter or Space. `aria-pressed` reports the formatting state of selected text (or the browser command state at a collapsed caret) (`true`, `false`, or `mixed`); moving focus to the toolbar retains the saved selection. These are toggle commands, not a roving-focus toolbar.
- `unsafeHtml` bypasses sanitization — **trusted content only** (CMS/operator HTML). Prefer `defaultValue` unless you explicitly need raw markup.
- contentEditable + `document.execCommand` remain for this wave; a TipTap/ProseMirror-class replacement is a future task if product prioritizes it.

```jsx
<Editor defaultValue="<p>Điều ước…</p>" onChange={setHtml}/>
{/* trusted only: */}
<Editor unsafeHtml={cmsHtml} onChange={setHtml}/>
```

Keyboard: Native Tab reaches toolbar buttons and the editable area; Enter/Space activates toolbar commands while retaining the saved selection. Text editing uses the browser’s contentEditable behavior.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Supplied HTML/text is caller-owned. The initial seed is applied once; later seed-prop changes do not reset the editor.

Source evidence: `Editor.jsx` and `Editor.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

The public `EDITOR_SCHEMA` constant is a frozen policy descriptor: a frozen list of allowed HTML tags and a frozen empty attribute map. It is inspection data, not a configurable sanitizer or a function to sanitize input. Editor applies its maintained sanitizer; consumers inspecting this constant remain responsible for using a suitable sanitizer and output context. Do not mutate or extend the exported policy. The constant has no keyboard behavior or translated text.

```jsx
<code>{EDITOR_SCHEMA.tags.join(", ")}</code>
```

Constant source evidence: `editor-schema.js` defines the runtime policy, `editor-schema.d.ts` declares readonly tags/attrs, and `_esm/react.d.ts` re-exports it. Source inspection does not establish safety for other HTML sinks or certify arbitrary consumer markup.
