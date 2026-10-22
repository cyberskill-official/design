<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**InputGroup** — input có phần bổ sung prefix/suffix, xóa bằng × và hiện mật khẩu. Truyền `label` cho tên trường nhìn thấy; nhãn nút song ngữ qua registry.

```jsx
<InputGroup label="Host" prefix="https://" suffix=".world" defaultValue="cyberskill" clearable/>
<InputGroup label="Password" password placeholder="Password"/>
```

`disabled` áp dụng cho input, nút xóa và hiện mật khẩu. `readOnly` ngăn sửa và xóa nhưng vẫn cho đổi hiển thị. Cả hai giữ giá trị, không phát thay đổi giá trị từ hành động bị chặn.

Bàn phím: Dùng chỉnh sửa input native. Tab tới nút xóa/hiện khả dụng; Enter/Space kích hoạt chúng. Read-only chặn đổi giá trị nhưng cho phép đổi hiển thị mật khẩu.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `InputGroup.jsx` và `InputGroup.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- InputGroup: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

Đặt tên trường native: Nhãn nhìn thấy do component sở hữu có ID span ổn định và cung cấp `aria-labelledby`, vì vậy hint/lỗi đã render, nơi được hỗ trợ, vẫn là mô tả `aria-describedby` thay vì trở thành một phần tên. Giữ nhãn số `0`. Chuỗi `aria-label`/`aria-labelledby` tường minh của bên gọi (kể cả rỗng/sai) không đổi; prop đặt tên null/undefined bị bỏ qua để cho phép nhãn sở hữu làm dự phòng. ID mô tả của bên gọi và component được ghép không trùng. DOM hiện có, ref native/root và ngữ nghĩa gửi form vẫn có thẩm quyền.

## English
<!-- END GENERATED VI PROMPT v1 -->
**InputGroup** — input with prefix/suffix addons, clearable ×, password reveal. Pass `label` for a visible field name; bilingual button labels via the registry.

```jsx
<InputGroup label="Host" prefix="https://" suffix=".world" defaultValue="cyberskill" clearable/>
<InputGroup label="Password" password placeholder="Password"/>
```

`disabled` applies to the input, clear button and password reveal. `readOnly` prevents editing and clearing while allowing visibility changes. Both preserve the value and emit no value changes from blocked actions.

Keyboard: Uses native input editing. Tab reaches available clear/reveal buttons and Enter/Space activates them. Read-only blocks value changes but permits password visibility changes.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `InputGroup.jsx` and `InputGroup.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- InputGroup: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

Native field naming: the owned visible label has a stable span ID and supplies `aria-labelledby`, so rendered hint/error text, where supported, remains an `aria-describedby` description rather than becoming part of the name. Numeric `0` labels are retained. Explicit caller `aria-label`/`aria-labelledby` strings (including empty/invalid strings) remain unchanged; null/undefined naming props are omitted and allow the owned-label fallback. Caller and owned description IDs are merged without duplicates. Existing DOM, native/root refs and form submission semantics remain authoritative.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### InputGroup

[Khai báo / Declaration](InputGroup.d.ts) · [Nguồn / Source](InputGroup.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `clearable` | optional | `false` |
| `defaultValue` | optional | `""` |
| `disabled` | optional | `false` |
| `id` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `password` | optional | `false` |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `prefix` | optional | Không khai báo trong tham số / Not declared in parameter |
| `readOnly` | optional | `false` |
| `suffix` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 299 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `InputGroup.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 299 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `InputGroup.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
