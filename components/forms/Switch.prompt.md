<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Switch** — toggle bật/tắt hỗ trợ tiếp cận (`role="switch"`), track Umber khi bật ở Light, Ochre ở Dark. Dành cho thiết lập áp dụng ngay (dùng Checkbox trong form gửi sau).

```jsx
<Switch label="Dark theme" checked={dark} onChange={e => setDark(e.target.checked)} />
```

Nhãn số `0` vẫn hiển thị và cung cấp tên hỗ trợ tiếp cận. Tên ARIA tường minh giữ ưu tiên; nhãn thiếu/rỗng giữ dự phòng đã bản địa hóa.

Bàn phím: Dùng tiêu điểm checkbox native và Space kích hoạt với `role="switch"`. Cung cấp nhãn hoặc tên ARIA tường minh xác định thiết lập.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `Switch.jsx` và `Switch.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Tên dự phòng khi chưa đặt tên ổn định (“Setting” / “Cài đặt”) qua các trạng thái checked; `aria-checked` công bố trạng thái. Ưu tiên nhãn riêng cho thiết lập.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Switch: ref trỏ tới HTMLInputElement (input); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Switch** — accessible on/off toggle (`role="switch"`), Umber track when on in Light; Ochre in Dark. For instant-apply settings (use Checkbox in forms that submit).

```jsx
<Switch label="Dark theme" checked={dark} onChange={e => setDark(e.target.checked)} />
```

A numeric `0` label remains visible and supplies the accessible name. Explicit ARIA naming retains precedence; absent/empty labels retain the localized fallback.

Keyboard: Uses the native checkbox’s focus and Space activation with `role="switch"`. Supply a label or explicit ARIA name that identifies the setting.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `Switch.jsx` and `Switch.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

The unnamed fallback is stable (“Setting” / “Cài đặt”) across checked states; `aria-checked` exposes state. Prefer a setting-specific label.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Switch: ref targets HTMLInputElement (input); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Switch

[Khai báo / Declaration](Switch.d.ts) · [Nguồn / Source](Switch.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 308 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 1 mặc định tham số cho thuộc tính kế thừa; xem `Switch.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 308 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 1; see `Switch.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
