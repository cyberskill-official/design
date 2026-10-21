# Storybook runtime accessibility / Khả năng tiếp cận khi chạy Storybook

## English

Storybook examples must use the component's declared props. FloatingActionButton
receives `label` and `icon`; Popconfirm receives its action element through
`trigger`. Putting these values in unsupported children or attributes can render
an unnamed button even when the story source looks labelled. A custom scroll
host must be keyboard reachable and have an accessible region name.

The pressed Toggle and highlighted Mentions option keep their accent backgrounds. Their labels use
`--cs-color-text-primary`, checked against every explicit light/dark element and
contrast branch at the existing axe text contrast threshold. Theme changes are
scanned after finite CSS transitions settle; motion is not disabled to make the
check pass.

A disabled static `div.cs-item` still conveys information, so its title and
summary keep full opacity. A disabled TagInput keeps committed values readable
at full opacity, with a raised host background as its disabled surface signal.
Its native input and remove buttons stay disabled. The narrow `:has()` rule
only changes this composite; disabled links and button Items retain their
existing behavior and styling. No ARIA exemption is added to avoid measuring
informational text. The regression checks APCA 75 and WCAG text contrast across
256 explicit-theme/system-OS, element, density and contrast combinations in each installed
engine, and rejects the original dimming when restored.

The runtime story scanner enumerates component stories from the built index,
opens the actual iframe, and keeps all axe violations and incomplete results.
Its report binds the index and output bytes to the Storybook freshness stamp.
A historical build result is not current-source acceptance. The product-context verdict uses exactly the existing `_audit/axe-smoke.html`
WCAG 2 A/AA tags and serious/critical impact policy on `#storybook-root` and
registered external `[data-cs-overlay-root]` / `[data-cs-floating-root]` portals.
An unclassified external node fails coverage. All rules and impacts from both
product and whole-document scans remain in the report, including host landmark
findings; this verdict does not assert a clean whole Storybook page. Default-story coverage does not establish all interaction states or manual
assistive-technology acceptance.

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
