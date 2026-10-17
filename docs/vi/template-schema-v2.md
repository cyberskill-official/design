# Template content-schema v2 — content slot có kiểu

Metadata thuần additive, opt-in: sidecar `templates/<slug>/content-schema.json` cạnh `.dc.html` của template, khai báo **kiểu** của mỗi `{{ hole }}` đã có trong template — để agent nhận diện hole và metadata trước khi sửa mã nguồn template. Sidecar không tự gắn giá trị đầu vào với runtime. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

**Thêm metadata không cần đổi markup template.** `id` của slot là tên hole đã dùng trong `.dc.html` (ví dụ `{{ heroH }}`) và đã bind trong `renderVals()` của logic class — schema chỉ mô tả nó.

## Hình dạng

```json
{
  "$schemaVersion": "2.0",
  "template": "marketing-page",
  "slots": [
    { "id": "heroH", "type": "text", "label": "Hero headline", "maxLength": 70, "required": true },
    { "id": "heroP", "type": "richtext", "label": "Hero paragraph" },
    { "id": "svcKicker", "type": "text", "label": "Services eyebrow", "maxLength": 40 }
  ]
}
```

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| `$schemaVersion` | có | `"2.0"` cho spec này |
| `template` | có | khớp tên thư mục `templates/<slug>/` |
| `slots[].id` | có | phải bằng một hole `{{ id }}` thật trong `.dc.html` sibling |
| `slots[].type` | có | một trong: `text`, `richtext`, `image`, `link`, `list`, `table`, `date` |
| `slots[].label` | có | đọc được bởi người, cho UI điền nội dung |
| `slots[].maxLength` | không | chỉ text/richtext — hướng dẫn soft, DC không enforce |
| `slots[].required` | không | mặc định `false` |
| `slots[].i18n` | không | `{"en": "...", "vi": "..."}` — cho template ship biến thể EN·VI |

Hình dạng máy kiểm được chính thức nằm ở `templates/schema/content-schema.schema.json` (JSON Schema draft-07). `_audit/template-schema-test.html` validate mọi sidecar tồn tại — hai chiều với content hole đủ điều kiện: mọi slot id khai báo phải là content hole trong `.dc.html`, và mọi content hole phải xuất hiện thành slot — **và ép độ phủ**.

## Hole nào đủ điều kiện có schema

Một `{{ hole }}` là **content hole** (đủ điều kiện schema) trừ khi nó là:

- hole **trục / control-flow** — `rootTheme`, `langAttr`, `elAttr`, `vaAttr`, `dirAttr`, `true`, `false`, bất kỳ tên nào khớp `is<ChữHoa>` (`isEN`, `isVN`, `isBoth`, `isTable`, …), hoặc một số nguyên trần;
- hole **tweak boolean** — bất kỳ tên nào khớp `show|hide|has|enable|with` + `<ChữHoa>` (`showLogo`, `showSignatures`, `showQuote`, …);
- hole **runtime-control** — wiring chọn UI / handler: tên đúng `tabs`, `tab`, `lens`, `chatOpen`, `closeChat`, `dangerOpen`, `closeDanger`, hoặc bất kỳ tên nào khớp `set|open` + `<ChữHoa>` (`setTab`, `setLens`, `openChat`, …).

Chúng là trục runtime, không phải content slot có kiểu, nên nằm ngoài schema.

## Rollout — đã đủ cho template đủ điều kiện, và đã có gate

Ban đầu ship **cố ý chưa đầy đủ**: ba exemplar (một mỗi archetype lớn) chứng minh pattern end-to-end — `marketing-page` (product), `bod-report` (document), `slide-deck` (deck) — rồi quét qua các template hole-driven.

Đợt quét đó nay **đã xong và được khoá**. Theo danh mục mã nguồn hiện tại: **40 template content-hole-driven, cả 40 đều có sidecar**, và **45 template chỉ lộ hole trục/boolean** (nội dung được viết trực tiếp trong template; ngôn ngữ hỗ trợ tuân theo contract của từng template) đúng là không có sidecar. `_audit/template-schema-test.html` không còn chỉ báo cáo con số này — nó **fail** nếu có template lộ content hole mà thiếu sidecar. Nên luật cho author là cơ học: template nhận thêm một `{{ hole }}` author được thì nhận luôn sidecar trong cùng change, không thì board đỏ.

Gate dùng validator draft-07 được Ajv ghim phiên bản biên dịch khi bảo trì, không biên dịch trong trình duyệt. Thuộc tính không được phép, nhãn dịch sai kiểu và slot id trùng đều bị từ chối. Sau khi sửa schema, chạy `npm run build:content-schema-validator`; dùng `npm run test:content-schema` để kiểm tra toàn bộ sidecar, CSP và các trường hợp lỗi. Metadata hợp lệ không chứng minh chất lượng export hay việc phê duyệt nội dung nghiệp vụ.

## Slot mã nguồn và prop runtime

40 sidecar hiện mô tả 512 slot nội dung; không slot nào là đầu vào `data-props`
được khai báo. Ví dụ, App shell khai báo `language`, `element`, `theme`, còn `h1`
do `renderVals()` tính. Giá trị tính được ghi đè prop khi runtime kết hợp dữ liệu,
nên truyền `{h1: "Tiêu đề mới"}` vào `__dcSetProps` không đổi tiêu đề.

Agent cần đọc sidecar, tìm hole và giá trị tương ứng trong `renderVals()` hoặc
nội dung theo ngôn ngữ, sửa mã nguồn trong phạm vi được phép, rồi kiểm tra preview
và export. Giữ các bản ngôn ngữ nhất quán; thay đổi nội dung nghiệp vụ/pháp lý
cần đúng người phụ trách phê duyệt. Chỉ xem prop runtime được khai báo là điều
khiển khả dụng và kiểm tra tác dụng thực tế. Kiểm tra metadata không xác thực
payload khách hàng, làm sạch rich text hay ép `maxLength` trong runtime. API nạp
nội dung chung sẽ là một public contract mới, cần quy tắc binding, validation
và thứ tự ưu tiên rõ ràng.
