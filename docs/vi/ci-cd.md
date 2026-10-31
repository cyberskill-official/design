# CI/CD — tự động hóa bảng gate

**Gate CI** (workflow này) vẫn coi design system như cây tĩnh: serve repo, mở `_audit/run.html` headless, đọc verdict globals. Không cần product bundler cho gates. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

**Host deploy** (Vercel, tách khỏi workflow này) chạy `npm install` + `npm run build:site` để Storybook ship làm bề mặt sản phẩm tại `/` — xem `docs/deploy.md` và `docs/storybook.md`. Consumer không cần đóng gói host; job `storybook-build` bên dưới chạy đúng đường đóng gói public này.

## Badge

[![Design System Gates](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml)

## Những gì đã nối (`.github/workflows/design-system-gates.yml`)

1. **`fast-gates`** — `npm ci` + Playwright Chromium cache, serve repo, mở `_audit/run.html` headless (`_audit/ci/run-gates.mjs`), fail khi hard-gate fail. Upload import-report khi fail. Hàng mới trên board (hardening Th7 2026 thêm 8: token-format-parity, version-stamp, support-runtime-identity, package-exports-integrity, template-lang-parity, dtcg-typing, design-md-parity, bundle-freshness) được nhận tự động — runner đọc `window.__run`, không phải danh sách gate phía job.
2. **`token-provenance`** — kiểm Node không trình duyệt: natives + `provenance.json` khớp sha-256 nguồn DTCG.
3. **`unit-tests`** — `npm run test:unit` (bộ kiểm thử chuẩn trong script package gồm contract Node và browser headless; nối vào CI bởi hardening Th7 2026 — trước đó chỉ local). Gồm `test-element-packs` (freshness `node scripts/generate-element-packs.mjs --check`).
4. **`node-prechecks`** — authority Node không trình duyệt: `_audit/ci/check-bundle-freshness.mjs` (nguồn chân lý bundle-freshness — khám phá source đầy đủ gồm file mới/xóa; hàng board chỉ re-hash file ghi trong header), `scripts/generate-design-md.mjs --check` (`DESIGN.md` gốc byte-equals regeneration), `scripts/flatten-styles.mjs --check` + `scripts/generate-contrast-report.mjs --check` (FIND-026), và `_audit/ci/check-manifest-coverage.mjs` (FIND-078).
4b. **`storybook-build`** — `npm run build:site`, `npm run test:public-site`, rồi `test-storybook-freshness.mjs --require`. CI build và kiểm tra webroot public riêng trước deploy.
5. **`docs-consistency-blocker`** — merge blocker `docs-consistency` + `bilingual-parity`.
6. **`whole-set-audits`** — quyết định B của owner: mọi push/PR, cộng nightly `0 3 * * *` và `workflow_dispatch` (responsive + language + theme overflow, ~15–20 phút).
7. **`figma-variables-push`** — trên push `main` + thủ công. **`FIGMA_TOKEN` / `FIGMA_FILE_KEY` trống → soft-skip** (exit 0 + report). Quyết định A giữ tích hợp này ở trạng thái tùy chọn. Khi có thông tin xác thực, chỉ phản hồi giới hạn truy cập Variables và API không khả dụng đã mô tả trong `docs/figma.md` mới được soft-skip. Lỗi scope khi kiểm tra file, lỗi quyền ghi thông thường và dữ liệu token local không hợp lệ vẫn là lỗi cứng. Soft-skip không chứng minh đã đồng bộ Variables live.
8. **`pixel-diff`** — so sánh ảnh chụp màn hình Playwright Chromium (`_audit/ci/pixel-diff.mjs`) với 16 baseline chọn lọc trong `_audit/baselines/*.png`; upload `pixel-baselines-linux` và `_audit/ci/pixel-diff-report.json`.
9. **`regenerate-tokens`** (pull request) + **`regenerate-tokens-push`** (push `main` / schedule / thủ công) — path filter phủ element seeds/packs (`element-seeds.json`, `elements.css`, mirror JSON/JS/DTCG, `generate-element-packs.mjs`) cộng natives / `VERSION`. Regenerate chạy `npm run tokens:generate`, gồm toàn bộ export token, bản sao native và output/catalog phụ thuộc. Trên **pull request** job chạy với `contents: read`, không bao giờ push, và **exit 1** khi có drift: chạy pipeline này ở local rồi chuẩn bị diff đã review (freshness bắt buộc trên PR). Chỉ job song sinh push/schedule/thủ công giữ `contents: write` và có thể auto-commit với `PUSH_TOKEN` (hoặc `github.token`). Auto-commit **không** dùng `[skip ci]` — tip được push phải chạy lại bảng gate (FIND-021 / TASK-IMP-008); lần chạy thứ hai deterministic là no-op.
10. **`npm-hello-smoke`** — chứng minh consumer registry cho `@cyberskill/design@$VERSION` (**fail-closed**, FIND-087): `examples/npm-hello` → `npm install` từ registry + `npm run smoke`. Nếu VERSION **không** có trên registry, job **fail** (không soft-skip pack proof trên `cyberskill-official/design`). Fork chỉ được opt-in pack local khi đặt biến repo **`NPM_HELLO_ALLOW_LOCAL_PACK=true`**. Path-filtered trên push/PR khi `examples/npm-hello/**`, bề mặt publish package, hoặc workflow này đổi; luôn chạy trên schedule / `workflow_dispatch`.
11. **`notify-schedule-failure`** — phát error annotation và exit 1 khi lượt chạy lịch trình hàng đêm bị lỗi; job không tạo hoặc cập nhật issue.

Workflow riêng **`native-store`** (`.github/workflows/native-store.yml`): PR + `main` (path-filtered) + `workflow_dispatch`; dry-run scaffold luôn; kiểm signed-release soft-skip khi thiếu `ASC_KEY_ID` / `ASC_ISSUER_ID` / `ASC_KEY_P8` / `PLAY_SERVICE_ACCOUNT_JSON`. **Không bao giờ submit** lên App Store / Play — sample vẫn là sample. Xem `examples/native/README.md`.

Job gate dùng Node **22**. Cache key Playwright gồm `package-lock.json` và engine cần cài.

## Pattern cài runner (job Playwright)

```yaml
- run: npm ci
- uses: actions/cache@v6
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}-chromium-firefox-webkit
- run: npx playwright install --with-deps chromium firefox webkit
```

## Quyền auto-commit token

`regenerate-tokens-push` yêu cầu `permissions: contents: write` và checkout với `secrets.PUSH_TOKEN || github.token`. Job song sinh pull request `regenerate-tokens` giữ `contents: read` và không bao giờ push. Nếu ruleset/branch protection yêu cầu status checks trước khi push (hoặc khóa default Actions token), đặt repository secret **`PUSH_TOKEN`** (fine-grained PAT, Contents: Read and write trên repo này) hoặc cho phép GitHub Actions bypass ruleset. Không có thì bot push soft-warn và exit 0; drift nội dung vẫn hard-fail qua `token-provenance` / fast-gates / `node-prechecks`.

## Branch protection (khuyến nghị) — NV-18.1 ngoài repo

**NV-18.1 (assessment):** check nào **bắt buộc** trước khi merge `main`, admin có bị ràng buộc không, và CODEOWNERS / review / conversation-resolution có được enforce — đều là **cài đặt GitHub, không nằm trong repo**. Trạng thái quan sát từ clone: **không biết / xác nhận ngoài băng**. Không bịa giá trị ruleset live từ YAML workflow.

**Khuyến nghị** (chỉ tài liệu — áp dụng trong GitHub Settings → Branches / Rulesets, hoặc `gh api` admin):

- `fast-gates`
- `docs-consistency-blocker`

Tùy chọn: `whole-set-audits` (dài).

## Chạy local

Chạy static server trong terminal riêng; chạy lệnh kiểm tra ở terminal khác. Pixel comparison cần renderer/baseline phù hợp; giữ lỗi khác môi trường như bằng chứng, không tự cập nhật baseline. Nếu sửa input token, chạy `npm run tokens:generate` trước các bước kiểm tra.

```bash
npx serve -l 8080 .
npx playwright install --with-deps chromium firefox webkit
node _audit/ci/pixel-diff.mjs http://127.0.0.1:8080
node _audit/ci/run-gates.mjs http://127.0.0.1:8080/_audit/run.html
node _audit/ci/check-token-provenance.mjs
node _audit/ci/check-bundle-freshness.mjs
node scripts/generate-design-md.mjs --check
npm run test:unit
node _audit/ci/run-single-gate.mjs http://127.0.0.1:8080/_audit/docs-consistency.html __docs
npm run tokens:generate
node scripts/generate-element-packs.mjs --check
node _audit/ci/check-token-provenance.mjs
```

## Những gì KHÔNG auto-fail (có chủ đích)

- **Hàng visual / component baseline side-by-side** — chỉ advisory (drift đánh giá bằng mắt). So sánh `%` pixel Playwright là gate **hard** (job `pixel-diff` + hàng Pixel CI trên board).
- **Figma Variables** — thiếu secret, giới hạn truy cập Variables đã mô tả hoặc API không khả dụng tạo report skip rõ ràng. Lỗi scope khi kiểm tra file, lỗi quyền ghi thông thường và dữ liệu token local không hợp lệ gây fail. Xem ranh giới endpoint/status trong `docs/figma.md`; skip không chứng minh đã đồng bộ live.
- **Native store signed release** — soft-skip khi thiếu `ASC_*` / `PLAY_SERVICE_ACCOUNT_JSON` (Quyết định 1C); submit store vẫn tắt.
- **npm-hello registry smoke** — **fail-closed** (`examples/npm-hello` → install registry + `npm run smoke`); thiếu `@cyberskill/design@$VERSION` thì job fail (FIND-087). Pack proof local chỉ opt-in trên fork (`NPM_HELLO_ALLOW_LOCAL_PACK`).

Job `figma-variables-push` vẫn exit 0 khi soft-skip (Quyết định 1C), nhưng FIND-095 làm outcome hiện trên trang run công khai qua `$GITHUB_STEP_SUMMARY` kèm annotation riêng (`::error::` trên schedule/main, `::warning::` nơi khác) — soft-skip không còn xanh im lặng giống publish thật. Report artifact (`figma-push-report.json`) vẫn mang chi tiết.

## Soft-skip dry-run (local)

```bash
npm run test:pack-hygiene             # inventory tarball; không auth
npm run native:store-dry-run          # scaffold Fastlane + metadata; không ASC_*/Play JSON
node _audit/ci/native-store-dry-run.mjs   # thiếu secret → SOFT SKIP missing_secrets
```

Bộ `npm run test:unit` cần Chromium, Firefox và WebKit. `node _audit/ci/check-ci-browser-prerequisites.mjs` kiểm tra lệnh cài đặt trước entrypoint CI; `npm run test:ci-browser-prerequisites` còn khởi chạy thật cả ba engine. Kiểm tra YAML local không chứng minh CI Linux đã chạy thành công. Các job chỉ chạy gate Chromium vẫn chỉ cần Chromium.

## Cố định npm trước khi cache dependency

Mọi bước `actions/setup-node` đều tắt cả cache npm tường minh và cache package-manager tự động. Action thiết lập npm dùng chung bootstrap CLI đã khóa trước, sau đó xác định đường dẫn cache qua `node scripts/npm.mjs config get cache` và khôi phục các lượt tải npm bằng action cache đã cố định hiện có. `devEngines` và kiểm tra phiên bản chính xác vẫn được thực thi. npm đi kèm Node có thể bootstrap trong fixture CLI riêng; nó không được xác định cache trong project trước khi phiên bản npm bắt buộc hoạt động.

## Thu thập token bằng trình duyệt và consumer độc lập

`tokens:generate` chạy gián tiếp bộ sinh mode đã phân giải, cần Chromium được cài ngay cả với `--check`. Hai job sinh lại đều cài Chromium với đúng điều kiện của bước sinh; guard tiền điều kiện lần theo alias npm-script và từ chối thiếu cài đặt, cài muộn, khác điều kiện hoặc cho phép lỗi. Kiểm tra token truyền tùy chọn riêng từng trình duyệt: cờ shared-memory trên Linux chỉ dành cho Chromium, không dành cho Firefox hay WebKit. Kiểm thử Vite consumer gọi CLI npm đã khóa của project bằng đúng Node đang chạy ở cả thư mục producer và consumer riêng, nên PATH trỏ đến thư mục Node không thể âm thầm chọn npm đi kèm. `devEngines` chính xác, lock sạch và các kiểm tra tương tác production vẫn được thực thi.

## Trạng thái sẵn sàng của fixture trình duyệt

Hàm đặt trạng thái React của fixture được commit trước khi đọc quan hệ TreeTable; kiểm thử vẫn xác minh định danh hàng, focus, giá trị input, khả năng tiếp cận và cả hai biến thể lỗi hành vi. Kiểm thử cuộn panel nổi đợi thao tác cuộn gốc thực sự bắt đầu trước khoảng đo hiện có, giữ nguyên các khẳng định về vị trí cuộn, resize, khả năng tới phần tử bằng bàn phím và vòng lặp đo; probe trì hoãn vị trí cuộn kiểm tra trạng thái sẵn sàng riêng với thao tác wheel thật. So sánh CSS phân lớp thiết lập cùng trạng thái con trỏ và focus, rồi so sánh HoverCard ở cả trạng thái đóng và mở bằng focus trong các mode hiện có, giữ mọi phép so sánh và thuộc tính tính toán ban đầu.
