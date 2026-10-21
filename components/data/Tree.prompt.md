<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Tree** — phân cấp mở rộng với bàn phím APG (ArrowUp/Down di chuyển, ArrowRight/Left mở-đóng, Home/End) và chọn đơn.

```jsx
<Tree aria-label="Platform navigation" selected={k} onSelect={setK} nodes={[{key:"p",label:"Platform",children:[{key:"ds",label:"Design System"}]}]}/>
```

Tiêu điểm ở treeitem ngữ nghĩa mang trạng thái selected/expanded. Nhãn nên chứa mô tả không tương tác; hành động con không thuộc nhãn node. Dùng key node duy nhất và cung cấp aria-label hoặc aria-labelledby làm tên cây. Tên mục cha không gồm nhãn hậu duệ. Nút xoắn con trỏ mở/đóng mà không chọn; Enter/Space giữ lựa chọn cùng bật/tắt nhánh.

Key có thể là chuỗi rỗng hoặc tên thuộc tính JavaScript thông thường như `__proto__`; chúng vẫn là định danh node riêng biệt. Vùng mở rộng và lựa chọn trên con trỏ thô mỗi vùng cung cấp đích ít nhất44px, kể cả nhãn ngắn.

Bàn phím: Up/Down đi qua node hiển thị; Home/End đến hai đầu; Right mở hoặc vào nhánh; Left đóng hoặc đến cha. Enter/Space yêu cầu chọn và bật/tắt nhánh. selected do bên gọi kiểm soát; trạng thái nhánh là nội bộ. defaultOpen khởi tạo nhánh mới và giữ trạng thái nhánh hiện có qua cập nhật.

Bản địa hóa: Nhãn node và tên tiếp cận của cây do bên gọi quản lý; không có prop lang hay bản dịch tích hợp. Nhãn nên là nội dung mô tả không tương tác, với key duy nhất trong toàn hệ phân cấp.

Bằng chứng nguồn: `Tree.jsx` và `Tree.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Phím in được tìm theo tiền tố không phân biệt hoa/thường giữa node hiển thị (bộ đệm500ms; lặp ký tự quay vòng kết quả). `*` mở các nhánh anh em ở cấp đang focus. Mũi tên, Home/End và Enter/Space giữ hành vi hiện có; bỏ qua composition IME.

`rootProps` trỏ tới phần tử ul hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Ref native (React 18/19):
- Tree: ref trỏ tới HTMLUListElement (ul); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Tree** — expandable hierarchy with APG keyboard (ArrowUp/Down move, ArrowRight/Left expand-collapse, Home/End) and single select.

```jsx
<Tree aria-label="Platform navigation" selected={k} onSelect={setK} nodes={[{key:"p",label:"Platform",children:[{key:"ds",label:"Design System"}]}]}/>
```

Focus stays on the semantic treeitem carrying selected/expanded state. Labels
should contain descriptive, non-interactive content; child actions do not belong
inside a node label. Use unique node keys, and supply aria-label or aria-labelledby
for the tree name. Parent item names exclude descendant labels. Pointer twists
expand/collapse without selecting; Enter/Space retain selection plus branch toggle.

Keys may be empty strings or include ordinary JavaScript property names such as `__proto__`; they
remain distinct node identifiers. Coarse-pointer expansion and selection regions
each provide at least 44px targets, including short labels.

Keyboard: Up/Down traverse visible nodes; Home/End reach the ends; Right opens or enters a branch; Left collapses or moves to the parent. Enter/Space requests selection and toggles a branch. selected is caller-controlled; branch state is internal. defaultOpen seeds new branches and preserves existing branch state across updates.

Localization: Node labels and the tree accessible name are caller-owned; there is no lang prop or built-in translation. Labels should be descriptive non-interactive content, with unique keys across the hierarchy.

Source evidence: `Tree.jsx` and `Tree.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Printable keys perform case-insensitive prefix typeahead among visible nodes (500ms buffer; repeated characters cycle matches). `*` expands sibling branches at the focused level. Existing arrows, Home/End and Enter/Space retain their behavior; IME composition is ignored.

`rootProps` targets the existing ul element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Native refs (React 18/19):
- Tree: ref targets HTMLUListElement (ul); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Tree

[Khai báo / Declaration](Tree.d.ts) · [Nguồn / Source](Tree.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `aria-labelledby` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultOpen` | optional | `false` |
| `nodes` | required | `[]` |
| `onSelect` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `selected` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Tree.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Tree.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
