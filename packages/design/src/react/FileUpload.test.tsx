import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, formatFileSize } from './FileUpload';
import { expectAccessibleInThemes } from '../test/a11y';

const file = (name: string, bytes: number, type: string) => new File([new Uint8Array(bytes)], name, { type });
const input = () => document.querySelector<HTMLInputElement>('input[type="file"]')!;

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
          ]}
          onRemove={() => {}}
        />
        <FileUpload label="Locked" disabled />
      </div>,
    );
  });
});
