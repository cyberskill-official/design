<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Popconfirm** — bóng xác nhận inline (alertdialog) cho hành động có hệ quả; OK/Cancel song ngữ qua registry.

```jsx
<Popconfirm title="Delete this draft?" onConfirm={remove}
  trigger={<Button variant="danger-ghost" size="sm">Delete</Button>}/>
```

Escape đóng bề mặt đang mở này qua ngăn xếp overlay dùng chung, giữ modal cha.

Title đã render cung cấp tên hỗ trợ tiếp cận của bề mặt, kể cả nội dung React phong phú. Cung cấp văn bản có ý nghĩa; title chỉ trang trí không thể tạo tên hữu ích.

Cung cấp trigger nhận tiêu điểm và chuyển tiếp sự kiện click. Mở bằng con trỏ hoặc bàn phím đặt tiêu điểm trigger trước khi đăng ký lớp, để Escape trả tiêu điểm về nó trên các trình duyệt. Handler trigger chặn mặc định click sẽ hủy mở.

Trên con trỏ thô, dự phòng chữ tích hợp và gốc trigger trực tiếp dạng nút, liên kết hoặc có thể nhận tiêu điểm giữ vùng đích44 ×44pixel CSS. Component trigger tùy chỉnh phải hiển thị gốc có thể nhận tiêu điểm và chuyển tiếp sự kiện, thuộc tính ARIA liên quan.

Bàn phím: Enter/Space trên trigger native mở qua handler click của nó. Tab native đến các hành động xác nhận; bóng không modal này không giữ tiêu điểm bên trong. Escape và mousedown bên ngoài đóng mà không gọi onCancel; nút Cancel gọi nó. Confirm đóng trước khi thông báo onConfirm. Bên gọi sở hữu thao tác thực tế.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Nhãn OK/Cancel mặc định được bản địa hóa. Tiêu đề, trigger và giá trị ghi đè do bên gọi quản lý. Cung cấp tiêu đề có nghĩa và trigger nhận tiêu điểm, chuyển tiếp click và ARIA.

Bằng chứng nguồn: `Popconfirm.jsx` và `Popconfirm.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử span hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Popconfirm: ref trỏ tới HTMLSpanElement (role=alertdialog); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Popconfirm** — inline confirm bubble (alertdialog) on a consequential action; bilingual OK/Cancel via the registry.

```jsx
<Popconfirm title="Delete this draft?" onConfirm={remove}
  trigger={<Button variant="danger-ghost" size="sm">Delete</Button>}/>
```

Escape dismisses this open surface through the shared overlay stack, preserving its parent modal.

The rendered title supplies the surface's accessible name, including rich React content. Supply meaningful text; purely decorative title content cannot provide a useful name.

Supply a focusable trigger that forwards its click event. Opening through pointer or keyboard activation focuses that trigger before registering the layer, so Escape can return focus to it across browsers. A trigger handler that prevents the click default cancels opening.

On coarse pointers, built-in text fallbacks and direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Native trigger Enter/Space opens through its click handler. Native Tab reaches confirmation actions; this nonmodal bubble does not trap focus. Escape and outside mousedown dismiss without invoking onCancel; the Cancel button invokes it. Confirm closes before notifying onConfirm. The caller owns the actual operation.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Default OK/Cancel labels are localized. Title, trigger and overrides remain caller-owned. Supply meaningful title text and a focusable trigger forwarding click and ARIA.

Source evidence: `Popconfirm.jsx` and `Popconfirm.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing span element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Popconfirm: ref targets HTMLSpanElement (role=alertdialog); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Popconfirm

[Khai báo / Declaration](Popconfirm.d.ts) · [Nguồn / Source](Popconfirm.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `cancelLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `okLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onCancel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onConfirm` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `title` | required | Không khai báo trong tham số / Not declared in parameter |
| `trigger` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Popconfirm.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Popconfirm.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
