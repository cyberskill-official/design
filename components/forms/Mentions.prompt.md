<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Mentions** — textarea gợi ý @users khi gõ (textbox nhiều dòng native với autocomplete danh sách).

Bàn phím: ArrowUp/Down đổi gợi ý hoạt động (`aria-activedescendant`); Enter chọn; Escape đóng. Bấm chuột vẫn chọn được.

```jsx
<Mentions users={["anle","baovu","lumi"]} placeholder="Add a note — @ to mention"/>
```

Bề mặt đang mở tham gia ngăn xếp overlay dùng chung: Escape đóng nó trước modal cha. Các lệnh chọn và chỉnh sửa bằng bàn phím hiện có vẫn thuộc phạm vi widget.

ID listbox và option ổn định qua render server và hydration. Server và client phải render cùng cây; dùng tiền tố định danh riêng cho root React độc lập.

Bàn phím: Khi gợi ý mở, Up/Down đổi gợi ý hoạt động, Enter chèn; Escape đóng. Ngoài trạng thái đó, textarea giữ chỉnh sửa native. Xác nhận IME không chọn.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng cung cấp không được dịch. Tên người dùng và văn bản đã nhập vẫn do bên gọi sở hữu.

Bằng chứng nguồn: `Mentions.jsx` và `Mentions.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử span hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Host HTML/ARIA: Textarea native giữ role textbox nhiều dòng ngầm định. Dùng aria-autocomplete="list", aria-haspopup="listbox" và liên kết controls/active-descendant khi gợi ý mở. Không đổi role textarea thành combobox hay đặt aria-expanded không hỗ trợ trên textbox. Nút option dùng tabIndex=-1; tiêu điểm DOM giữ ở textarea khi chọn bằng mũi tên/Enter. Tab rời widget; Escape đóng gợi ý; Enter chèn dòng mới native khi gợi ý đóng.

Ref native (React 18/19):
- Mentions: ref trỏ tới HTMLTextAreaElement (textarea); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Mentions** — textarea suggesting @users as you type (native multiline textbox with list autocomplete).

Keyboard: ArrowUp/Down move the active suggestion (`aria-activedescendant`); Enter selects; Escape closes. Mouse click still picks.

```jsx
<Mentions users={["anle","baovu","lumi"]} placeholder="Add a note — @ to mention"/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Listbox and option IDs remain stable across server rendering and hydration. Server and client must render the same tree; use distinct identifier prefixes for independent React roots.

Keyboard: When suggestions are open, Up/Down changes the active suggestion and Enter inserts it; Escape closes. Outside that state, the textarea keeps native editing. IME confirmation does not select.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Usernames and entered text remain caller-owned.

Source evidence: `Mentions.jsx` and `Mentions.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing span element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

HTML/ARIA host: the native textarea retains its implicit multiline textbox role. It uses aria-autocomplete="list", aria-haspopup="listbox", and controls/active-descendant links while suggestions are open. It does not override textarea to combobox or put unsupported aria-expanded on a textbox. Option buttons use tabIndex=-1; DOM focus remains in the textarea during arrow/Enter selection. Tab leaves the widget; Escape closes suggestions; Enter inserts a native newline when suggestions are closed.

Native refs (React 18/19):
- Mentions: ref targets HTMLTextAreaElement (textarea); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Mentions

[Khai báo / Declaration](Mentions.d.ts) · [Nguồn / Source](Mentions.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultValue` | optional | `""` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rows` | optional | `3` |
| `users` | required | `[]` |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Mentions.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Mentions.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
