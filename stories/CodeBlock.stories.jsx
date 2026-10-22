import { CodeBlock } from '../components/data/CodeBlock.jsx';

export default {
  title: 'Components/Data/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
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
