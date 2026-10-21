<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**NativeSelect** — `<select>` native tăng cường dần, dùng style token CS bên cạnh Select. Hỗ trợ `size`, label và lỗi nội dòng.

```jsx
<NativeSelect
  label="Squad"
  size="sm"
  options={[{value:"plat",label:"Platform"},{value:"ai",label:"AI"}]}
  defaultValue="ai"
/>
```

ID `aria-describedby` của bên gọi được giữ cùng ID lỗi cục bộ. Không có slot trợ giúp/mô tả tích hợp; cung cấp phần tử trợ giúp trong tài liệu của bên sử dụng rồi tham chiếu qua `aria-describedby`. `error` cục bộ buộc `aria-invalid=true`; khi không có, giữ giá trị `aria-invalid` của bên gọi. Phần tử được tham chiếu bên ngoài phải có trong cùng tài liệu.

Nhãn ReactNode và nội dung tùy chọn giữ số `0`. Nội dung tùy chọn vẫn bỏ `null`, `false` và chuỗi rỗng. Lỗi có giá trị bằng 0 vẫn render alert, kiểu invalid và tham chiếu ARIA giống lỗi văn bản.

Bàn phím: Dùng tiêu điểm, điều hướng và lựa chọn select native; hành vi popup của trình duyệt/hệ điều hành vẫn native.

Bản địa hóa: Nhãn, option và lỗi do bên gọi sở hữu; phần bọc này không có placeholder bản địa hóa hoặc danh sách option mặc định.

Bằng chứng nguồn: `NativeSelect.jsx` và `NativeSelect.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Ref native (React 18/19):
- NativeSelect: ref trỏ tới HTMLSelectElement (select); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

Đặt tên trường native: Nhãn nhìn thấy do component sở hữu có ID span ổn định và cung cấp `aria-labelledby`, vì vậy hint/lỗi đã render, nơi được hỗ trợ, vẫn là mô tả `aria-describedby` thay vì trở thành một phần tên. Giữ nhãn số `0`. Chuỗi `aria-label`/`aria-labelledby` tường minh của bên gọi (kể cả rỗng/sai) không đổi; prop đặt tên null/undefined bị bỏ qua để cho phép nhãn sở hữu làm dự phòng. ID mô tả của bên gọi và component được ghép không trùng. DOM hiện có, ref native/root và ngữ nghĩa gửi form vẫn có thẩm quyền.

## English
<!-- END GENERATED VI PROMPT v1 -->
**NativeSelect** — progressive-enhancement native `<select>` styled to CS tokens beside Select. Supports `size`, label, and inline error.

```jsx
<NativeSelect
  label="Squad"
  size="sm"
  options={[{value:"plat",label:"Platform"},{value:"ai",label:"AI"}]}
  defaultValue="ai"
/>
```

Caller `aria-describedby` IDs are retained alongside the local error ID.
There is no built-in help/description slot; provide any help element in the
consumer document and reference it with `aria-describedby`. A
local `error` forces `aria-invalid=true`; without one, the caller-provided
`aria-invalid` value is preserved. External referenced elements must exist in
the same document.

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings. A zero-valued error renders its alert, invalid styling and ARIA references just like a text error.

Keyboard: Uses native select focus, navigation and selection; browser/OS popup behavior remains native.

Localization: Labels, options and errors are caller-owned; this wrapper has no localized placeholder or default option list.

Source evidence: `NativeSelect.jsx` and `NativeSelect.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Native refs (React 18/19):
- NativeSelect: ref targets HTMLSelectElement (select); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

Native field naming: the owned visible label has a stable span ID and supplies `aria-labelledby`, so rendered hint/error text, where supported, remains an `aria-describedby` description rather than becoming part of the name. Numeric `0` labels are retained. Explicit caller `aria-label`/`aria-labelledby` strings (including empty/invalid strings) remain unchanged; null/undefined naming props are omitted and allow the owned-label fallback. Caller and owned description IDs are merged without duplicates. Existing DOM, native/root refs and form submission semantics remain authoritative.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### NativeSelect

[Khai báo / Declaration](NativeSelect.d.ts) · [Nguồn / Source](NativeSelect.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `options` | optional | Không khai báo trong tham số / Not declared in parameter |
| `size` | optional | `"md"` |

API kế thừa: 286 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 1 mặc định tham số cho thuộc tính kế thừa; xem `NativeSelect.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 286 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 1; see `NativeSelect.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
