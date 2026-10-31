<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Drawer** — panel trượt từ cạnh + màn che (mẫu chi tiết Status Hub). Escape / nhấn màn che để đóng; `side="left"` cho cạnh trái.

```jsx
<Drawer open={open} onClose={close} title="Design System v1.6"
  actions={<Button>Open project</Button>}>
  <DescriptionList items={meta} />
</Drawer>
```

Title đã render cung cấp tên hỗ trợ tiếp cận của bề mặt, kể cả nội dung React phong phú. Cung cấp văn bản có ý nghĩa; title chỉ trang trí không thể tạo tên hữu ích.

Các slot actions giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

Bàn phím: Lớp modal dùng chung chuyển tiêu điểm, giữ Tab bên trong và khôi phục tiêu điểm thuộc quyền quản lý khi đóng. Escape, màn che và nút đóng gọi onClose; phần cha phải đổi open. Phần thân tự nhận tiêu điểm để cuộn nội dung.

Bản địa hóa: Nội dung EN/VI tích hợp theo lang tường minh hoặc scope ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Không dịch nội dung bên gọi cung cấp. Tên panel/đóng mặc định được bản địa hóa. Tiêu đề cung cấp đặt tên hộp thoại; tiêu đề, nội dung và hành động do bên gọi quản lý.

Bằng chứng nguồn: `Drawer.jsx` và `Drawer.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Hiệu ứng trượt dùng margin logic để lớp phủ fixed lồng nhau giữ tọa độ viewport. Vật liệu có filter giữ màu nền trên panel và dùng lớp nền filter trang trí cùng cấp; markup máy chủ giữ vật liệu thông thường trước hydration. Nội dung giữ scope ngôn ngữ/token DOM. Các kiểm tra triển khai này không xác lập nghiệm thu AT thủ công hay thị giác sản phẩm.

Phần thân chỉ tham gia thứ tự Tab khi nội dung tràn, giữ khả năng cuộn bằng bàn phím mà không thêm điểm dừng cho nội dung ngắn. Đổi kích thước và nội dung tính lại điều kiện này.

`rootProps` trỏ đến div panel hộp thoại hiện có. Chấp nhận thuộc tính native, thuộc tính data, style và sự kiện. Không thêm wrapper hay hợp đồng ref. Component vẫn kiểm soát ngữ nghĩa/trạng thái do nó sở hữu; handler nội bộ chạy trước callback phía sử dụng.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Panel modal dùng div trung tính với role="dialog", không phải landmark aside. Liên kết tiêu đề, trạng thái aria-modal, thứ tự Escape, bẫy tiêu điểm và khôi phục vẫn do trình quản lý lớp phủ sở hữu.

Ref native (React 18/19):
- Drawer: ref trỏ tới HTMLDivElement (role=dialog); chỉ khi bảng nổi đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Drawer** — slide-in side panel + scrim (the Status Hub detail pattern). Escape / scrim-click close; `side="left"` for left.

```jsx
<Drawer open={open} onClose={close} title="Design System v1.6"
  actions={<Button>Open project</Button>}>
  <DescriptionList items={meta} />
</Drawer>
```

The rendered title supplies the surface's accessible name, including rich React content. Supply meaningful text; purely decorative title content cannot provide a useful name.

The actions slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: The shared modal layer moves focus, contains Tab and restores owned focus on closure. Escape, scrim and the close button call onClose; the parent must change open. The body is itself focusable for scrollable content.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default panel/close names are localized. A supplied title names the dialog; title, body and actions remain caller-owned.

Source evidence: `Drawer.jsx` and `Drawer.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

The slide uses logical margins so fixed nested overlays keep viewport coordinates. Filtered materials keep their fill on the panel and use a decorative sibling filter backing; server markup retains its ordinary material before hydration. Content keeps its DOM language/token scope. These implementation checks do not establish manual AT or product visual acceptance.

The body joins the Tab sequence only when its content overflows, preserving keyboard access to scrolling without adding a stop for short content. Resize and content changes recalculate this condition.

`rootProps` targets the existing dialog panel div. It accepts native attributes, data attributes, style and events. It does not add a wrapper or ref contract. Component-owned semantics/state remain controlled; internal event handlers run before consumer callbacks.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

The modal panel uses a neutral div with role="dialog", not an aside landmark. Its title association, aria-modal state, Escape ordering, focus trap and restoration remain owned by the overlay manager.

Native refs (React 18/19):
- Drawer: ref targets HTMLDivElement (role=dialog); only while panel is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Drawer

[Khai báo / Declaration](Drawer.d.ts) · [Nguồn / Source](Drawer.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `actions` | optional | Không khai báo trong tham số / Not declared in parameter |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClose` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onOpenChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `open` | required | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `side` | optional | `"right"` |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Drawer.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Drawer.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
