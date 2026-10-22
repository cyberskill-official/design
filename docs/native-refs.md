# Native component refs

Native components expose a conventional `ref` to the element documented below. Context-only `LocaleProvider` and `OverlayProvider` expose no DOM ref. `rootProps` and `controlProps` remain attribute bags: their protected `ref` and `key` entries are not forwarding channels.

```jsx
const field = React.useRef(null);
const wrapper = React.useRef(null);
const search = React.useRef(null);
<TextField ref={field} label="Name" />
<Combobox ref={wrapper} controlRef={search} options={options} />
// After mounting: field.current.focus(); search.current.focus();
// wrapper.current.getBoundingClientRect() measures the composite wrapper.
```

The target follows the existing native/focus contract: TextField, Checkbox and NumberField expose inputs; Select exposes its select; Textarea and Mentions expose textareas; Image exposes its underlying image. Composite wrappers expose their existing root/group. A distinct owned control has an explicit `controlRef`; Rating and InputOTP expose the group, not whichever item is currently active. No caller-provided trigger or child is selected as a component's ref target.

Object and callback refs compose with internal refs. Stable refs retain their identity during ordinary rerenders; replacing or unmounting a target detaches its previous owner. React 18 callbacks receive `null` on detach. React 19 callback cleanup functions are preserved. Callback identity changes still request a normal detach/attach cycle. Forwarding a ref does not make a nonfocusable element focusable and does not add a tab stop.

Panels expose their managed semantic panel rather than the dismissal scrim or trigger wrapper. Unmounted panels, hidden BackTop, Image fallback and InlineEdit's inactive input produce `null` for the unavailable target. Tooltip's hidden bubble remains mounted. Consumers must check `current` and must not depend on the timing of a state transition before React commits.

## Native targets

The table is the public target contract. Adjacent component declarations and prompts describe the same targets. The browser regression mounts all 118 targets and every distinct control in React 18 and 19 across Chromium, Firefox and WebKit. These are automated ref-contract checks; manual accessibility and product acceptance remain separate.

| Component | `ref` element type | Distinct `controlRef` |
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
