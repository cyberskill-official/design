<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**RadioGroup / Radio** — radio chọn đơn trong fieldset có nhãn, được điều khiển qua `value`/`onChange`. Dùng accent-color thương hiệu.

```jsx
<RadioGroup legend="Plan" value={plan} onChange={setPlan}
  options={[{value:"mo",label:"Monthly"},{value:"yr",label:"Annual",description:"Two months free"}]} />
```

Nhãn ReactNode và nội dung tùy chọn giữ số `0`. Nội dung tùy chọn vẫn bỏ `null`, `false` và chuỗi rỗng.

Radio độc lập nhận prop radio native; dùng cùng name cho một tập lựa chọn.

```jsx
<Radio name="plan" value="monthly" label="Monthly"
  checked={plan === "monthly"} onChange={() => setPlan("monthly")} />
```

Bàn phím: Radio và RadioGroup dùng hành vi bàn phím radio native. Thành viên nhóm chung name; bên gọi chế độ điều khiển cập nhật `value` từ `onChange`. Cung cấp `legend` có ý nghĩa cho ngữ cảnh nhóm.

Bản địa hóa: Nhãn nhìn thấy và nội dung do bên sử dụng sở hữu; không có bản dịch tích hợp cho chúng.

Bằng chứng nguồn: `RadioGroup.jsx` và `RadioGroup.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`rootProps` trỏ tới phần tử fieldset hiện có đang sở hữu `className`. Hỗ trợ thuộc tính native, thuộc tính data, class, style và trình xử lý sự kiện. Ngữ nghĩa, trạng thái và hình học do component sở hữu vẫn được kiểm soát; trình xử lý nội bộ chạy trước trình xử lý của bên sử dụng. Không thêm phần tử bọc hay hợp đồng ref mới.

Ref native (React 18/19):
- Radio: ref trỏ tới HTMLInputElement (input); khi đích native đang được mount.
- RadioGroup: ref trỏ tới HTMLFieldSetElement (fieldset); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

Đặt tên trường native (chỉ Radio): Nhãn nhìn thấy do component sở hữu có ID span ổn định và cung cấp `aria-labelledby`, để hint/lỗi đã render, nơi được hỗ trợ, vẫn là mô tả `aria-describedby` thay vì thành một phần tên. Giữ nhãn số `0`. Chuỗi `aria-label`/`aria-labelledby` tường minh của bên gọi (kể cả rỗng/sai) không đổi; prop đặt tên null/undefined bị bỏ để dùng nhãn sở hữu làm dự phòng. Ghép ID mô tả của bên gọi và component không trùng. DOM hiện có, ref native/root và ngữ nghĩa gửi form vẫn có thẩm quyền.

## English
<!-- END GENERATED VI PROMPT v1 -->
**RadioGroup / Radio** — single-choice radios in a labelled fieldset, controlled by `value`/`onChange`. Brand accent-color.

```jsx
<RadioGroup legend="Plan" value={plan} onChange={setPlan}
  options={[{value:"mo",label:"Monthly"},{value:"yr",label:"Annual",description:"Two months free"}]} />
```

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings.

The standalone Radio accepts native radio props; use the same name across a choice set.

```jsx
<Radio name="plan" value="monthly" label="Monthly"
  checked={plan === "monthly"} onChange={() => setPlan("monthly")} />
```

Keyboard: Radio and RadioGroup use native radio keyboard behavior. Group members share a name; controlled callers update `value` from `onChange`. Provide a meaningful `legend` for group context.

Localization: Visible labels and content are caller-owned; there is no built-in translation for them.

Source evidence: `RadioGroup.jsx` and `RadioGroup.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`rootProps` targets the existing fieldset element owning `className`. Native attributes, data attributes, classes, style and event handlers are supported. Owned semantics/state and geometry remain controlled; internal handlers run before consumer handlers. No extra wrapper or ref contract is added.

Native refs (React 18/19):
- Radio: ref targets HTMLInputElement (input); while native target is mounted.
- RadioGroup: ref targets HTMLFieldSetElement (fieldset); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

Native field naming (Radio only): the owned visible label has a stable span ID and supplies `aria-labelledby`, so rendered hint/error text, where supported, remains an `aria-describedby` description rather than becoming part of the name. Numeric `0` labels are retained. Explicit caller `aria-label`/`aria-labelledby` strings (including empty/invalid strings) remain unchanged; null/undefined naming props are omitted and allow the owned-label fallback. Caller and owned description IDs are merged without duplicates. Existing DOM, native/root refs and form submission semantics remain authoritative.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Radio

[Khai báo / Declaration](RadioGroup.d.ts) · [Nguồn / Source](RadioGroup.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `description` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | required | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 310 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 1 mặc định tham số cho thuộc tính kế thừa; xem `Radio.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 310 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 1; see `Radio.runtime.defaultExpressions` in the canonical source facts.

### RadioGroup

[Khai báo / Declaration](RadioGroup.d.ts) · [Nguồn / Source](RadioGroup.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `legend` | optional | Không khai báo trong tham số / Not declared in parameter |
| `name` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onChange` | optional | Không khai báo trong tham số / Not declared in parameter |
| `options` | required | `[]` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `value` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `RadioGroup.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `RadioGroup.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
