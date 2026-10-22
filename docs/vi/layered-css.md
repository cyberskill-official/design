# Cascade layer theo lựa chọn

`styles.css` và `styles.min.css` giữ nguyên cascade hiện tại. Chọn `@cyberskill/design/styles.layered.css` để dùng các layer có tên. Chỉ nạp một entry một lần; không trộn entry có layer với entry mặc định. Đây là lựa chọn bổ sung, không phải chuyển đổi mặc định.

```css
@layer cs-overrides {
  .cs-card { border-radius: 12px; }
}
```

Entry được sinh là CSS độc lập, không còn import. Đường dẫn font/tài nguyên được đổi theo vị trí entry ở gốc package; khi sao chép phải giữ các thư mục `fonts/` và `assets/` cùng cấp. `styles.layered.provenance.json` ghi mã băm nguồn. Bộ sinh chỉ chấp nhận đúng đồ thị import đã duyệt, từ chối nguồn mới/đổi thứ tự, import/layer lồng nhau, URL bên ngoài và đường dẫn thoát thư mục.

Thứ tự layer: `cs-safety`, `cs-reset`, `cs-tokens`, `cs-components`, `cs-accessibility`, `cs-responsive`, `cs-overrides`. Reset chứa khai báo thường của reset; tokens chứa font và token; components giữ thứ tự các tệp base còn lại; accessibility chứa khai báo thường từ a11y; responsive giữ vị trí cuối của responsive; overrides để người dùng mở rộng.

Với khai báo thường, layer phía sau thắng layer phía trước bất kể độ đặc hiệu selector. CSS thường không có layer của ứng dụng thắng mọi layer thư viện. Inline style thường vẫn giữ ưu tiên nền tảng. Đây là khác biệt chủ ý để dễ ghi đè. Người dùng vẫn phải bảo toàn tương phản, tiêu điểm, ngữ nghĩa native và kích thước mục tiêu khi thay đổi. Không khai báo trước hoặc đổi thứ tự các tên layer dành riêng này.

Với `!important`, thứ tự layer đảo ngược. Vì vậy bộ sinh đưa **toàn bộ** khai báo important hiện có vào một layer `cs-safety` đầu tiên, giữ selector, điều kiện lồng, thứ tự nguồn và giá trị. Không chia important theo nhóm thành phần/trợ năng vì việc đó sẽ đổi kết quả cascade. Cách này cũng bảo vệ important của thư viện trước important ở layer phía sau hoặc không có layer của ứng dụng; đây là khác biệt opt-in so với entry mặc định. Inline important, nguồn người dùng và trình duyệt vẫn giữ ưu tiên nền tảng. Layer do ứng dụng khai báo trước safety có thể thắng important của safety; không làm vậy.

Safety là nhóm bảo toàn cascade lịch sử, không khẳng định mọi important đều phục vụ trợ năng; nó còn có responsive và glass. Một số quy tắc trợ năng là khai báo thường và vẫn có thể bị ghi đè theo cơ chế thường. Không thêm important vào CSS nguồn.

Sinh lại bằng `node scripts/generate-layered-styles.mjs` sau khi sinh token/base; thêm `--check` để kiểm tra chỉ đọc. Kiểm thử cấu trúc bảo toàn mọi important và từ chối đồ thị không an toàn. Kiểm thử trình duyệt so sánh computed style của 120 mẫu thành phần cùng các trạng thái dark/compact/coarse/reduced-motion/forced-colors đã chọn trên Chromium, Firefox và WebKit; kiểm tra tương tác thực cho focus/hover/disabled/selection/popup body và phép thử âm đảo thứ tự important. Phạm vi này không thay cho mọi cấu hình ứng dụng, thử trợ năng thủ công hay chấp thuận hình ảnh.
