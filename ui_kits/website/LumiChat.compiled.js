(() => {
  // react-globals:react
  var R = window.React;
  var react_default = R;
  var Children = R.Children;
  var Component = R.Component;
  var Fragment = R.Fragment;
  var StrictMode = R.StrictMode;
  var Suspense = R.Suspense;
  var cloneElement = R.cloneElement;
  var createContext = R.createContext;
  var createElement = R.createElement;
  var createRef = R.createRef;
  var forwardRef = R.forwardRef;
  var isValidElement = R.isValidElement;
  var lazy = R.lazy;
  var memo = R.memo;
  var startTransition = R.startTransition;
  var useCallback = R.useCallback;
  var useContext = R.useContext;
  var useDebugValue = R.useDebugValue;
  var useDeferredValue = R.useDeferredValue;
  var useEffect = R.useEffect;
  var useId = R.useId;
  var useImperativeHandle = R.useImperativeHandle;
  var useInsertionEffect = R.useInsertionEffect;
  var useLayoutEffect = R.useLayoutEffect;
  var useMemo = R.useMemo;
  var useReducer = R.useReducer;
  var useRef = R.useRef;
  var useState = R.useState;
  var useSyncExternalStore = R.useSyncExternalStore;
  var useTransition = R.useTransition;

  // react-globals:react-dom/client
  var createRoot = (...a) => window.ReactDOM.createRoot(...a);

  // react-globals:react/jsx-runtime
  function jsx(type, props, key) {
    const next = key === void 0 ? { ...props } : { ...props, key };
    const { children, ...rest } = next;
    if (Array.isArray(children)) return window.React.createElement(type, rest, ...children);
    if (children !== void 0) return window.React.createElement(type, rest, children);
    return window.React.createElement(type, rest);
  }
  var jsxs = jsx;
  var Fragment2 = window.React.Fragment;

  // packages/react/dist/components/_utils/cx.js
  function cx(...c) {
    return c.filter(Boolean).join(" ");
  }

  // packages/react/dist/components/ai/AIDisclosureBadge.js
  var AIDisclosureBadge = react_default.forwardRef(function AIDisclosureBadge2({
    label = "AI assisted",
    details = "This content was generated or transformed with AI assistance.",
    sources = [],
    className
  }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const panelId = react_default.useId();
    const sourceList = (sources || []).filter(Boolean);
    return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-ai-disclosure", className), children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "cs-ai-disclosure__badge",
          "aria-expanded": open,
          "aria-controls": panelId,
          onClick: () => setOpen((v) => !v),
          children: label
        }
      ),
      open ? /* @__PURE__ */ jsxs("span", { id: panelId, role: "status", className: "cs-ai-disclosure__panel", children: [
        /* @__PURE__ */ jsx("span", { className: "cs-ai-disclosure__details", children: details }),
        sourceList.length ? /* @__PURE__ */ jsxs("span", { className: "cs-ai-disclosure__sources", children: [
          "Sources: ",
          sourceList.join(", ")
        ] }) : null
      ] }) : null
    ] });
  });

  // packages/react/dist/components/_utils/merge-refs.js
  function mergeRefs(...refs) {
    return (node) => {
      for (const r of refs) {
        if (typeof r === "function") r(node);
        else if (r && typeof r === "object") r.current = node;
      }
    };
  }

  // packages/react/dist/components/_i18n/strings.js
  var strings = {
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

  // packages/react/dist/components/_i18n/i18n.js
  var knownLocales = Object.freeze(["vi", "en", "ja"]);
  function primaryLang(tag) {
    if (tag == null) return null;
    const raw = String(tag).trim();
    if (!raw) return null;
    const lower = raw.toLowerCase().replace(/_/g, "-");
    if (lower === "pseudo" || lower === "en-xa" || lower.startsWith("en-xa")) return "pseudo";
    if (lower === "ti\u1EBFng vi\u1EC7t" || lower === "tieng viet") return "vi";
    if (lower === "english") return "en";
    if (lower === "\u65E5\u672C\u8A9E" || lower === "japanese") return "ja";
    if (lower.startsWith("vi")) return "vi";
    if (lower.startsWith("en")) return "en";
    if (lower.startsWith("ja")) return "ja";
    const primary = lower.split("-")[0];
    return primary || null;
  }
  function applyPseudo(str) {
    if (str == null) return str;
    return "\u27E6" + String(str) + "\u27E7";
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
  function tr(component, key, lang) {
    const c = strings[component] || {};
    const want = primaryLang(lang) === "pseudo" ? "en" : primaryLang(lang) || "vi";
    const table = c[want] || c.en || c.vi || {};
    let out;
    if (table[key] != null) out = table[key];
    else {
      const en = c.en || {};
      if (en[key] != null) out = en[key];
      else {
        const vi = c.vi || {};
        out = vi[key] != null ? vi[key] : key;
      }
    }
    return primaryLang(lang) === "pseudo" ? applyPseudo(out) : out;
  }
  function makeT(component, lang) {
    return (key) => tr(component, key, lang);
  }
  function useLang(propLang) {
    const ref = react_default.useRef(null);
    const [lang, setLang] = react_default.useState(() => resolveLang(propLang, null));
    react_default.useLayoutEffect(() => {
      const el = ref.current;
      setLang(resolveLang(propLang, el));
      if (!el || propLang) return void 0;
      const obs = new MutationObserver(() => setLang(resolveLang(propLang, el)));
      let node = el.parentElement;
      while (node) {
        obs.observe(node, { attributes: true, attributeFilter: ["lang"] });
        node = node.parentElement;
      }
      return () => obs.disconnect();
    }, [propLang]);
    return [ref, lang];
  }

  // packages/react/dist/components/ai/ChatMessage.js
  var ChatMessage = react_default.forwardRef(function ChatMessage2({ role = "lumi", name, avatar, lang, className, children }, forwardedRef) {
    const isUser = role === "user";
    const [ref, L] = useLang(lang);
    const t = makeT("ChatMessage", L);
    const you = t("you");
    const defaultAvatar = isUser ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: you }) : /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }) });
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-chat-msg", isUser ? "cs-chat-msg--user" : "cs-chat-msg--lumi", className), children: [
      /* @__PURE__ */ jsx("div", { className: "cs-chat-msg__avatar", children: avatar ?? defaultAvatar }),
      /* @__PURE__ */ jsxs("div", { className: "cs-chat-msg__col", children: [
        /* @__PURE__ */ jsx("div", { className: "cs-chat-msg__name", children: name ?? (isUser ? you : "Lumi") }),
        /* @__PURE__ */ jsx("div", { className: "cs-chat-msg__bubble", children })
      ] })
    ] });
  });

  // packages/react/dist/components/ai/CitationList.js
  var CitationList = react_default.forwardRef(function CitationList2({ label = "Sources", items = [], className }, forwardedRef) {
    return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-citations", className), children: [
      label ? /* @__PURE__ */ jsx("div", { className: "cs-citations__label", children: label }) : null,
      items.map((it, i) => {
        const inner = /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsx("span", { className: "cs-citation__num", children: i + 1 }),
          /* @__PURE__ */ jsxs("span", { className: "cs-citation__text", children: [
            it.title,
            it.source ? /* @__PURE__ */ jsxs("span", { className: "cs-citation__src", children: [
              " \xB7 ",
              it.source
            ] }) : null
          ] })
        ] });
        return it.href ? /* @__PURE__ */ jsx("a", { className: "cs-citation", href: it.href, target: "_blank", rel: "noreferrer", children: inner }, i) : /* @__PURE__ */ jsx("div", { className: "cs-citation", children: inner }, i);
      })
    ] });
  });

  // packages/react/dist/components/ai/ConfidenceMeter.js
  var TONE = {
    low: { color: "var(--cs-color-semantic-danger)", label: "Low", fill: 2 },
    medium: { color: "var(--cs-color-semantic-warning)", label: "Medium", fill: 3 },
    high: { color: "var(--cs-color-semantic-success)", label: "High", fill: 5 }
  };
  var ConfidenceMeter = react_default.forwardRef(function ConfidenceMeter2({ value, level, segments = 5, label, lang, className }, forwardedRef) {
    let tone, filled;
    const segs = Math.max(1, Number(segments) || 5);
    if (value != null) {
      const v = Math.max(0, Math.min(1, Number(value) || 0));
      tone = v < 0.4 ? "low" : v < 0.75 ? "medium" : "high";
      filled = Math.max(0, Math.min(segs, Math.round(v * segs)));
    } else {
      tone = TONE[level] ? level : "medium";
      filled = Math.max(0, Math.min(segs, Math.round(TONE[tone].fill / 5 * segs)));
    }
    const meta = TONE[tone];
    const [ref, L] = useLang(lang);
    const t = makeT("ConfidenceMeter", L);
    const lbl = label != null ? label : t("label");
    const levelText = t(tone);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-confidence", className), children: [
      /* @__PURE__ */ jsxs("div", { className: "cs-confidence__head", children: [
        /* @__PURE__ */ jsx("span", { children: lbl }),
        /* @__PURE__ */ jsx("span", { className: "cs-confidence__level", style: { color: meta.color }, children: levelText })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cs-confidence__track", role: "meter", "aria-valuemin": 0, "aria-valuemax": segs, "aria-valuenow": filled, "aria-label": lbl + ": " + levelText, children: Array.from({ length: segs }).map((_, i) => /* @__PURE__ */ jsx("span", { className: "cs-confidence__seg", style: i < filled ? { background: meta.color } : void 0 }, i)) })
    ] });
  });

  // packages/react/dist/components/ai/PromptInput.js
  var PromptInput = react_default.forwardRef(function PromptInput2({
    value,
    onChange,
    onSubmit,
    placeholder,
    sendLabel,
    hint,
    lang,
    disabled = false,
    busy = false,
    className
  }, forwardedRef) {
    const [inner, setInner] = react_default.useState("");
    const val = value != null ? value : inner;
    const setVal = (v) => onChange ? onChange(v) : setInner(v);
    const submit = () => {
      if (!disabled && !busy && String(val).trim()) onSubmit && onSubmit(val);
    };
    const [ref, L] = useLang(lang);
    const t = makeT("PromptInput", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    const sl = sendLabel != null ? sendLabel : t("send");
    const ht = hint !== void 0 ? hint : t("hint");
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-prompt", className), children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "cs-prompt__field",
          rows: 1,
          value: val,
          placeholder: ph,
          disabled,
          onChange: (e) => setVal(e.target.value),
          onKeyDown: (e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "cs-prompt__bar", children: [
        ht ? /* @__PURE__ */ jsxs("span", { className: "cs-prompt__hint", children: [
          /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }) }),
          ht
        ] }) : null,
        /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-button cs-button--primary cs-button--sm", onClick: submit, disabled: disabled || busy, children: [
          busy ? /* @__PURE__ */ jsx("span", { className: "cs-button__spinner", "aria-hidden": "true" }) : null,
          sl
        ] })
      ] })
    ] });
  });

  // packages/react/dist/components/ai/PromptSuggestions.js
  var PromptSuggestions = react_default.forwardRef(function PromptSuggestions2({ suggestions = [], onSelect, className }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-suggest", className), children: suggestions.map((s, i) => {
      const label = typeof s === "string" ? s : s.label;
      const icon = typeof s === "string" ? null : s.icon;
      return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onSelect && onSelect(label), children: [
        icon ?? /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }) }),
        label
      ] }, i);
    }) });
  });

  // packages/react/dist/components/ai/TypingIndicator.js
  var TypingIndicator = react_default.forwardRef(function TypingIndicator2({ label, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const lbl = label != null ? label : makeT("TypingIndicator", L)("label");
    return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-typing", className), role: "status", "aria-label": lbl, children: [
      /* @__PURE__ */ jsx("span", {}),
      /* @__PURE__ */ jsx("span", {}),
      /* @__PURE__ */ jsx("span", {})
    ] });
  });

  // packages/react/dist/components/brand/LumiAvatar.js
  var LumiAvatar = react_default.forwardRef(function LumiAvatar2({ src, size = "md", ring = false, alt = "Lumi", className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsx("span", { ref: forwardedRef, className: cx("cs-lumi", `cs-lumi--${size}`, ring && "cs-lumi--ring", className), ...props, children: src ? /* @__PURE__ */ jsx("img", { src, alt }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2726" }) });
  });

  // packages/react/dist/components/button/Button.js
  var Button = react_default.forwardRef(function Button2({
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    children,
    className,
    type = "button",
    ...props
  }, ref) {
    const isDisabled = disabled || loading;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ...props,
        ref,
        type,
        disabled: isDisabled,
        "aria-busy": loading || void 0,
        className: cx(
          "cs-button",
          `cs-button--${variant}`,
          `cs-button--${size}`,
          fullWidth && "cs-button--full",
          isDisabled && "is-disabled",
          loading && "is-loading",
          className
        ),
        children: [
          icon ? /* @__PURE__ */ jsx("span", { className: "cs-button__icon", "aria-hidden": "true", children: icon }) : null,
          /* @__PURE__ */ jsx("span", { className: "cs-button__label", children }),
          loading ? /* @__PURE__ */ jsx("span", { className: "cs-button__spinner", "aria-hidden": "true" }) : null
        ]
      }
    );
  });

  // packages/react/dist/components/feedback/Badge.js
  var Badge = react_default.forwardRef(function Badge2({ variant = "neutral", dot = false, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-badge", variant !== "neutral" && `cs-badge--${variant}`, className), ...props, children: [
      dot ? /* @__PURE__ */ jsx("span", { className: "cs-badge__dot", "aria-hidden": "true" }) : null,
      children
    ] });
  });

  // packages/react/dist/components/navigation/Sidebar.js
  var Sidebar = react_default.forwardRef(function Sidebar2({ label, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("nav", { ref: forwardedRef, className: cx("cs-sidebar", className), ...props, children: [
      label ? /* @__PURE__ */ jsx("div", { className: "cs-sidebar__label", children: label }) : null,
      children
    ] });
  });
  var NavItem = react_default.forwardRef(function NavItem2({ icon, active = false, trail, href, onClick, children, className, ...props }, forwardedRef) {
    const Tag = href ? "a" : "button";
    return /* @__PURE__ */ jsxs(Tag, { ref: forwardedRef, className: cx("cs-nav-item", active && "is-active", className), href, "aria-current": active ? "page" : void 0, onClick, ...props, children: [
      icon ? /* @__PURE__ */ jsx("span", { className: "cs-nav-item__icon", children: icon }) : null,
      /* @__PURE__ */ jsx("span", { children }),
      trail != null ? /* @__PURE__ */ jsx("span", { className: "cs-nav-item__trail", children: trail }) : null
    ] });
  });

  // ui_kits/website/LumiChat.jsx
  function LumiPage() {
    const [msgs, setMsgs] = useState([{ who: "lumi", kind: "intro" }]);
    const [typing, setTyping] = useState(false);
    const threadRef = useRef(null);
    useEffect(() => {
      const t = threadRef.current;
      if (t) t.scrollTop = t.scrollHeight;
    }, [msgs, typing]);
    function ask(text) {
      const m = (text || "").trim();
      if (!m) return;
      setMsgs((c) => [...c, { who: "user", text: m }]);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs((c) => [...c, { who: "lumi", kind: "answer", text: m }]);
      }, 1100);
    }
    return /* @__PURE__ */ jsxs("div", { className: "lumi-page", children: [
      /* @__PURE__ */ jsxs("aside", { className: "lumi-side", children: [
        /* @__PURE__ */ jsxs("div", { className: "lumi-brand", children: [
          /* @__PURE__ */ jsx("img", { src: "../../assets/logo-mark.svg", alt: "" }),
          "CyberSkill"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lumi-new", children: /* @__PURE__ */ jsx(Button, { variant: "primary", size: "sm", fullWidth: true, onClick: () => setMsgs([{ who: "lumi", kind: "intro" }]), children: "\u2726 New wish" }) }),
        /* @__PURE__ */ jsx("div", { className: "lumi-conv-label", children: "Recent" }),
        /* @__PURE__ */ jsxs(Sidebar, { children: [
          /* @__PURE__ */ jsx(NavItem, { active: true, children: "A faster checkout" }),
          /* @__PURE__ */ jsx(NavItem, { children: "Internal ops console" }),
          /* @__PURE__ */ jsx(NavItem, { children: "Bilingual design system" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lumi-side-foot", children: /* @__PURE__ */ jsx(NavItem, { icon: /* @__PURE__ */ jsx(LumiAvatar, { size: "sm" }), children: "Lumi \xB7 genie mode" }) })
      ] }),
      /* @__PURE__ */ jsxs("main", { id: "main", className: "lumi-main", children: [
        /* @__PURE__ */ jsxs("header", { className: "lumi-top", children: [
          /* @__PURE__ */ jsx(LumiAvatar, { src: "../../assets/lumi-poster.webp", size: "md", ring: true }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { children: "Lumi" }),
            /* @__PURE__ */ jsx("div", { className: "sub", children: "Golden genie \xB7 replies, then hands clear wishes to a human" })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto" }, children: /* @__PURE__ */ jsx(Badge, { variant: "info", children: "AI-native" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lumi-thread", ref: threadRef, children: /* @__PURE__ */ jsxs("div", { className: "lumi-thread-inner", children: [
          msgs.map((m, i) => {
            if (m.who === "user") return /* @__PURE__ */ jsx(ChatMessage, { role: "user", children: m.text }, i);
            if (m.kind === "intro") {
              return /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(ChatMessage, { role: "lumi", avatar: /* @__PURE__ */ jsx(LumiAvatar, { size: "sm" }), children: "Hello, I\u2019m Lumi. Tell me a wish, and I\u2019ll share plain advice before asking for anything. When a wish is clear, it goes to a real person on the team." }),
                /* @__PURE__ */ jsx("div", { style: { marginTop: 12, marginLeft: 42 }, children: /* @__PURE__ */ jsx(PromptSuggestions, { suggestions: ["A web app", "An internal tool", "A design system"], onSelect: ask }) })
              ] }, i);
            }
            return /* @__PURE__ */ jsx(ChatMessage, { role: "lumi", avatar: /* @__PURE__ */ jsx(LumiAvatar, { size: "sm" }), children: /* @__PURE__ */ jsxs("div", { className: "lumi-answer-card", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                "A wish worth granting. For \u201C",
                m.text,
                "\u201D, I\u2019d start with a two-week shaping sprint \u2014 scope, a clickable prototype, and an honest estimate. Shall I hand this to the team?"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "lumi-answer-meta", children: [
                /* @__PURE__ */ jsx(ConfidenceMeter, { value: 0.82, label: "Confidence" }),
                /* @__PURE__ */ jsx(AIDisclosureBadge, { label: "AI assisted", details: "Draft plan generated by Lumi from your wish, reviewed before handoff.", sources: ["Services", "Process"] })
              ] }),
              /* @__PURE__ */ jsx(CitationList, { label: "Grounded in", items: [{ title: "What we build", source: "Services" }, { title: "The arc of a wish", source: "Process" }] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: [
                /* @__PURE__ */ jsx(Button, { size: "sm", children: "Hand to the team" }),
                /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", children: "Keep refining" })
              ] })
            ] }) }, i);
          }),
          typing && /* @__PURE__ */ jsx(ChatMessage, { role: "lumi", avatar: /* @__PURE__ */ jsx(LumiAvatar, { size: "sm" }), children: /* @__PURE__ */ jsx(TypingIndicator, {}) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "lumi-compose", children: /* @__PURE__ */ jsx("div", { className: "lumi-compose-inner", children: /* @__PURE__ */ jsx(PromptInput, { onSubmit: ask, placeholder: "Make a wish\u2026", sendLabel: "Send" }) }) })
      ] })
    ] });
  }
  createRoot(document.getElementById("root")).render(createElement(LumiPage));
})();
