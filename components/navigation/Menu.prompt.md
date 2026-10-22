<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Menu / MenuItem** — dropdown neo vào `trigger`. Không điều khiển (click đóng/mở; bấm ngoài/Escape đóng) hoặc điều khiển qua `open`/`onOpenChange`. `align="end"` căn với cạnh inline-end của trigger: phải ở LTR, trái ở RTL.

```jsx
<Menu trigger={<button className="cs-button cs-button--secondary cs-button--sm">Actions</button>}>
  <MenuItem>Duplicate</MenuItem>
  <div className="cs-menu__sep" />
  <MenuItem danger>Delete</MenuItem>
</Menu>
```

`open` điều khiển hiển thị; nếu không có, hiển thị nội bộ thay đổi kể cả khi cung cấp `onOpenChange`. Callback quan sát trạng thái tiếp theo được yêu cầu.

Khi lồng trong modal, Escape chỉ đóng phần con đang mở này. Bẫy Tab của modal tiếp tục sau khi đóng.

Icon MenuItem giữ số không; null, false và chuỗi rỗng bỏ slot icon.

Cung cấp trigger nhận tiêu điểm và chuyển tiếp sự kiện click. Mở bằng con trỏ hoặc bàn phím đặt tiêu điểm trigger trước khi đăng ký lớp, để Escape trả tiêu điểm về nó trên các trình duyệt. Handler trigger chặn mặc định click sẽ hủy mở.

Trên con trỏ thô, dự phòng chữ tích hợp và gốc trigger trực tiếp dạng nút, liên kết hoặc có thể nhận tiêu điểm giữ vùng đích44 ×44pixel CSS. Component trigger tùy chỉnh phải hiển thị gốc có thể nhận tiêu điểm và chuyển tiếp sự kiện, thuộc tính ARIA liên quan.

Bàn phím: Enter/Space hoặc con trỏ mở và đặt tiêu điểm mục enabled đầu. ArrowDown/ArrowUp trên trigger mở và đặt tiêu điểm mục enabled đầu/cuối. Trong menu, Up/Down quay vòng; Home/End tới mục đầu/cuối. Tiêu điểm roving qua mục enabled, phím in được tìm theo tiền tố (đệm 500ms; lặp chữ quay vòng kết quả). Tab/Shift+Tab yêu cầu đóng và tiếp tục di chuyển tiêu điểm tuần tự từ trigger, kể cả trong modal cha. Escape yêu cầu đóng qua lớp dùng chung và khôi phục trigger. Kích hoạt gọi handler mục và yêu cầu đóng trừ khi mặc định đã bị chặn. Bỏ qua tổ hợp, keyCode 229 và sự kiện bị bên gọi chặn. Trigger tùy chỉnh phải chuyển tiếp sự kiện bàn phím/click, ARIA và root nhận tiêu điểm.

Bên gọi chế độ điều khiển phải chốt `onOpenChange(false)` để đóng sau Tab, Escape hoặc chọn. Hợp đồng APG menu-button này được duyệt tường minh trong khắc phục đánh giá; thay hợp đồng Tab qua từng mục trước đây.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Nội dung tích hợp đặt tên vùng menu. Nội dung trigger và mục vẫn do bên gọi sở hữu.

Bằng chứng nguồn: `Menu.jsx` và `Menu.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Menu: ref trỏ tới HTMLDivElement (role=menu); chỉ khi bảng nổi đang được mount.
- MenuItem: ref trỏ tới HTMLButtonElement (button); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Menu / MenuItem** — dropdown anchored to a `trigger`. Uncontrolled (click toggles; outside-click / Escape close) or controlled via `open`/`onOpenChange`. `align="end"` aligns with the trigger’s inline-end edge: right in LTR, left in RTL.

```jsx
<Menu trigger={<button className="cs-button cs-button--secondary cs-button--sm">Actions</button>}>
  <MenuItem>Duplicate</MenuItem>
  <div className="cs-menu__sep" />
  <MenuItem danger>Delete</MenuItem>
</Menu>
```

`open` controls visibility; without it, internal visibility changes even when
`onOpenChange` is supplied. The callback observes the requested next state.

When nested in a modal, Escape dismisses only this open child. Modal Tab trapping resumes after dismissal.

MenuItem icon preserves numeric zero; null, false and empty strings omit the icon slot.

Supply a focusable trigger that forwards its click event. Opening through pointer or keyboard activation focuses that trigger before registering the layer, so Escape can return focus to it across browsers. A trigger handler that prevents the click default cancels opening.

On coarse pointers, built-in text fallbacks and direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Enter/Space or pointer activation opens and focuses the first enabled item. ArrowDown/ArrowUp on the trigger opens and focuses the first/last enabled item. Within the menu Up/Down wrap; Home/End reach the first/last item. Focus roves across enabled items, and printable keys perform prefix typeahead (500ms buffer; repeated letters cycle matches). Tab/Shift+Tab requests closure and continues sequential focus movement from the trigger, including within a parent modal. Escape requests closure through the shared layer and restores the trigger. Activation calls the item handler and requests closure unless its default was prevented. Composition, keyCode 229 and caller-prevented events are ignored. Custom triggers must forward keyboard/click events, ARIA and a focusable root.

Controlled callers must commit `onOpenChange(false)` to close after Tab, Escape or selection. This APG menu-button contract was explicitly approved during assessment remediation; it replaces the earlier item-by-item Tab contract.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in copy names the menu region. Trigger and item content remain caller-owned.

Source evidence: `Menu.jsx` and `Menu.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Menu: ref targets HTMLDivElement (role=menu); only while panel is mounted.
- MenuItem: ref targets HTMLButtonElement (button); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Menu

[Khai báo / Declaration](Menu.d.ts) · [Nguồn / Source](Menu.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `align` | optional | `"start"` |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onOpenChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `open` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `trigger` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Menu.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Menu.runtime.defaultExpressions` in the canonical source facts.

### MenuItem

[Khai báo / Declaration](Menu.d.ts) · [Nguồn / Source](Menu.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `danger` | optional | `false` |
| `icon` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 290 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `MenuItem.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 290 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `MenuItem.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
