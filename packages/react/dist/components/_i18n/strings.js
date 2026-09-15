const strings = {
  Pagination: {
    en: { label: "Pagination", prev: "Previous page", next: "Next page" },
    vi: { label: "Ph\xE2n trang", prev: "Trang tr\u01B0\u1EDBc", next: "Trang sau" },
    ja: { label: "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3", prev: "\u524D\u306E\u30DA\u30FC\u30B8", next: "\u6B21\u306E\u30DA\u30FC\u30B8" }
  },
  Breadcrumb: {
    en: { label: "Breadcrumb" },
    vi: { label: "\u0110\u01B0\u1EDDng d\u1EABn" },
    ja: { label: "\u30D1\u30F3\u304F\u305A\u30EA\u30B9\u30C8" }
  },
  CommandPalette: {
    en: { placeholder: "Type a command or search\u2026", empty: "No results", aria: "Command palette", esc: "Esc" },
    vi: { placeholder: "Nh\u1EADp l\u1EC7nh ho\u1EB7c t\xECm ki\u1EBFm\u2026", empty: "Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3", aria: "B\u1EA3ng l\u1EC7nh", esc: "Esc" }
  },
  SearchField: {
    en: { placeholder: "Search\u2026", clear: "Clear search" },
    vi: { placeholder: "T\xECm ki\u1EBFm\u2026", clear: "X\xF3a t\xECm ki\u1EBFm" },
    ja: { placeholder: "\u691C\u7D22\u2026", clear: "\u691C\u7D22\u3092\u30AF\u30EA\u30A2" }
  },
  NumberField: {
    en: { decrease: "Decrease", increase: "Increase", value: "Value" },
    vi: { decrease: "Gi\u1EA3m", increase: "T\u0103ng", value: "Gi\xE1 tr\u1ECB" }
  },
  FileUpload: {
    en: { title: "Drop files here or browse", hint: "PNG, JPG, or PDF up to 10MB" },
    vi: { title: "K\xE9o t\u1EC7p v\xE0o \u0111\xE2y ho\u1EB7c ch\u1ECDn", hint: "PNG, JPG ho\u1EB7c PDF, t\u1ED1i \u0111a 10MB" }
  },
  Dialog: {
    en: { close: "Close", confirm: "Confirm", cancel: "Cancel" },
    vi: { close: "\u0110\xF3ng", confirm: "X\xE1c nh\u1EADn", cancel: "H\u1EE7y" },
    ja: { close: "\u9589\u3058\u308B", confirm: "\u78BA\u8A8D", cancel: "\u30AD\u30E3\u30F3\u30BB\u30EB" }
  },
  AlertDialog: {
    en: { confirm: "Confirm", cancel: "Cancel" },
    vi: { confirm: "X\xE1c nh\u1EADn", cancel: "H\u1EE7y" }
  },
  Drawer: {
    en: { close: "Close", panel: "Side panel" },
    vi: { close: "\u0110\xF3ng", panel: "B\u1EA3ng b\xEAn" }
  },
  DataTable: {
    en: {
      empty: "No results",
      loading: "Loading table",
      error: "We couldn't load this table",
      errorHint: "Check your connection, then try again."
    },
    vi: {
      empty: "Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3",
      loading: "\u0110ang t\u1EA3i b\u1EA3ng",
      error: "Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c b\u1EA3ng n\xE0y",
      errorHint: "Ki\u1EC3m tra k\u1EBFt n\u1ED1i, r\u1ED3i th\u1EED l\u1EA1i."
    }
  },
  ConfidenceMeter: {
    en: { label: "Confidence", low: "Low", medium: "Medium", high: "High" },
    vi: { label: "\u0110\u1ED9 tin c\u1EADy", low: "Th\u1EA5p", medium: "Trung b\xECnh", high: "Cao" }
  },
  Spinner: {
    en: { label: "Loading" },
    vi: { label: "\u0110ang t\u1EA3i" }
  },
  Tag: {
    en: { remove: "Remove" },
    vi: { remove: "G\u1EE1" }
  },
  Toast: {
    en: { notifications: "Notifications", dismiss: "Close" },
    vi: { notifications: "Th\xF4ng b\xE1o", dismiss: "\u0110\xF3ng" }
  },
  TypingIndicator: {
    en: { label: "Lumi is typing" },
    vi: { label: "Lumi \u0111ang nh\u1EADp" }
  },
  Editor: {
    en: { toolbar: "Formatting", bold: "Bold", italic: "Italic", list: "Bullet list", area: "Rich text" },
    vi: { toolbar: "\u0110\u1ECBnh d\u1EA1ng", bold: "\u0110\u1EADm", italic: "Nghi\xEAng", list: "Danh s\xE1ch", area: "V\u0103n b\u1EA3n" }
  },
  Terminal: {
    en: { input: "Terminal input", title: "cyberskill \u2014 zsh" },
    vi: { input: "\xD4 nh\u1EADp l\u1EC7nh", title: "cyberskill \u2014 zsh" }
  },
  DataGrid: {
    en: { empty: "No results", selectAll: "Select all rows", selectRow: "Select row", pin: "Pin this column", pinNamed: "Pin column {name}" },
    vi: { empty: "Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3", selectAll: "Ch\u1ECDn t\u1EA5t c\u1EA3", selectRow: "Ch\u1ECDn d\xF2ng", pin: "Ghim c\u1ED9t n\xE0y", pinNamed: "Ghim c\u1ED9t {name}" }
  },
  Splitter: {
    en: { label: "Resize panes" },
    vi: { label: "\u0110\u1ED5i k\xEDch th\u01B0\u1EDBc khung" }
  },
  HotKeys: {
    en: { title: "Keyboard shortcuts", toggle: "Toggle this sheet" },
    vi: { title: "Ph\xEDm t\u1EAFt", toggle: "B\u1EADt/t\u1EAFt b\u1EA3ng n\xE0y" }
  },
  ColorPicker: {
    en: { label: "Color", hex: "Hex value" },
    vi: { label: "M\xE0u", hex: "Gi\xE1 tr\u1ECB hex" }
  },
  Tour: {
    en: { skip: "Skip", back: "Back", next: "Next", done: "Done" },
    vi: { skip: "B\u1ECF qua", back: "Quay l\u1EA1i", next: "Ti\u1EBFp", done: "Xong" }
  },
  TreeSelect: {
    en: { placeholder: "Select\u2026" },
    vi: { placeholder: "Ch\u1ECDn\u2026" }
  },
  Cascader: {
    en: { placeholder: "Select\u2026" },
    vi: { placeholder: "Ch\u1ECDn\u2026" }
  },
  Transfer: {
    en: { source: "Available", target: "Selected", toTarget: "Move to selected", toSource: "Move to available" },
    vi: { source: "C\xF3 s\u1EB5n", target: "\u0110\xE3 ch\u1ECDn", toTarget: "Chuy\u1EC3n sang \u0111\xE3 ch\u1ECDn", toSource: "Chuy\u1EC3n v\u1EC1 c\xF3 s\u1EB5n" }
  },
  Mentions: {
    en: { placeholder: "Add a note \u2014 @ to mention" },
    vi: { placeholder: "Th\xEAm ghi ch\xFA \u2014 g\xF5 @ \u0111\u1EC3 nh\u1EAFc t\xEAn" }
  },
  Sortable: {
    en: { moveUp: "Move up", moveDown: "Move down", moved: "{item} moved to position {position}" },
    vi: { moveUp: "Di chuy\u1EC3n l\xEAn", moveDown: "Di chuy\u1EC3n xu\u1ED1ng", moved: "\u0110\xE3 chuy\u1EC3n {item} t\u1EDBi v\u1ECB tr\xED {position}" }
  },
  Form: {
    en: { summary: "Please fix the following:", required: "required", requiredField: "Enter a value" },
    vi: { summary: "Vui l\xF2ng s\u1EEDa c\xE1c m\u1EE5c sau:", required: "b\u1EAFt bu\u1ED9c", requiredField: "Vui l\xF2ng nh\u1EADp gi\xE1 tr\u1ECB" }
  },
  BackTop: {
    en: { label: "Back to top" },
    vi: { label: "V\u1EC1 \u0111\u1EA7u trang" }
  },
  Carousel: {
    en: { prev: "Previous slide", next: "Next slide", slide: "Slide" },
    vi: { prev: "\u1EA2nh tr\u01B0\u1EDBc", next: "\u1EA2nh sau", slide: "\u1EA2nh" }
  },
  Comment: {
    en: { reply: "Reply" },
    vi: { reply: "Tr\u1EA3 l\u1EDDi" }
  },
  Image: {
    en: { preview: "Preview image", close: "Close", previewOpen: "Image preview opened" },
    vi: { preview: "Xem \u1EA3nh", close: "\u0110\xF3ng", previewOpen: "\u0110\xE3 m\u1EDF xem \u1EA3nh" }
  },
  Toolbar: {
    en: { more: "More actions" },
    vi: { more: "Thao t\xE1c kh\xE1c" }
  },
  Popconfirm: {
    en: { ok: "Confirm", cancel: "Cancel" },
    vi: { ok: "X\xE1c nh\u1EADn", cancel: "H\u1EE7y" }
  },
  Result: {
    en: { success: "Done", error: "We couldn't complete that", warning: "Please check", info: "Here's what happened" },
    vi: { success: "Ho\xE0n t\u1EA5t", error: "Ch\xFAng t\xF4i ch\u01B0a ho\xE0n t\u1EA5t \u0111\u01B0\u1EE3c", warning: "Vui l\xF2ng ki\u1EC3m tra", info: "\u0110\xE2y l\xE0 \u0111i\u1EC1u \u0111\xE3 x\u1EA3y ra" }
  },
  InlineEdit: {
    en: { edit: "Edit", empty: "Add text" },
    vi: { edit: "S\u1EEDa", empty: "Th\xEAm n\u1ED9i dung" }
  },
  Calendar: {
    en: { prev: "Previous month", next: "Next month" },
    vi: { prev: "Th\xE1ng tr\u01B0\u1EDBc", next: "Th\xE1ng sau" }
  },
  DatePicker: {
    en: { placeholder: "Select a date" },
    vi: { placeholder: "Ch\u1ECDn ng\xE0y" }
  },
  TimePicker: {
    en: { label: "Time" },
    vi: { label: "Gi\u1EDD" }
  },
  Combobox: {
    en: { placeholder: "Select or type\u2026", empty: "No results" },
    vi: { placeholder: "Ch\u1ECDn ho\u1EB7c nh\u1EADp\u2026", empty: "Kh\xF4ng c\xF3 k\u1EBFt qu\u1EA3" }
  },
  InputGroup: {
    en: { clear: "Clear", show: "Show password", hide: "Hide password", input: "Input" },
    vi: { clear: "X\xF3a", show: "Hi\u1EC7n m\u1EADt kh\u1EA9u", hide: "\u1EA8n m\u1EADt kh\u1EA9u", input: "\xD4 nh\u1EADp" }
  },
  TagInput: {
    en: { placeholder: "Add a tag\u2026", remove: "Remove" },
    vi: { placeholder: "Th\xEAm th\u1EBB\u2026", remove: "G\u1EE1" }
  },
  Rating: {
    en: { label: "Rating" },
    vi: { label: "\u0110\xE1nh gi\xE1" }
  },
  InputOTP: {
    en: { label: "One-time code" },
    vi: { label: "M\xE3 d\xF9ng m\u1ED9t l\u1EA7n" }
  },
  PromptInput: {
    en: { placeholder: "Type your wish\u2026", send: "Send", hint: "Lumi replies, then hands clear wishes to a human." },
    vi: { placeholder: "Nh\u1EADp \u0111i\u1EC1u \u01B0\u1EDBc c\u1EE7a b\u1EA1n\u2026", send: "G\u1EEDi", hint: "Lumi tr\u1EA3 l\u1EDDi, r\u1ED3i chuy\u1EC3n \u0111i\u1EC1u \u01B0\u1EDBc r\xF5 r\xE0ng cho con ng\u01B0\u1EDDi." }
  },
  HumanReviewGate: {
    en: { aria: "Human review gate", risk: "review required", approve: "Approve", reject: "Reject", reviewer: "Reviewer" },
    vi: { aria: "C\u1ED5ng ki\u1EC3m duy\u1EC7t c\u1EE7a con ng\u01B0\u1EDDi", risk: "c\u1EA7n xem x\xE9t", approve: "Ph\xEA duy\u1EC7t", reject: "T\u1EEB ch\u1ED1i", reviewer: "Ng\u01B0\u1EDDi duy\u1EC7t" }
  },
  Switch: {
    en: { on: "On", off: "Off" },
    vi: { on: "B\u1EADt", off: "T\u1EAFt" }
  },
  Tabs: {
    en: { list: "Tabs" },
    vi: { list: "Tab" }
  },
  EmptyState: {
    en: { title: "Nothing here yet", action: "Create your first item" },
    vi: { title: "Ch\u01B0a c\xF3 g\xEC \u1EDF \u0111\xE2y", action: "T\u1EA1o m\u1EE5c \u0111\u1EA7u ti\xEAn" }
  },
  Alert: {
    en: { dismiss: "Close" },
    vi: { dismiss: "\u0110\xF3ng" }
  },
  Select: {
    en: { placeholder: "Select\u2026" },
    vi: { placeholder: "Ch\u1ECDn\u2026" }
  },
  Slider: {
    en: { label: "Slider" },
    vi: { label: "Thanh tr\u01B0\u1EE3t" }
  },
  Steps: {
    en: { label: "Steps" },
    vi: { label: "C\xE1c b\u01B0\u1EDBc" }
  },
  Toggle: {
    en: { pressed: "Pressed", unpressed: "Not pressed" },
    vi: { pressed: "\u0110ang b\u1EADt", unpressed: "Ch\u01B0a b\u1EADt" }
  },
  Menu: {
    en: { menu: "Menu" },
    vi: { menu: "Tr\xECnh \u0111\u01A1n" }
  },
  ContextMenu: {
    en: { menu: "Context menu" },
    vi: { menu: "Tr\xECnh \u0111\u01A1n ng\u1EEF c\u1EA3nh" }
  },
  Tooltip: {
    en: { label: "Tooltip" },
    vi: { label: "Ch\xFA th\xEDch" }
  },
  ProgressBar: {
    en: { label: "Progress" },
    vi: { label: "Ti\u1EBFn \u0111\u1ED9" }
  },
  ChatMessage: {
    en: { you: "You" },
    vi: { you: "B\u1EA1n" }
  }
};
export {
  strings
};
