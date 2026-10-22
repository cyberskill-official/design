<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Splitter** — dấu phân cách hai pane kéo được (đổi kích thước bằng bàn phím).

```jsx
<Splitter start={<Editor/>} end={<Preview/>} initial={45}/>
```

Phần trăm pane ban đầu và hiển thị được giới hạn trong `min`/`max`, kể cả khi đổi giới hạn. Dùng giới hạn phần trăm có thứ tự. Hủy con trỏ, đổi giới hạn và unmount kết thúc kéo đang hoạt động; con trỏ không liên quan không thể đổi kích thước.

Dấu phân cách theo chiều dọc. Left/Right di chuyển trực quan theo hướng đó, với phần trăm pane đầu được đo từ cạnh bắt đầu LTR/RTL kế thừa. Phím đổi kích thước ngăn cuộn trang; phím trong lúc composition không kích hoạt đổi kích thước.

Di chuyển con trỏ tương đối với vị trí nắm ban đầu, kể cả mép tay nắm44px cho con trỏ thô. Phần trăm hai pane chia phần không gian còn lại sau tay nắm; tay nắm không thu nhỏ hay lấy bớt chiều rộng phần trăm của pane nào.

Trên con trỏ thô, chiều cao yêu cầu dưới46px dùng container tối thiểu46px, dành ít nhất44px cho dấu phân cách sau viền container. Con trỏ chính xác giữ chiều cao yêu cầu và dấu phân cách hẹp.

Bàn phím: Tab đến dấu phân cách; Left/Right đổi kích thước hai điểm phần trăm và theo hướng kế thừa. Di chuyển con trỏ đổi trạng thái nội bộ; không có callback onChange. initial khởi tạo trạng thái một lần. Dùng giá trị initial hữu hạn, giới hạn phần trăm hữu hạn có thứ tự trong0–100 và chiều cao dương hữu ích; đầu vào số không hợp lệ tùy ý không được chuẩn hóa.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Nội dung tích hợp đặt tên dấu phân cách. Nội dung pane và ngữ cảnh bổ sung do bên gọi quản lý. aria-valuenow giữ phần trăm hiển thị, gồm phần thập phân, trong min/max.

Bằng chứng nguồn: `Splitter.jsx` và `Splitter.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Splitter: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Splitter** — draggable two-pane divider (keyboard-resizable).

```jsx
<Splitter start={<Editor/>} end={<Preview/>} initial={45}/>
```

Initial and displayed pane percentages are clamped to `min`/`max`, including
changed bounds. Use ordered percentage bounds. Pointer cancellation, changed
bounds and unmount end the active drag; unrelated pointers cannot resize it.

The separator is vertical. Left/Right move it visually in that direction, with
the start-pane percentage measured from the inherited LTR/RTL start edge. Resize
keys prevent page scrolling; composition keys do not trigger resizing.

Pointer movement is relative to the initial grab position, including the edges of the 44px coarse-pointer handle. The two pane percentages divide the space remaining after the handle; the handle does not shrink or steal percentage width from either pane.

On coarse pointers, requested heights below 46px use a 46px container minimum,
leaving at least 44px for the divider after its container borders. Fine pointers
retain the requested height and the narrow divider.

Keyboard: Tab reaches the separator; Left/Right resize by two percentage points and respect inherited direction. Pointer movement changes internal state; there is no onChange callback. initial seeds state once. Use finite initial values, ordered finite percentage bounds within 0–100, and a useful positive height; arbitrary invalid numeric inputs are not normalized.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in copy names the separator. Pane content and any additional context remain caller-owned. aria-valuenow retains the displayed percentage, including fractions, within min/max.

Source evidence: `Splitter.jsx` and `Splitter.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Splitter: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Splitter

[Khai báo / Declaration](Splitter.d.ts) · [Nguồn / Source](Splitter.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `end` | required | Không khai báo trong tham số / Not declared in parameter |
| `height` | optional | `240` |
| `initial` | optional | `50` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `max` | optional | `80` |
| `min` | optional | `20` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `start` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Splitter.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Splitter.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
