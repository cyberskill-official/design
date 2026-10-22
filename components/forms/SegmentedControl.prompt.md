<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**SegmentedControl** — nhóm toggle dạng viên cho một số lựa chọn loại trừ nhau (bộ đổi góc nhìn Status Hub). Điều khiển qua `value`/`onChange`. `mode="radio"` mặc định công bố radiogroup với option checked; đặt `mode="tabs"` cho bố cục tab/panel thực sự do bên gọi render.

```jsx
<SegmentedControl aria-label="View mode" value={lens} onChange={setLens}
  options={[{value:"board",label:"Board"},{value:"table",label:"Table"}]} />
```

Đặt `aria-orientation="vertical"` để điều hướng Up/Down và cung cấp bố cục dọc tương ứng (ví dụ `style={{flexDirection:"column"}}`). Mặc định ngang dùng Left/Right; phím trục khác được để cho trình duyệt. Cả hai mode/hướng giữ Home/End, quay vòng, tự chọn qua onChange và một điểm Tab. Đồng bộ value được điều khiển với onChange.

Trong mode tabs đã phân giải (`mode="tabs"` hoặc `role="tablist"` đã deprecated khi bỏ qua `mode`), từng mục nhận `id` và `aria-controls` cho panel bên gọi render. Cung cấp ID duy nhất toàn tài liệu (ví dụ tạo tiền tố bằng React.useId), đặt `role="tabpanel"` và `aria-labelledby` trên panel tương ứng, ẩn panel không hoạt động theo giá trị được điều khiển. Thêm `tabIndex={0}` cho panel không có phần tử nhận tiêu điểm ban đầu. Những thuộc tính này không tạo panel hay quản lý việc hiện/ẩn chúng.

Icon của option giữ số `0`; `null`, `false` và chuỗi rỗng bỏ slot icon.

Bàn phím: Ngang dùng Left/Right, dọc dùng Up/Down; Home/End và quay vòng chọn qua `onChange`. Space/Enter native kích hoạt option. Phím đang tổ hợp, đã hủy hoặc trục khác giữ hành vi trình duyệt. Mode radio mặc định dùng `aria-checked`; mode tabs đã phân giải dùng `aria-selected`. Giữ value được điều khiển và panel bên gọi render đồng bộ trong mode tabs.

Bản địa hóa: Nhãn/icon option và tên hỗ trợ tiếp cận của nhóm do bên gọi sở hữu. Không có option được dịch sẵn.

Bằng chứng nguồn: `SegmentedControl.jsx` và `SegmentedControl.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Ref native (React 18/19):
- SegmentedControl: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

### Hướng hiển thị / Orientation

`aria-orientation="horizontal"` dùng Left/Right; `vertical` dùng Up/Down. Cả hai quay vòng, hỗ trợ Home/End, di chuyển tiêu điểm và chọn qua `onChange`; giữ `value` được điều khiển. Phím trục khác giữ hành vi trình duyệt. Cung cấp bố cục nhìn thấy khớp hướng; điều khiển hướng Storybook đặt `flexDirection` thành `row` hoặc `column`.

Hướng ngang dùng Trái/Phải, hướng dọc dùng Lên/Xuống. Cả hai quay vòng, hỗ trợ Home/End, di chuyển tiêu điểm và chọn qua `onChange`; cập nhật `value` tương ứng. Phím của trục còn lại giữ hành vi trình duyệt. Cung cấp bố cục khớp hướng; điều khiển Storybook đặt `flexDirection` thành `row` hoặc `column`.

Mode đã phân giải sở hữu role của nhóm/mục. Cung cấp tên nhóm có ý nghĩa bằng `aria-label` hoặc `aria-labelledby`. Cả hai mode giữ ref phần tử bọc hiện có, callback, ID option và `aria-controls` do bên gọi sở hữu; không tự tạo input radio native, name, giá trị ẩn hoặc tuần tự hóa FormData. Ưu tiên `mode="tabs"` tường minh cho bên gọi tab/panel hiện có.

`role="tablist"` và `role="radiogroup"` tiếp tục là các alias ngữ nghĩa đã deprecated. Khi bỏ qua `mode`, chúng chọn phần tử con tab hoặc radio tương ứng; `mode` tường minh được ưu tiên. Giá trị role khác gây lỗi thay vì tạo role ARIA mâu thuẫn. Ưu tiên `mode="tabs"` hoặc `mode="radio"`; mặc định vẫn là radio. Không khẳng định đã công bố ngày/phiên bản thông báo: việc loại bỏ vẫn cần bản major sau ít nhất hai bản minor đã được phát hành và 90 ngày thông báo được ghi nhận.

Thay đổi role mặc định trong cây làm việc này được dự kiến cho bản major tương lai theo chính sách SemVer người dùng đã duyệt. `VERSION` không đổi; việc công bố thông báo ngừng hỗ trợ, thời điểm thông báo và chấp nhận phát hành vẫn được quản trị riêng. Xem `docs/decisions/component-widget-semantics.md`.

Mặc định là nhóm chọn một giá trị (`mode="radio"`, `aria-checked`). Dùng `mode="tabs"` cho cặp tab/panel do caller dựng. Cả hai giữ callback, ref, hướng và quy tắc bàn phím hiện có; caller đặt tên nhóm có nghĩa. Không tự tạo giá trị form. Thay đổi vai trò mặc định được dự kiến cho bản major sau; chỉnh sửa cục bộ không chứng minh đã công bố thông báo hay hoàn tất điều kiện phát hành.

## English
<!-- END GENERATED VI PROMPT v1 -->
**SegmentedControl** — pill toggle group for a few mutually exclusive options (the Status Hub lens switcher). Controlled via `value`/`onChange`. The default `mode="radio"` exposes a radiogroup with checked options; set `mode="tabs"` for an actual caller-rendered tab/panel composition.

```jsx
<SegmentedControl aria-label="View mode" value={lens} onChange={setLens}
  options={[{value:"board",label:"Board"},{value:"table",label:"Table"}]} />
```

Set `aria-orientation="vertical"` for Up/Down navigation and provide the matching
vertical layout (for example `style={{flexDirection:"column"}}`). Horizontal is
the default and uses Left/Right; keys on the other axis are left to the browser.
Both modes/orientations retain Home/End, wrapping, automatic selection via onChange
and one tab stop. Keep controlled value in sync with onChange.

In resolved tabs mode (`mode="tabs"` or deprecated `role="tablist"` when `mode` is omitted), each item accepts `id` and `aria-controls` for caller-rendered panels. Give IDs
unique across the document (for example, derive a prefix with React.useId), set
`role="tabpanel"` and `aria-labelledby` on the matching panel, and hide inactive
panels using the controlled value. Add `tabIndex={0}` to panels without an initial
focusable element. These attributes do not create panels or manage their visibility.

Option icons preserve numeric `0`; `null`, `false` and empty strings omit the icon slot.

Keyboard: Horizontal uses Left/Right, vertical uses Up/Down; Home/End and wrapping select through `onChange`. Space/native Enter activate an option. Composing, canceled and other-axis keys retain browser behavior. The default radio mode uses `aria-checked`; resolved tabs mode uses `aria-selected`. Keep value controlled and, in tabs mode, caller-rendered panels in sync.

Localization: Option labels/icons and the group’s accessible name are caller-owned. There are no built-in translated options.

Source evidence: `SegmentedControl.jsx` and `SegmentedControl.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Native refs (React 18/19):
- SegmentedControl: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

### Orientation / Hướng hiển thị

`aria-orientation="horizontal"` uses Left/Right; `vertical` uses Up/Down. Both wrap, support Home/End, move focus, and select through `onChange`; keep `value` controlled. Other-axis keys retain browser behavior. Supply matching visual layout; the Storybook orientation control sets `flexDirection` to `row` or `column`.

Hướng ngang dùng Trái/Phải, hướng dọc dùng Lên/Xuống. Cả hai quay vòng, hỗ trợ Home/End, di chuyển tiêu điểm và chọn qua `onChange`; cập nhật `value` tương ứng. Phím của trục còn lại giữ hành vi trình duyệt. Cung cấp bố cục khớp hướng; điều khiển Storybook đặt `flexDirection` thành `row` hoặc `column`.

Resolved mode owns the group/item roles. Provide a meaningful group name with `aria-label` or `aria-labelledby`. Both modes retain the existing wrapper ref, callbacks, option IDs and caller-owned `aria-controls`; no native radio inputs, names, hidden values or FormData serialization are invented. Prefer explicit `mode="tabs"` for existing tab/panel callers.

`role="tablist"` and `role="radiogroup"` remain deprecated semantic aliases. When `mode` is omitted they select matching tab or radio children; explicit `mode` takes precedence. Other role values throw rather than producing mismatched ARIA roles. Prefer `mode="tabs"` or `mode="radio"`; the default remains radio. No published notice date/version is asserted: removal still requires a major release after at least two published minor releases and 90 days of documented notice.

This working-tree default-role change is planned for a future major release under the user-approved SemVer policy. `VERSION` is unchanged; publication of deprecation notice, notice timing and release acceptance remain separately governed. See `docs/decisions/component-widget-semantics.md`.

Mặc định là nhóm chọn một giá trị (`mode="radio"`, `aria-checked`). Dùng `mode="tabs"` cho cặp tab/panel do caller dựng. Cả hai giữ callback, ref, hướng và quy tắc bàn phím hiện có; caller đặt tên nhóm có nghĩa. Không tự tạo giá trị form. Thay đổi vai trò mặc định được dự kiến cho bản major sau; chỉnh sửa cục bộ không chứng minh đã công bố thông báo hay hoàn tất điều kiện phát hành.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### SegmentedControl

[Khai báo / Declaration](SegmentedControl.d.ts) · [Nguồn / Source](SegmentedControl.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-orientation` | optional | Không khai báo trong tham số / Not declared in parameter |
| `mode` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `options` | required | `[]` |
| `role` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 277 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `SegmentedControl.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 277 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `SegmentedControl.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
