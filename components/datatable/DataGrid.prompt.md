<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**DataGrid** — bảng có sắp xếp và chọn hàng, với tiêu đề cố định.

```jsx
<DataGrid selectable selected={sel} onSelect={setSel} rowKey="key"
  columns={[{key:"name",header:"Project",sortable:true},{key:"pct",header:"Progress",sortable:true}]} rows={rows}/>
```

**filterText / filterKeys / pinned:** truy vấn lọc phía client, tập khóa con tùy chọn và ghim cột cố định.

**virtual / virtualThreshold / rowHeight:** hiển thị một cửa sổ hàng cho tập dữ liệu lớn (tự động khi rows ≥ 80). Đặt `data-virtual="true"`, `data-row-count` và `data-row-height` đã xác định. Ước lượng `rowHeight` dương là mức tối thiểu: phép tính cửa sổ và chiều cao tối thiểu của hàng đã render dùng chiều cao tự nhiên của hàng đang mount nếu lớn hơn. Đo lường phản ứng với resize, kiểu của tổ tiên, font và chế độ con trỏ, để điều khiển chạm không âm thầm cao hơn phép tính khoảng đệm. Nên dùng hàng đồng đều; nội dung chiều cao thay đổi chưa xuất hiện vẫn là ước lượng.

**persistKey:** lưu thứ tự cột trong `localStorage` dưới `cs:datagrid:cols:<persistKey>`; thao tác ghim chuyển cột lên đầu.

Khi số hàng hoặc kết quả lọc giảm, ảo hóa chặn cửa sổ hiển thị về các hàng còn lại thay vì giữ khoảng đệm cũ và thân bảng trắng. Dữ liệu rỗng dùng trạng thái rỗng thông thường; dữ liệu đến sau có thể render lại mà không mount lại grid.

Các slot caption giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

Tên hỗ trợ tiếp cận đã bản địa hóa của checkbox chọn từng hàng chứa giá trị ô chuỗi không rỗng đầu tiên (hoặc khóa hàng làm dự phòng).

Thao tác ghim cột tham chiếu tiêu đề đã render và nội dung hành động đã bản địa hóa. Tiêu đề ReactNode giữ văn bản hỗ trợ tiếp cận thay vì trở thành chuỗi đối tượng; thiếu tiêu đề thì dùng khóa cột. ID duy nhất theo grid, tên cập nhật theo tiêu đề, ngôn ngữ và thứ tự cột.

Bàn phím: Đây là bảng có ngữ nghĩa với nút sắp xếp và checkbox chọn native, thay vì widget grid điều khiển bằng phím mũi tên. Enter/Space luân phiên cột có thể sắp xếp qua tăng dần, giảm dần và không sắp xếp, hoặc đổi checkbox. Bên sử dụng áp dụng selected/onSelect và cung cấp rowKey duy nhất, ổn định cho hàng có thể chọn. Chọn tất cả tác động lên tập đã lọc và xóa lựa chọn khi toàn bộ tập đó đã được chọn.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung do bên sử dụng cung cấp không được dịch. Nội dung rỗng/chọn/ghim được tích hợp. Tiêu đề cột, caption, ô đã render và nội dung rỗng tùy chỉnh vẫn do bên sử dụng sở hữu. Sắp xếp so sánh giá trị được truyền vào; lọc chuyển giá trị thô về chữ thường thay vì văn bản ô đã render và bản địa hóa. Dùng chiều cao hàng đồng đều cho cửa sổ hiển thị; chiều cao biến đổi chưa xuất hiện vẫn là ước lượng.

Bằng chứng nguồn: `DataGrid.jsx` và `DataGrid.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Bảng ảo công bố tổng số hàng đã lọc cộng hàng tiêu đề qua `aria-rowcount`; tiêu đề là hàng 1, hàng dữ liệu đã render giữ `aria-rowindex` tuyệt đối từ 2. Bảng rỗng tính hàng phản hồi là hàng 2. Hàng đệm được ẩn khỏi công nghệ hỗ trợ.

`rootProps` trỏ tới vùng cuộn hiện có, không phải bảng. Nó nhận thuộc tính native, thuộc tính data, style và sự kiện. Không thêm phần tử bọc hoặc hợp đồng ref. Ngữ nghĩa/trạng thái do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước callback của bên sử dụng.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- DataGrid: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**DataGrid** — sortable + selectable table with sticky header.

```jsx
<DataGrid selectable selected={sel} onSelect={setSel} rowKey="key"
  columns={[{key:"name",header:"Project",sortable:true},{key:"pct",header:"Progress",sortable:true}]} rows={rows}/>
```

**filterText / filterKeys / pinned:** client filter query, optional key subset, and sticky column pin.

**virtual / virtualThreshold / rowHeight:** windowed body rows for large datasets (auto when rows ≥ 80). Sets `data-virtual="true"`, `data-row-count` and the resolved `data-row-height`. The positive `rowHeight` estimate is a minimum: window math and rendered row floors use the natural height of mounted rows when larger. Measurement reacts to resizing, ancestor styling, fonts and pointer mode, so touch controls cannot silently outgrow the spacer calculation. Uniform rows are recommended; unseen variable-height content is still estimated.

**persistKey:** stores column order in `localStorage` under `cs:datagrid:cols:<persistKey>`; pin control reorders a column to first.

When rows or filtered results shrink, virtualization clamps the visible window to the remaining rows instead of leaving stale spacer padding and a blank body. Empty data uses the normal empty state; later data can render again without remounting the grid.

The caption slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Each row selection checkbox includes its first nonempty string cell value (or row key as fallback) in its localized accessible name.

Column pin actions reference the rendered header and localized action text.
ReactNode headers retain their accessible text rather than becoming object
strings; a missing header uses the column key. IDs are unique per grid and names
follow header, language and column-order updates.

Keyboard: This is a semantic table with native sorting buttons and selection checkboxes, rather than an arrow-key grid widget. Enter/Space cycles a sortable column ascending, descending and unsorted, or toggles a checkbox. The caller applies selected/onSelect and supplies unique stable rowKey values for selectable rows. Select-all acts on the filtered set and clears the selection when that set is fully selected.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Empty/select/pin action text is built in. Column headers, captions, rendered cells and custom empty content remain caller-owned. Sorting compares supplied values; filtering lowercases raw values rather than localized rendered cell text. Use uniform row heights for windowing; unseen variable heights remain estimates.

Source evidence: `DataGrid.jsx` and `DataGrid.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Virtual tables expose the complete filtered row count plus their header as `aria-rowcount`; the header is row 1 and rendered data rows retain absolute `aria-rowindex` values starting at 2. An empty table counts its feedback row as row 2. Spacer rows remain hidden from assistive technology.

`rootProps` targets the existing scroll container, not the table. It accepts native attributes, data attributes, style and events. It does not add a wrapper or ref contract. Component-owned semantics/state remain controlled; internal event handlers run before consumer callbacks.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- DataGrid: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### DataGrid

[Khai báo / Declaration](DataGrid.d.ts) · [Nguồn / Source](DataGrid.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `caption` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `columns` | required | `[]` |
| `empty` | optional | Không khai báo trong tham số / Not declared in parameter |
| `filterKeys` | optional | Không khai báo trong tham số / Not declared in parameter |
| `filterText` | optional | Không khai báo trong tham số / Not declared in parameter |
| `height` | optional | `280` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onSelect` | optional | Không khai báo trong tham số / Not declared in parameter |
| `persistKey` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rowHeight` | optional | `36` |
| `rowKey` | optional | `"id"` |
| `rows` | required | `[]` |
| `selectable` | optional | `false` |
| `selected` | optional | `[]` |
| `virtual` | optional | `false` |
| `virtualThreshold` | optional | `80` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `DataGrid.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `DataGrid.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
