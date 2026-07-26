import { Image } from '../components/data/Image.jsx';

export default {
  title: 'Components/Data/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    ratio: { control: 'text' },
    preview: { control: 'boolean' },
    fallback: { control: 'object' },
    width: { control: 'number' },
    height: { control: 'number' },
    lang: { control: 'select', options: ['en', 'vi'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Image. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { src: '/assets/logo-mark.svg', alt: 'CyberSkill mark', width: 64, height: 64 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Image {...args} src="/assets/logo-mark.svg" alt="mark" width={40} height={40} />
      <Image {...args} src="/assets/logo-mark.svg" alt="mark" width={80} height={80} />
    </div>
  ),
};
