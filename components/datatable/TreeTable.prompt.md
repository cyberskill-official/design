<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**TreeTable** — các hàng lồng nhau có thể mở rộng trong bảng.

```jsx
<TreeTable defaultExpanded={["p"]} columns={[{key:"name",header:"Item"},{key:"pct",header:"Progress"}]}
  nodes={[{key:"p",name:"Platform",pct:"70%",children:[{key:"ds",name:"Design System",pct:"72%"}]}]}/>
```

Nút mở rộng công bố hành động Expand/Collapse đã bản địa hóa cùng nhãn ô đầu tiên đã render. Cung cấp nội dung ô đầu tiên có ý nghĩa, kể cả khi dùng renderer tùy chỉnh. Enter/Space native đóng/mở hàng; nhãn hành động theo thay đổi EN/VI trực tiếp mà không đặt lại trạng thái mở rộng.

Các slot caption giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

Nút của nhánh đang mở công bố `aria-controls` cho các hàng con trực tiếp thực tế. ID hàng dùng tiền tố React riêng cho từng bảng cộng khóa node duy nhất, nên nhiều bảng và việc đổi thứ tự theo key vẫn giữ quan hệ rõ ràng. Con đã thu gọn không được mount và ID không tồn tại của chúng không bị tham chiếu. Đây là bảng native với quan hệ disclosure, không phải treegrid hay công bố cấp bậc ARIA.

Bàn phím: Tab native tới nút nhánh; Enter/Space đóng/mở. Bảng hàng lồng có ngữ nghĩa này không thêm điều hướng mũi tên APG treegrid. defaultExpanded khởi tạo trạng thái mở rộng nội bộ một lần. Dùng khóa node duy nhất và nội dung ô đầu tiên có ý nghĩa để đặt tên nút mở rộng.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng cung cấp không được dịch. Nội dung rỗng và thao tác mở/thu tích hợp được bản địa hóa. Tiêu đề cột, caption và mọi nội dung ô vẫn do bên sử dụng sở hữu. Trạng thái mở rộng được giữ khi đổi ngôn ngữ.

Bằng chứng nguồn: `TreeTable.jsx` và `TreeTable.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- TreeTable: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**TreeTable** — expandable nested rows in a table.

```jsx
<TreeTable defaultExpanded={["p"]} columns={[{key:"name",header:"Item"},{key:"pct",header:"Progress"}]}
  nodes={[{key:"p",name:"Platform",pct:"70%",children:[{key:"ds",name:"Design System",pct:"72%"}]}]}/>
```

Expansion buttons expose the localized Expand/Collapse action together with their rendered first-cell label. Supply meaningful first-cell content, including when using a custom renderer. Native Enter/Space activation toggles the row; the action label follows live EN/VI changes without resetting expansion.

The caption slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Expanded branch buttons expose `aria-controls` for their actual direct child rows. Row IDs use a per-table React prefix plus the unique node key, so multiple tables and keyed reordering retain unambiguous relationships. Collapsed children remain unmounted and their absent IDs are not referenced. This is a native table with disclosure relationships, not a treegrid or an announcement of ARIA hierarchy levels.

Keyboard: Native Tab reaches branch buttons; Enter/Space toggles expansion. This semantic nested-row table adds no APG treegrid arrow navigation. defaultExpanded seeds internal expansion once. Use unique node keys and meaningful first-cell content to name expansion buttons.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Built-in empty and expand/collapse action text is localized. Column headers, caption and all cell content remain caller-owned. Expansion is preserved when language changes.

Source evidence: `TreeTable.jsx` and `TreeTable.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- TreeTable: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### TreeTable

[Khai báo / Declaration](TreeTable.d.ts) · [Nguồn / Source](TreeTable.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `caption` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `columns` | required | `[]` |
| `defaultExpanded` | optional | `[]` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `nodes` | required | `[]` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `TreeTable.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `TreeTable.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
