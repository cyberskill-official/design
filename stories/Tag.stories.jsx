import { Tag } from '../components/feedback/Tag.jsx';

export default {
  title: 'Components/Feedback/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
  "removeLabel": {
    "control": "text"
  }
},
  args: { children: 'Thổ' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Labels',
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Tag {...args}>Thổ</Tag>
      <Tag {...args}>Hỏa</Tag>
      <Tag {...args}>Kim</Tag>
    </div>
  ),
};
