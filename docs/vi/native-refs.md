# Ref native của component

Component có phần tử native cung cấp `ref` theo bảng bên dưới. `LocaleProvider` và `OverlayProvider` chỉ cung cấp context, không có ref DOM. `rootProps` và `controlProps` vẫn là bag thuộc tính: `ref` và `key` bị bảo vệ, không phải kênh chuyển tiếp ref.

```jsx
const field = React.useRef(null);
const wrapper = React.useRef(null);
const search = React.useRef(null);
<TextField ref={field} label="Tên" />
<Combobox ref={wrapper} controlRef={search} options={options} />
// Sau khi mount: field.current.focus(); search.current.focus();
// wrapper.current.getBoundingClientRect() đo wrapper của composite.
```

Đích giữ hợp đồng native/focus hiện có: TextField, Checkbox và NumberField cung cấp input; Select cung cấp select; Textarea và Mentions cung cấp textarea; Image cung cấp ảnh bên trong. Composite cung cấp root/group hiện có. Control riêng do component quản lý có `controlRef`; Rating và InputOTP cung cấp group, không chọn item đang hoạt động. Không chọn trigger hay child do caller cung cấp làm đích ref của component.

Ref object và callback phối hợp với ref nội bộ. Ref ổn định giữ nguyên qua lần render thông thường; thay ref hoặc unmount sẽ tháo ref của chủ cũ. Callback React 18 nhận `null` khi tháo. Hàm cleanup của callback React 19 được giữ lại. Đổi danh tính callback vẫn tạo chu kỳ tháo/gắn bình thường. Ref không tự biến phần tử không focus được thành phần tử focus được và không thêm tab stop.

Panel cung cấp phần tử ngữ nghĩa được quản lý, không phải scrim hay wrapper trigger. Panel chưa mount, BackTop đang ẩn, fallback Image và input chưa bật của InlineEdit trả `null` cho đích chưa có. Bubble ẩn của Tooltip vẫn được mount. Consumer phải kiểm tra `current` và chờ React commit thay đổi trạng thái.

## Đích native

Bảng là hợp đồng đích công khai. Khai báo và prompt cạnh component mô tả cùng đích. Regression trình duyệt mount đủ 118 đích và mọi control riêng trên React 18/19 với Chromium, Firefox, WebKit. Đây là kiểm tra ref tự động; chấp nhận sản phẩm và accessibility thủ công vẫn là bước riêng.

| Component | Kiểu phần tử `ref` | `controlRef` riêng |
| --- | --- | --- |
| AIDisclosureBadge | HTMLSpanElement | HTMLButtonElement |
| Accordion | HTMLDivElement | — |
| Alert | HTMLDivElement | — |
| AlertDialog | HTMLElement | — |
| Anchor | HTMLElement | — |
| AspectRatio | HTMLDivElement | — |
| Avatar | HTMLSpanElement | — |
| AvatarGroup | HTMLDivElement | — |
| BackTop | HTMLButtonElement | — |
| Badge | HTMLSpanElement | — |
| Breadcrumb | HTMLElement | — |
| Button | HTMLButtonElement | — |
| ButtonGroup | HTMLDivElement | — |
| Calendar | HTMLDivElement | — |
| Card | Element | — |
| CardBody | HTMLDivElement | — |
| CardFooter | HTMLDivElement | — |
| CardHeader | HTMLDivElement | — |
| Carousel | HTMLDivElement | — |
| Cascader | HTMLDivElement | HTMLButtonElement |
| Chart | HTMLElement | — |
| ChatMessage | HTMLDivElement | — |
| Checkbox | HTMLInputElement | — |
| CitationList | HTMLDivElement | — |
| CodeBlock | HTMLDivElement | — |
| Collapsible | HTMLDivElement | HTMLButtonElement |
| ColorPicker | HTMLSpanElement | HTMLButtonElement |
| Combobox | HTMLDivElement | HTMLInputElement |
| CommandPalette | HTMLDivElement | HTMLInputElement |
| Comment | HTMLDivElement | — |
| ConfidenceMeter | HTMLDivElement | — |
| ContextMenu | HTMLDivElement | — |
| DataGrid | HTMLDivElement | — |
| DataTable | HTMLDivElement | — |
| DatePicker | HTMLDivElement | HTMLButtonElement |
| DescriptionList | HTMLDListElement | — |
| Dialog | HTMLElement | — |
| Divider | HTMLDivElement / HTMLHRElement | — |
| Dock | HTMLDivElement | — |
| Drawer | HTMLDivElement | — |
| Editor | HTMLDivElement | HTMLDivElement |
| EmptyState | HTMLDivElement | — |
| FileUpload | HTMLDivElement | HTMLInputElement |
| FloatingActionButton | HTMLDivElement | HTMLButtonElement |
| Form | HTMLFormElement | — |
| FormField | HTMLDivElement | — |
| FormFieldArray | HTMLDivElement | — |
| FormWizard | HTMLDivElement | — |
| HotKeys | HTMLDivElement | — |
| HoverCard | HTMLSpanElement | — |
| HumanReviewGate | HTMLElement | — |
| Icon | SVGSVGElement | — |
| Image | HTMLImageElement | — |
| InlineEdit | HTMLSpanElement | HTMLInputElement |
| InputGroup | HTMLDivElement | — |
| InputOTP | HTMLDivElement | — |
| Item | HTMLDivElement / HTMLButtonElement / HTMLAnchorElement | — |
| Kbd | HTMLElement | — |
| Link | HTMLAnchorElement | — |
| List | HTMLDivElement | — |
| ListItem | HTMLDivElement | — |
| LocaleProvider | Context only | — |
| Logo | SVGSVGElement | — |
| LumiAvatar | HTMLSpanElement | — |
| Masonry | HTMLDivElement | — |
| Mentions | HTMLTextAreaElement | — |
| Menu | HTMLDivElement | — |
| MenuItem | HTMLButtonElement | — |
| Menubar | HTMLDivElement | — |
| NativeSelect | HTMLSelectElement | — |
| NavItem | HTMLButtonElement / HTMLAnchorElement | — |
| NavigationMenu | HTMLElement | — |
| NumberField | HTMLInputElement | — |
| OverlayProvider | Context only | — |
| Pagination | HTMLElement | — |
| Popconfirm | HTMLSpanElement | — |
| Popover | HTMLDivElement | — |
| ProgressBar | HTMLDivElement | — |
| PromptInput | HTMLDivElement | HTMLTextAreaElement |
| PromptSuggestions | HTMLDivElement | — |
| QRCode | HTMLSpanElement | — |
| Radio | HTMLInputElement | — |
| RadioGroup | HTMLFieldSetElement | — |
| Rating | HTMLDivElement | — |
| Result | HTMLDivElement | — |
| ScrollArea | HTMLDivElement | — |
| SearchField | HTMLInputElement | — |
| SegmentedControl | HTMLDivElement | — |
| Select | HTMLSelectElement | — |
| Sidebar | HTMLElement | — |
| Skeleton | HTMLDivElement / HTMLSpanElement | — |
| Slider | HTMLInputElement | — |
| Sortable | HTMLUListElement | — |
| Spinner | HTMLSpanElement | — |
| Splitter | HTMLDivElement | — |
| Stat | HTMLDivElement | — |
| StatusIndicator | HTMLSpanElement | — |
| Steps | HTMLDivElement | — |
| Switch | HTMLInputElement | — |
| Tab | HTMLButtonElement | — |
| Tabs | HTMLDivElement | — |
| Tag | HTMLSpanElement | — |
| TagInput | HTMLDivElement | HTMLInputElement |
| Terminal | HTMLDivElement | — |
| TextField | HTMLInputElement | — |
| Textarea | HTMLTextAreaElement | — |
| TimePicker | HTMLSpanElement | HTMLSelectElement |
| Timeline | HTMLDivElement | — |
| Toast | HTMLDivElement | — |
| ToastStack | HTMLDivElement | — |
| Toggle | HTMLButtonElement | — |
| Toolbar | HTMLDivElement | — |
| Tooltip | HTMLSpanElement | — |
| Tour | HTMLDivElement | — |
| Transfer | HTMLDivElement | — |
| Tree | HTMLUListElement | — |
| TreeSelect | HTMLDivElement | HTMLButtonElement |
| TreeTable | HTMLDivElement | — |
| TypingIndicator | HTMLSpanElement | — |
| Watermark | HTMLDivElement | — |
