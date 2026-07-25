**Editor** — light rich-text (B/I/list), HTML onChange. `defaultValue` is injected as raw HTML via `dangerouslySetInnerHTML` — pass only trusted or consumer-sanitized markup.

```jsx
<Editor defaultValue="<p>Điều ước…</p>" onChange={setHtml}/>
```
