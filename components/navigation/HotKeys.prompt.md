<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**HotKeys** — quản lý tổ hợp phím và bảng tra “?” (song ngữ).

```jsx
<HotKeys bindings={[{keys:"mod+k",description:"Command palette",onTrigger:openCmdk}]}>{app}</HotKeys>
```

Bề mặt đang mở tham gia ngăn xếp lớp phủ dùng chung: Escape đóng nó trước modal cha. Lệnh lựa chọn và chỉnh sửa bằng bàn phím hiện có vẫn cục bộ trong widget. Bề mặt chặn này cũng giữ tiêu điểm bên trong, cô lập nền bằng inert và giữ quyền sở hữu khóa cuộn lồng nhau.

Binding toàn cục và trợ giúp bỏ qua trường form native, vùng contenteditable kế thừa (gồm đích trong shadow tree mở), tổ hợp IME và sự kiện đã bị handler cục bộ chặn. Shadow root đóng giấu nội bộ; host phải xử lý/chặn sự kiện chỉnh sửa cục bộ.

Binding dùng `KeyboardEvent.key` không phân biệt hoa thường, phía trước là modifier `mod`, `ctrl`, `meta`, `shift` hoặc `alt` phân tách bằng `+`; bỏ khoảng trắng xung quanh. `mod` nhận Ctrl hoặc Meta. Modifier khác phải khớp tường minh, kể cả Shift cho phím có tên như Enter. Modifier lạ và phím rỗng không khớp. Cử chỉ trợ giúp `?` tích hợp tách riêng việc phân tích binding.

Bàn phím: Tổ hợp được tài liệu hóa gọi onTrigger ngoài sự kiện chỉnh sửa/tổ hợp/đã xử lý. ? đóng/mở bảng trợ giúp khi bật; Escape đóng modal qua ngăn xếp overlay dùng chung có bẫy tiêu điểm. Host shadow đóng phải tự bảo vệ sự kiện chỉnh sửa.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Mô tả binding, chuỗi phím và nội dung con do bên gọi sở hữu.

Bằng chứng nguồn: `HotKeys.jsx` và `HotKeys.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- HotKeys: ref trỏ tới HTMLDivElement (role=dialog); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**HotKeys** — keymap manager + "?" cheat-sheet (bilingual).

```jsx
<HotKeys bindings={[{keys:"mod+k",description:"Command palette",onTrigger:openCmdk}]}>{app}</HotKeys>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.
This blocking surface also traps focus, isolates the background with inert, and preserves nested scroll-lock ownership.

Global bindings and help ignore native form fields, inherited contenteditable regions (including open shadow-tree targets), IME composition and events already prevented by a local handler. Closed shadow roots hide their internals; their host must handle/prevent editing events locally.

Bindings use a case-insensitive `KeyboardEvent.key` preceded by `+`-separated `mod`, `ctrl`, `meta`, `shift` or `alt` modifiers; surrounding whitespace is ignored. `mod` accepts Ctrl or Meta. Other modifiers must match explicitly, including Shift for named keys such as Enter. Unknown modifiers and empty keys do not match. The built-in `?` help gesture remains separate from binding parsing.

Keyboard: The documented key combinations call onTrigger outside editing/composition/already-handled events. ? toggles the help sheet when enabled; Escape closes the modal through the shared overlay stack, which traps focus. Closed shadow hosts must guard editing events themselves.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Binding descriptions, key strings and child content are caller-owned.

Source evidence: `HotKeys.jsx` and `HotKeys.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- HotKeys: ref targets HTMLDivElement (role=dialog); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### HotKeys

[Khai báo / Declaration](HotKeys.d.ts) · [Nguồn / Source](HotKeys.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `bindings` | required | `[]` |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `help` | optional | `true` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `HotKeys.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `HotKeys.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
