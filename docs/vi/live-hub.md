# Live hub = Storybook

Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Quyết định

**Storybook là live hub tương tác duy nhất** cho operator trên `design.cyberskill.world`. Không có trang Live View riêng và không có shell dashboard HTML sản phẩm riêng. Production **`/`** là Storybook.

## Sidebar IA

Thứ tự duyệt atomic trên site sản phẩm: **Foundations → Components → Templates → Pages** (Atoms / Molecules / Organisms nằm trong Atomic View và CSF Components; Templates và Pages là nhóm sidebar hạng nhất).

| Nhóm | Vai trò |
|---|---|
| **Docs** | Docs operator đã xuất bản: **Start** (Introduction, README, SKILL, Contributing, llms, Library) · **Guides** (consuming, grant, deploy, schema, conventions, styles, products, Figma, contrast, storybook, live-hub, nguồn HR Suite, runbook phát hành, benchmark, …) · **Maintainers** (học thuyết, decisions, CI/CD, quality gates, sync). MDX curated cộng một mục sidebar mỗi trang tracked. EN·VI qua Thư viện tài liệu (`/docs/viewer.html`) |
| **Foundations** | Màu, chữ, spacing, elevation, motion, elements |
| **Components** | Thư viện CSF đầy đủ |
| **Templates** | Điểm bắt đầu công khai: **Gallery** (Atomic View → tier Templates, kitchen-sink, playground) cộng mọi template `_ds_manifest.json` nhóm như Atomic View (Product · Board · … · **HR** Suite · Documents). Gồm cả 38 instrument `vn-*` A4 (Employment Suite + hợp đồng nguyên tắc thương mại) |
| **Pages** | UI kit — Status Hub, Marketing site, Slide deck |
| **Release Notes** | Prose sản phẩm curated (**không CHANGELOG.md**) |
| **Status** | Embed full-bleed `_audit/run.html` (tự chạy lần đầu; **Re-run** khi cần) |
| **A11y / I18n** | Specimen a11y + song ngữ |
| **Maintainer** | Iframe HTML portable cho gates và demo (Motion, mirror kit, demo template, RTL, Atomic View cho gates) |

## Bề mặt

| Bề mặt | Vai trò |
|---|---|
| **Storybook** (`/`) | Bề mặt sản phẩm host: toolbar Theme × Element × Language × Style, Docs/Foundations/Components/**Templates**/**Pages**/Release Notes/Status, và Maintainer/* iframe vào HTML portable |
| **Atomic View** (`guidelines/atomic-view.html`) | Trình duyệt atomic zero-build portable (Atoms → Molecules → Organisms → Templates → Pages). Công khai qua **Templates → Gallery → Atomic gallery**; cũng dưới Maintainer cho gates / clone-and-open |
| **Guidelines / templates khác** | Specimen portable; mở từ Storybook Templates/*, Pages/*, hoặc Maintainer/* |
| **Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*`** | Redirect về `/` (stub + Vercel redirects) |

## Bản đồ bề mặt (công khai + Maintainer)

| Entry Storybook | HTML portable |
|---|---|
| Components/* CSF | Nguồn React dưới `components/` |
| Templates/Gallery → Atomic gallery | `guidelines/atomic-view.html#tier-templates` |
| Templates/{Category}/* | `templates/**/*.dc.html` qua `_ds_manifest.json` (regen: `node scripts/generate-template-stories.mjs`) |
| Pages → Status Hub / Marketing site / Slide deck | `ui_kits/status-hub|website|deck/index.html` |
| Maintainer/Surfaces → Motion | `guidelines/motion.html` |
| Maintainer/Surfaces → Status Hub / Website / Deck | cùng UI kit (mirror maintainer) |
| Maintainer/Surfaces → Template Playground | `templates/playground.html` |
| Maintainer/Surfaces → Kitchen Sink | `templates/kitchen-sink.html` |
| Maintainer/Surfaces → Image Slots | `templates/image-slots-demo.html` |
| Maintainer/Surfaces → AI Cluster | `templates/ai-cluster-demo.html` |
| Maintainer/Surfaces → RTL | `guidelines/rtl-preview.html` |
| Maintainer/Surfaces → Atomic View (gates) | `guidelines/atomic-view.html` |
| Status/Gate board | `_audit/run.html` |

## Hành vi Status

- Mở Status tải `_audit/run.html`, **tự chạy** board nhanh một lần.
- Storybook có thể giữ iframe cache khi điều hướng đi rồi về — **không** tự chạy lại gates.
- Dùng nút **Re-run** trên board để pass mới (mỗi iframe gate được cache-bust).

## Consumer portable (không đổi)

Consumer vẫn link `styles.css` / `_ds_bundle.js` / ESM / templates. **Không** yêu cầu Storybook trong product app. Xem `docs/consuming.md`.

## Local

```bash
npm run storybook          # Storybook sản phẩm tại http://localhost:6006
npm run build:site         # đóng gói Storybook tại .vercel-static/ (root `/`)
```

Mở **Templates → Gallery → Atomic gallery** hoặc **Templates → HR → …** cho Employment Suite.
