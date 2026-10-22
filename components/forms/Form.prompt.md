<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Form + FormField** — tập hợp trường có tên và tóm tắt lỗi song ngữ; controller tùy chọn: `rules` xác thực khi gửi, FormField có `name` tự nối value/onChange và lỗi từng trường. Tên có dấu chấm dùng được với mảng trường (ví dụ `teammates.0.name`).

```jsx
<Form rules={{email:["required", v=>/.+@.+/.test(v)?null:"Enter a valid email."]}} onSubmit={save}>
  <FormField label="Work email" required name="email"><TextField label="Work email"/></FormField>
  <FormField label="Đồng ý" name="agree" valueProp="checked"><Checkbox label="Đồng ý điều khoản"/></FormField>
  <Button type="submit">Send</Button>
</Form>
```

Chế độ thủ công không đổi: bỏ `rules`/`name`, tự truyền `errors={{email:"…"}}`.

Dùng `valueProp="checked"` cho Checkbox/Switch và `valueProp="pressed"` cho Toggle. Cả hai nhận `false` khi giá trị controller chưa đặt. Callback thay đổi của phần tử con vẫn là hàm quan sát; controller lưu giá trị boolean.

```jsx
<FormField label="Formatting" name="bold" valueProp="pressed">
  <Toggle>Bold</Toggle>
</FormField>
```

**asyncRules:** bản đồ tùy chọn từ tên trường → hàm bất đồng bộ `(value, values) => message|null`. Chạy sau khi `rules` đồng bộ đạt; Form phát `is-pending` + `aria-busy`, vô hiệu hóa trường native qua fieldset, từ chối gửi lại cho tới khi xác thực và promise `onSubmit` được trả về hoàn tất. Controller cũng có thể đọc `pending` từ context Form. Nội dung tương tác tùy chỉnh không native phải tự tuân theo context đó.

Trả về promise lưu từ `onSubmit` hoặc `FormWizard.onComplete` để trạng thái pending kéo dài suốt việc lưu. Callback bị từ chối hiển thị thông điệp trong tóm tắt lỗi và mở khóa để thử lại. Lần thử mới xóa lỗi gửi đó. Callback nhận giá trị đã chụp cho lần thử; thay đổi sau khi bắt đầu không đổi payload. Điều hướng wizard bị vô hiệu hóa khi hoàn tất đang pending, các trường native cũng bị vô hiệu hóa. Thiết lập disabled riêng của từng điều khiển còn nguyên sau khi hoàn tất. Các điều khiển này không cung cấp tính lũy đẳng phía server.

Unmount Form vô hiệu hóa xác thực đang pending: các validator tiếp theo và callback lưu không được bắt đầu bởi lần thử đã bỏ đó. Validator hoặc yêu cầu lưu đang chạy không bị hủy; bên gọi sở hữu việc hủy công việc bên ngoài này.

**FormFieldArray** — quản lý mảng đối tượng hàng dưới `name` trong Form bao quanh. Render-prop của children: `({ index, item, remove, path })`.

Thay đổi mảng dùng trạng thái controller hiện tại, kể cả lệnh xóa được gom theo batch. `remove` nhắm lần xuất hiện hàng đã render (kể cả tham chiếu đối tượng trùng), không làm gì nếu mục đó đã bị xóa hoặc thay. Giới hạn tối thiểu/tối đa được kiểm tra với độ dài hiện tại. Danh tính phần tử con của hàng được giữ khi thêm/xóa mảng và sửa trường dấu chấm, kể cả tham chiếu trùng. Key là metadata nội bộ, không phải trường được gửi. Thay toàn bộ mảng tạo danh tính hàng mới. Dùng callback render mới nhất sau khi sửa/thay mục; callback không phải định danh hàng lâu dài.

```jsx
<Form initialValues={{teammates:[{name:""}]}} onSubmit={save}>
  <FormFieldArray name="teammates" label="Teammates" min={1} max={5} addLabel="Add person">
    {({ index, remove, path }) => (
      <>
        <FormField label={`Name ${index+1}`} name={path("name")}><TextField label="Name"/></FormField>
        <Button type="button" variant="ghost" size="sm" onClick={remove}>Remove</Button>
      </>
    )}
  </FormFieldArray>
  <Button type="submit">Save</Button>
</Form>
```

**FormWizard** — controller nhiều bước (không lồng `<form>`). Mỗi bước có thể khai báo `rules` + `render()`. Hoàn tất gọi `onComplete(values)`.

```jsx
<FormWizard
  initialValues={{email:"",wish:""}}
  onComplete={save}
  steps={[
    {id:"contact", title:"Contact", rules:{email:"required"},
     render:()=><FormField label="Email" required name="email"><TextField label="Email"/></FormField>},
    {id:"wish", title:"Wish", rules:{wish:"required"},
     render:()=><FormField label="Wish" required name="wish"><TextField label="Wish"/></FormField>},
  ]}
/>
```

Helper thuần `getPath` / `setPath` hỗ trợ đường dẫn dấu chấm (gồm đoạn chỉ số mảng dạng số), không cần context React. `FormFieldArray` cần context Form hoặc FormWizard bao quanh.

Nút Reset native và form.reset() khôi phục seed initialValues tại lúc mount, xóa lỗi xác thực/gửi nội bộ và vô hiệu hóa xác thực đang pending. Trình xử lý onReset có thể preventDefault để hủy cả reset controller lẫn native. Lỗi bên ngoài vẫn do bên gọi sở hữu. Yêu cầu lưu đã bắt đầu không bị hủy; bên gọi sở hữu việc hủy. Đổi initialValues sau mount không thay seed; mount lại Form cho bản ghi khác. Trường native thuần giữ hành vi reset native; điều khiển tùy chỉnh ngoài FormField sở hữu logic reset riêng.

Thao tác thêm/xóa FormFieldArray thành công vô hiệu hóa lỗi xác thực nội bộ tại đường dẫn mảng và các nhánh con, nguyên tử cùng việc đổi giá trị. Lần xác thực tiếp theo tính lỗi theo chỉ số mới. Giữ lỗi không liên quan, lỗi bên gọi cung cấp và lỗi sau thao tác bị chặn/không đổi gì.

Error/hint của FormField và label của FormFieldArray giữ số `0`. Lỗi số không tường minh ưu tiên hơn hint và lỗi context, áp dụng kiểu lỗi. Nội dung lỗi rỗng giữ dự phòng hint hiện có.

Bàn phím: Form dùng điều khiển gửi/reset native và ngăn gửi khi pending. FormField kế thừa hành vi bàn phím của phần tử con. Nút Add của FormFieldArray và điều hướng FormWizard là nút native; bên gọi cung cấp điều khiển xóa hàng. Điều khiển tùy chỉnh không native phải tuân theo context pending.

Bản địa hóa: Mặc định EN/VI riêng của mỗi component theo `lang` tường minh hoặc phạm vi ngôn ngữ DOM kế thừa. `lang` tường minh của Form/FormWizard không tự dịch nội dung bên gọi lồng trong hoặc đặt locale cho mọi con. Nhãn, thông điệp quy tắc và nội dung bước vẫn do bên gọi sở hữu.

Bằng chứng nguồn: `Form.jsx` và `Form.d.ts` xác định hợp đồng này. Các tham chiếu nguồn này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của bên sử dụng.

`onSubmit` và `FormWizard.onComplete` có thể trả về bất kỳ giá trị nào. Bỏ qua giá trị trả về đồng bộ; promise trả về được chờ. UI pending tiếp tục tới khi promise kết thúc; từ chối render tóm tắt gửi hiện có và cho phép thử lại.

Liên kết trường: FormField cung cấp ID nhãn, hint và lỗi ổn định cho điều khiển native và composite tham gia. Việc nối value/name/valueProp/onChange của controller hiện có không đổi. Composite đọc context liên kết; điều khiển tùy chỉnh bất kỳ có thể dùng render child: `<FormField label="Code" hint="Six digits">{attrs => <input {...attrs} />}</FormField>`. Trải thuộc tính lên điều khiển thực tế. Callback này chỉ cung cấp liên kết; bên sử dụng vẫn chịu trách nhiệm nối giá trị và sự kiện tùy chỉnh. `rootProps` của FormField trỏ phần tử bọc. Giữ tên tường minh của bên gọi; mô tả được ghép và lỗi buộc trạng thái invalid khi còn tồn tại. Dấu bắt buộc không thiết lập tuần tự hóa hoặc xác thực native cho bộ chọn dựa trên nút.

FormFieldArray và FormWizard cũng nhận `rootProps` cho div ngoài; tên mảng nội bộ, bước hiện tại và trạng thái pending vẫn thuộc component.

Nội dung UI theo phạm vi: Từ điển LocaleProvider có thể thay thế thông điệp tích hợp. Cách component chọn ngôn ngữ và cơ chế dự phòng định dạng ngày, số, RTL hiện có được giữ nguyên.

Tiêu đề bước FormWizard là thông tin, không phải điều khiển disabled: bước hiện tại dùng aria-current="step", tiêu đề hiện tại/không hiện tại dùng token văn bản primary/secondary với độ đục đầy đủ.

Ref native (React 18/19):
- Form: ref trỏ tới HTMLFormElement (form); khi đích native đang được mount.
- FormField: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
- FormFieldArray: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
- FormWizard: ref trỏ tới HTMLDivElement (div); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

### Liên kết giá trị / FormField value binding

Trong Form, `FormField name="…"` dùng `valueProp="value"` cho giá trị văn bản/select, `checked` cho giá trị boolean checkbox native, hoặc `pressed` cho API boolean của Toggle. Field cập nhật trạng thái controller rồi gọi `onChange` hiện có của phần tử con với sự kiện/giá trị gốc. Phần tử input/select/textarea native nhận liên kết nhãn và hint/lỗi. Liên kết pressed của Toggle được kiểm tra về controller/callback; nhãn nút nhìn thấy vẫn do bên gọi sở hữu và Toggle không đọc context liên kết FormField.

Trong Form, `FormField` có `name` dùng `value` cho giá trị văn bản/lựa chọn, `checked` cho checkbox, hoặc `pressed` cho API boolean của Toggle. Field cập nhật trạng thái rồi gọi `onChange` hiện có của phần tử con với sự kiện/giá trị gốc. Các phần tử input/select/textarea nhận liên kết nhãn và hướng dẫn/lỗi. Liên kết pressed kiểm tra giá trị và callback; nhãn hiển thị của Toggle do bên gọi cung cấp, Toggle không đọc ngữ cảnh liên kết FormField.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Form + FormField** — named-field collection + bilingual error summary; optional controller: `rules` validate on submit, `name`d FormFields auto-wire value/onChange + per-field errors. Dotted names work with field arrays (e.g. `teammates.0.name`).

```jsx
<Form rules={{email:["required", v=>/.+@.+/.test(v)?null:"Enter a valid email."]}} onSubmit={save}>
  <FormField label="Work email" required name="email"><TextField label="Work email"/></FormField>
  <FormField label="Đồng ý" name="agree" valueProp="checked"><Checkbox label="Đồng ý điều khoản"/></FormField>
  <Button type="submit">Send</Button>
</Form>
```

Manual mode unchanged: omit `rules`/`name`, pass `errors={{email:"…"}}` yourself.

Use `valueProp="checked"` for Checkbox/Switch and `valueProp="pressed"` for
Toggle. Both receive `false` when their controller value is unset. The child's
change callback remains an observer, and the controller stores the boolean.

```jsx
<FormField label="Formatting" name="bold" valueProp="pressed">
  <Toggle>Bold</Toggle>
</FormField>
```

**asyncRules:** optional map of field name → async `(value, values) => message|null`. Runs after sync `rules` pass; Form emits `is-pending` + `aria-busy`, disables native fields through a fieldset, and refuses submission re-entry until validation and the returned `onSubmit` promise finish. Controllers can also read `pending` from Form context. Custom non-native interactive content must respect that context separately.

Return the save promise from `onSubmit` or `FormWizard.onComplete` so pending
lasts through the save. A rejected callback displays its message in the error
summary and releases the lock for retry. A new attempt clears that submission
error. The callback receives the values captured for that attempt; changes made
after it starts do not alter its payload. Wizard navigation is disabled while
completion is pending, and its native fields are disabled. Existing per-control
disabled settings remain intact after completion. These controls do not provide
server-side idempotency.

Unmounting Form invalidates pending validation: later validators and the save
callback are not started by that abandoned attempt. Already-running validators
or save requests are not aborted; callers own cancellation of that external work.

**FormFieldArray** — manage an array of row objects under `name` on the surrounding Form. Children render-prop: `({ index, item, remove, path })`.

Array mutations use current controller state, including batched removal calls.
`remove` targets its rendered row occurrence (even for duplicate object references) and does nothing if that item has since been
removed or replaced. Minimum/maximum bounds are checked against current length.
Row child identity survives array add/remove and dotted field edits, including
duplicate references. Keys are internal metadata, not submitted fields. Replacing
the whole array establishes new row identities.
Use the latest render callbacks after editing/replacing items; these callbacks
are not persistent row identifiers.

```jsx
<Form initialValues={{teammates:[{name:""}]}} onSubmit={save}>
  <FormFieldArray name="teammates" label="Teammates" min={1} max={5} addLabel="Add person">
    {({ index, remove, path }) => (
      <>
        <FormField label={`Name ${index+1}`} name={path("name")}><TextField label="Name"/></FormField>
        <Button type="button" variant="ghost" size="sm" onClick={remove}>Remove</Button>
      </>
    )}
  </FormFieldArray>
  <Button type="submit">Save</Button>
</Form>
```

**FormWizard** — multi-step controller (no nested `<form>`). Each step may declare `rules` + `render()`. Finish calls `onComplete(values)`.

```jsx
<FormWizard
  initialValues={{email:"",wish:""}}
  onComplete={save}
  steps={[
    {id:"contact", title:"Contact", rules:{email:"required"},
     render:()=><FormField label="Email" required name="email"><TextField label="Email"/></FormField>},
    {id:"wish", title:"Wish", rules:{wish:"required"},
     render:()=><FormField label="Wish" required name="wish"><TextField label="Wish"/></FormField>},
  ]}
/>
```

The pure `getPath` / `setPath` helpers support dotted paths (including numeric array segments) without requiring React context. `FormFieldArray` requires a surrounding Form or FormWizard context.

Native Reset buttons and form.reset() restore the mount-time initialValues seed,
clear internal validation/submission errors and invalidate pending validation.
An onReset handler can preventDefault to cancel both controller and native reset.
External errors remain caller-owned. Already-started save requests are not aborted;
callers own cancellation. Changing initialValues after mount does not replace the
seed; remount the Form for a different record. Plain native fields keep their native
reset behavior; arbitrary custom controls outside FormField own their reset logic.

Successful FormFieldArray add/remove operations invalidate internal validation
errors at the array path and its descendants, atomically with the value change.
The next validation run computes errors for the new indices. Unrelated errors,
caller-supplied errors, and errors after a blocked/no-op operation are preserved.

FormField error/hint and FormFieldArray label preserve numeric `0`. An explicit zero error takes precedence over the hint and context error and applies error styling. Empty error content retains the existing hint fallback.

Keyboard: Form uses native submission/reset controls and prevents submission while pending. FormField inherits its child’s keyboard behavior. FormFieldArray’s Add button and FormWizard navigation are native buttons; the caller provides any row-removal control. Custom non-native controls must respect pending context.

Localization: Each component’s own EN/VI defaults follow its explicit `lang` or inherited DOM language scope. An explicit Form/FormWizard `lang` does not automatically translate nested caller content or set every child’s locale. Labels, rule messages and step content remain caller-owned.

Source evidence: `Form.jsx` and `Form.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.

`onSubmit` and `FormWizard.onComplete` may return any value. Synchronous return values are ignored; returned promises are awaited. Pending UI remains active until that promise settles; rejection renders the existing submission summary and permits retry.

Field associations: FormField gives native controls and participating composites stable label, hint and error IDs. Existing controller value/name/valueProp/onChange wiring stays unchanged. Composite controls consume association context; arbitrary custom controls can use a render child: `<FormField label="Code" hint="Six digits">{attrs => <input {...attrs} />}</FormField>`. Spread attributes onto the actual control. This callback supplies associations only; custom value and event wiring remain the consumer's responsibility. FormField `rootProps` targets its wrapper. Explicit caller names are retained; descriptions merge and errors force invalid state while present. Required markers do not establish serialization or native validation for button-based pickers.

FormFieldArray and FormWizard also accept `rootProps` for the outer div; their internal array name, current step and pending state remain component-owned.

Scoped UI copy: LocaleProvider dictionaries may override built-in messages. Existing component language selection and date/number/RTL fallback behavior remain unchanged.

FormWizard step titles are informative, not disabled controls: current step uses aria-current="step", and current/noncurrent titles use full-opacity primary/secondary text tokens.

Native refs (React 18/19):
- Form: ref targets HTMLFormElement (form); while native target is mounted.
- FormField: ref targets HTMLDivElement (div); while native target is mounted.
- FormFieldArray: ref targets HTMLDivElement (div); while native target is mounted.
- FormWizard: ref targets HTMLDivElement (div); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

### FormField value binding / Liên kết giá trị

Inside Form, `FormField name="…"` uses `valueProp="value"` for text/select values, `checked` for boolean native checkbox values, or `pressed` for Toggle's boolean API. The field updates controller state and then calls the child's existing `onChange` with the original event/value. Native input/select/textarea children receive label and hint/error associations. Toggle's pressed binding is tested for controller/callback behavior; its visible button label remains caller-owned and it does not consume FormField association context.

Trong Form, `FormField` có `name` dùng `value` cho giá trị văn bản/lựa chọn, `checked` cho checkbox, hoặc `pressed` cho API boolean của Toggle. Field cập nhật trạng thái rồi gọi `onChange` hiện có của phần tử con với sự kiện/giá trị gốc. Các phần tử input/select/textarea nhận liên kết nhãn và hướng dẫn/lỗi. Liên kết pressed kiểm tra giá trị và callback; nhãn hiển thị của Toggle do bên gọi cung cấp, Toggle không đọc ngữ cảnh liên kết FormField.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Form

[Khai báo / Declaration](Form.d.ts) · [Nguồn / Source](Form.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `asyncRules` | optional | Không khai báo trong tham số / Not declared in parameter |
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `errors` | optional | `{}` |
| `initialValues` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onReset` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onSubmit` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rules` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 283 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Form.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 283 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Form.runtime.defaultExpressions` in the canonical source facts.

### FormField

[Khai báo / Declaration](Form.d.ts) · [Nguồn / Source](Form.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `error` | optional | Không khai báo trong tham số / Not declared in parameter |
| `hint` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | required | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `name` | optional | Không khai báo trong tham số / Not declared in parameter |
| `required` | optional | `false` |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `valueProp` | optional | `"value"` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `FormField.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `FormField.runtime.defaultExpressions` in the canonical source facts.

### FormFieldArray

[Khai báo / Declaration](Form.d.ts) · [Nguồn / Source](Form.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `addLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `children` | required | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `defaultItem` | optional | Không khai báo trong tham số / Not declared in parameter |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `max` | optional | `50` |
| `min` | optional | `0` |
| `name` | required | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `FormFieldArray.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `FormFieldArray.runtime.defaultExpressions` in the canonical source facts.

### FormWizard

[Khai báo / Declaration](Form.d.ts) · [Nguồn / Source](Form.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `backLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `finishLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `initialValues` | optional | Không khai báo trong tham số / Not declared in parameter |
| `lang` | optional | Không khai báo trong tham số / Not declared in parameter |
| `nextLabel` | optional | Không khai báo trong tham số / Not declared in parameter |
| `onComplete` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `steps` | required | `[]` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `FormWizard.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `FormWizard.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
