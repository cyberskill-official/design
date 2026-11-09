# Bộ bản vá upstream — cyberskill-official/design · từ bản chuyển giao v2.5.0

Nhánh đích: `main` (v2.5.0). Có thể áp dụng thành một commit hoặc tách theo các đề mục bên dưới.
Toàn bộ nội dung tại đây đã được kiểm chứng trực tiếp: 50/50 phép kiểm tra mới, 64/64 phép kiểm tra cơ sở, 146/146 trang hiển thị tốt (sáng, tối, tương phản cao).

## 1 · Bản sửa lỗi (triển khai)

| Tệp | Thay đổi | Lý do |
|---|---|---|
| `dist/styles.css` | **Mới.** Toàn bộ chuỗi `styles.css` được làm phẳng thành một tệp (25 bảng kiểu, giữ nguyên thứ tự, đường dẫn `url()` giữ `../fonts`, `../assets`). | Bộ kết xuất thẻ và các môi trường tiêu thụ không đi theo chuỗi `@import` vẫn nhận đủ phông chữ và token ngay ở lần vẽ đầu tiên. Sinh lại sau khi chỉnh sửa `tokens/` hoặc `base/`. |
| `base/a11y.css` | Đã gỡ các quy tắc ghi đè thuộc tính tùy chỉnh `@media (prefers-contrast: more)` (khoảng dòng 140–151). | Mã dư thừa: bộ phân giải phạm vi trong `tokens/elements.css` (`:is(:root, [data-theme], …)`, độ đặc hiệu 0,3,0) đã có độ ưu tiên cao hơn và sinh cùng giá trị. Chú thích tại chỗ trỏ về bộ phân giải đó. |
| `tokens/elements.css` | Quy tắc đảo công tắc `prefers-contrast: more` đổi sang `:root { --_cs-standard: initial; --_cs-high: ; }` thay vì `:root:where(:not([data-cs-contrast]))`. | Kết quả tầng kế thừa không đổi (các quy tắc `[data-cs-contrast]` tường minh cùng độ đặc hiệu 0,1,0 và đứng sau theo thứ tự nguồn); giúp công cụ token ghi nhận các công tắc. |
| `guidelines/guideline-language.js` | Thoát sớm khi đã có `window.CS_GuidelinesLanguage` hoặc không khớp bề mặt hướng dẫn nào (trước đây ném `throw new Error('Unknown guideline language surface')`); ngôn ngữ mặc định là **en** (`?language=vi` cho tiếng Việt). | Mọi công cụ đóng gói thực thi toàn bộ tệp `.js` (bao gồm môi trường chủ DS) trước đây đều làm hỏng các mẫu tài liệu vì lỗi này. |
| `guidelines/atomic-view.html` | Giải cấu trúc `Image: CsImage`, `Comment: CsComment` và dùng tên bí danh trong các hàng Molecule. | Trang trước đây che khuất `window.Image` / `window.Comment`; lệnh `new Image()` từ công cụ bất kỳ đều báo lỗi “Image is not a constructor”. |
| `ui_kits/status-hub/static-locale.js` | Thoát sớm nếu trang không có `[data-preview-language-toggle]` / `[data-preview-language-select]`. | Tập lệnh được đánh giá cả trên những trang không chứa công tắc ngôn ngữ. |
| `components/feedback/feedback.card.html` | `.frame { flex: 1 1 100%; min-width: 0 }` | Khung minh họa toast trước đây bị co về chiều rộng bằng 0 trong hàng flex. |
| `components/logo/logo.card.html` | Chữ thương hiệu trong cụm logo dùng `color: var(--cs-color-text-primary)` (trước đây là brand-umber). | Không nhìn thấy được ở chế độ tối. |
| `templates/_ds-base.canonical.js` (+ toàn bộ `templates/*/ds-base.js`) | Nạp `dist/styles.css`; xử lý `namespace.__errors` bằng `console.warn` thay vì từ chối Promise. | Một hàm phụ trợ lỗi không được làm chặn toàn bộ mẫu tài liệu. Lan truyền sang 85 bản sao bằng bước đồng bộ `scripts/sync-ds-base` sẵn có. |

Tùy chọn cơ học: trỏ các thẻ và bộ giao diện vào `dist/styles.css` để tăng tốc lần vẽ đầu tiên —
`sed -i 's#href="\.\./styles\.css"#href="../dist/styles.css"#; s#href="\.\./\.\./styles\.css"#href="../../dist/styles.css"#' guidelines/*.html components/*/*.card.html ui_kits/*/*.html templates/kitchen-sink.html`

## 2 · Kiểm toán (cung cấp làm bằng chứng phát hành)

| Tệp | Thay đổi |
|---|---|
| `audit/v2.5.0-verification.html`, `audit/verify-v2.5.0.js`, `audit/fixture-v2.5.0.html` | **Mới.** Bảng công cụ Kiểm chứng & Mẫu thử: 7 chiều đánh giá (P0 an toàn nền pha sắc · P1 tương phản 1.4.11 trên 32 phạm vi · P2 tách lớp Umber, đồng bộ trạng thái không hợp lệ của 13 điều khiển, khoảng thoáng dấu tiếng Việt · P3 kính lồng nhau, hợp đồng DESIGN.md/tài sản), 50 phép kiểm tra × v2.5.0 / v2.4.0 / v2.3.1, ma trận tương phản 32×6, báo cáo trường hợp biên, xuất JSON, bộ chuyển mẫu thử (phiên bản × chủ đề × nguyên tố × biến thể). |
| `audit/v2.5.0-verification.json` | **Mới.** Bằng chứng từ lần chạy trực tiếp (Chrome 156, 2026-11-09): v2.5.0 đạt 10.0/10 · 50/50; bộ cơ sở đạt 64/64 (tag v2.4.0 đạt 62/64, v2.3.1 đạt 8/64); sức khỏe hiển thị đạt 146/146. |
| `audit/render-health.html` | **Mới.** Nạp toàn bộ mẫu tài liệu, thẻ và trang UI kit trong các khung ẩn (theo nguyên bản / ép tối / tương phản cao / bất kỳ phạm vi Ngũ Hành nào) và gắn cờ các trang mất kiểu, chưa phân giải, lỗi runtime, trống hoặc thiếu tương phản. |
| `audit/fixture.html`, `audit/verify.js`, `audit/v2.4.0-verification.html` | Bộ nạp ba phiên bản (`?v=current|v240|baseline`), thêm cột kết quả thứ ba và ô tổng điểm, nhãn; đổi `audit/baseline-v2.3.1/` → `audit/baseline-2.3.1/`. Logic kiểm tra giữ nguyên. |
| `audit/baseline-2.4.0/styles.flat.css`, `audit/baseline-2.3.1/styles.flat.css` | **Mới.** Các bản đóng gói phẳng `styles.css` từ tag `v2.4.0` và `v2.3.1` (kho mã không lưu `dist/`). |

## 3 · Không đưa lên upstream (đặc thù môi trường chủ, đã loại khỏi tệp zip)

- Đổi tên tệp/xuất `OverlayManager` → `OverlayProvider` và bí danh `LocaleProvider.useMessages` (quy tắc không gian tên gói của công cụ lưu trữ).
- Không gian tên `window.DesignSystem_52f6e2` trong các thẻ (mẫu tài liệu chấp nhận cả tên này và `CyberSkillDS`).
- `templates/*/support.js` (runtime DC của môi trường chủ), các manifest `_ds_*`, `thumbnail.html`, `SKILL.md`, `github.md`.

## 4 · Các mục theo dõi đã biết (không đề xuất thay đổi)

- Mực trên nền pha sắc ở phạm vi tối mặc định: `.cs-item.is-selected` đạt 10.54:1, `.cs-result__icon` đạt 8.42:1 — mức “> 9:1” trong ghi chú phát hành đúng với mục chọn nhưng không đạt ở biểu tượng; cả hai đều vượt chuẩn AA.
- `.cs-item.is-selected` tô `text-accent` lên **viền**, không phải màu chữ (phép kiểm tra đã được điều chỉnh khớp nguồn).
- Chấm chuyển trang của Carousel chỉ được kiểm chứng cho con trỏ tinh; nhánh con trỏ thô vẽ vùng chạm hướng tâm 44px bằng màu `text-accent`.
