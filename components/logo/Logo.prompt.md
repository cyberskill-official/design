**Logo** — the official CyberSkill brand mark (Umber ground, Ochre genie figure), rendered from the exact master artwork. Use whenever a product is for or owned by CyberSkill. Keep clear space ≥ 25% of the mark height; never recolour, rotate, stretch, or place on a low-contrast background.

```jsx
<Logo size={40} title="CyberSkill" />
<Logo size={24} decorative />   {/* when the name appears next to it in text */}
```

- For third-party / white-label tenants, use the tenant's own logo — not this mark.

- Static/print alternative: `assets/logo-mark.svg` (vector) or `assets/logo-mark.png`.

Keyboard: The mark adds no keyboard action. When used inside a link, the link supplies navigation behavior and context.

Localization: The accessible title defaults to the fixed brand name CyberSkill; supplied titles are caller-owned. `decorative` hides the mark from assistive technology and omits its title.

Source evidence: `Logo.jsx` and `Logo.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

The public constants `CS_LOGO_VIEWBOX` and `CS_LOGO_MARK_INNER` expose the official mark’s viewBox string and generated inner SVG markup. Prefer Logo for its built-in title escaping and decorative mode. If a specialized renderer uses the constants, preserve the exact artwork and proportions, supply its accessible name or decorative treatment, and do not combine the trusted markup with untrusted input. The constants contain no keyboard interaction or translated text.

```jsx
<svg width={40} height={40} viewBox={CS_LOGO_VIEWBOX}
  xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CyberSkill"
  dangerouslySetInnerHTML={{ __html: CS_LOGO_MARK_INNER }} />
```

Constant source evidence: `logo-data.js` provides both string values; `_esm/react.d.ts` declares the public strings. The markup is derived from the official `assets/logo-mark.svg`; this pointer does not authorize artwork changes or establish visual acceptance.
