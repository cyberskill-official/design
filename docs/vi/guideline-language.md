# Chế độ xem hướng dẫn ưu tiên tiếng Việt

Hướng dẫn được biên soạn trong `guidelines/` mở bằng tiếng Việt. Mỗi hướng dẫn cũng có chế độ tiếng Anh gốc qua `?language=en`; `?lang=en` là bí danh. Đường dẫn trang và bookmark `#fragment` hiện có vẫn hợp lệ. Dùng `?language=vi` để chọn tiếng Việt rõ ràng. Trang `rtl-preview.html` tiếng Ả Rập là phép kiểm tra hai chiều có chủ ý, giữ nguyên nội dung và hướng chữ Ả Rập.

Trục Ngôn ngữ đổi văn bản hướng dẫn và mô tả ảnh hỗ trợ tiếp cận thực tế, không chỉ đổi `lang` của tài liệu. Atomic View áp dụng cùng lựa chọn cho giao diện hướng dẫn và hướng dẫn chuyển động được nhúng. Ví dụ component giữ hành vi ngôn ngữ đã khai báo: ví dụ dùng tham số ngôn ngữ theo trục, ví dụ tiếng Anh cố định có phạm vi tiếng Anh, còn nhãn tiếng Việt rõ ràng vẫn là tiếng Việt bên trong các ví dụ đó. Phép thử component tiếng Nhật được giữ lại; văn xuôi hướng dẫn chỉ hỗ trợ tiếng Việt và tiếng Anh.

Tên thương hiệu và tính năng chính thức, slogan song ngữ, export API, tên token, định danh biến thể Ngũ Hành, mã, mẫu số và ví dụ dạy ngôn ngữ được phân loại rõ ràng giữ nguyên cách viết trong nguồn. Đây là ngoại lệ được ghi nhận, không phải đoạn hướng dẫn bỏ sót dịch. Các trục hành/chế độ nền/phong cách/mật độ/tương phản, JSX component, binding danh mục, ví dụ, CSS và ID bookmark hiện có vẫn là nguồn có thẩm quyền.

## Biên soạn và tạo bản chiếu

Bản tiếng Anh giữ trong HTML và JSX để chế độ tiếng Anh bảo toàn nội dung gốc. Đầu vào chỉ có trong kho nguồn `scripts/guideline-translations.json` (không phát hành trong webroot) sở hữu văn xuôi tiếng Việt, mô tả hỗ trợ tiếp cận, phân loại nội dung giữ nguyên và ranh giới ví dụ Atomic suy ra từ nguồn. Mục tĩnh gắn với nút văn bản hiện hữu chính xác hoặc thuộc tính `alt`, `title`, `aria-label`, `placeholder` đã khai báo. Bản dịch chỉ dùng giá trị văn bản, không thể chèn HTML, URL, trình xử lý sự kiện, prop component hay thuộc tính tùy ý.

Chạy `node scripts/generate-guideline-languages.mjs` sau khi sửa contract nguồn, rồi `node scripts/generate-guideline-languages.mjs --check` để kiểm tra freshness chỉ đọc. Generator xác minh đủ thành viên hướng dẫn/phép kiểm tra, văn bản và quyền sở hữu thuộc tính, thành viên ví dụ được biên soạn, JSX không đổi và hash phép thử Ả Rập trước khi ghi đầu ra. Đoạn mới hoặc thay đổi cần bản dịch rõ ràng hoặc phân loại nguồn đã rà soát. Metadata lạ, khóa prototype, accessor, Unicode sai, thiếu chủ sở hữu và đích mở rộng bị từ chối an toàn.

`guidelines/guideline-language.js` được tạo là script ngoài cùng origin. Biên dịch JSX và hash CSP chính xác hiện có của site vẫn có hiệu lực; tính năng này không thêm handler nội tuyến, thực thi động hay chèn HTML. `CS_GuidelinesLanguage.setLanguage('vi' | 'en')` đổi chế độ hướng dẫn đã mount. Locale văn xuôi không hỗ trợ bị từ chối. Locale rõ ràng của component vẫn theo contract riêng.

Chính sách màu chỉ cho nguồn trong `scripts/guideline-hex-policy.json` ghi nhận chính xác literal minh họa có chủ ý, kể cả phép thử Ả Rập. Chạy `node scripts/check-guideline-hex-policy.mjs`. Context CSS/HTML và literal JS/JSX có tên được phân tích để từ chối màu mới, thay đổi chủ sở hữu/số lần và mục đã lỗi thời; HTML entity dạng số không phải literal màu. Cách này giữ màu neo chính thức và giá trị tham chiếu minh họa cố định mà không miễn trừ toàn bộ file.

Đợt triển khai song ngữ cũng thêm tiêu đề tài liệu còn thiếu và sửa tương phản/ngữ nghĩa cụ thể trong hướng dẫn: mẫu trạng thái vô hiệu hóa dùng phần tử native bị disabled thật, nhãn trên nền mạnh dùng màu chữ đi cặp, văn bản cấm phối và hướng dẫn xem trước giữ độ dễ đọc, select native trên thanh công cụ Atomic có chiều cao thực 44px khi dùng con trỏ thô. Các thay đổi giữ nguyên JSX và handler của ví dụ component.

## Kiểm chứng và nghiệm thu

Các kiểm tra tập trung xác minh mọi chủ sở hữu nguồn đã khai báo ở hai chế độ, mô tả hỗ trợ tiếp cận và ngôn ngữ cây con, compiler/CSP thực tế, tiêu điểm bàn phím và chọn ngôn ngữ bằng điều khiển native, đồng bộ hướng dẫn lồng và văn bản được escape. Bằng chứng trình duyệt phân biệt canvas thẻ trên máy tính với điều khiển chạm và mẫu có chiều rộng cố định. Kiểm tra tự động về độ đầy đủ và kết xuất không xác lập chất lượng ngôn ngữ hay nghiệm thu thị giác/hỗ trợ tiếp cận của con người. Nghiệm thu bản dịch tiếng Việt vẫn chưa được xác minh cho đến khi có người rà soát.

HTML nguồn tiếng Anh giữ `lang="en"` khi JavaScript bị tắt hoặc không tải được tập lệnh ngôn ngữ. Runtime chiếu nội dung đã chọn trước khi đặt ngôn ngữ tài liệu; giao diện có thực thi mặc định là tiếng Việt.
