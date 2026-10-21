# Rendered HTML reference

This generated reference records real component mounts. It is a static DOM reference, not a replacement implementation. Copying markup does not install state, event handlers, keyboard navigation, overlay management, validation, announcements or authorization. Use the React component for interactive behavior.

Renderer scope: Chromium DOM,1280x720, fixed UTC time2026-10-20, English document; generated IDs normalized with IDREF attributes; cross-engine/platform byte identity is not asserted. Source hashes and fixture props bind each entry; no manual accessibility or visual acceptance is implied. Canvas pixels, media contents, stylesheets and pseudo-elements are outside outerHTML. IDs are consistently normalized for reference display.

Regenerate: `node scripts/generate-static-html-reference.mjs`. Validate current source/rendering: `node scripts/generate-static-html-reference.mjs --check`. The check requires the current browser bundle and Playwright Chromium.

Kitchen sink remains a curated static styling specimen; this catalog does not change its coverage or behavior.

Fixture support context: an ambient button #reference-anchor is excluded from snapshots; Tour and Anchor observe that target. Declared wrapper context is included. These fragments are not independent application examples.


## AIDisclosureBadge

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/AIDisclosureBadge.jsx`, SHA-256 `3b9d3255135196a708489bb0d0f3424f007d1c9255ae8791d034defd7a8da740`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "AI assisted",
    "details": "Reference disclosure",
    "sources": [
      "Reference source"
    ]
  }
}
```

```html
<span class="cs-ai-disclosure"><button type="button" class="cs-ai-disclosure__badge" aria-expanded="false">AI assisted</button></span><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 14px; font-style: normal; font-weight: 700; line-height: 21px; letter-spacing: normal; color: rgb(255, 255, 255); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## Accordion

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Accordion.jsx`, SHA-256 `2bd0ed6b7ddb3daa85f941a0260ef3f08a7a261de3336eabff49c6cade44791b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "title": "Alpha",
        "content": "Reference content"
      }
    ]
  }
}
```

```html
<div class="cs-accordion"><div class="cs-accordion__item"><h3 style="margin: 0px; font: inherit;"><button id="reference-id-001" type="button" class="cs-accordion__trigger" aria-expanded="true" aria-controls="reference-id-002">Alpha<span class="cs-accordion__chevron" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></span></button></h3><div id="reference-id-002" aria-labelledby="reference-id-001" class="cs-accordion__panel">Reference content</div></div></div>
```

## Alert

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Alert.jsx`, SHA-256 `b9c0a4e67f41118230fec5abdad7f22e8a98a2a8c46420cde54c1a46759f9d91`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Reference notice",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div role="status" class="cs-alert cs-alert--info"><span class="cs-alert__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path></svg></span><div><p class="cs-alert__title">Reference notice</p><div class="cs-alert__body">Reference &lt;example&gt; &amp; "quoted" text</div></div></div>
```

## AlertDialog

interactive-dom-snapshot — Controlled open=true fixture; snapshot is not a standalone usable overlay.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/overlays/AlertDialog.jsx`, SHA-256 `4da78ce1d38abb6659a45b501abc08310f2fd525b7cae7fb20bb4e293bb8c82d`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "open": true,
    "title": "Reference confirmation",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-dialog-layer cs-alert-dialog-layer"><div class="cs-dialog__overlay" aria-hidden="true"></div><section tabindex="-1" role="alertdialog" aria-modal="true" aria-labelledby="reference-id-001" aria-describedby="reference-id-002" class="cs-dialog cs-alert-dialog"><header class="cs-dialog__header"><h2 id="reference-id-001" class="cs-dialog__title">Reference confirmation</h2></header><div id="reference-id-002" class="cs-dialog__body">Reference &lt;example&gt; &amp; "quoted" text</div><footer class="cs-dialog__actions"><button type="button" class="cs-button cs-button--ghost cs-button--md cs-alert-dialog__cancel">Cancel</button><button type="button" class="cs-button cs-button--md cs-alert-dialog__confirm cs-button--primary">Confirm</button></footer></section></div>
```

## Anchor

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Anchor.jsx`, SHA-256 `8907d6bfe9ae45869c74c5d419f7a04116379f84f5992ac248418515df3bb500`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "id": "reference-anchor",
        "label": "Reference section"
      }
    ]
  }
}
```

```html
<nav class="cs-anchor"><a href="#reference-anchor" class="cs-anchor__item is-active" aria-current="location">Reference section</a></nav>
```

## AspectRatio

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/AspectRatio.jsx`, SHA-256 `702957661817b7230bbe8bdb7951497aaee4c92495256487cc3e20d7c94a9a9c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "tag": "div",
        "props": {},
        "children": "Reference <example> & \"quoted\" text"
      }
    }
  }
}
```

```html
<div class="cs-aspect-ratio" style="aspect-ratio: 16 / 9;"><div>Reference &lt;example&gt; &amp; "quoted" text</div></div>
```

## Avatar

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Avatar.jsx`, SHA-256 `9088033b579770c1160213545feebdf291cad8bb8a4f3f539168c61f4df16964`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "name": "An Nguyen"
  }
}
```

```html
<span class="cs-avatar cs-avatar--md" role="img" aria-label="An Nguyen" title="An Nguyen"><span aria-hidden="true">AN</span></span>
```

## AvatarGroup

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Avatar.jsx`, SHA-256 `9088033b579770c1160213545feebdf291cad8bb8a4f3f539168c61f4df16964`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": [
      {
        "$element": {
          "component": "Avatar",
          "props": {
            "name": "An Nguyen"
          },
          "children": null
        }
      },
      {
        "$element": {
          "component": "Avatar",
          "props": {
            "name": "Binh Tran"
          },
          "children": null
        }
      }
    ]
  }
}
```

```html
<div class="cs-avatar-group"><span class="cs-avatar cs-avatar--md" role="img" aria-label="An Nguyen" title="An Nguyen"><span aria-hidden="true">AN</span></span><span class="cs-avatar cs-avatar--md" role="img" aria-label="Binh Tran" title="Binh Tran"><span aria-hidden="true">BT</span></span></div>
```

## BackTop

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/BackTop.jsx`, SHA-256 `d8ad1e190a8601a55fec8ee5812e0b30d7d5444e82147d1604c86412a8280a1e`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "threshold": -1
  }
}
```

```html
<button type="button" class="cs-backtop" aria-label="Back to top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg></button>
```

## Badge

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Badge.jsx`, SHA-256 `6eeac438173e1d489ae503957d6049d4ae4b009350b7ed7a1a0bc789911d2feb`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference"
  }
}
```

```html
<span class="cs-badge">Reference</span>
```

## Breadcrumb

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Breadcrumb.jsx`, SHA-256 `205de44c5157c6d543f403520f8ba6f0e1a5b0930696eebd5f762ea3b8da6f98`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "label": "Home",
        "href": "#home"
      },
      {
        "label": "Reference"
      }
    ]
  }
}
```

```html
<nav aria-label="Breadcrumb"><ol class="cs-breadcrumb"><li><a href="#home">Home</a><span class="cs-breadcrumb__sep" aria-hidden="true">/</span></li><li><span class="cs-breadcrumb__current" aria-current="page">Reference</span></li></ol></nav>
```

## Button

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/button/Button.jsx`, SHA-256 `198c46d2c90a065d8510c5a64c38f292075483fdf65d05f36b671082934f3d4d`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<button type="button" class="cs-button cs-button--primary cs-button--md"><span class="cs-button__label">Reference &lt;example&gt; &amp; "quoted" text</span></button>
```

## ButtonGroup

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/button/ButtonGroup.jsx`, SHA-256 `64726fc0b33a51126a02749314a5aa699da12afe0f9702472e3cdd3f4407f5e6`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": [
      {
        "$element": {
          "component": "Button",
          "props": {},
          "children": "One"
        }
      },
      {
        "$element": {
          "component": "Button",
          "props": {},
          "children": "Two"
        }
      }
    ]
  }
}
```

```html
<div class="cs-btngroup" role="group"><button type="button" class="cs-button cs-button--primary cs-button--md"><span class="cs-button__label">One</span></button><button type="button" class="cs-button cs-button--primary cs-button--md"><span class="cs-button__label">Two</span></button></div>
```

## Calendar

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Calendar.jsx`, SHA-256 `9300c818b4a4de7425600d8b54f8be62e3ca3e7a7e2c0f25fc3cff1b12dad2ce`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "value": "2026-10-20"
  }
}
```

```html
<div class="cs-cal"><div class="cs-cal__head"><button type="button" aria-label="Previous month">‹</button><b id="reference-id-001" aria-live="polite">October 2026</b><button type="button" aria-label="Next month">›</button></div><div class="cs-cal__wd"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div><div class="cs-cal__grid" role="grid" aria-labelledby="reference-id-001"><div role="row" style="display: contents;"><span role="gridcell"></span><span role="gridcell"></span><span role="gridcell"></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="1" tabindex="-1" class="" aria-label="Thursday, October 1, 2026">1</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="2" tabindex="-1" class="" aria-label="Friday, October 2, 2026">2</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="3" tabindex="-1" class="" aria-label="Saturday, October 3, 2026">3</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="4" tabindex="-1" class="" aria-label="Sunday, October 4, 2026">4</button></span></div><div role="row" style="display: contents;"><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="5" tabindex="-1" class="" aria-label="Monday, October 5, 2026">5</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="6" tabindex="-1" class="" aria-label="Tuesday, October 6, 2026">6</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="7" tabindex="-1" class="" aria-label="Wednesday, October 7, 2026">7</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="8" tabindex="-1" class="" aria-label="Thursday, October 8, 2026">8</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="9" tabindex="-1" class="" aria-label="Friday, October 9, 2026">9</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="10" tabindex="-1" class="" aria-label="Saturday, October 10, 2026">10</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="11" tabindex="-1" class="" aria-label="Sunday, October 11, 2026">11</button></span></div><div role="row" style="display: contents;"><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="12" tabindex="-1" class="" aria-label="Monday, October 12, 2026">12</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="13" tabindex="-1" class="" aria-label="Tuesday, October 13, 2026">13</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="14" tabindex="-1" class="" aria-label="Wednesday, October 14, 2026">14</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="15" tabindex="-1" class="" aria-label="Thursday, October 15, 2026">15</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="16" tabindex="-1" class="" aria-label="Friday, October 16, 2026">16</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="17" tabindex="-1" class="" aria-label="Saturday, October 17, 2026">17</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="18" tabindex="-1" class="" aria-label="Sunday, October 18, 2026">18</button></span></div><div role="row" style="display: contents;"><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="19" tabindex="-1" class="" aria-label="Monday, October 19, 2026">19</button></span><span role="gridcell" aria-selected="true" style="display: contents;"><button type="button" data-day="20" tabindex="0" class="sel today" aria-pressed="true" aria-current="date" aria-label="Tuesday, October 20, 2026">20</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="21" tabindex="-1" class="" aria-label="Wednesday, October 21, 2026">21</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="22" tabindex="-1" class="" aria-label="Thursday, October 22, 2026">22</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="23" tabindex="-1" class="" aria-label="Friday, October 23, 2026">23</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="24" tabindex="-1" class="" aria-label="Saturday, October 24, 2026">24</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="25" tabindex="-1" class="" aria-label="Sunday, October 25, 2026">25</button></span></div><div role="row" style="display: contents;"><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="26" tabindex="-1" class="" aria-label="Monday, October 26, 2026">26</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="27" tabindex="-1" class="" aria-label="Tuesday, October 27, 2026">27</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="28" tabindex="-1" class="" aria-label="Wednesday, October 28, 2026">28</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="29" tabindex="-1" class="" aria-label="Thursday, October 29, 2026">29</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="30" tabindex="-1" class="" aria-label="Friday, October 30, 2026">30</button></span><span role="gridcell" aria-selected="false" style="display: contents;"><button type="button" data-day="31" tabindex="-1" class="" aria-label="Saturday, October 31, 2026">31</button></span><span role="gridcell"></span></div></div></div>
```

## Card

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Card.jsx`, SHA-256 `37a0eb43b0fdff92a3eec629b6136750c93c37128b8f2858d3098373103f9469`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "component": "CardBody",
        "props": {},
        "children": "Reference <example> & \"quoted\" text"
      }
    }
  }
}
```

```html
<div class="cs-card"><div class="cs-card__body">Reference &lt;example&gt; &amp; "quoted" text</div></div>
```

## CardBody

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Card.jsx`, SHA-256 `37a0eb43b0fdff92a3eec629b6136750c93c37128b8f2858d3098373103f9469`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-card__body">Reference &lt;example&gt; &amp; "quoted" text</div>
```

## CardFooter

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Card.jsx`, SHA-256 `37a0eb43b0fdff92a3eec629b6136750c93c37128b8f2858d3098373103f9469`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-card__footer">Reference &lt;example&gt; &amp; "quoted" text</div>
```

## CardHeader

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Card.jsx`, SHA-256 `37a0eb43b0fdff92a3eec629b6136750c93c37128b8f2858d3098373103f9469`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Reference card",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-card__header"><h3 class="cs-card__title">Reference card</h3>Reference &lt;example&gt; &amp; "quoted" text</div>
```

## Carousel

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Carousel.jsx`, SHA-256 `21422bad1971eff2365e424acd05ac342fa16c2617fb1dfd512bcb8927489e68`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": [
      {
        "$element": {
          "tag": "div",
          "props": {},
          "children": "One"
        }
      },
      {
        "$element": {
          "tag": "div",
          "props": {},
          "children": "Two"
        }
      }
    ]
  }
}
```

```html
<div class="cs-carousel" role="group" aria-roledescription="carousel"><div class="cs-carousel__view"><div class="cs-carousel__window"><div class="cs-carousel__track" style="transform: translateX(0%);"><div class="cs-carousel__slide" role="group" aria-roledescription="slide" aria-label="Slide 1/2" aria-hidden="false"><div>One</div></div><div class="cs-carousel__slide" role="group" aria-roledescription="slide" aria-label="Slide 2/2" aria-hidden="true" inert=""><div>Two</div></div></div></div><button type="button" class="cs-carousel__nav prev" aria-label="Previous slide">‹</button><button type="button" class="cs-carousel__nav next" aria-label="Next slide">›</button></div><div class="cs-sr-only" role="status" aria-live="polite" aria-atomic="true">Slide 1/2</div><div class="cs-carousel__dots"><button type="button" aria-label="Slide 1/2" aria-current="true"></button><button type="button" aria-label="Slide 2/2" aria-current="false"></button></div></div>
```

## Cascader

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Cascader.jsx`, SHA-256 `60217f041dd78ad4809a787920c0f0d56a6a383ae125ad2e691757b2af22abbf`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "nodes": [
      {
        "key": "a",
        "label": "Alpha"
      },
      {
        "key": "b",
        "label": "Beta"
      }
    ],
    "value": [
      "a"
    ],
    "label": "Region"
  }
}
```

```html
<div class="cs-cascader"><button id="reference-id-001" aria-label="Region" type="button" class="cs-treeselect__field" aria-haspopup="listbox" aria-expanded="false"><span>Alpha</span><span aria-hidden="true">▾</span></button></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 14px; font-style: normal; font-weight: 500; line-height: normal; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## Chart

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Chart.jsx`, SHA-256 `04ada47476df79edcc46604557c862545eb4d4433c43afa826fff2b744c1693e`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "data": [
      {
        "label": "Alpha",
        "value": 2
      }
    ]
  }
}
```

```html
<figure class="cs-chart" role="img" aria-label="Alpha: 2"><svg viewBox="0 0 320 160" width="100%" height="160" preserveAspectRatio="none" aria-hidden="true"><rect x="47.68000000000001" y="6" width="224.64" height="134" rx="3" fill="var(--cs-accent)"></rect></svg><figcaption class="cs-chart__legend"><span>Alpha</span></figcaption></figure>
```

## ChatMessage

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/ChatMessage.jsx`, SHA-256 `b6fe36ea61af0acb22566844b528a30895c51f0d4fbc3b26e5aa0497e9ef3ec0`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "role": "user",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-chat-msg cs-chat-msg--user"><div class="cs-chat-msg__avatar"><span aria-hidden="true">You</span></div><div class="cs-chat-msg__col"><div class="cs-chat-msg__name">You</div><div class="cs-chat-msg__bubble">Reference &lt;example&gt; &amp; "quoted" text</div></div></div>
```

## Checkbox

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Checkbox.jsx`, SHA-256 `19491fd53a0a7c5a4fa3c9d449ee3c0b7f39af18565413a012a7a8f5e25425ee`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Reference choice",
    "defaultChecked": true
  }
}
```

```html
<label class="cs-check"><input aria-labelledby="reference-id-001" type="checkbox" checked=""><span class="cs-check__text"><span id="reference-id-001">Reference choice</span></span></label>
```

## CitationList

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/CitationList.jsx`, SHA-256 `dc3f9e04b71611502234cd03a1967aeed46b6274d6f4e205a4ebd228fcceeb6a`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "title": "Reference source",
        "href": "#source"
      }
    ]
  }
}
```

```html
<div class="cs-citations"><div class="cs-citations__label">Sources</div><a class="cs-citation" href="#source" target="_blank" rel="noreferrer"><span class="cs-citation__num">1</span><span class="cs-citation__text">Reference source</span></a></div>
```

## CodeBlock

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/CodeBlock.jsx`, SHA-256 `a0bbfb0874c129fe739b58129419e87171c2f97c2ada62ae3e90e24465973530`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "code": "const reference = \"<safe>\";",
    "language": "js"
  }
}
```

```html
<div class="cs-code"><div class="cs-code__bar"><span>js</span><button type="button" class="cs-code__copy">Copy</button></div><pre><code>const reference = "&lt;safe&gt;";</code></pre></div>
```

## Collapsible

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Collapsible.jsx`, SHA-256 `6dfb148c5938cb6467d28286f70878c7de59eb057adf2a54ff1b61e0f5ab0aaf`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Reference section",
    "defaultOpen": true,
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-collapsible"><button type="button" id="reference-id-001" class="cs-collapsible__trigger" aria-expanded="true" aria-controls="reference-id-002"><span class="cs-collapsible__label">Reference section</span><span class="cs-collapsible__chevron" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></span></button><div id="reference-id-002" role="region" aria-labelledby="reference-id-001" class="cs-collapsible__panel">Reference &lt;example&gt; &amp; "quoted" text</div></div>
```

## ColorPicker

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/ColorPicker.jsx`, SHA-256 `64da95eccfc3637b640edcb4271ae914a81f4e05cf7b528467ab5850a651ed4f`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Accent",
    "value": "#F4BA17"
  }
}
```

```html
<span class="cs-colorpicker"><button id="reference-id-001" aria-label="Accent: #F4BA17" type="button" class="cs-colorpicker__field" aria-expanded="false"><i style="background: rgb(244, 186, 23);"></i><code>#F4BA17</code></button></span><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;JetBrains Mono&quot;, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; font-style: normal; font-weight: 600; line-height: normal; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## Combobox

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Combobox.jsx`, SHA-256 `bae42bd629700dcdb3173636184df3aa0181a4e4d5f0ae7447a630f6404e84d3`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "options": [
      {
        "value": "a",
        "label": "Alpha"
      },
      {
        "value": "b",
        "label": "Beta"
      }
    ],
    "label": "Project",
    "value": "a"
  }
}
```

```html
<div class="cs-combobox"><input role="combobox" aria-expanded="false" aria-autocomplete="list" aria-label="Project" placeholder="Select or type…" id="reference-id-001" value="Alpha"><span class="cs-combobox__caret" aria-hidden="true">▾</span></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 14px; font-style: normal; font-weight: 500; line-height: normal; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: start; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## CommandPalette

interactive-dom-snapshot — Controlled open=true fixture; snapshot is not a standalone usable overlay.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/CommandPalette.jsx`, SHA-256 `7572bc9c884cc84b46d289947aad5d23a6b59bb222a207f7e49e4ce385eb5771`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "open": true,
    "groups": [
      {
        "label": "Reference commands",
        "items": [
          {
            "label": "Reference command"
          }
        ]
      }
    ]
  }
}
```

```html
<div class="cs-cmdk-scrim"><div class="cs-cmdk" role="dialog" aria-modal="true" aria-label="Command palette"><div class="cs-cmdk__search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg><input aria-label="Type a command or search…" placeholder="Type a command or search…" value=""><span class="cs-kbd">Esc</span></div><div class="cs-cmdk__list"><div class="cs-cmdk__status" role="status" aria-live="polite" aria-atomic="true">1 result</div><div class="cs-cmdk__label">Reference commands</div><button type="button" class="cs-cmdk__item"><span>Reference command</span></button></div></div></div>
```

## Comment

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Comment.jsx`, SHA-256 `08be70ef29102a87005d120e3aa828ef5b06ecb0fc17bb84607fa783d109475b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "author": "An Nguyen",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-comment"><div class="cs-comment__main"><div class="cs-comment__head"><b>An Nguyen</b></div><div class="cs-comment__body">Reference &lt;example&gt; &amp; "quoted" text</div><div class="cs-comment__actions"><button type="button">Reply</button></div></div></div>
```

## ConfidenceMeter

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/ConfidenceMeter.jsx`, SHA-256 `90ee1079775f7879cbf1e7c85f6b95098a81a5d1b414721abc19c63966a43421`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "value": 0.75
  }
}
```

```html
<div class="cs-confidence"><div class="cs-confidence__head"><span id="reference-id-001">Confidence</span><span id="reference-id-002" class="cs-confidence__level" style="color: var(--cs-color-semantic-success-text);">High</span></div><div class="cs-confidence__track" role="meter" aria-valuemin="0" aria-valuemax="5" aria-valuenow="4" aria-labelledby="reference-id-001 reference-id-002"><span class="cs-confidence__seg" style="background: var(--cs-color-semantic-success);"></span><span class="cs-confidence__seg" style="background: var(--cs-color-semantic-success);"></span><span class="cs-confidence__seg" style="background: var(--cs-color-semantic-success);"></span><span class="cs-confidence__seg" style="background: var(--cs-color-semantic-success);"></span><span class="cs-confidence__seg"></span></div></div>
```

## ContextMenu

interactive-dom-snapshot — Initial closed/help-hidden fixture; only initial DOM is referenced, hidden interactive surfaces are not claimed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/overlays/ContextMenu.jsx`, SHA-256 `31ac2665583bd13108b5c5f105e14d2a1ff3f105edbbfdfd91852b002826d499`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "label": "Reference action"
      }
    ],
    "children": {
      "$element": {
        "tag": "div",
        "props": {},
        "children": "Reference <example> & \"quoted\" text"
      }
    }
  }
}
```

```html
<div class="cs-ctxmenu-zone" role="group" aria-label="Context menu" tabindex="0"><div>Reference &lt;example&gt; &amp; "quoted" text</div></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: start; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## DataGrid

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/datatable/DataGrid.jsx`, SHA-256 `f98b241da97de25b2014cc1e28d84d1f35e4f16aeaa64d0e92961eabbc9499c5`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "columns": [
      {
        "key": "name",
        "header": "Name"
      }
    ],
    "rows": [
      {
        "id": "a",
        "name": "Alpha"
      }
    ]
  }
}
```

```html
<div class="cs-datagrid" data-virtual="false" data-row-count="1" style="max-block-size: 280px; overflow: auto;"><table class="cs-table"><thead><tr><th scope="col"><span id="reference-id-001">Name</span></th></tr></thead><tbody><tr><td>Alpha</td></tr></tbody></table></div>
```

## DataTable

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/datatable/DataTable.jsx`, SHA-256 `2982f89295d11775882a2411e5bf0eb6fdea123af9431f67bb44a45efe4cbb2c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "columns": [
      {
        "key": "name",
        "header": "Name"
      }
    ],
    "rows": [
      {
        "id": "a",
        "name": "Alpha"
      }
    ]
  }
}
```

```html
<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th scope="col">Name</th></tr></thead><tbody><tr><td>Alpha</td></tr></tbody></table></div>
```

## DatePicker

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/DatePicker.jsx`, SHA-256 `7a2fadb7759ddd31d574114d8e967406dbf82117251b65b14adcab6e21996b32`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "value": "2026-10-20",
    "label": "Date"
  }
}
```

```html
<div class="cs-datepicker"><button type="button" class="cs-datepicker__field" aria-haspopup="dialog" aria-expanded="false" aria-label="Date" id="reference-id-001"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 10h18"></path></svg><span>20 Oct 2026</span></button></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 14px; font-style: normal; font-weight: 500; line-height: normal; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## DescriptionList

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/DescriptionList.jsx`, SHA-256 `8aed2b747130fe0b1a66428211e0893913cb0c1662c0902a4524c4f183b4d35b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "term": "Name",
        "value": "Alpha"
      }
    ]
  }
}
```

```html
<dl class="cs-dl"><div><dt>Name</dt><dd>Alpha</dd></div></dl>
```

## Dialog

interactive-dom-snapshot — Controlled open=true fixture; snapshot is not a standalone usable overlay.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/dialog/Dialog.jsx`, SHA-256 `975f4e5ad0d0d9eb972f3f6e2eb6bd7ecd9ee00c3520268b8355998ab801c240`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "open": true,
    "title": "Reference dialog",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-dialog-layer"><div class="cs-dialog__overlay" aria-hidden="true"></div><section tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="reference-id-001" aria-describedby="reference-id-002" class="cs-dialog"><header class="cs-dialog__header"><h2 id="reference-id-001" class="cs-dialog__title">Reference dialog</h2></header><div id="reference-id-002" class="cs-dialog__body">Reference &lt;example&gt; &amp; "quoted" text</div></section></div>
```

## Divider

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Divider.jsx`, SHA-256 `28239cea9e76e7d4d7092a2bdce6286e842814dd862fb460327b0d6708a9b567`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {}
}
```

```html
<hr class="cs-divider" aria-orientation="horizontal">
```

## Dock

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Dock.jsx`, SHA-256 `77956d94bda2e3eb7e7514926c8adf86da964d59eba49d70368cc63888b3ad2b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "label": "Home",
        "icon": "H"
      }
    ]
  }
}
```

```html
<div class="cs-dock" role="toolbar"><button type="button" class="cs-dock__item" aria-label="Home" title="Home" style="transform: scale(1) translateY(0px);">H</button></div>
```

## Drawer

interactive-dom-snapshot — Controlled open=true fixture; snapshot is not a standalone usable overlay.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/overlays/Drawer.jsx`, SHA-256 `a98fc2c5e5bcfc3c8ff69005bcc5018a54685bfb971690e79cd483d8ce9e1bca`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "open": true,
    "title": "Reference drawer",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-drawer-scrim" aria-hidden="true"></div><div class="cs-drawer" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="reference-id-001"><div class="cs-drawer__header"><h2 id="reference-id-001" class="cs-drawer__title">Reference drawer</h2><button type="button" class="cs-drawer__close" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div><div class="cs-drawer__body">Reference &lt;example&gt; &amp; "quoted" text</div></div>
```

## Editor

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Editor.jsx`, SHA-256 `dcb9dd625cac6e80c96e3e5eca5e8e06e215c6151a8dbbfc63fc3754b4a7b4b9`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "defaultValue": "<p>Reference note</p>"
  }
}
```

```html
<div class="cs-editor"><div class="cs-editor__bar" role="toolbar" aria-label="Formatting"><button type="button" class="cs-toolbar__btn" aria-label="Bold" aria-pressed="false"><b>B</b></button><button type="button" class="cs-toolbar__btn" aria-label="Italic" aria-pressed="false"><i>I</i></button><button type="button" class="cs-toolbar__btn" aria-label="Bullet list" aria-pressed="false">≔</button></div><div class="cs-editor__area" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Rich text" style="min-height: 120px;"><p>Reference note</p></div></div>
```

## EmptyState

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/EmptyState.jsx`, SHA-256 `324d3ac33620dec1ea597d620f902e7e77bfff55b36235291c66a4eb62651e21`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Nothing here",
    "children": "Reference empty state"
  }
}
```

```html
<div class="cs-empty"><span class="cs-empty__icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6"></path></svg></span><div class="cs-empty__title">Nothing here</div><div class="cs-empty__body">Reference empty state</div></div>
```

## FileUpload

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/FileUpload.jsx`, SHA-256 `5a37afe44694bfe5c53fa199374d02ceddb20fc0f4a02eb2b427079254a0b0cb`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Upload a file"
  }
}
```

```html
<div class="cs-dropzone"><span class="cs-dropzone__icon" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"></path><path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"></path></svg></span><label class="cs-dropzone__title" for="reference-id-002">Upload a file</label><span class="cs-dropzone__hint" id="reference-id-001">PNG, JPG, or PDF up to 10MB</span><input id="reference-id-002" class="cs-sr-only" aria-describedby="reference-id-001" type="file"></div>
```

## FloatingActionButton

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/button/FloatingActionButton.jsx`, SHA-256 `2c13907fa52c618377dd1aab15c46f73b2ce22c563b54bf0f5aefb16e3829943`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Create",
    "icon": "+"
  }
}
```

```html
<div class="cs-fab"><button type="button" class="cs-fab__main" aria-label="Create">+</button></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: Arial; font-size: 13.3333px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## Form

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Form.jsx`, SHA-256 `fc33716feb9f7496abd4ab9a21af27920cf78d014bc33f8e79a7fbae5ba3ec3f`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "component": "TextField",
        "props": {
          "label": "Name",
          "name": "name",
          "defaultValue": "Alpha"
        },
        "children": null
      }
    }
  }
}
```

```html
<form class="cs-form" novalidate=""><fieldset style="display: contents;"><label class="cs-field" for="reference-id-002"><span id="reference-id-001" class="cs-field__label">Name</span><input id="reference-id-002" aria-labelledby="reference-id-001" class="cs-field__control" value="Alpha" name="name"></label></fieldset></form>
```

## FormField

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Form.jsx`, SHA-256 `fc33716feb9f7496abd4ab9a21af27920cf78d014bc33f8e79a7fbae5ba3ec3f`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Name",
    "hint": "Reference hint",
    "children": {
      "$element": {
        "component": "TextField",
        "props": {
          "label": "Reference input"
        },
        "children": null
      }
    }
  }
}
```

```html
<div class="cs-formfield"><span id="reference-id-001" class="cs-formfield__label">Name</span><label class="cs-field" for="reference-id-003"><span id="reference-id-002" class="cs-field__label">Reference input</span><input id="reference-id-003" aria-labelledby="reference-id-002" aria-describedby="reference-id-004" class="cs-field__control"></label><span id="reference-id-004" class="cs-formfield__hint">Reference hint</span></div>
```

## FormFieldArray

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Form.jsx`, SHA-256 `fc33716feb9f7496abd4ab9a21af27920cf78d014bc33f8e79a7fbae5ba3ec3f`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "name": "rows",
    "label": "People",
    "children": {
      "$render": {
        "$element": {
          "component": "TextField",
          "props": {
            "label": "Name"
          },
          "children": null
        }
      }
    }
  },
  "wrapper": {
    "component": "Form",
    "props": {
      "rules": {},
      "initialValues": {
        "rows": [
          {
            "name": "Alpha"
          }
        ]
      }
    }
  }
}
```

```html
<form class="cs-form" novalidate=""><fieldset style="display: contents;"><div class="cs-form-array" data-name="rows"><div class="cs-formfield__label" style="margin-bottom: 8px;">People</div><div class="cs-form-array__rows"><div class="cs-form-array__row" data-index="0"><label class="cs-field" for="reference-id-002"><span id="reference-id-001" class="cs-field__label">Name</span><input id="reference-id-002" aria-labelledby="reference-id-001" class="cs-field__control"></label></div></div><button type="button" class="cs-button cs-button--secondary cs-button--sm" style="margin-top: 8px;">Add row</button></div></fieldset></form>
```

## FormWizard

rendered-dom-reference — Initial step zero with fixed render-prop descriptors; navigation/validation behavior is not part of the snapshot.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Form.jsx`, SHA-256 `fc33716feb9f7496abd4ab9a21af27920cf78d014bc33f8e79a7fbae5ba3ec3f`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "steps": [
      {
        "title": "Details",
        "render": {
          "$render": {
            "$element": {
              "tag": "p",
              "props": {},
              "children": "Reference <example> & \"quoted\" text"
            }
          }
        }
      },
      {
        "title": "Review",
        "render": {
          "$render": "Review"
        }
      }
    ]
  }
}
```

```html
<div class="cs-form-wizard" data-step="0"><ol class="cs-form-wizard__steps" style="display: flex; gap: 10px; list-style: none; padding: 0px; margin: 0px 0px 16px; flex-wrap: wrap;"><li aria-current="step" style="font-style: ; font-variant-ligatures: ; font-variant-caps: ; font-variant-numeric: ; font-variant-east-asian: ; font-variant-alternates: ; font-variant-position: ; font-variant-emoji: ; font-weight: 700; font-stretch: ; font-size: ; line-height: ; font-family: ; font-optical-sizing: ; font-size-adjust: ; font-kerning: ; font-feature-settings: ; font-variation-settings: ; font-language-override: ; text-transform: uppercase; letter-spacing: 0.06em; color: var(--cs-color-text-primary);">1. Details</li><li style="font-style: ; font-variant-ligatures: ; font-variant-caps: ; font-variant-numeric: ; font-variant-east-asian: ; font-variant-alternates: ; font-variant-position: ; font-variant-emoji: ; font-weight: 500; font-stretch: ; font-size: ; line-height: ; font-family: ; font-optical-sizing: ; font-size-adjust: ; font-kerning: ; font-feature-settings: ; font-variation-settings: ; font-language-override: ; text-transform: uppercase; letter-spacing: 0.06em; color: var(--cs-color-text-secondary);">2. Review</li></ol><div class="cs-form-wizard__body"><fieldset style="display: contents;"><p>Reference &lt;example&gt; &amp; "quoted" text</p></fieldset></div><div class="cs-form-wizard__nav" style="display: flex; gap: 10px; margin-top: 16px;"><button type="button" class="cs-button cs-button--secondary cs-button--sm" disabled="">Back</button><button type="button" class="cs-button cs-button--sm">Next</button></div></div>
```

## HotKeys

interactive-dom-snapshot — Initial closed/help-hidden fixture; only initial DOM is referenced, hidden interactive surfaces are not claimed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/HotKeys.jsx`, SHA-256 `bcdf9afdf1b9416987b43e993b8126d9420bee2de5bd8bd08910091bc9e66e6e`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "bindings": [
      {
        "keys": "mod+k",
        "description": "Reference shortcut"
      }
    ],
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-hotkeys">Reference &lt;example&gt; &amp; "quoted" text</div>
```

## HoverCard

interactive-dom-snapshot — Initial closed/help-hidden fixture; only initial DOM is referenced, hidden interactive surfaces are not claimed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/overlays/HoverCard.jsx`, SHA-256 `575ff663edf9f4556de55e5eb839dddba27650cf890fee204f8e6ba4d24d6f48`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "trigger": {
      "$element": {
        "tag": "button",
        "props": {
          "type": "button"
        },
        "children": "Hover reference"
      }
    },
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<span class="cs-hovercard"><button type="button">Hover reference</button></span><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: Arial; font-size: 13.3333px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: normal; color: rgb(0, 0, 0); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## HumanReviewGate

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/HumanReviewGate.jsx`, SHA-256 `0b0ce36ffa114d5ea40fc39405e44623740d2a6ae0c17acbab2973a789947b32`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "summary": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<section class="cs-review-gate" aria-label="Human review gate"><div class="cs-review-gate__risk">review required</div><p class="cs-review-gate__summary">Reference &lt;example&gt; &amp; "quoted" text</p><div class="cs-review-gate__actions"><button type="button" class="cs-button cs-button--secondary">Reject</button><button type="button" class="cs-button cs-button--primary">Approve</button></div></section>
```

## Icon

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/icon/Icon.jsx`, SHA-256 `c1d7d63c73094053718fd92bef441ff9f13e20023a642f07ecbaf8563eda7d05`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "name": "check",
    "label": "Complete"
  }
}
```

```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Complete" style="width: var(--cs-icon-md, 20px); height: var(--cs-icon-md, 20px); display: inline-block; flex: 0 0 auto;"><path d="M4 12.5l5 5 11-11"></path></svg>
```

## Image

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Image.jsx`, SHA-256 `7341c2593dfb031fabd0ae5f82c5ad830c0ec436cc8977e4c24d50956ada7001`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "src": "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"1\" height=\"1\"/%3E",
    "alt": "Reference pixel"
  }
}
```

```html
<span class="cs-image"><img alt="Reference pixel" src="data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;1&quot; height=&quot;1&quot;/%3E"></span>
```

## InlineEdit

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/InlineEdit.jsx`, SHA-256 `45b36df70b179243e329684ce20f61ed8dd4fda75e11674d24797713c644d4f8`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "value": "Reference value"
  }
}
```

```html
<span class="cs-inline-edit"><button type="button" class="cs-inline-edit__view" aria-label="Edit"><span>Reference value</span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z"></path></svg></button></span>
```

## InputGroup

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/InputGroup.jsx`, SHA-256 `0bd2e8f408f1942386857b64244211049aa9c31636e881ef2e06c5eb5cc60f56`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Reference input",
    "defaultValue": "Alpha"
  }
}
```

```html
<div class="cs-field"><label id="reference-id-001" class="cs-field__label" for="reference-id-002">Reference input</label><span class="cs-igroup"><input id="reference-id-002" aria-labelledby="reference-id-001" type="text" value="Alpha"></span></div>
```

## InputOTP

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/InputOTP.jsx`, SHA-256 `fe278664ea6bc07ac293ff28fe2ab6e6d8d2e0fc1cc6ddd3c3e59e68c088dacc`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "length": 4,
    "value": "1234",
    "label": "Verification"
  }
}
```

```html
<div id="reference-id-001" aria-label="Verification" class="cs-otp" role="group"><span id="reference-id-002" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%);">1/4</span><input id="reference-id-003" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="Verification 1/4" value="1"><span id="reference-id-004" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%);">2/4</span><input id="reference-id-005" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="Verification 2/4" value="2"><span id="reference-id-006" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%);">3/4</span><input id="reference-id-007" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="Verification 3/4" value="3"><span id="reference-id-008" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%);">4/4</span><input id="reference-id-009" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="Verification 4/4" value="4"></div>
```

## Item

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Item.jsx`, SHA-256 `525c6e1034e561d702305379d47debd81939294452a4c7485d4af2636d7a9ca1`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Reference item",
    "description": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-item"><span class="cs-item__main"><span class="cs-item__title">Reference item</span><span class="cs-item__description">Reference &lt;example&gt; &amp; "quoted" text</span></span></div>
```

## Kbd

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Kbd.jsx`, SHA-256 `f171f19f669a24d32222fb73288d28771c263b05b0a11487d4d51ca230a12db7`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Enter"
  }
}
```

```html
<kbd class="cs-kbd">Enter</kbd>
```

## Link

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Link.jsx`, SHA-256 `d4406a6a38f0b586176fa40bab51db654b277bdd4600663357ef0defc695c0a6`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "href": "#reference",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<a href="#reference" class="cs-link">Reference &lt;example&gt; &amp; "quoted" text</a>
```

## List

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/List.jsx`, SHA-256 `f33cd6ae9b7c93ca0f79dd41a892e110af8f1cc448d760f53281ef2c89b16a69`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "component": "ListItem",
        "props": {},
        "children": "Reference <example> & \"quoted\" text"
      }
    }
  }
}
```

```html
<div role="list" class="cs-list"><div role="listitem" class="cs-list__item"><span class="cs-list__main">Reference &lt;example&gt; &amp; "quoted" text</span></div></div>
```

## ListItem

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/List.jsx`, SHA-256 `f33cd6ae9b7c93ca0f79dd41a892e110af8f1cc448d760f53281ef2c89b16a69`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference <example> & \"quoted\" text"
  },
  "wrapper": {
    "tag": "ul",
    "props": {}
  }
}
```

```html
<ul><div role="listitem" class="cs-list__item"><span class="cs-list__main">Reference &lt;example&gt; &amp; "quoted" text</span></div></ul>
```

## LocaleProvider

context-only — Context-only provider with explicit English child and scoped copy; no user interaction.

Context provider adds no DOM root. Captured child markup does not retain context, message lookup or interactive behavior.

Source: `components/i18n/LocaleProvider.jsx`, SHA-256 `5545f338df720c75bb9cf6c421edd17d491411c60e0d6727189d184740074e96`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "messages": {
      "Pagination": {
        "en": {
          "next": "Reference next"
        }
      }
    },
    "children": {
      "$element": {
        "component": "Pagination",
        "props": {
          "lang": "en",
          "pageCount": 10
        }
      }
    }
  }
}
```

```html
<nav aria-label="Pagination" class="cs-pagination"><button type="button" disabled="" aria-label="Previous page">‹</button><button type="button" aria-current="page">1</button><button type="button">2</button><span class="cs-pagination__ellipsis" aria-hidden="true">…</span><button type="button">10</button><button type="button" aria-label="Reference next">›</button></nav>
```

## Logo

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/logo/Logo.jsx`, SHA-256 `a4c5fe0cf5cbbde1d8110134af730c47a69e94593453b824bafb9a80973cbc8b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "CyberSkill"
  }
}
```

```html
<svg class="cs-logo" width="32" height="32" viewBox="0 0 1007 1007" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CyberSkill"><title>CyberSkill</title><path fill="#45210E" opacity="1.000000" stroke="none" d="
M560.000000,1008.000000 
	C373.333344,1008.000000 187.166672,1008.000000 1.000000,1008.000000 
	C1.000000,672.333313 1.000000,336.666656 1.000000,1.000000 
	C336.666656,1.000000 672.333313,1.000000 1008.000000,1.000000 
	C1008.000000,336.666656 1008.000000,672.333313 1008.000000,1008.000000 
	C858.833313,1008.000000 709.666687,1008.000000 560.000000,1008.000000 
M440.743774,105.242386 
	C438.572540,107.309639 436.344940,109.321198 434.238464,111.452431 
	C396.510132,149.623566 372.276398,194.939011 363.356293,247.940109 
	C360.996429,261.961884 358.946777,276.673065 360.603027,290.610352 
	C365.030243,327.864777 394.910004,357.905762 431.834900,364.830811 
	C436.723083,365.747589 441.737213,365.993011 447.763702,366.669525 
	C446.254150,363.858124 445.507843,362.409912 444.709564,360.990906 
	C439.517578,351.761383 436.885193,341.740936 437.455444,331.277863 
	C439.589569,292.120056 458.815063,264.154144 494.094208,247.402267 
	C503.544983,242.914673 513.742554,238.863556 524.373901,240.455948 
	C548.543213,244.076111 568.703491,255.555466 584.000793,274.713074 
	C599.847656,294.559021 607.550598,317.209198 603.764282,342.677429 
	C602.575073,350.677063 598.728027,358.281586 595.936157,366.544159 
	C600.137085,366.074554 604.740540,365.758667 609.275574,365.021576 
	C646.763123,358.928711 678.394348,326.946808 681.791199,289.350922 
	C683.086792,275.012085 681.404419,259.972870 678.550415,245.760666 
	C660.577881,156.262833 608.759338,93.666801 525.888672,56.228947 
	C522.563171,54.726585 519.736023,54.769550 516.419739,56.200459 
	C488.640594,68.186523 463.511292,84.231010 440.743774,105.242386 
M286.676636,492.678345 
	C287.329773,493.793732 287.835724,495.033447 288.657562,496.006378 
	C309.770172,521.000305 334.755707,541.223022 364.045837,555.811401 
	C374.407410,560.972046 385.114655,566.593323 396.291962,568.749573 
	C432.863312,575.804749 469.791931,575.543579 506.608704,569.950623 
	C542.882812,564.440125 577.636902,553.955383 610.255371,536.938660 
	C635.979919,523.518494 665.744080,527.108459 687.312561,546.611755 
	C690.823608,549.786621 693.878845,553.465637 697.214539,556.985291 
	C719.173889,537.685486 738.051208,516.184204 753.920410,491.916840 
	C752.879761,490.957520 752.286987,490.387451 751.669678,489.845367 
	C716.653381,459.096100 676.901917,436.766174 632.377991,423.023193 
	C629.713745,422.200836 626.423889,422.161865 623.725525,422.882690 
	C590.944153,431.639587 558.238403,440.679779 525.448730,449.404907 
	C522.300964,450.242554 518.534851,450.164001 515.372437,449.321808 
	C482.598022,440.593750 449.897797,431.587128 417.141144,422.791412 
	C414.867096,422.180786 412.115295,422.006958 409.909119,422.683990 
	C363.870605,436.812317 322.877258,459.923096 286.676636,492.678345 
M638.193726,649.759216 
	C618.869507,656.015442 599.040955,658.948853 578.743958,658.635498 
	C561.320618,658.366577 544.380371,654.932678 527.565796,650.671387 
	C525.521851,650.153320 523.254150,649.859985 521.196533,650.169861 
	C512.810059,651.432678 504.514069,653.468018 496.093933,654.298462 
	C480.882416,655.798584 465.515686,658.255371 450.375763,657.410278 
	C421.185272,655.780762 394.125427,646.062805 369.145020,630.771667 
	C368.008179,630.075806 366.770874,629.544006 364.879761,628.577820 
	C379.822174,677.662048 402.386169,721.588440 433.601837,761.123535 
	C468.862305,805.781311 475.313782,854.488708 452.707825,906.779114 
	C449.580719,914.012512 445.212494,920.709351 441.423889,927.657288 
	C573.221985,890.897766 675.186523,765.328125 681.092896,630.672180 
	C667.338623,636.799011 653.131897,643.127319 638.193726,649.759216 
M451.496307,582.220520 
	C442.351196,581.799133 433.142700,581.909058 424.076202,580.828186 
	C411.400055,579.317017 398.218109,578.681030 386.332123,574.558289 
	C354.337128,563.460327 326.346069,545.236816 301.709656,521.949341 
	C300.020294,520.352478 298.291534,518.797302 295.873596,516.571472 
	C296.025665,518.456909 295.980042,519.134644 296.144836,519.756653 
	C304.310333,550.579102 319.447479,577.592346 342.608459,599.413086 
	C382.985504,637.453735 430.264038,654.771729 486.434967,647.405457 
	C555.692078,638.323059 618.847046,614.520935 675.700134,573.984924 
	C680.675537,570.437500 685.476868,566.646118 690.581665,562.800293 
	C677.023743,544.661377 659.575134,536.325806 637.562927,537.450195 
	C626.043884,538.038574 616.340271,543.514893 606.234131,548.288513 
	C557.596436,571.262329 506.255249,582.294250 451.496307,582.220520 
M539.676270,436.107300 
	C577.955139,425.690460 616.233948,415.273621 655.757202,404.518158 
	C635.089294,395.015900 615.544373,386.029968 595.877441,376.987946 
	C594.662292,379.021637 593.749573,380.591156 592.797180,382.136292 
	C586.595276,392.197998 578.925293,400.845184 568.666138,406.952454 
	C534.791809,427.117798 492.288269,422.383606 462.337891,394.876129 
	C456.381653,389.405701 451.112213,383.187500 445.401093,377.182709 
	C426.206024,386.105682 406.958923,395.052887 386.824615,404.412476 
	C389.268799,405.156464 390.645874,405.614380 392.043884,405.995544 
	C429.426819,416.187622 466.920624,425.996552 504.132446,436.778748 
	C515.781982,440.154175 526.683472,441.361206 537.944458,436.636871 
	C538.251221,436.508148 538.570312,436.408813 539.676270,436.107300 
M636.169495,641.720032 
	C693.203857,621.317932 729.752136,581.965942 745.785767,523.547119 
	C689.811462,583.441650 622.343140,624.064514 542.504456,645.372620 
	C570.121521,652.872437 603.639343,651.544189 636.169495,641.720032 
z"></path>
<path fill="#F4BA17" opacity="1.000000" stroke="none" d="
M441.015747,105.015450 
	C463.511292,84.231010 488.640594,68.186523 516.419739,56.200459 
	C519.736023,54.769550 522.563171,54.726585 525.888672,56.228947 
	C608.759338,93.666801 660.577881,156.262833 678.550415,245.760666 
	C681.404419,259.972870 683.086792,275.012085 681.791199,289.350922 
	C678.394348,326.946808 646.763123,358.928711 609.275574,365.021576 
	C604.740540,365.758667 600.137085,366.074554 595.936157,366.544159 
	C598.728027,358.281586 602.575073,350.677063 603.764282,342.677429 
	C607.550598,317.209198 599.847656,294.559021 584.000793,274.713074 
	C568.703491,255.555466 548.543213,244.076111 524.373901,240.455948 
	C513.742554,238.863556 503.544983,242.914673 494.094208,247.402267 
	C458.815063,264.154144 439.589569,292.120056 437.455444,331.277863 
	C436.885193,341.740936 439.517578,351.761383 444.709564,360.990906 
	C445.507843,362.409912 446.254150,363.858124 447.763702,366.669525 
	C441.737213,365.993011 436.723083,365.747589 431.834900,364.830811 
	C394.910004,357.905762 365.030243,327.864777 360.603027,290.610352 
	C358.946777,276.673065 360.996429,261.961884 363.356293,247.940109 
	C372.276398,194.939011 396.510132,149.623566 434.238464,111.452431 
	C436.344940,109.321198 438.572540,107.309639 441.015747,105.015450 
M523.796143,200.964203 
	C522.979370,200.806061 522.153381,200.684708 521.347168,200.484161 
	C511.964752,198.150375 505.739960,190.440384 506.015442,181.511810 
	C506.292053,172.544968 512.964478,165.113678 522.410034,163.391052 
	C528.999146,162.189362 534.425354,164.852509 539.153198,168.766846 
	C541.656067,166.404358 544.030029,164.163544 546.391113,161.934906 
	C535.207764,149.868927 515.326111,149.927109 503.764648,161.836975 
	C492.335419,173.610657 493.100830,193.056198 505.417236,203.820190 
	C517.457336,214.342712 537.192993,213.508774 546.093628,202.189407 
	C543.863281,199.842941 541.645081,197.509277 539.426880,195.175613 
	C539.477722,195.664429 539.528503,196.153259 539.579346,196.642075 
	C534.598694,198.089890 529.617981,199.537689 523.796143,200.964203 
z"></path>
<path fill="#F4BA17" opacity="1.000000" stroke="none" d="
M286.857971,492.402985 
	C322.877258,459.923096 363.870605,436.812317 409.909119,422.683990 
	C412.115295,422.006958 414.867096,422.180786 417.141144,422.791412 
	C449.897797,431.587128 482.598022,440.593750 515.372437,449.321808 
	C518.534851,450.164001 522.300964,450.242554 525.448730,449.404907 
	C558.238403,440.679779 590.944153,431.639587 623.725525,422.882690 
	C626.423889,422.161865 629.713745,422.200836 632.377991,423.023193 
	C676.901917,436.766174 716.653381,459.096100 751.669678,489.845367 
	C752.286987,490.387451 752.879761,490.957520 753.920410,491.916840 
	C738.051208,516.184204 719.173889,537.685486 697.214539,556.985291 
	C693.878845,553.465637 690.823608,549.786621 687.312561,546.611755 
	C665.744080,527.108459 635.979919,523.518494 610.255371,536.938660 
	C577.636902,553.955383 542.882812,564.440125 506.608704,569.950623 
	C469.791931,575.543579 432.863312,575.804749 396.291962,568.749573 
	C385.114655,566.593323 374.407410,560.972046 364.045837,555.811401 
	C334.755707,541.223022 309.770172,521.000305 288.657562,496.006378 
	C287.835724,495.033447 287.329773,493.793732 286.857971,492.402985 
z"></path>
<path fill="#F4BA17" opacity="1.000000" stroke="none" d="
M638.559448,649.607422 
	C653.131897,643.127319 667.338623,636.799011 681.092896,630.672180 
	C675.186523,765.328125 573.221985,890.897766 441.421356,927.655945 
	C445.212494,920.709351 449.580719,914.012512 452.707825,906.779114 
	C475.313782,854.488708 468.862305,805.781311 433.601837,761.123535 
	C402.386169,721.588440 379.822174,677.662048 364.879761,628.577820 
	C366.770874,629.544006 368.008179,630.075806 369.145020,630.771667 
	C394.125427,646.062805 421.185272,655.780762 450.375763,657.410278 
	C465.515686,658.255371 480.882416,655.798584 496.093933,654.298462 
	C504.514069,653.468018 512.810059,651.432678 521.196533,650.169861 
	C523.254150,649.859985 525.521851,650.153320 527.565796,650.671387 
	C544.380371,654.932678 561.320618,658.366577 578.743958,658.635498 
	C599.040955,658.948853 618.869507,656.015442 638.559448,649.607422 
z"></path>
<path fill="#F3B917" opacity="1.000000" stroke="none" d="
M451.996887,582.225220 
	C506.255249,582.294250 557.596436,571.262329 606.234131,548.288513 
	C616.340271,543.514893 626.043884,538.038574 637.562927,537.450195 
	C659.575134,536.325806 677.023743,544.661377 690.581665,562.800293 
	C685.476868,566.646118 680.675537,570.437500 675.700134,573.984924 
	C618.847046,614.520935 555.692078,638.323059 486.434967,647.405457 
	C430.264038,654.771729 382.985504,637.453735 342.608459,599.413086 
	C319.447479,577.592346 304.310333,550.579102 296.144836,519.756653 
	C295.980042,519.134644 296.025665,518.456909 295.873596,516.571472 
	C298.291534,518.797302 300.020294,520.352478 301.709656,521.949341 
	C326.346069,545.236816 354.337128,563.460327 386.332123,574.558289 
	C398.218109,578.681030 411.400055,579.317017 424.076202,580.828186 
	C433.142700,581.909058 442.351196,581.799133 451.996887,582.225220 
z"></path>
<path fill="#F2B817" opacity="1.000000" stroke="none" d="
M539.279968,436.201538 
	C538.570312,436.408813 538.251221,436.508148 537.944458,436.636871 
	C526.683472,441.361206 515.781982,440.154175 504.132446,436.778748 
	C466.920624,425.996552 429.426819,416.187622 392.043884,405.995544 
	C390.645874,405.614380 389.268799,405.156464 386.824615,404.412476 
	C406.958923,395.052887 426.206024,386.105682 445.401093,377.182709 
	C451.112213,383.187500 456.381653,389.405701 462.337891,394.876129 
	C492.288269,422.383606 534.791809,427.117798 568.666138,406.952454 
	C578.925293,400.845184 586.595276,392.197998 592.797180,382.136292 
	C593.749573,380.591156 594.662292,379.021637 595.877441,376.987946 
	C615.544373,386.029968 635.089294,395.015900 655.757202,404.518158 
	C616.233948,415.273621 577.955139,425.690460 539.279968,436.201538 
z"></path>
<path fill="#F2B817" opacity="1.000000" stroke="none" d="
M635.789856,641.836487 
	C603.639343,651.544189 570.121521,652.872437 542.504456,645.372620 
	C622.343140,624.064514 689.811462,583.441650 745.785767,523.547119 
	C729.752136,581.965942 693.203857,621.317932 635.789856,641.836487 
z"></path>
<path fill="#48240F" opacity="1.000000" stroke="none" d="
M524.216736,200.974854 
	C529.617981,199.537689 534.598694,198.089890 539.579346,196.642075 
	C539.528503,196.153259 539.477722,195.664429 539.426880,195.175613 
	C541.645081,197.509277 543.863281,199.842941 546.093628,202.189407 
	C537.192993,213.508774 517.457336,214.342712 505.417236,203.820190 
	C493.100830,193.056198 492.335419,173.610657 503.764648,161.836975 
	C515.326111,149.927109 535.207764,149.868927 546.391113,161.934906 
	C544.030029,164.163544 541.656067,166.404358 539.153198,168.766846 
	C534.425354,164.852509 528.999146,162.189362 522.410034,163.391052 
	C512.964478,165.113678 506.292053,172.544968 506.015442,181.511810 
	C505.739960,190.440384 511.964752,198.150375 521.347168,200.484161 
	C522.153381,200.684708 522.979370,200.806061 524.216736,200.974854 
z"></path></svg>
```

## LumiAvatar

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/brand/LumiAvatar.jsx`, SHA-256 `aef2a9a8be4e4d6eb240d2a4bd6ca32b396fab995663750c812e3b38d228901c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "size": "md"
  }
}
```

```html
<span class="cs-lumi cs-lumi--md" role="img" aria-label="Lumi"><span aria-hidden="true">✦</span></span>
```

## Masonry

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Masonry.jsx`, SHA-256 `86ffb4c1e1fbdfe44286b5a3099786eddf134cbf66873119b6bdfa082b3d2375`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": [
      {
        "$element": {
          "tag": "div",
          "props": {},
          "children": "Alpha"
        }
      },
      {
        "$element": {
          "tag": "div",
          "props": {},
          "children": "Beta"
        }
      }
    ]
  }
}
```

```html
<div class="cs-masonry" style="column-count: 3; column-gap: 16px;"><div class="cs-masonry__item" style="margin-bottom: 16px;"><div>Alpha</div></div><div class="cs-masonry__item" style="margin-bottom: 16px;"><div>Beta</div></div></div>
```

## Mentions

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Mentions.jsx`, SHA-256 `324a1ef9e7b9adf50454063acffb19ec15adcbcec9ff1f760a15cae56f167f32`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "users": [
      "anna"
    ],
    "aria-label": "Message"
  }
}
```

```html
<span class="cs-mentions"><textarea class="cs-field__control" rows="3" placeholder="Add a note — @ to mention" aria-label="Message" aria-autocomplete="list" aria-haspopup="listbox"></textarea></span><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: start; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## Menu

interactive-dom-snapshot — Controlled open=true fixture; snapshot is not a standalone usable overlay.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Menu.jsx`, SHA-256 `d52fc45cfca5febb4d775d9dd10ae771e5333b3ba1c9a97a3eb44fd6ea1f5873`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "open": true,
    "trigger": {
      "$element": {
        "tag": "button",
        "props": {
          "type": "button"
        },
        "children": "Reference menu"
      }
    },
    "children": {
      "$element": {
        "component": "MenuItem",
        "props": {},
        "children": "Reference item"
      }
    }
  }
}
```

```html
<div class="cs-menu"><button type="button" aria-haspopup="menu" aria-expanded="true">Reference menu</button></div><span data-cs-floating-root="" lang="en" data-open="true" style="display: contents; font-family: Arial; font-size: 13.3333px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: normal; color: rgb(0, 0, 0); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"><div class="cs-menu__list" role="menu" aria-label="Menu" style="transition-property: opacity, color, background-color, border-color, box-shadow; position: fixed; inset: 30px auto auto 8px; transform: none; margin: 0px; box-sizing: border-box; overflow-y: auto; z-index: 60; max-width: 1264px; min-width: 200px; max-height: 682px; min-height: 0px;" data-cs-placement="bottom-start"><button type="button" role="menuitem" tabindex="0" class="cs-menu__item">Reference item</button></div></span>
```

## MenuItem

interactive-dom-snapshot — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Menu.jsx`, SHA-256 `d52fc45cfca5febb4d775d9dd10ae771e5333b3ba1c9a97a3eb44fd6ea1f5873`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference item"
  },
  "wrapper": {
    "component": "Menu",
    "props": {
      "open": true,
      "trigger": {
        "$element": {
          "tag": "button",
          "props": {
            "type": "button"
          },
          "children": "Reference menu"
        }
      }
    }
  }
}
```

```html
<div class="cs-menu"><button type="button" aria-haspopup="menu" aria-expanded="true">Reference menu</button></div><span data-cs-floating-root="" lang="en" data-open="true" style="display: contents; font-family: Arial; font-size: 13.3333px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: normal; color: rgb(0, 0, 0); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"><div class="cs-menu__list" role="menu" aria-label="Menu" style="transition-property: opacity, color, background-color, border-color, box-shadow; position: fixed; inset: 30px auto auto 8px; transform: none; margin: 0px; box-sizing: border-box; overflow-y: auto; z-index: 60; max-width: 1264px; min-width: 200px; max-height: 682px; min-height: 0px;" data-cs-placement="bottom-start"><button type="button" role="menuitem" tabindex="0" class="cs-menu__item">Reference item</button></div></span>
```

## Menubar

interactive-dom-snapshot — Initial closed/help-hidden fixture; only initial DOM is referenced, hidden interactive surfaces are not claimed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Menubar.jsx`, SHA-256 `21b8409d336182e0706de0d4ece24d2304d1978eea42dbc313949d9a46819ea9`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "menus": [
      {
        "label": "File",
        "items": [
          {
            "label": "Open"
          }
        ]
      }
    ]
  }
}
```

```html
<div class="cs-menubar" role="menubar" aria-label="Application menu"><span class="cs-menubar__wrap"><button id="reference-id-001" type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" tabindex="0" class="cs-menubar__top">File</button></span></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: start; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## NativeSelect

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/NativeSelect.jsx`, SHA-256 `fc49d3ff729ccca1bee0a8e59737256266f37cdb1fcbf0acfa2129a17ca098b1`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Project",
    "options": [
      {
        "value": "a",
        "label": "Alpha"
      },
      {
        "value": "b",
        "label": "Beta"
      }
    ],
    "defaultValue": "a"
  }
}
```

```html
<label class="cs-field cs-native-select-field" for="reference-id-002"><span id="reference-id-001" class="cs-field__label">Project</span><span class="cs-native-select cs-native-select--md"><select id="reference-id-002" aria-labelledby="reference-id-001" class="cs-field__control"><option value="a" selected="">Alpha</option><option value="b">Beta</option></select><span class="cs-native-select__chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></span></span></label>
```

## NavItem

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Sidebar.jsx`, SHA-256 `f2a96bdbab2d0136e1a4ff6c8f209b8dccca9d25ddbdb68819eef65c532e1b1b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "href": "#home",
    "children": "Home"
  }
}
```

```html
<a class="cs-nav-item" href="#home"><span>Home</span></a>
```

## NavigationMenu

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/NavigationMenu.jsx`, SHA-256 `2d8e2f9cc80d24827b4b070517b1d69609bf842b9c26fc06912e51a273f2fd98`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "label": "Reference",
        "href": "#reference"
      }
    ]
  }
}
```

```html
<nav class="cs-navmenu"><a href="#reference" class="cs-navmenu__top">Reference</a></nav><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: start; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## NumberField

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/NumberField.jsx`, SHA-256 `f2dfbf219d37f79f31a96b70240fc5946a7bb440006c4101356579044d50f350`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Quantity",
    "defaultValue": 3
  }
}
```

```html
<div class="cs-field"><label class="cs-field__label" for="reference-id-001">Quantity</label><div class="cs-stepper"><button type="button" aria-label="Decrease">−</button><input id="reference-id-001" step="1" aria-label="Quantity" type="number" value="3"><button type="button" aria-label="Increase">+</button></div></div>
```

## OverlayProvider

context-only — Explicit fixture mount; no user interaction performed.

Context provider has no own native element. Any rendered markup belongs to its fixture child.

Source: `components/overlays/OverlayManager.jsx`, SHA-256 `32ffa7dcba2916ef473d4d9a40acb706b9f1209d61adf0305891703516612a06`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "tag": "span",
        "props": {},
        "children": "Context child"
      }
    }
  }
}
```

```html
<div data-cs-overlay-root="" id="reference-id-001"></div><span>Context child</span>
```

## Pagination

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Pagination.jsx`, SHA-256 `1f8c7370a149dd4007e0cfecda0ab968767b2000cf54c477a982dbf0d1b5c751`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "pageCount": 3,
    "page": 1
  }
}
```

```html
<nav aria-label="Pagination" class="cs-pagination"><button type="button" disabled="" aria-label="Previous page">‹</button><button type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button" aria-label="Next page">›</button></nav>
```

## Popconfirm

interactive-dom-snapshot — Initial closed/help-hidden fixture; only initial DOM is referenced, hidden interactive surfaces are not claimed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/overlays/Popconfirm.jsx`, SHA-256 `53d59355a4426bc59fae7d360118908827ace22c63ee74476535d77a40a75732`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "trigger": {
      "$element": {
        "tag": "button",
        "props": {
          "type": "button"
        },
        "children": "Confirm reference"
      }
    },
    "title": "Continue?"
  }
}
```

```html
<span class="cs-popconfirm"><button type="button" aria-haspopup="dialog" aria-expanded="false">Confirm reference</button></span><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: Arial; font-size: 13.3333px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: normal; color: rgb(0, 0, 0); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## Popover

interactive-dom-snapshot — Controlled open=true fixture; snapshot is not a standalone usable overlay.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/overlays/Popover.jsx`, SHA-256 `1ca5d2905995cc8166566625208a95e8838815d3abe1298312df71eab90b2679`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "open": true,
    "trigger": {
      "$element": {
        "tag": "button",
        "props": {
          "type": "button"
        },
        "children": "Reference details"
      }
    },
    "children": "Reference <example> & \"quoted\" text",
    "aria-label": "Reference details"
  }
}
```

```html
<span class="cs-popover"><button type="button" aria-haspopup="dialog" aria-expanded="true">Reference details</button></span><span data-cs-floating-root="" lang="en" data-open="true" style="display: contents; font-family: Arial; font-size: 13.3333px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: normal; color: rgb(0, 0, 0); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"><div class="cs-popover__panel" role="dialog" aria-label="Reference details" style="transition-property: opacity, color, background-color, border-color, box-shadow; position: fixed; inset: 32px auto auto 8px; transform: none; margin: 0px; box-sizing: border-box; overflow-y: auto; z-index: 60; max-width: 1264px; min-width: 240px; max-height: 680px; min-height: 0px;" data-cs-placement="bottom-start">Reference &lt;example&gt; &amp; "quoted" text</div></span>
```

## ProgressBar

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/ProgressBar.jsx`, SHA-256 `6b5e69900ba76d274dbe25dac4b7d75bb5fde9f2231e2cac08902171994fd8d1`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "value": 60,
    "label": "Progress"
  }
}
```

```html
<div class="cs-progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="Progress"><span class="cs-progress__fill" style="inline-size: 60%; width: 60%;"></span></div>
```

## PromptInput

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/PromptInput.jsx`, SHA-256 `af962b0e65d405a27e7742ebc0d76be3db0b92b90ac1f91e4eb0393b0caa0f97`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "placeholder": "Ask a question"
  }
}
```

```html
<div class="cs-prompt"><textarea class="cs-prompt__field" rows="1" placeholder="Ask a question" aria-label="Ask a question"></textarea><div class="cs-prompt__bar"><span class="cs-prompt__hint"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"></path></svg>Lumi replies, then hands clear wishes to a human.</span><button type="button" class="cs-button cs-button--primary cs-button--sm">Send</button></div></div>
```

## PromptSuggestions

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/PromptSuggestions.jsx`, SHA-256 `c4c6fca2eb27fd7eb7357a75bc3df9191973eddb051bb0db4eb95a3fe9970345`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "suggestions": [
      "Explain this"
    ]
  }
}
```

```html
<div class="cs-suggest"><button type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"></path></svg>Explain this</button></div>
```

## QRCode

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior. This fixture emits SVG paths, not a canvas bitmap.

Source: `components/data/QRCode.jsx`, SHA-256 `0df916a87ae5fdf9c8c8b46efbc69c84856b3a45cef0af1a9b5a72a13666b149`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "value": "reference"
  }
}
```

```html
<span class="cs-qrcode" role="img" aria-label="reference"><svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true"><path d="M0 0h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 0h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 0h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 0h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 0h6.095238095238095v6.095238095238095h-6.095238095238095zM30.476190476190474 0h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 0h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 0h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 0h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 0h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 0h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 0h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 0h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 0h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 0h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 0h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 0h6.095238095238095v6.095238095238095h-6.095238095238095zM0 6.095238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 6.095238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 6.095238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 6.095238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 6.095238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 6.095238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 6.095238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM0 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 12.19047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM0 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 18.285714285714285h6.095238095238095v6.095238095238095h-6.095238095238095zM0 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 24.38095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM0 30.476190476190474h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 30.476190476190474h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 30.476190476190474h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 30.476190476190474h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 30.476190476190474h6.095238095238095v6.095238095238095h-6.095238095238095zM0 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM30.476190476190474 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 36.57142857142857h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 42.666666666666664h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 42.666666666666664h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 42.666666666666664h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 42.666666666666664h6.095238095238095v6.095238095238095h-6.095238095238095zM0 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM30.476190476190474 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM42.666666666666664 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM79.23809523809524 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 48.76190476190476h6.095238095238095v6.095238095238095h-6.095238095238095zM0 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM30.476190476190474 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM42.666666666666664 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM79.23809523809524 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 54.857142857142854h6.095238095238095v6.095238095238095h-6.095238095238095zM0 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM79.23809523809524 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 60.95238095238095h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM30.476190476190474 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM42.666666666666664 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 67.04761904761904h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM42.666666666666664 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 73.14285714285714h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 79.23809523809524h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 79.23809523809524h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 79.23809523809524h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 79.23809523809524h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 79.23809523809524h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 79.23809523809524h6.095238095238095v6.095238095238095h-6.095238095238095zM0 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM30.476190476190474 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM79.23809523809524 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 85.33333333333333h6.095238095238095v6.095238095238095h-6.095238095238095zM0 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM79.23809523809524 91.42857142857142h6.095238095238095v6.095238095238095h-6.095238095238095zM0 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM67.04761904761904 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 97.52380952380952h6.095238095238095v6.095238095238095h-6.095238095238095zM0 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 103.61904761904762h6.095238095238095v6.095238095238095h-6.095238095238095zM0 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM109.71428571428571 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 109.71428571428571h6.095238095238095v6.095238095238095h-6.095238095238095zM0 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM54.857142857142854 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM91.42857142857142 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 115.8095238095238h6.095238095238095v6.095238095238095h-6.095238095238095zM0 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM6.095238095238095 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM12.19047619047619 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM18.285714285714285 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM24.38095238095238 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM30.476190476190474 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM36.57142857142857 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM48.76190476190476 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM60.95238095238095 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM73.14285714285714 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM85.33333333333333 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM97.52380952380952 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM103.61904761904762 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM115.8095238095238 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095zM121.9047619047619 121.9047619047619h6.095238095238095v6.095238095238095h-6.095238095238095z" fill="var(--cs-color-text-primary)"></path></svg></span>
```

## Radio

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/RadioGroup.jsx`, SHA-256 `b72f446770714b8032ebaeaf060418dae4133c882ea1c69412b87c0c6a1823d3`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Reference choice",
    "value": "a",
    "defaultChecked": true
  }
}
```

```html
<label class="cs-radio"><input aria-labelledby="reference-id-001" type="radio" value="a" checked=""><span class="cs-radio__text"><span id="reference-id-001">Reference choice</span></span></label>
```

## RadioGroup

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/RadioGroup.jsx`, SHA-256 `b72f446770714b8032ebaeaf060418dae4133c882ea1c69412b87c0c6a1823d3`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "options": [
      {
        "value": "a",
        "label": "Alpha"
      },
      {
        "value": "b",
        "label": "Beta"
      }
    ],
    "legend": "Project",
    "value": "a"
  }
}
```

```html
<fieldset class="cs-radio-group"><legend>Project</legend><label class="cs-radio"><input aria-labelledby="reference-id-001" type="radio" value="a" checked="" name="_r_11_"><span class="cs-radio__text"><span id="reference-id-001">Alpha</span></span></label><label class="cs-radio"><input aria-labelledby="reference-id-002" type="radio" value="b" name="_r_11_"><span class="cs-radio__text"><span id="reference-id-002">Beta</span></span></label></fieldset>
```

## Rating

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Rating.jsx`, SHA-256 `3d545ce0192b31427088bfa3f5d8f29ff49e6eec2e5369cc8e72ef87645abdd3`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Rating",
    "defaultValue": 3
  }
}
```

```html
<div id="reference-id-001" aria-label="Rating: 3 / 5" class="cs-rating" role="radiogroup"><button type="button" role="radio" aria-checked="false" aria-label="1 / 5" class="on" tabindex="-1"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z"></path></svg></button><button type="button" role="radio" aria-checked="false" aria-label="2 / 5" class="on" tabindex="-1"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z"></path></svg></button><button type="button" role="radio" aria-checked="true" aria-label="3 / 5" class="on" tabindex="0"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z"></path></svg></button><button type="button" role="radio" aria-checked="false" aria-label="4 / 5" tabindex="-1"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z"></path></svg></button><button type="button" role="radio" aria-checked="false" aria-label="5 / 5" tabindex="-1"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z"></path></svg></button></div>
```

## Result

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Result.jsx`, SHA-256 `3977aaa50e38a5b569112dc42e8706db0365e8c6c682de805048e1e554c8bb40`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Reference result",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-result cs-result--info" role="status"><span class="cs-result__icon" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v6M12 7.2v.1"></path></svg></span><h2 class="cs-result__title">Reference result</h2><div class="cs-result__body">Reference &lt;example&gt; &amp; "quoted" text</div></div>
```

## ScrollArea

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/ScrollArea.jsx`, SHA-256 `2bdf99b2f7c2bb2658f2a59337919e35646b50aee282ce90d0ba21c39a8d25c3`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "tag": "p",
        "props": {},
        "children": "Reference <example> & \"quoted\" text"
      }
    }
  }
}
```

```html
<div class="cs-scroll-area" tabindex="0"><p>Reference &lt;example&gt; &amp; "quoted" text</p></div>
```

## SearchField

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/SearchField.jsx`, SHA-256 `44a861064011a4ebf8cd1224d95b0404c44e4cb8a1685d5981f8009ff8a824de`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "defaultValue": "Alpha",
    "aria-label": "Search"
  }
}
```

```html
<div class="cs-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg><input aria-label="Search" role="searchbox" placeholder="Search…" type="text" value="Alpha"><button type="button" class="cs-search__clear" aria-label="Clear search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></div>
```

## SegmentedControl

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/SegmentedControl.jsx`, SHA-256 `acf7e576e1680065c505039b2599f0a8f1b49584d112efa3f4dc892f4cb5cd93`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "options": [
      {
        "value": "a",
        "label": "Alpha"
      },
      {
        "value": "b",
        "label": "Beta"
      }
    ],
    "value": "a"
  }
}
```

```html
<div role="radiogroup" aria-orientation="horizontal" class="cs-segmented"><button type="button" role="radio" aria-checked="true" tabindex="0">Alpha</button><button type="button" role="radio" aria-checked="false" tabindex="-1">Beta</button></div>
```

## Select

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Select.jsx`, SHA-256 `a87c83c2783177fdaa135bb576e772b2c10fd8517d574622d8b15ceb611452b1`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Project",
    "options": [
      {
        "value": "a",
        "label": "Alpha"
      },
      {
        "value": "b",
        "label": "Beta"
      }
    ],
    "defaultValue": "a"
  }
}
```

```html
<label class="cs-field" for="reference-id-002"><span id="reference-id-001" class="cs-field__label">Project</span><span class="cs-select"><select id="reference-id-002" aria-labelledby="reference-id-001" class="cs-field__control"><option value="" disabled="" hidden="">Select…</option><option value="a" selected="">Alpha</option><option value="b">Beta</option></select><span class="cs-select__chevron" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></span></span></label>
```

## Sidebar

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Sidebar.jsx`, SHA-256 `f2a96bdbab2d0136e1a4ff6c8f209b8dccca9d25ddbdb68819eef65c532e1b1b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "component": "NavItem",
        "props": {
          "href": "#home"
        },
        "children": "Home"
      }
    }
  }
}
```

```html
<nav class="cs-sidebar"><a class="cs-nav-item" href="#home"><span>Home</span></a></nav>
```

## Skeleton

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Skeleton.jsx`, SHA-256 `56b00bf55c72eac2c65d57d24ae01520830ff2f2f8e5896e879f3c56fe420e83`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "lines": 2
  }
}
```

```html
<div aria-hidden="true" role="presentation"><span class="cs-skeleton cs-skeleton--text" style="width: 100%;"></span><span class="cs-skeleton cs-skeleton--text" style="width: 70%;"></span></div>
```

## Slider

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Slider.jsx`, SHA-256 `409856d4cdba4dff50810000c4b00350d65c801ec7f54a6dd74eef14dd01ca05`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "defaultValue": 40,
    "aria-label": "Progress"
  }
}
```

```html
<input class="cs-slider" aria-label="Progress" type="range" value="40">
```

## Sortable

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Sortable.jsx`, SHA-256 `de39e14bb0655473e483b6878f4ddbd399ab0f6c7b5c757a01f2f895782c713c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "key": "a",
        "label": "Alpha"
      },
      {
        "key": "b",
        "label": "Beta"
      }
    ]
  }
}
```

```html
<ul class="cs-sortable"><li draggable="true" class="cs-sortable__item"><span class="cs-sortable__grip" aria-hidden="true">⠿</span><span class="cs-sortable__label">Alpha</span><span class="cs-sortable__ops"><button type="button" class="cs-button cs-button--secondary cs-button--xs" aria-label="Move up" disabled="">↑</button><button type="button" class="cs-button cs-button--secondary cs-button--xs" aria-label="Move down">↓</button></span></li><li draggable="true" class="cs-sortable__item"><span class="cs-sortable__grip" aria-hidden="true">⠿</span><span class="cs-sortable__label">Beta</span><span class="cs-sortable__ops"><button type="button" class="cs-button cs-button--secondary cs-button--xs" aria-label="Move up">↑</button><button type="button" class="cs-button cs-button--secondary cs-button--xs" aria-label="Move down" disabled="">↓</button></span></li></ul>
```

## Spinner

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Spinner.jsx`, SHA-256 `dc4addb99ec3c60b9b7f55c245a68a7270c7d562f8cf45a8eef6398ab71a5a91`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {}
}
```

```html
<span role="status" aria-label="Loading" class="cs-spinner" style="inline-size: 20px; block-size: 20px; width: 20px; height: 20px;"></span>
```

## Splitter

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Splitter.jsx`, SHA-256 `dba77796d22d57cd83dd9687ba5fb05f06de74257c4b6ad5cdf9f84115bbbdb8`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "start": "Left pane",
    "end": "Right pane",
    "initial": 50
  }
}
```

```html
<div class="cs-splitter" style="height: 240px; display: grid; grid-template-columns: minmax(0px, 50fr) auto minmax(0px, 50fr);"><div class="cs-splitter__pane">Left pane</div><div class="cs-splitter__bar" role="separator" aria-orientation="vertical" aria-label="Resize panes" aria-valuenow="50" aria-valuemin="20" aria-valuemax="80" tabindex="0"></div><div class="cs-splitter__pane">Right pane</div></div>
```

## Stat

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Stat.jsx`, SHA-256 `748ee679d2fc83054d046cded45156bca1e712fb4f4bcd0b0c64c8c667f3f90d`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Reference count",
    "value": "42"
  }
}
```

```html
<div class="cs-stat"><div class="cs-stat__label">Reference count</div><div class="cs-stat__value">42</div></div>
```

## StatusIndicator

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/StatusIndicator.jsx`, SHA-256 `b969e7713b3e478b6ed83349472be50553328f98071fc8844da575ef3623a51c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "status": "online",
    "children": "Online"
  }
}
```

```html
<span class="cs-status cs-status--online"><span class="cs-status__dot" aria-hidden="true"></span>Online</span>
```

## Steps

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Steps.jsx`, SHA-256 `82b14258d351ed61301057c7599f10ec3f250e62d19378ac93f15b93c5432cec`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "steps": [
      {
        "title": "Details"
      },
      {
        "title": "Review"
      }
    ],
    "current": 0
  }
}
```

```html
<div class="cs-steps" role="list" aria-label="Steps"><div class="cs-step cs-step--active" role="listitem" aria-current="step"><span class="cs-step__marker">1</span><span class="cs-step__title">Details</span></div><div class="cs-step cs-step--todo" role="listitem"><span class="cs-step__marker">2</span><span class="cs-step__title">Review</span></div></div>
```

## Switch

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Switch.jsx`, SHA-256 `a321971bc38a64494273a464da2e184d058737fe04e8ef936005fe2b7580235e`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Enable reference",
    "defaultChecked": true
  }
}
```

```html
<label class="cs-switch"><input role="switch" type="checkbox" checked=""><span class="cs-switch__track" aria-hidden="true"></span><span class="cs-switch__label">Enable reference</span></label>
```

## Tab

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Tabs.jsx`, SHA-256 `551a0dc725d8bd64a5736228d487fe303e02ba46925299a4ce8511b16f680188`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference tab",
    "selected": true
  }
}
```

```html
<button type="button" role="tab" aria-selected="true" class="cs-tab">Reference tab</button>
```

## Tabs

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Tabs.jsx`, SHA-256 `551a0dc725d8bd64a5736228d487fe303e02ba46925299a4ce8511b16f680188`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "tabs": [
      {
        "value": "a",
        "label": "Alpha"
      },
      {
        "value": "b",
        "label": "Beta"
      }
    ],
    "value": "a"
  }
}
```

```html
<div role="tablist" aria-label="Tabs" class="cs-tabs"><button type="button" role="tab" aria-selected="true" tabindex="0" class="cs-tab">Alpha</button><button type="button" role="tab" aria-selected="false" tabindex="-1" class="cs-tab">Beta</button></div>
```

## Tag

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Tag.jsx`, SHA-256 `8b6415fd3811a97a82edb62391b0b78059f31ae09b93c92ac55868ca1b68f281`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "Reference"
  }
}
```

```html
<span class="cs-tag">Reference</span>
```

## TagInput

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/TagInput.jsx`, SHA-256 `775a7e22922619577b27bbd0bfc2cc4b193e938fd4b2dc7dc44e997e219c41a3`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Tags",
    "defaultValue": [
      "Alpha"
    ]
  }
}
```

```html
<div class="cs-field"><label id="reference-id-001" class="cs-field__label" for="reference-id-002">Tags</label><div class="cs-taginput"><span class="cs-tag">Alpha<button type="button" class="cs-tag__close" aria-label="Remove Alpha"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></span><input id="reference-id-002" aria-labelledby="reference-id-001" placeholder="" value=""></div></div>
```

## Terminal

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Terminal.jsx`, SHA-256 `0e3c5aff1c9dbc1eaf5863c5ffe7c7f9d1c5ca5f74fbc50fb62f3061c471d19b`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "welcome": "Reference output"
  }
}
```

```html
<div class="cs-terminal"><div class="cs-terminal__bar"><i></i><i></i><i></i><span>cyberskill — zsh</span></div><div class="cs-terminal__body"><div class="cs-terminal__out">Reference output</div><div class="cs-terminal__line"><span class="p">➜</span><input aria-label="Terminal input" spellcheck="false" value=""></div></div></div>
```

## TextField

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/textfield/TextField.jsx`, SHA-256 `878810214bb342d85d933884b5b19984b57f7281e4560c18280b8f4c021c5f99`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Name",
    "defaultValue": "Alpha",
    "description": "Reference hint"
  }
}
```

```html
<label class="cs-field" for="reference-id-003"><span id="reference-id-001" class="cs-field__label">Name</span><span id="reference-id-002" class="cs-field__description">Reference hint</span><input id="reference-id-003" aria-labelledby="reference-id-001" aria-describedby="reference-id-002" class="cs-field__control" value="Alpha"></label>
```

## Textarea

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Textarea.jsx`, SHA-256 `8a7c960a4b7b3b9e8cf6d69e21c44f49067bbc35a404f010471720e34f70a263`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Notes",
    "defaultValue": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<label class="cs-field" for="reference-id-002"><span id="reference-id-001" class="cs-field__label">Notes</span><textarea id="reference-id-002" rows="4" aria-labelledby="reference-id-001" class="cs-field__control">Reference &lt;example&gt; &amp; "quoted" text</textarea></label>
```

## TimePicker

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/TimePicker.jsx`, SHA-256 `0537c564b214b46fd3ddaa44caefc05b7accb1873987ade73b69c18d2456718e`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Time",
    "value": "09:30"
  }
}
```

```html
<span class="cs-timepicker"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 3"></path></svg><select aria-label="Time"><option value="00:00">00:00</option><option value="00:30">00:30</option><option value="01:00">01:00</option><option value="01:30">01:30</option><option value="02:00">02:00</option><option value="02:30">02:30</option><option value="03:00">03:00</option><option value="03:30">03:30</option><option value="04:00">04:00</option><option value="04:30">04:30</option><option value="05:00">05:00</option><option value="05:30">05:30</option><option value="06:00">06:00</option><option value="06:30">06:30</option><option value="07:00">07:00</option><option value="07:30">07:30</option><option value="08:00">08:00</option><option value="08:30">08:30</option><option value="09:00">09:00</option><option value="09:30">09:30</option><option value="10:00">10:00</option><option value="10:30">10:30</option><option value="11:00">11:00</option><option value="11:30">11:30</option><option value="12:00">12:00</option><option value="12:30">12:30</option><option value="13:00">13:00</option><option value="13:30">13:30</option><option value="14:00">14:00</option><option value="14:30">14:30</option><option value="15:00">15:00</option><option value="15:30">15:30</option><option value="16:00">16:00</option><option value="16:30">16:30</option><option value="17:00">17:00</option><option value="17:30">17:30</option><option value="18:00">18:00</option><option value="18:30">18:30</option><option value="19:00">19:00</option><option value="19:30">19:30</option><option value="20:00">20:00</option><option value="20:30">20:30</option><option value="21:00">21:00</option><option value="21:30">21:30</option><option value="22:00">22:00</option><option value="22:30">22:30</option><option value="23:00">23:00</option><option value="23:30">23:30</option></select></span>
```

## Timeline

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Timeline.jsx`, SHA-256 `3289633a572917bb68be42e8143436d22c1d2085a73a4bb2a0f1c5860124efa0`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "title": "Reference event",
        "body": "Reference <example> & \"quoted\" text"
      }
    ]
  }
}
```

```html
<div class="cs-timeline"><div class="cs-timeline__item"><span class="cs-timeline__marker" aria-hidden="true">✓</span><div><div class="cs-timeline__title">Reference event</div><div class="cs-timeline__body">Reference &lt;example&gt; &amp; "quoted" text</div></div></div></div>
```

## Toast

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Toast.jsx`, SHA-256 `f5f63c8605972ff56334fc80071ec8e758f7e024d2528f0681fe17794ae7484c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "title": "Reference notice",
    "children": "Reference <example> & \"quoted\" text"
  }
}
```

```html
<div class="cs-toast cs-toast--default" role="status"><span class="cs-toast__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path></svg></span><div><div class="cs-toast__title">Reference notice</div><div class="cs-toast__body">Reference &lt;example&gt; &amp; "quoted" text</div></div></div>
```

## ToastStack

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/feedback/Toast.jsx`, SHA-256 `f5f63c8605972ff56334fc80071ec8e758f7e024d2528f0681fe17794ae7484c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": {
      "$element": {
        "component": "Toast",
        "props": {
          "title": "Reference notice"
        },
        "children": "Reference <example> & \"quoted\" text"
      }
    }
  }
}
```

```html
<div class="cs-toast-stack" role="region" aria-label="Notifications"><div class="cs-toast cs-toast--default" role="status"><span class="cs-toast__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path></svg></span><div><div class="cs-toast__title">Reference notice</div><div class="cs-toast__body">Reference &lt;example&gt; &amp; "quoted" text</div></div></div></div>
```

## Toggle

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Toggle.jsx`, SHA-256 `0527c953307239cbd54847c3516833f53069540bd5a9ef3135792f4638c65006`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "children": "B",
    "aria-label": "Bold"
  }
}
```

```html
<button type="button" class="cs-toggle" aria-pressed="false" aria-label="Bold">B</button>
```

## Toolbar

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/navigation/Toolbar.jsx`, SHA-256 `37051ca58d60ed2f950fd58530a0cf99bb25b34f1d15577c323aa89d8bb82bf4`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "label": "Reference action"
      }
    ]
  }
}
```

```html
<div class="cs-toolbar" role="toolbar" aria-orientation="horizontal"><button type="button" class="cs-toolbar__btn" tabindex="0"><span>Reference action</span></button></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 16px; font-style: normal; font-weight: 400; line-height: 24px; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: start; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## Tooltip

interactive-dom-snapshot — Initial closed/help-hidden fixture; only initial DOM is referenced, hidden interactive surfaces are not claimed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Tooltip.jsx`, SHA-256 `092338240216260d7bd3eeb58dd2bde9e949a12e1c3d04038408076c2edfdddc`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "label": "Reference help",
    "children": {
      "$element": {
        "tag": "button",
        "props": {
          "type": "button"
        },
        "children": "Reference action"
      }
    }
  }
}
```

```html
<span class="cs-tooltip" data-managed="" data-open="false"><button type="button" aria-describedby="reference-id-001">Reference action</button></span><span data-cs-floating-root="" lang="en" data-managed="" data-open="false" style="display: contents; font-family: Arial; font-size: 13.3333px; font-style: normal; font-weight: 400; line-height: normal; letter-spacing: normal; color: rgb(0, 0, 0); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"><span id="reference-id-001" class="cs-tooltip__bubble" role="tooltip" hidden="">Reference help</span></span>
```

## Tour

interactive-dom-snapshot — Controlled open=true fixture; snapshot is not a standalone usable overlay.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/overlays/Tour.jsx`, SHA-256 `83459a653179098a298cbdbba807e2544ad3ed8ce2222934d3a61d0529fc8421`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "open": true,
    "steps": [
      {
        "target": "#reference-anchor",
        "title": "Reference tour",
        "body": "Reference <example> & \"quoted\" text"
      }
    ]
  }
}
```

```html
<div class="cs-tour"><div class="cs-tour__scrim"></div><div class="cs-tour__hole" inert="" style="left: -6px; top: -6px; width: 76px; height: 36px;"></div><div tabindex="-1" class="cs-tour__pop" role="dialog" aria-modal="true" aria-labelledby="reference-id-001" style="left: 12px; top: 42px;"><b id="reference-id-001">Reference tour</b><p>Reference &lt;example&gt; &amp; "quoted" text</p><div class="cs-tour__bar"><span class="cs-tour__count">1 / 1</span><span class="cs-tour__btns"><button type="button" class="cs-button cs-button--ghost cs-button--xs">Skip</button><button type="button" class="cs-button cs-button--primary cs-button--xs">Done</button></span></div></div></div>
```

## Transfer

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/Transfer.jsx`, SHA-256 `2a1c824ff9a0bf3afa0c4b617832c4316322a3a1885ceb5b2dbf3a67b8ce05f4`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "items": [
      {
        "key": "a",
        "label": "Alpha"
      },
      {
        "key": "b",
        "label": "Beta"
      }
    ],
    "value": [
      "a"
    ]
  }
}
```

```html
<div class="cs-transfer"><div class="cs-transfer__list"><div class="cs-transfer__title">Available</div><ul><li><label><input type="checkbox"> Beta</label></li></ul></div><div class="cs-transfer__ops"><button type="button" class="cs-button cs-button--secondary cs-button--xs" aria-label="Move to selected">›</button><button type="button" class="cs-button cs-button--secondary cs-button--xs" aria-label="Move to available">‹</button></div><div class="cs-transfer__list"><div class="cs-transfer__title">Selected</div><ul><li><label><input type="checkbox"> Alpha</label></li></ul></div></div>
```

## Tree

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Tree.jsx`, SHA-256 `09a331fb604898984c78952308513ec92a7da6a0d664ee2467925cefec21b498`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "nodes": [
      {
        "key": "a",
        "label": "Alpha"
      },
      {
        "key": "b",
        "label": "Beta"
      }
    ],
    "selected": "a"
  }
}
```

```html
<ul role="tree" class="cs-tree"><li role="treeitem" aria-selected="true" aria-labelledby="reference-id-001" tabindex="0"><span class="cs-tree__row is-selected" style="padding-inline-start: 6px;"><span class="cs-tree__twist" aria-hidden="true"></span><span id="reference-id-001" class="cs-tree__label">Alpha</span></span></li><li role="treeitem" aria-selected="false" aria-labelledby="reference-id-002" tabindex="-1"><span class="cs-tree__row" style="padding-inline-start: 6px;"><span class="cs-tree__twist" aria-hidden="true"></span><span id="reference-id-002" class="cs-tree__label">Beta</span></span></li></ul>
```

## TreeSelect

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/forms/TreeSelect.jsx`, SHA-256 `3d5d1ef69f6e24a4322ed1bf52c47c3430eaad1ab3fe5ac51b5b40ec5a09044f`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "nodes": [
      {
        "key": "a",
        "label": "Alpha"
      },
      {
        "key": "b",
        "label": "Beta"
      }
    ],
    "value": "a",
    "label": "Region"
  }
}
```

```html
<div class="cs-treeselect"><button id="reference-id-001" aria-label="Region" type="button" class="cs-treeselect__field" aria-haspopup="tree" aria-expanded="false"><span>Alpha</span><span aria-hidden="true">▾</span></button></div><span data-cs-floating-root="" lang="en" data-open="false" style="display: contents; font-family: &quot;Be Vietnam Pro&quot;, ui-sans-serif, system-ui, sans-serif; font-size: 14px; font-style: normal; font-weight: 500; line-height: normal; letter-spacing: normal; color: rgb(69, 33, 14); direction: ltr; writing-mode: horizontal-tb; text-align: center; visibility: visible; pointer-events: auto; user-select: auto; --cs-component-button-md-min-height: 44px; --cs-color-semantic-danger-fg: #FFFFFF; --cs-glass-whisper-saturate: 110%; --_cs-dark-color-semantic-success-text: #68F798; --cs-glass-light-saturate: 130%; --cs-text-display: 3.75rem; --_cs-dark-color-semantic-danger: #FC9895; --cs-color-semantic-info-fg: #FFFFFF; --_cs-dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42); --_cs-dark-color-border-default: #4a3a2c; --cs-glass-whisper-opacity: 60%; --cs-color-semantic-warning: #92400E; --cs-icon-lg: 24px; --cs-component-button-lg-padding-x: 28px; --cs-font-weight-semibold: 600; --cs-glass-heavy-blur: 24px; --cs-text-micro: 0.6875rem; --cs-accent-grad-b: #F3B958; --cs-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --_cs-dark-color-semantic-info-fg: #1a1108; --cs-depth-dropdown: 60; --_cs-dark-color-link: #FECD5D; --cs-font-size-2xs: 0.6875rem; --cs-font-size-xs: 0.75rem; --cs-space-10: 40px; --_cs-light-component-button-primary-fg: #FFFFFF; --cs-doc-fill-ink: #1A1614; --cs-font-line-height-tight: 1.15; --cs-focus-ring: 3px; --cs-font-weight-extrabold: 800; --_cs-dark-doc-slate: #26323A; --cs-breakpoint-sm: 640px; --cs-heading-weight-strong: 800; --cs-component-button-sm-min-height: 36px; --cs-glass-standard-saturate: 150%; --_cs-dark-color-semantic-info-text: #C7DFFF; --_cs-light-color-semantic-info-fg: #FFFFFF; --cs-text-h4: 1.25rem; --_cs-light-accent: #F4BA17; --cs-component-button-md-minHeight-coarse: 44px; --cs-accent-glow: rgba(244, 186, 23, 0.48); --cs-depth-toast: 200; --_cs-light-accent-ink: #45210E; --cs-glass-heavy-border: color-mix(in oklab, #E7D9C6  80%, transparent); --cs-accent-ink: #45210E; --cs-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-component-textfield-padding-x: 12px; --cs-glass-heavy-saturate: 180%; --cs-depth-card: 10; --cs-depth-overlay: 80; --cs-glass-light-bg: color-mix(in oklab, #FFFFFF  70%, transparent); --cs-icon-sm: 16px; --_cs-dark-color-semantic-success-fg: #1a1108; --_cs-dark-shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.62); --cs-accent-tint: #FBF4E9; --_cs-light-color-brand-ochre: #F4BA17; --_cs-light-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --_cs-dark-color-surface-raised: #2b1e14; --_cs-light-color-semantic-danger: #B42318; --_cs-dark-accent-grad-b: #F3B958; --cs-color-semantic-danger: #B42318; --cs-glass-whisper-border: transparent; --_cs-light-color-semantic-danger-fg: #FFFFFF; --_cs-dark-color-text-primary: #f5ead9; --cs-heading-weight: 700; --_cs-light-color-semantic-info: #1D4ED8; --cs-component-button-md-padding-y: 12px; --cs-radius-full: 999px; --cs-space-1: 4px; --_cs-light-component-textfield-border-default: #BFA58F; --cs-letter-spacing-caps: 0.08em; --_cs-dark-color-brand-ochre: #F4BA17; --cs-breakpoint-2xl: 1536px; --cs-space-2: 8px; --cs-component-button-lg-padding-y: 16px; --_cs-light-accent-on: #45210E; --cs-color-text-accent: #6E3B0E; --cs-breakpoint-phone: 360px; --cs-color-surface-raised: #FBF4E9; --cs-glass-whisper-blur: 8px; --cs-density-space-4: 16px; --cs-text-h2: 1.875rem; --cs-radius-md: 8px; --_cs-dark-component-button-primary-fg: #1a1108; --cs-font-size-2xl: 1.875rem; --cs-heading-family: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-icon-md: 20px; --_cs-light-color-text-primary: #45210E; --_cs-light-color-semantic-info-text: #000A75; --cs-component-textfield-paddingX: 12px; --cs-depth-bg: 0; --_cs-dark-doc-fill: #FDE68A; --cs-glass-light-opacity: 70%; --cs-font-line-height-body: 1.5; --cs-doc-ink: #1A1614; --cs-depth-nav: 50; --_cs-light-color-semantic-warning: #92400E; --cs-style-pack: liquid-glass; --_cs-dark-color-link-hover: #f5ead9; --cs-glass-standard-blur: 16px; --_cs-light-shadow-xs: 0 1px 2px rgba(69, 33, 14, 0.06); --cs-color-semantic-warning-text: #441801; --cs-component-button-xs-padding-x: 10px; --cs-font-size-xl: 1.5rem; --cs-doc-fill: #FDE68A; --cs-letter-spacing-normal: 0; --_cs-light-accent-grad-b: #F3B958; --cs-shadow-md: 0 12px 30px rgba(31, 19, 11, 0.18); --cs-ease-standard: cubic-bezier(0.2, 0, 0, 1); --cs-color-semantic-danger-text: #4B0502; --cs-glass-heavy-opacity: 90%; --cs-accent-bright: #F4BA17; --_cs-light-color-text-inverse: #FFFFFF; --_cs-dark-color-semantic-success: #4ADE80; --_cs-light-color-text-muted: #3F2D21; --cs-component-button-xs-minHeight-coarse: 44px; --cs-breakpoint-lg: 1024px; --_cs-dark-color-semantic-danger-fg: #1a1108; --_cs-light-shadow-lg: 0 20px 60px rgba(69, 33, 14, 0.18); --cs-space-0: 0px; --cs-component-button-md-paddingX: 20px; --_cs-light-accent-glow: rgba(244, 186, 23, 0.48); --cs-component-button-lg-paddingY: 16px; --cs-component-button-sm-min-height-coarse: 44px; --cs-component-button-gap: 8px; --cs-glass-standard-opacity: 80%; --cs-font-size-base: 1rem; --_cs-light-color-surface-page: #FFFDF8; --cs-font-family-display: 'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-component-textfield-min-height: 44px; --cs-component-button-sm-paddingY: 8px; --cs-glass-heavy-bg: color-mix(in oklab, #FBF4E9  90%, transparent); --cs-component-button-xs-min-height: 28px; --_cs-light-color-border-default: #E7D9C6; --cs-accent-grad-a: #F4BA17; --cs-space-8: 32px; --cs-depth-section: 5; --_cs-light-accent-tint: #FBF4E9; --cs-duration-slow: 320ms; --cs-color-text-inverse: #FFFFFF; --_cs-light-color-semantic-success-text: #042D13; --_cs-light-accent-on-strong: #FFFFFF; --cs-color-brand-ochre: #F4BA17; --cs-component-button-lg-minHeight: 52px; --cs-color-link-hover: #45210E; --cs-space-3: 12px; --_cs-dark-color-text-accent: #FECD5D; --cs-component-button-primary-fg: #FFFFFF; --cs-color-text-primary: #45210E; --cs-component-button-xs-min-height-coarse: 44px; --cs-radius-lg: 14px; --_cs-light-color-accent-ochre: #F4BA17; --cs-accent: #F4BA17; --cs-component-button-md-minHeight: 44px; --cs-font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; --_cs-dark-component-button-primary-bg: #f4ba17; --_cs-dark-accent: #F4BA17; --_cs-light-color-link-hover: #45210E; --cs-component-button-sm-minHeight: 36px; --cs-ease-entrance: cubic-bezier(0, 0, 0, 1); --_cs-dark-accent-glow: rgba(244, 186, 23, 0.48); --_cs-dark-doc-fill-ink: #1A1614; --_cs-light-accent-strong: #916D10; --cs-density-space-5: 20px; --cs-color-border-default: #E7D9C6; --_cs-dark-color-semantic-warning-fg: #1a1108; --_cs-light-color-semantic-success: #166534; --cs-scroll-padding-block-start: 16px; --cs-letter-spacing-tight: -0.01em; --_cs-dark-accent-tint: #FBF4E9; --_cs-dark-color-accent-ochre: #F4BA17; --_cs-dark-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.40); --cs-space-6: 24px; --cs-glass-light-border: color-mix(in oklab, #E7D9C6  50%, transparent); --_cs-light-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --cs-component-button-xs-padding-y: 4px; --cs-component-button-xs-minWidth: 28px; --_cs-light-accent-grad-a: #F4BA17; --_cs-dark-color-surface-page: #1a1108; --_cs-dark-color-semantic-info: #B5D4FD; --cs-glass-whisper-bg: color-mix(in oklab, #FFFDF8  60%, transparent); --cs-density-space-6: 24px; --_cs-dark-doc-ink: #1A1614; --cs-color-surface-page: #FFFDF8; --_cs-dark-color-surface-panel: #221710; --cs-space-4: 16px; --cs-accent-strong: #916D10; --cs-text-body-lg: 1.125rem; --cs-component-button-primary-bg: #45210E; --cs-component-button-xs-paddingX: 10px; --cs-text-caption: 0.75rem; --cs-font-lineHeight-heading: 1.35; --cs-duration-fast: 120ms; --cs-component-button-radius: 8px; --_cs-dark-color-text-inverse: #1a1108; --cs-color-text-muted: #3F2D21; --cs-accent-on-strong: #FFFFFF; --cs-font-weight-medium: 500; --_cs-dark-shadow-md: 0 12px 30px rgba(0, 0, 0, 0.50); --cs-font-size-sm: 0.875rem; --_cs-dark-color-brand-umber: #45210E; --_cs-light-color-link: #6E3B0E; --cs-doc-slate: #26323A; --cs-text-h3: 1.5rem; --_cs-light-color-semantic-success-fg: #FFFFFF; --cs-text-secondary: 0.875rem; --cs-density-space-3: 12px; --cs-component-button-md-min-height-coarse: 44px; --cs-accent-on: #45210E; --cs-glass-standard-border: color-mix(in oklab, #E7D9C6  60%, transparent); --cs-component-textfield-border-default: #BFA58F; --cs-color-semantic-info-text: #000A75; --_cs-dark-accent-ink: #45210E; --_cs-dark-color-text-muted: #E9D6C2; --_cs-light-color-semantic-warning-text: #441801; --_cs-light-doc-ink: #1A1614; --cs-component-button-sm-padding-x: 14px; --cs-text-h1: 2.25rem; --cs-component-textfield-minHeight: 44px; --cs-color-semantic-success-text: #042D13; --_cs-light-accent-bright: #F4BA17; --_cs-light-component-button-primary-bg: #45210E; --cs-space-5: 20px; --cs-font-line-height-heading: 1.35; --_cs-dark-accent-bright: #F4BA17; --cs-component-textfield-paddingY: 10px; --_cs-light-color-semantic-danger-text: #4B0502; --_cs-light-doc-fill-ink: #1A1614; --cs-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --cs-font-size-lg: 1.25rem; --_cs-light-color-text-accent: #6E3B0E; --_cs-dark-accent-on-strong: #FFFFFF; --cs-color-surface-panel: #FFFFFF; --cs-component-button-sm-minHeight-coarse: 44px; --cs-breakpoint-md: 768px; --cs-color-semantic-info: #1D4ED8; --_cs-dark-accent-on: #45210E; --_cs-dark-color-semantic-warning: #FBBF24; --cs-space-20: 80px; --cs-font-family-ui: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif; --cs-color-link: #6E3B0E; --_cs-dark-color-semantic-danger-text: #FFD2CF; --cs-ease-exit: cubic-bezier(0.4, 0, 1, 1); --cs-font-size-md: 1.125rem; --_cs-dark-color-semantic-warning-text: #FFD887; --cs-glass-standard-bg: color-mix(in oklab, #FFFFFF  80%, transparent); --cs-space-12: 48px; --cs-component-button-md-paddingY: 12px; --cs-breakpoint-xs: 0px; --cs-font-size-5xl: 3.75rem; --cs-breakpoint-xl: 1280px; --cs-duration-instant: 80ms; --cs-font-size-4xl: 3rem; --cs-component-button-lg-min-height: 52px; --cs-density-space-1: 4px; --_cs-light-shadow-xl: 0 24px 80px rgba(31, 19, 11, 0.26); --_cs-dark-accent-grad-a: #F4BA17; --cs-component-button-md-padding-x: 20px; --cs-color-brand-umber: #45210E; --cs-color-semantic-success: #166534; --_cs-dark-accent-strong: #916D10; --cs-component-button-xs-minHeight: 28px; --cs-color-semantic-warning-fg: #FFFFFF; --cs-font-lineHeight-tight: 1.15; --cs-font-weight-bold: 700; --cs-container-max: 1320px; --cs-font-size-3xl: 2.25rem; --cs-color-accent-ochre: #F4BA17; --_cs-light-doc-fill: #FDE68A; --_cs-light-doc-slate: #26323A; --cs-ease-emphasized: cubic-bezier(0.2, 0, 0, 1); --cs-shadow-sm: 0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06); --_cs-light-color-brand-umber: #45210E; --cs-space-16: 64px; --cs-font-weight-regular: 400; --_cs-dark-component-textfield-border-default: #5a4636; --cs-space-24: 96px; --cs-prose-measure: 45rem; --_cs-dark-shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.55); --cs-component-button-sm-paddingX: 14px; --cs-font-lineHeight-body: 1.5; --cs-component-button-xs-min-width: 28px; --cs-text-eyebrow: 0.75rem; --cs-text-body: 1rem; --_cs-light-color-surface-panel: #FFFFFF; --cs-component-button-xs-paddingY: 4px; --cs-radius-sm: 4px; --cs-heading-tracking: -0.01em; --cs-component-textfield-padding-y: 10px; --cs-glass-light-blur: 12px; --cs-density-control-gap: 8px; --cs-component-button-lg-paddingX: 28px; --cs-component-button-sm-padding-y: 8px; --_cs-light-color-surface-raised: #FBF4E9; --cs-duration-base: 200ms; --_cs-light-color-semantic-warning-fg: #FFFFFF; --cs-color-semantic-success-fg: #FFFFFF; --cs-scroll-padding-block-end: 16px; --cs-density-space-2: 8px; --cs-depth-modal: 100;"></span>
```

## TreeTable

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/datatable/TreeTable.jsx`, SHA-256 `0f050c7e325b0c8fdaf425ba35ddfa89565c4816205d79391828efef24d9e2b4`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "columns": [
      {
        "key": "name",
        "header": "Name"
      }
    ],
    "nodes": [
      {
        "key": "a",
        "name": "Alpha"
      }
    ]
  }
}
```

```html
<div class="cs-table-wrap"><table class="cs-table cs-treetable"><thead><tr><th scope="col">Name</th></tr></thead><tbody><tr id="reference-id-001"><td><span class="cs-treetable__cell" style="padding-inline-start: 0px;"><span class="cs-tree__twist" aria-hidden="true"></span><span id="reference-id-002">Alpha</span></span></td></tr></tbody></table></div>
```

## TypingIndicator

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/ai/TypingIndicator.jsx`, SHA-256 `a367cad658005f314bb3e59a191c6edb5f464a65bc1f48e7e4769165ba35b39c`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {}
}
```

```html
<span class="cs-typing" role="status" aria-label="Lumi is typing"><span></span><span></span><span></span></span>
```

## Watermark

rendered-dom-reference — Explicit fixture mount; no user interaction performed.

DOM snapshot only. Copying HTML does not install React state, handlers, focus management or accessibility behavior.

Source: `components/data/Watermark.jsx`, SHA-256 `1f478e37babe1ba79265402764f7127ffcd66d1a53e0097526390c78d56e902e`.

Fixture (component descriptors are documented in the inventory; wrapper context is included in captured markup):

```json
{
  "props": {
    "text": "Reference",
    "children": {
      "$element": {
        "tag": "p",
        "props": {},
        "children": "Reference <example> & \"quoted\" text"
      }
    }
  }
}
```

```html
<div class="cs-watermark" style="position: relative;"><p>Reference &lt;example&gt; &amp; "quoted" text</p><div aria-hidden="true" style="position: absolute; inset: 0px; pointer-events: none; background-color: var(--cs-color-text-primary, #45210E); mask-image: url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22140%22%20height%3D%22140%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Be%20Vietnam%20Pro%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20fill%3D%22black%22%20fill-opacity%3D%220.09%22%20text-anchor%3D%22middle%22%20transform%3D%22rotate(-22%2070%2070)%22%3EReference%3C%2Ftext%3E%3C%2Fsvg%3E&quot;); mask-repeat: repeat;"></div></div>
```
