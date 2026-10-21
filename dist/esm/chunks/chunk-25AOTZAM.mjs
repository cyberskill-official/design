"use client";
import {
  useClientLayoutEffect
} from "./chunk-CQQ2JOJD.mjs";

// components/_i18n/i18n.js
import React from "react";

// components/_i18n/strings.js
var strings = {
  Chart: {
    en: { empty: "Chart with no data" },
    vi: { empty: "Biểu đồ chưa có dữ liệu" }
  },
  AIDisclosureBadge: {
    en: { label: "AI assisted", details: "This content was generated or transformed with AI assistance.", sources: "Sources" },
    vi: { label: "Có AI hỗ trợ", details: "Nội dung này được tạo hoặc chuyển đổi với sự hỗ trợ của AI.", sources: "Nguồn" }
  },
  CodeBlock: {
    en: { code: "code", copy: "Copy", copied: "Copied ✓" },
    vi: { code: "mã", copy: "Sao chép", copied: "Đã sao chép ✓" }
  },
  Pagination: {
    en: { label: "Pagination", prev: "Previous page", next: "Next page" },
    vi: { label: "Phân trang", prev: "Trang trước", next: "Trang sau" },
    ja: { label: "ページネーション", prev: "前のページ", next: "次のページ" }
  },
  Breadcrumb: {
    en: { label: "Breadcrumb" },
    vi: { label: "Đường dẫn" },
    ja: { label: "パンくずリスト" }
  },
  CommandPalette: {
    en: { placeholder: "Type a command or search…", empty: "No results", oneResult: "{count} result", results: "{count} results", aria: "Command palette", esc: "Esc" },
    vi: { placeholder: "Nhập lệnh hoặc tìm kiếm…", empty: "Không có kết quả", oneResult: "{count} kết quả", results: "{count} kết quả", aria: "Bảng lệnh", esc: "Esc" }
  },
  SearchField: {
    en: { placeholder: "Search…", clear: "Clear search" },
    vi: { placeholder: "Tìm kiếm…", clear: "Xóa tìm kiếm" },
    ja: { placeholder: "検索…", clear: "検索をクリア" }
  },
  NumberField: {
    en: { decrease: "Decrease", increase: "Increase", value: "Value" },
    vi: { decrease: "Giảm", increase: "Tăng", value: "Giá trị" }
  },
  FileUpload: {
    en: { title: "Drop files here or browse", hint: "PNG, JPG, or PDF up to 10MB" },
    vi: { title: "Kéo tệp vào đây hoặc chọn", hint: "PNG, JPG hoặc PDF, tối đa 10MB" }
  },
  Dialog: {
    en: { close: "Close", confirm: "Confirm", cancel: "Cancel" },
    vi: { close: "Đóng", confirm: "Xác nhận", cancel: "Hủy" },
    ja: { close: "閉じる", confirm: "確認", cancel: "キャンセル" }
  },
  AlertDialog: {
    en: { confirm: "Confirm", cancel: "Cancel" },
    vi: { confirm: "Xác nhận", cancel: "Hủy" }
  },
  Drawer: {
    en: { close: "Close", panel: "Side panel" },
    vi: { close: "Đóng", panel: "Bảng bên" }
  },
  TreeTable: {
    en: { empty: "No results", expand: "Expand", collapse: "Collapse" },
    vi: { empty: "Không có kết quả", expand: "Mở rộng", collapse: "Thu gọn" }
  },
  DataTable: {
    en: {
      empty: "No results",
      loading: "Loading table",
      error: "We couldn't load this table",
      errorHint: "Check your connection, then try again."
    },
    vi: {
      empty: "Không có kết quả",
      loading: "Đang tải bảng",
      error: "Không tải được bảng này",
      errorHint: "Kiểm tra kết nối, rồi thử lại."
    }
  },
  ConfidenceMeter: {
    en: { label: "Confidence", low: "Low", medium: "Medium", high: "High" },
    vi: { label: "Độ tin cậy", low: "Thấp", medium: "Trung bình", high: "Cao" }
  },
  Spinner: {
    en: { label: "Loading" },
    vi: { label: "Đang tải" }
  },
  Tag: {
    en: { remove: "Remove" },
    vi: { remove: "Gỡ" }
  },
  Toast: {
    en: { notifications: "Notifications", dismiss: "Close" },
    vi: { notifications: "Thông báo", dismiss: "Đóng" }
  },
  TypingIndicator: {
    en: { label: "Lumi is typing" },
    vi: { label: "Lumi đang nhập" }
  },
  Editor: {
    en: { toolbar: "Formatting", bold: "Bold", italic: "Italic", list: "Bullet list", area: "Rich text" },
    vi: { toolbar: "Định dạng", bold: "Đậm", italic: "Nghiêng", list: "Danh sách", area: "Văn bản" }
  },
  Terminal: {
    en: { input: "Terminal input", title: "cyberskill — zsh" },
    vi: { input: "Ô nhập lệnh", title: "cyberskill — zsh" }
  },
  DataGrid: {
    en: { empty: "No results", selectAll: "Select all rows", selectRow: "Select row", pin: "Pin this column", pinNamed: "Pin column {name}" },
    vi: { empty: "Không có kết quả", selectAll: "Chọn tất cả", selectRow: "Chọn dòng", pin: "Ghim cột này", pinNamed: "Ghim cột {name}" }
  },
  Splitter: {
    en: { label: "Resize panes" },
    vi: { label: "Đổi kích thước khung" }
  },
  HotKeys: {
    en: { title: "Keyboard shortcuts", toggle: "Toggle this sheet" },
    vi: { title: "Phím tắt", toggle: "Bật/tắt bảng này" }
  },
  ColorPicker: {
    en: { label: "Color", hex: "Hex value" },
    vi: { label: "Màu", hex: "Giá trị hex" }
  },
  Tour: {
    en: { skip: "Skip", back: "Back", next: "Next", done: "Done" },
    vi: { skip: "Bỏ qua", back: "Quay lại", next: "Tiếp", done: "Xong" }
  },
  TreeSelect: {
    en: { placeholder: "Select…" },
    vi: { placeholder: "Chọn…" }
  },
  Cascader: {
    en: { placeholder: "Select…" },
    vi: { placeholder: "Chọn…" }
  },
  Transfer: {
    en: { source: "Available", target: "Selected", toTarget: "Move to selected", toSource: "Move to available" },
    vi: { source: "Có sẵn", target: "Đã chọn", toTarget: "Chuyển sang đã chọn", toSource: "Chuyển về có sẵn" }
  },
  Mentions: {
    en: { placeholder: "Add a note — @ to mention" },
    vi: { placeholder: "Thêm ghi chú — gõ @ để nhắc tên" }
  },
  Sortable: {
    en: { moveUp: "Move up", moveDown: "Move down" },
    vi: { moveUp: "Di chuyển lên", moveDown: "Di chuyển xuống" }
  },
  Form: {
    en: { summary: "Please fix the following:", required: "required", requiredField: "Enter a value", arrayContext: "FormFieldArray must be used inside Form", addRow: "Add row", back: "Back", finish: "Finish", next: "Next", step: "Step" },
    vi: { summary: "Vui lòng sửa các mục sau:", required: "bắt buộc", requiredField: "Vui lòng nhập giá trị", arrayContext: "FormFieldArray phải được đặt bên trong Form", addRow: "Thêm dòng", back: "Quay lại", finish: "Hoàn tất", next: "Tiếp", step: "Bước" }
  },
  BackTop: {
    en: { label: "Back to top" },
    vi: { label: "Về đầu trang" }
  },
  Carousel: {
    en: { prev: "Previous slide", next: "Next slide", slide: "Slide" },
    vi: { prev: "Ảnh trước", next: "Ảnh sau", slide: "Ảnh" }
  },
  Comment: {
    en: { reply: "Reply" },
    vi: { reply: "Trả lời" }
  },
  Image: {
    en: { preview: "Preview image", close: "Close" },
    vi: { preview: "Xem ảnh", close: "Đóng" }
  },
  Toolbar: {
    en: { more: "More actions" },
    vi: { more: "Thao tác khác" }
  },
  Popconfirm: {
    en: { ok: "Confirm", cancel: "Cancel" },
    vi: { ok: "Xác nhận", cancel: "Hủy" }
  },
  Result: {
    en: { success: "Done", error: "We couldn't complete that", warning: "Please check", info: "Here's what happened" },
    vi: { success: "Hoàn tất", error: "Chúng tôi chưa hoàn tất được", warning: "Vui lòng kiểm tra", info: "Đây là điều đã xảy ra" }
  },
  InlineEdit: {
    en: { edit: "Edit", empty: "Add text" },
    vi: { edit: "Sửa", empty: "Thêm nội dung" }
  },
  Calendar: {
    en: { prev: "Previous month", next: "Next month" },
    vi: { prev: "Tháng trước", next: "Tháng sau" },
    ja: { prev: "前の月", next: "次の月" }
  },
  DatePicker: {
    en: { placeholder: "Select a date" },
    vi: { placeholder: "Chọn ngày" }
  },
  TimePicker: {
    en: { label: "Time" },
    vi: { label: "Giờ" }
  },
  Combobox: {
    en: { placeholder: "Select or type…", label: "Choose an option", empty: "No results" },
    vi: { placeholder: "Chọn hoặc nhập…", label: "Chọn mục", empty: "Không có kết quả" }
  },
  InputGroup: {
    en: { clear: "Clear", show: "Show password", hide: "Hide password", input: "Input" },
    vi: { clear: "Xóa", show: "Hiện mật khẩu", hide: "Ẩn mật khẩu", input: "Ô nhập" }
  },
  TagInput: {
    en: { placeholder: "Add a tag…", remove: "Remove" },
    vi: { placeholder: "Thêm thẻ…", remove: "Gỡ" }
  },
  Rating: {
    en: { label: "Rating" },
    vi: { label: "Đánh giá" }
  },
  InputOTP: {
    en: { label: "One-time code" },
    vi: { label: "Mã dùng một lần" }
  },
  PromptInput: {
    en: { placeholder: "Type your wish…", send: "Send", hint: "Lumi replies, then hands clear wishes to a human." },
    vi: { placeholder: "Nhập điều ước của bạn…", send: "Gửi", hint: "Lumi trả lời, rồi chuyển điều ước rõ ràng cho con người." }
  },
  HumanReviewGate: {
    en: { aria: "Human review gate", risk: "review required", approve: "Approve", reject: "Reject", reviewer: "Reviewer" },
    vi: { aria: "Cổng kiểm duyệt của con người", risk: "cần xem xét", approve: "Phê duyệt", reject: "Từ chối", reviewer: "Người duyệt" }
  },
  Switch: {
    en: { label: "Setting" },
    vi: { label: "Cài đặt" }
  },
  Tabs: {
    en: { list: "Tabs" },
    vi: { list: "Tab" }
  },
  EmptyState: {
    en: { title: "Nothing here yet", action: "Create your first item" },
    vi: { title: "Chưa có gì ở đây", action: "Tạo mục đầu tiên" }
  },
  Alert: {
    en: { dismiss: "Close" },
    vi: { dismiss: "Đóng" }
  },
  Select: {
    en: { placeholder: "Select…" },
    vi: { placeholder: "Chọn…" }
  },
  Slider: {
    en: { label: "Slider" },
    vi: { label: "Thanh trượt" }
  },
  Steps: {
    en: { label: "Steps" },
    vi: { label: "Các bước" }
  },
  Toggle: {
    en: { label: "Toggle" },
    vi: { label: "Nút bật tắt" }
  },
  Menu: {
    en: { menu: "Menu" },
    vi: { menu: "Trình đơn" }
  },
  Popover: {
    en: { panel: "Details" },
    vi: { panel: "Chi tiết" }
  },
  Menubar: {
    en: { label: "Application menu" },
    vi: { label: "Trình đơn ứng dụng" }
  },
  ContextMenu: {
    en: { menu: "Context menu" },
    vi: { menu: "Trình đơn ngữ cảnh" }
  },
  Tooltip: {
    en: { label: "Tooltip" },
    vi: { label: "Chú thích" }
  },
  CitationList: {
    en: { sources: "Sources" },
    vi: { sources: "Nguồn" }
  },
  ProgressBar: {
    en: { label: "Progress" },
    vi: { label: "Tiến độ" }
  },
  ChatMessage: {
    en: { you: "You" },
    vi: { you: "Bạn" }
  }
};
for (const namespace of Object.values(strings)) {
  for (const table of Object.values(namespace)) Object.freeze(table);
  Object.freeze(namespace);
}
Object.freeze(strings);

// components/_i18n/i18n.js
var knownLocales = Object.freeze(["vi", "en", "ja"]);
function primaryLang(tag) {
  if (tag == null) return null;
  const raw = String(tag).trim();
  if (!raw) return null;
  const lower = raw.toLowerCase().replace(/_/g, "-");
  if (lower === "tiếng việt" || lower === "tieng viet") return "vi";
  if (lower === "english") return "en";
  if (lower === "日本語" || lower === "japanese") return "ja";
  const primary = lower.split("-")[0];
  return primary || null;
}
function resolveLang(propLang, el) {
  let l = primaryLang(propLang);
  if (!l && el && el.closest) {
    const a = el.closest("[lang]");
    if (a) l = primaryLang(a.getAttribute("lang"));
  }
  if (!l && typeof document !== "undefined") {
    l = primaryLang(document.documentElement.getAttribute("lang"));
  }
  return l || "vi";
}
var forbiddenMessageKeys = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
var MessageContext;
function localeMessagesContext() {
  if (!MessageContext) MessageContext = React.createContext(null);
  return MessageContext;
}
function messageEntries(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new TypeError(label + " must be a plain message record");
  return Reflect.ownKeys(value).map((key) => {
    if (typeof key !== "string" || !key.trim() || forbiddenMessageKeys.has(key)) throw new TypeError("Unsafe message key");
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value")) throw new TypeError("Message accessors are not supported");
    return [key, descriptor.value];
  });
}
function snapshotLocaleMessages(messages) {
  const result = /* @__PURE__ */ Object.create(null);
  for (const [namespace, locales] of messageEntries(messages, "messages")) {
    const normalized = /* @__PURE__ */ Object.create(null);
    for (const [tag, values] of messageEntries(locales, namespace)) {
      const locale = primaryLang(tag);
      if (!locale || forbiddenMessageKeys.has(locale)) throw new TypeError("Unsafe message locale");
      if (Object.prototype.hasOwnProperty.call(normalized, locale)) throw new TypeError("Message locale aliases collide in " + namespace + ": " + locale);
      const table = /* @__PURE__ */ Object.create(null);
      for (const [key, value] of messageEntries(values, namespace + "." + tag)) {
        if (typeof value !== "string") throw new TypeError("Messages must be strings");
        table[key] = value;
      }
      normalized[locale] = Object.freeze(table);
    }
    result[namespace] = Object.freeze(normalized);
  }
  return Object.freeze(result);
}
function tr(component, key, lang, messages = null) {
  const c = Object.prototype.hasOwnProperty.call(strings, component) ? strings[component] : {};
  const want = primaryLang(lang) || "vi";
  for (const locale of /* @__PURE__ */ new Set([want, "en", "vi"])) {
    for (let layer = messages; layer; layer = layer.parent) {
      const table2 = layer.messages[component]?.[locale];
      if (table2 && Object.prototype.hasOwnProperty.call(table2, key)) return table2[key];
    }
    const table = c[locale];
    if (table && Object.prototype.hasOwnProperty.call(table, key) && table[key] != null) return table[key];
  }
  return key;
}
function makeT(component, lang, messages = null) {
  return (key) => tr(component, key, lang, messages);
}
function useLang(propLang) {
  const messages = React.useContext(localeMessagesContext());
  const ref = React.useRef(null);
  const binding = React.useRef(null);
  const [lang, setLang] = React.useState(() => resolveLang(propLang, null));
  useClientLayoutEffect(() => {
    const el = ref.current;
    setLang(resolveLang(propLang, el));
    const ancestors = [];
    for (let node = el; node; node = node.parentElement) ancestors.push(node);
    const previous = binding.current;
    if (previous && previous.propLang === propLang && previous.ancestors.length === ancestors.length && previous.ancestors.every((node, i) => node === ancestors[i])) return;
    previous?.observer?.disconnect();
    binding.current = { propLang, ancestors, observer: null };
    if (!el || primaryLang(propLang)) return;
    const obs = new MutationObserver(() => setLang(resolveLang(propLang, el)));
    for (const node of ancestors) {
      obs.observe(node, { attributes: true, attributeFilter: ["lang"] });
    }
    binding.current.observer = obs;
  });
  useClientLayoutEffect(() => () => {
    binding.current?.observer?.disconnect();
    binding.current = null;
  }, []);
  return [ref, lang, messages];
}
var VI_MONTHS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
function formatDate(d, lang) {
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return "";
  const L = primaryLang(lang) || "vi";
  if (L === "vi") {
    const p = (n) => String(n).padStart(2, "0");
    return p(dt.getDate()) + "/" + p(dt.getMonth() + 1) + "/" + dt.getFullYear();
  }
  if (L === "ja") {
    return dt.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
  }
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function monthName(i, lang) {
  const L = primaryLang(lang) || "vi";
  if (L === "vi") return VI_MONTHS[i];
  if (L === "ja") return new Date(2e3, i, 1).toLocaleDateString("ja-JP", { month: "long" });
  return new Date(2e3, i, 1).toLocaleDateString("en-US", { month: "long" });
}
function formatNumber(n, lang) {
  if (n == null || isNaN(n)) return "";
  const L = primaryLang(lang) || "vi";
  const locale = L === "vi" ? "vi-VN" : L === "ja" ? "ja-JP" : "en-US";
  return new Intl.NumberFormat(locale).format(n);
}

export {
  primaryLang,
  localeMessagesContext,
  snapshotLocaleMessages,
  makeT,
  useLang,
  formatDate,
  monthName,
  formatNumber
};
//# sourceMappingURL=chunk-25AOTZAM.mjs.map
