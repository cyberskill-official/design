<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Terminal** — khối console có ô nhập lệnh (onCommand → đầu ra).

```jsx
<Terminal welcome="Type `help`." onCommand={(c)=>c==="help"?"wish · status · clear":"command not found: "+c}/>
```

Enter thực thi lệnh không trống đã trim và không gửi biểu mẫu bao ngoài. Sự kiện composition/229 của IME không thực thi lệnh. Số không là nội dung welcome/đầu ra hợp lệ; null, undefined, boolean và chuỗi rỗng không thêm đầu ra.

Bàn phím: Enter thực thi lệnh không trống đã trim qua callback đồng bộ của bên gọi, có chặn composition IME. Lưu lịch sử lệnh/đầu ra cục bộ; welcome khởi tạo lịch sử đầu và đổi welcome sau đó không đặt lại nó.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Prompt, welcome, đầu ra và tiêu đề tùy chỉnh do bên gọi quản lý. Đây là UI lệnh; mọi việc thực thi lệnh do bên gọi triển khai.

Bằng chứng nguồn: `Terminal.jsx` và `Terminal.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Terminal: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Terminal** — console block with prompt input (onCommand → output).

```jsx
<Terminal welcome="Type `help`." onCommand={(c)=>c==="help"?"wish · status · clear":"command not found: "+c}/>
```

Enter executes a nonblank trimmed command and does not submit an enclosing
form. IME composition/229 events do not execute commands. Numeric zero is valid
welcome/output content; null, undefined, booleans and empty strings add no output.

Keyboard: Enter executes a trimmed nonblank command through the synchronous caller callback, with IME composition guarded. It stores command/output history locally; welcome seeds the initial history and later welcome changes do not reset it.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Prompt, welcome, output and custom title are caller-owned. This is a command UI; any command execution is implemented by the caller.

Source evidence: `Terminal.jsx` and `Terminal.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Terminal: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Terminal

[Khai báo / Declaration](Terminal.d.ts) · [Nguồn / Source](Terminal.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onCommand` | optional | Không khai báo trong tham số / Not declared in parameter |
| `prompt` | optional | `"➜"` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |
| `welcome` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Terminal.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Terminal.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
