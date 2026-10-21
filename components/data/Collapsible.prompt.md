<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Collapsible** — mở rộng một panel nhẹ, không có khung trang trí Accordion. Nút kích hoạt dùng được bằng bàn phím với `aria-expanded`.

```jsx
<Collapsible title="Advanced" defaultOpen={false}>
  <p>Policy details…</p>
</Collapsible>
```

Bàn phím: Enter/Space native bật/tắt nút; vùng có tên chỉ mount khi mở. title ưu tiên hơn trigger khi không null. open với onOpenChange là controlled; defaultOpen khởi tạo trạng thái uncontrolled. Dùng nhãn nút mô tả không tương tác.

Bản địa hóa: Nội dung nút kích hoạt và panel do bên gọi quản lý; không có prop lang hay nội dung dịch tích hợp.

Bằng chứng nguồn: `Collapsible.jsx` và `Collapsible.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Collapsible: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: button (HTMLButtonElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Collapsible** — light single-panel expand without Accordion chrome. Keyboard-accessible trigger with `aria-expanded`.

```jsx
<Collapsible title="Advanced" defaultOpen={false}>
  <p>Policy details…</p>
</Collapsible>
```

Keyboard: Native Enter/Space toggles the button; the named region mounts only when open. title takes precedence over trigger when non-null. open with onOpenChange is controlled; defaultOpen seeds uncontrolled state. Use a descriptive non-interactive button label.

Localization: Trigger and panel content are caller-owned; there is no lang prop or built-in translated copy.

Source evidence: `Collapsible.jsx` and `Collapsible.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Collapsible: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned button (HTMLButtonElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Collapsible

[Khai báo / Declaration](Collapsible.d.ts) · [Nguồn / Source](Collapsible.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultOpen` | optional | `false` |
| `onOpenChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `open` | optional | Không khai báo trong tham số / Not declared in parameter |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |
| `trigger` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 277 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Collapsible.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 277 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Collapsible.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
