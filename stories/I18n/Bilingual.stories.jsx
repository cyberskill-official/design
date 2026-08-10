import React from 'react';
import { FileUpload } from '../../components/forms/FileUpload.jsx';
import { DataTable } from '../../components/datatable/DataTable.jsx';
import { PromptInput } from '../../components/ai/PromptInput.jsx';
import { Result } from '../../components/feedback/Result.jsx';
import { HumanReviewGate } from '../../components/ai/HumanReviewGate.jsx';
import { PageTitle, Lede, Mono } from '../lib/live-tokens.jsx';

/**
 * I18n — paired EN·VN chrome strings beyond Calendar. Each demo renders the SAME
 * component twice with zero prop changes: only the lang attribute on the wrapper
 * differs. Built-in strings resolve from components/_i18n/strings.js via the
 * nearest [lang] ancestor (EN·VI key parity is gate-enforced).
 */

/** children may be a node (same in both columns) or a function (lang) => node. */
function Pair({ children }) {
  const cell = (lang, label) => (
    <div
      lang={lang}
      style={{
        background: 'var(--cs-color-surface-panel)',
        border: '1px solid var(--cs-color-border-default)',
        borderRadius: 'var(--cs-radius-lg)',
        padding: 16,
        display: 'grid',
        gap: 12,
        alignContent: 'start',
      }}
    >
      <div className="cs-eyebrow">{label}</div>
      {typeof children === 'function' ? children(lang) : children}
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
      {cell('en', 'lang="en" · English')}
      {cell('vi', 'lang="vi" · Tiếng Việt')}
    </div>
  );
}

function Intro({ component, strings }) {
  return (
    <div style={{ maxWidth: 920, marginBottom: 16 }}>
      <PageTitle>{component} — EN·VN chrome</PageTitle>
      <Lede>
        No props change between the two columns — only the wrapper's lang attribute.
        Built-in strings resolved from the registry: {strings}.
      </Lede>
    </div>
  );
}

export default {
  title: 'I18n/Bilingual chrome',
  parameters: {
    docs: {
      description: {
        component:
          'Paired EN·VN stories: the same component under lang="en" vs lang="vi" wrappers — built-in chrome strings come from components/_i18n/strings.js.',
      },
    },
  },
};

export const FileUploadPair = {
  name: 'FileUpload',
  render: () => (
    <div>
      <Intro component="FileUpload" strings={<Mono>title · hint</Mono>} />
      <Pair>
        <FileUpload />
      </Pair>
    </div>
  ),
};

export const DataTablePair = {
  name: 'DataTable (async triad)',
  render: () => (
    <div>
      <Intro component="DataTable" strings={<Mono>empty · loading · error · errorHint</Mono>} />
      <p className="cs-caption" style={{ maxWidth: '72ch', margin: '0 0 12px' }}>
        Column headers are consumer content; empty / loading / error chrome is built-in and flips with lang.
      </p>
      <Pair>
        {(lang) => (
          <div style={{ display: 'grid', gap: 16 }}>
            <DataTable
              caption={lang === 'vi' ? 'Quý 3' : 'Q3'}
              columns={[
                { key: 'name', header: lang === 'vi' ? 'Tên' : 'Name' },
                { key: 'status', header: lang === 'vi' ? 'Trạng thái' : 'Status' },
              ]}
              rows={[]}
            />
            <DataTable
              caption={lang === 'vi' ? 'Đang tải' : 'Loading'}
              columns={[
                { key: 'name', header: lang === 'vi' ? 'Tên' : 'Name' },
                { key: 'status', header: lang === 'vi' ? 'Trạng thái' : 'Status' },
              ]}
              rows={[]}
              state="loading"
              loadingRows={2}
            />
            <DataTable
              caption={lang === 'vi' ? 'Lỗi' : 'Error'}
              columns={[
                { key: 'name', header: lang === 'vi' ? 'Tên' : 'Name' },
                { key: 'status', header: lang === 'vi' ? 'Trạng thái' : 'Status' },
              ]}
              rows={[]}
              state="error"
            />
          </div>
        )}
      </Pair>
    </div>
  ),
};

export const PromptInputPair = {
  name: 'PromptInput',
  render: () => (
    <div>
      <Intro component="PromptInput" strings={<Mono>placeholder · send · hint</Mono>} />
      <Pair>
        <PromptInput />
      </Pair>
    </div>
  ),
};

export const ResultPair = {
  name: 'Result',
  render: () => (
    <div>
      <Intro component="Result" strings={<Mono>success · error · warning · info titles</Mono>} />
      <Pair>
        <div style={{ display: 'grid', gap: 8 }}>
          <Result status="success" />
          <Result status="error" />
        </div>
      </Pair>
    </div>
  ),
};

export const HumanReviewGatePair = {
  name: 'HumanReviewGate',
  render: () => (
    <div>
      <Intro component="HumanReviewGate" strings={<Mono>aria · risk · approve · reject · reviewer</Mono>} />
      <p className="cs-caption" style={{ maxWidth: '72ch', margin: '0 0 12px' }}>
        The summary is consumer-supplied content, localized per column here; the chrome
        (risk label, Approve / Reject, Reviewer) flips automatically.
      </p>
      <Pair>
        {(lang) => (
          <HumanReviewGate
            summary={
              lang === 'vi'
                ? 'Lumi soạn một điều khoản hợp đồng. Một người thật duyệt trước khi gửi đi.'
                : 'Lumi drafted a contract clause. A human reviews before it ships.'
            }
            reviewer="Nguyễn Hoàng Vũ"
          />
        )}
      </Pair>
    </div>
  ),
};

export const DiacriticsStress = {
  name: 'Diacritics stress',
  render: () => (
    <div style={{ maxWidth: 920 }}>
      <PageTitle>Diacritics & line-height stress</PageTitle>
      <Lede>
        Vietnamese stacks marks above and below the x-height (ệ, ổ, ữ, ẫ). The
        Vietnamese-safe line-heights (body 1.5 / heading 1.35) must leave room — no
        clipped marks, no colliding lines, at any size in the ramp.
      </Lede>
      <div
        lang="vi"
        style={{
          background: 'var(--cs-color-surface-panel)',
          border: '1px solid var(--cs-color-border-default)',
          borderRadius: 'var(--cs-radius-lg)',
          padding: 24,
          display: 'grid',
          gap: 16,
        }}
      >
        <div className="cs-eyebrow">Tuyên ngôn — eyebrow uppercase giữ nguyên dấu</div>
        <h2 className="cs-h1" style={{ margin: 0 }}>
          Hiện Thực Hoá Ý Chí — điều ước rõ ràng thành phần mềm chạy thật
        </h2>
        <p className="cs-body" style={{ margin: 0 }}>
          Chúng tôi là một xưởng phần mềm nhỏ ở Sài Gòn: giàu kinh nghiệm, thẳng thắn về
          những đánh đổi, và tôn trọng sự riêng tư của bạn. Nguyễn Hoàng Vũ đọc kỹ từng
          dòng chữ tiếng Việt có dấu — ưỡn, ễnh, ậm, ổn, ữa — không một dấu nào bị cắt.
        </p>
        <p className="cs-caption" style={{ margin: 0 }}>
          Ghi chú: dòng caption cũng phải giữ khoảng thở cho dấu tiếng Việt xếp tầng.
        </p>
      </div>
    </div>
  ),
};
