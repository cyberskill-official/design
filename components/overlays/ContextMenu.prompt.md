<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**ContextMenu** — menu ngữ cảnh bằng con trỏ hoặc bàn phím trên vùng nhận tiêu điểm (“-” = dấu phân cách; mục `danger`).

```jsx
<ContextMenu items={[{label:"Duplicate"},"-",{label:"Delete",danger:true}]}>
  <div className="card">Right-click or press Shift+F10</div>
</ContextMenu>
```

Bề mặt đang mở tham gia ngăn xếp overlay dùng chung: Escape đóng nó trước modal cha. Các lệnh chọn và chỉnh sửa bằng bàn phím hiện có vẫn thuộc phạm vi widget.

Vùng context-menu có kích thước tối thiểu 44 × 44 pixel CSS trên con trỏ thô, kể cả nội dung chỉ có chữ. Quy tắc kích thước này không cung cấp cử chỉ chạm.

Bàn phím: Vùng có tên mặc định là điểm dừng Tab. Shift+F10 hoặc phím ContextMenu mở từ vùng đang focus hoặc hậu duệ đang focus; hành động đầu nhận tiêu điểm. Up/Down di chuyển không quay vòng; Home/End đến hành động đầu/cuối và bỏ qua dấu phân cách. Enter/Space chọn một lần. Tab rời và đóng mà không ép focus quay lại; Escape đóng lớp trên cùng và trả focus về phần tử mở; lựa chọn cũng khôi phục focus trước khi gọi hành động. Mở và điều hướng bỏ qua phím đã bị bên gọi preventDefault. Phím mang cờ composition (isComposing hoặc keyCode229 cũ) không mở, điều hướng, đóng bằng Tab hay đóng bằng Escape. Tab thông thường đóng sau khi focus native hoặc modal cha di chuyển, kể cả Tab bị bẫy của modal đó hủy. Chỉ dùng tabIndex={-1} khi hậu duệ nhận tiêu điểm hoặc control thay thế cung cấp khả năng dùng bàn phím. items rỗng/toàn dấu phân cách không mở menu. Không khẳng định nghiệm thu cử chỉ chạm hay phím tắt hệ điều hành native; cung cấp hành động thay thế khi cần.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Nội dung tích hợp đặt tên vùng và menu; nhãn mục và toàn bộ nội dung vùng do bên gọi quản lý.

Bằng chứng nguồn: `ContextMenu.jsx` và `ContextMenu.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- ContextMenu: ref trỏ tới HTMLDivElement (role=menu); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**ContextMenu** — pointer or keyboard context menu on a focusable zone ( "-" = separator; `danger` items).

```jsx
<ContextMenu items={[{label:"Duplicate"},"-",{label:"Delete",danger:true}]}>
  <div className="card">Right-click or press Shift+F10</div>
</ContextMenu>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

The context-menu zone has a 44 × 44 CSS-pixel minimum on coarse pointers, including text-only content. This size rule does not provide a touch gesture.

Keyboard: The named zone is a tab stop by default. Shift+F10 or the ContextMenu key opens from the focused zone or a focused descendant; the first action receives focus. Up/Down move without wrapping; Home/End reach the first/last action and separators are skipped. Enter/Space selects once. Tab exits and closes without forcing focus back; Escape closes the top layer and returns focus to the opener; selection also restores focus before calling the action. Opening and navigation ignore caller-prevented keys. Keys flagged as composing (isComposing or legacy keyCode 229) do not open, navigate, close on Tab, or dismiss on Escape. Ordinary Tab closes after native or parent-modal focus movement, including a Tab canceled by that modal trap. Use tabIndex={-1} only when a focusable descendant or alternate control provides keyboard access. Empty/all-separator items do not open a menu. No touch gesture or native operating-system shortcut acceptance is claimed; provide alternate actions where needed.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in copy names the zone and menu; item labels and all zone content remain caller-owned.

Source evidence: `ContextMenu.jsx` and `ContextMenu.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- ContextMenu: ref targets HTMLDivElement (role=menu); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### ContextMenu

[Khai báo / Declaration](ContextMenu.d.ts) · [Nguồn / Source](ContextMenu.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `items` | required | `[]` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `tabIndex` | optional | `0` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `ContextMenu.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `ContextMenu.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
