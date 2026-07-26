# Rubric benchmark Design System

Checklist tự kiểm khi tiến hóa CyberSkill Design System — chuẩn bên ngoài cộng rule CDS. Ghép với [`docs/vi/quality-gates.md`](quality-gates.md) (gate xác định) và [`docs/vi/design-styles.md`](design-styles.md) (hợp đồng màu Element).

## Chuẩn bên ngoài

| Lĩnh vực | Chuẩn / thực hành | Cách đo |
|---|---|---|
| Sàn a11y pháp lý | WCAG 2.2 AA contrast (4.5:1 chữ thường / 3:1 chữ lớn / UI non-text ≥ 3:1) | `contrast-guard`, theme-overflow, axe-smoke |
| Đọc theo cảm nhận | APCA Bronze-style Lc (body ≥ 75, nhãn UI ≥ 60, lớn ≥ 45, non-text ≥ 15; dark max ~90) | `apca-dark-preview`, [`docs/vi/contrast-report.md`](contrast-report.md) |
| Không gian màu | Ramp OKLCH ưu tiên luminance; giữ hue qua mode | `element-geometry` + `npm run tokens:elements` |
| Kiến trúc token | W3C DTCG 2025.10 — primitive → semantic → component; leaf có `$type`; modifier đa chiều (theme × element) | `dtcg-typing`, token-format-parity, token-pipeline |
| Theming hai mode | Cùng họ hue light↔dark; remap role (không đảo hết) | `element-geometry` hue-lock |
| Audit dual-standard | Phân loại cặp: pass-both / fail-both / WCAG-only / APCA-only | Ghi trong workflow contrast-report sau đổi token |
| An toàn gamut | Ưu tiên chroma sRGB-safe; clamp trước khi emit | Generator + geometry gate |

## Rule CDS sở hữu

| Rule | Thực thi |
|---|---|
| Trục = Theme × Element × Language × Style cho tới khi có Style Expansion Rule | `axis-guard` (Expression/Density đã nghỉ); doctrine trong design-styles |
| Chữ không trên mid `-accent`; focus Ochre không remap; màu status không remap | Hợp đồng `elements.css` · contrast-report · conventions |
| Một element mỗi bề mặt; gradient chỉ Tương sinh | Registry products · conventions |
| Registry product→element khóa; UI kit trung thành Thổ | [`docs/vi/products.md`](products.md) |
| Expansion Rule đủ + `_audit/run.html` xanh + docs EN·VI parity | CLAUDE.md · docs-consistency · docs-lang-parity |
| Pin VERSION **1.0.0** tới LAUNCH | version-stamp · docs-consistency |
| Pack Element chỉ từ seed (30 bộ) | `element-geometry` · `tokens:elements` |

## Checklist mở rộng style (`data-cs-style`)

Sole pack hôm nay: **liquid-glass** (`tokens/styles.css`, gate `_audit/style-contract.html`). Khi thêm style pack ngoài liquid-glass:

1. Overlay token **tiêu thụ** 9 role `--cs-accent-*` sẵn có (không invent pack Element song song).
2. Specimen card + Storybook / Identity Lab nếu style chọn được ở sản phẩm.
3. Adoption template / kit chỉ khi cố ý — UI kit giữ Thổ trừ khi quyết định nói khác.
4. Regen contrast nếu style remap nền chứa chữ.
5. Expansion Rule grep enum mới qua templates, docs EN+VI, gates.
6. Mở rộng allowlist style-contract; giữ `_audit/run.html` xanh.
7. Ghi quyết định trong [`docs/vi/decisions.md`](decisions.md).

## Cách chạy một lượt benchmark

1. `npm run tokens:elements` (nếu đổi seed) → regen native → `node scripts/generate-contrast-report.mjs`
2. Fast board: mở `_audit/run.html` (hoặc CI `fast-gates`) — mọi hard gate xanh, gồm **Element geometry**
3. Spot Identity Lab: soft/middle/deep × light/dark vẫn đọc là một họ mỗi element
4. Chỉ sửa rubric này khi chuẩn hoặc doctrine CDS đổi — giữ EN·VI parity
