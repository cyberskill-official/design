<!-- BEGIN GENERATED VI PROMPT v1 -->
## Tiếng Việt

<!-- Bản dịch hướng dẫn; ví dụ mã và API được giữ nguyên. / Guidance translation; code and API remain unchanged. -->
**QRCode** — QR SVG (≤78byte, EC-L). Giữ vùng trống quanh mã.

```jsx
<QRCode value="https://cyberskill.world" size={128}/>
```

Dung lượng là78byte UTF-8, không phải78ký tự. Giá trị quá cỡ hiển thị dự phòng gạch ngang dài hiện có thay vì mã cắt ngắn. Giữ vùng trống bốn module quanh biểu tượng và kiểm chứng cặp chữ/nền cuối trong vị trí thực.

Kiểm định: `npm run test:qr` kiểm tra mọi dung lượng byte và phiên bản được hỗ trợ bằng bộ giải mã độc lập, gồm Unicode và module hỏng, cùng quét SVG→raster thực tế dưới chính sách bảo mật triển khai. Quét camera/thiết bị và nghiệm thu thị giác vẫn là kiểm tra riêng.

Bàn phím: Mã là ảnh có tên và không thêm thao tác bàn phím. Bên gọi cung cấp vùng trống bốn module quanh biểu tượng mã hóa và kiểm định vị trí thật.

Bản địa hóa: Tên tiếp cận dùng nhãn cung cấp không rỗng hoặc giá trị. Giá trị và nhãn do bên gọi quản lý; component không dịch nội dung được mã hóa.

Bằng chứng nguồn: `QRCode.jsx` và `QRCode.d.ts` xác định hợp đồng này. Các tham chiếu này không xác nhận kết quả kiểm tra thủ công bằng công nghệ hỗ trợ hoặc sự chấp nhận của người vận hành.

`rootProps` trỏ đến span ảnh hiện có, gồm dự phòng khi mã hóa thất bại. Chấp nhận thuộc tính native, thuộc tính data, style và sự kiện. Không thêm wrapper hay hợp đồng ref. Component vẫn kiểm soát ngữ nghĩa/trạng thái do nó sở hữu; handler nội bộ chạy trước callback phía sử dụng.

Ref native (React 18/19):
- QRCode: ref trỏ tới HTMLSpanElement (span); khi đích native đang được mount.
Ref dạng đối tượng và callback được kết hợp với ref nội bộ. Callback ổn định không bị tháo gắn trong một lần render lại thông thường; giữ nguyên cơ chế dọn dẹp callback của React 19 và tháo gắn bằng null của React 18. Túi thuộc tính vẫn từ chối ref. Không suy đoán ref cho phần tử con hay phần tử kích hoạt.

## English
<!-- END GENERATED VI PROMPT v1 -->
**QRCode** — SVG QR (≤78 bytes, EC-L). Keep quiet space around it.

```jsx
<QRCode value="https://cyberskill.world" size={128}/>
```

Capacity is 78 UTF-8 bytes, not 78 characters. An oversized value renders the existing em-dash fallback rather than a truncated code. Keep a four-module quiet zone around the symbol and verify the final foreground/background pairing in its actual placement.

Validation: `npm run test:qr` checks all supported byte capacities and versions with an independent decoder, including Unicode and damaged modules, plus actual SVG-to-raster scans under the deployment security policy. Camera/device scanning and visual acceptance remain separate checks.

Keyboard: The code is a named image and adds no keyboard action. The caller supplies the four-module quiet zone around the encoded symbol and validates its real placement.

Localization: The accessible name uses a nonempty supplied label or the value. Value and label are caller-owned; the component does not translate encoded content.

Source evidence: `QRCode.jsx` and `QRCode.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

`rootProps` targets the existing image span, including the encoding-failure fallback. It accepts native attributes, data attributes, style and events. It does not add a wrapper or ref contract. Component-owned semantics/state remain controlled; internal event handlers run before consumer callbacks.

Native refs (React 18/19):
- QRCode: ref targets HTMLSpanElement (span); while native target is mounted.
Object and callback refs are composed with internal refs. Stable callbacks do not detach on an ordinary rerender; React 19 callback cleanup and React 18 null-detach semantics are retained. Attribute bags still reject refs. No child/trigger ref is guessed.

<!-- BEGIN GENERATED DECLARED API v1 -->
## API đã khai báo / Declared API

Phần này được sinh từ API khai báo và dữ kiện nguồn chính tắc. Kiểu vẫn nằm trong tệp khai báo. Biểu thức mặc định là văn bản nguồn của phép tách tham số, không phải giá trị đã đánh giá hay danh sách đầy đủ mọi cơ chế dự phòng nội bộ. Thuộc tính native có trong khai báo không tự xác nhận việc chuyển tiếp xuống DOM hoặc hành vi thực thi.

Generated from the [canonical declared API](../api-index.json) and [source facts](../contracts.json). Types remain in the declarations. Default expressions below are source text from parameter destructuring, not evaluated values or a complete list of internal fallbacks. Native attribute declaration availability does not establish DOM forwarding or behavior.

### QRCode

[Khai báo / Declaration](QRCode.d.ts) · [Nguồn / Source](QRCode.jsx) · phân tích mặc định / default analysis: `forward-ref-destructuring`

| Prop tự khai báo / Authored prop | Khai báo / Declaration | Biểu thức mặc định tham số / Parameter default expression |
|---|---|---|
| `className` | optional | Không khai báo trong tham số / Not declared in parameter |
| `color` | optional | `"var(--cs-color-text-primary)"` |
| `label` | optional | Không khai báo trong tham số / Not declared in parameter |
| `rootProps` | optional | Không khai báo trong tham số / Not declared in parameter |
| `size` | optional | `128` |
| `value` | required | `""` |

API kế thừa: 2 thuộc tính; tra API chính tắc và liên kết khai báo, không tạo thêm danh sách thuộc tính native. Có 0 mặc định tham số cho thuộc tính kế thừa; xem `QRCode.runtime.defaultExpressions` trong dữ kiện nguồn chính tắc. Các nhãn optional/required trong bảng nghĩa là tùy chọn/bắt buộc theo khai báo.

Inherited API: 2 properties; use the canonical API and declaration links rather than a second native-attribute list. Additional parameter defaults for inherited attributes: 0; see `QRCode.runtime.defaultExpressions` in the canonical source facts.

Danh mục này không thay thế hướng dẫn do tác giả viết ở trên, kiểm thử hành vi thực thi hay sự chấp nhận về khả năng tiếp cận qua kiểm tra thủ công.

This inventory does not replace the authored guidance above, runtime behavioral tests, or manual accessibility acceptance.
<!-- END GENERATED DECLARED API v1 -->
