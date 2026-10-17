**QRCode** — SVG QR (≤78 bytes, EC-L). Keep quiet space around it.

```jsx
<QRCode value="https://cyberskill.world" size={128}/>
```

Capacity is 78 UTF-8 bytes, not 78 characters. An oversized value renders the existing em-dash fallback rather than a truncated code. Keep a four-module quiet zone around the symbol and verify the final foreground/background pairing in its actual placement.

Validation: `npm run test:qr` checks all supported byte capacities and versions with an independent decoder, including Unicode and damaged modules, plus actual SVG-to-raster scans under the deployment security policy. Camera/device scanning and visual acceptance remain separate checks.

Keyboard: The code is a named image and adds no keyboard action. The caller supplies the four-module quiet zone around the encoded symbol and validates its real placement.

Localization: The accessible name uses a nonempty supplied label or the value. Value and label are caller-owned; the component does not translate encoded content.

Source evidence: `QRCode.jsx` and `QRCode.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
