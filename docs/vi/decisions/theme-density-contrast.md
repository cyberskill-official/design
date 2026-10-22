# Thuộc tính Theme — density + contrast (G3 / CDS-THEME-002)

Trạng thái: **đã chấp nhận** (2026-08-25) — quyết định của người vận hành **C** (density **và** contrast cùng một đợt).  
Chủ sở hữu: người bảo trì design system.  
Tác vụ: `TASK-IMP-027`

## Quyết định

Phát hành **density** và **contrast** dưới dạng **thuộc tính thuộc Theme**, không phải trục nhận diện sản phẩm thứ năm.

| Thuộc tính | Giá trị | Mặc định (không có ≡) |
|-----------|--------|--------------------|
| `data-cs-density` | `comfortable` · `compact` | `comfortable` |
| `data-cs-contrast` | `standard` · `high` | `standard` |

Các trục sản phẩm vẫn là **Theme × Element × Language × Style**. Density/contrast kết hợp với `data-theme` (light · dark · system), không kết hợp với Element/Language.

**Bề mặt sản phẩm** Expression/Density đã nghỉ dùng (thời kỳ trước bốn trục) tiếp tục bị cấm: không có `data-cs-expression`, không import `tokens/density.css` / `tokens/expressions.css`, không có gate runner Density. Thuộc tính `data-cs-density` nay là **thuộc tính Theme được phép** — `_audit/axis-guard.html` cho phép nó và `data-cs-contrast`, vẫn cấm Expression và các gói CSS đã nghỉ dùng.

## Kế hoạch token

| Họ vai trò | Ánh xạ density | Ánh xạ contrast |
|-------------|-------------|--------------|
| Alias thang spacing `--cs-density-space-*` | compact ≈ 0,75× `--cs-space-*` từ 1–6; mức tối thiểu của section không đổi | — |
| Padding / gap control (`--cs-component-button-*-padding*`, `--cs-component-button-gap`, padding textfield) | compact thu padding Y/X; **mức tối thiểu minHeight vẫn ≥44px** (hit target bất biến) | — |
| Chữ / border (`--cs-color-text-muted`, `--cs-color-border-default`) | — | `high` làm đậm chữ muted + tăng border (theo ý định `prefers-contrast: more`) |
| Vòng focus | không đổi | không đổi (kết hợp text-primary + quầng ochre) |

Giữ mức chữ thân bài APCA **Lc ≥ 75**: high-contrast chỉ tăng vai trò muted/border; màu neo (Umber/Ochre) và chữ primary không đổi.

Triển khai nằm trong `tokens/theme-attributes.css`, được import từ `styles.css` sau token lõi.

## Demo

- Thanh công cụ Storybook: global Density + Contrast (độc lập với Element/Language).
- Thanh công cụ Atomic View: select Density + Contrast; áp dụng bằng `data-cs-density` / `data-cs-contrast` trên host trục (không gắn với Element/Language).

## Kế hoạch gate

| Gate | Sau thay đổi này |
|------|-------------------|
| `axis-guard` | Cho phép `data-cs-density` / `data-cs-contrast` như thuộc tính Theme; vẫn thất bại với Expression + gói CSS density/expressions đã nghỉ dùng + tên runner Density |
| `contrast-guard` / light-contrast | Phải giữ xanh (ánh xạ high-contrast không được hồi quy Lc thân bài) |
| `a11y-harness` | Hit target giữ ≥ mức tối thiểu đã công bố khi compact |
| `docs-consistency` | Blacklist cụm từ cũ không đổi; tài liệu không được khẳng định density là trục sản phẩm |

## Ngoài mục tiêu

- Không thiết kế lại Tabs hay overlay manager.
- Không phát hành gói Style thứ hai dưới tên density.
- Không làm yếu vòng focus hay hit target 44px để đạt compact.

## Sửa scope — 30 tháng Chín 2026 (kiểm chứng cục bộ; chờ nghiệm thu)

Mặc định root vẫn comfortable/standard. Phần tử con không có thuộc tính density kế thừa scope density gần nhất. `data-cs-density="comfortable"` tường minh đặt lại đủ 18 alias, gap và padding chịu density về scope mặc định độc lập, kể cả bên trong compact. Có thể vào lại compact dưới scope đặt lại đó. Các kích thước không đổi màu neo thương hiệu hay chiều cao tối thiểu của control.

System dark và dark tường minh nay áp dụng cùng ưu tiên tương phản: vai trò muted/border mạnh hơn từ OS chỉ có hiệu lực với `prefers-contrast: more`. Trước đó override trợ năng của system-dark áp dụng vô điều kiện.

`test-theme-density-browser.mjs` so giá trị tính toán cho cả 15 biến thể nguyên tố, host light/dark/system, hai chế độ màu OS và hai ưu tiên contrast OS (180 tình huống). Scope comfortable tham chiếu không có thuộc tính density, nên phát hiện lệch với mặc định component. W04 vẫn đang thực hiện: đặt lại palette light lồng nhau và đặt theme/element trên các scope tách nhau là lỗi đã biết riêng; sửa này không chứng nhận chúng. Công việc bao phủ token đọc bằng máy và schema F11/F12 cũng còn chờ.

### Palette trung tính lồng nhau — kiểm chứng cục bộ, chờ nghiệm thu

Trong scope trung tính (ngoài scope element tường minh), `data-theme="light"` đặt lại đủ 25 token màu và `color-scheme` native về palette sáng, kể cả dưới scope tối. `data-theme="system"` thiết lập cùng palette đầy đủ, theo chế độ màu OS hiện tại; không còn kế thừa tổ tiên tối khi OS sáng. Phần tử con không đánh dấu kế thừa theme gần nhất. Màu high-contrast OS áp dụng lên scope light/system mới như đã áp dụng lên root độc lập.

`test-theme-palette-browser.mjs` kiểm chứng 108 tổ hợp của ba giá trị theme lồng nhau, hai chế độ màu OS và hai ưu tiên contrast OS, so mọi token màu và scope kế thừa với tham chiếu độc lập. Điều này chỉ xác lập việc đặt lại palette trung tính. Đặt element/theme và kết hợp scope high/standard contrast tường minh vẫn thuộc W04; kiểm thử này không chứng nhận chúng.

Cơ chế đặt lại trung tính chủ động loại scope element tường minh và con của chúng: đặt lại đồng loạt đã xóa sắc thái nguyên tố kế thừa trong probe scope tách nhau. Các scope đó giữ hành vi hiện có cho đến khi resolver element/theme được sinh được sửa cùng cơ chế kết hợp contrast.

### Kết hợp scope element và contrast — kiểm chứng cục bộ, chờ nghiệm thu

Giới hạn chỉ trung tính phía trên được thay thế bằng scope resolver được sinh trong `tokens/elements.css`. Thuộc tính theme và element có thể cùng vị trí hoặc theo hai thứ tự tổ tiên. Theme tường minh gần nhất chọn light/dark/system; con không đánh dấu kế thừa. Theme lồng nhau chọn lại palette element được kế thừa thay vì giữ giá trị tính trong theme tổ tiên. Cả 15 gói element/variant cung cấp hai palette qua kênh triển khai riêng được sinh từ seed và nguồn màu literal hiện có. Giá trị palette khi cùng vị trí được giữ.

Contrast kế thừa độc lập. Root theo ưu tiên contrast OS trừ khi đặt tường minh. `data-cs-contrast="standard"` khôi phục giá trị muted/border chuẩn kể cả trong high contrast hay ưu tiên OS more-contrast; có thể vào lại `high` dưới standard. Theme gần nhất quyết định cặp contrast light/dark. Density vẫn độc lập và giữ mức tối thiểu 44px.

Giá trị `--cs-*` công khai vẫn là giá trị CSS dùng được. Kênh/công tắc `--_cs-*` là chi tiết triển khai riêng, không phải API token được export. Selector liên kết scope có specificity tối đa bằng quy tắc theme/element/variant hiện có, không dùng `!important`; bên sử dụng vẫn có thể ghi đè inline. Bên dùng chuẩn phải dùng `styles.css` hoặc bản gộp được sinh tương đương để nhận đầy đủ hợp đồng kết hợp.

Generator (`scripts/generate-element-packs.mjs`, cùng `scripts/lib/theme-resolver.mjs`) quản lý resolver. Không sửa tay palette được sinh. `test-theme-composition-browser.mjs` so 1.440 ca đặt/đặt lại scope, giữ 96 tham chiếu cùng vị trí đã ghi và chạy thay đổi OS trực tiếp cùng opt-out/vào lại contrast tường minh. Bộ kiểm tra palette trung tính và density hiện có vẫn bắt buộc. Kiểm chứng đầy đủ nhiều trình duyệt, hình ảnh và con người là kết quả riêng; tính đầy đủ của export máy và trao đổi có kiểu vẫn là công việc F11/F12.

Bằng chứng engine cục bộ: ma trận 1.440 ca và 96 tham chiếu bảo toàn đạt trong Chromium, WebKit, Firefox 153. Chromium/WebKit còn đạt thay đổi media trực tiếp trên node giữ nguyên. Firefox chạy media tĩnh (`--browser=firefox --static-only`): probe stylesheet tối thiểu riêng tái hiện lỗi restyle của Playwright contrast-emulation ngay cả khi không có mã design system. Hành vi contrast trực tiếp của nó **chưa xác minh**, không được miễn như một lượt đạt của sản phẩm. Kiểm thử mặc định vẫn giữ assertion trực tiếp; `--static-only` in rõ phần không bao phủ này. Vẫn cần kiểm tra ưu tiên OS thủ công hoặc browser driver đã sửa cho khẳng định đó.

### Sửa phân phối density — kiểm chứng cục bộ, chờ nghiệm thu

Bảy alias root và đủ 18 khai báo compact cùng 18 comfortable nay được chiếu từ CSS sang JSON, ESM, tham chiếu DTCG và mục manifest. Đầu ra native có kích thước base đã phân giải và cả hai hậu tố scope; DESIGN.md liệt kê alias và override. `scripts/generate-theme-exports.mjs` từ chối alias thiếu/vòng, kích thước không hợp lệ và scope trùng mơ hồ trước khi ghi. Hồi quy browser dùng CSSOM và computed style độc lập với generator để so mọi giá trị export. Công việc giá trị có kiểu/schema F12 cùng giá trị manifest cũ không liên quan vẫn mở.

### Sửa scope token công khai và component đầy đủ — 4 tháng Mười 2026

Ma trận chỉ màu trước đó bỏ sót border TextField và năm token elevation: scope light lồng nhau giữ giá trị tổ tiên dark. Resolver nay gồm mọi dark override từ component-tokens.css và elevation.css, có mặc định light được xác thực. Quy tắc component chọn giá trị light/dark qua công tắc theme gần nhất, thay selector tổ tiên đã vượt ranh giới light tường minh. Computed style độc lập được ghi trước đổi component và giữ sau đổi, kể cả màu border Spinner gốc.

Storybook và Atomic View nay giữ thuộc tính light, comfortable, standard tường minh khi được chọn. Gỡ thuộc tính standard trước đó vô tình bật lại high contrast OS. Artifact Atomic nhúng nhận cùng thuộc tính đặt lại tường minh.

Hồi quy axis-scope bắt buộc so mọi giá trị token root công khai cùng giá trị style-pack và color-scheme qua 36.864 ca tĩnh: 24 thứ tự tổ tiên theme/element/contrast/density, đủ 15 gói cộng trung tính, ba theme, EN/VI, cả hai density, hai giá trị contrast tường minh và cả hai ưu tiên màu/contrast OS. Kiểm tra component có 26 fixture selector/state cùng hover Mentions thật qua 14.580 ca lồng nhau, từ chối selector dark/system component theo ngữ cảnh bị đưa lại. Đây là kiểm tra computed-style và DOM, không phải nghiệm thu hình ảnh hay công nghệ hỗ trợ native. Thay đổi contrast OS trực tiếp của Firefox giữ giới hạn chưa xác minh riêng đã nêu trên.

Con không đánh dấu kế thừa từng trục. Contrast root theo OS trừ khi đặt tường minh; cách diễn đạt root comfortable/standard trước đó không hàm ý opt-out OS. Màu root trung tính khác palette element Thổ tường minh. Element và variant khớp nhau phải ở cùng node; bỏ thuộc tính không xóa element đã kế thừa. Giá trị không biết, variant không khớp và import token một phần nằm ngoài hợp đồng kết hợp được hỗ trợ. Style được hỗ trợ duy nhất vẫn là liquid-glass.

## Nguồn high-contrast tác giả và delta được export — 2026-10-10

Resolver nay đọc bốn giá trị muted/border light/dark từ `tokens/theme-attributes.css`; không còn giữ bản literal độc lập. Reader dùng chung từ chối vai trò/scope thiếu, trùng, không biết, điều kiện/giá trị không hỗ trợ và ánh xạ system-dark khác dark. JSON/ESM và vendor extension DTCG công bố delta `high-light` / `high-dark`; đầu ra native công bố hằng `HighLight` / `HighDark`. Áp dụng chúng sau chọn theme/element. Cách này giữ palette hiện render và sự kế thừa Standard/High độc lập.

Hồi quy đột biến nguồn chạy generator thật cùng cả ba trình duyệt, với media OS được khởi tạo khi điều hướng. Nó tách thẩm quyền nguồn khỏi xử lý event native, giả lập media browser trực tiếp, nghiệm thu công cụ thiết kế và duyệt hình ảnh của con người.
