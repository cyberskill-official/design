<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Anchor** — mục lục trong trang có scrollspy (thanh Ochre đánh dấu phần đang hoạt động).

```jsx
<Anchor title="On this page" items={[{id:"intro",label:"Intro"},{id:"pricing",label:"Pricing"}]}/>
```

Title đã render cung cấp tên hỗ trợ tiếp cận của bề mặt, kể cả nội dung React phong phú. Cung cấp văn bản có ý nghĩa; title chỉ trang trí không thể tạo tên hữu ích.

Theo dõi cuộn giữ toàn bộ đích giao nhau qua thông báo observer tăng dần và chọn đích hiện tại cao nhất. Khi không có giao với dải theo dõi, giữ vị trí cuối. Đổi items hoặc unmount ngắt observer cũ.

Bàn phím: Tab tới liên kết native trong trang; Enter theo ID đích. Đích phải tồn tại trong cùng tài liệu khi effect observer chạy. Scrollspy theo dõi đích giao nhau và giữ vị trí cuối khi không có giao.

Bản địa hóa: Title và nhãn mục do bên gọi sở hữu; không có title mục lục dịch sẵn. Cung cấp title có ý nghĩa để đặt tên vùng điều hướng.

Bằng chứng nguồn: `Anchor.jsx` và `Anchor.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Anchor: ref trỏ tới HTMLElement (nav); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Anchor** — in-page TOC with scrollspy (ochre rail marks the active section).

```jsx
<Anchor title="On this page" items={[{id:"intro",label:"Intro"},{id:"pricing",label:"Pricing"}]}/>
```

The rendered title supplies the surface's accessible name, including rich React content. Supply meaningful text; purely decorative title content cannot provide a useful name.

Scroll tracking retains the full set of intersecting targets across incremental observer notifications and selects the topmost current target. When none intersect the tracking band, it preserves the last location. Changing the items or unmounting disconnects the previous observer.

Keyboard: Tab reaches native in-page links; Enter follows their target IDs. Targets must exist in the same document when the observer effect runs. The scrollspy tracks intersecting targets and retains its last location when none intersect.

Localization: The title and item labels are caller-owned; there is no built-in translated TOC title. Supply a meaningful title to name the navigation region.

Source evidence: `Anchor.jsx` and `Anchor.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Anchor: ref targets HTMLElement (nav); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Anchor

[Khai báo / Declaration](Anchor.d.ts) · [Nguồn / Source](Anchor.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `items` | required | `[]` |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 278 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Anchor.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 278 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Anchor.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
