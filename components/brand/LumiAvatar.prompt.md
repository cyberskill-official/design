<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**LumiAvatar** — avatar linh vật thần đèn vàng. Truyền `src` (ví dụ `assets/lumi-poster.webp`) hoặc dùng dự phòng ký tự ✦ trên nền chuyển sắc vàng.

```jsx
<LumiAvatar src="../../assets/lumi-poster.webp" size="lg" ring />
```

Bàn phím: Avatar không thêm thao tác bàn phím. Khi đặt trong liên kết hoặc nút, phần tử cha sở hữu tiêu điểm, thao tác kích hoạt và tên hỗ trợ tiếp cận.

Bản địa hóa: Alt của ảnh mặc định là tên cố định Lumi. Ký tự dự phòng là trang trí; cung cấp tên hỗ trợ tiếp cận hoặc văn bản bên cạnh nếu nội dung dự phòng phải truyền đạt danh tính.

Bằng chứng nguồn: `LumiAvatar.jsx` và `LumiAvatar.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- LumiAvatar: ref trỏ tới HTMLSpanElement (span); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**LumiAvatar** — the golden-genie mascot avatar. Pass `src` (e.g. `assets/lumi-poster.webp`) or fall back to the ✦ glyph on the golden gradient.

```jsx
<LumiAvatar src="../../assets/lumi-poster.webp" size="lg" ring />
```

Keyboard: The avatar adds no keyboard action. If composed into a link or button, that parent owns focus, activation and its accessible name.

Localization: The image alt defaults to the fixed name Lumi. The fallback glyph is decorative; provide an accessible name or nearby text when the fallback must convey identity.

Source evidence: `LumiAvatar.jsx` and `LumiAvatar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- LumiAvatar: ref targets HTMLSpanElement (span); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### LumiAvatar

[Khai báo / Declaration](LumiAvatar.d.ts) · [Nguồn / Source](LumiAvatar.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `alt` | optional | `"Lumi"` |
| `ring` | optional | `false` |
| `size` | optional | `"md"` |
| `src` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 280 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `LumiAvatar.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 280 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `LumiAvatar.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
