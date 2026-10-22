<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Tabs / Tab** — tablist gạch dưới (chỉ báo Ochre khi hoạt động), điều khiển bằng `value`/`onChange`. Tự nối panel qua `aria-controls`.

```jsx
<Tabs value={lens} onChange={setLens}
  tabs={[{value:"board",label:"Board"},{value:"table",label:"Table",count:6}]} />
```

Đặt `aria-orientation="vertical"` để điều hướng Up/Down và cung cấp bố cục dọc tương ứng (ví dụ `style={{flexDirection:"column"}}`). Mặc định ngang dùng Left/Right; phím trục khác để cho trình duyệt. Cả hai hướng giữ Home/End, quay vòng, tự chọn qua onChange và một điểm Tab. Giữ value được điều khiển đồng bộ với onChange.

Từng mục nhận `id` và `aria-controls` cho panel do bên gọi render. Cung cấp ID duy nhất toàn tài liệu (ví dụ tạo tiền tố bằng React.useId), đặt `role="tabpanel"` và `aria-labelledby` trên panel tương ứng, ẩn panel không hoạt động theo giá trị được điều khiển. Thêm `tabIndex={0}` cho panel không có phần tử nhận tiêu điểm ban đầu. Những thuộc tính này không tạo panel hoặc quản lý hiển thị.

Tablist cuộn ngang khi nhãn vượt vùng chứa. Tab giữ chiều rộng nhãn tự nhiên, không co thành văn bản chồng lấn. Mỗi tab nằm trọn trong scrollport; điều khiển con trỏ thô giữ chiều cao nhìn thấy ít nhất 44px. Nhãn phong phú có thể dùng văn bản không xuống dòng nhưng không được làm rộng trang.

Primitive Tab độc lập dùng được trong tablist do bên gọi quản lý. Tạo ID duy nhất, render panel tương ứng và thực thi handler mũi tên cho danh sách; primitive không phối hợp các tab anh em.

```jsx
<Tab id={boardTabId} aria-controls={boardPanelId}
  selected={lens === "board"} tabIndex={lens === "board" ? 0 : -1}
  onClick={() => setLens("board")} onKeyDown={onTabKeyDown}>Board</Tab>
```

Bàn phím: Tabs dùng mũi tên theo trục khai báo cùng Home/End, quay vòng và tự yêu cầu onChange; cha cung cấp value khớp một mục. Tab là primitive nút tab native: danh sách tự ghép phải tự cung cấp roving tabIndex, handler mũi tên, quan hệ ID/panel và lựa chọn/hiển thị.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. Tên tablist mặc định được bản địa hóa; nhãn, số đếm, tên ARIA tùy chỉnh và toàn bộ nội dung panel do bên gọi sở hữu.

Bằng chứng nguồn: `Tabs.jsx` và `Tabs.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Tab: ref trỏ tới HTMLButtonElement (button); khi đích native đang được mount.
- Tabs: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

### Hướng hiển thị / Orientation

`aria-orientation="horizontal"` dùng Left/Right; `vertical` dùng Up/Down. Cả hai quay vòng, hỗ trợ Home/End, chuyển tiêu điểm và chọn qua `onChange`; giữ `value` được điều khiển. Phím trục khác giữ hành vi trình duyệt. Bên gọi cung cấp bố cục nhìn thấy khớp hướng (ví dụ `style={{flexDirection: 'column'}}` cho dọc). Điều khiển hướng Storybook cung cấp bố cục đó.

Hướng ngang dùng phím Trái/Phải, hướng dọc dùng Lên/Xuống. Cả hai quay vòng, hỗ trợ Home/End, di chuyển tiêu điểm và chọn qua `onChange`; cập nhật `value` tương ứng. Phím của trục còn lại giữ hành vi trình duyệt. Bên gọi phải cung cấp bố cục khớp hướng, ví dụ `flexDirection: 'column'` cho hướng dọc.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Tabs / Tab** — underlined tablist (Ochre active indicator), controlled by `value`/`onChange`. Wire your own panels via `aria-controls`.

```jsx
<Tabs value={lens} onChange={setLens}
  tabs={[{value:"board",label:"Board"},{value:"table",label:"Table",count:6}]} />
```

Set `aria-orientation="vertical"` for Up/Down navigation and provide the matching
vertical layout (for example `style={{flexDirection:"column"}}`). Horizontal is
the default and uses Left/Right; keys on the other axis are left to the browser.
Both orientations retain Home/End, wrapping, automatic selection via onChange
and one tab stop. Keep controlled value in sync with onChange.

Each item accepts `id` and `aria-controls` for caller-rendered panels. Give IDs
unique across the document (for example, derive a prefix with React.useId), set
`role="tabpanel"` and `aria-labelledby` on the matching panel, and hide inactive
panels using the controlled value. Add `tabIndex={0}` to panels without an initial
focusable element. These attributes do not create panels or manage their visibility.

The tablist scrolls horizontally when labels exceed its container. Tabs retain their intrinsic label width instead of shrinking into overlapping text. Each tab stays fully inside the scrollport; coarse-pointer controls keep at least 44px of visible height. Rich labels may use nonwrapping text, but must not widen the page.

The standalone Tab primitive can be used inside a caller-managed tablist. Derive unique IDs, render the matching panel, and implement the list’s arrow handler; the primitive does not coordinate sibling tabs.

```jsx
<Tab id={boardTabId} aria-controls={boardPanelId}
  selected={lens === "board"} tabIndex={lens === "board" ? 0 : -1}
  onClick={() => setLens("board")} onKeyDown={onTabKeyDown}>Board</Tab>
```

Keyboard: Tabs uses the declared axis arrows plus Home/End, wrapping and automatic onChange requests; the parent supplies a value matching an item. Tab is a primitive native tab button: hand-composed lists must supply roving tabIndex, arrow handlers, IDs/panel relationships and selection/visibility themselves.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default tablist name is localized; labels, counts, custom ARIA names and all panel content are caller-owned.

Source evidence: `Tabs.jsx` and `Tabs.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Tab: ref targets HTMLButtonElement (button); while native target is mounted.
- Tabs: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

### Orientation / Hướng hiển thị

`aria-orientation="horizontal"` uses Left/Right; `vertical` uses Up/Down. Both wrap, support Home/End, move focus, and select through `onChange`; keep `value` controlled. Other-axis keys retain browser behavior. The caller supplies a matching visual layout (for example `style={{flexDirection: 'column'}}` for vertical). Storybook's orientation control supplies that layout.

Hướng ngang dùng phím Trái/Phải, hướng dọc dùng Lên/Xuống. Cả hai quay vòng, hỗ trợ Home/End, di chuyển tiêu điểm và chọn qua `onChange`; cập nhật `value` tương ứng. Phím của trục còn lại giữ hành vi trình duyệt. Bên gọi phải cung cấp bố cục khớp hướng, ví dụ `flexDirection: 'column'` cho hướng dọc.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Tab

[Khai báo / Declaration](Tabs.d.ts) · [Nguồn / Source](Tabs.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `count` | optional | Không khai báo trong tham số / Not declared in parameter |
| `selected` | optional | `false` |

API kế thừa: 290 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Tab.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 290 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Tab.runtime.defaultExpressions` in the canonical source facts.

### Tabs

[Khai báo / Declaration](Tabs.d.ts) · [Nguồn / Source](Tabs.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-orientation` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `tabs` | required | `[]` |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 277 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Tabs.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 277 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Tabs.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
