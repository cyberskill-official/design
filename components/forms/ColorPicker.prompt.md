<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**ColorPicker** — bảng mẫu màu tuyển chọn cố định và ô nhập hex.

Bảng mặc định chứa mười màu literal từ nguồn component; không được sinh từ các bộ nguyên tố hiện tại và không thay đổi theo trục element. Truyền `swatches` khi bên sử dụng cần bảng màu riêng. Ô tùy chỉnh phát giá trị `#RRGGBB` sáu chữ số qua `onChange`; bên gọi chế độ điều khiển phải cập nhật `value` để hiển thị màu được chọn.

```jsx
<ColorPicker value={c} onChange={setC}/>
```

Escape đóng bề mặt đang mở này qua ngăn xếp overlay dùng chung, giữ modal cha.

Bàn phím: Tab tới trường, nút mẫu màu và input hex tùy chỉnh. Enter/Space native kích hoạt nút; Enter hoặc blur ở input đề xuất giá trị hex sáu chữ số hợp lệ, Escape đóng popup. Bên gọi chế độ điều khiển cập nhật `value`. Enter bỏ qua keydown có dấu composition/keyCode229; Enter đã xử lý hủy hành động mặc định native để khôi phục tiêu điểm không kích hoạt lại trường. Hành vi blur không đổi.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `ColorPicker.jsx` và `ColorPicker.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Đích trường tường minh: `rootProps` áp dụng cho phần tử ngoài hiện có; `controlProps` áp dụng cho nút trigger chính, không áp dụng cho điều khiển popup. Class/style được ghép và trình xử lý của bên sử dụng chạy sau trình xử lý sở hữu. Role, trình xử lý giá trị/thay đổi và trạng thái popup vẫn thuộc component. `id` (hoặc `controlProps.id`) xác định đích logic. `description` và `error` render phản hồi với tham chiếu ID được kết hợp; lỗi cục bộ và context FormField giữ trạng thái invalid. FormField cung cấp liên kết nhãn, hint/lỗi và yêu cầu bắt buộc. Tên hỗ trợ tiếp cận tường minh ưu tiên hơn tên kế thừa. API đích này không bổ sung chuyển tiếp ref hay tuần tự hóa giá trị native.

`required` thêm chỉ dẫn bắt buộc qua mô tả. Nút không nhận aria-required hoặc kiểm tra required native; dùng quy tắc Form để xác thực logic.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- ColorPicker: ref trỏ tới HTMLSpanElement (span); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: button (HTMLButtonElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**ColorPicker** — a fixed curated swatch palette + hex input.

The default palette contains ten literal colors from the component source; it
is not generated from the current element packs and does not change with the
element axis. Supply `swatches` when the consumer needs a specific palette.
The custom input emits six-digit `#RRGGBB` values through `onChange`; controlled
callers must update `value` to display the selected color.

```jsx
<ColorPicker value={c} onChange={setC}/>
```

Escape dismisses this open surface through the shared overlay stack, preserving its parent modal.

Keyboard: Tab reaches the field, swatch buttons and custom hex input. Native Enter/Space activates buttons; Enter or blur on the input proposes a valid six-digit hex value, and Escape closes the popup. Controlled callers update `value`. Enter ignores composition-marked/keyCode229 keydowns; handled Enter cancels its native default action so restoring field focus does not activate the field again. Blur behavior is unchanged.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `ColorPicker.jsx` and `ColorPicker.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Explicit field targets: `rootProps` applies to the existing outer element; `controlProps` applies to the primary trigger button, never popup controls. Classes/styles merge and consumer handlers run after owned handlers. Owned roles, value/change handlers and popup state stay component-owned. `id` (or `controlProps.id`) identifies the logical target. `description` and `error` render feedback with composed ID references; local error and FormField context preserve invalid state. FormField supplies label, hint/error and requirement associations. Explicit accessible names take precedence over inherited names. No ref forwarding or native value serialization is added.

`required` adds a described requirement instruction. Buttons do not receive aria-required or native required validation; use Form rules for logical validation.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- ColorPicker: ref targets HTMLSpanElement (span); while native target is mounted. controlRef targets its owned button (HTMLButtonElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### ColorPicker

[Khai báo / Declaration](ColorPicker.d.ts) · [Nguồn / Source](ColorPicker.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-labelledby` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `id` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `swatches` | optional | `SWATCHES` |
| `value` | optional | `"#F4BA17"` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `ColorPicker.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `ColorPicker.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
