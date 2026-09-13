**Editor** — light rich-text (B/I/list), HTML `onChange`.

Trust boundary (CDS-SEC-001 / SEC-001 / TASK-IMP-029):
- Value model is **schema-allowlisted** (`EDITOR_SCHEMA`: `p` · `br` · `b` · `i` · `strong` · `em` · `ul` · `ol` · `li` · `div` · `span`; **no attributes**).
- `defaultValue` and emitted `onChange` HTML run through `sanitizeHtml` (scripts/handlers/disallowed tags stripped).
- `unsafeHtml` bypasses sanitization — **trusted content only** (CMS/operator HTML). Prefer `defaultValue` unless you explicitly need raw markup.
- contentEditable + `document.execCommand` remain for this wave; a TipTap/ProseMirror-class replacement is a future task if product prioritizes it.

```jsx
<Editor defaultValue="<p>Điều ước…</p>" onChange={setHtml}/>
{/* trusted only: */}
<Editor unsafeHtml={cmsHtml} onChange={setHtml}/>
```
