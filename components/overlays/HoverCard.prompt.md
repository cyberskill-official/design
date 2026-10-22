<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**HoverCard** — panel xem trước khi hover/focus (có trì hoãn). Nội dung phong phú (avatar + chữ), khác Tooltip một dòng.

```jsx
<HoverCard aria-label="Profile preview" trigger={<a href="#">@anle</a>}><b>An Lê</b> · Platform lead</HoverCard>
```

Bề mặt đang mở tham gia ngăn xếp overlay dùng chung: Escape đóng nó trước modal cha. Các lệnh chọn và chỉnh sửa bằng bàn phím hiện có vẫn thuộc phạm vi widget.

Hover và tiêu điểm bàn phím độc lập giữ thẻ mở. Di chuyển focus trong trigger/panel không đóng thẻ; trì hoãn đóng chỉ bắt đầu sau khi cả hai rời đi. Chuyển trạng thái đang chờ được thay bằng yêu cầu mới và bị hủy bởi Escape hoặc unmount.

Escape từ nội dung panel tương tác trả focus về trigger nhận tiêu điểm mà không mở lại thẻ. Escape khi focus ngoài thẻ giữ nguyên focus đó.

Trên con trỏ thô, gốc trigger trực tiếp dạng nút, liên kết hoặc nhận tiêu điểm giữ vùng đích 44 × 44 pixel CSS. Chữ đơn thuần không được làm thành phần tử nhận tiêu điểm; cung cấp trigger nhận tiêu điểm. Component trigger tùy chỉnh phải hiển thị gốc nhận tiêu điểm và chuyển tiếp sự kiện, thuộc tính ARIA liên quan.

Bàn phím: Cung cấp trigger nhận tiêu điểm. Component hiển thị trigger trực tiếp, không tạo wrapper nhận tiêu điểm cho chữ. Focus và hover độc lập giữ panel trì hoãn mở. Tab native đến nội dung tương tác; phần xem trước không giữ focus bên trong. Escape đóng và có thể trả focus panel về trigger. Không có handler nhấn để bật/tắt.

Bản địa hóa: Nội dung trigger và xem trước do bên gọi quản lý; không có prop lang hay nội dung tích hợp. Panel có role=dialog. Cung cấp aria-labelledby có nghĩa, tham chiếu heading hiển thị, hoặc aria-label đặt tên mục đích. Các prop này đặt tên panel, không phải trigger. Chữ con đơn thuần không đặt tên hộp thoại; ghi chú nguồn này không chứng nhận lời đọc hộp thoại.

Bằng chứng nguồn: `HoverCard.jsx` và `HoverCard.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử span hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Ref native (React 18/19):
- HoverCard: ref trỏ tới HTMLSpanElement (role=dialog); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**HoverCard** — hover/focus preview panel (delayed). Rich content (avatar + text), unlike single-line Tooltip.

```jsx
<HoverCard aria-label="Profile preview" trigger={<a href="#">@anle</a>}><b>An Lê</b> · Platform lead</HoverCard>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Hover and keyboard focus independently keep the card open. Moving focus within the trigger/panel does not close it; delayed close starts only after both leave. Pending transitions are replaced on a new request and canceled by Escape or unmount.

Escape from interactive panel content returns focus to its focusable trigger without reopening the card. Escape while focus is outside the card leaves that focus in place.

On coarse pointers, direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Text alone is not made focusable; supply a focusable trigger. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Supply a focusable trigger. This component renders trigger directly and does not create a focusable wrapper for text. Focus and hover keep the delayed panel open independently. Native Tab reaches interactive content; the preview does not trap focus. Escape dismisses and can return panel focus to the trigger. There is no click-to-toggle handler.

Localization: Trigger and preview content are caller-owned; there is no lang prop or built-in copy. The panel has role=dialog. Supply a meaningful aria-labelledby referencing a visible heading, or aria-label naming its purpose. These props name the panel, not the trigger. Child text alone does not name a dialog; this source note does not certify dialog announcements.

Source evidence: `HoverCard.jsx` and `HoverCard.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing span element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Native refs (React 18/19):
- HoverCard: ref targets HTMLSpanElement (role=dialog); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### HoverCard

[Khai báo / Declaration](HoverCard.d.ts) · [Nguồn / Source](HoverCard.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `aria-labelledby` | optional | Không khai báo trong tham số / Not declared in parameter |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `closeDelay` | optional | `200` |
| `openDelay` | optional | `150` |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `trigger` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `HoverCard.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `HoverCard.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
