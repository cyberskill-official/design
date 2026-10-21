<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Tooltip** — bóng umber nhỏ khi hover/focus trigger. Bao một phần tử nhận tiêu điểm; giữ nhãn ngắn.

```jsx
<Tooltip label="Blocked on infra"><button className="cs-button cs-button--ghost cs-button--sm">?</button></Tooltip>
```

Cung cấp một trigger nhận tiêu điểm chuyển tiếp `aria-describedby`. Mô tả hiện có được giữ và mỗi tooltip nhận ID ổn định. Hover và focus mở nó; Escape chỉ đóng tooltip. Bóng vẫn hover được qua khoảng trống trigger. Dùng HoverCard cho nội dung tương tác. Children chữ/fragment nhận wrapper có thể focus; control disabled cần wrapper đang bật có thể focus.

Trên con trỏ thô, dự phòng chữ tích hợp và gốc trigger trực tiếp dạng nút, liên kết hoặc có thể nhận tiêu điểm giữ vùng đích44 ×44pixel CSS. Component trigger tùy chỉnh phải hiển thị gốc có thể nhận tiêu điểm và chuyển tiếp sự kiện, thuộc tính ARIA liên quan.

Bàn phím: Tiêu điểm native hoặc hover con trỏ mở mô tả; Escape đóng qua lớp dùng chung. Cung cấp một trigger nhận tiêu điểm, chuyển tiếp aria-describedby. Nội dung trigger và nhãn không nên chứa nội dung tương tác trong bóng. Component không thêm handler nhấn để bật/tắt.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Nhãn tooltip ngắn mặc định được bản địa hóa; nhãn cung cấp và nội dung trigger do bên gọi quản lý. Tooltip bổ sung tên trigger, không cung cấp tên tiếp cận duy nhất của nó.

Bằng chứng nguồn: `Tooltip.jsx` và `Tooltip.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ đến wrapper trigger ngoài hiện có, không phải bóng tooltip hay phần tử con được mô tả. Chấp nhận thuộc tính native, thuộc tính data, style và sự kiện. Không thêm wrapper hay hợp đồng ref. Component vẫn kiểm soát ngữ nghĩa/trạng thái do nó sở hữu; handler nội bộ chạy trước callback phía sử dụng.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Tooltip: ref trỏ tới HTMLSpanElement (role=tooltip); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Tooltip** — small umber bubble on hover/focus of its trigger. Wrap a focusable element; keep the label short.

```jsx
<Tooltip label="Blocked on infra"><button className="cs-button cs-button--ghost cs-button--sm">?</button></Tooltip>
```

Provide one focusable trigger that forwards `aria-describedby`. Existing descriptions are preserved and each tooltip receives a stable ID. Hover and focus open it; Escape dismisses only the tooltip. The bubble remains hoverable across the trigger gap. Use HoverCard for interactive content. Text/fragment children receive a focusable wrapper; disabled controls need an enabled focusable wrapper.

On coarse pointers, built-in text fallbacks and direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Native focus or pointer hover opens the description; Escape dismisses through the shared layer. Supply one focusable trigger forwarding aria-describedby. Trigger content and label should not contain interactive content in the bubble. The component adds no click-to-toggle handler.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default short tooltip label is localized; a supplied label and trigger content remain caller-owned. A tooltip supplements the trigger name rather than supplying its only accessible name.

Source evidence: `Tooltip.jsx` and `Tooltip.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing outer trigger wrapper, not the tooltip bubble or described child. It accepts native attributes, data attributes, style and events. It does not add a wrapper or ref contract. Component-owned semantics/state remain controlled; internal event handlers run before consumer callbacks.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Tooltip: ref targets HTMLSpanElement (role=tooltip); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Tooltip

[Khai báo / Declaration](Tooltip.d.ts) · [Nguồn / Source](Tooltip.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | required | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Tooltip.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Tooltip.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
