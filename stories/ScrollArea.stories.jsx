import { ScrollArea } from '../components/data/ScrollArea.jsx';

export default {
  title: 'Components/Data/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    maxHeight: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting ScrollArea. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { maxHeight: 160 },
};

const LongCopy = () => (
  <div style={{ padding: 12, display: 'var(--cs-font-size-sm)', color: 'var(--cs-color-text-muted)', lineHeight: 1.55 }}>
    {[
      'Release notes arrive bilingual — EN and VN in the same digest.',
      'Blocked-project alerts ping only when a project moves to Blocked.',
      'Weekly velocity digest: tasks shipped per week, every Monday.',
      'Quiet by default — only what you ask for.',
      'Workspace preferences stay on this panel when the list grows.',
    ].map((line, i) => (
      <p key={i} style={{ margin: '0 0 10px' }}>
        {line}
      </p>
    ))}
  </div>
);

export const Default = {
  render: (args) => (
    <ScrollArea {...args} aria-label="Preferences" style={{ border: '1px solid var(--cs-color-border-default)', maxWidth: 360 }}>
      <LongCopy />
    </ScrollArea>
  ),
};

export const Matrix = {
  name: 'Matrix / Heights',
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <ScrollArea maxHeight={100} aria-label="Short scroll">
        <LongCopy />
      </ScrollArea>
      <ScrollArea maxHeight={220} aria-label="Tall scroll">
        <LongCopy />
      </ScrollArea>
    </div>
  ),
};
