<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Accordion** — section thu gọn; mặc định mở một (`allowMultiple` để mở nhiều).

`defaultOpen` là chỉ mục ban đầu; dùng `-1` để bắt đầu đóng. Đổi `allowMultiple` giữ section mở đầu tiên. Chuyển sang mở một section loại các section mở khác, nên chúng không xuất hiện lại khi đổi chế độ lần sau.

```jsx
<Accordion items={[{title:"What is a wish?",content:"A clear outcome…"}]} />
```

Bàn phím: Tab native đến nút từng section; Enter/Space bật/tắt nó. Nội dung panel đóng bị unmount. defaultOpen khởi tạo trạng thái một lần; đổi items không đặt lại. Tiêu đề phải đặt tên nút và không nên chứa control tương tác lồng nhau.

Bản địa hóa: Tiêu đề và nội dung panel do bên gọi quản lý; component không có prop lang hay nội dung dịch tích hợp.

Bằng chứng nguồn: `Accordion.jsx` và `Accordion.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Trigger nằm trong tiêu đề cấp ba; trigger mở tham chiếu panel đã mount qua aria-controls và mỗi panel tham chiếu trigger qua aria-labelledby.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Ref native (React 18/19):
- Accordion: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Accordion** — collapsible sections; single-open by default (`allowMultiple` to open several).

`defaultOpen` is an initial index; use `-1` to start closed. Changing
`allowMultiple` preserves the first opened section. Switching to single-open
discards other open sections, so they do not reappear on a later mode switch.

```jsx
<Accordion items={[{title:"What is a wish?",content:"A clear outcome…"}]} />
```

Keyboard: Native Tab reaches each section button; Enter/Space toggles it. Closed panel content is unmounted. defaultOpen seeds state once; changing items does not reset it. Titles must name the buttons and should contain no nested interactive control.

Localization: Titles and panel content are caller-owned; this component has no lang prop or built-in translated copy.

Source evidence: `Accordion.jsx` and `Accordion.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Triggers sit in level-three headings; expanded triggers reference their mounted panel via aria-controls, and each panel references its trigger via aria-labelledby.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Native refs (React 18/19):
- Accordion: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Accordion

[Khai báo / Declaration](Accordion.d.ts) · [Nguồn / Source](Accordion.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `allowMultiple` | optional | `false` |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultOpen` | optional | `0` |
| `items` | required | `[]` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Accordion.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Accordion.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
