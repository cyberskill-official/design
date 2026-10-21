<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Dialog** — overlay modal và bảng ở giữa. `aria-modal`, tên theo title, bấm overlay sẽ đóng. Kết hợp hành động footer bằng `Button`. Gần toàn màn hình ở viewport hẹp.

```jsx
<Dialog
  open={open}
  title="Send your wish?"
  onClose={() => setOpen(false)}
  actions={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Not now</Button>
    <Button onClick={submit}>Send wish</Button>
  </>}
>
  A real person on the team replies within one business day.
</Dialog>
```

- Chỉ kết hợp Heavy Glass (`className="cs-surface-heavy"`) sau khi kiểm tra APCA với nền phía sau.
- Hiệu ứng xuất hiện mờ dần giữ kích thước vùng thao tác và giữ overlay fixed lồng nhau trong viewport. Giảm chuyển động loại bỏ hiệu ứng. Vật liệu glass có filter dùng lớp nền filter trang trí là phần tử anh em để nội dung cuộn không cắt overlay lồng; nội dung giữ ngôn ngữ và phạm vi token kế thừa. Markup server giữ vật liệu thông thường tới khi lớp nền sẵn sàng sau hydration.

Các slot actions giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

`aria-describedby` tường minh ưu tiên hơn mô tả body mặc định. Dùng ID của phần tử mô tả ngắn hoặc chuỗi rỗng để bỏ mô tả đã làm phẳng đối với nội dung có cấu trúc. Thông báo thực tế vẫn cần người dùng trình đọc màn hình xem xét.

Bàn phím: Lớp modal dùng chung di chuyển tiêu điểm, giới hạn Tab và khôi phục tiêu điểm vẫn do lớp đang đóng sở hữu. Escape, nền backdrop và nút đóng tích hợp gọi onClose; cha cập nhật open được điều khiển. Hành động được kết hợp sở hữu hành vi riêng, kể cả đóng sau khi gửi.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng cung cấp không được dịch. Nhãn đóng mặc định được bản địa hóa. Title, body, actions và nhãn đóng thay thế do bên sử dụng sở hữu. Dùng khả năng thay mô tả hiện có cho nội dung có cấu trúc; thuộc tính nguồn không xác nhận thông báo AT thực tế.

Bằng chứng nguồn: `Dialog.jsx` và `Dialog.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Dialog: ref trỏ tới HTMLElement (role=dialog); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Dialog** — modal overlay + centred panel. `aria-modal`, labelled by title, overlay-click closes. Compose footer actions with `Button`s. Goes near-fullscreen on narrow viewports.

```jsx
<Dialog
  open={open}
  title="Send your wish?"
  onClose={() => setOpen(false)}
  actions={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Not now</Button>
    <Button onClick={submit}>Send wish</Button>
  </>}
>
  A real person on the team replies within one business day.
</Dialog>
```

- Pair with Heavy Glass (`className="cs-surface-heavy"`) only after checking APCA against the backdrop.
- A fade entrance preserves target dimensions and keeps fixed nested overlays in the viewport. Reduced motion removes it. Filtered glass materials use a decorative sibling filter backing so scrolling content does not clip nested overlays; content stays in its inherited language and token scope. Server markup keeps the ordinary material until the backing is ready after hydration.

The actions slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

An explicit `aria-describedby` takes precedence over the default body description. Use a short description element ID, or an empty string to omit a flattened description for structured content. Actual announcements still require screen-reader review.

Keyboard: The shared modal layer moves focus, contains Tab and restores focus still owned by the closing layer. Escape, backdrop and any built-in close button call onClose; the parent updates controlled open. Composed actions own their behavior, including closing after submission.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default close label is localized. Title, body, actions and close-label override remain caller-owned. Use the existing description override for structured content; source attributes do not establish actual AT announcements.

Source evidence: `Dialog.jsx` and `Dialog.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Dialog: ref targets HTMLElement (role=dialog); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Dialog

[Khai báo / Declaration](Dialog.d.ts) · [Nguồn / Source](Dialog.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `actions` | optional | Không khai báo trong tham số / Not declared in parameter |
| `aria-describedby` | optional | Không khai báo trong tham số / Not declared in parameter |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `closeLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClose` | optional | Không khai báo trong tham số / Not declared in parameter |
| `open` | required | Không khai báo trong tham số / Not declared in parameter |
| `title` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 275 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Dialog.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 275 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Dialog.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
