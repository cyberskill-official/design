<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Carousel** — slide + mũi tên + chấm (aria song ngữ). Bao bọc nội dung slide bất kỳ.

Slide không hoạt động là inert, bị loại khỏi tiêu điểm bàn phím và cây tiếp cận. Điều hướng bị vô hiệu hóa khi có không/một slide. `startIndex` là chỉ mục ban đầu; chỉ mục hiển thị được giới hạn khi tập slide thu nhỏ.

```jsx
<Carousel label="Cases"><div>Slide 1</div><div>Slide 2</div></Carousel>
```

Slide không hoạt động là inert và ẩn khỏi API tiếp cận. Khi children thu nhỏ, chỉ mục hoạt động lưu được giới hạn; thêm lại slide không hồi sinh chỉ mục đã bỏ. Controls trước/sau giữ kích hoạt native Enter/Space và vô hiệu hóa khi dưới hai slide.

Bàn phím: Tab native đến controls, chấm và nội dung slide hoạt động có thể nhận tiêu điểm; Enter/Space kích hoạt nút. Trước/sau quay vòng; component không thêm điều hướng phím mũi tên hay tự động xoay. startIndex khởi tạo một lần, khi tập thu nhỏ thì giới hạn chỉ mục được lưu.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Cung cấp nhãn carousel mô tả và nội dung slide có nghĩa; nội dung tích hợp đặt tên controls trước/sau và nút slide đánh số.

Bằng chứng nguồn: `Carousel.jsx` và `Carousel.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Mỗi slide là nhóm có tên, ngữ nghĩa slide và nhãn vị trí được bản địa hóa. Trạng thái polite thông báo vị trí hiện tại sau điều hướng thủ công. Slide không hoạt động giữ aria-hidden và inert.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Carousel: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Carousel** — slides + arrows + dots (bilingual aria). Wrap any slide content.

Inactive slides are inert and excluded from keyboard focus as well as the
accessibility tree. Navigation is disabled for zero/one slide. `startIndex` is
an initial index; the visible index is clamped when the collection shrinks.

```jsx
<Carousel label="Cases"><div>Slide 1</div><div>Slide 2</div></Carousel>
```

Inactive slides are inert and hidden from accessibility APIs. When children shrink, the stored active index is clamped; adding slides again does not revive a removed index. Previous/next controls retain native Enter/Space activation and disable with fewer than two slides.

Keyboard: Native Tab reaches controls, dots and focusable active-slide content; Enter/Space activates buttons. Previous/next wrap; the component adds no arrow-key navigation or automatic rotation. startIndex seeds once, and collection shrink clamps the stored index.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Supply a descriptive carousel label and meaningful slide content; the built-in copy names previous/next controls and numbered slide buttons.

Source evidence: `Carousel.jsx` and `Carousel.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Each slide is a named group with slide semantics and a localized position label. A polite status announces the current position after manual navigation. Inactive slides remain aria-hidden and inert.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Carousel: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Carousel

[Khai báo / Declaration](Carousel.d.ts) · [Nguồn / Source](Carousel.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `startIndex` | optional | `0` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Carousel.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Carousel.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
