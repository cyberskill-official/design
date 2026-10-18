# Deploy site Atomic live (Vercel / VPS / mọi static host)

Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

Hai track:

1. **Design system portable (consumers)** — consumer HTML có thể link `styles.css` đã review và `_ds_bundle.js` tùy chọn, hoặc dùng entry legacy cho trình duyệt `_esm/cs.mjs`, mà không cần bundler. Import npm mặc định (`_esm/react.mjs`) dùng React peer và JSX nguồn; app React cần công cụ build tương thích. Storybook là công cụ của host. Payload npm portable theo `package.json` → `files`; hosting public dùng allowlist đã review trong `scripts/public-site-policy.json`.
2. **Host site (`design.cyberskill.world`)** — output tĩnh đóng gói cho Vercel. Packaging **có** chạy Node một lần lúc deploy để Storybook ship làm bề mặt sản phẩm tại `/`. Vẫn không có app server chạy dài.

Production **`/`** là build tĩnh Storybook. Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, và `/playground/:path*` redirect về `/`.

## Vercel (khuyến nghị)

1. Push repo (xem `docs/sync.md`) lên GitHub.
2. Vercel → **Add New Project** → import repo.
3. **Framework preset: "Other"** (không Next.js/CRA). Ưu tiên tin `vercel.json` hơn là gõ lệnh trên dashboard.
4. Deploy. `/` phục vụ Storybook. URL hub/playground cũ 301 về `/`.
5. Custom domain: Project → Settings → Domains, thêm domain, trỏ DNS theo hướng dẫn Vercel.

**`vercel.json` khóa đường đóng gói host:**

| Field | Value | Why |
|---|---|---|
| `framework` | `null` | Không auto-detect framework |
| `installCommand` | `npm install` | Chỉ-host: cài Storybook/dev tooling cho build sản phẩm tĩnh |
| `buildCommand` | `npm run build:site` | `build:storybook` rồi `scripts/vercel-static-output.mjs` |
| `outputDirectory` | `.vercel-static` | Webroot đóng gói (cây portable + Storybook overlay ở root) |
| `redirects` | `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` → `/` | Nghỉ hub HTML cũ và path Storybook subdirectory |

Review local: `npm install && npm run build:site`, rồi serve `.vercel-static/`. Đóng gói local không phải phê duyệt phân phối.

Consumer clone repo vẫn mở file trực tiếp — họ **không** chạy `build:site`.

## Ảnh social preview (OG)

Ship cho production (`design.cyberskill.world`):
- Head manager Storybook (`.storybook/manager-head.html`) và stub redirect `dashboard.html` gồm:
  - `og:image` → `https://design.cyberskill.world/assets/og-dashboard.png`
  - `twitter:card` = `summary_large_image`
  - `twitter:image` (cùng URL)
  - `og:url` / canonical → `https://design.cyberskill.world/`

Nếu host dưới **domain khác**, đổi absolute URL trong các meta tag cho khớp origin, hoặc re-export PNG và giữ path `assets/og-dashboard.png`.

**Misconfig thường gặp:** chọn preset JS framework (Next/CRA) — Vercel chạy đồ thị build sai và có thể 404 root docs. Preset phải giữ **"Other"** và `vercel.json` phải sở hữu install/build/output (xem bảng trên). `package.json` có thể publish (`"private": false`) cho đường npm; nó cũng mang script **chỉ-host** (`build:storybook`, `build:site`, verify/test) mà product app không nên phụ thuộc (xem `docs/consuming.md` và `docs/storybook.md`). Packaging kiểm tra Storybook build mới từ danh sách tệp tại `scripts/public-site-policy.json`, rồi ghi `.vercel-static/` cùng manifest đối tượng/hash từng tệp. Path portable có trong danh sách như `/styles.css`, audit gate và guidelines vẫn cạnh asset Storybook; hồ sơ tác vụ/lịch sử/revision và script bảo trì nội bộ bị loại. Chạy `npm run test:public-site` với đầu ra đóng gói trước khi triển khai. **Các trang audit trong danh sách cố ý giữ public** — Storybook Status nhúng `_audit/run.html` full-bleed; gỡ đi sẽ phá surface sản phẩm. **Phân biệt misconfig hosting với bug docs thật:** mở `/_audit/docs-consistency.html` trên URL *đã deploy* — gate phát hiện body HTML/error nơi lẽ ra là raw `.md`/`.json` và báo "hosting is intercepting this path".

## VPS generic / nginx / mọi static host

**Không Storybook:** sau review nguồn gốc và phê duyệt triển khai rõ ràng, serve danh sách portable đã duyệt làm webroot.

**Có Storybook tại `/`:** chạy `npm run build:site` trên host hoặc CI trước khi hosting được phê duyệt, rồi serve `.vercel-static/` làm webroot. Cấu hình cùng redirect như `vercel.json` (`/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` → `/`) nếu host hỗ trợ.

Ví dụ Nginx (`.vercel-static` làm `root`) — **cùng security headers với `vercel.json`** (FIND-019):
```nginx
server {
  server_name design.cyberskill.world;
  root /var/www/design-system/.vercel-static;
  index index.html;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self'" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  location = /dashboard { return 301 /; }
  location = /dashboard/ { return 301 /; }
  location = /dashboard.html { return 301 /; }
  location ^~ /dashboard/ { return 301 /; }
  location = /playground { return 301 /; }
  location /playground/ { return 301 /; }
}
```
Path portable vẫn là file thật (`guidelines/atomic-view.html`, `_audit/run.html`, `styles.css`, v.v.). Storybook sở hữu `/` và `/index.html`.

**Netlify / Cloudflare Pages / tương tự:** file `_headers` ở root mirror cùng ba header cho host đọc `_headers` kiểu Netlify. Giữ khớp `vercel.json`.

## Checklist sau deploy
1. Mở `/` — xác nhận Storybook load (không 404, directory listing, hay shell dashboard cũ).
2. Mở `/_audit/run.html` — để board chạy xong, xác nhận mọi fast gate pass trên bản *đã deploy* (CDN cache, MIME type, hoặc file thiếu có thể lộ ở đây dù check local sạch).
3. Nếu có đỏ, đọc hàng gate fail và mở trang gate đó để chi tiết — xem `docs/consuming.md` → "After import — run the checks."
4. Kiểm `/guidelines/atomic-view.html` load trực tiếp (trang nặng nhất — React + compiled bundle qua mạng).
5. Xác nhận `/dashboard.html` và `/playground/` redirect về `/`, và một story vẫn render (ví dụ Components/Button).

## Việc KHÔNG làm
- Dùng đúng đường thiết lập consumer: HTML tĩnh link CSS đã review và browser bundle tùy chọn; consumer React theo thiết lập build và transpilation trong `docs/consuming.md`. Host-site packaging (`build:site`) chuẩn bị shell Storybook tại `/` và layout host tĩnh.
- Đừng đổi Vercel framework preset khỏi "Other" / `framework: null`.
- Giữ các file nguồn cần thiết trong Git, **kể cả đường dẫn có tiền tố underscore như `_esm/`**; đừng thêm rule ignore để che thay đổi nguồn. Theo dõi trong Git không cấp quyền xuất bản: nội dung npm theo `package.json` → `files`, còn hosting public theo `scripts/public-site-policy.json`. Xem `docs/sync.md`.
- Đừng đặt Storybook dưới `/playground/` nữa — `base: '/'` trong `.storybook/main.js` kỳ vọng asset tại domain root.


## Protocol re-run Health sau deploy (release gate)

Sau mỗi deploy production:
1. Mở `docs/viewer.html#README.md` — body không được kẹt ở Loading…
2. `curl -sS https://<host>/VERSION` phải trả plain semver text, không HTML.
3. `curl -sS -I https://<host>/package.json` phải là `application/json` hoặc `text/plain`, không SPA shell.


## Ghi chú Content-Security-Policy

CSP chuẩn nằm trong `vercel.json` và được mirror ở `_headers` + snippet nginx ở trên (FIND-015 / FIND-019). Policy hiện tại:

`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self'`

Lý do:
- **Đã bỏ `unsafe-eval`** — React vendored local; Storybook static không cần `eval` toàn site.
- **Đã bỏ CDN script/connect** (`unpkg.com`, `cdnjs.cloudflare.com`) — local-first React / `_ds_bundle.js`.
- **Giữ `unsafe-inline`** — shell Storybook vẫn emit inline script/style; migrate nonce/hash là follow-on.
- Ưu tiên self-host React cạnh `_ds_bundle.js` cho cài air-gapped.
- Header thật trên production đã xác nhận qua `curl -sSI https://design.cyberskill.world/`.

## OG đa domain

Meta production trỏ `https://design.cyberskill.world/assets/og-dashboard.png`. Trên host khác, chỉ thay absolute origin trong `.storybook/manager-head.html` (và stub `dashboard.html`) `og:image` / `twitter:image` / `og:url` — giữ path `/assets/og-dashboard.png`.

## Bề mặt sản phẩm Storybook (chỉ-host)

Path production: **`/`** (Storybook static export overlay trên `.vercel-static/`).

| Lệnh | Kết quả |
|---|---|
| `npm run storybook` | Dev server (chỉ local) |
| `npm run build:storybook` | Ghi `storybook-static/` với `base: '/'` |
| `npm run build:site` | Build Storybook + cây portable → `.vercel-static/` (Storybook ở root) |

Xem `docs/storybook.md`. Consumer portable không cần đường này — họ dùng `styles.css` + `_ds_bundle.js` / ESM.
