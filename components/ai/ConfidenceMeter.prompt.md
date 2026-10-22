<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**ConfidenceMeter** — chỉ báo độ tin cậy AI chia đoạn. Truyền `value` từ 0–1 hoặc một `level`; mức độ luôn được viết thành chữ (không chỉ dùng màu). Kết hợp với AIDisclosureBadge / HumanReviewGate để hiển thị sự tham gia của AI và công cụ xem xét.

Bên sử dụng cung cấp dữ liệu độ tin cậy. Chỉ báo không tính hay hiệu chỉnh độ tin cậy của mô hình, xác minh nguồn hoặc xác nhận phê duyệt. Giá trị số được chặn trong 0–1; dưới 0.4 hiển thị Low, dưới 0.75 hiển thị Medium, từ 0.75 trở lên hiển thị High. Đây là ngưỡng hiển thị, không phải bảo đảm tính đúng đắn.

```jsx
<ConfidenceMeter value={0.82} />
<ConfidenceMeter level="low" label="Model confidence" />
<ConfidenceMeter value={0.82} label={<span>Model <em>confidence</em></span>} />
```

Tên hỗ trợ tiếp cận của chỉ báo tham chiếu nhãn đã render và mức độ đã bản địa hóa. Nhãn có nội dung phong phú và số không vẫn giữ văn bản; ID sinh ra là duy nhất giữa nhiều phiên bản và cập nhật theo nhãn/ngôn ngữ.

Số đoạn là số nguyên: phân số hữu hạn được làm tròn xuống với mức tối thiểu một; số không, số không hữu hạn và giá trị không biểu diễn được dùng mặc định năm. Các đoạn được render và giới hạn của chỉ báo dùng cùng số lượng.

Màu tô của đoạn giữ vai trò semantic fill; nhãn độ tin cậy dùng vai trò semantic `-text` tương ứng trên bề mặt xung quanh.

Bàn phím: Đây là chỉ báo chỉ để hiển thị, không thêm thao tác bàn phím.

Bản địa hóa: Nội dung EN/VI tích hợp theo `lang` được chỉ định hoặc phạm vi ngôn ngữ DOM kế thừa (dự phòng là tiếng Việt). Nội dung do bên sử dụng cung cấp không được tự dịch.

Bằng chứng nguồn: `ConfidenceMeter.jsx` và `ConfidenceMeter.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử div hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Ref native (React 18/19):
- ConfidenceMeter: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**ConfidenceMeter** — segmented AI-confidence indicator. Pass `value` 0–1 or a `level`; the level is always spelled out (never colour alone). Pair with AIDisclosureBadge / HumanReviewGate to display AI involvement and review controls.

Confidence data is supplied by the caller. The meter does not calculate or calibrate model confidence, verify sources, or establish approval. Numeric values are clamped to 0–1; below 0.4 displays Low, below 0.75 displays Medium, and 0.75 or above displays High. These are display thresholds, not a correctness guarantee.

```jsx
<ConfidenceMeter value={0.82} />
<ConfidenceMeter level="low" label="Model confidence" />
<ConfidenceMeter value={0.82} label={<span>Model <em>confidence</em></span>} />
```

The meter's accessible name references the rendered label and localized level.
Rich labels and numeric zero retain their text; generated IDs stay unique across
multiple instances and follow label/language updates.

Segment counts use whole numbers: finite fractions round down with a minimum of one; zero, nonfinite and unrepresentable counts use the default five. The rendered segments and meter limits use the same count.

Segment fills keep their semantic fill role; confidence labels use the corresponding semantic `-text` role on the surrounding surface.

Keyboard: This is a display-only meter and does not add a keyboard action.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `ConfidenceMeter.jsx` and `ConfidenceMeter.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing div element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

Native refs (React 18/19):
- ConfidenceMeter: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### ConfidenceMeter

[Khai báo / Declaration](ConfidenceMeter.d.ts) · [Nguồn / Source](ConfidenceMeter.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `level` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `segments` | optional | `5` |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `ConfidenceMeter.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `ConfidenceMeter.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
