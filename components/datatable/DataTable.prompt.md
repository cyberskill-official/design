<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**DataTable** — bảng có ngữ nghĩa với caption, tiêu đề cột có phạm vi, `render` cho từng cột và bộ ba bất đồng bộ (`idle` / `loading` / `error`). Nội dung dày nên luôn đặt trên bề mặt đặc (không dùng glass). Dùng `state` khi host sở hữu việc tải dữ liệu — không hiển thị rỗng trong lúc tải.

```jsx
<DataTable
  caption="Releases"
  columns={[
    { key: "ver", header: "Version" },
    { key: "date", header: "Ships" },
    { key: "status", header: "Status", render: (r) => <span className={`pill ${r.tone}`}>{r.status}</span> },
  ]}
  rows={releases}
  rowKey="ver"
  state={status} /* "idle" | "loading" | "error" */
  emptyState="No releases yet"
/>
```

Slot caption trong bảng idle và bảng loading mặc định giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

Chế độ tải mặc định làm tròn xuống `loadingRows` dạng phân số hữu hạn, tối thiểu một. Số lượng không hữu hạn hoặc không biểu diễn được dùng năm; `loadingState` do bên sử dụng cung cấp vẫn có thẩm quyền.

Bàn phím: Bảng có ngữ nghĩa này không thêm trình xử lý điều hướng; Tab native tới các điều khiển trong ô. Bên sử dụng sở hữu việc tải dữ liệu, trạng thái và thao tác thử lại. Loading đặt aria-busy và render nội dung tải ẩn; không thiết lập live region polite. Error bọc nội dung lỗi tùy chỉnh/mặc định bằng role=alert.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Nội dung rỗng/tải/lỗi tích hợp được bản địa hóa. Tiêu đề, caption, ô và nội dung thay thế trạng thái vẫn do bên sử dụng sở hữu. Cung cấp rowKey duy nhất và ổn định; khóa mặc định dự phòng bằng chỉ số hàng.

Bằng chứng nguồn: `DataTable.jsx` và `DataTable.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- DataTable: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**DataTable** — semantic table with a caption, scoped column headers, per-column `render`, and an async triad (`idle` / `loading` / `error`). Dense content, so it stays on a solid surface (never glass). Use `state` when the host owns a fetch — do not show empty while loading.

```jsx
<DataTable
  caption="Releases"
  columns={[
    { key: "ver", header: "Version" },
    { key: "date", header: "Ships" },
    { key: "status", header: "Status", render: (r) => <span className={`pill ${r.tone}`}>{r.status}</span> },
  ]}
  rows={releases}
  rowKey="ver"
  state={status} /* "idle" | "loading" | "error" */
  emptyState="No releases yet"
/>
```

The caption in idle and default loading tables slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

The default loading view rounds finite fractional `loadingRows` down with a minimum of one. Nonfinite or unrepresentable counts use five; caller-provided `loadingState` remains authoritative.

Keyboard: This semantic table adds no navigation handler; native Tab reaches controls supplied in cells. The caller owns fetching, state and any retry actions. Loading sets aria-busy and renders hidden loading text; it does not establish a polite live region. Error uses role=alert around the supplied/default error content.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Built-in empty/loading/error copy is localized. Headers, captions, cell content and state overrides remain caller-owned. Provide unique stable rowKey values; default keys fall back to row indices.

Source evidence: `DataTable.jsx` and `DataTable.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- DataTable: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### DataTable

[Khai báo / Declaration](DataTable.d.ts) · [Nguồn / Source](DataTable.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `caption` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `columns` | required | Không khai báo trong tham số / Not declared in parameter |
| `emptyState` | optional | Không khai báo trong tham số / Not declared in parameter |
| `errorState` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `loadingRows` | optional | `5` |
| `loadingState` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rowKey` | optional | `"id"` |
| `rows` | required | Không khai báo trong tham số / Not declared in parameter |
| `state` | optional | `"idle"` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `DataTable.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `DataTable.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
