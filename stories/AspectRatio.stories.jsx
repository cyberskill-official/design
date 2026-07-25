import { AspectRatio } from '../components/data/AspectRatio.jsx';

export default {
  title: 'Components/Data/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: {
    ratio: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting AspectRatio. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { ratio: '16 / 9' },
};

export const Default = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <AspectRatio {...args}>
        <img src="../assets/aurora-gold.jpg" alt="Aurora gold" />
      </AspectRatio>
    </div>
  ),
};

export const Matrix = {
  name: 'Matrix / Ratios',
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr', maxWidth: 480 }}>
      <AspectRatio ratio="16 / 9">
        <img src="../assets/aurora-gold.jpg" alt="16:9" />
      </AspectRatio>
      <AspectRatio ratio="1">
        <img src="../assets/aurora-gold.jpg" alt="1:1" />
      </AspectRatio>
      <AspectRatio ratio="4 / 3">
        <div style={{ background: 'var(--cs-accent-tint)', display: 'grid', placeItems: 'center', color: 'var(--cs-color-text-muted)', fontSize: 13 }}>4:3 frame</div>
      </AspectRatio>
      <AspectRatio ratio="9 / 16">
        <div style={{ background: 'var(--cs-color-surface-raised)', display: 'grid', placeItems: 'center', color: 'var(--cs-color-text-muted)', fontSize: 13 }}>9:16</div>
      </AspectRatio>
    </div>
  ),
};
