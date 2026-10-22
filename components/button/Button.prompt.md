<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Button** — điều khiển hành động chính; mặc định tô Umber, chỉ báo tiêu điểm kết hợp (đường viền text-primary + quầng Ochre), vùng chạm 44px. Dùng cho hành động chính trong màn hình; giảm nhấn mạnh bằng `secondary` / `tertiary` / `ghost`, dùng `danger` cho hành động phá hủy.

```jsx
<Button variant="primary" size="md" onClick={save}>Save wish</Button>
<Button variant="secondary" icon={<Icon name="arrow-right" />}>Learn more</Button>
<Button variant="danger" loading>Deleting…</Button>
```

- **variant**: `primary` (Umber) · `secondary` (có viền) · `tertiary` (nổi nhẹ) · `ghost` · `danger` · `danger-ghost`

- **size**: `xs` (28px) · `sm` (36px) · `md` (44px, mặc định) · `lg` (52px) — kích thước lấy từ token `--cs-component-button-{xs,sm,md,lg}-*`; con trỏ thô tăng kích thước qua `--cs-component-button-{xs,sm,md}-minHeight-coarse`
- **loading** hiển thị spinner và đặt `aria-busy`; **fullWidth** kéo rộng; **icon** thêm biểu tượng ở đầu.

Các slot icon giữ nguyên số `0`; `null`, `false` và chuỗi rỗng tiếp tục làm các slot này không xuất hiện.

`danger` ghép màu tô với `--cs-color-semantic-danger-fg`; `danger-ghost` dùng `--cs-color-semantic-danger-text` trên bề mặt xung quanh.

Văn bản Button primary dùng màu tiền cảnh component được sinh ra. Tiền cảnh primary theo nguyên tố ở Dark dùng `--cs-accent-on-strong`, ghép với màu tô strong; `--cs-accent-on` dành cho màu tô bright. Kiểm thử strong-text trên trình duyệt kiểm tra trạng thái primary tĩnh và văn bản callout thông thường, với ngưỡng UI và văn bản nội dung riêng.

Bàn phím: Dùng tiêu điểm nút native và kích hoạt Enter/Space. `loading` vô hiệu hóa nút và đặt `aria-busy`; type mặc định là `button`, vì vậy đặt `type="submit"` để gửi form.

Bản địa hóa: Nhãn và phần tử con do bên sử dụng sở hữu; không có nội dung hành động dịch sẵn. Icon và spinner tải là trang trí.

Bằng chứng nguồn: `Button.jsx` và `Button.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Ref native (React 18/19):
- Button: ref trỏ tới HTMLButtonElement (button); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Button** — the primary action control; Umber-filled by default, composite focus indicator (text-primary contour + Ochre halo), 44px touch target. Use for the main action in a view; step down to `secondary` / `tertiary` / `ghost` for lower emphasis, `danger` for destructive actions.

```jsx
<Button variant="primary" size="md" onClick={save}>Save wish</Button>
<Button variant="secondary" icon={<Icon name="arrow-right" />}>Learn more</Button>
<Button variant="danger" loading>Deleting…</Button>
```

- **variant**: `primary` (Umber) · `secondary` (outlined) · `tertiary` (subtle raised) · `ghost` · `danger` · `danger-ghost`

- **size**: `xs` (28px) · `sm` (36px) · `md` (44px, default) · `lg` (52px) — sizes from `--cs-component-button-{xs,sm,md,lg}-*` tokens; coarse pointers bump via `--cs-component-button-{xs,sm,md}-minHeight-coarse`
- **loading** shows a spinner + sets `aria-busy`; **fullWidth** stretches; **icon** adds a leading glyph.

The icon slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

`danger` pairs its fill with `--cs-color-semantic-danger-fg`; `danger-ghost` uses `--cs-color-semantic-danger-text` on its surrounding surface.

For primary Button text, use its generated component foreground. Dark elemental primary foreground consumes `--cs-accent-on-strong`, paired with the strong fill; `--cs-accent-on` belongs to the bright fill. The maintained strong-text browser check covers static primary states and regular callout text, with separate UI and body floors.

Keyboard: Uses native button focus and Enter/Space activation. `loading` disables the button and sets `aria-busy`; the default type is `button`, so set `type="submit"` for form submission.

Localization: Labels and children are caller-owned; there is no built-in translated action text. The icon and loading spinner are decorative.

Source evidence: `Button.jsx` and `Button.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

Native refs (React 18/19):
- Button: ref targets HTMLButtonElement (button); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Button

[Khai báo / Declaration](Button.d.ts) · [Nguồn / Source](Button.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `children` | optional | Không khai báo trong tham số / Not declared in parameter |
| `disabled` | optional | `false` |
| `fullWidth` | optional | `false` |
| `icon` | optional | Không khai báo trong tham số / Not declared in parameter |
| `loading` | optional | `false` |
| `size` | optional | `"md"` |
| `variant` | optional | `"primary"` |

API kế thừa: 288 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 1 mặc định tham số cho thuộc tính kế thừa; xem `Button.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 288 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 1; see `Button.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
