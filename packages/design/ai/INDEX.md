# @cyberskill/design: AI guide

CyberSkill Design System (Ink & Gold). Read this file first, then open only the `components/*.md` files you need. Paths are relative to `node_modules/@cyberskill/design/ai/`.

## Setup (once per app)

```css
/* app/globals.css: Tailwind v4 apps */
@import 'tailwindcss';
@import '@cyberskill/design/tailwind.css';
@import '@cyberskill/design/styles.css';
/* no Tailwind: only the styles.css line */
```

Fonts: load Manrope, Be Vietnam Pro and JetBrains Mono (with the `vietnamese` subset) and set `--font-display`, `--font-sans`, `--font-mono` on `:root, [data-theme]`. Dark mode: `data-theme="dark"` on `<html>` or any container; `data-theme="system"` follows the OS. Without the attribute the page stays light.

## Rules

1. **Use a component before writing UI.** Find it in the table below. Only build custom UI when nothing fits, and then style it with tokens. **Add no other UI kit** (Radix, shadcn/ui, MUI, Chakra, Mantine, Ant Design, Headless UI): every part here is already built on Base UI, and a second kit brings its own look and focus handling.
2. **Never hard-code colors, fonts or sizes.** Use CSS variables (`var(--primary)`) or the Tailwind names (`bg-primary text-primary-foreground border-border text-muted`). No hex, rgb or Tailwind palette colors like `blue-600`.
3. **Flat named imports only**: `DialogContent`, never `Dialog.Content`. They work in React Server Component files.
4. **One primary button per view; at most one gold `accent` element** (key action or AI moment). Product screens keep gold under 3% of the screen.
5. **Status needs icon + text**, never color alone: use `Badge` with a status `tone`, `Alert` or `toast`.
6. **Every input has a visible label** (`TextField label=…`). Icon-only buttons need `label`. User-facing default strings (`closeLabel`, `previousLabel`…) are props: pass Vietnamese strings in Vietnamese UIs.
7. **Charts, tables, forms and dates are separate entry points** with optional peers: `@cyberskill/design/charts` (`recharts`), `/table` (`@tanstack/react-table`, `@tanstack/react-virtual`), `/forms` (`react-hook-form`), `/date` (`react-day-picker`, `date-fns`). Install only what you import. Series colors come from the system in fixed order; do not pass your own colors.
8. **Customize with `className`**, not by overriding internals. The package CSS sits in the `base` and `components` cascade layers, so plain app CSS and Tailwind utilities win without `!important`.
9. **Server Components:** import components from any entry as usual (each component is its own client module, so only what you use ships). Pure helpers run on the server too: `cx`, `formatFileSize`, `chartColor`, `seriesColor` (also in `@cyberskill/design/utils`, which holds no component code) and `formatDate`, `parseDate`, `formatTime`, `parseTime`, `DEFAULT_DATE_FORMAT` from `/date`. All helpers are in `helpers.md`.

## Components

| Component | Use it for | Import | Doc |
|---|---|---|---|
| Accordion | Headed sections that expand and collapse, one at a time or several at once. | `Accordion, AccordionItem, AccordionPanel, AccordionTrigger` | `components/accordion.md` |
| Alert | An inline message about a page or section, in four tones, with an optional action and dismiss button. | `Alert, Button` | `components/alert.md` |
| Alert Dialog | A modal confirmation for destructive or irreversible actions. The backdrop does not dismiss it, and an async confirm shows a loading button until it finishes. | `AlertDialog, AlertDialogContent, AlertDialogTrigger, Button` | `components/alert-dialog.md` |
| Autocomplete | A search input with a suggestion list. Free text is allowed; suggestions fill it in. | `Autocomplete, Field` | `components/autocomplete.md` |
| Avatar | A person's photo with an initials fallback, and an overlapping group with a "+N" count. | `Avatar, AvatarGroup` | `components/avatar.md` |
| Badge | Short status or count label. Seven tones, three variants, two sizes. Status tones always carry an icon. | `Badge` | `components/badge.md` |
| Breadcrumbs | Shows where the current page sits in the hierarchy, with a link to each level above it. | `Breadcrumbs, Link` | `components/breadcrumbs.md` |
| Button | Triggers an action. Seven variants, three sizes, loading and icon-only forms. | `Button, ButtonGroup, IconButton` | `components/button.md` |
| Calendar | Month grid for picking one day, several days or a range. Weeks start on Monday, Vietnamese ready. | `Calendar` from `@cyberskill/design/date` | `components/calendar.md` |
| Card | A surface that groups related content, with optional header, footer and a link style. | `Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle` | `components/card.md` |
| Charts | Bar, line, area and donut presets on Recharts, plus a sparkline. Token colors, a hover tooltip and a table view on every chart. | `Tooltip`; `AreaChart, BarChart, ChartFrame, ChartTooltipCard, DonutChart, LineChart, Sparkline` from `@cyberskill/design/charts` | `components/charts.md` |
| Checkbox | Turn an option on or off, alone or in a labelled group, with an optional mixed state. | `Checkbox, CheckboxGroup` | `components/checkbox.md` |
| Code block | Read-only code with an optional title, language label and a copy button. | `CodeBlock, CopyButton, Toolbar, ToolbarButton, ToolbarSeparator` | `components/code-block.md` |
| Collapsible | A button that shows and hides one region, such as advanced settings. | `Collapsible, CollapsiblePanel, CollapsibleTrigger, TextField` | `components/collapsible.md` |
| Combobox | A searchable single-choice picker. Type to filter a long list, then pick one option. | `Combobox, ComboboxField` | `components/combobox.md` |
| Command Menu | A ⌘K palette that filters commands and pages as you type. Accent-insensitive search, keyboard-first, with a shortcut you can change or turn off. | `Button, CommandGroup, CommandItem, CommandMenu` | `components/command-menu.md` |
| Context Menu | A menu of actions for an area, opened by right click or long press at the pointer. | `ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger` | `components/context-menu.md` |
| Data table | Sortable, selectable table on TanStack Table v9 with pagination or row virtualization, a sticky header and right-aligned numbers. | `DataTable, RowSelectionState` from `@cyberskill/design/table` | `components/data-table.md` |
| Date picker | Labelled date field. Type dd/mm/yyyy or pick from a calendar popup. Includes the date and time picker. | `FormField` from `@cyberskill/design/forms`; `DatePicker, DateTimePicker` from `@cyberskill/design/date` | `components/date-picker.md` |
| Date range picker | Labelled field for a start and end date, with a two-month calendar and optional presets. | `DateRangePicker, DateRangeValue` from `@cyberskill/design/date` | `components/date-range-picker.md` |
| Dialog | A modal panel for confirmations and short tasks. Focus is trapped and restored for you. | `Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger, TextField` | `components/dialog.md` |
| Drawer | A panel that slides in from the side or the bottom, for secondary tasks that keep the page in view. Swipe to dismiss on touch screens. | `Button, Drawer, DrawerClose, DrawerContent, DrawerTrigger, TextField` | `components/drawer.md` |
| Empty state | Fills an empty list, table or page and points to the next step. | `Button, EmptyState` | `components/empty-state.md` |
| Fieldset | Groups related fields under one legend and optional help text. | `Fieldset, TextField` | `components/fieldset.md` |
| File upload | A drop zone that also opens the file picker, with type and size checks and a file list with progress and a done state. | `FileUpload, FileUploadItem` | `components/file-upload.md` |
| Form | A form that validates its fields, focuses the first error and shows server errors under the right field. | `Button, Form, TextField` | `components/form.md` |
| Forms (React Hook Form) | FormField connects React Hook Form to every field component and shows its validation message. | `Button, Checkbox, SelectField, TextField`; `FormField` from `@cyberskill/design/forms` | `components/forms.md` |
| Kbd | Shows a keyboard key or shortcut in running text. | `Kbd` | `components/kbd.md` |
| Link | Underlined text link with a muted tone, external links and router support. | `Link` | `components/link.md` |
| Menu | A dropdown list of actions or options, opened from a button. Arrow keys, typeahead and focus return are handled for you. | `Button, IconButton, Link, Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuLinkItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSubmenu, MenuSubmenuTrigger, MenuTrigger` | `components/menu.md` |
| Menubar | A desktop-app style row of menus (File, Edit, View) with submenus and shortcut hints. | `Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSubmenu, MenubarSubmenuTrigger, MenubarTrigger` | `components/menubar.md` |
| Multi-select | A searchable picker for several values, shown as removable chips inside the input. | `MultiSelect, MultiSelectField` | `components/multi-select.md` |
| Navigation Menu | Website header navigation with dropdown panels of link cards. Marks the current page and hands narrow screens over to a drawer. | `Drawer, DrawerContent, DrawerTrigger, IconButton, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuLinkCard, NavigationMenuTrigger` | `components/navigation-menu.md` |
| Number field | A labelled number input with − and + steppers, limits, steps and locale-aware formatting. | `NumberField` | `components/number-field.md` |
| OTP field | One-time code input with one box per character, paste support and an onComplete callback. | `OtpField` | `components/otp-field.md` |
| Pagination | Moves through pages of a table or list, with previous and next buttons and page numbers that collapse into ellipses. | `Pagination` | `components/pagination.md` |
| Popover | A small panel anchored to a button, for details or a short form that should not leave the page. | `Button, IconButton, Popover, PopoverContent, PopoverTrigger, TextField` | `components/popover.md` |
| Preview Card | A hover card that previews a person, project or link while the pointer rests on it or the link has keyboard focus. | `PreviewCard, PreviewCardContent, PreviewCardTrigger` | `components/preview-card.md` |
| Progress | A labelled bar for a task in progress, with a warning threshold and an indeterminate state. Meter shows a known amount such as quota used. | `Meter, Progress` | `components/progress.md` |
| Radio group | Pick exactly one option from a short list that stays visible. | `Radio, RadioGroup` | `components/radio-group.md` |
| Scroll area | A scrollable box with thin, theme-aware scrollbars that keyboard users can scroll too. | `ScrollArea` | `components/scroll-area.md` |
| Search field | A labelled search input with a search icon, a clear button, Escape to clear, and optional loading and shortcut hints. | `SearchField` | `components/search-field.md` |
| Segmented control | Switch between a few views or modes of the same content. | `SegmentedControl` | `components/segmented-control.md` |
| Select | Pick one option from a list in a dropdown. Labelled field, keyboard and typeahead built in. | `Select, SelectField` | `components/select.md` |
| Separator | A thin line between groups of content, horizontal or vertical, with an optional label. | `Button, Separator` | `components/separator.md` |
| Side nav | Vertical app navigation with icons, section labels, counts and a clear current page. | `Link, SideNav, SideNavGroup, SideNavItem` | `components/side-nav.md` |
| Skeleton | Placeholder shapes that hold the layout while content loads, with a subtle shimmer. | `Skeleton, SkeletonText` | `components/skeleton.md` |
| Slider | Pick a value or a range by dragging along a track. Labels, value text and tick marks. | `Slider` | `components/slider.md` |
| Spinner | A small loading indicator for short waits, announced to screen readers. | `Spinner` | `components/spinner.md` |
| Stat | KPI tile with a label, a large tabular figure, an optional change and a chart slot. | `Stat` | `components/stat.md` |
| Stepper | Shows progress through a fixed sequence of steps, such as onboarding or a setup wizard. | `Stepper` | `components/stepper.md` |
| Switch | Turn a setting on or off, effective immediately. | `Switch` | `components/switch.md` |
| Table | Static, styled data table with density, stripes, a sticky header and right-aligned numbers. | `Badge, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow` | `components/table.md` |
| Tabs | Switch between views of the same object without leaving the page. A primary underline marks the active tab. | `Tabs, TabsList, TabsPanel, TabsTab` | `components/tabs.md` |
| Tag | Compact label for categories, versions or plans. Optionally removable. | `Tag` | `components/tag.md` |
| Text field | Single and multi-line text input with label, help text, errors and adornments. | `Input, TextField, Textarea` | `components/text-field.md` |
| Theme Scope | Applies light or dark to one part of the page, including the menus, selects and dialogs opened from inside it. | `Button, Menu, MenuContent, MenuItem, MenuTrigger, SideNav, SideNavItem, ThemeScope` | `components/theme-scope.md` |
| Time picker | Labelled time field. Type 9:30, 21:30 or 930, or choose from a list every 15 minutes. | `TimePicker` from `@cyberskill/design/date` | `components/time-picker.md` |
| Toast | A short, temporary message after an action, with an optional Undo. Stacks at the bottom-right. | `ToastProvider, useToast` | `components/toast.md` |
| Toggle | A button that stays on or off, such as Bold or Favorite. Text with an icon, or icon-only. | `Toggle` | `components/toggle.md` |
| Toggle group | A row of toggle buttons sharing one state, for picking one option or several, such as text formatting or filter chips. | `ToggleGroup, ToggleGroupItem` | `components/toggle-group.md` |
| Toolbar | A row of related controls that is one Tab stop, with arrow-key navigation inside. | `Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator` | `components/toolbar.md` |
| Tooltip | A short label that appears on hover and keyboard focus, for icon buttons and dense toolbars. | `ButtonGroup, IconButton, Tooltip, TooltipProvider` | `components/tooltip.md` |

## More

- `tokens.md`: every token with light and dark values and its Tailwind name.
- `helpers.md`: `chartColor`, `cx`, `formatFileSize`, `seriesColor`, `useCommandMenuShortcut`, `usePortalContainer`, `createDataTableColumnHelper`, `dataTableFeatures`, `DEFAULT_DATE_FORMAT`, `formatDate`, `formatTime`, `parseDate`, `parseTime`, `rangePresets`.
- Live examples: https://design.cyberskill.world
