<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Icon** — renderer duy nhất cho bộ biểu tượng nét trong kho CyberSkill (không có thư viện icon bên ngoài). Icon dùng stroke `currentColor`, độ dày mặc định 1.75, đầu/mối nối tròn và kích thước từ token `--cs-icon-*`. Mặc định là trang trí; truyền `label` để công bố icon có ý nghĩa cho công nghệ hỗ trợ.

```jsx
<Icon name="arrow-right" />                    {/* decorative */}
<Icon name="sparkle" size="lg" label="Wish" /> {/* meaningful */}
```

Bộ tên: `close · sun · moon · arrow-right · check · sparkle · chat · sound-on · sound-off` + phần mở rộng v2.0 `search · sliders · upload · download · calendar · user · plus · trash · external · menu` + v2.13 `chevron-down/up/left/right · edit · copy · info · alert-triangle · pin` (cùng ngữ pháp). `sparkle` là ký hiệu “wish” của thương hiệu. Màu theo token văn bản xung quanh — đặt `color` ở cha để đổi màu.

Bàn phím: SVG không thêm thao tác bàn phím. Icon có nhãn truyền đạt tên ảnh; tiêu điểm hành động và kích hoạt thuộc điều khiển bao quanh.

Bản địa hóa: Nhãn hỗ trợ tiếp cận tùy chọn do bên sử dụng sở hữu; không có bản dịch tích hợp. Bỏ nhãn khi icon chỉ trang trí. `strokeWidth` thay độ dày mặc định 1.75.

Bằng chứng nguồn: `Icon.jsx` và `Icon.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Icon: ref trỏ tới SVGSVGElement (svg); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

### Tên biểu tượng / Declared icon names

Danh sách chọn tên và ma trận tên của Storybook liệt kê `CS_ICONS`. Từng tên do tác giả khai báo được kiểm tra với chính xác các primitive SVG trên Chromium, Firefox và WebKit. Tên JavaScript thiếu hoặc không biết vẫn dự phòng bằng sparkle; union literal trong khai báo hướng dẫn bên gọi có kiểu. Truyền `label` cho icon có ý nghĩa; icon không nhãn vẫn là trang trí.

Danh sách chọn tên và ma trận Storybook lấy từ `CS_ICONS`. Kiểm thử so sánh chính xác các phần tử SVG của từng tên trên ba trình duyệt. Tên thiếu hoặc không hợp lệ khi dùng JavaScript vẫn dùng sparkle. Truyền `label` cho biểu tượng có ý nghĩa; biểu tượng không có nhãn được ẩn khỏi cây trợ năng.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Icon** — the single renderer for CyberSkill's in-repo line-icon set (no external icon library). Icons stroke with `currentColor` at the default 1.75 weight, round caps/joins, and size from the `--cs-icon-*` tokens. Decorative by default; pass `label` to expose a meaningful icon to assistive tech.

```jsx
<Icon name="arrow-right" />                    {/* decorative */}
<Icon name="sparkle" size="lg" label="Wish" /> {/* meaningful */}
```

Set: `close · sun · moon · arrow-right · check · sparkle · chat · sound-on · sound-off` + v2.0 extension `search · sliders · upload · download · calendar · user · plus · trash · external · menu` + v2.13 `chevron-down/up/left/right · edit · copy · info · alert-triangle · pin` (same grammar). `sparkle` is the brand's "wish" glyph. Colour follows the surrounding text token — set `color` on a parent to recolour.

Keyboard: The SVG adds no keyboard action. A labelled icon conveys an image name; action focus and activation belong to its surrounding control.

Localization: The optional accessible label is caller-owned; there is no built-in translation. Omit it for a decorative icon. `strokeWidth` overrides the default 1.75 stroke.

Source evidence: `Icon.jsx` and `Icon.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Icon: ref targets SVGSVGElement (svg); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

### Declared icon names / Tên biểu tượng

Storybook's name select and names matrix enumerate `CS_ICONS`. Every authored name is checked against its exact SVG primitives in Chromium, Firefox, and WebKit. A missing or unknown JavaScript name retains the sparkle fallback; the declaration's literal union guides typed callers. Supply `label` for meaningful icons; icons without a label remain decorative.

Danh sách chọn tên và ma trận Storybook lấy từ `CS_ICONS`. Kiểm thử so sánh chính xác các phần tử SVG của từng tên trên ba trình duyệt. Tên thiếu hoặc không hợp lệ khi dùng JavaScript vẫn dùng sparkle. Truyền `label` cho biểu tượng có ý nghĩa; biểu tượng không có nhãn được ẩn khỏi cây trợ năng.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Icon

[Khai báo / Declaration](Icon.d.ts) · [Nguồn / Source](Icon.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `name` | required | Không khai báo trong tham số / Not declared in parameter |
| `size` | optional | `"md"` |
| `strokeWidth` | optional | `1.75` |

API kế thừa: 485 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Icon.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 485 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Icon.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
