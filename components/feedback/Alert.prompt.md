<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Alert** — banner nội dòng. `variant` semantic đặt viền accent và icon mặc định (thay qua `icon`). Ý nghĩa nằm trong văn bản, không chỉ màu.

```jsx
<Alert variant="warning" title="Blocked">Provenance ledger needs the signing service.</Alert>
<Alert variant="success">All 15 element packs verified — zero warnings.</Alert>
```

Giữ số không trong các slot ReactNode được khai báo. Slot render có điều kiện vẫn bỏ phần tử bọc cho chuỗi rỗng, false và null; hành vi tiêu đề mặc định hiện có không đổi.

`onDismiss` làm hiện nút đóng và nhận sự kiện chuột React của nút. Callback yêu cầu đóng; cha sở hữu việc bỏ alert.

Bàn phím: Vùng chứa thông điệp không thêm lệnh bàn phím. Nếu có `onDismiss`, Tab tới nút đóng native, Enter/Space gọi nó; bên gọi bỏ alert.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` tường minh hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng cung cấp không được dịch. Nội dung dịch tích hợp là nhãn nút đóng; title/body được truyền vẫn do bên gọi sở hữu.

Bằng chứng nguồn: `Alert.jsx` và `Alert.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Alert: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Alert** — inline banner. Semantic `variant` sets the accent border + default icon (override with `icon`). Meaning lives in the text, not colour alone.

```jsx
<Alert variant="warning" title="Blocked">Provenance ledger needs the signing service.</Alert>
<Alert variant="success">All 15 element packs verified — zero warnings.</Alert>
```

Numeric zero is preserved in declared ReactNode content slots. Conditionally rendered slots still omit their wrapper for empty-string, false and null values; existing default-title behavior is unchanged.

`onDismiss` shows a dismiss button and receives its React mouse event. The callback requests dismissal; the parent owns removing the alert.

Keyboard: The message container adds no keyboard commands. If `onDismiss` is supplied, Tab reaches a native dismiss button and Enter/Space invokes it; the caller removes the alert.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in translated copy is the dismiss button label; supplied title/body remain caller-owned.

Source evidence: `Alert.jsx` and `Alert.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Alert: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Alert

[Khai báo / Declaration](Alert.d.ts) · [Nguồn / Source](Alert.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `icon` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onClose` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onDismiss` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onOpenChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `title` | optional | Không khai báo trong tham số / Not declared in parameter |
| `variant` | optional | `"info"` |

API kế thừa: 277 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Alert.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 277 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Alert.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
