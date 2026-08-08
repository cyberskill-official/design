# Quality gates — tài liệu chuẩn benchmark

Mọi quality gate deterministic trong hệ thống, nó assert gì, tiêu chí pass, hard hay advisory, và chạy ở đâu.

**Gate chạy ở đâu.** *Fast board CI* = job `fast-gates` trong `.github/workflows/design-system-gates.yml`, serve repo và điều khiển `_audit/run.html` headless qua `_audit/ci/run-gates.mjs` (mọi push/PR + nightly + thủ công) — hàng board mới được nhận tự động. Hai gate thêm chạy standalone như *merge blocker* (job `docs-consistency-blocker`, qua `_audit/ci/run-single-gate.mjs`). *Whole-set CI* = job `whole-set-audits` (mọi push/PR + nightly — quyết định B của owner). *Unit test* = `npm run test:unit` trong job `unit-tests` (Node thuần, không trình duyệt). *Node pre-checks* = job `node-prechecks` (authority không trình duyệt: bundle freshness, DESIGN.md freshness) cộng job `token-provenance`. Mọi browser gate publish verdict global (`window.__*`) mà headless runner đọc.

## Fast board — 38 gates trong `_audit/run.html`

Nguyên tắc benchmark (WCAG · APCA · OKLCH · DTCG · doctrine CDS + mở rộng style): [`docs/vi/benchmark-rubric.md`](benchmark-rubric.md).

| Gate | File | Assert gì | Tiêu chí pass | Loại | Chạy ở đâu |
|---|---|---|---|---|---|
| Contrast guard | `_audit/contrast-guard.html` | Không base rule sơn umber trên bề mặt themeable mà thiếu dark override; mọi cặp text×surface semantic ghi điểm light và dark | 0 rule không shield và 0 cặp fail (`__contrastguard`) | Hard | Fast board CI |
| Axes guard | `_audit/axis-guard.html` | Không live source đưa lại bề mặt sản phẩm Expression/Density đã nghỉ | 0 hit trên source index bởi manifest (`__axisguard`) | Hard | Fast board CI |
| Manifest CSS paths | `_audit/manifest-css-guard.html` | Mọi entry `globalCssPaths` của `_ds_manifest.json` tồn tại như raw CSS; mọi `@import` của `styles.css` được liệt kê | 0 thiếu / 0 chưa liệt kê (`__cssguard`) | Hard | Fast board CI |
| Docs consistency | `_audit/docs-consistency.html` | Mọi claim đếm trong README/SKILL/llms.txt khớp compiler manifest; claim số card trong prose audit (`_audit/index` / README / namespace-portability) khớp `manifest.cards`; `VERSION` + `package.json` pin 1.1.1; không tham chiếu changelog-file; blacklist stale-phrase (suite/pack count đã gỡ trong audit Th7 2026) sạch trên README/SKILL/llms + `docs/*.md` (ghi chú lịch sử dưới `_audit/archive/` không được quét); `DESIGN.md` tồn tại với front-matter version = `VERSION`; routing agent trung thực — Claude path cite `_esm/cs.mjs` + bundle prefix; Stitch path cấm `*.dc.html` làm SoT; tên package `@cyberskill/design` | 0 claim lệch, 0 blacklist hit, pin + stamp + routing nguyên (`__docs`) | Hard | Fast board CI + merge blocker |
| Docs language parity | `_audit/docs-lang-parity.html` | Mọi EN `docs/*.md` hướng operator có counterpart `docs/vi/`; VI không phải stub trống/TODO (≥40% độ dài EN); blacklist stale-phrase sạch trên cả EN và VI (ghi chú lịch sử dưới `_audit/archive/` không được theo dõi) | 0 cặp thiếu, 0 stub, 0 blacklist hit (`__docslangparity`) | Hard | Fast board CI |
| DESIGN.md parity | `_audit/design-md-parity.html` | Root `DESIGN.md` (open-spec Stitch) byte-equals regeneration trong trình duyệt từ `tokens.dtcg.json` + `_ds_manifest.json` + `VERSION` qua `scripts/design-md-lib.mjs` dùng chung; từng hàng token được re-check riêng (số hàng in kèm verdict) | Byte-identical + 0 hàng drift (`__designmd`) | Hard | Fast board CI |
| Version stamp | `_audit/version-stamp.html` | `package.json`, meta `tokens.json`/`tokens.js`, DTCG `$extensions`, `provenance.json` release + dtcgStamp, front matter `DESIGN.md`, và `_esm/cs.mjs` `export const VERSION` đều bằng `VERSION` (pin 1.1.1) | Cả 9 stamp bằng nhau (`__versionstamp`) | Hard | Fast board CI |
| Namespace portability | `_audit/namespace-portability.html` | Không source index bởi manifest hardcode hậu tố bundle project-id của compiler | 0 hậu tố hardcode (`__nsguard`) | Hard | Fast board CI |
| Artifact head | `_audit/artifact-head.html` | Mọi template artifact có `<title>` và `<html lang>` (chuẩn head qua `ds-base`/compiler) | 0 thiếu title/lang (`__artifacthead`) | Hard | Fast board CI |
| Overflow @320 | `_audit/responsive-overflow-320.html` | Chiều rộng reflow WCAG 1.4.10: template + kit ở 320px không overflow ngang | 0 bề mặt overflow (`__overflow320`) | Hard | Fast board CI |
| Light contrast | `_audit/light-contrast.html` | DOM walk light (gương `theme-overflow`): fail WCAG AA leaf-text trên nền solid tái hiện được ngoài `REVIEWED_OK` | 0 fail contrast mở (`__lightcontrast`) | Hard | Fast board CI |
| No third-party | `_audit/no-third-party.html` | Bề mặt sản phẩm (template · kit · Atomic View) không có origin script/style bên thứ ba; React + Babel có dưới `_vendor/` | 0 hit CDN + vendor có mặt (`__nothirdparty`) | Hard | Fast board CI |
| Token contract | `_audit/token-contract.html` | Cả 15 scope element×variant resolve cả 10 role `--cs-accent-*` (gồm `on-strong`); token semantic + doc/focus resolve | 0 role thiếu, 0 token core thiếu (`__contract`) | Hard | Fast board CI |
| Token pipeline | `_audit/token-pipeline-test.html` | Mọi hằng dẫn từ DTCG xuất hiện nguyên văn trong cả ba target `tokens/native/`; provenance sha-256 khớp nguồn DTCG | 0 hằng drift, hash khớp (`__tokenpipe`) | Hard | Fast board CI |
| Token format parity | `_audit/token-format-parity.html` | Mọi khai báo `--cs-*` trong `tokens/*.css` bằng mirror trong `tokens.json`, `tokens.js` (ESM deep-equal live), và DTCG (chuỗi ext-css hoặc typed transform) — base `:root` + theme dark/system + 15 pack element + 15 pack dark; 4 duration `_ds_manifest.json` bằng `motion.css` (chặn bug reduced-motion 0ms của compiler) | 0 diff trên mọi scope (`__tokenformat`) | Hard | Fast board CI |
| DTCG typing | `_audit/dtcg-typing.html` | Mọi leaf `$value` DTCG mang W3C `$type`; mọi `{alias}` resolve (theo chuỗi, không cycle); mọi shadow token là object/array có đủ field layer; byType counts bằng `provenance.json` | 0 untyped / dangling / string shadow (`__dtcgtyping`) | Hard | Fast board CI |
| Font-face integrity | `_audit/font-face-integrity.html` | Mọi `@font-face` trong `tokens/fonts.css` là self-host dưới `fonts/` (không `src` CDN), chia subset với `font-display: swap`, và trỏ tới file có byte mở đầu là magic `wOF2`; mọi family được một token `--cs-font-family-*` gọi tên đầu tiên đều có face ở đây **kể cả subset tiếng Việt** (`U+1EA0-1EF9`), và mọi family self-host đều được một token gọi tên; `fonts[]` trong `_ds_manifest.json` khớp từng entry với face đã parse và `brandFonts[]` khớp tập family theo token; mỗi family load thật qua `document.fonts`; `.cs-display-face` chuyển `--cs-heading-family` sang display family mà không rò sang body copy | 0 file thiếu/từ xa, 0 family không có subset VN, 0 diff manifest (`__fontface`) | Hard | Fast board CI |
| Story coverage | `_audit/story-coverage.html` | Mọi primary bundle export có Atomic View story; primary tweakable trong `PLAYGROUND_REQUIRED` phải có playground `controls` + `renderC` | 0 story thiếu + 0 playground thiếu (`__storycov`) | Hard | Fast board CI |
| Consumer smoke test | `_audit/consumer-smoke-test.html` | Đường consumer ngoài hoạt động: `styles.css` + `_ds_bundle.js` mount component thật và brand token tới Button đã render | Mọi assert mount + token pass (`__smoke`) | Hard | Fast board CI |
| Bundle freshness | `_audit/bundle-freshness.html` | Mọi source ghi trong header `_ds_bundle.js` re-hash khớp sha-256 header (nhân bản trình duyệt của `ci/check-bundle-freshness.mjs`; script Node vẫn là authority CI và còn khám phá file mới); source component manifest ⊆ header | 0 source drift / thiếu (`__bundlefresh`) | Hard | Fast board CI (+ Node authority trong `node-prechecks`) |
| ESM smoke test | `_audit/esm-smoke-test.html` | `_esm/cs.mjs` import không cần build, re-export mọi component manifest, `VERSION` bằng pin `VERSION` gốc, và Button mount nhận brand token | Export/manifest parity + pin VERSION + kiểm token (`__esm`) | Hard | Fast board CI |
| Package exports integrity | `_audit/package-exports-integrity.html` | Mọi entry `files` của `package.json` và mọi target `module`/`types`/`style`/`exports` tồn tại; mọi target entry-point được `files` phủ (pack-safe); dual entry — `_esm/react.mjs` (mặc định / `./react`, React peer) + `_esm/cs.mjs` (`./legacy`) — hình ESM và re-export ⊆ export lộ trong header bundle | 0 thiếu / chưa phủ / lạ (`__pkgexports`) | Hard | Fast board CI |
| Component children | `_audit/component-children-test.html` | Component void-element (Checkbox, Radio, Switch, SearchField, NumberField, Slider, Divider, TextField) mount với child lạc mà không throw React #137 | 0 throw (`__result.anyThrew === false`) | Hard | Fast board CI |
| Component behavior | `_audit/component-behavior-test.html` | 79 assert tương tác thật — mọi public primary có hợp đồng tương tác người dùng (overlay, form, AI gate, shell, media/copy) cộng toast trên dialog; primary chỉ hiển thị loại trừ theo thiết kế | 79/79 assert pass (`__behavior`) | Hard | Fast board CI |
| A11y interactions | `_audit/a11y-gate.html` | Focus management (Dialog/Drawer trap + restore + Escape), roving tabindex, combobox `aria-activedescendant`, hợp đồng role/label, cộng Esc/focus open-state cho Cascader · TreeSelect · Tour · HoverCard · ContextMenu | Mọi assert keyboard/ARIA pass (`__a11y`) | Hard | Fast board CI |
| A11y CSSOM | `_audit/a11y-harness.html` | Mọi control `.cs-*` tương tác đạt floor touch-target đã ghi dưới coarse pointer; focus-ring, reduced-motion, và contrast rule chứng minh trong source CSS | 0 vi phạm floor, mọi source proof tìm thấy (`__a11ycss`) | Hard | Fast board CI |
| Template schema v2 | `_audit/template-schema-test.html` | Mọi sidecar `content-schema.json` validate theo JSON Schema, mọi slot id khai báo resolve tới `{{ hole }}` thật trong template, và mọi template lộ **content** hole author được đều có sidecar (hole trục/control-flow và tweak boolean được loại trừ — xem `docs/template-schema-v2.md`) | 0 sidecar invalid, 0 slot id treo, 0 template hole-driven thiếu sidecar (`__schemav2`) | Hard | Fast board CI |
| Support runtime identity | `_audit/support-runtime-identity.html` | Mọi bản `templates/*/support.js` (một mỗi template, 84) byte-identical: sha-256 qua SubtleCrypto, đúng một hash duy nhất, số bản == số template manifest | 1 hash duy nhất, count khớp (`__supportid`) | Hard | Fast board CI |
| Bilingual parity | `_audit/bilingual-parity.html` | Mọi component trong `components/_i18n/strings.js` có bảng en + vi với key set bằng nhau và không giá trị rỗng | 0 key thiếu/thừa, 0 giá trị rỗng (`__bilingual`) | Hard | Fast board CI + merge blocker |
| Template language parity | `_audit/template-lang-parity.html` | Quét source tĩnh cả 84 `.dc.html`: en/vi hole-map key set giống và không rỗng (21 map template); nhánh `sc-if` `isEN`/`isVN` cặp (24 branch template); mọi template có language-tweak có cơ chế bilingual; lexicon EN-leak (Unsubscribe · View in browser · Preferences · All rights reserved · Manage subscription · Sent with) không bao giờ xuất hiện ngoài guard `isEN` / map `en`. Instrument VN-first stacked (37 `vn-*` + 3 `doc-*`) miễn leak theo thiết kế — cả hai ngôn ngữ luôn render | 0 key drift, 0 nhánh không cặp, 0 leak (`__langparity`) | Hard | Fast board CI |
| APCA dark packs | `_audit/apca-dark-preview.html` | Cả 15 pack element×variant giữ mục tiêu APCA ở dark (bright-as-text ≥ 75, accent UI ≥ 60, ink-on-accent ≥ 75, ink-on-tint ≥ 75) | 0 fail hiện tại (`__apcaPreview.currentFail === 0`) | Hard | Fast board CI |
| Element geometry | `_audit/element-geometry.html` | Sync cường độ soft/middle/deep giữa năm element; tách variant; khóa hue light↔dark; Thổ middle ghim ochre logo; pack generate từ seed | `__elementgeometry.pass` | Hard | Fast board CI |
| Style contract | `_audit/style-contract.html` | Allowlist trục Style: sole pack `liquid-glass` (vắng ≡ mặc định); `styles.css` import `tokens/styles.css`; `--cs-style-pack` resolve; không `data-cs-style` lạ | `__stylecontract.pass` | Hard | Fast board CI |
| Visual baselines | `_audit/visual-diff.html` | Baseline template tồn tại và load được để so sánh side-by-side / overlay | Baseline có; drift đánh giá bằng mắt (`__visualdiff`) | Advisory | Fast board CI |
| Component baselines | `_audit/component-visual-diff.html` | 12 crop component curated neo các tầng atomic cho so sánh visual | Crop render + baseline có (`__componentVisualDiff`) | Advisory | Fast board CI |
| Axe smoke | `_audit/axe-smoke.html` + `_audit/lib/axe-fixtures.js` | Rule serious/critical WCAG 2 A/AA của axe-core 4.10.0 (vendored tại `_audit/vendor/axe.min.js`) trên mọi public primary (fixture khoá inventory; bilingual EN·VI) — Dialog, AlertDialog, Drawer, Tour, CommandPalette và Menu mount mở, còn Cascader / TreeSelect / Menubar / Combobox được bung trước khi quét; tương đương enforcement a11y Storybook (không test-runner riêng) | 0 finding serious/critical (`__axesmoke`) | Hard | Fast board CI |
| Print smoke | `_audit/print-smoke.html` | Document template khai báo meta print-ownership và hook CSS `@page` mà đường export dựa vào | 0 document thiếu print hook (`__printsmoke`) | Hard | Fast board CI |
| Pixel CI | `_audit/pixel-ci.html` + `_audit/ci/pixel-diff.mjs` | 15 baseline curated tồn tại; script Playwright capture so sánh % pixel thật; report gần nhất phải sạch (`drifted[]` rỗng) | Hợp đồng + compare sạch (`__pixelci.pass`); drift hoặc thiếu report → fail | Hard | Fast board CI (bước compare nuôi hàng) + job `pixel-diff` |

## Whole-set audits — mọi template, mọi trục

| Gate | File | Assert gì | Tiêu chí pass | Loại | Chạy ở đâu |
|---|---|---|---|---|---|
| Responsive overflow | `_audit/responsive-overflow.html` | Mọi template (84) + 3 UI kit render ở 390 px không horizontal document overflow | 0 bề mặt overflow (`__overflow`) | Hard | Whole-set CI (mọi PR + nightly) |
| Language overflow | `_audit/language-overflow.html` | Cùng set ép Tiếng Việt: VN áp dụng, không overflow, không clip chữ trong hộp fixed/nowrap, và chuỗi EN built-in đã biết (hint PromptInput, FileUpload, pin DataGrid, …) không rò | 0 over/clip/EN-leak (`__language`) | Hard | Whole-set CI (mọi PR + nightly) |
| Theme overflow | `_audit/theme-overflow.html` | Cùng set ép dark: dark áp dụng, không document overflow, và không fail WCAG leaf-text solid-bg tái lập được ngoài `REVIEWED_OK` | Dark áp dụng + 0 overflow + 0 contrast mở (`__theme`) | Hard (chỉ near-miss allowlist) | Whole-set CI (mọi PR + nightly) |

## Node pre-checks (không trình duyệt)

| Gate | File | Assert gì | Tiêu chí pass | Loại | Chạy ở đâu |
|---|---|---|---|---|---|
| Token provenance | `_audit/ci/check-token-provenance.mjs` | `tokens/native/` + `tokens/provenance.json` khóa với `tokens/tokens.dtcg.json` (cùng authority drift sha-256 như gate token-pipeline) | Exit 0 khi hash khớp | Hard | CI job `token-provenance` |
| Bundle freshness (authority) | `_audit/ci/check-bundle-freshness.mjs` | `_ds_bundle.js` đã commit được build từ component source hiện tại — khám phá source đầy đủ (đi `components/`, `ui_kits/`, root sources), nên file mới/xóa cũng bị bắt, hàng trình duyệt không làm được | Exit 0, 0 source drift/mới/xóa | Hard | CI job `node-prechecks` |
| DESIGN.md freshness | `scripts/generate-design-md.mjs --check` | Root `DESIGN.md` byte-equals regeneration mới từ DTCG + manifest + `VERSION` | Exit 0 khi byte khớp | Hard | CI job `node-prechecks` |

## Unit tests — `npm run test:unit` (11)

| Test | File | Assert gì | Tiêu chí pass | Loại | Chạy ở đâu |
|---|---|---|---|---|---|
| Nav model | `_audit/ci/test-nav-model.mjs` | Logic classify/group của `guidelines/nav-model.js` đã ship hành xử đúng (chạy module thật) | Mọi assert pass (exit 0) | Hard | Unit test |
| Health/Tokens UI contract | `_audit/ci/test-health-tokens-contract.mjs` | Hợp đồng cấu trúc của entry HTML Health + Tokens giữ | Mọi assert pass (exit 0) | Hard | Unit test |
| Form paths | `_audit/ci/test-form-paths.mjs` | Helper Form path hành xử đúng (chạy `Form.jsx` đã ship qua dynamic import) | Mọi assert pass (exit 0) | Hard | Unit test |
| Storybook contract | `_audit/ci/test-storybook-contract.mjs` | Live hub chỉ là Storybook; SB10 ESM main + addon-docs/a11y; CSF đủ cho mọi public primary; Matrix/AllVariants + AllSizes khi có `argTypes.size`; States/Matrix phủ disabled/loading/error/busy; mọi enum size/variant rời rạc được mount; FullMatrix bắt buộc khi ≥1 trục trong {size, variant, state} tồn tại (≥28 primary đủ điều kiện) | Mọi assert pass (exit 0) | Hard | Unit test |
| Axe coverage | `_audit/ci/test-axe-coverage.mjs` | `NAMES` fixture ≡ `listPublicComponents()`; axe-smoke nạp fixture khoá inventory | Mọi assert pass (exit 0) | Hard | Unit test |
| Figma push helpers | `_audit/ci/test-figma-push-helpers.mjs` | Helper thuần trong `push-figma-variables.mjs` hành xử đúng (không mạng, không secret) | Mọi assert pass (exit 0) | Hard | Unit test |
| Code Connect helpers | `_audit/ci/test-code-connect.mjs` | 105 primaries, helper node-map/render, classifier soft-skip, `figma.config.json` đã commit + `.figma.tsx` traffic cao | Mọi assert pass (exit 0) | Hard | Unit test |
| Native samples | `_audit/ci/test-native-samples.mjs` | App sample SwiftUI / Compose / Flutter mỗi cái ≥ 3 màn hình, tham chiếu hằng token đã generate, và ship scaffold Fastlane store (submit tắt) | Mọi assert pass (exit 0) | Hard | Unit test |
| Subtree consume | `_audit/ci/test-subtree-consume.mjs` | Bản copy portable `styles.css` + `base/` + `tokens/` + `fonts/` + `_esm/` + `_ds_bundle.js` (không clone full) vẫn resolve token/font và mount Button qua ESM — đường subtree-copy Stitch/Claude | Mọi assert pass (exit 0) | Hard | Unit test |
| React entry | `_audit/ci/test-react-entry.mjs` | Dual package exports (`.` / `./react` → `_esm/react.mjs`, `./legacy` → `_esm/cs.mjs`); pin VERSION 1.1.1; peerDeps React; react.mjs không CDN/bundle bridge và re-export khớp header bundle; `generate-react-entry --check` xanh | Mọi assert pass (exit 0) | Hard | Unit test |
| Element packs | `_audit/ci/test-element-packs.mjs` | `tokens/elements.css` + mirror JSON/JS/DTCG byte-equal regeneration từ `tokens/element-seeds.json` | `generate-element-packs --check` exit 0 | Hard | Unit test |

Suite `test:unit` được nối vào CI workflow như một phần của hardening Th7 2026 (trước đó chỉ chạy local).

## Job sync / phân phối (soft-skip)

Soft-skip nghĩa là job exit 0 kèm report khi secret/plan/API không hoàn tất write thật — **không** có nghĩa Code Connect hay Figma Variables đang live. npm CI publish dùng Trusted Publishing; soft-skip là trung thực auth/conflict. Coi việc maintainer còn lại trong `docs/decisions.md` là danh sách mở (Code Connect hoãn; grant consumer tại `docs/consumer-grant.md`). Storybook `FullMatrix` bắt buộc cho mọi public primary có ≥1 trong {size enums, variant enums, state keys} — helper chung tại `stories/lib/matrix.jsx`.

| Job | Script / workflow | Assert gì | Soft-skip khi | Chạy ở đâu |
|---|---|---|---|---|
| Figma Variables | `_audit/ci/push-figma-variables.mjs` + job `figma-variables-push` | Secret mở được file; write Variables tùy chọn | Soft-skip khi thiếu secret (cùng trung thực với Code Connect) hoặc non-Enterprise / thiếu scope `file_variables:*` / API **403** sau khi secret đã có. Soft-skip ≠ sync live | Push `main` + thủ công |
| Code Connect | `_audit/ci/code-connect-publish.mjs` + job `code-connect` | Config + 105 mapping; publish tùy chọn | Thiếu `FIGMA_TOKEN`/`FIGMA_FILE_KEY` hoặc API 403/404/429 | PR + `main` + thủ công |
| npm publish | `_audit/ci/npm-publish.mjs` + `npm-publish.yml` | `files`/`exports` pack-safe; `npm publish` qua OIDC Trusted Publishing (package disallow tokens) | Auth / 403 / 404 / EOTP / conflict phiên bản | `workflow_dispatch` / tag `v*` |
| Native store | `_audit/ci/native-store-dry-run.mjs` + `native-store.yml` | Scaffold Fastlane + metadata; kiểm secret signed-release | Thiếu `ASC_*` / `PLAY_SERVICE_ACCOUNT_JSON` (submit luôn tắt) | PR + `main` (paths) + thủ công |

## Registry consumer smoke (hard)

| Job | Script / workflow | Assert gì | Tiêu chí pass | Chạy ở đâu |
|---|---|---|---|---|
| npm-hello smoke | `examples/npm-hello` + job `npm-hello-smoke` | Install registry public `@cyberskill/design@1.1.1` resolve đúng tên package + exports (`npm install` + `npm run smoke`; pack proof local nếu VERSION chưa trên registry) | Exit 0 (**hard fail** khi đã publish; soft-skip pack proof nếu VERSION chưa trên registry) | Push/PR path-filtered + nightly + thủ công |

## Hardening Th7 2026 — đã giao

Tám gate audit lên kế hoạch (token-format-parity, version-stamp, support-runtime-identity, package-exports-integrity, template-lang-parity, dtcg-typing, bundle-freshness, design-md-parity) giờ đã **triển khai** — xem hàng của chúng trong bảng fast-board và Node-pre-check trên. Tất cả nối vào `_audit/run.html`, `_audit/index.html`, và workflow CI (`fast-gates` nhận hàng board tự động; `node-prechecks` + `unit-tests` là job mới). Operator xem Health qua Storybook **Status** (nhúng full-bleed `_audit/run.html`) và chỉ mục audit tại `_audit/index.html` — `dashboard.html` chỉ redirect và không còn tab Health. Gate docs-consistency mang blacklist stale-phrase (suite/pack count đã nghỉ) + mở rộng stamp `DESIGN.md` mô tả ở hàng của nó. Gate docs-lang-parity khóa gương `docs/vi/`.

## Human-reviewed, không bao giờ tự động hóa

- **Brand voice / copy** — ấm · trực tiếp · trung thực · tôn trọng do người đánh giá, không regex.
- **Nội dung template pháp lý** — counsel review instrument; gate chỉ kiểm cấu trúc, cơ chế bilingual, và hình học print.
- **Baseline pixel-diff** — drift `%` Playwright auto-fail (hard). Sau redesign có chủ đích, làm mới `_audit/baselines/` bằng `pixel-diff.mjs --update` và commit. Trang review side-by-side visual / component vẫn advisory (đánh giá bằng mắt).
- **Review thiết kế API component** — đặt tên prop và ergonomics do owner review, không assert.
