# Quyết định (maintainer)

Các lựa chọn của owner định hình CI, đồng bộ Figma, và phân phối. How-to nằm ở `docs/figma.md` và `docs/ci-cd.md` — file này chỉ là biên bản quyết định. Không phải hướng dẫn consumer.

## 1. Whole-set audits trên mọi PR

**Lựa chọn owner: B — Bật trên mọi PR** (Th7 2026)

`whole-set-audits` chạy trên push, pull_request, schedule (`0 3 * * *`), và `workflow_dispatch`. Dự kiến ~15–20 phút cho job đó.

## 2. Pixel-threshold CI auto-fail

**Lựa chọn owner: bật — hard gate** (Th7 2026)

So sánh `%` pixel Playwright (`_audit/ci/pixel-diff.mjs`) là hard gate. Drift trên ngưỡng làm fail hàng Pixel CI trên board và job CI `pixel-diff` (không `continue-on-error`). Trang review side-by-side visual / component baseline vẫn advisory (drift đánh giá bằng mắt). Sau redesign có chủ đích, làm mới `_audit/baselines/` bằng `--update` và commit các PNG.

## 3. Figma / Tokens Studio

**Lựa chọn owner: A — non-Enterprise hiện tại** (Th7 2026)

Giữ plan Figma hiện tại. Variables REST API chỉ Enterprise — job ghi **soft-skip** (exit 0 + report) khi plan hoặc secret không hoàn tất được write. Soft-skip đó **không** phải sync Variables live — đừng coi CI xanh là chứng minh Figma Variables đã cập nhật. Đồng bộ màu = hand-sync và/hoặc Tokens Studio từ `tokens/tokens.dtcg.json`. Xem `docs/figma.md`.

## 4. Live hub = chỉ Storybook

**Lựa chọn owner: Storybook là live hub duy nhất** (Th7 2026)

- Operator dùng Storybook tại `/` cho Theme × Element × Language × Style và ma trận điều khiển component.
- Không có trang Live View riêng trong tree.
- Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` redirect về `/`.
- Atomic View portable và HTML tĩnh khác vẫn phục vụ gate zero-build và consumer; chúng không phải entry sản phẩm của site.
- Bản đồ bề mặt: `docs/live-hub.md`.

## 5. Hai nguồn token JSON

**Lựa chọn owner: giữ cả `tokens.json` và `tokens.dtcg.json`** (Th7 2026)

| File | Vai trò |
|---|---|
| `tokens/tokens.dtcg.json` | Interchange W3C DTCG / regen native |
| `tokens/tokens.json` | Export nhóm theo hướng CSS |
| `tokens/*.css` + `styles.css` | UI runtime |

## 6. Code Connect — đường đã ship; **hoãn** trên Figma free

**Trạng thái: provisional / soft-skip — không phải publish library live** (Th7 2026; hoãn Th7 2026)

- Job CI `code-connect` + `figma.config.json` + 105 mapping `*.figma.tsx` đã trong repo (snippet import dùng `@cyberskill/design`).
- Publish soft-skip khi thiếu secret hoặc API trả 403/404/429. Soft-skip ≠ publish Code Connect thành công.
- **Owner hoãn:** giữ **Figma free / non-Org** — không theo đuổi Code Connect live đến khi có ghế Org/Enterprise và team library đã publish. Khi đó thay stub `9999:*` trong `code-connect/node-map.json` bằng `nodeId` thật. Xem `docs/figma.md`.

## 7. npm publish — live qua Trusted Publishing (OIDC)

**Trạng thái: `@cyberskill/design@1.0.0` đã trên registry; CI publish dùng npm Trusted Publishing; token bị cấm** (Th7 2026)

- `package.json` là `private: false`; tên package **`@cyberskill/design`** (`publishConfig.access: public`); `repository.url` khớp repo GitHub này cho provenance.
- Workflow `.github/workflows/npm-publish.yml`: `id-token: write` + runner GitHub-hosted; **không** đặt `NPM_TOKEN` / `NODE_AUTH_TOKEN` trên bước publish (OIDC). Trusted Publisher trên npm phải liệt kê filename workflow **`npm-publish.yml`** cho `cyberskill-official/design-system`. Soft-skip khi auth / 403 / 404 / EOTP / conflict phiên bản.
- **Publishing access** trên npmjs: **Require two-factor authentication and disallow tokens** (Trusted Publishing OIDC vẫn hoạt động; token publish classic / granular bị từ chối). Secret `NPM_TOKEN` dài hạn đã thu hồi.
- License giữ **UNLICENSED**; phiên bản giữ **1.0.0**. Dùng đã duyệt ghi tại **`docs/consumer-grant.md`** (sản phẩm portfolio CyberSkill). Cài từ registry một mình không phải license công khai.

## 8. Đóng gói store native — scaffold đã ship; submit tắt

**Trạng thái: đường Fastlane live; secret signing do operator sở hữu; không submit store** (Th7 2026)

- Scaffold dưới `examples/native/{swiftui,compose,flutter}/fastlane/` + placeholder metadata listing.
- Workflow `.github/workflows/native-store.yml`; dry-run luôn; kiểm signed-release cần `ASC_KEY_ID` / `ASC_ISSUER_ID` / `ASC_KEY_P8` / `PLAY_SERVICE_ACCOUNT_JSON`.
- Lane `upload_store` từ chối submit — sample vẫn là sample đến khi có nhu cầu sản phẩm. Xem `examples/native/README.md`.

## 9. Registry products — đã khóa

**Lựa chọn owner: khóa registry product → element** (Th7 2026)

`docs/products.md` (+ `docs/vi/products.md`) là nguồn chân lý **đã khóa** cho tám ánh xạ portfolio. Agent và kit phải dùng các hàng đó; không invent ánh xạ product → element mới. Mọi thay đổi cần sửa biên bản quyết định này trong cùng change.

## Mặc định roadmap (mở khóa phân phối)

Ghi nhận Th7 2026 — mặc định mở khóa (cập nhật khi bước vận hành xong):

- **Figma Variables** — giữ Tokens Studio / non-Enterprise (quyết định §3). Soft-skip Variables REST vẫn trung thực.
- **Code Connect** — **bỏ qua khi còn Figma free**; chỉ xem lại sau Org + library đã publish + `nodeId` thật (quyết định §6). Soft-skip ≠ publish.
- **npm** — **`@cyberskill/design@1.0.0` đã publish**; CI dùng **Trusted Publishing (OIDC)** qua `npm-publish.yml`; npmjs **disallow tokens**; grant consumer có hiệu lực tại `docs/consumer-grant.md` (quyết định §7). Entry package mặc định là bundler-native `_esm/react.mjs` (React peer); đường browser là `@cyberskill/design/legacy` → `_esm/cs.mjs` (quyết định §10).

## 10. Export React bundler-native (Next / SSR)

**Lựa chọn owner: ship `_esm/react.mjs` làm mặc định `exports["."]`** (Th7 2026; host React 19 Th7 2026)

- React / react-dom là **peerDependencies** (`^18 || ^19`); entry re-export JSX source (consumer transpile — ví dụ Next `transpilePackages`). Storybook / CI **devDependencies** pin **react@19.2.8** / **react-dom@19.2.8**.
- Browser / no-build giữ `_esm/cs.mjs` tại `exports["./legacy"]` (CDN self-ensure + `_ds_bundle.js`). React 19 chính thức bỏ UMD — đường CDN load **`umd-react@19.2.8`** (pin SRI) để tạo `window.React` / `window.ReactDOM` cho `_ds_bundle.js`. Cùng pin dùng trong audit HTML, specimen card, UI kit, và runtime `templates/*/support.js` byte-identical.
- Alias `@cyberskill/design/react` mirror entry mặc định. VERSION giữ **1.0.0**; republish qua Trusted Publishing sau merge.
- Docs: `docs/consuming.md` (+ VI); gate: `package-exports-integrity` + `test:react-entry`.

## Việc maintainer (đang mở)

Theo dõi vận hành — không phải marketing sản phẩm, không phải backlog công khai:

1. **Code Connect** — hoãn (Figma free). Khi lên Org: thay stub `9999:*` trong `code-connect/node-map.json` bằng node ID library đã publish.

~~2. Grant consumer npm~~ — **xong** (Th7 2026): Trusted Publishing + `docs/consumer-grant.md` (+ VI) cho sản phẩm portfolio CyberSkill.

~~3. Chốt registry products~~ — **xong** (Th7 2026): xem quyết định §9; `docs/products.md` đã khóa.

~~4. Đường consumer registry đầu tiên~~ — **xong** (Th7 2026): `examples/npm-hello/` cài `@cyberskill/design@1.0.0` cho identity **Lumi** đã khóa; ghi trong `docs/consuming.md` (+ VI) và `docs/release-notes.md`.

5. **Drift native + element-pack trên PR là fail-closed** (Th7 2026) — `regenerate-tokens` chạy read-only trên pull request và exit 1 thay vì push; chỉ `regenerate-tokens-push` (main / schedule / thủ công) giữ `contents: write`. Khi PR fail, chạy `npm run tokens:elements && node _audit/ci/generate-native-tokens.mjs` rồi commit packs + natives. Xem `docs/ci-cd.md`.

6. **Shadcn gap / Wave 2** (Th7 2026) — CyberSkill đã phủ ~53/62 primitive shadcn dưới dạng CS-native (forms / overlays / nav / data). Đã ship: pilot `ScrollArea`, `Collapsible`, `AspectRatio`; Wave 2 `AlertDialog` (vs Popconfirm), `Item` row primitive, `NativeSelect`. Phần còn lại của shadcn là non-port có chủ đích (block, Tailwind, Radix CLI). **Không** port những thứ đó — map pattern sang `templates/` + `ui_kits/` hiện có.

7. **Hình học màu Element** (Th7 2026; thanh palette owner Th7 2026) — **30** bộ mặc định (5 × soft/middle/deep × light/dark) từ `tokens/element-seeds.json` (`npm run tokens:elements`): soft = pastel wash, middle = mặc định đồng bộ cường độ (Thổ middle ghim ochre logo), deep = anh em tối hơn rõ trong cùng họ hue; role hài hòa; khóa hue light↔dark; sàn APCA dark. Gate geometry yêu cầu cả minΔE và minΔL cộng L đơn điệu. Tên variant công khai không đổi. Hard gate: `_audit/element-geometry.html`. Rubric: `docs/benchmark-rubric.md`.

8. **Trục Style (`data-cs-style`)** (Th7 2026) — Trục sản phẩm thứ tư; sole pack live **liquid-glass** (vắng ≡ liquid-glass). Hợp đồng: `tokens/styles.css` + hard gate `_audit/style-contract.html`. Pack Style tương lai có thể mở rộng vô hạn, mỗi pack một ngôn ngữ phối màu riêng — chỉ qua owner + checklist Expansion Rule trong `docs/benchmark-rubric.md` (không invent pack tùy tiện).

9. **Identity Lab đã gỡ** (Th7 2026) — Lựa chọn owner: xóa `ui_kits/status-hub/identity-lab.html` và mọi tham chiếu product/docs/Storybook. Demo trục nằm ở Storybook toolbar Theme × Element × Language × Style, Atomic View, và specimen Elements Geometry. Các trục Theme × Element × Language × Style **vẫn là** hạ tầng sản phẩm (template, token, kit trung thành Thổ). Không hồi sinh Lab dưới tên khác nếu chưa có quyết định mới.

Storybook `FullMatrix` bắt buộc khi public primary có ≥1 trong {size enums, variant enums, state keys} (sàn contract ≥28 story). Schema sidecar đã đủ cho template content-hole; template chỉ-axis bỏ qua theo thiết kế. Xem `docs/quality-gates.md` và `docs/storybook.md`.

## Cách đổi một quyết định

Sửa dòng **Lựa chọn owner** tại đây. Người triển khai nối lại CI và docs liên quan trong cùng một change.
