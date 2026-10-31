# `_audit/baselines/` — visual-regression reference captures

Reference captures of representative surfaces. Two consumers share this folder:

1. **`_audit/visual-diff.html`** — side-by-side / overlay review assist (drift judged by eye).
2. **`_audit/ci/pixel-diff.mjs`** — real Playwright raster compare at **909×540** (`deviceScaleFactor: 1`). Writes `drifted[]` / `maxDiff` to `_audit/ci/pixel-diff-report.json`. Hard gate: % drift above threshold exits non-zero and fails the board Pixel CI row.

## Set — per-tier (curated)

**Templates (archetypes)**
- `dashboard.png` — product screen · pixel frame 909×540
- `dashboard-dark.png` — same, forced dark via `__dcSetProps({theme:"dark"})` · pixel frame 909×540
- `app-shell.png` — product app chrome · pixel frame 909×540
- `settings.png` — settings product shell · pixel frame 909×540
- `delivery-kickoff.png` — delivery kickoff document · pixel frame 909×540
- `bod-report.png` — Letter document · pixel frame 909×540
- `slide-deck.png` — 16:9 deck · pixel frame 909×540
- `vn-labor-contract.png` — VN legal instrument · pixel frame 909×540
- `email.png` — send-path email · pixel frame 909×540
- `marketing-page.png` — marketing/landing archetype · pixel frame 909×540
- `auth.png` — auth/sign-in flow · pixel frame 909×540
- `tech-incident-report.png` — incident-report document · pixel frame 909×540

**Composite**
- `kitchen-sink.png` — `templates/kitchen-sink.html` · pixel frame 909×540

**Pages (UI kits)**
- `status-hub.png` — portfolio dashboard kit home · pixel frame 909×540
- `website.png` — bilingual marketing site home · pixel frame 909×540
- `component-states.png` — solid swatches copied from live button, dialog, menu, field-error, and selected-row paint in light and dark · pixel frame 909×540

They anchor high-traffic product / document / deck shells plus one component-state frame (16 curated captures), not every template. Declare each in `BASE` inside `visual-diff.html` (slug → `{w, src?}`) and in `PIXEL_TARGETS` inside `_audit/lib/pixel-report-contract.mjs`. The CLI and Pixel CI page import that same target contract.

Interactive component states are a separate hard gate: `_audit/component-state-paint.html` checks button variants, an open dialog, an open menu, a field error and a selected data row in light and dark. It uses `PIXEL_CHANNEL_TOLERANCE` from this contract. It does not add macOS PNGs to the 15 Linux page baselines.

Compare reports use schema version 1 and record complete per-target outcomes, frame, comparison settings, renderer version/platform/architecture and canonical input SHA-256 digests. The runner checks local and served input identity before and after capture, checks actual capture responses, and removes an old receipt before starting a new attempt. The board independently verifies current input membership and bytes. Missing, stale, malformed, partial or update-only receipts cannot pass. The inventory includes public runtime/authoring files, the comparator and report contract/consumer, package/lockfile and all 16 baseline PNGs; this is a declared source identity boundary, not proof of every visual state or baseline approval.

The Marketing page's shipped image placeholder expects an absent `.image-slots.state.json` sidecar (`image-slot.js` treats its 404 as empty state). That exact absence is declared in the receipt digest and checked locally and on the server before/after capture. Its observed 404 is allowed; a present sidecar, transport failure or any other missing capture resource fails. User-provided image state is outside this comparison scope.

## Regenerate (Playwright — preferred for pixel CI)

Baselines must match **GitHub Actions `ubuntu-latest` Chromium** (not macOS, and not necessarily the Playwright Docker image). Prefer refreshing on the CI runner when Pixel CI drifts (the `pixel-diff` job uploads `pixel-baselines-linux`), then commit those PNGs.

After an approved intentional redesign, retrieve and review the CI baseline artifact. A local Docker capture can still differ from the GitHub runner's font rendering.

```bash
gh run download <run-id> -n pixel-baselines-linux -D /tmp/pixel-baselines-linux
cp /tmp/pixel-baselines-linux/*.png _audit/baselines/
```

Local amd64 Docker is only an approximation:

```bash
docker run --rm --platform linux/amd64 -v "$PWD":/work -w /work node:22-bookworm \
  bash -lc 'npx playwright install --with-deps chromium && npx --yes serve@14 -l 8080 . >/tmp/serve.log 2>&1 & npx --yes wait-on@7 http://127.0.0.1:8080/dashboard.html && node _audit/ci/pixel-diff.mjs --update http://127.0.0.1:8080'
```

Baselines **must** be real PNGs (not JPEG-named-as-PNG). After an intentional redesign, refresh from the CI artifact (or an amd64 host that matches the runner), commit the PNGs, and note it in the PR description.

## Manual / review-assist capture

Open the target file, let it settle, and screenshot into a 16:9 frame saved as `_audit/baselines/<name>.png`. Prefer the Playwright `--update` path so pixel CI and visual-diff share identical bytes.

These diagnostic references are excluded from the npm package. The public host includes only the baseline files and guides explicitly listed under the diagnostics audience in `scripts/public-site-policy.json`; unlisted audit sources remain excluded. Publication does not grant baseline or visual acceptance.
