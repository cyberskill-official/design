<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Card** — panel nội dung ấm (bán kính14px, bóng mềm). Phối với `CardHeader` / `CardBody` / `CardFooter`. `interactive` mặc định là nút có hover trừ khi `as` ghi đè thẻ; thêm `className="cs-surface-standard"` để có kính trên hình ảnh.

```jsx
<Card interactive onClick={open}>
  <CardHeader title="Design System v1.6" subtitle="Platform squad" />
  <CardBody>Liquid Glass bindings + 15 element packs.</CardBody>
  <CardFooter><Badge variant="ochre">Now</Badge></CardFooter>
</Card>
```

Biến thể nút mặc định dùng `type="button"` để kích hoạt hành động không gửi biểu mẫu bao ngoài. Biến thể không phải nút không nhận kiểu button.

Slot tiêu đề và phụ đề CardHeader giữ số `0`; `null`, `false` và chuỗi rỗng tiếp tục bỏ qua các slot đó.

Bàn phím: Card tương tác mặc định là nút native kích hoạt bằng Enter/Space. `as` tường minh ghi đè thẻ; bên gọi khi đó chịu trách nhiệm hành vi bàn phím, tiêu điểm và ngữ nghĩa phù hợp. Tránh phần tử con tương tác trong thẻ dạng nút.

Bản địa hóa: Nhãn và nội dung con do bên gọi quản lý; component không có bản dịch tích hợp. CardHeader/Body/Footer hiển thị nội dung bên gọi mà không dịch.

Bằng chứng nguồn: `Card.jsx` và `Card.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Card: ref trỏ tới Element (Tag); khi đích native đang được mount.
- CardBody: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
- CardFooter: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
- CardHeader: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

### Miền thẻ gốc / Native tag domain

`as` được suy ra từ `keyof React.JSX.IntrinsicElements`, không phải danh sách biến thể hữu hạn tuyển chọn của hệ thống thiết kế. Card chuyển tiếp thẻ chọn và children: bên gọi chịu trách nhiệm vị trí HTML/SVG hợp lệ, mô hình nội dung, ngữ nghĩa và thuộc tính native của phần tử đó. Phần tử HTML rỗng (như `img`, `input` hoặc `br`) không nhận children hay nội dung HTML. Tên thẻ ở mức kiểu không chứng nhận mọi tổ hợp thẻ/nội dung.

`as` lấy từ `keyof React.JSX.IntrinsicElements`, không phải danh sách biến thể hữu hạn của hệ thống. Card chuyển tiếp thẻ và phần tử con; bên gọi chịu trách nhiệm về vị trí HTML/SVG, mô hình nội dung, ngữ nghĩa và thuộc tính gốc hợp lệ. Thẻ HTML rỗng như `img`, `input`, `br` không nhận phần tử con hay nội dung HTML. Tên thẻ hợp lệ về kiểu không chứng nhận mọi tổ hợp thẻ/nội dung.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Card** — warm content panel (14px radius, soft shadow). Compose with `CardHeader` / `CardBody` / `CardFooter`. `interactive` defaults to a hoverable button unless `as` overrides the tag; add `className="cs-surface-standard"` for glass over imagery.

```jsx
<Card interactive onClick={open}>
  <CardHeader title="Design System v1.6" subtitle="Platform squad" />
  <CardBody>Liquid Glass bindings + 15 element packs.</CardBody>
  <CardFooter><Badge variant="ochre">Now</Badge></CardFooter>
</Card>
```

Button variants default to `type="button"` so activating an action does not submit an enclosing form. Non-button variants receive no button type.

The CardHeader title and subtitle slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: An interactive Card defaults to a native button with Enter/Space activation. An explicit `as` overrides that tag; the caller then owns appropriate keyboard behavior, focus and semantics. Avoid interactive descendants inside a button card.

Localization: Labels and child content are caller-owned; this component has no built-in translation. CardHeader/Body/Footer render caller content without translating it.

Source evidence: `Card.jsx` and `Card.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Card: ref targets Element (Tag); while native target is mounted.
- CardBody: ref targets HTMLDivElement (div); while native target is mounted.
- CardFooter: ref targets HTMLDivElement (div); while native target is mounted.
- CardHeader: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

### Native tag domain / Miền thẻ gốc

`as` is derived from `keyof React.JSX.IntrinsicElements`, not a curated finite design-system variant list. Card forwards the chosen tag and children: the caller owns that element's valid HTML/SVG placement, content model, semantics, and native attributes. Void HTML elements (such as `img`, `input`, or `br`) cannot receive children or HTML content. A type-level tag name does not certify every tag/content combination.

`as` lấy từ `keyof React.JSX.IntrinsicElements`, không phải danh sách biến thể hữu hạn của hệ thống. Card chuyển tiếp thẻ và phần tử con; bên gọi chịu trách nhiệm về vị trí HTML/SVG, mô hình nội dung, ngữ nghĩa và thuộc tính gốc hợp lệ. Thẻ HTML rỗng như `img`, `input`, `br` không nhận phần tử con hay nội dung HTML. Tên thẻ hợp lệ về kiểu không chứng nhận mọi tổ hợp thẻ/nội dung.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Card

[Khai báo / Declaration](Card.d.ts) · [Nguồn / Source](Card.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `as` | optional | Không khai báo trong tham số / Not declared in parameter |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `flat` | optional | `false` |
| `interactive` | optional | `false` |

API kế thừa: 279 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Card.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 279 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Card.runtime.defaultExpressions` in the canonical source facts.

### CardBody

[Khai báo / Declaration](Card.d.ts) · [Nguồn / Source](Card.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| Không có / None declared | — | — |

API kế thừa: 280 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `CardBody.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 280 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `CardBody.runtime.defaultExpressions` in the canonical source facts.

### CardFooter

[Khai báo / Declaration](Card.d.ts) · [Nguồn / Source](Card.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| Không có / None declared | — | — |

API kế thừa: 280 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `CardFooter.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 280 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `CardFooter.runtime.defaultExpressions` in the canonical source facts.

### CardHeader

[Khai báo / Declaration](Card.d.ts) · [Nguồn / Source](Card.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `subtitle` | optional | Không khai báo trong tham số / Not declared in parameter |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 279 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `CardHeader.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 279 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `CardHeader.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
