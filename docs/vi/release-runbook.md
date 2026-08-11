# Runbook phát hành (chuẩn)

Một trang về cách một bản phát hành diễn ra và cách biết nó đã thành công. Gộp các vùng 21/23. Chi tiết liên quan: `docs/ci-cd.md`, `docs/deploy.md`, `docs/decisions.md` §7 / §13. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Kích hoạt

| Đường | Khi nào |
|------|------|
| **Tự động** | Push lên `main` với Conventional Commits → `version.yml` bump `VERSION`, stamp artifact, commit `chore(release): X.Y.Z`, tag `vX.Y.Z` |
| **Ép** | Trailer `Release-As: X.Y.Z` trên commit, hoặc `workflow_dispatch` trên `version.yml` với một level |
| **Publish thủ công** | `workflow_dispatch` trên `npm-publish.yml` (cũng chạy trên tag `v*`) |

Không bao giờ push/deploy/merge nếu không có chỉ thị operator tường minh khi vận hành như agent.

## Những gì chạy (happy path)

```
main push (feat/fix/…)
  → version.yml  (bump VERSION + stamp + bundle + tag vX.Y.Z)
  → npm-publish.yml  (OIDC Trusted Publishing; sau publish kiểm version + dist-tags.latest)
  → Vercel (host)  (build:site → .vercel-static; headers từ vercel.json)
  → sbom.yml trên tag  (artifact CycloneDX)
```

Scorecard chạy theo lịch tuần + push `main` (`.github/workflows/scorecard.yml`).

## Tín hiệu thành công

1. GitHub Actions: `version` xanh; `npm-publish` xanh (**không** soft-skip) với registry presence **và** `dist-tags.latest === VERSION` (FIND-094).
2. `npm view @cyberskill/design version` **và** `npm view @cyberskill/design dist-tags.latest` đều bằng root `VERSION`.
3. `npm-hello-smoke` xanh trên tip (cài registry fail-closed của VERSION đó — FIND-087).
4. Production: `/` là Storybook; `/VERSION` là semver thuần; bảng nhanh `/_audit/run.html` xanh.
5. Artifact: `cyclonedx-sbom` trên lần chạy tag; Scorecard SARIF trên Security / Actions artifacts.
6. Health sau deploy trong `docs/deploy.md`.

## Tag lịch sử chưa publish (không backfill)

| Tag | Trạng thái | Hành động operator |
|-----|--------|-----------------|
| `v1.2.1` | Tag git lịch sử; **không** publish lên npm như `latest` | Để unpublished |
| `v1.3.0` | Tag git lịch sử; **không** publish lên npm như `latest` | Để unpublished |
| `v1.3.1` (tip hiện tại) | **Mục tiêu publish** khi operator chỉ thị | Chỉ publish **`1.3.1`** làm `dist-tags.latest` |

**Không** publish `1.2.1` hay `1.3.0` để đóng lệch registry — đóng FIND-102 bằng cách publish **chỉ `1.3.1`** (có cổng operator). npm `latest` có thể vẫn đọc `1.2.0` cho tới khi publish đó land.

## Thất bại / phục hồi

| Triệu chứng | Hành động |
|---------|--------|
| `npm-publish` 403 / EOTP / ENEEDAUTH / 404 / 402 trên tag hoặc `workflow_dispatch` | **Fail-closed.** Sửa Trusted Publisher binding cho repo **`cyberskill-official/design`** (FIND-088) / 2FA / OIDC; chạy lại trên tag. Soft-skip **không** được báo success cho các lỗi này. |
| Soft-skip `already_published` | No-op kỳ vọng — xác nhận registry; đừng coi là success nếu bạn định phát hành bản mới. |
| Soft-skip `missing_secrets` | Chỉ kỳ vọng **ngoài** GitHub Actions (local). Trên GHA release đây là hard fail. |
| `version.yml` push soft-warn | Đặt `PUSH_TOKEN` hoặc cho Actions push qua branch protection (xem `docs/ci-cd.md`). |
| `npm-hello-smoke` đỏ (VERSION thiếu trên registry) | Kỳ vọng cho tới khi publish land (FIND-087). Theo **Sự cố: bản phát hành chưa publish** bên dưới — không đặt `NPM_HELLO_ALLOW_LOCAL_PACK` trên repo chuẩn. |
| Nightly `design-system-gates` đỏ | GitHub thông báo subscriber workflow mặc định; xem “Cảnh báo job lịch” bên dưới. Chạy lại `workflow_dispatch`. |
| Deploy Vercel một phần | Chạy lại deploy; theo protocol Health; không bịa claim header live nếu chưa `curl -sSI`. |

## Sự cố: bản phát hành chưa publish (FIND-100 / FIND-101 / FIND-107)

Dùng khi git/`VERSION`/site đi trước npm `dist-tags.latest` (ví dụ tip `1.3.1`, registry vẫn `1.2.0`).

1. **Xác nhận lệch** — `cat VERSION`; `npm view @cyberskill/design version`; `npm view @cyberskill/design dist-tags.latest`; ghi nhận tag git `v1.2.1` / `v1.3.0` / `v1.3.1` là lịch sử vs mục tiêu publish.
2. **Không** coi soft-skip xanh của `npm-publish` (hay proof pack local xanh của `npm-hello`) là bằng chứng VERSION đã public — smoke fail-closed; lỗi auth publish hard-fail trên GHA.
3. **Sửa Trusted Publisher** nếu cần — cấu hình npm package phải liệt kê org/repo **`cyberskill-official/design`**, workflow **`npm-publish.yml`**, và đúng environment (FIND-088). Classic `NPM_TOKEN` bị cấm. CI dùng userconfig OIDC sạch (không `_authToken` rỗng từ `actions/setup-node`) để Trusted Publishing đổi token OIDC GitHub.
4. **Publish có cổng operator** — chỉ sau chỉ thị tường minh: chạy lại `npm-publish.yml` trên tag **`v1.3.1`** (hoặc `workflow_dispatch` tại tip đó). Mục tiêu publish là **chỉ `1.3.1`**; không backfill `1.2.1` / `1.3.0`.
5. **Xác minh** — `npm view @cyberskill/design@1.3.1 version` và `dist-tags.latest` đều `1.3.1`; chạy lại `npm-hello-smoke` (hoặc chờ lần gates kế) tới xanh.
6. **Rollback / deprecate (nếu bản xấu đã lên `latest`)** — `npm deprecate @cyberskill/design@<bad> "…"` và/hoặc `npm dist-tag add @cyberskill/design@<good> latest`. npm thường không cho unpublish bản public gần đây — ưu tiên deprecate + retag `latest`. Rollback site/Vercel độc lập (`docs/deploy.md`).

## Cảnh báo job lịch (area 27)

- Cron nightly `0 3 * * *` trên `design-system-gates.yml`.
- Khi schedule fail, job `notify-schedule-failure` (`needs` mọi job lịch — FIND-108) emit annotation lỗi Actions và fail khi `contains(needs.*.result, 'failure')`, kích hoạt **email native GitHub khi workflow fail** tới watcher repo / actor cuối theo Settings → Notifications.
- Tuỳ chọn: thêm biến/secret Actions cho Slack webhook sau; không bắt buộc để CI xanh.
- Operator nên theo dõi badge Actions trong `docs/ci-cd.md` và bật thông báo “Actions” cho workflow fail.

## Product vs CyberOS

Xem `docs/decisions.md` §13. Gói npm và cây portable là sản phẩm; `.cyberos/` chỉ là orchestration.
