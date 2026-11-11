import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, formatFileSize } from './FileUpload';
import { expectAccessibleInThemes } from '../test/a11y';

const file = (name: string, bytes: number, type: string) => new File([new Uint8Array(bytes)], name, { type });
const input = () => document.querySelector<HTMLInputElement>('input[type="file"]')!;
const drop = (target: HTMLElement, files: File[]) => {
  const dataTransfer = new DataTransfer();
  files.forEach(f => dataTransfer.items.add(f));
  target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
};
const MB = 1024 * 1024;

describe('FileUpload', () => {
  it('the zone is a labelled button that opens the file picker', async () => {
    render(<FileUpload label="Attachments" hint="PDF up to 5 MB" description="Shared with your team." />);
    const zone = screen.getByRole('button', { name: 'Attachments Drag files here or click to browse PDF up to 5 MB' });
    expect(zone).toHaveAccessibleDescription('Shared with your team.');
    const click = vi.spyOn(input(), 'click').mockImplementation(() => {});
    zone.focus();
    await userEvent.keyboard('{Enter}');
    expect(click).toHaveBeenCalled();
  });

  it('lists picked files with their size and removes them', async () => {
    const onAdd = vi.fn();
    render(<FileUpload label="Attachments" multiple onAdd={onAdd} locale="en" />);
    await userEvent.upload(input(), [file('contract.pdf', 1500, 'application/pdf'), file('logo.png', 200, 'image/png')]);
    expect(onAdd).toHaveBeenCalledWith([expect.objectContaining({ name: 'contract.pdf' }), expect.objectContaining({ name: 'logo.png' })]);
    expect(screen.getByText('contract.pdf')).toBeVisible();
    expect(screen.getByText(formatFileSize(1500, 'en'))).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Remove contract.pdf' }));
    expect(screen.queryByText('contract.pdf')).toBeNull();
    expect(screen.getByText('logo.png')).toBeVisible();
  });

  it('rejects files over maxSize or of the wrong type with readable messages', async () => {
    const onAdd = vi.fn();
    render(
      <FileUpload
        label="Avatar"
        accept="image/*"
        multiple
        maxSize={1000}
        locale="vi-VN"
        onAdd={onAdd}
        tooLargeMessage={(f, max) => `${f.name} lớn hơn ${max}.`}
        wrongTypeMessage={f => `${f.name} không đúng định dạng.`}
      />,
    );
    // userEvent.upload honours `accept`, so drop the files like a drag-and-drop would.
    const dataTransfer = new DataTransfer();
    [file('big.png', 5000, 'image/png'), file('notes.txt', 10, 'text/plain'), file('ok.jpg', 10, 'image/jpeg')].forEach(f => dataTransfer.items.add(f));
    screen.getByRole('button', { name: /Avatar/ }).dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
    expect(await screen.findByText(`big.png lớn hơn ${formatFileSize(1000, 'vi-VN')}.`)).toBeVisible();
    expect(screen.getByText('notes.txt không đúng định dạng.')).toBeVisible();
    expect(onAdd).toHaveBeenCalledWith([expect.objectContaining({ name: 'ok.jpg' })]);
    expect(screen.getByRole('button', { name: /Avatar/ })).toHaveAttribute('aria-invalid', 'true');
  });

  it('formatFileSize uses binary units and rounds before picking the unit', () => {
    expect(formatFileSize(10 * MB, 'en')).toBe('10 MB');
    expect(formatFileSize(1536, 'en')).toBe('1.5 kB');
    expect(formatFileSize(999_999, 'en')).toBe('976.6 kB');
    expect(formatFileSize(MB - 5, 'en')).toBe('1 MB'); // not "1,024 kB"
    expect(formatFileSize(2.5 * 1024 * MB, 'en')).toBe('2.5 GB');
  });

  it('the size in the too-large message is the same limit the hint states', async () => {
    render(<FileUpload label="Attachments" hint="PDF up to 10 MB" maxSize={10 * MB} locale="en" />);
    drop(screen.getByRole('button', { name: /Attachments/ }), [file('scan.pdf', 10 * MB + 1, 'application/pdf')]);
    expect(await screen.findByText('scan.pdf is larger than 10 MB.')).toBeVisible();
  });

  it('single-file mode rejects a drop of several files with a message and adds none', async () => {
    const onAdd = vi.fn();
    render(<FileUpload label="Avatar" onAdd={onAdd} tooManyFilesMessage={n => `Chỉ thêm được một tệp (bạn đã thả ${n} tệp).`} />);
    const zone = screen.getByRole('button', { name: /Avatar/ });
    drop(zone, [file('a.png', 10, 'image/png'), file('b.png', 10, 'image/png')]);
    expect(await screen.findByText('Chỉ thêm được một tệp (bạn đã thả 2 tệp).')).toBeVisible();
    expect(zone).toHaveAccessibleDescription('Chỉ thêm được một tệp (bạn đã thả 2 tệp).');
    expect(zone).toHaveAttribute('aria-invalid', 'true');
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.queryByText('a.png')).toBeNull();
    drop(zone, [file('a.png', 10, 'image/png')]);
    expect(await screen.findByText('a.png')).toBeVisible();
    expect(onAdd).toHaveBeenCalledWith([expect.objectContaining({ name: 'a.png' })]);
  });

  it('field and rejection errors carry a hidden warning icon before the text', async () => {
    render(<FileUpload label="Documents" error="Add at least one document." />);
    const message = screen.getByText('Add at least one document.').closest('.cs-field-error')!;
    expect(message.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: /Documents/ })).toHaveAccessibleDescription('Add at least one document.');
  });

  it('controlled: shows progress and per-file errors, and reports removals', async () => {
    const onRemove = vi.fn();
    render(
      <FileUpload
        label="Documents"
        files={[
          { id: '1', name: 'report.pdf', size: 2_400_000, progress: 40 },
          { id: '2', name: 'scan.pdf', size: 900_000, error: 'Upload failed' },
        ]}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading report.pdf' })).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByText('Upload failed')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Remove scan.pdf' }));
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }));
    expect(screen.getByText('scan.pdf')).toBeVisible(); // the parent owns the list
  });

  it('hides the bar at 100% and shows the done state instead', () => {
    render(<FileUpload label="Documents" files={[{ id: '1', name: 'report.pdf', size: 2_400_000, progress: 100 }]} doneLabel="Đã tải lên" />);
    expect(screen.queryByRole('progressbar')).toBeNull();
    const done = screen.getByText('Đã tải lên');
    expect(done).toBeVisible();
    expect(done.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
        <FileUpload label="Attachments" hint="PDF or PNG, up to 5 MB" description="Shared with your team." />
        <FileUpload
          label="Documents"
          error="Add at least one document."
          files={[
            { id: '1', name: 'report.pdf', size: 2_400_000, progress: 40 },
            { id: '2', name: 'scan.pdf', size: 900_000, error: 'Upload failed' },
            { id: '3', name: 'logo.png', size: 120_000, progress: 100 },
          ]}
          onRemove={() => {}}
        />
        <FileUpload label="Locked" disabled />
      </div>,
    );
  });
});
