# Độ tương phản tiêu đề mời gọi trong newsletter

Tiêu đề tiếng Việt kế thừa màu chữ sáng cố định đã có trên panel Umber. Ghi đè cũ bằng `--cs-accent-bright` phụ thuộc element có thể thiếu tương phản với nền cố định. Tiếng Anh giữ nguyên màu chữ sáng cũ; không thêm màu literal hay đổi bảng màu.

Chạy `CS_TEST_BROWSER=chromium node _audit/ci/test-newsletter-heading-contrast-browser.mjs`, rồi lặp lại với `firefox` và `webkit`. Kiểm thử duyệt đủ 15 lựa chọn element, hai theme và ba lựa chọn ngôn ngữ đã khai báo; chế độ song ngữ kiểm tra cả hai tiêu đề: 90 ngữ cảnh, 120 mẫu tiêu đề mỗi engine. Màu phải đặc, không bị giảm opacity ở tổ tiên; chữ thực tế 17px/700 phải đạt WCAG ít nhất 4,5 và APCA Lc ít nhất 75. Nạp lại đúng màu nguồn cũ phải tái hiện lỗi tương phản.

`test-results/newsletter-heading/<engine>.json` lưu hash nguồn, kiểm thử, helper trình duyệt/màu, lockfile và mọi byte runtime/CSS/font/ảnh đã yêu cầu. Báo cáo ghi màu, số đo và ca đối chứng nguồn cũ; nguồn thay đổi trong lúc chạy sẽ khiến kiểm thử thất bại. Đây là bằng chứng màu tính toán có phạm vi, không thay thế kiểm chứng pixel nét chữ, thiết bị vật lý hay nghiệm thu khả năng tiếp cận của con người.
