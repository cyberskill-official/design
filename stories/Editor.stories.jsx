import { Editor } from '../components/forms/Editor.jsx';

export default {
  title: 'Components/Forms/Editor',
  component: Editor,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'text' },
    unsafeHtml: { control: 'text', description: 'Trusted HTML only — bypasses sanitization (CDS-SEC-001)' },
    minHeight: { control: 'number' },
    lang: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Schema-allowlisted rich text (CDS-SEC-001): defaultValue + onChange HTML sanitized to EDITOR_SCHEMA; unsafeHtml is trusted-only bypass. contentEditable remains for this wave.',
      },
    },
  },
  args: { defaultValue: '<p>A clear <b>wish</b>…</p>', minHeight: 120 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Content',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Editor {...args} defaultValue="<p>Short</p>" minHeight={80} />
      <Editor {...args} defaultValue="<p>Longer draft body for matrix.</p>" minHeight={160} />
    </div>
  ),
};
