# Figma / Tokens Studio — ghi chú

## Những gì ship trong repo
- Design tokens dạng CSS + DTCG (`tokens/tokens.dtcg.json`) kèm mirror native Swift/Kotlin/Flutter.
- UI kits dưới `ui_kits/` là tái tạo HTML giữ pixel-faithful theo doctrine brand (Identity Lab Thổ-first).
- Mapping **Code Connect** cho cả **99** public primaries (`components/**/*.figma.tsx` + `figma.config.json` + `code-connect/node-map.json`).

## Công thức import Tokens Studio (hand-sync)

Interchange màu/type/spacing khuyến nghị đến khi org thiết kế lên Figma Enterprise (Variables REST). Nguồn chân lý vẫn **code → design**.

1. Mở file Figma đích (cùng file với `FIGMA_FILE_KEY` khi đã có secrets).
2. Cài / mở **[Tokens Studio](https://tokens.studio/)** (plugin Figma).
3. **Import** → chọn **W3C DTCG / JSON** → chọn file repo `tokens/tokens.dtcg.json` (hoặc dán nội dung).
4. Map token set vào một collection (ví dụ **CyberSkill Tokens**). Ưu tiên giữ key CSS-var / nhóm slash gần với `toFigmaName` của `_audit/ci/push-figma-variables.mjs` (`color/brand/umber`, …) để REST push Enterprise sau này không đổi tên hàng loạt.
5. Áp token vào local variables / styles trong Figma. Re-import sau token PR — **không** round-trip chỉnh sửa phía design vào DTCG trừ khi cố ý sở hữu thay đổi đó trong code.
6. Tùy chọn: Style Dictionary / consumer DTCG khác đọc cùng file; mirror native vẫn generate qua `node _audit/ci/generate-native-tokens.mjs`.

**Ghi chú phạm vi:** REST auto-push (bên dưới) chỉ phủ leaf **màu**. Tokens Studio có thể mang spacing/type/shadow từ cùng file DTCG bằng tay.

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
| `FIGMA_TOKEN` | Figma personal access token với scope **Variables** (và scope Code Connect khi publish mapping) |
| `FIGMA_FILE_KEY` | File key từ `https://www.figma.com/design/<KEY>/...` |

Phải là **repository secrets** dưới tab Actions (tên đúng, phân biệt hoa thường). Không phải Environment secrets (chỉ inject khi job đặt `environment:`), không Variables, và không org secrets loại trừ repo này. Log CI khi thiếu secret hiện `FIGMA_TOKEN:` / `FIGMA_FILE_KEY:` giá trị rỗng.

**Scope bắt buộc cho Variables push** (từ [Figma scopes](https://developers.figma.com/docs/rest-api/scopes/) + [Variables API](https://developers.figma.com/docs/rest-api/variables/)):

| Scope | Vì sao | Availability |
|---|---|---|
| `file_variables:read` | `GET /v1/files/:key/variables/local` | **Chỉ Enterprise** |
| `file_variables:write` | tạo/cập nhật collection + biến màu | **Chỉ Enterprise** |
| `file_content:read` / `file_metadata:read` | xác nhận truy cập file trước push | mọi plan |

Nếu hover PAT chỉ thấy scope kiểu `file_content:read`, `file_comments:*`, `webhooks:*`, `library_*` — đó là bình thường trên ghế **Professional / Organization**. Figma **không liệt kê** `file_variables:*` trừ khi account là **Enterprise**. Tạo lại PAT trên plan non-Enterprise không mở được Variables REST API.

**CI làm gì hôm nay:** job `figma-variables-push` **soft-skip (exit 0 + report) nếu `FIGMA_TOKEN` / `FIGMA_FILE_KEY` trống** — cùng trung thực với Code Connect (thiếu secret không làm đỏ main). Có secret thì mở file chạy trên mọi plan; Variables write cũng soft-skip kèm report khi Figma trả **403** / scope không hợp lệ cho `file_variables`. Soft-skip ≠ sync Variables live. Auto-push đầy đủ cần Enterprise + hai scope đó trên PAT.

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

## Figma Code Connect (live + soft-skip)

**Quyết định 1C:** đường publish đã nối; CI **soft-skip** (exit 0 + `code-connect-report.json`) khi thiếu `FIGMA_TOKEN` / `FIGMA_FILE_KEY` hoặc API trả **403 / 404 / 429** (plan, node chưa publish, rate limit).

| Thành phần | Đường |
|---|---|
| Config | `figma.config.json` (parser React, `components/**/*.figma.tsx`) |
| Node registry | `code-connect/node-map.json` (mỗi primary: `nodeId` + cờ `published`) |
| Mapping | `components/**/<Name>.figma.tsx` — **99** primaries; Button / TextField / Dialog / Card / Alert có prop map; còn lại là stub |
| Generator | `npm run code-connect:generate` → `_audit/ci/generate-code-connect.mjs` |
| Job CI | `code-connect` trong `design-system-gates.yml` (PR + `main` + thủ công) |
| Dry-run local | `npm run code-connect:dry-run` (không secrets; assert config + ≥99 file) |

URL tài liệu dùng file key placeholder **`CS_FIGMA_FILE_KEY`**. Publish thay `FIGMA_FILE_KEY` qua `documentUrlSubstitutions`.

### Checklist operator (lần publish thật đầu tiên)

1. Publish từng Figma component lên **team library** (Code Connect yêu cầu component đã publish; plan Org/Enterprise).
2. Đặt `nodes.<Name>.nodeId` trong `code-connect/node-map.json` (dạng colon hoặc hyphen) và `published: true`.
3. `npm run code-connect:generate` để viết lại URL `.figma.tsx`.
4. Có secrets: `node _audit/ci/code-connect-publish.mjs` (hoặc để job CI chạy trên `main`).

Đến khi có node ID thật, stub tổng hợp `9999:*` vẫn còn; publish báo cáo và thoát sạch trên 404. Blocker còn lại: `docs/decisions.md` §6.

```bash
npm run code-connect:dry-run
# với secrets
export FIGMA_TOKEN=...
export FIGMA_FILE_KEY=...
node _audit/ci/code-connect-publish.mjs
```

## Hand-sync / Tokens Studio (quyết định A của owner — non-Enterprise)

Đường khuyến nghị đến khi org thiết kế lên Enterprise:

1. Coi `tokens/tokens.dtcg.json` là nguồn interchange màu/type/spacing.
2. **Tokens Studio** (hoặc tương tự): theo công thức import ở trên; chỉ re-export khi cố ý đổi giá trị phía design (ưu tiên hướng code → design).
3. Bản đồ hand-sync: đường DTCG → tên biến Figma qua cùng naming slash như `_audit/ci/push-figma-variables.mjs` (`toFigmaName`).
4. Code Connect đã nối live kèm soft-skip (file này) — điền `node-map.json` khi library component tồn tại.
5. Khi org lên Enterprise, bật lại REST push đầy đủ (bỏ nhu cầu soft-skip) với `file_variables:read` + `file_variables:write` trên PAT.

## Giới hạn phạm vi (thành thật)

Job Variables chỉ push biến **màu** (hex leaves từ DTCG). Spacing, type, và pack multi-mode light/dark chưa auto-sync — dùng Tokens Studio cho những phần đó đến khi sync sau mở rộng job REST.
