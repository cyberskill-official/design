<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**SearchField** — input tìm kiếm dạng viên, có icon và nút xóa.

```jsx
<SearchField value={q} onChange={setQ} placeholder="Search projects…" />
```

`value` điều khiển trường; nếu không có, trạng thái nội bộ vẫn cập nhật kể cả khi cung cấp hàm quan sát `onChange`. Bên gọi chế độ điều khiển phải tự cập nhật `value`.

`defaultValue` khởi tạo trạng thái không điều khiển một lần; thay đổi sau không đặt lại truy vấn người dùng. Cả `disabled` và `readOnly` ngăn gõ và xóa, kể cả callback `onChange`/`onClear`. Cập nhật `value` do cha điều khiển vẫn render khi bị khóa. Bật lại trường khôi phục thao tác xóa.

Bàn phím: Dùng chỉnh sửa văn bản native. Nút xóa hỗ trợ Enter/Space, bị vô hiệu hóa theo trạng thái disabled/readOnly của input. Cung cấp tên hỗ trợ tiếp cận qua prop input native.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `SearchField.jsx` và `SearchField.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- SearchField: ref trỏ tới HTMLInputElement (input); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**SearchField** — pill search input with icon + clear button.

```jsx
<SearchField value={q} onChange={setQ} placeholder="Search projects…" />
```

`value` controls the field; without it, internal state updates even when an
`onChange` observer is supplied. Controlled callers must update `value` themselves.

`defaultValue` initializes uncontrolled state once; later changes do not reset
the user's query. Both `disabled` and `readOnly` prevent typing and clearing,
including `onChange`/`onClear` callbacks. Parent-controlled `value` updates still
render while locked. Reenabling the field restores the clear action.

Keyboard: Uses native text editing. The clear button supports Enter/Space and is disabled with the input’s disabled/readOnly state. Supply an accessible name through native input props.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `SearchField.jsx` and `SearchField.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- SearchField: ref targets HTMLInputElement (input); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### SearchField

[Khai báo / Declaration](SearchField.d.ts) · [Nguồn / Source](SearchField.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClear` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 307 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 3 mặc định tham số cho thuộc tính kế thừa; xem `SearchField.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 307 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 3; see `SearchField.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
