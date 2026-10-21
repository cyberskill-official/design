<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Chart** — SVG cột/đường/spark/tròn có màu token (theo accent; giá trị trong aria).

```jsx
<Chart type="bar" showValues data={[{label:"W28",value:11},{label:"W29",value:8}]}/>
```

`label` không trống cung cấp tên tiếp cận của ảnh. Nếu không, tên dùng nhãn và giá trị dữ liệu cung cấp; dữ liệu rỗng dùng “Biểu đồ chưa có dữ liệu” / “Chart with no data”. Nhãn chỉ có khoảng trắng dùng cùng dự phòng. Tên không dữ liệu theo `lang` tường minh hoặc scope ngôn ngữ kế thừa và cập nhật khi scope đổi. Nhãn dữ liệu do bên gọi quản lý; giá trị số giữ cách hiển thị số thô hiện có. Dự phòng này không thêm panel trạng thái rỗng hiển thị hay định dạng số theo locale.

Với biểu đồ tròn có dữ liệu hữu hạn không âm, một mục dương chiếm toàn bộ tổng được vẽ thành hình tròn đầy đủ. Mục bằng không vẫn trong chú giải và tóm tắt tiếp cận nhưng không vẽ lát. Lát từng phần thông thường dùng hình học hình quạt hiện có.

Bàn phím: Figure được cung cấp như một ảnh có tên, với nội dung SVG trang trí; component không có control bàn phím tương tác. Cung cấp dữ liệu phù hợp loại trực quan chọn, giá trị hữu hạn không âm và chiều cao dương hữu ích. Giới hạn đầu vào phía gọi này là hướng dẫn, không phải chuẩn hóa runtime hay bằng chứng cho giá trị số tùy ý.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Chỉ dự phòng không dữ liệu được dịch. Nhãn dữ liệu và nhãn tùy chỉnh do bên gọi quản lý; giá trị hiển thị như số thô. Cung cấp tóm tắt tiếp cận phù hợp dữ liệu hoặc bảng chi tiết bên cạnh khi cần.

Bằng chứng nguồn: `Chart.jsx` và `Chart.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử figure hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Chart: ref trỏ tới HTMLElement (figure); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Chart** — token-colored SVG bar/line/spark/pie (accent-aware; values in aria).

```jsx
<Chart type="bar" showValues data={[{label:"W28",value:11},{label:"W29",value:8}]}/>
```

A nonblank `label` supplies the image's accessible name. Otherwise the name uses
the supplied datum labels and values; empty data uses “Biểu đồ chưa có dữ liệu” /
“Chart with no data”. Whitespace-only labels use the same fallback. The no-data
name follows explicit `lang` or the inherited language scope and updates when
that scope changes. Datum labels remain caller-owned; numeric values retain the
existing raw-number rendering. This fallback does not add a visible empty-state
panel or locale number formatting.

For pie charts with finite nonnegative data, a positive datum holding the entire total renders a full circle. Zero-valued data remain in the legend and accessible summary but draw no sector. Ordinary partial sectors use the existing wedge geometry.

Keyboard: The figure is exposed as one named image, with decorative SVG content; this component has no interactive keyboard controls. Supply data suited to the selected visualization, finite nonnegative values and a useful positive height. These caller input limits are guidance, not runtime normalization or proof for arbitrary numeric values.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Only the no-data fallback is translated. Datum labels and custom label are caller-owned; values render as raw numbers. Provide an accessible summary suited to the data, or an adjacent detailed table where needed.

Source evidence: `Chart.jsx` and `Chart.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing figure element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Chart: ref targets HTMLElement (figure); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Chart

[Khai báo / Declaration](Chart.d.ts) · [Nguồn / Source](Chart.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `color` | optional | `"var(--cs-accent)"` |
| `data` | required | `[]` |
| `height` | optional | `160` |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `showValues` | optional | `false` |
| `type` | optional | `"bar"` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Chart.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Chart.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
