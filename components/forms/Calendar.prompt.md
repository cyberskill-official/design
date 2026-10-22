<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Calendar** — lưới tháng, tuần bắt đầu thứ Hai, song ngữ (Tháng 7 · T2–CN). Giá trị Date được điều khiển.

```jsx
<Calendar value={date} onChange={setDate}/>
```

Timestamp số `0` là giá trị hợp lệ. Đổi năm/tháng được chọn cập nhật tháng đang xem; truyền ngày tương đương giữ việc duyệt thủ công. Ngày hiển thị theo múi giờ cục bộ của trình duyệt. Ngày không hợp lệ được xử lý như chưa chọn. `onChange` đề xuất ngày; bên gọi chốt qua `value`.

Với con trỏ thô, nút ngày giữ vùng chạm 44px và lưới ngày có thể cuộn bên trong lịch hẹp. Tiêu đề tháng vừa chiều rộng lịch nhìn thấy và vẫn hiện khi cuộn ngang.

Bàn phím: Tab tới điều hướng tháng và một ngày đang hoạt động trong grid có ngữ nghĩa. Enter/Space chọn. Phím mũi tên di chuyển theo ngày/tuần qua ranh giới tháng; PageUp/PageDown đổi tháng (Shift đổi năm), chặn ngày vào giới hạn tháng ngắn hơn. Home/End giữ hợp đồng ngày đầu/cuối tháng hiện có. Lựa chọn được công bố trên gridcell; aria-pressed vẫn ở nút native để tương thích. Nhãn ngày đầy đủ đã bản địa hóa dùng Intl.DateTimeFormat.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Tiêu đề tháng và thứ theo ngôn ngữ đã chọn; ngày dùng giờ địa phương.

Bằng chứng nguồn: `Calendar.jsx` và `Calendar.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Calendar: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Calendar** — month grid, Monday week-start, bilingual (Tháng 7 · T2–CN). Controlled Date value.

```jsx
<Calendar value={date} onChange={setDate}/>
```

Numeric timestamp `0` is a valid value. A change to the selected year/month
updates the visible month; passing an equivalent date preserves manual browsing.
Dates are displayed in the browser local timezone. Invalid date values behave
as no selection. `onChange` proposes a date; the caller commits it through `value`.

On coarse pointers, day controls retain 44px targets and the day grid can scroll
inside a narrow calendar. The month header fits the visible calendar width and
stays visible during horizontal scrolling.

Keyboard: Tab reaches month navigation and one active day within the semantic grid. Enter/Space selects. Arrow keys move by day/week across month boundaries; PageUp/PageDown moves by month (Shift moves by year), clamping the day in shorter months. Home/End retains the established first/last day of month contract. Selection is exposed on the gridcell; aria-pressed remains on its native button for compatibility. Full localized date labels use Intl.DateTimeFormat.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Month and weekday headings follow the selected language; dates use local time.

Source evidence: `Calendar.jsx` and `Calendar.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Calendar: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Calendar

[Khai báo / Declaration](Calendar.d.ts) · [Nguồn / Source](Calendar.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Calendar.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Calendar.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
