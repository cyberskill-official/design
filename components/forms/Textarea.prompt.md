<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Textarea** — input nhiều dòng trong khung `.cs-field`; mô tả/lỗi như TextField, có thể đổi chiều cao.

```jsx
<Textarea label="Tell us your wish" description="A sentence or two is plenty." rows={4} />
```

ID `aria-describedby` của bên gọi được giữ cùng ID trợ giúp/lỗi cục bộ. `error` cục bộ buộc `aria-invalid=true`; khi không có, giữ giá trị `aria-invalid` của bên gọi. Phần tử được tham chiếu bên ngoài phải có trong cùng tài liệu.

Nhãn ReactNode và nội dung tùy chọn giữ số `0`. Nội dung tùy chọn vẫn bỏ `null`, `false` và chuỗi rỗng. Lỗi có giá trị bằng 0 vẫn render alert, kiểu invalid và tham chiếu ARIA giống lỗi văn bản.

Bàn phím: Dùng chỉnh sửa nhiều dòng và IME native; Enter chèn dòng mới. Phần bọc không thêm trình xử lý phím gửi.

Bản địa hóa: Nhãn nhìn thấy và nội dung do bên sử dụng sở hữu; không có bản dịch tích hợp cho chúng.

Bằng chứng nguồn: `Textarea.jsx` và `Textarea.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Ref native (React 18/19):
- Textarea: ref trỏ tới HTMLTextAreaElement (textarea); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

Đặt tên trường native: Nhãn nhìn thấy do component sở hữu có ID span ổn định và cung cấp `aria-labelledby`, vì vậy hint/lỗi đã render, nơi được hỗ trợ, vẫn là mô tả `aria-describedby` thay vì trở thành một phần tên. Giữ nhãn số `0`. Chuỗi `aria-label`/`aria-labelledby` tường minh của bên gọi (kể cả rỗng/sai) không đổi; prop đặt tên null/undefined bị bỏ qua để cho phép nhãn sở hữu làm dự phòng. ID mô tả của bên gọi và component được ghép không trùng. DOM hiện có, ref native/root và ngữ nghĩa gửi form vẫn có thẩm quyền.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Textarea** — multi-line input in the `.cs-field` frame; description + error like TextField, vertically resizable.

```jsx
<Textarea label="Tell us your wish" description="A sentence or two is plenty." rows={4} />
```

Caller `aria-describedby` IDs are retained alongside local help/error IDs. A
local `error` forces `aria-invalid=true`; without one, the caller-provided
`aria-invalid` value is preserved. External referenced elements must exist in
the same document.

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings. A zero-valued error renders its alert, invalid styling and ARIA references just like a text error.

Keyboard: Uses native multiline editing and IME behavior; Enter inserts a newline. The wrapper adds no submission key handler.

Localization: Visible labels and content are caller-owned; there is no built-in translation for them.

Source evidence: `Textarea.jsx` and `Textarea.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Native refs (React 18/19):
- Textarea: ref targets HTMLTextAreaElement (textarea); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

Native field naming: the owned visible label has a stable span ID and supplies `aria-labelledby`, so rendered hint/error text, where supported, remains an `aria-describedby` description rather than becoming part of the name. Numeric `0` labels are retained. Explicit caller `aria-label`/`aria-labelledby` strings (including empty/invalid strings) remain unchanged; null/undefined naming props are omitted and allow the owned-label fallback. Caller and owned description IDs are merged without duplicates. Existing DOM, native/root refs and form submission semantics remain authoritative.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Textarea

[Khai báo / Declaration](Textarea.d.ts) · [Nguồn / Source](Textarea.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 294 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 2 mặc định tham số cho thuộc tính kế thừa; xem `Textarea.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 294 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 2; see `Textarea.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
