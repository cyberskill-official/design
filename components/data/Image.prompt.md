**Image** — img with shimmer, warm error fallback, optional `preview` lightbox. `width` / `height` forward to the underlying `<img>`.

```jsx
<Image src="/assets/aurora-gold.jpg" alt="Aurora" ratio="16/9" width={640} height={360} preview/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.
This blocking surface also traps focus, isolates the background with inert, and preserves nested scroll-lock ownership.

Changing `src` starts a new loading state, including after a previous failure. Changing the source or disabling `preview` closes its lightbox; re-enabling preview requires a new activation.

Custom fallback content preserves numeric zero and rich React nodes. Null, false and empty strings retain the default error illustration.

A loaded image with preview enabled preserves a minimum 44 × 44 CSS-pixel target on coarse pointers, including small source images. Non-preview images keep their existing sizing.

Keyboard: A loaded preview-enabled image enters Tab order; Enter/Space opens its lightbox. The shared modal layer traps focus and Escape closes it; the native close button also supports Enter/Space. Changing src or disabling preview closes the lightbox.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Image alt text and custom fallback content are caller-owned.

Source evidence: `Image.jsx` and `Image.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
