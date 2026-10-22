<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**FloatingActionButton** — nút hành động tròn dùng màu tô `--cs-accent` và tiền cảnh `--cs-accent-on` đang hoạt động (mặc định cố định góc phải dưới); có thể thêm `actions` dạng speed-dial. Accent nguyên tố Earth mặc định là Ochre; các nguyên tố khác theo accent được sinh tương ứng.

```jsx
<FloatingActionButton icon={<Icon name="sparkle"/>} label="Make a wish"
  actions={[{icon:<Icon name="chat" size="sm"/>,label:"Talk to Lumi"}]}/>
```

Bề mặt đang mở tham gia ngăn xếp overlay dùng chung: Escape đóng nó trước modal cha. Các lệnh chọn và chỉnh sửa bằng bàn phím hiện có vẫn thuộc phạm vi widget.

Với con trỏ thô, mỗi hành động speed-dial có vùng chạm tối thiểu 44 × 44 CSS pixel. Hành động chính vẫn là 56 × 56.

Bàn phím: Tab tới các nút chính/hành động native; Enter/Space mở cụm hoặc kích hoạt hành động. Escape đóng cụm qua ngăn xếp overlay dùng chung. Khi có actions, nút chính đóng/mở cụm; khi không có, nó gọi `onClick`.

Bản địa hóa: Nhãn chính bắt buộc và nhãn từng hành động do bên sử dụng sở hữu. Không có bản dịch tích hợp hoặc prop `lang`.

Bằng chứng nguồn: `FloatingActionButton.jsx` và `FloatingActionButton.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Ref native (React 18/19):
- FloatingActionButton: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: button (HTMLButtonElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.


Bảng nổi: `portal` mặc định là `true`, yêu cầu portal vào body sau khi client mount. Bảng có vị trí chèn ban đầu nằm trong form hoặc fieldset tự động dùng host inline, kể cả khi chỉ định `portal={true}`; cách này giữ quyền sở hữu form native và hành vi disabled-fieldset/first-legend, đồng thời vẫn chịu cắt bởi phần tử tổ tiên. `portal={false}` giữ markup inline/server và cơ chế cắt của tổ tiên. `placement` nhận top/bottom/left/right cùng các biến thể start/end; các cạnh vật lý không đổi trong RTL, còn start/end của top/bottom theo hướng nội tuyến. Lật sang cạnh đối diện, dịch trong viewport và theo dõi scroll/resize giữ nguyên hợp đồng bàn phím, tiêu điểm và quyền sở hữu overlay cha. Khai báo liền kề xác định giá trị mặc định ưu tiên.

Thay đổi prop `portal` được chỉ định sẽ mount lại phần tử con của bảng nổi và đặt lại trạng thái cục bộ; giữ prop này ổn định khi cần bảo toàn trạng thái con. Thay đổi ngữ cảnh form tự động vẫn giữ host và trạng thái con. Nội dung portal mặc định hoặc được yêu cầu mount sau hydration ở client; lựa chọn inline tường minh giữ markup server. Xem [hợp đồng bảng nổi](../../docs/floating-panels.md) về việc di chuyển DOM bên ngoài bất đồng bộ và giới hạn của sự kiện tiêu điểm native.

## English
<!-- END GENERATED VI PROMPT v1 -->
**FloatingActionButton** — round action using the active `--cs-accent` fill and `--cs-accent-on` foreground (fixed bottom-right by default); optional speed-dial `actions`. The default Earth accent is Ochre; other element variants follow their generated accent.

```jsx
<FloatingActionButton icon={<Icon name="sparkle"/>} label="Make a wish"
  actions={[{icon:<Icon name="chat" size="sm"/>,label:"Talk to Lumi"}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

On coarse pointers, each speed-dial action has a minimum 44 × 44 CSS-pixel target. The main action stays 56 × 56.

Keyboard: Tab reaches the native main/action buttons; Enter/Space opens the dial or activates an action. Escape closes the dial through the shared overlay stack. With actions, the main button toggles the dial; without them it calls `onClick`.

Localization: The required main label and each action label are caller-owned. There is no built-in translation or `lang` prop.

Source evidence: `FloatingActionButton.jsx` and `FloatingActionButton.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Native refs (React 18/19):
- FloatingActionButton: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned button (HTMLButtonElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.


Floating panel: `portal` defaults to `true`, requesting a body portal after client mount. Panels whose original insertion context is inside a form or fieldset automatically use an inline host, including for explicit `portal={true}`, preserving native form ownership and disabled-fieldset/first-legend behavior while retaining ancestor clipping. `portal={false}` retains inline/server markup and ancestor clipping. `placement` accepts top/bottom/left/right plus start/end variants; physical sides stay physical in RTL, while top/bottom start/end follow inline direction. Opposite-side flip, viewport shift and scroll/resize tracking preserve the existing keyboard, focus and parent-overlay ownership contract. Adjacent declaration specifies the preferred default.

Changing the explicit `portal` prop remounts floating children and resets their local state; keep that prop stable when preserving child state matters. Automatic form-context changes preserve the host and child state. Default/requested portal content mounts after client hydration; explicit inline opt-out retains server markup. See [floating panel contracts](../../docs/floating-panels.md) for asynchronous external DOM moves and native focus-event limits.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### FloatingActionButton

[Khai báo / Declaration](FloatingActionButton.d.ts) · [Nguồn / Source](FloatingActionButton.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `actions` | optional | `[]` |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `icon` | required | Không khai báo trong tham số / Not declared in parameter |
| `label` | required | Không khai báo trong tham số / Not declared in parameter |
| `onClick` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placement` | optional | Không khai báo trong tham số / Not declared in parameter |
| `portal` | optional | `true` |
| `position` | optional | `"fixed"` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `FloatingActionButton.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `FloatingActionButton.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
