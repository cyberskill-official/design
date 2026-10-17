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
- **Docs/** tài liệu operator đã xuất bản — **Start / Guides / Maintainers**, MDX curated, một story sidebar mỗi trang markdown trong danh mục công khai, và iframe Thư viện tài liệu `/docs/viewer.html` (EN·VI). Prose canonical vẫn `docs/*.md`. **Release Notes/** prose curated (**không CHANGELOG.md**); **Status/** embed `_audit/run.html` full-bleed
- **Templates/** điểm bắt đầu công khai — Gallery (tier Templates của Atomic View + kitchen-sink/playground) và mọi template manifest theo category Atomic View (gồm **HR** / `vn-*`). Regen CSF bằng `node scripts/generate-template-stories.mjs` sau khi đổi tên template
- **Pages/** UI kit công khai (Status Hub, Marketing site, Slide deck)
- **Maintainer/** story cho HTML portable (Motion, mirror kit, demo template, AI cluster, RTL; Atomic View cho gates)
- Cùng `styles.css` production
- Addon: `@storybook/addon-docs` + `@storybook/addon-a11y`

Thư viện tài liệu dùng bộ chọn EN/VI riêng. UI mới mặc định tiếng Việt; lựa chọn tiếng Anh đã lưu được giữ khi local storage khả dụng. Vẫn duyệt và đổi ngôn ngữ được khi không thể lưu tùy chọn. UI, phản hồi tải/tìm kiếm/lỗi và trạng thái nút đã chọn theo lựa chọn đó. Trang Markdown/llms đầu vào vẫn tiếng Anh, có metadata tiếng Anh cho nội dung và trích đoạn; guide chọn nguồn EN hoặc VI. Kiểm tra markup/hành vi không xác nhận chất lượng bản dịch hay lời đọc của screen reader.

Khi pointer là coarse, Thư viện tài liệu đặt target tối thiểu 44px cho nút ngôn ngữ, ô tìm kiếm, liên kết điều hướng/kết quả và liên kết trong bài. Test touch duyệt mọi route EN/VI đã khai báo tại 320/390/1280px, cả hai theme và density; kiểm tra hình học sau clipping, quyền nhận hit ở vùng DOM phía trong, target của sự kiện native và điều hướng bàn phím. Control của pointer fine giữ kích thước cũ. Kiểm tra này không xác nhận toàn bộ vùng biên liên tục, hiệu chỉnh touch của OS, đích liên kết bên ngoài hay nghiệm thu accessibility của con người.

## Config

- `.storybook/main.js` — ESM Storybook 10, Vite + alias `@cs` → `components/`, **`base: '/'`**
- `.storybook/manager-head.html` — meta OG / canonical cho `/` production
- `.storybook/preview.jsx` — thứ tự `storySort`: Docs · Foundations · Components · **Templates** · **Pages** · A11y · I18n · Release Notes · Status · Maintainer
- Autodocs qua `tags: ['autodocs']` trên CSF meta

## Consumer vẫn dùng (không đổi)

| Đối tượng | Tiêu thụ |
|---|---|
| Static / mọi framework | `styles.css` + `.cs-*` |
| React browser legacy (không build) | `styles.css` + `_ds_bundle.js` |
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

## Độ mới của bản build

Chạy `npm run build:storybook`, sau đó `node _audit/ci/test-storybook-freshness.mjs --require`. Wrapper băm đầu vào trước và sau khi build thành công; nếu nguồn thay đổi trong lúc build thì không ghi dấu xác nhận. `scripts/storybook-inputs.mjs` cung cấp chung danh sách file gốc và thư mục tĩnh cho Storybook và bộ kiểm tra. Phạm vi gồm component, story, cấu hình, style/token, tài liệu, template, font, tài sản nhị phân/ẩn, thư viện vendored, package lock, script build và phiên bản Node/OS/kiến trúc. Hash đầu ra phát hiện file bị thiếu hoặc thay đổi; đây là bằng chứng toàn vẹn, không phải kết luận về hình ảnh hoặc khả năng tiếp cận.

Thay đổi nguồn/toolchain, dấu cũ hoặc đầu ra bị sửa đều yêu cầu build lại. Không cho phép chỉ ghi lại dấu cho bản build cũ. Khi chưa có build, kiểm tra cục bộ trả SKIP; với `--require` thì thất bại. Thiếu đầu vào đã khai báo hoặc có symbolic link cũng thất bại. Bộ kiểm thử hồi quy dùng fixture tạm để kiểm tra sửa/thêm/xóa đầu vào, sửa đầu ra và thay đổi nguồn trong lúc build.

Chạy kiểm tra trước bản build cuối nếu quá trình đó tạo lại báo cáo audit được sao chép vào site; thay đổi byte của báo cáo cũng làm bản build mất hiệu lực xác nhận độ mới.

## Danh sách tệp hosting công khai

`scripts/public-site-policy.json` liệt kê từng tệp nguồn được công khai cùng đối tượng đọc và mục đích. Storybook đưa các tệp này vào `.storybook-public/`; thêm tệp vào thư mục sẵn có không tự động công khai tệp đó. Xem xét và thêm rõ các tài nguyên phụ thuộc. Khởi động lại dev server sau khi đổi policy; thay đổi tệp đã có trong danh sách được theo dõi. Trang chỉ mục sinh tự động giúp duyệt thư mục nguồn trên static host.

`npm run build:site` build Storybook, kiểm tra freshness của nguồn/đầu ra rồi chỉ đóng gói đầu ra đã phân loại vào `.vercel-static/`. `public-site-manifest.json` ghi đối tượng, mục đích, kích thước byte và SHA-256 của mọi tệp trừ chính manifest. Đầu ra chưa phân loại, nguồn bắt buộc bị thiếu và symlink đều làm kiểm tra thất bại. Workflow, hồ sơ tác vụ/audit/revision, lockfile và script bảo trì riêng không được đưa vào. Quyết định locale/theme công khai vẫn là tài liệu liên kết; việc có trong danh sách không chứng minh giấy phép hay human acceptance.

Sau khi cài Playwright Chromium, chạy `npm run test:public-site`. Kiểm tra chỉ serve thư mục đóng gói, đối chiếu toàn bộ manifest và byte, xác nhận URL riêng trả 404, Storybook shell và mười browser gate tài liệu, consumer, accessibility, hành vi, QR và template-schema, cùng render trang visual-review, với header deployment đã cấu hình. CI bắt buộc chạy kiểm tra này. Unit policy test xác nhận tệp ngoài danh sách không vào staging. Các kiểm tra này không chứng nhận deployment và không thay thế gate visual/accessibility đầy đủ.
