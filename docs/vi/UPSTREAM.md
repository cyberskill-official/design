# Kiểm chứng & đối soát upstream — cyberskill-official/design · v2.5.0

Trạng thái: **Đã hợp nhất vào `main` (`v2.5.0`–`v2.6.0`)**.
Đã kiểm chứng trực tiếp trên trình duyệt: **69/69** phép kiểm tra `D1`–`D10` (**10.0 / 10**), **64/64** phép kiểm tra cơ sở (**10.0 / 10**), và **146/146** trang hiển thị sạch qua các chế độ nguyên bản, ép tối và tương phản cao (`0 watch`).

## 1 · Các bản sửa lỗi đã triển khai

| Tệp | Thay đổi | Lý do |
|---|---|---|
| `dist/styles.css` | Toàn bộ chuỗi `styles.css` được làm phẳng thành một tệp (25 bảng kiểu, giữ nguyên thứ tự, đường dẫn `url()` giữ `../fonts`, `../assets`), được liên kết bởi các thẻ, trang hướng dẫn và UI kit. | Bộ kết xuất thẻ và các môi trường tiêu thụ không đi theo chuỗi `@import` vẫn nhận đủ phông chữ và token ngay ở lần vẽ đầu tiên. Được sinh lại qua `node scripts/flatten-css.mjs` (`npm run build:css`). |
| `base/a11y.css` | Đã gỡ các quy tắc ghi đè thuộc tính tùy chỉnh `@media (prefers-contrast: more)` bị che khuất. | Bộ phân giải phạm vi trong `tokens/elements.css` (`:is(:root, [data-theme], …)`, độ đặc hiệu `0,3,0`) đã có độ ưu tiên cao hơn và sinh cùng giá trị tương phản cao. |
| `tokens/elements.css` | Quy tắc đảo công tắc `prefers-contrast: more` rút gọn thành `:root { --_cs-standard: ; --_cs-high: initial; }`. | Kết quả tầng kế thừa không đổi (các quy tắc `[data-cs-contrast]` tường minh cùng độ đặc hiệu `0,1,0` và đứng sau theo thứ tự nguồn); giúp công cụ token ghi nhận các công tắc. |
| `guidelines/guideline-language.js` | Thoát sớm khi đã có `window.CS_GuidelinesLanguage` hoặc không khớp bề mặt hướng dẫn nào; ngôn ngữ mặc định là **en** (`?language=vi` cho tiếng Việt). | Ngăn các công cụ đóng gói thực thi mọi tệp `.js` ném lỗi trên những bề mặt không phải trang hướng dẫn. |
| `guidelines/atomic-view.html` | Giải cấu trúc `Image: CsImage`, `Comment: CsComment` và dùng tên bí danh trong các hàng Molecule. | Tránh che khuất `window.Image` / `window.Comment` khi công cụ bên ngoài gọi `new Image()`. |
| `ui_kits/status-hub/static-locale.js` | Thoát sớm nếu trang không có `[data-preview-language-toggle]` / `[data-preview-language-select]`. | Tự động bỏ qua an toàn khi tập lệnh được đánh giá trên những trang không chứa công tắc ngôn ngữ. |
| `components/feedback/feedback.card.html` | `.frame { flex: 1 1 100%; min-width: 0 }` | Ngăn khung minh họa toast bị co về chiều rộng bằng 0 trong hàng flex. |
| `components/logo/logo.card.html` | Chữ thương hiệu trong cụm logo dùng `color: var(--cs-color-text-primary)`. | Đảm bảo chữ thương hiệu luôn nhìn thấy rõ ở chế độ tối. |

## 2 · Bộ công cụ kiểm chứng tự động (`_audit/ci/`)

| Tệp | Mục đích |
|---|---|
| `_audit/ci/verify-audit-benchmarks-browser.mjs`, `_audit/ci/lib/benchmark-checks.mjs` | Cổng benchmark trình duyệt trực tiếp tự động cho CI/prepublish (`npm run test:audit-regression`): đạt **10.0 / 10** (`129/129` trên 20 chiều `D1`–`D20`), bộ kiểm tra cơ sở cốt lõi đạt **64/64** (`10.0 / 10`), 192/192 ô trong ma trận tương phản phi văn bản 32×6 (`≥ 3.0:1`), 3/3 màn hình phức hợp Generation-2 và **0 watch**. |
| `_audit/ci/fixtures/benchmark-20d.html`, `_audit/ci/fixtures/benchmark-baseline.html`, `_audit/ci/fixtures/benchmark-gen2.html` | Các mẫu thử DOM hiện hành kiểm chứng 32 phạm vi Theme × Element × Variant, 14 điều khiển biểu mẫu, khoảng thoáng dấu tiếng Việt, container query, quy tắc in ấn/kính và các màn hình doanh nghiệp/AI/di động đa phạm vi trực tiếp trên `/dist/styles.css` và `/styles.css`. |

## 3 · Các mục đặc thù môi trường chủ không đưa vào upstream

- Đổi tên tệp/xuất `OverlayManager` → `OverlayProvider` và bí danh `LocaleProvider.useMessages` (đặc thù quy tắc không gian tên gói của môi trường lưu trữ bên ngoài).
- Không gian tên `window.DesignSystem_52f6e2` trong các thẻ (mẫu tài liệu chấp nhận cả biến toàn cục theo tiền tố môi trường chủ và `CyberSkillDS`).
- Bản sao runtime DC đặc thù môi trường chủ và siêu dữ liệu sandbox (`thumbnail.html`, `github.md`).

## 4 · Ghi chú đã ghi nhận

- Mực trên nền pha sắc ở phạm vi tối mặc định: `.cs-item.is-selected` đạt **10.54:1**, `.cs-result__icon` đạt **8.42:1** — cả hai đều vượt xa ngưỡng WCAG AA (`4.5:1`).
- `.cs-item.is-selected` áp dụng `--cs-color-text-accent` lên `border-color` và giữ màu chữ chính (`#F5EAD9`) theo đúng thiết kế.
- Chấm chuyển trang của Carousel được đo cho con trỏ tinh trên máy tính; dưới `(pointer: coarse)`, `base/a11y.css` thay chấm `::before` bằng vùng chạm hướng tâm `44px` tô màu `--cs-color-text-accent`.
