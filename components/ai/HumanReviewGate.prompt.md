<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**HumanReviewGate** — công cụ xem xét bởi con người cho quy trình có AI hỗ trợ. Thẻ viền cảnh báo gồm nhãn rủi ro, tóm tắt dễ hiểu, người xem xét tùy chọn và Approve / Reject.

```jsx
<HumanReviewGate
  risk="High-stakes · billing change"
  summary="Lumi proposes moving this client to the annual plan and issuing a prorated credit."
  reviewer="Ops on call"
  onApprove={apply}
  onReject={dismiss}
/>
```

- Rủi ro được trình bày bằng chữ, không chỉ bằng màu. Kết hợp với `AIDisclosureBadge` để hiển thị sự tham gia của AI và thông tin nguồn do bên sử dụng cung cấp.

Component render thẻ xem xét và gọi `onApprove` hoặc `onReject`; nó không xác thực người xem xét, lưu phê duyệt hay ngăn hành động ngoài các callback này. Bên sử dụng phải thực thi quyền hạn cần thiết trước khi hành động và cung cấp nội dung rủi ro, tóm tắt, người xem xét chính xác.

Các slot người xem xét giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

Bàn phím: Tab tới Reject và Approve; Enter/Space native gọi callback tương ứng của bên sử dụng. UI này không thực thi việc phê duyệt.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `HumanReviewGate.jsx` và `HumanReviewGate.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử section hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- HumanReviewGate: ref trỏ tới HTMLElement (section); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**HumanReviewGate** — a human-review control for an AI-assisted workflow. Warning-bordered card with a risk label, plain-language summary, optional reviewer, and Approve / Reject.

```jsx
<HumanReviewGate
  risk="High-stakes · billing change"
  summary="Lumi proposes moving this client to the annual plan and issuing a prorated credit."
  reviewer="Ops on call"
  onApprove={apply}
  onReject={dismiss}
/>
```

- Risk is stated in words, never colour alone. Pair with `AIDisclosureBadge` to display AI involvement and caller-supplied source information.

The component renders the review card and calls `onApprove` or `onReject`; it does not authenticate a reviewer, persist approval, or prevent an action outside these callbacks. The consumer must enforce the required authorization before executing the action and supply accurate risk, summary and reviewer content.

The reviewer slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Tab reaches Reject and Approve; native Enter/Space activation invokes the corresponding caller callback. This UI does not enforce approval.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `HumanReviewGate.jsx` and `HumanReviewGate.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing section element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- HumanReviewGate: ref targets HTMLElement (section); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### HumanReviewGate

[Khai báo / Declaration](HumanReviewGate.d.ts) · [Nguồn / Source](HumanReviewGate.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `approveLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onApprove` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onReject` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rejectLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `reviewer` | optional | Không khai báo trong tham số / Not declared in parameter |
| `risk` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `summary` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `HumanReviewGate.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `HumanReviewGate.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
