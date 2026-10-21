# Báo cáo contrast — cặp elemental (APCA)

Tạo · quét tại VERSION 1.7.2.

Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

**Doctrine của sweep này:** chữ dùng nền `-bright` hoặc `-tint`, hoặc nền `-strong` đi cặp với `--cs-accent-on-strong`; không bao giờ trên mid-tone `-accent`. Accent chỉ cho bar, border, progress, fill không chữ. Đọc cặp màu và ngưỡng ghi ở từng dòng; `test:strong-text-contrast` kiểm tra riêng chữ thân đã render trên nền strong. (Rule trong `tokens/elements.css` và conventions.)

Pack được generate từ `tokens/element-seeds.json` (thang soft / middle / deep, khóa hue light↔dark). Gate hình học: `_audit/element-geometry.html`.
| Phạm vi | Cặp màu | chữ / nền | Lc | Kết quả |
|---|---|---|---|---|
| root (Thổ mặc định) | text-accent trên trắng (nhãn đậm) | #6E3B0E / #FFFFFF | 90.7 | ✓ |
| root (Thổ mặc định) | text-accent trên tint (nhãn đậm) | #6E3B0E / #FBF4E9 | 84.6 | ✓ |
| root (Thổ mặc định) | accent-bright trên ink (tiêu đề) | #F4BA17 / #45210E | 66.3 | ✓ |
| root (Thổ mặc định) | accent-on trên accent-bright (chữ CTA) | #45210E / #F4BA17 | 66.3 | ✓ |
| root (Thổ mặc định) | accent-bright trên panel tối (nhãn dark) | #F4BA17 / #221710 | 69.2 | ✓ |

**Số cặp không đạt: 0.** Mọi cặp chữ đều đạt Lc ≥ 60.

## Tương phản liên kết của element pack (WCAG AA · chữ thân)

`--cs-color-link` được đánh giá ở ngưỡng **4.5:1** (chữ thân có độ đậm thông thường). `--cs-color-text-accent` vẫn áp dụng ngưỡng APCA Lc ≥ 60 cho nhãn đậm ở trên.

Các dòng dùng màu `--cs-color-link` đã khai báo cho light hoặc dark. Nền trắng, trang tham chiếu, nền nâng tham chiếu và panel tối tham chiếu là các màu cố định; vai trò nền của element dùng `color-mix()` và không được đo trong những dòng này. Kiểm tra nền đã render, tùy chọn và tương tác có phạm vi riêng.
| Phạm vi | Cặp màu | chữ / nền | Tỷ lệ | Kết quả |
|---|---|---|---|---|

**Số cặp liên kết không đạt: 0.**

## Chữ trên nền strong (APCA cho chữ thân)

Ghép `--cs-accent-strong` với `--cs-accent-on-strong`: cả pack light và dark phải đạt ngưỡng chữ thân Lc ≥ 75 (mục tiêu của generator là 78) và WCAG ≥ 4.5:1. Nút primary ở chế độ dark dùng màu chữ đi cặp này. Các màu neo thương hiệu và tám vai trò accent còn lại giữ nguyên giá trị.
| Phạm vi | Chế độ | chữ / nền | Lc | Kết quả |
|---|---|---|---|---|

**Số cặp chữ thân trên nền strong không đạt: 0.** Đây là phép tính tĩnh cho cặp màu đã khai báo; kiểm tra hồi quy browser và kiểm tra template/raster thực tế có phạm vi riêng. Bảng này không chứng minh tương phản khi có độ trong suốt, gradient, chuyển tiếp hay lớp phủ tùy ý.

## Ngưỡng APCA của pack dark (đối chiếu gate)

Các ngưỡng đề xuất trong `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent và bright không phải vai trò chữ thân thông thường dùng được trên mọi nền.
| Pack | bright | accent | on | ink |
|---|---|---|---|---|

