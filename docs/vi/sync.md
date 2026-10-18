# Repo ↔ môi trường authoring — đồng bộ có kiểm chứng

Bắt đầu từ snapshot repo đã chọn cho tác vụ, ghi lại commit và thay đổi local. Snapshot Git giữ nguyên byte của các file được track. Việc khôi phục hành vi compiler, tích hợp host hay export có thể chỉnh sửa cần bằng chứng riêng từ công cụ thực tế. Một archive không tự chứng minh các khả năng đó.

Đọc [SKILL.md](../../SKILL.md), [doctrine](./doctrine.md) và [hướng dẫn consumer](./consuming.md) trước khi chọn runtime. Session compiler, kể cả Claude Design, là môi trường authoring có điều kiện. Kiểm tra DC compiler và thao tác import/export cần dùng có sẵn; không suy ra `github_copy_files`, compiler tự nhận diện hay round trip không mất dữ liệu chỉ từ một clone.

## Giữ input được author cùng output đã commit

Giữ trọn cây đã review: input CSS/token, JSX/declaration/prompt của component, header card được author, template và runtime, guideline, kit, font, asset, docs, audit harness, package/lock file và adapter host. Giữ thông báo giấy phép bắt buộc. Tiền tố underscore không xác định một path là authored, generated, committed hay transient.

| Deliverable | Ownership và regeneration |
|---|---|
| `_esm/react.mjs`, `_esm/react.d.ts` | Generate từ header export của bundle bằng `scripts/generate-react-entry.mjs` (`npm run build:react-entry`). Sửa contract component sở hữu dữ liệu, rồi regenerate. |
| `_esm/cs.mjs` | Ownership hỗn hợp: bootstrap browser trước `export const VERSION` được author; phần version/export phía sau do `scripts/generate-export-catalog.mjs` generate. `npm run build:exports` regenerate catalog, bundle và entry React. |
| `_ds_manifest.json` | Components/cards thuộc generator export catalog; tokens/globalCssPaths thuộc `scripts/generate-token-declarations.mjs`. Field khác giữ ownership authoring/compiler đã ghi. Không thay toàn bộ manifest bằng output từ công cụ khác. |
| `_ds_bundle.js`, `dist/styles.min.css`, `DESIGN.md` | Output consumer đã commit. Regenerate bằng `npm run build:bundle`, `npm run build:styles` và `npm run build:design-md`. Generated không có nghĩa là có thể bỏ. |
| Export token và bản sao trong sample native | `npm run tokens:generate` chạy toàn bộ pipeline token/export của repo và đồng bộ bản sao native. Source parity không chứng minh native compile hay hành vi trên thiết bị. |
| Bản sao runtime standalone | Giữ byte vendor canonical và chạy generator sao chép đã ghi. Bản sao khớp không chứng minh authored source upstream, quyền phân phối lại hay khả năng rebuild toàn bộ runtime. |

`_esm/` và artifact consumer đã commit ở trên phải được giữ cho consumer. Xem `.gitignore` để biết path transient thực tế, gồm upload, scrap, bằng chứng export, cache dependency và output build Storybook/site. Giữ compiler graph và hồ sơ review riêng tư ngoài payload public/npm theo policy xuất bản.

## Nhập công việc của session qua diff đã review

1. Ghi commit đã chọn, `git status`, công cụ có sẵn và output dự kiến. Giữ công việc local hiện có trước khi nhập thay đổi từ session khác.
2. Export hoặc copy session vào thư mục riêng. So sánh path và hash với snapshot đã chọn; kiểm tra file thiếu, deletion và thay đổi generated trước khi áp dụng patch. Giữ `.git/`, workflow repo và thông báo giấy phép dưới ownership hiện có.
3. Chỉ áp dụng thay đổi đã được cho phép trong branch local phù hợp, thường là `codex/<topic>`. Regenerate mỗi output qua nguồn sở hữu. Tránh sửa độc lập hai bản sao của cùng contract rồi ghi đè cả hai.
4. Kiểm tra toàn bộ diff, chạy targeted check và `npm run test:unit`. Theo [hướng dẫn audit](../../_audit/README.md) cho prerequisite browser/pixel. Test riêng runtime đã import và artifact export được yêu cầu; giữ source identity, lệnh, failure/skip và giới hạn công cụ.
5. Chuẩn bị các path đã review để commit. Push, xuất bản, deploy và merge cần operator cho phép rõ ràng; local check thành công hay diff PR không phải sự cho phép đó.

## Ranh giới consumer

Consumer HTML static dùng `DESIGN.md`, CSS/class và asset đã kiểm chứng. Consumer React bundler dùng `_esm/react.mjs` với peer React và transpilation JSX. Consumer browser legacy dùng `_esm/cs.mjs` và `_ds_bundle.js`. Authoring DC còn cần compiler có sẵn. Giữ và kiểm tra đường sử dụng được yêu cầu thay vì suy ra support tương đương từ file đã copy.

CyberOS orchestration và hai acceptance gate đã được bỏ ngày 2026-10-08. Product visual review, bằng chứng accessibility thủ công và cho phép phát hành rõ ràng vẫn là yêu cầu riêng. Bản sao khớp byte, generator pass hay preview local thành công không chứng minh toàn hệ thống hoặc human acceptance.
