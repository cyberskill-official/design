// CyberSkill Design System — ESM entry point (GENERATED from _ds_manifest.json at v1.3.6).
// No build step: import this module directly in a browser. It ensures React 19.2.8 via umd-react
// (official React 19 dropped UMD; pinned + SRI; skipped when window.React already exists), side-loads
// ../_ds_bundle.js once, resolves the compiler-assigned namespace BY PREFIX (never a hardcoded suffix),
// and re-exports every component. Styles are NOT injected — link styles.css yourself.
// Regenerate when exports change — the esm-smoke gate fails on export/manifest drift.
const g = typeof window !== "undefined" ? window : globalThis;
async function ensureScript(src, integrity){
  const href = new URL(src, import.meta.url).href;
  if ([...document.scripts].some(s => s.src === href)) return;
  await new Promise((res, rej) => { const s = document.createElement("script"); s.src = href;
    if (integrity) { s.integrity = integrity; s.crossOrigin = "anonymous"; }
    s.onload = res; s.onerror = () => rej(new Error("cs.js: failed to load " + href)); document.head.appendChild(s); });
}
async function ensureReact() {
  const localReact = new URL("../_vendor/react/react.production.min.js", import.meta.url).href;
  const localDom = new URL("../_vendor/react/react-dom.production.min.js", import.meta.url).href;
  const cdnReact = "https://unpkg.com/umd-react@19.2.8/dist/react.production.min.js";
  const cdnDom = "https://unpkg.com/umd-react@19.2.8/dist/react-dom.production.min.js";
  const sriReact = "sha384-/nh8CKeV7Pk42Gpda6L4DM1JtZ2bwPOi+eh9O7+a1Y22UkGs8+mw3aW1shQ9FV30";
  const sriDom = "sha384-rhLCB72qrpcezgY2QW0panvW9IeO32m94nvuDVRD/iEGHXoUbjtijL6Xi/Z5/mzu";
  if (!g.React) {
    try { await ensureScript(localReact); } catch { await ensureScript(cdnReact, sriReact); }
  }
  if (!g.ReactDOM) {
    try { await ensureScript(localDom); } catch { await ensureScript(cdnDom, sriDom); }
  }
}
await ensureReact();
const found = () => Object.keys(g).find(k => /^CyberSkillDesignSystem_/.test(k));
if (!found()) await ensureScript("../_ds_bundle.js");
export const CS = g[found()];
if (!CS) throw new Error("cs.js: bundle loaded but no CyberSkillDesignSystem_* namespace found");
export default CS;
export const VERSION = "1.3.6";
export const AIDisclosureBadge = CS.AIDisclosureBadge;
export const Accordion = CS.Accordion;
export const Alert = CS.Alert;
export const AlertDialog = CS.AlertDialog;
export const Anchor = CS.Anchor;
export const AspectRatio = CS.AspectRatio;
export const Avatar = CS.Avatar;
export const AvatarGroup = CS.AvatarGroup;
export const BackTop = CS.BackTop;
export const Badge = CS.Badge;
export const Breadcrumb = CS.Breadcrumb;
export const Button = CS.Button;
export const ButtonGroup = CS.ButtonGroup;
export const CS_ICONS = CS.CS_ICONS;
export const CS_LOGO_MARK_INNER = CS.CS_LOGO_MARK_INNER;
export const CS_LOGO_VIEWBOX = CS.CS_LOGO_VIEWBOX;
export const Calendar = CS.Calendar;
export const Card = CS.Card;
export const CardBody = CS.CardBody;
export const CardFooter = CS.CardFooter;
export const CardHeader = CS.CardHeader;
export const Carousel = CS.Carousel;
export const Cascader = CS.Cascader;
export const Chart = CS.Chart;
export const ChatMessage = CS.ChatMessage;
export const Checkbox = CS.Checkbox;
export const CitationList = CS.CitationList;
export const CodeBlock = CS.CodeBlock;
export const Collapsible = CS.Collapsible;
export const ColorPicker = CS.ColorPicker;
export const Combobox = CS.Combobox;
export const CommandPalette = CS.CommandPalette;
export const Comment = CS.Comment;
export const ConfidenceMeter = CS.ConfidenceMeter;
export const ContextMenu = CS.ContextMenu;
export const DataGrid = CS.DataGrid;
export const DataTable = CS.DataTable;
export const DatePicker = CS.DatePicker;
export const DescriptionList = CS.DescriptionList;
export const Dialog = CS.Dialog;
export const Divider = CS.Divider;
export const Dock = CS.Dock;
export const Drawer = CS.Drawer;
export const Editor = CS.Editor;
export const EmptyState = CS.EmptyState;
export const FileUpload = CS.FileUpload;
export const FloatingActionButton = CS.FloatingActionButton;
export const Form = CS.Form;
export const FormField = CS.FormField;
export const FormFieldArray = CS.FormFieldArray;
export const FormWizard = CS.FormWizard;
export const HotKeys = CS.HotKeys;
export const HoverCard = CS.HoverCard;
export const HumanReviewGate = CS.HumanReviewGate;
export const Icon = CS.Icon;
export const Image = CS.Image;
export const InlineEdit = CS.InlineEdit;
export const InputGroup = CS.InputGroup;
export const InputOTP = CS.InputOTP;
export const Item = CS.Item;
export const Kbd = CS.Kbd;
export const Link = CS.Link;
export const List = CS.List;
export const ListItem = CS.ListItem;
export const Logo = CS.Logo;
export const LumiAvatar = CS.LumiAvatar;
export const Masonry = CS.Masonry;
export const Mentions = CS.Mentions;
export const Menu = CS.Menu;
export const MenuItem = CS.MenuItem;
export const Menubar = CS.Menubar;
export const NativeSelect = CS.NativeSelect;
export const NavItem = CS.NavItem;
export const NavigationMenu = CS.NavigationMenu;
export const NumberField = CS.NumberField;
export const OverlayProvider = CS.OverlayProvider;
export const Pagination = CS.Pagination;
export const Popconfirm = CS.Popconfirm;
export const Popover = CS.Popover;
export const ProgressBar = CS.ProgressBar;
export const PromptInput = CS.PromptInput;
export const PromptSuggestions = CS.PromptSuggestions;
export const QRCode = CS.QRCode;
export const Radio = CS.Radio;
export const RadioGroup = CS.RadioGroup;
export const Rating = CS.Rating;
export const Result = CS.Result;
export const ScrollArea = CS.ScrollArea;
export const SearchField = CS.SearchField;
export const SegmentedControl = CS.SegmentedControl;
export const Select = CS.Select;
export const Sidebar = CS.Sidebar;
export const Skeleton = CS.Skeleton;
export const Slider = CS.Slider;
export const Sortable = CS.Sortable;
export const Spinner = CS.Spinner;
export const Splitter = CS.Splitter;
export const Stat = CS.Stat;
export const StatusIndicator = CS.StatusIndicator;
export const Steps = CS.Steps;
export const Switch = CS.Switch;
export const Tab = CS.Tab;
export const Tabs = CS.Tabs;
export const Tag = CS.Tag;
export const TagInput = CS.TagInput;
export const Terminal = CS.Terminal;
export const TextField = CS.TextField;
export const Textarea = CS.Textarea;
export const TimePicker = CS.TimePicker;
export const Timeline = CS.Timeline;
export const Toast = CS.Toast;
export const ToastStack = CS.ToastStack;
export const Toggle = CS.Toggle;
export const Toolbar = CS.Toolbar;
export const Tooltip = CS.Tooltip;
export const Tour = CS.Tour;
export const Transfer = CS.Transfer;
export const Tree = CS.Tree;
export const TreeSelect = CS.TreeSelect;
export const TreeTable = CS.TreeTable;
export const TypingIndicator = CS.TypingIndicator;
export const Watermark = CS.Watermark;
