<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**CommandPalette** — overlay ⌘K có tìm kiếm và hành động phân nhóm, lọc được (Escape / bấm màn che để đóng). Điều khiển qua `open`/`onClose`.

```jsx
<CommandPalette open={open} onClose={() => setOpen(false)} groups={[
  { label: "Go to", items: [{ label: "Dashboard", shortcut: "G D", onSelect: goDash }] },
]} />
```

Nhãn nhóm, icon và shortcut mục giữ số không; null, false và chuỗi rỗng bỏ các slot đó.

Danh sách lọc có số kết quả bản địa hóa nhìn thấy, hoặc “No results” / “Không có kết quả” khi rỗng. Cùng node bền vững có `role="status"`, `aria-live="polite"` và `aria-atomic="true"`; lọc không chuyển tiêu điểm khỏi ô tìm. Số đếm dùng EN/VI đã xác định, kể cả thay đổi ngôn ngữ tổ tiên trực tiếp. Hợp đồng markup/bàn phím này không chứng nhận thông báo NVDA/VoiceOver thực tế; cần phiên con người AT-06.

Overlay manager chụp điều khiển gọi trước khi chuyển tiêu điểm vào tìm kiếm. Tránh thêm autofocus native vào input nội bộ: nó sẽ thay đích trả về trước khi manager đăng ký. Chọn và Escape khôi phục điều khiển gọi nếu còn kết nối và khả dụng; mở trực tiếp không có điều khiển gọi yêu cầu bên sử dụng xác định đích quay lại logic.

Bàn phím: Bên gọi mở overlay được điều khiển và đăng ký shortcut Cmd/Ctrl+K nếu cần. Lớp modal dùng chung đặt tiêu điểm tìm kiếm và bẫy tiêu điểm; Tab native tới nút hành động, Enter/Space kích hoạt. Escape yêu cầu onClose. Không có điều hướng kết quả bằng mũi tên; truy vấn giữ khi cùng phiên bản component còn mount.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Placeholder, nhãn nhóm/hành động, icon và gợi ý shortcut vẫn do bên gọi sở hữu. Số kết quả bản địa hóa là status polite; thông báo AT thực tế cần bằng chứng thủ công.

Bằng chứng nguồn: `CommandPalette.jsx` và `CommandPalette.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ phần tử div hiện có sở hữu `className` (bảng dialog, không phải màn che đóng). Hỗ trợ thuộc tính native, data, class, style và trình xử lý sự kiện. Ngữ nghĩa/trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước bên sử dụng. Không thêm phần bọc hoặc hợp đồng ref.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- CommandPalette: ref trỏ tới HTMLDivElement (role=dialog); chỉ khi bảng nổi đang được mount. controlRef trỏ tới phần tử do component sở hữu: input (HTMLInputElement); chỉ khi đang mở.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**CommandPalette** — ⌘K overlay with search + grouped, filterable actions (Escape / scrim-click close). Controlled via `open`/`onClose`.

```jsx
<CommandPalette open={open} onClose={() => setOpen(false)} groups={[
  { label: "Go to", items: [{ label: "Dashboard", shortcut: "G D", onSelect: goDash }] },
]} />
```

Group label, item icon and item shortcut preserve numeric zero; null, false and empty strings omit those slots.

The filtered list includes a visible localized result count, or “No results” /
“Không có kết quả” when empty. The same persistent node has `role="status"`,
`aria-live="polite"` and `aria-atomic="true"`; filtering does not move focus from
the search field. Counts use the resolved EN/VI language, including live ancestor
language changes. This markup and keyboard contract does not certify actual
NVDA/VoiceOver announcements; those require the AT-06 human session.

The overlay manager captures the invoking control before moving focus into search.
Avoid adding native autofocus to the internal input: it would replace the return
target before the manager registers. Selection and Escape restore the invoking
control when it is still connected and available; direct opening without an
invoking control requires the consumer to define a logical return destination.

Keyboard: The caller opens the controlled overlay and registers any Cmd/Ctrl+K shortcut. The shared modal layer focuses search and traps focus; native Tab reaches action buttons and Enter/Space activates them. Escape requests onClose. There is no arrow-key result navigation; the query persists while the same component instance remains mounted.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Placeholder, group/action labels, icons and shortcut hints remain caller-owned. The localized result count is a polite status; actual AT announcements require manual evidence.

Source evidence: `CommandPalette.jsx` and `CommandPalette.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className` (the dialog panel, not the dismissal scrim). Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- CommandPalette: ref targets HTMLDivElement (role=dialog); only while panel is mounted. controlRef targets its owned input (HTMLInputElement); only while open.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### CommandPalette

[Khai báo / Declaration](CommandPalette.d.ts) · [Nguồn / Source](CommandPalette.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `groups` | required | `[]` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClose` | optional | Không khai báo trong tham số / Not declared in parameter |
| `open` | required | Không khai báo trong tham số / Not declared in parameter |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `CommandPalette.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `CommandPalette.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
