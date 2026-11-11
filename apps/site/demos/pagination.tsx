'use client';
import { Pagination } from '@cyberskill/design';
import { useState } from 'react';

export function PaginationDemo() {
  const [page, setPage] = useState(6);
  return <Pagination page={page} pageCount={20} onPageChange={setPage} />;
}

export function PaginationVietnamese() {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      page={page}
      pageCount={8}
      onPageChange={setPage}
      label="Phân trang"
      previousLabel="Trang trước"
      nextLabel="Trang sau"
      pageLabel={(n) => `Trang ${n}`}
    />
  );
}

export function PaginationNarrow() {
  const [page, setPage] = useState(3);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, width: '100%' }}>
      {[360, 300, 240].map((width) => (
        <div key={width} style={{ width, maxWidth: '100%', boxSizing: 'border-box', containerType: 'inline-size', padding: 12, border: '1px dashed var(--border)', borderRadius: 8 }}>
          <Pagination page={page} pageCount={20} onPageChange={setPage} label={`Pagination, ${width}px card`} />
        </div>
      ))}
    </div>
  );
}
