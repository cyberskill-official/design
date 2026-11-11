// A Server Component: client components render from it, and pure helpers come from /utils (no 'use client').
import { Badge, Button } from '@cyberskill/design';
import { cx, formatFileSize } from '@cyberskill/design/utils';

export default function Page() {
  return (
    <main className={cx('hello', false && 'hidden')}>
      <h1 className="cs-h2">Hello, CyberSkill</h1>
      <Button>Save changes</Button>
      <Badge tone="success">{formatFileSize(1536)}</Badge>
    </main>
  );
}
