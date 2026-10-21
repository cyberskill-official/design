<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Stat** — KPI có nhãn và delta xu hướng tùy chọn (lên = success, xuống = danger, phẳng = muted).

```jsx
<Stat label="Avg progress" value="70%" delta="+6 this week" trend="up" />
```

Nhãn chỉ số và delta phẳng dùng vai trò chữ mờ; delta lên/xuống dùng vai trò chữ ngữ nghĩa success/danger thay vì nền trạng thái.

Bàn phím: Hiển thị chỉ số không thêm thao tác bàn phím; controls phối hợp giữ hành vi riêng.

Bản địa hóa: Nhãn và nội dung con do bên gọi quản lý; component không có bản dịch tích hợp. Bên gọi cung cấp chỉ số, delta và xu hướng; component không tính chúng.

Bằng chứng nguồn: `Stat.jsx` và `Stat.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Stat: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Stat** — labelled KPI with an optional trend delta (up = success, down = danger, flat = muted).

```jsx
<Stat label="Avg progress" value="70%" delta="+6 this week" trend="up" />
```

The metric label and flat delta use the muted text role; up/down deltas use semantic success/danger text roles rather than status fills.

Keyboard: The metric display adds no keyboard action; composed controls retain their own behavior.

Localization: Labels and child content are caller-owned; this component has no built-in translation. The caller supplies the metric, delta and trend; the component does not calculate them.

Source evidence: `Stat.jsx` and `Stat.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Stat: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Stat

[Khai báo / Declaration](Stat.d.ts) · [Nguồn / Source](Stat.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `delta` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | required | Không khai báo trong tham số / Not declared in parameter |
| `trend` | optional | `"flat"` |
| `value` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 280 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Stat.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 280 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Stat.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
