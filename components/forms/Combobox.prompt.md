<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Combobox** — chọn đơn có lọc (gõ tìm và listbox, mũi tên/Enter/Escape). Placeholder và trạng thái rỗng song ngữ qua registry.

```jsx
<Combobox value={squad} onChange={setSquad} label="Squad"
  options={[{value:"plat",label:"Platform"},{value:"ai",label:"AI"}]}/>
```

Khi lồng trong modal, Escape chỉ đóng phần con đang mở này. Bẫy Tab của modal tiếp tục sau khi đóng.

Đổi `disabled` thành true đóng popup và giải phóng quyền sở hữu overlay mà không đổi giá trị được chọn. Bật lại vẫn giữ popup đóng.

Tham chiếu listbox và lựa chọn hoạt động dùng ID React ổn định qua hydration. Server và client phải render cùng cây component; cung cấp tiền tố định danh riêng khi hydrate các root React độc lập.

Bàn phím: Gõ lọc lựa chọn; Up/Down đổi mục được tô nổi, Enter chọn, Escape đóng popup. Trình xử lý Arrow và Enter bỏ qua phím được nativeEvent.isComposing hoặc keyCode 229 cũ đánh dấu đang tổ hợp; nhập văn bản thông thường vẫn cập nhật bộ lọc cục bộ. Cung cấp `label` cho ngữ cảnh trường và áp dụng `onChange` vào `value`.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Nhãn lựa chọn vẫn do bên sử dụng sở hữu.

Bằng chứng nguồn: `Combobox.jsx` và `Combobox.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Tên hỗ trợ tiếp cận dự phòng ổn định (“Choose an option” / “Chọn mục”), không phụ thuộc thay đổi placeholder. Phản hồi tìm kiếm rỗng là status ngoài listbox và không bao giờ được công bố thành option. Cung cấp `label` hoặc `aria-labelledby` cho ngữ cảnh riêng của trường.

Đích tường minh: `rootProps` áp dụng thuộc tính DOM vào phần tử bọc ngoài; `controlProps` áp dụng vào input combobox có thể sửa. Prop cấp cao hiện có giữ đích trước đó. Class và style được ghép; trình xử lý nội bộ chạy trước trình xử lý đích. Không thể thay giá trị, disabled, type, role, trạng thái popup và trình xử lý thay đổi do component sở hữu qua túi thuộc tính đích. Ref nằm ngoài API này.

`description` và `error` render văn bản được liên kết (kể cả số không); lỗi đặt `aria-invalid`. `FormField` tự cung cấp nhãn, ID hint/lỗi và trạng thái required cho điều khiển. Tên ARIA tường minh của bên gọi ưu tiên, mô tả ghép không trùng ID, bỏ lỗi trường vẫn giữ trạng thái invalid của bên gọi. Dùng một nhãn trường nhìn thấy, thường đặt trên FormField.
`required` công bố trạng thái bắt buộc của combobox cho công nghệ hỗ trợ; truy vấn có thể sửa không phải trường gửi giá trị được chọn có tên. Dùng quy tắc Form controller để xác thực.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Combobox: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: input (HTMLInputElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Combobox** — filterable single-select (typeahead + listbox, arrows/Enter/Escape). Bilingual placeholder + empty state via the registry.

```jsx
<Combobox value={squad} onChange={setSquad} label="Squad"
  options={[{value:"plat",label:"Platform"},{value:"ai",label:"AI"}]}/>
```

When nested in a modal, Escape dismisses only this open child. Modal Tab trapping resumes after dismissal.

Changing `disabled` to true closes the popup and releases its overlay ownership without changing the selected value. Reenabling leaves it closed.

Listbox and active-option references use a hydration-stable React ID. Server and client must render the same component tree; provide distinct identifier prefixes when hydrating independent React roots.

Keyboard: Typing filters options; Up/Down changes the highlighted option, Enter selects it, and Escape dismisses the popup. Arrow and Enter handlers ignore keys flagged as composing by nativeEvent.isComposing or legacy keyCode 229; ordinary text input still updates the local filter. Supply `label` for field context and apply `onChange` to `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Option labels remain caller-owned.

Source evidence: `Combobox.jsx` and `Combobox.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

The fallback accessible name is stable (“Choose an option” / “Chọn mục”), independent of placeholder changes. Empty search feedback is a status outside the listbox and is never exposed as an option. Supply `label` or `aria-labelledby` for field-specific context.

Explicit targets: `rootProps` applies DOM attributes to the outer wrapper; `controlProps` applies them to the editable combobox input. Existing top-level props keep their previous targets. Classes and styles merge; internal handlers run before target handlers. Owned value, disabled, type, role, popup state and change handlers cannot be replaced through target bags. Refs remain outside this API.

`description` and `error` render associated text (including numeric zero); an error sets `aria-invalid`. `FormField` automatically supplies its label, hint/error IDs and required state to this control. Explicit caller ARIA naming wins, descriptions combine without duplicate IDs, and removing a field error preserves caller invalid state. Use one visible field label, normally on FormField.
`required` exposes combobox required state to assistive technology; the editable query is not a named selected-value submission field. Use Form controller rules for validation.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Combobox: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned input (HTMLInputElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Combobox

[Khai báo / Declaration](Combobox.d.ts) · [Nguồn / Source](Combobox.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

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
| `options` | required | `[]` |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Combobox.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Combobox.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
