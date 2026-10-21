# Hợp đồng API runtime

Hướng dẫn này mô tả React runtime đã biên dịch trong package. Nó không thay đổi template runtime, hợp đồng xuất tài liệu, quyền sử dụng hay yêu cầu phê duyệt phát hành hiện có. Khai báo component là nguồn chính xác về target và prop được hỗ trợ.

## Entry và peer

```jsx
import {Button, TextField, LocaleProvider, useMessages} from '@cyberskill/design';
import '@cyberskill/design/styles.css';
```

Package gốc và `/react` trỏ tới ESM đã biên dịch `dist/esm/_esm/react.mjs`. Deep import đã biên dịch như `@cyberskill/design/components/forms/Form.jsx` dùng chung module/context với import gốc. React và react-dom là peer external, hỗ trợ React 18 và 19. Đường ESM này hỗ trợ Node SSR không cần JSX loader; không hứa hẹn entry CommonJS. Module generated giữ ranh giới `"use client"` và source map liên kết.

`@cyberskill/design/source` và `/source/components/*` chủ động cung cấp JSX/JS nguồn cho bundler hiểu nguồn. Transpile entry này và dùng nhất quán một họ module trong cây component. `/legacy` là runtime global chỉ dành cho trình duyệt. Tự nạp CSS; component không tự chèn CSS.

## Target native và field

`ref` trỏ tới phần tử native chính được khai báo cho từng component, không mặc nhiên là wrapper ngoài. Ví dụ TextField chuyển ref tới input; Menu chuyển tới div gốc. Target có điều kiện có thể là null khi chưa mount. `controlRef` bổ sung chỉ có khi khai báo mô tả một control khác biệt. OverlayProvider và LocaleProvider chỉ có context, không có ref native. Ref callback/object được kết hợp với ref nội bộ; cleanup callback React 19 vẫn được hỗ trợ.

Khi được khai báo, `rootProps` áp dụng cho wrapper hiện có, còn `controlProps` áp dụng cho control hoặc nhóm ngữ nghĩa được mô tả. Chúng không thay thế role, quan hệ popup, state, value hay hành vi do component sở hữu. Handler nội bộ chạy trước handler người gọi. Target bag bỏ qua ref/key/children/thuộc tính chèn HTML và khóa prototype được bảo vệ; dùng API ref tường minh. Target rest-prop hiện có vẫn theo tài liệu từng component.

Input có tham gia bên trong FormField kế thừa liên kết nhãn, gợi ý, lỗi và bắt buộc. Tên cục bộ tường minh giữ ưu tiên; mô tả được gộp, mỗi control giữ ID generated riêng. Quyền sở hữu value và tuần tự hóa form native vẫn là hợp đồng riêng từng component: prop bag không tự tạo hidden field hay tuần tự hóa mảng.

## Thông điệp và bàn phím menu

LocaleProvider cung cấp từ điển namespace bất biến, không thêm DOM hay chọn ngôn ngữ. Gọi `useMessages(namespace, lang)` vô điều kiện trong component. Cơ chế chọn ngôn ngữ của component hiện có vẫn áp dụng. Mỗi key thử ngôn ngữ chính được yêu cầu, tiếng Anh rồi tiếng Việt qua các scope provider và bảng tích hợp; key không tìm thấy trả về chính nó. Truyền tham chiếu từ điển mới để cập nhật. Xem [thông điệp UI theo scope](locale-messages.md) về kiểm tra đầu vào, thứ tự dự phòng và giới hạn.

Menu là menu button: ArrowDown/ArrowUp trên trigger mở tại mục đầu/cuối đang bật; phím mũi tên roving, Home/End và typeahead điều hướng. Enter/Space kích hoạt mục. Tab đóng menu và theo thứ tự focus tuần tự; Escape đóng và đưa focus về trigger. Khi điều khiển qua open/onOpenChange, người gọi phải cập nhật thay đổi được yêu cầu.

## Panel neo và tương thích

17 owner panel neo được hỗ trợ mặc định đặt ở body và xử lý va chạm; `portal={false}` giữ vị trí inline. Tổ tiên của vị trí chèn inline ban đầu nằm trong form hoặc fieldset buộc dùng inline ngay cả khi portal tường minh là true, để giữ quan hệ native. Khi ngữ cảnh tự đổi, host ổn định giữ state phần tử con. Đổi mode portal tường minh có thể remount phần tử con. Khôi phục focus của nền tảng vẫn có thể tạo sự kiện blur/focus native; không suy ra focus liên tục cùng task hay liên kết form native khi chuyển tùy ý giữa document. Khai báo component xác định prop placement được hỗ trợ; portal tùy chỉnh chưa đăng ký vẫn do người gọi quản lý.

SegmentedControl mặc định là radiogroup chọn value; `mode="tabs"` tường minh giữ ngữ nghĩa tab cho panel do người gọi cung cấp. Các alias ngữ nghĩa `role="tablist"` và `role="radiogroup"` vẫn được giữ nhưng đã deprecated: khi bỏ qua `mode`, chúng chọn phần tử con tab hoặc radio tương ứng; `mode` tường minh được ưu tiên. Role khác bị từ chối. Thời điểm và phiên bản thông báo đã phát hành chưa được xác lập; chính sách hai bản minor đã phát hành và 90 ngày thông báo vẫn áp dụng trước khi xóa alias. Việc xóa các alias được giữ lại trong tương lai vẫn chịu chính sách thông báo phát hành: chỉ tăng major version không miễn yêu cầu số bản minor đã phát hành và thời gian thông báo. Hướng dẫn này không cấp phép phát hành hay chấp nhận hỗ trợ.
