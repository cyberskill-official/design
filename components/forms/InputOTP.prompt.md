<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**InputOTP** — các ô mã một lần (tự tiến · backspace · paste · chỉ chữ số). ARIA song ngữ qua registry.

```jsx
<InputOTP length={6} onComplete={(code)=>verify(code)}/>
```

Xóa/delete/cut native bỏ chữ số và dồn mã còn lại như Backspace. Input được điều khiển phát mã được yêu cầu rồi chờ giá trị cha; mã chưa đủ không gọi `onComplete`. Văn bản thay thế không phải chữ số bị bỏ qua.

`length` dùng cùng số nguyên cho ô, nhãn, cắt chuỗi, tiêu điểm và hoàn tất. Phân số hữu hạn làm tròn xuống; số không dương không render ô. Số không hữu hạn hoặc không biểu diễn được dùng sáu.

Bàn phím: Gõ chuyển tiêu điểm; Backspace/delete/cut dồn mã, paste thay mã. Chỉnh sửa người dùng lọc chữ số ASCII. Bên gọi chế độ điều khiển phải cung cấp nội dung chữ số trong `length`; component không xác minh mã. Phím tắt Backspace bỏ qua keydown có dấu composition/keyCode229; chỉnh sửa, xóa và paste thông thường không đổi.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `InputOTP.jsx` và `InputOTP.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Đích trường tường minh: `rootProps` áp dụng cho phần tử ngoài hiện có; `controlProps` áp dụng cho nhóm OTP (cùng đích với rootProps), không áp dụng từng input chữ số. Class/style được ghép, trình xử lý bên sử dụng chạy sau trình xử lý sở hữu. Role, trình xử lý giá trị/thay đổi và trạng thái popup vẫn thuộc component. `id` (hoặc `controlProps.id`) xác định đích logic. `description` và `error` render phản hồi với tham chiếu ID kết hợp; lỗi cục bộ và context FormField giữ trạng thái invalid. FormField cung cấp liên kết nhãn, hint/lỗi và yêu cầu bắt buộc. Tên hỗ trợ tiếp cận tường minh ưu tiên hơn tên kế thừa. API đích này không bổ sung chuyển tiếp ref hay tuần tự hóa giá trị native.

`required` thêm chỉ dẫn bắt buộc qua mô tả; role="group" không có aria-required. Input chữ số có ID riêng, kế thừa tham chiếu hint/lỗi và kết hợp nhãn trường ngoài với vị trí. Chúng không nhận tên dùng chung, ràng buộc required hoặc túi prop từng mục.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- InputOTP: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**InputOTP** — one-time-code boxes (auto-advance · backspace · paste · digits only). Bilingual aria via the registry.

```jsx
<InputOTP length={6} onComplete={(code)=>verify(code)}/>
```

Native clear/delete/cut removes the digit and compacts the remaining code, as Backspace does. Controlled inputs emit the requested code and wait for the parent value; incomplete codes do not call `onComplete`. Invalid non-digit replacement text is ignored.

`length` uses the same whole count for boxes, labels, slicing, focus and completion. Finite fractions round down; nonpositive counts render no boxes. Nonfinite or unrepresentable counts use six.

Keyboard: Typing advances focus; Backspace/delete/cut compact the code and paste replaces it. User edits filter ASCII digits. A controlled caller must supply digit content within `length`; this component does not verify the code. The Backspace shortcut ignores composition-marked/keyCode229 keydowns; ordinary edit, deletion and paste behavior remain unchanged.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `InputOTP.jsx` and `InputOTP.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Explicit field targets: `rootProps` applies to the existing outer element; `controlProps` applies to the OTP group (the same target as rootProps), never individual digit inputs. Classes/styles merge and consumer handlers run after owned handlers. Owned roles, value/change handlers and popup state stay component-owned. `id` (or `controlProps.id`) identifies the logical target. `description` and `error` render feedback with composed ID references; local error and FormField context preserve invalid state. FormField supplies label, hint/error and requirement associations. Explicit accessible names take precedence over inherited names. No ref forwarding or native value serialization is added.

`required` adds a described requirement instruction; role="group" has no aria-required. Digit inputs have unique IDs, inherit hint/error references and combine external field labels with their position. They do not receive shared names, required constraints, or per-item prop bags.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- InputOTP: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### InputOTP

[Khai báo / Declaration](InputOTP.d.ts) · [Nguồn / Source](InputOTP.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `id` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `length` | optional | `6` |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onComplete` | optional | Không khai báo trong tham số / Not declared in parameter |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `InputOTP.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `InputOTP.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
