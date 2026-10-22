<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Cascader** — bộ chọn với một cột cho mỗi cấp (ví dụ TP.HCM / Quận 1).

```jsx
<Cascader value={p} onChange={setP} nodes={[{key:"hcm",label:"TP.HCM",children:[{key:"d1",label:"Quận 1"}]}]}/>
```

Bề mặt đang mở tham gia ngăn xếp overlay dùng chung: Escape đóng nó trước modal cha. Điều hướng bàn phím xử lý sự kiện có đích trong widget; không chặn phím mũi tên/Home/End native của trường bên cạnh khi popup còn mở. Mở trigger và điều hướng lựa chọn bỏ qua sự kiện composing/keyCode229 cùng sự kiện đã bị trình xử lý capture của bên gọi hủy. Các chốt xử lý gắn với nguồn này không chứng nhận hành vi IME trên hệ điều hành vật lý.

Đổi `disabled` thành true đóng popup và giải phóng quyền sở hữu overlay mà không đổi giá trị được chọn. Bật lại vẫn giữ popup đóng.

ArrowLeft từ cột con khôi phục tiêu điểm về cha đang chọn trước khi bỏ cột con.

Nhãn node nhận nội dung React, gồm văn bản phong phú nội dòng và số `0`. Đường dẫn được chọn render trực tiếp các nhãn đó, không chuyển phần tử React thành chuỗi. Dấu phân cách đường dẫn nhìn thấy được ẩn khỏi cây trợ năng.

```jsx
<Cascader value={["hcm", "d1"]} onChange={setP}
  nodes={[{key:"hcm", label:<strong>TP.HCM</strong>,
    children:[{key:"d1", label:<em>Quận 1</em>}]}]} />
```

Bàn phím: Down/Enter/Space mở trường. Sau khi mở, Down từ trigger vẫn giữ tiêu điểm đi vào lựa chọn đầu tiên. Khi mở, Up/Down và Home/End di chuyển qua lựa chọn; Right kích hoạt lựa chọn đang có tiêu điểm, gồm cả chọn lá. Left thu về cha; Escape đóng. Áp dụng đường dẫn lá từ `onChange` vào `value`.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Nhãn node vẫn do bên sử dụng sở hữu.

Bằng chứng nguồn: `Cascader.jsx` và `Cascader.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Đích trường tường minh: `rootProps` áp dụng cho phần tử ngoài hiện có; `controlProps` áp dụng cho nút trigger chính, không áp dụng cho điều khiển popup. Class/style được ghép và trình xử lý của bên sử dụng chạy sau trình xử lý sở hữu. Role, trình xử lý giá trị/thay đổi và trạng thái popup vẫn thuộc component. `id` (hoặc `controlProps.id`) xác định đích logic. `description` và `error` render phản hồi với tham chiếu ID được kết hợp; lỗi cục bộ và context FormField giữ trạng thái invalid. FormField cung cấp liên kết nhãn, hint/lỗi và yêu cầu bắt buộc. Tên hỗ trợ tiếp cận tường minh ưu tiên hơn tên kế thừa. API đích này không bổ sung chuyển tiếp ref hay tuần tự hóa giá trị native.

`required` thêm chỉ dẫn bắt buộc qua mô tả. Nút không nhận aria-required hoặc kiểm tra required native; dùng quy tắc Form để xác thực logic.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Cascader: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: button (HTMLButtonElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Cascader** — column-per-level picker (e.g. TP.HCM / Quận 1).

```jsx
<Cascader value={p} onChange={setP} nodes={[{key:"hcm",label:"TP.HCM",children:[{key:"d1",label:"Quận 1"}]}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Keyboard navigation handles events whose targets are inside this widget; native arrows/Home/End in neighboring fields are not consumed while the popup remains open. Trigger opening and option navigation ignore composing/keyCode229 events and events already cancelled by a caller capture handler. These source-bound handler guards do not certify physical OS IME behavior.

Changing `disabled` to true closes the popup and releases its overlay ownership without changing the selected value. Reenabling leaves it closed.

ArrowLeft from a child column restores focus to the selected parent before removing the child column.

Node labels accept React content, including inline rich text and numeric `0`.
The selected path renders those labels directly; it does not stringify React
elements. Visible path separators are hidden from the accessibility tree.

```jsx
<Cascader value={["hcm", "d1"]} onChange={setP}
  nodes={[{key:"hcm", label:<strong>TP.HCM</strong>,
    children:[{key:"d1", label:<em>Quận 1</em>}]}]} />
```

Keyboard: Down/Enter/Space opens the field. After opening, Down from the still-focused trigger enters the first option. While open, Up/Down and Home/End move through options; Right activates the focused option, including leaf selection. Left collapses toward the parent; Escape dismisses. Apply leaf `onChange` paths to `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Node labels remain caller-owned.

Source evidence: `Cascader.jsx` and `Cascader.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

Explicit field targets: `rootProps` applies to the existing outer element; `controlProps` applies to the primary trigger button, never popup controls. Classes/styles merge and consumer handlers run after owned handlers. Owned roles, value/change handlers and popup state stay component-owned. `id` (or `controlProps.id`) identifies the logical target. `description` and `error` render feedback with composed ID references; local error and FormField context preserve invalid state. FormField supplies label, hint/error and requirement associations. Explicit accessible names take precedence over inherited names. No ref forwarding or native value serialization is added.

`required` adds a described requirement instruction. Buttons do not receive aria-required or native required validation; use Form rules for logical validation.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Cascader: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned button (HTMLButtonElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Cascader

[Khai báo / Declaration](Cascader.d.ts) · [Nguồn / Source](Cascader.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-labelledby` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `id` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `nodes` | required | `[]` |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | `EMPTY_PATH` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Cascader.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Cascader.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
