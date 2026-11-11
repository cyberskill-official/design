'use client';
import { FileUpload, type FileUploadItem } from '@cyberskill/design';
import { useEffect, useState } from 'react';

export function FileUploadBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <FileUpload label="Attachments" hint="PDF or PNG, up to 5 MB" accept=".pdf,image/png" multiple maxSize={5 * 1024 * 1024} />
    </div>
  );
}

export function FileUploadProgress() {
  const [files, setFiles] = useState<FileUploadItem[]>([
    { id: '1', name: 'Q3-report.pdf', size: 2_400_000, progress: 35 },
    { id: '2', name: 'scan-0042.pdf', size: 4_200_000, error: 'Upload failed. Try again.' },
  ]);
  useEffect(() => {
    // Fake upload: advance every file that is still in progress; at 100 it shows as done.
    const t = setInterval(() => setFiles((fs) => fs.map((f) => (f.progress == null || f.progress >= 100 ? f : { ...f, progress: Math.min(100, f.progress + 5) }))), 300);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <FileUpload
        label="Documents"
        multiple
        files={files}
        onAdd={(added) => setFiles((fs) => [...fs, ...added.map((f) => ({ id: `${f.name}-${f.lastModified}`, name: f.name, size: f.size, progress: 0, file: f }))])}
        onRemove={(item) => setFiles((fs) => fs.filter((f) => f.id !== item.id))}
      />
    </div>
  );
}

export function FileUploadVietnamese() {
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <FileUpload
        label="Ảnh đại diện"
        accept="image/*"
        maxSize={2 * 1024 * 1024}
        locale="vi-VN"
        prompt="Kéo thả ảnh vào đây hoặc bấm để chọn"
        hint="PNG hoặc JPG, tối đa 2 MB"
        tooLargeMessage={(f, max) => `${f.name} lớn hơn ${max}.`}
        wrongTypeMessage={(f) => `${f.name} không phải là ảnh.`}
        tooManyFilesMessage={(n) => `Chỉ thêm được một ảnh (bạn đã thả ${n} tệp).`}
        removeLabel={(name) => `Xoá ${name}`}
        progressLabel={(name) => `Đang tải lên ${name}`}
        doneLabel="Đã tải lên"
      />
    </div>
  );
}
