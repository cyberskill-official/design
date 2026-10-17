import { CitationList } from '../components/ai/CitationList.jsx';

export default {
  title: 'Components/AI/CitationList',
  component: CitationList,
  tags: ['autodocs'],
  argTypes: {
  "lang": { "control": "select", "options": ["vi", "en"] },
  "label": {
    "control": "object"
  },
  "items": {
    "control": "object"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting CitationList. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { items: [{ title: 'SKILL.md', href: '#' }] },
};

export const Default = {};

export const Languages = {
  render: (args) => <div style={{ display: 'grid', gap: 12 }}><CitationList {...args} lang="vi"/><CitationList {...args} lang="en"/></div>,
};

export const Matrix = {
  name: 'Matrix / Items',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <CitationList {...args} items={[{ title: 'A', href: '#' }]} />
      <CitationList {...args} items={[{ title: 'A', href: '#' }, { title: 'B', href: '#' }]} />
    </div>
  ),
};
