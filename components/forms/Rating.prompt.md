<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Rating** — đánh giá sao nguyên (sao Ochre). APG radiogroup: một điểm Tab, ArrowLeft/Right (cả Up/Down) đổi giá trị. Có hoặc không điều khiển; `readOnly` để hiển thị; bấm giá trị hiện tại để xóa. ARIA song ngữ qua registry.

```jsx
<Rating defaultValue={4} onChange={setStars}/>
<Rating value={3} readOnly/>
```

Chỉ radio đại diện điểm chính xác được chọn; các sao trước vẫn nhìn thấy tô đầy. Điểm đã xóa không chọn radio nào và giữ một điểm vào bằng bàn phím.

`max` dùng số sao nguyên được render cho nhãn, giới hạn bàn phím và callback. Phân số hữu hạn làm tròn xuống, số không dương không render sao, số không hữu hạn hoặc không biểu diễn được dùng năm.

Bàn phím: Với điểm sao nguyên có thể sửa, mũi tên đổi điểm, Home/End tới giới hạn; kích hoạt nút native chọn hoặc xóa sao. Sao chỉ đọc nằm ngoài thứ tự Tab. Cung cấp điểm nguyên từ không tới tối đa được render.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `Rating.jsx` và `Rating.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Đích trường tường minh: `rootProps` áp dụng cho phần tử ngoài hiện có; `controlProps` áp dụng cho radiogroup (cùng đích với rootProps), không áp dụng từng sao. Class/style được ghép, trình xử lý bên sử dụng chạy sau trình xử lý sở hữu. Role, trình xử lý giá trị/thay đổi và trạng thái popup vẫn thuộc component. `id` (hoặc `controlProps.id`) xác định đích logic. `description` và `error` render phản hồi với tham chiếu ID kết hợp; lỗi cục bộ và context FormField giữ invalid. FormField cung cấp liên kết nhãn, hint/lỗi và yêu cầu bắt buộc. Tên hỗ trợ tiếp cận tường minh ưu tiên hơn tên kế thừa. API đích này không bổ sung chuyển tiếp ref hay tuần tự hóa giá trị native.

`required` đặt ngữ nghĩa bắt buộc hợp lệ của radiogroup; sao giữ trạng thái checked và hành vi bàn phím roving do component sở hữu.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Rating: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Rating** — whole-star rating (ochre stars). APG radiogroup: one tab stop, ArrowLeft/Right (and Up/Down) change value. Controlled or uncontrolled; `readOnly` for display; click current value to clear. Bilingual aria via the registry.

```jsx
<Rating defaultValue={4} onChange={setStars}/>
<Rating value={3} readOnly/>
```

Only the radio representing the exact score is selected; preceding stars remain visually filled. A cleared score selects no radio and retains one keyboard entry point.

`max` uses the rendered whole-star count for labels, keyboard bounds and callbacks. Finite fractions round down, nonpositive counts render no stars, and nonfinite or unrepresentable counts use five.

Keyboard: For editable whole-star values, arrows change the score and Home/End reach its bounds; native button activation selects or clears a star. Read-only stars are outside Tab order. Supply whole scores from zero through the rendered maximum.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `Rating.jsx` and `Rating.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Explicit field targets: `rootProps` applies to the existing outer element; `controlProps` applies to the radiogroup (the same target as rootProps), never individual stars. Classes/styles merge and consumer handlers run after owned handlers. Owned roles, value/change handlers and popup state stay component-owned. `id` (or `controlProps.id`) identifies the logical target. `description` and `error` render feedback with composed ID references; local error and FormField context preserve invalid state. FormField supplies label, hint/error and requirement associations. Explicit accessible names take precedence over inherited names. No ref forwarding or native value serialization is added.

`required` sets valid radiogroup requirement semantics; stars retain their owned checked state and roving keyboard behavior.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Rating: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Rating

[Khai báo / Declaration](Rating.d.ts) · [Nguồn / Source](Rating.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultValue` | optional | `0` |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `id` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `max` | optional | `5` |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `readOnly` | optional | `false` |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Rating.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Rating.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
