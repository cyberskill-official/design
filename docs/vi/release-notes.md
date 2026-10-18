# Ghi chú phát hành

Điểm nổi bật sản phẩm cho operator — **không** phải git log và **không** phải `CHANGELOG.md`. Hệ thống thiết kế không maintain file changelog. VERSION **1.7.2** là phiên bản trong repository. Trang này cung cấp nội dung Storybook **Release Notes**; sửa cục bộ chưa xác nhận nội dung đang triển khai tại `design.cyberskill.world`.

## Bản sửa đổi chưa phát hành — đã triển khai cục bộ, chờ nghiệm thu

Các thay đổi này thuộc working tree đang sửa đổi. Đây chưa phải package đã phát hành, site đã triển khai hay release đã nghiệm thu. Các hiện vật pilot FAQ của Practice và DOCX có ngày, hash cụ thể đã được owner nghiệm thu riêng. Bản build thay đổi và phạm vi chưa được review cần kết luận riêng. VERSION vẫn là phiên bản trong repository.

- Các sửa đổi component bao gồm xử lý HTML của Editor, khai báo kiểu và quyền quản lý state, submit an toàn khi dùng IME, đóng overlay lồng nhau và quản lý focus, focus trong slide ẩn của Carousel, mô tả Tooltip và phạm vi theme/ngôn ngữ. Mỗi kết quả chỉ có giá trị trong phạm vi đã kiểm tra; thao tác native và công nghệ hỗ trợ cần bằng chứng riêng.
- Kiểm tra package portable và site công khai bao gồm tài nguyên phụ thuộc, loại trừ file nội bộ và độ mới của bản build. Khai báo token được sinh giữ lại điều kiện áp dụng từ nguồn; file native được sinh chưa chứng minh hiển thị tương đương trên nền tảng native.
- Chi tiết dự án trong Status Hub dùng modal dialog, hỗ trợ mở bằng bàn phím, đóng bằng Escape và trả focus. Sửa kit chưa chứng minh sản phẩm sử dụng đã áp dụng thay đổi.

- Bộ xuất DOCX giữ nền phẳng được hỗ trợ của phần tử cha và ô bảng, giúp chữ trắng trong tiêu đề vẫn đọc được và cho phép ô trắng được khai báo rõ ghi đè nền kế thừa. Bản sửa tài liệu gốc và kiểm tra giới hạn trên ba trình duyệt được giữ làm bằng chứng theo ngày. Gradient, ảnh nền và opacity của cả nhóm nằm ngoài hợp đồng này; cần đối chiếu bản xuất trong ứng dụng đích.
- Bản xuất DOCX giữ tỉ lệ cột grid đã được trình duyệt tính, tránh ép đoạn nội dung rộng vào các ô bằng nhau. Các ca hồi quy trên ba trình duyệt và bản render văn phòng EN/VI theo ngày được giữ làm bằng chứng; cú pháp chưa được tính và độ trung thực của toàn bộ bố cục CSS nằm ngoài hợp đồng này. Việc làm tròn phần lẻ giữ độ rộng cột cuối rất hẹp không âm và bảo toàn tổng độ rộng bảng.
- Pilot FAQ cục bộ hiện tại của Practice dùng package có dấu vân tay chính xác, kèm hồ sơ chuyển đổi và rollback. Bằng chứng theo ngày gồm 36 trường hợp trình duyệt, 18 phạm vi tương phản chữ trên nền phẳng, 12 lần quét axe cho con trỏ thô và bốn lần đo tài nguyên khi tải nguội theo ngưỡng cục bộ đã được phê duyệt. Các kết quả này không xác nhận hiệu năng thực tế, lời đọc của công nghệ hỗ trợ, nghiệm thu hình ảnh hay triển khai production.

- Stephen Cheng phê duyệt chính sách hỗ trợ và bảo trì ngày 14 tháng 10 năm 2026 và được ghi nhận là owner kiêm reviewer (`2026-10-17T02:54:39.000Z`) của cả 123 hồ sơ hỗ trợ (`118` component `stable`, `1` component `preview` là `Editor`, `3` hằng số `stable`, và `1` hằng số `preview` là `EDITOR_SCHEMA`). Trách nhiệm hằng tháng và hằng quý được ghi trong [Quy ước](conventions.md). Việc review hồ sơ hỗ trợ không xác nhận nghiệm thu thị giác sản phẩm, công nghệ hỗ trợ thủ công hay phê duyệt phát hành.

- AlertDialog cho thao tác phá hủy đặt focus ban đầu vào Hủy; hộp xác nhận thông thường đặt focus vào Xác nhận. Thứ tự ưu tiên `tone`/`variant`, callback, đóng bằng Escape và trả focus được giữ lại. Chính sách đã được operator phê duyệt vẫn cần bằng chứng kiểm tra hiện tại trên trình duyệt và công nghệ hỗ trợ.

### Trước khi áp dụng bản sửa đổi

1. Chọn candidate đã được review, ghi source commit và hash package; giữ package hoặc subtree commit trước đó để rollback. Không đoán phiên bản trên registry cho các thay đổi chưa phát hành này.
2. Đối chiếu quyền quản lý state với [hướng dẫn sử dụng và nâng cấp](consuming.md): callback đơn lẻ không làm input hỗ trợ hai chế độ trở thành controlled. Chỉ truyền `value`, `checked`, `pressed` hoặc `open` khi API khai báo, và cập nhật giá trị do parent quản lý khi nhận callback. Native wrapper tiếp tục dùng event callback native.
3. Kiểm tra nội dung Editor đã lưu cùng luồng paste/drop theo ranh giới tin cậy HTML đã khai báo. `unsafeHtml` không cho phép chèn markup thực thi mã. Kiểm tra định dạng được phép trong quy trình soạn thảo thực tế.
4. Kiểm tra overlay lồng nhau, phạm vi ngôn ngữ khi mount trễ hoặc dùng portal, theme light/dark/system, vùng chạm và trạng thái lỗi/loading trong sản phẩm thực tế. Với tài liệu, so sánh nội dung, tài nguyên, phân trang và bản export trong ứng dụng đích. Ghi candidate, môi trường, bằng chứng và kết luận của owner cho cả hai pilot.

Release vẫn chờ nghiệm thu thị giác của con người, kiểm tra native/công nghệ hỗ trợ thủ công bắt buộc, quyết định về nguồn gốc tài nguyên và nghiệm thu hiện vật pilot đã thay đổi; toàn bộ 123 hồ sơ hỗ trợ theo từng export trong `components/lifecycle.json` đã được review (`2026-10-17T02:54:39.000Z`). EN/VI là phạm vi ngôn ngữ mục tiêu; tiếng Nhật vẫn là spike chưa đầy đủ. Ghi chú này không cho phép mở rộng cam kết hỗ trợ, deprecate hay loại bỏ API.

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
