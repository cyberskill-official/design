# Pagination

> Moves through pages of a table or list, with previous and next buttons and page numbers that collapse into ellipses.

```tsx
import { Pagination } from '@cyberskill/design';
```

Use pagination under a table or list that is split into pages, when people need to know where they are or jump to a page. For feeds, prefer "Load more" or infinite scroll.

## Pages

```tsx
const [page, setPage] = useState(6);

<Pagination page={page} pageCount={20} onPageChange={setPage} />
```

The first and last pages, the current page and `siblings` pages on each side are always shown; the rest collapse into ellipses. The number of slots stays the same on every page, so the buttons never jump under the pointer. On phone-width screens (under 440px) the siblings drop out, so the row fits a 375px screen: `‹ 1 … 10 … 20 ›`.

## In narrow containers

```tsx
<div style={{ containerType: 'inline-size' }}>
  <Pagination page={page} pageCount={20} onPageChange={setPage} />
</div>
```

Inside a size container (any element with `container-type: inline-size`) the row follows that element's width instead of the screen's, so it never wraps a button onto a line of its own: the siblings drop out under 25rem (400px), and under 19.5rem (312px) only the arrows stay, with the position between them: `‹ 3 / 20 ›`. `DataTable`'s footer is already a size container, so a table in a narrow card on a phone pages this way without extra code. Put `container-type: inline-size` on a card or sidebar that holds a `Pagination`; leave it off elements whose width comes from their content, such as an item in a flex row, because a size container doesn't grow to fit what's inside it.

## Vietnamese labels

```tsx
<Pagination
  page={page} pageCount={8} onPageChange={setPage}
  label="Phân trang" previousLabel="Trang trước" nextLabel="Trang sau"
  pageLabel={(n) => `Trang ${n}`}
/>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | – | Current page, starting at 1 (required) |
| `pageCount` | `number` | – | Total pages (required) |
| `onPageChange` | `(page: number) => void` | – | Called with the page to go to (required) |
| `siblings` | `number` | `1` | Pages shown on each side of the current one (none on phone-width screens) |
| `label` | `string` | `'Pagination'` | Name of the navigation landmark |
| `previousLabel / nextLabel` | `string` | `'Previous page' / 'Next page'` | Accessible names of the arrow buttons |
| `pageLabel` | `(page: number) => string` | `(n) => `Page ${n}`` | Accessible name of each page button |
| `statusLabel` | `(page: number, pageCount: number) => string` | `(p, n) => `Page ${p} of ${n}`` | Read out instead of `3 / 6` in the compact layout |

## Accessibility

- A `nav` landmark named by `label`; every button is reachable with Tab and works with Enter or Space.
- The current page has `aria-current="page"` and a filled primary background with bold text.
- Previous is disabled on the first page and Next on the last.
- Buttons are 32px squares with a 44 × 44px touch area: it fills half of the 12px gap on each side, so neighbouring targets touch but never overlap.
- In the compact layout, screen readers hear `statusLabel` ("Page 3 of 6") instead of the visual `3 / 6`; the hidden page buttons leave the accessibility tree.

## Exact types

```ts
export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  className?: string;
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one before an ellipsis. Phone-width screens show none. */
  siblings?: number;
  /** Accessible name of the landmark. */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible name of each page button, e.g. `(n) => \`Trang ${n}\``. */
  pageLabel?: (page: number) => string;
  /** Read out in the compact `‹ 3 / 6 ›` layout, e.g. `(p, n) => \`Trang ${p} / ${n}\``. */
  statusLabel?: (page: number, pageCount: number) => string;
};
```
