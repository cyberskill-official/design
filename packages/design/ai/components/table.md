# Table

> Static, styled data table with density, stripes, a sticky header and right-aligned numbers.

```tsx
import { Badge, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@cyberskill/design';
```

Use a table to compare records across the same columns: invoices, members, API keys. It is a styled HTML table with no sorting or paging; for those use the data table. For one or two records, a list or [Card](/docs/components/card) reads better.

## Basic

Mark number columns `numeric`: they align right with tabular mono figures so digits line up. Use `TableHead scope="row"` for the cell that names each row. Wide tables scroll sideways inside their frame on narrow screens.

```tsx
<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead numeric>Amount</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableHead scope="row">INV-1042</TableHead>
      <TableCell>Northwind Traders</TableCell>
      <TableCell numeric>$1,240.00</TableCell>
      <TableCell><Badge tone="success" size="sm">Paid</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Compact, striped and selected

`density="compact"` tightens rows for dense data. `striped` alternates row backgrounds. `selected` highlights a row with a tint and an edge bar.

```tsx
<Table density="compact" striped>
  …
  <TableRow selected>…</TableRow>
</Table>
```

## Sticky header

`stickyHeader` keeps the column headers in view while the body scrolls inside `maxHeight`.

```tsx
<Table density="compact" stickyHeader maxHeight={200}>…</Table>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | Row height |
| `striped` | `boolean` | `false` | Alternate row backgrounds |
| `stickyHeader` | `boolean` | `false` | Header stays visible while the body scrolls. Needs maxHeight |
| `maxHeight` | `number \| string` | – | Max height of the scroll frame |

`TableRow` takes `selected`. `TableHead` and `TableCell` take `align` (`'start' | 'center' | 'end'`) and `numeric`. `TableHead` defaults to `scope="col"`. Other props go to the native elements.

## Accessibility

- A real `<table>`: screen readers announce rows, columns and the header of each cell. Name it with `TableCaption` (hide it with `className="cs-visually-hidden"` if a heading already shows).
- Use `TableHead scope="row"` for the first cell of each row so cells are read with their row name.
- When the table overflows its frame, the frame joins the Tab order so keyboard users can scroll it with the arrow keys.
- `selected` is visual only. Say it in the row too, usually with a checked checkbox in the first column.

## Exact types

```ts
export type BadgeProps = ComponentProps<'span'> & {
  /**
   * Color meaning. `success`, `warning`, `danger` and `info` show a status icon by default.
   * Category tones (`blue`, `amber`, `teal`, `magenta`, `violet`) label a kind, not a status; they stay tinted even as `solid`.
   */
  tone?: BadgeTone;
  /** `soft` tinted (default), `solid` filled, `outline` bordered. */
  variant?: BadgeVariant;
  /** `sm` 20px, `md` 24px tall. */
  size?: 'sm' | 'md';
  /** Decorative icon before the text. Replaces a status tone's icon; `false` removes the icon on non-status tones only. */
  icon?: ReactNode | false;
};
export type TableProps = ComponentProps<'table'> & {
  /** Row height: `comfortable` (default) or `compact` for dense data. */
  density?: 'comfortable' | 'compact';
  /** Alternate row backgrounds. */
  striped?: boolean;
  /** Keep the header row visible while the body scrolls. Needs `maxHeight`. */
  stickyHeader?: boolean;
  /** Max height of the scroll container, e.g. `360` or `'50vh'`. */
  maxHeight?: number | string;
};
export type TableBodyProps = ComponentProps<'tbody'>;
export type TableCaptionProps = ComponentProps<'caption'>;
export type TableCellProps = Omit<ComponentProps<'td'>, 'align'> & CellAlign;
export type TableHeadProps = Omit<ComponentProps<'th'>, 'align'> & CellAlign;
export type TableHeaderProps = ComponentProps<'thead'>;
export type TableRowProps = ComponentProps<'tr'> & {
  /** Highlights the row. Also show selection in text or a checkbox: the highlight alone is not announced. */
  selected?: boolean;
};
```
