'use client';
import { Breadcrumbs } from '@cyberskill/design';

export function BreadcrumbsDemo() {
  return (
    <Breadcrumbs
      items={[
        { label: 'Workspace', href: '#' },
        { label: 'Agents', href: '#' },
        { label: 'Support Copilot', href: '#' },
        { label: 'Training sources' },
      ]}
    />
  );
}

export function BreadcrumbsLinks() {
  return (
    <Breadcrumbs label="Đường dẫn">
      <a href="#">Không gian làm việc</a>
      <a href="#">Thanh toán</a>
      <a href="#" aria-current="page">Hoá đơn</a>
    </Breadcrumbs>
  );
}
