<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**TagInput** — token nhiều giá trị (Enter/dấu phẩy thêm · Backspace xóa · blur chốt). Truyền `label` cho tên trường nhìn thấy; placeholder và nhãn xóa song ngữ qua registry.

```jsx
<TagInput label="Tags" defaultValue={["Web apps","Bilingual"]} onChange={setTags} max={8}/>
```

Enter/dấu phẩy trong tổ hợp IME không tạo tag. Vô hiệu hóa input ngăn draft đang chờ được chốt bởi blur.

Bàn phím: Enter/dấu phẩy thêm tag đã bỏ khoảng trắng đầu/cuối và không trùng; Backspace chỉ xóa tag cuối khi draft rỗng, blur chốt khi enabled. Tổ hợp IME không chốt. Nút xóa native hỗ trợ Enter/Space.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `TagInput.jsx` và `TagInput.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Đích trường tường minh: `rootProps` áp dụng cho phần tử ngoài hiện có; `controlProps` áp dụng input draft văn bản, không áp dụng nút xóa tag. Class/style được ghép, trình xử lý bên sử dụng chạy sau trình xử lý sở hữu. Role, trình xử lý giá trị/thay đổi và trạng thái popup vẫn thuộc component. `id` (hoặc `controlProps.id`) xác định đích logic. `description` và `error` render phản hồi với tham chiếu ID kết hợp; lỗi cục bộ và context FormField giữ invalid. FormField cung cấp liên kết nhãn, hint/lỗi và yêu cầu bắt buộc. Tên hỗ trợ tiếp cận tường minh ưu tiên hơn tên kế thừa. API đích này không bổ sung chuyển tiếp ref hay tuần tự hóa giá trị native.

`required` thêm aria-required cho textbox draft mà không xác thực required native: draft rỗng có thể đi cùng các tag hợp lệ đã chốt. Input draft không nhận name native vì nó không phải mảng tag logic.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- TagInput: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: input (HTMLInputElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**TagInput** — multi-value tokens (Enter/comma adds · Backspace removes · blur commits). Pass `label` for a visible field name; bilingual placeholder + remove labels via the registry.

```jsx
<TagInput label="Tags" defaultValue={["Web apps","Bilingual"]} onChange={setTags} max={8}/>
```

Enter/comma during IME composition does not create a tag. Disabling the input prevents a pending draft from being committed by blur.

Keyboard: Enter/comma adds a trimmed nonduplicate tag; Backspace removes the last tag only when the draft is empty, and blur commits while enabled. IME composition does not commit. Native remove buttons support Enter/Space.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `TagInput.jsx` and `TagInput.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Explicit field targets: `rootProps` applies to the existing outer element; `controlProps` applies to the draft text input, never tag removal buttons. Classes/styles merge and consumer handlers run after owned handlers. Owned roles, value/change handlers and popup state stay component-owned. `id` (or `controlProps.id`) identifies the logical target. `description` and `error` render feedback with composed ID references; local error and FormField context preserve invalid state. FormField supplies label, hint/error and requirement associations. Explicit accessible names take precedence over inherited names. No ref forwarding or native value serialization is added.

`required` adds aria-required to the draft textbox without native required validation: an empty draft may accompany valid committed tags. The draft input does not accept a native name because it is not the logical tags array.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- TagInput: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned input (HTMLInputElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### TagInput

[Khai báo / Declaration](TagInput.d.ts) · [Nguồn / Source](TagInput.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultValue` | optional | `[]` |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `id` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `max` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `TagInput.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `TagInput.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
