<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**CitationList** — danh sách nguồn gốc được đánh số cho đầu ra AI (kết hợp với AIDisclosureBadge).

Tiêu đề tích hợp theo `lang` → phạm vi ngôn ngữ DOM gần nhất → ngôn ngữ tài liệu → mặc định tiếng Việt (`Nguồn` / `Sources`). Thay `label` để dùng nội dung của bên sử dụng, hoặc truyền `label={null}` để bỏ tiêu đề. Bên sử dụng cung cấp dữ liệu trích dẫn; component không xác minh độ chính xác của nguồn hay thẩm quyền backend.

```jsx
<CitationList items={[{title:"release-notes.md"},{title:"Task backlog",source:"Status Hub",href:"#"}]} />
```

Các slot nhãn tường minh và nguồn của mục giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

Bàn phím: Hàng có `href` là liên kết native, nhận tiêu điểm bằng Tab và kích hoạt bằng Enter; hàng không có liên kết không có thao tác bàn phím.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `CitationList.jsx` và `CitationList.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- CitationList: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**CitationList** — numbered provenance sources for AI output (pairs with AIDisclosureBadge).

Built-in heading follows `lang` → nearest DOM language scope → document language
→ Vietnamese default (`Nguồn` / `Sources`). Override `label` for caller-owned
content, or pass `label={null}` to omit the heading. Citation data is supplied by
the caller; this component does not verify source accuracy or backend authority.

```jsx
<CitationList items={[{title:"release-notes.md"},{title:"Task backlog",source:"Status Hub",href:"#"}]} />
```

The explicit label and item source slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Rows with `href` are native links reached with Tab and activated with Enter; rows without a link have no keyboard action.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `CitationList.jsx` and `CitationList.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- CitationList: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### CitationList

[Khai báo / Declaration](CitationList.d.ts) · [Nguồn / Source](CitationList.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `items` | optional | `[]` |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `CitationList.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `CitationList.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
