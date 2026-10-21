<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**TextField** — ô nhập văn bản có nhãn, mô tả tùy chọn và lỗi nội dòng. Nhãn luôn được liên kết; lỗi thông báo qua `role="alert"`. Giữ nguyên dấu tiếng Việt và tổ hợp IME.

```jsx
<TextField label="Work email" type="email" placeholder="you@company.com" />
<TextField label="Tên của bạn" description="Vietnamese diacritics welcome" />
<TextField label="Email" error="Enter a valid email address." defaultValue="nope" />
```

- **label** (tùy chọn khi có context của trường hoặc tên ARIA tường minh), **description** (trợ giúp), **error** (nội dòng + `aria-invalid`).

- Chuyển tiếp toàn bộ prop native `<input>` (`type`, `placeholder`, `value`, `disabled`, `readOnly`, …).

ID `aria-describedby` của bên gọi được giữ cùng ID trợ giúp/lỗi cục bộ. `error` cục bộ buộc `aria-invalid=true`; khi không có lỗi cục bộ hay từ FormField bao quanh, giữ giá trị `aria-invalid` của bên gọi. Phần tử được tham chiếu bên ngoài phải tồn tại trong cùng tài liệu.

Nhãn ReactNode và nội dung tùy chọn giữ số `0`. Nội dung tùy chọn vẫn bỏ `null`, `false` và chuỗi rỗng. Lỗi có giá trị bằng 0 vẫn render alert, kiểu invalid và tham chiếu ARIA giống lỗi văn bản.

Bàn phím: Dùng hành vi chỉnh sửa, tiêu điểm, disabled/readOnly và IME native của input; không thêm trình xử lý bàn phím tùy chỉnh. Cung cấp tên hỗ trợ tiếp cận qua nhãn cục bộ, FormField bao quanh hoặc tên ARIA tường minh, cùng thuộc tính input native theo ngữ cảnh.

Bản địa hóa: Nhãn, mô tả, lỗi và placeholder do bên sử dụng sở hữu. Component giữ văn bản được nhập, không dịch nó.

Bằng chứng nguồn: `TextField.jsx` và `TextField.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- TextField: ref trỏ tới HTMLInputElement (input); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

Đặt tên trường native: Nhãn nhìn thấy do component sở hữu có ID span ổn định và cung cấp `aria-labelledby`, vì vậy hint/lỗi đã render, nơi được hỗ trợ, vẫn là mô tả `aria-describedby` thay vì trở thành một phần tên. Giữ nhãn số `0`. Chuỗi `aria-label`/`aria-labelledby` tường minh của bên gọi (kể cả rỗng/sai) không đổi; prop đặt tên null/undefined bị bỏ qua để cho phép nhãn sở hữu làm dự phòng. ID mô tả của bên gọi và component được ghép không trùng. DOM hiện có, ref native/root và ngữ nghĩa gửi form vẫn có thẩm quyền.


Liên kết trường: TextField dùng context liên kết của FormField bao quanh. Nhãn cục bộ có ý nghĩa hoặc tên ARIA bên ngoài tường minh giữ ưu tiên đặt tên; hint/lỗi kế thừa ghép với ID mô tả của bên gọi và cục bộ. Required kế thừa dùng trạng thái required native của input. Mỗi TextField giữ ID input tự sinh hoặc tường minh riêng, kể cả nhiều trường trong một FormField. Lỗi bao quanh vẫn là một thông điệp; lỗi cục bộ vẫn cục bộ. Cập nhật context giữ danh tính input native, giá trị, vùng chọn và ref input được chuyển tiếp hiện có.


`label` cục bộ là tùy chọn khi `FormField` bao quanh cung cấp tên hoặc bên gọi cung cấp `aria-label`/`aria-labelledby`. Bên gọi vẫn chịu trách nhiệm về tên hỗ trợ tiếp cận có ý nghĩa; bỏ mọi nguồn đặt tên không tạo ra tên dự phòng.

## English
<!-- END GENERATED VI PROMPT v1 -->
**TextField** — labelled text input with optional description and inline error. The label is always associated; errors announce via `role="alert"`. Vietnamese diacritics and IME composition are preserved.

```jsx
<TextField label="Work email" type="email" placeholder="you@company.com" />
<TextField label="Tên của bạn" description="Vietnamese diacritics welcome" />
<TextField label="Email" error="Enter a valid email address." defaultValue="nope" />
```

- **label** (optional when supplied by field context or explicit ARIA naming), **description** (helper), **error** (inline + `aria-invalid`).

- Passes through all native `<input>` props (`type`, `placeholder`, `value`, `disabled`, `readOnly`, …).

Caller `aria-describedby` IDs are retained alongside local help/error IDs. A
local `error` forces `aria-invalid=true`; without a local or enclosing FormField error, the caller-provided
`aria-invalid` value is preserved. External referenced elements must exist in
the same document.

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings. A zero-valued error renders its alert, invalid styling and ARIA references just like a text error.

Keyboard: Uses native input editing, focus, disabled/readOnly and IME behavior; it adds no custom keyboard handler. Provide an accessible name through the local label, enclosing FormField or explicit ARIA naming, plus contextual native input attributes.

Localization: Labels, descriptions, errors and placeholder text are caller-owned. It preserves the entered text and does not translate it.

Source evidence: `TextField.jsx` and `TextField.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- TextField: ref targets HTMLInputElement (input); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

Native field naming: the owned visible label has a stable span ID and supplies `aria-labelledby`, so rendered hint/error text, where supported, remains an `aria-describedby` description rather than becoming part of the name. Numeric `0` labels are retained. Explicit caller `aria-label`/`aria-labelledby` strings (including empty/invalid strings) remain unchanged; null/undefined naming props are omitted and allow the owned-label fallback. Caller and owned description IDs are merged without duplicates. Existing DOM, native/root refs and form submission semantics remain authoritative.


Field association: TextField consumes the enclosing FormField association context. A meaningful local label or explicit external ARIA name retains naming precedence; inherited hints/errors merge with caller and local description IDs. Inherited required uses the native input required state. Each TextField keeps its own generated or explicit input ID, including multiple fields in one FormField. The enclosing error remains a single message; local errors remain local. Context updates preserve native input identity, value, selection and the existing forwarded input ref.


The local `label` is optional when an enclosing `FormField` supplies a name or the caller supplies `aria-label`/`aria-labelledby`. Callers remain responsible for a meaningful accessible name; omitting all naming sources does not create a fallback name.
<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### TextField

[Khai báo / Declaration](TextField.d.ts) · [Nguồn / Source](TextField.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 310 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 2 mặc định tham số cho thuộc tính kế thừa; xem `TextField.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 310 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 2; see `TextField.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
