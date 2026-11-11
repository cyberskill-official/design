---
name: "CyberSkill Design System"
version: "2.8.0"
generated: "2026-07-23"
generator: "scripts/generate-design-md.mjs (npm run build:design-md)"
sources:
  tokens: "tokens/tokens.dtcg.json"
  inventory: "_ds_manifest.json"
gate: "_audit/design-md-parity.html (window.__designmd)"
---

**Tiếng Việt** · [English](../../../DESIGN.md)

# Hệ thống thiết kế CyberSkill — đặc tả mở

> TỆP ĐƯỢC SINH TỰ ĐỘNG — không chỉnh sửa thủ công. Chạy lại `npm run build:design-md` sau mỗi thay đổi token; cổng `design-md-parity` sẽ báo lỗi nếu có sai lệch. Đây là đặc tả mở trong một tệp dành cho công cụ thiết kế và tác tử đọc `DESIGN.md` ở thư mục gốc (ví dụ Google Stitch). Bản chiếu cơ sở có kiểu là `tokens/tokens.dtcg.json`; tệp đồng hành `tokens/declarations.json` có mã băm lưu các khai báo và điều kiện nguồn còn lại. Đọc cả hai khi dùng bộ chuyển đổi của kho mã; dùng CSS chính tắc để xác định hành vi cascade khi chạy. Tài liệu này hướng dẫn một tập token và danh mục được chọn, không phải hợp đồng đầy đủ cho mọi chế độ có điều kiện hay kết xuất native.

> **Bên dùng Stitch / không hỗ trợ DC:** **không** coi `templates/**/*.dc.html` là nguồn chuẩn — các tệp này dùng trình thông dịch trình duyệt `support.js` đi kèm (tweaks, `__dcSetProps`); xem trước trong trình duyệt không cần trình biên dịch riêng của môi trường chủ. Sinh giao diện tĩnh từ tệp này + DTCG + `styles.css` / `.cs-*` / `templates/kitchen-sink.html` / `examples/static-hello/`. Quy trình soạn thảo có hỗ trợ DC bắt đầu tại `SKILL.md` và mặc định dùng ESM đã biên dịch `dist/esm/_esm/react.mjs`, JSX nguồn tường minh `_esm/react.mjs` để soạn thảo từ nguồn, hoặc bản tương thích cũ `_esm/cs.mjs` / `_ds_bundle.js` (phân giải tiền tố). Hai hướng sử dụng: `docs/consuming.md`. Tài liệu vận hành được xuất bản trên thanh bên Storybook Docs tại `design.cyberskill.world`.

## Thương hiệu và nguyên tắc nền tảng

- **Khẩu hiệu:** *Turn Your Will Into Real — Hiện Thực Hoá Ý Chí*.
- **Điểm neo bất biến:** Umber `#45210E` (màu thương hiệu chính) · Ochre `#F4BA17` (màu nhấn). Không ánh xạ lại; chỉ báo focus kết hợp (đường viền text-primary + quầng ochre) là dấu hiệu nhận diện khả năng tiếp cận của toàn studio.
- **Bốn trục:** Chủ đề (sáng · tối · theo hệ thống) × Nguyên tố (Ngũ Hành — Kim · Mộc · Thủy · Hỏa · Thổ, 15 gói nguyên tố×biến thể) × Ngôn ngữ (EN · VI) × Phong cách (`data-cs-style` — **liquid-glass** mặc định, không khai báo ≡ mặc định · **matte-paper** bề mặt giấy mờ đặc sắc nét).
- **Phạm vi ngôn ngữ:** ưu tiên tiếng Việt; chuỗi của thành phần đã đăng ký phải có cặp EN + VI. Khả năng ngôn ngữ của từng mẫu được khai báo riêng; nội dung do bên dùng cung cấp cần được dịch và rà soát riêng. Giữ đầy đủ dấu; cặp ngôn ngữ được khai báo không chứng nhận chất lượng dịch hay cách phát âm của trình đọc màn hình.
- **Không đặt chữ trên sắc độ trung gian `-accent`:** dùng `-bright` hoặc `-tint`, hoặc kết hợp nền `-strong` với `--cs-accent-on-strong` cho văn bản nội dung. `-accent` dành cho thanh, đường viền, phần tô tiến trình và mảng màu lớn không chứa chữ.
- **Ngưỡng khả năng tiếp cận:** APCA Lc ≥ 75 cho văn bản nội dung · vùng chạm ≥ 44px · không loại bỏ vòng focus · tôn trọng `prefers-reduced-motion` / `prefers-contrast`.
- **Giọng điệu:** ấm áp · trực tiếp · trung thực · tôn trọng — luôn đủ cả bốn, không theo kiểu “vui nhộn/tinh nghịch/gây sốc”.

### Chủ đề thị giác, bầu không khí và nhịp bề mặt

CyberSkill kết hợp tay nghề kiến trúc ấm áp với độ chính xác quang học: trang mở đầu trên nền Warm Alabaster `--cs-color-surface-page` (`#FFFDF8` sáng / `#1a1108` tối), nâng nội dung lên `--cs-color-surface-panel` (`.cs-card`) hoặc `--cs-color-surface-raised` ấm (`.cs-card--raised`), làm nổi bật gói tiêu điểm bằng `.cs-card--featured` (viền `--cs-accent-strong` / `--cs-accent`), và xếp lớp bốn cấp kính quang học Liquid Glass (`.cs-surface-whisper`, `.cs-surface-light`, `.cs-surface-standard`, `.cs-surface-heavy`) cùng nền hero `.cs-aurora`.

## Màu sắc

Màu ngữ nghĩa cốt lõi. Giá trị tối là phần ghi đè `[data-theme="dark"]` (chủ đề `system` áp dụng cùng giá trị khi có `prefers-color-scheme: dark`).

| Token | Sáng | Tối |
|---|---|---|
| `--cs-color-brand-umber` | `#45210E` | — |
| `--cs-color-brand-ochre` | `#F4BA17` | — |
| `--cs-color-surface-page` | `#FFFDF8` | `#1a1108` |
| `--cs-color-surface-panel` | `#FFFFFF` | `#221710` |
| `--cs-color-surface-raised` | `#FBF4E9` | `#2b1e14` |
| `--cs-color-text-primary` | `#45210E` | `#f5ead9` |
| `--cs-color-text-inverse` | `#FFFFFF` | `#1a1108` |
| `--cs-color-text-accent` | `#6E3B0E` | `#FECD5D` |
| `--cs-color-text-muted` | `#5E4436` | `#E9D6C2` |
| `--cs-color-semantic-success` | `#166534` | `#4ADE80` |
| `--cs-color-semantic-danger` | `#B42318` | `#FC9895` |
| `--cs-color-semantic-warning` | `#92400E` | `#FBBF24` |
| `--cs-color-semantic-info` | `#1D4ED8` | `#B5D4FD` |
| `--cs-color-semantic-success-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-semantic-danger-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-semantic-warning-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-semantic-info-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-accent-ochre` | `#F4BA17` | — |
| `--cs-color-border-default` | `#E7D9C6` | `#4a3a2c` |
| `--cs-color-link` | `#6E3B0E` | `#FECD5D` |
| `--cs-color-link-hover` | `#45210E` | `#f5ead9` |
| `--cs-color-semantic-success-text` | `#042D13` | `#68F798` |
| `--cs-color-semantic-danger-text` | `#4B0502` | `#FFD2CF` |
| `--cs-color-semantic-warning-text` | `#441801` | `#FFD887` |
| `--cs-color-semantic-info-text` | `#000A75` | `#C7DFFF` |

### Vai trò chức năng của màu sắc

- **Thương hiệu và tác vụ chính:** `--cs-color-brand-umber` (`#45210E`) và `--cs-color-brand-ochre` (`#F4BA17`) định hình nhận diện; `--cs-component-button-primary-bg` và `--cs-component-button-primary-fg` điều khiển nút kêu gọi hành động chính trên cả nền sáng và `[data-theme="dark"]`.
- **Phân cấp bề mặt và đường viền:** luân phiên `--cs-color-surface-page`, `--cs-color-surface-panel`, và `--cs-color-surface-raised` để tạo nhịp phân đoạn; đóng khung bằng `--cs-color-border-default`, kẻ hàng bảng/danh sách nội bộ bằng `var(--cs-color-border-subtle)`, và phủ nền mờ hộp thoại/ngăn trượt/hướng dẫn bằng `var(--cs-color-surface-scrim)`.
- **Văn bản và cặp trạng thái ngữ nghĩa:** dùng `--cs-color-text-primary`, `--cs-color-text-muted`, và `--cs-color-text-accent` cho phân cấp chữ (ngưỡng nội dung `APCA Lc >= 75`); ghép nền trạng thái đặc (`--cs-color-semantic-success`, `--cs-color-semantic-danger`, `--cs-color-semantic-warning`, `--cs-color-semantic-info`) với token `*-fg` và bề mặt pha sắc nhẹ với token `*-text`.

### Vai trò màu nhấn (Ngũ Hành)

Gói màu nhấn mặc định = Thổ (nguyên tố của studio). Toàn bộ 15 gói nguyên tố×biến thể và các gói tối suy ra theo APCA nằm trong `tokens/elements.css` và DTCG `$extensions["com.cyberskill"].overrides.elements` / `.elementsDark`.

| Token | Giá trị |
|---|---|
| `--cs-accent` | `#F4BA17` |
| `--cs-accent-strong` | `#A4631E` |
| `--cs-accent-bright` | `#F4BA17` |
| `--cs-accent-on` | `#45210E` |
| `--cs-accent-tint` | `#FBF4E9` |
| `--cs-accent-ink` | `#45210E` |
| `--cs-accent-glow` | `rgba(244, 186, 23, 0.48)` |
| `--cs-accent-grad-a` | `#F4BA17` |
| `--cs-accent-grad-b` | `#C4B78F` |
| `--cs-accent-on-strong` | `#FFFFFF` |

### Bảng màu tài liệu

Màu mực / giấy / đường kẻ dùng chung cho tài liệu thiên về in ấn (`--cs-doc-*`). Ưu tiên các màu này thay cho mã hex trực tiếp trong mẫu pháp lý và hành chính Việt Nam.

| Token | Giá trị |
|---|---|
| `--cs-doc-ink` | `#1A1614` |
| `--cs-doc-slate` | `#26323A` |
| `--cs-doc-fill` | `#FDE68A` |
| `--cs-doc-fill-ink` | `#1A1614` |

## Kiểu chữ

Các họ chữ được tự lưu trữ (Be Vietnam Pro · Space Grotesk · JetBrains Mono), với kiểu dáng/trọng lượng/tập con đã khai báo. Tập ký tự tiếng Việt NFC/NFD có giới hạn được ghi trong `fonts/subset-recipe.json`; điều này không chứng nhận mọi chuỗi Unicode, bộ máy tạo hình chữ hay cài đặt native. `--cs-font-family-display` là họ chữ tiêu đề dùng khi chủ động chọn; mặc định không có gì trỏ đến nó.

| Token | Giá trị |
|---|---|
| `--cs-font-family-ui` | `'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif` |
| `--cs-font-family-display` | `'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif` |
| `--cs-font-family-mono` | `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |
| `--cs-font-weight-regular` | `400` |
| `--cs-font-weight-medium` | `500` |
| `--cs-font-weight-semibold` | `600` |
| `--cs-font-weight-bold` | `700` |
| `--cs-font-weight-extrabold` | `800` |
| `--cs-font-lineHeight-body` | `var(--cs-font-line-height-body)` |
| `--cs-font-lineHeight-heading` | `var(--cs-font-line-height-heading)` |
| `--cs-font-lineHeight-tight` | `var(--cs-font-line-height-tight)` |
| `--cs-font-size-2xs` | `0.6875rem` |
| `--cs-font-size-xs` | `0.75rem` |
| `--cs-font-size-sm` | `0.875rem` |
| `--cs-font-size-base` | `1rem` |
| `--cs-font-size-md` | `1.125rem` |
| `--cs-font-size-lg` | `1.25rem` |
| `--cs-font-size-xl` | `1.5rem` |
| `--cs-font-size-2xl` | `1.875rem` |
| `--cs-font-size-3xl` | `2.25rem` |
| `--cs-font-size-4xl` | `3rem` |
| `--cs-font-size-5xl` | `3.75rem` |
| `--cs-font-line-height-body` | `1.5` |
| `--cs-font-line-height-heading` | `1.35` |
| `--cs-font-line-height-tight` | `1.15` |

### Vai trò chữ và khoảng cách ký tự

Bí danh ngữ nghĩa trỏ vào thang chữ — thể hiện ý định thay vì dùng số tùy ý. `Resolves to` đi theo chuỗi bí danh.

| Token | Dạng CSS | Giá trị phân giải |
|---|---|---|
| `--cs-text-display` | `var(--cs-font-size-5xl)` | `3.75rem` |
| `--cs-text-h1` | `var(--cs-font-size-3xl)` | `2.25rem` |
| `--cs-text-h2` | `var(--cs-font-size-2xl)` | `1.875rem` |
| `--cs-text-h3` | `var(--cs-font-size-xl)` | `1.5rem` |
| `--cs-text-h4` | `var(--cs-font-size-lg)` | `1.25rem` |
| `--cs-text-body-lg` | `var(--cs-font-size-md)` | `1.125rem` |
| `--cs-text-body` | `var(--cs-font-size-base)` | `1rem` |
| `--cs-text-secondary` | `var(--cs-font-size-sm)` | `0.875rem` |
| `--cs-text-micro` | `var(--cs-font-size-2xs)` | `0.6875rem` |
| `--cs-text-caption` | `var(--cs-font-size-xs)` | `0.75rem` |
| `--cs-text-eyebrow` | `var(--cs-font-size-xs)` | `0.75rem` |

| Token | Giá trị |
|---|---|
| `--cs-letter-spacing-tight` | `-0.01em` |
| `--cs-letter-spacing-normal` | `0` |
| `--cs-letter-spacing-caps` | `0.08em` |

### Trình bày tiêu đề

| Token | Dạng CSS | Giá trị phân giải |
|---|---|---|
| `--cs-heading-family` | `var(--cs-font-family-ui)` | `'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif` |
| `--cs-heading-weight-strong` | `var(--cs-font-weight-extrabold)` | `800` |
| `--cs-heading-weight` | `var(--cs-font-weight-bold)` | `700` |
| `--cs-heading-tracking` | `var(--cs-letter-spacing-tight)` | `-0.01em` |

### Hệ thống phân cấp kiểu chữ đầy đủ và phông chữ thay thế

- **Phân cấp lớp tiện ích chữ (`base/typography.css`):** `.cs-display` (`--cs-text-display` `3.75rem`, độ đậm `800`, chiều cao dòng `1.15`, `1.22` khi `:lang(vi)`, giãn chữ `-0.01em`) và lớp co giãn `.cs-display--fluid`; `.cs-h1` (`--cs-text-h1` `2.25rem`, độ đậm `800`, chiều cao dòng `1.35`) và `.cs-h1--fluid`; `.cs-h2` (`--cs-text-h2` `1.875rem`, độ đậm `700`); `.cs-h3` (`--cs-text-h3` `1.5rem`, độ đậm `700`); `.cs-h4` (`--cs-text-h4` `1.25rem`, độ đậm `600`); `.cs-body-lg` (`--cs-text-body-lg` `1.125rem`, chiều cao dòng `1.5`); `.cs-body` (`--cs-text-body` `1rem`, chiều cao dòng `1.5`); `.cs-secondary` (`--cs-text-secondary` `0.875rem`); `.cs-caption` (`--cs-text-caption` `0.75rem`); `.cs-eyebrow` (`--cs-text-eyebrow` `0.75rem`, độ đậm `700`, chữ hoa, giãn chữ `0.08em`); `.cs-mono` (`--cs-font-family-mono`), `.cs-tabular` (`tabular-nums`), và `.cs-prose` (`--cs-prose-measure` `45rem`).
- **Phông chữ thay thế và an toàn dấu tiếng Việt:** khi tệp WOFF2 tự lưu trữ không khả dụng trong môi trường bên ngoài, `--cs-font-family-ui` (`Be Vietnam Pro`) rơi về `ui-sans-serif, system-ui, sans-serif` (hoặc `Inter`), `--cs-font-family-display` (`Space Grotesk`) rơi về `'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif`, và `--cs-font-family-mono` (`JetBrains Mono`) rơi về `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`; luôn giữ `--cs-font-line-height-body` (`1.5`) và `--cs-font-line-height-heading` (`1.35`) để dấu tiếng Việt chồng tầng không bao giờ bị cắt.

## Khoảng cách và bán kính

| Token | Giá trị |
|---|---|
| `--cs-space-0` | `0px` |
| `--cs-space-1` | `4px` |
| `--cs-space-2` | `8px` |
| `--cs-space-3` | `12px` |
| `--cs-space-4` | `16px` |
| `--cs-space-5` | `20px` |
| `--cs-space-6` | `24px` |
| `--cs-space-8` | `32px` |
| `--cs-space-10` | `40px` |
| `--cs-space-12` | `48px` |
| `--cs-space-16` | `64px` |
| `--cs-space-20` | `80px` |
| `--cs-space-24` | `96px` |

| Token | Giá trị |
|---|---|
| `--cs-radius-sm` | `4px` |
| `--cs-radius-md` | `8px` |
| `--cs-radius-lg` | `14px` |
| `--cs-radius-full` | `999px` |

### Mật độ (thuộc tính của Theme)

| Token | Dạng CSS | Giá trị phân giải |
|---|---|---|
| `--cs-density-space-1` | `var(--cs-space-1)` | `4px` |
| `--cs-density-space-2` | `var(--cs-space-2)` | `8px` |
| `--cs-density-space-3` | `var(--cs-space-3)` | `12px` |
| `--cs-density-space-4` | `var(--cs-space-4)` | `16px` |
| `--cs-density-space-5` | `var(--cs-space-5)` | `20px` |
| `--cs-density-space-6` | `var(--cs-space-6)` | `24px` |
| `--cs-density-control-gap` | `var(--cs-component-button-gap)` | `8px` |

Các giá trị ghi đè theo phạm vi (tách biệt với các hàng token cơ sở):

| Phạm vi | Token | Ghi đè CSS |
|---|---|---|
| `data-cs-density="compact"` | `--cs-density-space-1` | `3px` |
| `data-cs-density="compact"` | `--cs-density-space-2` | `6px` |
| `data-cs-density="compact"` | `--cs-density-space-3` | `9px` |
| `data-cs-density="compact"` | `--cs-density-space-4` | `12px` |
| `data-cs-density="compact"` | `--cs-density-space-5` | `16px` |
| `data-cs-density="compact"` | `--cs-density-space-6` | `18px` |
| `data-cs-density="compact"` | `--cs-density-control-gap` | `6px` |
| `data-cs-density="compact"` | `--cs-component-button-gap` | `6px` |
| `data-cs-density="compact"` | `--cs-component-button-xs-paddingY` | `var(--cs-component-button-xs-padding-y)` |
| `data-cs-density="compact"` | `--cs-component-button-xs-padding-y` | `3px` |
| `data-cs-density="compact"` | `--cs-component-button-xs-paddingX` | `var(--cs-component-button-xs-padding-x)` |
| `data-cs-density="compact"` | `--cs-component-button-xs-padding-x` | `8px` |
| `data-cs-density="compact"` | `--cs-component-button-sm-paddingY` | `var(--cs-component-button-sm-padding-y)` |
| `data-cs-density="compact"` | `--cs-component-button-sm-padding-y` | `6px` |
| `data-cs-density="compact"` | `--cs-component-button-sm-paddingX` | `var(--cs-component-button-sm-padding-x)` |
| `data-cs-density="compact"` | `--cs-component-button-sm-padding-x` | `12px` |
| `data-cs-density="compact"` | `--cs-component-button-md-paddingY` | `var(--cs-component-button-md-padding-y)` |
| `data-cs-density="compact"` | `--cs-component-button-md-padding-y` | `10px` |
| `data-cs-density="compact"` | `--cs-component-button-md-paddingX` | `var(--cs-component-button-md-padding-x)` |
| `data-cs-density="compact"` | `--cs-component-button-md-padding-x` | `16px` |
| `data-cs-density="compact"` | `--cs-component-button-lg-paddingY` | `var(--cs-component-button-lg-padding-y)` |
| `data-cs-density="compact"` | `--cs-component-button-lg-padding-y` | `12px` |
| `data-cs-density="compact"` | `--cs-component-button-lg-paddingX` | `var(--cs-component-button-lg-padding-x)` |
| `data-cs-density="compact"` | `--cs-component-button-lg-padding-x` | `22px` |
| `data-cs-density="compact"` | `--cs-component-textfield-paddingY` | `var(--cs-component-textfield-padding-y)` |
| `data-cs-density="compact"` | `--cs-component-textfield-padding-y` | `8px` |
| `data-cs-density="compact"` | `--cs-component-textfield-paddingX` | `var(--cs-component-textfield-padding-x)` |
| `data-cs-density="compact"` | `--cs-component-textfield-padding-x` | `10px` |
| `data-cs-density="comfortable"` | `--cs-density-space-1` | `var(--cs-space-1)` |
| `data-cs-density="comfortable"` | `--cs-density-space-2` | `var(--cs-space-2)` |
| `data-cs-density="comfortable"` | `--cs-density-space-3` | `var(--cs-space-3)` |
| `data-cs-density="comfortable"` | `--cs-density-space-4` | `var(--cs-space-4)` |
| `data-cs-density="comfortable"` | `--cs-density-space-5` | `var(--cs-space-5)` |
| `data-cs-density="comfortable"` | `--cs-density-space-6` | `var(--cs-space-6)` |
| `data-cs-density="comfortable"` | `--cs-density-control-gap` | `var(--cs-component-button-gap)` |
| `data-cs-density="comfortable"` | `--cs-component-button-gap` | `8px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-padding-y` | `4px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-paddingY` | `var(--cs-component-button-xs-padding-y)` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-padding-x` | `10px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-paddingX` | `var(--cs-component-button-xs-padding-x)` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-padding-y` | `8px` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-paddingY` | `var(--cs-component-button-sm-padding-y)` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-padding-x` | `14px` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-paddingX` | `var(--cs-component-button-sm-padding-x)` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-padding-y` | `12px` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-paddingY` | `var(--cs-component-button-md-padding-y)` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-padding-x` | `20px` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-paddingX` | `var(--cs-component-button-md-padding-x)` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-padding-y` | `16px` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-paddingY` | `var(--cs-component-button-lg-padding-y)` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-padding-x` | `28px` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-paddingX` | `var(--cs-component-button-lg-padding-x)` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-padding-y` | `10px` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-paddingY` | `var(--cs-component-textfield-padding-y)` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-padding-x` | `12px` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-paddingX` | `var(--cs-component-textfield-padding-x)` |

### Bố cục và biểu tượng

| Token | Giá trị |
|---|---|
| `--cs-breakpoint-xs` | `0px` |
| `--cs-breakpoint-phone` | `360px` |
| `--cs-breakpoint-sm` | `640px` |
| `--cs-breakpoint-md` | `768px` |
| `--cs-breakpoint-lg` | `1024px` |
| `--cs-breakpoint-xl` | `1280px` |
| `--cs-breakpoint-2xl` | `1536px` |
| `--cs-container-max` | `1320px` |
| `--cs-prose-measure` | `45rem` |
| `--cs-scroll-padding-block-start` | `var(--cs-space-4)` |
| `--cs-scroll-padding-block-end` | `var(--cs-space-4)` |
| `--cs-icon-sm` | `16px` |
| `--cs-icon-md` | `20px` |
| `--cs-icon-lg` | `24px` |

### Triết lý khoảng trắng, thang bán kính bo góc và hình học đa phương tiện

- **Khoảng trắng và nhịp phân đoạn:** tách các dải nội dung lớn bằng `--cs-space-16` (`64px`) đến `--cs-space-24` (`96px`), giữ đệm trong của thẻ ở `--cs-space-4` (`16px`) đến `--cs-space-6` (`24px`), và giới hạn độ rộng cột đọc dài bằng `.cs-prose` (`--cs-prose-measure` `45rem`).
- **Thang bán kính bo góc và hình học đa phương tiện (`Shapes`):** `--cs-radius-sm` (`4px`) cho `.cs-kbd`, `.cs-code`, và nhãn nhỏ; `--cs-radius-md` (`8px`) cho `.cs-button`, `.cs-field__control`, `.cs-popover__panel`, và `.cs-menu__list`; `--cs-radius-lg` (`14px`) cho `.cs-card`, `.cs-dialog`, `.cs-cmdk`, và tấm kính `.cs-surface-*`; `--cs-radius-full` (`999px`) cho `.cs-badge`, `.cs-tag`, và `.cs-avatar` tròn; đóng khung hình ảnh bằng `.cs-card__media`, `AspectRatio` (`16:9`, `4:3`, `1:1`), `.cs-image__zoom`, và `.cs-aurora--photo`; tài nguyên logo chính thức nằm tại `assets/logo-mark.svg`, `assets/logo-mark.png`, `assets/favicon.svg`, và `components/logo/logo-data.js` (không có thư mục `assets/logos/*`; trong bản xem trước HTML đơn tệp hoặc sandbox đám mây không có máy chủ tài nguyên tĩnh, nhúng trực tiếp `<svg viewBox="0 0 64 64">` nội tuyến thay vì `<img src="assets/logo-mark.svg">`).

## Độ nổi

Giá trị bóng là chuỗi CSS box-shadow nguyên gốc từ `$extensions["com.cyberskill"].css` (đối tượng DTCG có cấu trúc lưu cùng các lớp). Bảng có giá trị ghi đè cho chủ đề tối.

| Token | Sáng | Tối |
|---|---|---|
| `--cs-shadow-xs` | `0 1px 2px rgba(69, 33, 14, 0.06)` | `0 1px 2px rgba(0, 0, 0, 0.40)` |
| `--cs-shadow-sm` | `0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06)` | `0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42)` |
| `--cs-shadow-md` | `0 12px 30px rgba(69, 33, 14, 0.14)` | `0 12px 30px rgba(0, 0, 0, 0.50)` |
| `--cs-shadow-lg` | `0 20px 60px rgba(69, 33, 14, 0.18)` | `0 20px 60px rgba(0, 0, 0, 0.55)` |
| `--cs-shadow-xl` | `0 24px 80px rgba(69, 33, 14, 0.24)` | `0 24px 80px rgba(0, 0, 0, 0.62)` |

### Thang chiều sâu và vật liệu Liquid Glass

| Token | Giá trị |
|---|---|
| `--cs-depth-bg` | `0` |
| `--cs-depth-section` | `5` |
| `--cs-depth-card` | `10` |
| `--cs-depth-nav` | `50` |
| `--cs-depth-modal` | `100` |
| `--cs-depth-toast` | `200` |
| `--cs-depth-dropdown` | `60` |
| `--cs-depth-overlay` | `80` |
| `--cs-glass-whisper-blur` | `8px` |
| `--cs-glass-whisper-saturate` | `110%` |
| `--cs-glass-whisper-opacity` | `60%` |
| `--cs-glass-light-blur` | `12px` |
| `--cs-glass-light-saturate` | `130%` |
| `--cs-glass-light-opacity` | `70%` |
| `--cs-glass-standard-blur` | `16px` |
| `--cs-glass-standard-saturate` | `150%` |
| `--cs-glass-standard-opacity` | `80%` |
| `--cs-glass-heavy-blur` | `24px` |
| `--cs-glass-heavy-saturate` | `180%` |
| `--cs-glass-heavy-opacity` | `90%` |

### Phân cấp độ nổi (Cấp 0–5) và chiều sâu trang trí

- **Phân cấp bề mặt và bóng đổ sáu mức:** Cấp 0 (`--cs-depth-bg` `0`) nền phẳng `--cs-color-surface-page`; Cấp 1 (`--cs-depth-section` `5`) dải nền `--cs-color-surface-raised`, `.cs-card--flat`, và `.cs-card--raised`; Cấp 2 (`--cs-depth-card` `10`) thẻ `.cs-card` mặc định với `--cs-shadow-xs` / `--cs-shadow-sm` và `.cs-surface-whisper` / `.cs-surface-light`; Cấp 3 thẻ tương tác/tiêu điểm `.cs-card--interactive:hover` và `.cs-card--featured` với `--cs-shadow-md` cùng `.cs-surface-standard`; Cấp 4 (`--cs-depth-nav` `50`, `--cs-depth-dropdown` `60`, `--cs-depth-overlay` `80`) thanh đầu trang cố định, `.cs-popover__panel`, `.cs-menu__list`, và `.cs-surface-heavy` với `--cs-shadow-lg`; Cấp 5 (`--cs-depth-modal` `100`, `--cs-depth-toast` `200`) `.cs-dialog`, `.cs-drawer`, `.cs-cmdk`, và `.cs-toast` với `--cs-shadow-xl` trên lớp chắn `var(--cs-color-surface-scrim)`.
- **Chiều sâu trang trí:** kết hợp bóng đổ đa lớp tông Umber ấm với viền sáng nội bộ `1px` (`--_cs-glass-border`) trên các tấm `.cs-surface-*` và dải chuyển sắc hướng tâm Ochre/Umber trên nền hero `.cs-aurora`; khi bật `prefers-reduced-transparency: reduce` hoặc `forced-colors: active`, bề mặt tự chuyển về nền đặc `.cs-surface-solid`.

## Chuyển động

Chuyển động điềm tĩnh, có mục đích; lớp bảo vệ toàn cục `prefers-reduced-motion` giảm thời lượng animation/transition xuống 0.01ms và tắt cuộn mượt khi chạy; thành phần có thể tắt hoàn toàn animation — các giá trị xuất này là giá trị thực (80/120/200/320ms).

| Token | Giá trị |
|---|---|
| `--cs-duration-instant` | `80ms` |
| `--cs-duration-fast` | `120ms` |
| `--cs-duration-base` | `200ms` |
| `--cs-duration-slow` | `320ms` |
| `--cs-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--cs-ease-entrance` | `cubic-bezier(0, 0, 0, 1)` |
| `--cs-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--cs-ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` |

## Token của thành phần

Quyết định thiết kế ở cấp thành phần (button · textfield). Giá trị tối là phần ghi đè theo chủ đề.

| Token | Sáng | Tối |
|---|---|---|
| `--cs-component-button-primary-bg` | `#45210E` | `#f4ba17` |
| `--cs-component-button-primary-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-component-button-gap` | `8px` | — |
| `--cs-component-button-radius` | `8px` | — |
| `--cs-component-button-xs-paddingY` | `var(--cs-component-button-xs-padding-y)` | — |
| `--cs-component-button-xs-paddingX` | `var(--cs-component-button-xs-padding-x)` | — |
| `--cs-component-button-xs-minHeight` | `var(--cs-component-button-xs-min-height)` | — |
| `--cs-component-button-xs-minWidth` | `var(--cs-component-button-xs-min-width)` | — |
| `--cs-component-button-xs-minHeight-coarse` | `var(--cs-component-button-xs-min-height-coarse)` | — |
| `--cs-component-button-sm-paddingY` | `var(--cs-component-button-sm-padding-y)` | — |
| `--cs-component-button-sm-paddingX` | `var(--cs-component-button-sm-padding-x)` | — |
| `--cs-component-button-sm-minHeight` | `var(--cs-component-button-sm-min-height)` | — |
| `--cs-component-button-sm-minHeight-coarse` | `var(--cs-component-button-sm-min-height-coarse)` | — |
| `--cs-component-button-md-paddingY` | `var(--cs-component-button-md-padding-y)` | — |
| `--cs-component-button-md-paddingX` | `var(--cs-component-button-md-padding-x)` | — |
| `--cs-component-button-md-minHeight` | `var(--cs-component-button-md-min-height)` | — |
| `--cs-component-button-md-minHeight-coarse` | `var(--cs-component-button-md-min-height-coarse)` | — |
| `--cs-component-button-lg-paddingY` | `var(--cs-component-button-lg-padding-y)` | — |
| `--cs-component-button-lg-paddingX` | `var(--cs-component-button-lg-padding-x)` | — |
| `--cs-component-button-lg-minHeight` | `var(--cs-component-button-lg-min-height)` | — |
| `--cs-component-textfield-border-default` | `#BFA58F` | `#5a4636` |
| `--cs-component-textfield-paddingY` | `var(--cs-component-textfield-padding-y)` | — |
| `--cs-component-textfield-paddingX` | `var(--cs-component-textfield-padding-x)` | — |
| `--cs-component-textfield-minHeight` | `var(--cs-component-textfield-min-height)` | — |
| `--cs-focus-ring` | `3px` | — |
| `--cs-component-button-xs-padding-y` | `4px` | — |
| `--cs-component-button-xs-padding-x` | `10px` | — |
| `--cs-component-button-xs-min-height` | `28px` | — |
| `--cs-component-button-xs-min-width` | `28px` | — |
| `--cs-component-button-xs-min-height-coarse` | `44px` | — |
| `--cs-component-button-sm-padding-y` | `8px` | — |
| `--cs-component-button-sm-padding-x` | `14px` | — |
| `--cs-component-button-sm-min-height` | `36px` | — |
| `--cs-component-button-sm-min-height-coarse` | `44px` | — |
| `--cs-component-button-md-padding-y` | `12px` | — |
| `--cs-component-button-md-padding-x` | `20px` | — |
| `--cs-component-button-md-min-height` | `44px` | — |
| `--cs-component-button-md-min-height-coarse` | `44px` | — |
| `--cs-component-button-lg-padding-y` | `16px` | — |
| `--cs-component-button-lg-padding-x` | `28px` | — |
| `--cs-component-button-lg-min-height` | `52px` | — |
| `--cs-component-textfield-padding-y` | `10px` | — |
| `--cs-component-textfield-padding-x` | `12px` | — |
| `--cs-component-textfield-min-height` | `44px` | — |

## Cấu trúc thành phần HTML tĩnh (.cs-*)

Bên dùng HTML tĩnh và công cụ sinh mã không kèm runtime định kiểu trực tiếp cho phần tử HTML ngữ nghĩa bằng các lớp `.cs-*` từ `styles.css` (hoặc `styles.layered.css`). `dist/styles.css` là cùng tập hợp được làm phẳng thành một tệp cho các môi trường không theo chuỗi `@import` (bộ kết xuất thẻ, một số sandbox); sinh lại bằng `npm run build:css` sau khi sửa `tokens/` hoặc `base/`; các thẻ hướng dẫn trong `guidelines/` mặc định hiển thị tiếng Anh (`?language=vi` cho tiếng Việt). Quản lý trạng thái tương tác, điều hướng bàn phím, giữ focus trong lớp phủ và thông báo ARIA động cần thành phần React hoặc mã kịch bản do bên dùng cung cấp; xem `docs/static-html-reference.md` để đối chiếu DOM đã kết xuất.

- **Tác vụ và nút bấm (`base/components.css`):** nút chính `.cs-button`, các biến thể `.cs-button--secondary`, `.cs-button--tertiary`, `.cs-button--ghost`, `.cs-button--danger`, `.cs-button--danger-ghost`; kích thước `.cs-button--xs` (`28px`, nâng lên `44px` khi `pointer: coarse`), `.cs-button--sm` (`36px`, nâng lên `44px` khi `pointer: coarse`), cỡ trung bình mặc định (`44px`), `.cs-button--lg` (`52px`), trải rộng toàn khung `.cs-button--full`; trạng thái `.is-disabled`, `.is-loading` kèm `.cs-button__spinner`.
- **Điều khiển biểu mẫu và trường nhập (`base/components.css`, `base/forms.css`, `base/controls.css`):** khung trường `.cs-field` gồm `.cs-field__label`, `.cs-field__control`, `.cs-field__description`, `.cs-field__error` và trạng thái lỗi `.cs-field.is-invalid`; điều khiển lựa chọn `.cs-check`, `.cs-radio`, `.cs-switch` (`.cs-switch__track`); ô nhập phức hợp `.cs-select`, `.cs-native-select`, `.cs-search` (`.cs-search__clear`), `.cs-stepper`, `.cs-otp`, `.cs-slider`, `.cs-segmented`, `.cs-combobox`, `.cs-igroup`, `.cs-taginput`, `.cs-datepicker` (`.cs-datepicker__field`), `.cs-timepicker`, `.cs-treeselect` (`.cs-treeselect__field`), `.cs-cascader` (`.cs-cascader__field` / `.cs-treeselect__field`), `.cs-colorpicker` (`.cs-colorpicker__field`), và `.cs-dropzone`.
- **Thẻ nội dung và bề mặt Liquid Glass (`base/data.css`, `base/glass.css`):** khung thẻ `.cs-card` (biến thể `.cs-card--flat`, `.cs-card--raised`, `.cs-card--featured`, `.cs-card--interactive`; vùng con `.cs-card__media`, `.cs-card__header`, `.cs-card__title`, `.cs-card__subtitle`, `.cs-card__body`, `.cs-card__footer`); các cấp vật liệu kính `.cs-surface-whisper`, `.cs-surface-light`, `.cs-surface-standard` (bí danh `.cs-glass-card`), `.cs-surface-heavy`, bề mặt đặc dự phòng `.cs-surface-solid` (bí danh `.cs-surface-matte`), và nền hero thương hiệu `.cs-aurora` (`.cs-aurora--photo`).
- **Hiển thị dữ liệu và kiểu chữ (`base/components.css`, `base/data.css`, `base/typography.css`, `base/collections.css`):** khung bảng thích ứng `.cs-table-wrap` và `.cs-table` với ô số căn phải dạng bảng `.cs-table__cell--numeric` cùng đường kẻ hàng dịu `var(--cs-color-border-subtle, var(--_cs-border-subtle))`; khối chỉ số `.cs-stat` (`.cs-stat__label`, `.cs-stat__value`, `.cs-stat__delta--up`, `.cs-stat__delta--down`, `.cs-stat__delta--flat`); nhãn trạng thái `.cs-badge` (`.cs-badge--solid`, `.cs-badge--ochre`, `.cs-badge--success`, `.cs-badge--warning`, `.cs-badge--danger`, `.cs-badge--info`, `.cs-badge__dot`) và thẻ xóa được `.cs-tag`; `.cs-avatar` (`.cs-avatar--sm`, `.cs-avatar--md`, `.cs-avatar--lg`, `.cs-avatar--square`, `.cs-avatar-group`); `.cs-kbd`, `.cs-code`, `.cs-dl`; các lớp vai trò chữ `.cs-display`, `.cs-display--fluid`, `.cs-h1`, `.cs-h1--fluid`, `.cs-h2`, `.cs-h3`, `.cs-h4`, `.cs-body-lg`, `.cs-body`, `.cs-secondary`, `.cs-caption`, `.cs-eyebrow`, `.cs-mono`, `.cs-tabular`, `.cs-prose`, và phạm vi chọn họ chữ tiêu đề `.cs-display-face`.
- **Phản hồi và lớp phủ (`base/feedback.css`, `base/components.css`, `base/shell.css`):** thông báo nội tuyến `.cs-alert` (`.cs-alert--info`, `.cs-alert--success`, `.cs-alert--warning`, `.cs-alert--danger`, `.cs-alert__icon`, `.cs-alert__title`, `.cs-alert__body`, `.cs-alert__dismiss`); ngăn xếp `.cs-toast-stack` và `.cs-toast`; hộp thoại `.cs-dialog-layer` với nền mờ thích ứng chủ đề `.cs-dialog__overlay` (`var(--cs-color-surface-scrim, var(--_cs-surface-scrim))`), khung `.cs-dialog` (`.cs-dialog__header`, `.cs-dialog__title`, `.cs-dialog__body`, `.cs-dialog__actions`) và `.cs-alert-dialog` (`.cs-alert-dialog--destructive`); ngăn trượt `.cs-drawer-scrim` và `.cs-drawer` (`.cs-drawer--left`); `.cs-popover` (`.cs-popover__panel`), `.cs-tooltip` (`.cs-tooltip__bubble`), `.cs-progress` (`.cs-progress__fill`), `.cs-spinner`, `.cs-skeleton`.
- **Điều hướng, khung ứng dụng và AI (`base/navigation.css`, `base/shell.css`, `base/ai.css`, `base/controls.css`):** thanh bên `.cs-sidebar` (`.cs-sidebar__label`, `.cs-nav-item`, `.cs-nav-item.is-active`), `.cs-tabs` (`.cs-tab`, `.cs-tab__count`), `.cs-breadcrumb`, `.cs-pagination`, `.cs-menu` (`.cs-menu__list`, `.cs-menu__item`, `.cs-menu__item--danger`, `.cs-menu__sep`), `.cs-steps` (`.cs-step`, `.cs-step--done`, `.cs-step--active`), bảng lệnh `.cs-cmdk-scrim` và `.cs-cmdk` (`.cs-cmdk__search`, `.cs-cmdk__list`, `.cs-cmdk__item`); bề mặt AI `.cs-prompt`, `.cs-chat-msg`, `.cs-ai-disclosure` (`.cs-ai-disclosure__badge`, `.cs-ai-disclosure__panel`), `.cs-review-gate`, và `.cs-terminal`.

### Thành phần đặc trưng và các bề mặt mẫu chuẩn (ex-*)

- **Bề mặt đặc trưng của CyberSkill:** (1) 4 cấp kính quang học Liquid Glass (`.cs-surface-whisper` đến `.cs-surface-heavy`), (2) nền hero hướng tâm Ochre/Umber `.cs-aurora`, (3) bộ ba AI đáng tin cậy (`AIDisclosureBadge` `.cs-ai-disclosure`, `ConfidenceMeter`, `HumanReviewGate` `.cs-review-gate`, `LumiAvatar` `.cs-lumi`), (4) 15 gói màu nhấn Ngũ Hành (`data-cs-element`), và (5) 85 mẫu tài liệu song ngữ `.dc.html`.
- **Các bề mặt mẫu chuẩn đối chiếu (`ex-*`):** `ex-pricing-tier` → `.cs-card` gồm `.cs-card__header`, `.cs-stat__value.cs-tabular`, và `.cs-button--secondary`; `ex-pricing-tier-featured` → `.cs-card.cs-card--featured` kèm `.cs-badge--ochre` và nút chính `.cs-button`; `ex-product-selector` → `.cs-card.cs-card--raised` kèm `.cs-segmented` và `.cs-check`; `ex-cart-drawer` → `.cs-drawer-scrim` + `.cs-drawer` kèm danh sách khoản mục `.cs-dl` và `.cs-drawer__footer`; `ex-app-shell-row` → `.cs-sidebar` + `.cs-nav-item.is-active`; `ex-data-table-cell` → `.cs-table-wrap` + `.cs-table` + `.cs-table__cell--numeric`; `ex-auth-form-card` → `.cs-card` + `.cs-form` + `.cs-field` + `.cs-button--full`; `ex-modal-card` → `.cs-dialog-layer` + `.cs-dialog__overlay` + `.cs-dialog`; `ex-empty-state-card` → `.cs-card.cs-card--flat` + `EmptyState`; `ex-toast` → `.cs-toast-stack` + `.cs-toast`.

## Bố cục, lưới và chiến lược đáp ứng

Bố cục dựa trên nhịp không gian `4px` (`--cs-space-1` đến `--cs-space-24`) với giới hạn khung chứa (`--cs-container-sm` `640px` đến `--cs-container-2xl` `1440px`) và hai phạm vi mật độ (`data-cs-density="comfortable"` mặc định so với `data-cs-density="compact"`). Đánh dấu các vùng chia hoặc khung thay đổi kích thước bằng `.cs-cq` (`container-type: inline-size`) để thu gọn lưới con qua `.cs-cq-cols-2`, `.cs-cq-cols-3`, `.cs-cq-cols-4`, `.cs-cq-stack`, và `.cs-cq-hide-narrow` độc lập với độ rộng khung nhìn.

- **Màn hình máy tính và rộng (`> 1024px`, `--cs-breakpoint-lg` / `--cs-breakpoint-xl` `1280px` / `--cs-breakpoint-2xl` `1536px`):** giữ nguyên lưới nhiều cột, thanh bên `.cs-sidebar` `248px` cố định + vùng làm việc chính `1fr`, đệm trang rộng (`40px+`), và cỡ chữ tiêu đề đầy đủ (`--cs-text-display` `3.75rem`, `--cs-text-h1` `2.25rem`). Bài trình chiếu 16:9 và khung mạng xã hội cố định trong `.cs-canvas-desk` giữ nguyên cột gốc và cuộn ngang khi nhỏ hơn `1280px` (`min-width: 960px`).
- **Máy tính bảng (`<= 768px`, `--cs-breakpoint-md`):** lưới nội tuyến 3–6 cột thu gọn về `repeat(2, 1fr)`; `.cs-sidebar` chuyển từ cột cố định sang dải điều hướng ngang tự xuống dòng; `.cs-table-wrap` và `.cs-table-scroll` cuộn ngang; `.cs-display` giảm xuống `--cs-font-size-4xl` (`3rem`) và `.cs-h1` xuống `--cs-font-size-2xl` (`1.875rem`) bên ngoài `.cs-canvas-desk` (hoặc co giãn mượt khi dùng `.cs-display--fluid` / `.cs-h1--fluid`); `.cs-nav-item` và `.cs-search` áp dụng chiều cao chạm tối thiểu `44px`.
- **Điện thoại và màn hình hẹp (`<= 640px` `--cs-breakpoint-sm`, `<= 480px` `--cs-breakpoint-xs`, ngưỡng dàn trang `<= 360px`):** mọi lưới nội dung nhiều cột thu về `1fr`; `.cs-dialog` mở rộng thành `calc(100vw - 1rem)` ở vị trí `4vh` (hỗ trợ vùng an toàn `4dvh`) với các nút tác vụ co giãn toàn hàng; `.cs-display` giảm xuống `--cs-font-size-3xl` (`2.25rem`) và `.cs-h1` xuống `--cs-font-size-xl` (`1.5rem`); tại `<= 360px` (WCAG 1.4.10), `.cs-tabs`, `.cs-pagination`, `.cs-otp`, và `.cs-dl` tự xuống dòng hoặc cuộn nội bộ mà không gây tràn ngang trang, đồng thời giữ vùng chạm `>= 44px`.

## Nguyên tắc thực hành (Nên và Không nên)

- **Nên (Thương hiệu và màu sắc):** neo giao diện vào Umber `#45210E` và Ochre `#F4BA17`; dùng `--cs-color-surface-page`, `--cs-color-surface-panel`, `--cs-color-surface-raised`, `--cs-color-border-default`, cùng cặp móc ghi đè có giá trị dự phòng `var(--cs-color-border-subtle, var(--_cs-border-subtle))` / `var(--cs-color-surface-scrim, var(--_cs-surface-scrim))` để chế độ sáng, `[data-theme="dark"]`, `[data-theme="system"]`, `[data-cs-contrast="high"]`, và cả 15 gói nguyên tố Ngũ Hành tự động thích ứng; luôn ghép màu chữ sáng (`#45210E`) với bề mặt sáng (`#FFFDF8` / `#FFFFFF`) và màu chữ kem tối (`#f5ead9`) với bề mặt tối (`#1a1108` / `#221710`).
- **Không nên (Thương hiệu và màu sắc):** không đặt văn bản nội dung trên nền trung gian `--cs-accent` (hãy ghép `--cs-accent-strong` với `--cs-accent-on-strong`, và `--cs-accent-bright` với `--cs-accent-on`), không đặt chữ tối trên phần tử cha nền sáng chưa gắn chủ đề, và không gán cứng viền `rgba(69, 33, 14, ...)` hay màn chắn `rgba(31, 19, 11, ...)` chỉ hợp nền sáng trong CSS thành phần.
- **Nên (Kiểu chữ và bản địa hóa tiếng Việt):** giữ `--cs-font-line-height-body` (`1.5`) và `--cs-font-line-height-heading` (`1.35`) để dấu tiếng Việt chồng tầng (`ẫ`, `ệ`, `ự`, `ở`) không bị cắt; áp dụng `.cs-tabular` hoặc `.cs-table__cell--numeric` (`font-variant-numeric: tabular-nums`) cho chỉ số KPI, giá tiền, mốc thời gian, huy hiệu và số trang; cung cấp đủ cặp chuỗi EN và VI cho giao diện đã đăng ký.
- **Không nên (Kiểu chữ và bản địa hóa tiếng Việt):** không ép chiều cao dòng văn bản xuống dưới `1.5` hoặc tiêu đề xuống dưới `1.35` đối với tiếng Việt, không lược bỏ dấu, và không đặt `--cs-font-family-display` (`Space Grotesk`) làm phông chữ nội dung mặc định (chỉ bật cho tiêu đề qua `.cs-display-face` hoặc `--cs-heading-family`).
- **Nên (Khả năng tiếp cận và chuyển động):** giữ chỉ báo focus hai vòng (`outline: 2px solid var(--cs-color-text-primary)` + `box-shadow: 0 0 0 5px var(--cs-color-accent-ochre)`), duy trì `APCA Lc >= 75` cho văn bản nội dung, đảm bảo vùng chạm `>= 44px` khi `@media (pointer: coarse)`, và cung cấp bề mặt đặc dự phòng khi `prefers-reduced-transparency: reduce` hoặc `forced-colors: active`.
- **Không nên (Khả năng tiếp cận và ranh giới runtime):** không xóa đường viền `:focus-visible` nếu phần tử cha không có vòng focus kết hợp `:focus-within`, không dùng màu sắc đơn lẻ để biểu đạt trạng thái (luôn kết hợp màu ngữ nghĩa với biểu tượng, nhãn chữ hoặc độ dày viền), và không coi HTML tĩnh `.cs-*` tự có sẵn điều hướng bàn phím, giữ focus hay cập nhật trạng thái ARIA như thành phần React.

## Hướng dẫn prompt cho Agent và khung khởi tạo

- **Thuộc tính gốc (`<html>`):** đặt `lang="vi"` (hoặc `lang="en"`), `data-theme="light"` (`"dark"` | `"system"`), tùy chọn `data-cs-element="tho"` cùng `data-cs-variant` chính xác (`tho` `#45210E`/`#F4BA17`: mặc định/không khai báo, `"sand"`, `"clay"`, bí danh `"studio"`/`"ochre"`; `hoa` `#992515`/`#F26C4F`: mặc định/không khai báo, `"plasma"`, `"lava"`, bí danh `"ember"`; `thuy` `#0D5A8A`/`#58B4E8`: mặc định/không khai báo, `"mist"`, `"ocean"`, bí danh `"river"`; `moc` `#1F5C3A`/`#62C389`: mặc định/không khai báo, `"bamboo"`, `"forest"`, bí danh `"jade"`/`"leaf"`; `kim` `#374151`/`#D6DCE5`: mặc định/không khai báo, `"titanium"`, `"steel"`, bí danh `"gold"`/`"champagne"`/`"silver"`), tùy chọn `data-cs-style="liquid-glass"` (`"matte-paper"` cho bề mặt biên tập/mật độ cao đặc không nhòe kính), tùy chọn `data-cs-density="comfortable"` (`"compact"`), và tùy chọn `data-cs-contrast="standard"` (`"high"`). Các bí danh lớp CSS theo tên thành phần (`.cs-review-gate` / `.cs-human-review-gate`, `.cs-otp` / `.cs-input-otp`, `.cs-select` / `.cs-select__trigger`, và `.cs-datagrid tr.is-selected` / `tr.cs-item.is-selected`) cùng các lớp tài liệu pháp lý (`.cs-doc-sheet`, `.cs-doc-motto`, `.cs-doc-section-bar`, `.cs-doc-blank`, `.cs-doc-field`) được định kiểu tự nhiên.
- **Chọn runtime:** nạp `styles.css` (hoặc `styles.layered.css`) cho HTML tĩnh `.cs-*`; nhập `@cyberskill/design` (`dist/esm/_esm/react.mjs`) cho React ESM đã biên dịch hoặc `@cyberskill/design/source` (`_esm/react.mjs`) cho JSX nguồn; chỉ dùng `templates/_vendor/support.js` khi xem trước tài liệu `.dc.html`.
- **Danh sách kiểm tra khi viết prompt cho AI:** nêu rõ (1) runtime đích (`static-html` hay `react`), (2) chủ đề và nguyên tố Ngũ Hành (`data-theme`, `data-cs-element`), (3) cặp nội dung song ngữ (`vi` + `en` giữ nguyên dấu tiếng Việt), (4) khung chứa đáp ứng (`max-width: var(--cs-container-xl)` hoặc `.cs-cq`), và (5) căn chỉnh chữ số dạng bảng (`.cs-tabular` / `.cs-table__cell--numeric`) cho chỉ số và bảng.
- **Tham chiếu nhanh màu sắc và token:** Màu thương hiệu chính Umber `#45210E` (`--cs-color-brand-umber`) · Màu nhấn Ochre `#F4BA17` (`--cs-color-brand-ochre`) · Nền trang `#FFFDF8` / tối `#1a1108` (`--cs-color-surface-page`) · Nền bảng `#FFFFFF` / tối `#221710` (`--cs-color-surface-panel`) · Nền nổi `#FBF4E9` / tối `#2b1e14` (`--cs-color-surface-raised`) · Viền mặc định `#E7D9C6` / tối `#4a3a2c` (`--cs-color-border-default`).
- **Mẫu prompt dùng ngay:** (1) Dải Hero: phân đoạn `.cs-aurora` gồm `.cs-eyebrow`, `.cs-display--fluid`, đoạn dẫn `.cs-prose`, nút chính `.cs-button` + `.cs-button--secondary`; (2) Không gian làm việc SaaS: lưới `.cs-sidebar` + `main` với hàng 3 thẻ KPI `.cs-card` / `.cs-card--featured` (`.cs-stat__value.cs-tabular`) và `.cs-table-wrap` > `.cs-table` có `.cs-table__cell--numeric`; (3) Khung rà soát AI đáng tin cậy: `.cs-card.cs-surface-standard` kết hợp `.cs-chat-msg`, `.cs-ai-disclosure`, và `.cs-review-gate`.
- **Hướng dẫn tinh chỉnh lặp và giới hạn phạm vi:** chỉnh sửa từng thành phần hoặc dải phân đoạn một bằng các thuộc tính `--cs-*` (không gán cứng mã hex); kiểm tra chế độ sáng, `[data-theme="dark"]`, dàn trang di động `360px`, và vùng chạm `pointer: coarse` `44px`; lưu ý HTML tĩnh `.cs-*` chỉ cung cấp định kiểu thị giác (điều hướng bàn phím, giữ focus và thông báo ARIA động cần thành phần React hoặc mã kịch bản của bên dùng, và tệp `.dc.html` cần `templates/_vendor/support.js`).

## Danh mục thành phần

107 tệp thành phần · 125 mục xuất (từ `_ds_manifest.json`). Mỗi thành phần chính có `.jsx` + `.d.ts` + `.prompt.md`.

`AIDisclosureBadge` · `Accordion` · `Alert` · `AlertDialog` · `Anchor` · `AspectRatio` · `Avatar` · `AvatarGroup` · `BackTop` · `Badge` · `Breadcrumb` · `Button` · `ButtonGroup` · `CS_ICONS` · `CS_LOGO_MARK_INNER` · `CS_LOGO_VIEWBOX` · `Calendar` · `Card` · `CardBody` · `CardFooter` · `CardHeader` · `Carousel` · `Cascader` · `Chart` · `ChatMessage` · `Checkbox` · `CitationList` · `CodeBlock` · `Collapsible` · `ColorPicker` · `Combobox` · `CommandPalette` · `Comment` · `ConfidenceMeter` · `ContextMenu` · `DataGrid` · `DataTable` · `DatePicker` · `DescriptionList` · `Dialog` · `Divider` · `Dock` · `Drawer` · `EDITOR_SCHEMA` · `Editor` · `EmptyState` · `FileUpload` · `FloatingActionButton` · `Form` · `FormField` · `FormFieldArray` · `FormWizard` · `HotKeys` · `HoverCard` · `HumanReviewGate` · `Icon` · `Image` · `InlineEdit` · `InputGroup` · `InputOTP` · `Item` · `Kbd` · `Link` · `List` · `ListItem` · `LocaleProvider` · `Logo` · `LumiAvatar` · `Masonry` · `Mentions` · `Menu` · `MenuItem` · `Menubar` · `NativeSelect` · `NavItem` · `NavigationMenu` · `NumberField` · `OverlayProvider` · `Pagination` · `Popconfirm` · `Popover` · `ProgressBar` · `PromptInput` · `PromptSuggestions` · `QRCode` · `Radio` · `RadioGroup` · `Rating` · `Result` · `ScrollArea` · `SearchField` · `SegmentedControl` · `Select` · `Sidebar` · `Skeleton` · `Slider` · `Sortable` · `Spinner` · `Splitter` · `Stat` · `StatusIndicator` · `Steps` · `Switch` · `Tab` · `Tabs` · `Tag` · `TagInput` · `Terminal` · `TextField` · `Textarea` · `TimePicker` · `Timeline` · `Toast` · `ToastStack` · `Toggle` · `Toolbar` · `Tooltip` · `Tour` · `Transfer` · `Tree` · `TreeSelect` · `TreeTable` · `TypingIndicator` · `Watermark` · `useMessages`

## Mẫu

85 mẫu có hỗ trợ ngôn ngữ được khai báo rõ trong `templates/*/` (mỗi mẫu gồm `.dc.html` + bản runtime `support.js` giống hệt từng byte; xem `docs/template-schema-v2.md` về các vị trí nội dung nguồn có kiểu; chúng không tự động trở thành props khi chạy). **Chỉ dành cho soạn thảo có hỗ trợ DC / bản sao toàn bộ kho mã** — Stitch không được dùng `*.dc.html` làm nguồn chuẩn; hãy dùng kitchen-sink / `.cs-*` / ví dụ tĩnh.

## Liên kết

- [README.md](../../../README.md) — tài liệu đầu vào (giọng điệu, nền tảng, mục lục)
- [SKILL.md](../../../SKILL.md) — đầu vào cho tác tử: quy tắc bắt buộc và định hướng nhanh
- [llms.txt](../../../llms.txt) — đầu vào cho tác tử/công cụ, bản đồ sử dụng theo đối tượng và năng lực
- [docs/consuming.md](../../../docs/consuming.md) — áp dụng/nâng cấp và hai hướng có hỗ trợ DC hoặc tĩnh
- [docs/doctrine.md](../../../docs/doctrine.md) — quy tắc mở rộng, độ sâu kiểm chứng, các bất biến
- [docs/sync.md](../../../docs/sync.md) — đồng bộ hai chiều kho mã ↔ môi trường soạn thảo và nội dung tác tử không hỗ trợ DC có thể dùng
- [tokens/](../../../tokens/) — thuộc tính CSS tùy chỉnh + `tokens.json` / `tokens.js` (ESM) / `tokens.dtcg.json` (hồ sơ giá trị xuất DTCG 2025.10) / `native/` (SwiftUI · Compose · Flutter)
- [docs/quality-gates.md](../../../docs/quality-gates.md) — mọi cổng xác định, gồm `design-md-parity` đối chiếu tệp này với nguồn DTCG

