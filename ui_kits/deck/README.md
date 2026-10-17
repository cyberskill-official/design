# Brand deck — UI kit

A **16:9 CyberSkill deck** built on the `deck-stage` starter. It provides browser print styling and DOM capture hooks for a compatible host exporter. The static clone does not include a PPTX exporter; confirm the selected host's tools before promising that format.

## What it demonstrates
Six brand slides — umber title, light agenda, a by-the-numbers stat slide, an element slide, an umber big-quote, and an umber closing — using `styles.css` tokens together with fixed colors in the five-element illustration (Umber/Ochre anchors, Be Vietnam Pro, JetBrains Mono numerals) with the official Logo mark.

## Files
- `index.html` — the deck. `<deck-stage width="1920" height="1080">` with one `<section>` per slide; links `styles.css` for tokens + fonts.

- deck-stage runtime lives at `templates/_vendor/deck-stage.js` (kept out of the compiled bundle; scaling, keyboard nav, thumbnail rail, print-to-PDF).

- The repository keeps HTML and its runtime, not a pre-generated PDF/PPTX binary. Browser print and host export are separate paths; neither the file extension nor the capture hooks certify exported fidelity.

## Export
- **PDF** — open `index.html` and use the browser's Print → Save as PDF. The runtime supplies one-section-per-page print styling. Inspect the resulting PDF for every slide, clipping, fonts and diacritics; HTML layout alone is not export acceptance.

- **PPTX** — requires an available compatible host export tool. The runtime exposes `goTo(n)`, active-slide markers and `noscale` capture geometry at 1920×1080; these are capture hooks, not a PPTX writer. Confirm the tool's supported capture options and font mapping, then inspect the exported file, editability, fonts and Vietnamese diacritics in the intended consumer. A clone or successful browser preview does not establish those outcomes.

## Authoring
Slides are static inline-styled `<section>`s — edit copy directly. Keep to two backgrounds (umber / panel) and one accent (ochre); don't set position/size on a `<section>` (the component positions them).


The deck starts in English unless its own saved cs_site_lang value is vi. The toggle replaces nodes carrying data-vi and updates the document language; fixed slogans, slide labels and sample statistic values are not all translated. Figures and release claims are presentation sample content, not source verification of current business or release results. The authored mark remains the official asset.

Source evidence: index.html defines six sections and the language toggle; templates/_vendor/deck-stage.js defines presentation navigation and browser print hooks. Keyboard/capture/print support is specific to those source paths. A compatible external tool and consumer inspection are required for PPTX; no PPTX writer is supplied by this kit.
