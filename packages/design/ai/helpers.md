# Helpers (@cyberskill/design)

Exports that are not components. Each says whether a Server Component can call it.

## chartColor

Server Components: yes.

```ts
import { chartColor } from '@cyberskill/design/utils';
/** Color of a series: its pinned slot, else its position. Past five series the rest read as "Other" in muted gray; never cycled. */
export declare function chartColor(slot: number): string;
```

## cx

Server Components: yes.

```ts
import { cx } from '@cyberskill/design/utils';
/** Join class names. `cx('cs-button', className)` */
export declare function cx(...values: ClassValue[]): string;
```

## formatFileSize

Server Components: yes.

```ts
import { formatFileSize } from '@cyberskill/design/utils';
/** File size in binary units (1 kB = 1024 bytes, 1 MB = 1024² bytes, like Windows and most upload limits), in the given locale:
 * `formatFileSize(10 * 1024 * 1024)` → `"10 MB"`, `formatFileSize(1536)` → `"1.5 kB"`. At most one decimal.
 */
export declare function formatFileSize(bytes: number, locale?: Intl.LocalesArgument): string;
```

## seriesColor

Server Components: yes.

```ts
import { seriesColor } from '@cyberskill/design/utils';
/** A series' color: its pinned `color` slot, else its position (`index` 0 → slot 1). */
export declare const seriesColor: (s: {
  color?: ChartColor;
}, index: number) => string;
```

## toneFor

Server Components: yes.

```ts
import { toneFor } from '@cyberskill/design/utils';
/** A stable category tone for a key such as a name or a tag: the same key always gets the same tone, on the server and in the browser, whatever its Unicode form (NFC or NFD). */
export declare function toneFor(key: string): CategoryTone;
```

## useCommandMenuShortcut

Client components only.

```ts
import { useCommandMenuShortcut } from '@cyberskill/design';
/** Toggles the command menu on ⌘K (macOS) or Ctrl+K (Windows, Linux). Pass the `useState` setter; `key` changes the letter.
 * `CommandMenu` already does this through its `shortcut` prop; use the hook only when the menu is not always mounted.
 */
export declare function useCommandMenuShortcut(setOpen: Dispatch<SetStateAction<boolean>>, key?: string): void;
```

## usePortalContainer

Client components only.

```ts
import { usePortalContainer } from '@cyberskill/design';
/** The element popups should render into: the nearest ThemeScope's host, `null` while it is being created, or `undefined` outside any ThemeScope (document.body). */
export declare function usePortalContainer(): HTMLElement | null | undefined;
```

## createDataTableColumnHelper

Client components only.

```ts
import { createDataTableColumnHelper } from '@cyberskill/design/table';
/** Column helper typed for DataTable: `const col = createDataTableColumnHelper<Invoice>(); col.columns([col.accessor('total', { header: 'Total', meta: { numeric: true } })])`. */
export declare const createDataTableColumnHelper: <TData extends object>() => import("@tanstack/table-core").ColumnHelper<{
  rowSortingFeature: import("@tanstack/table-core").TableFeature;
  sortedRowModel: (table: import("@tanstack/table-core").Table<any, any>) => () => import("@tanstack/table-core").RowModel<any, any>;
  sortFns: {
    alphanumeric: SortFn<any, any>;
    text: SortFn<any, any>;
    datetime: import("@tanstack/table-core").CreatedSortFn<any, any>;
  };
  rowSelectionFeature: import("@tanstack/table-core").TableFeature;
  rowPaginationFeature: import("@tanstack/table-core").TableFeature;
  paginatedRowModel: (table: import("@tanstack/table-core").Table<any, any>) => () => import("@tanstack/table-core").RowModel<any, any>;
  columnMeta: DataTableColumnMeta;
  tableMeta: DataTableMeta;
}, TData>;
```

## dataTableFeatures

Client components only.

```ts
import { dataTableFeatures } from '@cyberskill/design/table';
/** The TanStack Table v9 features DataTable registers: sorting, row selection, pagination and typed column meta. */
export declare const dataTableFeatures: {
  rowSortingFeature: import("@tanstack/table-core").TableFeature;
  sortedRowModel: (table: import("@tanstack/table-core").Table<any, any>) => () => import("@tanstack/table-core").RowModel<any, any>;
  sortFns: {
    alphanumeric: SortFn<any, any>;
    text: SortFn<any, any>;
    datetime: import("@tanstack/table-core").CreatedSortFn<any, any>;
  };
  rowSelectionFeature: import("@tanstack/table-core").TableFeature;
  rowPaginationFeature: import("@tanstack/table-core").TableFeature;
  paginatedRowModel: (table: import("@tanstack/table-core").Table<any, any>) => () => import("@tanstack/table-core").RowModel<any, any>;
  columnMeta: DataTableColumnMeta;
  tableMeta: DataTableMeta;
};
```

## DEFAULT_DATE_FORMAT

Server Components: yes.

```ts
import { DEFAULT_DATE_FORMAT } from '@cyberskill/design/date';
/** Default display format for dates: Vietnamese and British order, `31/12/2026`. */
export declare const DEFAULT_DATE_FORMAT = "dd/MM/yyyy";
```

## formatDate

Server Components: yes.

```ts
import { formatDate } from '@cyberskill/design/date';
/** Formats a date with a date-fns pattern. `formatDate(new Date(2026, 2, 15))` → `"15/03/2026"`. */
export declare function formatDate(date: Date, format?: string, locale?: Locale): string;
```

## formatTime

Server Components: yes.

```ts
import { formatTime } from '@cyberskill/design/date';
/** Shows a `"HH:mm"` time as `09:30` (24h) or `9:30 AM` (12h, AM/PM words from the date-fns `locale`). */
export declare function formatTime(time: string, hourCycle?: 12 | 24, locale?: Locale): string;
```

## parseDate

Server Components: yes.

```ts
import { parseDate } from '@cyberskill/design/date';
/** Parses typed text in a date-fns pattern. Returns `null` for anything that is not a real date with a 4-digit year. */
export declare function parseDate(text: string, format?: string, locale?: Locale): Date | null;
```

## parseTime

Server Components: yes.

```ts
import { parseTime } from '@cyberskill/design/date';
/** Parses a typed time into 24-hour `"HH:mm"`. Accepts `9:30`, `09.30`, `930`, `21:30`, `9`, `9pm`, `9:30 PM`,
 * Vietnamese `9h30`, `9h`, `21H`, `9 h 30`, `9g30`, `9g` and `SA`/`CH`. Returns `null` when the text is not a time.
 */
export declare function parseTime(text: string): string | null;
```

## rangePresets

Server Components: yes.

```ts
import { rangePresets } from '@cyberskill/design/date';
/** The four common presets: Today, Last 7 days, Last 30 days, This month (1st to today). Override labels for Vietnamese:
 * `rangePresets({ today: 'Hôm nay', last7Days: '7 ngày qua', last30Days: '30 ngày qua', thisMonth: 'Tháng này' })`.
 * Call it while rendering so "today" stays current. Pure, so Server Components can call it too.
 */
export declare function rangePresets(labels?: Partial<RangePresetLabels>, today?: Date): DateRangePreset[];
```

## springs

Server Components: yes.

```ts
import { springs } from '@cyberskill/design/motion';
/** The token springs (Apple's duration and bounce) as stiffness and damping: `transition={springs.snappy}`. */
export declare const springs: Record<SpringName, SpringTransition>;
```

## transitions

Server Components: yes.

```ts
import { transitions } from '@cyberskill/design/motion';
/** The CSS motion recipes (`--motion-pop-in` …) for Motion: `transition={transitions.popIn}`. */
export declare const transitions: Record<RecipeName, SpringTransition | TweenTransition>;
```

