<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**NavigationMenu** — điều hướng trang; mục liên kết ra ngoài hoặc mở bảng liên kết phong phú.

```jsx
<NavigationMenu items={[{label:"Services",panel:[{label:"Web apps",desc:"Product apps",href:"#"}]},{label:"Work",href:"#"}]}/>
```

Bề mặt đang mở tham gia ngăn xếp overlay dùng chung: Escape đóng nó trước modal cha. Các lệnh chọn và chỉnh sửa bằng bàn phím hiện có vẫn thuộc phạm vi widget.

Mô tả liên kết trong bảng giữ số không; null, false và chuỗi rỗng bỏ mô tả.

Bảng phong phú giữ hai cột linh hoạt trong chiều rộng nội tuyến viewport, chừa 8px mỗi cạnh nội tuyến. Nhãn và mô tả dài xuống dòng trong thẻ. Vị trí cập nhật khi đổi bảng, cuộn hoặc resize viewport.

Bàn phím: Tab tới nút bảng và liên kết native. Enter/Space đóng/mở nút bảng; Enter theo liên kết. Tab native tới liên kết trong bảng, chọn đóng bảng, Escape đóng qua ngăn xếp overlay dùng chung. Triển khai này không thêm điều hướng mũi tên.

Bản địa hóa: Mọi nhãn cấp cao, nhãn bảng, mô tả và đích do bên gọi sở hữu; không có bản dịch tích hợp.

Bằng chứng nguồn: `NavigationMenu.jsx` và `NavigationMenu.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Trigger bảng là disclosure với `aria-expanded`. Bảng thẻ liên kết là nội dung điều hướng thông thường, không phải popup ARIA menu.

Ref native (React 18/19):
- NavigationMenu: ref trỏ tới HTMLElement (nav); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**NavigationMenu** — site nav; entries link out or open a panel of rich links.

```jsx
<NavigationMenu items={[{label:"Services",panel:[{label:"Web apps",desc:"Product apps",href:"#"}]},{label:"Work",href:"#"}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Panel-link descriptions preserve numeric zero; null, false and empty strings omit the description.

Rich panels retain two flexible columns within the viewport’s inline width,
with an 8px allowance at each inline edge. Long labels and descriptions wrap within their cards. Positioning
updates when switching panels, scrolling or resizing the viewport.

Keyboard: Tab reaches native panel buttons and links. Enter/Space toggles a panel button; Enter follows a link. Native Tab reaches panel links, selection closes the panel, and Escape dismisses through the shared overlay stack. This implementation adds no arrow-key navigation.

Localization: All top-level labels, panel labels, descriptions and destinations are caller-owned; there is no built-in translation.

Source evidence: `NavigationMenu.jsx` and `NavigationMenu.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Panel triggers are disclosures with `aria-expanded`. Their linked-card panels are ordinary navigation content rather than ARIA menu popups.

Native refs (React 18/19):
- NavigationMenu: ref targets HTMLElement (nav); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### NavigationMenu

[Khai báo / Declaration](NavigationMenu.d.ts) · [Nguồn / Source](NavigationMenu.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `items` | required | `[]` |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |

API kế thừa: 279 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `NavigationMenu.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 279 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `NavigationMenu.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
