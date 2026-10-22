# Newsletter invitation heading contrast

The Vietnamese invitation heading inherits the existing fixed light ink from its Umber panel. The former element-dependent `--cs-accent-bright` override could fail contrast against that fixed background. English retains the same existing light ink; this adds no color literal or palette change.

Run `CS_TEST_BROWSER=chromium node _audit/ci/test-newsletter-heading-contrast-browser.mjs` and repeat with `firefox` and `webkit`. The test enumerates all declared 15 element choices, two themes and three language choices, including both headings in bilingual mode: 90 contexts and 120 heading samples per engine. It requires opaque, unattenuated solid paint, WCAG contrast at least 4.5 and APCA Lc at least 75 for the actual 17px/700 heading. Routing the exact previous source color back into the page must reproduce failure.

`test-results/newsletter-heading/<engine>.json` binds the source, regression, browser helpers, color helper, lockfile and all requested runtime/CSS/font/image bytes. It records actual colors, metrics and the old-source counterproof, and rejects input drift during execution. This focused computed-paint proof does not claim glyph-pixel, physical-device or human accessibility acceptance.
