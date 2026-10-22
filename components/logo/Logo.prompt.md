<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**Logo** — dấu thương hiệu CyberSkill chính thức (nền Umber, hình thần đèn Ochre), render từ đúng bản gốc. Dùng khi sản phẩm dành cho hoặc thuộc CyberSkill. Giữ khoảng trống ≥ 25% chiều cao dấu; không đổi màu, xoay, kéo giãn hay đặt trên nền tương phản thấp.

```jsx
<Logo size={40} title="CyberSkill" />
<Logo size={24} decorative />   {/* when the name appears next to it in text */}
```

- Với tenant bên thứ ba hoặc white-label, dùng logo riêng của tenant — không dùng dấu này.

- Lựa chọn static/in: `assets/logo-mark.svg` (vector) hoặc `assets/logo-mark.png`.

Bàn phím: Dấu thương hiệu không thêm thao tác bàn phím. Khi đặt trong liên kết, liên kết cung cấp hành vi và ngữ cảnh điều hướng.

Bản địa hóa: Title hỗ trợ tiếp cận mặc định là tên thương hiệu cố định CyberSkill; title được truyền vào do bên sử dụng sở hữu. `decorative` ẩn dấu khỏi công nghệ hỗ trợ và bỏ title.

Bằng chứng nguồn: `Logo.jsx` và `Logo.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

Hằng công khai `CS_LOGO_VIEWBOX` và `CS_LOGO_MARK_INNER` cung cấp chuỗi viewBox và markup SVG bên trong được sinh của dấu chính thức. Ưu tiên Logo vì có sẵn escape title và chế độ trang trí. Nếu renderer chuyên biệt dùng hằng, giữ đúng hình và tỷ lệ, cung cấp tên hỗ trợ tiếp cận hoặc xử lý trang trí, không kết hợp markup tin cậy với đầu vào không tin cậy. Các hằng không chứa tương tác bàn phím hoặc văn bản được dịch.

```jsx
<svg width={40} height={40} viewBox={CS_LOGO_VIEWBOX}
  xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CyberSkill"
  dangerouslySetInnerHTML={{ __html: CS_LOGO_MARK_INNER }} />
```

Bằng chứng nguồn của hằng: `logo-data.js` cung cấp cả hai chuỗi; `_esm/react.d.ts` khai báo các chuỗi công khai. Markup suy ra từ `assets/logo-mark.svg` chính thức; tham chiếu này không cấp phép sửa hình hay xác nhận chấp nhận về thị giác.

Ref native (React 18/19):
- Logo: ref trỏ tới SVGSVGElement (svg); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

`children` kế thừa được nhận để tương thích nhưng bị bỏ qua. Hình SVG chính thức và title hỗ trợ tiếp cận được sinh thuộc Logo; truyền `title` hoặc `decorative` thay vì lồng title hay fragment thay thế. Thuộc tính SVG native và ref SVG giữ hành vi hiện có.

## English
<!-- END GENERATED VI PROMPT v1 -->
**Logo** — the official CyberSkill brand mark (Umber ground, Ochre genie figure), rendered from the exact master artwork. Use whenever a product is for or owned by CyberSkill. Keep clear space ≥ 25% of the mark height; never recolour, rotate, stretch, or place on a low-contrast background.

```jsx
<Logo size={40} title="CyberSkill" />
<Logo size={24} decorative />   {/* when the name appears next to it in text */}
```

- For third-party / white-label tenants, use the tenant's own logo — not this mark.

- Static/print alternative: `assets/logo-mark.svg` (vector) or `assets/logo-mark.png`.

Keyboard: The mark adds no keyboard action. When used inside a link, the link supplies navigation behavior and context.

Localization: The accessible title defaults to the fixed brand name CyberSkill; supplied titles are caller-owned. `decorative` hides the mark from assistive technology and omits its title.

Source evidence: `Logo.jsx` and `Logo.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

The public constants `CS_LOGO_VIEWBOX` and `CS_LOGO_MARK_INNER` expose the official mark’s viewBox string and generated inner SVG markup. Prefer Logo for its built-in title escaping and decorative mode. If a specialized renderer uses the constants, preserve the exact artwork and proportions, supply its accessible name or decorative treatment, and do not combine the trusted markup with untrusted input. The constants contain no keyboard interaction or translated text.

```jsx
<svg width={40} height={40} viewBox={CS_LOGO_VIEWBOX}
  xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CyberSkill"
  dangerouslySetInnerHTML={{ __html: CS_LOGO_MARK_INNER }} />
```

Constant source evidence: `logo-data.js` provides both string values; `_esm/react.d.ts` declares the public strings. The markup is derived from the official `assets/logo-mark.svg`; this pointer does not authorize artwork changes or establish visual acceptance.

Native refs (React 18/19):
- Logo: ref targets SVGSVGElement (svg); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

Inherited `children` are accepted for compatibility and ignored. The official SVG artwork and generated accessible title are owned by Logo; pass `title` or `decorative` rather than nesting a replacement title or fragment. Native SVG attributes and the SVG ref retain their existing behavior.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### Logo

[Khai báo / Declaration](Logo.d.ts) · [Nguồn / Source](Logo.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `decorative` | optional | `false` |
| `size` | optional | `32` |
| `title` | optional | `"CyberSkill"` |

API kế thừa: 488 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `Logo.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 488 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `Logo.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
