<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Item** — khung hàng dùng chung cho danh sách / cài đặt / điều hướng. Có slot đầu + cuối, tiêu đề + mô tả, selected / disabled và `href` (liên kết) hoặc `onClick` (nút) khi tương tác.

```jsx
<Item
  title="Release notes"
  description="A summary each time a project ships."
  trailing={<Switch />}
/>
<Item title="Profile" href="#profile" selected />
```

Bàn phím: Khi có href, hàng dùng liên kết native kích hoạt bằng Enter; không có href, onClick dùng nút native kích hoạt bằng Enter/Space. Hàng disabled thành div không tương tác với aria-disabled. href ưu tiên hơn callback nút. Tránh controls lồng trong hàng tương tác.

Bản địa hóa: Nhãn và nội dung con do bên gọi quản lý; component không có bản dịch tích hợp. Cờ selected đặt aria-current; ý nghĩa lựa chọn do bên gọi quản lý.

Bằng chứng nguồn: `Item.jsx` và `Item.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Item: ref trỏ tới HTMLDivElement | HTMLButtonElement | HTMLAnchorElement (Tag); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Item** — shared list / settings / nav row chrome. Leading + trailing slots, title + description, selected / disabled, and `href` (link) or `onClick` (button) when interactive.

```jsx
<Item
  title="Release notes"
  description="A summary each time a project ships."
  trailing={<Switch />}
/>
<Item title="Profile" href="#profile" selected />
```

Keyboard: With href, the row uses a native link activated by Enter; without href, onClick uses a native button activated by Enter/Space. Disabled rows become a noninteractive div with aria-disabled. An href takes precedence over the button callback. Avoid nested controls inside an interactive row.

Localization: Labels and child content are caller-owned; this component has no built-in translation. The selected flag sets aria-current; the caller owns the meaning of that selection.

Source evidence: `Item.jsx` and `Item.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Item: ref targets HTMLDivElement | HTMLButtonElement | HTMLAnchorElement (Tag); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Item

[Khai báo / Declaration](Item.d.ts) · [Nguồn / Source](Item.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `href` | optional | Không khai báo trong tham số / Not declared in parameter |
| `leading` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClick` | optional | Không khai báo trong tham số / Not declared in parameter |
| `selected` | optional | `false` |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |
| `trailing` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 276 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Item.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 276 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Item.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
