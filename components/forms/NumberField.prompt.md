<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**NumberField** — bộ tăng giảm số với nút −/+ và chặn min/max. Truyền `label` cho tên trường nhìn thấy; nhãn giảm/tăng/giá trị song ngữ qua registry.

```jsx
<NumberField label="Seats" value={seats} onChange={setSeats} min={1} max={20} />
```

`value` điều khiển trường; nếu không có, trạng thái nội bộ vẫn cập nhật kể cả khi cung cấp hàm quan sát `onChange`. Bên gọi chế độ điều khiển phải tự cập nhật `value`.

Nút tăng giảm dùng quy tắc thập phân và step-base của input số native, gồm `min`/`max`, nên bước phân số không lộ đuôi cộng nhị phân. Giá trị lệch lưới tiến tới bước native hợp lệ tiếp theo. Bên gọi chế độ điều khiển không cập nhật `value` sẽ giữ giá trị đang hiển thị sau khi bấm nút.

Bàn phím: Dùng nhập/tăng giảm native của input số. Tab cũng tới nút giảm/tăng; Enter/Space gọi căn bước native. Bên gọi chế độ điều khiển cập nhật `value`.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `NumberField.jsx` và `NumberField.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`defaultValue` khởi tạo trạng thái không điều khiển một lần khi mount (mặc định số không); đổi sau không đặt lại chỉnh sửa. `value` được ưu tiên. Chỉ hỗ trợ mặc định dạng số.

Đích tường minh: `rootProps` áp dụng thuộc tính DOM vào phần tử bọc ngoài; `controlProps` áp dụng vào input số. Prop cấp cao hiện có giữ đích trước đó. Class và style được ghép; trình xử lý nội bộ chạy trước trình xử lý đích. Không thể thay giá trị, disabled, type, role, trạng thái popup và trình xử lý thay đổi do component sở hữu qua túi thuộc tính đích. Ref nằm ngoài API này.

`description` và `error` render văn bản liên kết (kể cả số không); lỗi đặt `aria-invalid`. `FormField` tự cung cấp nhãn, ID hint/lỗi và trạng thái required cho điều khiển. Tên ARIA tường minh của bên gọi ưu tiên, mô tả ghép không trùng ID, bỏ lỗi trường giữ trạng thái invalid của bên gọi. Dùng một nhãn trường nhìn thấy, thường trên FormField.
`name` và `required` giữ hành vi input số native; thuộc tính native chuyển tiếp cấp cao vẫn tới input đó.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- NumberField: ref trỏ tới HTMLInputElement (input); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**NumberField** — numeric stepper with −/+ buttons and min/max clamping. Pass `label` for a visible field name; bilingual decrease/increase/value labels via the registry.

```jsx
<NumberField label="Seats" value={seats} onChange={setSeats} min={1} max={20} />
```

`value` controls the field; without it, internal state updates even when an
`onChange` observer is supplied. Controlled callers must update `value` themselves.

Stepper buttons use the native number input’s decimal and step-base rules,
including `min`/`max`, so fractional steps do not expose binary addition tails.
An off-grid value advances to the next valid native step. A controlled caller
that does not update `value` retains the displayed value after a button click.

Keyboard: Uses native number-input keyboard entry/stepping. Tab also reaches the decrease/increase buttons; Enter/Space invokes native step alignment. Controlled callers update `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `NumberField.jsx` and `NumberField.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`defaultValue` seeds uncontrolled state once at mount (zero by default); later changes do not reset edits. `value` takes precedence. Only numeric defaults are supported.

Explicit targets: `rootProps` applies DOM attributes to the outer wrapper; `controlProps` applies them to the numeric input. Existing top-level props keep their previous targets. Classes and styles merge; internal handlers run before target handlers. Owned value, disabled, type, role, popup state and change handlers cannot be replaced through target bags. Refs remain outside this API.

`description` and `error` render associated text (including numeric zero); an error sets `aria-invalid`. `FormField` automatically supplies its label, hint/error IDs and required state to this control. Explicit caller ARIA naming wins, descriptions combine without duplicate IDs, and removing a field error preserves caller invalid state. Use one visible field label, normally on FormField.
`name` and `required` retain native numeric-input behavior; top-level native passthrough attributes still reach that input.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- NumberField: ref targets HTMLInputElement (input); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### NumberField

[Khai báo / Declaration](NumberField.d.ts) · [Nguồn / Source](NumberField.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultValue` | optional | `0` |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `id` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `max` | optional | Không khai báo trong tham số / Not declared in parameter |
| `min` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `step` | optional | `1` |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 300 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 1 mặc định tham số cho thuộc tính kế thừa; xem `NumberField.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 300 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 1; see `NumberField.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
