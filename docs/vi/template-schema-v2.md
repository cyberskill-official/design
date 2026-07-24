# Template content-schema v2 — content slot có kiểu

Metadata thuần additive, opt-in: sidecar `templates/<slug>/content-schema.json` cạnh `.dc.html` của template, khai báo **kiểu** của mỗi `{{ hole }}` đã có trong template — để agent hoặc pipeline điền/validate nội dung khách thật theo chương trình mà không parse HTML hay đoán.

**Không cần đổi markup template.** `id` của slot là tên hole đã dùng trong `.dc.html` (ví dụ `{{ heroH }}`) và đã bind trong `renderVals()` của logic class — schema chỉ mô tả nó.

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

Hình dạng máy kiểm được chính thức nằm ở `templates/schema/content-schema.schema.json` (JSON Schema draft-07). `_audit/template-schema-test.html` validate mọi sidecar tồn tại — hai chiều: mọi slot id khai báo phải resolve tới hole thật trong template, và (informational) báo coverage trên toàn `templates/`.

## Rollout

Giống visual-diff baselines, ban đầu ship **cố ý chưa đầy đủ** — ba exemplar (một mỗi archetype lớn) chứng minh pattern end-to-end: `marketing-page` (product), `bod-report` (document), `slide-deck` (deck). Sau đó đã **quét qua các template hole-driven** và tiếp tục lớn dần; độ phủ sidecar hiện tại do `_audit/template-schema-test.html` báo cáo (39/84 theo đợt quét mới nhất — product shell cộng template document/HR/legal/VN list-driven). Hole trục / control-flow (`rootTheme`, `langAttr`, `elAttr`, `vaAttr`, `isEN`, `true`, …) và hole tweak boolean (`showLogo`, `showSignatures`, …) nằm ngoài schema — chúng là trục runtime, không phải content slot có kiểu. Template chỉ lộ các trục đó (hoặc hardcode copy bilingual theo nhánh `sc-if` ngôn ngữ) đúng là không có sidecar cho tới khi có `{{ hole }}` content author được. Thêm sidecar cho mọi template nhận content hole-driven khi chạm tới; ưu tiên tăng measurable trên template traffic cao trước.
