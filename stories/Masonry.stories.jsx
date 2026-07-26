import { Masonry } from '../components/data/Masonry.jsx';

function Tile({ h, label }) {
  return (
    <div
      style={{
        height: h,
        background: 'var(--cs-accent-tint)',
        border: '1px solid var(--cs-color-border-default)',
        borderRadius: 'var(--cs-radius-md)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 12,
        color: 'var(--cs-color-text-muted)',
      }}
    >
      {label}
    </div>
  );
}

export default {
  title: 'Components/Data/Masonry',
  component: Masonry,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'number' },
    gap: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting Masonry. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { columns: 3, gap: 12 },
};

export const Default = {
  render: (args) => (
    <Masonry {...args}>
      <Tile h={64} label="A" />
      <Tile h={110} label="B" />
      <Tile h={80} label="C" />
      <Tile h={140} label="D" />
    </Masonry>
  ),
};

export const Matrix = {
  name: 'Matrix / Columns',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Masonry {...args} columns={2}>
        <Tile h={64} label="A" />
        <Tile h={96} label="B" />
      </Masonry>
      <Masonry {...args} columns={3}>
        <Tile h={64} label="A" />
        <Tile h={110} label="B taller" />
        <Tile h={80} label="C" />
      </Masonry>
    </div>
  ),
};
