# Rubric benchmark Design System

Checklist tự kiểm khi tiến hóa CyberSkill Design System — chuẩn bên ngoài cộng rule CDS. Ghép với [`docs/vi/quality-gates.md`](quality-gates.md) (gate xác định) và [`docs/vi/design-styles.md`](design-styles.md) (hợp đồng màu Element). Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Chuẩn bên ngoài

| Lĩnh vực | Chuẩn / thực hành | Cách đo |
|---|---|---|
| Mục tiêu contrast WCAG | [WCAG 2.2](https://www.w3.org/TR/WCAG22/): 4.5:1 chữ thường / 3:1 chữ lớn; UI non-text thuộc phạm vi áp dụng ≥ 3:1 | `contrast-guard` kiểm tra các cặp source/token đã chọn; theme-overflow và axe kiểm tra fixture hữu hạn. Các kiểm tra này không chứng nhận mọi trạng thái render hay tuân thủ pháp luật. |
| Đọc theo cảm nhận | Sàn chữ body CDS: APCA Lc ≥ 75 trên bề mặt thực tế. Các cặp trong report elemental có sàn 60/75 riêng đã ghi. | [`docs/vi/contrast-report.md`](contrast-report.md) đo cặp token; `apca-dark-preview` so pack hiện tại với đề xuất advisory. Cả hai không phải audit chữ body toàn sản phẩm hay gate giới hạn Lc tối đa. |
| Không gian màu | Ramp OKLCH ưu tiên luminance; giữ hue qua mode | `element-geometry` + `npm run tokens:elements` |
| Tương tác token | Profile giá trị emit theo [DTCG 2025.10 Format](https://www.designtokens.org/tr/2025.10/format/): base type được hỗ trợ, alias có type và số lượng provenance | `dtcg-typing` / `npm run test:dtcg-profile` kiểm tra profile đã emit. Override theo scope và extension CSS thô cần adapter; format parity không chứng minh reader/resolver tổng quát hay import vào design tool. |
| Theming hai mode | Cùng họ hue light↔dark; remap role (không đảo hết) | `element-geometry` hue-lock |
| Audit dual-standard | Phân loại cặp: pass-both / fail-both / WCAG-only / APCA-only | Ghi trong workflow contrast-report sau đổi token |
| An toàn gamut | Ưu tiên chroma sRGB-safe; clamp trước khi emit | Generator + geometry gate |

## Rule CDS sở hữu

| Rule | Thực thi |
|---|---|
| Trục = Theme × Element × Language × Style cho tới khi có Style Expansion Rule | `axis-guard` chặn bề mặt Expression/density-pack đã nghỉ; `data-cs-density` và `data-cs-contrast` vẫn là thuộc tính Theme được hỗ trợ, không phải trục identity thêm |
| Chữ không trên mid `-accent`; chỉ báo focus tổ hợp không theo màu elemental; màu status không remap | Hợp đồng `elements.css` · contrast-report · conventions |
| Một element mỗi bề mặt; gradient chỉ Tương sinh | Registry products · conventions |
| Registry product→element khóa; UI kit trung thành Thổ | [`docs/vi/products.md`](products.md) |
| Expansion Rule đủ + `_audit/run.html` xanh + docs EN·VI parity | `docs/doctrine.md` · docs-consistency · docs-lang-parity · docs-storybook-coverage |
| VERSION theo file (auto-bump trên main) | version-stamp · docs-consistency |
| Pack Element chỉ từ seed (30 bộ) | `element-geometry` · `tokens:elements` |

## Checklist mở rộng style (`data-cs-style`)

Sole pack hôm nay: **liquid-glass** (`tokens/styles.css`, gate `_audit/style-contract.html`). Khi thêm style pack ngoài liquid-glass:

1. Overlay token **tiêu thụ** 10 role `--cs-accent-*` sẵn có, gồm `--cs-accent-on-strong` (không invent pack Element song song).
2. Specimen card + Storybook / Atomic View nếu style chọn được ở sản phẩm.
3. Adoption template / kit chỉ khi cố ý — UI kit giữ Thổ trừ khi quyết định nói khác.
4. Regen contrast nếu style remap nền chứa chữ.
5. Expansion Rule grep enum mới qua templates, docs EN+VI, gates.
6. Mở rộng allowlist style-contract; giữ `_audit/run.html` xanh.
7. Ghi quyết định trong [`docs/vi/decisions.md`](decisions.md).

## Cách chạy một lượt benchmark

1. Nếu đổi seed hoặc input token chung, chạy `npm run tokens:generate` để hoàn tất pipeline token/export, bản sao native, CSS và reference. Chạy targeted check cùng `npm run test:unit`; parity native đã generate vẫn riêng với validation toolchain/thiết bị.
2. Fast board: mở `_audit/run.html` (hoặc CI `fast-gates`) — mọi hard gate xanh, gồm **Element geometry**
3. Whole-set Atomic View / Elements Geometry: đủ **30** bộ (soft/middle/deep × light/dark × năm element) — soft là pastel wash, middle đồng bộ cường độ giữa các element, deep rõ ràng tối hơn, role hài hòa, light↔dark giữ cùng họ hue. Gate geometry yêu cầu **cả** `minDeltaE` và `minDeltaL` (cộng L đơn điệu) từ `tokens/element-seeds.json`
4. Chỉ sửa rubric này khi chuẩn hoặc doctrine CDS đổi — giữ EN·VI parity
