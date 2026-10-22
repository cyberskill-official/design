---
name: "CyberSkill Design System"
version: "1.7.2"
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
- **Bốn trục:** Chủ đề (sáng · tối · theo hệ thống) × Nguyên tố (Ngũ Hành — Kim · Mộc · Thủy · Hỏa · Thổ, 15 gói nguyên tố×biến thể) × Ngôn ngữ (EN · VI) × Phong cách (`data-cs-style` — chỉ có gói **liquid-glass**; không khai báo ≡ mặc định).
- **Phạm vi ngôn ngữ:** ưu tiên tiếng Việt; chuỗi của thành phần đã đăng ký phải có cặp EN + VI. Khả năng ngôn ngữ của từng mẫu được khai báo riêng; nội dung do bên dùng cung cấp cần được dịch và rà soát riêng. Giữ đầy đủ dấu; cặp ngôn ngữ được khai báo không chứng nhận chất lượng dịch hay cách phát âm của trình đọc màn hình.
- **Không đặt chữ trên sắc độ trung gian `-accent`:** dùng `-bright` hoặc `-tint`, hoặc kết hợp nền `-strong` với `--cs-accent-on-strong` cho văn bản nội dung. `-accent` dành cho thanh, đường viền, phần tô tiến trình và mảng màu lớn không chứa chữ.
- **Ngưỡng khả năng tiếp cận:** APCA Lc ≥ 75 cho văn bản nội dung · vùng chạm ≥ 44px · không loại bỏ vòng focus · tôn trọng `prefers-reduced-motion` / `prefers-contrast`.
- **Giọng điệu:** ấm áp · trực tiếp · trung thực · tôn trọng — luôn đủ cả bốn, không theo kiểu “vui nhộn/tinh nghịch/gây sốc”.

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
| `--cs-color-text-muted` | `#3F2D21` | `#E9D6C2` |
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

### Vai trò màu nhấn (Ngũ Hành)

Gói màu nhấn mặc định = Thổ (nguyên tố của studio). Toàn bộ 15 gói nguyên tố×biến thể và các gói tối suy ra theo APCA nằm trong `tokens/elements.css` và DTCG `$extensions["com.cyberskill"].overrides.elements` / `.elementsDark`.

| Token | Giá trị |
|---|---|
| `--cs-accent` | `#F4BA17` |
| `--cs-accent-strong` | `#916D10` |
| `--cs-accent-bright` | `#F4BA17` |
| `--cs-accent-on` | `#45210E` |
| `--cs-accent-tint` | `#FBF4E9` |
| `--cs-accent-ink` | `#45210E` |
| `--cs-accent-glow` | `rgba(244, 186, 23, 0.48)` |
| `--cs-accent-grad-a` | `#F4BA17` |
| `--cs-accent-grad-b` | `#F3B958` |
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
| `--cs-font-lineHeight-body` | `1.5` |
| `--cs-font-lineHeight-heading` | `1.35` |
| `--cs-font-lineHeight-tight` | `1.15` |
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
| `--cs-font-line-height-body` | `var(--cs-font-lineHeight-body)` |
| `--cs-font-line-height-heading` | `var(--cs-font-lineHeight-heading)` |
| `--cs-font-line-height-tight` | `var(--cs-font-lineHeight-tight)` |

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
| `data-cs-density="compact"` | `--cs-component-button-xs-paddingY` | `3px` |
| `data-cs-density="compact"` | `--cs-component-button-xs-padding-y` | `var(--cs-component-button-xs-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-xs-paddingX` | `8px` |
| `data-cs-density="compact"` | `--cs-component-button-xs-padding-x` | `var(--cs-component-button-xs-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-button-sm-paddingY` | `6px` |
| `data-cs-density="compact"` | `--cs-component-button-sm-padding-y` | `var(--cs-component-button-sm-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-sm-paddingX` | `12px` |
| `data-cs-density="compact"` | `--cs-component-button-sm-padding-x` | `var(--cs-component-button-sm-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-button-md-paddingY` | `10px` |
| `data-cs-density="compact"` | `--cs-component-button-md-padding-y` | `var(--cs-component-button-md-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-md-paddingX` | `16px` |
| `data-cs-density="compact"` | `--cs-component-button-md-padding-x` | `var(--cs-component-button-md-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-button-lg-paddingY` | `12px` |
| `data-cs-density="compact"` | `--cs-component-button-lg-padding-y` | `var(--cs-component-button-lg-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-lg-paddingX` | `22px` |
| `data-cs-density="compact"` | `--cs-component-button-lg-padding-x` | `var(--cs-component-button-lg-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-textfield-paddingY` | `8px` |
| `data-cs-density="compact"` | `--cs-component-textfield-padding-y` | `var(--cs-component-textfield-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-textfield-paddingX` | `10px` |
| `data-cs-density="compact"` | `--cs-component-textfield-padding-x` | `var(--cs-component-textfield-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-density-space-1` | `var(--cs-space-1)` |
| `data-cs-density="comfortable"` | `--cs-density-space-2` | `var(--cs-space-2)` |
| `data-cs-density="comfortable"` | `--cs-density-space-3` | `var(--cs-space-3)` |
| `data-cs-density="comfortable"` | `--cs-density-space-4` | `var(--cs-space-4)` |
| `data-cs-density="comfortable"` | `--cs-density-space-5` | `var(--cs-space-5)` |
| `data-cs-density="comfortable"` | `--cs-density-space-6` | `var(--cs-space-6)` |
| `data-cs-density="comfortable"` | `--cs-density-control-gap` | `var(--cs-component-button-gap)` |
| `data-cs-density="comfortable"` | `--cs-component-button-gap` | `8px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-paddingY` | `4px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-padding-y` | `var(--cs-component-button-xs-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-paddingX` | `10px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-padding-x` | `var(--cs-component-button-xs-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-paddingY` | `8px` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-padding-y` | `var(--cs-component-button-sm-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-paddingX` | `14px` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-padding-x` | `var(--cs-component-button-sm-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-paddingY` | `12px` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-padding-y` | `var(--cs-component-button-md-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-paddingX` | `20px` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-padding-x` | `var(--cs-component-button-md-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-paddingY` | `16px` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-padding-y` | `var(--cs-component-button-lg-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-paddingX` | `28px` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-padding-x` | `var(--cs-component-button-lg-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-paddingY` | `10px` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-padding-y` | `var(--cs-component-textfield-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-paddingX` | `12px` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-padding-x` | `var(--cs-component-textfield-paddingX)` |

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

## Độ nổi

Giá trị bóng là chuỗi CSS box-shadow nguyên gốc từ `$extensions["com.cyberskill"].css` (đối tượng DTCG có cấu trúc lưu cùng các lớp). Bảng có giá trị ghi đè cho chủ đề tối.

| Token | Sáng | Tối |
|---|---|---|
| `--cs-shadow-xs` | `0 1px 2px rgba(69, 33, 14, 0.06)` | `0 1px 2px rgba(0, 0, 0, 0.40)` |
| `--cs-shadow-sm` | `0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06)` | `0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42)` |
| `--cs-shadow-md` | `0 12px 30px rgba(31, 19, 11, 0.18)` | `0 12px 30px rgba(0, 0, 0, 0.50)` |
| `--cs-shadow-lg` | `0 20px 60px rgba(69, 33, 14, 0.18)` | `0 20px 60px rgba(0, 0, 0, 0.55)` |
| `--cs-shadow-xl` | `0 24px 80px rgba(31, 19, 11, 0.26)` | `0 24px 80px rgba(0, 0, 0, 0.62)` |

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
| `--cs-component-button-xs-paddingY` | `4px` | — |
| `--cs-component-button-xs-paddingX` | `10px` | — |
| `--cs-component-button-xs-minHeight` | `28px` | — |
| `--cs-component-button-xs-minWidth` | `28px` | — |
| `--cs-component-button-xs-minHeight-coarse` | `44px` | — |
| `--cs-component-button-sm-paddingY` | `8px` | — |
| `--cs-component-button-sm-paddingX` | `14px` | — |
| `--cs-component-button-sm-minHeight` | `36px` | — |
| `--cs-component-button-sm-minHeight-coarse` | `44px` | — |
| `--cs-component-button-md-paddingY` | `12px` | — |
| `--cs-component-button-md-paddingX` | `20px` | — |
| `--cs-component-button-md-minHeight` | `44px` | — |
| `--cs-component-button-md-minHeight-coarse` | `44px` | — |
| `--cs-component-button-lg-paddingY` | `16px` | — |
| `--cs-component-button-lg-paddingX` | `28px` | — |
| `--cs-component-button-lg-minHeight` | `52px` | — |
| `--cs-component-textfield-border-default` | `#BFA58F` | `#5a4636` |
| `--cs-component-textfield-paddingY` | `10px` | — |
| `--cs-component-textfield-paddingX` | `12px` | — |
| `--cs-component-textfield-minHeight` | `44px` | — |
| `--cs-focus-ring` | `3px` | — |
| `--cs-component-button-xs-padding-y` | `var(--cs-component-button-xs-paddingY)` | — |
| `--cs-component-button-xs-padding-x` | `var(--cs-component-button-xs-paddingX)` | — |
| `--cs-component-button-xs-min-height` | `var(--cs-component-button-xs-minHeight)` | — |
| `--cs-component-button-xs-min-width` | `var(--cs-component-button-xs-minWidth)` | — |
| `--cs-component-button-xs-min-height-coarse` | `var(--cs-component-button-xs-minHeight-coarse)` | — |
| `--cs-component-button-sm-padding-y` | `var(--cs-component-button-sm-paddingY)` | — |
| `--cs-component-button-sm-padding-x` | `var(--cs-component-button-sm-paddingX)` | — |
| `--cs-component-button-sm-min-height` | `var(--cs-component-button-sm-minHeight)` | — |
| `--cs-component-button-sm-min-height-coarse` | `var(--cs-component-button-sm-minHeight-coarse)` | — |
| `--cs-component-button-md-padding-y` | `var(--cs-component-button-md-paddingY)` | — |
| `--cs-component-button-md-padding-x` | `var(--cs-component-button-md-paddingX)` | — |
| `--cs-component-button-md-min-height` | `var(--cs-component-button-md-minHeight)` | — |
| `--cs-component-button-md-min-height-coarse` | `var(--cs-component-button-md-minHeight-coarse)` | — |
| `--cs-component-button-lg-padding-y` | `var(--cs-component-button-lg-paddingY)` | — |
| `--cs-component-button-lg-padding-x` | `var(--cs-component-button-lg-paddingX)` | — |
| `--cs-component-button-lg-min-height` | `var(--cs-component-button-lg-minHeight)` | — |
| `--cs-component-textfield-padding-y` | `var(--cs-component-textfield-paddingY)` | — |
| `--cs-component-textfield-padding-x` | `var(--cs-component-textfield-paddingX)` | — |
| `--cs-component-textfield-min-height` | `var(--cs-component-textfield-minHeight)` | — |

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

