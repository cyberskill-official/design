<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**DatePicker** — trường và popover Calendar; định dạng VN DD/MM/YYYY, tuần bắt đầu thứ Hai.

Dialog popup lấy tên hỗ trợ tiếp cận từ `label` không trắng, sau đó `placeholder` không trắng, rồi “Select a date” / “Chọn ngày”. Tên chỉ có khoảng trắng dùng cùng dự phòng. Dialog đang mở theo thay đổi nhãn và ngôn ngữ.

```jsx
<DatePicker value={date} onChange={setDate}/>
```

Escape đóng bề mặt đang mở này qua ngăn xếp overlay dùng chung, giữ modal cha.

Đổi `disabled` thành true đóng popup và giải phóng quyền sở hữu overlay mà không đổi giá trị được chọn. Bật lại vẫn giữ popup đóng.

Timestamp số gồm epoch `0`; nó hiển thị cùng ngày với `new Date(0)` trong múi giờ địa phương. Giá trị rỗng giữ placeholder.

Popup giữ trong chiều rộng nội tuyến của viewport, chừa 8px mỗi cạnh nội tuyến, kể cả khi trường gần cạnh phải hoặc viewport đổi trong lúc mở. Trên host hẹp, lịch cuộn cục bộ, giữ vùng chạm ngày 44px cho con trỏ thô.

Bàn phím: Enter/Space trên trường mở popup; Calendar dùng nút ngày/tháng native. Escape đóng. Chọn ngày gọi `onChange`; bên sử dụng chốt giá trị được chọn.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. VN dùng DD/MM/YYYY; EN dùng ngày, tháng viết tắt và năm theo giờ địa phương.

Bằng chứng nguồn: `DatePicker.jsx` và `DatePicker.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Mở chuyển tiêu điểm tới ngày đã chọn, hôm nay nếu đang nhìn thấy, hoặc ngày đầu tiên khả dụng. Escape/chọn khôi phục tiêu điểm qua overlay manager.

Đích tường minh: `rootProps` áp dụng thuộc tính DOM vào phần tử bọc ngoài; `controlProps` áp dụng vào nút trigger ngày. Prop cấp cao hiện có giữ đích trước đó. Class và style được ghép; trình xử lý nội bộ chạy trước trình xử lý đích. Không thể thay giá trị, disabled, type, role, trạng thái popup và trình xử lý thay đổi do component sở hữu qua túi thuộc tính đích. Ref nằm ngoài API này.

`description` và `error` render văn bản được liên kết (kể cả số không); lỗi đặt `aria-invalid`. `FormField` tự cung cấp nhãn, ID hint/lỗi và trạng thái required cho điều khiển. Tên ARIA tường minh của bên gọi ưu tiên, mô tả ghép không trùng ID, bỏ lỗi trường vẫn giữ trạng thái invalid của bên gọi. Dùng một nhãn trường nhìn thấy, thường đặt trên FormField.
`required` thêm chỉ dẫn bắt buộc đã bản địa hóa; nút không hỗ trợ aria-required hoặc xác thực required native. Tuần tự hóa ngày và gửi native có tên nằm ngoài API này.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- DatePicker: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: button (HTMLButtonElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**DatePicker** — field + popover Calendar; VN format DD/MM/YYYY, Monday week-start.

The popup dialog takes its accessible name from the nonblank `label`, then the
nonblank `placeholder`, then “Select a date” / “Chọn ngày”. Whitespace-only names
use the same fallback. An open dialog follows label and language changes.

```jsx
<DatePicker value={date} onChange={setDate}/>
```

Escape dismisses this open surface through the shared overlay stack, preserving its parent modal.

Changing `disabled` to true closes the popup and releases its overlay ownership without changing the selected value. Reenabling leaves it closed.

Numeric timestamps include epoch `0`; it displays the same date as `new Date(0)` in the local time zone. Empty values retain the placeholder.

The popup stays within the viewport’s inline width with an 8px allowance at each inline edge, including when
its field is near the right edge or the viewport changes while open. On narrow
hosts the calendar scrolls locally, preserving 44px coarse-pointer day targets.

Keyboard: Enter/Space on the field opens the popup; its Calendar uses native day/month buttons. Escape dismisses it. Date selection calls `onChange`; the consumer commits the selected value.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. VN uses DD/MM/YYYY; EN uses a day, abbreviated month and year in local time.

Source evidence: `DatePicker.jsx` and `DatePicker.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Opening moves focus to the selected day, today when visible, or the first available day. Escape/selection restores focus through the overlay manager.

Explicit targets: `rootProps` applies DOM attributes to the outer wrapper; `controlProps` applies them to the date trigger button. Existing top-level props keep their previous targets. Classes and styles merge; internal handlers run before target handlers. Owned value, disabled, type, role, popup state and change handlers cannot be replaced through target bags. Refs remain outside this API.

`description` and `error` render associated text (including numeric zero); an error sets `aria-invalid`. `FormField` automatically supplies its label, hint/error IDs and required state to this control. Explicit caller ARIA naming wins, descriptions combine without duplicate IDs, and removing a field error preserves caller invalid state. Use one visible field label, normally on FormField.
`required` adds a localized required instruction; a button does not support aria-required or native required validation. Date serialization and named native submission remain outside this API.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- DatePicker: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned button (HTMLButtonElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### DatePicker

[Khai báo / Declaration](DatePicker.d.ts) · [Nguồn / Source](DatePicker.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-labelledby` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `DatePicker.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `DatePicker.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
