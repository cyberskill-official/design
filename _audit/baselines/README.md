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

They anchor high-traffic product / document / deck shells (15 curated captures), not every template. Declare each in `BASE` inside `visual-diff.html` (slug → `{w, src?}`) **and** in `TARGETS` inside `_audit/ci/pixel-diff.mjs` (keep those lists in lockstep with `_audit/pixel-ci.html`).

## Regenerate (Playwright — preferred for pixel CI)

Baselines must match **GitHub Actions `ubuntu-latest` Chromium** (not macOS, and not necessarily the Playwright Docker image). Prefer refreshing on the CI runner when Pixel CI drifts (the `pixel-diff` job uploads `pixel-baselines-linux`), then commit those PNGs.

Local amd64 Docker can approximate:

```bash
# Prefer the CI artifact over Docker: on Pixel CI failure the job uploads
# `pixel-baselines-linux` from ubuntu-latest — download and commit those PNGs.
# `node:22-bookworm` amd64 can still diverge from GitHub's ubuntu runner fonts/AA.
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

Not compiled or shipped — dev-only, like the rest of `_audit/`.
