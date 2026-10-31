<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Tour** — hướng dẫn từng bước bằng spotlight trên selector (Skip/Back/Next/Done song ngữ).

```jsx
<Tour open={on} onClose={()=>setOn(false)} steps={[{target:"#kpis",title:"Portfolio",body:"Filter by clicking a KPI."}]}/>
```

Bề mặt đang mở tham gia ngăn xếp lớp phủ dùng chung: Escape đóng nó trước modal cha. Lệnh lựa chọn và chỉnh sửa bằng bàn phím hiện có vẫn cục bộ trong widget. Bề mặt chặn này cũng giữ tiêu điểm bên trong, cô lập nền bằng inert và giữ quyền sở hữu khóa cuộn lồng nhau.

Khi `steps` thu nhỏ, chỉ mục hoạt động được giới hạn ở bước cuối còn lại; tăng lại không khôi phục chỉ mục đã bỏ. Steps rỗng ẩn tour và giải phóng cô lập modal. Mở lại bắt đầu từ bước đầu. `onClose` yêu cầu đóng; phần cha phải cập nhật `open` được kiểm soát.

Hộp thoại được đặt tên bởi tiêu đề bước hiển thị, gồm nội dung React phong phú. Cung cấp tiêu đề văn bản có nghĩa; nội dung rỗng hoặc thuần trang trí không tạo tên tiếp cận.

Khi mở, tour đo selector hiện tại mỗi frame animation một lần để theo cuộn, dịch bố cục, đổi kích thước và thay mục tiêu. Trạng thái hình học React chỉ cập nhật khi tọa độ đo thay đổi; theo dõi dừng khi đóng, steps rỗng hoặc unmount. Mục tiêu thiếu dùng dự phòng không neo tới khi xuất hiện.

Nội dung bước giữ số không; null, false và chuỗi rỗng bỏ qua đoạn nội dung.

Bàn phím: Lớp modal chung giữ Tab bên trong. Nút native đổi bước hoặc yêu cầu đóng; Escape và nền cũng gọi onClose. Phần cha cập nhật open được kiểm soát. Cung cấp selector CSS hợp lệ; selector hợp lệ không có mục tiêu khớp dùng dự phòng không neo. Đổi bước không thêm thông báo live-region.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Skip/Back/Next/Done được bản địa hóa. Tiêu đề và nội dung từng bước do bên gọi quản lý; tiêu đề có nghĩa đặt tên hộp thoại.

Bằng chứng nguồn: `Tour.jsx` và `Tour.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Tour: ref trỏ tới HTMLDivElement (role=dialog); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Tour** — spotlight walkthrough over selectors (bilingual Skip/Back/Next/Done).

```jsx
<Tour open={on} onClose={()=>setOn(false)} steps={[{target:"#kpis",title:"Portfolio",body:"Filter by clicking a KPI."}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.
This blocking surface also traps focus, isolates the background with inert, and preserves nested scroll-lock ownership.

When `steps` shrinks, the active index clamps to the remaining last step; regrowth does not restore a removed index. Empty steps hide the tour and release modal isolation. Reopening starts at the first step. `onClose` requests closure; the parent must update controlled `open`.

The dialog is named by its rendered step title, including rich React content. Supply a meaningful textual title; empty or purely decorative content cannot provide an accessible name.

While open, the tour measures its current selector once per animation frame to follow scrolling, layout shifts, resizing and target replacement. React geometry state updates only when measured coordinates change; tracking stops on close, empty steps or unmount. A missing target uses the unanchored fallback until it appears.

Step body preserves numeric zero; null, false and empty strings omit the body paragraph.

Keyboard: The shared modal layer contains Tab. Native buttons move steps or request closure; Escape and backdrop also call onClose. The parent updates controlled open. Supply valid CSS selectors; a valid selector with no matching target uses the unanchored fallback. Step changes do not add a live-region announcement.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Skip/Back/Next/Done are localized. Each step title and body remain caller-owned; meaningful title text names the dialog.

Source evidence: `Tour.jsx` and `Tour.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Tour: ref targets HTMLDivElement (role=dialog); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Tour

[Khai báo / Declaration](Tour.d.ts) · [Nguồn / Source](Tour.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClose` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onOpenChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `open` | required | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `steps` | required | `[]` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Tour.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Tour.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
