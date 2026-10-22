# Điểm vào CSS theo component

Các điểm vào tùy chọn `styles/components/<TênExport>.css` nạp nhóm **nguyên stylesheet hiện có** theo hướng bảo thủ. `styles.css`, điểm vào chỉ có token và điểm vào có layer giữ nguyên hợp đồng. Cơ chế này không cắt selector và không cô lập phạm vi CSS của component.

Bundler có thể import `@cyberskill/design/styles/components/Button.css`. Với bản giải nén dùng tĩnh, có thể link `styles/components/Button.css`. Giữ nguyên cấu trúc thư mục của package: các điểm vào import trực tiếp `tokens/` và `base/`, nên URL font và asset tương đối giữ nguyên.

## Phụ thuộc dùng chung và nguồn chuẩn

Mọi điểm vào đều gồm toàn bộ font/token/trục giao diện, reset, typography, glass, interaction, accessibility và responsive. Các sheet tùy chọn được đóng phụ thuộc theo lớp `cs-` dùng chung, định nghĩa custom property và keyframe. Nhóm nguyên sheet có lớp trùng nhau được giữ cùng nhau; thứ tự luôn theo `styles.css`. Không sửa selector, declaration, điều kiện CSS, `!important` hay URL font.

`scripts/generate-component-css-entries.mjs` phân tích AST của CSS và import cục bộ. Kiểm kê export nguồn độc lập kiểm tra thành viên API và hash component. Lớp literal và tiền tố họ lớp xác định sheet cần nạp. Import động, cách tạo lớp hoặc thuộc tính nội bộ chưa phân tích được sẽ ghi `full-fallback` và nạp mọi sheet. Xem lý do trong `styles/components/manifest.json`; đây không phải bundle cô lập. Sheet tùy chọn có selector không giới hạn theo lớp component hoặc đăng ký at-rule toàn cục được đưa vào phần dùng chung.

Ba hàm hỗ trợ có hợp đồng luồng lớp đã được rà soát: hàm gộp target props ghép lớp nguồn và lớp người dùng; field association giữ nguyên lớp; bộ chọn vật liệu overlay chọn một lớp literal trong tập hữu hạn. Hash chính xác của file hỗ trợ ràng buộc kết quả rà soát. Khi file thay đổi, các điểm vào liên quan quay về full fallback cho đến lần rà soát tiếp theo. Cơ chế này không chứng nhận accessibility hay nghiệm thu hành vi.

## Component con và lớp do người dùng truyền

Điểm vào bao phủ nguồn và import bắc cầu của component. Nó không suy ra `children`, `className`, lớp target props hoặc HTML tùy ý của ứng dụng. Khai báo rõ các component đó. Khi dùng nhiều component, tạo **một hợp nhất theo thứ tự chuẩn**, thay vì giả định nhiều manifest import độc lập luôn giữ nguyên cascade.

```js
import { componentStylesheets } from '@cyberskill/design/styles/components/compose.mjs';

const paths = componentStylesheets(['Card', 'Button']);
const css = paths.map(path => `@import url("../${path}");`).join('\n');
```

Đường dẫn trả về tính từ gốc package, không lặp và theo thứ tự `styles.css`. Tiền tố trong ví dụ giả định manifest nằm sâu hơn gốc package một thư mục; cần điều chỉnh theo vị trí thực tế. Hàm không nạp CSS và không truy cập filesystem. Tên export không tồn tại bị từ chối. Mảng rỗng trả về phần dùng chung. Lớp ứng dụng cần stylesheet của ứng dụng; lớp tái sử dụng hook của component thư viện khác cần điểm vào tương ứng. Khi chưa xác định được thành phần kết hợp, dùng `styles.css`.

`styles/components/foundation.css` chỉ gồm phần dùng chung. Provider không có CSS hoặc export chuyển tiếp có thể chỉ cần phần này; component con vẫn cần điểm vào riêng. Các điểm vào này không có layer. Không trộn với điểm vào layered rồi giả định thứ tự ưu tiên tương đương.

## Kiểm tra và giới hạn

Sinh bằng `node scripts/generate-component-css-entries.mjs`; thêm `--check` để chỉ kiểm tra, không ghi. Manifest ghi hash đầu vào, thứ tự sheet, asset, import nguồn, bằng chứng họ lớp, lý do full fallback và tổng byte nguồn của các sheet. Đây không phải số byte truyền đã nén hay mức tiết kiệm theo selector.

`_audit/ci/test-component-css-entries.mjs` kiểm tra thành viên thiếu/cũ, drift nguồn và helper, constructor chưa rõ, import động, đóng phụ thuộc lớp/custom property/keyframe, selector toàn cục, drift asset, đường dẫn không an toàn, symlink, hợp nhất thứ tự và dừng trước khi sửa đầu ra nếu có lỗi. Kiểm tra trình duyệt so sánh fixture thực tế và các trục đại diện với `styles.css`, sau đó kiểm tra focus gốc, hover, lỗi, giá trị disabled, radio được chọn và body portal. Mutation bỏ sheet controls phải làm oracle computed style phát hiện khác biệt. Receipt giữ danh tính đầu vào, bundle và React runtime thực tế.

Các kiểm tra mọi computed property không phải custom property, gồm pseudo-element before/after không thay thế duyệt hình ảnh thủ công, công nghệ hỗ trợ, mọi tổ hợp prop/trạng thái, cách kết hợp bất kỳ của người dùng hay kiểm tra hiển thị native. Full fallback vẫn được ghi nhận như vậy dù fixture tham chiếu vượt qua kiểm tra.

Cả `npm run build:css-index` và entrypoint tương thích `npm run build:component-css-index` đều gọi cùng producer chỉ mục CSS. Tên script cũ vẫn được hỗ trợ.
