# Storybook — bề mặt sản phẩm tại `/` (host)

Storybook **10** là **site sản phẩm** cho operator trên `design.cyberskill.world` (`/`). Vẫn **không** thuộc hợp đồng consumer portable. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## URL

| Ngữ cảnh | Path |
|---|---|
| Production | `https://design.cyberskill.world/` |
| Site đóng gói local | `/` sau `npm run build:site` (serve `.vercel-static/`) |
| Dev local | `npm run storybook` → http://localhost:6006 |
| Legacy | `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` → `/` |

## Nội dung

- CSF component đầy đủ với **Default + ma trận điều khiển sâu** (`Matrix` / `AllVariants`)
- **CSF bar (exhaustive khi có trục):**
  - `AllSizes` khi có `argTypes.size`
  - `States` (hoặc subsection Matrix) cho `disabled` / `loading` / `error` / `busy` khi có argTypes
  - Mọi option enum `size` / `variant` gắn trong story họ matrix
  - `FullMatrix` khi ≥1 trong {size enums, variant enums, state keys} — tích size × variant × key-state qua helper `stories/lib/matrix.jsx`
- Toolbar globals: Theme (light · dark · **system**) × Element × Language × Style (cùng trục với templates / Atomic View). Element liệt kê **đủ 15** pack Ngũ Hành. Style chỉ có **liquid-glass**.
- **Docs/** tài liệu operator đã xuất bản — **Start / Guides / Maintainers**, MDX curated, một story sidebar mỗi trang markdown tracked, và iframe Thư viện tài liệu `/docs/viewer.html` (EN·VI). Prose canonical vẫn `docs/*.md`. **Release Notes/** prose curated (**không CHANGELOG.md**); **Status/** embed `_audit/run.html` full-bleed
- **Templates/** điểm bắt đầu công khai — Gallery (tier Templates của Atomic View + kitchen-sink/playground) và mọi template manifest theo category Atomic View (gồm **HR** / `vn-*`). Regen CSF bằng `node scripts/generate-template-stories.mjs` sau khi đổi tên template
- **Pages/** UI kit công khai (Status Hub, Marketing site, Slide deck)
- **Maintainer/** story cho HTML portable (Motion, mirror kit, demo template, AI cluster, RTL; Atomic View cho gates)
- Cùng `styles.css` production
- Addon: `@storybook/addon-docs` + `@storybook/addon-a11y`

## Config

- `.storybook/main.js` — ESM Storybook 10, Vite + alias `@cs` → `components/`, **`base: '/'`**
- `.storybook/manager-head.html` — meta OG / canonical cho `/` production
- `.storybook/preview.jsx` — thứ tự `storySort`: Docs · Foundations · Components · **Templates** · **Pages** · A11y · I18n · Release Notes · Status · Maintainer
- Autodocs qua `tags: ['autodocs']` trên CSF meta

## Consumer vẫn dùng (không đổi)

| Đối tượng | Tiêu thụ |
|---|---|
| Static / mọi framework | `styles.css` + `.cs-*` |
| React production | `styles.css` + `_ds_bundle.js` |
| ESM (bundler) | `_esm/react.mjs` |
| ESM (browser legacy) | `_esm/cs.mjs` |
| Tokens | `tokens/*` |
| Authoring DC | `templates/**/*.dc.html` |

## Lệnh

```bash
npm install
npm run storybook
npm run build:storybook
npm run build:site
npm run test:storybook-contract
node scripts/generate-template-stories.mjs
```

## Bản đồ

Templates/Pages công khai và iframe Maintainer nằm trong `docs/live-hub.md`. Map Word gốc HR Suite: `docs/hr-suite-sources.md`. Status embed `_audit/run.html`.
