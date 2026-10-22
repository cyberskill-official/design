# Component state scenarios

`components/scenarios.json` is the source-bound inventory for the component state checks. It derives component membership from the public API, starts with the authored static-reference fixtures, and derives finite presentation domains from declarations. `scripts/fixtures/component-scenarios.json` supplies reviewed runtime expectations and the JSX/declaration hashes supporting each expectation. Changing a component does not automatically refresh that evidence.

The inventory covers one default fixture for every public component; every declared value of the finite `variant`, `size`, `tone`, `status`, `state` and `mode` domains; the supported Button variant × size product; every declared `disabled`, `error` and `errors` prop; and eight explicitly authored empty-collection contracts. New finite domains or declared disabled/error props fail generation until an expectation is authored. Empty behavior outside those eight collections remains unclassified, rather than being silently counted as verified or inapplicable.

For the finite components, default scenes omit those finite props and assert the reviewed parameter-default behavior, including the no-variant ProgressBar default and AlertDialog alias fallback. Other defaults retain their documented canonical fixture state. The runtime expectations assert actual class/state changes, SVG geometry, native disabled/focus behavior, exposed error alerts and their input descriptions, or empty collections without data items. The empty Cascader and TreeSelect contracts assert an exposed empty popup, without inventing an empty-message promise. FormField uses its documented TextField composition. Each scene is mounted separately in English and Vietnamese; cleanup must remove prior floating hosts before the next scene can claim ownership of its newly created hosts.

Run these commands with the repository's pinned Node/npm toolchain:

```sh
node scripts/generate-component-scenarios.mjs
node scripts/generate-component-scenario-stories.mjs
node _audit/ci/test-component-scenarios.mjs
CS_TEST_BROWSER=chromium node _audit/ci/test-component-scenarios-browser.mjs
CS_TEST_BROWSER=firefox node _audit/ci/test-component-scenarios-browser.mjs
CS_TEST_BROWSER=webkit node _audit/ci/test-component-scenarios-browser.mjs
```

Generation supports `--check` for read-only freshness validation. The structural check rejects missing components, uncovered declared states, unknown props, unsafe fixture data, stale source evidence, symlinks, malformed output and damaged generated-story fences. The browser check compiles the actual component sources and uses axe 4.10.0 with all configured WCAG 2 A/AA, 2.1 A/AA and 2.2 AA rules. The serious/critical failure threshold stays unchanged; reports retain all violations, incomplete checks and applicability evidence. Six actual component-source mutations prove that ignored parameter defaults, ignored variants, ignored disabled state, omitted errors, ignored empty collections and missing accessible button names fail.

Reports bind the compiled source bytes, React runtime bytes, compiler inputs, stylesheet/font graph, axe, fixture helpers and loaded legacy bundle. A changed input during execution fails the check. These receipts establish the tested snapshot; they do not approve changed source or replace lifecycle review.

Supported Error and Empty cases also have named primary CSF stories with owned `play` assertions. Their generated fence preserves the existing CSF program. Popup Empty stories explicitly use `portal={false}` so the canvas owns the assertions; the audit scenarios separately exercise the default portal mode. After building Storybook, run `node _audit/ci/test-component-scenario-stories-browser.mjs [artifact-directory]` for each engine. This check requires every expected real export in the built index, successful owned play assertions and the configured accessibility checks against the frozen output. A source-only pass does not establish that the Storybook artifact passed.

This is bounded state coverage, not every Cartesian combination of API props. It supplements the source facts and exact behavior/keyboard evidence in `components/specifications.json`; it does not turn unverified role, focus, announcement or keyboard clauses into accepted “not applicable” entries. Real interaction fixtures, manual assistive-technology testing, product visual review and operator acceptance remain separate evidence.
