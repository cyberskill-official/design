<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Watermark** — chữ lặp xoay phía sau nội dung (ví dụ BẢN NHÁP / DRAFT).

```jsx
<Watermark text="BẢN NHÁP"><div className="cs-panel">…</div></Watermark>
```

Chữ trang trí dùng alpha mask SVG với `--cs-color-text-primary` kế thừa làm màu CSS, nên thay đổi theme/token trực tiếp áp dụng mà không remount. Lớp ẩn khỏi công nghệ hỗ trợ và không chặn đầu vào con trỏ.

Bàn phím: Watermark không thêm thao tác bàn phím và không chặn đầu vào con trỏ. Controls con giữ hành vi riêng.

Bản địa hóa: Chữ lặp mặc định là tên thương hiệu cố định CyberSkill; chữ tùy chỉnh do bên gọi quản lý. Lớp này trang trí và ẩn khỏi công nghệ hỗ trợ, nên trạng thái tài liệu có ý nghĩa cũng phải có trong nội dung hiển thị.

Bằng chứng nguồn: `Watermark.jsx` và `Watermark.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ div ngoài hiện có. Nó nhận thuộc tính native, data, style và sự kiện. Không thêm phần tử bọc hay hợp đồng ref. Ngữ nghĩa/trạng thái component sở hữu vẫn được kiểm soát; trình xử lý sự kiện nội bộ chạy trước callback bên sử dụng.

Ref native (React 18/19):
- Watermark: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Watermark** — rotated repeating text behind content (e.g. BẢN NHÁP / DRAFT).

```jsx
<Watermark text="BẢN NHÁP"><div className="cs-panel">…</div></Watermark>
```

The decorative text uses an SVG alpha mask with the inherited `--cs-color-text-primary` as its CSS color, so live theme/token changes apply without remounting. The layer is hidden from assistive technology and does not intercept pointer input.

Keyboard: The watermark adds no keyboard action and does not intercept pointer input. Child controls keep their own behavior.

Localization: The repeating text defaults to the fixed brand name CyberSkill; custom text is caller-owned. The layer is decorative and hidden from assistive technology, so expose meaningful document state in the visible content as well.

Source evidence: `Watermark.jsx` and `Watermark.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing outer div. It accepts native attributes, data attributes, style and events. It does not add a wrapper or ref contract. Component-owned semantics/state remain controlled; internal event handlers run before consumer callbacks.

Native refs (React 18/19):
- Watermark: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Watermark

[Khai báo / Declaration](Watermark.d.ts) · [Nguồn / Source](Watermark.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `gap` | optional | `140` |
| `opacity` | optional | `0.09` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rotate` | optional | `-22` |
| `text` | optional | `"CyberSkill"` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Watermark.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Watermark.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
