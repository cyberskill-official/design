<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Spinner** — chỉ báo tải không xác định, màu thương hiệu; dừng quay liên tục khi giảm chuyển động được yêu cầu.

```jsx
<Spinner /> <Spinner size={28} label="Fetching releases" />
```

Bàn phím: Chỉ báo trạng thái không thêm thao tác bàn phím; bên gọi kiểm soát tải có hoạt động không.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng cung cấp không được dịch. Label được truyền thay tên tải đã bản địa hóa. Giảm chuyển động loại quay liên tục qua quy tắc hỗ trợ tiếp cận toàn cục.

Bằng chứng nguồn: `Spinner.jsx` và `Spinner.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Spinner: ref trỏ tới HTMLSpanElement (span); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Spinner** — indeterminate loading indicator, brand-coloured; stops continuous spinning under reduced-motion.

```jsx
<Spinner /> <Spinner size={28} label="Fetching releases" />
```

Keyboard: The status indicator adds no keyboard action; the caller controls whether loading is active.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. A supplied label overrides the localized loading name. Reduced-motion removes continuous spinning through the global accessibility rule.

Source evidence: `Spinner.jsx` and `Spinner.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Spinner: ref targets HTMLSpanElement (span); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Spinner

[Khai báo / Declaration](Spinner.d.ts) · [Nguồn / Source](Spinner.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `size` | optional | `20` |

API kế thừa: 280 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Spinner.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 280 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Spinner.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
