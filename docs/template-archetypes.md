# Shared template archetypes

The current bounded projection owns the financial document-type heading in Invoice and Quote: one existing style role with separate English and Vietnamese titles. The canonical source is `scripts/template-archetypes-source.json`; `scripts/generate-template-archetypes.mjs` projects it into each standalone folder. Existing default HTML remains byte-for-byte identical. This adds no runtime dependency.

## Authoring and validation

Edit the canonical style/copy, then run:

```sh
node scripts/generate-template-archetypes.mjs
node scripts/generate-template-archetypes.mjs --check
```

The producer owns only the style attribute and plain text of the first document-type heading in each declared language branch. It validates the exact existing heading/wrapper structure, rejects unknown metadata, nested markup, expressions, unsafe paths and symlink outputs/ancestors, and validates every output before writing any. Style changes reach both language owners in both documents. All other source bytes remain authored locally.

## Language boundaries

The full branch census records 24 templates and 39 paired branches. Seven have matching tags and attributes after accounting for the existing Vietnamese wrapper and bilingual separator. Twenty-one differ only in line-height; three also translate accessibility attributes; eight have other authored structure/style differences. These differences include Vietnamese fitting, print grouping, legal/financial disclaimers and table layout. They are not interchangeable templates merely because both branches render similar subjects.

Invoice and Quote declare English and Vietnamese views; they do not declare a Both mode. Separate business content, financial values, legal copy and language-specific layouts remain outside this archetype. Offline folders retain generated HTML and the existing DC interpreter. The component UI-message registry is not a substitute for template business/legal prose.

## Evidence limits

Focused tests cover complete original HTML identity, screen/print pixels, accessibility snapshots, DOCX XML/media and source-mutation propagation in three engines. Actual generated PDF text comparison uses Chromium and the pinned parser. These checks do not grant accounting/legal translation approval or manual Office acceptance.
