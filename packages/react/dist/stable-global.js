"use client";
var CyberSkillReact = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/react/index.js
  var index_exports = {};
  __export(index_exports, {
    AIDisclosureBadge: () => AIDisclosureBadge,
    ALLOWED_URL_SCHEMES: () => ALLOWED_URL_SCHEMES,
    Accordion: () => Accordion,
    Alert: () => Alert,
    AlertDialog: () => AlertDialog,
    Anchor: () => Anchor,
    AspectRatio: () => AspectRatio,
    Avatar: () => Avatar,
    AvatarGroup: () => AvatarGroup,
    BackTop: () => BackTop,
    Badge: () => Badge,
    Breadcrumb: () => Breadcrumb,
    Button: () => Button,
    ButtonGroup: () => ButtonGroup,
    CONTRAST_VALUES: () => CONTRAST_VALUES,
    CS_ICONS: () => CS_ICONS,
    CS_LOGO_MARK_INNER: () => CS_LOGO_MARK_INNER,
    CS_LOGO_VIEWBOX: () => CS_LOGO_VIEWBOX,
    Calendar: () => Calendar,
    Card: () => Card,
    CardBody: () => CardBody,
    CardFooter: () => CardFooter,
    CardHeader: () => CardHeader,
    Carousel: () => Carousel,
    Cascader: () => Cascader,
    Chart: () => Chart,
    ChatMessage: () => ChatMessage,
    Checkbox: () => Checkbox,
    CitationList: () => CitationList,
    CodeBlock: () => CodeBlock,
    Collapsible: () => Collapsible,
    ColorPicker: () => ColorPicker,
    Combobox: () => Combobox,
    CommandPalette: () => CommandPalette,
    Comment: () => Comment,
    ConfidenceMeter: () => ConfidenceMeter,
    ContextMenu: () => ContextMenu,
    DENSITY_VALUES: () => DENSITY_VALUES,
    DataGrid: () => DataGrid,
    DataTable: () => DataTable,
    DatePicker: () => DatePicker,
    DescriptionList: () => DescriptionList,
    Dialog: () => Dialog,
    Divider: () => Divider,
    Dock: () => Dock,
    Drawer: () => Drawer,
    EDITOR_SCHEMA: () => EDITOR_SCHEMA2,
    Editor: () => Editor,
    EmptyState: () => EmptyState,
    FileUpload: () => FileUpload,
    FloatingActionButton: () => FloatingActionButton,
    Form: () => Form,
    FormField: () => FormField,
    FormFieldArray: () => FormFieldArray,
    FormWizard: () => FormWizard,
    HotKeys: () => HotKeys,
    HoverCard: () => HoverCard,
    HumanReviewGate: () => HumanReviewGate,
    Icon: () => Icon,
    Image: () => Image,
    InlineEdit: () => InlineEdit,
    InputGroup: () => InputGroup,
    InputOTP: () => InputOTP,
    Item: () => Item,
    Kbd: () => Kbd,
    Link: () => Link,
    List: () => List,
    ListItem: () => ListItem,
    Logo: () => Logo,
    LumiAvatar: () => LumiAvatar,
    Masonry: () => Masonry,
    Mentions: () => Mentions,
    Menu: () => Menu,
    MenuItem: () => MenuItem,
    Menubar: () => Menubar,
    NativeSelect: () => NativeSelect,
    NavItem: () => NavItem,
    NavigationMenu: () => NavigationMenu,
    NumberField: () => NumberField,
    OverlayProvider: () => OverlayProvider,
    Pagination: () => Pagination,
    Popconfirm: () => Popconfirm,
    Popover: () => Popover,
    ProgressBar: () => ProgressBar,
    PromptInput: () => PromptInput,
    PromptSuggestions: () => PromptSuggestions,
    QRCode: () => QRCode,
    REMOVED_TAGS: () => REMOVED_TAGS,
    Radio: () => Radio,
    RadioGroup: () => RadioGroup,
    Rating: () => Rating,
    Result: () => Result,
    ScrollArea: () => ScrollArea,
    SearchField: () => SearchField,
    SegmentedControl: () => SegmentedControl,
    Select: () => Select,
    Sidebar: () => Sidebar,
    Skeleton: () => Skeleton,
    Slider: () => Slider,
    Sortable: () => Sortable,
    Spinner: () => Spinner,
    Splitter: () => Splitter,
    Stat: () => Stat,
    StatusIndicator: () => StatusIndicator,
    Steps: () => Steps,
    Switch: () => Switch,
    THEME_VALUES: () => THEME_VALUES,
    Tab: () => Tab,
    Tabs: () => Tabs,
    Tag: () => Tag,
    TagInput: () => TagInput,
    Terminal: () => Terminal,
    TextField: () => TextField,
    Textarea: () => Textarea,
    ThemeProvider: () => ThemeProvider,
    TimePicker: () => TimePicker,
    Timeline: () => Timeline,
    Toast: () => Toast,
    ToastStack: () => ToastStack,
    Toggle: () => Toggle,
    Toolbar: () => Toolbar,
    Tooltip: () => Tooltip,
    Tour: () => Tour,
    Transfer: () => Transfer,
    Tree: () => Tree,
    TreeSelect: () => TreeSelect,
    TreeTable: () => TreeTable,
    TypingIndicator: () => TypingIndicator,
    Watermark: () => Watermark
  });

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

  // packages/react/dist/components/_theme/provider.js
  var ThemeContext = react_default.createContext(null);
  var THEME_VALUES = Object.freeze(["light", "dark", "system"]);
  var CONTRAST_VALUES = Object.freeze(["standard", "high"]);
  var DENSITY_VALUES = Object.freeze(["comfortable", "compact"]);
  function prefersDark() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function resolveTheme(theme) {
    if (theme === "dark" || theme === "light") return theme;
    return prefersDark() ? "dark" : "light";
  }
  function applyDom(theme, contrast, density, dir, element, variant) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme === "dark" || theme === "light" || theme === "system" ? theme : "system");
    root.setAttribute("data-cs-contrast", contrast === "high" ? "high" : "standard");
    root.setAttribute("data-cs-density", density === "compact" ? "compact" : "comfortable");
    if (dir === "rtl" || dir === "ltr") root.setAttribute("dir", dir);
    if (element) {
      root.setAttribute("data-cs-element", element);
      if (variant) root.setAttribute("data-cs-variant", variant);
      else root.removeAttribute("data-cs-variant");
    }
  }
  function ThemeProvider({
    children,
    theme: themeProp,
    defaultTheme = "system",
    contrast: contrastProp,
    defaultContrast = "standard",
    density: densityProp,
    defaultDensity = "comfortable",
    dir = "ltr",
    element = "",
    variant = "",
    storageKey = "cs-theme",
    contrastKey = "cs-contrast",
    densityKey = "cs-density",
    className
  }) {
    const [themeState, setThemeState] = react_default.useState(defaultTheme);
    const [contrastState, setContrastState] = react_default.useState(defaultContrast);
    const [densityState, setDensityState] = react_default.useState(defaultDensity);
    const [hydrated, setHydrated] = react_default.useState(false);
    react_default.useEffect(() => {
      try {
        const storedTheme = localStorage.getItem(storageKey);
        const storedContrast = localStorage.getItem(contrastKey);
        const storedDensity = localStorage.getItem(densityKey);
        if (themeProp == null && storedTheme && THEME_VALUES.includes(storedTheme)) {
          setThemeState(storedTheme);
        }
        if (contrastProp == null && storedContrast && CONTRAST_VALUES.includes(storedContrast)) {
          setContrastState(storedContrast);
        }
        if (densityProp == null && storedDensity && DENSITY_VALUES.includes(storedDensity)) {
          setDensityState(storedDensity);
        }
      } catch {
      }
      setHydrated(true);
    }, [storageKey, contrastKey, densityKey, themeProp, contrastProp, densityProp]);
    const theme = themeProp != null ? themeProp : themeState;
    const contrast = contrastProp != null ? contrastProp : contrastState;
    const density = densityProp != null ? densityProp : densityState;
    const resolvedTheme = resolveTheme(theme);
    react_default.useEffect(() => {
      applyDom(theme, contrast, density, dir, element, variant);
      if (!hydrated) return;
      try {
        if (themeProp == null) localStorage.setItem(storageKey, theme);
        if (contrastProp == null) localStorage.setItem(contrastKey, contrast);
        if (densityProp == null) localStorage.setItem(densityKey, density);
      } catch {
      }
    }, [theme, contrast, density, dir, element, variant, hydrated, storageKey, contrastKey, densityKey, themeProp, contrastProp, densityProp]);
    const setTheme = react_default.useCallback((next) => {
      if (!THEME_VALUES.includes(next)) return;
      setThemeState(next);
    }, []);
    const setContrast = react_default.useCallback((next) => {
      if (!CONTRAST_VALUES.includes(next)) return;
      setContrastState(next);
    }, []);
    const setDensity = react_default.useCallback((next) => {
      if (!DENSITY_VALUES.includes(next)) return;
      setDensityState(next);
    }, []);
    const value = react_default.useMemo(
      () => ({ theme, resolvedTheme, contrast, density, dir, element, variant, setTheme, setContrast, setDensity }),
      [theme, resolvedTheme, contrast, density, dir, element, variant, setTheme, setContrast, setDensity]
    );
    return react_default.createElement(
      ThemeContext.Provider,
      { value },
      react_default.createElement(
        "div",
        {
          className: ["cs-root", "cs-theme-provider", className].filter(Boolean).join(" "),
          "data-theme": theme,
          "data-cs-contrast": contrast,
          "data-cs-density": density,
          "data-cs-element": element || void 0,
          "data-cs-variant": variant || void 0,
          dir
        },
        children
      )
    );
  }

  // packages/react/dist/components/_utils/sanitize-html.js
  var ALLOWED_URL_SCHEMES = Object.freeze(["http:", "https:", "mailto:", "tel:"]);
  var REMOVED_TAGS = Object.freeze([
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "base",
    "form",
    "input",
    "textarea",
    "select",
    "button",
    "svg",
    "math"
  ]);

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
  var VI_MONTHS = ["Th\xE1ng 1", "Th\xE1ng 2", "Th\xE1ng 3", "Th\xE1ng 4", "Th\xE1ng 5", "Th\xE1ng 6", "Th\xE1ng 7", "Th\xE1ng 8", "Th\xE1ng 9", "Th\xE1ng 10", "Th\xE1ng 11", "Th\xE1ng 12"];
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

  // packages/react/dist/components/ai/HumanReviewGate.js
  var HumanReviewGate = react_default.forwardRef(function HumanReviewGate2({
    risk,
    summary,
    reviewer,
    onApprove,
    onReject,
    approveLabel,
    rejectLabel,
    lang,
    className
  }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("HumanReviewGate", L);
    const rk = risk != null ? risk : t("risk");
    const al = approveLabel != null ? approveLabel : t("approve");
    const rl = rejectLabel != null ? rejectLabel : t("reject");
    return /* @__PURE__ */ jsxs("section", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-review-gate", className), "aria-label": t("aria"), children: [
      /* @__PURE__ */ jsx("div", { className: "cs-review-gate__risk", children: rk }),
      /* @__PURE__ */ jsx("p", { className: "cs-review-gate__summary", children: summary }),
      reviewer ? /* @__PURE__ */ jsxs("p", { className: "cs-review-gate__reviewer", children: [
        t("reviewer"),
        ": ",
        reviewer
      ] }) : null,
      /* @__PURE__ */ jsxs("div", { className: "cs-review-gate__actions", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary", onClick: onReject, children: rl }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--primary", onClick: onApprove, children: al })
      ] })
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

  // packages/react/dist/components/button/ButtonGroup.js
  var ButtonGroup = react_default.forwardRef(function ButtonGroup2({ children, label, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-btngroup", className), role: "group", "aria-label": label, ...props, children });
  });

  // packages/react/dist/components/button/FloatingActionButton.js
  var FloatingActionButton = react_default.forwardRef(function FloatingActionButton2({ icon, label, actions = [], onClick, position = "fixed", className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const main = () => {
      if (actions.length) setOpen((o) => !o);
      else onClick && onClick();
    };
    return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-fab", position === "static" && "cs-fab--static", className), children: [
      open && actions.length ? /* @__PURE__ */ jsx("div", { className: "cs-fab__dial", children: actions.map((a, i) => /* @__PURE__ */ jsx("button", { type: "button", className: "cs-fab__mini", "aria-label": a.label, title: a.label, onClick: () => {
        setOpen(false);
        a.onSelect && a.onSelect();
      }, children: a.icon }, i)) }) : null,
      /* @__PURE__ */ jsx("button", { type: "button", className: "cs-fab__main", "aria-label": label, "aria-expanded": actions.length ? open : void 0, onClick: main, children: icon })
    ] });
  });

  // packages/react/dist/components/data/Accordion.js
  var Accordion = react_default.forwardRef(function Accordion2({ items = [], defaultOpen = 0, allowMultiple = false, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(() => allowMultiple ? defaultOpen != null ? [defaultOpen] : [] : defaultOpen);
    const isOpen = (i) => allowMultiple ? open.includes(i) : open === i;
    const toggle = (i) => {
      if (allowMultiple) setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i]);
      else setOpen((o) => o === i ? -1 : i);
    };
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-accordion", className), children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: "cs-accordion__item", children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-accordion__trigger", "aria-expanded": isOpen(i), onClick: () => toggle(i), children: [
        it.title,
        /* @__PURE__ */ jsx("span", { className: "cs-accordion__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
      ] }),
      isOpen(i) ? /* @__PURE__ */ jsx("div", { className: "cs-accordion__panel", children: it.content }) : null
    ] }, i)) });
  });

  // packages/react/dist/components/data/AspectRatio.js
  var AspectRatio = react_default.forwardRef(function AspectRatio2({ ratio = "16 / 9", children, className, style, ...props }, forwardedRef) {
    const ar = typeof ratio === "number" ? String(ratio) : ratio;
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: forwardedRef,
        className: cx("cs-aspect-ratio", className),
        style: { ...style || {}, aspectRatio: ar },
        ...props,
        children
      }
    );
  });

  // packages/react/dist/components/data/Avatar.js
  var Avatar = react_default.forwardRef(function Avatar2({ src, name = "", size = "md", square = false, className, ...props }, forwardedRef) {
    const initials = name ? name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
    return /* @__PURE__ */ jsx("span", { ref: forwardedRef, className: cx("cs-avatar", `cs-avatar--${size}`, square && "cs-avatar--square", className), title: name || void 0, ...props, children: src ? /* @__PURE__ */ jsx("img", { src, alt: name }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: initials }) });
  });
  var AvatarGroup = react_default.forwardRef(function AvatarGroup2({ className, children }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-avatar-group", className), children });
  });

  // packages/react/dist/components/data/Card.js
  var Card = react_default.forwardRef(function Card2({ interactive = false, flat = false, as, className, children, ...props }, forwardedRef) {
    const Tag3 = as || (interactive ? "button" : "div");
    return /* @__PURE__ */ jsx(Tag3, { ref: forwardedRef, className: cx("cs-card", flat && "cs-card--flat", interactive && "cs-card--interactive", className), ...props, children });
  });
  var CardHeader = react_default.forwardRef(function CardHeader2({ title, subtitle, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-card__header", className), ...props, children: [
      title ? /* @__PURE__ */ jsx("h3", { className: "cs-card__title", children: title }) : null,
      subtitle ? /* @__PURE__ */ jsx("p", { className: "cs-card__subtitle", children: subtitle }) : null,
      children
    ] });
  });
  var CardBody = react_default.forwardRef(function CardBody2({ className, children, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-card__body", className), ...props, children });
  });
  var CardFooter = react_default.forwardRef(function CardFooter2({ className, children, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-card__footer", className), ...props, children });
  });

  // packages/react/dist/components/data/Carousel.js
  var Carousel = react_default.forwardRef(function Carousel2({ children, startIndex = 0, label, lang, className }, forwardedRef) {
    const slides = react_default.Children.toArray(children);
    const [i, setI] = react_default.useState(Math.min(startIndex, Math.max(0, slides.length - 1)));
    const [ref, L] = useLang(lang);
    const t = makeT("Carousel", L);
    const go = (n) => setI((n + slides.length) % slides.length);
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        go(i + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        go(i - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setI(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setI(Math.max(0, slides.length - 1));
      }
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: mergeRefs(ref, forwardedRef),
        className: cx("cs-carousel", className),
        role: "region",
        "aria-roledescription": "carousel",
        "aria-label": label,
        onKeyDown,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "cs-sr-only", "aria-live": "polite", "aria-atomic": "true", children: [
            t("slide"),
            " ",
            i + 1,
            "/",
            slides.length
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "cs-carousel__view", children: [
            /* @__PURE__ */ jsx("div", { className: "cs-carousel__track", style: { transform: "translateX(-" + i * 100 + "%)" }, children: slides.map((s, j) => /* @__PURE__ */ jsx("div", { className: "cs-carousel__slide", role: "group", "aria-roledescription": "slide", "aria-hidden": j !== i, "aria-label": `${j + 1} / ${slides.length}`, children: s }, j)) }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "cs-carousel__nav prev", "aria-label": t("prev"), onClick: () => go(i - 1), children: "\u2039" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "cs-carousel__nav next", "aria-label": t("next"), onClick: () => go(i + 1), children: "\u203A" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "cs-carousel__dots", role: "tablist", "aria-label": label || t("slide"), children: slides.map((_, j) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "tab",
              className: "cs-carousel__dot",
              "aria-label": t("slide") + " " + (j + 1) + "/" + slides.length,
              "aria-selected": j === i,
              "aria-current": j === i ? "true" : void 0,
              tabIndex: j === i ? 0 : -1,
              onClick: () => setI(j)
            },
            j
          )) })
        ]
      }
    );
  });

  // packages/react/dist/components/data/Chart.js
  var Chart = react_default.forwardRef(function Chart2({ type = "bar", data = [], height = 160, color = "var(--cs-accent)", showValues = false, label, className }, forwardedRef) {
    const W = 320, H = height, max = Math.max(1, ...data.map((d) => d.value));
    let body = null;
    if (type === "pie") {
      const total = data.reduce((a, d) => a + d.value, 0) || 1;
      const cols = [color, "var(--cs-accent-strong)", "var(--cs-accent-grad-b)", "var(--cs-color-text-muted)", "var(--cs-color-border-default)"];
      let a0 = -Math.PI / 2;
      body = /* @__PURE__ */ jsx("svg", { viewBox: "0 0 120 120", width: H, height: H, "aria-hidden": "true", children: data.map((d, i) => {
        const a1 = a0 + d.value / total * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const p = `M60 60 L${60 + 50 * Math.cos(a0)} ${60 + 50 * Math.sin(a0)} A50 50 0 ${large} 1 ${60 + 50 * Math.cos(a1)} ${60 + 50 * Math.sin(a1)} Z`;
        a0 = a1;
        return /* @__PURE__ */ jsx("path", { d: p, fill: cols[i % cols.length], stroke: "var(--cs-color-surface-panel)", strokeWidth: "1.5" }, i);
      }) });
    } else if (type === "line" || type === "spark") {
      const pts = data.map((d, i) => `${i / Math.max(1, data.length - 1) * (W - 8) + 4},${H - 6 - d.value / max * (H - 24)}`).join(" ");
      body = /* @__PURE__ */ jsxs("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: H, preserveAspectRatio: "none", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("polyline", { points: pts, fill: "none", stroke: color, strokeWidth: "2.4", strokeLinejoin: "round", strokeLinecap: "round" }),
        type === "line" ? data.map((d, i) => /* @__PURE__ */ jsx("circle", { cx: i / Math.max(1, data.length - 1) * (W - 8) + 4, cy: H - 6 - d.value / max * (H - 24), r: "3.4", fill: color }, i)) : null
      ] });
    } else {
      const bw = (W - 8) / data.length;
      body = /* @__PURE__ */ jsx("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: H, preserveAspectRatio: "none", "aria-hidden": "true", children: data.map((d, i) => {
        const h = d.value / max * (H - 26);
        return /* @__PURE__ */ jsx("rect", { x: 4 + i * bw + bw * 0.14, y: H - 20 - h, width: bw * 0.72, height: h, rx: "3", fill: color }, i);
      }) });
    }
    return /* @__PURE__ */ jsxs("figure", { ref: forwardedRef, className: cx("cs-chart", className), role: "img", "aria-label": label || data.map((d) => d.label + ": " + d.value).join(", "), children: [
      body,
      type !== "spark" ? /* @__PURE__ */ jsx("figcaption", { className: "cs-chart__legend", children: data.map((d, i) => /* @__PURE__ */ jsxs("span", { children: [
        d.label,
        showValues ? /* @__PURE__ */ jsxs("b", { children: [
          " ",
          d.value
        ] }) : null
      ] }, i)) }) : null
    ] });
  });

  // packages/react/dist/components/data/CodeBlock.js
  var CodeBlock = react_default.forwardRef(function CodeBlock2({ code = "", filename, language = "code", showBar = true, className }, forwardedRef) {
    const [copied, setCopied] = react_default.useState(false);
    const copy = () => {
      try {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      } catch (e) {
      }
    };
    return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-code", className), children: [
      showBar ? /* @__PURE__ */ jsxs("div", { className: "cs-code__bar", children: [
        /* @__PURE__ */ jsx("span", { children: filename || language }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-code__copy", onClick: copy, children: copied ? "Copied \u2713" : "Copy" })
      ] }) : null,
      /* @__PURE__ */ jsx("pre", { children: /* @__PURE__ */ jsx("code", { children: code }) })
    ] });
  });

  // packages/react/dist/components/data/Collapsible.js
  var Collapsible = react_default.forwardRef(function Collapsible2({
    open,
    defaultOpen = false,
    onOpenChange,
    title,
    trigger,
    children,
    className,
    ...props
  }, forwardedRef) {
    const uncontrolled = open === void 0;
    const [internal, setInternal] = react_default.useState(!!defaultOpen);
    const isOpen = uncontrolled ? internal : !!open;
    const setOpen = (next) => {
      if (uncontrolled) setInternal(next);
      onOpenChange?.(next);
    };
    const label = title ?? trigger;
    const panelId = react_default.useId();
    const triggerId = react_default.useId();
    return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-collapsible", className), ...props, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          id: triggerId,
          className: "cs-collapsible__trigger",
          "aria-expanded": isOpen,
          "aria-controls": panelId,
          onClick: () => setOpen(!isOpen),
          children: [
            /* @__PURE__ */ jsx("span", { className: "cs-collapsible__label", children: label }),
            /* @__PURE__ */ jsx("span", { className: "cs-collapsible__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
          ]
        }
      ),
      isOpen ? /* @__PURE__ */ jsx("div", { id: panelId, role: "region", "aria-labelledby": triggerId, className: "cs-collapsible__panel", children }) : null
    ] });
  });

  // packages/react/dist/components/data/Comment.js
  var Comment = react_default.forwardRef(function Comment2({ avatar, author, meta, children, actions = [], replies, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Comment", L);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-comment", className), children: [
      avatar ? /* @__PURE__ */ jsx("span", { className: "cs-comment__avatar", children: avatar }) : null,
      /* @__PURE__ */ jsxs("div", { className: "cs-comment__main", children: [
        /* @__PURE__ */ jsxs("div", { className: "cs-comment__head", children: [
          /* @__PURE__ */ jsx("b", { children: author }),
          meta ? /* @__PURE__ */ jsx("span", { className: "cs-comment__meta", children: meta }) : null
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cs-comment__body", children }),
        /* @__PURE__ */ jsx("div", { className: "cs-comment__actions", children: (actions.length ? actions : [{ label: t("reply") }]).map((a, i) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => a.onSelect && a.onSelect(), children: a.label }, i)) }),
        replies ? /* @__PURE__ */ jsx("div", { className: "cs-comment__replies", children: replies }) : null
      ] })
    ] });
  });

  // packages/react/dist/components/data/DescriptionList.js
  var DescriptionList = react_default.forwardRef(function DescriptionList2({ items = [], className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsx("dl", { ref: forwardedRef, className: cx("cs-dl", className), ...props, children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("dt", { children: it.term }),
      /* @__PURE__ */ jsx("dd", { children: it.value })
    ] }, i)) });
  });

  // packages/react/dist/components/data/Divider.js
  var Divider = react_default.forwardRef(function Divider2({ vertical = false, label, className, children, ...props }, forwardedRef) {
    if (label) {
      return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-divider", "cs-divider--label", className), role: "separator", ...props, children: label });
    }
    return /* @__PURE__ */ jsx("hr", { className: cx("cs-divider", vertical && "cs-divider--vertical", className), "aria-orientation": vertical ? "vertical" : "horizontal", ...props });
  });

  // packages/react/dist/components/icon/Icon.js
  var CS_ICONS = {
    close: { viewBox: "0 0 24 24", els: [["path", { d: "M6 6l12 12M18 6L6 18" }]] },
    sun: { viewBox: "0 0 24 24", els: [
      ["circle", { cx: 12, cy: 12, r: 4 }],
      ["path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" }]
    ] },
    moon: { viewBox: "0 0 24 24", els: [["path", { d: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" }]] },
    "arrow-right": { viewBox: "0 0 24 24", els: [["path", { d: "M5 12h14M13 6l6 6-6 6" }]] },
    check: { viewBox: "0 0 24 24", els: [["path", { d: "M4 12.5l5 5 11-11" }]] },
    sparkle: { viewBox: "0 0 24 24", els: [["path", { d: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" }]] },
    chat: { viewBox: "0 0 24 24", els: [["path", { d: "M4 5h16v11H8l-4 4z" }]] },
    "sound-on": { viewBox: "0 0 24 24", els: [
      ["path", { d: "M5 9v6h3l4 4V5L8 9z" }],
      ["path", { d: "M15 9.5a4 4 0 0 1 0 5M17.6 7a8 8 0 0 1 0 10" }]
    ] },
    "sound-off": { viewBox: "0 0 24 24", els: [
      ["path", { d: "M5 9v6h3l4 4V5L8 9z" }],
      ["path", { d: "M16 9.5l4.5 5M20.5 9.5l-4.5 5" }]
    ] },
    // v2.0 extension — same grammar: line, currentColor, 1.75, round, 24×24
    search: { viewBox: "0 0 24 24", els: [["circle", { cx: 11, cy: 11, r: 6 }], ["path", { d: "M20 20l-4.2-4.2" }]] },
    sliders: { viewBox: "0 0 24 24", els: [
      ["path", { d: "M4 6h16M4 12h16M4 18h16" }],
      ["circle", { cx: 9, cy: 6, r: 2 }],
      ["circle", { cx: 15, cy: 12, r: 2 }],
      ["circle", { cx: 7, cy: 18, r: 2 }]
    ] },
    upload: { viewBox: "0 0 24 24", els: [["path", { d: "M12 15V4M7 8.5L12 4l5 4.5" }], ["path", { d: "M4 19h16" }]] },
    download: { viewBox: "0 0 24 24", els: [["path", { d: "M12 4v11M7 10.5L12 15l5-4.5" }], ["path", { d: "M4 19h16" }]] },
    calendar: { viewBox: "0 0 24 24", els: [["rect", { x: 4, y: 6, width: 16, height: 14, rx: 2 }], ["path", { d: "M4 10.5h16M8 3.5v4M16 3.5v4" }]] },
    user: { viewBox: "0 0 24 24", els: [["circle", { cx: 12, cy: 8.5, r: 3.5 }], ["path", { d: "M5 19.5c1.6-3.4 4-5 7-5s5.4 1.6 7 5" }]] },
    plus: { viewBox: "0 0 24 24", els: [["path", { d: "M12 5v14M5 12h14" }]] },
    trash: { viewBox: "0 0 24 24", els: [["path", { d: "M5 7h14M9.5 7V4.5h5V7" }], ["path", { d: "M7 7l.8 12.5h8.4L17 7M10 11v5M14 11v5" }]] },
    external: { viewBox: "0 0 24 24", els: [["path", { d: "M14 4h6v6M20 4l-8 8" }], ["path", { d: "M18 13v6H5V6h6" }]] },
    menu: { viewBox: "0 0 24 24", els: [["path", { d: "M4 7h16M4 12h16M4 17h16" }]] },
    // v2.13 extension — common chevrons + edit/copy/info/warning (same grammar)
    "chevron-down": { viewBox: "0 0 24 24", els: [["path", { d: "M6 9l6 6 6-6" }]] },
    "chevron-up": { viewBox: "0 0 24 24", els: [["path", { d: "M6 15l6-6 6 6" }]] },
    "chevron-left": { viewBox: "0 0 24 24", els: [["path", { d: "M15 6l-6 6 6 6" }]] },
    "chevron-right": { viewBox: "0 0 24 24", els: [["path", { d: "M9 6l6 6-6 6" }]] },
    edit: { viewBox: "0 0 24 24", els: [["path", { d: "M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17z" }], ["path", { d: "M13.5 6.5l3 3" }]] },
    copy: { viewBox: "0 0 24 24", els: [["rect", { x: 8, y: 8, width: 12, height: 12, rx: 2 }], ["path", { d: "M4 16V6a2 2 0 0 1 2-2h10" }]] },
    info: { viewBox: "0 0 24 24", els: [["circle", { cx: 12, cy: 12, r: 9 }], ["path", { d: "M12 11v5M12 7.75v.01" }]] },
    "alert-triangle": { viewBox: "0 0 24 24", els: [["path", { d: "M12 3.5l9 16H3z" }], ["path", { d: "M12 10v4M12 17.5v.01" }]] },
    pin: { viewBox: "0 0 24 24", els: [["path", { d: "M12 21v-7" }], ["path", { d: "M8.5 3.5h7l-1.2 6.5h2.7L12 14.5 6.999 10h2.7z" }]] }
  };
  var Icon = react_default.forwardRef(function Icon2({ name, size = "md", label, className, strokeWidth = 1.75, ...props }, forwardedRef) {
    const def = CS_ICONS[name] || CS_ICONS.sparkle;
    const dim = `var(--cs-icon-${size}, 20px)`;
    const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false };
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref: forwardedRef,
        ...props,
        className,
        viewBox: def.viewBox,
        style: { width: dim, height: dim, display: "inline-block", flex: "none", ...props.style || {} },
        fill: "none",
        stroke: "currentColor",
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...a11y,
        children: def.els.map(([tag, attrs], i) => react_default.createElement(tag, { key: i, ...attrs }))
      }
    );
  });

  // packages/react/dist/components/overlays/OverlayManager.js
  var focusableSelector = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    "audio[controls]",
    "video[controls]",
    "summary",
    "iframe",
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");
  function attachFocusTrap(panelEl, { handleEscape = false, onEscape } = {}) {
    if (!panelEl) return () => {
    };
    const focusables = () => [...panelEl.querySelectorAll(focusableSelector)];
    const k = (e) => {
      if (handleEscape && e.key === "Escape") {
        onEscape && onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) {
        e.preventDefault();
        panelEl.focus();
        return;
      }
      const a = f[0];
      const z = f[f.length - 1];
      const active = document.activeElement;
      const inside = panelEl.contains(active);
      if (e.shiftKey && (!inside || active === a)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && (!inside || active === z)) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }
  function createOverlayManager() {
    const layers = [];
    let prevOverflow = "";
    let locked = false;
    let escapeBound = false;
    const resort = () => {
      layers.sort((a, b) => {
        const pa = a.panelEl;
        const pb = b.panelEl;
        if (pa && pb && pa !== pb) {
          if (pa.contains(pb)) return -1;
          if (pb.contains(pa)) return 1;
        }
        return (a.seq || 0) - (b.seq || 0);
      });
    };
    const applyScroll = () => {
      const need = layers.some((l) => l.kind === "modal" && l.lockScroll !== false);
      if (need && !locked) {
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        locked = true;
      } else if (!need && locked) {
        document.body.style.overflow = prevOverflow;
        locked = false;
      }
    };
    const onDocEscape = (e) => {
      if (e.key !== "Escape") return;
      if (!layers.length) return;
      resort();
      const top = layers[layers.length - 1];
      if (!top || typeof top.onEscape !== "function") return;
      e.preventDefault();
      e.stopPropagation();
      top.onEscape();
    };
    const ensureEscape = () => {
      if (escapeBound) return;
      escapeBound = true;
      document.addEventListener("keydown", onDocEscape, true);
    };
    let seq = 0;
    return {
      register(layer) {
        ensureEscape();
        const id = layer.id || `cs-ov-${++seq}`;
        const entry = { ...layer, id, seq: ++seq };
        layers.push(entry);
        resort();
        applyScroll();
        return () => {
          resort();
          const i = layers.findIndex((l) => l.id === id);
          const wasTop = i === layers.length - 1;
          if (i >= 0) layers.splice(i, 1);
          applyScroll();
          if (wasTop && entry.restoreEl && typeof entry.restoreEl.focus === "function") {
            try {
              entry.restoreEl.focus();
            } catch {
            }
          }
        };
      },
      top() {
        resort();
        return layers[layers.length - 1] || null;
      },
      get scrollLocked() {
        return locked;
      },
      get depth() {
        return layers.length;
      }
    };
  }
  var defaultManager = createOverlayManager();
  var OverlayContext = react_default.createContext(null);
  function OverlayProvider({ children }) {
    const api = react_default.useMemo(() => createOverlayManager(), []);
    return /* @__PURE__ */ jsxs(OverlayContext.Provider, { value: api, children: [
      /* @__PURE__ */ jsx("div", { id: "cs-overlay-root", "data-cs-overlay-root": "" }),
      children
    ] });
  }
  function useOverlayLayer({
    open,
    kind = "modal",
    trapFocus = false,
    lockScroll,
    onEscape,
    panelRef,
    preferFocusSelector
  }) {
    const ctx = react_default.useContext(OverlayContext);
    const mgr = ctx || defaultManager;
    const escapeRef = react_default.useRef(onEscape);
    escapeRef.current = onEscape;
    react_default.useLayoutEffect(() => {
      if (!open) return void 0;
      const restoreEl = typeof document !== "undefined" ? document.activeElement : null;
      const panel = panelRef && panelRef.current;
      const unregister = mgr.register({
        kind,
        lockScroll: lockScroll != null ? lockScroll : kind === "modal",
        onEscape: () => escapeRef.current && escapeRef.current(),
        restoreEl,
        panelEl: panel || null
      });
      let detachTrap = () => {
      };
      const top = mgr.top();
      const isTop = top && top.panelEl === panel;
      if (trapFocus && panel && isTop) {
        const preferred = preferFocusSelector && panel.querySelector(preferFocusSelector) || panel.querySelector(focusableSelector) || panel;
        preferred && preferred.focus && preferred.focus();
        detachTrap = attachFocusTrap(panel, { handleEscape: false });
      }
      return () => {
        detachTrap();
        unregister();
      };
    }, [open, kind, trapFocus, lockScroll, mgr, panelRef, preferFocusSelector]);
    return { manager: mgr };
  }

  // packages/react/dist/components/data/Image.js
  var Image = react_default.forwardRef(function Image2({ src, alt = "", ratio, preview = false, fallback, lang, className, ...props }, forwardedRef) {
    const [state, setState] = react_default.useState("loading");
    const [zoom, setZoom] = react_default.useState(false);
    const [ref, L] = useLang(lang);
    const t = makeT("Image", L);
    const panel = react_default.useRef(null);
    const live = react_default.useRef(null);
    useOverlayLayer({
      open: zoom,
      kind: "modal",
      trapFocus: true,
      onEscape: () => setZoom(false),
      panelRef: panel
    });
    react_default.useEffect(() => {
      if (!live.current) return;
      live.current.textContent = zoom ? t("previewOpen") : "";
    }, [zoom, t]);
    const openPreview = () => setZoom(true);
    const onPreviewKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPreview();
      }
    };
    const body = state === "error" ? /* @__PURE__ */ jsx("span", { className: "cs-image__fallback", children: fallback || /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M21 15l-5-5-9 9" })
    ] }) }) : /* @__PURE__ */ jsx("img", { ...props, src, alt, onLoad: () => setState("ok"), onError: () => setState("error") });
    const canPreview = preview && state === "ok";
    return /* @__PURE__ */ jsxs(Fragment2, { children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          ref: mergeRefs(ref, forwardedRef),
          className: cx("cs-image", state === "loading" && "is-loading", canPreview && "is-zoomable", className),
          style: ratio ? { aspectRatio: ratio } : void 0,
          onClick: canPreview ? openPreview : void 0,
          onKeyDown: canPreview ? onPreviewKey : void 0,
          role: canPreview ? "button" : void 0,
          tabIndex: canPreview ? 0 : void 0,
          "aria-haspopup": canPreview ? "dialog" : void 0,
          "aria-expanded": canPreview ? zoom : void 0,
          "aria-label": canPreview ? t("preview") + (alt ? ": " + alt : "") : void 0,
          children: body
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "cs-sr-only", "aria-live": "polite", ref: live }),
      zoom ? /* @__PURE__ */ jsxs(
        "span",
        {
          className: "cs-image__zoom",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": alt || t("preview"),
          ref: panel,
          onClick: () => setZoom(false),
          children: [
            /* @__PURE__ */ jsx("img", { src, alt }),
            /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("close"), onClick: (e) => {
              e.stopPropagation();
              setZoom(false);
            }, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: "sm", style: { verticalAlign: "middle" } }) })
          ]
        }
      ) : null
    ] });
  });

  // packages/react/dist/components/data/Item.js
  var Item = react_default.forwardRef(function Item2({
    leading,
    trailing,
    title,
    description,
    selected = false,
    disabled = false,
    href,
    onClick,
    children,
    className,
    ...props
  }, forwardedRef) {
    const interactive = !disabled && (href != null || typeof onClick === "function");
    const Tag3 = href != null && !disabled ? "a" : interactive ? "button" : "div";
    const rowProps = { ...props };
    if (Tag3 === "a") {
      rowProps.href = href;
      if (disabled) rowProps["aria-disabled"] = true;
    } else if (Tag3 === "button") {
      rowProps.type = "button";
      rowProps.disabled = disabled || void 0;
      rowProps.onClick = onClick;
    } else if (disabled) {
      rowProps["aria-disabled"] = true;
    }
    if (selected) rowProps["aria-current"] = rowProps["aria-current"] ?? "true";
    const trailExplicit = trailing !== void 0;
    const trailNode = trailExplicit ? trailing : title != null ? children : null;
    const mainExtra = trailExplicit ? children : title == null ? children : null;
    return /* @__PURE__ */ jsxs(
      Tag3,
      {
        ref: forwardedRef,
        className: cx(
          "cs-item",
          interactive && "cs-item--interactive",
          selected && "is-selected",
          disabled && "is-disabled",
          className
        ),
        ...rowProps,
        children: [
          leading != null ? /* @__PURE__ */ jsx("span", { className: "cs-item__leading", children: leading }) : null,
          /* @__PURE__ */ jsxs("span", { className: "cs-item__main", children: [
            title != null ? /* @__PURE__ */ jsx("span", { className: "cs-item__title", children: title }) : null,
            description != null ? /* @__PURE__ */ jsx("span", { className: "cs-item__description", children: description }) : null,
            mainExtra
          ] }),
          trailNode != null && trailNode !== false ? /* @__PURE__ */ jsx("span", { className: "cs-item__trailing", children: trailNode }) : null
        ]
      }
    );
  });

  // packages/react/dist/components/data/Kbd.js
  var Kbd = react_default.forwardRef(function Kbd2({ children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsx("kbd", { ref: forwardedRef, className: cx("cs-kbd", className), ...props, children });
  });

  // packages/react/dist/components/data/List.js
  var List = react_default.forwardRef(function List2({ className, children, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, role: "list", className: cx("cs-list", className), ...props, children });
  });
  var ListItem = react_default.forwardRef(function ListItem2({ lead, title, subtitle, trail, onClick, children, className, ...props }, forwardedRef) {
    const interactive = !!onClick;
    const Tag3 = interactive ? "button" : "div";
    return /* @__PURE__ */ jsxs(Tag3, { ref: forwardedRef, role: "listitem", className: cx("cs-list__item", interactive && "cs-list__item--button", className), onClick, ...props, children: [
      lead != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__lead", children: lead }) : null,
      /* @__PURE__ */ jsxs("span", { className: "cs-list__main", children: [
        title != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__title", children: title }) : null,
        subtitle != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__sub", children: subtitle }) : null,
        children
      ] }),
      trail != null ? /* @__PURE__ */ jsx("span", { className: "cs-list__trail", children: trail }) : null
    ] });
  });

  // packages/react/dist/components/data/Masonry.js
  var Masonry = react_default.forwardRef(function Masonry2({ columns = 3, gap = 16, children, className, style }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-masonry", className), style: { columnCount: columns, columnGap: gap, ...style }, children: react_default.Children.map(children, (c) => /* @__PURE__ */ jsx("div", { className: "cs-masonry__item", style: { marginBottom: gap }, children: c })) });
  });

  // packages/react/dist/components/data/qr-encode.js
  var EC = { 1: 7, 2: 10, 3: 15, 4: 20 };
  var TOTAL = { 1: 26, 2: 44, 3: 70, 4: 100 };
  var CAP = { 1: 17, 2: 32, 3: 53, 4: 78 };
  var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26] };
  var FORMAT = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
  var EXP = new Array(512);
  var LOG = new Array(256);
  (function() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 256) x ^= 285;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  function rs(data, ecLen) {
    let gen = [1];
    for (let i = 0; i < ecLen; i++) {
      const next = new Array(gen.length + 1).fill(0);
      for (let j = 0; j < gen.length; j++) {
        next[j] ^= EXP[(LOG[gen[j]] + i) % 255];
        next[j + 1] ^= gen[j];
      }
      gen = next;
    }
    const res = data.concat(new Array(ecLen).fill(0));
    for (let i = 0; i < data.length; i++) {
      const f = res[i];
      if (f === 0) continue;
      for (let j = 0; j < gen.length; j++) res[i + j] ^= EXP[(LOG[gen[j]] + LOG[f]) % 255];
    }
    return res.slice(data.length);
  }
  function qrMatrix(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let v = 0;
    for (const cand of [1, 2, 3, 4]) if (bytes.length <= CAP[cand]) {
      v = cand;
      break;
    }
    if (!v) throw new Error("too long");
    const dataLen = TOTAL[v] - EC[v];
    const bits = [];
    const push = (val, n2) => {
      for (let i = n2 - 1; i >= 0; i--) bits.push(val >> i & 1);
    };
    push(4, 4);
    push(bytes.length, 8);
    bytes.forEach((b) => push(b, 8));
    push(0, Math.min(4, dataLen * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    const cw = [];
    for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(""), 2));
    const pads = [236, 17];
    let p = 0;
    while (cw.length < dataLen) cw.push(pads[p++ % 2]);
    const all = cw.concat(rs(cw, EC[v]));
    const n = 17 + v * 4;
    const M = Array.from({ length: n }, () => new Array(n).fill(null));
    const setF = (x, y, val) => {
      if (y >= 0 && y < n && x >= 0 && x < n) M[y][x] = val;
    };
    const finder = (cx0, cy0) => {
      for (let y = -1; y <= 7; y++) for (let x = -1; x <= 7; x++) {
        const in7 = x >= 0 && x < 7 && y >= 0 && y < 7;
        const on = in7 && (x === 0 || x === 6 || y === 0 || y === 6 || x >= 2 && x <= 4 && y >= 2 && y <= 4);
        setF(cx0 + x, cy0 + y, on ? 1 : 0);
      }
    };
    finder(0, 0);
    finder(n - 7, 0);
    finder(0, n - 7);
    for (let i = 8; i < n - 8; i++) {
      const on = i % 2 === 0 ? 1 : 0;
      if (M[6][i] == null) M[6][i] = on;
      if (M[i][6] == null) M[i][6] = on;
    }
    const ap = ALIGN[v];
    for (const ay of ap) for (const ax of ap) {
      if (M[ay][ax] != null) continue;
      for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) setF(ax + x, ay + y, Math.max(Math.abs(x), Math.abs(y)) !== 1 ? 1 : 0);
    }
    M[n - 8][8] = 1;
    const fpos1 = [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]];
    const fpos2 = [[n - 1, 8], [n - 2, 8], [n - 3, 8], [n - 4, 8], [n - 5, 8], [n - 6, 8], [n - 7, 8], [8, n - 8], [8, n - 7], [8, n - 6], [8, n - 5], [8, n - 4], [8, n - 3], [8, n - 2], [8, n - 1]];
    FORMAT.forEach((b, i) => {
      const [x1, y1] = fpos1[i];
      M[y1][x1] = b;
      const [x2, y2] = fpos2[i];
      M[y2][x2] = b;
    });
    let bi = 0;
    const bit = (i) => i < all.length * 8 ? all[i >> 3] >> 7 - (i & 7) & 1 : 0;
    for (let col = n - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (let i = 0; i < n; i++) {
        for (let dx = 0; dx < 2; dx++) {
          const x = col - dx;
          const y = (col + 1 & 2) === 0 ? n - 1 - i : i;
          if (M[y][x] != null) continue;
          let b = bit(bi++);
          if ((y + x) % 2 === 0) b ^= 1;
          M[y][x] = b;
        }
      }
    }
    return M;
  }

  // packages/react/dist/components/data/QRCode.js
  var QRCode = react_default.forwardRef(function QRCode2({ value = "", size = 128, color = "var(--cs-color-text-primary)", label, className }, forwardedRef) {
    const m = react_default.useMemo(() => {
      try {
        return qrMatrix(String(value));
      } catch (e) {
        return null;
      }
    }, [value]);
    if (!m) return /* @__PURE__ */ jsx("span", { className: cx("cs-qrcode", className), role: "img", "aria-label": label || value, children: "\u2014" });
    const n = m.length, cell = size / n;
    let d = "";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x * cell} ${y * cell}h${cell}v${cell}h${-cell}z`;
    return /* @__PURE__ */ jsx("span", { ref: forwardedRef, className: cx("cs-qrcode", className), role: "img", "aria-label": label || value, children: /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d, fill: color }) }) });
  });

  // packages/react/dist/components/data/ScrollArea.js
  var ScrollArea = react_default.forwardRef(function ScrollArea2({ children, maxHeight, className, style, ...props }, forwardedRef) {
    const max = maxHeight == null ? void 0 : typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: forwardedRef,
        className: cx("cs-scroll-area", className),
        tabIndex: 0,
        style: {
          ...style || {},
          ...max != null ? { maxBlockSize: max } : {}
        },
        ...props,
        children
      }
    );
  });

  // packages/react/dist/components/data/Sortable.js
  function reorderItems(items, from, to) {
    if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items;
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    return next;
  }
  var Sortable = react_default.forwardRef(function Sortable2({ items = [], onChange, lang, className }, forwardedRef) {
    const [dragKey, setDragKey] = react_default.useState(null);
    const [over, setOver] = react_default.useState(null);
    const [live, setLive] = react_default.useState("");
    const [ref, L] = useLang(lang);
    const t = makeT("Sortable", L);
    const announce = (from, to) => {
      const item = items[from];
      const label = item && item.label != null ? String(item.label) : String(from + 1);
      setLive(t("moved").replace("{item}", label).replace("{position}", String(to + 1)));
    };
    const move = (from, to) => {
      const next = reorderItems(items, from, to);
      if (next !== items) {
        announce(from, to);
        onChange && onChange(next);
      }
    };
    const drop = () => {
      if (dragKey == null || over == null || dragKey === over) {
        setDragKey(null);
        setOver(null);
        return;
      }
      const from = items.findIndex((i) => i.key === dragKey);
      const to = items.findIndex((i) => i.key === over);
      move(from, to);
      setDragKey(null);
      setOver(null);
    };
    return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-sortable-wrap", className), children: [
      /* @__PURE__ */ jsx("div", { className: "cs-sr-only", "aria-live": "polite", children: live }),
      /* @__PURE__ */ jsx("ul", { ref, className: "cs-sortable", children: items.map((it, idx) => /* @__PURE__ */ jsxs(
        "li",
        {
          draggable: true,
          className: cx("cs-sortable__item", dragKey === it.key && "is-dragging", over === it.key && "is-over"),
          "aria-grabbed": dragKey === it.key,
          onDragStart: (e) => {
            if (e.target.closest && e.target.closest(".cs-sortable__ops")) {
              e.preventDefault();
              return;
            }
            setDragKey(it.key);
          },
          onDragOver: (e) => {
            e.preventDefault();
            setOver(it.key);
          },
          onDrop: drop,
          onDragEnd: drop,
          children: [
            /* @__PURE__ */ jsx("span", { className: "cs-sortable__grip", "aria-hidden": "true", children: "\u283F" }),
            /* @__PURE__ */ jsx("span", { className: "cs-sortable__label", children: it.label }),
            /* @__PURE__ */ jsxs("span", { className: "cs-sortable__ops", onMouseDown: (e) => e.stopPropagation(), children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "cs-button cs-button--secondary cs-button--xs",
                  "aria-label": t("moveUp"),
                  disabled: idx === 0,
                  onClick: () => move(idx, idx - 1),
                  children: "\u2191"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "cs-button cs-button--secondary cs-button--xs",
                  "aria-label": t("moveDown"),
                  disabled: idx === items.length - 1,
                  onClick: () => move(idx, idx + 1),
                  children: "\u2193"
                }
              )
            ] })
          ]
        },
        it.key
      )) })
    ] });
  });

  // packages/react/dist/components/data/Splitter.js
  var Splitter = react_default.forwardRef(function Splitter2({ start, end, initial = 50, min = 20, max = 80, height = 240, lang, className }, forwardedRef) {
    const [pct, setPct] = react_default.useState(initial);
    const wrap = react_default.useRef(null);
    const [ref, L] = useLang(lang);
    const t = makeT("Splitter", L);
    const drag = (e) => {
      e.preventDefault();
      const move = (ev) => {
        const r = wrap.current.getBoundingClientRect();
        const x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
        setPct(Math.min(max, Math.max(min, x / r.width * 100)));
      };
      const up = () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    };
    return /* @__PURE__ */ jsxs("div", { ref: (el) => {
      wrap.current = el;
      ref.current = el;
    }, className: cx("cs-splitter", className), style: { height }, children: [
      /* @__PURE__ */ jsx("div", { className: "cs-splitter__pane", style: { inlineSize: pct + "%" }, children: start }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "cs-splitter__bar",
          role: "separator",
          "aria-label": t("label"),
          "aria-valuenow": Math.round(pct),
          "aria-valuemin": min,
          "aria-valuemax": max,
          tabIndex: 0,
          onPointerDown: drag,
          onKeyDown: (e) => {
            if (e.key === "ArrowLeft") setPct((p) => Math.max(min, p - 2));
            else if (e.key === "ArrowRight") setPct((p) => Math.min(max, p + 2));
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "cs-splitter__pane", style: { inlineSize: 100 - pct + "%" }, children: end })
    ] });
  });

  // packages/react/dist/components/data/Stat.js
  var Stat = react_default.forwardRef(function Stat2({ label, value, delta, trend = "flat", className, ...props }, forwardedRef) {
    const arrow = trend === "up" ? "M12 5v14M6 11l6-6 6 6" : trend === "down" ? "M12 5v14M6 13l6 6 6-6" : "M5 12h14";
    return /* @__PURE__ */ jsxs("div", { ref: forwardedRef, className: cx("cs-stat", className), ...props, children: [
      /* @__PURE__ */ jsx("div", { className: "cs-stat__label", children: label }),
      /* @__PURE__ */ jsx("div", { className: "cs-stat__value", children: value }),
      delta != null ? /* @__PURE__ */ jsxs("div", { className: cx("cs-stat__delta", `cs-stat__delta--${trend}`), children: [
        /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: arrow }) }),
        delta
      ] }) : null
    ] });
  });

  // packages/react/dist/components/data/Terminal.js
  var Terminal = react_default.forwardRef(function Terminal2({ title, welcome, onCommand, prompt = "\u279C", lang, className }, forwardedRef) {
    const [hist, setHist] = react_default.useState(() => welcome ? [{ out: welcome }] : []);
    const [q, setQ] = react_default.useState("");
    const [ref, L] = useLang(lang);
    const t = makeT("Terminal", L);
    const barTitle = title ?? t("title");
    const run = () => {
      if (!q.trim()) return;
      const res = onCommand ? onCommand(q.trim()) : "";
      setHist((h) => [...h, { cmd: q }, ...res ? [{ out: res }] : []]);
      setQ("");
    };
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-terminal", className), children: [
      /* @__PURE__ */ jsxs("div", { className: "cs-terminal__bar", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("span", { children: barTitle })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "cs-terminal__body", children: [
        hist.map((l, i) => l.cmd != null ? /* @__PURE__ */ jsxs("div", { className: "cs-terminal__line", children: [
          /* @__PURE__ */ jsx("span", { className: "p", children: prompt }),
          " ",
          l.cmd
        ] }, i) : /* @__PURE__ */ jsx("div", { className: "cs-terminal__out", children: l.out }, i)),
        /* @__PURE__ */ jsxs("div", { className: "cs-terminal__line", children: [
          /* @__PURE__ */ jsx("span", { className: "p", children: prompt }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: q,
              "aria-label": t("input"),
              spellCheck: false,
              onChange: (e) => setQ(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") run();
              }
            }
          )
        ] })
      ] })
    ] });
  });

  // packages/react/dist/components/data/Timeline.js
  var Timeline = react_default.forwardRef(function Timeline2({ items = [], className }, forwardedRef) {
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-timeline", className), children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: cx("cs-timeline__item", it.state === "now" && "cs-timeline__item--now", it.state === "todo" && "cs-timeline__item--todo"), children: [
      /* @__PURE__ */ jsx("span", { className: "cs-timeline__marker", "aria-hidden": "true", children: it.state === "todo" ? "" : it.state === "now" ? "\u2192" : "\u2713" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "cs-timeline__title", children: it.title }),
        it.meta ? /* @__PURE__ */ jsx("div", { className: "cs-timeline__meta", children: it.meta }) : null,
        it.body ? /* @__PURE__ */ jsx("div", { className: "cs-timeline__body", children: it.body }) : null
      ] })
    ] }, i)) });
  });

  // packages/react/dist/components/data/Tooltip.js
  var Tooltip = react_default.forwardRef(function Tooltip2({ label, children, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Tooltip", L);
    return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-tooltip", className), children: [
      children,
      /* @__PURE__ */ jsx("span", { className: "cs-tooltip__bubble", role: "tooltip", children: label ?? t("label") })
    ] });
  });

  // packages/react/dist/components/data/Tree.js
  function collectVisible(nodes, openMap, out = []) {
    for (const n of nodes) {
      out.push(n);
      const kids = n.children || [];
      if (kids.length && openMap[n.key]) collectVisible(kids, openMap, out);
    }
    return out;
  }
  function parentOf(nodes, key, parent = null) {
    for (const n of nodes) {
      if (n.key === key) return parent;
      const kids = n.children || [];
      if (kids.length) {
        const p = parentOf(kids, key, n);
        if (p !== void 0) return p;
      }
    }
    return void 0;
  }
  function findNode(nodes, key) {
    for (const n of nodes) {
      if (n.key === key) return n;
      const kids = n.children || [];
      if (kids.length) {
        const hit = findNode(kids, key);
        if (hit) return hit;
      }
    }
    return null;
  }
  function seedOpen(nodes, defaultOpen, map = {}) {
    for (const n of nodes) {
      const kids = n.children || [];
      if (kids.length) {
        map[n.key] = !!defaultOpen;
        seedOpen(kids, defaultOpen, map);
      }
    }
    return map;
  }
  var Tree = react_default.forwardRef(function Tree2({ nodes = [], selected, onSelect, defaultOpen = false, className }, forwardedRef) {
    const [openMap, setOpenMap] = react_default.useState(() => seedOpen(nodes, defaultOpen));
    const [focusKey, setFocusKey] = react_default.useState(() => {
      if (selected && findNode(nodes, selected)) return selected;
      return nodes[0] ? nodes[0].key : null;
    });
    const itemRefs = react_default.useRef({});
    react_default.useEffect(() => {
      setOpenMap((prev) => {
        const next = seedOpen(nodes, defaultOpen);
        for (const k of Object.keys(next)) if (k in prev) next[k] = prev[k];
        return next;
      });
    }, [nodes, defaultOpen]);
    const visible = react_default.useMemo(() => collectVisible(nodes, openMap), [nodes, openMap]);
    react_default.useEffect(() => {
      if (!visible.length) {
        setFocusKey(null);
        return;
      }
      if (!focusKey || !visible.some((n) => n.key === focusKey)) setFocusKey(visible[0].key);
    }, [visible, focusKey]);
    const toggle = (key) => setOpenMap((m) => ({ ...m, [key]: !m[key] }));
    const focusItem = (key) => {
      setFocusKey(key);
      requestAnimationFrame(() => {
        const el = itemRefs.current[key];
        if (el) el.focus();
      });
    };
    const onKeyDown = (e, key) => {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      const idx = visible.findIndex((n) => n.key === key);
      if (idx < 0) return;
      const node = visible[idx];
      const kids = node.children || [];
      const open = !!openMap[key];
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < visible.length - 1) focusItem(visible[idx + 1].key);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) focusItem(visible[idx - 1].key);
      } else if (e.key === "Home") {
        e.preventDefault();
        focusItem(visible[0].key);
      } else if (e.key === "End") {
        e.preventDefault();
        focusItem(visible[visible.length - 1].key);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (kids.length && !open) toggle(key);
        else if (kids.length && open) focusItem(kids[0].key);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (kids.length && open) toggle(key);
        else {
          const p = parentOf(nodes, key);
          if (p) focusItem(p.key);
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect && onSelect(key, node);
        if (kids.length) toggle(key);
      }
    };
    const renderNodes = (list, depth) => list.map((n) => {
      const kids = n.children || [];
      const open = !!openMap[n.key];
      return /* @__PURE__ */ jsxs("li", { ref: forwardedRef, role: "treeitem", "aria-expanded": kids.length ? open : void 0, "aria-selected": selected === n.key, children: [
        /* @__PURE__ */ jsxs("span", { className: cx("cs-tree__row", selected === n.key && "is-selected"), style: { paddingInlineStart: depth * 18 + 6 }, children: [
          kids.length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-tree__twist", "aria-hidden": "true", tabIndex: -1, onClick: () => toggle(n.key), children: open ? "\u25BE" : "\u25B8" }) : /* @__PURE__ */ jsx("span", { className: "cs-tree__twist", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "cs-tree__label",
              tabIndex: focusKey === n.key ? 0 : -1,
              ref: (el) => {
                itemRefs.current[n.key] = el;
              },
              onClick: () => {
                onSelect && onSelect(n.key, n);
                if (kids.length) toggle(n.key);
              },
              onKeyDown: (e) => onKeyDown(e, n.key),
              onFocus: () => setFocusKey(n.key),
              children: n.label
            }
          )
        ] }),
        kids.length && open ? /* @__PURE__ */ jsx("ul", { role: "group", children: renderNodes(kids, depth + 1) }) : null
      ] }, n.key);
    });
    return /* @__PURE__ */ jsx("ul", { role: "tree", className: cx("cs-tree", className), children: renderNodes(nodes, 0) });
  });

  // packages/react/dist/components/data/Watermark.js
  var Watermark = react_default.forwardRef(function Watermark2({ text = "CyberSkill", opacity = 0.09, gap = 140, rotate = -22, children, className }, forwardedRef) {
    const host = react_default.useRef(null);
    const [fill, setFill] = react_default.useState("#45210E");
    react_default.useLayoutEffect(() => {
      if (!host.current || typeof getComputedStyle === "undefined") return;
      const c = getComputedStyle(host.current).getPropertyValue("--cs-color-text-primary").trim();
      if (c) setFill(c);
    }, []);
    const svg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${gap}" height="${gap}"><text x="50%" y="50%" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="700" fill="${fill}" fill-opacity="${opacity}" text-anchor="middle" transform="rotate(${rotate} ${gap / 2} ${gap / 2})">${String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`
    );
    return /* @__PURE__ */ jsxs("div", { ref: host, className: cx("cs-watermark", className), style: { position: "relative" }, children: [
      children,
      /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,${svg}")` } })
    ] });
  });

  // packages/react/dist/components/datatable/DataGrid.js
  var DataGrid = react_default.forwardRef(function DataGrid2({
    columns = [],
    rows = [],
    rowKey = "id",
    selectable = false,
    selected = [],
    onSelect,
    height = 280,
    caption,
    empty,
    lang,
    className,
    filterText,
    filterKeys,
    /** When true (or rows exceed virtualThreshold), only paint a window of rows. */
    virtual = false,
    /** Row threshold that auto-enables virtualization. Default 80. */
    virtualThreshold = 80,
    /** Approximate row height for windowing. Default 36. */
    rowHeight = 36,
    /** localStorage key — when set, column key order is persisted across reloads. */
    persistKey
  }, forwardedRef) {
    const [sort, setSort] = react_default.useState(null);
    const [scrollTop, setScrollTop] = react_default.useState(0);
    const [colOrder, setColOrder] = react_default.useState(() => {
      if (!persistKey) return null;
      try {
        const raw = localStorage.getItem("cs:datagrid:cols:" + persistKey);
        const arr = raw ? JSON.parse(raw) : null;
        return Array.isArray(arr) ? arr : null;
      } catch (e) {
        return null;
      }
    });
    const [ref, L] = useLang(lang);
    const t = makeT("DataGrid", L);
    const orderedColumns = react_default.useMemo(() => {
      if (!colOrder || !colOrder.length) return columns;
      const map = new Map(columns.map((c) => [c.key, c]));
      const out = [];
      for (const k of colOrder) if (map.has(k)) {
        out.push(map.get(k));
        map.delete(k);
      }
      for (const c of map.values()) out.push(c);
      return out;
    }, [columns, colOrder]);
    const filtered = react_default.useMemo(() => {
      const q = (filterText == null ? "" : String(filterText)).trim().toLowerCase();
      if (!q) return rows;
      const keys = filterKeys && filterKeys.length ? filterKeys : orderedColumns.map((c) => c.key);
      return rows.filter((r) => keys.some((k) => String(r[k] == null ? "" : r[k]).toLowerCase().includes(q)));
    }, [rows, filterText, filterKeys, orderedColumns]);
    const sorted = react_default.useMemo(() => {
      if (!sort) return filtered;
      const col = orderedColumns.find((c) => c.key === sort.key);
      const val = (r) => col && col.sortValue ? col.sortValue(r) : r[sort.key];
      return [...filtered].sort((a, b) => {
        const x = val(a), y = val(b);
        return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === "asc" ? 1 : -1);
      });
    }, [filtered, sort, orderedColumns]);
    const useVirtual = virtual || sorted.length >= virtualThreshold;
    const bodyH = Math.max(0, height - 40);
    const start = useVirtual ? Math.max(0, Math.floor(scrollTop / rowHeight) - 4) : 0;
    const visibleCount = useVirtual ? Math.ceil(bodyH / rowHeight) + 8 : sorted.length;
    const end = useVirtual ? Math.min(sorted.length, start + visibleCount) : sorted.length;
    const slice = sorted.slice(start, end);
    const padTop = useVirtual ? start * rowHeight : 0;
    const padBottom = useVirtual ? Math.max(0, (sorted.length - end) * rowHeight) : 0;
    const allSel = selectable && filtered.length && filtered.every((r) => selected.includes(r[rowKey]));
    const toggleAll = () => onSelect && onSelect(allSel ? [] : filtered.map((r) => r[rowKey]));
    const toggle = (k) => onSelect && onSelect(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k]);
    const pinColumn = (key) => {
      if (!persistKey) return;
      const keys = orderedColumns.map((c) => c.key);
      const next = [key, ...keys.filter((k) => k !== key)];
      setColOrder(next);
      try {
        localStorage.setItem("cs:datagrid:cols:" + persistKey, JSON.stringify(next));
      } catch (e) {
      }
    };
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: mergeRefs(ref, forwardedRef),
        className: cx("cs-datagrid", useVirtual && "cs-datagrid--virtual", className),
        style: { maxBlockSize: height, overflow: "auto" },
        onScroll: useVirtual ? (e) => setScrollTop(e.currentTarget.scrollTop) : void 0,
        "data-virtual": useVirtual ? "true" : "false",
        "data-row-count": sorted.length,
        children: /* @__PURE__ */ jsxs("table", { className: "cs-table", children: [
          caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            selectable ? /* @__PURE__ */ jsx("th", { scope: "col", className: "cs-datagrid__selcol", children: /* @__PURE__ */ jsx("input", { type: "checkbox", "aria-label": t("selectAll"), checked: !!allSel, onChange: toggleAll }) }) : null,
            orderedColumns.map((c) => /* @__PURE__ */ jsxs(
              "th",
              {
                scope: "col",
                className: c.pinned ? "cs-datagrid__pinned" : void 0,
                style: c.pinned ? { position: "sticky", insetInlineStart: 0, zIndex: 1, background: "var(--cs-color-surface-panel)" } : void 0,
                "aria-sort": sort && sort.key === c.key ? sort.dir === "asc" ? "ascending" : "descending" : void 0,
                children: [
                  c.sortable ? /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-datagrid__sort", onClick: () => setSort((s) => !s || s.key !== c.key ? { key: c.key, dir: "asc" } : s.dir === "asc" ? { key: c.key, dir: "desc" } : null), children: [
                    c.header,
                    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: sort && sort.key === c.key ? sort.dir === "asc" ? " \u25B2" : " \u25BC" : " \u2195" })
                  ] }) : c.header,
                  persistKey ? /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: "cs-datagrid__pin",
                      title: t("pin"),
                      onClick: () => pinColumn(c.key),
                      "aria-label": t("pinNamed").replace("{name}", String(c.header != null ? c.header : c.key)),
                      children: /* @__PURE__ */ jsx(Icon, { name: "pin", size: "sm" })
                    }
                  ) : null
                ]
              },
              c.key
            ))
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: sorted.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: orderedColumns.length + (selectable ? 1 : 0), className: "cs-table__empty", children: empty != null ? empty : t("empty") }) }) : /* @__PURE__ */ jsxs(Fragment2, { children: [
            padTop > 0 ? /* @__PURE__ */ jsx("tr", { "aria-hidden": "true", children: /* @__PURE__ */ jsx("td", { colSpan: orderedColumns.length + (selectable ? 1 : 0), style: { height: padTop, padding: 0, border: 0 } }) }) : null,
            slice.map((r, i) => {
              const k = r[rowKey] != null ? r[rowKey] : start + i;
              return /* @__PURE__ */ jsxs("tr", { className: selected.includes(k) ? "is-selected" : void 0, style: useVirtual ? { height: rowHeight } : void 0, children: [
                selectable ? /* @__PURE__ */ jsx("td", { className: "cs-datagrid__selcol", children: /* @__PURE__ */ jsx("input", { type: "checkbox", "aria-label": t("selectRow"), checked: selected.includes(k), onChange: () => toggle(k) }) }) : null,
                orderedColumns.map((c) => /* @__PURE__ */ jsx("td", { className: c.pinned ? "cs-datagrid__pinned" : void 0, style: c.pinned ? { position: "sticky", insetInlineStart: 0, background: "var(--cs-color-surface-panel)" } : void 0, children: c.render ? c.render(r) : r[c.key] }, c.key))
              ] }, k);
            }),
            padBottom > 0 ? /* @__PURE__ */ jsx("tr", { "aria-hidden": "true", children: /* @__PURE__ */ jsx("td", { colSpan: orderedColumns.length + (selectable ? 1 : 0), style: { height: padBottom, padding: 0, border: 0 } }) }) : null
          ] }) })
        ] })
      }
    );
  });

  // packages/react/dist/components/feedback/Skeleton.js
  var Skeleton = react_default.forwardRef(function Skeleton2({ variant = "block", width, height, lines, radius, className, style }, forwardedRef) {
    if (lines) {
      return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className, "aria-hidden": "true", role: "presentation", children: Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ jsx("span", { className: "cs-skeleton cs-skeleton--text", style: { width: i === lines - 1 ? "70%" : "100%" } }, i)) });
    }
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: cx("cs-skeleton", variant === "circle" && "cs-skeleton--circle", className),
        "aria-hidden": "true",
        style: { display: "block", width, height, borderRadius: radius, ...style }
      }
    );
  });

  // packages/react/dist/components/feedback/Result.js
  var ART = {
    success: /* @__PURE__ */ jsx("svg", { width: "30", height: "30", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 12.5l5 5 11-11" }) }),
    error: /* @__PURE__ */ jsx("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }),
    warning: /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("path", { d: "M12 3l10 18H2z" }),
      /* @__PURE__ */ jsx("path", { d: "M12 10v5M12 18.2v.1" })
    ] }),
    info: /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ jsx("path", { d: "M12 11v6M12 7.2v.1" })
    ] })
  };
  var Result = react_default.forwardRef(function Result2({ status = "info", title, children, actions, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Result", L);
    const tt = title != null ? title : t(status);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-result", "cs-result--" + status, className), role: "status", children: [
      /* @__PURE__ */ jsx("span", { className: "cs-result__icon", "aria-hidden": "true", children: ART[status] || ART.info }),
      /* @__PURE__ */ jsx("h2", { className: "cs-result__title", children: tt }),
      children ? /* @__PURE__ */ jsx("div", { className: "cs-result__body", children }) : null,
      actions ? /* @__PURE__ */ jsx("div", { className: "cs-result__actions", children: actions }) : null
    ] });
  });

  // packages/react/dist/components/datatable/DataTable.js
  var DataTable = react_default.forwardRef(function DataTable2({
    caption,
    columns,
    rows,
    rowKey = "id",
    emptyState,
    state = "idle",
    errorState,
    loadingState,
    loadingRows = 5,
    lang,
    className
  }, forwardedRef) {
    const normalized = Array.isArray(rows) ? rows : [];
    const [ref, L] = useLang(lang);
    const t = makeT("DataTable", L);
    const es = emptyState != null ? emptyState : t("empty");
    const colCount = Math.max(1, columns && columns.length || 1);
    if (state === "loading") {
      return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-table-wrap", className), "aria-busy": "true", children: [
        /* @__PURE__ */ jsx("span", { className: "cs-sr-only", children: t("loading") }),
        loadingState != null ? loadingState : /* @__PURE__ */ jsxs("table", { className: "cs-table", children: [
          caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: (columns || []).map((c) => /* @__PURE__ */ jsx("th", { scope: "col", children: c.header }, c.key)) }) }),
          /* @__PURE__ */ jsx("tbody", { "aria-hidden": "true", children: Array.from({ length: Math.max(1, loadingRows) }).map((_, i) => /* @__PURE__ */ jsx("tr", { children: Array.from({ length: colCount }).map((__, j) => /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(Skeleton, { lines: 1 }) }, j)) }, i)) })
        ] })
      ] });
    }
    if (state === "error") {
      return /* @__PURE__ */ jsx("div", { ref, className: cx("cs-table-wrap", "cs-table-wrap--status", className), role: "alert", children: errorState != null ? errorState : /* @__PURE__ */ jsx(Result, { status: "error", lang: L, title: t("error"), children: t("errorHint") }) });
    }
    return /* @__PURE__ */ jsx("div", { ref, className: cx("cs-table-wrap", className), children: /* @__PURE__ */ jsxs("table", { className: "cs-table", children: [
      caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: (columns || []).map((c) => /* @__PURE__ */ jsx("th", { scope: "col", children: c.header }, c.key)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: normalized.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: colCount, className: "cs-table__empty", children: es }) }) : normalized.map((row, i) => /* @__PURE__ */ jsx("tr", { children: (columns || []).map((c) => /* @__PURE__ */ jsx("td", { children: c.render ? c.render(row) : row[c.key] }, c.key)) }, row[rowKey] ?? i)) })
    ] }) });
  });

  // packages/react/dist/components/datatable/TreeTable.js
  function Row({ n, depth, columns, expanded, setExpanded }) {
    const kids = n.children || [];
    const open = expanded.includes(n.key);
    return /* @__PURE__ */ jsxs(Fragment2, { children: [
      /* @__PURE__ */ jsx("tr", { children: columns.map((c, i) => /* @__PURE__ */ jsx("td", { children: i === 0 ? /* @__PURE__ */ jsxs("span", { className: "cs-treetable__cell", style: { paddingInlineStart: depth * 18 }, children: [
        kids.length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-tree__twist", "aria-expanded": open, onClick: () => setExpanded(open ? expanded.filter((k) => k !== n.key) : [...expanded, n.key]), children: open ? "\u25BE" : "\u25B8" }) : /* @__PURE__ */ jsx("span", { className: "cs-tree__twist", "aria-hidden": "true" }),
        c.render ? c.render(n) : n[c.key]
      ] }) : c.render ? c.render(n) : n[c.key] }, c.key)) }),
      open ? kids.map((k) => /* @__PURE__ */ jsx(Row, { n: k, depth: depth + 1, columns, expanded, setExpanded }, k.key)) : null
    ] });
  }
  var TreeTable = react_default.forwardRef(function TreeTable2({ columns = [], nodes = [], caption, defaultExpanded = [], lang, className }, forwardedRef) {
    const [expanded, setExpanded] = react_default.useState(defaultExpanded);
    const [ref, L] = useLang(lang);
    const t = makeT("DataGrid", L);
    return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-table-wrap", className), children: /* @__PURE__ */ jsxs("table", { className: "cs-table cs-treetable", children: [
      caption ? /* @__PURE__ */ jsx("caption", { children: caption }) : null,
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsx("th", { scope: "col", children: c.header }, c.key)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: nodes.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "cs-table__empty", children: t("empty") }) }) : nodes.map((n) => /* @__PURE__ */ jsx(Row, { n, depth: 0, columns, expanded, setExpanded }, n.key)) })
    ] }) });
  });

  // packages/react/dist/components/dialog/Dialog.js
  var Dialog = react_default.forwardRef(function Dialog2({
    open,
    title,
    children,
    actions,
    onClose,
    className,
    closeLabel,
    lang,
    ...props
  }, forwardedRef) {
    const baseId = react_default.useId();
    const titleId = baseId + "-title";
    const bodyId = children == null ? void 0 : baseId + "-body";
    const [ref, L] = useLang(lang);
    const panel = react_default.useRef(null);
    const closeRef = react_default.useRef(onClose);
    closeRef.current = onClose;
    useOverlayLayer({
      open: !!open,
      kind: "modal",
      trapFocus: true,
      onEscape: () => closeRef.current && closeRef.current(),
      panelRef: panel
    });
    const cl = closeLabel != null ? closeLabel : makeT("Dialog", L)("close");
    if (!open) return null;
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: "cs-dialog-layer", children: [
      /* @__PURE__ */ jsx("div", { className: "cs-dialog__overlay", onClick: onClose, "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs(
        "section",
        {
          ...props,
          ref: panel,
          tabIndex: -1,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": bodyId != null ? bodyId : props["aria-describedby"],
          className: cx("cs-dialog", className),
          children: [
            /* @__PURE__ */ jsxs("header", { className: "cs-dialog__header", children: [
              /* @__PURE__ */ jsx("h2", { id: titleId, className: "cs-dialog__title", children: title }),
              onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--ghost cs-button--sm", onClick: onClose, "aria-label": cl, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: "sm" }) }) : null
            ] }),
            /* @__PURE__ */ jsx("div", { id: bodyId, className: "cs-dialog__body", children }),
            actions ? /* @__PURE__ */ jsx("footer", { className: "cs-dialog__actions", children: actions }) : null
          ]
        }
      )
    ] });
  });

  // packages/react/dist/components/feedback/Alert.js
  var PATHS = {
    info: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    success: "M4 12.5l5 5 11-11",
    warning: "M12 3l9 16H3z M12 10v4 M12 17h.01",
    danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
  };
  function DefaultIcon({ variant }) {
    return /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: PATHS[variant] || PATHS.info }) });
  }
  var Alert = react_default.forwardRef(function Alert2({ variant = "info", title, icon, children, onDismiss, lang, className, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Alert", L);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), role: "status", className: cx("cs-alert", `cs-alert--${variant}`, className), ...props, children: [
      /* @__PURE__ */ jsx("span", { className: "cs-alert__icon", children: icon ?? /* @__PURE__ */ jsx(DefaultIcon, { variant }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        title ? /* @__PURE__ */ jsx("p", { className: "cs-alert__title", children: title }) : null,
        children ? /* @__PURE__ */ jsx("div", { className: "cs-alert__body", children }) : null
      ] }),
      onDismiss ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-alert__dismiss", "aria-label": t("dismiss"), onClick: onDismiss, children: "\xD7" }) : null
    ] });
  });

  // packages/react/dist/components/feedback/Badge.js
  var Badge = react_default.forwardRef(function Badge2({ variant = "neutral", dot = false, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-badge", variant !== "neutral" && `cs-badge--${variant}`, className), ...props, children: [
      dot ? /* @__PURE__ */ jsx("span", { className: "cs-badge__dot", "aria-hidden": "true" }) : null,
      children
    ] });
  });

  // packages/react/dist/components/feedback/EmptyState.js
  var EmptyState = react_default.forwardRef(function EmptyState2({ icon, title, children, actions, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("EmptyState", L);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-empty", className), children: [
      /* @__PURE__ */ jsx("span", { className: "cs-empty__icon", children: icon ?? /* @__PURE__ */ jsx("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8l2-4h14l2 4M3 8v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8h6l1 3h4l1-3h6" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "cs-empty__title", children: title ?? t("title") }),
      children ? /* @__PURE__ */ jsx("div", { className: "cs-empty__body", children }) : null,
      actions ? /* @__PURE__ */ jsx("div", { className: "cs-empty__actions", children: actions }) : null
    ] });
  });

  // packages/react/dist/components/feedback/ProgressBar.js
  var ProgressBar = react_default.forwardRef(function ProgressBar2({ value = 0, max = 100, variant, label, lang, className }, forwardedRef) {
    const safeMax = max > 0 ? max : 100;
    const clamped = Math.max(0, Math.min(safeMax, Number(value) || 0));
    const pct = Math.max(0, Math.min(100, clamped / safeMax * 100));
    const [ref, L] = useLang(lang);
    const t = makeT("ProgressBar", L);
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: mergeRefs(ref, forwardedRef),
        className: cx("cs-progress", variant && `cs-progress--${variant}`, className),
        role: "progressbar",
        "aria-valuenow": Math.round(clamped),
        "aria-valuemin": 0,
        "aria-valuemax": safeMax,
        "aria-label": label ?? t("label"),
        children: /* @__PURE__ */ jsx("span", { className: "cs-progress__fill", style: { inlineSize: pct + "%", width: pct + "%" } })
      }
    );
  });

  // packages/react/dist/components/feedback/Spinner.js
  var Spinner = react_default.forwardRef(function Spinner2({ size = 20, label, lang, className, style, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const lbl = label != null ? label : makeT("Spinner", L)("label");
    return /* @__PURE__ */ jsx("span", { ref: mergeRefs(ref, forwardedRef), role: "status", "aria-label": lbl, className: cx("cs-spinner", className), style: { inlineSize: size, blockSize: size, width: size, height: size, ...style }, ...props });
  });

  // packages/react/dist/components/feedback/StatusIndicator.js
  var StatusIndicator = react_default.forwardRef(function StatusIndicator2({ status = "offline", pulse = false, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-status", `cs-status--${status}`, pulse && "cs-status--pulse", className), ...props, children: [
      /* @__PURE__ */ jsx("span", { className: "cs-status__dot", "aria-hidden": "true" }),
      children
    ] });
  });

  // packages/react/dist/components/feedback/Tag.js
  var Tag = react_default.forwardRef(function Tag2({ children, onRemove, removeLabel, lang, className, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const rl = removeLabel != null ? removeLabel : makeT("Tag", L)("remove");
    return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-tag", className), ...props, children: [
      children,
      onRemove ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-tag__close", "aria-label": rl, onClick: onRemove, children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) }) : null
    ] });
  });

  // packages/react/dist/components/feedback/Toast.js
  var PATHS2 = {
    default: "M12 8h.01M11 12h1v4h1 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    success: "M4 12.5l5 5 11-11",
    danger: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9 9l6 6 M15 9l-6 6"
  };
  function DefaultIcon2({ variant }) {
    return /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: PATHS2[variant] || PATHS2.default }) });
  }
  var ToastStack = react_default.forwardRef(function ToastStack2({ children, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-toast-stack", className), role: "region", "aria-label": makeT("Toast", L)("notifications"), children });
  });
  var Toast = react_default.forwardRef(function Toast2({ variant = "default", title, icon, onClose, lang, children, className, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-toast", `cs-toast--${variant}`, className), role: "status", ...props, children: [
      /* @__PURE__ */ jsx("span", { className: "cs-toast__icon", "aria-hidden": "true", children: icon ?? /* @__PURE__ */ jsx(DefaultIcon2, { variant }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        title ? /* @__PURE__ */ jsx("div", { className: "cs-toast__title", children: title }) : null,
        children ? /* @__PURE__ */ jsx("div", { className: "cs-toast__body", children }) : null
      ] }),
      onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-toast__close", "aria-label": makeT("Toast", L)("dismiss"), onClick: onClose, children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) }) : null
    ] });
  });

  // packages/react/dist/components/forms/Calendar.js
  var WD = { en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], vi: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] };
  function grid(year, month) {
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length % 7) cells.push(null);
    return cells;
  }
  var Calendar = react_default.forwardRef(function Calendar2({ value, onChange, lang, className }, forwardedRef) {
    const sel = value ? new Date(value) : null;
    const today = /* @__PURE__ */ new Date();
    const [view, setView] = react_default.useState(() => sel ? [sel.getFullYear(), sel.getMonth()] : [today.getFullYear(), today.getMonth()]);
    const [y, m] = view;
    const [ref, L] = useLang(lang);
    const t = makeT("Calendar", L);
    const cells = grid(y, m);
    const isSel = (d) => sel && d === sel.getDate() && m === sel.getMonth() && y === sel.getFullYear();
    const isToday = (d) => d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-cal", className), children: [
      /* @__PURE__ */ jsxs("div", { className: "cs-cal__head", children: [
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("prev"), onClick: () => setView(([yy, mm]) => mm ? [yy, mm - 1] : [yy - 1, 11]), children: "\u2039" }),
        /* @__PURE__ */ jsxs("b", { children: [
          monthName(m, L),
          " ",
          y
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("next"), onClick: () => setView(([yy, mm]) => mm === 11 ? [yy + 1, 0] : [yy, mm + 1]), children: "\u203A" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cs-cal__wd", children: WD[L === "vi" ? "vi" : "en"].map((w) => /* @__PURE__ */ jsx("span", { children: w }, w)) }),
      /* @__PURE__ */ jsx("div", { className: "cs-cal__grid", children: cells.map((d, i) => d == null ? /* @__PURE__ */ jsx("span", {}, i) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: cx(isSel(d) && "sel", isToday(d) && "today"),
          "aria-pressed": isSel(d) || void 0,
          onClick: () => onChange && onChange(new Date(y, m, d)),
          children: d
        },
        i
      )) })
    ] });
  });

  // packages/react/dist/components/forms/Cascader.js
  var EMPTY_PATH = [];
  var Cascader = react_default.forwardRef(function Cascader2({ nodes = [], value = EMPTY_PATH, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const [path, setPath2] = react_default.useState(value);
    const wrap = react_default.useRef(null);
    const fieldId = react_default.useId();
    const [ref, L] = useLang(lang);
    const t = makeT("Cascader", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    const valueKey = Array.isArray(value) ? value.join("\0") : "";
    react_default.useEffect(() => {
      setPath2(Array.isArray(value) ? value : EMPTY_PATH);
    }, [valueKey]);
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      const k = (e) => {
        if (e.key === "Escape") {
          setOpen(false);
          const field = wrap.current && wrap.current.querySelector(".cs-treeselect__field");
          field && field.focus && field.focus();
          return;
        }
        if (!wrap.current) return;
        const opts = [...wrap.current.querySelectorAll('[role="option"]')];
        if (!opts.length) return;
        const active = document.activeElement;
        const idx = opts.indexOf(active);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          (opts[idx < 0 ? 0 : Math.min(opts.length - 1, idx + 1)] || opts[0]).focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          (opts[idx < 0 ? opts.length - 1 : Math.max(0, idx - 1)] || opts[0]).focus();
        } else if (e.key === "Home") {
          e.preventDefault();
          opts[0].focus();
        } else if (e.key === "End") {
          e.preventDefault();
          opts[opts.length - 1].focus();
        } else if (e.key === "ArrowRight" && idx >= 0) {
          active.click && active.click();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (path.length) {
            const next = path.slice(0, -1);
            setPath2(next);
          } else {
            setOpen(false);
            const field = wrap.current.querySelector(".cs-treeselect__field");
            field && field.focus && field.focus();
          }
        }
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open, path]);
    const cols = [];
    let level = nodes;
    for (let i = 0; level && level.length; i++) {
      cols.push(level);
      const pick = level.find((n) => n.key === path[i]);
      level = pick && pick.children;
    }
    const labels = [];
    {
      let lv = nodes;
      for (const k of value) {
        const n = (lv || []).find((x) => x.key === k);
        if (!n) break;
        labels.push(n.label);
        lv = n.children;
      }
    }
    return /* @__PURE__ */ jsxs("div", { ref: (el) => {
      wrap.current = el;
      ref.current = el;
    }, className: cx("cs-cascader", className), children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          id: fieldId,
          className: "cs-treeselect__field",
          disabled,
          "aria-haspopup": "listbox",
          "aria-expanded": open,
          "aria-label": label,
          onClick: () => setOpen((o) => !o),
          onKeyDown: (e) => {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          },
          children: [
            /* @__PURE__ */ jsx("span", { className: labels.length ? void 0 : "ph", children: labels.length ? labels.join(" / ") : ph }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u25BE" })
          ]
        }
      ),
      open ? /* @__PURE__ */ jsx("div", { className: "cs-cascader__pop", children: cols.map((col, i) => /* @__PURE__ */ jsx("ul", { role: "listbox", "aria-labelledby": fieldId, className: "cs-cascader__col", children: col.map((n) => (
        // role="none" — the <li> wrapper must not sit between listbox and option.
        /* @__PURE__ */ jsx("li", { role: "none", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": path[i] === n.key,
            className: cx("cs-cascader__opt", path[i] === n.key && "on"),
            "data-cs-focusable": "",
            onClick: () => {
              const next = [...path.slice(0, i), n.key];
              setPath2(next);
              if (!(n.children && n.children.length)) {
                onChange && onChange(next);
                setOpen(false);
              }
            },
            children: [
              n.label,
              n.children && n.children.length ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " \u203A" }) : null
            ]
          }
        ) }, n.key)
      )) }, i)) }) : null
    ] });
  });

  // packages/react/dist/components/forms/Checkbox.js
  var Checkbox = react_default.forwardRef(function Checkbox2({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-check", disabled && "is-disabled", className), children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", disabled, ...props }),
      /* @__PURE__ */ jsxs("span", { className: "cs-check__text", children: [
        /* @__PURE__ */ jsx("span", { children: label }),
        description ? /* @__PURE__ */ jsx("span", { className: "cs-check__desc", children: description }) : null
      ] })
    ] });
  });

  // packages/react/dist/components/forms/ColorPicker.js
  var SWATCHES = ["#F4BA17", "#C77B4A", "#E0632B", "#C43D1F", "#7A9B57", "#3E5A2E", "#4E8E9B", "#2E5E7E", "#BFB29B", "#45210E"];
  var ColorPicker = react_default.forwardRef(function ColorPicker2({ value = "#F4BA17", onChange, swatches = SWATCHES, label, lang, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const [hex, setHex] = react_default.useState(value);
    const wrap = react_default.useRef(null);
    const [ref, L] = useLang(lang);
    const t = makeT("ColorPicker", L);
    react_default.useEffect(() => setHex(value), [value]);
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      const k = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open]);
    const commit = (v) => {
      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        onChange && onChange(v);
      }
    };
    return /* @__PURE__ */ jsxs("span", { ref: (el) => {
      wrap.current = el;
      ref.current = el;
    }, className: cx("cs-colorpicker", className), children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-colorpicker__field", "aria-label": (label || t("label")) + ": " + value, "aria-expanded": open, onClick: () => setOpen((o) => !o), children: [
        /* @__PURE__ */ jsx("i", { style: { background: value } }),
        /* @__PURE__ */ jsx("code", { children: value })
      ] }),
      open ? /* @__PURE__ */ jsxs("span", { className: "cs-colorpicker__pop", role: "dialog", "aria-label": label || t("label"), children: [
        /* @__PURE__ */ jsx("span", { className: "cs-colorpicker__grid", children: swatches.map((s) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": s,
            "aria-pressed": s.toLowerCase() === String(value).toLowerCase(),
            style: { background: s },
            className: s.toLowerCase() === String(value).toLowerCase() ? "on" : void 0,
            onClick: () => {
              onChange && onChange(s);
              setOpen(false);
            }
          },
          s
        )) }),
        /* @__PURE__ */ jsx("span", { className: "cs-colorpicker__hex", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: hex,
            "aria-label": t("hex"),
            onChange: (e) => setHex(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                commit(hex);
                setOpen(false);
              }
            },
            onBlur: () => commit(hex)
          }
        ) })
      ] }) : null
    ] });
  });

  // packages/react/dist/components/forms/Combobox.js
  var cbUid = 0;
  var Combobox = react_default.forwardRef(function Combobox2({ options = [], value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const [q, setQ] = react_default.useState("");
    const [hl, setHl] = react_default.useState(0);
    const [id] = react_default.useState(() => "cs-cb-" + ++cbUid);
    const wrapRef = react_default.useRef(null);
    const [ref, L] = useLang(lang);
    const t = makeT("Combobox", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    const sel = options.find((o) => o.value === value) || null;
    const needle = q.trim().toLowerCase();
    const shown = needle ? options.filter((o) => String(o.label).toLowerCase().includes(needle)) : options;
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", d);
      return () => document.removeEventListener("mousedown", d);
    }, [open]);
    const pick = (o) => {
      onChange && onChange(o.value);
      setQ("");
      setOpen(false);
    };
    const key = (e) => {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setHl((h) => Math.min(shown.length - 1, h + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHl((h) => Math.max(0, h - 1));
      } else if (e.key === "Enter") {
        if (open && shown[hl]) {
          e.preventDefault();
          pick(shown[hl]);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(wrapRef, ref, forwardedRef), className: cx("cs-combobox", className), children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          role: "combobox",
          "aria-expanded": open,
          "aria-controls": id,
          "aria-autocomplete": "list",
          "aria-label": label,
          "aria-activedescendant": open && shown[hl] ? id + "-" + hl : void 0,
          disabled,
          placeholder: ph,
          value: open ? q : sel ? sel.label : q,
          onFocus: () => {
            setOpen(true);
            setHl(0);
          },
          onChange: (e) => {
            setQ(e.target.value);
            setOpen(true);
            setHl(0);
          },
          onKeyDown: key
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "cs-combobox__caret", "aria-hidden": "true", children: "\u25BE" }),
      open ? /* @__PURE__ */ jsx("ul", { className: "cs-combobox__list", role: "listbox", id, children: shown.length ? shown.map((o, i) => /* @__PURE__ */ jsx(
        "li",
        {
          id: id + "-" + i,
          role: "option",
          "aria-selected": o.value === value,
          className: cx("cs-combobox__opt", i === hl && "hl"),
          onMouseEnter: () => setHl(i),
          onMouseDown: (e) => {
            e.preventDefault();
            pick(o);
          },
          children: o.label
        },
        o.value
      )) : /* @__PURE__ */ jsx("li", { className: "cs-combobox__empty", children: t("empty") }) }) : null
    ] });
  });

  // packages/react/dist/components/forms/DatePicker.js
  var CAL_ICON = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M8 3v4M16 3v4M3 10h18" })
  ] });
  var DatePicker = react_default.forwardRef(function DatePicker2({ value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const wrap = react_default.useRef(null);
    const [ref, L] = useLang(lang);
    const t = makeT("DatePicker", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      const k = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open]);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(wrap, ref, forwardedRef), className: cx("cs-datepicker", className), children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-datepicker__field", disabled, "aria-haspopup": "dialog", "aria-expanded": open, "aria-label": label, onClick: () => setOpen((o) => !o), children: [
        CAL_ICON,
        /* @__PURE__ */ jsx("span", { className: value ? void 0 : "ph", children: value ? formatDate(value, L) : ph })
      ] }),
      open ? /* @__PURE__ */ jsx("div", { className: "cs-datepicker__pop", role: "dialog", "aria-label": label || ph, children: /* @__PURE__ */ jsx(Calendar, { value, lang: L, onChange: (d) => {
        onChange && onChange(d);
        setOpen(false);
      } }) }) : null
    ] });
  });

  // packages/react/dist/components/forms/editor-schema.js
  var EDITOR_SCHEMA = Object.freeze({
    tags: Object.freeze(["p", "br", "b", "i", "strong", "em", "ul", "ol", "li", "div", "span"]),
    /** Attributes allowed per tag (empty ⇒ strip all attrs). */
    attrs: Object.freeze({})
  });
  var ALLOWED = new Set(EDITOR_SCHEMA.tags);
  function sanitizeHtml(html) {
    if (html == null || html === "") return "";
    const raw = String(html);
    if (typeof document === "undefined") {
      let s = raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "").replace(/<(iframe|object|embed|link|meta|base)[\s\S]*?>/gi, "").replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/javascript:/gi, "");
      s = s.replace(/<\/?([a-z0-9:-]+)(\s[^>]*)?>/gi, (m, tag) => {
        const t = tag.toLowerCase();
        if (!ALLOWED.has(t)) return "";
        if (t === "br") return "<br>";
        const close = m.startsWith("</");
        return close ? `</${t}>` : `<${t}>`;
      });
      return s;
    }
    const tpl = document.createElement("template");
    tpl.innerHTML = raw;
    tpl.content.querySelectorAll("script,style,iframe,object,embed,link,meta,base").forEach((n) => n.remove());
    const walk = (node) => {
      const kids = [...node.childNodes];
      for (const child of kids) {
        if (child.nodeType === 1) {
          const el = child;
          const tag = el.tagName.toLowerCase();
          if (!ALLOWED.has(tag)) {
            while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
            el.remove();
            continue;
          }
          [...el.attributes].forEach((a) => el.removeAttribute(a.name));
          walk(el);
        }
      }
    };
    walk(tpl.content);
    return tpl.innerHTML;
  }

  // packages/react/dist/components/forms/Editor.js
  var EDITOR_SCHEMA2 = EDITOR_SCHEMA;
  function sanitizeHtml2(html) {
    return sanitizeHtml(html);
  }
  var Editor = react_default.forwardRef(function Editor2({ defaultValue = "", value, unsafeHtml, onChange, minHeight = 120, lang, className }, forwardedRef) {
    const box = react_default.useRef(null);
    const seeded = react_default.useRef(false);
    const [ref, L] = useLang(lang);
    const t = makeT("Editor", L);
    const controlled = value != null;
    const cmd = (c) => {
      document.execCommand(c);
      box.current && box.current.focus();
      emit();
    };
    const emit = () => {
      if (!onChange || !box.current) return;
      onChange(sanitizeHtml2(box.current.innerHTML));
    };
    react_default.useLayoutEffect(() => {
      if (!box.current) return;
      if (controlled) {
        const next = sanitizeHtml2(value);
        if (box.current.innerHTML !== next) box.current.innerHTML = next;
        return;
      }
      if (seeded.current) return;
      box.current.innerHTML = unsafeHtml != null ? String(unsafeHtml) : sanitizeHtml2(defaultValue);
      seeded.current = true;
    }, [defaultValue, value, controlled, unsafeHtml]);
    const B = ({ c, label, children }) => /* @__PURE__ */ jsx("button", { type: "button", className: "cs-toolbar__btn", "aria-label": label, onMouseDown: (e) => {
      e.preventDefault();
      cmd(c);
    }, children });
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-editor", className), children: [
      /* @__PURE__ */ jsxs("div", { className: "cs-editor__bar", role: "toolbar", "aria-label": t("toolbar"), children: [
        /* @__PURE__ */ jsx(B, { c: "bold", label: t("bold"), children: /* @__PURE__ */ jsx("b", { children: "B" }) }),
        /* @__PURE__ */ jsx(B, { c: "italic", label: t("italic"), children: /* @__PURE__ */ jsx("i", { children: "I" }) }),
        /* @__PURE__ */ jsx(B, { c: "insertUnorderedList", label: t("list"), children: "\u2254" })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: box,
          className: "cs-editor__area",
          contentEditable: true,
          suppressContentEditableWarning: true,
          role: "textbox",
          "aria-multiline": "true",
          "aria-label": t("area"),
          style: { minHeight },
          onInput: emit,
          onBlur: emit
        }
      )
    ] });
  });

  // packages/react/dist/components/forms/FileUpload.js
  var FileUpload = react_default.forwardRef(function FileUpload2({ title, hint, accept, multiple = false, onFiles, icon, lang, className }, forwardedRef) {
    const [drag, setDrag] = react_default.useState(false);
    const inputRef = react_default.useRef(null);
    const pick = (files) => {
      if (files && files.length && onFiles) onFiles(Array.from(files));
    };
    const [ref, L] = useLang(lang);
    const t = makeT("FileUpload", L);
    const tt = title != null ? title : t("title");
    const hh = hint != null ? hint : t("hint");
    const id = react_default.useId();
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: mergeRefs(ref, forwardedRef),
        className: cx("cs-dropzone", drag && "is-dragging", className),
        onDragOver: (e) => {
          e.preventDefault();
          setDrag(true);
        },
        onDragLeave: () => setDrag(false),
        onDrop: (e) => {
          e.preventDefault();
          setDrag(false);
          pick(e.dataTransfer.files);
        },
        onClick: () => inputRef.current && inputRef.current.click(),
        children: [
          /* @__PURE__ */ jsx("span", { className: "cs-dropzone__icon", "aria-hidden": "true", children: icon ?? /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("path", { d: "M12 16V4M7 9l5-5 5 5" }),
            /* @__PURE__ */ jsx("path", { d: "M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" })
          ] }) }),
          /* @__PURE__ */ jsx("label", { className: "cs-dropzone__title", htmlFor: id, children: tt }),
          /* @__PURE__ */ jsx("span", { className: "cs-dropzone__hint", id: id + "-hint", children: hh }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id,
              ref: inputRef,
              type: "file",
              accept,
              multiple,
              className: "cs-sr-only",
              "aria-describedby": id + "-hint",
              onChange: (e) => pick(e.target.files),
              onClick: (e) => e.stopPropagation()
            }
          )
        ]
      }
    );
  });

  // packages/react/dist/components/forms/Form.js
  var FormCtx;
  function getFormCtx() {
    if (!FormCtx) FormCtx = react_default.createContext(null);
    return FormCtx;
  }
  function getPath(obj, path) {
    if (!path) return void 0;
    const parts = String(path).split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return void 0;
      cur = cur[p];
    }
    return cur;
  }
  function setPath(obj, path, value) {
    const parts = String(path).split(".");
    const root = Array.isArray(obj) ? [...obj] : { ...obj || {} };
    let cur = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      const nextKey = parts[i + 1];
      const nextIsIndex = /^\d+$/.test(nextKey);
      const existing = cur[p];
      const clone = existing == null ? nextIsIndex ? [] : {} : Array.isArray(existing) ? [...existing] : { ...existing };
      cur[p] = clone;
      cur = clone;
    }
    cur[parts[parts.length - 1]] = value;
    return root;
  }
  var Form = react_default.forwardRef(function Form2({ onSubmit, errors = {}, rules, asyncRules, initialValues, children, lang, className, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Form", L);
    const [values, setValues] = react_default.useState(() => initialValues || {});
    const [ruleErrors, setRuleErrors] = react_default.useState({});
    const [pending, setPending] = react_default.useState(false);
    const pendingRef = react_default.useRef(false);
    const setValue = react_default.useCallback((name, v) => {
      setValues((s) => String(name).includes(".") ? setPath(s, name, v) : { ...s, [name]: v });
      setRuleErrors((e) => e[name] ? { ...e, [name]: void 0 } : e);
    }, []);
    const merged = { ...ruleErrors, ...errors };
    const keys = Object.keys(merged).filter((k) => merged[k]);
    const runRules = (v, ruleMap) => {
      const map = ruleMap || rules;
      if (!map) return {};
      const out = {};
      for (const [name, r] of Object.entries(map)) {
        for (const rule of Array.isArray(r) ? r : [r]) {
          const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
          const msg = rule === "required" ? fieldVal == null || String(fieldVal).trim() === "" ? t("requiredField") : null : typeof rule === "function" ? rule(fieldVal, v) : null;
          if (msg) {
            out[name] = msg;
            break;
          }
        }
      }
      return out;
    };
    const runAsyncRules = async (v) => {
      if (!asyncRules) return {};
      const out = {};
      for (const [name, fn] of Object.entries(asyncRules)) {
        if (typeof fn !== "function") continue;
        try {
          const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
          const msg = await fn(fieldVal, v);
          if (msg) out[name] = msg;
        } catch (e) {
          out[name] = String(e && e.message || e);
        }
      }
      return out;
    };
    const ctx = { values, setValue, setValues, errors: merged, pending, runRules, setRuleErrors, t, L };
    const Ctx = getFormCtx();
    return /* @__PURE__ */ jsx(Ctx.Provider, { ref: forwardedRef, value: ctx, children: /* @__PURE__ */ jsxs(
      "form",
      {
        ...props,
        ref,
        className: cx("cs-form", pending && "is-pending", className),
        noValidate: true,
        "aria-busy": pending || void 0,
        onSubmit: async (e) => {
          e.preventDefault();
          if (pendingRef.current) return;
          const fd = new FormData(e.currentTarget);
          const v = {};
          fd.forEach((val, k) => {
            v[k] = val;
          });
          Object.assign(v, values);
          const errs = runRules(v);
          if (Object.keys(errs).some((k) => errs[k])) {
            setRuleErrors(errs);
            return;
          }
          pendingRef.current = true;
          setPending(true);
          try {
            const aerrs = await runAsyncRules(v);
            setRuleErrors(aerrs);
            if (Object.keys(aerrs).some((k) => aerrs[k])) return;
            onSubmit && onSubmit(v);
          } finally {
            pendingRef.current = false;
            setPending(false);
          }
        },
        children: [
          keys.length ? /* @__PURE__ */ jsxs("div", { className: "cs-form__summary", role: "alert", children: [
            /* @__PURE__ */ jsx("b", { children: t("summary") }),
            /* @__PURE__ */ jsx("ul", { children: keys.map((k) => /* @__PURE__ */ jsx("li", { children: merged[k] }, k)) })
          ] }) : null,
          children
        ]
      }
    ) });
  });
  var FormField = react_default.forwardRef(function FormField2({ label, name, required = false, hint, error, valueProp = "value", children, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Form", L);
    const ctx = react_default.useContext(getFormCtx());
    const err = error !== void 0 && error !== null ? error : name && ctx ? ctx.errors[name] : void 0;
    let child = children;
    if (name && ctx && react_default.isValidElement(children) && react_default.Children.count(children) === 1) {
      const cur = String(name).includes(".") ? getPath(ctx.values, name) : ctx.values[name];
      const wire = { name };
      wire[valueProp] = cur !== void 0 ? cur : valueProp === "checked" ? false : "";
      wire.onChange = (ev) => {
        const val = ev && ev.target ? valueProp === "checked" ? ev.target.checked : ev.target.value : ev;
        ctx.setValue(name, val);
        if (children.props.onChange) children.props.onChange(ev);
      };
      child = react_default.cloneElement(children, wire);
    }
    return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-formfield", err && "has-error", className), children: [
      /* @__PURE__ */ jsxs("span", { className: "cs-formfield__label", children: [
        label,
        required ? /* @__PURE__ */ jsx("em", { "aria-label": t("required"), children: " *" }) : null
      ] }),
      child,
      err ? /* @__PURE__ */ jsx("span", { className: "cs-formfield__error", role: "alert", children: err }) : hint ? /* @__PURE__ */ jsx("span", { className: "cs-formfield__hint", children: hint }) : null
    ] });
  });
  var FormFieldArray = react_default.forwardRef(function FormFieldArray2({
    name,
    children,
    label,
    min = 0,
    max = 50,
    addLabel,
    defaultItem,
    className,
    lang
  }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Form", L);
    const ctx = react_default.useContext(getFormCtx());
    if (!ctx) {
      return /* @__PURE__ */ jsx("div", { className: "cs-formfield__error", role: "alert", children: "FormFieldArray must be used inside Form" });
    }
    const list = Array.isArray(getPath(ctx.values, name)) ? getPath(ctx.values, name) : [];
    const blank = () => defaultItem != null ? typeof defaultItem === "function" ? defaultItem() : { ...defaultItem } : {};
    const setList = (next) => ctx.setValue(name, next);
    const add = () => {
      if (list.length >= max) return;
      setList([...list, blank()]);
    };
    const removeAt = (i) => {
      if (list.length <= min) return;
      setList(list.filter((_, idx) => idx !== i));
    };
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-form-array", className), "data-name": name, children: [
      label ? /* @__PURE__ */ jsx("div", { className: "cs-formfield__label", style: { marginBottom: 8 }, children: label }) : null,
      /* @__PURE__ */ jsx("div", { className: "cs-form-array__rows", children: list.map((item, index) => /* @__PURE__ */ jsx("div", { className: "cs-form-array__row", "data-index": index, children: typeof children === "function" ? children({
        index,
        item,
        remove: () => removeAt(index),
        path: (field) => `${name}.${index}.${field}`
      }) : children }, index)) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "cs-button cs-button--secondary cs-button--sm",
          onClick: add,
          disabled: list.length >= max,
          style: { marginTop: 8 },
          children: addLabel || (L === "vi" ? "Th\xEAm d\xF2ng" : "Add row")
        }
      )
    ] });
  });
  var FormWizard = react_default.forwardRef(function FormWizard2({
    steps = [],
    initialValues,
    onComplete,
    lang,
    className,
    nextLabel,
    backLabel,
    finishLabel
  }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Form", L);
    const [step, setStep] = react_default.useState(0);
    const [values, setValues] = react_default.useState(() => initialValues || {});
    const [ruleErrors, setRuleErrors] = react_default.useState({});
    const [pending, setPending] = react_default.useState(false);
    const setValue = react_default.useCallback((name, v) => {
      setValues((s) => String(name).includes(".") ? setPath(s, name, v) : { ...s, [name]: v });
      setRuleErrors((e) => e[name] ? { ...e, [name]: void 0 } : e);
    }, []);
    const runRules = react_default.useCallback((v, ruleMap) => {
      if (!ruleMap) return {};
      const out = {};
      for (const [name, r] of Object.entries(ruleMap)) {
        for (const rule of Array.isArray(r) ? r : [r]) {
          const fieldVal = String(name).includes(".") ? getPath(v, name) : v[name];
          const msg = rule === "required" ? fieldVal == null || String(fieldVal).trim() === "" ? t("requiredField") : null : typeof rule === "function" ? rule(fieldVal, v) : null;
          if (msg) {
            out[name] = msg;
            break;
          }
        }
      }
      return out;
    }, [t]);
    const current = steps[step] || {};
    const ctx = { values, setValue, setValues, errors: ruleErrors, pending, runRules, setRuleErrors, t, L };
    const keys = Object.keys(ruleErrors).filter((k) => ruleErrors[k]);
    const goNext = async () => {
      const errs = runRules(values, current.rules);
      if (Object.keys(errs).some((k) => errs[k])) {
        setRuleErrors(errs);
        return;
      }
      setRuleErrors({});
      if (step >= steps.length - 1) {
        setPending(true);
        try {
          onComplete && onComplete(values);
        } finally {
          setPending(false);
        }
        return;
      }
      setStep((s) => s + 1);
    };
    const goBack = () => {
      setRuleErrors({});
      setStep((s) => Math.max(0, s - 1));
    };
    const Ctx = getFormCtx();
    return /* @__PURE__ */ jsx(Ctx.Provider, { ref: forwardedRef, value: ctx, children: /* @__PURE__ */ jsxs("div", { ref, className: cx("cs-form-wizard", className), "data-step": step, children: [
      /* @__PURE__ */ jsx("ol", { className: "cs-form-wizard__steps", style: { display: "flex", gap: 10, listStyle: "none", padding: 0, margin: "0 0 16px", flexWrap: "wrap" }, children: steps.map((s, i) => /* @__PURE__ */ jsxs("li", { style: {
        font: "700 11px/1 var(--cs-font-family-ui)",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        color: i === step ? "var(--cs-color-brand-umber)" : "var(--cs-color-text-primary)",
        opacity: i === step ? 1 : 0.55
      }, children: [
        i + 1,
        ". ",
        s.title || s.id || `Step ${i + 1}`
      ] }, s.id || i)) }),
      keys.length ? /* @__PURE__ */ jsxs("div", { className: "cs-form__summary", role: "alert", children: [
        /* @__PURE__ */ jsx("b", { children: t("summary") }),
        /* @__PURE__ */ jsx("ul", { children: keys.map((k) => /* @__PURE__ */ jsx("li", { children: ruleErrors[k] }, k)) })
      ] }) : null,
      /* @__PURE__ */ jsx("div", { className: "cs-form-wizard__body", children: typeof current.render === "function" ? current.render({ values, step, setValue }) : null }),
      /* @__PURE__ */ jsxs("div", { className: "cs-form-wizard__nav", style: { display: "flex", gap: 10, marginTop: 16 }, children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--sm", onClick: goBack, disabled: step === 0 || pending, children: backLabel || (L === "vi" ? "Quay l\u1EA1i" : "Back") }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--sm", onClick: goNext, disabled: pending, children: step >= steps.length - 1 ? finishLabel || (L === "vi" ? "Ho\xE0n t\u1EA5t" : "Finish") : nextLabel || (L === "vi" ? "Ti\u1EBFp" : "Next") })
      ] })
    ] }) });
  });

  // packages/react/dist/components/forms/InlineEdit.js
  var PEN = /* @__PURE__ */ jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z" }) });
  var InlineEdit = react_default.forwardRef(function InlineEdit2({ value, defaultValue = "", onChange, label, lang, className }, forwardedRef) {
    const [inner, setInner] = react_default.useState(defaultValue);
    const val = value != null ? value : inner;
    const [edit, setEdit] = react_default.useState(false);
    const [draft, setDraft] = react_default.useState(val);
    const commit = () => {
      setEdit(false);
      if (draft !== val) {
        if (value == null) setInner(draft);
        onChange && onChange(draft);
      }
    };
    const [ref, L] = useLang(lang);
    const t = makeT("InlineEdit", L);
    return /* @__PURE__ */ jsx("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-inline-edit", className), children: edit ? /* @__PURE__ */ jsx(
      "input",
      {
        autoFocus: true,
        value: draft,
        "aria-label": label,
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") commit();
          else if (e.key === "Escape") {
            setDraft(val);
            setEdit(false);
          }
        }
      }
    ) : /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-inline-edit__view", "aria-label": t("edit") + (label ? ": " + label : ""), onClick: () => {
      setDraft(val);
      setEdit(true);
    }, children: [
      /* @__PURE__ */ jsx("span", { className: val ? void 0 : "ph", children: val || t("empty") }),
      PEN
    ] }) });
  });

  // packages/react/dist/components/forms/InputGroup.js
  var EYE = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
  ] });
  var EYE_OFF = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" }),
    /* @__PURE__ */ jsx("path", { d: "M4 4l16 16" })
  ] });
  var X = /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) });
  var InputGroup = react_default.forwardRef(function InputGroup2({
    id,
    label,
    prefix,
    suffix,
    clearable = false,
    password = false,
    value,
    onChange,
    defaultValue = "",
    placeholder,
    disabled = false,
    lang,
    className,
    "aria-label": ariaLabel,
    ...props
  }, forwardedRef) {
    const [inner, setInner] = react_default.useState(defaultValue);
    const val = value != null ? value : inner;
    const set = (v) => {
      if (value == null) setInner(v);
      onChange && onChange(v);
    };
    const [show, setShow] = react_default.useState(false);
    const [ref, L] = useLang(lang);
    const t = makeT("InputGroup", L);
    const gid = react_default.useId();
    const sid = id ?? gid;
    return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", className), htmlFor: sid, children: [
      label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
      /* @__PURE__ */ jsxs("span", { className: "cs-igroup", children: [
        prefix != null ? /* @__PURE__ */ jsx("span", { className: "cs-igroup__fix", children: prefix }) : null,
        /* @__PURE__ */ jsx(
          "input",
          {
            ...props,
            id: sid,
            type: password && !show ? "password" : "text",
            value: val,
            placeholder,
            disabled,
            "aria-label": label ? void 0 : ariaLabel || placeholder || t("input"),
            onChange: (e) => set(e.target.value)
          }
        ),
        clearable && String(val).length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-igroup__btn", "aria-label": t("clear"), onClick: () => set(""), children: X }) : null,
        password ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-igroup__btn", "aria-label": show ? t("hide") : t("show"), "aria-pressed": show, onClick: () => setShow((s) => !s), children: show ? EYE_OFF : EYE }) : null,
        suffix != null ? /* @__PURE__ */ jsx("span", { className: "cs-igroup__fix cs-igroup__fix--suffix", children: suffix }) : null
      ] })
    ] });
  });

  // packages/react/dist/components/forms/InputOTP.js
  var InputOTP = react_default.forwardRef(function InputOTP2({ length = 6, value, onChange, onComplete, label, lang, disabled = false, className }, forwardedRef) {
    const [inner, setInner] = react_default.useState("");
    const val = (value != null ? value : inner).slice(0, length);
    const boxes = react_default.useRef([]);
    const set = (v) => {
      v = v.replace(/\D/g, "").slice(0, length);
      if (value == null) setInner(v);
      onChange && onChange(v);
      if (v.length === length && onComplete) onComplete(v);
    };
    const [ref, L] = useLang(lang);
    const lbl = label != null ? label : makeT("InputOTP", L)("label");
    return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-otp", className), role: "group", "aria-label": lbl, children: Array.from({ length }).map((_, i) => /* @__PURE__ */ jsx(
      "input",
      {
        ref: (el) => boxes.current[i] = el,
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength: 1,
        disabled,
        value: val[i] || "",
        "aria-label": lbl + " " + (i + 1) + "/" + length,
        onChange: (e) => {
          const c = e.target.value.replace(/\D/g, "");
          if (!c) return;
          set(val.slice(0, i) + c + val.slice(i + 1));
          const nb = boxes.current[i + 1];
          if (nb) nb.focus();
        },
        onKeyDown: (e) => {
          if (e.key !== "Backspace") return;
          e.preventDefault();
          const arr = val.split("");
          if (arr[i]) arr.splice(i, 1);
          else if (i > 0) arr.splice(i - 1, 1);
          set(arr.join(""));
          const pb = boxes.current[Math.max(0, i - 1)];
          if (pb) pb.focus();
        },
        onPaste: (e) => {
          e.preventDefault();
          const p = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, length);
          set(p);
          const nb = boxes.current[Math.min(length - 1, p.length)];
          if (nb) nb.focus();
        }
      },
      i
    )) });
  });

  // packages/react/dist/components/forms/Mentions.js
  var mentionsUid = 0;
  var Mentions = react_default.forwardRef(function Mentions2({ value, defaultValue = "", onChange, users = [], placeholder, rows = 3, lang, className }, forwardedRef) {
    const [inner, setInner] = react_default.useState(defaultValue);
    const val = value != null ? value : inner;
    const set = (v) => {
      if (value == null) setInner(v);
      onChange && onChange(v);
    };
    const [q, setQ] = react_default.useState(null);
    const [activeIndex, setActiveIndex] = react_default.useState(0);
    const [listId] = react_default.useState(() => "cs-mentions-" + ++mentionsUid);
    const [ref, L] = useLang(lang);
    const t = makeT("Mentions", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    const hits = q == null ? [] : users.filter((u) => u.toLowerCase().includes(q)).slice(0, 6);
    const open = hits.length > 0;
    react_default.useEffect(() => {
      setActiveIndex((i) => hits.length ? Math.min(i, hits.length - 1) : 0);
    }, [q, users]);
    const onInput = (v) => {
      set(v);
      const m = /(^|\s)@(\w*)$/.exec(v);
      const next = m ? m[2].toLowerCase() : null;
      setQ(next);
      if (next != null) setActiveIndex(0);
    };
    const pick = (u) => {
      set(val.replace(/(^|\s)@\w*$/, "$1@" + u + " "));
      setQ(null);
    };
    const optionId = (i) => listId + "-opt-" + i;
    const onKeyDown = (e) => {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(hits.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        if (hits[activeIndex]) {
          e.preventDefault();
          pick(hits[activeIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setQ(null);
      }
    };
    return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-mentions", className), children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "cs-field__control",
          rows,
          value: val,
          placeholder: ph,
          role: "combobox",
          "aria-autocomplete": "list",
          "aria-expanded": open,
          "aria-controls": listId,
          "aria-activedescendant": open && hits[activeIndex] ? optionId(activeIndex) : void 0,
          onChange: (e) => onInput(e.target.value),
          onKeyDown
        }
      ),
      open ? /* @__PURE__ */ jsx("span", { className: "cs-mentions__pop", role: "listbox", id: listId, children: hits.map((u, i) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          id: optionId(i),
          role: "option",
          "aria-selected": i === activeIndex,
          className: cx(i === activeIndex && "hl"),
          onMouseEnter: () => setActiveIndex(i),
          onMouseDown: (e) => {
            e.preventDefault();
            pick(u);
          },
          children: [
            "@",
            u
          ]
        },
        u
      )) }) : null
    ] });
  });

  // packages/react/dist/components/forms/NativeSelect.js
  var NativeSelect = react_default.forwardRef(function NativeSelect2({
    id,
    label,
    error,
    options,
    children,
    disabled = false,
    size = "md",
    className,
    value,
    defaultValue,
    onChange,
    ...props
  }, forwardedRef) {
    const gid = react_default.useId();
    const sid = id ?? gid;
    const errId = error ? sid + "-err" : void 0;
    return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-field", "cs-native-select-field", disabled && "is-disabled", error && "is-invalid", className), htmlFor: sid, children: [
      label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
      /* @__PURE__ */ jsxs("span", { className: cx("cs-native-select", `cs-native-select--${size}`), children: [
        /* @__PURE__ */ jsx(
          "select",
          {
            ...props,
            id: sid,
            disabled,
            value,
            defaultValue,
            onChange,
            "aria-invalid": error ? true : void 0,
            "aria-describedby": errId,
            className: "cs-field__control",
            children: options ? options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, disabled: o.disabled, children: o.label }, o.value)) : children
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "cs-native-select__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
      ] }),
      error ? /* @__PURE__ */ jsx("span", { id: errId, className: "cs-field__error", role: "alert", children: error }) : null
    ] });
  });

  // packages/react/dist/components/forms/NumberField.js
  var NumberField = react_default.forwardRef(function NumberField2({
    id,
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
    lang,
    className,
    children,
    ...props
  }, forwardedRef) {
    const [inner, setInner] = react_default.useState(0);
    const val = value != null ? value : inner;
    const clamp = (n) => {
      if (min != null) n = Math.max(min, n);
      if (max != null) n = Math.min(max, n);
      return n;
    };
    const set = (n) => {
      const c = clamp(n);
      onChange ? onChange(c) : setInner(c);
    };
    const [ref, L] = useLang(lang);
    const t = makeT("NumberField", L);
    const gid = react_default.useId();
    const sid = id ?? gid;
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", className), children: [
      label ? /* @__PURE__ */ jsx("label", { className: "cs-field__label", htmlFor: sid, children: label }) : null,
      /* @__PURE__ */ jsxs("div", { className: "cs-stepper", children: [
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("decrease"), disabled: disabled || min != null && val <= min, onClick: () => set(val - step), children: "\u2212" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...props,
            id: sid,
            type: "number",
            value: val,
            min,
            max,
            step,
            disabled,
            "aria-label": label ? void 0 : t("value"),
            onChange: (e) => set(Number(e.target.value))
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("increase"), disabled: disabled || max != null && val >= max, onClick: () => set(val + step), children: "+" })
      ] })
    ] });
  });

  // packages/react/dist/components/forms/RadioGroup.js
  var Radio = react_default.forwardRef(function Radio2({ label, description, disabled = false, className, children, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-radio", disabled && "is-disabled", className), children: [
      /* @__PURE__ */ jsx("input", { type: "radio", disabled, ...props }),
      /* @__PURE__ */ jsxs("span", { className: "cs-radio__text", children: [
        /* @__PURE__ */ jsx("span", { children: label }),
        description ? /* @__PURE__ */ jsx("span", { className: "cs-radio__desc", children: description }) : null
      ] })
    ] });
  });
  var RadioGroup = react_default.forwardRef(function RadioGroup2({ legend, name, value, onChange, options = [], className }, forwardedRef) {
    const gid = react_default.useId();
    const nm = name ?? gid;
    return /* @__PURE__ */ jsxs("fieldset", { ref: forwardedRef, className: cx("cs-radio-group", className), children: [
      legend ? /* @__PURE__ */ jsx("legend", { children: legend }) : null,
      options.map((o) => /* @__PURE__ */ jsx(
        Radio,
        {
          name: nm,
          value: o.value,
          label: o.label,
          description: o.description,
          disabled: o.disabled,
          checked: value === o.value,
          onChange: () => onChange && onChange(o.value)
        },
        o.value
      ))
    ] });
  });

  // packages/react/dist/components/forms/Rating.js
  var STAR = "M12 2l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20l1.3-6.5L2.5 9l6.6-.8z";
  var Rating = react_default.forwardRef(function Rating2({ value, defaultValue = 0, onChange, max = 5, readOnly = false, label, lang, className }, forwardedRef) {
    const [inner, setInner] = react_default.useState(defaultValue);
    const val = value != null ? value : inner;
    const commit = (n) => {
      if (readOnly) return;
      if (value == null) setInner(n);
      onChange && onChange(n);
    };
    const set = (n) => commit(n === val ? 0 : n);
    const [ref, L] = useLang(lang);
    const lbl = label != null ? label : makeT("Rating", L)("label");
    const refs = react_default.useRef([]);
    const focusIdx = val > 0 ? Math.min(max, val) - 1 : 0;
    const move = (from, delta) => {
      if (readOnly) return;
      const next = Math.max(0, Math.min(max - 1, from + delta));
      commit(next + 1);
      const b = refs.current[next];
      if (b) b.focus();
    };
    const onKeyDown = (e, i) => {
      if (readOnly || e.nativeEvent.isComposing || e.keyCode === 229) return;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        move(i, 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        move(i, -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        move(i, -i);
      } else if (e.key === "End") {
        e.preventDefault();
        move(i, max - 1 - i);
      }
    };
    return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-rating", className), role: "radiogroup", "aria-label": lbl + ": " + val + " / " + max, "data-readonly": readOnly ? "true" : void 0, children: Array.from({ length: max }).map((_, i) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": i < val,
        "aria-label": i + 1 + " / " + max,
        className: i < val ? "on" : void 0,
        onClick: () => set(i + 1),
        tabIndex: readOnly ? -1 : i === focusIdx ? 0 : -1,
        ref: (el) => {
          refs.current[i] = el;
        },
        onKeyDown: (e) => onKeyDown(e, i),
        children: /* @__PURE__ */ jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: i < val ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: STAR }) })
      },
      i
    )) });
  });

  // packages/react/dist/components/forms/SearchField.js
  var SearchField = react_default.forwardRef(function SearchField2({ value, onChange, onClear, placeholder, lang, className, children, ...props }, forwardedRef) {
    const [inner, setInner] = react_default.useState("");
    const val = value != null ? value : inner;
    const set = (v) => onChange ? onChange(v) : setInner(v);
    const [ref, L] = useLang(lang);
    const t = makeT("SearchField", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-search", className), children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ jsx("path", { d: "M21 21l-4.3-4.3" })
      ] }),
      /* @__PURE__ */ jsx("input", { ...props, type: "text", role: "searchbox", value: val, placeholder: ph, onChange: (e) => set(e.target.value) }),
      String(val).length ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-search__clear", "aria-label": t("clear"), onClick: () => {
        set("");
        onClear && onClear();
      }, children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) }) : null
    ] });
  });

  // packages/react/dist/components/forms/SegmentedControl.js
  var SegmentedControl = react_default.forwardRef(function SegmentedControl2({ options = [], value, onChange, className, ...props }, forwardedRef) {
    const refs = react_default.useRef([]);
    const idx = Math.max(0, options.findIndex((o) => o.value === value));
    const key = (e, i) => {
      let n = null;
      if (e.key === "ArrowRight") n = (i + 1) % options.length;
      else if (e.key === "ArrowLeft") n = (i - 1 + options.length) % options.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = options.length - 1;
      if (n == null) return;
      e.preventDefault();
      if (onChange) onChange(options[n].value);
      const b = refs.current[n];
      if (b) b.focus();
    };
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, role: "tablist", className: cx("cs-segmented", className), ...props, children: options.map((o, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": value === o.value,
        tabIndex: i === idx ? 0 : -1,
        ref: (el) => refs.current[i] = el,
        onKeyDown: (e) => key(e, i),
        onClick: () => onChange && onChange(o.value),
        children: [
          o.icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: o.icon }) : null,
          o.label
        ]
      },
      o.value
    )) });
  });

  // packages/react/dist/components/forms/Select.js
  var Select = react_default.forwardRef(function Select2({ id, label, description, error, options, children, disabled = false, lang, className, placeholder, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Select", L);
    const gid = react_default.useId();
    const sid = id ?? gid;
    const descId = description ? sid + "-desc" : void 0;
    const errId = error ? sid + "-err" : void 0;
    const describedBy = [descId, errId].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", error && "is-invalid", className), htmlFor: sid, children: [
      label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
      description ? /* @__PURE__ */ jsx("span", { id: descId, className: "cs-field__description", children: description }) : null,
      /* @__PURE__ */ jsxs("span", { className: "cs-select", children: [
        /* @__PURE__ */ jsxs("select", { ...props, id: sid, disabled, "aria-invalid": error ? true : void 0, "aria-describedby": describedBy, className: "cs-field__control", children: [
          placeholder != null || !children ? /* @__PURE__ */ jsx("option", { value: "", disabled: true, hidden: true, children: placeholder ?? t("placeholder") }) : null,
          options ? options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) : children
        ] }),
        /* @__PURE__ */ jsx("span", { className: "cs-select__chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
      ] }),
      error ? /* @__PURE__ */ jsx("span", { id: errId, className: "cs-field__error", role: "alert", children: error }) : null
    ] });
  });

  // packages/react/dist/components/forms/Slider.js
  var Slider = react_default.forwardRef(function Slider2({ className, children, lang, "aria-label": ariaLabel, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Slider", L);
    return /* @__PURE__ */ jsx("input", { ref: mergeRefs(ref, forwardedRef), type: "range", className: cx("cs-slider", className), "aria-label": ariaLabel ?? t("label"), ...props });
  });

  // packages/react/dist/components/forms/Switch.js
  var Switch = react_default.forwardRef(function Switch2({ label, disabled = false, className, children, lang, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Switch", L);
    const named = !!(label || ariaLabel || ariaLabelledby);
    const fallback = props.checked || props.defaultChecked ? t("on") : t("off");
    return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-switch", disabled && "is-disabled", className), children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          role: "switch",
          disabled,
          "aria-label": ariaLabel ?? (named ? void 0 : fallback),
          "aria-labelledby": ariaLabelledby,
          ...props
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "cs-switch__track", "aria-hidden": "true" }),
      label ? /* @__PURE__ */ jsx("span", { className: "cs-switch__label", children: label }) : null
    ] });
  });

  // packages/react/dist/components/forms/TagInput.js
  var TagInput = react_default.forwardRef(function TagInput2({
    id,
    label,
    value,
    defaultValue = [],
    onChange,
    placeholder,
    max,
    disabled = false,
    lang,
    className
  }, forwardedRef) {
    const [inner, setInner] = react_default.useState(defaultValue);
    const tags = value != null ? value : inner;
    const [q, setQ] = react_default.useState("");
    const set = (arr) => {
      if (value == null) setInner(arr);
      onChange && onChange(arr);
    };
    const add = (s) => {
      s = s.trim();
      if (!s) return;
      if (tags.includes(s)) {
        setQ("");
        return;
      }
      if (max != null && tags.length >= max) return;
      set([...tags, s]);
      setQ("");
    };
    const [ref, L] = useLang(lang);
    const t = makeT("TagInput", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    const gid = react_default.useId();
    const sid = id ?? gid;
    return /* @__PURE__ */ jsxs("label", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-field", disabled && "is-disabled", className), htmlFor: sid, children: [
      label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
      /* @__PURE__ */ jsxs("div", { className: "cs-taginput", children: [
        tags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "cs-tag", children: [
          tag,
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "cs-tag__close",
              "aria-label": t("remove") + " " + tag,
              onClick: () => set(tags.filter((x) => x !== tag)),
              disabled,
              children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) })
            }
          )
        ] }, tag)),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: sid,
            value: q,
            placeholder: tags.length ? "" : ph,
            disabled,
            "aria-label": label ? void 0 : ph,
            onChange: (e) => setQ(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add(q);
              } else if (e.key === "Backspace" && !q && tags.length) {
                set(tags.slice(0, -1));
              }
            },
            onBlur: () => add(q)
          }
        )
      ] })
    ] });
  });

  // packages/react/dist/components/forms/Textarea.js
  var Textarea = react_default.forwardRef(function Textarea2({ id, label, description, error, disabled = false, rows = 4, className, ...props }, forwardedRef) {
    const gid = react_default.useId();
    const tid = id ?? gid;
    const descId = description ? tid + "-desc" : void 0;
    const errId = error ? tid + "-err" : void 0;
    const describedBy = [descId, errId].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ jsxs("label", { ref: forwardedRef, className: cx("cs-field", disabled && "is-disabled", error && "is-invalid", className), htmlFor: tid, children: [
      label ? /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }) : null,
      description ? /* @__PURE__ */ jsx("span", { id: descId, className: "cs-field__description", children: description }) : null,
      /* @__PURE__ */ jsx("textarea", { ...props, id: tid, rows, disabled, "aria-invalid": error ? true : void 0, "aria-describedby": describedBy, className: "cs-field__control" }),
      error ? /* @__PURE__ */ jsx("span", { id: errId, className: "cs-field__error", role: "alert", children: error }) : null
    ] });
  });

  // packages/react/dist/components/forms/TimePicker.js
  var CLOCK = /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7v5l3 3" })
  ] });
  var TimePicker = react_default.forwardRef(function TimePicker2({ value = "09:00", onChange, step = 30, label, disabled = false, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("TimePicker", L);
    const stepMin = Number(step);
    const safeStep = Number.isFinite(stepMin) && stepMin > 0 ? stepMin : 30;
    const opts = [];
    for (let m = 0; m < 24 * 60; m += safeStep) {
      opts.push(String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"));
    }
    return /* @__PURE__ */ jsxs("span", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-timepicker", className), children: [
      CLOCK,
      /* @__PURE__ */ jsx("select", { "aria-label": label != null ? label : t("label"), disabled, value, onChange: (e) => onChange && onChange(e.target.value), children: opts.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: o }, o)) })
    ] });
  });

  // packages/react/dist/components/forms/Toggle.js
  var Toggle = react_default.forwardRef(function Toggle2({ pressed, defaultPressed = false, onChange, icon, children, disabled = false, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
    const [inner, setInner] = react_default.useState(defaultPressed);
    const on = pressed != null ? pressed : inner;
    const [ref, L] = useLang(lang);
    const t = makeT("Toggle", L);
    const flip = () => {
      const v = !on;
      if (pressed == null) setInner(v);
      onChange && onChange(v);
    };
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref: mergeRefs(ref, forwardedRef),
        type: "button",
        className: cx("cs-toggle", className),
        "aria-pressed": on,
        "aria-label": ariaLabel ?? (on ? t("pressed") : t("unpressed")),
        disabled,
        onClick: flip,
        ...props,
        children: [
          icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { display: "inline-flex" }, children: icon }) : null,
          children
        ]
      }
    );
  });

  // packages/react/dist/components/forms/Transfer.js
  var Transfer = react_default.forwardRef(function Transfer2({ items = [], value = [], onChange, titles, lang, className }, forwardedRef) {
    const [checked, setChecked] = react_default.useState([]);
    const [ref, L] = useLang(lang);
    const t = makeT("Transfer", L);
    const tt = titles || [t("source"), t("target")];
    const inTarget = (k) => value.includes(k);
    const toggle = (k) => setChecked((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k]);
    const move = (toTarget) => {
      const mv = checked.filter((k) => inTarget(k) !== toTarget);
      if (!mv.length) return;
      onChange && onChange(toTarget ? [...value, ...mv] : value.filter((k) => !mv.includes(k)));
      setChecked([]);
    };
    const List3 = ({ target }) => /* @__PURE__ */ jsxs("div", { className: "cs-transfer__list", children: [
      /* @__PURE__ */ jsx("div", { className: "cs-transfer__title", children: target ? tt[1] : tt[0] }),
      /* @__PURE__ */ jsx("ul", { children: items.filter((it) => inTarget(it.key) === target).map((it) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: checked.includes(it.key), onChange: () => toggle(it.key) }),
        " ",
        it.label
      ] }) }, it.key)) })
    ] });
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-transfer", className), children: [
      /* @__PURE__ */ jsx(List3, { target: false }),
      /* @__PURE__ */ jsxs("div", { className: "cs-transfer__ops", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", "aria-label": t("toTarget"), onClick: () => move(true), children: "\u203A" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", "aria-label": t("toSource"), onClick: () => move(false), children: "\u2039" })
      ] }),
      /* @__PURE__ */ jsx(List3, { target: true })
    ] });
  });

  // packages/react/dist/components/forms/TreeSelect.js
  var TreeSelect = react_default.forwardRef(function TreeSelect2({ nodes = [], value, onChange, placeholder, label, disabled = false, lang, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const wrap = react_default.useRef(null);
    const [ref, L] = useLang(lang);
    const t = makeT("TreeSelect", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    const find = (ns) => {
      for (const n of ns) {
        if (n.key === value) return n;
        const c = n.children && find(n.children);
        if (c) return c;
      }
      return null;
    };
    const sel = find(nodes);
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      const k = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open]);
    return /* @__PURE__ */ jsxs("div", { ref: (el) => {
      wrap.current = el;
      ref.current = el;
    }, className: cx("cs-treeselect", className), children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-treeselect__field", disabled, "aria-haspopup": "tree", "aria-expanded": open, "aria-label": label, onClick: () => setOpen((o) => !o), children: [
        /* @__PURE__ */ jsx("span", { className: sel ? void 0 : "ph", children: sel ? sel.label : ph }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u25BE" })
      ] }),
      open ? /* @__PURE__ */ jsx("div", { className: "cs-treeselect__pop", children: /* @__PURE__ */ jsx(Tree, { nodes, selected: value, defaultOpen: true, lang: L, onSelect: (k, n) => {
        if (!(n.children && n.children.length)) {
          onChange && onChange(k, n);
          setOpen(false);
        }
      } }) }) : null
    ] });
  });

  // packages/react/dist/components/logo/logo-data.js
  var CS_LOGO_VIEWBOX = "0 0 1007 1007";
  var CS_LOGO_MARK_INNER = `<path fill="#45210E" opacity="1.000000" stroke="none" 
	d="
M560.000000,1008.000000 
	C373.333344,1008.000000 187.166672,1008.000000 1.000000,1008.000000 
	C1.000000,672.333313 1.000000,336.666656 1.000000,1.000000 
	C336.666656,1.000000 672.333313,1.000000 1008.000000,1.000000 
	C1008.000000,336.666656 1008.000000,672.333313 1008.000000,1008.000000 
	C858.833313,1008.000000 709.666687,1008.000000 560.000000,1008.000000 
M440.743774,105.242386 
	C438.572540,107.309639 436.344940,109.321198 434.238464,111.452431 
	C396.510132,149.623566 372.276398,194.939011 363.356293,247.940109 
	C360.996429,261.961884 358.946777,276.673065 360.603027,290.610352 
	C365.030243,327.864777 394.910004,357.905762 431.834900,364.830811 
	C436.723083,365.747589 441.737213,365.993011 447.763702,366.669525 
	C446.254150,363.858124 445.507843,362.409912 444.709564,360.990906 
	C439.517578,351.761383 436.885193,341.740936 437.455444,331.277863 
	C439.589569,292.120056 458.815063,264.154144 494.094208,247.402267 
	C503.544983,242.914673 513.742554,238.863556 524.373901,240.455948 
	C548.543213,244.076111 568.703491,255.555466 584.000793,274.713074 
	C599.847656,294.559021 607.550598,317.209198 603.764282,342.677429 
	C602.575073,350.677063 598.728027,358.281586 595.936157,366.544159 
	C600.137085,366.074554 604.740540,365.758667 609.275574,365.021576 
	C646.763123,358.928711 678.394348,326.946808 681.791199,289.350922 
	C683.086792,275.012085 681.404419,259.972870 678.550415,245.760666 
	C660.577881,156.262833 608.759338,93.666801 525.888672,56.228947 
	C522.563171,54.726585 519.736023,54.769550 516.419739,56.200459 
	C488.640594,68.186523 463.511292,84.231010 440.743774,105.242386 
M286.676636,492.678345 
	C287.329773,493.793732 287.835724,495.033447 288.657562,496.006378 
	C309.770172,521.000305 334.755707,541.223022 364.045837,555.811401 
	C374.407410,560.972046 385.114655,566.593323 396.291962,568.749573 
	C432.863312,575.804749 469.791931,575.543579 506.608704,569.950623 
	C542.882812,564.440125 577.636902,553.955383 610.255371,536.938660 
	C635.979919,523.518494 665.744080,527.108459 687.312561,546.611755 
	C690.823608,549.786621 693.878845,553.465637 697.214539,556.985291 
	C719.173889,537.685486 738.051208,516.184204 753.920410,491.916840 
	C752.879761,490.957520 752.286987,490.387451 751.669678,489.845367 
	C716.653381,459.096100 676.901917,436.766174 632.377991,423.023193 
	C629.713745,422.200836 626.423889,422.161865 623.725525,422.882690 
	C590.944153,431.639587 558.238403,440.679779 525.448730,449.404907 
	C522.300964,450.242554 518.534851,450.164001 515.372437,449.321808 
	C482.598022,440.593750 449.897797,431.587128 417.141144,422.791412 
	C414.867096,422.180786 412.115295,422.006958 409.909119,422.683990 
	C363.870605,436.812317 322.877258,459.923096 286.676636,492.678345 
M638.193726,649.759216 
	C618.869507,656.015442 599.040955,658.948853 578.743958,658.635498 
	C561.320618,658.366577 544.380371,654.932678 527.565796,650.671387 
	C525.521851,650.153320 523.254150,649.859985 521.196533,650.169861 
	C512.810059,651.432678 504.514069,653.468018 496.093933,654.298462 
	C480.882416,655.798584 465.515686,658.255371 450.375763,657.410278 
	C421.185272,655.780762 394.125427,646.062805 369.145020,630.771667 
	C368.008179,630.075806 366.770874,629.544006 364.879761,628.577820 
	C379.822174,677.662048 402.386169,721.588440 433.601837,761.123535 
	C468.862305,805.781311 475.313782,854.488708 452.707825,906.779114 
	C449.580719,914.012512 445.212494,920.709351 441.423889,927.657288 
	C573.221985,890.897766 675.186523,765.328125 681.092896,630.672180 
	C667.338623,636.799011 653.131897,643.127319 638.193726,649.759216 
M451.496307,582.220520 
	C442.351196,581.799133 433.142700,581.909058 424.076202,580.828186 
	C411.400055,579.317017 398.218109,578.681030 386.332123,574.558289 
	C354.337128,563.460327 326.346069,545.236816 301.709656,521.949341 
	C300.020294,520.352478 298.291534,518.797302 295.873596,516.571472 
	C296.025665,518.456909 295.980042,519.134644 296.144836,519.756653 
	C304.310333,550.579102 319.447479,577.592346 342.608459,599.413086 
	C382.985504,637.453735 430.264038,654.771729 486.434967,647.405457 
	C555.692078,638.323059 618.847046,614.520935 675.700134,573.984924 
	C680.675537,570.437500 685.476868,566.646118 690.581665,562.800293 
	C677.023743,544.661377 659.575134,536.325806 637.562927,537.450195 
	C626.043884,538.038574 616.340271,543.514893 606.234131,548.288513 
	C557.596436,571.262329 506.255249,582.294250 451.496307,582.220520 
M539.676270,436.107300 
	C577.955139,425.690460 616.233948,415.273621 655.757202,404.518158 
	C635.089294,395.015900 615.544373,386.029968 595.877441,376.987946 
	C594.662292,379.021637 593.749573,380.591156 592.797180,382.136292 
	C586.595276,392.197998 578.925293,400.845184 568.666138,406.952454 
	C534.791809,427.117798 492.288269,422.383606 462.337891,394.876129 
	C456.381653,389.405701 451.112213,383.187500 445.401093,377.182709 
	C426.206024,386.105682 406.958923,395.052887 386.824615,404.412476 
	C389.268799,405.156464 390.645874,405.614380 392.043884,405.995544 
	C429.426819,416.187622 466.920624,425.996552 504.132446,436.778748 
	C515.781982,440.154175 526.683472,441.361206 537.944458,436.636871 
	C538.251221,436.508148 538.570312,436.408813 539.676270,436.107300 
M636.169495,641.720032 
	C693.203857,621.317932 729.752136,581.965942 745.785767,523.547119 
	C689.811462,583.441650 622.343140,624.064514 542.504456,645.372620 
	C570.121521,652.872437 603.639343,651.544189 636.169495,641.720032 
z"/>
<path fill="#F4BA17" opacity="1.000000" stroke="none" 
	d="
M441.015747,105.015450 
	C463.511292,84.231010 488.640594,68.186523 516.419739,56.200459 
	C519.736023,54.769550 522.563171,54.726585 525.888672,56.228947 
	C608.759338,93.666801 660.577881,156.262833 678.550415,245.760666 
	C681.404419,259.972870 683.086792,275.012085 681.791199,289.350922 
	C678.394348,326.946808 646.763123,358.928711 609.275574,365.021576 
	C604.740540,365.758667 600.137085,366.074554 595.936157,366.544159 
	C598.728027,358.281586 602.575073,350.677063 603.764282,342.677429 
	C607.550598,317.209198 599.847656,294.559021 584.000793,274.713074 
	C568.703491,255.555466 548.543213,244.076111 524.373901,240.455948 
	C513.742554,238.863556 503.544983,242.914673 494.094208,247.402267 
	C458.815063,264.154144 439.589569,292.120056 437.455444,331.277863 
	C436.885193,341.740936 439.517578,351.761383 444.709564,360.990906 
	C445.507843,362.409912 446.254150,363.858124 447.763702,366.669525 
	C441.737213,365.993011 436.723083,365.747589 431.834900,364.830811 
	C394.910004,357.905762 365.030243,327.864777 360.603027,290.610352 
	C358.946777,276.673065 360.996429,261.961884 363.356293,247.940109 
	C372.276398,194.939011 396.510132,149.623566 434.238464,111.452431 
	C436.344940,109.321198 438.572540,107.309639 441.015747,105.015450 
M523.796143,200.964203 
	C522.979370,200.806061 522.153381,200.684708 521.347168,200.484161 
	C511.964752,198.150375 505.739960,190.440384 506.015442,181.511810 
	C506.292053,172.544968 512.964478,165.113678 522.410034,163.391052 
	C528.999146,162.189362 534.425354,164.852509 539.153198,168.766846 
	C541.656067,166.404358 544.030029,164.163544 546.391113,161.934906 
	C535.207764,149.868927 515.326111,149.927109 503.764648,161.836975 
	C492.335419,173.610657 493.100830,193.056198 505.417236,203.820190 
	C517.457336,214.342712 537.192993,213.508774 546.093628,202.189407 
	C543.863281,199.842941 541.645081,197.509277 539.426880,195.175613 
	C539.477722,195.664429 539.528503,196.153259 539.579346,196.642075 
	C534.598694,198.089890 529.617981,199.537689 523.796143,200.964203 
z"/>
<path fill="#F4BA17" opacity="1.000000" stroke="none" 
	d="
M286.857971,492.402985 
	C322.877258,459.923096 363.870605,436.812317 409.909119,422.683990 
	C412.115295,422.006958 414.867096,422.180786 417.141144,422.791412 
	C449.897797,431.587128 482.598022,440.593750 515.372437,449.321808 
	C518.534851,450.164001 522.300964,450.242554 525.448730,449.404907 
	C558.238403,440.679779 590.944153,431.639587 623.725525,422.882690 
	C626.423889,422.161865 629.713745,422.200836 632.377991,423.023193 
	C676.901917,436.766174 716.653381,459.096100 751.669678,489.845367 
	C752.286987,490.387451 752.879761,490.957520 753.920410,491.916840 
	C738.051208,516.184204 719.173889,537.685486 697.214539,556.985291 
	C693.878845,553.465637 690.823608,549.786621 687.312561,546.611755 
	C665.744080,527.108459 635.979919,523.518494 610.255371,536.938660 
	C577.636902,553.955383 542.882812,564.440125 506.608704,569.950623 
	C469.791931,575.543579 432.863312,575.804749 396.291962,568.749573 
	C385.114655,566.593323 374.407410,560.972046 364.045837,555.811401 
	C334.755707,541.223022 309.770172,521.000305 288.657562,496.006378 
	C287.835724,495.033447 287.329773,493.793732 286.857971,492.402985 
z"/>
<path fill="#F4BA17" opacity="1.000000" stroke="none" 
	d="
M638.559448,649.607422 
	C653.131897,643.127319 667.338623,636.799011 681.092896,630.672180 
	C675.186523,765.328125 573.221985,890.897766 441.421356,927.655945 
	C445.212494,920.709351 449.580719,914.012512 452.707825,906.779114 
	C475.313782,854.488708 468.862305,805.781311 433.601837,761.123535 
	C402.386169,721.588440 379.822174,677.662048 364.879761,628.577820 
	C366.770874,629.544006 368.008179,630.075806 369.145020,630.771667 
	C394.125427,646.062805 421.185272,655.780762 450.375763,657.410278 
	C465.515686,658.255371 480.882416,655.798584 496.093933,654.298462 
	C504.514069,653.468018 512.810059,651.432678 521.196533,650.169861 
	C523.254150,649.859985 525.521851,650.153320 527.565796,650.671387 
	C544.380371,654.932678 561.320618,658.366577 578.743958,658.635498 
	C599.040955,658.948853 618.869507,656.015442 638.559448,649.607422 
z"/>
<path fill="#F3B917" opacity="1.000000" stroke="none" 
	d="
M451.996887,582.225220 
	C506.255249,582.294250 557.596436,571.262329 606.234131,548.288513 
	C616.340271,543.514893 626.043884,538.038574 637.562927,537.450195 
	C659.575134,536.325806 677.023743,544.661377 690.581665,562.800293 
	C685.476868,566.646118 680.675537,570.437500 675.700134,573.984924 
	C618.847046,614.520935 555.692078,638.323059 486.434967,647.405457 
	C430.264038,654.771729 382.985504,637.453735 342.608459,599.413086 
	C319.447479,577.592346 304.310333,550.579102 296.144836,519.756653 
	C295.980042,519.134644 296.025665,518.456909 295.873596,516.571472 
	C298.291534,518.797302 300.020294,520.352478 301.709656,521.949341 
	C326.346069,545.236816 354.337128,563.460327 386.332123,574.558289 
	C398.218109,578.681030 411.400055,579.317017 424.076202,580.828186 
	C433.142700,581.909058 442.351196,581.799133 451.996887,582.225220 
z"/>
<path fill="#F2B817" opacity="1.000000" stroke="none" 
	d="
M539.279968,436.201538 
	C538.570312,436.408813 538.251221,436.508148 537.944458,436.636871 
	C526.683472,441.361206 515.781982,440.154175 504.132446,436.778748 
	C466.920624,425.996552 429.426819,416.187622 392.043884,405.995544 
	C390.645874,405.614380 389.268799,405.156464 386.824615,404.412476 
	C406.958923,395.052887 426.206024,386.105682 445.401093,377.182709 
	C451.112213,383.187500 456.381653,389.405701 462.337891,394.876129 
	C492.288269,422.383606 534.791809,427.117798 568.666138,406.952454 
	C578.925293,400.845184 586.595276,392.197998 592.797180,382.136292 
	C593.749573,380.591156 594.662292,379.021637 595.877441,376.987946 
	C615.544373,386.029968 635.089294,395.015900 655.757202,404.518158 
	C616.233948,415.273621 577.955139,425.690460 539.279968,436.201538 
z"/>
<path fill="#F2B817" opacity="1.000000" stroke="none" 
	d="
M635.789856,641.836487 
	C603.639343,651.544189 570.121521,652.872437 542.504456,645.372620 
	C622.343140,624.064514 689.811462,583.441650 745.785767,523.547119 
	C729.752136,581.965942 693.203857,621.317932 635.789856,641.836487 
z"/>
<path fill="#48240F" opacity="1.000000" stroke="none" 
	d="
M524.216736,200.974854 
	C529.617981,199.537689 534.598694,198.089890 539.579346,196.642075 
	C539.528503,196.153259 539.477722,195.664429 539.426880,195.175613 
	C541.645081,197.509277 543.863281,199.842941 546.093628,202.189407 
	C537.192993,213.508774 517.457336,214.342712 505.417236,203.820190 
	C493.100830,193.056198 492.335419,173.610657 503.764648,161.836975 
	C515.326111,149.927109 535.207764,149.868927 546.391113,161.934906 
	C544.030029,164.163544 541.656067,166.404358 539.153198,168.766846 
	C534.425354,164.852509 528.999146,162.189362 522.410034,163.391052 
	C512.964478,165.113678 506.292053,172.544968 506.015442,181.511810 
	C505.739960,190.440384 511.964752,198.150375 521.347168,200.484161 
	C522.153381,200.684708 522.979370,200.806061 524.216736,200.974854 
z"/>`;

  // packages/react/dist/components/logo/Logo.js
  var Logo = react_default.forwardRef(function Logo2({ size = 32, title = "CyberSkill", decorative = false, className, ...props }, forwardedRef) {
    const safeTitle = String(title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return /* @__PURE__ */ jsx(
      "svg",
      {
        ref: forwardedRef,
        ...props,
        className: cx("cs-logo", className),
        width: size,
        height: size,
        viewBox: CS_LOGO_VIEWBOX,
        xmlns: "http://www.w3.org/2000/svg",
        role: decorative ? void 0 : "img",
        "aria-hidden": decorative ? true : void 0,
        "aria-label": decorative ? void 0 : title,
        dangerouslySetInnerHTML: { __html: (decorative ? "" : `<title>${safeTitle}</title>`) + CS_LOGO_MARK_INNER }
      }
    );
  });

  // packages/react/dist/components/navigation/Anchor.js
  var Anchor = react_default.forwardRef(function Anchor2({ items = [], title, className }, forwardedRef) {
    const [act, setAct] = react_default.useState(items.length ? items[0].id : null);
    react_default.useEffect(() => {
      const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
      if (!els.length) return;
      const io = new IntersectionObserver((es) => {
        const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setAct(vis[0].target.id);
      }, { rootMargin: "-20% 0px -70% 0px" });
      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, [items]);
    return /* @__PURE__ */ jsxs("nav", { ref: forwardedRef, className: cx("cs-anchor", className), "aria-label": typeof title === "string" ? title : void 0, children: [
      title ? /* @__PURE__ */ jsx("div", { className: "cs-anchor__title", children: title }) : null,
      items.map((it) => /* @__PURE__ */ jsx("a", { href: "#" + it.id, className: cx("cs-anchor__item", act === it.id && "is-active"), "aria-current": act === it.id ? "location" : void 0, children: it.label }, it.id))
    ] });
  });

  // packages/react/dist/components/navigation/BackTop.js
  var BackTop = react_default.forwardRef(function BackTop2({ threshold = 320, label, lang, className }, forwardedRef) {
    const [show, setShow] = react_default.useState(false);
    const [ref, L] = useLang(lang);
    const lbl = label != null ? label : makeT("BackTop", L)("label");
    react_default.useEffect(() => {
      const on = () => setShow(window.scrollY > threshold);
      on();
      window.addEventListener("scroll", on, { passive: true });
      return () => window.removeEventListener("scroll", on);
    }, [threshold]);
    if (!show) return /* @__PURE__ */ jsx("span", { ref: mergeRefs(ref, forwardedRef), style: { display: "none" } });
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        type: "button",
        className: cx("cs-backtop", className),
        "aria-label": lbl,
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 19V5M5 12l7-7 7 7" }) })
      }
    );
  });

  // packages/react/dist/components/navigation/Breadcrumb.js
  var Breadcrumb = react_default.forwardRef(function Breadcrumb2({ items = [], lang, className, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    return /* @__PURE__ */ jsx("nav", { ref: mergeRefs(ref, forwardedRef), "aria-label": makeT("Breadcrumb", L)("label"), ...props, children: /* @__PURE__ */ jsx("ol", { className: cx("cs-breadcrumb", className), children: items.map((it, i) => {
      const last = i === items.length - 1;
      return /* @__PURE__ */ jsx("li", { children: last ? /* @__PURE__ */ jsx("span", { className: "cs-breadcrumb__current", "aria-current": "page", children: it.label }) : /* @__PURE__ */ jsxs(Fragment2, { children: [
        /* @__PURE__ */ jsx("a", { href: it.href || "#", children: it.label }),
        /* @__PURE__ */ jsx("span", { className: "cs-breadcrumb__sep", "aria-hidden": "true", children: "/" })
      ] }) }, i);
    }) }) });
  });

  // packages/react/dist/components/navigation/CommandPalette.js
  var CommandPalette = react_default.forwardRef(function CommandPalette2({ open, onClose, placeholder, groups = [], lang, className }, forwardedRef) {
    const [q, setQ] = react_default.useState("");
    const panel = react_default.useRef(null);
    const closeRef = react_default.useRef(onClose);
    closeRef.current = onClose;
    useOverlayLayer({
      open: !!open,
      kind: "modal",
      trapFocus: true,
      preferFocusSelector: ".cs-cmdk__search input",
      onEscape: () => closeRef.current && closeRef.current(),
      panelRef: panel
    });
    const [ref, L] = useLang(lang);
    const t = makeT("CommandPalette", L);
    const ph = placeholder != null ? placeholder : t("placeholder");
    if (!open) return null;
    const needle = q.trim().toLowerCase();
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: (el) => {
          ref.current = el;
          panel.current = el;
        },
        className: "cs-cmdk-scrim",
        onClick: onClose,
        children: /* @__PURE__ */ jsxs("div", { className: cx("cs-cmdk", className), role: "dialog", "aria-modal": "true", "aria-label": t("aria"), onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxs("div", { className: "cs-cmdk__search", children: [
            /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
              /* @__PURE__ */ jsx("path", { d: "M21 21l-4.3-4.3" })
            ] }),
            /* @__PURE__ */ jsx("input", { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder: ph }),
            /* @__PURE__ */ jsx("span", { className: "cs-kbd", children: t("esc") })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "cs-cmdk__list", children: groups.map((g, gi) => {
            const items = (g.items || []).filter((it) => !needle || String(it.label).toLowerCase().includes(needle));
            if (!items.length) return null;
            return /* @__PURE__ */ jsxs(react_default.Fragment, { children: [
              g.label ? /* @__PURE__ */ jsx("div", { className: "cs-cmdk__label", children: g.label }) : null,
              items.map((it, ii) => /* @__PURE__ */ jsxs("button", { type: "button", className: "cs-cmdk__item", onClick: () => {
                it.onSelect && it.onSelect();
                onClose && onClose();
              }, children: [
                it.icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: it.icon }) : null,
                /* @__PURE__ */ jsx("span", { children: it.label }),
                it.shortcut ? /* @__PURE__ */ jsx("span", { className: "cs-kbd", children: it.shortcut }) : null
              ] }, ii))
            ] }, gi);
          }) })
        ] })
      }
    );
  });

  // packages/react/dist/components/navigation/Dock.js
  var Dock = react_default.forwardRef(function Dock2({ items = [], label, className }, forwardedRef) {
    const [hov, setHov] = react_default.useState(null);
    return /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: cx("cs-dock", className), role: "toolbar", "aria-label": label, onMouseLeave: () => setHov(null), children: items.map((it, i) => {
      const d = hov == null ? 3 : Math.abs(i - hov);
      const scale = d === 0 ? 1.35 : d === 1 ? 1.15 : 1;
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: cx("cs-dock__item", it.active && "is-active"),
          "aria-label": it.label,
          title: it.label,
          style: { transform: `scale(${scale}) translateY(${d === 0 ? -6 : d === 1 ? -2 : 0}px)` },
          onMouseEnter: () => setHov(i),
          onFocus: () => setHov(i),
          onBlur: () => setHov(null),
          onClick: () => it.onSelect && it.onSelect(),
          children: it.icon
        },
        i
      );
    }) });
  });

  // packages/react/dist/components/navigation/HotKeys.js
  function match(combo, e) {
    const parts = combo.toLowerCase().split("+");
    const key = parts[parts.length - 1];
    const mod = parts.includes("mod") ? e.metaKey || e.ctrlKey : true;
    const shift = parts.includes("shift") ? e.shiftKey : !e.shiftKey || key.length > 1;
    const alt = parts.includes("alt") ? e.altKey : !e.altKey;
    return mod && shift && alt && e.key.toLowerCase() === key;
  }
  var HotKeys = react_default.forwardRef(function HotKeys2({ bindings = [], help = true, children, lang, className }, forwardedRef) {
    const [show, setShow] = react_default.useState(false);
    const [ref, L] = useLang(lang);
    const t = makeT("HotKeys", L);
    react_default.useEffect(() => {
      const on = (e) => {
        if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        if (help && e.key === "?") {
          setShow((s) => !s);
          return;
        }
        if (e.key === "Escape") setShow(false);
        for (const b of bindings) if (match(b.keys, e)) {
          e.preventDefault();
          b.onTrigger && b.onTrigger();
          return;
        }
      };
      document.addEventListener("keydown", on);
      return () => document.removeEventListener("keydown", on);
    }, [bindings, help]);
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-hotkeys", className), children: [
      children,
      show ? /* @__PURE__ */ jsx("div", { className: "cs-hotkeys__sheet", role: "dialog", "aria-label": t("title"), onClick: () => setShow(false), children: /* @__PURE__ */ jsxs("div", { className: "cs-hotkeys__card", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsx("b", { children: t("title") }),
        /* @__PURE__ */ jsxs("ul", { children: [
          bindings.map((b, i) => /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { children: b.description }),
            /* @__PURE__ */ jsx("kbd", { className: "cs-kbd", children: b.keys })
          ] }, i)),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { children: t("toggle") }),
            /* @__PURE__ */ jsx("kbd", { className: "cs-kbd", children: "?" })
          ] })
        ] })
      ] }) }) : null
    ] });
  });

  // packages/react/dist/components/navigation/Link.js
  var Link = react_default.forwardRef(function Link2({ href = "#", variant = "default", external = false, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs(
      "a",
      {
        ref: forwardedRef,
        href,
        className: cx("cs-link", variant !== "default" && "cs-link--" + variant, className),
        target: external ? "_blank" : void 0,
        rel: external ? "noopener noreferrer" : void 0,
        ...props,
        children: [
          children,
          external ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " \u2197" }) : variant === "standalone" ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " \u2192" }) : null
        ]
      }
    );
  });

  // packages/react/dist/components/navigation/Menu.js
  var Menu = react_default.forwardRef(function Menu2({ trigger, children, align = "start", open: controlledOpen, onOpenChange, lang, className }, forwardedRef) {
    const [uOpen, setUOpen] = react_default.useState(false);
    const open = controlledOpen != null ? controlledOpen : uOpen;
    const set = (v) => {
      onOpenChange ? onOpenChange(v) : setUOpen(v);
    };
    const [ref, L] = useLang(lang);
    const t = makeT("Menu", L);
    const triggerRef = react_default.useRef(null);
    const listRef = react_default.useRef(null);
    react_default.useEffect(() => {
      if (!open) return;
      const items = () => listRef.current ? [...listRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')] : [];
      const first = items()[0];
      if (first && first.focus) first.focus();
      const onDoc = (e) => {
        if (ref.current && !ref.current.contains(e.target)) set(false);
      };
      const onKey = (e) => {
        const opts = items();
        if (e.key === "Escape") {
          e.preventDefault();
          set(false);
          const el = triggerRef.current;
          if (el && el.focus) el.focus();
          return;
        }
        if (!opts.length) return;
        const active = document.activeElement;
        const idx = opts.indexOf(active);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          (opts[idx < 0 ? 0 : Math.min(opts.length - 1, idx + 1)] || opts[0]).focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          (opts[idx < 0 ? opts.length - 1 : Math.max(0, idx - 1)] || opts[0]).focus();
        } else if (e.key === "Home") {
          e.preventDefault();
          opts[0].focus();
        } else if (e.key === "End") {
          e.preventDefault();
          opts[opts.length - 1].focus();
        }
      };
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDoc);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);
    const toggle = () => set(!open);
    const triggerNode = react_default.isValidElement(trigger) ? react_default.cloneElement(trigger, {
      ref: (node) => {
        triggerRef.current = node;
        const r = trigger.ref;
        if (typeof r === "function") r(node);
        else if (r && typeof r === "object") r.current = node;
      },
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: (e) => {
        if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
        if (!e.defaultPrevented) toggle();
      }
    }) : /* @__PURE__ */ jsx("button", { type: "button", ref: triggerRef, "aria-haspopup": "menu", "aria-expanded": open, onClick: toggle, children: trigger });
    return /* @__PURE__ */ jsxs("div", { className: cx("cs-menu", className), ref, children: [
      triggerNode,
      open ? /* @__PURE__ */ jsx(
        "div",
        {
          ref: listRef,
          className: cx("cs-menu__list", align === "end" && "cs-menu__list--end"),
          role: "menu",
          "aria-label": t("menu"),
          children
        }
      ) : null
    ] });
  });
  var MenuItem = react_default.forwardRef(function MenuItem2({ danger = false, icon, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("button", { ref: forwardedRef, type: "button", role: "menuitem", className: cx("cs-menu__item", danger && "cs-menu__item--danger", className), ...props, children: [
      icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: icon }) : null,
      children
    ] });
  });

  // packages/react/dist/components/navigation/Menubar.js
  var Menubar = react_default.forwardRef(function Menubar2({ menus = [], className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(null);
    const [focusI, setFocusI] = react_default.useState(0);
    const wrap = react_default.useRef(null);
    const btns = react_default.useRef([]);
    react_default.useEffect(() => {
      if (open == null) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(null);
      };
      const k = (e) => {
        if (e.key === "Escape") {
          const i = open;
          setOpen(null);
          const b = btns.current[i];
          if (b) b.focus();
        }
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open]);
    const nav = (e, i) => {
      let n = null;
      if (e.key === "ArrowRight") n = (i + 1) % menus.length;
      else if (e.key === "ArrowLeft") n = (i - 1 + menus.length) % menus.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = menus.length - 1;
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(i);
        return;
      }
      if (n == null) return;
      e.preventDefault();
      setFocusI(n);
      if (open != null) setOpen(n);
      const b = btns.current[n];
      if (b) b.focus();
    };
    return /* @__PURE__ */ jsx("div", { ref: wrap, className: cx("cs-menubar", className), role: "menubar", children: menus.map((m, i) => /* @__PURE__ */ jsxs("span", { className: "cs-menubar__wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          role: "menuitem",
          "aria-haspopup": "menu",
          "aria-expanded": open === i,
          tabIndex: i === focusI ? 0 : -1,
          ref: (el) => btns.current[i] = el,
          onKeyDown: (e) => nav(e, i),
          onFocus: () => setFocusI(i),
          className: cx("cs-menubar__top", open === i && "is-open"),
          onClick: () => setOpen(open === i ? null : i),
          onMouseEnter: () => {
            if (open != null && open !== i) setOpen(i);
          },
          children: m.label
        }
      ),
      open === i ? /* @__PURE__ */ jsx("span", { className: "cs-menu__list", role: "menu", children: m.items.map((it, j) => it === "-" ? /* @__PURE__ */ jsx("span", { className: "cs-menu__sep" }, j) : /* @__PURE__ */ jsx("button", { type: "button", role: "menuitem", className: cx("cs-menu__item", it.danger && "cs-menu__item--danger"), onClick: () => {
        setOpen(null);
        it.onSelect && it.onSelect();
      }, children: it.label }, j)) }) : null
    ] }, i)) });
  });

  // packages/react/dist/components/navigation/NavigationMenu.js
  var NavigationMenu = react_default.forwardRef(function NavigationMenu2({ items = [], className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(null);
    const wrap = react_default.useRef(null);
    react_default.useEffect(() => {
      if (open == null) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(null);
      };
      const k = (e) => {
        if (e.key === "Escape") setOpen(null);
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open]);
    return /* @__PURE__ */ jsx("nav", { ref: wrap, className: cx("cs-navmenu", className), children: items.map((it, i) => it.panel ? /* @__PURE__ */ jsxs("span", { className: "cs-navmenu__wrap", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: cx("cs-navmenu__top", open === i && "is-open"),
          "aria-expanded": open === i,
          "aria-haspopup": "true",
          onClick: () => setOpen(open === i ? null : i),
          onMouseEnter: () => {
            if (open != null && open !== i) setOpen(i);
          },
          children: [
            it.label,
            " ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u25BE" })
          ]
        }
      ),
      open === i ? /* @__PURE__ */ jsx("span", { className: "cs-navmenu__panel", children: it.panel.map((p, j) => /* @__PURE__ */ jsxs("a", { href: p.href || "#", className: "cs-navmenu__card", onClick: () => setOpen(null), children: [
        /* @__PURE__ */ jsx("b", { children: p.label }),
        p.desc ? /* @__PURE__ */ jsx("small", { children: p.desc }) : null
      ] }, j)) }) : null
    ] }, i) : /* @__PURE__ */ jsx("a", { href: it.href || "#", className: "cs-navmenu__top", children: it.label }, i)) });
  });

  // packages/react/dist/components/navigation/Pagination.js
  function pages(page, count) {
    if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
    const out = [1];
    const lo = Math.max(2, page - 1), hi = Math.min(count - 1, page + 1);
    if (lo > 2) out.push("\u2026");
    for (let p = lo; p <= hi; p++) out.push(p);
    if (hi < count - 1) out.push("\u2026");
    out.push(count);
    return out;
  }
  var Pagination = react_default.forwardRef(function Pagination2({ page = 1, pageCount = 1, onChange, lang, className, ...props }, forwardedRef) {
    const go = (p) => onChange && p >= 1 && p <= pageCount && p !== page && onChange(p);
    const [ref, L] = useLang(lang);
    const t = makeT("Pagination", L);
    return /* @__PURE__ */ jsxs("nav", { ref: mergeRefs(ref, forwardedRef), "aria-label": t("label"), className: cx("cs-pagination", className), ...props, children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => go(page - 1), disabled: page <= 1, "aria-label": t("prev"), children: "\u2039" }),
      pages(page, pageCount).map(
        (p, i) => p === "\u2026" ? /* @__PURE__ */ jsx("span", { className: "cs-pagination__ellipsis", "aria-hidden": "true", children: "\u2026" }, "e" + i) : /* @__PURE__ */ jsx("button", { type: "button", "aria-current": p === page ? "page" : void 0, onClick: () => go(p), children: p }, p)
      ),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => go(page + 1), disabled: page >= pageCount, "aria-label": t("next"), children: "\u203A" })
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
    const Tag3 = href ? "a" : "button";
    return /* @__PURE__ */ jsxs(Tag3, { ref: forwardedRef, className: cx("cs-nav-item", active && "is-active", className), href, "aria-current": active ? "page" : void 0, onClick, ...props, children: [
      icon ? /* @__PURE__ */ jsx("span", { className: "cs-nav-item__icon", children: icon }) : null,
      /* @__PURE__ */ jsx("span", { children }),
      trail != null ? /* @__PURE__ */ jsx("span", { className: "cs-nav-item__trail", children: trail }) : null
    ] });
  });

  // packages/react/dist/components/navigation/Steps.js
  var Steps = react_default.forwardRef(function Steps2({ steps = [], current = 0, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Steps", L);
    return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-steps", className), role: "list", "aria-label": t("label"), children: steps.map((s, i) => {
      const state = i < current ? "done" : i === current ? "active" : "todo";
      return /* @__PURE__ */ jsxs("div", { className: cx("cs-step", `cs-step--${state}`), role: "listitem", children: [
        /* @__PURE__ */ jsx("span", { className: "cs-step__marker", children: state === "done" ? "\u2713" : s.n || i + 1 }),
        /* @__PURE__ */ jsx("span", { className: "cs-step__title", children: s.title }),
        s.body ? /* @__PURE__ */ jsx("span", { className: "cs-step__body", children: s.body }) : null
      ] }, i);
    }) });
  });

  // packages/react/dist/components/navigation/Tabs.js
  var Tabs = react_default.forwardRef(function Tabs2({ tabs = [], value, onChange, lang, className, "aria-label": ariaLabel, ...props }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const t = makeT("Tabs", L);
    const refs = react_default.useRef([]);
    const idx = Math.max(0, tabs.findIndex((tab) => tab.value === value));
    const key = (e, i) => {
      let n = null;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = tabs.length - 1;
      if (n == null) return;
      e.preventDefault();
      if (onChange) onChange(tabs[n].value);
      const b = refs.current[n];
      if (b) b.focus();
    };
    return /* @__PURE__ */ jsx("div", { ref: mergeRefs(ref, forwardedRef), role: "tablist", "aria-label": ariaLabel ?? t("list"), className: cx("cs-tabs", className), ...props, children: tabs.map((t2, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": value === t2.value,
        tabIndex: i === idx ? 0 : -1,
        ref: (el) => refs.current[i] = el,
        onKeyDown: (e) => key(e, i),
        className: "cs-tab",
        onClick: () => onChange && onChange(t2.value),
        children: [
          t2.label,
          t2.count != null ? /* @__PURE__ */ jsx("span", { className: "cs-tab__count", children: t2.count }) : null
        ]
      },
      t2.value
    )) });
  });
  var Tab = react_default.forwardRef(function Tab2({ selected = false, count, children, className, ...props }, forwardedRef) {
    return /* @__PURE__ */ jsxs("button", { ref: forwardedRef, type: "button", role: "tab", "aria-selected": selected, className: cx("cs-tab", className), ...props, children: [
      children,
      count != null ? /* @__PURE__ */ jsx("span", { className: "cs-tab__count", children: count }) : null
    ] });
  });

  // packages/react/dist/components/navigation/Toolbar.js
  var Toolbar = react_default.forwardRef(function Toolbar2({ items = [], overflowAfter, label, lang, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const [focusIdx, setFocusIdx] = react_default.useState(0);
    const wrap = react_default.useRef(null);
    const btnRefs = react_default.useRef([]);
    const menuRefs = react_default.useRef([]);
    const [ref, L] = useLang(lang);
    const t = makeT("Toolbar", L);
    const cut = overflowAfter != null ? overflowAfter : items.length;
    const head = items.slice(0, cut);
    const tail = items.slice(cut).filter((x) => x !== "-");
    const hasMore = tail.length > 0;
    const controlMeta = [];
    head.forEach((it, i) => {
      if (it !== "-") controlMeta.push({ kind: "head", headIndex: i });
    });
    if (hasMore) controlMeta.push({ kind: "more" });
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", d);
      return () => document.removeEventListener("mousedown", d);
    }, [open]);
    react_default.useEffect(() => {
      if (focusIdx >= controlMeta.length) setFocusIdx(Math.max(0, controlMeta.length - 1));
    }, [focusIdx, controlMeta.length]);
    const focusControl = (i) => {
      const next = Math.max(0, Math.min(controlMeta.length - 1, i));
      setFocusIdx(next);
      requestAnimationFrame(() => {
        const el = btnRefs.current[next];
        if (el) el.focus();
      });
    };
    const onToolbarKeyDown = (e, i) => {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusControl(i + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusControl(i - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        focusControl(0);
      } else if (e.key === "End") {
        e.preventDefault();
        focusControl(controlMeta.length - 1);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    const onMenuKeyDown = (e, i) => {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const n = Math.min(tail.length - 1, i + 1);
        const el = menuRefs.current[n];
        if (el) el.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const n = Math.max(0, i - 1);
        const el = menuRefs.current[n];
        if (el) el.focus();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        const moreIdx = controlMeta.findIndex((c) => c.kind === "more");
        if (moreIdx >= 0) focusControl(moreIdx);
      } else if (e.key === "Home") {
        e.preventDefault();
        const el = menuRefs.current[0];
        if (el) el.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const el = menuRefs.current[tail.length - 1];
        if (el) el.focus();
      }
    };
    let controlI = 0;
    return /* @__PURE__ */ jsxs("div", { ref: (el) => {
      wrap.current = el;
      ref.current = el;
    }, className: cx("cs-toolbar", className), role: "toolbar", "aria-label": label, "aria-orientation": "horizontal", children: [
      head.map((it, i) => {
        if (it === "-") return /* @__PURE__ */ jsx("span", { className: "cs-toolbar__sep", "aria-hidden": "true" }, "sep-" + i);
        const ci = controlI++;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "cs-toolbar__btn",
            tabIndex: ci === focusIdx ? 0 : -1,
            ref: (el) => {
              btnRefs.current[ci] = el;
            },
            onFocus: () => setFocusIdx(ci),
            onKeyDown: (e) => onToolbarKeyDown(e, ci),
            onClick: () => it.onSelect && it.onSelect(),
            children: [
              it.icon,
              it.label ? /* @__PURE__ */ jsx("span", { children: it.label }) : null
            ]
          },
          "btn-" + i
        );
      }),
      hasMore ? (() => {
        const ci = controlI++;
        return /* @__PURE__ */ jsxs("span", { className: "cs-toolbar__more", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "cs-toolbar__btn",
              "aria-haspopup": "menu",
              "aria-expanded": open,
              "aria-label": t("more"),
              tabIndex: ci === focusIdx ? 0 : -1,
              ref: (el) => {
                btnRefs.current[ci] = el;
              },
              onFocus: () => setFocusIdx(ci),
              onKeyDown: (e) => {
                onToolbarKeyDown(e, ci);
                if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                  if (!open) {
                    e.preventDefault();
                    setOpen(true);
                    requestAnimationFrame(() => {
                      const el = menuRefs.current[0];
                      if (el) el.focus();
                    });
                  }
                }
              },
              onClick: () => setOpen((o) => !o),
              children: "\u22EF"
            }
          ),
          open ? /* @__PURE__ */ jsx("span", { className: "cs-menu__list", role: "menu", children: tail.map((it, i) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "menuitem",
              className: "cs-menu__item",
              ref: (el) => {
                menuRefs.current[i] = el;
              },
              onKeyDown: (e) => onMenuKeyDown(e, i),
              onClick: () => {
                setOpen(false);
                it.onSelect && it.onSelect();
              },
              children: it.label
            },
            i
          )) }) : null
        ] });
      })() : null
    ] });
  });

  // packages/react/dist/components/overlays/AlertDialog.js
  var AlertDialog = react_default.forwardRef(function AlertDialog2({
    open,
    defaultOpen = false,
    onOpenChange,
    title,
    description,
    children,
    confirmLabel,
    cancelLabel,
    tone,
    variant,
    onConfirm,
    onCancel,
    lang,
    className,
    ...props
  }, forwardedRef) {
    const baseId = react_default.useId();
    const titleId = baseId + "-title";
    const descId = baseId + "-desc";
    const [ref, L] = useLang(lang);
    const t = makeT("AlertDialog", L);
    const panel = react_default.useRef(null);
    const uncontrolled = open === void 0;
    const [internal, setInternal] = react_default.useState(!!defaultOpen);
    const isOpen = uncontrolled ? internal : !!open;
    const setOpen = (next) => {
      if (uncontrolled) setInternal(next);
      onOpenChange?.(next);
    };
    const destructive = (tone ?? variant) === "destructive";
    const confirmRef = react_default.useRef(onConfirm);
    confirmRef.current = onConfirm;
    const cancelRef = react_default.useRef(onCancel);
    cancelRef.current = onCancel;
    const setOpenRef = react_default.useRef(setOpen);
    setOpenRef.current = setOpen;
    useOverlayLayer({
      open: isOpen,
      kind: "modal",
      trapFocus: true,
      preferFocusSelector: ".cs-alert-dialog__confirm",
      onEscape: () => {
        setOpenRef.current(false);
        cancelRef.current?.();
      },
      panelRef: panel
    });
    const cl = cancelLabel != null ? cancelLabel : t("cancel");
    const cf = confirmLabel != null ? confirmLabel : t("confirm");
    const body = description ?? children;
    const hasDesc = body != null && body !== false && body !== "";
    if (!isOpen) return null;
    return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: "cs-dialog-layer cs-alert-dialog-layer", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "cs-dialog__overlay",
          onClick: () => {
            setOpen(false);
            cancelRef.current?.();
          },
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxs(
        "section",
        {
          ...props,
          ref: panel,
          tabIndex: -1,
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": hasDesc ? descId : void 0,
          className: cx("cs-dialog", "cs-alert-dialog", destructive && "cs-alert-dialog--destructive", className),
          children: [
            /* @__PURE__ */ jsx("header", { className: "cs-dialog__header", children: /* @__PURE__ */ jsx("h2", { id: titleId, className: "cs-dialog__title", children: title }) }),
            hasDesc ? /* @__PURE__ */ jsx("div", { id: descId, className: "cs-dialog__body", children: body }) : null,
            /* @__PURE__ */ jsxs("footer", { className: "cs-dialog__actions", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "cs-button cs-button--ghost cs-button--md",
                  onClick: () => {
                    setOpen(false);
                    cancelRef.current?.();
                  },
                  children: cl
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: cx(
                    "cs-button",
                    "cs-button--md",
                    "cs-alert-dialog__confirm",
                    destructive ? "cs-button--danger" : "cs-button--primary"
                  ),
                  onClick: () => {
                    setOpen(false);
                    confirmRef.current?.();
                  },
                  children: cf
                }
              )
            ] })
          ]
        }
      )
    ] });
  });

  // packages/react/dist/components/overlays/ContextMenu.js
  var ContextMenu = react_default.forwardRef(function ContextMenu2({ items = [], children, lang, className }, forwardedRef) {
    const [pos, setPos] = react_default.useState(null);
    const [ref, L] = useLang(lang);
    const t = makeT("ContextMenu", L);
    react_default.useEffect(() => {
      if (!pos) return;
      const close = () => setPos(null);
      const k = (e) => {
        if (e.key === "Escape") setPos(null);
      };
      document.addEventListener("click", close);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("click", close);
        document.removeEventListener("keydown", k);
      };
    }, [pos]);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: mergeRefs(ref, forwardedRef),
        className: cx("cs-ctxmenu-zone", className),
        onContextMenu: (e) => {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        },
        children: [
          children,
          pos ? /* @__PURE__ */ jsx("div", { className: "cs-menu__list", role: "menu", "aria-label": t("menu"), style: { position: "absolute", insetInlineStart: pos.x, insetBlockStart: pos.y }, children: items.map((it, i) => it === "-" ? /* @__PURE__ */ jsx("div", { className: "cs-menu__sep" }, i) : /* @__PURE__ */ jsx("button", { type: "button", role: "menuitem", className: cx("cs-menu__item", it.danger && "cs-menu__item--danger"), onClick: () => {
            setPos(null);
            it.onSelect && it.onSelect();
          }, children: it.label }, i)) }) : null
        ]
      }
    );
  });

  // packages/react/dist/components/overlays/Drawer.js
  var Drawer = react_default.forwardRef(function Drawer2({ open, onClose, title, side = "right", children, actions, lang, className }, forwardedRef) {
    const [ref, L] = useLang(lang);
    const panel = react_default.useRef(null);
    const closeRef = react_default.useRef(onClose);
    closeRef.current = onClose;
    useOverlayLayer({
      open: !!open,
      kind: "modal",
      trapFocus: true,
      onEscape: () => closeRef.current && closeRef.current(),
      panelRef: panel
    });
    const t = makeT("Drawer", L);
    if (!open) return null;
    return /* @__PURE__ */ jsxs(Fragment2, { children: [
      /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: "cs-drawer-scrim", onClick: onClose, "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs(
        "aside",
        {
          ref: (el) => {
            panel.current = el;
            ref.current = el;
          },
          tabIndex: -1,
          className: cx("cs-drawer", side === "left" && "cs-drawer--left", className),
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof title === "string" ? title : t("panel"),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "cs-drawer__header", children: [
              title ? /* @__PURE__ */ jsx("h2", { className: "cs-drawer__title", children: title }) : null,
              /* @__PURE__ */ jsx("button", { type: "button", className: "cs-drawer__close", "aria-label": t("close"), onClick: onClose, children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "cs-drawer__body", tabIndex: 0, children }),
            actions ? /* @__PURE__ */ jsx("div", { className: "cs-drawer__footer", children: actions }) : null
          ]
        }
      )
    ] });
  });

  // packages/react/dist/components/overlays/HoverCard.js
  var HoverCard = react_default.forwardRef(function HoverCard2({ trigger, children, openDelay = 150, closeDelay = 200, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const t1 = react_default.useRef();
    const t2 = react_default.useRef();
    const show = () => {
      clearTimeout(t2.current);
      t1.current = setTimeout(() => setOpen(true), openDelay);
    };
    const hide = () => {
      clearTimeout(t1.current);
      t2.current = setTimeout(() => setOpen(false), closeDelay);
    };
    react_default.useEffect(() => () => {
      clearTimeout(t1.current);
      clearTimeout(t2.current);
    }, []);
    return /* @__PURE__ */ jsxs("span", { ref: forwardedRef, className: cx("cs-hovercard", className), onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide, children: [
      trigger,
      open ? /* @__PURE__ */ jsx("span", { className: "cs-hovercard__panel", role: "dialog", children }) : null
    ] });
  });

  // packages/react/dist/components/overlays/Popconfirm.js
  var Popconfirm = react_default.forwardRef(function Popconfirm2({ trigger, title, onConfirm, onCancel, okLabel, cancelLabel, lang, className }, forwardedRef) {
    const [open, setOpen] = react_default.useState(false);
    const wrap = react_default.useRef(null);
    const [ref, L] = useLang(lang);
    const t = makeT("Popconfirm", L);
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      const k = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open]);
    const toggle = () => setOpen((o) => !o);
    const triggerNode = react_default.isValidElement(trigger) ? react_default.cloneElement(trigger, {
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      onClick: (e) => {
        if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
        if (!e.defaultPrevented) toggle();
      }
    }) : /* @__PURE__ */ jsx("button", { type: "button", "aria-haspopup": "dialog", "aria-expanded": open, onClick: toggle, children: trigger });
    return /* @__PURE__ */ jsxs("span", { ref: (el) => {
      wrap.current = el;
      ref.current = el;
    }, className: cx("cs-popconfirm", className), children: [
      triggerNode,
      open ? /* @__PURE__ */ jsxs("span", { className: "cs-popconfirm__panel", role: "alertdialog", "aria-label": typeof title === "string" ? title : void 0, children: [
        /* @__PURE__ */ jsx("span", { className: "cs-popconfirm__title", children: title }),
        /* @__PURE__ */ jsxs("span", { className: "cs-popconfirm__actions", children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--ghost cs-button--xs", onClick: () => {
            setOpen(false);
            onCancel && onCancel();
          }, children: cancelLabel != null ? cancelLabel : t("cancel") }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--primary cs-button--xs", onClick: () => {
            setOpen(false);
            onConfirm && onConfirm();
          }, children: okLabel != null ? okLabel : t("ok") })
        ] })
      ] }) : null
    ] });
  });

  // packages/react/dist/components/overlays/Popover.js
  var Popover = react_default.forwardRef(function Popover2({ trigger, children, align = "start", open: controlled, onOpenChange, className }, forwardedRef) {
    const [u, setU] = react_default.useState(false);
    const open = controlled != null ? controlled : u;
    const set = (v) => onOpenChange ? onOpenChange(v) : setU(v);
    const ref = react_default.useRef(null);
    react_default.useEffect(() => {
      if (!open) return;
      const d = (e) => {
        if (ref.current && !ref.current.contains(e.target)) set(false);
      };
      const k = (e) => {
        if (e.key === "Escape") set(false);
      };
      document.addEventListener("mousedown", d);
      document.addEventListener("keydown", k);
      return () => {
        document.removeEventListener("mousedown", d);
        document.removeEventListener("keydown", k);
      };
    }, [open]);
    const toggle = () => set(!open);
    const triggerNode = react_default.isValidElement(trigger) ? react_default.cloneElement(trigger, {
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      onClick: (e) => {
        if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
        if (!e.defaultPrevented) toggle();
      }
    }) : /* @__PURE__ */ jsx("button", { type: "button", "aria-haspopup": "dialog", "aria-expanded": open, onClick: toggle, children: trigger });
    return /* @__PURE__ */ jsxs("span", { className: cx("cs-popover", className), ref, children: [
      triggerNode,
      open ? /* @__PURE__ */ jsx("div", { className: cx("cs-popover__panel", align === "end" && "cs-popover__panel--end"), role: "dialog", children }) : null
    ] });
  });

  // packages/react/dist/components/overlays/Tour.js
  var Tour = react_default.forwardRef(function Tour2({ steps = [], open, onClose, lang, className }, forwardedRef) {
    const [i, setI] = react_default.useState(0);
    const [rect, setRect] = react_default.useState(null);
    const [pop, setPop] = react_default.useState({ top: 80, left: 40 });
    const [ref, L] = useLang(lang);
    const t = makeT("Tour", L);
    react_default.useEffect(() => {
      if (open) setI(0);
    }, [open]);
    react_default.useEffect(() => {
      if (!open || !steps[i]) return void 0;
      const el = document.querySelector(steps[i].target);
      if (el) {
        const r = el.getBoundingClientRect();
        const next = { x: r.left - 6, y: r.top - 6, w: r.width + 12, h: r.height + 12 };
        setRect(next);
        setPop({
          top: Math.min(window.innerHeight - 170, next.y + next.h + 12),
          left: Math.max(12, Math.min(window.innerWidth - 292, next.x))
        });
      } else {
        setRect(null);
        setPop({ top: 80, left: 40 });
      }
      const k = (e) => {
        if (e.key === "Escape") onClose && onClose();
      };
      document.addEventListener("keydown", k);
      return () => document.removeEventListener("keydown", k);
    }, [open, i, steps, onClose]);
    if (!open || !steps.length) return /* @__PURE__ */ jsx("span", { ref: mergeRefs(ref, forwardedRef), style: { display: "none" } });
    const s = steps[i];
    const last = i === steps.length - 1;
    return /* @__PURE__ */ jsxs("div", { ref, className: cx("cs-tour", className), children: [
      /* @__PURE__ */ jsx("div", { className: "cs-tour__scrim", onClick: onClose }),
      rect ? /* @__PURE__ */ jsx("div", { className: "cs-tour__hole", style: { left: rect.x, top: rect.y, width: rect.w, height: rect.h } }) : null,
      /* @__PURE__ */ jsxs("div", { className: "cs-tour__pop", role: "dialog", "aria-label": typeof s.title === "string" ? s.title : void 0, style: { left: pop.left, top: pop.top }, children: [
        /* @__PURE__ */ jsx("b", { children: s.title }),
        s.body ? /* @__PURE__ */ jsx("p", { children: s.body }) : null,
        /* @__PURE__ */ jsxs("div", { className: "cs-tour__bar", children: [
          /* @__PURE__ */ jsx("span", { className: "cs-tour__count", children: i + 1 + " / " + steps.length }),
          /* @__PURE__ */ jsxs("span", { className: "cs-tour__btns", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--ghost cs-button--xs", onClick: onClose, children: t("skip") }),
            i > 0 ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--secondary cs-button--xs", onClick: () => setI(i - 1), children: t("back") }) : null,
            /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--primary cs-button--xs", onClick: () => last ? onClose && onClose() : setI(i + 1), children: last ? t("done") : t("next") })
          ] })
        ] })
      ] })
    ] });
  });

  // packages/react/dist/components/textfield/TextField.js
  var TextField = react_default.forwardRef(function TextField2({
    id,
    label,
    description,
    error,
    disabled = false,
    readOnly = false,
    className,
    children,
    // never rendered on purpose: keeps stray children out of {...props} → void <input>
    ...props
  }, forwardedRef) {
    const generatedId = react_default.useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : void 0;
    const errorId = error ? `${inputId}-error` : void 0;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || void 0;
    return /* @__PURE__ */ jsxs(
      "label",
      {
        ref: forwardedRef,
        className: cx("cs-field", disabled && "is-disabled", error && "is-invalid", className),
        htmlFor: inputId,
        children: [
          /* @__PURE__ */ jsx("span", { className: "cs-field__label", children: label }),
          description ? /* @__PURE__ */ jsx("span", { id: descriptionId, className: "cs-field__description", children: description }) : null,
          /* @__PURE__ */ jsx(
            "input",
            {
              ...props,
              id: inputId,
              disabled,
              readOnly,
              "aria-invalid": error ? true : void 0,
              "aria-describedby": describedBy,
              className: "cs-field__control"
            }
          ),
          error ? /* @__PURE__ */ jsx("span", { id: errorId, className: "cs-field__error", role: "alert", children: error }) : null
        ]
      }
    );
  });
  return __toCommonJS(index_exports);
})();
