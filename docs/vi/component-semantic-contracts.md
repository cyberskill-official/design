# Hợp đồng ngữ nghĩa component

`components/specifications.json` tách quan sát nguồn, hợp đồng ngữ nghĩa được viết rõ và yêu cầu runtime chính xác. Đọc trạng thái và bằng chứng của từng nhóm. Trích đoạn nguồn xác lập implementation đã xem; tương tác đạt xác lập hành vi đã kiểm tra. Cả hai không thay thế chấp nhận công nghệ hỗ trợ thủ công hay mọi composition của bên dùng.

Các nhóm gồm anatomy, roles, states, slots, keyboard và examples. Component không có widget bàn phím tùy biến vẫn cần hợp đồng cụ thể: Kbd chỉ hiển thị ký hiệu phím; Chart là hình có nhãn chỉ đọc; LocaleProvider không tạo DOM; Sidebar giao điều hướng native cho phần tử con. Đây là ranh giới áp dụng có bằng chứng nguồn, không phải tự động đạt khi thiếu test. Thuộc tính native và children do bên dùng cung cấp có thể thêm hành vi ngoài phần component sở hữu.

Giữ rõ ngữ nghĩa native:

| Component | Hành vi sở hữu và ranh giới |
| --- | --- |
| RadioGroup | Fieldset/legend và radio cùng name native. Bỏ qua lựa chọn disabled; chọn và xử lý biên theo browser, không phải tablist. |
| ButtonGroup | Nhóm các button native độc lập, không tự thêm chọn bằng phím mũi tên hay roving focus. |
| Card, Item, NavItem, ListItem | Target button/anchor đã tài liệu hóa cung cấp activation và Tab. `as` tùy biến và thuộc tính bên gọi vẫn do bên gọi chịu trách nhiệm. |
| ScrollArea | Vùng overflow native nhận focus. PageDown/Space cuộn; phím mũi tên theo browser. Không có scrollbar giả hay focus trap. |
| TreeTable | Table native và button disclosure. Mở hàng liên kết các hàng con trực tiếp, không triển khai mô hình phím treegrid APG. |
| Editor | Button toolbar native rồi đến contenteditable. Test riêng kiểm tra định dạng, selection và đầu ra đã sanitize; không tự thêm mô hình mũi tên roving. |
| Form/FormField | Sửa/submit native và liên kết nhãn/mô tả/lỗi/required, không có shortcut toàn form hay focus trap ở wrapper. |

Kiểm tra bàn phím bắt đầu bằng nhóm radio HTML độc lập. Trên macOS WebKit, Option+Tab có thể là tổ hợp đi qua mọi control; mũi tên radio dừng ở biên, trong khi Chromium/Firefox có thể quay vòng. Component phải khớp mô hình native đã xác minh, không ép hành vi của engine khác. Kiểm tra riêng cuộn thật bằng PageDown/Space và Arrow không bị preventDefault, vì ArrowDown đơn không cuộn phần tử overflow native WebKit trong môi trường đã thử. Quan sát baseline thô được giữ cùng bằng chứng.

Slot cũng cần review nguồn. Spinner chuyển tiếp children native của span. Icon và LumiAvatar sở hữu nội dung glyph/avatar. Logo giữ tương thích type cho children SVG nhưng bỏ qua chúng để bảo toàn artwork chính thức và title được sinh; title/fragment lồng không thể thay nội dung hay gây xung đột children/inner-HTML. SearchField và Slider chủ động bỏ children vì input native là phần tử void. `rootProps` được bảo vệ không thể thay children thuộc component.

Chạy bằng toolchain Node/npm khóa của repository:

```sh
CS_TEST_BROWSER=chromium node _audit/ci/test-semantic-keyboard-contracts-browser.mjs
CS_TEST_BROWSER=firefox node _audit/ci/test-semantic-keyboard-contracts-browser.mjs
CS_TEST_BROWSER=webkit node _audit/ci/test-semantic-keyboard-contracts-browser.mjs
node _audit/ci/test-logo-owned-content-types.mjs
CS_TEST_BROWSER=chromium node _audit/ci/test-logo-owned-content-browser.mjs
CS_TEST_BROWSER=firefox node _audit/ci/test-logo-owned-content-browser.mjs
CS_TEST_BROWSER=webkit node _audit/ci/test-logo-owned-content-browser.mjs
```

Test bàn phím dùng input browser thật và từ chối mutation nguồn làm mất cập nhật radio, bỏ native Tab entry của vùng cuộn hoặc bỏ activation disclosure. Test Editor hiện có kiểm tra lệnh định dạng bằng chuột, Enter, Space. Test Logo kiểm tra React 18/19 SSR và SVG trong browser, cleanup object/callback ref, tên/decorative và bảo toàn artwork mặc định; nguồn trước sửa phải tái hiện lỗi. Fixture type strict giữ tương thích children SVG và type native ref/event/size.

Không đổi trường chưa xác minh thành “không áp dụng” từ tên component hoặc vì thiếu literal phím. Cần xem render path, helper, target native và điểm mở rộng, viết phát biểu có phạm vi và gắn trích đoạn nguồn chính xác. Trích đoạn đổi cần review. Support approval và release acceptance vẫn là record riêng.
