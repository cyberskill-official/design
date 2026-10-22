<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**StatusIndicator** — chấm màu và nhãn (`online`/`busy`/`offline`/`error`); `pulse` cho trạng thái trực tiếp.

```jsx
<StatusIndicator status="online" pulse>All systems go</StatusIndicator>
```

Bàn phím: Hiển thị trạng thái không thêm thao tác bàn phím. Chấm là trang trí; thêm nhãn văn bản có ý nghĩa.

Bản địa hóa: Nhãn trạng thái do bên gọi sở hữu. Component không phát hiện kết nối hoặc dịch văn bản trạng thái; pulse dừng khi giảm chuyển động được yêu cầu.

Bằng chứng nguồn: `StatusIndicator.jsx` và `StatusIndicator.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- StatusIndicator: ref trỏ tới HTMLSpanElement (span); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**StatusIndicator** — coloured dot + label (`online`/`busy`/`offline`/`error`); `pulse` for live states.

```jsx
<StatusIndicator status="online" pulse>All systems go</StatusIndicator>
```

Keyboard: The status display adds no keyboard action. The dot is decorative; include a meaningful text label.

Localization: The status label is caller-owned. The component does not detect connectivity or translate status text; pulse stops under reduced-motion.

Source evidence: `StatusIndicator.jsx` and `StatusIndicator.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- StatusIndicator: ref targets HTMLSpanElement (span); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### StatusIndicator

[Khai báo / Declaration](StatusIndicator.d.ts) · [Nguồn / Source](StatusIndicator.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `pulse` | optional | `false` |
| `status` | optional | `"offline"` |

API kế thừa: 279 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `StatusIndicator.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 279 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `StatusIndicator.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
