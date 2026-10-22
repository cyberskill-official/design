# Manual assistive-technology matrix

The source record is [manual-at-matrix.json](manual-at-matrix.json). All AT-01 through AT-16 rows start **pending**: no historical human observations were recovered, and no automated pass is a manual pass. Seven historical scopes come from the audit board and kit probe. The owner-approved current plan defines all 16 execution scopes; its per-row `historicalScope` preserves the nine formerly null scopes without reconstructing an undocumented plan.

## Approved current scope plan

`currentScopePlan` in the same JSON file records the owner-approved current plan for all 16 rows, with Vietnamese and English names, tasks and expected outcomes. It preserves the seven known historical scope names and explicitly identifies the nine newly proposed scopes. The execution scopes now follow that approved plan. All result fields remain pending; the prior known/null scopes remain preserved as historical data.

The proposal covers field names/errors; choice controls; nested overlays; modal focus; pickers; CommandPalette; menus; tabs/radio modes; tables; numeric controls; live feedback; and the five previously named product surfaces. The owner approved this plan on 2026-10-21, defining what to test. It does not approve a component, record speech/focus observations or establish results on any browser or assistive technology. Record exact environments and axes for each actual run; do not extrapolate from one environment to another.

The integrity test rejects missing/duplicate rows, empty translations, missing task/outcome lists and changes to known historical scope names. No generation step populates manual result fields.

## Recording a result

A reviewer records the exact source commit, reviewer, date, OS, browser and assistive-technology versions, language/theme/state, task sequence, observed speech/focus behavior and evidence references. Use `passed` only after that manual run, `failed` for an observed failure and `blocked` for a missing environment or unresolved scope. Keep observations and failing evidence; a later recheck is a new attestation. Empty fields remain pending.

Run `node _audit/ci/test-manual-at-matrix.mjs` to verify record shape and reject completed rows without evidence. This integrity check is not a screen-reader test and does not certify AT acceptance. `_audit/a11y-gate.html` and `_audit/at-kit-probe.html` remain programmatic proxies with separate verdicts.
