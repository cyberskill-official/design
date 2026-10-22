<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**PromptInput** — ô “make a wish” dành cho AI. Enter gửi, Shift+Enter xuống dòng; hỗ trợ chế độ có hoặc không điều khiển. `hint` công bố mặc định mô tả Lumi trả lời và chuyển yêu cầu rõ ràng cho con người. Chỉ dùng khi bên sử dụng thực thi đúng quy trình đó; nếu không, cung cấp `hint` chính xác.

```jsx
<PromptInput value={q} onChange={setQ} onSubmit={send} placeholder="Make a wish…" />
```

`onSubmit` nhận giá trị đã nhập; component không gọi mô hình hay tổ chức xem xét bởi con người. Bên sử dụng thực thi các hành động đó và chịu trách nhiệm về tính chính xác của nội dung công bố.

`value` điều khiển trường; nếu không có, trạng thái nội bộ vẫn cập nhật kể cả khi có hàm quan sát `onChange`. Bên sử dụng chế độ điều khiển phải tự cập nhật `value`. Xác nhận tổ hợp IME không gửi; Enter thông thường gửi một lần, Shift+Enter chèn dòng mới, trạng thái busy/disabled chặn gửi.

Hint có giá trị số `0` tường minh vẫn hiển thị. `null`, `false` và chuỗi rỗng bỏ hint; chỉ `undefined` chọn mặc định đã bản địa hóa.

Bàn phím: Enter gửi nội dung không trắng nếu không busy/disabled; Shift+Enter chèn dòng mới và xác nhận IME không gửi. Nút gửi native cũng hỗ trợ Enter/Space.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `PromptInput.jsx` và `PromptInput.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- PromptInput: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: textarea (HTMLTextAreaElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**PromptInput** — the AI-native "make a wish" box. Enter submits, Shift+Enter newlines; controlled or uncontrolled. The default disclosure `hint` describes Lumi replying and handing clear wishes to a human. Use it only when the consumer implements that workflow; otherwise supply an accurate `hint`.

```jsx
<PromptInput value={q} onChange={setQ} onSubmit={send} placeholder="Make a wish…" />
```

`onSubmit` receives the entered value; the component does not call a model or arrange human review. The consumer implements those actions and owns the accuracy of its disclosure.

`value` controls the field; without it, internal state updates even when an
`onChange` observer is supplied. Controlled callers must update `value` themselves.
IME composition confirmation does not submit; ordinary Enter submits once,
Shift+Enter inserts a newline, and busy/disabled states block submission.

An explicit numeric `0` hint remains visible. `null`, `false` and empty strings omit the hint; only `undefined` selects the localized default.

Keyboard: Enter submits nonblank input unless busy/disabled; Shift+Enter inserts a newline and IME confirmation does not submit. The native send button also supports Enter/Space.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `PromptInput.jsx` and `PromptInput.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- PromptInput: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned textarea (HTMLTextAreaElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### PromptInput

[Khai báo / Declaration](PromptInput.d.ts) · [Nguồn / Source](PromptInput.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `aria-label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `busy` | optional | `false` |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `hint` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onSubmit` | optional | Không khai báo trong tham số / Not declared in parameter |
| `placeholder` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `sendLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `PromptInput.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `PromptInput.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
