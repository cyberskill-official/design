# CI/CD — tự động hóa bảng gate

**Gate CI** (workflow này) vẫn coi design system như cây tĩnh: serve repo, mở `_audit/run.html` headless, đọc verdict globals. Không cần product bundler cho gates.

**Host deploy** (Vercel, tách khỏi workflow này) chạy `npm install` + `npm run build:site` để Storybook ship làm bề mặt sản phẩm tại `/` — xem `docs/deploy.md` và `docs/storybook.md`. Đường đóng gói host đó không bắt buộc cho consuming project hay các job gate bên dưới.

## Badge

[![Design System Gates](https://github.com/cyberskill-official/design-system/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design-system/actions/workflows/design-system-gates.yml)

## Những gì đã nối (`.github/workflows/design-system-gates.yml`)

1. **`fast-gates`** — `npm ci` + Playwright Chromium cache, serve repo, mở `_audit/run.html` headless (`_audit/ci/run-gates.mjs`), fail khi hard-gate fail. Upload import-report khi fail. Hàng mới trên board (hardening Th7 2026 thêm 8: token-format-parity, version-stamp, support-runtime-identity, package-exports-integrity, template-lang-parity, dtcg-typing, design-md-parity, bundle-freshness) được nhận tự động — runner đọc `window.__run`, không phải danh sách gate phía job.
2. **`token-provenance`** — kiểm Node không trình duyệt: natives + `provenance.json` khớp sha-256 nguồn DTCG.
3. **`unit-tests`** — `npm run test:unit` (11 contract test Node thuần; nối vào CI bởi hardening Th7 2026 — trước đó chỉ local). Gồm `test-element-packs` (freshness `node scripts/generate-element-packs.mjs --check`).
4. **`node-prechecks`** — authority Node không trình duyệt: `_audit/ci/check-bundle-freshness.mjs` (nguồn chân lý bundle-freshness — khám phá source đầy đủ gồm file mới/xóa; hàng board chỉ re-hash file ghi trong header) và `scripts/generate-design-md.mjs --check` (`DESIGN.md` gốc byte-equals regeneration).
5. **`docs-consistency-blocker`** — merge blocker `docs-consistency` + `bilingual-parity`.
6. **`whole-set-audits`** — quyết định B của owner: mọi push/PR, cộng nightly `0 3 * * *` và `workflow_dispatch` (responsive + language + theme overflow, ~15–20 phút).
7. **`figma-variables-push`** — trên push `main` + thủ công. **`FIGMA_TOKEN` / `FIGMA_FILE_KEY` trống → soft-skip** (exit 0 + report — cùng trung thực với Code Connect). Quyết định A (non-Enterprise): Variables REST cũng **soft-skip khi API 403** (và lỗi plan/scope liên quan) sau khi secret chứng minh mở file. Soft-skip ≠ sync Variables live. Xem `docs/figma.md`.
8. **`code-connect`** — trên PR + `main` + thủ công. Quyết định 1C: dry-run luôn (config + 105 mapping); publish soft-skip khi thiếu `FIGMA_TOKEN` / `FIGMA_FILE_KEY` hoặc API 403/404/429. Xem `docs/figma.md`.
9. **`regenerate-tokens`** (pull request) + **`regenerate-tokens-push`** (push `main` / schedule / thủ công) — path filter phủ element seeds/packs (`element-seeds.json`, `elements.css`, mirror JSON/JS/DTCG, `generate-element-packs.mjs`) cộng natives / `VERSION`. Regenerate chạy `npm run tokens:elements` rồi `node _audit/ci/generate-native-tokens.mjs`. Trên **pull request** job chạy với `contents: read`, không bao giờ push, và **exit 1** khi có drift: chạy cả hai ở local rồi commit. Chỉ job song sinh push/schedule/thủ công giữ `contents: write` và auto-commit với `DS_PUSH_TOKEN` (hoặc `github.token`).
10. **`npm-hello-smoke`** — chứng minh consumer registry: `cd examples/npm-hello && npm ci && npm run smoke` (**hard fail**; package public). Path-filtered trên push/PR khi `examples/npm-hello/**`, bề mặt publish package, hoặc workflow này đổi; luôn chạy trên schedule / `workflow_dispatch`.

Workflow riêng **`npm-publish`** (`.github/workflows/npm-publish.yml`): `workflow_dispatch` + tag `v*`; pack dry-run luôn; publish qua **npm Trusted Publishing (OIDC)** (`id-token: write`, không `NPM_TOKEN` trên bước publish). Soft-skip khi auth / 403 / 404 / EOTP / conflict phiên bản. Phiên bản là **1.1.0**; license **UNLICENSED**. Trusted Publisher trên npmjs phải khớp filename workflow `npm-publish.yml`. Publishing access package: **Require 2FA and disallow tokens** (OIDC vẫn chạy; token classic bị từ chối).

Workflow riêng **`native-store`** (`.github/workflows/native-store.yml`): PR + `main` (path-filtered) + `workflow_dispatch`; dry-run scaffold luôn; kiểm signed-release soft-skip khi thiếu `ASC_KEY_ID` / `ASC_ISSUER_ID` / `ASC_KEY_P8` / `PLAY_SERVICE_ACCOUNT_JSON`. **Không bao giờ submit** lên App Store / Play — sample vẫn là sample. Xem `examples/native/README.md`.

Node **22** trên runner (tránh deprecation action Node 20). Cache key Playwright: `package-lock.json`.

## Pattern cài runner (job Playwright)

```yaml
- run: npm ci
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}-chromium
- run: npx playwright install --with-deps chromium
```

## Quyền auto-commit token

Chỉ `regenerate-tokens-push` yêu cầu `permissions: contents: write`; job song sinh cho pull request `regenerate-tokens` giữ `contents: read` và checkout không lưu credential, nên PR không bao giờ kích hoạt push của bot. Nếu org khóa default token read-only, đặt repository secret `DS_PUSH_TOKEN` (fine-grained PAT, Contents read/write) hoặc mở write tại org Actions settings. Xem ghi chú trước trong git history / org settings.

## Branch protection (khuyến nghị)

Require status checks trên `main` trước merge:

- `fast-gates`
- `docs-consistency-blocker`

Tùy chọn: `whole-set-audits` (dài). Cấu hình dưới repo **Settings → Branches** hoặc qua `gh api` (admin).

## Chạy local

```bash
npx serve -l 8080 .
npx playwright install --with-deps chromium
node _audit/ci/run-gates.mjs http://127.0.0.1:8080/_audit/run.html
node _audit/ci/check-token-provenance.mjs
node _audit/ci/check-bundle-freshness.mjs
node scripts/generate-design-md.mjs --check
npm run test:unit
node _audit/ci/run-single-gate.mjs http://127.0.0.1:8080/_audit/docs-consistency.html __docs
npm run tokens:elements
node scripts/generate-element-packs.mjs --check
node _audit/ci/generate-native-tokens.mjs
```

## Những gì KHÔNG auto-fail (có chủ đích)

- **Hàng visual / component baseline side-by-side** — chỉ advisory (drift đánh giá bằng mắt). So sánh `%` pixel Playwright là gate **hard** (job `pixel-diff` + hàng Pixel CI trên board).
- **Figma Variables** — soft-skip khi thiếu secret (cùng trung thực với Code Connect) hoặc write Variables gặp non-Enterprise / API **403**; report artifact ghi lại skip. Soft-skip ≠ sync live.
- **Code Connect publish** — soft-skip khi thiếu secret hoặc API 403/404/429 (Quyết định 1C).
- **npm publish** — Trusted Publishing (OIDC) trên `npm-publish.yml`; soft-skip khi auth / conflict (Quyết định 1C).
- **Native store signed release** — soft-skip khi thiếu `ASC_*` / `PLAY_SERVICE_ACCOUNT_JSON` (Quyết định 1C); submit store vẫn tắt.
- **npm-hello registry smoke** — **hard fail** (`examples/npm-hello` → `npm ci` + `npm run smoke`); chứng minh đường install public `@cyberskill/design` (không soft-skip).

Job `figma-variables-push` hay `code-connect` xanh — và do đó badge hay hàng Status xanh — chỉ có nghĩa job exit 0; nó **không** chứng minh sync Figma live, vì soft-skip và publish thật nhìn từ ngoài giống hệt nhau. Mở report artifact của run (`figma-push-report.json` / `code-connect-report.json`) để biết cái nào đã xảy ra.

## Soft-skip dry-run (local)

```bash
npm run code-connect:dry-run          # config + ≥105 mapping; không secret
node _audit/ci/code-connect-publish.mjs   # thiếu secret → SOFT SKIP missing_secrets
npm run npm:pack-dry-run              # inventory tarball; không auth
node _audit/ci/npm-publish.mjs        # GHA OIDC; không thì SOFT SKIP (package disallow tokens)
npm run native:store-dry-run          # scaffold Fastlane + metadata; không ASC_*/Play JSON
node _audit/ci/native-store-dry-run.mjs   # thiếu secret → SOFT SKIP missing_secrets
```
