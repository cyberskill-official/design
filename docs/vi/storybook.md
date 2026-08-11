# Storybook — bề mặt sản phẩm tại `/` (host)

Storybook **10** là **site sản phẩm** cho operator trên `design.cyberskill.world` (`/`). Nó vẫn **không** thuộc hợp đồng consumer portable. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## URL

| Ngữ cảnh | Path |
|---|---|
| Production | `https://design.cyberskill.world/` |
| Site đóng gói local | `/` sau `npm run build:site` (serve `.vercel-static/`) |
| Dev local | `npm run storybook` → http://localhost:6006 |
| Legacy | `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` → `/` |

## Nội dung

- CSF component đầy đủ với **Default + ma trận điều khiển sâu** (`Matrix` / `AllVariants`)
- **CSF bar (exhaustive khi các trục tồn tại):**
  - `AllSizes` khi `argTypes.size` tồn tại (token ramp hoặc size số đại diện)
  - `States` (hoặc subsection Matrix) phủ `disabled` / `loading` / `error` / `busy` khi các argTypes đó tồn tại
  - Mọi option enum `size` / `variant` rời rạc được mount trong story họ matrix
  - `FullMatrix` khi ≥1 trong {size enums, variant enums, state keys} tồn tại — tích size × variant × key-state qua helper chung `stories/lib/matrix.jsx`
- Toolbar globals: Theme (light · dark · **system**) × Element × Language × Style (cùng trục với template / Atomic View). Element liệt kê **đủ 15** pack Ngũ Hành (`tokens.elements` / EL map template / Storybook toolbar) — không phải tập con. Pack Style duy nhất là **liquid-glass**.
- **Docs/** tài liệu operator đã xuất bản — lồng **Start / Guides / Maintainers**, MDX curated cho trang traffic cao, một story sidebar mỗi trang markdown tracked, và iframe Thư viện tài liệu `/docs/viewer.html` (EN·VI). Prose chuẩn vẫn là `docs/*.md`; Storybook là bề mặt đọc sống. **Release Notes/** prose sản phẩm curated (**không CHANGELOG.md**); **Status/** nhúng `_audit/run.html` full-bleed
- Story **Maintainer/** cho bề mặt HTML portable (Motion, templates, kitchen-sink, AI cluster, RTL; Atomic View chôn cho gates)
- Cùng `styles.css` như production
- Addon: `@storybook/addon-docs` + `@storybook/addon-a11y` (essentials gộp vào core ở SB10)

## Config

- `.storybook/main.js` — config Storybook 10 ESM, Vite + alias `@cs` → `components/`, **`base: '/'`** cho asset tại domain root
- `.storybook/manager-head.html` — meta OG / canonical cho bề mặt production `/`
- Autodocs qua `tags: ['autodocs']` trên CSF meta (không `docs.autodocs` trong main)

## Consumer vẫn dùng (không đổi)

| Audience | Consume |
|---|---|
| Static / bất kỳ framework | `styles.css` + `.cs-*` |
| React production | `styles.css` + `_ds_bundle.js` |
| ESM (bundler) | `_esm/react.mjs` (mặc định / `@cyberskill/design/react`) |
| ESM (browser legacy) | `_esm/cs.mjs` (`@cyberskill/design/legacy`) |
| Tokens | `tokens/*` |
| DC-capable authoring | `templates/**/*.dc.html` |

## Lệnh

```bash
npm install
npm run storybook
npm run build:storybook    # → storybook-static/ (base `/`)
npm run build:site         # đóng gói Storybook tại root .vercel-static/
npm run test:storybook-contract
```

## Bản đồ

Bề mặt HTML portable iframe từ Maintainer/* được liệt kê trong `docs/live-hub.md`. Status nhúng `_audit/run.html` (auto-run lần đầu; **Re-run** khi cần).
