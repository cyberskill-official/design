# Chuyển đổi sang container query (G1 / CDS-RESP-001)

Trạng thái: **đợt 2 đang thực hiện** (2026-08-24) — lớp tương thích + CQ cho lưới kit.  
Chủ sở hữu: người bảo trì design system.  
Tác vụ: `TASK-IMP-025`

## Quyết định

Bắt đầu áp dụng container query **qua cơ chế CSS bật riêng để giữ tương thích**, không viết lại mọi lưới template trong một lượt.

1. Host bật bằng `.cs-cq` (`container-type: inline-size`) **hoặc** quy tắc host tương đương.
2. Phần tử con có thể dùng quy tắc `@container cs (max-width: …)`; các helper: `.cs-cq-stack`, `.cs-cq-cols-{2,3,4}`, `.cs-cq-hide-narrow`.
3. Quy tắc `@media` hiện có tiếp tục là **phương án dự phòng theo viewport** cho đến khi có các lớp bố cục được sinh. CQ và media có thể cùng có hiệu lực — đây là chủ đích.

### Tiến độ

| Ngày | Nội dung |
|---|---|
| 2026-08-08 | CSS tương thích trong `base/responsive.css` (`.cs-cq` + `.cs-cq-stack`) |
| 2026-08-24 | Host ít rủi ro: `.container` của website, `.wrap` của status-hub |
| 2026-08-24 | **Đợt 2 (TASK-IMP-025):** helper `.cs-cq-cols-*` / `.cs-cq-hide-narrow`; lưới trang chủ website + kết quả công việc; deck/lens của status-hub + trường cài đặt + host `.pd` của dự án |

### Ngoại lệ chỉ dùng media (tạm thời giữ lâu dài)

- Việc ẩn `.nav` của website vẫn chỉ dùng `@media` — phần giao diện này gắn với viewport, không phải cột nội dung.
- Lưới `.cs-canvas-desk` của deck / social tiếp tục được miễn media (hình học xuất; xem §5 trong `base/responsive.css`).
- Việc thu gọn `grid-template-columns` inline của template tiếp tục dùng `@media` trong `base/responsive.css` cho đến lượt chuyển CQ dành cho template.

## Nghiệm thu

- Lưới card của kit và lens Status Hub có thể lấy kích thước từ chiều rộng phần tử cha, thay vì chỉ viewport.
- Không hồi quy trên `_audit/responsive-overflow-320.html` hoặc zoom-text-spacing (`npm run test:audit-probe`).
- Ghi mọi ngoại lệ chỉ dùng media dài hạn vào tệp này (phía trên).
