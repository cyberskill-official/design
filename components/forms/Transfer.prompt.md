<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Transfer** — chuyển mục đã chọn giữa danh sách nguồn/đích (tiêu đề song ngữ).

```jsx
<Transfer items={[{key:"a",label:"Web app"}]} value={sel} onChange={setSel}/>
```

`value` là danh sách khóa đích do bên gọi điều khiển; áp dụng `onChange` để chuyển mục. Lựa chọn checkbox là nội bộ và giữ qua render lại thông thường. Xóa mục xóa lựa chọn nội bộ của nó; callback chuyển không bao giờ thêm mục đã chọn nhưng không tồn tại. Khóa đích hiện có vẫn do bên gọi sở hữu. Dùng khóa mục chuỗi duy nhất.

Danh sách nguồn và đích chia chiều rộng khả dụng quanh các nút chuyển. Nhãn xuống dòng trong danh sách hẹp; vùng chạm hàng và nút chuyển cho con trỏ thô giữ tối thiểu 44px mà không ép hai cột rộng cố định lên trang.

Bàn phím: Tab tới checkbox hàng và nút chuyển native; Space đổi trạng thái hàng, Enter/Space kích hoạt chuyển. Áp dụng `onChange` vào khóa đích do bên gọi điều khiển.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Tiêu đề tùy chỉnh và nhãn mục vẫn do bên gọi sở hữu.

Bằng chứng nguồn: `Transfer.jsx` và `Transfer.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Transfer: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Transfer** — move checked items between source/target lists (bilingual titles).

```jsx
<Transfer items={[{key:"a",label:"Web app"}]} value={sel} onChange={setSel}/>
```

`value` is the caller-controlled list of target keys; apply `onChange` to move
items. Checkbox selection is internal and survives ordinary rerenders. Removing
an item clears its internal selection; move callbacks never add absent checked
items. Existing target keys remain caller-owned. Use unique string item keys.

Source and target lists share the available width around the move buttons.
Labels wrap inside narrow lists; coarse-pointer row and move targets retain
their 44px minimum without imposing two fixed-width columns on the page.

Keyboard: Tab reaches native row checkboxes and move buttons; Space toggles a row and Enter/Space activates a move. Apply `onChange` to the caller-controlled target keys.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Custom titles and item labels remain caller-owned.

Source evidence: `Transfer.jsx` and `Transfer.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Transfer: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Transfer

[Khai báo / Declaration](Transfer.d.ts) · [Nguồn / Source](Transfer.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `items` | required | `[]` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `titles` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | `[]` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Transfer.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Transfer.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
