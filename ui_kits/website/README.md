# cyberskill.world — UI kit

A high-fidelity recreation of the **CyberSkill marketing site** home page — the public front door for the Saigon studio whose guide is **Lumi**, the golden genie. An EN/VI prototype with local form and scripted chat state.

## What it demonstrates
- **Glass header** (`cs-surface-light`) with the Logo lockup, nav, a **language toggle** (EN ⇄ Tiếng Việt — starts in English and updates the localized home-page copy, accessible names and scripted bot messages), a theme toggle, and a "Talk to Lumi" CTA.

- **Hero** over the warm `aurora-gold` wash with an umber protection gradient: eyebrow, the Ochre slogan + Vietnamese counterpart, lead, a **"make a wish"** input, and Lumi floating alongside.

- **Keyword marquee** band (real "what we build" terms).

- **Services** — three Standard-Glass cards.

- **Process** — the four-step "arc of a wish".

- **Careers** umber band + **Contact** form built from the design system's `cs-field` controls.

- **Lumi chat** — a floating launcher opens a scripted genie panel (localized sample greeting + quick "wish" chips); typing a wish in the hero seeds the conversation.

## Files
- `index.html` — entry; loads `styles.css`, `site.css`, React, and the app.

- `work.html` — case-study grid + results band (static, `.cs-*` classes; dark toggle).

- `careers.html` — values, open roles, culture CTA (static; dark toggle).

- `chat.html` — full-page **scripted Lumi preview**: composes `PromptInput`, `ChatMessage`, `PromptSuggestions`, `TypingIndicator`, `CitationList`, `ConfidenceMeter`, `AIDisclosureBadge`, and `LumiAvatar` from the bundle.

- `site.css` — bespoke marketing section styles, all driven by design tokens.

- `copy.js` — checked-in EN/VI copy (`window.SITE_COPY`). Historical source comments attribute the copy to product dictionaries/content; this clone does not establish current upstream synchronization.

- `Website.jsx` — the interactive app (`window.Website`).

## Fidelity notes
The home page runs local React state with checked-in dictionaries and design tokens. The contact form displays a demo receipt after native validation; it does not send data. Lumi replies use a fixed script and do not hand wishes to a model or a team member. User-entered text stays as entered when language changes; built-in bot messages follow the current home-page language. Closing and reopening chat starts a new conversation. A hero wish seeds chat when it mounts.

Work navigates to `work.html`; other home navigation links target sections on the page. Footer links are sample links to the top of the page. Replace sample destinations and implement actual delivery before using this prototype as a live contact service. This clone’s files do not verify a production CMS, upstream copy freshness or an external model integration.

Keyboard and localization: home controls retain native Tab and Enter/Space activation. The two home input handlers send/open on ordinary Enter and ignore composition Enter and keyCode 229. The finite synthetic-event test checks those guards in three engines; it does not certify real operating-system IME candidate selection. The home language is session state starting in English; it does not persist across reloads. The `lang` scope follows that state. Work, Careers and standalone Chat are separate examples. Standalone Chat has its own EN/VI toggle; its built-in copy, component labels and existing sample replies follow that scope, while caller messages and drafts stay as entered. The home toggle does not control those pages or certify every Work/Careers string. A finite home/chat geometry test checks 320, 390 and 1280px in EN/VI and light/dark across three engines. Header controls wrap at 360px and below; the chat input can shrink within its panel. Actual speech, full-route responsive and operator visual acceptance remain separate.

Source evidence: `Website.jsx`, `copy.js`, `index.html` and `site.css` define the home prototype; `_audit/ci/test-kit-entrypoints-browser.mjs` checks raw entrypoint/asset closure. The finite website contract test checks localized names, bot message updates, caller text retention, Work destination and demo receipts; a separate input test checks composition guards. it does not establish whole-kit or production acceptance.

The home-header chat button keeps white foreground on the fixed Umber fill in both themes, matching the existing chat send button. A finite computed-color check measures that actual opaque pair against the repository APCA75 floor; whole-kit color/vision and operator acceptance remain separate.

Contact and first-step process copy describe the non-delivery preview; the sample does not promise a one-day team reply. The website contract test checks both EN/VI copies as well as localized names, keyed bot replies, caller text and demo receipts.

Standalone Chat is local sample state: no model call, delivered team message or human review. Confidence and references are illustrative. The handoff and sample conversation controls are explicitly unavailable; Keep refining focuses the prompt. New wish cancels all queued sample replies, clears typing and resets the draft. Its skip link focuses the main landmark. A finite raw-page regression checks these contracts in three engines; a separate geometry test covers initial 320/390/1280px EN/VI light/dark layouts. Real OS IME, speech, all conversation lengths and operator visual acceptance remain separate.

Work and Careers contain illustrative case results, figures, values and roles; verify them before publishing. The Work contact CTA opens the local non-delivery preview, without a reply-time promise. Careers links show the contact demo and do not apply for a job; this clone does not establish current vacancy availability. Services/Contact links target the actual home sections. The finite secondary-page test checks native skip/language/theme behavior, localized sample copy and stored locale in three engines; horizontal geometry is checked at 320/390/1280px in EN/VI light/dark. Full content ownership, all axes, assistive speech and visual/operator acceptance remain separate.

The named contrast regression covers regular Work figures/tags, Chat brand/suggestions and home/Work/Careers copyright and footer links (default, hover and focus), plus fixed gold controls. Regular named targets use APCA 75; bold primary gold UI uses the existing APCA 60 convention. Gold anchors keep fixed Umber text against fixed Ochre; footer text uses white against fixed Umber. Ochre remains the hover underline decoration. Local page text uses the theme primary role. Three engines, 320/390/1280 widths and light/dark EN/VI are covered. Other text, imagery, filters, glyph pixels, preferences and human visual/accessibility acceptance remain separate.

Standalone Chat exposes exactly one visible New wish control at each side of the820px sidebar breakpoint: the existing sidebar control on desktop and a native header control on mobile. Both clear the local draft/caller history and pending scripted replies and move focus to the prompt; both are at least44px high. This finite control repair does not establish all mobile conversation geometry, touch, real IME or assistive speech.

Work/Careers reserve84px at the footer bottom so their fixed44px theme control,20px from the viewport edge, leaves20px clearance above copyright at maximum scroll. Character-midpoint hit testing covers320/390/821/1280×900, EN/VI light/dark and three engines. This does not certify every intermediate scroll, zoom, actual glyph boundary or human visual acceptance.
