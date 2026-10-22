<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
# LocaleProvider — Nhà cung cấp thông điệp

Organism chỉ cung cấp context cho từ điển thông điệp UI bất biến, có phạm vi. Import LocaleProvider và useMessages từ @cyberskill/design. Provider nhận messages (namespace → thẻ locale → khóa chuỗi) và children; không render gốc DOM, không có trục hình thức, kích thước hoặc trạng thái. Component hiện có vẫn chọn theo lang tường minh → lang DOM gần nhất → lang tài liệu → tiếng Việt. Namespace ứng dụng dùng useMessages(namespace, explicitLang).

Từng khóa dự phòng lần lượt qua locale chính được yêu cầu, tiếng Anh, tiếng Việt rồi trả về chính khóa. Với mỗi locale ứng viên, provider gần nhất được ưu tiên, sau đó provider cha, rồi chuỗi tích hợp. Vì vậy locale chính xác ở cha được ưu tiên hơn dự phòng tiếng Anh ở con. Bí danh locale chuẩn hóa qua helper primaryLang hiện có; bí danh trùng trong một namespace khiến toàn bộ từ điển bị từ chối. Các nhánh anh em độc lập không chia sẻ nội dung thay thế.

Đầu vào phải là record thuần với giá trị chuỗi; khóa prototype, symbol, accessor, hàm và record sai dạng bị từ chối mà không gọi getter. Snapshot provider sao chép và đóng băng registry, không thay đổi dữ liệu của bên gọi. Cập nhật messages bằng tham chiếu đối tượng mới; sửa đối tượng đang có không phải cập nhật. Nội dung là văn bản React thuần, không nội suy HTML. Đầu vào sai ném lỗi, có thể được error boundary của bên sử dụng xử lý.

API này không đăng ký định dạng ngày/số, đổi cơ chế dự phòng formatter, chọn locale, triển khai RTL hoặc hứa hẹn ngữ nghĩa gửi native. LocaleProvider không sở hữu DOM nhận tiêu điểm hay tương tác bàn phím. Phần tử con giữ tên, trạng thái và hành vi bàn phím riêng. useMessages công khai là hook: gọi vô điều kiện ở phạm vi component; resolver được trả về có thể gọi có điều kiện. Khai báo nguồn và docs/locale-messages.md có thẩm quyền về prop và quy tắc dự phòng được hỗ trợ.

## English
<!-- END GENERATED VI PROMPT v1 -->
# LocaleProvider

Context-only organism for immutable, scoped UI-message dictionaries. Import LocaleProvider and useMessages from @cyberskill/design. The provider accepts messages (namespace → locale tag → string key) and children; it renders no DOM root and has no visual, size or state axis. Existing components retain explicit lang → nearest DOM lang → document lang → Vietnamese resolution. Application namespaces use useMessages(namespace, explicitLang).

Fallback resolves each key in requested primary locale, English, then Vietnamese, then returns the key. For each candidate locale, the nearest provider wins, then parent providers, then built-in strings. A parent's exact locale therefore precedes a child's English fallback. Locale aliases normalize with the existing primaryLang helper; duplicate aliases in one namespace reject the complete dictionary. Independent siblings do not share overrides.

Inputs must be plain records with string values; prototype keys, symbols, accessors, functions and malformed records are rejected without invoking getters. Provider snapshots copy and freeze the registry without changing caller data. Update messages with a new object reference; mutating an existing object is not an update. Copy is plain React text, never HTML interpolation. Invalid inputs throw and can be handled by the consumer's error boundary.

This API does not register date/number formats, change formatter fallbacks, select a locale, implement RTL, or promise native submission semantics. LocaleProvider owns no focusable DOM or keyboard interaction. Its children keep their own accessible names, states and keyboard behavior. Public useMessages is a hook: call it unconditionally at component scope; its returned resolver can be called conditionally. Source declarations and docs/locale-messages.md are authoritative for supported props and fallback rules.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### LocaleProvider

[Khai báo / Declaration](LocaleProvider.d.ts) · [Nguồn / Source](LocaleProvider.jsx) · phân tích mặc định / default analysis: `direct-export-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `messages` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 0 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `LocaleProvider.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 0 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `LocaleProvider.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
