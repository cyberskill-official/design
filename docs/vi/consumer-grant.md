# Grant consumer — `@cyberskill/design`

**Trạng thái: có hiệu lực** (Th7 2026). Văn bản chính sách — không phải secret. License trên package vẫn **UNLICENSED**; grant này là lớp duyệt dùng trong các sản phẩm đã nêu. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Grant

CyberSkill cấp cho **CyberSkill** (công ty và các team kỹ thuật sản phẩm dưới `cyberskill-official`) quyền **không độc quyền** cài và dùng **`@cyberskill/design`** trong các sản phẩm liệt kê ở registry đã khóa `docs/products.md`:

| Sản phẩm |
|---|
| Lumi — trợ lý điều ước |
| Status Hub — cổng portfolio khách hàng |
| CyberOS Agent Spine — hạ tầng agent, memory, gates |
| CyberSkill Design System — thư viện này |
| cyberskill.world — site studio |
| Client delivery suite — kickoff · QBR · runbooks |
| Board / investor collateral |
| HR / employment instruments |

Package vẫn **UNLICENSED**. Cài từ npm registry **không** tự cấp quyền redistribution. Redistribution ngoài các sản phẩm trên — gồm publish fork, đổi license, hoặc ship package như dependency của sản phẩm bên thứ ba không liên quan — cần **grant viết thêm** ghi trong file này (hoặc văn bản thay thế).

**Ngoại lệ bên thứ ba:** font OFL trong `fonts/`, runtime MIT trong `_vendor/`, và các asset liệt kê ở `THIRD-PARTY-NOTICES.md` giữ license **upstream**. Khẳng định UNLICENSED và grant này **không** thay thế các điều khoản đó; người redistribute phải tuân `fonts/OFL.txt` và file notices.

## Ghi chú phạm vi

- **Clone / subtree / link tĩnh** repo này cho cùng các sản phẩm trên được cover giống npm install.
- **Tooling chỉ-host** (Storybook, `_audit/`) không nằm trong tarball npm và không redistribution theo grant này.
- **Notices bên thứ ba:** xem `THIRD-PARTY-NOTICES.md` và `fonts/OFL.txt` ở root.
- Thêm sản phẩm CyberSkill mới: cập nhật `docs/products.md` (+ VI) qua quyết định maintainer, rồi thêm hàng sản phẩm tại đây trong cùng change.
- Duyệt **team/client bên ngoài**: thêm stanza grant có ngày bên dưới (team/org, sản phẩm đã nêu, liên hệ). Không invent ánh xạ product → element tại đây — giữ ở `docs/products.md`.

## Grantee bổ sung

*(Chưa có. Thêm entry có ngày tại đây.)*

## Liên quan

- Adopt / cài: `docs/consuming.md`
- Biên bản quyết định: `docs/decisions.md` §7
- Registry product → element: `docs/products.md`
