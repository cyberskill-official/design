<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**List / ListItem** — danh sách hàng dọc (đầu · tiêu đề/phụ đề · cuối). `onClick` biến hàng thành nút tương tác.

```jsx
<List>
  <ListItem lead={<Avatar name="An Le" size="sm" />} title="An Le" subtitle="Platform" trail={<Badge>Owner</Badge>} />
</List>
```

Biến thể nút mặc định dùng `type="button"` để kích hoạt hành động không gửi biểu mẫu bao ngoài. Biến thể không phải nút không nhận kiểu button.

ListItem tương tác hiển thị nút native trong wrapper listitem, giữ cấu trúc danh sách lẫn ngữ nghĩa nút. Lớp, prop DOM và handler nhấn vẫn trên nút; hàng tĩnh vẫn là một phần tử listitem. Tránh control tương tác lồng trong hàng nút.

Hàng tương tác giữ vùng đích tối thiểu44 ×44pixel CSS trên con trỏ thô, kể cả hàng chỉ có tiêu đề. Hàng danh sách tĩnh giữ mật độ hiện có.

Bàn phím: List thêm ngữ nghĩa danh sách. ListItem tương tác đặt nút native Enter/Space trong wrapper listitem; hàng tĩnh là listitem. Tránh điều khiển tương tác lồng trong hàng nút.

Bản địa hóa: Nhãn và nội dung con do bên gọi quản lý; component không có bản dịch tích hợp. Cả List và ListItem đều không thêm nội dung hàng đã dịch.

Bằng chứng nguồn: `List.jsx` và `List.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- List: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
- ListItem: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**List / ListItem** — vertical list of rows (lead · title/subtitle · trail). `onClick` makes a row an interactive button.

```jsx
<List>
  <ListItem lead={<Avatar name="An Le" size="sm" />} title="An Le" subtitle="Platform" trail={<Badge>Owner</Badge>} />
</List>
```

Button variants default to `type="button"` so activating an action does not submit an enclosing form. Non-button variants receive no button type.

An interactive ListItem renders a native button inside a listitem wrapper, preserving both list structure and button semantics. Classes, DOM props and the click handler remain on the button; static rows remain a single listitem element. Avoid nested interactive controls inside a button row.

Interactive rows preserve a minimum 44 × 44 CSS-pixel target on coarse pointers, including title-only rows. Static list rows keep their existing density.

Keyboard: List adds list semantics. An interactive ListItem places a native Enter/Space button inside a listitem wrapper; static rows are listitems. Avoid nested interactive controls in a button row.

Localization: Labels and child content are caller-owned; this component has no built-in translation. Neither List nor ListItem adds translated row content.

Source evidence: `List.jsx` and `List.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- List: ref targets HTMLDivElement (div); while native target is mounted.
- ListItem: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### List

[Khai báo / Declaration](List.d.ts) · [Nguồn / Source](List.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 279 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `List.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 279 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `List.runtime.defaultExpressions` in the canonical source facts.

### ListItem

[Khai báo / Declaration](List.d.ts) · [Nguồn / Source](List.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `lead` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClick` | optional | Không khai báo trong tham số / Not declared in parameter |
| `subtitle` | optional | Không khai báo trong tham số / Not declared in parameter |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |
| `trail` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 278 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `ListItem.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 278 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `ListItem.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
