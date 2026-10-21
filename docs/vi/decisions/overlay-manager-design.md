# Thiết kế overlay manager (C8 / CDS-ARCH-001)

Trạng thái: **đã đưa vào Giai đoạn 3** (quyết định của người vận hành D5=A, 2026-08-08) — xem `components/overlays/OverlayManager.jsx`.  
Chủ sở hữu: người bảo trì design system · Liên quan: token độ sâu UX-009, mô hình bàn phím CDS-A11Y-003.

## Bản sửa tháng Chín — triển khai đang được xem xét

Phác thảo API và danh sách chuyển đổi dưới đây mô tả thiết kế ban đầu. Mọi bề mặt tùy biến có thể đóng đã xác định theo nguồn hiện đều đăng ký: Dialog, AlertDialog, Drawer, CommandPalette, Popover, Menu, Combobox, DatePicker, ColorPicker, TreeSelect, Popconfirm, Tooltip, Cascader, NavigationMenu, Menubar, Toolbar, Mentions, InlineEdit, ContextMenu, HoverCard, Tour, xem trước Image, trợ giúp HotKeys, dial FloatingActionButton và AIDisclosureBadge. Menu native của Select/NativeSelect vẫn do trình duyệt quản lý. Thông báo Toast đăng ký như scope thông báo không modal: vẫn có thể truy cập phía trên vùng cô lập modal và không nhận Escape.

Các provider dùng chung manager của tài liệu. Chỉ lớp trên cùng đã đăng ký xử lý Escape, bỏ qua khi IME đang composition. Việc giới hạn Tab và focus đi theo modal đang hoạt động cùng các scope portal đã đăng ký. Quyền sở hữu React sắp đúng thứ tự phần tử con qua portal ngay cả khi layout effect của con chạy trước cha; trigger qua portal đang đóng vẫn thuộc scope modal của nó. Bên sử dụng cung cấp định vị portal và token độ sâu. Cơ chế này không tự đưa DOM của component vào portal.

Các nhánh nền trở thành inert khi có modal hoạt động. Node nền mới được chèn cũng được quan sát; giá trị inert đã có được giữ. Ref backdrop tường minh giữ backdrop đang hoạt động; đóng modal lồng nhau kích hoạt lại cha. Overflow cuộn được khôi phục sau khi modal cuối cùng đóng. Khôi phục focus đòi hỏi đích còn kết nối và focus vẫn thuộc lớp đang đóng. Kiểm thử React development xác minh phát lại effect trong StrictMode, gỡ con/cha, mount portal ban đầu và trễ, Tab, đóng qua backdrop và chèn node nền động.

Bằng chứng Chromium tự động hiện bao phủ tám họ overlay ban đầu cùng mười ba họ bổ sung, Tooltip và hợp đồng focus modal/portal. Vẫn cần kiểm chứng nhiều trình duyệt, hành vi IME/popup native thật và công nghệ hỗ trợ thủ công. Ghi chú này không ghi nhận nghiệm thu của con người.

## Vấn đề

Các overlay (Dialog, AlertDialog, Drawer, Popover, Menu, CommandPalette, Toast, Tour) hiện tự quản lý:

- z-index (dialog từng ghi cứng `1000` — nay dùng token `--cs-depth-modal`)
- bẫy / khôi phục focus
- khóa cuộn body
- xử lý Escape

Overlay lồng nhau (toast khi modal mở; xác nhận trong drawer) tranh chấp thứ tự DOM và số lần khóa cuộn. Mô hình bàn phím cho widget phức tạp (CDS-A11Y-003) cần một thẩm quyền stack duy nhất.

## Mục tiêu

1. Một stack quản lý thứ tự vẽ (token độ sâu), scope focus, định tuyến Escape và bộ đếm khóa cuộn.
2. Toast luôn vẽ trên modal (`--cs-depth-toast` > `--cs-depth-modal`) — đây đã là doctrine token.
3. Overlay lồng nhau: chỉ lớp modal trên cùng bẫy focus; Escape đóng lớp trên cùng trước.
4. v1 không cần thư viện floating bên thứ ba; có thể dùng Floating UI về sau chỉ cho định vị.

## Ngoài mục tiêu (v1)

- Viết lại mọi bộ định vị popover
- Đổi prop component công khai (chỉ thêm tùy chọn `layer` / `portal`)
- Polyfill portal SSR vượt quá “không dùng `window` khi render” (Tour đã sửa)

## Phác thảo API

```ts
// components/overlays/OverlayManager.jsx (Phase 3 land)

type LayerKind = 'dropdown' | 'popover' | 'modal' | 'toast' | 'tour';

type LayerRegistration = {
  id: string;
  kind: LayerKind;
  /** Focus trap when kind is modal */
  trapFocus?: boolean;
  onEscape?: () => void;
  /** Element that receives restore focus */
  restoreEl?: HTMLElement | null;
};

type OverlayManagerApi = {
  register(layer: LayerRegistration): () => void; // unregister
  top(): LayerRegistration | null;
  /** Refcount scroll lock — lock while any modal registered */
  scrollLocked: boolean;
};

// React context
const OverlayContext = React.createContext<OverlayManagerApi | null>(null);
function OverlayProvider({ children }: { children: React.ReactNode }): JSX.Element;
function useOverlayLayer(opts: Omit<LayerRegistration, 'id'>): { id: string };
```

### Ánh xạ độ sâu

| Loại | Token | Ghi chú |
|------|-------|--------|
| dropdown | `--cs-depth-dropdown` (60) | Menu dưới thanh điều hướng sticky |
| popover | `--cs-depth-overlay` | HoverCard, Popover |
| modal | `--cs-depth-modal` (100) | Dialog, AlertDialog, Drawer, CommandPalette |
| toast | `--cs-depth-toast` (200) | Phía trên modal |
| tour | `--cs-depth-toast` hoặc token riêng | Hướng dẫn phủ toàn viewport |

### Focus và Escape

- Đăng ký modal đẩy một scope focus vào stack; Tab đi vòng trong host modal trên cùng (`.cs-dialog-layer` / panel drawer).
- Escape chỉ gọi `onEscape` của `top()`; nếu không có thì truyền tiếp.
- Hủy đăng ký khôi phục focus về `restoreEl` khi lớp đó ở trên cùng lúc đóng.

### Khóa cuộn

- Overflow của `document.documentElement` / `body` bị ẩn khi `count(modal) > 0`.
- Modal lồng nhau tăng bộ đếm; đóng làm giảm — không mở khóa chớp nhoáng.

### Host portal

```html
<div id="cs-overlay-root" data-cs-overlay-root></div>
```

Component đưa portal vào `[data-cs-overlay-root]` khi có; nếu không thì vào document.body (hành vi hiện tại). Kit và Atomic View mount root một lần.

## Chuyển đổi (Giai đoạn 3)

1. Phát hành `OverlayProvider` + `useOverlayLayer` cạnh component hiện có (không phá tương thích).
2. Nối Dialog / AlertDialog / Drawer / CommandPalette / ToastStack trước.
3. Thêm hàng a11y-gate: dialog+toast lồng nhau, thứ tự Escape của dialog+alertdialog lồng nhau, bộ đếm khóa cuộn.
4. Sau đó mô hình bàn phím E3 cho Cascader / TreeSelect / Menubar dùng cùng helper scope focus.

## Nghiệm thu

- Toast nhìn thấy phía trên dialog đang mở (gate hành vi — đã xanh; giữ nguyên).
- AlertDialog lồng trong Dialog: Escape đóng alert trước; focus trở lại dialog.
- Không có `z-index` thô > 20 trong `base/` ngoài biến token (token-contract).
- Ghi chú thiết kế tiếp tục là SoT cho đến khi Giai đoạn 3 đưa mã vào `components/overlays/`.
