import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FileUpload, type FileUploadItem } from './FileUpload';

const meta = {
  title: 'Pickers/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: { label: 'Attachments', hint: 'PDF or PNG, up to 5 MB', accept: '.pdf,image/png', multiple: true, maxSize: 5_000_000, onAdd: fn() },
  render: args => (
    <div style={{ maxWidth: 440 }}>
      <FileUpload {...args} />
    </div>
  ),
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    await userEvent.upload(input, new File(['%PDF'], 'contract.pdf', { type: 'application/pdf' }));
    await expect(args.onAdd).toHaveBeenCalled();
    await expect(canvas.getByText('contract.pdf')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove contract.pdf' }));
    await expect(canvas.queryByText('contract.pdf')).toBeNull();
  },
};

/** Controlled list with fake upload progress. */
function Uploading() {
  const [files, setFiles] = useState<FileUploadItem[]>([
    { id: '1', name: 'Q3-report.pdf', size: 2_400_000, progress: 35 },
    { id: '2', name: 'logo.png', size: 180_000 },
    { id: '3', name: 'scan-0042.pdf', size: 4_200_000, error: 'Upload failed. Try again.' },
  ]);
  useEffect(() => {
    const t = setInterval(() => setFiles(fs => fs.map(f => (f.progress != null && f.progress < 100 ? { ...f, progress: f.progress + 5 } : { ...f, progress: undefined }))), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ maxWidth: 440 }}>
      <FileUpload
        label="Documents"
        multiple
        files={files}
        onAdd={added => setFiles(fs => [...fs, ...added.map(f => ({ id: `${f.name}-${f.lastModified}`, name: f.name, size: f.size, progress: 0 }))])}
        onRemove={item => setFiles(fs => fs.filter(f => f.id !== item.id))}
      />
    </div>
  );
}

export const Controlled: Story = { render: () => <Uploading /> };

export const Vietnamese: Story = {
  args: {
    label: 'Ảnh đại diện',
    accept: 'image/*',
    multiple: false,
    maxSize: 2_000_000,
    locale: 'vi-VN',
    prompt: 'Kéo thả ảnh vào đây hoặc bấm để chọn',
    hint: 'PNG hoặc JPG, tối đa 2 MB',
    tooLargeMessage: (f, max) => `${f.name} lớn hơn ${max}.`,
    wrongTypeMessage: f => `${f.name} không phải là ảnh.`,
    removeLabel: name => `Xoá ${name}`,
  },
};

export const WithError: Story = { args: { error: 'Add at least one attachment.' } };

export const Disabled: Story = { args: { disabled: true } };
