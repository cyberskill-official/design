# Figma / Tokens Studio — ghi chú


Xuất bản trên Storybook **Docs** tại `design.cyberskill.world`.
## Những gì ship trong repo
- Design tokens dạng CSS + DTCG (`tokens/tokens.dtcg.json`) kèm mirror native Swift/Kotlin/Flutter.
- UI kits dưới `ui_kits/` là tái tạo HTML giữ pixel-faithful theo doctrine brand (kit Thổ-first; demo trục ở Storybook / Atomic View).

## Công thức import Tokens Studio (hand-sync)

Quy trình này chưa được xác minh với phiên bản plugin hiện tại. Bản xuất hướng tới DTCG 2025.10; cần kiểm tra round-trip nhập/xuất trước khi sử dụng. Siêu dữ liệu em tương đối và phạm vi ghi đè dạng CSS cần bộ chuyển đổi CyberSkill. Kiểm tra local bao phủ 42 vai trò màu cơ sở, gồm alpha, trong helper tạo payload REST; không chứng minh nhập trực tiếp hay quyền tài khoản. Nguồn chuẩn vẫn là **code → design**.

1. Mở file Figma đích (cùng file với `FIGMA_FILE_KEY` khi đã có secrets).
2. Cài / mở **[Tokens Studio](https://tokens.studio/)** (plugin Figma).
3. **Import** → chọn **W3C DTCG / JSON** → chọn file repo `tokens/tokens.dtcg.json` (hoặc dán nội dung).
4. Map token set vào một collection (ví dụ **CyberSkill Tokens**). Ưu tiên giữ key CSS-var / nhóm slash gần với `toFigmaName` của `_audit/ci/push-figma-variables.mjs` (`color/brand/umber`, …) để REST push Enterprise sau này không đổi tên hàng loạt.
5. Áp token vào local variables / styles trong Figma. Re-import sau token PR — **không** round-trip chỉnh sửa phía design vào DTCG trừ khi cố ý sở hữu thay đổi đó trong code.
6. Tùy chọn: Style Dictionary / consumer DTCG khác đọc cùng file; mirror native vẫn generate qua `node _audit/ci/generate-native-tokens.mjs`.

**Ghi chú phạm vi:** REST auto-push (bên dưới) chỉ phủ leaf **màu**. Spacing/type/shadow và cách xử lý phạm vi/phần mở rộng cần được xác minh bằng nhập/xuất.

## Push biến màu tự động

Job CI **`figma-variables-push`** (trong `.github/workflows/design-system-gates.yml`) đọc `tokens/tokens.dtcg.json` và tạo/cập nhật collection biến local Figma **CyberSkill Tokens** với biến màu.

| Trigger | Hành vi |
|---|---|
| Push lên `main` | Chạy push (cần secrets) |
| `workflow_dispatch` | Chạy thủ công từ tab Actions |
| PR | Không push (tránh nhiễu); dry helpers vẫn có local |

### Secrets (repo → Settings → Secrets and variables → Actions)

| Tên | Giá trị |
|---|---|
| `FIGMA_TOKEN` | Figma personal access token với scope **Variables** |
| `FIGMA_FILE_KEY` | File key từ `https://www.figma.com/design/<KEY>/...` |

Phải là **repository secrets** dưới tab Actions (tên đúng, phân biệt hoa thường). Không phải Environment secrets (chỉ inject khi job đặt `environment:`), không Variables, và không org secrets loại trừ repo này. Log CI khi thiếu secret hiện `FIGMA_TOKEN:` / `FIGMA_FILE_KEY:` giá trị rỗng.

**Scope bắt buộc cho Variables push** (từ [Figma scopes](https://developers.figma.com/docs/rest-api/scopes/) + [Variables API](https://developers.figma.com/docs/rest-api/variables/)):

| Scope | Vì sao | Availability |
|---|---|---|
| `file_variables:read` | `GET /v1/files/:key/variables/local` | **Chỉ Enterprise** |
| `file_variables:write` | tạo/cập nhật collection + biến màu | **Chỉ Enterprise** |
| `file_content:read` | kiểm tra toàn bộ file bằng `GET /v1/files/:key?depth=1` | mọi plan, khi có quyền truy cập file |

Bước kiểm tra dùng [endpoint đọc toàn bộ file](https://developers.figma.com/docs/rest-api/file-endpoints/), không phải `/files/:key/meta`; riêng `file_metadata:read` không cấp quyền cho endpoint này. Scope token không thay thế quyền trên file. Cần đối chiếu [yêu cầu tài khoản và quyền file của Variables API](https://developers.figma.com/docs/rest-api/variables/) hiện tại: bảng endpoint yêu cầu quyền xem khi đọc, và Full seat hoặc admin cùng quyền chỉnh sửa khi ghi; khách không thể dùng API này. Chỉ có Enterprise và hai scope Variables chưa chứng minh đủ quyền truy cập.

Nếu hover PAT chỉ thấy scope kiểu `file_content:read`, `file_comments:*`, `webhooks:*`, `library_*` — đó là bình thường trên ghế **Professional / Organization**. Figma **không liệt kê** `file_variables:*` trừ khi account là **Enterprise**. Tạo lại PAT trên plan non-Enterprise không mở được Variables REST API.

**CI làm gì hôm nay:** thiếu `FIGMA_TOKEN` / `FIGMA_FILE_KEY` khiến workflow ghi nhận soft-skip rõ ràng và không thử push. Khi có thông tin xác thực, helper kiểm tra toàn bộ file trước. Lỗi scope ở bước kiểm tra file là lỗi cứng. HTTP 403 khi đọc Variables local, hoặc phản hồi ghi Variables nêu scope `file_variables:*` hay giới hạn Enterprise API, ghi nhận `variables_api_access`; lỗi quyền ghi khác vẫn là lỗi cứng. HTTP 404/429/503 ghi nhận API không khả dụng. Các phản hồi đó không chứng minh bị giới hạn bởi plan Enterprise hay đã đồng bộ thành công. Dữ liệu token local không hợp lệ và lỗi ngoài API vẫn là lỗi cứng; `--dry-run` không gọi API. Kiểm tra tài khoản, seat, scope và quyền file trước thao tác live. Soft-skip được tách khỏi đồng bộ và xuất bản.

**Lựa chọn non-Enterprise:** hand-sync colour styles từ `tokens/tokens.dtcg.json`, hoặc dùng [Tokens Studio](https://tokens.studio/) / Plugin API trong desktop app (đường plugin không dùng job REST này) — xem công thức import ở trên.

### Local

```bash
# không secrets — chỉ in plan
node _audit/ci/push-figma-variables.mjs --dry-run

# với secrets trong env (không bao giờ commit)
export FIGMA_TOKEN=...
export FIGMA_FILE_KEY=...
node _audit/ci/push-figma-variables.mjs --check   # truy cập file + list collections
node _audit/ci/push-figma-variables.mjs           # tạo/cập nhật màu
```

Sau push thành công, mở file trong Figma → **Local variables** → collection **CyberSkill Tokens**.

### Lấy Figma token ở đâu

1. Đăng nhập [figma.com](https://www.figma.com).
2. **Settings → Security → Personal access tokens** → generate.
3. File key: mở file đích; đoạn URL sau `/design/` hoặc `/file/`.

## Hand-sync / Tokens Studio (quyết định A của owner — non-Enterprise)

Đường khuyến nghị đến khi org thiết kế lên Enterprise:

1. Coi `tokens/tokens.dtcg.json` là nguồn interchange màu/type/spacing.
2. **Tokens Studio** (hoặc tương tự): theo công thức import ở trên; chỉ re-export khi cố ý đổi giá trị phía design (ưu tiên hướng code → design).
3. Bản đồ hand-sync: đường DTCG → tên biến Figma qua cùng naming slash như `_audit/ci/push-figma-variables.mjs` (`toFigmaName`).
4. Khi org lên Enterprise, bật lại REST push đầy đủ (bỏ nhu cầu soft-skip) với `file_variables:read` + `file_variables:write` trên PAT.

## Giới hạn phạm vi (thành thật)

Job Variables chỉ push 42 leaf **màu** cơ sở, chuyển màu sRGB dạng đối tượng DTCG hiện tại (gồm alpha) sang Figma RGBA. Helper vẫn hỗ trợ đầu vào hex cũ; đó không phải định dạng xuất hiện tại. Spacing, type, và pack multi-mode light/dark chưa auto-sync — dùng Tokens Studio cho những phần đó đến khi sync sau mở rộng job REST.

Bản xuất DTCG hiện phát <!-- cs-count:typedBaseTokens -->175<!-- /cs-count --> token cơ sở có kiểu. Số lượng lấy từ [reference catalog](../reference-catalog.json).
