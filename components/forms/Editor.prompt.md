<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Editor** — trình soạn rich-text nhẹ (B/I/list), `onChange` HTML.

Ranh giới tin cậy (CDS-SEC-001 / SEC-001 / TASK-IMP-029):
- Mô hình giá trị theo **schema cho phép** (`EDITOR_SCHEMA`: `p` · `br` · `b` · `i` · `strong` · `em` · `ul` · `ol` · `li` · `div` · `span`; **không thuộc tính**).
- `defaultValue` và HTML phát từ `onChange` đi qua `sanitizeHtml` (loại script/handler/thẻ không được phép).
- Node và trình duyệt dùng cùng parser HTML trơ được ghim và chính sách đầu ra không thuộc tính. Container lạ được tháo bọc đệ quy; cây con foreign/raw-text bị bỏ. Đầu ra dành cho nội dung phần tử HTML, không bao giờ cho ngữ cảnh thuộc tính, URL, CSS hoặc script.
- Paste và drop hủy chèn native và làm sạch HTML trước khi vào editor sống. Văn bản thuần được escape, giữ xuống dòng. Thao tác toolbar hỗ trợ chuột, Enter, Space trong khi giữ vùng chọn editor.
- Nút toolbar giữ tiêu điểm Tab native và kích hoạt bằng click, Enter hoặc Space. `aria-pressed` báo trạng thái định dạng của văn bản được chọn (hoặc trạng thái lệnh trình duyệt tại caret thu gọn) (`true`, `false`, hoặc `mixed`); chuyển tiêu điểm tới toolbar giữ vùng chọn đã lưu. Đây là lệnh toggle, không phải toolbar dùng roving-focus.
- `unsafeHtml` bỏ qua làm sạch — **chỉ nội dung tin cậy** (HTML từ CMS/người vận hành). Ưu tiên `defaultValue` trừ khi thật sự cần markup thô.
- contentEditable + `document.execCommand` giữ nguyên trong đợt này; thay thế dạng TipTap/ProseMirror là công việc tương lai nếu sản phẩm ưu tiên.

```jsx
<Editor defaultValue="<p>Điều ước…</p>" onChange={setHtml}/>
{/* trusted only: */}
<Editor unsafeHtml={cmsHtml} onChange={setHtml}/>
```

Bàn phím: Tab native tới nút toolbar và vùng soạn; Enter/Space kích hoạt lệnh toolbar trong khi giữ vùng chọn đã lưu. Soạn văn bản dùng hành vi contentEditable của trình duyệt.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng tiếng Việt). Nội dung bên sử dụng truyền vào không được dịch. HTML/văn bản được truyền thuộc bên sử dụng. Seed ban đầu áp dụng một lần; thay đổi seed-prop sau không đặt lại editor.

Bằng chứng nguồn: `Editor.jsx` và `Editor.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

Hằng công khai `EDITOR_SCHEMA` là mô tả chính sách đã đóng băng: danh sách thẻ HTML được phép đóng băng và bản đồ thuộc tính rỗng đóng băng. Đây là dữ liệu kiểm tra, không phải sanitizer cấu hình được hay hàm làm sạch đầu vào. Editor áp dụng sanitizer được duy trì; bên sử dụng kiểm tra hằng vẫn chịu trách nhiệm dùng sanitizer và ngữ cảnh đầu ra phù hợp. Không sửa hoặc mở rộng chính sách được xuất. Hằng không có hành vi bàn phím hoặc văn bản được dịch.

```jsx
<code>{EDITOR_SCHEMA.tags.join(", ")}</code>
```

Bằng chứng nguồn của hằng: `editor-schema.js` xác định chính sách runtime, `editor-schema.d.ts` khai báo tags/attrs chỉ đọc, `_esm/react.d.ts` xuất lại. Xem nguồn không xác nhận an toàn cho HTML sink khác hay chứng nhận markup tùy ý của bên sử dụng.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- Editor: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount. controlRef trỏ tới phần tử do component sở hữu: div (HTMLDivElement); khi phần tử điều khiển của component đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Editor** — light rich-text (B/I/list), HTML `onChange`.

Trust boundary (CDS-SEC-001 / SEC-001 / TASK-IMP-029):
- Value model is **schema-allowlisted** (`EDITOR_SCHEMA`: `p` · `br` · `b` · `i` · `strong` · `em` · `ul` · `ol` · `li` · `div` · `span`; **no attributes**).
- `defaultValue` and emitted `onChange` HTML run through `sanitizeHtml` (scripts/handlers/disallowed tags stripped).
- Node and browsers use the same pinned, inert HTML parser and attribute-free output policy. Unknown containers are recursively unwrapped; foreign/raw-text subtrees are discarded. Output is for HTML element content, never an attribute, URL, CSS or script context.
- Paste and drop cancel native insertion and sanitize HTML before it enters the live editor. Plain text is escaped and line breaks are preserved. Toolbar actions support mouse, Enter and Space while preserving the editor selection.
- Toolbar buttons keep native Tab focus and activate with click, Enter or Space. `aria-pressed` reports the formatting state of selected text (or the browser command state at a collapsed caret) (`true`, `false`, or `mixed`); moving focus to the toolbar retains the saved selection. These are toggle commands, not a roving-focus toolbar.
- `unsafeHtml` bypasses sanitization — **trusted content only** (CMS/operator HTML). Prefer `defaultValue` unless you explicitly need raw markup.
- contentEditable + `document.execCommand` remain for this wave; a TipTap/ProseMirror-class replacement is a future task if product prioritizes it.

```jsx
<Editor defaultValue="<p>Điều ước…</p>" onChange={setHtml}/>
{/* trusted only: */}
<Editor unsafeHtml={cmsHtml} onChange={setHtml}/>
```

Keyboard: Native Tab reaches toolbar buttons and the editable area; Enter/Space activates toolbar commands while retaining the saved selection. Text editing uses the browser’s contentEditable behavior.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Supplied HTML/text is caller-owned. The initial seed is applied once; later seed-prop changes do not reset the editor.

Source evidence: `Editor.jsx` and `Editor.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

The public `EDITOR_SCHEMA` constant is a frozen policy descriptor: a frozen list of allowed HTML tags and a frozen empty attribute map. It is inspection data, not a configurable sanitizer or a function to sanitize input. Editor applies its maintained sanitizer; consumers inspecting this constant remain responsible for using a suitable sanitizer and output context. Do not mutate or extend the exported policy. The constant has no keyboard behavior or translated text.

```jsx
<code>{EDITOR_SCHEMA.tags.join(", ")}</code>
```

Constant source evidence: `editor-schema.js` defines the runtime policy, `editor-schema.d.ts` declares readonly tags/attrs, and `_esm/react.d.ts` re-exports it. Source inspection does not establish safety for other HTML sinks or certify arbitrary consumer markup.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- Editor: ref targets HTMLDivElement (div); while native target is mounted. controlRef targets its owned div (HTMLDivElement); while component control is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Editor

[Khai báo / Declaration](Editor.d.ts) · [Nguồn / Source](Editor.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `controlRef` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultValue` | optional | `""` |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `minHeight` | optional | `120` |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `unsafeHtml` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Editor.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Editor.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
