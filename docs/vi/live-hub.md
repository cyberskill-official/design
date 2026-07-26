# Live hub = Storybook

## Quyết định

**Storybook là live interactive hub duy nhất** cho operator trên `design.cyberskill.world`. Không có trang Live View riêng và không còn shell dashboard HTML làm sản phẩm. Production **`/`** là Storybook.

## Sidebar IA

| Nhóm | Vai trò |
|---|---|
| **Docs** | Hướng dẫn MDX công khai (consuming, deploy, conventions, styles, products, schema, Figma, contrast, voice, axes) |
| **Foundations** | Colors, typography, spacing, elevation, motion, elements |
| **Components** | Thư viện CSF đầy đủ |
| **Release Notes** | Prose sản phẩm curated (**không CHANGELOG.md**) |
| **Status** | Nhúng full-bleed `_audit/run.html` (auto-run lần đầu; **Re-run** khi cần) |
| **A11y / I18n** | Specimen a11y + song ngữ |
| **Maintainer** | Iframe HTML portable cho gates (Atomic View chôn ở đây — không phải entry công khai top-level) |

## Bề mặt

| Bề mặt | Vai trò |
|---|---|
| **Storybook** (`/`) | Bề mặt sản phẩm host: toolbar Theme × Element × Language × Style, Docs/Foundations/Components/Release Notes/Status, và Maintainer/* iframe vào HTML portable |
| **Atomic View** (`guidelines/atomic-view.html`) | Lưới component zero-build portable cho gates và duyệt clone-and-open — không phải entry sản phẩm công khai |
| **Guidelines / templates khác** | Specimen portable; mở từ Storybook Maintainer/* khi khám phá Motion, Identity Lab, index Status Hub / Website / Deck, kitchen-sink, v.v. |
| **Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*`** | Redirect về `/` (stub + redirect Vercel) |

## Bản đồ bề mặt (story Maintainer/*)

| Storybook entry | Portable HTML |
|---|---|
| Components/* CSF | Nguồn React dưới `components/` |
| Maintainer/Surfaces → Motion | `guidelines/motion.html` |
| Maintainer/Surfaces → Identity Lab | `ui_kits/status-hub/identity-lab.html` |
| Maintainer/Surfaces → Status Hub | `ui_kits/status-hub/index.html` |
| Maintainer/Surfaces → Website | `ui_kits/website/index.html` |
| Maintainer/Surfaces → Deck | `ui_kits/deck/index.html` |
| Maintainer/Surfaces → Template Playground | `templates/playground.html` |
| Maintainer/Surfaces → Kitchen Sink | `templates/kitchen-sink.html` |
| Maintainer/Surfaces → Image Slots | `templates/image-slots-demo.html` |
| Maintainer/Surfaces → AI Cluster | `templates/ai-cluster-demo.html` |
| Maintainer/Surfaces → RTL | `guidelines/rtl-preview.html` |
| Maintainer/Surfaces → Atomic View (gates) | `guidelines/atomic-view.html` |
| Status/Gate board | `_audit/run.html` |

## Hành vi Status

- Mở Status load `_audit/run.html`, **auto-run** bảng gate nhanh một lần.
- Storybook có thể giữ iframe cache khi điều hướng đi rồi về — **không** tự chạy lại im lặng.
- Dùng nút **Re-run** trên board để chạy lại (mỗi gate iframe được cache-bust).

## Consumer portable (không đổi)

Consumer vẫn link `styles.css` / `_ds_bundle.js` / ESM / templates. **Không** yêu cầu Storybook trong product app. Xem `docs/consuming.md`.

## Local

```bash
npm run storybook          # Storybook sản phẩm tại http://localhost:6006
npm run build:site         # đóng gói Storybook tại .vercel-static/ (root `/`)
```
