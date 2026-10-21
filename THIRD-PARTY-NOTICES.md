# Third-party notices — `@cyberskill/design`

The package license is **UNLICENSED** (see `package.json` and `docs/consumer-grant.md`). That assertion applies to **CyberSkill-authored** material only. Redistributed third-party assets retain their upstream licenses; CyberSkill does not re-license them. Available license/copyright texts for Storybook addon bundles are emitted alongside those bundles in `sb-addons/*.js.LEGAL.txt`.

## Fonts (`fonts/`)

Self-hosted webfonts (`.woff2`) for:

| Family | Upstream | License |
|---|---|---|
| Be Vietnam Pro | [bettergui/BeVietnamPro](https://github.com/bettergui/BeVietnamPro) | SIL Open Font License 1.1 |
| JetBrains Mono | [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) | SIL Open Font License 1.1 |
| Space Grotesk | [floriankarsten/space-grotesk](https://github.com/floriankarsten/space-grotesk) | SIL Open Font License 1.1 |

Full license text and copyright lines: [`fonts/OFL.txt`](fonts/OFL.txt).

## Vendored browser runtimes (`_vendor/`)

The current npm package explicitly includes `_vendor/`. Hosted, Storybook and template tooling also load these offline runtimes. Their upstream license and provenance records ship beside the files:

| Asset | Upstream | License |
|---|---|---|
| `_vendor/react/` (UMD React / ReactDOM) | [facebook/react](https://github.com/facebook/react) | MIT |
| `_vendor/babel/` (`@babel/standalone`) | [babel/babel](https://github.com/babel/babel) | MIT |

## Editor HTML parser

The generated `components/forms/editor-parser.js` embeds **parse5 8.0.1** (MIT) and its
**entities** dependency (BSD-2-Clause). Full copyright/license texts
are in `_vendor/editor-parser/NOTICE.txt`. The generator records exact versions
and package integrity values from `package-lock.json`; verify with
`node scripts/generate-editor-parser.mjs --check`. The parser is bundled for
offline/no-build consumers and does not fetch code or parse into a live DOM.

## Template vendor scaffold provenance

| Asset | Notes |
|---|---|
| `templates/_vendor/doc-export.js` | Retained document-export runtime with unverified historical origin. Current local logo/export changes have an exact byte and focused regression record in `_audit/remediation/retained-exporter-review.json`; this does not establish upstream provenance, rights or distribution approval. |
| `templates/_vendor/deck-stage.js` | Authored replacement candidate generated from `scripts/template-runtime/primitives/deck-stage.js`. The previous omelette scaffold is preserved in historical audit evidence; its original source remains unavailable. Current source/output binding and distribution review are separate. |
| `image-slot.js` | Authored replacement candidate generated from `scripts/template-runtime/primitives/image-slot.js`; the historical copied starter is not an authenticated source for this replacement. Browser fixtures exercise the documented host write boundary, not actual host filesystem acceptance. Distribution review remains pending. |
| `templates/_vendor/support.js` and its template-local copies | Authored replacement candidate generated from `scripts/template-runtime/primitives/support.js`; every registered copy is byte-checked. The original `dc-runtime/src/*.ts` source remains unavailable. The pending record establishes local reproducibility, not reconstruction or rights approval. |

## Audit-only QR decoder

`_audit/vendor/jsqr/jsQR.js` is the unmodified jsqr 1.4.0 distribution under Apache-2.0. Its full license is `_audit/vendor/jsqr/LICENSE`; registry tarball integrity and extracted file hashes are recorded in `_audit/vendor/jsqr/provenance.json`. This dependency supports the hosted diagnostic, not the component runtime or npm package.

## Related

- Consumer grant carve-out: `docs/consumer-grant.md`
- Font face declarations: `tokens/fonts.css`

## Verified runtime distribution records

React wrapper and Babel runtime bytes match their pinned registry distributions; local provenance files under `_vendor/react/` and `_vendor/babel/` record tarball integrity, archive paths and hashes. Their distribution licenses and React/React DOM project notices are retained beside the runtimes. Audit-only axe 4.10.0 has matching records and its MPL-2.0 plus third-party notices under `_audit/vendor/`. These records establish exact artifact provenance, not complete embedded-dependency or release acceptance. All retained local WOFF2 files now have pinned-source rebuild or exact observed Google Fonts distribution records. Brand-media origins and historical scaffold/DC runtime origins remain open. The three authored runtime replacements have exact local source/output records and pending distribution review; distribution approval and owner acceptance remain pending.

## Local font and media notes

Ten retained Latin font subsets include the Vietnamese repertoire and combining marks in one face. They are reproducibly generated from pinned Google Fonts sources with recorded input hashes and upstream licenses in `fonts/subset-recipe.json` and `fonts/licenses/`.

The audit-only content-schema validator is generated with pinned Ajv 8.20.0
(MIT). Its bundled Unicode-length runtime helper retains the license at
`_audit/vendor/ajv-LICENSE`; the generated header records the locked Ajv integrity.
Schemas are compiled during maintenance, not with runtime eval in public pages.

## Native sample resources

The native samples use four original Be Vietnam Pro TTF faces (400/500/600/800)
from the pinned Google Fonts source recorded in `examples/native/fonts/manifest.json`
and `fonts/subset-recipe.json`. Each app carries byte-identical resource copies
and the full OFL notice; no font bytes are modified.

Flutter's Android host is derived from Flutter 3.24.5 (`dec2ee5c1f98f8e84a7d5380c05eb8a3d0a81668`),
with sample-specific adaptations listed in `examples/native/flutter/android/runner-provenance.json`.
Its Gradle wrapper scripts/JAR are generated by Gradle 8.3; the JAR matches the
official published SHA256 and the distribution checksum is pinned. Gradle's
Apache-2.0 license and bundled third-party notices are retained in
`examples/native/flutter/android/GRADLE-LICENSE.txt`. This is local build-host
provenance, not a signed product or store approval.

## Retained skill resources

The seven routers in each of `.agents/skills/` and `.cursor/skills/` retain claudekit attribution in adapter metadata. Their optional upstream payload is quarantined, without byte or file-mode changes, under `vendor/skill-resources/agents/` and `vendor/skill-resources/cursor/`. The repository-only archive's `manifest.json` maps all 330 original payload paths to their archived paths and hashes; the npm files list and explicit public website inventory exclude it. Discovery directories contain only the routers.

The archived `ui-styling/LICENSE.txt` files contain Apache-2.0. The former blanket `license: MIT` adapter metadata was unsupported by the retained files and has been removed; no license conversion is implied. Adjacent licenses apply to their own materials. A complete upstream origin and rights inventory for the other retained resource payloads remains unverified and requires rights-holder review before outward redistribution. Generic framework installer scripts are inert upstream references, not CyberSkill authoring instructions or approval to install dependencies.
