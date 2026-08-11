# Học thuyết

Quy tắc chuẩn cho việc mở rộng và kiểm chứng Hệ thống Thiết kế CyberSkill. File theo từng host (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) chỉ là shim trỏ về đây. Người tiêu thụ bắt đầu từ `SKILL.md` và thanh bên **Docs** trên Storybook tại `design.cyberskill.world`. Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.

## Khi nào dùng

- Bạn đang thêm hoặc đổi element, variant, icon, component, vai trò token, ngôn ngữ, hoặc mẫu template.
- Bạn đang kiểm chứng một thay đổi trước khi tuyên bố xong.
- Bạn cần các bất biến không được thiết kế lại tùy tiện.

## Ngoài phạm vi

File này không phải changelog, không phải sổ đăng ký sản phẩm, và không phải hướng dẫn tiêu thụ. Ánh xạ sản phẩm → element nằm ở `docs/products.md`. Đường dẫn adoption nằm ở `docs/consuming.md`.

## Quy tắc mở rộng

Khi **bất kỳ thứ gì** trong hệ thống này lớn lên, cập nhật **mọi deliverable trong cùng một thay đổi**:

1. Token và nguồn (`tokens/`, component `.jsx` + `.d.ts` + `.prompt.md`).
2. Thẻ mẫu (guidelines cộng thẻ nhóm component) **và mọi trang guideline liên quan**.
3. **Tất cả** template (enum tweak, bản đồ EL/EX, accent đã quét).
4. UI kit — trang kit trung thành Thổ; demo trục qua thanh công cụ Storybook và Atomic View (Identity Lab đã nghỉ).
5. Docs: README (số đếm theo compiler), `SKILL.md`, file này, `docs/conventions.md`, **và mọi tài liệu liên quan mà thay đổi chạm tới** (README kit, `docs/products.md`, tái sinh `docs/contrast-report.md` sau khi đổi token). Xuất bản cùng các trang đó qua Storybook Docs (xem `docs/storybook.md`). **`VERSION` tự tăng khi đẩy lên `main`** từ Conventional Commits (`.github/workflows/version.yml` → tag `v*` → `npm-publish.yml`); chủ sở hữu vẫn có thể ép bump qua `Release-As:` / `workflow_dispatch`. **Không duy trì file changelog** — LAUNCHED tại **1.1.0**; pin theo `VERSION`. Tính liên tục là lịch sử git cộng Release Notes đã chọn lọc.
6. Bề mặt duyệt và sức khỏe: component mới hoặc đổi được một story Atomic View trong `guidelines/atomic-view.html` (cộng playground sống nếu có prop chỉnh được — `_audit/story-coverage.html` bắt story) và phủ hành vi trong `_audit/component-behavior-test.html` nếu tương tác; mọi trục, công cụ, hoặc tab mới được nối vào `_audit/index.html` và Storybook **Status** (`_audit/run.html` full-bleed — `dashboard.html` chỉ redirect); gate xác định tương ứng được thêm hoặc cập nhật (`contrast-guard` cho quy tắc màu mới, `token-contract` cộng ma trận contrast cho token, `story-coverage` cho component, `docs-storybook-coverage` cho docs đã xuất bản).

**Gate:** `check_design_system` sạch (chỉ phiên compiler) **cộng** `_audit/run.html` (mọi gate nhanh) xanh **cộng** `docs-consistency` xanh **cộng** grep enum hoặc danh sách cũ để chứng minh không bỏ sót. Trên clone portable, tương đương là bảng nhanh cộng `npm run test:unit`.

Ranh giới phạm vi đã ghi (học thuyết, không phải lỗ hổng): trang UI-kit vẫn tái tạo trung thành Thổ; song ngữ EN·VN phủ email cộng tài liệu team, pháp lý, và tài chính (tài sản khách/truyền thông ưu tiên EN); chữ không bao giờ nằm trên `-accent` tông giữa.

## Độ sâu kiểm chứng

Kiểm sâu, không điểm danh bề mặt. Phủ **cả tập và mọi trạng thái liên quan** — không lấy mẫu. Ưu tiên quét xác định, theo chương trình chạm **mọi** mục (ví dụ parity khóa EN/VI, phủ lỗ, và quét rò trên mọi template; probe computed-style và overflow ở mọi breakpoint qua harness `_audit/` dùng `__dcSetProps` cho ngôn ngữ và postMessage `__dc_theme` cho theme), rồi thêm xác nhận visual hoặc export đại diện. Vài ảnh chụp là bằng chứng, không phải chứng minh. Không tuyên bố đã kiểm vì “spot-check” khi kiểm đủ là khả thi; nếu kiểm đủ thật sự không khả thi, nói rõ và nêu cái đã và chưa phủ. Ngôn ngữ, theme, và trạng thái responsive mỗi cái một lượt — một ngôn ngữ, chiều rộng, hoặc theme render sạch không phải bằng chứng cho cái khác.

## Bất biến

| Bất biến | Giá trị |
|---|---|
| Khẩu hiệu | *Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí* |
| Thương hiệu chính | Umber `#45210E` |
| Accent chính | Ochre `#F4BA17` |
| Giọng | ấm · thẳng · thật · tôn trọng (cả bốn cùng lúc) |
| Ngôn ngữ | Việt Nam trước; mọi chuỗi UI gửi cặp EN + VN |
| Sàn a11y | APCA Lc ≥ 75 chữ thân; không bao giờ gỡ focus ring; mục tiêu chạm ≥ 44px |
| Trục | Theme × Element × Language × Style (độc lập) |
| Gói Style | liquid-glass (gói duy nhất; vắng ≡ mặc định) |

Một accent mỗi bề mặt. Trạng thái ngữ nghĩa và chỉ báo focus tổ hợp (viền text-primary + hào quang ochre) không bao giờ elemental. Lumi luôn vàng trong mọi element.

## Tài liệu đã xuất bản

Docs operator và entrance là markdown chuẩn trong kho. Chúng **cũng** bắt buộc trên site Storybook sống: mọi trang được theo dõi phải xuất hiện trên thanh bên Docs và trong Thư viện tài liệu (`docs/viewer.html`). Tài liệu chỉ có trong repo mà không nằm trong tập xuất bản đó là lỗi, bị `docs-storybook-coverage` và `docs-link-check` bắt.
