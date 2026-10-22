<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**ButtonGroup** — cụm Button chia đoạn (chung đường viền, một khung bo góc).

```jsx
<ButtonGroup label="View">
  <Button variant="secondary" size="sm">Board</Button>
  <Button variant="secondary" size="sm">List</Button>
</ButtonGroup>
```

Bàn phím: Phần tử bọc có `role="group"`; từng phần tử con giữ hành vi bàn phím native riêng. Component không cung cấp điều hướng phím mũi tên hoặc trạng thái chọn.

Bản địa hóa: Nhãn nhóm hỗ trợ tiếp cận và nội dung con do bên sử dụng sở hữu; không có prop `lang` hoặc nhãn dịch sẵn.

Bằng chứng nguồn: `ButtonGroup.jsx` và `ButtonGroup.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- ButtonGroup: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**ButtonGroup** — segmented cluster of Buttons (shared borders, one rounded outline).

```jsx
<ButtonGroup label="View">
  <Button variant="secondary" size="sm">Board</Button>
  <Button variant="secondary" size="sm">List</Button>
</ButtonGroup>
```

Keyboard: The wrapper has `role="group"`; each child retains its own native keyboard behavior. It does not provide arrow navigation or selection state.

Localization: The accessible group label and child content are caller-owned; there is no `lang` prop or built-in translated label.

Source evidence: `ButtonGroup.jsx` and `ButtonGroup.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- ButtonGroup: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### ButtonGroup

[Khai báo / Declaration](ButtonGroup.d.ts) · [Nguồn / Source](ButtonGroup.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 278 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `ButtonGroup.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 278 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `ButtonGroup.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
