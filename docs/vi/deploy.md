# Deploy site Atomic live (Vercel / VPS / mọi static host)

Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

Hai track:

1. **Design system portable (consumers)** — consumer HTML có thể link `styles.css` đã review và `_ds_bundle.js` tùy chọn, hoặc dùng entry legacy cho trình duyệt `_esm/cs.mjs`, mà không cần bundler. Import npm mặc định (`dist/esm/_esm/react.mjs`) là ESM đã biên dịch với React peer; app React cần bộ phân giải module tương thích. JSX nguồn vẫn có qua export nguồn tường minh. Storybook là công cụ của host. Payload npm portable theo `package.json` → `files`; hosting public dùng allowlist đã review trong `scripts/public-site-policy.json`.
2. **Host site (`design.cyberskill.world`)** — output tĩnh đóng gói cho Vercel. Packaging **có** chạy Node một lần lúc deploy để Storybook ship làm bề mặt sản phẩm tại `/`. Vẫn không có app server chạy dài.

Production **`/`** là build tĩnh Storybook. Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, và `/playground/:path*` redirect về `/`.

## Vercel (khuyến nghị)

1. Push repo (xem `docs/sync.md`) lên GitHub.
2. Vercel → **Add New Project** → import repo.
3. **Framework preset: "Other"** (không Next.js/CRA). Ưu tiên tin `vercel.json` hơn là gõ lệnh trên dashboard.
4. Deploy. `/` phục vụ Storybook. URL hub/playground cũ 308 về `/`.
5. Custom domain: Project → Settings → Domains, thêm domain, trỏ DNS theo hướng dẫn Vercel.

**`vercel.json` khóa đường đóng gói host:**

| Field | Value | Why |
|---|---|---|
| `framework` | `null` | Không auto-detect framework |
| `installCommand` | `npm ci` | Chỉ-host: cài Storybook/dev tooling cho build sản phẩm tĩnh |
| `buildCommand` | `npm run build:site` | `build:storybook` rồi `scripts/vercel-static-output.mjs` |
| Build Output API | `.vercel/output/static` + `config.json` | Byte tĩnh cuối cùng và CSP riêng cho từng HTML, sinh sau khi có Storybook |
| Nguồn routing | `scripts/site-deployment-policy.json` → `.vercel/output/config.json` | Redirect legacy trước; alias HTML dùng CSP đúng byte cuối cùng |

Review local: `npm ci && npm run build:site`, rồi chạy `node _audit/ci/test-site-csp-browser.mjs` với policy đã sinh. `.vercel-static/` vẫn là bản mirror portable; file server thông thường không tự áp dụng CSP manifest. Đóng gói/kiểm thử local không phải phê duyệt triển khai hoặc phân phối.

Consumer clone repo vẫn mở file trực tiếp — họ **không** chạy `build:site`.

## Ảnh social preview (OG)

Ship cho production (`design.cyberskill.world`):
- Head manager Storybook (`.storybook/manager-head.html`) và stub redirect `dashboard.html` gồm:
  - `og:image` → `https://design.cyberskill.world/assets/og-dashboard.png`
  - `twitter:card` = `summary_large_image`
  - `twitter:image` (cùng URL)
  - `og:url` / canonical → `https://design.cyberskill.world/`

Nếu host dưới **domain khác**, đổi absolute URL trong các meta tag cho khớp origin, hoặc re-export PNG và giữ path `assets/og-dashboard.png`.

**Misconfig thường gặp:** chọn preset JS framework (Next/CRA) — Vercel chạy đồ thị build sai và có thể 404 root docs. Preset phải giữ **"Other"** và `vercel.json` sở hữu install/build; Build Output API đã sinh sở hữu route và header cuối cùng (xem bảng trên). `package.json` có thể publish (`"private": false`) cho đường npm; nó cũng mang script **chỉ-host** (`build:storybook`, `build:site`, verify/test) mà product app không nên phụ thuộc (xem `docs/consuming.md` và `docs/storybook.md`). Packaging kiểm tra Storybook build mới từ danh sách tệp tại `scripts/public-site-policy.json`, rồi ghi `.vercel-static/` cùng manifest đối tượng/hash từng tệp. Path portable có trong danh sách như `/styles.css`, audit gate và guidelines vẫn cạnh asset Storybook; hồ sơ tác vụ/lịch sử/revision và script bảo trì nội bộ bị loại. Chạy `npm run test:public-site` với đầu ra đóng gói trước khi triển khai. **Các trang audit trong danh sách cố ý giữ public** — Storybook Status nhúng `_audit/run.html` full-bleed; gỡ đi sẽ phá surface sản phẩm. **Phân biệt misconfig hosting với bug docs thật:** mở `/_audit/docs-consistency.html` trên URL *đã deploy* — gate phát hiện body HTML/error nơi lẽ ra là raw `.md`/`.json` và báo "hosting is intercepting this path".

## VPS generic / nginx / mọi static host

**Không Storybook:** sau review nguồn gốc và phê duyệt triển khai rõ ràng, serve danh sách portable đã duyệt làm webroot.

**Có Storybook tại `/`:** `npm run build:site` ghi mirror portable vào `.vercel-static/` và artifact triển khai Vercel vào `.vercel/output/`. Vercel dùng `config.json` của artifact sau; không giữ override Output Directory cũ và không sửa `vercel.json` trong lúc build để dự đoán hash chưa tồn tại.

Host tĩnh khác cần adapter ánh xạ từng path HTML cuối cùng và alias tới CSP trong `public-site-csp.json`, giữ security header/redirect tại `scripts/site-deployment-policy.json`, và cấm inline script trên path không biết. Hash phải lấy từ byte cuối cùng, gồm wrapper logic template xác định. Một chuỗi CSP chép tay không thể đại diện quyền riêng của từng trang.

Tệp `_headers` ở root là policy tương thích cho host đọc định dạng đó, vẫn giữ hành vi inline-script trước đây và **không** phải policy Vercel đã harden. Thay đổi này chưa chứng nhận adapter Netlify, Cloudflare Pages hoặc nginx. Giữ các kiểm soát hiện có tới khi adapter và kiểm thử served-header thật được review; không thay bằng policy yếu hơn. Chỉ host `.vercel-static/` cùng adapter header đã review. Path portable vẫn là tài nguyên thật; Storybook sở hữu `/` và `/index.html`.

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

Policy được tác giả quản lý tại `scripts/site-deployment-policy.json`. Hash script riêng cho HTML cuối cùng được sinh vào `public-site-csp.json`; `.vercel/output/config.json` áp dụng policy đúng trang. Script chỉ được tải cùng origin hoặc chạy khi khớp hash chính xác; native inline handler bị cấm, không cấp `unsafe-inline`, `unsafe-eval`, nonce giả hay origin CDN. CSS vẫn giữ `style-src 'self' 'unsafe-inline'` vì component/Storybook dùng inline CSS; đây là hardening script có giới hạn, không phải loại bỏ mọi inline mechanism.

Khối `text/x-dc` là dữ liệu nguồn inert. Wrapper thực thi dùng chung hàm serializer được chiếu vào runtime và import bởi CSP builder. Event native của template dùng binding `data-cs-on-*` được diễn giải; form preview dùng event listener. Build không tự hash code runtime bất kỳ bị chặn để làm check xanh.

Generator giữ ngân sách cục bộ 4 KiB/CSP response và 2.048 route. Record gắn nguồn không phải phê duyệt security hoặc bằng chứng deploy thật. `test-site-csp-browser.mjs` kiểm tra Storybook, docs song ngữ và cả 85 template đã build trong ba engine, alias/query và script/handler lạ bị chặn. Vẫn cần phê duyệt deploy riêng và xác minh served-header sau deploy được phép. Xem [quyết định triển khai](../decisions/static-script-csp.md).

## OG đa domain

Meta production trỏ `https://design.cyberskill.world/assets/og-dashboard.png`. Trên host khác, chỉ thay absolute origin trong `.storybook/manager-head.html` (và stub `dashboard.html`) `og:image` / `twitter:image` / `og:url` — giữ path `/assets/og-dashboard.png`.

## Bề mặt sản phẩm Storybook (chỉ-host)

Path production: **`/`** (Storybook static export overlay trên `.vercel-static/`).

| Lệnh | Kết quả |
|---|---|
| `npm run storybook` | Dev server (chỉ local) |
| `npm run build:storybook` | Ghi `storybook-static/` với `base: '/'` |
| `npm run build:site` | Storybook + mirror portable → `.vercel-static/`; route/byte triển khai tĩnh → `.vercel/output/` |

Xem `docs/storybook.md`. Consumer portable không cần đường này — họ dùng `styles.css` + `_ds_bundle.js` / ESM.

URL của trang chỉ mục thư mục được sinh có dấu gạch chéo cuối để liên kết tương đối luôn nằm trong thư mục đó; bí danh không có dấu gạch chéo chuyển hướng một lần đến URL này. Các đường dẫn khác có dấu gạch chéo cuối vẫn được chuẩn hóa như trước, gồm `/docs/viewer.html/` và URL tài nguyên; phần mở rộng `.html` được giữ nguyên. Chuyển hướng dashboard/playground và chuỗi truy vấn vẫn được hỗ trợ. Tập chuyển hướng cố định và cùng nguồn `/$1` được kiểm tra cục bộ; điều này không chứng nhận việc thực thi trên Vercel đã triển khai. Header phản hồi tĩnh giữ `nosniff` và `strict-origin-when-cross-origin`; quyền chạy script dùng mã băm của HTML cuối cùng thay cho quyền chạy mọi script nội tuyến.
