<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Image** — img có shimmer, dự phòng lỗi ấm, lightbox `preview` tùy chọn. `width` / `height` chuyển đến `<img>` bên dưới.

```jsx
<Image src="/assets/aurora-gold.jpg" alt="Aurora" ratio="16/9" width={640} height={360} preview/>
```

Bề mặt đang mở tham gia ngăn xếp lớp phủ dùng chung: Escape đóng nó trước modal cha. Lệnh lựa chọn và chỉnh sửa bằng bàn phím hiện có vẫn cục bộ trong widget. Bề mặt chặn này cũng giữ tiêu điểm bên trong, cô lập nền bằng inert và giữ quyền sở hữu khóa cuộn lồng nhau.

Đổi `src` bắt đầu trạng thái tải mới, kể cả sau lỗi trước đó. Đổi nguồn hoặc tắt `preview` đóng lightbox; bật lại preview cần kích hoạt mới.

Nội dung dự phòng tùy chỉnh giữ số không và node React phong phú. Null, false và chuỗi rỗng giữ hình minh họa lỗi mặc định.

Ảnh đã tải, bật preview giữ vùng đích tối thiểu44 ×44pixel CSS trên con trỏ thô, kể cả ảnh nguồn nhỏ. Ảnh không preview giữ kích thước hiện có.

Bàn phím: Ảnh đã tải, bật preview, vào thứ tự Tab; Enter/Space mở lightbox. Lớp modal dùng chung giữ tiêu điểm bên trong và Escape đóng nó; nút đóng native cũng hỗ trợ Enter/Space. Đổi src hoặc tắt preview đóng lightbox.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Chữ alt ảnh và nội dung dự phòng tùy chỉnh do bên gọi quản lý.

Bằng chứng nguồn: `Image.jsx` và `Image.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Image: ref trỏ tới HTMLImageElement (img); khi ảnh bên dưới đang được mount (null khi hiển thị nội dung dự phòng).
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Image** — img with shimmer, warm error fallback, optional `preview` lightbox. `width` / `height` forward to the underlying `<img>`.

```jsx
<Image src="/assets/aurora-gold.jpg" alt="Aurora" ratio="16/9" width={640} height={360} preview/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.
This blocking surface also traps focus, isolates the background with inert, and preserves nested scroll-lock ownership.

Changing `src` starts a new loading state, including after a previous failure. Changing the source or disabling `preview` closes its lightbox; re-enabling preview requires a new activation.

Custom fallback content preserves numeric zero and rich React nodes. Null, false and empty strings retain the default error illustration.

A loaded image with preview enabled preserves a minimum 44 × 44 CSS-pixel target on coarse pointers, including small source images. Non-preview images keep their existing sizing.

Keyboard: A loaded preview-enabled image enters Tab order; Enter/Space opens its lightbox. The shared modal layer traps focus and Escape closes it; the native close button also supports Enter/Space. Changing src or disabling preview closes the lightbox.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Image alt text and custom fallback content are caller-owned.

Source evidence: `Image.jsx` and `Image.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Image: ref targets HTMLImageElement (img); while underlying image is mounted (null during fallback).
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Image

[Khai báo / Declaration](Image.d.ts) · [Nguồn / Source](Image.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `alt` | optional | `""` |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `fallback` | optional | Không khai báo trong tham số / Not declared in parameter |
| `height` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `preview` | optional | `false` |
| `ratio` | optional | Không khai báo trong tham số / Not declared in parameter |
| `src` | required | Không khai báo trong tham số / Not declared in parameter |
| `width` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 278 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Image.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 278 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Image.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
