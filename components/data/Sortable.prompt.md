<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Sortable** — danh sách đổi thứ tự với nút lên/xuống (bàn phím + một con trỏ) và kéo HTML5 tùy chọn. Phối các cột danh sách này thành kanban.

```jsx
<Sortable items={tasks} onChange={setTasks} lang="en"/>
```

Nút cung cấp `aria-label` i18n (`moveUp` / `moveDown`); controls đầu/cuối bị vô hiệu hóa.

Thả lên mục khác chốt một danh sách đổi thứ tự. Kết thúc hoặc hủy kéo mà không thả xóa hiển thị hover/kéo và không phát thay đổi. Nút di chuyển vẫn là phương án dùng được bằng bàn phím.

Bàn phím: Tab native đến nút di chuyển đang bật; Enter/Space yêu cầu đổi một vị trí liền kề. Bên gọi phải áp dụng onChange vào items và cung cấp key duy nhất. Kéo HTML5 là bổ sung; không phát thay đổi nếu chưa thả hoàn tất. Chỉ mục helper đổi thứ tự nên là số nguyên hợp lệ.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Nhãn mục do bên gọi quản lý. Nhãn di chuyển tích hợp nêu hướng; nguồn này không thêm thông báo trực tiếp về vị trí mới.

Bằng chứng nguồn: `Sortable.jsx` và `Sortable.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử ul hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Sortable: ref trỏ tới HTMLUListElement (ul); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Sortable** — reorderable list with move-up/down buttons (keyboard + single-pointer) and optional HTML5 drag. Compose columns of it for a kanban.

```jsx
<Sortable items={tasks} onChange={setTasks} lang="en"/>
```

Buttons expose i18n `aria-label`s (`moveUp` / `moveDown`); first/last controls are disabled.

A drop on another item commits one reordered list. Ending or cancelling a drag without a drop clears hover/drag presentation and emits no change. Move buttons remain the keyboard-accessible alternative.

Keyboard: Native Tab reaches enabled move buttons; Enter/Space requests one adjacent reorder. The caller must apply onChange to items and provide unique keys. HTML5 drag is an enhancement; no change is emitted without a completed drop. Reorder helper indices should be valid whole numbers.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Item labels remain caller-owned. The built-in move labels name directions; this source does not add a live announcement of the new position.

Source evidence: `Sortable.jsx` and `Sortable.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing ul element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Sortable: ref targets HTMLUListElement (ul); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Sortable

[Khai báo / Declaration](Sortable.d.ts) · [Nguồn / Source](Sortable.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `items` | required | `[]` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Sortable.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Sortable.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
