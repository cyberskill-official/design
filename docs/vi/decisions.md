# Quyết định (maintainer)

Các lựa chọn của owner định hình CI, đồng bộ Figma, và phân phối. How-to nằm ở `docs/figma.md` và `docs/ci-cd.md` — file này chỉ là biên bản quyết định. Không phải hướng dẫn consumer. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

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
- IA công khai theo đường duyệt atomic: Foundations → Components → **Templates** → **Pages** (Atoms/Molecules/Organisms vẫn trong CSF + Atomic View; Templates/Pages là nhóm sidebar hạng nhất, gồm cả bộ VN A4 / HR Suite).
- Không có trang Live View riêng trong tree.
- Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` redirect về `/`.
- Atomic View portable và HTML tĩnh khác vẫn phục vụ gate zero-build và consumer; Atomic View cũng được nối từ **Templates → Gallery**.
- Bản đồ bề mặt: `docs/live-hub.md`.

## 5. Hai nguồn token JSON

**Lựa chọn owner: giữ cả `tokens.json` và `tokens.dtcg.json`** (Th7 2026)

| File | Vai trò |
|---|---|
| `tokens/tokens.dtcg.json` | Interchange DTCG 2025.10 / regen native |
| `tokens/tokens.json` | Export nhóm theo hướng CSS |
| `tokens/*.css` + `styles.css` | UI runtime |

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
- **npm** — grant consumer có hiệu lực tại `docs/consumer-grant.md`. Entry package mặc định là bundler-native `_esm/react.mjs` (React peer); đường browser là `@cyberskill/design/legacy` → `_esm/cs.mjs` (quyết định §10).

## 10. Export React bundler-native (Next / SSR)

**Lựa chọn owner: ship `_esm/react.mjs` làm mặc định `exports["."]`** (Th7 2026; host React 19 Th7 2026)

- React / react-dom là **peerDependencies** (`^18 || ^19`); entry re-export JSX source (consumer transpile — ví dụ Next `transpilePackages`). Storybook / CI **devDependencies** pin **react@19.2.8** / **react-dom@19.2.8**.
- Browser / no-build giữ `_esm/cs.mjs` tại `exports["./legacy"]` (CDN self-ensure + `_ds_bundle.js`). React 19 chính thức bỏ UMD — đường CDN load **`umd-react@19.2.8`** (pin SRI) để tạo `window.React` / `window.ReactDOM` cho `_ds_bundle.js`. Cùng pin bản phân phối wrapper dùng trong audit HTML, specimen card, UI kit, và runtime `templates/*/support.js` byte-identical. Các file trình duyệt được lưu báo phiên bản runtime React và ReactDOM `19.2.4`; phiên bản package wrapper khác với các phiên bản được báo này và dependency build `19.2.8`.
- Alias `@cyberskill/design/react` mirror entry mặc định.
- Docs: `docs/consuming.md` (+ VI); gate: `package-exports-integrity` + `test:react-entry`.

## Việc maintainer (đang mở)

Theo dõi vận hành — không phải marketing sản phẩm, không phải backlog công khai:

~~2. Grant consumer npm~~ — **xong** (Th7 2026): `docs/consumer-grant.md` (+ VI) cho sản phẩm portfolio CyberSkill.

~~3. Chốt registry products~~ — **xong** (Th7 2026): xem quyết định §9; `docs/products.md` đã khóa.

~~4. Đường consumer registry đầu tiên~~ — **xong** (Th7 2026): `examples/npm-hello/` cài `@cyberskill/design` cho identity **Lumi** đã khóa; ghi trong `docs/consuming.md` (+ VI) và `docs/release-notes.md`. Pin theo `VERSION` của repository.

5. **Drift native + element-pack trên PR là fail-closed** (Th7 2026; FIND-021 re-gate Th8 2026) — `regenerate-tokens` chạy read-only trên pull request và exit 1 thay vì push; chỉ `regenerate-tokens-push` (main / schedule / thủ công) giữ `contents: write`. Khi PR fail, chạy `npm run tokens:generate` rồi review/commit đầy đủ thay đổi token, native, bundle và reference đã sinh. Auto-commit từ `regenerate-tokens-push` **không** được dùng `[skip ci]` để tip chạy lại bảng gate (TASK-IMP-008); freshness fail-closed trên PR vẫn là đường chính cho contributor. Thực tế required-check branch protection là NV-18.1 (ngoài repo). Xem `docs/ci-cd.md`.

6. **Shadcn gap / Wave 2** (Th7 2026) — CyberSkill đã phủ ~53/62 primitive shadcn dưới dạng CS-native (forms / overlays / nav / data). Đã ship: pilot `ScrollArea`, `Collapsible`, `AspectRatio`; Wave 2 `AlertDialog` (vs Popconfirm), `Item` row primitive, `NativeSelect`. Phần còn lại của shadcn là non-port có chủ đích (block, Tailwind, Radix CLI). **Không** port những thứ đó — map pattern sang `templates/` + `ui_kits/` hiện có.

7. **Hình học màu Element** (Th7 2026; thanh palette owner Th7 2026) — **30** bộ mặc định (5 × soft/middle/deep × light/dark) từ `tokens/element-seeds.json` (`npm run tokens:elements`): soft = pastel wash, middle = mặc định đồng bộ cường độ (Thổ middle ghim ochre logo), deep = anh em tối hơn rõ trong cùng họ hue; role hài hòa; khóa hue light↔dark; sàn APCA dark. Gate geometry yêu cầu cả minΔE và minΔL cộng L đơn điệu. Tên variant công khai không đổi. Hard gate: `_audit/element-geometry.html`. Rubric: `docs/benchmark-rubric.md`.

8. **Trục Style (`data-cs-style`)** (Th7 2026) — Trục sản phẩm thứ tư; sole pack live **liquid-glass** (vắng ≡ liquid-glass). Hợp đồng: `tokens/styles.css` + hard gate `_audit/style-contract.html`. Pack Style tương lai có thể mở rộng vô hạn, mỗi pack một ngôn ngữ phối màu riêng — chỉ qua owner + checklist Expansion Rule trong `docs/benchmark-rubric.md` (không invent pack tùy tiện).

9. **Identity Lab đã gỡ** (Th7 2026) — Lựa chọn owner: xóa `ui_kits/status-hub/identity-lab.html` và mọi tham chiếu product/docs/Storybook. Demo trục nằm ở Storybook toolbar Theme × Element × Language × Style, Atomic View, và specimen Elements Geometry. Các trục Theme × Element × Language × Style **vẫn là** hạ tầng sản phẩm (template, token, kit trung thành Thổ). Không hồi sinh Lab dưới tên khác nếu chưa có quyết định mới.

Storybook `FullMatrix` bắt buộc khi public primary có ≥1 trong {size enums, variant enums, state keys} (sàn contract ≥28 story). Schema sidecar đã đủ cho template content-hole; template chỉ-axis bỏ qua theo thiết kế. Xem `docs/quality-gates.md` và `docs/storybook.md`.

## 13. Ranh giới Product vs CyberOS

**Lựa chọn owner: hàng rào tường minh** (Th8 2026; assessment area 28)

| Lớp | Ship tới consumer? | Nằm ở đâu | Mục đích |
|-------|---------------------|-------------|---------|
| **Product design system** | Có — `@cyberskill/design`, cây portable (`styles.css`, `tokens/`, `components/`, `templates/`, gates `_audit/`, host Storybook) | root repo (không-`.cyberos`) | Token, component, template, kit, quality gate xác định |
| **CyberOS orchestration** | Không (đã ngừng) | `.cyberos/` | Điều phối agent lịch sử |

Quy tắc:
- Tiêu chí chấp nhận product không được đòi `.cyberos/` có mặt cho consumer hoặc cho `npm` publish.
- Quyết định thay thế của chủ sở hữu (2026-10-08): ngừng dùng CyberOS và hai cổng nghiệm thu của CyberOS. Agent theo `AGENTS.md` và `SKILL.md`. Vẫn cần rà soát trực quan, bằng chứng kiểm thử công nghệ hỗ trợ thủ công và chỉ thị rõ ràng trước khi push/deploy/merge.
- Không chuyển token/component product vào `.cyberos/`; không publish orchestration CyberOS như một phần của gói npm.

## 14. Kiến trúc locale ngoài EN·VI

**Lựa chọn owner: B — spike locale thứ ba (`ja`); trục Language dùng primary subtag BCP-47** (Th8 2026; CDS-I18N-001)

Bản ghi chuẩn: [`docs/decisions/locale-architecture.md`](../decisions/locale-architecture.md) (EN).

- Language vẫn là trục sản phẩm (Theme × Element × Language × Style). Giá trị là primary language subtag (`en` · `vi` · spike `ja`), không phải trục locale lồng, chưa dùng full region tag.
- Registry giữ cặp EN·VI bắt buộc; bảng spike tùy chọn phải khớp key `en` khi có.
- Mặc định tiếng Việt trước không đổi (`lang` trống → `vi`). Plural/ICU và biến thể vùng là follow-on.

## 15. Thuộc tính Theme — density + contrast

**Lựa chọn owner: C — density và contrast một đợt, là thuộc tính Theme** (Th8 2026; CDS-THEME-002)

Bản ghi chuẩn: [`docs/decisions/theme-density-contrast.md`](../decisions/theme-density-contrast.md) (EN).

- `data-cs-density` (`comfortable` | `compact`) và `data-cs-contrast` (`standard` | `high`) là **thuộc tính dưới Theme**, không phải trục danh tính sản phẩm thứ năm.
- Trục sản phẩm vẫn Theme × Element × Language × Style. Sàn APCA body Lc ≥ 75 và touch target ≥44px bất biến dưới compact.

## 16. Parser HTML của Editor — triển khai đang chờ review

**Trạng thái: đã triển khai cục bộ; chưa có human review và final acceptance.**

DOM walk trong trình duyệt và regex trong Node có hành vi khác nhau, để lọt phần
tử con có thể chạy mã bên trong thẻ lạ. Bản sửa dùng parse5 8.0.1 ở cả hai môi
trường rồi tạo fragment mới chỉ với mười một thẻ hiện có và văn bản đã escape.
Mọi thuộc tính, subtree thuộc namespace khác và raw-text đều bị loại bỏ. Đây là
chính sách hẹp cho nội dung HTML, không phải bộ lọc URL, CSS hay thuộc tính.

Parser và dependency có giấy phép MIT được ghim phiên bản, sinh thành module
cục bộ cho consumer không dùng bundler. Chi phí tăng khoảng 153 KB mã parser
minified trước nén HTTP. Kiểm tra
unit và prepublish xác minh provenance và đầu ra sinh. Node không cần dependency
mô phỏng DOM. Dán/kéo thả được lọc trước khi chèn; `unsafeHtml` vẫn chỉ dành cho
nội dung đáng tin cậy.

Bằng chứng gồm test đối kháng Node/trình duyệt, tái hiện lỗi trên source đã audit,
và test seed/dán/kéo thả/bàn phím. Kết quả không thay thế human acceptance và không
khẳng định đã chuyển sang schema editor. Giới hạn contentEditable/execCommand
vẫn được ghi rõ.

## Cách đổi một quyết định

Sửa dòng **Lựa chọn owner** tại đây. Người triển khai nối lại CI và docs liên quan trong cùng một change.
