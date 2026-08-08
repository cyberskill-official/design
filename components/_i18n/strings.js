/* CyberSkill — central bilingual string registry (v3 Batch 0/1/2).
 * Every component with BUILT-IN UI text (text the consumer does NOT pass as a prop)
 * registers its strings here, EN + VI. _audit/bilingual-parity.html enforces:
 *   • each component has both `en` and `vi`
 *   • identical key sets across en/vi (no missing/extra keys)
 *   • no empty values
 * Batch 1 wires each component to read these via i18n.js `makeT()` + `useLang()`,
 * replacing hardcoded English. Export is lowercase so the DS compiler does NOT expose
 * it on the component namespace. */
export const strings = {
  Pagination: {
    en: { label: "Pagination", prev: "Previous page", next: "Next page" },
    vi: { label: "Phân trang", prev: "Trang trước", next: "Trang sau" },
  },
  Breadcrumb: {
    en: { label: "Breadcrumb" },
    vi: { label: "Đường dẫn" },
  },
  CommandPalette: {
    en: { placeholder: "Type a command or search…", empty: "No results found", aria: "Command palette", esc: "Esc" },
    vi: { placeholder: "Nhập lệnh hoặc tìm kiếm…", empty: "Không tìm thấy kết quả", aria: "Bảng lệnh", esc: "Esc" },
  },
  SearchField: {
    en: { placeholder: "Search…", clear: "Clear search" },
    vi: { placeholder: "Tìm kiếm…", clear: "Xóa tìm kiếm" },
  },
  NumberField: {
    en: { decrease: "Decrease", increase: "Increase", value: "Value" },
    vi: { decrease: "Giảm", increase: "Tăng", value: "Giá trị" },
  },
  FileUpload: {
    en: { title: "Drop files here or browse", hint: "PNG, JPG, or PDF up to 10MB" },
    vi: { title: "Kéo tệp vào đây hoặc chọn", hint: "PNG, JPG hoặc PDF, tối đa 10MB" },
  },
  Dialog: {
    en: { close: "Close", confirm: "Confirm", cancel: "Cancel" },
    vi: { close: "Đóng", confirm: "Xác nhận", cancel: "Hủy" },
  },
  AlertDialog: {
    en: { confirm: "Confirm", cancel: "Cancel" },
    vi: { confirm: "Xác nhận", cancel: "Hủy" },
  },
  Drawer: {
    en: { close: "Close", panel: "Panel" },
    vi: { close: "Đóng", panel: "Bảng" },
  },
  DataTable: {
    en: { empty: "No records" },
    vi: { empty: "Không có bản ghi" },
  },
  ConfidenceMeter: {
    en: { label: "Confidence", low: "Low", medium: "Medium", high: "High" },
    vi: { label: "Độ tin cậy", low: "Thấp", medium: "Trung bình", high: "Cao" },
  },
  Spinner: {
    en: { label: "Loading" },
    vi: { label: "Đang tải" },
  },
  Tag: {
    en: { remove: "Remove" },
    vi: { remove: "Gỡ bỏ" },
  },
  Toast: {
    en: { notifications: "Notifications", dismiss: "Dismiss" },
    vi: { notifications: "Thông báo", dismiss: "Đóng" },
  },
  TypingIndicator: {
    en: { label: "Lumi is typing" },
    vi: { label: "Lumi đang nhập" },
  },
  Editor: {
    en: { toolbar: "Formatting", bold: "Bold", italic: "Italic", list: "Bullet list", area: "Rich text" },
    vi: { toolbar: "Định dạng", bold: "Đậm", italic: "Nghiêng", list: "Danh sách", area: "Văn bản" },
  },
  Terminal: {
    en: { input: "Terminal input" },
    vi: { input: "Ô nhập lệnh" },
  },
  DataGrid: {
    en: { empty: "No records", selectAll: "Select all rows", selectRow: "Select row", pin: "Pin this column", pinNamed: "Pin column {name}" },
    vi: { empty: "Không có bản ghi", selectAll: "Chọn tất cả", selectRow: "Chọn dòng", pin: "Ghim cột này", pinNamed: "Ghim cột {name}" },
  },
  Splitter: {
    en: { label: "Resize panes" },
    vi: { label: "Đổi kích thước khung" },
  },
  HotKeys: {
    en: { title: "Keyboard shortcuts", toggle: "Toggle this sheet" },
    vi: { title: "Phím tắt", toggle: "Bật/tắt bảng này" },
  },
  ColorPicker: {
    en: { label: "Color", hex: "Hex value" },
    vi: { label: "Màu", hex: "Giá trị hex" },
  },
  Tour: {
    en: { skip: "Skip", back: "Back", next: "Next", done: "Done" },
    vi: { skip: "Bỏ qua", back: "Quay lại", next: "Tiếp", done: "Xong" },
  },
  TreeSelect: {
    en: { placeholder: "Select…" },
    vi: { placeholder: "Chọn…" },
  },
  Cascader: {
    en: { placeholder: "Select…" },
    vi: { placeholder: "Chọn…" },
  },
  Transfer: {
    en: { source: "Available", target: "Selected", toTarget: "Move to selected", toSource: "Move to available" },
    vi: { source: "Có sẵn", target: "Đã chọn", toTarget: "Chuyển sang đã chọn", toSource: "Chuyển về có sẵn" },
  },
  Mentions: {
    en: { placeholder: "Add a note — @ to mention" },
    vi: { placeholder: "Thêm ghi chú — gõ @ để nhắc tên" },
  },
  Form: {
    en: { summary: "Please fix the following:", required: "required", requiredField: "This field is required" },
    vi: { summary: "Vui lòng sửa các mục sau:", required: "bắt buộc", requiredField: "Trường này là bắt buộc" },
  },
  BackTop: {
    en: { label: "Back to top" },
    vi: { label: "Về đầu trang" },
  },
  Carousel: {
    en: { prev: "Previous slide", next: "Next slide", slide: "Slide" },
    vi: { prev: "Trang trước", next: "Trang sau", slide: "Trang" },
  },
  Comment: {
    en: { reply: "Reply" },
    vi: { reply: "Trả lời" },
  },
  Image: {
    en: { preview: "Preview image", close: "Close" },
    vi: { preview: "Xem ảnh", close: "Đóng" },
  },
  Toolbar: {
    en: { more: "More actions" },
    vi: { more: "Thao tác khác" },
  },
  Popconfirm: {
    en: { ok: "OK", cancel: "Cancel" },
    vi: { ok: "Đồng ý", cancel: "Hủy" },
  },
  Result: {
    en: { success: "Done", error: "Something went wrong", warning: "Please check", info: "For your information" },
    vi: { success: "Hoàn tất", error: "Đã có lỗi xảy ra", warning: "Vui lòng kiểm tra", info: "Thông tin" },
  },
  InlineEdit: {
    en: { edit: "Edit", empty: "Add text" },
    vi: { edit: "Sửa", empty: "Thêm nội dung" },
  },
  Calendar: {
    en: { prev: "Previous month", next: "Next month" },
    vi: { prev: "Tháng trước", next: "Tháng sau" },
  },
  DatePicker: {
    en: { placeholder: "Select a date" },
    vi: { placeholder: "Chọn ngày" },
  },
  TimePicker: {
    en: { label: "Time" },
    vi: { label: "Giờ" },
  },
  Combobox: {
    en: { placeholder: "Select or type…", empty: "No matches" },
    vi: { placeholder: "Chọn hoặc nhập…", empty: "Không có kết quả phù hợp" },
  },
  InputGroup: {
    en: { clear: "Clear", show: "Show password", hide: "Hide password", input: "Input" },
    vi: { clear: "Xóa", show: "Hiện mật khẩu", hide: "Ẩn mật khẩu", input: "Ô nhập" },
  },
  TagInput: {
    en: { placeholder: "Add a tag…", remove: "Remove" },
    vi: { placeholder: "Thêm thẻ…", remove: "Gỡ" },
  },
  Rating: {
    en: { label: "Rating" },
    vi: { label: "Đánh giá" },
  },
  InputOTP: {
    en: { label: "One-time code" },
    vi: { label: "Mã dùng một lần" },
  },
  PromptInput: {
    en: { placeholder: "Type your wish…", send: "Send", hint: "Lumi replies, then hands clear wishes to a human." },
    vi: { placeholder: "Nhập điều ước của bạn…", send: "Gửi", hint: "Lumi trả lời, rồi chuyển điều ước rõ ràng cho con người." },
  },
  HumanReviewGate: {
    en: { aria: "Human review gate", risk: "review required", approve: "Approve", reject: "Reject", reviewer: "Reviewer" },
    vi: { aria: "Cổng kiểm duyệt của con người", risk: "cần xem xét", approve: "Phê duyệt", reject: "Từ chối", reviewer: "Người duyệt" },
  },

  Switch: {
    en: { on: "On", off: "Off" },
    vi: { on: "Bật", off: "Tắt" },
  },
  Tabs: {
    en: { list: "Tabs" },
    vi: { list: "Tab" },
  },
  EmptyState: {
    en: { title: "Nothing here yet", action: "Get started" },
    vi: { title: "Chưa có gì ở đây", action: "Bắt đầu" },
  },
  Alert: {
    en: { dismiss: "Dismiss" },
    vi: { dismiss: "Đóng" },
  },
  Select: {
    en: { placeholder: "Select…" },
    vi: { placeholder: "Chọn…" },
  },
  Slider: {
    en: { label: "Slider" },
    vi: { label: "Thanh trượt" },
  },
  Steps: {
    en: { label: "Steps" },
    vi: { label: "Các bước" },
  },
  Toggle: {
    en: { pressed: "Pressed", unpressed: "Not pressed" },
    vi: { pressed: "Đang bật", unpressed: "Chưa bật" },
  },
  Menu: {
    en: { menu: "Menu" },
    vi: { menu: "Trình đơn" },
  },
  ContextMenu: {
    en: { menu: "Context menu" },
    vi: { menu: "Trình đơn ngữ cảnh" },
  },
  Tooltip: {
    en: { label: "Tooltip" },
    vi: { label: "Chú thích" },
  },
  ProgressBar: {
    en: { label: "Progress" },
    vi: { label: "Tiến độ" },
  },
};
