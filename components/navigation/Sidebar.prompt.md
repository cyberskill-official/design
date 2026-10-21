<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Sidebar / NavItem** — điều hướng app-shell dọc. `NavItem` render `<a>` (href) hoặc `<button>`; `active` hiển thị trạng thái hiện tại sắc Ochre.

```jsx
<Sidebar label="Workspace">
  <NavItem icon={<Icon name="sparkle" />} active>Overview</NavItem>
  <NavItem trail={<Badge>3</Badge>}>Projects</NavItem>
</Sidebar>
```

Biến thể nút mặc định dùng `type="button"` để kích hoạt hành động không gửi biểu mẫu bao ngoài. Biến thể không phải nút không nhận kiểu button.

Nhãn Sidebar và slot icon NavItem giữ số `0`; `null`, `false` và chuỗi rỗng tiếp tục bỏ các slot đó.

Bàn phím: Sidebar thêm cấu trúc điều hướng; NavItem dùng liên kết native cho href không rỗng, nếu không dùng nút. Tab/Enter theo liên kết; Enter/Space kích hoạt nút. active do bên gọi điều khiển, công bố aria-current=page.

Bản địa hóa: Nhãn, nội dung hàng, icon và nội dung cuối do bên gọi sở hữu. Nhãn Sidebar là văn bản nhìn thấy; cung cấp aria-label hoặc aria-labelledby để đặt tên landmark điều hướng khi cần.

Bằng chứng nguồn: `Sidebar.jsx` và `Sidebar.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- NavItem: ref trỏ tới HTMLButtonElement | HTMLAnchorElement (Tag); khi đích native đang được mount.
- Sidebar: ref trỏ tới HTMLElement (nav); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Sidebar / NavItem** — vertical app-shell navigation. `NavItem` renders `<a>` (href) or `<button>`; `active` shows the ochre-tint current state.

```jsx
<Sidebar label="Workspace">
  <NavItem icon={<Icon name="sparkle" />} active>Overview</NavItem>
  <NavItem trail={<Badge>3</Badge>}>Projects</NavItem>
</Sidebar>
```

Button variants default to `type="button"` so activating an action does not submit an enclosing form. Non-button variants receive no button type.

The Sidebar label and NavItem icon slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Sidebar adds navigation structure; NavItem uses a native link for a nonempty href or a button otherwise. Tab/Enter follow links; Enter/Space activates buttons. active is caller-controlled and exposes aria-current=page.

Localization: Label, row content, icons and trailing content are caller-owned. The Sidebar label is visible text; provide aria-label or aria-labelledby to name its navigation landmark when needed.

Source evidence: `Sidebar.jsx` and `Sidebar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- NavItem: ref targets HTMLButtonElement | HTMLAnchorElement (Tag); while native target is mounted.
- Sidebar: ref targets HTMLElement (nav); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### NavItem

[Khai báo / Declaration](Sidebar.d.ts) · [Nguồn / Source](Sidebar.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `active` | optional | `false` |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `href` | optional | Không khai báo trong tham số / Not declared in parameter |
| `icon` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClick` | optional | Không khai báo trong tham số / Not declared in parameter |
| `trail` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 278 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `NavItem.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 278 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `NavItem.runtime.defaultExpressions` in the canonical source facts.

### Sidebar

[Khai báo / Declaration](Sidebar.d.ts) · [Nguồn / Source](Sidebar.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 279 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Sidebar.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 279 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Sidebar.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
