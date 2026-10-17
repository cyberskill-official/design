# Email-client-safe templates

Table-based HTML intended for email clients such as Gmail, Outlook (Word engine), and Apple Mail — a different medium from the DC email templates in `templates/email*`, which use modern CSS (flex, custom properties, `display:contents`) that email clients strip. Use these when preparing an email for **sending**; use the DC versions for in-product previews / design refs.

## What's here — 3 exemplars + 4 materialized copy-swaps

**Exemplars** (the structural references — every DC email shape maps to one of these):

- **`email-transactional.html`** — header · message · CTA · footer (the common shape). Bilingual EN·VN.

- **`email-newsletter.html`** — header · lead · stacked story cards · CTA (multi-block marketing).

- **`email-dunning.html`** — header · message · amount-due box · CTA (transactional with a data panel + gentle urgency).

**Copy-swaps** (same table skeleton as the nearest exemplar, new copy — already materialized on disk):

- **`email-announcement.html`** — welcome / team intro (transactional skeleton).

- **`email-investor.html`** — investor update (transactional skeleton).

- **`email-launch.html`** — product/pack launch (transactional skeleton).

- **`email-status.html`** — weekly status (transactional skeleton).

Between the three exemplars these cover the structural variety of the whole DC email set; the four copy-swaps prove the pattern by providing concrete copy variants.

## The pattern (follow it for further copy-swaps)
- Nested `<table role="presentation" cellpadding="0" cellspacing="0" border="0">`; one centered 600px wrapper; single-column stacked rows. No flex/grid/position.

- Core layout, type and colour styles are inline. The `<head><style>` also contains a global link-colour rule plus mobile and `prefers-color-scheme: dark` media queries. Support for head styles and queries varies; validate the final email in the intended clients, including the head-stripped fallback.

- No web fonts — `Arial, Helvetica, sans-serif` (renders Vietnamese diacritics fine). Brand values hardcoded: Umber `#45210E`, Ochre `#F4BA17`, warm neutrals; no `var(--cs-*)`.

- **Bulletproof button**: padded `<td bgcolor="#F4BA17">` with an `<a display:inline-block>` + an `<!--[if mso]><v:roundrect>` fallback for Outlook.

- Hidden **preheader** span first in `<body>`; `lang="vi"` on the Vietnamese block; real `https` links; footer with unsubscribe + postal address. `color-scheme` meta + dark-mode-safe fills (no pure `#000`/`#fff`).

- Before sending: replace the logo wordmark with a **hosted** image URL if you want the mark (project images won't exist for recipients), and point the `href`s at real URLs.

The maintained `test-email-safe.mjs` guard checks file presence, root/English language markers and four English chrome phrases. It does not render Gmail, Outlook or Apple Mail, deliver messages, or certify layout, link/image readiness, dark-mode handling or recipient acceptance. Validate those separately after replacing sample content and URLs.

## Applies to
The DC emails that have a send path convert to the exemplar closest in structure — the three exemplar files are the references; the four copy-swaps above are the worked examples. Generate further copy-swaps on request.
