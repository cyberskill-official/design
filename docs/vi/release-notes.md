# Ghi chú phát hành

Điểm nổi bật sản phẩm cho operator — **không** phải git log và **không** phải `CHANGELOG.md`. Hệ thống thiết kế không maintain file changelog. VERSION của checkout nguồn **<!-- cs-source-version:checkout -->2.8.0<!-- /cs-source-version -->** là phiên bản trong repository. Trang này cung cấp nội dung Storybook **Release Notes**; sửa cục bộ chưa xác nhận nội dung đang triển khai tại `design.cyberskill.world`.

## Bản sửa đổi chưa phát hành — đã triển khai cục bộ, chờ nghiệm thu

Các thay đổi này thuộc working tree đang sửa đổi. Đây chưa phải package đã phát hành, site đã triển khai hay release đã nghiệm thu. Các hiện vật pilot FAQ của Practice và DOCX có ngày, hash cụ thể đã được owner nghiệm thu riêng. Bản build thay đổi và phạm vi chưa được review cần kết luận riêng. VERSION vẫn là phiên bản trong repository.

- Các sửa đổi component bao gồm xử lý HTML của Editor, khai báo kiểu và quyền quản lý state, submit an toàn khi dùng IME, đóng overlay lồng nhau và quản lý focus, focus trong slide ẩn của Carousel, mô tả Tooltip và phạm vi theme/ngôn ngữ. Mỗi kết quả chỉ có giá trị trong phạm vi đã kiểm tra; thao tác native và công nghệ hỗ trợ cần bằng chứng riêng.
- Kiểm tra package portable và site công khai bao gồm tài nguyên phụ thuộc, loại trừ file nội bộ và độ mới của bản build. Khai báo token được sinh giữ lại điều kiện áp dụng từ nguồn; file native được sinh chưa chứng minh hiển thị tương đương trên nền tảng native.
- Chi tiết dự án trong Status Hub dùng modal dialog, hỗ trợ mở bằng bàn phím, đóng bằng Escape và trả focus. Sửa kit chưa chứng minh sản phẩm sử dụng đã áp dụng thay đổi.

- Bộ xuất DOCX giữ nền phẳng được hỗ trợ của phần tử cha và ô bảng, giúp chữ trắng trong tiêu đề vẫn đọc được và cho phép ô trắng được khai báo rõ ghi đè nền kế thừa. Bản sửa tài liệu gốc và kiểm tra giới hạn trên ba trình duyệt được giữ làm bằng chứng theo ngày. Gradient, ảnh nền và opacity của cả nhóm nằm ngoài hợp đồng này; cần đối chiếu bản xuất trong ứng dụng đích.
- Bản xuất DOCX giữ tỉ lệ cột grid đã được trình duyệt tính, tránh ép đoạn nội dung rộng vào các ô bằng nhau. Các ca hồi quy trên ba trình duyệt và bản render văn phòng EN/VI theo ngày được giữ làm bằng chứng; cú pháp chưa được tính và độ trung thực của toàn bộ bố cục CSS nằm ngoài hợp đồng này. Việc làm tròn phần lẻ giữ độ rộng cột cuối rất hẹp không âm và bảo toàn tổng độ rộng bảng.
- Pilot FAQ cục bộ hiện tại của Practice dùng package có dấu vân tay chính xác, kèm hồ sơ chuyển đổi và rollback. Bằng chứng theo ngày gồm 36 trường hợp trình duyệt, 18 phạm vi tương phản chữ trên nền phẳng, 12 lần quét axe cho con trỏ thô và bốn lần đo tài nguyên khi tải nguội theo ngưỡng cục bộ đã được phê duyệt. Các kết quả này không xác nhận hiệu năng thực tế, lời đọc của công nghệ hỗ trợ, nghiệm thu hình ảnh hay triển khai production.

- Hồ sơ lịch sử: Stephen Cheng phê duyệt chính sách hỗ trợ ngày 14 tháng 10 năm 2026; hồ sơ ngày 17 tháng 10 ghi nhận 123 export đã được review. Review có ngày này không phê duyệt bằng chứng đã thay đổi. Hash nguồn và trạng thái hiện tại trong `components/lifecycle.json` quyết định yêu cầu review lại; nghiệm thu thị giác, công nghệ hỗ trợ thủ công và phát hành vẫn tách biệt.

- AlertDialog cho thao tác phá hủy đặt focus ban đầu vào Hủy; hộp xác nhận thông thường đặt focus vào Xác nhận. Thứ tự ưu tiên `tone`/`variant`, callback, đóng bằng Escape và trả focus được giữ lại. Chính sách đã được operator phê duyệt vẫn cần bằng chứng kiểm tra hiện tại trên trình duyệt và công nghệ hỗ trợ.
- Các control chọn dạng popup tùy chỉnh (`Combobox`, `DatePicker`, `TimePicker`, `ColorPicker`, `Cascader` và `TreeSelect`) hỗ trợ `"aria-labelledby"` trên cả nút mở và vùng popup để liên kết trực tiếp với nhãn trường bên ngoài mà không lặp chuỗi `aria-label`.
- Khắc phục hài hòa thị giác và độ tương phản trước `2.9.0` trên nền tảng token, component, biểu mẫu, thẻ hướng dẫn, UI kit và bộ xuất tài liệu:
  - **Phân cấp trung tính ấm & Ngũ Hành (`tokens/colors.css`, `tokens/elevation.css`, `tokens/elements.css`, `scripts/generate-element-packs.mjs`, `scripts/lib/theme-resolver.mjs`):** Hiệu chỉnh `--cs-color-text-muted` ở Light Mode sang `#5E4436` (`APCA Lc 84.3` trên `#FFFDF8`) tách bạch rõ với chữ chính Umber `#45210E` (`Lc 100.3`), đưa `--cs-accent-strong` hành Thổ ở Light Mode (`#A4631E` studio/sand, `#7D480C` clay) về sắc độ hổ phách ấm `62°`, đồng bộ bóng đổ `md`/`xl` về sắc Umber `#45210E`, đồng thời nâng màu chữ phụ của `CodeBlock` (`--cs-code-muted`), `Terminal` (`--cs-term-muted`) và hằng số mẫu native lên `#E9D6C2` (`APCA Lc >= 81.2`) kèm `color-scheme: dark`.
  - **Tách bạch gói phong cách, viền form picker, khoảng hở chạm & tương phản điều hướng (`base/glass.css`, `base/forms.css`, `base/controls.css`, `base/navigation.css`, `base/ai.css`, `base/data.css`, `tokens/viewer.html`, `ui_kits/`):** Tắt hoàn toàn độ mờ `backdrop-filter` và áp dụng nền giấy phẳng dưới `[data-cs-style="matte-paper"]` trên các lớp `.cs-glass-*` cùng thanh điều hướng/khung soạn thảo UI kit, đồng bộ viền nghỉ của `Select`, `NativeSelect`, `DatePicker`, `TimePicker`, `ColorPicker`, `Cascader`, `TreeSelect` và `PromptInput` về `--cs-component-textfield-border-default` (`2.33:1` ở Light Mode), nâng dấu phân cách `/` của `Breadcrumb` (`.cs-breadcrumb__sep`) lên `--cs-color-text-muted` (`APCA Lc >= 77` ở cả Light và Dark), và bổ sung khoảng đệm cuối `20px` cho `#tablePanel` trong `tokens/viewer.html` để các nút sao chép `44px` không bị thanh cuộn ngang che khuất trên khung nhìn hẹp.
  - **Thẻ hướng dẫn/specimen Dark Mode, email CTA/VML & ngắt dòng `<br>` trong DOCX (`guidelines/*.html`, `components/data/data.card.html`, `templates/email/Email-VN-standalone.html`, `templates/email-safe/email-*.html`, `templates/_vendor/doc-export.js`):** Thay các mã hex trắng/Umber cố định, chữ vàng Ochre dưới ngưỡng ở Dark Mode và nền `--cs-accent-tint` gốc trung tính trong thẻ hướng dẫn/component sang token thích ứng chủ đề, đồng bộ nút CTA của `Email-VN-standalone.html` (`--cs-accent-strong` / `--cs-accent-on-strong`) cùng màu chữ `.muted` của `7` mẫu VML `email-safe` ở Light (`#5E4436`) và Dark (`#E9D6C2`) vượt ngưỡng `APCA Lc >= 75`, và tuần tự hóa thẻ `<br>` thành `<w:r><w:br/></w:r>` chuẩn OpenXML khi xuất DOCX. Kiểm tra tự động và ảnh chuẩn Linux `909×540` không thay thế nghiệm thu thị giác của con người hoặc kiểm tra công nghệ hỗ trợ thủ công.

### Trước khi áp dụng bản sửa đổi

1. Chọn candidate đã được review, ghi source commit và hash package; giữ package hoặc subtree commit trước đó để rollback. Không đoán phiên bản trên registry cho các thay đổi chưa phát hành này.
2. Đối chiếu quyền quản lý state với [hướng dẫn sử dụng và nâng cấp](consuming.md): callback đơn lẻ không làm input hỗ trợ hai chế độ trở thành controlled. Chỉ truyền `value`, `checked`, `pressed` hoặc `open` khi API khai báo, và cập nhật giá trị do parent quản lý khi nhận callback. Native wrapper tiếp tục dùng event callback native.
3. Kiểm tra nội dung Editor đã lưu cùng luồng paste/drop theo ranh giới tin cậy HTML đã khai báo. `unsafeHtml` không cho phép chèn markup thực thi mã. Kiểm tra định dạng được phép trong quy trình soạn thảo thực tế.
4. Kiểm tra overlay lồng nhau, phạm vi ngôn ngữ khi mount trễ hoặc dùng portal, theme light/dark/system, vùng chạm và trạng thái lỗi/loading trong sản phẩm thực tế. Với tài liệu, so sánh nội dung, tài nguyên, phân trang và bản export trong ứng dụng đích. Ghi candidate, môi trường, bằng chứng và kết luận của owner cho cả hai pilot.

Release vẫn chờ nghiệm thu thị giác của con người, kiểm tra native/công nghệ hỗ trợ thủ công bắt buộc, quyết định về nguồn gốc tài nguyên và nghiệm thu hiện vật pilot đã thay đổi. Bằng chứng hỗ trợ đã thay đổi phải được review lại trong `components/lifecycle.json`. EN/VI là phạm vi ngôn ngữ mục tiêu; tiếng Nhật vẫn là spike chưa đầy đủ. Ghi chú này không cho phép mở rộng cam kết hỗ trợ, deprecate hay loại bỏ API.

## Release — `@cyberskill/design@2.8.0`

Phiên bản minor ổn định đã công bố được ghi nhận trong `_audit/ci/fixtures/npm-published-release.json` (quan sát lúc `2026-11-10T13:04:18.764Z`, tag `v2.8.0` tại commit `5e7fdc7fc0ca49844d476a101205c8893591cae2`).

- **Mẫu giao diện Benchmark AI Gen-2 & Bí danh Token phòng thủ (`tokens/variables.css`, `tokens/theme-dark.css`, `base/glass.css`, `base/shell.css`, `base/layout.css`, `base/controls.css`, `base/components.css`, `base/data.css`, `base/ai.css`, `DESIGN.md`):** Bổ sung các biến bí danh chống suy đoán tên token (`--cs-glass-card-bg`, `--cs-glass-card-border`, `--cs-color-bg-elevated`, `--cs-color-bg-glass`, `--cs-shadow-glow`), tự động thu gọn `.cs-sidebar` trên mobile và tự giãn chiều rộng `.cs-theme-toggle` dạng viên thuốc, cùng các lớp `.cs-app-shell--topnav`, `.cs-grid-kpi`, `.cs-canvas`, `.cs-SplitPane`, `.cs-code-editor`, `.cs-checklist`, `.cs-file-dropzone`, `.cs-photo-grid`, `.cs-signature-pad`, `.cs-bottom-bar`, `.cs-sync-banner`, `.cs-table-toolbar` và `.cs-status-dot--live`.
- **Bộ Benchmark trình duyệt trực tiếp 20 chiều & Dọn dẹp hồ sơ kiểm toán (`_audit/ci/verify-audit-benchmarks-browser.mjs`, `_audit/ci/lib/benchmark-checks.mjs`, `_audit/ci/fixtures/benchmark-20d.html`, `_audit/ci/fixtures/benchmark-gen2.html`):** Mở rộng bộ kiểm toán trình duyệt tự động lên **20 chiều (`129/129` phép kiểm tra đạt `10.0 / 10`, `0 watch` + `64/64` phép kiểm tra cơ sở = `193/193` khẳng định trình duyệt trực tiếp)** kèm 3 màn hình stress-test phức tạp thế hệ 2, đồng thời loại bỏ hoàn toàn các bản chụp lịch sử trong `audit/` và `_audit/remediation/`.
- **Đường ống triển khai trực tiếp lên GitHub Pages (`.github/workflows/pages.yml`, `scripts/vercel-static-output.mjs`, `docs/vi/deploy.md`):** Đóng gói `.nojekyll` và `CNAME` (`design.cyberskill.world`) vào `.vercel-static/` và tự động triển khai webroot tĩnh lên GitHub Pages qua `actions/upload-pages-artifact` và `actions/deploy-pages`.

```bash
npm install @cyberskill/design@2.8.0
```

## Release — `@cyberskill/design@2.7.0`

Phiên bản minor ổn định đã công bố được ghi nhận trong `_audit/ci/fixtures/npm-published-release.json` (quan sát lúc `2026-11-09T20:01:08.112Z`, tag `v2.7.0` tại commit `d951d7d74077913d5d957f75c9d50d873b9dd937`).

- **Bộ Benchmark trình duyệt trực tiếp 16 chiều (`_audit/ci/verify-audit-benchmarks-browser.mjs`, `_audit/ci/lib/benchmark-checks.mjs`, `_audit/ci/fixtures/benchmark-20d.html`, `_audit/ci/fixtures/benchmark-gen2.html`):** Mở rộng bộ kiểm toán trình duyệt tự động lên **16 chiều (`105/105` phép kiểm tra đạt `10.0 / 10`, `0 watch` + `64/64` phép kiểm tra cơ sở = `169/169` khẳng định trình duyệt trực tiếp)** với `D11` (tương phản văn bản thân bài APCA $L_c \ge 75$ & nhịp điệu chữ), `D12` (thang cao độ z-index 7 tầng `--cs-depth-*` & cô lập cuộn lớp phủ), `D13` (container query đáp ứng, vùng an toàn & bố cục lại bảng), `D14` (thuộc tính logic RTL, trạng thái vô hiệu/chỉ đọc & tắt nhấp nháy khung xương khi giảm chuyển động), `D15` (`@media print`, `@media (forced-colors: active)` WHCM & bất biến thương hiệu) và `D16` (tính trực giao 5 trục `Theme × Element × Density × Contrast × Style` & vật lý cao độ bề mặt).
- **Bộ kiểm thử trả focus & bảo vệ bộ gõ tiếng Việt IME trên 3 engine (`components/forms/TreeSelect.jsx`, `components/forms/Cascader.jsx`, `components/forms/ColorPicker.jsx`, `components/forms/SearchField.jsx`, `_audit/ci/test-picker-focus-ime-browser.mjs`):** Đảm bảo trả focus về nút kích hoạt trên Chromium, Firefox và WebKit khi đóng `DatePicker`, `TreeSelect`, `Cascader`, `ColorPicker` hoặc xóa nhanh `SearchField`, đồng thời xác minh chốt chặn phím Enter khi đang gõ tổ hợp dấu tiếng Việt (`isComposing`) trên `Combobox`, `TagInput`, `Mentions`, `PromptInput` và `SearchField`.
- **Kiểm kê máy trạng thái & Xác thực nhanh `fast-gates` qua `act` (`scripts/generate-state-inventory.mjs`, `_audit/state-machines.*`, `scripts/run-act-ci.mjs`, `scripts/verify-ci-checks.mjs`, `.github/workflows/design-system-gates.yml`):** Bổ sung bộ kiểm kê máy trạng thái từ mã nguồn cùng kiểm thử chuyển tiếp `InlineEdit` trên 3 trình duyệt và mở rộng biên nhận `act` gắn với commit/tree sang `ci/act/fast-gates`.

```bash
npm install @cyberskill/design@2.7.0
```

## Release — `@cyberskill/design@2.6.0`

Phiên bản minor ổn định đã công bố được ghi nhận trong `_audit/ci/fixtures/npm-published-release.json` (quan sát lúc `2026-11-09T17:39:34.494Z`, tag `v2.6.0` tại commit `48ed4be40e83bc6d5e2763b03111b07aa2c26df4`).

- **Benchmark 10 chiều & Cổng chống thoái lui tự động trên CI (`_audit/ci/verify-audit-benchmarks-browser.mjs`, `_audit/ci/lib/benchmark-checks.mjs`, `_audit/ci/fixtures/benchmark-baseline.html`):** Mở rộng bộ kiểm toán trình duyệt trực tiếp lên **10 chiều (`69/69` phép kiểm tra đạt `10.0 / 10`, `0 watch`)** với `D8` (Vùng chạm ≥ 44px, Bảo toàn vòng lấy nét, Chế độ tương phản cao), `D9` (Đầy đủ token 5 Hành × 2 Chủ đề × 3 Biến thể, Toàn vẹn trang in A4, Giảm chuyển động), và `D10` (Nhận diện thương hiệu, Đầy đủ song ngữ EN/VI, Độ thuần khiết token), được cưỡng chế trong CI và `prepublishOnly` qua `npm run test:audit-regression`.
- **Xuất CSS phẳng một tệp & Hướng dẫn logo nội tuyến (`package.json`, `scripts/flatten-css.mjs`, `DESIGN.md`, `docs/vi/entrypoints/DESIGN.md`):** Mở `"./dist/styles.css": "./dist/styles.css"` trong `package.json#exports`, tự động đóng dấu `VERSION` vào tiêu đề `dist/styles.css`, và quy định mẫu logo `<svg viewBox="0 0 64 64">` nội tuyến cho môi trường một tệp và cloud sandbox.
- **Xác thực nhanh shard `act` gắn với commit (`.github/workflows/design-system-gates.yml`, `scripts/run-act-ci.mjs`, `scripts/verify-ci-checks.mjs`):** Kiểm chứng biên nhận `ci/act/unit-tests (1/4..4/4)` gắn với commit trước các bước cài đặt phụ thuộc và trình duyệt nặng, rút ngắn thời gian chạy `unit-tests` trên GitHub Actions xuống ~15 giây khi đã xác minh cục bộ qua `act`.

```bash
npm install @cyberskill/design@2.6.0
```

## Release — `@cyberskill/design@2.5.0`

Phiên bản minor ổn định đã công bố được ghi nhận trong `_audit/ci/fixtures/npm-published-release.json` (quan sát lúc `2026-11-09T06:04:11.249Z`, tag `v2.5.0` tại commit `6e7fe3c158b122c8ca19b8253eb06460c7f2f919`). Các tag kho mã `v2.3.1` và `v2.4.0` đi trước `v2.5.0`.

- **Đồng bộ chủ đề lồng nhau & Liquid Glass (`base/glass.css`, `tokens/theme-dark.css`):** Tính lại các token `--_cs-light` / `--_cs-dark`, `--_cs-surface-scrim` và toàn bộ tám chất liệu `--cs-glass-*-{bg,border}` bên trong các khối `[data-theme]` lồng nhau.
- **Tương phản 32 scope & an toàn nền Dark mặc định (`base/collections.css`, `base/controls.css`, `base/feedback.css`, `base/shell.css`, `base/ai.css`):** Thay nền `--cs-accent-tint` thiếu scope ở Dark Mode bằng `color-mix(in oklab, var(--cs-accent) 18%, var(--cs-color-surface-panel))`, nâng các chỉ báo phi văn bản lên `--cs-color-text-accent` (`WCAG 1.4.11 ≥ 3:1` trên toàn bộ 32 scope) và bổ sung viền nội tiếp cho bề mặt Umber trên nền tối.
- **Đồng bộ trạng thái lỗi 13 form control & chiều cao dòng tiếng Việt (`base/components.css`, `base/controls.css`, `base/typography.css`, `base/data.css`):** Thống nhất viền lỗi `.is-invalid` / `[aria-invalid="true"]` trên cả 13 loại form control và áp dụng `:lang(vi) { line-height: 1.22; }` cho `.cs-display` cùng `.cs-stat__value`.

```bash
npm install @cyberskill/design@2.5.0
```

## Release — `@cyberskill/design@2.3.0`

Phiên bản minor ổn định đã công bố được ghi nhận trong `_audit/ci/fixtures/npm-published-release.json` (quan sát lúc `2026-11-06T03:56:00.000Z`, tag `v2.3.0` tại commit `1f873e812e9a02ec68bbc49c3b7ae3248a165ac9`).

- **`DESIGN.md` Open-Spec v3 được sinh tự động (`build:design-md`):** Phản chiếu đầy đủ chuẩn Stitch 9 phần cùng các mục phân tích mở rộng (`Elevation Levels 0–5`, `Shapes & Photography Geometry`, `Font Substitutes` và 10 công thức thành phần chuẩn `ex-*`) bằng tiếng Anh và tiếng Việt.
- **Tiện ích luân phiên bề mặt & văn bản biên tập:** Bổ sung `.cs-card--raised` và `.cs-card--featured` trong `base/data.css`, `.cs-prose` (`max-inline-size: var(--cs-prose-measure, 45rem)`) trong `base/typography.css`, cùng bóng đổ/màn chắn thích ứng chủ đề trong `base/shell.css` và `base/controls.css`.
- **Biên nhận kiểm chứng tự động `AT-01..AT-16` (`scripts/run-automated-at-matrix.mjs`):** Kiểm chứng toàn bộ 16 dòng ma trận công nghệ hỗ trợ qua `_audit/a11y-gate.html`, `_audit/component-behavior-test.html` và `_audit/at-kit-probe.html` (`passed=16, pending=0`).

```bash
npm install @cyberskill/design@2.3.0
```

## Release — `@cyberskill/design@2.0.0`

Phiên bản major ổn định đã công bố được ghi nhận trong `_audit/ci/fixtures/npm-published-release.json` (quan sát lúc `2026-10-30T16:59:22.000Z`, tag `v2.0.0` tại commit `a159211acf8338cfdc4df18e9fa92c461071e00f`). Các tag kho mã tiếp theo `v2.1.0` và `v2.2.0` tiếp nối nhánh nguồn 2.x.

- **Điểm vào ESM biên dịch mặc định (`compiled-default-entry`):** `@cyberskill/design` trỏ tới ESM đã biên dịch (`dist/esm/_esm/react.mjs`) dùng peer React; JSX thô vẫn truy cập được qua `@cyberskill/design/source`.
- **Hợp đồng bàn phím Menu theo APG (`apg-menu-keyboard`):** `Menu` áp dụng điều hướng phím mũi tên và đóng khi nhấn Tab theo WAI-ARIA Authoring Practices.
- **Floating panel dùng portal mặc định (`floating-default-portal`):** Các bảng nổi mặc định gắn vào `document.body` với tùy chọn inline rõ ràng và tự động lùi về inline trong `<form>` / `<fieldset>` gốc.
- **SegmentedControl mặc định radio & kiểm tra bí danh (`segmented-radio-default`, `segmented-role-alias-validation`):** `SegmentedControl` mặc định dùng ngữ nghĩa `radiogroup` cho chọn giá trị (`mode="tabs"` cho bảng tab do caller render) và kiểm tra bí danh `tablist` / `radiogroup` đã deprecate, đồng thời từ chối giá trị `role` tùy ý không được hỗ trợ.

```bash
npm install @cyberskill/design@2.0.0
```

## Release — `@cyberskill/design@1.7.2`

Đính chính định danh (ngày 21 tháng 10 năm 2026): npm phát hành package này lúc **2026-08-13T08:50:39.579Z**. Annotated tag từ remote `v1.7.2` trỏ tới commit `792b503e71c115d76f26eb4721cc4b04a9b6e6c3`, khớp với `gitHead` do registry công bố. Trang GitHub release ghi thời điểm xuất bản **2026-10-19T13:32:00Z**; ngày của trang này không thay đổi nội dung package. Đây là metadata định danh được quan sát, chưa phải xác minh nguồn gốc bằng mật mã độc lập.

Các sửa đổi tháng 10 bên dưới thuộc công việc repository sau đó, chưa phát hành; không mô tả package tháng 8. Owner đã chọn chuẩn bị **`2.0.0-alpha.0`**; tại thời điểm đính chính, phiên bản này chưa được phát hành hay gắn tag, và vẫn phải qua các gate review nguồn, tương thích và nghiệm thu.

Tóm tắt tháng 10 đã được thay thế, giữ lại dưới dạng trích dẫn lịch sử:

> Hoàn tất kiểm toán độc lập năm miền, review đầy đủ cả 123 hồ sơ hỗ trợ component/hằng số trong `components/lifecycle.json`, đồng bộ baseline hình ảnh Linux (`_audit/baselines/`), bổ sung `"aria-labelledby"` cho các bộ chọn biểu mẫu tùy chỉnh và chạy song song kiểm thử CI trên ba trình duyệt Chromium, Firefox và WebKit.

```bash
npm install @cyberskill/design@1.7.2
```

## Release — `@cyberskill/design@1.3.10`

Docs: một VERSION duy nhất trên surface operator (không lead-in “pin” / LAUNCH kép). Các mục Release / Patch / LAUNCH bên dưới giữ làm archive có ngày.

## Release — `@cyberskill/design@1.3.9`

Docs operator xuất bản qua sidebar Storybook **Docs** (doctrine, bộ tracked EN·VI, gate coverage + link docs↔Storybook). Gate HTML trên Status live chỉ kiểm **surface đã publish**; twin Node vẫn chứng minh nguồn CSF/MDX. Story Docs từng trang truyền `?embed=1` để ẩn chrome Documentation Library trong Storybook (`/docs/viewer.html` standalone giữ nguyên).

```bash
npm install @cyberskill/design@1.3.9
```

## Release — `@cyberskill/design@1.3.0`

Assessment remediation Phases 0–5 và đóng gap (TASK-IMP-001…021): contrast, pack-contract, overlay manager, gate zoom/CQ, và polish Storybook / template liên quan.

## Release — `@cyberskill/design@1.2.0`

`VERSION` theo dõi phiên bản phát hành của repository. Continuity curated vẫn ở trang này — vẫn **không** có root `CHANGELOG.md`.

## Patch — `@cyberskill/design@1.1.1`

Republish lockstep sau cut LAUNCH: regen natives / provenance / `_ds_bundle.js` để registry khớp tip, và bỏ `CHANGELOG.md` gốc bị cấm. Cài:

```bash
npm install @cyberskill/design@1.1.1
```

## LAUNCH — `@cyberskill/design@1.1.0`

Cut **LAUNCH** của owner. `VERSION` / `package.json` và mọi version stamp chuyển từ pin pre-LAUNCH **1.0.0** sang **1.1.0**. Publish qua **npm Trusted Publishing (OIDC)** trên tag `v1.1.0` (hoặc `workflow_dispatch`). Publishing access trên npmjs **disallow tokens**. Soft-skip install registry của npm-hello là trung thực cho tới khi **1.1.0** live trên registry — soft-skip ≠ đã publish.

Dùng đã duyệt cho sản phẩm portfolio CyberSkill vẫn tại **`docs/consumer-grant.md`** (+ VI). Package vẫn **UNLICENSED**. Đường consumer browser đầu tiên: `examples/npm-hello/` (Lumi · Hỏa · plasma) — xem `docs/consuming.md`.

```bash
npm install @cyberskill/design@1.1.0
```

## Storybook tại gốc domain

`design.cyberskill.world/` là site sản phẩm Storybook đầy đủ. Docs, Foundations, Components, Release Notes và Status nằm trong một sidebar. Đường legacy `/dashboard` và `/playground` redirect về `/`.

Consumer portable: `styles.css`, `_ds_bundle.js`, bundler-native `_esm/react.mjs` (mặc định `exports["."]`; React peer), và browser legacy `_esm/cs.mjs` (`@cyberskill/design/legacy`). Storybook chỉ là tooling host.

## Quality gate trên Status

Story **Status** nhúng bảng gate nhanh (`_audit/run.html`). Gate cứng fail board khi hỏng; hàng advisory được gắn nhãn rõ và không lật aggregate pass. Mở Status lần đầu sẽ auto-run; dùng **Re-run** khi cần chạy lại.

## Docs và template song ngữ

Bộ tài liệu operator được theo dõi có cặp EN·VI dưới `docs/` / `docs/vi/`. Khả năng và giới hạn ngôn ngữ được khai báo theo từng template. Chuỗi component đã đăng ký tuân theo hợp đồng locale; nội dung do consumer cung cấp cần được dịch và review riêng.

## Foundations và thư viện CSF

Toolbar Theme × Element × Language × Style mirror template production (Theme gồm **system** cho OS `prefers-color-scheme`). Mọi primary công khai ship Default story cộng control matrix trung thực; FullMatrix cover mọi qualifier ≥1-axis. Axe smoke quét mọi primary công khai. Pack Style duy nhất là **liquid-glass**. Foundations cover màu, typography, spacing, elevation, motion, và 15 pack element Ngũ Hành.

## Token và mirror native

Token CSS và các đầu ra JSON/DTCG/native được sinh có giới hạn biểu diễn khác nhau. Xem [quy ước](conventions.md) về điều kiện từ nguồn và phạm vi export. Kiểm tra đầu ra được sinh không chứng minh parity của toolchain hay hiển thị native. Cần đo contrast trên bề mặt và trạng thái thực tế; token matrix đạt không chứng nhận mọi cách kết hợp.

## Những gì chúng ta không bao giờ ship

- Root **`CHANGELOG.md`** (cấm bởi doctrine và docs-consistency)
- Storybook như dependency consumer
