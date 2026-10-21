# Khả năng tiếp cận khi chạy Storybook

## Tiếng Anh

Ví dụ Storybook phải dùng prop đã khai báo của component. FloatingActionButton nhận `label` và `icon`; Popconfirm nhận phần tử hành động qua `trigger`. Đặt các giá trị đó trong children hay thuộc tính không hỗ trợ có thể render nút không tên dù nguồn story trông như đã có nhãn. Host cuộn tùy biến phải nhận được focus bàn phím và có tên vùng truy cập.

Toggle đang nhấn và tùy chọn Mentions được đánh dấu giữ nền accent. Nhãn dùng `--cs-color-text-primary`, được kiểm tra ở mọi nhánh sáng/tối, nguyên tố và tương phản tường minh với ngưỡng tương phản chữ axe hiện có. Quét theme sau khi transition CSS hữu hạn kết thúc; không tắt chuyển động chỉ để kiểm tra đạt.

`div.cs-item` tĩnh bị disabled vẫn truyền thông tin, nên tiêu đề và tóm tắt giữ đầy đủ độ đục. TagInput disabled giữ giá trị đã chốt dễ đọc với đầy đủ độ đục, dùng nền host nổi làm tín hiệu bề mặt disabled. Input native và nút xóa vẫn disabled. Quy tắc `:has()` hẹp chỉ đổi composite này; Item dạng link và button disabled giữ hành vi/style hiện có. Không thêm miễn trừ ARIA để tránh đo văn bản thông tin. Hồi quy kiểm tra APCA 75 và tương phản chữ WCAG qua 256 tổ hợp theme tường minh/hệ điều hành, nguyên tố, density, contrast trong mỗi engine đã cài, và từ chối khi cách làm mờ cũ được khôi phục.

Bộ quét runtime story liệt kê component story từ index đã build, mở iframe thật và giữ mọi vi phạm axe cùng kết quả chưa kết luận. Báo cáo gắn index và byte đầu ra với freshness stamp của Storybook. Kết quả build lịch sử không phải nghiệm thu nguồn hiện tại. Phán quyết theo ngữ cảnh sản phẩm dùng đúng tag WCAG 2 A/AA và chính sách impact serious/critical hiện có của `_audit/axe-smoke.html` trên `#storybook-root` cùng portal ngoài đã đăng ký `[data-cs-overlay-root]` / `[data-cs-floating-root]`. Node ngoài chưa phân loại làm coverage thất bại. Mọi rule/impact của quét sản phẩm và toàn tài liệu vẫn nằm trong báo cáo, kể cả phát hiện landmark của host; phán quyết này không khẳng định toàn trang Storybook sạch. Bao phủ story mặc định không xác lập mọi trạng thái tương tác hay nghiệm thu công nghệ hỗ trợ thủ công.

## Tiếng Việt

Ví dụ Storybook phải dùng đúng props đã khai báo. FloatingActionButton nhận
`label` và `icon`; Popconfirm nhận phần tử kích hoạt qua `trigger`. Dùng children
hoặc thuộc tính không được hỗ trợ có thể tạo nút không có tên truy cập. Vùng cuộn
tùy chỉnh cần nhận được tiêu điểm bàn phím và có tên vùng rõ ràng.

Nhãn Toggle đang chọn và tùy chọn Mentions được đánh dấu dùng `--cs-color-text-primary`, giữ nguyên viền nhấn và nền
pha màu. Kiểm tra bao phủ các nhánh sáng/tối, nguyên tố và tương phản với ngưỡng
axe hiện hành, sau khi chuyển động CSS hữu hạn kết thúc.

Bộ kiểm tra mở iframe thực từ chỉ mục bản dựng và lưu toàn bộ lỗi axe cùng kết
quả cần kiểm tra thủ công. Báo cáo gắn với dấu vân tay của bản dựng; kết quả cũ
không xác nhận mã nguồn hiện tại. Phán quyết dùng chính sách WCAG 2 A/AA và mức serious/critical hiện có trên
`#storybook-root` cùng portal đã đăng ký. Nút bên ngoài chưa được phân loại làm
kiểm tra bao phủ thất bại. Mọi luật, mức lỗi và kết quả landmark của toàn tài liệu
vẫn được lưu; phán quyết này không xác nhận toàn trang Storybook không có lỗi.
Bao phủ trạng thái mặc định không thay thế kiểm tra tương tác hoặc công nghệ hỗ
trợ thủ công.

Văn bản Item tĩnh vẫn là thông tin và giữ nguyên độ đục. TagInput đã khóa chỉnh
sửa vẫn hiển thị rõ các giá trị đã nhập, dùng nền nổi để biểu thị trạng thái.
Ô nhập và nút xóa vẫn bị vô hiệu hóa; liên kết và nút Item bị vô hiệu hóa giữ
nguyên hành vi. Không thêm ARIA để miễn kiểm tra tương phản cho văn bản. Kiểm
tra 256 tổ hợp giao diện và hệ điều hành sáng/tối, nguyên tố, mật độ và tương phản ở mỗi trình duyệt giữ
ngưỡng APCA 75 cùng ngưỡng WCAG và phát hiện lại cách làm mờ cũ.
