<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Toggle** — nút bật/tắt nhấn được (`aria-pressed`). Toggle trạng thái độc lập; không phải Switch (form) hoặc SegmentedControl (tập lựa chọn).

```jsx
<Toggle defaultPressed icon={<Icon name="sparkle" size="sm"/>}>Bold</Toggle>
<Toggle pressed={on} onChange={setOn}>Aurora wash</Toggle>
```

Nội dung con nhìn thấy cung cấp tên hỗ trợ tiếp cận; `aria-label` hoặc `aria-labelledby` có thể đặt tên điều khiển chỉ có icon. Nhãn điều khiển ổn định đã bản địa hóa chỉ là dự phòng khi không có nội dung con hoặc tên tường minh cung cấp ngữ cảnh. `onClick` quan sát kích hoạt chuột/bàn phím native trước khi đổi trạng thái; gọi `preventDefault()` hủy thay đổi và phát `onChange`. Bên gọi chế độ điều khiển phải cập nhật `pressed`; điều khiển disabled không kích hoạt.

Các slot icon giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

Bàn phím: Nút native hỗ trợ Enter/Space. `onClick` chạy trước toggle; chặn mặc định của nó hủy đổi trạng thái. Bên gọi chế độ điều khiển cập nhật `pressed`.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `Toggle.jsx` và `Toggle.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Tên dự phòng khi chưa đặt tên ổn định (“Toggle” / “Nút bật tắt”) qua các trạng thái pressed; `aria-pressed` công bố trạng thái.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Toggle: ref trỏ tới HTMLButtonElement (button); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Toggle** — single pressable on/off button (`aria-pressed`). Standalone state toggle; not a Switch (form) or SegmentedControl (choice set).

```jsx
<Toggle defaultPressed icon={<Icon name="sparkle" size="sm"/>}>Bold</Toggle>
<Toggle pressed={on} onChange={setOn}>Aurora wash</Toggle>
```

Visible child content supplies the accessible name; `aria-label` or
`aria-labelledby` can name icon-only controls. The localized stable control label is a
fallback only when no child content or explicit name supplies context.
`onClick` observes native mouse and keyboard activation before toggling;
calling `preventDefault()` cancels the state change and `onChange` emission.
Controlled callers must update `pressed`; disabled controls do not activate.

The icon slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: The native button supports Enter/Space. `onClick` runs before the toggle; preventing its default cancels the state change. Controlled callers update `pressed`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `Toggle.jsx` and `Toggle.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

The unnamed fallback is stable (“Toggle” / “Nút bật tắt”) across pressed states; `aria-pressed` exposes state.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Toggle: ref targets HTMLButtonElement (button); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Toggle

[Khai báo / Declaration](Toggle.d.ts) · [Nguồn / Source](Toggle.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultPressed` | optional | `false` |
| `disabled` | optional | `false` |
| `icon` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClick` | optional | Không khai báo trong tham số / Not declared in parameter |
| `pressed` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 284 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Toggle.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 284 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Toggle.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
