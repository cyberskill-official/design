# Browser support

The supported web target is the latest two stable releases of Chrome, Firefox, Safari and iOS Safari. The owner selected this rolling policy on 2026-10-20. `package.json` records it as four Browserslist queries; installed caniuse data resolves a reproducible snapshot, not a live release service.

## Required capabilities

The system uses `color-mix(in oklab, ...)`, inline-size container queries, `:has()`, `text-wrap: balance` and native `inert`. These features predate the selected floor in the [pinned MDN browser compatibility data](https://github.com/mdn/browser-compat-data/tree/12bc0268c7fe89a4b23fab5c54702c1fb9c34f7a). The retained source record is `_audit/remediation/browser-compatibility-source.json`. No legacy-browser fallback or `inert` polyfill is promised.

For the selected latest-two stable floor, native `inert` is available and no `inert` polyfill is required. Its introduction versions are Chrome 102 ([Chrome release notes](https://developer.chrome.com/blog/new-in-chrome-102)), Firefox 112 ([Mozilla developer release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/112)), and Safari 15.5 on macOS, iOS and iPadOS ([WebKit release notes](https://webkit.org/blog/12669/new-webkit-features-in-safari-15-5/)); the [HTML Standard](https://html.spec.whatwg.org/multipage/interaction.html#the-inert-attribute) documents the native behavior. This is a feature-availability conclusion for the declared floor, not certification of every admitted browser release, physical-device focus behavior or assistive-technology behavior. Older targets remain outside this promise and need a separately validated fallback.

`_audit/lib/browser-capabilities.mjs` exposes capability inspection and an explicit failure guard. It is optional diagnostics; importing library CSS/components does not install a polyfill or silently hide content. Consumers targeting older engines must define and validate their fallback separately.

## Validation and limits

`npm run test:browser-capabilities` checks the policy, failure path and actual color/container/selector/wrapping/focus behavior in installed Playwright Chromium, Firefox and WebKit. It records engine versions and the installed Browserslist resolution. WebKit is not a real Safari or iOS device run. Previous stable versions, physical devices, OS high contrast, assistive technology, visual acceptance and native apps require separate evidence. The automated suite does not certify every historical browser version admitted by the policy.

Keep the browser data and browser runtimes reviewed when dependencies update. A supported policy is an engineering target; a passing feature probe is bounded capability evidence.
