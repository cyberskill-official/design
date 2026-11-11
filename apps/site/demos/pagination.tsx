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
