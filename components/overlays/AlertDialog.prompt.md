<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**AlertDialog** — modal xác nhận / phá hủy hạng nhất (`role="alertdialog"`). Khác Popconfirm (bóng inline) và Dialog (modal tổng quát). Confirm/Cancel song ngữ qua registry.

```jsx
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete workspace?"
  description="Removes every project. This cannot be undone."
  tone="destructive"
  onConfirm={wipe}
/>
```

Hiệu ứng xuất hiện mờ dần giữ kích thước Confirm/Cancel và giữ lớp phủ fixed lồng nhau trong viewport. Giảm chuyển động loại hiệu ứng này. Vật liệu kính có filter dùng lớp nền filter trang trí cùng cấp; nội dung giữ scope ngôn ngữ và token kế thừa. Markup máy chủ giữ vật liệu thông thường cho tới khi lớp nền sẵn sàng sau hydration.

Bàn phím: Lớp modal chuyển tiêu điểm và giữ Tab/Shift+Tab bên trong. Cảnh báo phá hủy ban đầu focus Cancel; xác nhận thông thường ban đầu focus Confirm. Confirm đóng hoặc yêu cầu đóng trước khi gọi onConfirm; Cancel, nền và Escape cũng gọi onCancel. open được kiểm soát yêu cầu bên gọi áp dụng onOpenChange. Callback là thông báo đồng bộ; UI không thực thi, cho phép hay đợi thao tác có hệ quả.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Confirm/Cancel mặc định được bản địa hóa. Tiêu đề, mô tả, children và nhãn ghi đè do bên gọi quản lý. Cung cấp tiêu đề có nghĩa và mô tả ngắn phù hợp thao tác.

Bằng chứng nguồn: `AlertDialog.jsx` và `AlertDialog.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Khi cung cấp cả `tone` và `variant`, `tone` được ưu tiên (`tone ?? variant`). Cả hai chấp nhận vốn giá trị `default` / `destructive` hiện có.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- AlertDialog: ref trỏ tới HTMLElement (role=alertdialog); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

**Ưu tiên alias:** `tone` là tên chuẩn; `variant` tiếp tục được hỗ trợ làm alias tương thích. `tone` tường minh được ưu tiên, kể cả `tone="default"` cùng `variant="destructive"`. Khi bỏ `tone`, `variant="destructive"` chọn màu danger và focus Cancel ban đầu. Bỏ cả hai chọn focus Confirm thông thường. Các giá trị này riêng cho AlertDialog; `danger` của Button và `error` của kiểm định không phải alias thay thế được. Không có thông báo loại bỏ đang hiệu lực.

## English
<!-- END GENERATED VI PROMPT v1 -->
**AlertDialog** — first-class confirm / destructive modal (`role="alertdialog"`). Distinct from Popconfirm (inline bubble) and Dialog (general modal). Bilingual Confirm/Cancel via the registry.

```jsx
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete workspace?"
  description="Removes every project. This cannot be undone."
  tone="destructive"
  onConfirm={wipe}
/>
```

A fade entrance preserves Confirm/Cancel dimensions and keeps nested fixed overlays in the viewport. Reduced motion removes it. Filtered glass materials use a decorative sibling filter backing; content keeps its inherited language and token scope. Server markup keeps the ordinary material until the backing is ready after hydration.

Keyboard: The modal layer moves focus and traps Tab/Shift+Tab. Destructive alerts initially focus Cancel; ordinary confirmations initially focus Confirm. Confirm closes or requests closure before invoking onConfirm; Cancel, backdrop and Escape also invoke onCancel. Controlled open requires the caller to apply onOpenChange. Callbacks are synchronous notifications; the UI does not execute, authorize or await the consequential operation.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Confirm/Cancel defaults are localized. Title, description, children and label overrides remain caller-owned. Supply a meaningful title and a short description suited to the operation.

Source evidence: `AlertDialog.jsx` and `AlertDialog.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

When both `tone` and `variant` are supplied, `tone` takes precedence (`tone ?? variant`). Both accept the existing `default` / `destructive` vocabulary.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- AlertDialog: ref targets HTMLElement (role=alertdialog); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

**Alias precedence:** `tone` is the canonical spelling; `variant` remains supported as a compatibility alias. An explicit `tone` wins, including `tone="default"` with `variant="destructive"`. When `tone` is omitted, `variant="destructive"` selects danger paint and initial Cancel focus. Omission of both selects normal Confirm focus. These values are specific to AlertDialog; Button `danger` and validation `error` are not interchangeable aliases. No removal notice is in force.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### AlertDialog

[Khai báo / Declaration](AlertDialog.d.ts) · [Nguồn / Source](AlertDialog.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `cancelLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `confirmLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultOpen` | optional | `false` |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onCancel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onConfirm` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onOpenChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `open` | optional | Không khai báo trong tham số / Not declared in parameter |
| `title` | required | Không khai báo trong tham số / Not declared in parameter |
| `tone` | optional | Không khai báo trong tham số / Not declared in parameter |
| `variant` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 276 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `AlertDialog.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 276 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `AlertDialog.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
