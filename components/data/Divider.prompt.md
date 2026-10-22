<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Divider** — đường phân cách mảnh ấm. `label` căn giữa chữ giữa hai đường; `vertical` chia nội dung inline trong hàng flex.

```jsx
<Divider />
<Divider label="or" />
```

Dấu phân cách có nhãn giữ số không. Null, false và chuỗi rỗng dùng đường không nhãn. Nhãn được hiển thị ưu tiên hơn nhánh đường dọc.

Bàn phím: Dấu phân cách không thêm thao tác bàn phím. Nhãn được hiển thị dùng nhánh ngang có nhãn; `vertical` áp dụng cho đường không nhãn.

Bản địa hóa: Nội dung nhãn do bên gọi quản lý; component không có bản dịch tích hợp. Cung cấp nội dung hiển thị qua `label`; `children` không được hiển thị.

Bằng chứng nguồn: `Divider.jsx` và `Divider.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Divider: ref trỏ tới HTMLDivElement | HTMLHRElement (div/hr); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Divider** — warm hairline separator. `label` centres text between two rules; `vertical` splits inline content in a flex row.

```jsx
<Divider />
<Divider label="or" />
```

The labelled divider preserves numeric zero. Null, false and an empty string use the unlabelled rule. A rendered label takes precedence over the vertical-rule branch.

Keyboard: The separator adds no keyboard action. A rendered label uses the labelled horizontal branch; `vertical` applies to the unlabelled rule.

Localization: Label content is caller-owned; this component has no built-in translation. Supply visible content through `label`; `children` are not rendered.

Source evidence: `Divider.jsx` and `Divider.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Divider: ref targets HTMLDivElement | HTMLHRElement (div/hr); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Divider

[Khai báo / Declaration](Divider.d.ts) · [Nguồn / Source](Divider.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `vertical` | optional | `false` |

API kế thừa: 280 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Divider.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 280 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Divider.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
