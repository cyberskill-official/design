# Áp dụng vai trò spacing có giới hạn — G31

Trạng thái: triển khai cục bộ và kiểm chứng tự động; nghiệm thu hình ảnh và con người vẫn riêng biệt. Thay đổi tác giả giới hạn ở chín khai báo padding/gap trong `base/controls.css`. Không thêm token, không đổi giá trị token và không mở rộng hành vi density compact.

## Vai trò chính xác

| Vai trò | Selector/thuộc tính | Token lưới hiện có |
|---|---|---|
| Khoảng cách nội dung tìm kiếm | `.cs-search` gap: 8px | `--cs-space-2` |
| Padding đầu Combobox | `.cs-combobox input` left: 12px | `--cs-space-3` |
| Padding inline của vùng tag | `.cs-taginput` horizontal: 8px | `--cs-space-2` |
| Padding inline của bản nháp tag | `.cs-taginput > input` horizontal: 4px | `--cs-space-1` |
| Padding vùng lịch | `.cs-cal` padding: 12px | `--cs-space-3` |
| Khoảng cách nội dung ngày | `.cs-datepicker__field` gap: 8px | `--cs-space-2` |
| Padding control ngày | `.cs-datepicker__field` vertical: 8px / horizontal: 12px | `--cs-space-2`/`--cs-space-3` |
| Khoảng cách stack trường form | `.cs-form` gap: 16px | `--cs-space-4` |
| Padding theo block của tóm tắt form | `.cs-form__summary` vertical: 12px | `--cs-space-3` |

Giá trị 6/10/14px, khoảng chừa cuối 34px của Combobox và 38px của Select, border, radius, chỉ báo focus và kích thước đích không đổi. Chỉ dùng token spacing khi giá trị hiện có khớp đúng vai trò. Border, kích thước icon, cỡ chữ hay mức tối thiểu của đích không trở thành padding chỉ vì dùng cùng một con số.

## Ranh giới density

[Quyết định density](theme-density-contrast.md) đã chấp nhận quản lý padding/gap của Button và họ control dùng chung TextField. Lớp dùng chung đó còn tới Select, NativeSelect, Textarea và Mentions; bố cục dùng style Button kế thừa hành vi của nó. Chuyển đổi này giữ cả giá trị comfortable và compact.

SearchField, NumberField, Combobox, DatePicker và TagInput không nhận thêm hành vi padding compact qua thay đổi này. Panel, bảng và Tabs cũng vậy. Thuộc tính density và giá trị tính toán có thể được kế thừa mà không phải component nào cũng tiêu thụ chúng.

Bảy alias đã công bố từ `--cs-density-space-1` đến `--cs-density-space-6` cùng `--cs-density-control-gap` vẫn là export tương thích. Hiện không có thành phần bố cục nội bộ tiêu thụ chúng trong dấu vết phụ thuộc CSS theo scope. Điều này không chứng minh không có bên sử dụng ngoài và không cho phép xóa. Áp dụng rộng hơn cần quyết định scope compact tường minh, bản đồ theo vai trò và kiểm chứng đích/chuyển dòng. Các alias không chứng minh hệ thống hỗ trợ bố cục compact cho mọi component.

## Bằng chứng và bảo trì

`_audit/ci/fixtures/g31-controls-before.css` giữ cố định toàn bộ stylesheet control trước sửa; SHA256 là `7b44cec43ba5bacec34bdc972aa9e4a16aa36fae40182776096e998773f1a27d`. Tệp `g31-spacing-roles.json` bên cạnh ghi khai báo gốc và khai báo dùng token của từng vai trò. Xem chúng là bằng chứng hồi quy có thể duyệt, không phải tệp sinh để tự động làm mới khi kiểm tra thất bại.

Chạy `node scripts/flatten-styles.mjs`, rồi `node _audit/ci/test-spacing-roles-browser.mjs`. Kiểm thử tải CSS cố định ở vị trí import gốc và so với CSS nguồn cùng CSS đã gộp hiện tại. Nó kiểm tra hình học render và thuộc tính layout/font/border/focus đã tính của 23 đích component thật qua mặc định, comfortable, compact, compact kế thừa, đặt lại comfortable lồng nhau và vào lại compact. Chromium, Firefox, WebKit đều chạy điều kiện media con trỏ fine/coarse thật. Mức tối thiểu control/button coarse vẫn ít nhất 44px cho họ được lấy mẫu tường minh; hợp đồng Button xs/sm với con trỏ fine giữ 28/36px.

Kiểm thử còn đổi bốn giá trị token spacing trong trình duyệt và kiểm tra từng vai trò đã áp dụng trong cả hai bản phân phối CSS. Điều này chứng minh token được tiêu thụ thật, kể cả khoảng chừa 14/34px giữ nguyên, thay vì chỉ tìm chuỗi nguồn. Biên nhận JSON và baseline tính toán theo engine được ghi dưới `test-results/spacing-roles/`.

Thay đổi spacing mặc định hay scope compact sau này phải chủ động cập nhật hợp đồng vai trò và bằng chứng cố định qua duyệt; không hạ kiểm tra bằng nhau hoặc âm thầm đổi nghĩa hit target. Sinh lại toàn bộ chuỗi provenance token/khai báo/export sau khi sửa CSS tác giả, giữ gate CSS lint, độ mới, density, reflow, bàn phím/focus và pixel hiện có. Nghiệm thu hình ảnh, chạm và công nghệ hỗ trợ thủ công vẫn tách khỏi sự bằng nhau của computed style.
