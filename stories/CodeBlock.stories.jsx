import { CodeBlock } from '../components/data/CodeBlock.jsx';

export default {
  title: 'Components/Data/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
  lang: { control: "select", options: [undefined, "en", "vi"] },
  "code": {
    "control": "text"
  },
  "filename": {
    "control": "text"
  },
  "language": {
    "control": "text"
  },
  "showBar": {
    "control": "boolean"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting CodeBlock. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { code: 'const wish = "ship";', language: 'js' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Snippets',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <CodeBlock {...args} code={'const a = 1;'} language="js" />
      <CodeBlock {...args} code={'npm run storybook'} language="bash" />
    </div>
  ),
};
